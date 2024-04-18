import express from "express";
import { DownloadController } from "@controllers/download";

const router = express.Router();

router.get("/", DownloadController.downloadGet);
router.get("/1", DownloadController.downloadGet1);
router.get("/2", DownloadController.downloadGet2);
router.get("/3", DownloadController.downloadGet3);
router.get("/4", DownloadController.downloadGet4);

export { router as DownloadRouter };
