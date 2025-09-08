'use client';
import React, { useState } from 'react';

interface CloudinarySignResponse {
  signature: string;
  timestamp: number;
  apiKey: string;
}

interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  bytes: number;
  format: string;
  pages?: number;
}

export default function UploadPDF() {
  const [loading, setLoading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);

    try {
      const sigRes = await fetch('/api/cloudinary/sign');
      const { signature, timestamp, apiKey }: CloudinarySignResponse =
        (await sigRes.json()) as CloudinarySignResponse;

      const fd = new FormData();
      fd.append('file', file);
      fd.append('api_key', apiKey);
      fd.append('timestamp', String(timestamp));
      fd.append('signature', signature);
      fd.append('resource_type', 'raw'); 

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      if (!cloudName) {
        throw new Error('Cloudinary cloud name is not configured');
      }

      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`;

      const uploadRes = await fetch(uploadUrl, { method: 'POST', body: fd });
      const result: CloudinaryUploadResult =
        (await uploadRes.json()) as CloudinaryUploadResult;
      setLoading(false);
      console.log('uploaded', result);
    } catch (error) {
      setLoading(false);
      console.error('Upload failed:', error);
    }
  }

  return (
    <div>
      <input type='file' accept='application/pdf' onChange={handleFile} />
      {loading && <p>Uploading…</p>}
    </div>
  );
}
