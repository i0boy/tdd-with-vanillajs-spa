import Heading from "src/components/Heading";
import Reservation from "src/components/Reservation";

export default function App({ $target }) {
  Heading({ $target, initialState: { title: "예약 목록" } });
  Reservation({ $target });
}
