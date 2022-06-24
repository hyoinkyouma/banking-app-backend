const fs = require("fs");
const path = require("path");
const https = require("https");

const fetchExchangeRates = (cb) => {
  console.log("Enter fetchExchangeRates\t[Ok]");

  return https.get(
    "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/php.json",
    (response) => {
      let data = "";
      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("end", () => {
        const dataJSON = JSON.parse(data);
        getCurrencyCodes();

        console.log("End fetchExchangeRates\t\t[Ok]");
        cb(dataJSON);
      });
    }
  );
};

const getCurrencyCodes = () => {
  console.log("\x1b[0m", "Enter Get Currency Code\t[Ok]");

  const codes = fs.readFileSync(
    path.join(__dirname, "data", "currencyList.json")
  );
  const codesJSON = JSON.parse(codes);
  console.log("End Get Currency Code\t\t[Ok]");

  return codesJSON;
};

const exchangeRates = (cb) => {
  const currencyObjKey = {};

  const currencies = getCurrencyCodes();
  fetchExchangeRates((data) => {
    let exchangeRatesPeso = data;
    for (const currency in currencies) {
      const currencyObj = {
        rate: exchangeRatesPeso.php[currency],
        currency: currencies[currency],
        code: currency,
      };
      currencyObjKey[currency] = currencyObj;
    }
    cb(currencyObjKey);
  });
};

module.exports = { exchangeRates };
