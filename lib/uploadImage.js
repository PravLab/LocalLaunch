// /lib/uploadImage.js
import { upload } from "@vercel/blob/client";

export async function uploadImage(file) {
  if (!file) throw new Error("No file selected");

  try {
    const blob = await upload(file.name, file, {
      access: "public",
    });

    if (!blob.url) throw new Error("Upload failed");

    return blob.url;
  } catch (error) {
    console.error("Image upload error:", error);
    throw new Error("Image upload failed. Please try again.");
  }
}
