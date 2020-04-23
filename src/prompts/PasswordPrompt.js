import React, { useState } from "react";
import PropTypes from "prop-types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";

import { useUniversalLogin, useAction } from "../auth0";
import {
  Button,
  Form,
  FormGroup,
  FormFeedback,
  Input,
  InputGroup,
  InputGroupAddon,
  FormText
} from "reactstrap";
import { connection } from "../propTypes/connection";
import { useConnectionManager } from "../auth0/connections";
import { FormInputLabel } from "../components/FormInputLabel";
import { PromptHeader } from "../components/PromptHeader";
import { useForm } from "react-hook-form";

export function PasswordPrompt({ connection, identifier, onCancel }) {
  const conMan = useConnectionManager();
  const [, updateAction] = useAction();
  const [error, updateError] = useState(null);
  const [showPassword, updateShowPassword] = useState(false);
  const { register, handleSubmit } = useForm();
  const auth = useUniversalLogin();

  function toggle() {
    updateShowPassword(!showPassword);
  }

  /**
   *
   * @param {Event} e
   */
  async function onSubmit({ password }) {
    try {
      // Realm?
      // wait what?
      await auth.login({
        realm: connection.name,
        username: identifier,
        password
      });
    } catch (e) {
      updateError(e.description || e.message);
    }
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <PromptHeader onBackButton={onCancel} />
      <FormGroup>
        <FormText color="normal">
          Enter your Travel0 Account password for{" "}
          <span className="font-weight-bold">{identifier}</span>
        </FormText>
      </FormGroup>
      <FormGroup>
        <FormInputLabel>Password</FormInputLabel>
        <InputGroup>
          <Input
            id="password"
            name="password"
            innerRef={register({})}
            autoComplete="current-password"
            type={showPassword ? "text" : "password"}
            invalid={!!error}
          ></Input>
          <InputGroupAddon addonType="append">
            <Button onClick={toggle}>
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </Button>
          </InputGroupAddon>
          {error && <FormFeedback>{error}</FormFeedback>}
        </InputGroup>
        {conMan.allowsReset && (
          <div className="forget-password-link">
            <div className="float-right">
              <Button
                color="link px-0 ml-auto"
                onClick={() => updateAction("reset")}
              >
                <small>Forgot Password?</small>
              </Button>
            </div>
          </div>
        )}
      </FormGroup>
      <FormGroup className="mt-5 mb-3">
        <Button className="w-100 text-uppercase" color="primary">
          <small>Next</small>
        </Button>
      </FormGroup>
      {/*        
        Disabled because passwordlessEmail conflicts with other things, 

        {conMan.hasPasswordlessEmail && (
        <FormGroup>
          <Button className="w-100 text-uppercase" outline color="primary">
            Send me a Link
          </Button>
        </FormGroup>
      )}*/}
    </Form>
  );
}

PasswordPrompt.propTypes = {
  connection: connection,
  identifier: PropTypes.string
};
