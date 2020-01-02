const memoForm = document.querySelector(".js-memoForm");
const memoTextarea = memoForm.querySelector("textarea");
const memoInput = memoForm.querySelector("input");
const memoTable = document.querySelector(".js-memoTable");

const MEMOS_LS = 'memos';

let memos = [];

function saveMemos() {
    localStorage.setItem(MEMOS_LS, JSON.stringify(memos));
}

function paintMemo(title, content, date = null) {
    const newId = date === null ? new Date() : date;
    const td = getMemoObj(title, content, newId);
    memoTable.appendChild(td);
    const memoObj = {
        title : title,
        content : content,
        date : newId,
        id : newId
    };
    memos.push(memoObj);
}

function getMemoObj(title, content, date) {
    _td = document.createElement("td");
    _title = document.createElement("h4");
    _date = document.createElement("h5");
    _content = document.createElement("textarea");
    _br = document.createElement("br");
    
    _title.innerHTML = title;
    _content.innerHTML = content;
    _date.innerHTML = getTime(date);

    _td.appendChild(_title);
    _td.appendChild(_br);
    _td.appendChild(_content);
    _td.appendChild(_br);
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
            paintMemo(memo.title, memo.content, memo.date);
        });
    }
}

function init() {
    loadMemos();
    memoForm.addEventListener("submit", handleSubmit);
}

init();