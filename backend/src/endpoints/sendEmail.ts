import { Request, Response } from "express";

import { sendEmail as sendEmailService } from "../emailService";
import { z } from "zod";

const sendEmailSchema = z.object({
  name: z.string().optional(),
  subject: z.string(),
  title: z.string(),
  content: z.string(),
  closing: z.string().optional(),
  to: z.string(),
});

export async function sendEmail(req: Request, res: Response) {
  try {
    const { name, subject, title, content, closing, to } = sendEmailSchema.parse(req.body);

    // Validate required fields
    if ([subject, title, content, to].some((x) => !x)) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: subject, title, content, and to are required",
      });
    }

    try {
      await sendEmailService(name || "Wan Chak Li", subject, title, content, closing || "", to);

      res.json({
        success: true,
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      res.status(500).json({
        success: false,
        error: emailError instanceof Error ? emailError.message : "Failed to send email",
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Invalid request body",
        details: error.errors
      });
    }

    console.error("Send email endpoint error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
}
