const mongoose = require("mongoose");
class TransModel {
  constructor() {
    this.transModel = mongoose.model(
      "transaction",
      new mongoose.Schema({
        type: String,
        date: String,
        amount: String,
        userId: String,
      })
    );
  }

  handleNewTransaction(type, amount, userId) {
    const date = Date.now();
    const newTransaction = new this.transModel({
      type: type,
      date: date,
      amount: amount,
      userId: userId,
    });
    newTransaction.save();
    return newTransaction;
  }

  async fetchTransaction(userId) {
    const transactions = await this.transModel.find({ userId: userId });
    return transactions;
  }
}

module.exports = TransModel;
