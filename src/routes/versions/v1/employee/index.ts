import express from "express";
import { EmployeeController } from "@controllers/employee";

const router = express.Router();

router.get("/", EmployeeController.findAll);
router.get("/:id", EmployeeController.findOne);
router.post("/", EmployeeController.create);
router.put("/:id", EmployeeController.update);
router.delete("/:id", EmployeeController.delete);

export { router as EmployeeRouter };
