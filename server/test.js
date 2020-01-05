function postMsg() {
  console.log("hello");
  const form = document.createElement("form");
  const title = document.createElement("input");
  const content = document.createElement("input");
  const color = document.createElement("input");
  const writer = document.createElement("input");
  const date = document.createElement("input");
  const _blank = document.querySelector("iframe");

  _blank.appendChild(form);
  _blank.style.display = "none";
  form.setAttribute("charset", "UTF-8");
  form.appendChild(title);
  form.appendChild(content);
  form.appendChild(color);
  form.appendChild(writer);
  form.appendChild(date);

  form.action = "http://localhost:13000/api/memos";
  form.method = "POST";

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

  title.value = "goooood";
  content.value = "seee ya";
  color.value = "red";
  writer.value = "jaeha";
  date.value = new Date().toJSON();

  form.target = "trash";
  form.submit();
}

const btn = document.querySelector("button");
btn.addEventListener("click", postMsg);
