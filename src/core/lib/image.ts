import { createId } from "@paralleldrive/cuid2";
import { MinioClient } from "../adapters/minio";
import * as openpgp from "openpgp";

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

export async function uploadEncryptedImg(image: string, filename: string) {
  const publicKey = await openpgp.readKey({
    armoredKey: process.env.PGP_PUBLIC_KEY as string,
  });
  const encrypted = await openpgp.encrypt({
    message: await openpgp.createMessage({ text: image }),
    encryptionKeys: publicKey,
  });

  try {
    await MinioClient.putObject("vault", filename, encrypted);
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
