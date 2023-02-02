const pagination = document.getElementById("board-pagination");
const prevPageBtn = document.getElementById("board-pagination__prev-page-btn");
const nextPageBtn = document.getElementById("board-pagination__next-page-btn");

if (Number(pagination.dataset.curr_page_num) === 1) {
  prevPageBtn.href = "";
}

if (
  Number(pagination.dataset.curr_page_num) ===
  Number(pagination.dataset.last_page_num)
) {
  nextPageBtn.href = "";
}
