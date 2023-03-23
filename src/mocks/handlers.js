import { rest } from "msw";
import reservations from "src/mocks/reservations.json";
export const handlers = [
  // Handles a POST /login request

  // Handles a GET /user request
  rest.get("/v1/store/9533/reservations", (req, res, ctx) => {
    return res(ctx.json(reservations));
  }),
  rest.get(
    "http://localhost:5173/v1/store/9533/reservations",
    (req, res, ctx) => {
      return res(ctx.json(reservations));
    }
  ),
];
