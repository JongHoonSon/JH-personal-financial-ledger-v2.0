const $nav_options = document.querySelectorAll(".nav_option");

$nav_options.forEach((el) => console.log(el.classList));

$nav_options.forEach((el) =>
  el.addEventListener("click", handleNavOptionClicked)
);

function handleNavOptionClicked(event) {
  console.log(event);
  event.target.classList.add("clicked");
}
