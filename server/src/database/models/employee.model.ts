import {
  Sequelize,
  DataTypes,
  Model,
  HasOneCreateAssociationMixin,
  Association,
  Optional,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  BelongsToCreateAssociationMixin,
  HasOneGetAssociationMixin,
  HasOneSetAssociationMixin,
} from "sequelize";
import { App } from "./app.model";
import { Company } from "@database/models/company.model";
import { EmployeeStatus } from "@database/models/employeeStatus.model";

export interface EmployeeAttributes {
  composite_id: string;
  employee_id: number;
  application_id: string;
  first_name: string;
  last_name: string;
  first_name_hiragana: string;
  last_name_hiragana: string;
  full_name: string;
  full_name_hiragana: string;
  company_id: number;
  birthday: string;
  sex: number;
  age: number;
  mail: string;
  telephone: string;
  enter_date: string;
  retire_date: string | null;
  enter_date_milliseconds: number;
  retire_date_milliseconds: number | null;
  enrollment_year: string;
  enrollment_month: string;
  enrollment_day: string;
  is_deleted: boolean;
  created_id: string;
  modified_id: string;
}

interface EmployeeCreationAttributes
  extends Optional<
    Omit<EmployeeAttributes, "full_name" | "full_name_hiragana">,
    "is_deleted"
  > {}

export class Employee
  extends Model<EmployeeAttributes, EmployeeCreationAttributes>
  implements EmployeeAttributes
{
  declare composite_id: string;
  declare employee_id: number;
  declare application_id: string;
  declare first_name: string;
  declare last_name: string;
  declare first_name_hiragana: string;
  declare last_name_hiragana: string;
  declare full_name: string;
  declare full_name_hiragana: string;
  declare company_id: number;
  declare birthday: string;
  declare sex: number;
  declare age: number;
  declare mail: string;
  declare telephone: string;
  declare enter_date: string;
  declare retire_date: string | null;
  declare enter_date_milliseconds: number;
  declare retire_date_milliseconds: number | null;
  declare enrollment_year: string;
  declare enrollment_month: string;
  declare enrollment_day: string;
  declare is_deleted: boolean;
  declare created_id: string;
  declare modified_id: string;
  declare readonly created: Date;
  declare readonly modified: Date;

  declare getApp: BelongsToGetAssociationMixin<App>;
  declare setApp: BelongsToSetAssociationMixin<App, number>;
  declare createApp: BelongsToCreateAssociationMixin<App>;

  declare readonly app?: App;

  declare getCompany: BelongsToGetAssociationMixin<Company>;
  declare setCompany: BelongsToSetAssociationMixin<Company, number>;
  declare createCompany: BelongsToCreateAssociationMixin<Company>;

  declare readonly company?: Company;

  declare getEmployee_status: HasOneGetAssociationMixin<EmployeeStatus>;
  declare setEmployee_status: HasOneSetAssociationMixin<EmployeeStatus, number>;
  declare createEmployee_status: HasOneCreateAssociationMixin<EmployeeStatus>;

  declare readonly employee_status?: EmployeeStatus;

  declare static associations: {
    app: Association<Employee, App>;
    company: Association<Employee, Company>;
    employee_status: Association<Employee, EmployeeStatus>;
  };
}

export const EmployeeInit = (sequelize: Sequelize) => {
  Employee.init(
    {
      composite_id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      employee_id: {
        type: DataTypes.INTEGER,
        // primaryKey: true,
        unique: "CompositePrimaryKey",
        allowNull: false,
      },
      application_id: {
        type: DataTypes.STRING,
        // primaryKey: true,
        unique: "CompositePrimaryKey",
        allowNull: false,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      first_name_hiragana: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      last_name_hiragana: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      full_name: {
        type: DataTypes.TEXT,
        allowNull: true,
        get() {
          return `${this.getDataValue("first_name")} ${this.getDataValue(
            "last_name"
          )}`;
        },
      },
      full_name_hiragana: {
        type: DataTypes.TEXT,
        allowNull: true,
        get() {
          return `${this.getDataValue(
            "first_name_hiragana"
          )} ${this.getDataValue("last_name_hiragana")}`;
        },
      },
      company_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      birthday: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      sex: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      mail: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      telephone: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      enter_date: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      retire_date: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      enter_date_milliseconds: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      retire_date_milliseconds: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      enrollment_year: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      enrollment_month: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      enrollment_day: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      created_id: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      modified_id: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "employee",
      charset: "utf8",
      timestamps: true,
      createdAt: "created",
      updatedAt: "modified",
    }
  );
};
