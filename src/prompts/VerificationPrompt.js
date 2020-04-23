import React from "react";
import { PasswordlessPrompt } from "./PasswordlessPrompt";
import { PasswordPrompt } from "./PasswordPrompt";
import { useAction } from "../auth0";
import { PasswordSignupPrompt } from "./PasswordSignupPrompt";

/**
 * Challenge / Solution Paradigm, Solution View
 * @param {*} param0
 */
export function SolutionView({ connection, identifier, onCancel }) {
  const [action] = useAction();
  switch (connection.strategy) {
    case "auth0":
      if (action === "signup") {
        return (
          <PasswordSignupPrompt
            onCancel={onCancel}
            identifier={identifier}
            connection={connection}
          />
        );
      }
      return (
        <PasswordPrompt
          onCancel={onCancel}
          identifier={identifier}
          connection={connection}
        />
      );
    case "sms":
    case "email":
      return (
        <PasswordlessPrompt
          identifier={identifier}
          connection={connection}
          onCancel={onCancel}
        ></PasswordlessPrompt>
      );
    default:
      return <div>Error, Unknown Connection</div>;
  }
}
