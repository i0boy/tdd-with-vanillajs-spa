/**
 * @typedef {{title:string}} State
 * @param {{$target :HTMLElement,initialState:State }} param
 */
export default function Heading({ $target, initialState }) {
  const $Heading = document.createElement("h1");
  $Heading.className = "Heading";
  $target.appendChild($Heading);

  function render() {
    $Heading.innerHTML = `<span>${initialState.title}</span>`;
  }
  render();
}
