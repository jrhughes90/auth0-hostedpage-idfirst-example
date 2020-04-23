import React, { useState } from "react";
import PropTypes from "prop-types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";

import { useUniversalLogin } from "../auth0";
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
import { useForm } from "react-hook-form";

import { connection } from "../propTypes/connection";
import { FormInputLabel } from "../components/FormInputLabel";
import { PromptHeader } from "../components/PromptHeader";

export function PasswordSignupPrompt({ connection, identifier, onCancel }) {
  const [error, updateError] = useState(null);
  const [showPassword, updateShowPassword] = useState(false);
  const auth = useUniversalLogin();
  const { handleSubmit, register } = useForm();

  function toggle() {
    updateShowPassword(!showPassword);
  }

  /**
   *
   * @param {Event} e
   */
  async function onSubmit(data) {
    console.log(data);
    try {
      // Connection?
      // wait what?
      await auth.signup({
        connection: connection.name,
        email: identifier,
        password: data.password,
        given_name: data.givenname,
        family_name: data.familyname
      });

      // Realm?
      // wait what?
      await auth.login({
        realm: connection.name,
        username: identifier,
        password: data.password
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
          Enter details to finish signing up as{" "}
          <span className="font-weight-bold">{identifier}</span>
        </FormText>
      </FormGroup>
      <FormGroup>
        <FormInputLabel>First Name</FormInputLabel>
        <Input
          id="given_name"
          name="given_name"
          autoComplete="given_name"
          type="text"
          innerRef={register({})}
        />
      </FormGroup>
      <FormGroup>
        <FormInputLabel>Last Name</FormInputLabel>
        <Input
          id="family_name"
          name="family_name"
          autoComplete="family_name"
          type="text"
          innerRef={register({})}
        />
      </FormGroup>
      <FormGroup>
        <FormInputLabel>Password</FormInputLabel>
        <InputGroup>
          <Input
            id="password"
            name="password"
            autoComplete="new-password"
            type={showPassword ? "text" : "password"}
            invalid={!!error}
            innerRef={register({})}
          ></Input>
          <InputGroupAddon addonType="append">
            <Button onClick={toggle}>
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </Button>
          </InputGroupAddon>
          {error && <FormFeedback>{error}</FormFeedback>}
        </InputGroup>
      </FormGroup>
      <FormGroup className="mt-5 mb-3">
        <FormText className="text-center my-3">
          By clicking "Signup" you accept the terms and conditions and the
          privacy policy of Travel0
        </FormText>
        <Button className="w-100 text-uppercase" color="primary">
          <small>Get Started</small>
        </Button>
      </FormGroup>
    </Form>
  );
}

PasswordSignupPrompt.propTypes = {
  connection: connection,
  identifier: PropTypes.string
};
