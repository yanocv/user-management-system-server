import express from "express";
import { CompanyController } from "@controllers/company";

const router = express.Router();

router.get("/", CompanyController.findAll);

export { router as CompanyRouter };
