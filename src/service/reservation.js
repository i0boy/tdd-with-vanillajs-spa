import request from "src/service/api";

/**
 * @typedef { { reservations:  Reservation[]} } Result
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

export async function fetchReservations() {
  const data = /**@type{Result}  */ (
    await request("/v1/store/9533/reservations")
  );
  return data;
}
