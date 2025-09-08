'use client';

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

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

const NoticeBoard = () => {
  const [uploadedFiles, setUploadedFiles] = useState<Notice[]>([]);
  console.log('uploadedFiles', uploadedFiles);

  const formatPdfUrl = (url: string) => {
    if (!url.includes('.pdf')) {
      const separator = url.includes('?') ? '&' : '?';
      return `${url}${separator}fl_attachment=false`;
    }
    return `${url}`;
  };

  useEffect(() => {
    const fetchPDFs = async () => {
      try {
        const res = await fetch('/api/cloudinary/upload');
        if (!res.ok) {
          console.error('Failed to fetch PDFs', res.statusText);
          return;
        }
        const data = (await res.json()) as RawFileItem[];
        console.log('Fetched PDFs:', data);

        // Normalize items to the shape used by the UI
        const normalized: Notice[] = (data || []).map((item) => {
          const rawName =
            item.document_name ??
            item.original_filename ??
            item.public_id?.split('/').pop() ??
            item.public_id;
          const name = decodeURIComponent(rawName ?? '');
          // prefer explicit document_date, fallback to created_at
          const rawDate = item.document_date ?? item.created_at ?? '';
          const dateIso = rawDate ? decodeURIComponent(rawDate) : '';
          return {
            public_id: item.public_id,
            name,
            secure_url: item.secure_url,
            document_date: dateIso,
          };
        });

        setUploadedFiles(normalized);
      } catch (err) {
        console.error('Error fetching PDFs:', err);
      }
    };

    void fetchPDFs();
  }, []);

  return (
    <div className='mx-auto w-full max-w-7xl px-4 py-2 '>
      {/* Header */}
      <div className='mb-6'>
        <h1 className='text-xl font-bold text-gray-800 sm:text-2xl lg:text-3xl'>
          NOTICE BOARD
        </h1>
      </div>

      <div className=' max-h-[45vh] overflow-y-scroll rounded-lg'>
        {uploadedFiles.length > 0 ? (
          <div className='rounded-lg border border-gray-400 bg-primary shadow-sm'>
            <div className='border-b border-gray-200 bg-primary px-3 py-2 sm:px-4 sm:py-3 lg:px-6'>
              <div className='grid grid-cols-12 gap-4'>
                <div className='col-span-6 text-sm font-medium uppercase tracking-wider text-gray-800'>
                  Notice Name
                </div>
                <div className='col-span-3 text-sm font-medium uppercase tracking-wider text-gray-800'>
                  Date
                </div>
                <div className='col-span-3 text-sm font-medium uppercase tracking-wider text-gray-800'>
                  PDF
                </div>
              </div>
            </div>

            <div className='rounded-lg'>
              {uploadedFiles.map((notice) => (
                <div
                  key={notice.public_id}
                  className='border-b border-gray-200 transition-colors duration-200 hover:bg-blue-600'
                >
                  <div className='grid grid-cols-12 gap-4 px-3 py-2 sm:px-4 sm:py-3 lg:px-6'>
                    <div className='col-span-6 text-xs font-medium text-white sm:text-sm'>
                      {notice.name}
                    </div>
                    <div className='col-span-3 text-xs text-white sm:text-sm'>
                      {(() => {
                        const d = new Date(notice.document_date);
                        return isNaN(d.getTime())
                          ? '__/__/____'
                          : format(d, 'dd/MM/yyyy');
                      })()}
                    </div>
                    <div className='col-span-3 text-xs text-white sm:text-sm'>
                      <a
                        href={formatPdfUrl(notice.secure_url)}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-white underline transition-colors duration-200 hover:text-blue-300'
                      >
                        View PDF
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className='rounded-lg bg-primary p-4 text-center text-white sm:p-6 lg:p-8'>
            <div className='text-left'>
              <p className='mb-4 text-lg font-semibold uppercase text-gray-800 sm:text-xl lg:text-2xl'>
                NO NOTICES AVAILABLE
              </p>
              <div className='mb-4 h-px w-full text-white opacity-60'></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoticeBoard;
