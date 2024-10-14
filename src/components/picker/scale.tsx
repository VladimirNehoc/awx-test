import React, { useCallback, useEffect, useMemo, useState } from "react";
import Decimal from "decimal.js";

import styles from "./index.module.scss";

interface Props {
  decimalMin: Decimal;
  decimalMax: Decimal;
  decimalStep: Decimal;
  value: string | null;
  onSelect: (v: string) => void;
}

const scaleLabels = ["25%", "50%", "75%", "100%"];

const Scale: React.FC<Props> = ({
  decimalMin,
  decimalMax,
  decimalStep,
  value,
  onSelect,
}) => {
  const [values, setValues] = useState<Decimal[]>([]);

  useEffect(() => {
    const calculateValues = () => {
      const range = decimalMax.minus(decimalMin);
      const calculatedValues = [0.25, 0.5, 0.75, 1].map((percentage) => {
        const calculatedValue = decimalMin
          .plus(range.mul(percentage))
          .div(decimalStep)
          .floor()
          .mul(decimalStep);
        return calculatedValue;
      });

      const uniqueValues = Array.from(
        new Set(calculatedValues.map((val) => val.toString()))
      );

      if (uniqueValues.length === 4) {
        const validValues = calculatedValues.filter(
          (val) =>
            val.greaterThanOrEqualTo(decimalMin) &&
            val.lessThanOrEqualTo(decimalMax)
        );

        if (validValues.length === 4) {
          setValues(validValues);
          return;
        }
      }
      setValues([]);
    };

    calculateValues();
  }, [decimalMin, decimalMax, decimalStep]);

  const handleClickScaleItem = (index: number) => {
    if (values.length !== 0) {
      onSelect(values[index].toString());
    }
  };

  const currentPercentage = useMemo(() => {
    if (!value) return null;

    const currentValue = new Decimal(value);

    const range = decimalMax.minus(decimalMin);
    const currentPercentage = currentValue
      .minus(decimalMin)
      .div(range)
      .mul(100);

    return currentPercentage.lessThan(0)
      ? new Decimal(0)
      : currentPercentage.greaterThan(100)
      ? new Decimal(100)
      : currentPercentage;
  }, [value, decimalMin, decimalMax]);

  const getFillWidth = useCallback(
    (index: number) => {
      if (!currentPercentage) {
        return 0;
      }

      const targetRangeStart = index * 25;
      const targetRangeEnd = (index + 1) * 25;

      if (currentPercentage.greaterThanOrEqualTo(targetRangeEnd)) {
        return 100;
      } else if (currentPercentage.greaterThanOrEqualTo(targetRangeStart)) {
        const partialFill = currentPercentage.minus(targetRangeStart);
        return partialFill.div(25).mul(100).toNumber();
      } else {
        return 0;
      }
    },
    [currentPercentage]
  );

  if (values.length === 0) {
    return null;
  }

  return (
    <div className={styles.scaleWrapper}>
      {scaleLabels.map((label, index) => {
        const fillWidth = getFillWidth(index);

        return (
          <button
            tabIndex={index}
            key={index}
            className={styles.scaleBlock}
            style={{
              background: `linear-gradient(to right, #d9e6ff ${fillWidth}%, transparent ${fillWidth}%)`,
            }}
            onClick={() => handleClickScaleItem(index)}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default Scale;
