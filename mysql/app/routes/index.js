import express from "express";
import { Op } from "sequelize";
import init from "../utils/init.js";
import router from "./router.js";
import api from "./api.js";
import User from "../models/User.js";
import sequelize from "../utils/database.js";
import { randomNames } from "../models/randomNames.js";

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

/**
 * Describe the table and all of its indexes
 */
router.get("/describe", async (req, res) => {
  try {
    const [schema, metadata] = await sequelize.query("describe users;");
    const [index, metadata2] = await sequelize.query(
      "show indexes from users;"
    );
    res.send(JSON.stringify([schema, index], null, 2));
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
      const name = User.randomName() + " " + User.randomName();
      await User.new({
        name: name,
        nameNoIndex: name,
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
      const name = User.randomName() + " " + User.randomName();
      User.new({
        name: name,
        nameNoIndex: name,
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
    const name = User.randomName() + " " + User.randomName();
    const instance = {
      ...User.defaults,
      name: name,
      nameNoIndex: name,
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

router.get("/query/:index", async (req, res) => {
  try {
    const a =
      req.params.index === "index"
        ? { tier: 300 }
        : { tierExpirationTime: 300 };
    const users = await User.findAll({ where: { ...a } });
    res.send("Ok");
  } catch (e) {
    api.error(res, e);
  }
});

/**
 * x and y should be in the [0, 999] range
 */
router.get("/query/inrange/:index/:x/:y", async (req, res) => {
  try {
    let x = parseInt(req.params.x);
    let y = parseInt(req.params.y);
    const a =
      req.params.index === "index"
        ? { tier: { [Op.between]: [x, y] } }
        : { tierExpirationTime: { [Op.between]: [x, y] } };
    const users = await User.findAll({ where: { ...a } });
    res.send("Ok");
  } catch (e) {
    api.error(res, e);
  }
});

/**
 * Searches strings starting from some term
 */
router.get("/query/headstring/:index/:term", async (req, res) => {
  try {
    const a =
      req.params.index === "index"
        ? { name: { [Op.like]: `${req.params.term}%` } }
        : { nameNoIndex: { [Op.like]: `${req.params.term}%` } };
    const users = await User.findAll({ where: { ...a } });
    res.send(`Users: ${users.length}`);
  } catch (e) {
    api.error(res, e);
  }
});

router.get("/query/tailstring/:index/:term", async (req, res) => {
  try {
    const a =
      req.params.index === "index"
        ? { name: { [Op.like]: `%${req.params.term}` } }
        : { nameNoIndex: { [Op.like]: `%${req.params.term}` } };
    const users = await User.findAll({ where: { ...a } });
    res.send(`Users: ${users.length}`);
  } catch (e) {
    api.error(res, e);
  }
});

router.get("/query/midstring/:index/:term", async (req, res) => {
  try {
    const a =
      req.params.index === "index"
        ? { name: { [Op.like]: `%${req.params.term}%` } }
        : { nameNoIndex: { [Op.like]: `%${req.params.term}%` } };
    const users = await User.findAll({ where: { ...a } });
    res.send(`Users: ${users.length}`);
  } catch (e) {
    api.error(res, e);
  }
});

export default router;
