import { Request, Response } from "express";
import { Op } from "sequelize";
import moment from "moment";
import { Company } from "@database/models/company.model";
import { Department } from "@database/models/department.model";
import { EmployeeDummy } from "@database/models/employeeDummy.model";
import { EmployeeStatusDummy } from "@database/models/employeeStatusDummy.model";

import {
  COMMISSIONING_STATUS,
  DEPARTMENT,
  HOUSE_STATUS,
} from "@constants/Database";

const getDepartmentStatus = async (
  number: number
): Promise<{
  total: number;
  commit: number;
  notCommit: number;
}> => {
  try {
    const employeeStatusDummys = await EmployeeStatusDummy.findAll({
      where: {
        is_deleted: false,
        house_status_id: {
          [Op.or]: [HOUSE_STATUS.JOIN, HOUSE_STATUS.REST],
        },
        department_id: number,
      },
      nest: true,
      raw: true,
    });

    const commitDevEmployees = employeeStatusDummys.filter(
      (d) => d.commissioning_status_id === COMMISSIONING_STATUS.COMMIT
    );
    const notCommitDevEmployees = employeeStatusDummys.filter(
      (d) => d.commissioning_status_id === COMMISSIONING_STATUS.NOT_COMMIT
    );

    return {
      total: employeeStatusDummys.length,
      commit: commitDevEmployees.length,
      notCommit: notCommitDevEmployees.length,
    };
  } catch (e) {
    throw e;
  }
};

const AnalysisController = {
  employeesAll: async (req: Request, res: Response) => {
    try {
      const [total, newJoin, retire] = await Promise.all([
        EmployeeDummy.count({
          include: [
            {
              model: EmployeeStatusDummy,
              required: true,
              as: "employee_status_dummy",
              where: {
                house_status_id: {
                  [Op.or]: [HOUSE_STATUS.JOIN, HOUSE_STATUS.REST],
                },
              },
            },
          ],
        }),
        EmployeeDummy.count({
          where: {
            enter_date_milliseconds: {
              [Op.between]: [
                moment("2021-12-01", "YYYY-MM-DD").valueOf(),
                moment("2021-12-31", "YYYY-MM-DD").valueOf(),
              ],
            },
          },
        }),
        EmployeeDummy.count({
          where: {
            retire_date_milliseconds: {
              [Op.between]: [
                moment("2021-12-01", "YYYY-MM-DD").valueOf(),
                moment("2021-12-31", "YYYY-MM-DD").valueOf(),
              ],
            },
          },
        }),
      ]);

      const eachLastDayOfMonth = [
        "2021-01-31",
        "2021-02-28",
        "2021-03-31",
        "2021-04-30",
        "2021-05-31",
        "2021-06-30",
        "2021-07-31",
        "2021-08-31",
        "2021-09-30",
        "2021-10-31",
        "2021-11-30",
        "2021-12-31",
      ];

      const [
        January,
        February,
        March,
        April,
        May,
        June,
        July,
        August,
        September,
        October,
        November,
        December,
      ] = await Promise.all(
        eachLastDayOfMonth.map((day) => {
          return EmployeeDummy.count({
            where: {
              enter_date_milliseconds: {
                [Op.lte]: moment(day, "YYYY-MM-DD").valueOf(),
              },
              [Op.or]: [
                {
                  retire_date_milliseconds: {
                    [Op.gt]: moment(day, "YYYY-MM-DD").valueOf(),
                  },
                },
                { retire_date: null },
              ],
            },
            include: [
              {
                model: EmployeeStatusDummy,
                as: "employee_status_dummy",
                required: true,
                where: {
                  house_status_id: {
                    [Op.or]: [HOUSE_STATUS.JOIN, HOUSE_STATUS.REST],
                  },
                },
              },
            ],
          });
        })
      );

      return res.status(200).json({
        code: 2000,
        description: "Success get analysis all companies employee data.",
        result: {
          fluctuation: {
            January,
            February,
            March,
            April,
            May,
            June,
            July,
            August,
            September,
            October,
            November,
            December,
          },
          total,
          newJoin,
          retire,
        },
      });
    } catch (e) {
      console.error(e);
      return res.status(500).json({
        code: 5000,
        description: "Internal server error. Database error occurred.",
      });
    }
  },

  companyEmployees: async (req: Request, res: Response) => {
    const { companyId } = req.params;

    if (!companyId) {
      return res.status(400).json({
        code: 4000,
        description: "Bad request. Undefined companyId.",
      });
    }

    try {
      const company = await Company.findOne({
        where: {
          id: companyId,
        },
      });
      if (!company) {
        return res.status(404).json({
          code: 4040,
          description: `Not found company. id: ${companyId}`,
        });
      }
    } catch (e) {
      console.error(e);
      return res.status(500).json({
        code: 5000,
        description:
          "Internal server error. Database error occurred when select Company",
      });
    }

    const eachLastDayOfMonth = [
      "2021-01-31",
      "2021-02-28",
      "2021-03-31",
      "2021-04-30",
      "2021-05-31",
      "2021-06-30",
      "2021-07-31",
      "2021-08-31",
      "2021-09-30",
      "2021-10-31",
      "2021-11-30",
      "2021-12-31",
    ];

    try {
      const [
        January,
        February,
        March,
        April,
        May,
        June,
        July,
        August,
        September,
        October,
        November,
        December,
      ] = await Promise.all(
        eachLastDayOfMonth.map((day) => {
          return EmployeeDummy.count({
            where: {
              company_id: companyId,
              enter_date_milliseconds: {
                [Op.lte]: moment(day, "YYYY-MM-DD").valueOf(),
              },
              [Op.or]: [
                {
                  retire_date_milliseconds: {
                    [Op.gt]: moment(day, "YYYY-MM-DD").valueOf(),
                  },
                },
                { retire_date: null },
              ],
            },
            include: [
              {
                model: EmployeeStatusDummy,
                as: "employee_status_dummy",
                required: true,
                where: {
                  house_status_id: {
                    [Op.or]: [HOUSE_STATUS.JOIN, HOUSE_STATUS.REST],
                  },
                },
              },
            ],
          });
        })
      );

      const total = await EmployeeDummy.count({
        where: {
          company_id: companyId,
        },
        include: [
          {
            model: EmployeeStatusDummy,
            required: true,
            as: "employee_status_dummy",
            where: {
              house_status_id: {
                [Op.or]: [HOUSE_STATUS.JOIN, HOUSE_STATUS.REST],
              },
            },
          },
        ],
      });

      const enterEmployeesOfLastMonth = await EmployeeDummy.count({
        where: {
          company_id: companyId,
          enter_date_milliseconds: {
            [Op.between]: [
              moment("2021-12-01", "YYYY-MM-DD").valueOf(),
              moment("2021-12-31", "YYYY-MM-DD").valueOf(),
            ],
          },
          is_deleted: false,
        },
      });

      const retireEmployeesOfLastMonth = await EmployeeDummy.count({
        where: {
          company_id: companyId,
          retire_date_milliseconds: {
            [Op.between]: [
              moment("2021-12-01", "YYYY-MM-DD").valueOf(),
              moment("2021-12-31", "YYYY-MM-DD").valueOf(),
            ],
          },
          is_deleted: false,
        },
      });

      return res.status(200).json({
        code: 2000,
        description: "Success get company's employee data.",
        result: {
          fluctuation: {
            January,
            February,
            March,
            April,
            May,
            June,
            July,
            August,
            September,
            October,
            November,
            December,
          },
          total,
          newJoin: enterEmployeesOfLastMonth,
          retire: retireEmployeesOfLastMonth,
        },
      });
    } catch (e) {
      console.error(e);
      return res.status(500).json({
        code: 5000,
        description: "Internal server error. Database error occurred.",
      });
    }
  },

  departmentsComparison: async (req: Request, res: Response) => {
    try {
      const dev = await getDepartmentStatus(DEPARTMENT.DEV);
      const nw = await getDepartmentStatus(DEPARTMENT.NW);
      const verify = await getDepartmentStatus(DEPARTMENT.VERIFY);

      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(1);
        }, 2000);
      });

      return res.status(200).json({
        code: 2000,
        description: "Success get employee information data.",
        departments: {
          dev,
          nw,
          verify,
        },
      });
    } catch (e) {
      console.error(e);
      return res.status(500).json({
        code: 5000,
        description: "Internal server error. Database error occurred.",
      });
    }
  },

  departmentsRatio: async (req: Request, res: Response) => {
    try {
      const [dev, nw, verify, office, manage] = await Promise.all(
        [
          DEPARTMENT.DEV,
          DEPARTMENT.NW,
          DEPARTMENT.VERIFY,
          DEPARTMENT.OFFICE,
          DEPARTMENT.MANAGE,
        ].map((id) =>
          Department.findAndCountAll({
            where: {
              id,
              is_deleted: false,
            },
            include: [
              {
                model: EmployeeStatusDummy,
                as: "employee_status_dummy",
                required: true,
                where: {
                  house_status_id: {
                    [Op.or]: [HOUSE_STATUS.JOIN, HOUSE_STATUS.REST],
                  },
                },
              },
            ],
          })
        )
      );
      const total =
        dev.count + nw.count + verify.count + office.count + manage.count;
      const departments = [
        {
          name: dev.rows[0].name,
          y: (dev.count / total) * 100,
        },
        {
          name: nw.rows[0].name,
          y: (nw.count / total) * 100,
        },
        {
          name: verify.rows[0].name,
          y: (verify.count / total) * 100,
        },
        {
          name: office.rows[0].name,
          y: (office.count / total) * 100,
        },
        {
          name: manage.rows[0].name,
          y: (manage.count / total) * 100,
        },
      ];
      const sortedDepartments = departments.sort((a, b) => {
        return a.y < b.y ? 1 : -1;
      });

      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(1);
        }, 5000);
      });

      return res.status(200).json({
        code: 2000,
        description: "Success get employees each department",
        departments: sortedDepartments,
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

export { AnalysisController };
