import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserRole } from "@prisma/client";
import prisma from "../lib/prisma";

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: UserRole;
  };
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Authorization header is required",
    });
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.substring(7)
    : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Invalid authorization format",
    });
  }

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    return res.status(500).json({
      success: false,
      message: "JWT_SECRET is not configured",
    });
  }

  let decoded: {
    userId: string;
    email: string;
  };

  try {
    decoded = jwt.verify(token, jwtSecret) as {
      userId: string;
      email: string;
      role: UserRole;
    };
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        id: decoded.userId,
        isDeleted: false,
      },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User account is unavailable",
      });
    }

    req.user = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };
    return next();
  } catch (error) {
    return next(error);
  }
};

export const authorize = (...allowedRoles: UserRole[]) => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to access this resource",
      });
    }

    next();
  };
};