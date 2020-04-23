import React, { useState } from "react";
import {
  Button,
  Form,
  FormGroup,
  Input,
  FormFeedback,
  FormText
} from "reactstrap";
import { useForm } from "react-hook-form";

import { useConnectionManager } from "../auth0/connections";
import { SocialButtons } from "../components/SocialButtons";
import { FormInputLabel } from "../components/FormInputLabel";
import { useAction, useConfig } from "../auth0";
import { PromptHeader } from "../components/PromptHeader";

export function IdentifierPrompt({ onIdPSelected }) {
  const conMan = useConnectionManager();
  const [error, updateError] = useState();
  const [action] = useAction();
  const config = useConfig();
  const { extraParams = {} } = config;
  const { login_hint: loginHint = "" } = extraParams;
  const { handleSubmit, register } = useForm();
  const shouldShowIdentifier =
    conMan &&
    (conMan.hasPasswordlessEmail || conMan.hasDatabase || conMan.hasDomains);
  const identifierLabel = [
    conMan.hasPasswordlessPhone && "Phone Number",
    shouldShowIdentifier && "Email",
    conMan.hasUsernameConnections && "Username"
  ]
    .filter(x => Boolean(x))
    .join(" or ");

  async function onSubmit({ identifier }) {
    console.log(arguments);
    try {
      const idp = await conMan.getIdP(identifier);
      if (idp != null) {
        return onIdPSelected(identifier, idp);
      }
      updateError("Please enter a valid " + identifierLabel);
    } catch (e) {
      updateError(
        e.description || e.message || "Unknown Error, please try again!"
      );
    }
  }

  return (
    <Form className="challenge-view" onSubmit={handleSubmit(onSubmit)}>
      <PromptHeader />
      <FormGroup>
        <FormText>
          {action === "signup"
            ? `Create an account to use Travel0 services.`
            : `You can sign in using your Travel0 Account to access our services.`}
        </FormText>
      </FormGroup>
      {shouldShowIdentifier ? (
        <>
          <FormGroup>
            <FormInputLabel>{identifierLabel}</FormInputLabel>
            <Input
              defaultValue={loginHint}
              id="identifier"
              name="identifier"
              autoComplete="on"
              innerRef={register({})}
              invalid={!!error}
            />
            <FormFeedback>{error}</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Button color="primary" className="w-100 text-uppercase">
              <small>Next</small>
            </Button>
          </FormGroup>
        </>
      ) : (
        ""
      )}

      {conMan.hasSocial && shouldShowIdentifier ? (
        <FormGroup className="my-5">
          <hr />
          {/** Update this to use proper styling for this */}
          <p
            className="d-inline bg-white px-2"
            style={{ position: "absolute", marginTop: "-1.84rem", left: "28%" }}
          >
            <small>or use a social provider</small>
          </p>
        </FormGroup>
      ) : (
        ""
      )}

      {conMan.hasSocial ? (
        <SocialButtons strategies={conMan.socialConnections} />
      ) : (
        ""
      )}
    </Form>
  );
}
