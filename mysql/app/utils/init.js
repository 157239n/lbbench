import sequelize from "./database.js";
import { User } from "../models/index.js";

/**
 * Drop all tables inside the database.
 *
 * @param {boolean} forceSync Whether to force sync sequelize or not
 */
export async function db(forceSync = true) {
  const [results, _] = await sequelize.query("show tables;");
  {
    const tables = results.map((res) => Object.values(res)[0]);
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
    for (const table of tables) await sequelize.query(`drop table ${table}`);
  }
  await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");

  if (forceSync) await sequelize.sync({ force: true });
}

export default { db };
