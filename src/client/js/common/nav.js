const navOptions = document.querySelectorAll(".nav_option");

navOptions.forEach((el) => console.log(el.classList));

navOptions.forEach((el) =>
  el.addEventListener("click", handleNavOptionClicked)
);

function handleNavOptionClicked(event) {
  console.log(event);
  event.target.classList.add("clicked");
}
