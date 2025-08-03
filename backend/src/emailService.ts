import Core from "@alicloud/pop-core";
import config from "./config";
import fetch from "node-fetch";
import generateTemplate from "./template/default";

var aliMailService = new Core({
  accessKeyId: config.aliyun.accessKeyId,
  accessKeySecret: config.aliyun.accessKeySecret,
  // securityToken: process.env['ALIBABA_CLOUD_SECURITY_TOKEN'], // use STS Token
  endpoint: "https://dm.aliyuncs.com",
  apiVersion: "2015-11-23",
});

export async function sendEmail(name: string, subject: string, title: string, content: string, closing: string, to: string): Promise<boolean> {
  const defaultClosing = `Best regards,
  Wan Chak Li,
  admin@xiaodong.moe`;

  const finalClosing = (closing || defaultClosing).replace(/\n/g, "<br>");
  const finalContent = content.replace(/\n/g, "<br>");

  const recipients = to.split(",").map((item) => item.trim());
  if (typeof config.ccMailTo === "string" && !recipients.includes(config.ccMailTo)) {
    recipients.push(config.ccMailTo);
  }
  if (Array.isArray(config.ccMailTo)) {
    for (const cc of config.ccMailTo) {
      if (!recipients.includes(cc)) {
        recipients.push(cc);
      }
    }
  }

  const body = {
    name: name || "Wan Chak Li",
    subject: subject,
    content: generateTemplate(title, finalContent, finalClosing, to, "admin@xiaodong.moe"),
    to: recipients.join(","),
    type: "html",
  };

  const result = await fetch(
    "https://send-sigle-mail-dhslolwdvq.cn-hangzhou.fcapp.run/send",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  console.log("Email service response:", result.status);

  if (result.status !== 200) {
    const error = (await result.json()) as { msg: string };
    throw new Error(error.msg || `${result.status} ${result.statusText}`);
  }

  return true;
}
