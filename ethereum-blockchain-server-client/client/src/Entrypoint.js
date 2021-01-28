import { ChakraProvider, CSSReset } from "@chakra-ui/core";
import theme from "@chakra-ui/theme";
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import DevicePage from "./DevicePage";
import LoginPage from "./LoginPage";

const EntryPoint = () => {
  return (
    <ChakraProvider theme={theme}>
      <CSSReset />
      <Router>
        <Switch>
          <Route exact path="/" component={LoginPage} />
          <Route exact path="/smartHome" component={DevicePage} />
        </Switch>
      </Router>
    </ChakraProvider>
  );
};

export default EntryPoint;
