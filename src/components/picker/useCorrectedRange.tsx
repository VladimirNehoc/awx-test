import { useMemo } from "react";
import Decimal from "decimal.js";

const useCorrectedRange = (
  min: string,
  max: string,
  step: string
): [Decimal, Decimal] => {
  return useMemo(() => {
    let stepDecimal = new Decimal(isNaN(parseFloat(step)) || parseFloat(step) <= 0 ? 1 : parseFloat(step));
    let minDecimal = new Decimal(isNaN(parseFloat(min)) ? 1 : parseFloat(min));
    let maxDecimal = new Decimal(isNaN(parseFloat(max)) ? minDecimal.plus(stepDecimal) : parseFloat(max));

    if (stepDecimal.lte(0)) {
      stepDecimal = new Decimal(1);
    }

    if (minDecimal.gte(maxDecimal)) {
      maxDecimal = minDecimal.plus(stepDecimal);
    }

    const range = maxDecimal.minus(minDecimal);
    if (range.lt(stepDecimal)) {
      maxDecimal = minDecimal.plus(stepDecimal);
    }

    const minRemainder = minDecimal.mod(stepDecimal);
    if (!minRemainder.isZero()) {
      minDecimal = minDecimal.minus(minRemainder).plus(stepDecimal);
    }

    const maxRemainder = maxDecimal.mod(stepDecimal);
    if (!maxRemainder.isZero()) {
      maxDecimal = maxDecimal.minus(maxRemainder);
    }

    return [minDecimal, maxDecimal];
  }, [min, max, step]);
};

export default useCorrectedRange;
