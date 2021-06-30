/*
    This script does the following:
    1. Delete entire 'build' folder
    2. Read 'Campaign.sol' from the 'contracts folder
    3. Compile both contracts with solidity compiler
    4. Write output to the 'build' directory
*/

const path = require("path");
const fs = require("fs-extra"); // file system access
const solc = require("solc");

// 1. Delete entire 'build' folder
const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);

// 2. Read 'Campaign.sol' from the 'contracts folder
const campaignPath = path.resolve(__dirname, "contracts", "Campaign.sol");
const source = fs.readFileSync(campaignPath, "utf8");

const input = {
  language: "Solidity",
  sources: {
    "Campaign.sol": {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

console.log("compiling the contracts");
// 3. Compile both contracts with solidity compiler
const output = JSON.parse(solc.compile(JSON.stringify(input)));

if (output.errors) {
  output.errors.forEach((err) => {
    console.log(err.formattedMessage); //should send this to logs in build (not sure if below works)
    fs.writeFileSync(
      path.resolve(buildPath, "Errors.txt"),
      err.formattedMessage,
      "utf8"
    );
  });
} else {
  const contracts = output.contracts["Campaign.sol"];
  fs.ensureDirSync(buildPath);
  for (let contractName in contracts) {
    const contract = contracts[contractName];
    fs.writeFileSync(
      path.resolve(buildPath, `${contractName}.json`),
      JSON.stringify(contract, null, 2),
      "utf8"
    );
  }
}
