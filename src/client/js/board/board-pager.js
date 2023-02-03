const pagination = document.getElementById("board-pagination");
const prevPageButton = document.getElementById(
  "board-pagination__prev-page-button"
);
const nextPageButton = document.getElementById(
  "board-pagination__next-page-button"
);

if (Number(pagination.dataset.curr_page_num) === 1) {
  prevPageButton.href = "";
}

if (
  Number(pagination.dataset.curr_page_num) ===
  Number(pagination.dataset.last_page_num)
) {
  nextPageButton.href = "";
}
