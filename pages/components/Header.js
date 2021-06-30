import React from "react";
import { Menu, Icon } from "semantic-ui-react";
import { useRouter } from "next/router";

//Hosts the top level layout of our app
const Header = () => {
  const router = useRouter();
  return (
    <Menu style={{ marginTop: "1em" }}>
      <Menu.Item onClick={() => router.push("/")}>CrowdCoin</Menu.Item>
      <Menu.Menu position="right">
        <Menu.Item>Campaigns</Menu.Item>
        <Menu.Item onClick={() => router.push("/campaigns/new")}>
          <Icon name="add circle" />
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  );
};

export default Header;
