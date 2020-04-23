import React, { useState } from "react";
import {
  Button,
  Form,
  FormGroup,
  FormText,
  Input,
  FormFeedback
} from "reactstrap";
import { useConnectionManager } from "../auth0/connections";
import { FormInputLabel } from "../components/FormInputLabel";
import { validateEmail, useUniversalLogin, useAction } from "../auth0";
import { PromptHeader } from "../components/PromptHeader";
import { useForm } from "react-hook-form";

export function ResetPrompt() {
  const conMan = useConnectionManager();
  const auth = useUniversalLogin();

  const [error, updateError] = useState(null);
  const [result, updateResult] = useState(null);
  const [, updateAction] = useAction();
  const { register, handleSubmit } = useForm();

  async function onSubmit({ identifier }) {
    try {
      if (!validateEmail(identifier)) {
        updateError("Please enter a valid Email");
      }
      const res = await auth.changePassword({
        email: identifier,
        connection: conMan.getDatabaseConnection().name
      });

      updateResult(res);
    } catch (e) {
      updateError(
        e.description || e.message || "Unknown Error, please try again!"
      );
    }
  }

  if (result) {
    return (
      <div className="reset-view">
        <div>{result}</div>
      </div>
    );
  }

  return (
    <Form className="reset-view" onSubmit={handleSubmit(onSubmit)}>
      <PromptHeader onBackButton={() => updateAction("login")} />
      <FormGroup>
        <FormText color="normal">
          Enter your Travel0 Account email address
        </FormText>
      </FormGroup>
      <FormGroup>
        <FormInputLabel>Email</FormInputLabel>
        <Input
          autoComplete="email"
          invalid={!!error}
          innerRef={register({})}
          name="identifier"
          id="identifier"
        />
        <FormFeedback>{error}</FormFeedback>
      </FormGroup>
      <FormGroup>
        <Button className="w-100 text-uppercase" color="primary">
          <small>Send Reset Email</small>
        </Button>
      </FormGroup>
    </Form>
  );
}
