class Police extends Car {
    constructor (scene, r = 200, playerZone = null, lane = false) {
        let carAssets = ['blackPolice', 'bluePolice'];

        

        let detectionRadius = r;
        let detectionLevel = 0;
        let zone = new Phaser.Geom.Circle(0, 0, r);        


        let foundPlayer = false;
        let ge = scene.add.graphics();
        
        super(scene, lane, Phaser.Utils.Array.GetRandom(carAssets));
        this.setOrigin(.5);

        this.foundPlayer = foundPlayer;
        this.graphicEngine = ge;
        this.zone = zone;
        this.detectionLevel = detectionLevel;
        this.detectionRadius = detectionRadius;
        this.playerZone = playerZone;

    }

    update() {
        // destroy car if it reaches past the bottom edge of the screen
        if(game.config.height + 100 < this.y) {
            this.destroy();
        }


        this.zone.x = this.x;
        this.zone.y = this.y;
        

        //console.log("zone 1 - x: " + this.zone.x + "     y: " + this.zone.y)

        this.graphicEngine.clear();
        this.graphicEngine.fillStyle(0xFF0000, this.detectionLevel/100);
        this.graphicEngine.fillCircleShape(this.zone);
        //this.graphicEngine.strokeCircleShape(this.zone, 64);


        this.detectionLevel <= 0 ? false : this.detectionLevel--;

        if(this.foundPlayer) this.scene.scene.start('titleScene');

        if (this.playerZone != null) this.isOverlapping(this.playerZone);
    }

    isOverlapping(objCircleZone) {
        if (Phaser.Geom.Intersects.CircleToCircle(this.zone, objCircleZone)){
            console.log("overlap");
            if (this.detectionLevel < 100) this.detectionLevel += 2;
            else this.foundPlayer = true;
            return true;
        }

        return false;
    }

    cleanup() {
        this.graphicEngine.clear();
    }

}