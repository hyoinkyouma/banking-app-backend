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
      })
    );
  }
  async makeNewUser({ email, name, balance, accountType, accountNumber }) {
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
      });

      return await newUser.save();
    }
  }
}
module.exports = UserModel;
