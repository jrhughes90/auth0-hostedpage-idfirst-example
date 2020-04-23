import "./App.css";

import React from "react";
import PropTypes from "prop-types";
import {
  UniversalLoginProvider,
  ActionProvider,
  ConfigProvider
} from "./auth0";
import { ConnectionManagerProvider } from "./auth0/connections";
import { Widget } from "./prompts/Widget";

export function App({ theme, pageConfig }) {
  return (
    <ConfigProvider pageConfig={pageConfig}>
      <ActionProvider pageConfig={pageConfig}>
        <UniversalLoginProvider pageConfig={pageConfig}>
          <ConnectionManagerProvider pageConfig={pageConfig}>
            <Widget theme={theme} pageConfig={pageConfig} />
          </ConnectionManagerProvider>
        </UniversalLoginProvider>
      </ActionProvider>
    </ConfigProvider>
  );
}

App.propTypes = {
  theme: PropTypes.object.isRequired,
  pageConfig: PropTypes.object.isRequired
};
