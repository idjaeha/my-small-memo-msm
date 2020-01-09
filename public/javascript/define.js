// 전역 변수를 선언하는 파일

const DB_URL = "http://id001.iptime.org:13000/api/";
// const DB_URL = "http://localhost:13000/api/";
const COLORS = ["red", "blue", "yellow", "green", "orange"];
const COLORS_NUM = COLORS.length;
const AUTOLOGIN_LS = "autoLogin";
const TITLE = "나의 작은 메모장";

const memoForm = document.querySelector(".js-memoForm");
const memoTextarea = memoForm.querySelector("textarea");
const memoInput = memoForm.querySelector("input");
const memoTable = document.querySelector(".js-memoTable");
const memoSort = document.querySelector(".js-sort");
const memoSubmitDiv = document.querySelector(".js-memoSubmitDiv");
const searchInput = document.querySelector(".js-search");
const colorPalette = document.querySelector(".js-colorPalette");
const colorChecker = document.querySelector(".js-colorChecker");
const backgroundForFocusing = document.querySelector(".js-backgroundForFocus");

const loginForm = document.querySelector(".js-loginForm");
const idInput = loginForm.querySelector(".js-id");
const passwordInput = loginForm.querySelector(".js-password");
const msg = loginForm.querySelector(".js-loginMsg");
const memoDiv = document.querySelector(".js-memoDiv");
const loginDiv = document.querySelector(".js-loginDiv");
const logoutBtn = document.querySelector(".js-logoutBtn");

let loggedInId = "";
let memos = [];
let currentColor = "";
let checkedColors = [];
let isNew = true;
let focusedDiv = null;

memoSubmitDiv.setAttribute("tabindex", "0");
