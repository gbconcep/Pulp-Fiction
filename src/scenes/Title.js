class Title extends Phaser.Scene {
    constructor() {
      super("titleScene");
    }
    
    create() {

        this.logo = this.add.image(game.config.width/2, game.config.width/3, 'logo').setOrigin(.5);

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
            fontFamily: 'Courier',
            fontSize: '20px',
            backgroundColor: 'yellow',
            color: 'red',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 100
        }

        // define keys
        cursors = this.input.keyboard.createCursorKeys(); 
        key1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
        key2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
        key3 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);
        this.keyC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
        
        // show menu text
        menuConfig.backgroundColor = 'cyan';
        menuConfig.color = '#000';
        directionConfig.fixedWidth = 0

        this.add.text(game.config.width/2, game.config.height/1.25, 'Press C for Credits', directionConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/1.4, 'Press SPACE to Begin', directionConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height * 2.5/4, 'Use ARROW KEYS to move', directionConfig).setOrigin(0.5);
        // this.add.text(game.config.width/1.4, game.config.height/6.5, 'Press DOWN key to slide', directionConfig).setOrigin(0.5);

        this.add.text(game.config.width/2, 500, `Game by Alex Groff and Gavin Concepcion`).setOrigin(.5);

        this.add.text(game.config.width/2, 520, `Music and sound effects from Freesound.org`, {
            fontFamily: 'Courier',
            fontSize: '15px',
            color: '#ffffff'
        }).setOrigin(.5);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(cursors.space) || Phaser.Input.Keyboard.JustDown(key1)) {    
            this.scene.start('introScene');    
        } else if (Phaser.Input.Keyboard.JustDown(key2)) {    
            this.scene.start('timeScene');    
        } else if (Phaser.Input.Keyboard.JustDown(key3)) {    
            this.scene.start('stealthScene');    
        } else if (Phaser.Input.Keyboard.JustDown(this.keyC)) {    
            this.scene.start('temp');    
        }
    }
}
