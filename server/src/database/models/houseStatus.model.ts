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
import { EmployeeStatus } from "@database/models/employeeStatus.model";
import { EmployeeStatusDummy } from "@database/models/employeeStatusDummy.model";

interface HouseStatusAttributes {
  id: number;
  label: string;
  is_deleted: boolean;
  created_id: string;
  modified_id: string;
}

interface HouseStatusCreationAttributes
  extends Optional<HouseStatusAttributes, "is_deleted"> {}

export class HouseStatus
  extends Model<HouseStatusAttributes, HouseStatusCreationAttributes>
  implements HouseStatusAttributes
{
  declare id: number;
  declare label: string;
  declare is_deleted: boolean;
  declare created_id: string;
  declare modified_id: string;
  declare readonly created: Date;
  declare readonly modified: Date;

  declare getEmployee_status: HasManyGetAssociationsMixin<EmployeeStatus>;
  declare countEmployee_status: HasManyCountAssociationsMixin;
  declare hasEmployee_status: HasManyHasAssociationMixin<
    EmployeeStatus,
    number
  >;
  declare addEmployee_status: HasManyAddAssociationMixin<
    EmployeeStatus,
    number
  >;
  declare removeEmployee_status: HasManyRemoveAssociationMixin<
    EmployeeStatus,
    number
  >;
  declare createEmployee_status: HasManyCreateAssociationMixin<EmployeeStatus>;

  declare readonly employee_status?: EmployeeStatus[];

  declare getEmployee_status_dummy: HasManyGetAssociationsMixin<EmployeeStatusDummy>;
  declare countEmployee_status_dummy: HasManyCountAssociationsMixin;
  declare hasEmployee_status_dummy: HasManyHasAssociationMixin<
    EmployeeStatusDummy,
    number
  >;
  declare addEmployee_status_dummy: HasManyAddAssociationMixin<
    EmployeeStatusDummy,
    number
  >;
  declare removeEmployee_status_dummy: HasManyRemoveAssociationMixin<
    EmployeeStatusDummy,
    number
  >;
  declare createEmployee_status_dummy: HasManyCreateAssociationMixin<EmployeeStatusDummy>;

  declare readonly employee_status_dummy?: EmployeeStatusDummy[];

  declare static associations: {
    employee_status: Association<HouseStatus, EmployeeStatus>;
    employee_status_dummy: Association<HouseStatus, EmployeeStatusDummy>;
  };
}

export const HouseStatusInit = (sequelize: Sequelize) => {
  HouseStatus.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      label: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
      },
      is_deleted: {
        type: DataTypes.TEXT,
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
      tableName: "house_status",
      charset: "utf8",
      timestamps: true,
      createdAt: "created",
      updatedAt: "modified",
    }
  );
};
