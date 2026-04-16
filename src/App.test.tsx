import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders the new product-style shell", () => {
  render(<App mapsEnabled={false} />);

  expect(
    screen.getByRole("heading", { name: /find a great orlando meal faster/i })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: /pick tonight's spot/i })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("searchbox", { name: /search restaurants/i })
  ).toBeInTheDocument();
});
