class Title extends Phaser.Scene {
    constructor() {
      super("titleScene");
    }
    
    create() {
        // this.wall = this.add.tileSprite(0, 0, 640, 480, 'wall').setOrigin(0, 0);
        this.wall = this.add.tileSprite(0, 0, 640, 480, 'background').setOrigin(0, 0);
        this.title = this.add.image(game.config.width/2, game.config.height/2, 'title').setOrigin(0.5, 0.5);
        this.title.setDisplaySize(game.config.width, game.config.height)
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0xFFFFFF).setOrigin(0, 0);
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
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        // show menu text
        menuConfig.backgroundColor = 'cyan';
        menuConfig.color = '#000';
        directionConfig.fixedWidth = 0
        this.add.text(game.config.width/2, game.config.height/1.4 + borderUISize + borderPadding, 'Press SPACE to start', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/3.2, game.config.height/6.5, 'Press UP key to jump', directionConfig).setOrigin(0.5);
        this.add.text(game.config.width/1.4, game.config.height/6.5, 'Press DOWN key to slide', directionConfig).setOrigin(0.5);

        // Initialize variables
        this.currentTime = 0; 
        this.bestTime = game.bestTime || 0; 

        // Check if there is a high score
        if (game.bestTime === null) {
            this.bestTimeText = this.add.text(215, 15, `BEST TIME: 0:00`, {
                fontFamily: 'Courier',
                fontSize: '20px',
                color: '#ffffff'
            });
        } else {
            this.bestTimeText = this.add.text(215, 15, `BEST TIME: ${this.formatTime(game.bestTime)}`, {
                fontFamily: 'Courier',
                fontSize: '20px',
                color: '#ffffff'
            });
        }

        this.add.text(35, 420, `Game by Gavin Concepcion. Additional help from Dominic Fanaris.`, {
            fontFamily: 'Courier',
            fontSize: '15px',
            color: '#ffffff'
        });

        this.add.text(125, 440, `Music and sound effects from Freesound.org`, {
            fontFamily: 'Courier',
            fontSize: '15px',
            color: '#ffffff'
        });
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
            game.settings = {
                jumpSpeed: 5,
                obstacleSpeed: 2,
            }
            this.sound.play('sfx_select');
            this.scene.start('introScene');
        }
    }
}