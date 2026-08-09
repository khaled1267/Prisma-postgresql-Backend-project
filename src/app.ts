import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import {
  authenticate,
  authorize,
  AuthenticatedRequest,
} from "./middleware/auth.middleware";
import { UserRole } from "@prisma/client";
import categoryRoutes from "./routes/catagory.routes";
import productRoutes from "./routes/product.routes";
import reviewRoutes from "./routes/review.routes";
import userRoutes from "./routes/user.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "SCIC EJP-13 Backend is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
// app.use("/api/auth", authRoutes);
// app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/users", userRoutes);

app.get(
  "/api/protected",
  authenticate,
  (req: AuthenticatedRequest, res) => {
    res.status(200).json({
      success: true,
      message: "You have access to protected route",
      data: {
        user: req.user,
      },
    });
  }
);

// Admin only route
app.get(
  "/api/admin-test",
  authenticate,
  authorize(UserRole.ADMIN),
  (req: AuthenticatedRequest, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome Admin",
      data: {
        user: req.user,
      },
    });
  }
);

export default app;