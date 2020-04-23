import React, { createContext, useContext, useState, useEffect } from "react";
import { ConnectionManager } from "./ConnectionManager";

const ConnectionManagerContext = createContext(null);
const { Provider } = ConnectionManagerContext;

/**
 * Gets a list of connections enabled for a client
 * using Auth0's clients.js JSONP endpoint
 *
 * @todo Replace with Suspense later
 * @param pageConfig
 */
export function ConnectionManagerProvider({ pageConfig, children }) {
  const [conMan, updateConMan] = useState(null);
  useEffect(() => {
    (async () => {
      const newConMan = await ConnectionManager.create(pageConfig);
      updateConMan(newConMan);
    })();
  }, [pageConfig]);
  return <Provider value={conMan}>{children}</Provider>;
}

/**
 * @returns {ConnectionManager}
 */
export function useConnectionManager() {
  return useContext(ConnectionManagerContext);
}
