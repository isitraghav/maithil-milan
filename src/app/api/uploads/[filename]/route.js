import fs from "fs";
import path from "path";

export async function GET(req, { params }) {
  const { filename } = await params;
  console.log("File requested:", filename);

  // Path to the uploads directory
  const uploadsDir = path.join(process.cwd(), "uploads");
  const filePath = path.join(uploadsDir, filename);

  try {
    // Check if file exists
    await fs.promises.access(filePath);

    // Create a readable stream to serve the file
    const fileStream = fs.createReadStream(filePath);

    return new Response(fileStream, {
      headers: {
        "Content-Type": "image/webp",
      },
    });
  } catch (error) {
    console.error("Error serving file:", error);
    return new Response("File not found", { status: 404 });
  }
}
