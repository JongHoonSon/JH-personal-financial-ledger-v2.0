const { async } = require("regenerator-runtime");

const categoryList = document.getElementById("user-category-list");
const categoryDeleteBtns = document.querySelectorAll(".category-delete-btn");

const categoryType = categoryList.dataset.categorytype;

const handleCategoryDeleteBtnClick = async (event) => {
  const categoryName = event.target.dataset.category;
  console.log("categoryName");
  console.log(categoryName);

  const response = await fetch(`/user/delete/category/${categoryType}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ categoryName }),
  });

  if (response.status === 200) {
    window.location.reload();
  }
};

categoryDeleteBtns.forEach((btn) => {
  btn.addEventListener("click", handleCategoryDeleteBtnClick);
});
