import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PDF Upload - Gymkhana NITA',
  description: 'Upload and manage PDF documents with metadata',
};

export default function PDFUploadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
