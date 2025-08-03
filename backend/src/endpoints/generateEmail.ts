import { Request, Response } from "express";

import OpenAI from "openai";
import config from "../config";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

const generateEmailSchema = z.object({
  to: z.string(),
  description: z.string(),
  language: z.string(),
});

const mailSchema = z.object({
  subject: z.string(),
  greeting: z.string(),
  body: z.string(),
});

const prompt = `你是一个邮件编写助手，你需要根据用户提供的发送目标、邮件内容和格式生成一封英文邮件，以JSON形式输出。

用户会提供以下信息：
发送目标to：收件人是谁（他的上司，他的客户，他的同事等）
邮件内容description：邮件内容
语言language：邮件格式（正式formal，非正式informal，中性default）

你需要生成以下内容：
邮件主题subject：摘要
邮件开头greeting：Dear Mr. Li,/ Hello,/...
邮件内容body：邮件内容`;

const client = new OpenAI({
  apiKey: config.openai.apiKey,
  baseURL: config.openai.baseURL,
});

export async function generateEmail(req: Request, res: Response) {
  try {
    const { to, description, language } = generateEmailSchema.parse(req.body);

    // Generate email using OpenAI
    const completion = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: prompt,
        },
        {
          role: "user",
          content: `to：${to}
          description：${description}
          language：${language}`,
        },
      ],
      response_format: zodResponseFormat(mailSchema, "mail"),
    });

    // Get result
    let result = completion.choices[0]?.message?.content;
    if (!result) {
      return res.status(500).json({
        success: false,
        error: "Failed to generate email content",
      });
    }

    console.log("Generated email result:", result);

    try {
      const parsedResult = JSON.parse(result.replace(/```(json)?/g, "").replaceAll("\n", ""));

      res.json({
        success: true,
        result: parsedResult,
      });
    } catch (parseError) {
      console.error("Error parsing OpenAI response:", parseError);
      res.status(500).json({
        success: false,
        error: "Failed to parse generated email content",
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Invalid request body",
        details: error.errors
      });
    }

    console.error("Email generation error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
}
