// var socket = io("https://on-air-socket-test.herokuapp.com/");

const socket = io("https://on-air-socket-test.herokuapp.com/", {
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "abcd"
  }
});