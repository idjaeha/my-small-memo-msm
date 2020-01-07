const memoForm = document.querySelector(".js-memoForm");
const memoTextarea = memoForm.querySelector("textarea");
const memoInput = memoForm.querySelector("input");
const memoTable = document.querySelector(".js-memoTable");
const memoSort = document.getElementById("js-sort");
const fax = document.querySelector("iframe");
const searchInput = document.querySelector(".js-search");

const DB_URL = "http://id001.iptime.org:13000/api/";
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
    return memo.key !== td.id;
  });
  memos = cleanMemos;
  deleteMemoToDB(td.id);
}

function updateMemo(event) {
  event.preventDefault();
  const btn = event.target;
  const div = btn.parentNode;
  const currentContent = div.querySelector("textarea").value;
  const currentTitle = div.querySelector("input").value;
  const currentDate = div.querySelector("h5");
  const currentId = parseInt(div.id);
  let updatedMemo = null;

  const now = new Date().getTime();
  currentDate.innerHTML = getParsedTime(now);

  memos.forEach(function(memo) {
    if (memo.key === currentId) {
      memo.title = currentTitle;
      memo.content = currentContent;
      memo.date = now;
      updatedMemo = memo;
    }
  });

  //해당 메모를 맨 앞으로 옮긴다.
  memoTable.removeChild(div);
  memoTable.prepend(div);

  //TODO: 살짝 비효율적인 느낌이 든다. 더 생각해보자
  updateMemos(updatedMemo);
  updateMemoToDB(updatedMemo);
}

function removeAllMemoDivs() {
  // 화면에 존재하는 모든 메모 div를 삭제한다.
  while (memoTable.hasChildNodes()) {
    memoTable.removeChild(memoTable.firstChild);
  }
}

function updateMemos(updatedMemo) {
  // memos를 정렬한다.
  const updatedMemos = memos.filter(function(memo) {
    return memo.key !== updatedMemo.key;
  });

  updatedMemos.splice(0, 0, updatedMemo); // memos의 맨 앞에 업데이트된 메모를 추가한다.
  memos = updatedMemos;
}

function saveMemosToDB() {
  // memos에 저장된 메모를 DB에 저장한다.
}

function paintMemo(memoObj, isAppending = true) {
  // 받은 인자를 토대로 메모를 그린다.
  // isAppending이 true일 경우 뒤에 그린다.
  // isAppending이 false일 경우 앞에 그린다.
  const td = getMemoDivObj(memoObj);
  if (isAppending) memoTable.appendChild(td);
  else memoTable.prepend(td);
}

function refreshMemos() {
  // memos에 존재하는 모든 메모를 다시 그린다.
  removeAllMemoDivs();

  memos.forEach(function(memoObj) {
    paintMemo(memoObj);
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
  // 받은 객체를 토대로 div DOM 객체를 만들어 반환한다.
  div = document.createElement("div");
  title = document.createElement("input");
  date = document.createElement("h5");
  content = document.createElement("textarea");
  br = document.createElement("br");
  delBtn = document.createElement("button");
  updateBtn = document.createElement("button");

  title.value = memoObj.title;
  content.value = memoObj.content;
  date.innerHTML = getParsedTime(memoObj.date);
  delBtn.innerHTML = "삭제";
  updateBtn.innerHTML = "수정";
  delBtn.addEventListener("click", deleteMemo);
  updateBtn.addEventListener("click", updateMemo);
  div.id = memoObj.key;
  div.classList.add("memoObj");
  title.classList.add("memoObjTitle");
  content.classList.add("memoObjContent");
  div.classList.add(memoObj.color);
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

function getParsedTime(date = null) {
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
  const key = new Date().getTime();
  const memoObj = {
    key,
    writer: "jaeha",
    title: memoInput.value,
    content: memoTextarea.value,
    color: COLORS[Math.floor(Math.random(COLORS_NUM) * 5)],
    date: key
  };
  pushMemo(memoObj);
  paintMemo(memoObj, false);
  memoInput.value = "";
  memoTextarea.value = "";
  addMemoToDB(memoObj);
}
function loadMemosFromDB() {
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

function handleSearch(event) {
  event.preventDefault();
  const searchValue = searchInput.value;
  paintSearchValue(searchValue);
}

function paintSearchValue(searchValue) {
  //검색한 메모만 보여줌
  if (searchValue === "") memoForm.classList.remove("hiding");
  else memoForm.classList.add("hiding");

  removeAllMemoDivs();
  memos.forEach(function(memoObj) {
    if (memoObj.title == searchValue || memoObj.content.match(searchValue)) {
      paintMemo(memoObj);
    }
  });
}

function addEventHandles() {
  memoForm.addEventListener("submit", handleSubmit);
  memoTextarea.addEventListener("focus", focusTextAreaHandle);
  memoTextarea.addEventListener("keydown", focusTextAreaHandle);
  memoTextarea.addEventListener("keyup", focusTextAreaHandle);
  memoSort.addEventListener("click", handleSort);
  searchInput.addEventListener("keyup", handleSearch);
  document.onload = loadMemosFromDB();
}

function handleSort(event) {
  //정렬버튼 클릭시
}

function init() {
  addEventHandles();
}

function addMemoToDB(memoObj) {
  const form = document.createElement("form");
  const title = document.createElement("input");
  const key = document.createElement("input");
  const content = document.createElement("input");
  const color = document.createElement("input");
  const writer = document.createElement("input");
  const date = document.createElement("input");
  const fax = document.querySelector("iframe");

  title.type = "hidden";
  key.type = "hidden";
  content.type = "hidden";
  color.type = "hidden";
  writer.type = "hidden";
  date.type = "hidden";

  title.name = "title";
  key.name = "key";
  content.name = "content";
  color.name = "color";
  writer.name = "writer";
  date.name = "date";

  title.value = memoObj.title;
  key.value = memoObj.key;
  content.value = memoObj.content;
  color.value = memoObj.color;
  writer.value = memoTitle.id;
  date.value = memoObj.date;

  fax.appendChild(form);
  form.appendChild(title);
  form.appendChild(key);
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

function deleteMemoToDB(currentKey) {
  const form = document.createElement("form");
  const key = document.createElement("input");

  key.type = "hidden";
  key.name = "key";
  key.value = currentKey;

  fax.appendChild(form);
  form.appendChild(key);

  form.setAttribute("charset", "UTF-8");
  form.action = DB_URL + "memos/delete";
  form.method = "POST";
  form.target = "fax";
  form.submit();
  form.remove();
}

function updateMemoToDB(memoObj) {
  const form = document.createElement("form");
  const key = document.createElement("input");
  const title = document.createElement("input");
  const content = document.createElement("input");
  const date = document.createElement("input");

  key.type = "hidden";
  key.name = "key";
  key.value = memoObj.key;
  title.type = "hidden";
  title.name = "title";
  title.value = memoObj.title;
  content.type = "hidden";
  content.name = "content";
  content.value = memoObj.content;
  date.type = "hidden";
  date.name = "date";
  date.value = memoObj.date;

  fax.appendChild(form);
  form.appendChild(key);
  form.appendChild(title);
  form.appendChild(content);
  form.appendChild(date);

  form.setAttribute("charset", "UTF-8");
  form.action = DB_URL + "memos/update";
  form.method = "POST";
  form.target = "fax";
  form.submit();
  form.remove();
}

init();
