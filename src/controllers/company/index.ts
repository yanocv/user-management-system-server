import { Request, Response } from "express";
import { Company } from "@database/models/company.model";

const CompanyController = {
  findAll: async (req: Request, res: Response) => {
    try {
      const companies = await Company.findAll({
        where: {
          is_deleted: false,
        },
        attributes: ["id", "name", "abbreviation"],
        raw: true,
      });

      return res.status(200).json({
        code: 2000,
        description: "Success get company list data.",
        result: [...companies],
      });
    } catch (e) {
      console.error(e);
      return res.status(500).json({
        code: 5000,
        description:
          "Internal server error. Database error occurred when select companies",
      });
    }
  },
};

export { CompanyController };
