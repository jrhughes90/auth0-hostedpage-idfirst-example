import React from "react";
import { Button, CardText } from "reactstrap";
import { useAction } from "../auth0";

export function ViewFooter() {
  const [action, updateAction] = useAction();
  switch (action) {
    case "login":
      return (
        <CardText className="muted text-center">
          <Button
            className="d-inline p-0 m-0"
            color="link"
            onClick={() => updateAction("signup")}
          >
            <small>Don't have an Account yet? Signup</small>
          </Button>
        </CardText>
      );
    case "signup":
      return (
        <CardText className="muted text-center">
          <Button
            className="d-inline p-0 m-0"
            color="link"
            onClick={() => updateAction("login")}
          >
            <small>Already have an Account? Login</small>
          </Button>
        </CardText>
      );
    case "reset":
      return <div />;

    // no default
  }
}
