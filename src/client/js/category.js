const { async } = require("regenerator-runtime");

// 수입 / 지출 카테고리 탭
const incomeTab = document.getElementById(
  "user-own-categories__nav__income-tab"
);
const expenseTab = document.getElementById(
  "user-own-categories__nav__expense-tab"
);

// 눌린 탭에 따라 바뀔 카테고리 목록의 Wrap
const incomeCategories = document.getElementById("user-own-categories__income");
const expenseCategories = document.getElementById(
  "user-own-categories__expense"
);

// 눌리는 탭에 따라 탭의 스타일과, 카테고리 목록의 Wrap의 display 속성값 교체 (none <-> block)

incomeTab.addEventListener("click", (e) => {
  expenseTab.classList.remove("selected-tab");
  incomeTab.classList.add("selected-tab");
  expenseCategories.style.display = "none";
  incomeCategories.style.display = "block";
});

expenseTab.addEventListener("click", (e) => {
  incomeTab.classList.remove("selected-tab");
  expenseTab.classList.add("selected-tab");
  incomeCategories.style.display = "none";
  expenseCategories.style.display = "block";
});

// 새로운 카테고리 추가 버튼
const sumbitButton = document.getElementById(
  "user-own-categories__add-category__submit"
);

sumbitButton.addEventListener("click", async (e) => {
  // 현재 추가하려는 카테고리의 타입이 income 인지 expense 인지를 선택된 Tab의 data 값을 이용해 파악
  const selectedTab = document.querySelector(".selected-tab");

  const categoryType = selectedTab.dataset.categorytype;

  // 새로운 카테고리 이름 가져오기
  const categoryInput = document.getElementById(
    "user-own-categories__add-category__input"
  );

  const newCategoryName = categoryInput.value;

  const response = await fetch(`/user/add/category/${categoryType}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ newCategoryName }),
  });

  if (response.status === 200) {
    console.log("category added success");
  }

  categoryInput.value = "";
});

// const categoryList = document.getElementById("user-category-list");
// const categoryDeleteBtns = document.querySelectorAll(".category-delete-btn");

// const categoryType = categoryList.dataset.categorytype;

// const handleCategoryDeleteBtnClick = async (event) => {
//   const categoryName = event.target.dataset.category;
//   console.log("categoryName");
//   console.log(categoryName);

//   const response = await fetch(`/user/delete/category/${categoryType}`, {
//     method: "DELETE",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ categoryName }),
//   });

//   if (response.status === 200) {
//     window.location.reload();
//   }
// };

// categoryDeleteBtns.forEach((btn) => {
//   btn.addEventListener("click", handleCategoryDeleteBtnClick);
// });
