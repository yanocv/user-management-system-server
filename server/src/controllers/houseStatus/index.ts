import { Request, Response } from "express";
import { HouseStatus } from "@database/models/houseStatus.model";

const HouseStatusController = {
  findAll: async (req: Request, res: Response) => {
    try {
      const houseStatusList = await HouseStatus.findAll({
        where: {
          is_deleted: false,
        },
        attributes: ["id", "label"],
        raw: true,
      });

      return res.status(200).json({
        code: 2000,
        description: "Success get house status list data.",
        result: [...houseStatusList],
      });
    } catch (e) {
      console.error(e);
      return res.status(500).json({
        code: 5000,
        description:
          "Internal server error. Database error occurred when select house status.",
      });
    }
  },
};

export { HouseStatusController };
