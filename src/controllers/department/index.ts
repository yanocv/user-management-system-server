import { Request, Response } from "express";
import { Department } from "@database/models/department.model";

const DepartmentController = {
  findAll: async (req: Request, res: Response) => {
    try {
      const departmentList = await Department.findAll({
        where: {
          is_deleted: false,
        },
        attributes: ["id", "name"],
        raw: true,
      });

      return res.status(200).json({
        code: 2000,
        description: "Success get department list data.",
        result: [...departmentList],
      });
    } catch (e) {
      console.error(e);
      return res.status(500).json({
        code: 5000,
        description:
          "Internal server error. Database error occurred when select department.",
      });
    }
  },
};

export { DepartmentController };
