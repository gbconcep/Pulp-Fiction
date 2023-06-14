class Crash extends Phaser.Scene {
    constructor() {
      super("crashScene");
    }

    create() {
        this.failure = this.sound.add('failure');
        this.failure.play()

        this.crash = this.add.image(game.config.width/2, game.config.width/3, 'crash').setOrigin(.5);
        this.boxText = this.add.bitmapText(game.config.width/2, game.config.height/1.2, "dialogW", "You took too long on the road and your passenger died!\n\nPress SPACE to return to the menu.", 30).setOrigin(0.5).setCenterAlign().setTintFill();

        cursors = this.input.keyboard.createCursorKeys(); 
    }

    update() {
        if(Phaser.Input.Keyboard.JustDown(cursors.space)) {
          this.scene.start('titleScene');
        }
    }
}