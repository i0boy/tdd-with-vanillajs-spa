import "./style.scss";
import App from "src/App.js";

const prepare = async () => {
  if (import.meta.env.DEV) {
    const { default: worker } = await import("./src/mocks/browser.js");
    worker.start();
  }
};

prepare().then(() => {
  App({ $target: document.querySelector("#app") });
});
