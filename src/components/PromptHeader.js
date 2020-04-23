import React from "react";
import { CardTitle } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { useConfig, useAction } from "../auth0";

export function PromptHeader({ onBackButton }) {
  const config = useConfig();
  const [action] = useAction();
  const { title, icon } = config;
  return (
    <div className="title-section">
      <CardTitle className="mt-1 mb-4 text-truncate" tag="h4">
        {onBackButton && (
          <FontAwesomeIcon
            className="mr-2"
            style={{
              cursor: "pointer"
            }}
            onClick={onBackButton}
            icon={faAngleLeft}
          />
        )}
        <img
          width={32}
          height={32}
          src={icon}
          className="mr-2"
          alt={`Logo for ${title}`}
        />
        {title}{" "}
      </CardTitle>
      <h6 className="text-capitalize">{action}</h6>
    </div>
  );
}
