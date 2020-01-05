const memoForm = document.querySelector(".js-memoForm");
const memoTextarea = memoForm.querySelector("textarea");
const memoInput = memoForm.querySelector("input");
const memoTable = document.querySelector(".js-memoTable");
const memoSort = document.getElementById("js-sort");

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
  localStorage.setItem(MEMOS_LS, JSON.stringify(memos));
}

function paintMemo(memoObj) {
  // 받은 인자를 토대로 메모를 그린다.
  const td = getMemoObj(
    memoObj.title,
    memoObj.content,
    memoObj.date,
    memoObj.id
  );
  memoTable.appendChild(td);
}

function refreshMemos() {
  // memos에 존재하는 모든 메모를 다시 그린다.
  removeAllMemos();
  memos.forEach(function(memo) {
    const td = getMemoObj(memo.title, memo.content, memo.date, memo.id);
    memoTable.appendChild(td);
  });
}

function pushMemo(title, content, date = null, id = null) {
  //memos값 저장하고 memoObj를 반환한다.
  const newId = id === null ? new Date().toJSON() : id; //해당 옵션을 주지 않는 경우 태그와 로컬 스토리지의 값이 다르게 표현된다. toJSON은 문자열로 변경하는 것과 의미가 같다.
  const newDate = date === null ? newId : date;
  const memoObj = {
    id: newId,
    title: title,
    content: content,
    date: newDate
  };
  memos.push(memoObj);
  saveMemos();
  return memoObj;
}

function focusTextAreaHandle(event) {
  event.target.style.height = "0px";
  event.target.style.height = 11 + event.target.scrollHeight + "px";
}
function blurTextAreaHandle(event) {
  event.target.style.height = "30px";
}

function getMemoObj(title, content, date, id) {
  _div = document.createElement("div");
  _title = document.createElement("input");
  _date = document.createElement("h5");
  _content = document.createElement("textarea");
  _br = document.createElement("br");
  _delBtn = document.createElement("button");
  _updateBtn = document.createElement("button");

  _title.value = title;
  _content.value = content;
  _date.innerHTML = getTime(date);
  _delBtn.innerHTML = "삭제";
  _updateBtn.innerHTML = "수정";
  _delBtn.addEventListener("click", deleteMemo);
  _updateBtn.addEventListener("click", updateMemo);
  _div.id = id;
  _div.classList.add("memoObj");
  _title.classList.add("memoObjTitle");
  _content.classList.add("memoObjContent");
  _div.classList.add(COLORS[Math.floor(Math.random(COLORS_NUM) * 5)]);
  _content.addEventListener("keyup", focusTextAreaHandle);
  _content.addEventListener("keydown", focusTextAreaHandle);
  _content.addEventListener("focus", focusTextAreaHandle);
  _content.addEventListener("blur", blurTextAreaHandle);

  _div.appendChild(_title);
  _div.appendChild(_updateBtn);
  _div.appendChild(_delBtn);
  _div.appendChild(_br);
  _div.appendChild(_content);
  _div.appendChild(_date);

  return _div;
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
  const currentTitle = memoInput.value;
  const currentContent = memoTextarea.value;
  const memoObj = pushMemo(currentTitle, currentContent);
  paintMemo(memoObj);
  memoInput.value = "";
  memoTextarea.value = "";
}
function loadMemos() {
  const loadedMemos = localStorage.getItem(MEMOS_LS);
  if (loadedMemos !== null) {
    const parsedMemos = JSON.parse(loadedMemos);
    parsedMemos.forEach(function(memo) {
      const memoObj = pushMemo(memo.title, memo.content, memo.date, memo.id);
    });
  }
}

function addEventHandles() {
  memoForm.addEventListener("submit", handleSubmit);
  memoTextarea.addEventListener("focus", focusTextAreaHandle);
  memoTextarea.addEventListener("keydown", focusTextAreaHandle);
  memoTextarea.addEventListener("keyup", focusTextAreaHandle);
  memoSort.addEventListener("click", handleSort);
}

function handleSort(event) {
  //정렬버튼 클릭시
}

function init() {
  loadMemos();
  refreshMemos();
  addEventHandles();
}

init();
