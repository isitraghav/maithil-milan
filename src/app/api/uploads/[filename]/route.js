import fs from "fs";
import path from "path";

export async function GET(req, { params }) {
  const { filename } = await params;
  console.log("file requested");

  // Path to the uploads directory
  const uploadsDir = path.join(process.cwd(), "uploads");
  const filePath = path.join(uploadsDir, filename);

  try {
    // Check if file exists
    const fileContent = fs.readFileSync(filePath);

    return new Response(fileContent, {
      headers: {
        "Content-Type": "image/webp",
      },
    });
  } catch (error) {
    return new Response("File not found", { status: 404 });
  }
}
