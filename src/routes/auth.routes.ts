import { Router, Request, Response } from "express";
import {
  loginUser,
  registerUser,
  UserAlreadyExistsError,
} from "../services/auth.service";

const router = Router();

// Register
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body ?? {};

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !name.trim() ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    const user = await registerUser({
      name: name.trim(),
      email: email.trim(),
      password,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return res.status(409).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Registration failed:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to register user. Please try again later.",
    });
  }
});

// Login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const result = await loginUser({
      email,
      password,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";

    return res.status(401).json({
      success: false,
      message,
    });
  }
});

export default router;