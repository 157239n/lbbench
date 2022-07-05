import settings from "./settings.js";
import Sequelize from "sequelize";

console.log(process.env.MYSQL_DATABASE);

const sequelize = new Sequelize({
  host: "mysql",
  port: "3306",
  dialect: "mysql",
  ...settings.sql,
});

/* // for quick debugging purposes
const sequelize = new Sequelize("sqlite::memory", {
  dialect: "mysql",
});/**/

export default sequelize;

