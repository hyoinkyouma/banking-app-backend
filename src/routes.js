const { Router } = require("express");
const { exchangeRates, fetchNews } = require("./externalRequest");
const router = Router();
const path = require("path");
const UserModel = require("./models");
const TransModel = require("./transModel");
const BudgetModel = require("./budgetModel");

const transModel = new TransModel();
const userModel = new UserModel();
const budgetModel = new BudgetModel();

router.get("/news", (req, res) => {
  console.log("\x1b[32m", "Enter /news \t\t\t [OK]");
  fetchNews((data) => {
    console.log("\x1b[32m", `News Data: \t\t [${data.status.toUpperCase()}]`);
    res.json(data);
  });
  console.log("\x1b[32m", "End /news \t\t [OK]");
});

router.get("/exchangeRate", (req, res) => {
  exchangeRates((data) => {
    console.log("\x1b[32m", "Enter Exchange Rate\t\t[Ok]");
    res.json({ RatePeso: data });
    console.log("\x1b[32m", "End Exchange Rate\t\t[Ok]");
    console.log("\x1b[36m%s\x1b[0m", "Result: ");
    console.log("\x1b[32m", `Exchange Rate Data: \t\t [OK]`);
  });
  console.log("\x1b[32m", "End Route Exchange Rate\t[Ok]");
});

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
    res.redirect("/sucess?Acc=" + user._id);
  } else {
    const string = encodeURIComponent("Email already exists");
    res.redirect("/newUser?Err=" + string);
  }
});
router.get("/sucess", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "sucess.html"));
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

router.post("/logTransaction", async (req, res) => {
  console.log("Enter /logTransaction \t\t [OK]");
  //
  const { type, amount, userId } = req.body;
  const newTrans = await transModel.handleNewTransaction(type, amount, userId);
  //
  console.log("New Transaction:");
  console.table(newTrans);
  //
  res.json({ status: true, transaction: newTrans });
});

router.post("/getRecords", async (req, res) => {
  console.log("Enter /getRecords \t\t [OK]");
  //
  const id = req.body.id;
  const recordArr = await transModel.fetchTransaction(id);
  console.log(recordArr);
  res.json({ transactions: recordArr });
});
router.post("/delRecords", async (req, res) => {
  console.log("Enter /delRecords \t\t [OK]");
  const id = req.body.id;
  console.log("User id: \t\t" + id);
  await transModel.clearTransactions(id);

  res.json({ transaction: null });
});

router.post("/findUserAccNum", async (req, res) => {
  console.log("Enter /findUserAccNum \t\t [OK]");
  try {
    const accNum = req.body.id;
    const response = await userModel.findByAccNum(accNum);
    console.log(response);
    res.json(response);
  } catch (e) {
    console.log("Error:" + e.toString());
  }
});

router.post("/transfer", async (req, res) => {
  console.log("Enter /transfer \t\t [OK]");
  try {
    const request = req.body;
    console.log("Response: \n" + request);

    const recUser = await userModel.findUserById(request.recId);

    await userModel.deposit(
      recUser._id,
      Number(recUser.balance) + Number(request.amount)
    );

    const response = await userModel.deposit(
      request.senderId,
      request.amountSend
    );
    res.json(response);
  } catch (e) {
    console.log("Exception /transfer \t\t [Err]");
    console.log(">" + e.toString());
  }
});

router.post("/logBudget", (req, res) => {
  budgetModel.logBudget(req.body, (data) => {
    console.log(data);
    res.json(data);
  });
});

router.post("/getBudget", (req, res) => {
  console.log("Enter /getBudget");
  budgetModel.fetchBudget(req.body.id, (data) => {
    console.log(data);
    res.json({ transactions: data });
  });
});

router.get("/", (req, res) => {
  res.redirect("http://localhost:3000");
});
module.exports = router;
