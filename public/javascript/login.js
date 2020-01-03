const loginForm = document.querySelector(".js-loginForm");
const idInput = loginForm.querySelector(".js-id");
const passwordInput = loginForm.querySelector(".js-password");
const msg = loginForm.querySelector(".js-loginMsg");
const memoDiv = document.querySelector(".js-memoDiv");
const loginDiv = document.querySelector(".js-loginDiv");
const memoTitle = memoDiv.querySelector(".js-memoTitle");

const ACCOUNTS_LS = "accounts";
let accounts = [];

function createAccount(id, pwd) {
    // 새로운 계정을 생성하는 함수
    // arg 1 : id ( 사용할 아이디 )
    // arg 2 : pwd ( 사용할 비밀번호 )
    const createdDate = new Date().toJSON();
    accountObj = {
        id,
        password : pwd,
        createdDate
    };
    accounts.push(accountObj);
    saveAccounts();
}

function loginAccount(id, pwd) {
    // 로그인 하는 함수
    // arg 1 : id ( 사용할 아이디 )
    // arg 2 : pwd ( 사용할 비밀번호 )
    loginDiv.classList.remove("showing");
    memoDiv.classList.add("showing");
    memoTitle.innerHTML = `${id}'s Small Memo`;
}

function checkAccount(id, pwd) {
    // 계정이 유효한지 판단하는 함수
    // 0 : 성공, 존재하는 계정
    // 1 : 성공, 존재하지 않는 계정
    // 2 : 실패, id와 pwd 불일치
    // 3 : 실패, id 혹은 pwd이 빈칸으로 존재
    if (id === "" || pwd === "") {
        return 3;
    }

    let flag = 1;

    accounts.some(function(account) {
        if (account.id === id && account.password === pwd) {
            flag = 0;
            return true;
        } else if ( account.id === id && account.password !== pwd) {
            flag = 2;
            return true;
        } else {
            return false;
        }
    });

    return flag;
}

function saveAccounts() {
    // 계정 정보를 저장하는 함수
    localStorage.setItem(ACCOUNTS_LS, JSON.stringify(accounts));
}

function loadAccounts() {
    // 기존의 계정 정보를 불러와 accounts에 저장하는 함수
    const loadedAccounts = localStorage.getItem(ACCOUNTS_LS);
    if (loadedAccounts === null) {
        saveAccounts();
    } else {
        accounts = JSON.parse(loadedAccounts);
    }
}

function handleLogin(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        // loginForm 에서 submit 이 발생했을 때 사용되는 핸들
        const currentId = idInput.value.trim();
        const currentPwd = passwordInput.value.trim();
        loadAccounts();
        const check = checkAccount(currentId, currentPwd);
        console.log(check);
        if (check === 0) {
            // 성공, 존재하는 계정
            loginAccount(currentId, currentPwd);
            msg.innerText = "";
        } else if(check === 1) {
            // 성공, 존재하지 않는 계정
            createAccount(currentId, currentPwd);
            loginAccount(currentId, currentPwd);
            msg.innerText = "";
        } else if(check === 2) {
            // 실패, id와 pwd 불일치
            msg.innerText = "올바른 id와 pwd를 입력해주세요.";
        } else if(check === 3) {
            // 실패, id 혹은 pwd 빈칸으로 존재
            msg.innerText = "id 혹은 pwd를 입력해주세요.";
        }
    }
}


function init() {
    idInput.addEventListener("keyup", handleLogin);
    passwordInput.addEventListener("keyup", handleLogin);
}

init();

// 1. 아이디와 비밀번호를 친다.
// 2. 그것이 존재하지 않는 계정이라면 아이디와 비밀번호를 토대로 생성한다.
// 3. 그것이 존재하는 계정이라면 아이디와 비밀번호가 유효한지 검사한다.
// 4. 만약 유효할 경우 로그인을 성공시킨다.
// 5. 만약 유효하지 않을 경우 실패 메세지를 띄운다.