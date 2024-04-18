import {
  Sequelize,
  DataTypes,
  Model,
  Association,
  Optional,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  BelongsToCreateAssociationMixin,
} from "sequelize";
import { App } from "./app.model";
import { Permission } from "@database/models/permission.model";

interface UserAttributes {
  application_id: string;
  username: string;
  password: string;
  permission_id: number;
  is_deleted: boolean;
  created_id: string;
  modified_id: string;
}

export interface UserCreationAttributes
  extends Optional<UserAttributes, "is_deleted"> {}

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  declare application_id: string;
  declare username: string;
  declare password: string;
  declare permission_id: number;
  declare is_deleted: boolean;
  declare created_id: string;
  declare modified_id: string;
  declare readonly created: Date;
  declare readonly modified: Date;

  declare getApp: BelongsToGetAssociationMixin<App>;
  declare setApp: BelongsToSetAssociationMixin<App, number>;
  declare createApp: BelongsToCreateAssociationMixin<App>;

  declare readonly app?: App;

  declare getPermission: BelongsToGetAssociationMixin<Permission>;
  declare setPermission: BelongsToSetAssociationMixin<Permission, number>;
  declare createPermission: BelongsToCreateAssociationMixin<Permission>;

  declare readonly permission?: Permission;

  declare static associations: {
    app: Association<User, App>;
    permission: Association<User, Permission>;
  };
}

export const UserInit = (sequelize: Sequelize) => {
  User.init(
    {
      application_id: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: "CompositePrimaryKey",
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: "CompositePrimaryKey",
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      permission_id: {
        type: DataTypes.NUMBER,
        allowNull: false,
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
      tableName: "user",
      charset: "utf8",
      timestamps: true,
      createdAt: "created",
      updatedAt: "modified",
    }
  );
};
