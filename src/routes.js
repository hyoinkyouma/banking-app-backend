const { json } = require("body-parser");
const { Router } = require("express");
const { exchangeRates } = require("./externalRequest");
router = Router();

router.get("/", (req, res) => {
  exchangeRates((data) => {
    res.json({ exchangeRatePeso: data });
  });
});

module.exports = router;
