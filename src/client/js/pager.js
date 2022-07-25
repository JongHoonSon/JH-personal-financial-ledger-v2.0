const pages = document.querySelector("#board-pages");
const prevPageBtn = document.querySelector(".prevPageBtn");
const nextPageBtn = document.querySelector(".nextPageBtn");

if (Number(pages.dataset.thispagenum) === 1) {
  prevPageBtn.href = "";
}

if (Number(pages.dataset.thispagenum) === Number(pages.dataset.lastpagenum)) {
  nextPageBtn.href = "";
}
