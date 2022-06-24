const { json } = require("body-parser");
const { Router } = require("express");
const { exchangeRates } = require("./externalRequest");
router = Router();

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

module.exports = router;
