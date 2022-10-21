const modalOpenButton = document.querySelector(".modal__open-button");

console.log("modalOpenButton");
console.log(modalOpenButton);

// 모달창을 띄우는 버튼 클릭시
const handleModalOpen = (event) => {
  console.log("handleModalOpen");

  // 모달 버튼의 부모(relative)에 position: static 적용하기 (relative가 적용되어 있으면 화면상에 노출됨)
  const modalOpenButtonParent = document.querySelector(
    ".modal__open-button__parent"
  );
  modalOpenButtonParent.style.position = "static";

  // 전체 모달을 감싸는 .modal__wrap에 display: block으로 적용해서 보이게 하기 (원래는 display: none이 적용되어 있음)
  const modalWrap = document.querySelector(".modal__wrap");
  modalWrap.style.display = "block";

  // body 태그 스크롤 기능 끄기
  document.body.style.overflow = "hidden";

  // 모달 백그라운드 클릭 시 모달창 닫기
  const modalBackground = document.querySelector(".modal__background");

  modalBackground.addEventListener("click", () => {
    modalOpenButtonParent.style.position = "relative";
    modalWrap.style.display = "none";
    document.body.style.overflow = "auto";
    window.location.reload();
  });

  const modalBodyWrap = document.querySelector(".modal__body__wrap");

  modalBodyWrap.addEventListener("click", () => {
    console.log("modalBodyWrap clicked");
  });
};

modalOpenButton.addEventListener("click", handleModalOpen);
