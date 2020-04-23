import React from "react";
import { Card, CardBody, Spinner } from "reactstrap";
import { useConnectionManager } from "../auth0/connections";
import { ViewFooter } from "../components/ViewFooter";
import { LoginPrompt } from "./LoginPrompt";
import { useAction } from "../auth0";
import { ResetPrompt } from "./ResetPrompt";
import { RegistrationPrompt } from "./RegistrationPrompt";
import { PromptHeader } from "../components/PromptHeader";

// const SIGNUP = Symbol("signup");
// const LOGIN = Symbol("login");
// const RESET = Symbol("reset");

/**
 * Master prompt manager
 *
 * It accepts most Auth0 Generates Page Config values +
 *
 * initialScreen : login | signup | reset
 */
export function Widget() {
  const loading = !useConnectionManager();
  const [action] = useAction();

  if (loading) {
    return (
      <Card className="shadow mx-auto my-4" style={{ width: "320px" }}>
        <CardBody>
          <PromptHeader />
          <div className="d-flex justify-content-center my-5">
            <Spinner className="" />
          </div>
          <ViewFooter />
        </CardBody>
      </Card>
    );
  }

  let subView = null;

  switch (action) {
    case "signup":
      subView = <RegistrationPrompt />;
      break;
    case "login":
      subView = <LoginPrompt />;
      break;
    case "reset":
      subView = <ResetPrompt />;
      break;
    default:
      subView = <div>Errors</div>;
      break;
  }

  return (
    <Card className="shadow mx-auto my-4" style={{ width: "320px" }}>
      <CardBody>
        {subView}
        <ViewFooter />
      </CardBody>
    </Card>
  );
}
