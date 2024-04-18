import express from "express";
import { UserController } from "@controllers/user";
import { checkSchema, Schema } from "express-validator";

const createSchema: Schema = {
  "create.username": {
    in: ["body"],
    isLength: {
      options: { min: 8, max: 32 },
    },
  },
  "create.password": {
    in: ["body"],
    isLength: {
      options: { min: 8, max: 32 },
    },
  },
};

const router = express.Router();

router.post(
  "/",

  checkSchema(createSchema),
  UserController.create
);

export { router as UserRouter };
