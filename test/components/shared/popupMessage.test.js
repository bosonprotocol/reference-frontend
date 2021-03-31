import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "@testing-library/react";

import PopupMessage from "../../../src/components/shared/popup-message/PopupMessage";

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

describe("Component - Pop-up Message", () => {
  it("Expect pass - renders with correct text", () => {
    const messageText = "TEST - FAKE POP-UP MESSAGE";

    act(() => {
      render(<PopupMessage text={messageText} />, container);
    });

    expect(container.textContent).toBe(messageText);
  });

  it("Expect pass - renders with no text if nothing provided", () => {
    act(() => {
      render(<PopupMessage />, container);
    });

    expect(container.textContent).toBe(""); // expect empty text
  });
});
