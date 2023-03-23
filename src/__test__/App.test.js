import { getByText, screen, waitFor } from "@testing-library/dom";
import matchers from "@testing-library/jest-dom/matchers";
import { beforeEach, describe, expect, it, vi } from "vitest";
// extends Vitest's expect method with methods from react-testing-library
expect.extend(matchers);

import App from "src/App";
let container;

describe("App.js", () => {
  beforeEach(() => {
    container = document.body;
    window.alert = vi.fn();
  });

  it("renders well", async () => {
    const title = "예약 목록";
    App({ $target: container });
    await waitFor(() =>
      expect(getByText(container, title)).toBeInTheDocument()
    );
  });
});
