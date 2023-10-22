const socket = io();
const formNewMessage = document.getElementById("formNewMessage");

formNewMessage.addEventListener("submit", (e) => {
  e.preventDefault();
  const dataForm = new FormData(e.target);
  const newMessage = Object.fromEntries(dataForm);
  socket.emit("newMessage", newMessage);
  e.target.reset();
});

socket.on("messageData", (messages) => {
  console.log(messages);
  const showMessages = document.getElementById("showMessages");

  const cleanListMessages = document.getElementById("listMessages");
  cleanListMessages.remove();

  const divListMessages = document.createElement("div");
  divListMessages.setAttribute("id", "listMessages");

  if (messages) {
    divListMessages.innerHTML = `<h2>Historial de mensajes</h2>`;
    messages.forEach((message) => {
      const divMessage = document.createElement("div");
      divMessage.classList.add("container");
      divMessage.innerHTML = `<p>${message.postTime} - ${message.email} : ${message.message}</p>`;

      divListMessages.appendChild(divMessage);
    });
  } else {
    divListMessages.innerHTML = "<h2>No hay mensajes para mostrar</h2>";
  }

  showMessages.appendChild(divListMessages);
});

socket.emit("initialMessages");