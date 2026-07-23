export type ImageFormat = "image/png" | "image/jpeg" | "image/webp";

export interface ConvertedImage {
  blob: Blob;
  width: number;
  height: number;
}

/** Decodes an image and re-encodes it in a different format, entirely via the Canvas API — no dependencies. */
export async function convertImage(
  file: File,
  format: ImageFormat,
  quality = 0.92
): Promise<ConvertedImage> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    throw new Error("Couldn't get a 2D canvas context.");
  }
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(
            new Error("Couldn't encode the image — this browser may not support that format.")
          );
          return;
        }
        resolve({ blob, width: canvas.width, height: canvas.height });
      },
      format,
      format === "image/png" ? undefined : quality
    );
  });
}
