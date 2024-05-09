import { createId } from "@paralleldrive/cuid2";
import { MinioClient } from "../adapters/minio";
import { Stream } from "stream";
import { ErrorCode } from "@/core/lib/errors";

interface UploadOptions {
  filename?: string;
  bucket?: string;
}

export const AllowedDataType = [
  "png",
  "webp",
  "jpg",
  "jpeg",
];

export async function uploadImg(image: string, options?: UploadOptions) {
  const parts = image.split(";");
  const dataType = parts[0].split(":")[1].replace("image/", "");
  const imageData = parts[1].split(",")[1];
  const imageBuff = Buffer.from(imageData, "base64")

  if (parts.length !== 2) throw new Error(ErrorCode.ErrImgInvalidDataURL);

  if (!AllowedDataType.includes(dataType)) {
    throw new Error(ErrorCode.ErrImgInvalidImageType);
  }

  const bucket = options?.bucket ?? "assets";
  const filename = (options?.filename ?? createId()) + `.${dataType}`;

  try {
    await MinioClient.putObject(bucket, filename, imageBuff);

    if (bucket === "assets") {
      return `${process.env.ASSETS_URL}/${filename}`;
    }

    return filename;
  } catch (e) {
    throw new Error(ErrorCode.ErrImgFailedUpload);
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
