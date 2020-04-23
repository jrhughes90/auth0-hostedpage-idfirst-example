import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useUniversalLogin, useAction } from "../auth0";
import {
  Form,
  FormGroup,
  Input,
  Button,
  FormFeedback,
  FormText
} from "reactstrap";
import { connection } from "../propTypes/connection";
import { FormInputLabel } from "../components/FormInputLabel";
import { PromptHeader } from "../components/PromptHeader";
import { useForm } from "react-hook-form";

export function useCountDown(upto = 30, tick = 1000) {
  const [left, updateLeft] = useState(upto);
  useEffect(() => {
    const clearHandle = setInterval(() => {
      updateLeft(--upto);
      if (upto <= 0) {
        clearInterval(clearHandle);
      }
    }, tick);
  }, [tick, upto]);
  return left;
}

export function ButtonWithBackoff({
  maxRetries,
  onClick,
  children,
  waiting = x => `Perform in ${x} seconds`,
  onMaxAttempts,
  disabled,
  initial = 30,
  increment = 30,
  maxAttempts = 10,
  ...props
}) {
  const [attempt, updateAttempt] = useState(0);
  const left = useCountDown(initial + increment * attempt);

  function wrappedOnClick(e) {
    const ret = onClick(e);
    if (attempt + 1 < maxAttempts) {
      updateAttempt(attempt + 1);
    } else {
      onMaxAttempts();
    }
    return ret;
  }

  return (
    <Button disabled={disabled || left > 1} onClick={wrappedOnClick} {...props}>
      {left > 1 ? waiting(left) : children}
    </Button>
  );
}

async function resend(auth, identifier, strategy, connection, updateError) {
  try {
    await auth.passwordlessStart({
      [strategy === "sms" ? "phoneNumber" : "email"]: identifier,
      connection: connection.name,
      send: "code"
    });
  } catch (e) {
    updateError(e.description || e.message || e);
  }
}

export function PasswordlessPrompt({ connection, identifier, onCancel }) {
  const [error, updateError] = useState(null);
  const [action] = useAction();
  const auth = useUniversalLogin();
  const { strategy } = connection;
  const { register, handleSubmit } = useForm();

  useEffect(() => {
    resend(auth, identifier, strategy, connection, updateError);
  }, [auth, strategy, connection, identifier, updateError]);

  async function onSubmit({ code }) {
    try {
      await auth.passwordlessLogin({
        connection: connection.name,
        [strategy === "sms" ? "phoneNumber" : "email"]: identifier,
        verificationCode: code
      });
    } catch (e) {
      updateError(e.description || e.message || e);
    }
  }

  function maxSMSAttempts() {
    updateError("You have tried too many times, please try again in a while!");
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <PromptHeader onBackButton={onCancel} />
      <FormGroup>
        <FormText color="normal">
          We have sent a unique one time code to{" "}
          <span className="font-weight-bold">{identifier}</span> please enter
          the code to continue
        </FormText>
      </FormGroup>
      <FormGroup>
        <FormInputLabel>One time code</FormInputLabel>
        <Input
          id="code"
          name="code"
          autoComplete="one-time-code"
          type="text"
          placeholder="012345"
          invalid={!!error}
          innerRef={register({})}
        ></Input>
        <FormFeedback>{error}</FormFeedback>
        <div className="float-right">
          <ButtonWithBackoff
            color="link"
            className="px-0 mx-0"
            onClick={() => resend(auth, identifier, strategy, connection)}
            waiting={time => <small>We can send another code in {time}s</small>}
            onMaxAttempts={maxSMSAttempts}
          >
            <small>Resend Code</small>
          </ButtonWithBackoff>
        </div>
      </FormGroup>
      <FormGroup className="mt-5 mb-3">
        <Button className="w-100 text-uppercase" color="primary" type="submit">
          <small>{action || "Next"}</small>
        </Button>
      </FormGroup>
    </Form>
  );
}

PasswordlessPrompt.propTypes = {
  connection: connection,
  identifier: PropTypes.string
};
