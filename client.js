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



// VIDEOS

//autoplaytoggle setup

let device = "desktop";
let mql = window.matchMedia('only screen and (max-device-width: 667px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait), only screen and (max-device-width: 667px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait)');
if(mql.matches) {
  document.body.classList.add('mobile');
  document.body.classList.remove('desktop');
  device = "mobile";
} else {
  document.body.classList.remove('mobile');
  document.body.classList.add('desktop');
  device = "desktop";
}


function setViewPortHeight() {
  let viewportHeight = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${viewportHeight}px`);
}

setViewPortHeight();

window.addEventListener('resize', setViewPortHeight);

var input = document.getElementById('toggleswitch');
input.checked = true;
var autoplay = true;

// Load the IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/player_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

const videos = [
"M3Amu8syuWc",
"Tn4XvHqXyh0",
"B3-8fPKATDo",
"rS9BLtwDq7I",
"dhRuw7cxM_w",
];

const titles = [
  'The Walk',
  'Screencast',
  'iwilltakecareofmywork',
  'Knit with Code',
  'im:possible school ',
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
      height: '315',
      width: '560',
      playerVars: {
        'autoplay': 1,
        'showinfo': 0,
        'modestbranding': 1,
        'loop': 1,
        'playsinline': 1,
        'rel': 0,
        'playlist': video,
      },
      videoId: video,
      events: {
        'onReady': onPlayerReady,
      }
    });

    players.push(player);
    playerCounter++;
  });
}

let displayFirstVideo = false;

function onPlayerReady(event) {
  // if(!displayFirstVideo) {
  //   displayFirstVideo = true;
  //   switchVideo(0);
  //   videoActive = 0;
  // }

  event.target.mute();
}

// switchVideo(0);

// set first frame active
// const firstFrame = document.querySelector('#ytPlayer-0');
// firstFrame.classList.add('active');

let clicked = false;

function switchVideo(videoN) {
  const btn = document.querySelector(`[data-count="${videoN}"]`);
  const frameSelector = btn.getAttribute("data-video");
  const frame = document.getElementById(frameSelector);
  const frames = document.querySelectorAll(".video-wrapper iframe");

  // set all frames inactive
  let playerN = 0;
  frames.forEach(frame => {
    frame.classList.remove("active");
    players[playerN].pauseVideo();
    playerN++;
  });

  // set the selected frame active
  frame.classList.add("active");

  players[videoN].playVideo();
  btns.forEach(btn => {
    btn.classList.remove("btn-hover");
  });
  btn.classList.add("btn-hover");
}


const btns = document.querySelectorAll(".btn");
let videoActive = null;

if(btns) {
  btns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      if(autoplay) {
        // clearInterval(autoplayInterval);
        input.checked = false;
        autoplay = false;
      }
      videoActive = e.target.getAttribute("data-count");
      switchVideo(videoActive);

      btn.classList.add("btn-hover");
      clicked = true;
      // autoplay = false;
    });

    if(device === "desktop") {
      btn.addEventListener("mouseenter", (e) =>{
        const previewTitle = document.querySelector(".preview-title");
        previewTitle.classList.add("active");
        btn.classList.add("btn-hover");
        document.getElementsByClassName('preview-title')[0].innerHTML =
        titles[e.target.getAttribute("data-count")];
      });

      btn.addEventListener("mouseleave", () =>{
        const previewTitle = document.querySelector(".preview-title");
        previewTitle.classList.remove("active");
        if (!clicked) {
          btn.classList.remove("btn-hover");
        }
        clicked = false;
      });
    }


  });
}


// let videoActive = null;

let autoplayInterval = setInterval(autoSwitch, 60000);
switchVideo(0);

function autoSwitch() {

  if(videoActive === null) {
    videoActive = 0;
    switchVideo(videoActive);
  }else if(videoActive == players.length - 1 && autoplay) {
    videoActive = 0;
    switchVideo(videoActive);
  } else if(autoplay){
    videoActive++;
    switchVideo(videoActive);
  }
}




input.addEventListener('change',function(){
    if(this.checked) {
        autoplay = true;
    } else {
        autoplay = false;
    }
});

// const frameSelector = e.target.getAttribute("data-video");
// var btnN = Number(e.target.getAttribute("data-count"));

// const frame = document.getElementById(frameSelector);
// const frames = document.querySelectorAll(".video-wrapper iframe");

// // set all frames inactive
// let playerN = 0;
// frames.forEach(frame => {
//   frame.classList.remove("active");
//   players[playerN].pauseVideo();
//   playerN++;
// });

// // set the selected frame active
// setTimeout(function () {
//   frame.classList.add("active");
// }, 100);
// players[btnN].playVideo();

// // if (btnN < btns.length - 1) {
// //   setTimeout(function() {
// //     btns[btnN + 1].click();
// //   },5000);
// // } else {
// //   setTimeout(function() {
// //     btns[0].click();
// //   },5000);
// // }


// CABLES GL

/*

// disable rubberband effect on mobile devices
document.getElementById('glcanvas').addEventListener('touchmove', (e)=>{ e.preventDefault(); }, false);


function patchInitialized(patch) {
    // You can now access the patch object (patch), register variable watchers and so on
}

function patchFinishedLoading(patch) {
    console.log("patchFinishedLoading");
}

document.addEventListener('CABLES.jsLoaded', function (event) {
    CABLES.patch = new CABLES.Patch({
        patchFile: 'js/copy_of_clouds.json',
        prefixAssetPath: '',
        "canvas": {"alpha":true,"premultipliedAlpha":true},
        glCanvasId: 'glcanvas',
        glCanvasResizeToWindow: true,
        onPatchLoaded: patchInitialized,
        onFinishedLoading: patchFinishedLoading,
    });
});

*/
