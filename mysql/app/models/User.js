import { Model, DataTypes } from "sequelize";
import sequelize from "../utils/database.js";
import utils from "../utils/index.js";
import bcrypt from "bcrypt";
import { randomNames } from "./randomNames.js";

/**
 * User model. Pretty bog standard.
 */
class User extends Model {
  static Role = {
    ADMIN: 0,
    USER: 1,
  };

  static randomName() {
    return randomNames[Math.round(Math.random() * (randomNames.length - 1))];
  }

  /**
   * Remember to change panel/model/User to be in sync as well
   */
  static defaults = {
    propertyShareFields: "type;price;desc;area;address;nMajorStreets;lat;lng",
    PGShareFields: "name;desc",
    role: User.Role.USER,
  };

  static async new(record, options) {
    const user = await User.create(
      {
        ...User.defaults,
        ...record,
        lastUpdated: Math.round(Date.now() / 1000),
      },
      options
    );
    return user;
  }

  async modify(data) {
    await this.update({ ...data, lastUpdated: Math.round(Date.now() / 1000) });
  }

  /**
   * Sets the user's password. Will do the bcrypt salted
   * hash automatically behind the scenes.
   * @param {string} pw Password
   */
  async setPassword(pw) {
    await this.update({ passwordHash: bcrypt.hashSync(pw, 10) });
  }

  /**
   * Checks whether the given password is correct.
   * @param {string} pw Password
   * @returns {boolean}
   */
  isPasswordCorrect(pw) {
    return bcrypt.compareSync(pw, this.passwordHash);
  }

  /**
   * Convenience function to test if the User's role
   * is admin.
   * @returns {boolean}
   */
  isAdmin() {
    return this.role === User.Role.ADMIN;
  }
}

User.init(
  {
    name: DataTypes.STRING,
    nameNoIndex: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    passwordHash: DataTypes.STRING,
    role: DataTypes.INTEGER, // User.Role enum
    tier: DataTypes.INTEGER, // There can be multiple subscription tiers. Currently let's say the base one is 200k/yr for normal ppl, and 2M/yr for sales ppl
    tierExpirationTime: DataTypes.BIGINT, // unix timestamp
    propertyShareFields: DataTypes.STRING, // default Property's fields to share with others
    PGShareFields: DataTypes.STRING, // default PropertyGroup's fields to share with others
    lastUpdated: DataTypes.BIGINT, //
  },
  {
    sequelize,
    modelName: "user",
    timestamps: false,
    ...utils.index(["lastUpdated", "tier", "phoneNumber", "name"]),
  }
);

export default User;
