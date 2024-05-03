import { createId } from "@paralleldrive/cuid2";
import { MinioClient } from "../adapters/minio";
import sharp from "sharp";
import { Stream } from "stream";

interface UploadOptions {
  filename?: string;
  bucket?: string;
}

export async function compressImg(image: string, size = 320): Promise<Buffer> {
  const parts = image.split(";");
  const imageData = parts[1].split(",")[1];

  const img = Buffer.from(imageData, "base64");
  try {
    const image = sharp(img);
    const result = await image
      .resize(size, size, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp()
      .toBuffer();
    return result;
  } catch (e) {
    console.error(e);
    throw new Error("Failed to compress image");
  }
}

export async function uploadImg(image: Buffer, options?: UploadOptions) {
  const bucket = options?.bucket ?? "assets";
  const filename = options?.filename ?? createId() + ".webp";

  try {
    await MinioClient.putObject(bucket, filename, image);

    if (bucket === "assets") {
      return `${process.env.ASSETS_URL}/${filename}.webp`;
    }

    return filename;
  } catch (e) {
    console.error(e);
    throw new Error("Failed to upload image");
  }
}

export async function deleteImg(imageUrl: string, bucket = "assets") {
  let filename;
  if (bucket === "assets") {
    filename = imageUrl.replace((process.env.ASSETS_URL as string) + "/", "");
  }

  try {
    await MinioClient.removeObject(bucket, filename);
  } catch (e) {
    console.error(e);
    throw new Error("Failed to delete image");
  }
}

export async function getImg(
  imageUrl: string,
  bucket = "assets"
): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    MinioClient.getObject(bucket, imageUrl, (err: Error, stream: Stream) => {
      if (err) {
        reject(err);
      }
      stream.on("data", (chunk) => chunks.push(chunk));
      stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    });
  });
}
