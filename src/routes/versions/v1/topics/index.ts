import express from "express";
import { TopicController } from "@controllers/topic";

const router = express.Router();

router.get("/", TopicController.findAll);

export { router as TopicRouter };
