class Intro extends Phaser.Scene {
    constructor() {
      super("introScene");
    }
    
    create() {
      this.add.text(20, 20, "Rocket Patrol Menu");
    }
  }