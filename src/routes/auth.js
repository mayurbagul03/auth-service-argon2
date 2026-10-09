import express from "express";
import { z } from "zod";

const router = express.Router();

const registrationSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(10).max(72),
});

router.post("/register", (req, res) => {
  const parsed = registrationSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: { code: "INVALID_INPUT", message: "Invalid email or password" },
    });
  }

  console.log("valid input:", parsed.data.email);
  res.status(201).json({ message: "input is valid" });
});

export default router;
