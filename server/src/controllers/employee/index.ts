import { Request, Response } from "express";
import { Op, WhereOptions } from "sequelize";
import moment from "moment";
import { DB } from "@database/index";
import { App } from "@database/models/app.model";
import { Company } from "@database/models/company.model";
import { Department } from "@database/models/department.model";
import { Employee, EmployeeAttributes } from "@database/models/employee.model";
import { EmployeeStatus } from "@database/models/employeeStatus.model";
import { HouseStatus } from "@database/models/houseStatus.model";
import { COMMISSIONING_STATUS, SEX } from "@constants/Database";
import {
  calcAge,
  calcEnrollment,
  isEmpty,
  toInt,
  validateDate,
  validateTelephone,
} from "@utils/InsertHelper";

const EmployeeController = {
  findAll: async (
    {
      query: {
        sortBy = "asc",
        offset = "1",
        limit = "20",
        searchText = "",
        excludeDelete = "1",
        excludeRetire = "0",
      },
      ...req
    }: Request,
    res: Response
  ) => {
    const criteria: WhereOptions<EmployeeAttributes> = {};

    if (searchText) {
      criteria.last_name_hiragana = {
        [Op.like]: `%${searchText}%`,
      };
    }

    if (excludeDelete === "1") {
      criteria.is_deleted = {
        [Op.eq]: false,
      };
    }
    if (excludeRetire === "1") {
      criteria.retire_date = {
        [Op.eq]: null,
      };
    }

    const applicationId = req._devapp ? req._devapp.token.application_id : null;

    if (!applicationId) {
      return res.status(400).json({
        code: 4000,
        description: "Bad request. Undefined applicationId.",
      });
    }

    criteria.application_id = applicationId;

    try {
      const employeeList = await Employee.findAndCountAll({
        where: criteria,
        attributes: [
          "employee_id",
          "first_name",
          "last_name",
          "first_name_hiragana",
          "last_name_hiragana",
          "birthday",
          "sex",
          "age",
          "mail",
          "telephone",
          "enter_date",
          "retire_date",
          "enrollment_year",
          "enrollment_month",
          "enrollment_day",
        ],
        include: [
          {
            model: Company,
            required: true,
            as: "company",
            attributes: ["id", "name", "abbreviation"],
          },
          {
            model: EmployeeStatus,
            required: true,
            as: "employee_status",
            attributes: ["business_manager", "commissioning_status_id"],
            include: [
              {
                model: Department,
                required: true,
                as: "department",
                attributes: ["id", "name"],
              },
              {
                model: HouseStatus,
                required: true,
                as: "house_status",
                attributes: ["id", "label"],
              },
            ],
          },
        ],
        raw: true,
        nest: true,
      });

      return res.status(200).json({
        code: 2000,
        description: "Success get all employees information.",
        list: { ...employeeList },
      });
    } catch (e) {
      return res.status(500).json({
        code: 5000,
        description: `Internal server error ${e}`,
      });
    }
  },
  findOne: async (req: Request, res: Response) => {
    const applicationId = req._devapp ? req._devapp.token.application_id : null;

    if (!applicationId) {
      return res.status(400).json({
        code: 4000,
        description: "Bad request. Undefined applicationId.",
      });
    }

    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        code: 4000,
        description: "Bad request. Undefined employeeId.",
      });
    }

    const employeeIdInt = toInt(id);
    if (employeeIdInt == null) {
      return res.status(400).json({
        code: 4000,
        description: `Bad request. Invalid employee id.`,
      });
    }

    const app = await App.findOne({
      where: {
        application_id: applicationId,
        is_deleted: false,
      },
    });

    if (!app) {
      return res.status(404).json({
        code: 4040,
        description: "Application ID is not found.",
      });
    }

    try {
      const employee = await app.getEmployee({
        where: {
          employee_id: employeeIdInt,
          is_deleted: false,
        },
        attributes: [
          "employee_id",
          "first_name",
          "last_name",
          "first_name_hiragana",
          "last_name_hiragana",
          "birthday",
          "sex",
          "age",
          "mail",
          "telephone",
          "enter_date",
          "retire_date",
          "enrollment_year",
          "enrollment_month",
          "enrollment_day",
        ],
        include: [
          {
            model: Company,
            required: true,
            as: "company",
            attributes: ["id", "name", "abbreviation"],
          },
          {
            model: EmployeeStatus,
            required: true,
            as: "employee_status",
            attributes: ["business_manager", "commissioning_status_id"],
            include: [
              {
                model: Department,
                required: true,
                as: "department",
                attributes: ["id", "name"],
              },
              {
                model: HouseStatus,
                required: true,
                as: "house_status",
                attributes: ["id", "label"],
              },
            ],
          },
        ],
        nest: true,
        raw: true,
      });

      if (employee.length === 0) {
        return res.status(404).json({
          code: 4040,
          description: `Not found employee. id ${employeeIdInt}`,
        });
      }

      return res.status(200).json({
        code: 2000,
        description: "Success get employee data.",
        result: {
          employee: employee[0],
        },
      });
    } catch (e) {
      console.error(e);
      return res.status(500).json({
        code: 5000,
        description:
          "Internal server error. Database error occurred when select employee",
      });
    }
  },
  create: async (req: Request, res: Response) => {
    const applicationId = req._devapp ? req._devapp.token.application_id : null;

    if (!applicationId) {
      return res.status(400).json({
        code: 4000,
        description: "Bad request. Undefined applicationId.",
      });
    }
    const username = req._devapp ? req._devapp.token.username : null;
    if (!username) {
      return res.status(400).json({
        code: 4000,
        description: "Bad request. Undefined username.",
      });
    }

    const {
      firstName,
      lastName,
      firstNameHiragana,
      lastNameHiragana,
      companyId,
      birthday,
      sex,
      mail,
      telephone,
      enterDate,
      retireDate,
      businessManager,
      departmentId,
      commissioningStatusId,
      houseStatusId,
    } = req.body;

    if (
      !validateDate(birthday) ||
      !validateDate(enterDate) ||
      (retireDate && !validateDate(retireDate))
    ) {
      return res.status(400).json({
        code: 4000,
        description: "Bad request. Invalid date",
      });
    }

    if (
      isEmpty(firstName) ||
      isEmpty(lastName) ||
      isEmpty(firstNameHiragana) ||
      isEmpty(lastNameHiragana) ||
      isEmpty(companyId) ||
      isEmpty(sex) ||
      isEmpty(mail) ||
      isEmpty(telephone) ||
      businessManager == null ||
      isEmpty(departmentId) ||
      isEmpty(commissioningStatusId) ||
      isEmpty(houseStatusId)
    ) {
      return res.status(400).json({
        code: 4000,
        description: "Bad request. Any request body paramater is empty.",
      });
    }

    if (validateTelephone(telephone)) {
      return res.status(400).json({
        code: 4000,
        description: "Bad request. Invalid telephone number.",
      });
    }

    const companyIdInt = toInt(companyId);
    if (companyIdInt == null) {
      return res.status(400).json({
        code: 4000,
        description: `Bad request. Invalid company id.`,
      });
    }

    const company = await Company.findOne({
      where: {
        id: companyId,
        is_deleted: false,
      },
    });
    if (!company) {
      return res.status(400).json({
        code: 4000,
        description: `Bad request. Not exists company id. id: ${companyIdInt}`,
      });
    }

    const departmentIdInt = toInt(departmentId);
    if (departmentIdInt == null) {
      return res.status(400).json({
        code: 4000,
        description: `Bad request. Invalid department id.`,
      });
    }

    const department = await Department.findOne({
      where: {
        id: departmentIdInt,
        is_deleted: false,
      },
    });
    if (!department) {
      return res.status(400).json({
        code: 4000,
        description: `Bad request. Not exists department id. id: ${departmentIdInt}`,
      });
    }

    const houseStatusIdInt = toInt(houseStatusId);
    if (houseStatusIdInt == null) {
      return res.status(400).json({
        code: 4000,
        description: `Bad request. Invalid houseStatus id.`,
      });
    }

    const houseStatus = await HouseStatus.findOne({
      where: {
        id: houseStatusIdInt,
        is_deleted: false,
      },
    });

    if (!houseStatus) {
      return res.status(400).json({
        code: 4000,
        description: `Bad request. Not exists houseStatus id. id: ${houseStatusIdInt}`,
      });
    }

    const commissioningStatusIdInt = toInt(commissioningStatusId);
    if (commissioningStatusIdInt == null) {
      return res.status(400).json({
        code: 4000,
        description: `Bad request. Invalid commissioningStatus id.`,
      });
    }
    const commissioningStatusValues = Object.keys(COMMISSIONING_STATUS).map(
      (key) => COMMISSIONING_STATUS[key as keyof typeof COMMISSIONING_STATUS]
    );
    if (
      !commissioningStatusValues.some((v) => v === commissioningStatusIdInt)
    ) {
      return res.status(400).json({
        code: 4000,
        description: `Bad request. Not exists commissioningStatus id. id: ${commissioningStatusIdInt}`,
      });
    }

    const sexInt = toInt(sex);
    if (sexInt == null) {
      return res.status(400).json({
        code: 4000,
        description: `Bad request. Invalid sex value.`,
      });
    }
    const sexValues = Object.keys(SEX).map(
      (key) => SEX[key as keyof typeof SEX]
    );
    if (!sexValues.some((v) => v === sexInt)) {
      return res.status(400).json({
        code: 4000,
        description: `Bad request. Not exists sex value.`,
      });
    }

    const app = await App.findOne({
      where: {
        application_id: applicationId,
        is_deleted: false,
      },
    });

    if (!app) {
      return res.status(404).json({
        code: 4040,
        description: "Application ID is not found.",
      });
    }

    const age = calcAge(birthday);

    const enrollment = calcEnrollment(enterDate, retireDate);

    const nextId = (await app.countEmployee()) + 1;

    const sequelize = DB.init();
    const transaction = await sequelize.transaction({ autocommit: false });

    try {
      await app.createEmployee(
        {
          composite_id: `${nextId}-${app.application_id}`,
          employee_id: nextId,
          application_id: app.application_id,
          first_name: firstName,
          last_name: lastName,
          first_name_hiragana: firstNameHiragana,
          last_name_hiragana: lastNameHiragana,
          company_id: companyIdInt,
          birthday,
          sex: sexInt,
          age,
          mail,
          telephone,
          enter_date: enterDate,
          retire_date: retireDate,
          enter_date_milliseconds: moment(enterDate, "YYYY-MM-DD").valueOf(),
          retire_date_milliseconds: moment(retireDate, "YYYY-MM-DD").valueOf(),
          enrollment_year: enrollment.years,
          enrollment_month: enrollment.months,
          enrollment_day: enrollment.days,
          created_id: username,
          modified_id: username,
        },
        { transaction }
      );

      await EmployeeStatus.create(
        {
          composite_id: `${nextId}-${app.application_id}`,
          employee_id: nextId,
          application_id: app.application_id,
          business_manager: businessManager,
          department_id: departmentIdInt,
          commissioning_status_id: commissioningStatusIdInt,
          house_status_id: houseStatusIdInt,
          created_id: username,
          modified_id: username,
        },
        { transaction }
      );

      await transaction.commit();
      return res.status(200).json({
        code: 2000,
        description: "Success create employee.",
      });
    } catch (e) {
      console.error(e);
      await transaction.rollback();

      return res.status(500).json({
        code: 5000,
        description:
          "Internal server error. Database error occurred when create employee and rollback database.",
      });
    }
  },
  update: async (req: Request, res: Response) => {
    const applicationId = req._devapp ? req._devapp.token.application_id : null;

    if (!applicationId) {
      return res.status(400).json({
        code: 4000,
        description: "Bad request. Undefined applicationId.",
      });
    }
    const username = req._devapp ? req._devapp.token.username : null;
    if (!username) {
      return res.status(400).json({
        code: 4000,
        description: "Bad request. Undefined username.",
      });
    }

    const { id: employeeId } = req.params;

    const {
      firstName,
      lastName,
      firstNameHiragana,
      lastNameHiragana,
      companyId,
      birthday,
      sex,
      mail,
      telephone,
      enterDate,
      retireDate,
      businessManager,
      departmentId,
      commissioningStatusId,
      houseStatusId,
    } = req.body;

    if (
      !validateDate(birthday) ||
      !validateDate(enterDate) ||
      (retireDate && !validateDate(retireDate))
    ) {
      return res.status(400).json({
        code: 4000,
        description: "Bad request. Invalid date",
      });
    }

    if (
      isEmpty(employeeId) ||
      isEmpty(firstName) ||
      isEmpty(lastName) ||
      isEmpty(firstNameHiragana) ||
      isEmpty(lastNameHiragana) ||
      isEmpty(companyId) ||
      isEmpty(sex) ||
      isEmpty(mail) ||
      isEmpty(telephone) ||
      businessManager == null ||
      isEmpty(departmentId) ||
      isEmpty(commissioningStatusId) ||
      isEmpty(houseStatusId)
    ) {
      return res.status(400).json({
        code: 4000,
        description: "Bad request. Any request body paramater is empty.",
      });
    }

    const employeeIdInt = toInt(employeeId);
    if (employeeIdInt == null) {
      return res.status(400).json({
        code: 4000,
        description: `Bad request. Invalid employee id.`,
      });
    }

    if (validateTelephone(telephone)) {
      return res.status(400).json({
        code: 4000,
        description: "Bad request. Invalid telephone number.",
      });
    }

    const companyIdInt = toInt(companyId);
    if (companyIdInt == null) {
      return res.status(400).json({
        code: 4000,
        description: `Bad request. Invalid company id.`,
      });
    }

    const company = await Company.findOne({
      where: {
        id: companyId,
        is_deleted: false,
      },
    });
    if (!company) {
      return res.status(400).json({
        code: 4000,
        description: `Bad request. Not exists company id. id: ${companyIdInt}`,
      });
    }

    const departmentIdInt = toInt(departmentId);
    if (departmentIdInt == null) {
      return res.status(400).json({
        code: 4000,
        description: `Bad request. Invalid department id.`,
      });
    }

    const department = await Department.findOne({
      where: {
        id: departmentIdInt,
        is_deleted: false,
      },
    });
    if (!department) {
      return res.status(400).json({
        code: 4000,
        description: `Bad request. Not exists department id. id: ${departmentIdInt}`,
      });
    }

    const houseStatusIdInt = toInt(houseStatusId);
    if (houseStatusIdInt == null) {
      return res.status(400).json({
        code: 4000,
        description: `Bad request. Invalid houseStatus id.`,
      });
    }

    const houseStatus = await HouseStatus.findOne({
      where: {
        id: houseStatusIdInt,
        is_deleted: false,
      },
    });

    if (!houseStatus) {
      return res.status(400).json({
        code: 4000,
        description: `Bad request. Not exists houseStatus id. id: ${houseStatusIdInt}`,
      });
    }

    const commissioningStatusIdInt = toInt(commissioningStatusId);
    if (commissioningStatusIdInt == null) {
      return res.status(400).json({
        code: 4000,
        description: `Bad request. Invalid commissioningStatus id.`,
      });
    }
    const commissioningStatusValues = Object.keys(COMMISSIONING_STATUS).map(
      (key) => COMMISSIONING_STATUS[key as keyof typeof COMMISSIONING_STATUS]
    );
    if (
      !commissioningStatusValues.some((v) => v === commissioningStatusIdInt)
    ) {
      return res.status(400).json({
        code: 4000,
        description: `Bad request. Not exists commissioningStatus id. id: ${commissioningStatusIdInt}`,
      });
    }

    const sexInt = toInt(sex);
    if (sexInt == null) {
      return res.status(400).json({
        code: 4000,
        description: `Bad request. Invalid sex value.`,
      });
    }
    const sexValues = Object.keys(SEX).map(
      (key) => SEX[key as keyof typeof SEX]
    );
    if (!sexValues.some((v) => v === sexInt)) {
      return res.status(400).json({
        code: 4000,
        description: `Bad request. Not exists sex value.`,
      });
    }

    const app = await App.findOne({
      where: {
        application_id: applicationId,
        is_deleted: false,
      },
    });

    if (!app) {
      return res.status(404).json({
        code: 4040,
        description: "Application ID is not found.",
      });
    }

    const age = calcAge(birthday);

    const enrollment = calcEnrollment(enterDate, retireDate);

    const sequelize = DB.init();
    const transaction = await sequelize.transaction({ autocommit: false });

    const employee = await app.getEmployee({
      where: {
        employee_id: employeeIdInt,
        is_deleted: false,
      },
      include: [
        {
          model: EmployeeStatus,
          as: "employee_status",
          required: true,
        },
      ],
    });

    if (employee.length === 0) {
      return res.status(404).json({
        code: 4040,
        description: `Not found employee. id ${employeeIdInt}`,
      });
    }

    try {
      await employee[0].update(
        {
          first_name: firstName,
          last_name: lastName,
          first_name_hiragana: firstNameHiragana,
          last_name_hiragana: lastNameHiragana,
          company_id: companyIdInt,
          birthday,
          sex: sexInt,
          age,
          mail,
          telephone,
          enter_date: enterDate,
          retire_date: retireDate,
          enter_date_milliseconds: moment(enterDate, "YYYY-MM-DD").valueOf(),
          retire_date_milliseconds: moment(retireDate, "YYYY-MM-DD").valueOf(),
          enrollment_year: enrollment.years,
          enrollment_month: enrollment.months,
          enrollment_day: enrollment.days,
          modified_id: username,
        },
        { transaction }
      );

      if (employee[0].employee_status) {
        await employee[0].employee_status.update(
          {
            business_manager: businessManager,
            department_id: departmentIdInt,
            commissioning_status_id: commissioningStatusIdInt,
            house_status_id: houseStatusIdInt,
            modified_id: username,
          },
          { transaction }
        );
      }

      await transaction.commit();
      return res.status(200).json({
        code: 2000,
        description: `Success update employee. id: ${employeeIdInt}`,
      });
    } catch (e) {
      console.error(e);
      await transaction.rollback();

      return res.status(500).json({
        code: 5000,
        description:
          "Internal server error. Database error occurred when update employee and rollback database.",
      });
    }
  },
  delete: async (req: Request, res: Response) => {
    const applicationId = req._devapp ? req._devapp.token.application_id : null;

    if (!applicationId) {
      return res.status(400).json({
        code: 4000,
        description: "Bad request. Undefined applicationId.",
      });
    }
    const username = req._devapp ? req._devapp.token.username : null;
    if (!username) {
      return res.status(400).json({
        code: 4000,
        description: "Bad request. Undefined username.",
      });
    }

    const { id: employeeId } = req.params;

    if (isEmpty(employeeId)) {
      return res.status(400).json({
        code: 4000,
        description: "Bad request. Request body employeeId is empty.",
      });
    }

    const employeeIdInt = toInt(employeeId);
    if (employeeIdInt == null) {
      return res.status(400).json({
        code: 4000,
        description: `Bad request. Invalid employee id.`,
      });
    }

    const app = await App.findOne({
      where: {
        application_id: applicationId,
        is_deleted: false,
      },
    });

    if (!app) {
      return res.status(404).json({
        code: 4040,
        description: "Application ID is not found.",
      });
    }

    const employee = await app.getEmployee({
      where: {
        employee_id: employeeIdInt,
        is_deleted: false,
      },
      include: [
        {
          model: EmployeeStatus,
          as: "employee_status",
          required: true,
        },
      ],
    });

    if (employee.length === 0) {
      return res.status(404).json({
        code: 4040,
        description: `Not found employee. id ${employeeIdInt}`,
      });
    }

    const sequelize = DB.init();
    const transaction = await sequelize.transaction({ autocommit: false });

    try {
      await employee[0].update(
        {
          is_deleted: true,
          modified_id: username,
        },
        { transaction }
      );

      if (employee[0].employee_status) {
        await employee[0].employee_status.update(
          {
            is_deleted: true,
            modified_id: username,
          },
          { transaction }
        );
      }

      await transaction.commit();
      return res.status(200).json({
        code: 2000,
        description: `Success delete employee. id: ${employeeIdInt}`,
      });
    } catch (e) {
      console.error(e);
      await transaction.rollback();

      return res.status(500).json({
        code: 5000,
        description:
          "Internal server error. Database error occurred when delete employee and rollback database.",
      });
    }
  },
};

export { EmployeeController };
