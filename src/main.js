// Pulp Fiction
// Game by Alex Groff and Gavin Concepcion
// Sounds 
// Police siren sound by guitarguy1985 on Freesound.org
// Damage sound by qubodup on Freesound.org
// Game over sound by myfox14 on Freesound.org

let config = {
  type: Phaser.AUTO,
  width: 800,
  height: 1000,
  physics: {
      default: "arcade",
      arcade: {
          debug: false
      }
  },
  scene: [Load, Title, Intro, Time, Stealth, Crash, Arrest]
}

let game = new Phaser.Game(config);

// keyboard variables
let keyUP, keyDOWN, key1, key2, key3, keyH;
let cursors = null;
