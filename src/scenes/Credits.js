class Credits extends Phaser.Scene {
    constructor() {
        super("creditsScene");
    }

    create() {
        this.keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        this.add.bitmapText(10,10,'dialogW', 'ESC to return to menu', 20);

        this.credits = `CREDITS\nPulp Fiction\nby Alex Groff and Gavin Concepcion\nBased off the 1994 film by Quentin Tarantino\n\nSound effects from Freesound.org and YouTube.com\n\nSound creators:\nPolice siren sound by guitarguy1985\nDamage sound by qubodup\nGame over sound by myfox14\nCar driving sound effect by Yuarei (https://youtu.be/cxMmWIykFd8)\n\nMusic from the Pulp Fiction Official Soundtrack:\nSurf Rider, written by Bob Bogle, Nole "Nokie" Edwards, Don Wilson and performed by The Lively Ories\nMisirlou, performed by Dick Dale\nOut of Limits, written by Michael Gordon and performed by The Marketts`;

        this.add.bitmapText(50,50, 'dialogW', this.credits, 27);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.keyESC)) {
            this.scene.start('titleScene');
        }
    }

}