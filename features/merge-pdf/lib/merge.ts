import { PDFDocument } from "pdf-lib";

/** Merges PDF files in the given order into a single PDF. Runs entirely in the browser. */
export async function mergePdfFiles(files: File[]): Promise<Blob> {
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const sourcePdf = await PDFDocument.load(bytes);
    const pages = await mergedPdf.copyPages(sourcePdf, sourcePdf.getPageIndices());
    pages.forEach((page) => mergedPdf.addPage(page));
  }

  const merged = await mergedPdf.save();
  const buffer = new ArrayBuffer(merged.byteLength);
  new Uint8Array(buffer).set(merged);
  return new Blob([buffer], { type: "application/pdf" });
}
