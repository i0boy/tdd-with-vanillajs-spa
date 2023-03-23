import {
  getByText,
  queryAllByText,
  queryByText,
  getAllByText,
  screen,
  waitFor,
  queryAllByTestId,
  getByTestId,
  fireEvent,
} from "@testing-library/dom";
import matchers from "@testing-library/jest-dom/matchers";
import { beforeEach, describe, expect, it, beforeAll, afterAll } from "vitest";
import { setupServer } from "msw/node";
import { handlers } from "src/mocks/handlers";
import reservations from "src/mocks/reservations.json";
// extends Vitest's expect method with methods from react-testing-library
expect.extend(matchers);

import App from "src/App";
import {
  ReservationList,
  ReservationContainer,
} from "src/components/Reservation";

let container;
const data = reservations?.reservations;
describe("Reservation.js", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    container = document.body;
  });

  it("예약 상태를 표출한다.", async () => {
    ReservationList({
      $target: container,
      initialState: data?.filter((d) => d.status !== "done"),
    });
    expect(queryByText(container, "완료")).not.toBeInTheDocument();
    const labels = ["예약", "착석 중"];
    labels.forEach((label) => {
      expect(queryAllByText(container, label).length).not.toBe(0);
    });
  });
  it("예약 상태를 버튼에 반영한다. - 착석", async () => {
    ReservationList({
      $target: container,
      initialState: data?.filter((d) => d.status === "reserved"),
    });
    const buttons = queryAllByTestId(container, "reservationButton");
    expect(
      queryAllByTestId(container, "reservationButton").filter((d) =>
        d.textContent.includes("착석")
      ).length
    ).toBe(buttons.length);

    // ReservationList({
    //   $target: container,
    //   initialState: data?.filter((d) => d.status === "seated"),
    // });
    // expect(queryAllByText(container, "퇴석").length).not.toBe(0);
  });
  it("예약 상태를 버튼에 반영한다. - 퇴석", async () => {
    ReservationList({
      $target: container,
      initialState: data?.filter((d) => d.status === "seated"),
    });
    const buttons = queryAllByTestId(container, "reservationButton");
    expect(
      queryAllByTestId(container, "reservationButton").filter((d) =>
        d.textContent.includes("퇴석")
      ).length
    ).toBe(buttons.length);
  });

  it("착석 및 퇴석 버튼", async () => {
    ReservationContainer({
      $target: container,
      initialState: {
        reservations: data?.filter((d) => d.status === "reserved").slice(0, 1),
        infoState: {
          open: false,
          reservation: data?.filter((d) => d.status === "reserved")[0],
        },
      },
    });

    let button = getByTestId(container, "reservationButton");
    expect(getByText(button, "착석")).toBeInTheDocument();
    fireEvent.click(button);

    button = getByTestId(container, "reservationButton");
    expect(button.textContent.includes("퇴석")).toBeTruthy();
    fireEvent.click(button);
    expect(button).not.toBeInTheDocument();
  });

  it("반응형 - open 클래스 토글", async () => {
    ReservationContainer({
      $target: container,
      initialState: {
        reservations: data?.filter((d) => d.status === "reserved").slice(0, 1),
        infoState: {
          open: false,
          reservation: data?.filter((d) => d.status === "reserved")[0],
        },
      },
    });
    global.innerWidth = 500;
    global.dispatchEvent(new Event("resize"));
    const item = getAllByText(container, "예약")[0];
    expect(item).toBeInTheDocument();
    fireEvent.click(item);
    let reservationInfo = getByTestId(container, "ReservationInfo");
    expect(reservationInfo).toBeInTheDocument();
    expect(reservationInfo.classList.contains("open")).toBeTruthy();
    const diimOverlay = getByTestId(container, "DimOverlay");
    fireEvent.click(diimOverlay);
    reservationInfo = getByTestId(container, "ReservationInfo");
    expect(reservationInfo.classList.contains("open")).not.toBeTruthy();
  });
});
