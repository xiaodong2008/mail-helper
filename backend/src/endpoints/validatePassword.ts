import { Request, Response } from "express";

import config from "../config";
import { z } from "zod";

const validatePasswordSchema = z.object({
  password: z.string(),
});

export async function validatePassword(req: Request, res: Response) {
  try {
    const { password } = validatePasswordSchema.parse(req.body);

    // Validate the password
    const PASSWORD = config.password;
    const valid = password === PASSWORD;

    res.json({ valid });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Invalid request body",
        details: error.errors
      });
    }

    console.error("Password validation error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
