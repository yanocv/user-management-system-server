import express, { Request, Response } from "express";

import { AnalysisController } from "@controllers/analysis";

const router = express.Router();

router.get("/employees", AnalysisController.employeesAll);

router.get("/employees/:companyId", AnalysisController.companyEmployees);

router.get("/comparison", AnalysisController.departmentsComparison);

router.get("/departments", AnalysisController.departmentsRatio);

export { router as AnalysisRouter };
