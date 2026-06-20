const player = require("play-sound")();

function playNotification() {
  player.play("./notify.mp3", (err) => {
    if (err) console.log("Erro som:", err);
  });
}

module.exports = { playNotification };