const dotenv = require("dotenv");
const fs = require("fs");
const Discord = require("discord.js");
const { Users } = require("../dbObjects");

const bank = new Discord.Collection();

Reflect.defineProperty(bank, "add", {
  value: async function add(id, amount) {
    const user = bank.get(id);
    if (user) {
      user.balance += Number(amount);
      return user.save();
    }

    const newUser = await Users.create({ id: id, balance: amount });
    bank.set(id, newUser);
    return newUser;
  },
});

Reflect.defineProperty(bank, "getBalance", {
  value: function getBalance(id) {
    const user = bank.get(id);
    return user ? user.balance : 0;
  },
});

Reflect.defineProperty(bank, "subtract", {
  value: async function subtract(id, amount) {
    const user = bank.get(id);
    amount = Number(amount);

    if (user && user.balance > amount) {
      user.balance -= amount;
      return user.save();
    }

    throw "User does not have enough balance.";
  },
});

Reflect.defineProperty(bank, "transfer", {
  value: async function transfer(sendId, recivId, amount) {
    const sendUser = bank.get(sendId);
    const recivUser = bank.get(recivId);
    amount = Number(amount);

    if (sendUser && recivUser && sendUser.balance > amount) {
      sendUser.balance -= amount;
      recivUser.balance += amount;
      return sendUser.save() && recivUser.save();
    }

    throw "Receiving user does not exist or sending user doesnt not have enough to make transfer";
  },
});

module.exports = bank;
