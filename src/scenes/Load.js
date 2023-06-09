class Load extends Phaser.Scene {
    constructor() {
        super('loadScene');
    }

    preload() {
        // loading bar
        // see: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/loader/
        let loadingBar = this.add.graphics();
        this.load.on('progress', (value) => {
            loadingBar.clear();                                 // reset fill/line style
            loadingBar.fillStyle(0xFFFFFF, 1);                  // (color, alpha)
            loadingBar.fillRect(0, game.config.height/2, game.config.width * value, 10);  // (x, y, w, h)
        });
        this.load.on('complete', () => {
            loadingBar.destroy();
        });

        this.load.path = './assets/';
        this.load.image('whiteCar', 'white-car.png');
        this.load.image('bloodCar', 'blood-car.png');
        this.load.image('logo', 'pulp-fiction-logo.png');
        this.load.image('redCar', 'convertible.png');
        this.load.image('city', 'city.png');
        this.load.image('road', 'road.png');
        this.load.image('freeway', 'freeway.png');
        this.load.image('blackPolice', 'black-police.png');
        this.load.image('bluePolice', 'blue-police.png');
        this.load.image('purpleCar', 'purple-car.png');
        this.load.image('yellowCar', 'yellow-car.png');
        this.load.image('orangeCar', 'orange-car.png');
        this.load.image('greenCar', 'green-car.png');
        this.load.image('aquaCar', 'aqua-car.png');
        this.load.image('textbox', 'text-box.png');
        this.load.image('vignette', 'vignette.png');
        this.load.image('lights', 'Headlights-1.png');
        this.load.image('crash', 'gameOver_crash.png');
        this.load.image('arrest', 'gameOver_arrest.png');

        // Dialog Boxes
        this.load.image('dialoguebox', 'dialogue-box.png');
        this.load.image('vince', 'vincedialog.png');
        this.load.image('lance', 'lancedialog.png');
        this.load.image('jules', 'julesdialog.png');


        // audio
        this.load.audio('driving', 'driving.mp3');
        this.load.audio('siren', 'siren.wav');
        this.load.audio('damage', 'damage.mp3');
        this.load.audio('failure', 'failure.wav');
        this.load.audio('surfrider', 'surfrider.mp3');
        this.load.audio('misirlou', 'misirlou.mp3');
        this.load.audio('outoflimits', 'outoflimits.mp3')

        // text fonts
        this.load.bitmapFont("dialogW", "./Fonts/dialogWhite/dialogWhite.png", "./Fonts/dialogWhite/dialogWhite.xml");
        this.load.bitmapFont("dialogB", "./Fonts/dialogBlack/dialogBlack.png", "./Fonts/dialogBlack/dialogBlack.xml");


    }

    create() {
       // go to Title scene
        this.scene.start('titleScene');
    }
}