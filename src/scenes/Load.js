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
        this.load.image('starSpeeder', 'starSpeeder.png');
        this.load.image('whiteCar', 'white-car.png');
        this.load.image('bloodCar', 'blood-car.png');
        this.load.image('logo', 'pulp-fiction-logo.png');
        this.load.image('redCar', 'convertible.png');
        this.load.image('road', 'road.png');

    }

    create() {
       // go to Title scene
        this.scene.start('titleScene');
    }
}