import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button } from "reactstrap";
import { ReactComponent as RightArrow } from "open-iconic/svg/arrow-right.svg";
import Loading from "./Loading";

export default function AppButton({ disabled, arrow, ...props }) {
  return (
    <Button {...props}>
      {this.props.children}
      {this.props.disabled && <Loading />}
      {arrow && !this.props.disabled && <RightArrow className="icon" />}
    </Button>
  );
}

AppButton.propTypes = {
  disabled: PropTypes.bool,
  arrow: PropTypes.bool
};
