import { Sequelize, DataTypes, Model, Optional } from "sequelize";

interface TopicAttributes {
  id: number;
  title: string;
  contents: string;
  published_date: string;
  is_deleted: boolean;
  created_id: string;
  modified_id: string;
}

export interface TopicCreationAttributes
  extends Optional<
    Omit<TopicAttributes, "id">,
    "is_deleted" | "published_date"
  > {}

export class Topic
  extends Model<TopicAttributes, TopicCreationAttributes>
  implements TopicAttributes
{
  declare id: number;
  declare title: string;
  declare contents: string;
  declare published_date: string;
  declare is_deleted: boolean;
  declare created_id: string;
  declare modified_id: string;
  declare readonly created: Date;
  declare readonly modified: Date;
}

export const TopicInit = (sequelize: Sequelize) => {
  Topic.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      contents: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      published_date: {
        type: DataTypes.TEXT,
        allowNull: true,
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
      tableName: "topic",
      charset: "utf8",
      timestamps: true,
      createdAt: "created",
      updatedAt: "modified",
    }
  );
};
