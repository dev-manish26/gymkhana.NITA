'use client';

import { useState } from 'react';
// Firebase imports removed - file upload functionality disabled
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
import { CalendarIcon, Upload, FileText, Download } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '~/lib/utils';
import { toast } from 'react-hot-toast';

interface UploadedFile {
  id: string;
  name: string;
  date: Date;
  url: string;
  fileName: string;
  uploadDate: Date;
}

export default function PDFUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState('');
  const [documentDate, setDocumentDate] = useState<Date | undefined>(undefined);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      toast.error('Please select a valid PDF file');
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file || !documentName || !documentDate) {
      toast.error('Please fill in all fields and select a file');
      return;
    }

    setIsUploading(true);

    try {
      // Create a unique timestamp for the file
      const timestamp = Date.now();

      // Create a local file URL for preview (since Firebase is removed)
      const localUrl = URL.createObjectURL(file);

      // Create the uploaded file object
      const uploadedFile: UploadedFile = {
        id: timestamp.toString(),
        name: documentName,
        date: documentDate,
        url: localUrl,
        fileName: file.name,
        uploadDate: new Date(),
      };

      // Add to the list
      setUploadedFiles((prev) => [uploadedFile, ...prev]);

      // Reset form
      setFile(null);
      setDocumentName('');
      setDocumentDate(undefined);

      toast.success(
        'PDF added to local list! (Note: File upload functionality has been disabled)'
      );
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to process PDF');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = (url: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredFiles = selectedDate
    ? uploadedFiles.filter(
        (file) =>
          format(file.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
      )
    : uploadedFiles;

  return (
    <div className='container mx-auto max-w-4xl px-4 py-8'>
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setDocumentName(e.target.value)
                  }
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
                  <p className='text-sm text-gray-600'>
                    Selected: {file.name} (
                    {(file.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>

              <Button
                type='submit'
                className='w-full'
                disabled={
                  isUploading || !file || !documentName || !documentDate
                }
              >
                {isUploading ? 'Uploading...' : 'Upload PDF'}
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
            {filteredFiles.length === 0
              ? 'No documents uploaded yet'
              : `${filteredFiles.length} document(s) found`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredFiles.length > 0 && (
            <div className='space-y-3'>
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  className='flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-50'
                >
                  <div className='flex-1'>
                    <h3 className='font-medium text-gray-900'>{file.name}</h3>
                    <div className='mt-1 flex items-center gap-4 text-sm text-gray-600'>
                      <span>Date: {format(file.date, 'PPP')}</span>
                      <span>File: {file.fileName}</span>
                      <span>Uploaded: {format(file.uploadDate, 'PPP')}</span>
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handleDownload(file.url, file.fileName)}
                    >
                      <Download className='mr-2 h-4 w-4' />
                      Download
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => window.open(file.url, '_blank')}
                    >
                      <FileText className='mr-2 h-4 w-4' />
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
