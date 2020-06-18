import React, { useState, useEffect, useCallback } from "react";

import "./App.css";

// Chamada de componentes
import Card from "./components/Card";
import Button from "./components/Button";

function App() {
  const [diplay, setDiplay] = useState("0");
  const [value, setValue] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const InputDisplay = ({ value }) => {
    const language = navigator.language || "en-US";
    let formattedValue = parseFloat(value).toLocaleString(language, {
      useGrouping: true,
      maximumFractionDigits: 6,
    });

    // Add back missing .0 in e.g. 12.0
    const match = value.match(/\.\d*?(0*)$/);

    if (match) formattedValue += /[1-9]/.test(match[0]) ? match[1] : match[0];

    return <input value={formattedValue} />;
  };

  const CalculatorOperations = {
    "/": (prevValue, nextValue) => prevValue / nextValue,
    "*": (prevValue, nextValue) => prevValue * nextValue,
    "+": (prevValue, nextValue) => prevValue + nextValue,
    "-": (prevValue, nextValue) => prevValue - nextValue,
    "=": (prevValue, nextValue) => nextValue,
  };

  const clearAll = () => {
    setDiplay("0");
    setValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };
  const clearDisplay = () => {
    setDiplay("0");
  };
  const clearLastChar = useCallback(() => {
    setDiplay(diplay.substring(0, diplay.length - 1) || "0");
  }, [diplay]);
  const toggleSign = () => {
    const newValue = parseFloat(diplay) * -1;

    setDiplay(String(newValue));
  };
  const inputPercent = useCallback(() => {
    const currentValue = parseFloat(diplay);

    if (currentValue === 0) return;

    const fixedDigits = diplay.replace(/^-?\d*\.?/, "");
    const newValue = parseFloat(diplay) / 100;

    setDiplay(String(newValue.toFixed(fixedDigits.length + 2)));
  }, [diplay]);
  const inputDot = useCallback(() => {
    if (!/\./.test(diplay)) {
      setDiplay(diplay + ".");
      setWaitingForOperand(false);
    }
  }, [diplay]);
  const inputDigit = useCallback(
    (digit) => {
      if (waitingForOperand) {
        setDiplay(String(digit));
        setWaitingForOperand(false);
      } else {
        diplay === "0" ? setDiplay(String(digit)) : setDiplay(diplay + digit);
      }
    },
    [diplay, waitingForOperand]
  );
  const performOperation = useCallback(
    (nextOperator) => {
      const inputValue = parseFloat(diplay);

      if (value == null) {
        setValue(inputValue);
      } else if (operator) {
        const currentValue = value || 0;
        const newValue = CalculatorOperations[operator](
          currentValue,
          inputValue
        );
        setValue(newValue);
        setDiplay(String(newValue));
      }

      setWaitingForOperand(true);
      setOperator(nextOperator);
    },
    [CalculatorOperations, diplay, operator, value]
  );

  const handleKeyDown = useCallback(
    (event) => {
      let { key } = event;

      if (key === "Enter") key = "=";

      if (/\d/.test(key)) {
        event.preventDefault();
        inputDigit(parseInt(key, 10));
      } else if (key in CalculatorOperations) {
        event.preventDefault();
        performOperation(key);
      } else if (key === ".") {
        event.preventDefault();
        inputDot();
      } else if (key === "%") {
        event.preventDefault();
        inputPercent();
      } else if (key === "Backspace") {
        event.preventDefault();
        clearLastChar();
      } else if (key === "Clear") {
        event.preventDefault();

        if (diplay !== "0") {
          clearDisplay();
        } else {
          clearAll();
        }
      }
    },
    [
      CalculatorOperations,
      clearLastChar,
      diplay,
      inputDigit,
      inputDot,
      inputPercent,
      performOperation,
    ]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className="App">
      <Card>
        <div className="container">
          <div className="row row1">
            <InputDisplay value={diplay} />
          </div>

          <div className="row row2">
            <Button
              text={diplay !== "0" ? "C" : "AC"}
              type="actions"
              onPress={() => (diplay !== "0" ? clearDisplay() : clearAll())}
            />
            <Button text="±" type="actions" onPress={() => toggleSign()} />
            <Button text="%" type="actions" onPress={() => inputPercent()} />
            <Button
              text="÷"
              type="operations"
              onPress={() => performOperation("/")}
            />
          </div>
          <div className="row row3">
            <Button text="7" type="numbers" onPress={() => inputDigit(7)} />
            <Button text="8" type="numbers" onPress={() => inputDigit(8)} />
            <Button text="9" type="numbers" onPress={() => inputDigit(9)} />
            <Button
              text="X"
              type="operations"
              onPress={() => performOperation("*")}
            />
          </div>
          <div className="row row4">
            <Button text="4" type="numbers" onPress={() => inputDigit(4)} />
            <Button text="5" type="numbers" onPress={() => inputDigit(5)} />
            <Button text="6" type="numbers" onPress={() => inputDigit(6)} />
            <Button
              text="-"
              type="operations"
              onPress={() => performOperation("-")}
            />
          </div>
          <div className="row row5">
            <Button text="1" type="numbers" onPress={() => inputDigit(1)} />
            <Button text="2" type="numbers" onPress={() => inputDigit(2)} />
            <Button text="3" type="numbers" onPress={() => inputDigit(3)} />
            <Button
              text="+"
              type="operations"
              onPress={() => performOperation("+")}
            />
          </div>
          <div className="row row6">
            <Button text="0" type="numbers" onPress={() => inputDigit(0)} />
            <Button text="●" type="numbers" onPress={() => inputDot()} />
            <Button
              text="="
              type="operations"
              onPress={() => performOperation("=")}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}

export default App;
