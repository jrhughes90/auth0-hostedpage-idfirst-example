import React, { Component } from "react";
import "./Loading.css";
import { ReactComponent as Cog } from "open-iconic/svg/cog.svg";

export default class Loading extends Component {
  render() {
    return <Cog className="loading rotate" />;
  }
}
