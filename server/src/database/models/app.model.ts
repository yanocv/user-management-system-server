import {
  Association,
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin,
  Model,
  Optional,
  Sequelize,
} from "sequelize";
import type { User } from "@database/models/user.model";
import { Employee } from "@database/models/employee.model";
import { EmployeeDummy } from "@database/models/employeeDummy.model";

interface AppAttributes {
  application_id: string;
  is_deleted: boolean;
}

export interface AppCreationAttributes
  extends Optional<AppAttributes, "is_deleted"> {}

export class App
  extends Model<AppAttributes, AppCreationAttributes>
  implements AppAttributes
{
  declare application_id: string;
  declare is_deleted: boolean;
  declare readonly created: Date;
  declare readonly modified: Date;

  declare getUser: HasManyGetAssociationsMixin<User>;
  declare addUser: HasManyAddAssociationMixin<User, number>;
  declare hasUser: HasManyHasAssociationsMixin<User, number>;
  declare countUser: HasManyCountAssociationsMixin;
  declare createUser: HasManyCreateAssociationMixin<User>;

  declare readonly user?: User[];

  declare getEmployee: HasManyGetAssociationsMixin<Employee>;
  declare addEmployee: HasManyAddAssociationMixin<Employee, number>;
  declare hasEmployee: HasManyHasAssociationMixin<Employee, number>;
  declare countEmployee: HasManyCountAssociationsMixin;
  declare createEmployee: HasManyCreateAssociationMixin<Employee>;

  declare readonly employee?: Employee[];

  declare getEmployee_dummy: HasManyGetAssociationsMixin<EmployeeDummy>;
  declare addEmployee_dummy: HasManyAddAssociationMixin<EmployeeDummy, number>;
  declare hasEmployee_dummy: HasManyHasAssociationMixin<EmployeeDummy, number>;
  declare countEmployee_dummy: HasManyCountAssociationsMixin;
  declare createEmployee_dummy: HasManyCreateAssociationMixin<EmployeeDummy>;

  declare readonly employee_dummy?: EmployeeDummy[];

  declare static associations: {
    user: Association<App, User>;
    employee: Association<App, Employee>;
    employee_dummy: Association<App, EmployeeDummy>;
  };
}

export const AppInit = (sequelize: Sequelize) => {
  App.init(
    {
      application_id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      tableName: "app",
      charset: "utf8",
      timestamps: true,
      createdAt: "created",
      updatedAt: "modified",
    }
  );
};
