class Arrest extends Phaser.Scene {
    constructor() {
      super("arrestScene");
    }

    create() {  
        this.siren = this.sound.add('siren');
        this.siren.play()

        this.arrest = this.add.image(game.config.width/2, game.config.width/3, 'arrest').setOrigin(.5);
    }
}