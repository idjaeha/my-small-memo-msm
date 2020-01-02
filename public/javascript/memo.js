const memoForm = document.querySelector(".js-memoForm");
const memoTextarea = memoForm.querySelector("textarea");
const memoInput = memoForm.querySelector("input");
const memoTable = document.querySelector(".js-memoTable");

const MEMOS_LS = 'memos';

let memos = [];

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
        if(memo.id === currentId) {
            memo.title = currentTitle;
            memo.content = currentContent;
            memo.date = now;
        }
    });

    memos = parsedMemos;
    saveMemos();
}

function saveMemos() {
    localStorage.setItem(MEMOS_LS, JSON.stringify(memos));
}

function paintMemo(title, content, date = null, id = null) {
    const newId = id === null ? new Date().toJSON() : id; //해당 옵션을 주지 않는 경우 태그와 로컬 스토리지의 값이 다르게 표현된다. toJSON은 문자열로 변경하는 것과 의미가 같다.
    const newDate = date === null ? newId : date;
    const td = getMemoObj(title, content, newDate, newId);
    memoTable.appendChild(td);
    const memoObj = {
        id : newId,
        title : title,
        content : content,
        date : newDate
    };
    memos.push(memoObj);
}

function getMemoObj(title, content, date, id) {
    _td = document.createElement("td");
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
    _td.id = id;

    _td.appendChild(_title);
    _td.appendChild(_updateBtn);
    _td.appendChild(_delBtn);
    _td.appendChild(_br);
    _td.appendChild(_content);
    _td.appendChild(_date);
    
    return _td;
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
        minutes < 10 ? `0${minutes}` : minutes}:${
            seconds < 10 ? `0${seconds}` : seconds}`;
    return currentTime;
    
}

function handleSubmit(event) {
    event.preventDefault();
    const currentTitle = memoInput.value;
    const currentContent = memoTextarea.value;
    paintMemo(currentTitle, currentContent);
    memoInput.value = "";
    memoTextarea.value= "";
    saveMemos();
}
function loadMemos() {
    const loadedMemos = localStorage.getItem(MEMOS_LS);
    if(loadedMemos !== null) {
        const parsedMemos = JSON.parse(loadedMemos);
        parsedMemos.forEach(function(memo) {
            paintMemo(memo.title, memo.content, memo.date, memo.id);
        });
    }
}

function init() {
    loadMemos();
    memoForm.addEventListener("submit", handleSubmit);
}

init();