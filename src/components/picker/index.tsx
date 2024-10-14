import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import Decimal from "decimal.js";
import Scale from "./scale";
import useCorrectedRange from "./useCorrectedRange";

interface Props {
  label: string;
  min?: string;
  max?: string;
  value?: string;
  step?: string;
}

const Picker: React.FC<Props> = ({
  label,
  min = "0",
  max = "1000000",
  value,
  step = "1",
}) => {
  const [internalValue, setInternalValue] = useState<string | null>(null);

  const [decimalMin, decimalMax] = useCorrectedRange(min, max, step);
  const decimalStep = new Decimal(step);

  useEffect(() => {
    if (value !== undefined) {
      const parsedValue = parseFloat(value);

      if (typeof value === 'string' && !isNaN(parsedValue) && parsedValue > 0) {
        setInternalValue(parsedValue.toString());
      } else {
        setInternalValue(decimalMin.toString());
      }
    }
  }, [value, decimalMin]);

  const validateValue = (newValue: string | null) => {
    if (newValue === null || newValue.trim() === "") {
      return decimalMin.toString();
    }

    const currentValue = new Decimal(newValue);

    if (
      !currentValue.isFinite() ||
      currentValue.isNaN() ||
      !newValue.match(/^\d*\.?\d*$/)
    ) {
      return decimalMin.toString();
    } else if (currentValue.lessThan(decimalMin)) {
      return decimalMin.toString();
    } else if (currentValue.greaterThan(decimalMax)) {
      return decimalMax.toString();
    }

    return currentValue.toString();
  };

  const handleBlur = () => {
    const correctedValue = validateValue(internalValue);
    setInternalValue(correctedValue);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    const pointCount = value.split(".").length - 1;
    if (pointCount <= 1) {
      setInternalValue(value);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const currentValue = new Decimal(internalValue || "0");

    if (
      !/^\d$/.test(event.key) &&
      event.key !== "." &&
      !["Backspace", "Delete", "ArrowLeft", "ArrowRight"].includes(event.key)
    ) {
      event.preventDefault();
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      const newValue = currentValue.plus(decimalStep).toString();
      setInternalValue(validateValue(newValue));
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      const newValue = currentValue.minus(decimalStep).toString();
      setInternalValue(validateValue(newValue));
    }
  };

  return (
    <div id="picker">
      <div className={styles.picker}>
        <input
          className={styles.input}
          type="text"
          value={internalValue || ""}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder="0.00"
          size={internalValue ? internalValue.length : 3}
        />

        <span className={styles.label}>{label}</span>
      </div>

      {decimalMin && decimalMax && decimalStep && (
        <Scale
          decimalMin={decimalMin}
          decimalMax={decimalMax}
          decimalStep={decimalStep}
          value={internalValue}
          onSelect={(v: string) => setInternalValue(v)}
        />
      )}
    </div>
  );
};

export default Picker;
