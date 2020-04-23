import React, { createContext, useContext, useState } from "react";
import { UniversalLogin } from "./UniversalLogin";

const ActionContext = createContext(null);
const UniversalLoginContext = createContext(null);
const PageConfigContext = createContext(null);

/**
 * Returns the current action
 *
 * @returns {["signup"|"reset"|"login", (updated: "signup" | "reset" | "login") => void]}
 */
export function useAction() {
  return useContext(ActionContext);
}

/**
 * Returns the page config
 *
 * @returns {Auth0PageConfig}
 */
export function useConfig() {
  return useContext(PageConfigContext);
}

export function ConfigProvider({ pageConfig, children }) {
  return (
    <PageConfigContext.Provider value={pageConfig}>
      {children}
    </PageConfigContext.Provider>
  );
}
/**
 * Provides overaching context map
 */
export function ActionProvider({ pageConfig, children }) {
  const [currentAction, updateAction] = useState(
    pageConfig.initialScreen || "login"
  );

  function safeUpdateAction(value) {
    if (!["signup", "login", "reset"].includes(value)) {
      throw new Error(`Invalid action: ${value}`);
    }
    updateAction(value);
  }

  return (
    <ActionContext.Provider value={[currentAction, safeUpdateAction]}>
      {children}
    </ActionContext.Provider>
  );
}

/**
 * Returns an instance of UniversalLogin capable of handling
 * current stuff/sceanrio
 *
 * @returns {UniversalLogin}
 */
export function useUniversalLogin() {
  return useContext(UniversalLoginContext);
}

export function UniversalLoginProvider({ children, pageConfig }) {
  return (
    <UniversalLoginContext.Provider value={new UniversalLogin(pageConfig)}>
      {children}
    </UniversalLoginContext.Provider>
  );
}
