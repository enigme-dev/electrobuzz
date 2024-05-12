import { createHmac } from "crypto";
import * as openpgp from "openpgp";

export async function decrypt(data: string) {
  const privateKey = await openpgp.decryptKey({
    privateKey: await openpgp.readPrivateKey({
      armoredKey: process.env.PGP_PRIVATE_KEY as string,
    }),
    passphrase: process.env.PGP_PASSPHRASE,
  });

  const message = await openpgp.readMessage({
    armoredMessage: data,
  });

  const { data: decrypted } = await openpgp.decrypt({
    message,
    decryptionKeys: privateKey,
  });

  return decrypted.toString();
}

export async function encrypt(data: string) {
  const publicKey = await openpgp.readKey({
    armoredKey: process.env.PGP_PUBLIC_KEY as string,
  });

  const encrypted = await openpgp.encrypt({
    message: await openpgp.createMessage({ text: data }),
    encryptionKeys: publicKey,
  });

  return encrypted.toString();
}

export function hash(data: string) {
  const salt = process.env.NEXTAUTH_SECRET as string;
  return createHmac("sha256", salt).update(data).digest("base64");
}
