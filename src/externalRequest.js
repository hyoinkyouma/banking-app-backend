const fs = require("fs");
const path = require("path");
const https = require("https");

const fetchExchangeRates = (cb) => {
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

        cb(dataJSON);
      });
    }
  );
};

const getCurrencyCodes = () => {
  const codes = fs.readFileSync(
    path.join(__dirname, "data", "currencyList.json")
  );
  const codesJSON = JSON.parse(codes);
  return codesJSON;
};

const exchangeRates = (cb) => {
  const exchangeRateArr = [];
  const currencies = getCurrencyCodes();
  fetchExchangeRates((data) => {
    let exchangeRatesPeso = data;
    for (const currency in currencies) {
      const currencyObj = {
        rate: exchangeRatesPeso.php[currency],
        currency: currencies[currency],
      };
      exchangeRateArr.push(currencyObj);
    }
    cb(exchangeRateArr);
  });
};

module.exports = { exchangeRates };
