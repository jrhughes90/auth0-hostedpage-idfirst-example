import React from "react";
import { Label } from "reactstrap";

export function FormInputLabel({ children }) {
  return (
    <Label className="text-muted text-uppercase">
      <small>
        <small>{children}</small>
      </small>
    </Label>
  );
}
