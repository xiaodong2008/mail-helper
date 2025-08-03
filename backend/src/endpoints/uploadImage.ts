import * as fs from "fs";
import * as path from "path";

import { Request, Response } from "express";

import { randomBytes } from "crypto";
import { z } from "zod";

const uploadImageSchema = z.object({
  image: z.string(),
  name: z.string().optional(),
});

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

function generateRandomId(length: number = 16): string {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let result = "";
  const randomArray = randomBytes(length);

  for (let i = 0; i < length; i++) {
    result += chars[randomArray[i] % chars.length];
  }

  return result;
}

export async function uploadImage(req: Request, res: Response) {
  try {
    const { image, name } = uploadImageSchema.parse(req.body);

    // Validate the image format
    if (!image.startsWith("data:image/")) {
      return res.status(400).json({ error: "Invalid image format. Must be a data URL starting with 'data:image/'" });
    }

    const id = generateRandomId(16);

    // Extract the base64 data
    const matches = image.match(/^data:image\/([a-zA-Z]*);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: "Invalid image data format" });
    }

    const extension = matches[1];
    const data = matches[2];
    const fileName = name || `image-${id}.${extension}`;
    const filePath = path.join(uploadsDir, `${id}.${extension}`);

    // Write the file
    fs.writeFileSync(filePath, data, 'base64');

    // Create the URL (you may want to configure this based on your deployment)
    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
    const url = `${baseUrl}/uploads/${id}.${extension}`;

    res.json({
      url,
      id,
      filename: fileName
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Invalid request body",
        details: error.errors
      });
    }

    console.error("Image upload error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
