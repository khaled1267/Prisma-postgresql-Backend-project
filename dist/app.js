"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const auth_middleware_1 = require("./middleware/auth.middleware");
const client_1 = require("@prisma/client");
const catagory_routes_1 = __importDefault(require("./routes/catagory.routes"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const review_routes_1 = __importDefault(require("./routes/review.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "SCIC EJP-13 Backend is running",
    });
});
app.use("/api/auth", auth_routes_1.default);
app.use("/api/categories", catagory_routes_1.default);
// app.use("/api/auth", authRoutes);
// app.use("/api/categories", categoryRoutes);
app.use("/api/products", product_routes_1.default);
app.use("/api/reviews", review_routes_1.default);
app.use("/api/users", user_routes_1.default);
app.get("/api/protected", auth_middleware_1.authenticate, (req, res) => {
    res.status(200).json({
        success: true,
        message: "You have access to protected route",
        data: {
            user: req.user,
        },
    });
});
// Admin only route
app.get("/api/admin-test", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(client_1.UserRole.ADMIN), (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome Admin",
        data: {
            user: req.user,
        },
    });
});
exports.default = app;
