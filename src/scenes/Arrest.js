class Arrest extends Phaser.Scene {
    constructor() {
        super("arrestScene");
    }

    create() {  
        this.siren = this.sound.add('siren');
        this.siren.play()

        this.arrest = this.add.image(game.config.width/2, game.config.width/3, 'arrest').setOrigin(.5);

        this.boxText = this.add.bitmapText(game.config.width/2, game.config.height/1.2, "dialogW", "You've Been Arrested!\n\nPress SPACE to return to the menu.", 30).setOrigin(0.5).setCenterAlign().setTintFill();

        cursors = this.input.keyboard.createCursorKeys(); 
    }

    update() {
      if(Phaser.Input.Keyboard.JustDown(cursors.space)) {
        this.scene.start('titleScene');
      }
    }
}