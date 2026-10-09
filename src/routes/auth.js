import express from "express";

const router = express.Router();

router.post("/register", (req, res) => {
  console.log("received:", req.body);
  res.status(201).json({ message: "register route works" });
});

export default router;
