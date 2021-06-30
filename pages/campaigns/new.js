import React, { useState, useEffect } from "react";
import { Button, Form, Input, Message, Icon } from "semantic-ui-react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";

const INITIAL_TRANSACTION_STATE = {
  loading: "",
  error: "",
  success: "",
};

//Hosts the top level layout of our app
const CampaignNew = (props) => {
  const router = useRouter();
  const [minumumContribution, setMinimumContribution] = useState("");
  const [transactionState, setTransactionState] = useState(
    INITIAL_TRANSACTION_STATE
  );
  const { loading, error, success } = transactionState;

  const onSubmit = async (event) => {
    event.preventDefault();
    //There's definitely a better way to use loading,error,success surely
    setTransactionState({
      ...INITIAL_TRANSACTION_STATE,
      loading: "Transaction is processing....",
    });
    const accounts = await web3.eth.getAccounts();
    await factory.methods
      .createCampaign(minumumContribution)
      .send({
        //no need to specify gas amount -metamask does this
        from: accounts[0],
      })
      .then((res) => {
        console.log(res);
        const etherscanLink = `https://rinkeby.etherscan.io/tx/${res.transactionHash}`;
        setTransactionState({
          ...INITIAL_TRANSACTION_STATE,
          success: (
            <a href={etherscanLink} target="_blank">
              View the transaction on Etherscan
            </a>
          ),
        });
        router.push("/");
      })
      .catch((err) => {
        console.log(err);
        setTransactionState({
          ...INITIAL_TRANSACTION_STATE,
          error: err.message,
        });
      });
    setMinimumContribution("");
  };

  const renderMessage = () => {
    return (
      <Message icon negative={Boolean(error)} success={Boolean(success)}>
        <Icon
          name={
            loading ? "circle notched" : error ? "times circle" : "check circle"
          }
          loading={Boolean(loading)}
        />
        <Message.Content>
          {Boolean(success) && (
            <Message.Header>Transaction Success!</Message.Header>
          )}
          {loading ? loading : error ? error : success}
        </Message.Content>
      </Message>
    );
  };

  return (
    <Layout>
      <h1>Create a Campaign</h1>
      <Form onSubmit={onSubmit}>
        <Form.Field>
          <label>Minumum Contribution</label>
          <Input
            label="wei"
            labelPosition="right"
            focus
            type="number" // enforce number only content
            min="0" //enforce positive numbers only
            disabled={Boolean(loading)} //disable input if loading
            value={minumumContribution}
            onChange={(e) => setMinimumContribution(e.target.value)}
          />
        </Form.Field>
        <Button color="teal" disabled={Boolean(loading)}>
          Create!
        </Button>
      </Form>
      {Boolean(loading || error || success) && renderMessage()}
    </Layout>
  );
};

export default CampaignNew;
