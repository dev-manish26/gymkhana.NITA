import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  timeout: 120000, // 120s timeout for large files
  chunk_size: 6000000, // 6MB chunks for better upload reliability
});

function parseContextString(ctx: string) {
  const out: Record<string, string> = {};
  ctx.split('|').forEach((pair) => {
    const [k, ...rest] = pair.split('=');
    if (!k) return;
    out[k] = decodeURIComponent(rest.join('=') || '');
  });
  return out;
}

interface CloudinaryRawUploadResult {
  public_id: string;
  secure_url?: string;
  url?: string;
  original_filename?: string;
  created_at?: string;
  bytes?: number;
  format?: string;
  context?:
    | string
    | {
        custom?: {
          document_date?: string;
          document_name?: string;
        };
      };
}

export const runtime = 'nodejs';

export const GET = async () => {
  try {
    const resources = (await cloudinary.api.resources({
      resource_type: 'raw',
      type: 'upload',
      prefix: 'server_uploads/pdf',
      max_results: 100,
      context: true, // request contextual metadata be returned
    })) as {
      resources?: Array<{
        public_id: string;
        secure_url?: string;
        url?: string;
        original_filename?: string;
        created_at?: string;
        bytes?: number;
        format?: string;
        context?:
          | string
          | { custom?: { document_date?: string; document_name?: string } };
      }>;
    };

    const parsed = (resources.resources ?? []).map(
      (r: {
        public_id: string;
        secure_url?: string;
        url?: string;
        original_filename?: string;
        created_at?: string;
        bytes?: number;
        format?: string;
        context?:
          | string
          | { custom?: { document_date?: string; document_name?: string } };
      }) => {
        let docDate: string | null = null;
        let docName: string | null = null;

        if (r.context) {
          if (typeof r.context === 'string') {
            const parts = r.context.split('|');
            parts.forEach((p: string) => {
              const [k, ...rest] = p.split('=');
              if (!k) return;
              const v = decodeURIComponent(rest.join('='));
              if (k === 'document_date') docDate = v;
              if (k === 'document_name') docName = v;
            });
          } else if (r.context.custom) {
            docDate = r.context.custom.document_date ?? null;
            docName = r.context.custom.document_name ?? null;
          }
        }

        const fallbackName =
          r.original_filename ?? r.public_id?.split('/').pop() ?? r.public_id;

        return {
          public_id: r.public_id,
          secure_url: r.secure_url ?? r.url,
          original_filename: r.original_filename ?? null,
          created_at: r.created_at ?? null,
          bytes: r.bytes ?? null,
          format: r.format ?? null,
          document_date: docDate ?? null,
          document_name: docName ?? fallbackName,
        };
      }
    );

    return NextResponse.json(parsed);
  } catch (err) {
    console.error('Cloudinary fetch error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch PDFs' },
      { status: 500 }
    );
  }
};

export const POST = async (req: Request) => {
  try {
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return NextResponse.json(
        { error: 'Cloudinary configuration missing' },
        { status: 500 }
      );
    }

    const form = await req.formData();
    const file = form.get('file') as File | null;
    const documentName = (form.get('documentName') as string) || null;
    const documentDateRaw = (form.get('documentDate') as string) || null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are allowed' },
        { status: 400 }
      );
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const documentDateIso = documentDateRaw
      ? new Date(documentDateRaw).toISOString()
      : undefined;

    const contextParts: string[] = [];
    if (documentDateIso)
      contextParts.push(`document_date=${encodeURIComponent(documentDateIso)}`);
    if (documentName)
      contextParts.push(`document_name=${encodeURIComponent(documentName)}`);
    const contextString = contextParts.length
      ? contextParts.join('|')
      : undefined;

    const uploadOptions: Record<string, unknown> = {
      resource_type: 'raw',
      folder: 'server_uploads/pdf',
      context: contextString,
      public_id: documentName
        ? `${documentName.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.pdf`
        : `pdf_${Date.now()}.pdf`,
      format: 'pdf', // Explicitly set format
    };

    const doStreamUpload = () =>
      new Promise<CloudinaryRawUploadResult>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          uploadOptions,
          (err: unknown, result: unknown) => {
            if (err) return reject(err);
            resolve(result as CloudinaryRawUploadResult);
          }
        );
        stream.end(buffer);
      });

    const uploadWithRetry = async (
      maxRetries = 3,
      baseDelay = 1000
    ): Promise<CloudinaryRawUploadResult> => {
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          console.log(`Upload attempt ${attempt}/${maxRetries}`);
          return await doStreamUpload();
        } catch (e: unknown) {
          const error = e as {
            name?: string;
            http_code?: number;
            message?: string;
          };
          const isTimeoutError =
            error?.name === 'TimeoutError' || error?.http_code === 499;

          console.error(`Upload attempt ${attempt} failed:`, {
            name: error?.name,
            http_code: error?.http_code,
            message: error?.message,
          });

          if (isTimeoutError && attempt < maxRetries) {
            // Exponential backoff: wait longer between retries
            const delay = baseDelay * Math.pow(2, attempt - 1);
            console.log(`Retrying in ${delay}ms...`);
            await new Promise((resolve) => setTimeout(resolve, delay));
            continue;
          }

          throw e;
        }
      }
      throw new Error('Upload failed after all retries');
    };

    let result: CloudinaryRawUploadResult;
    try {
      result = await uploadWithRetry();
    } catch (e: unknown) {
      const error = e as {
        name?: string;
        http_code?: number;
        message?: string;
      };
      console.error('Final upload failure after retries:', error);
      throw e;
    }

    let returnedDocumentDate: string | null = null;
    let returnedDocumentName: string | null = null;

    if (result.context) {
      if (typeof result.context === 'string') {
        const parsed = parseContextString(result.context);
        returnedDocumentDate = parsed.document_date ?? null;
        returnedDocumentName = parsed.document_name ?? null;
      } else if (
        typeof result.context === 'object' &&
        result.context !== null &&
        'custom' in result.context
      ) {
        const c = (
          result.context as {
            custom: { document_date?: string; document_name?: string };
          }
        ).custom;
        returnedDocumentDate = c.document_date ?? null;
        returnedDocumentName = c.document_name ?? null;
      }
    }

    const responsePayload = {
      public_id: result.public_id,
      secure_url: result.secure_url ?? result.url ?? '',
      original_filename: result.original_filename ?? null,
      created_at: result.created_at ?? null,
      bytes: result.bytes ?? null,
      format: result.format ?? null,
      document_date: documentDateIso ?? returnedDocumentDate ?? null,
      document_name: documentName ?? returnedDocumentName ?? null,
    };

    return NextResponse.json(responsePayload);
  } catch (err: unknown) {
    console.error('Cloudinary upload error:', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    const cloudinaryErr =
      (err as { error?: unknown; message?: unknown })?.error ||
      (err as { error?: unknown; message?: unknown })?.message ||
      message;
    let userFriendlyMessage = 'Upload failed. Please try again.';

    if (typeof cloudinaryErr === 'string') {
      if (
        cloudinaryErr.includes('timeout') ||
        cloudinaryErr.includes('TimeoutError')
      ) {
        userFriendlyMessage =
          'Upload timed out. Please try with a smaller file or check your internet connection.';
      } else if (cloudinaryErr.includes('File too large')) {
        userFriendlyMessage =
          'File is too large. Please select a file smaller than 10MB.';
      } else if (cloudinaryErr.includes('Invalid file')) {
        userFriendlyMessage =
          'Invalid file format. Please select a valid PDF file.';
      }
    }

    return NextResponse.json(
      {
        error: userFriendlyMessage,
        details: cloudinaryErr,
        isTimeout:
          typeof cloudinaryErr === 'string' &&
          (cloudinaryErr.includes('timeout') ||
            cloudinaryErr.includes('TimeoutError')),
      },
      { status: 500 }
    );
  }
};

export const DELETE = async (req: Request) => {
  try {
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return NextResponse.json(
        { error: 'Cloudinary configuration missing' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(req.url);
    const publicId = searchParams.get('public_id');

    if (!publicId) {
      return NextResponse.json(
        { error: 'public_id is required' },
        { status: 400 }
      );
    }

    const result = (await cloudinary.uploader.destroy(publicId, {
      resource_type: 'raw',
    })) as { result: string };

    if (result.result !== 'ok') {
      throw new Error(`Delete failed: ${result.result}`);
    }

    return NextResponse.json({
      success: true,
      message: 'PDF deleted successfully',
      public_id: publicId,
    });
  } catch (err: unknown) {
    console.error('Cloudinary delete error:', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Delete failed. Please try again.', details: message },
      { status: 500 }
    );
  }
};
