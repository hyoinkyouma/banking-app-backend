const mongoose = require("mongoose");

class BudgetModel {
  constructor() {
    this.budgetModel = mongoose.model(
      "budget",
      new mongoose.Schema({
        name: String,
        date: String,
        amount: String,
        accId: String,
      })
    );
  }
  async logBudget(arg, cb) {
    const { name, amount, id } = arg;
    const date = Date.now();
    const newEntry = new this.budgetModel({
      name: name,
      amount: amount,
      accId: id,
      date: date,
    });
    const data = await newEntry.save();
    return cb(data);
  }

  async fetchBudget(userId, cb) {
    const transactions = await this.budgetModel.find({ accId: userId });
    return cb(transactions);
  }
  async fetchBudgetChart(userId, cb) {
    const userBudget = await this.budgetModel.find({ accId: userId });
    const amountObj = {};
    userBudget.forEach((budget) => {
      amountObj[budget.name] = Number(budget.amount);
    });

    const sortable = Object.fromEntries(
      Object.entries(amountObj).sort(([, a], [, b]) => a - b)
    );
    const values = Object.keys(sortable)
      .map((key) => sortable[key])
      .reverse();

    const labels = Object.keys(sortable)
      .map((key) => key)
      .reverse();

    cb({ labels: labels.slice(0, 3), values: values.slice(0, 3) });
  }
}

module.exports = BudgetModel;
