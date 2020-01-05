const memoForm = document.querySelector(".js-memoForm");
const memoTextarea = memoForm.querySelector("textarea");
const memoInput = memoForm.querySelector("input");
const memoTable = document.querySelector(".js-memoTable");
const memoSort = document.getElementById("js-sort");
const fax = document.querySelector("iframe");
const DB_URL = "http://id001.iptime.org:23000/api/";
// const DB_URL = "http://localhost:13000/api/";

const MEMOS_LS = "memos";
const COLORS = ["red", "blue", "yellow", "green", "orange"];
const COLORS_NUM = COLORS.length;

let memos = [];
let sort;

function deleteMemo(event) {
  event.preventDefault();
  const btn = event.target;
  const td = btn.parentNode;
  memoTable.removeChild(td);
  const cleanMemos = memos.filter(function(memo) {
    return memo.id !== td.id;
  });
  memos = cleanMemos;
  saveMemos();
}

function updateMemo(event) {
  event.preventDefault();
  const btn = event.target;
  const currentContent = btn.parentNode.querySelector("textarea").value;
  const currentTitle = btn.parentNode.querySelector("input").value;
  const currentDate = btn.parentNode.querySelector("h5");
  const currentId = btn.parentNode.id;

  const loadedMemos = localStorage.getItem(MEMOS_LS);
  const parsedMemos = JSON.parse(loadedMemos);
  const now = new Date();
  currentDate.innerHTML = getTime(now);

  parsedMemos.forEach(function(memo) {
    if (memo.id === currentId) {
      memo.title = currentTitle;
      memo.content = currentContent;
      memo.date = now;
    }
  });

  memos = parsedMemos;
  sortMemos(currentId);
  saveMemos();
  refreshMemos();
}

function removeAllMemos() {
  while (memoTable.hasChildNodes()) {
    memoTable.removeChild(memoTable.firstChild);
  }
}

function sortMemos(id) {
  //수정 후 바뀐 결과대로 정렬 (작성순)
  const index = memos.findIndex(i => i.id == id);
  const temp = memos[index];
  for (var i = 0; i < memos.length - index - 1; i++) {
    memos[index + i] = memos[index + i + 1];
  }
  memos[memos.length - 1] = temp;
}

function saveMemos() {
  // memos에 저장된 메모를 모두 저장한다.
  localStorage.setItem(MEMOS_LS, JSON.stringify(memos));
}

function paintMemo(memoObj) {
  // 받은 인자를 토대로 메모를 그린다.
  const td = getMemoDivObj(memoObj);
  memoTable.appendChild(td);
}

function refreshMemos() {
  // memos에 존재하는 모든 메모를 다시 그린다.
  removeAllMemos();

  memos.forEach(function(memoObj) {
    const td = getMemoDivObj(memoObj);
    memoTable.appendChild(td);
  });
}

function pushMemo(memoObj) {
  //받은 memo를 memos에 push 한다.
  memos.push(memoObj);
}

function focusTextAreaHandle(event) {
  event.target.style.height = "0px";
  event.target.style.height = 11 + event.target.scrollHeight + "px";
}
function blurTextAreaHandle(event) {
  event.target.style.height = "30px";
}

function getMemoDivObj(memoObj) {
  div = document.createElement("div");
  title = document.createElement("input");
  date = document.createElement("h5");
  content = document.createElement("textarea");
  br = document.createElement("br");
  delBtn = document.createElement("button");
  updateBtn = document.createElement("button");

  title.value = memoObj.title;
  content.value = memoObj.content;
  date.innerHTML = getTime(memoObj.date);
  delBtn.innerHTML = "삭제";
  updateBtn.innerHTML = "수정";
  delBtn.addEventListener("click", deleteMemo);
  updateBtn.addEventListener("click", updateMemo);
  div.id = memoObj.id;
  div.classList.add("memoObj");
  title.classList.add("memoObjTitle");
  content.classList.add("memoObjContent");
  div.classList.add(COLORS[Math.floor(Math.random(COLORS_NUM) * 5)]);
  content.addEventListener("keyup", focusTextAreaHandle);
  content.addEventListener("keydown", focusTextAreaHandle);
  content.addEventListener("focus", focusTextAreaHandle);
  content.addEventListener("blur", blurTextAreaHandle);

  div.appendChild(title);
  div.appendChild(updateBtn);
  div.appendChild(delBtn);
  div.appendChild(br);
  div.appendChild(content);
  div.appendChild(date);

  return div;
}

function getTime(date = null) {
  const curDate = date === null ? new Date() : new Date(date);
  const hours = curDate.getHours(),
    minutes = curDate.getMinutes(),
    seconds = curDate.getSeconds(),
    year = curDate.getFullYear(),
    mon = curDate.getMonth() + 1,
    day = curDate.getDate();

  const currentTime = `
    ${year}년 ${mon}월 ${day}일
    ${hours < 10 ? `0${hours}` : hours}:${
    minutes < 10 ? `0${minutes}` : minutes
  }:${seconds < 10 ? `0${seconds}` : seconds}`;
  return currentTime;
}

function handleSubmit(event) {
  event.preventDefault();
  const memoObj = {
    writer: "jaeha",
    title: memoInput.value,
    content: memoTextarea.value,
    color: Math.floor(Math.random() * 5),
    date: new Date().toJSON()
  };
  pushMemo(memoObj);
  paintMemo(memoObj);
  memoInput.value = "";
  memoTextarea.value = "";
}
function loadMemos() {
  // DB에서 메모들을 가져와 memos에 저장한다.
  fetch(`${DB_URL}memos`, { method: "GET" })
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      if (json !== null) {
        json.forEach(function(memoObj) {
          pushMemo(memoObj);
        });
        refreshMemos();
      }
    });
}

function addEventHandles() {
  memoForm.addEventListener("submit", handleSubmit);
  memoTextarea.addEventListener("focus", focusTextAreaHandle);
  memoTextarea.addEventListener("keydown", focusTextAreaHandle);
  memoTextarea.addEventListener("keyup", focusTextAreaHandle);
  memoSort.addEventListener("click", handleSort);
  document.onload = loadMemos();
}

function handleSort(event) {
  //정렬버튼 클릭시
}

function init() {
  //loadMemos();
  addEventHandles();
}

function postMemo(memoObj) {
  const form = document.createElement("form");
  const title = document.createElement("input");
  const content = document.createElement("input");
  const color = document.createElement("input");
  const writer = document.createElement("input");
  const date = document.createElement("input");
  const fax = document.querySelector("iframe");

  title.type = "hidden";
  content.type = "hidden";
  color.type = "hidden";
  writer.type = "hidden";
  date.type = "hidden";

  title.name = "title";
  content.name = "content";
  color.name = "color";
  writer.name = "writer";
  date.name = "date";

  title.value = memoObj.title;
  content.value = memoObj.content;
  color.value = memoObj.color;
  writer.value = memoObj.writer;
  date.value = memoObj.date;

  fax.appendChild(form);
  form.appendChild(title);
  form.appendChild(content);
  form.appendChild(color);
  form.appendChild(writer);
  form.appendChild(date);

  form.setAttribute("charset", "UTF-8");
  form.action = DB_URL + "memos";
  form.method = "POST";
  form.target = "fax";
  form.submit();
  form.remove();
}

init();
