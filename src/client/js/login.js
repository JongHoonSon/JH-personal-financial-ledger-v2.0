const loginInputs = document.querySelectorAll(".login-input__input");
const loginIuputButtonShows = document.querySelectorAll(
  ".login-input__button-show"
);

// 기능 1. input이 focus될 때, 입력한 것이 있으면 Clear 버튼 보여주기

const handleLoginInputFocus = (event) => {
  // 사용자가 로그인 정보를 입력하는 input 태그 (login-input__input)
  const loginInput = event.target;

  // input 태그 (login-input__input)의 값
  const input_value = event.target.value;

  // login-input을 감싸는 div 태그 (login-input__wrap)
  const loginInputWrap = loginInput.parentElement;

  // login-input의 값을 삭제하는 button 태그 (login-input__button-clear)
  const loginInputButtonClear = loginInputWrap.childNodes[1];

  // loginInputButtonClear의 icon 태그
  const loginInputButtonClearIcon = loginInputButtonClear.childNodes[0];

  // input이 비어있다면
  if (input_value === "") {
    // Clear button이 안보이도록 hidden 클래스 추가
    loginInputButtonClear.classList.add("hidden");

    // input이 비어있지 않다면 (무언가가 입력된 상태)
  } else {
    // Clear button이 안보이도록 hidden 클래스 삭제
    loginInputButtonClear.classList.remove("hidden");

    // Clear button 클릭 시 input 내용을 삭제하는 이벤트 리스너 등록
    loginInputButtonClearIcon.addEventListener("click", function () {
      loginInput.value = "";
      loginInputButtonClear.classList.add("hidden");
    });
  }
};

loginInputs.forEach((el) =>
  el.addEventListener("focus", handleLoginInputFocus)
);

// 기능 2. input이 focusout될 때, Clear 버튼 감추기

const handleLoginInputFocusout = (event) => {
  // 사용자가 로그인 정보를 입력하는 input 태그 (login-input__input)
  const loginInput = event.target;

  // login-input을 감싸는 div 태그 (login-input__wrap)
  const loginInputWrap = loginInput.parentElement;

  // login-input의 값을 삭제하는 button 태그 (login-input__button-clear)
  const loginInputButtonClear = loginInputWrap.childNodes[1];

  // Clear button이 안보이도록 hidden 클래스 추가
  loginInputButtonClear.classList.add("hidden");
};

loginInputs.forEach((el) =>
  el.addEventListener("focusout", handleLoginInputFocusout)
);

// 기능 3. input의 값이 변경될 때(input이벤트 발생), 값의 길이가 1 이상이면 Clear 버튼을 보여주고, 0이면 Clear 버튼 감추기

const handleLoginInputInput = (event) => {
  // 사용자가 로그인 정보를 입력하는 input 태그 (login-input__input)
  const loginInput = event.target;

  // input 태그 (login-input__input)의 값
  const input_value = event.target.value;

  // login-input을 감싸는 div 태그 (login-input__wrap)
  const loginInputWrap = loginInput.parentElement;

  // login-input의 값을 삭제하는 button 태그 (login-input__button-clear)
  const loginInputButtonClear = loginInputWrap.childNodes[1];

  // loginInputButtonClear의 icon 태그
  const loginInputButtonClearIcon = loginInputButtonClear.childNodes[0];

  // input이 비어있다면
  if (input_value === "") {
    // Clear button이 안보이도록 hidden 클래스 추가
    loginInputButtonClear.classList.add("hidden");

    // input이 비어있지 않다면 (무언가가 입력된 상태)
  } else {
    // Clear button이 안보이도록 hidden 클래스 삭제
    loginInputButtonClear.classList.remove("hidden");

    // Clear button 클릭 시 input 내용을 삭제하는 이벤트 리스너 등록
    loginInputButtonClearIcon.addEventListener("click", function () {
      loginInput.value = "";
      loginInputButtonClear.classList.add("hidden");
    });
  }
};

loginInputs.forEach((el) =>
  el.addEventListener("input", handleLoginInputInput)
);

// 기능 4. Show 버튼 클릭 시 입력한 것을 보여주는 기능 (Show 버튼은 type="password"인 input의 wrap 태그에만 포함되어 있음)

const handleLoginInputButtonEyeClick = (event) => {
  // 사용자가 입력한 login-input__input의 값을 보이게 하는 button 태그 (login-input__button-show)
  // (실제로 클릭된 요소는 icon 태그이므로 parentElement를 이용해서 부모 태그인 button 태그를 가져옴)
  const loginInputButtonEye = event.target.parentElement;

  // loginInputButtonEye의 icon 태그
  const loginInputButtonEyeIcon = loginInputButtonEye.childNodes[0];

  // login-input__button-show를 감싸는 div 태그 (login-input__wrap)
  const loginInputWrap = loginInputButtonEye.parentElement;

  // 사용자가 로그인 정보를 입력하는 input 태그 (login-input__input)
  const loginInput = loginInputWrap.childNodes[0];

  if (loginInput.type === "password") {
    loginInput.type = "text";
    loginInputButtonEyeIcon.classList.add("fa-eye-slash");
    loginInputButtonEyeIcon.classList.remove("fa-eye");
  } else if (loginInput.type === "text") {
    loginInput.type = "password";
    loginInputButtonEyeIcon.classList.add("fa-eye");
    loginInputButtonEyeIcon.classList.remove("fa-eye-slash");
  }
};

loginIuputButtonShows.forEach((el) =>
  el.addEventListener("click", handleLoginInputButtonEyeClick)
);
