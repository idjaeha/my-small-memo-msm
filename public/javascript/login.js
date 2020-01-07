function loginSuccessful(id, pwd) {
  // 로그인 성공시 불려지는 함수
  // arg 1 : id ( 사용할 아이디 )
  // arg 2 : pwd ( 사용할 비밀번호 )
  idInput.value = "";
  passwordInput.value = "";

  loginDiv.classList.remove("showing");
  memoDiv.classList.add("showing");
  mainTitle.innerText = `${id}의 작은 메모장`;
  loggedInId = id;
  const loginObj = {
    id,
    password: pwd
  };

  localStorage.setItem(AUTOLOGIN_LS, JSON.stringify(loginObj));
  loadMemosFromDB();
}

function tryToLogin(enteredId, enteredPwd) {
  // 계정 정보를 보냅니다.
  const url = `${DB_URL}login`;
  const data = {
    id: enteredId,
    password: enteredPwd,
    createdDate: new Date().getTime()
  };
  fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
    .then(response => {
      // 0 : 성공, 존재하는 계정
      // 1 : 성공, 존재하지 않는 계정
      // 2 : 실패, id와 pwd 불일치
      const check = response.check;
      if (check === 0 || check === 1) {
        // 성공
        loginSuccessful(enteredId, enteredPwd);
        msg.innerText = "";
      } else if (check === 2) {
        // 실패, id와 pwd 불일치
        msg.innerText = "올바른 id와 pwd를 입력해주세요.";
      }
    })
    .catch(error => console.error("Error:", error));
}

function autoLogin() {
  // 자동 로그인 여부에 대해 판단하는 함수
  const loadedAutoLogin = localStorage.getItem(AUTOLOGIN_LS);
  if (loadedAutoLogin !== null) {
    const parsedAccount = JSON.parse(loadedAutoLogin);
    tryToLogin(parsedAccount.id, parsedAccount.password);
  }
}

function handleLogin(event) {
  event.preventDefault();
  if (event.keyCode === 13) {
    // loginForm 에서 submit 이 발생했을 때 사용되는 핸들
    const enteredId = idInput.value.trim();
    const enteredPwd = passwordInput.value.trim();

    // 빈칸 방지
    if (enteredId === "" || enteredPwd === "") {
      msg.innerText = "id 혹은 pwd에 빈칸이 존재합니다.";
      return;
    }

    // 로그인 시도
    tryToLogin(enteredId, enteredPwd);
  }
}

function handleLogout(event) {
  // 로그아웃 버튼을 누르게 되면 발생하는 이벤트를 관리하는 핸들
  event.preventDefault();
  localStorage.removeItem(AUTOLOGIN_LS);

  loginDiv.classList.add("showing");
  memoDiv.classList.remove("showing");
  removeAllMemoDivs();
  loggedInId = "";
  memos = [];
  mainTitle.innerText = TITLE;
}

function init() {
  autoLogin();
  idInput.addEventListener("keyup", handleLogin);
  passwordInput.addEventListener("keyup", handleLogin);
  logoutBtn.addEventListener("click", handleLogout);
}

init();
