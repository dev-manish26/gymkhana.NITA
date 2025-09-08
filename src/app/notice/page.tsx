'use client';

import { useState, useEffect } from 'react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Calendar } from '~/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover';
import { CalendarIcon, Upload, FileText, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '~/lib/utils';
import { toast } from 'react-hot-toast';

interface RawFileItem {
  public_id: string;
  document_name?: string | null;
  secure_url: string;
  document_date?: string | null;
  original_filename?: string | null;
  created_at?: string | null;
  bytes?: number;
  format?: string;
}

interface Notice {
  public_id: string;
  name: string;
  secure_url: string;
  document_date: string; // ISO string
}

export default function PDFUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState('');
  const [documentDate, setDocumentDate] = useState<Date | undefined>(undefined);
  const [isUploading, setIsUploading] = useState(false);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const formatPdfUrl = (url: string) => {
    if (!url.includes('.pdf')) {
      const separator = url.includes('?') ? '&' : '?';
      return `${url}${separator}fl_attachment=false`;
    }
    return `${url}`;
  };

  const fetchUploadedPDFs = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/cloudinary/upload');
      if (!res.ok) {
        console.error('Failed to fetch PDFs', res.statusText);
        toast.error('Failed to load uploaded documents');
        return;
      }
      const data = (await res.json()) as RawFileItem[];
      console.log('Fetched PDFs:', data);

      const normalizedNotices: Notice[] = (data || []).map((item) => {
        const rawName =
          item.document_name ??
          item.original_filename ??
          item.public_id?.split('/').pop() ??
          item.public_id;
        const name = decodeURIComponent(rawName ?? '');
        const rawDate = item.document_date ?? item.created_at ?? '';
        const dateIso = rawDate ? decodeURIComponent(rawDate) : '';
        return {
          public_id: item.public_id,
          name,
          secure_url: item.secure_url,
          document_date: dateIso,
        };
      });

      setNotices(normalizedNotices);
    } catch (err) {
      console.error('Error fetching PDFs:', err);
      toast.error('Failed to load uploaded documents');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchUploadedPDFs();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (selectedFile.type !== 'application/pdf') {
      toast.error('Please select a valid PDF file');
      setFile(null);
      e.target.value = '';
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (selectedFile.size > maxSize) {
      toast.error('File size must be less than 10MB');
      setFile(null);
      e.target.value = '';
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !documentName || !documentDate) {
      toast.error('Please fill in all fields and select a file');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentName', documentName);
      formData.append('documentDate', documentDate.toISOString());

      const uploadRes = await fetch('/api/cloudinary/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) {
        let errorText = `Upload failed: ${uploadRes.statusText}`;
        try {
          const errData = (await uploadRes.json().catch(() => null)) as {
            error?: string;
            details?: unknown;
            isTimeout?: boolean;
          } | null;

          if (errData?.error) {
            errorText = errData.error;
          } else {
            const detail = errData?.details ?? uploadRes.statusText;
            errorText = `Upload failed: ${typeof detail === 'string' ? detail : JSON.stringify(detail)}`;
          }
        } catch {}
        throw new Error(errorText);
      }

      await fetchUploadedPDFs();

      setFile(null);
      setDocumentName('');
      setDocumentDate(undefined);

      const fileInput = document.getElementById(
        'file'
      ) as HTMLInputElement | null;
      if (fileInput) fileInput.value = '';

      toast.success('PDF uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      let errMsg = 'Failed to upload PDF';

      if (error instanceof Error) {
        if (
          error.message.includes('timeout') ||
          error.message.includes('TimeoutError')
        ) {
          errMsg =
            'Upload timed out. Please try again with a smaller file or check your internet connection.';
        } else if (error.message.includes('File size')) {
          errMsg = 'File is too large. Please select a file smaller than 10MB.';
        } else {
          errMsg = error.message;
        }
      }

      toast.error(errMsg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (publicId: string, documentName: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${documentName}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `/api/cloudinary/upload?public_id=${encodeURIComponent(publicId)}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        const errorData = (await response.json()) as { error?: string };
        throw new Error(errorData.error ?? 'Failed to delete document');
      }

      toast.success('Document deleted successfully!');

      await fetchUploadedPDFs();
    } catch (error) {
      console.error('Delete error:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to delete document';
      toast.error(errorMessage);
    }
  };

  const filteredFiles = selectedDate
    ? notices.filter((notice) => {
        if (!notice.document_date) return false;
        try {
          return (
            format(new Date(notice.document_date), 'yyyy-MM-dd') ===
            format(selectedDate, 'yyyy-MM-dd')
          );
        } catch {
          return false;
        }
      })
    : notices;

  return (
    <div className='container mx-auto max-w-4xl px-4 py-8'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='mb-2 text-3xl font-bold text-gray-900'>
          PDF Document Upload
        </h1>
        <p className='text-gray-600'>
          Upload and manage your PDF documents with metadata
        </p>
      </div>

      <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
        {/* Upload Form */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Upload className='h-5 w-5' />
              Upload New Document
            </CardTitle>
            <CardDescription>
              Upload a PDF file with document name and date
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpload} className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='documentName'>Document Name</Label>
                <Input
                  id='documentName'
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                  placeholder='Enter document name'
                  required
                />
              </div>

              <div className='space-y-2'>
                <Label>Document Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !documentDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className='mr-2 h-4 w-4' />
                      {documentDate
                        ? format(documentDate, 'PPP')
                        : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0'>
                    <Calendar
                      mode='single'
                      selected={documentDate}
                      onSelect={setDocumentDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='file'>PDF File</Label>
                <Input
                  id='file'
                  type='file'
                  accept='application/pdf'
                  onChange={handleFileChange}
                  required
                />
                {file && (
                  <div className='space-y-1'>
                    <p className='text-sm text-gray-600'>
                      Selected: {file.name} (
                      {(file.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                    {file.size > 5 * 1024 * 1024 && (
                      <p className='text-xs text-amber-600'>
                        ⚠️ Large file detected. Upload may take longer.
                      </p>
                    )}
                  </div>
                )}
              </div>

              <Button
                type='submit'
                className='w-full'
                disabled={
                  isUploading || !file || !documentName || !documentDate
                }
              >
                {isUploading ? (
                  <span className='flex items-center gap-2'>
                    <span className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent'></span>
                    Uploading...
                  </span>
                ) : (
                  'Upload PDF'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Filter and Stats */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <FileText className='h-5 w-5' />
              Document Management
            </CardTitle>
            <CardDescription>
              Filter and manage your uploaded documents
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label>Filter by Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !selectedDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {selectedDate ? format(selectedDate, 'PPP') : 'All dates'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0'>
                  <Calendar
                    mode='single'
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className='rounded-lg bg-gray-50 p-4 text-center'>
              <div className='text-2xl font-bold text-blue-600'>
                {filteredFiles.length}
              </div>
              <div className='text-sm text-gray-600'>
                {selectedDate
                  ? 'Documents on selected date'
                  : 'Total documents'}
              </div>
            </div>

            {selectedDate && (
              <Button
                variant='outline'
                onClick={() => setSelectedDate(undefined)}
                className='w-full'
              >
                Clear Filter
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Uploaded Files List */}
      <Card className='mt-8'>
        <CardHeader>
          <CardTitle>Uploaded Documents</CardTitle>
          <CardDescription>
            {isLoading
              ? 'Loading documents...'
              : filteredFiles.length === 0
                ? 'No documents found'
                : `${filteredFiles.length} document(s) found`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className='flex items-center justify-center py-8'>
              <div className='text-gray-500'>Loading documents...</div>
            </div>
          ) : filteredFiles.length > 0 ? (
            <div className='space-y-3'>
              {filteredFiles.map((notice) => (
                <div
                  key={notice.public_id}
                  className='flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-50'
                >
                  <div className='flex-1'>
                    <h3 className='font-medium text-gray-900'>{notice.name}</h3>
                    <div className='mt-1 flex items-center gap-4 text-sm text-gray-600'>
                      {notice.document_date && (
                        <span>
                          Date:{' '}
                          {(() => {
                            const d = new Date(notice.document_date);
                            return isNaN(d.getTime())
                              ? '__/__/____'
                              : format(d, 'PPP');
                          })()}
                        </span>
                      )}
                      <span>
                        Document ID: {notice.public_id.split('/').pop()}
                      </span>
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => {
                        // Use helper function to format PDF URL properly
                        const pdfUrl = formatPdfUrl(notice.secure_url);
                        window.open(pdfUrl, '_blank');
                      }}
                    >
                      <FileText className='mr-2 h-4 w-4' />
                      View
                    </Button>
                    <Button
                      variant='destructive'
                      size='sm'
                      onClick={() =>
                        handleDelete(notice.public_id, notice.name)
                      }
                    >
                      <Trash2 className='mr-2 h-4 w-4' />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='flex items-center justify-center py-8'>
              <div className='text-gray-500'>No documents found</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
