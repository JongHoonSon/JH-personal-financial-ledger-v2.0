const navOptions = document.querySelectorAll(".nav_option");

navOptions.forEach((el) => el.addEventListener("click", handleNavOptionClick));

function handleNavOptionClick(event) {
  event.target.classList.add("clicked");
}
