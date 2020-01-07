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
const memoSort = document.getElementById("js-sort");
const searchInput = document.querySelector(".js-search");
const toggleButton = document.querySelector(".js-toggle");
const sortMenu = document.querySelector(".js-section.collapsible");

const loginForm = document.querySelector(".js-loginForm");
const idInput = loginForm.querySelector(".js-id");
const passwordInput = loginForm.querySelector(".js-password");
const msg = loginForm.querySelector(".js-loginMsg");
const memoDiv = document.querySelector(".js-memoDiv");
const loginDiv = document.querySelector(".js-loginDiv");
const logoutBtn = document.querySelector(".js-logoutBtn");
const mainTitle = document.querySelector(".js-mainTitle");

let loggedInId = "";
let memos = [];
let isNew = true;