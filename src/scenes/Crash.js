class Crash extends Phaser.Scene {
    constructor() {
      super("crashScene");
    }

    create() {
        this.failure = this.sound.add('failure');
        this.failure.play()

        this.crash = this.add.image(game.config.width/2, game.config.width/3, 'crash').setOrigin(.5);
    }
}