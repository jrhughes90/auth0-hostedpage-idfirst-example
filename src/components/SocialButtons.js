import React from "react";
import PropTypes from "prop-types";
// import { Button } from 'reactstrap';

import "./SocialButtons.css";
import { SocialStrategies } from "../auth0/SocialStrategies";
import { useUniversalLogin } from "../auth0";

export function SocialButtons({ strategies = [] }) {
  const auth = useUniversalLogin();

  function login(e, connection) {
    e.preventDefault();
    auth.federate(
      {
        connection
      },
      null,
      err => {
        alert(err);
      }
    );
  }

  const socialConnections = strategies.filter(s =>
    SocialStrategies.hasOwnProperty(s.strategy)
  );

  if (socialConnections.length === 0) {
    return <div />;
  }

  return (
    <div className="social-providers my-3">
      {socialConnections.map(s => (
        <button
          className="auth0-lock-social-button btn mb-2"
          data-provider={s.strategy}
          key={s.name}
          onClick={e => login(e, s.name)}
        >
          <div className="auth0-lock-social-button-icon" />
          <div className="auth0-lock-social-button-text">
            Continue with {SocialStrategies[s.strategy]}
          </div>
        </button>
      ))}
    </div>
  );
}

SocialButtons.propTypes = {
  strategies: PropTypes.array
};
