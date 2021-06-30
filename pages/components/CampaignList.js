import React, { useState, useEffect } from "react";
import { Card, Button, Icon } from "semantic-ui-react";
import factory from "../../ethereum/factory";

const CampaignList = ({ campaigns }) => {
  console.log("campaigns", campaigns);

  const items = campaigns.map((campaign) => {
    return {
      header: campaign,
      description: <a>link here</a>,
      fluid: true,
    };
  });
  return (
    <>
      <h1>Campaigns</h1>
      <Card.Group items={items} centered />
      <div style={{ marginTop: "20px" }}>
        <Button icon floated="right" color="teal" size="large">
          <Icon name="add circle" />
          {"   "}Create New Campaign
        </Button>
      </div>
    </>
  );
};

//uses server side rendering to call the campaign contracts (so good for slow devices)
CampaignList.getInitialProps = async () => {
  const campaigns = await factory.methods.getDeployedCampaigns().call();
  return { campaigns };
};

export default CampaignList;
