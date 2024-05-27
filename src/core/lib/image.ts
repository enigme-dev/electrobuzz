import { createId } from "@paralleldrive/cuid2";
import { MinioClient } from "../adapters/minio";
import { Stream } from "stream";
import { ErrorCode } from "@/core/lib/errors";
import { Logger } from "./logger";

interface UploadOptions {
  filename?: string;
  bucket?: string;
}

export const AllowedDataType = ["png", "webp", "jpg", "jpeg"];

export async function uploadImg(image: string, options?: UploadOptions) {
  let dataType,
    imageData,
    filename,
    imageBuff = Buffer.from(image);

  if (options?.bucket != "vault") {
    try {
      dataType = image.substring(
        "data:image/".length,
        image.indexOf(";base64")
      );
      imageData = image.replace(/^data:image\/\w+;base64,/, "");
    } catch (e) {
      throw new Error(ErrorCode.ErrImgInvalidDataURL);
    }

    imageBuff = Buffer.from(imageData, "base64");

    if (!AllowedDataType.includes(dataType)) {
      throw new Error(ErrorCode.ErrImgInvalidImageType);
    }
  }

  const bucket = options?.bucket ?? "assets";
  filename = options?.filename ?? createId();
  if (dataType) filename += "." + dataType;

  try {
    await MinioClient.putObject(bucket, filename, imageBuff);

    if (bucket === "assets") {
      return `${process.env.ASSETS_URL}/${filename}`;
    }

    return filename;
  } catch (e) {
    Logger.error("lib", "upload image error", e);
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
    Logger.error("lib", "delete image error", e);
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
        Logger.error("lib", "get image error", err);
        reject(err);
      }
      stream.on("data", (chunk) => chunks.push(chunk));
      stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    });
  });
}
