// var socket = io("https://on-air-socket-test.herokuapp.com/");

const socket = io("https://on-air-socket-test.herokuapp.com/", {
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "abcd"
  }
});

document.addEventListener("mousemove", e => {
  socket.emit("mouse move", {x: e.pageX, y: e.pageY});
});

socket.on("updateCursorPos", data => {
  const selector = `.pointer[session_id=${data.session_id}]`;
  const cursorsContainer = document.querySelector(".cursors-container");

  if(document.querySelector(selector).length <= 0) {
    const cursor = document.createElement("img");
    cursor.setAttribute("src", "/assets/cursor.png");
    cursor.setAttribute("class", "pointer");
    cursor.setAttribute("session_id", data.session_id);
    cursor.style.top = `${data.coords.y}px`;
    cursor.style.left = `${data.coords.x}px`;
    cursorsContainer.appendChild(cursor);
  }

  const cursor = document.querySelector(selector);
  cursor.style.top = `${data.coords.y}px`;
  cursor.style.left = `${data.coords.x}px`;
  
});