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
    const transactions = await this.budgetModel.find({ userId: userId });
    return cb(transactions);
  }
}

module.exports = BudgetModel;
