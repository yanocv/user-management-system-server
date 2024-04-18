import {
  Association,
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyRemoveAssociationMixin,
  Model,
  Optional,
  Sequelize,
} from "sequelize";
import { Employee } from "@database/models/employee.model";
import { EmployeeDummy } from "@database/models/employeeDummy.model";

interface CompanyAttributes {
  id: number;
  name: string;
  abbreviation: string;
  is_deleted: boolean;
  created_id: string;
  modified_id: string;
}

interface CompanyCreationAttributes
  extends Optional<Omit<CompanyAttributes, "id">, "is_deleted"> {}

export class Company
  extends Model<CompanyAttributes, CompanyCreationAttributes>
  implements CompanyAttributes
{
  declare id: number;
  declare name: string;
  declare abbreviation: string;
  declare is_deleted: boolean;
  declare created_id: string;
  declare modified_id: string;
  declare readonly created: Date;
  declare readonly modified: Date;

  declare getEmployee: HasManyGetAssociationsMixin<Employee>;
  declare addEmployee: HasManyAddAssociationMixin<Employee, number>;
  declare hasEmployee: HasManyHasAssociationMixin<Employee, number>;
  declare countEmployee: HasManyCountAssociationsMixin;
  declare rempveEmployee: HasManyRemoveAssociationMixin<Employee, number>;
  declare createEmployee: HasManyCreateAssociationMixin<Employee>;

  declare readonly employee?: Employee[];

  declare getEmployee_dummy: HasManyGetAssociationsMixin<EmployeeDummy>;
  declare addEmployee_dummy: HasManyAddAssociationMixin<EmployeeDummy, number>;
  declare hasEmployee_dummy: HasManyHasAssociationMixin<EmployeeDummy, number>;
  declare countEmployee_dummy: HasManyCountAssociationsMixin;
  declare rempveEmployee_dummy: HasManyRemoveAssociationMixin<
    EmployeeDummy,
    number
  >;
  declare createEmployee_dummy: HasManyCreateAssociationMixin<EmployeeDummy>;

  declare readonly employee_dummy?: EmployeeDummy[];

  declare static associations: {
    employee: Association<Company, Employee>;
    employee_dummy: Association<Company, EmployeeDummy>;
  };
}

export const CompanyInit = (sequelize: Sequelize) => {
  Company.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      abbreviation: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      created_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      modified_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "company",
      charset: "utf8",
      timestamps: true,
      createdAt: "created",
      updatedAt: "modified",
    }
  );
};
