import express from "express";
import { HouseStatusController } from "@controllers/houseStatus";

const router = express.Router();

router.get("/", HouseStatusController.findAll);

export { router as HouseStatusRouter };
