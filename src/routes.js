const { Router } = require("express");
const { exchangeRates } = require("./externalRequest");
router = Router();
const path = require("path");
const UserModel = require("./models");
const e = require("express");

router.get("/exchangeRate", (req, res) => {
  exchangeRates((data) => {
    console.log("\x1b[32m", "Enter Exchange Rate\t\t[Ok]");
    res.json({ RatePeso: data });
    console.log("\x1b[32m", "End Exchange Rate\t\t[Ok]");
    console.log("\x1b[36m%s\x1b[0m", "Result: ");
    console.table(data);
  });
  console.log("\x1b[32m", "End Route Exchange Rate\t[Ok]");
});
// router.get("/newUser", async (req, res) => {
//   const user = await userModel.makeNewUser({
//     name: "Roman Cabalum",
//     email: "roman.cabalum@gmail.com",
//     password: "1234",
//     balance: 62600,
//     accountNumber: "3600 4445 9997 8546",
//     accountType: "Savings Account",
//     accountId: 0,
//   });
//   res.json(user);
// });

router.post("/newUser", async (req, res) => {
  const reqBody = req.body;
  const user = await userModel.makeNewUser({
    name: reqBody.name,
    email: reqBody.email,
    password: reqBody.password,
    balance: 2500,
    accountNumber: reqBody.accountNumber,
    accountType: reqBody.accountType,
  });
  console.log("\x1b[32m", "Enter /newUser \t\t[Ok]");

  console.log(user.accountNumber);
  if (user !== "User already Exists") {
    res.sendFile(path.join(__dirname, "../public", "sucess.html"));
  } else {
    const string = encodeURIComponent("Email already exists");
    res.redirect("/newUser?Err=" + string);
  }
});
router.get("/newUser", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "register.html"));
});

router.post("/loginUserById", async (req, res) => {
  console.log("Enter /loginUser");
  try {
    const user = req.body.id;
    const userData = await userModel.findUserById(user);
    console.log(userData);
    res.send(userData);
  } catch (e) {
    console.log(e.toString());
    res.send({ Err: e.toString() });
  }
});

router.post("/loginUser", async (req, res) => {
  console.log("Enter /loginUser");
  try {
    const user = req.body;
    const userData = await userModel.findUserByCreds(user);
    console.log(userData);
    res.json(userData);
  } catch (e) {
    console.log(e);
    res.send({ err: e.toString() });
  }
});

router.post("/deposit", async (req, res) => {
  console.log("Enter /deposit");
  try {
    const newAmount = req.body.amount;
    const id = req.body.id;
    console.log(newAmount, id);
    const result = await userModel.deposit(id, newAmount);
    res.json(result);
  } catch (e) {
    res.send({ Err: e.toString() });
    console.log(e);
  }
});

console.log("\x1b[32m", "Enter initModelsMongoose\t[OK]");
const userModel = new UserModel();
module.exports = router;
