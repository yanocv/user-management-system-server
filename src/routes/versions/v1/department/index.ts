import express from "express";
import { DepartmentController } from "@controllers/department";

const router = express.Router();

router.get("/", DepartmentController.findAll);

export { router as DepartmentRouter };
