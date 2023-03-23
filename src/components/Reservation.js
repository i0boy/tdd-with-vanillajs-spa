import { fetchReservations } from "src/service/reservation";
/**
 * @typedef { { reservations:  Reservation[]} } Products
 * @typedef {{ id: string ; name: string ;qty: number}} Menu

@typedef {{
    id: number
    floor: number
    name: string
    min: number
    max: number
  }} Table
  
  
  
  @typedef {{
    id: string
    name: string
    level: string
    timeVisitedLast: string
    adult: number
    child: number
    memo: string
    request: string
  }} Customer
  
   @typedef {{
  id: string
  status: string
  timeRegistered: string
  timeReserved: string
  customer: Customer
  tables: Table[]
  menus: Menu[]
  }} Reservation
   */

/**  *
 * @param {{$target :HTMLElement }} param
 */
export default function ReservationDataProvider({ $target }) {
  const initState = async () => {
    const reservations = await fetchReservations();
    if (!reservations) return;
    ReservationContainer({
      $target,
      initialState: {
        reservations:
          reservations?.reservations.filter((d) => d.status !== "done") || [],
        infoState: {
          open: false,
          reservation: reservations?.reservations.filter(
            (d) => d.status !== "done"
          )?.[0],
        },
      },
    });
  };
  initState();
}
/**  *
 * @param {{$target :HTMLElement ; initialState : {reservations : Reservation[] , infoState : {reservation:Reservation; open:boolean}}}} param
 */
export function ReservationContainer({ $target, initialState }) {
  let state = initialState;
  const $reservation = document.createElement("div");
  $reservation.className = "ReservationWrapper";
  $target.appendChild($reservation);
  $reservation.addEventListener("click", (e) => {
    if (e.target === $reservation) return;
    if (!(e.target instanceof Element)) return;
    const $li = e.target.closest(`.Reservation`);
    if (!($li instanceof HTMLLIElement)) return;
    const { reservationId } = $li?.dataset;
    if (e.target.classList.contains("Reservation__button")) {
      setState({
        ...state,
        reservations: state.reservations.map((d) =>
          d.id === reservationId
            ? { ...d, status: d.status === "seated" ? "done" : "seated" }
            : d
        ),
      });
      return;
    }
    setState({
      ...state,
      infoState: {
        reservation: state.reservations.filter(
          (d) => d.id === reservationId
        )?.[0],
        open: true,
      },
    });
  });

  $reservation.addEventListener("click", (e) => {
    if (!(e.target instanceof Element)) return;
    if (
      e.target.classList.contains("ReservationInfo__group-button") ||
      e.target.classList.contains("Dim__overlay")
    ) {
      setState({
        ...state,
        infoState: {
          ...state.infoState,
          open: false,
        },
      });
    }
  });
  const setState = (nextState) => {
    state = nextState;
    render();
  };
  function render() {
    $reservation.innerHTML = "";
    if (state.reservations) {
      ReservationList({
        $target: $reservation,
        initialState: state?.reservations,
      });
    }
    if (state?.infoState) {
      ReservationInfo({
        $target: $reservation,
        initialState: state?.infoState,
      });
    }
  }
  render();
}

/**
 *
 * @param {{$target :HTMLDivElement,initialState :Reservation[]}} param
 */
export function ReservationList({ $target, initialState }) {
  let state = initialState;
  const $productList = document.createElement("ul");
  $productList.className = "ReservationList";
  $target.appendChild($productList);
  function render() {
    if (!state) {
      return;
    }
    $productList.innerHTML = `
        ${state
          .filter((d) => d.status !== "done")
          .map(
            (reservation) =>
              `
            <li class="Reservation"  data-reservation-id="${reservation.id}">
                <div class="Reservation__label-group">
                <span>
                    ${formatTime(reservation.timeReserved)}
                </span>
                    <span class="${reservation.status}">
                    ${reservationStatusMap[reservation.status]}
                    </span>
                </div>
                <div class="Reservation__label-group Reservation__label-group--center ">
                <span class="Reservation__label">${
                  reservation.customer.name
                } - ${reservation.tables.map((d) => d.name).join(", ")}</span>
                <span class="Reservation__label">성인 ${seatFormat(
                  reservation.customer.adult
                )} 아이 ${seatFormat(reservation.customer.child)}</span>
                <span class="Reservation__label">${reservation.menus
                  .map((d) => `${d.name}(${d.qty})`)
                  .join(", ")}</span>
                </div>
                <button class="Reservation__button" data-testid="reservationButton">
                ${reservationButtonLabelMap[reservation?.status]}
                </button>
            </li>
          `
          )
          .join("")}`;
  }
  render();
}

const formatTime = (timestamp) => timestamp.slice(-8, -3);

const reservationStatusMap = {
  done: "완료",
  reserved: "예약",
  seated: "착석 중",
};

const reservationButtonLabelMap = {
  done: "완료",
  reserved: "착석",
  seated: "퇴석 ",
};

const seatFormat = (num) => `0${num}`.slice(-2, 2);

/**
 *
 * @param {{$target :HTMLDivElement,initialState :  {reservation:Reservation,open:boolean}}} param
 */
export function ReservationInfo({ $target, initialState }) {
  const $reservationInfo = document.createElement("div");
  $reservationInfo.dataset.testid = "ReservationInfo";
  $reservationInfo.className = `ReservationInfo ${
    initialState.open ? "open" : ""
  }`;
  const $dim = document.createElement("div");
  $dim.className = `Dim ${initialState.open ? "open" : ""}`;
  const $dimOverlay = document.createElement("div");
  $dimOverlay.className = `Dim__overlay ${initialState.open ? "open" : ""}`;
  $dimOverlay.dataset.testid = "DimOverlay";
  $dim.appendChild($dimOverlay);
  $dim.appendChild($reservationInfo);
  $target.appendChild($dim);
  let state = initialState;

  function render() {
    if (!state) {
      return;
    }
    $reservationInfo.innerHTML = `
    <div class="ReservationInfo__group">
    <h2 class="ReservationInfo__heading Heading">예약 정보
    <button class="ReservationInfo__group-button" id="closeButton">닫기</button>
    </h2>

    <div class="ReservationInfo__description">
        <div class="ReservationInfo__description--label">예약 상태</div>
        <div  class="ReservationInfo__description--value">                    <span class="${
          initialState.reservation.status
        }">
        ${reservationStatusMap[initialState.reservation.status]}
        </span></div>
    </div>
    <div class="ReservationInfo__description">
    <div class="ReservationInfo__description--label">예약 시간</div>
    <div  class="ReservationInfo__description--value">${formatTime(
      initialState.reservation.timeReserved
    )}</div>
</div>
<div class="ReservationInfo__description">
<div class="ReservationInfo__description--label">접수 시간</div>
<div  class="ReservationInfo__description--value">${formatTime(
      initialState.reservation.timeRegistered
    )}</div>
</div>
</div>



<div class="ReservationInfo__group">
<h2 class="ReservationInfo__heading Heading">고객 정보</h2>
<div class="ReservationInfo__description">
    <div class="ReservationInfo__description--label">고객 성명</div>
    <div  class="ReservationInfo__description--value">${
      initialState.reservation.customer.name
    }</div>
</div>
<div class="ReservationInfo__description">
<div class="ReservationInfo__description--label">고객 등급</div>
<div  class="ReservationInfo__description--value">${
      initialState.reservation.customer.level
    }</div>
</div>
<div class="ReservationInfo__description">
<div class="ReservationInfo__description--label">고객 메모</div>
<div  class="Reservation__description--value-maxrow3">${
      initialState.reservation.customer.memo
    }</div>
</div>
</div>

    <div class="ReservationInfo__group">
    <div class="ReservationInfo__description">
    <div class="ReservationInfo__description--label">요청사항</div>
    <div  class="Reservation__description--value-maxrow3">${
      initialState.reservation.customer.request
    }</div>
    </div>
    </div>

    `;
  }
  render();
}
