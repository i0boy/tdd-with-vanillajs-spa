import { getByText, screen } from "@testing-library/dom";
import matchers from "@testing-library/jest-dom/matchers";
import { beforeEach, describe, expect, it } from "vitest";
// extends Vitest's expect method with methods from react-testing-library
expect.extend(matchers);

import Heading from "src/components/Heading";
let container;

describe("Heading.js", () => {
  beforeEach(() => {
    container = document.body;
  });

  it("renders title", () => {
    const title = "Hello world";
    Heading({ $target: document.body, initialState: { title } });
    expect(getByText(document.body, title)).toBeInTheDocument();
    // screen.debug();
  });
});
