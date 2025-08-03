import express, { Express } from "express";

import cors from "cors";
import { generateEmail } from "./endpoints/generateEmail";
import path from "path";
import { sendEmail } from "./endpoints/sendEmail";
import { uploadImage } from "./endpoints/uploadImage";
import { validatePassword } from "./endpoints/validatePassword";

const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Routes
app.post("/validatePassword", validatePassword);
app.post("/generateEmail", generateEmail);
app.post("/sendEmail", sendEmail);
app.post("/uploadImage", uploadImage);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Mail Helper backend server running on port ${PORT}`);
});

export default app;

