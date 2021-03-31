import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "@testing-library/react";

import CardBlock from "../../../src/components/home/card-block/CardBlock";

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

describe("Component - Card Block", () => {
  it("Expect pass - renders with correct category", () => {
    const category = "New";
    const categoryWrong = "Old";

    act(() => {
      render(<CardBlock category={category} />, container);
    });

    expect(container.textContent).toBe(category);
    expect(container.textContent).not.toBe(categoryWrong);
  });
});
