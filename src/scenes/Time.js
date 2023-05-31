class Time extends Phaser.Scene {
    constructor() {
      super("timeScene");
    }
    
    create() {
      this.add.text(20, 20, "Rocket Patrol Menu");
    }
  }