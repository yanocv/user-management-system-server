import express, { Request, Response } from "express";
import { DB } from "@database/index";
import { Employee } from "@database/models/employee.model";
import { EmployeeStatusDummy } from "@database/models/employeeStatusDummy.model";
import { Department } from "@database/models/department.model";
import { App } from "@database/models/app.model";
import { User } from "@database/models/user.model";
import { EmployeeStatus } from "@database/models/employeeStatus.model";
import { Company } from "@database/models/company.model";
import { Transaction } from "sequelize";
import moment from "moment";
import { HouseStatus } from "@database/models/houseStatus.model";
import { Permission } from "@database/models/permission.model";
const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const comp = await User.findOne({
    where: {
      // composite_id: '1-4ae77ddd-a9df-4a1b-a20d-9a783811b6ce',
      username: "system",
    },
    // include: [
    //   {
    //     model: App,
    //     as: 'app',
    //     required: true,
    //   },
    //   {
    //     model: Company,
    //     as: 'company',
    //     required: true,
    //   },
    //   {
    //     model: EmployeeStatus,
    //     as: 'employee_status',
    //     required: true,
    //   },
    // ],
  });

  for (const c in comp) {
    console.log(c);
  }

  console.log(JSON.parse(JSON.stringify(comp)));

  res.status(200).json({
    statusCode: 2000,
    message: "Success get employee information data.",
  });
});

export { router as TestRouter };
