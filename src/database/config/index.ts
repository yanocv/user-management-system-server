import path from "path";
import { Options } from "sequelize";

const config: Options = {
  dialect: "sqlite",
  storage: path.resolve(`${__dirname}`, "../management.sqlite"),
};

export { config };
