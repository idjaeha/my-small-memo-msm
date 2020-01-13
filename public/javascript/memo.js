function deleteMemo(event) {
  event.preventDefault();
  const btn = event.target;
  const td = btn.parentNode;
  memoTable.removeChild(td);
  const cleanMemos = memos.filter(function(memo) {
    return memo.key !== parseInt(td.id);
  });
  memos = cleanMemos;
  deleteMemoToDB(td.id);
}

function updateMemo(event, curDiv = null) {
  let div;
  if (!curDiv) {
    event.preventDefault();
    const btn = event.target;
    div = btn.parentNode;
  } else {
    div = curDiv;
  }

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

  //해당 메모를 정렬에 맞게 배치한다.
  memoTable.removeChild(div);
  paintMemo(div, !isNew);

  //TODO: 살짝 비효율적인 느낌이 든다. 더 생각해보자
  updateMemos(updatedMemo);
  updateMemoToDB(updatedMemo);
}

function updateMemos(updatedMemo) {
  // memos를 정렬한다.
  const updatedMemos = memos.filter(function(memo) {
    return memo.key !== updatedMemo.key;
  });

  updatedMemos.unshift(updatedMemo); // memos의 맨 앞에 업데이트된 메모를 추가한다.
  memos = updatedMemos;
}

function removeAllMemoDivs() {
  // 화면에 존재하는 모든 메모 div를 삭제한다.
  while (memoTable.hasChildNodes()) {
    memoTable.removeChild(memoTable.firstChild);
  }
}

function paintMemo(memoObj, isAppending = true) {
  // 받은 인자를 토대로 메모를 그린다.
  // 만약 받은 인자가 memoObj Object 일 경우, 그를 토대로 div를 생성한다.
  // 만약 받은 인자가 div 객체일 경우 그대로 사용한다.
  // isAppending이 true일 경우 뒤에 그린다.
  // isAppending이 false일 경우 앞에 그린다.
  const div = memoObj.tagName === "DIV" ? memoObj : getMemoDivObj(memoObj);
  if (isAppending) memoTable.appendChild(div);
  else memoTable.prepend(div);
}

function refreshMemos() {
  // memos에 존재하는 모든 메모를 다시 그린다.
  removeAllMemoDivs();

  memos.forEach(function(memoObj) {
    paintMemo(memoObj);
  });
}

function handleFocusTextarea(event) {
  event.target.style.height = "0px";
  event.target.style.height = 11 + event.target.scrollHeight + "px";
}
function handleBlurTextarea(event) {
  event.target.style.height = "30px";
}

function handleFocusDiv(event) {
  if (event.target.tagName === "BUTTON") {
    console.log("hello");
    handleFocusQuit(event);
    return;
  }
  this.classList.add("zoomIn");
  focusedDiv = this;
  backgroundForFocusing.classList.add("backgroundForFocusActive");
  backgroundForFocusing.classList.remove("hiding");
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
  content.addEventListener("keyup", handleFocusTextarea);
  content.addEventListener("keydown", handleFocusTextarea);
  content.addEventListener("focus", handleFocusTextarea);
  content.addEventListener("blur", handleBlurTextarea);
  div.addEventListener("click", handleFocusDiv);
  div.setAttribute("draggable", "true");
  div.setAttribute("tabindex", "0");

  div.appendChild(title);
  div.appendChild(updateBtn);
  div.appendChild(delBtn);
  div.appendChild(br);
  div.appendChild(content);
  div.appendChild(date);

  return div;
}

function getParsedTime(date = null) {
  //YYYY년 MM월 DD일 시간 순으로 나타낸다.
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
    writer: loggedInId,
    title: memoInput.value,
    content: memoTextarea.value,
    color:
      currentColor === ""
        ? COLORS[Math.floor(Math.random(COLORS_NUM) * 5)]
        : currentColor,
    date: key
  };
  memos.unshift(memoObj);
  paintMemo(memoObj, !isNew);
  memoInput.value = "";
  memoTextarea.value = "";
  addMemoToDB(memoObj);
}

function loadMemosFromDB() {
  // DB에서 메모들을 가져와 memos에 저장한다.
  const url = `${DB_URL}memos/${loggedInId}`;

  fetch(url, { method: "GET" })
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      if (json !== null) {
        json.forEach(function(memoObj) {
          memos.push(memoObj);
        });
        refreshMemos();
      }
    });
}

function handleSearch(event) {
  event.preventDefault();
  paintMemos();
}

function getSearchMemos(receivedMemos) {
  //검색한 메모만 보여줌
  const searchedMemos = [];
  const searchValue = searchInput.value;
  if (searchValue === "") {
    return receivedMemos;
  }

  receivedMemos.forEach(function(memoObj) {
    if (memoObj.title == searchValue || memoObj.content.match(searchValue)) {
      searchedMemos.push(memoObj);
    }
  });
  return searchedMemos;
}

function handleFocusQuit(event) {
  backgroundForFocusing.classList.add("hiding");
  backgroundForFocusing.classList.remove("backgroundForFocusActive");
  if (focusedDiv !== null) {
    focusedDiv.classList.remove("zoomIn");
    focusedDiv = null;
  }
}

function addEventHandles() {
  memoForm.addEventListener("submit", handleSubmit);
  memoTextarea.addEventListener("focus", handleFocusTextarea);
  memoTextarea.addEventListener("keydown", handleFocusTextarea);
  memoTextarea.addEventListener("keyup", handleFocusTextarea);
  searchInput.addEventListener("keyup", handleSearch);
  memoSort.addEventListener("click", handleSort);
  backgroundForFocusing.addEventListener("click", handleFocusQuit);
}

function handleSort(event) {
  // isNew === true : 최신 순서대로
  // isNew === false : 오래된 순서대로
  event.preventDefault();
  isNew = !isNew;
  memoSort.innerText = isNew ? "New" : "Old";
  paintMemos();
}

function addMemoToDB(memoObj) {
  const url = `${DB_URL}memos`;
  const data = memoObj;
  postMsg(url, data);
}

function deleteMemoToDB(currentKey) {
  const url = `${DB_URL}memos/delete`;
  const data = { key: currentKey };
  postMsg(url, data);
}

function updateMemoToDB(memoObj) {
  const url = `${DB_URL}memos/update`;
  const data = memoObj;
  postMsg(url, data);
}

function postMsg(url, data) {
  fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
    .then(response => {
      // console.log("Success:", JSON.stringify(response));
    })
    .catch(error => console.error("Error:", error));
}

function selectColorHandle(event) {
  const selectedColor = event.target;
  COLORS.forEach(function(color) {
    memoForm.classList.remove(color);
  });
  memoForm.classList.add(selectedColor.id);
  currentColor = selectedColor.id;
}

function initColorPalette() {
  for (let i = 0; i < COLORS_NUM; i++) {
    const colorDiv = document.createElement("div");
    colorDiv.id = COLORS[i];
    colorDiv.classList.add(COLORS[i]);
    colorDiv.classList.add("colorButton");
    colorDiv.addEventListener("click", selectColorHandle);
    colorPalette.appendChild(colorDiv);
  }
}

function checkColorHandle(event) {
  // 메모의 색깔별로 체크하여 보여주는 핸들
  const colorDiv = event.target;
  const checkedColor = colorDiv.id;
  colorDiv.classList.toggle("checked");
  // 현재 해당 색깔이 존재하는지 찾는다.
  const pos = checkedColors.findIndex(function(color) {
    return color === checkedColor;
  });

  // 색깔을 토글 형식으로 구현한다.
  if (pos !== -1) {
    checkedColors.splice(pos, 1);
  } else {
    checkedColors.push(checkedColor);
  }

  paintMemos();
}

function getCheckedColorMemos(receivedMemos) {
  // 체크된 색 메모들을 내보냅니다.
  const checkedMemos = [];
  if (checkedColors.length !== 0) {
    removeAllMemoDivs();
    receivedMemos.forEach(function(memoObj) {
      if (
        checkedColors.some(function(color) {
          return memoObj.color === color;
        })
      ) {
        checkedMemos.push(memoObj);
      }
    });
  } else {
    return receivedMemos;
  }
  return checkedMemos;
}

function initColorChecker() {
  for (let i = 0; i < COLORS_NUM; i++) {
    const colorDiv = document.createElement("div");
    colorDiv.id = COLORS[i];
    colorDiv.classList.add(COLORS[i]);
    colorDiv.classList.add("colorButton");
    colorDiv.addEventListener("click", checkColorHandle);
    colorChecker.appendChild(colorDiv);
  }
}

function paintMemos() {
  // 조건에 해당하는 메모들을 그린다.
  memoForm.classList.add("hiding");
  let pickedMemos;
  pickedMemos = getCheckedColorMemos(memos);
  pickedMemos = getSearchMemos(pickedMemos);

  if (pickedMemos === memos) {
    memoForm.classList.remove("hiding");
  }
  removeAllMemoDivs();
  pickedMemos.forEach(function(memo) {
    paintMemo(memo, isNew);
  });
}

function init() {
  initColorPalette();
  initColorChecker();
  addEventHandles();
}

init();
