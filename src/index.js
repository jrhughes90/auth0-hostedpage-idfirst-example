import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.css";
import "./index.css";
import { App } from "./App";

window.LoginWidget = class LoginWidget {
  init(opts) {
    const pageConfig = opts.pageConfig;
    if (!pageConfig) {
      throw new Error("pageConfig must be provided in opts");
    }

    ReactDOM.render(
      <App theme={{ primaryColor: "#b04023" }} pageConfig={pageConfig} />,
      document.getElementById("root")
    );
  }
};
