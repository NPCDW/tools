/// <reference types="vite/client" />
declare module "pdfjs-dist" {
    declare let workerSrc: any;
    declare interface Viewport {
        height: number;
        width: number;
    }
    declare class Page {
        getViewport(obj: {scale: number, rotation: number}): Viewport;
        render(renderContext: {canvasContext: CanvasRenderingContext2D, viewport: Viewport});
    }
    declare class pdfDoc {
        numPages: number;
        getPage(page: number): Promise<Page>
    }
    declare class PDFDocumentLoadingTask {
        promise: Promise<pdfDoc>
    }
    declare function getDocument(src: {data: ArrayBuffer, cMapUrl?: string, cMapPacked?: boolean}) : PDFDocumentLoadingTask;
}

declare module "pdfjs-dist/build/pdf.worker.entry" {
}

declare module "file-saver" {
    declare function saveAs(data: Blob, filename: string) : void;
}