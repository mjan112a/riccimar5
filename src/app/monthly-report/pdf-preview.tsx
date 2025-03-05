"use client";

import React from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import { PDFDocument } from './pdf-document';

interface PDFPreviewProps {
  data: any;
}

export const PDFPreview: React.FC<PDFPreviewProps> = ({ data }) => {
  return (
    <PDFViewer width="100%" height="100%" className="rounded-md">
      <PDFDocument data={data} />
    </PDFViewer>
  );
};
