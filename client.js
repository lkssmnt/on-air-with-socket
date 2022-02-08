/*
// ——————— CURSORS

// setting up the server connection to the herokuapp
const socket = io("https://on-air-socket-test.herokuapp.com/", {
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "abcd"
  }
});

let cursorfps = 30;
let lastMove = 0;

document.addEventListener("mousemove", e => {
  // socket.emit("mouse move", {x: e.pageX, y: e.pageY});

  if(Date.now() - lastMove > 1000 / cursorfps) {
    let x = Math.round(myScale(e.clientX, 0, document.body.clientWidth, 0 , 100)*1000)/1000
    let y = Math.round(myScale(e.clientY, 0, document.body.clientHeight, 0 , 100)*1000)/1000

    socket.emit('mouse move', {x, y});
    lastMove = Date.now();
  }
});



socket.on("updateCursorPos", data => {
  const selector = `.pointer[session_id="${data.session_id}"]`;
  const cursorsContainer = document.querySelector(".cursors-container");

  if(!document.querySelector(selector)) {
    const cursor = document.createElement("img");
    cursor.setAttribute("src", "assets/arrow.png");
    cursor.setAttribute("class", "pointer");
    cursor.setAttribute("session_id", data.session_id);

    const xPos = myScale(data.coords.x, 0, 100, 0, document.body.clientWidth);
    const yPos = myScale(data.coords.y, 0, 100, 0, document.body.clientHeight);

    // cursor.style.left = `${xPos}px`;
    // cursor.style.top = `${yPos}px`;
    cursorsContainer.appendChild(cursor);
  }

  const cursor = document.querySelector(selector);
  if(cursor) {
    const xPos = myScale(data.coords.x, 0, 100, 0, document.body.clientWidth);
    const yPos = myScale(data.coords.y, 0, 100, 0, document.body.clientHeight);
    // cursor.style.left = `${xPos}px`;
    // cursor.style.top = `${yPos}px`;

    gsap.to(cursor, {duration: .2, x: xPos, y: yPos, ease: "power2.out"});

    // cursor.style.top = `${data.coords.y}px`;
    // cursor.style.left = `${data.coords.x}px`;
  }
});

socket.on("dc", id => {
  const cursor = document.querySelector(`.pointer[session_id="${id}"]`);
  if(cursor) {
    cursor.remove();
  }
});

function myScale(num, in_min, in_max, out_min, out_max) {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

*/



// VIDEOS



// Load the IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/player_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

const videos = [
  "aTHmdLVcieI",
  "MNeX4EGtR5Y",
  "joQ42CYhtZw",
  "Wimkqo8gDZ0",
  "90x3I-sR4Lk",
  "nPQ4BpTfK1Q",
];

//create buttons and iframe placeholders
let btnCounter = 0;
videos.forEach(video => {
  // create buttons
    const btn = document.createElement('div');
    document.getElementsByClassName('btns-wrapper')[0].appendChild(btn);
    btn.setAttribute("class", 'btn');
    btn.setAttribute("data-video", `ytPlayer-${btnCounter}`);
    btn.setAttribute("data-count", `${btnCounter}`);

  //iframe placeholders
    const iframe = document.createElement('div');
    iframe.setAttribute("id", `ytPlayer-${btnCounter}`);
    document.getElementsByClassName('video-wrapper')[0].appendChild(iframe);

    btnCounter++;
});


const players = [];

function onYouTubePlayerAPIReady() {
  let playerCounter = 0;

  videos.forEach(video => {
    const player = new YT.Player(`ytPlayer-${playerCounter}`, {
      height: '360',
      width: '640',
      playerVars: { 'autoplay': 1, 'showinfo': 0, 'modestbranding': 1, 'loop': 1, 'playsinline': 1, 'rel': 0, },
      videoId: video,
      events: {
        'onReady': onPlayerReady,
      }
    });

    players.push(player);
    playerCounter++;
  });
}

function onPlayerReady(event) {
  event.target.mute();
}


// set first frame active
const firstFrame = document.querySelector('#ytPlayer-0');
firstFrame.classList.add('active');


const btns = document.querySelectorAll(".btn");

if(btns) {
  btns.forEach(btn => {
    console.log(btn);

    btn.addEventListener("click", (e) => {
      const frameSelector = e.target.getAttribute("data-video");
      var btnN = Number(e.target.getAttribute("data-count"));

      const frame = document.getElementById(frameSelector);
      console.log(frame);


      const frames = document.querySelectorAll(".video-wrapper iframe");

      // set all frames inactive
      playerN = 0;
      frames.forEach(frame => {
        setTimeout(function () {
          frame.classList.remove("active");
          players[playerN].pauseVideo();
        }, 100);
  
        playerN++;
      });

      // set the selected frame active
      setTimeout(function () {
        frame.classList.add("active");
      }, 100);
      players[btnN].playVideo();
    });
  });
}
