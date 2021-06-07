document.querySelectorAll("[data-persistent]").forEach((el) => {
  const field = el.dataset.persistent;

  el.value = localStorage.getItem(field);
  el.addEventListener("input", () => localStorage.setItem(field, el.value));
});

const ws = new WebSocket(`ws://${location.host}`);

function addMessage({ sender, text, ts }) {
  /**
   * @type {HTMLTemplateElement}
   */
  const template = document.getElementById("message__template");
  const content = template.content.cloneNode(true);

  content.querySelector(".message-sender").textContent = sender;
  content.querySelector(".message-content").textContent = text;
  content.querySelector(".message-date").textContent = new Date(
    ts
  ).toLocaleTimeString();

  template.parentElement.appendChild(content);
}

ws.addEventListener("message", (event) => {
  const data = JSON.parse(event.data);

  if (Array.isArray(data)) {
    data.forEach((message) => addMessage(message));
    return;
  }

  addMessage(data);
});

/**
 * @type {HTMLFormElement}
 */
const form = document.querySelector(".chat__form");
const sendButton = form.querySelector('button[type=submit]');

form.querySelector("textarea").addEventListener('keypress', (e) => {
  if(e.code === 'Enter' && !e.ctrlKey) {
    e.preventDefault();
    sendButton.click();
  }
})

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!form.checkValidity()) {
    alert("Невозможно отправить сообщение");
    return;
  }

  const sender = localStorage.getItem("nickname");
  const text = form.querySelector("textarea").value;

  ws.send(JSON.stringify({ text, sender }));

  form.querySelector("textarea").value = '';
});
