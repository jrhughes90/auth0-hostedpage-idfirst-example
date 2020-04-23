import React from "react";
import PropTypes from "prop-types";
import "./Header.css";

export function Header({ logo, clientName }) {
  return (
    <div className="nav">
      <img className="logo" src={logo} alt={clientName} />
    </div>
  );
}

Header.propTypes = {
  logo: PropTypes.string.isRequired,
  clientName: PropTypes.string.isRequired
};
