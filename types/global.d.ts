declare module "pdfjs-dist/build/pdf.worker.entry";
declare module "pdfjs-dist/webpack";
declare module "pdfjs-dist/build/pdf.worker.min.mjs";
declare module "*.mjs?url" {
  const src: string;
  export default src;
}
declare module "react-pdf";
