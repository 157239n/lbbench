import express from "express";
import { Op } from "sequelize";
import init from "../utils/init.js";
import router from "./router.js";
import api from "./api.js";
import User from "../models/User.js";

router.get("/", async (req, res) => {
  res.send("Ok");
});

router.get("/drop", async (req, res) => {
  try {
    await init.db();
    res.send("Ok");
  } catch (e) {
    api.error(res, e);
  }
});

function randomInt() {
  return Math.round(Math.random() * 1000);
}

router.get("/insert/sync/:amount", async (req, res) => {
  try {
    const amount = parseInt(req.params.amount);
    for (let i = 0; i < amount; i++) {
      await User.new({
        name: "Quang",
        phoneNumber: "123 456 789",
        tier: randomInt(),
        tierExpirationTime: randomInt(),
      });
    }
    console.log("----------------------- Over -----------------------");
    res.send("Ok");
  } catch (e) {
    api.error(res, e);
  }
});

router.get("/insert/async/:amount", async (req, res) => {
  try {
    const amount = parseInt(req.params.amount);
    for (let i = 0; i < amount; i++) {
      User.new({
        name: "Quang",
        phoneNumber: "123 456 789",
        tier: randomInt(),
        tierExpirationTime: randomInt(),
      });
    }
    res.send("Ok");
  } catch (e) {
    api.error(res, e);
  }
});

router.get("/insert/bulk/:amount", async (req, res) => {
  try {
    const amount = parseInt(req.params.amount);
    const instance = {
      ...User.defaults,
      name: "Quang",
      phoneNumber: "123 456 789",
      tier: randomInt(),
      tierExpirationTime: randomInt(),
    };
    const instances = new Array(amount);
    for (let i = 0; i < amount; i++) instances[i] = instance;
    await User.bulkCreate(instances);
    res.send("Ok");
  } catch (e) {
    api.error(res, e);
  }
});

router.get("/query/index", async (req, res) => {
  try {
    const users = await User.findAll({
      where: {
        tier: 300,
      },
    });
    res.send("Ok");
  } catch (e) {
    api.error(res, e);
  }
});

router.get("/query/noindex", async (req, res) => {
  try {
    const users = await User.findAll({
      where: {
        tierExpirationTime: 300,
      },
    });
    res.send("Ok");
  } catch (e) {
    api.error(res, e);
  }
});

/**
 * x and y should be in the [0, 999] range
 */
router.get("/query/inrange/index/:x/:y", async (req, res) => {
  try {
    let x = parseInt(req.params.x);
    let y = parseInt(req.params.y);
    const users = await User.findAll({
      where: {
        tier: {
          [Op.between]: [x, y],
        },
      },
    });
    res.send("Ok");
  } catch (e) {
    api.error(res, e);
  }
});

/**
 * x and y should be in the [0, 999] range
 */
router.get("/query/inrange/noindex/:x/:y", async (req, res) => {
  try {
    let x = parseInt(req.params.x);
    let y = parseInt(req.params.y);
    const users = await User.findAll({
      where: {
        tierExpirationTime: {
          [Op.between]: [x, y],
        },
      },
    });
    res.send("Ok");
  } catch (e) {
    api.error(res, e);
  }
});

/**
 * Modifies user.
 * - Expects: json body
 *   {
 *     name: "Dan",
 *     ...
 *   }
 * - Auth
 * - Returns: User object
 */
router.post("/user/:userId/modify", express.json(), async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const loggedInUser = await User.Req.authorizedUser(req, userId);
    if (!loggedInUser) return api.notAuthorized(res);

    const user = await User.findOne({ where: { id: userId } });
    if (loggedInUser.isAdmin())
      await user.modify(
        utils.retainFields(req.body, [
          "name",
          "role",
          "phoneNumber",
          "tier",
          "tierExpirationTime",
          "propertyShareFields",
          "PGShareFields",
        ])
      );
    else
      await user.modify(
        utils.retainFields(req.body, [
          "name",
          "propertyShareFields",
          "PGShareFields",
        ])
      );
    if (req.body.password) await user.setPassword(req.body.password);
    res.send(stripUser(user));
  } catch (e) {
    api.error(res, e);
  }
});

export default router;
