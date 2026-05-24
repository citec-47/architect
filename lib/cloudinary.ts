import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export type UploadResult = {
  url: string;
  public_id: string;
  resource_type: "image" | "video";
};

/**
 * Upload a file (Buffer) to Cloudinary under the architect-portfolio folder.
 * Picks the right resource_type based on the mimetype.
 */
export async function uploadBuffer(
  buffer: Buffer,
  filename: string,
  mimetype: string
): Promise<UploadResult> {
  const isVideo = mimetype.startsWith("video/");
  const folder = isVideo ? "architect-portfolio/videos" : "architect-portfolio/images";

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: isVideo ? "video" : "image",
        public_id: filename.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "-"),
        use_filename: true,
        unique_filename: true,
        overwrite: false,
      },
      (error, result) => {
        if (error || !result) return reject(error ?? new Error("Cloudinary upload failed"));
        resolve({
          url: result.secure_url,
          public_id: result.public_id,
          resource_type: isVideo ? "video" : "image",
        });
      }
    );
    stream.end(buffer);
  });
}

export async function deleteAsset(publicId: string, resourceType: "image" | "video" = "image") {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (err) {
    console.error(`Failed to delete Cloudinary asset ${publicId}:`, err);
  }
}

export { cloudinary };
