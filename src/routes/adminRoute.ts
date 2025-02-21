import { Router } from "express";
import { AdminController } from "../controllers/adminController";
import { adminMiddleware } from "../middleware/adminMiddleware";

export const adminRouter = Router();

const adminController = new AdminController();

adminRouter.post("/admin/create", adminMiddleware, adminController.create);
