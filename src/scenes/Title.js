class Title extends Phaser.Scene {
    constructor() {
      super("titleScene");
    }
    
    
    create() {

        this.logo = this.add.sprite(game.config.width/2, game.config.width/3, 'logo').setOrigin(.5);

        // menu text configuration
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '25px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        let directionConfig = {
            fontFamily: 'Arial',
            fontSize: '20px',
            backgroundColor: 'cyan',
            color: 'purple',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 100
        }

        // define keys
        cursors = this.input.keyboard.createCursorKeys(); 
        
        // show menu text
        menuConfig.backgroundColor = 'cyan';
        menuConfig.color = '#000';
        directionConfig.fixedWidth = 0

        this.add.text(game.config.width/2, game.config.height/1.4, 'Press SPACE to start', directionConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height * 2.5/4, 'Use arrow Keys to move', directionConfig).setOrigin(0.5);
        // this.add.text(game.config.width/1.4, game.config.height/6.5, 'Press DOWN key to slide', directionConfig).setOrigin(0.5);

        this.add.text(game.config.width/2, 500, `Game by Alex Groff and Gavin Concepcion`).setOrigin(.5);

        this.add.text(game.config.width/2, 520, `Music and sound effects from Freesound.org`, {
            fontFamily: 'Courier',
            fontSize: '15px',
            color: '#ffffff'
        }).setOrigin(.5);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(cursors.space)) {    
            this.scene.start('introScene');    
        }
    }
}
