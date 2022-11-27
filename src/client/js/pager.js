const pagination = document.querySelector("#board-pagination");
const prevPageBtn = document.querySelector("#board-pagination__prev-page-btn");
const nextPageBtn = document.querySelector("#board-pagination__next-page-btn");

if (Number(pagination.dataset.thispagenum) === 1) {
  prevPageBtn.href = "";
}

if (
  Number(pagination.dataset.thispagenum) ===
  Number(pagination.dataset.lastpagenum)
) {
  nextPageBtn.href = "";
}
