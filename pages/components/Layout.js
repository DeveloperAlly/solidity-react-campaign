import React from "react";
import { Container } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import Header from "./Header";
import Footer from "./Footer";

//Hosts the top level layout of our app
const Layout = (props) => {
  return (
    <Container>
      <Header />
      {props.children}
      {/* <Footer /> */}
    </Container>
  );
};

export default Layout;
