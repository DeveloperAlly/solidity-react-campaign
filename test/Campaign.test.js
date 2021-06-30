const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const compiledCampaignFactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  // get list of accounts
  accounts = await web3.eth.getAccounts();

  // deploy factory contract using Contract constructor and passing in the compiled Contract abi (interface).
  factory = await new web3.eth.Contract(compiledCampaignFactory.abi)
    .deploy({ data: compiledCampaignFactory.evm.bytecode.object }) // Then deploy Contract to network
    .send({ from: accounts[0], gas: "1000000" });

  // Use factory to create an instance of the campaign (with a minContribution)
  await factory.methods.createCampaign("100").send({
    //NB: send() method used when mutating or creating data
    from: accounts[0],
    gas: "1000000",
  });

  // get the campaign address - the [campaignAddress] is es2016 syntax to get the first element from the returned array
  [campaignAddress] = await factory.methods.getDeployedCampaigns().call(); //NB: call() method used when viewing or fetching data - no mutating

  //Get the actual campaign now using the campaign Address
  campaign = await new web3.eth.Contract(
    compiledCampaign.abi,
    campaignAddress //use this to get a particular deployed version - when creating a new one - you don't use an address
  );
});

// Check that CampaignFactory and Campaign are successfully deployed by making sure they have an address assigned to them
describe("Campaigns", () => {
  it("deploys a factory and a campaign", () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it("marks caller as the campaign manager", async () => {
    const manager = await campaign.methods.manager().call();
    assert.strictEqual(accounts[0], manager);
  });

  it("allows people to contribute money and marks them as approvers", async () => {
    // create a campaign contributor
    await campaign.methods.contribute().send({
      value: "200", //minimumContribution set as 100 earlier
      from: accounts[1], // 10 accounts created by default by ganache
    });
    assert(await campaign.methods.approvers(accounts[1]).call()); //approvers method returns a bool
  });

  it("requires a minimum Contribution", async () => {
    // call contritbut function with less than the 100 defined minimum
    try {
      await campaign.methods.contribute().send({
        value: "500",
        from: accounts[1],
      });
    } catch (err) {
      assert.strictEqual(err.results.error === "revert");
    }
  });

  it("allows a manager to make a payment request", async () => {
    const DESC = "Buy Batteries";
    await campaign.methods
      .createRequest(DESC, "0", accounts[1]) //must use 0 as the value - as there's nothing in the contract - could put some in contract before testing this also
      .send({
        from: accounts[0], //the manager account
        gas: "1000000",
      });
    //   .then((res) => {
    //     console.log("res", res);
    //   })
    //   .catch((err) => {
    //     console.log("err", err);
    //   });
    //we get nothing back (unless use .then methodd) so we need to pull out this request contract to check - should be first request in array
    const request = await campaign.methods.requests(0).call();
    // console.log("req", request);

    assert.strictEqual(DESC, request.description);
  });

  it("end to end processes requests testing - create campaign, create request, approve request, finalise request", async () => {
    await campaign.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei("10", "ether"), //NEW method? eth`10` - doesn't seem to work
    });

    await campaign.methods
      .createRequest("reqDesc", web3.utils.toWei("5", "ether"), accounts[1])
      .send({
        from: accounts[0],
        gas: "1000000",
      });

    await campaign.methods.approveRequest(0).send({
      from: accounts[0],
      gas: "1000000",
    });

    await campaign.methods.finaliseRequest(0).send({
      from: accounts[0],
      gas: "1000000",
    });

    let balance = await web3.eth.getBalance(accounts[1]); //returns a string we need to convert to ether and then a number
    balance = web3.utils.fromWei(balance, "ether");
    balance = parseFloat(balance);

    assert(balance > 104); //original balance would be 100. Then added 5... so 104 should be fine minus gas fees
  });
});
