import express from "express";
import { AppController } from "@controllers/app";

const router = express.Router();

router.get("/", AppController.create);

export { router as AppRouter };
