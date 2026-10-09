import express from "express";
import { z } from "zod";
import argon2 from "argon2";
import { pool } from "../db.js";

const router = express.Router();

const registrationSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(10).max(72),
});

router.post("/register", async (req, res) => {
  const parsed = registrationSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: { code: "INVALID_INPUT", message: "Invalid email or password" },
    });
  }

  const email = parsed.data.email.toLowerCase();
  const passwordHash = await argon2.hash(parsed.data.password);

  try {
    const { rows } = await pool.query(
      "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, role",
      [email, passwordHash],
    );
    return res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({
        error: { code: "EMAIL_TAKEN", message: "Email already registered" },
      });
    }

    console.error(err);
    return res.status(500).json({
      error: { code: "SERVER_ERROR", message: "Something went wrong" },
    });
  }
});

export default router;
