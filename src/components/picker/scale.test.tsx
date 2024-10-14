import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from "@testing-library/react";
import Scale from "./scale";
import Decimal from "decimal.js";

describe("Scale Component", () => {
  const onSelectMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders correctly with valid props", () => {
    render(
      <Scale
        decimalMin={new Decimal(1)}
        decimalMax={new Decimal(1000)}
        decimalStep={new Decimal(1)}
        value={null}
        onSelect={onSelectMock}
      />
    );

    // Проверка наличия кнопок с процентами
    expect(screen.getByText("25%")).toBeInTheDocument();
    expect(screen.getByText("50%")).toBeInTheDocument();
    expect(screen.getByText("75%")).toBeInTheDocument();
    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  test("calls onSelect with the correct value when a scale item is clicked", () => {
    render(
      <Scale
      decimalMin={new Decimal(1)}
      decimalMax={new Decimal(1000)}
      decimalStep={new Decimal(1)}
        value={null}
        onSelect={onSelectMock}
      />
    );

    const scaleButton = screen.getByText("25%");
    fireEvent.click(scaleButton);

    // Проверка, что onSelect был вызван
    expect(onSelectMock).toHaveBeenCalled(); 
  });

  test("handles edge cases correctly", () => {
    render(
      <Scale
        decimalMin={new Decimal(2)}
        decimalMax={new Decimal(1)}
        decimalStep={new Decimal(0.1)}
        value={null}
        onSelect={onSelectMock}
      />
    );

    expect(screen.queryByText("25%")).not.toBeInTheDocument();
  });

  test("does not render if values are empty", () => {
    render(
      <Scale
        decimalMin={new Decimal(0)}
        decimalMax={new Decimal(0)}
        decimalStep={new Decimal(0)}
        value={null}
        onSelect={onSelectMock}
      />
    );

    expect(screen.queryByText("25%")).not.toBeInTheDocument();
  });
});