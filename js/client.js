// Connect to the Socket.IO server
const socket = io("https://backend-chat-nifw.onrender.com");

// DOM Elements
const form = document.getElementById("send-container");
const messageInput = document.getElementById("messageInp");
const messageContainer = document.querySelector(".container");
var audio = new Audio("ting.mp3");

// Append message to chat container
const append = (message, position) => {
  if (!message || message.trim() === "") return;
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageElement.classList.add("message");
  messageElement.classList.add(position);
  messageContainer.append(messageElement);
  if (position == "left") {
    audio.play();
  }
};

// Ask for a valid username
let name;
do {
  name = prompt("Enter your name to join the chat:");
} while (!name || name.trim() === "");

socket.emit("new-user-joined", name);

// Event: New user joins (received by others)
socket.on("user-joined", (joinedName) => {
  append(`${joinedName} joined the chat`, "right");
});

// Event: Existing users already in the chat (sent to newly joined user)
socket.on("existing-users", (users) => {
  users.forEach((u) => append(`${u} is already in the chat`, "right"));
});

// Event: Message received from other user
socket.on("receive", (data) => {
  append(`${data.name}: ${data.message}`, "right");
});

// Event: A user left the chat
socket.on("left", (name) => {
  append(`${name} left the chat`, "right");
});

// Handle message send form
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  if (message.trim() !== "") {
    append(`You: ${message}`, "left");
    socket.emit("send", message);
    messageInput.value = "";
  }
});