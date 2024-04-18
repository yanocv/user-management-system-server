import { Request, Response } from "express";
import { v4 as uuidV4 } from "uuid";
import { PERMISSION } from "@constants/Database";
import { App } from "@database/models/app.model";

const AppController = {
  create: async (req: Request, res: Response) => {
    const uuid = uuidV4();

    try {
      const app = await App.create({
        application_id: uuid,
      });

      await app.createUser({
        application_id: uuid,
        username: "system",
        password: "psystem",
        permission_id: PERMISSION.ROOT,
        created_id: "system",
        modified_id: "system",
      });

      return res.status(200).json({
        code: 2000,
        description: "Success create application ID and users.",
        applicationId: uuid,
      });
    } catch (e) {
      console.error(e);
      return res.status(500).json({
        code: 5000,
        description: "Internal server error. Database error occurred.",
      });
    }
  },
};

export { AppController };
