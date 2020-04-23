import React, { useState } from "react";
import { SolutionView } from "./VerificationPrompt";
import { IdentifierPrompt } from "./IdentifierPrompt";
import { useUniversalLogin } from "../auth0";

const IDENTIFIER = Symbol("identifier mode");
const VERIFIER = Symbol("verifier mode");

export function RegistrationPrompt() {
  const [currentStage, updateStage] = useState(IDENTIFIER);
  const [idp, updateIdp] = useState(null);
  const [identifier, updateIdentifier] = useState(null);
  const auth = useUniversalLogin();

  switch (currentStage) {
    case IDENTIFIER:
      return (
        <IdentifierPrompt
          onIdPSelected={(identifier, selectedIdp) => {
            const { strategy } = selectedIdp;
            if (!["auth0", "sms", "email"].includes(strategy)) {
              return auth.federate({
                connection: selectedIdp.name
              });
            }
            updateIdentifier(identifier);
            updateIdp(selectedIdp);
            updateStage(VERIFIER);
          }}
        />
      );
    case VERIFIER:
      return (
        <SolutionView
          identifier={identifier}
          connection={idp}
          onCancel={() => {
            updateStage(IDENTIFIER);
          }}
        />
      );
    default:
      updateStage(IDENTIFIER);
      break;
  }
}
