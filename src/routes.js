const { Router } = require("express");
const { exchangeRates } = require("./externalRequest");
router = Router();
const UserModel = require("./models");

router.get("/exchangeRate", (req, res) => {
  exchangeRates((data) => {
    console.log("\x1b[32m", "Enter Exchange Rate\t\t[Ok]");
    res.json({ RatePeso: data });
    console.log("\x1b[32m", "End Exchange Rate\t\t[Ok]");
    console.log("\x1b[36m%s\x1b[0m", "Result: ");
    console.table(data);
    console.log("\x1b[32m", "End Route Exchange Rate\t[Ok]");
  });
});
router.get("/newUser", async (req, res) => {
  const user = userModel.makeNewUser({
    email: "roman.cabalum@gmail.com",
    name: "Roman Cabalum",
    balance: 56000,
    accountType: "Savings Account",
    accountNumber: "3600 4445 9997 8546",
  });
  console.log(await user);
});

console.log("\x1b[32m", "Enter initModelsMongoose\t[OK]");
const userModel = new UserModel();
module.exports = router;
