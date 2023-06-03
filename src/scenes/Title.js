class Title extends Phaser.Scene {
    constructor() {
      super("titleScene");
    }

    preload() {
        this.load.image('logo', './assets/pulp-fiction-logo.png');
      }
    
    create() {
        this.add.text(game.config.width/2.4, game.config.width/2, "PULP FICTION");

        // this.add.image(game.config.width/2.4, game.config.width/2, 'logo')

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

        this.add.text(game.config.width/2, game.config.height/1.4, 'Press SPACE to start', menuConfig).setOrigin(0.5);
        // this.add.text(game.config.width/3.2, game.config.height/6.5, 'Press UP key to jump', directionConfig).setOrigin(0.5);
        // this.add.text(game.config.width/1.4, game.config.height/6.5, 'Press DOWN key to slide', directionConfig).setOrigin(0.5);

        this.add.text(35, 420, `Game by Alex Groff and Gavin Concepcion`) 
        this.add.text(game.config.width/2, game.config.height/1.4, 'Press SPACE to start', menuConfig).setOrigin(0.5);

        this.add.text(125, 440, `Music and sound effects from Freesound.org`, {
            fontFamily: 'Courier',
            fontSize: '15px',
            color: '#ffffff'
        });
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(cursors.space)) {    
            this.scene.start('introScene');    
        }
    }
}
