const { async } = require("regenerator-runtime");

// input 창에 입력 후 Enter 입력 시 버튼이 Click 되게 하는 코드

var addCategoryInput = document.getElementById(
  "user-own-categories__add-category__input"
);

addCategoryInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document
      .getElementById("user-own-categories__add-category__submit__icon")
      .click();
  }
});

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
const sumbitButtonIcon = document.getElementById(
  "user-own-categories__add-category__submit__icon"
);

sumbitButtonIcon.addEventListener("click", async (e) => {
  // 새로운 카테고리 이름 가져오기
  const categoryInput = document.getElementById(
    "user-own-categories__add-category__input"
  );

  const newCategoryName = categoryInput.value;

  if (newCategoryName === "") {
    alert("카테고리 이름을 입력해 주세요.");
    return;
  }

  // 현재 추가하려는 카테고리의 타입이 income 인지 expense 인지를 선택된 Tab의 data 값을 이용해 파악
  const selectedTab = document.querySelector(".selected-tab");

  const categoryType = selectedTab.dataset.category_type;

  const response = await fetch(`/user/category/${categoryType}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ newCategoryName }),
  });

  if (response.status === 200) {
    console.log("category added success");
    addNewCategory(categoryType, newCategoryName);
  }

  categoryInput.value = "";
});

const categoryDeleteBtnIcons = document.querySelectorAll(
  ".user-own-categories__category__del-btn__icon"
);

const handleDeleteCategory = async (event) => {
  const selectedTab = document.querySelector(".selected-tab");

  const categoryType = selectedTab.dataset.category_type;

  const categoryName = event.target.dataset.category;

  const response = await fetch(`/user/category/${categoryType}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ categoryName }),
  });

  if (response.status === 200) {
    removeDeletedCategory(event, categoryType);
    console.log("delete category success");
  }
};

categoryDeleteBtnIcons.forEach((el) => {
  el.addEventListener("click", handleDeleteCategory);
});

function addNewCategory(categoryType, newCategoryName) {
  // 새로 추가한 카테고리를 화면에 추가하기 위해 태그 만들기
  const divTag = document.createElement("div");
  divTag.classList.add("user-own-categories__category__wrap");

  const liTag = document.createElement("li");
  liTag.classList.add("user-own-categories__category");
  liTag.innerText = newCategoryName;

  const delButtonTag = document.createElement("button");
  delButtonTag.classList.add("user-own-categories__category__del-btn");

  const delIconTag = document.createElement("i");
  delIconTag.classList.add(
    "fa-solid",
    "fa-circle-minus",
    "user-own-categories__category__del-btn__icon"
  );
  delIconTag.dataset.category = newCategoryName;

  delIconTag.addEventListener("click", handleDeleteCategory);

  // 태그 연결하기
  let categoryList;

  if (categoryType === "i") {
    categoryList = document.getElementById("user-own-categories__income-list");
  } else {
    categoryList = document.getElementById("user-own-categories__expense-list");
  }

  categoryList.appendChild(divTag);
  divTag.appendChild(liTag);
  divTag.appendChild(delButtonTag);
  delButtonTag.appendChild(delIconTag);
}

function removeDeletedCategory(event, categoryType) {
  let categoryList;

  if (categoryType === "i") {
    categoryList = document.getElementById("user-own-categories__income-list");
  } else {
    categoryList = document.getElementById("user-own-categories__expense-list");
  }

  const deletedCategoryDiv = event.target.parentNode.parentNode;

  categoryList.removeChild(deletedCategoryDiv);
}
