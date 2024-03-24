export function removeImagePrefix(imageUrl: string) {
  const assetsUrl = process.env.ASSETS_URL as string;
  if (imageUrl.startsWith(assetsUrl)) {
    return imageUrl.replace(assetsUrl + "/", "");
  }

  return imageUrl;
}
