import { createId } from "@paralleldrive/cuid2";
import { MinioClient } from "../adapters/minio";

const sharp = require("sharp");

export async function compressImg(
  image: string,
  size: number
): Promise<Buffer> {
  const parts = image.split(";");
  const imageData = parts[1].split(",")[1];

  const img = Buffer.from(imageData, "base64");
  try {
    const image = sharp(img);
    const result = await image
      .metadata()
      .then((metadata: any) => {
        if (metadata.width <= size && metadata.height <= size) return image;
        return image.resize({ width: size, fit: "cover" });
      })
      .then((data: any) => {
        return data.toFormat("webp").toBuffer();
      });
    return result;
  } catch (e) {
    console.error(e);
    throw new Error("Failed to compress image");
  }
}

export async function uploadImg(image: string, size = 320): Promise<string> {
  const filename = createId();
  const img = await compressImg(image, size);
  try {
    await MinioClient.putObject("assets", `${filename}.webp`, img);
    return `${process.env.ASSETS_URL}/${filename}.webp`;
  } catch (e) {
    console.error(e);
    throw new Error("Failed to upload image");
  }
}

export async function deleteImg(imageUrl: string) {
  const filename = imageUrl.replace(
    (process.env.ASSETS_URL as string) + "/",
    ""
  );
  try {
    await MinioClient.removeObject("assets", filename);
  } catch (e) {
    console.error(e);
    throw new Error("Failed to delete image");
  }
}
