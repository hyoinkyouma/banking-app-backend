const mongoose = require("mongoose");

class UserModel {
  constructor() {
    this.userModel = mongoose.model(
      "user",
      new mongoose.Schema({
        name: String,
        email: String,
        balance: Number,
        accountNumber: String,
        accountType: String,
        accountId: Number,
        password: String,
      })
    );
  }
  async makeNewUser({
    email,
    name,
    balance,
    accountType,
    accountNumber,
    password,
  }) {
    if (await this.userModel.findOne({ email: email })) {
      return "User already Exists";
    } else {
      const newUser = new this.userModel({
        name: name,
        email: email,
        balance: balance,
        accountNumber: accountNumber,
        accountType: accountType,
        accountId: await this.userModel.countDocuments(),
        password: password,
      });

      return await newUser.save();
    }
  }
  async findUserById(id) {
    return await this.userModel.findOne({ _id: id });
  }
  async findUserByCreds({ email, password }) {
    const user = await this.userModel.findOne({ email: email });
    if (user === {} || user === null) return "Incorrect Email";
    if (user.password === password) {
      return user;
    } else return "Incorrect Password";
  }
  async deposit(id, amount) {
    await this.userModel.findOneAndUpdate(
      { _id: id },
      { $set: { balance: amount } }
    );
    return await this.userModel.findOne({ _id: id });
  }
  async findByAccNum(accNum) {
    return await this.userModel.findOne({ accountNumber: accNum });
  }
}
module.exports = UserModel;
