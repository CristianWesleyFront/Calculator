import React from "react";
import PointTarget from "react-point";

import "./styles.css";

function Button({ text, type, onPress }) {
  return (
    <PointTarget onPoint={onPress}>
      <button className={`button ${type}`}>{text}</button>
    </PointTarget>
  );
}

export default Button;
