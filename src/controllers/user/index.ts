import { Request, Response } from "express";
import { validationResult } from "express-validator";

import { User } from "@database/models/user.model";
import { UserCreateRequest } from "types/request";

const UserController = {
  create: async (
    req: Request<undefined, undefined, UserCreateRequest, undefined>,
    res: Response
  ) => {
    if (!req._devapp) {
      return res.status(401).json({
        code: 4010,
        description: "Not found access token data.",
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        code: 4000,
        errors:
          "Bad Request. Username and password must be at least 8 chars long and or less 32",
      });
    }

    const { username: createUsername, password: createPassword } =
      req.body.create;

    const { application_id, username } = req._devapp.token;

    try {
      await User.create({
        application_id: application_id,
        username: createUsername,
        password: createPassword,
        permission_id: 0,
        created_id: username,
        modified_id: username,
      });
    } catch (e) {
      return res.status(409).json({
        code: 4090,
        description: `Conflict Error. User already exists`,
      });
    }

    return res.status(200).json({
      code: 2000,
      description: "Success create user",
    });
  },
};

export { UserController };
