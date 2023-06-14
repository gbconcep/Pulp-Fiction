// Pulp Fiction
// Game by Alex Groff and Gavin Concepcion
//
// This game adapts the 1994 film Pulp Fiction by Quentin Tarantino.
//
// The game follows a consistent gameplay style throughout each level, where you must get your car to a destination while avoiding obstacles.
// The car obstacles are randomly generated by Phaser. The enemies also have detection zones from Phaser.
//
// Level 1 is based off of the opening car ride to the apartment between Jules Winnfield and Vincent Vega.
// The level introduces you to the game and the controls, much like how the scene its based on introduces our main leads.
//
// Level 2 adapts the scene where Mia is dying from an overdose and Vincent has to rush her to Lance's.
// In the level, you have to get to the destination before time runs our in the dark streets of Los Angeles.
// The level showcases our time feature for the first time as well as a camera effect where you can only see clearly in front of you.
//
// Level 3 adapts the scene where Vincent accidentally shoots Marvin and splatters his blood all over Jules' car.
// This level takes creative liberties based off of the concept of the scene.
// The level involves you having to get the car to its destination without getting caught by police.
// This is based off of dialogue where Jules says someone is going to notice the bloody car in broad daylight.
//
// If you hide the tutorial panels using "SHIFT", dialogue based off of the scene in the actual movie will start playing.
// This is an example of Phaser's dialogue bundle, in which we also had continue on its own.
// 
// Police siren sound by guitarguy1985 on Freesound.org
// Damage sound by qubodup on Freesound.org
// Game over sound by myfox14 on Freesound.org
//
// Surf Rider, written by Bob Bogle, Nole "Nokie" Edwards, Don Wilson and performed by The Lively Ories
// Misirlou, performed by Dick Dale
// Out of Limits, written by Michael Gordon and performed by The Marketts


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
  scene: [Load, Title, Intro, Time, Stealth]
}

let game = new Phaser.Game(config);

// keyboard variables
let keyUP, keyDOWN, key1, key2, key3, keyH;
let cursors = null;
