class Police extends Car {
    constructor (scene, r = 200, playerZone = null, lane = false) {
        let carAssets = ['blackPolice', 'bluePolice'];

        let zone = new Phaser.Geom.Circle(0, 0, r);        
        let ge = scene.add.graphics();
        
        super(scene, lane, Phaser.Utils.Array.GetRandom(carAssets));
        this.setOrigin(.5);

        this.foundPlayer = false;
        this.graphicEngine = ge;
        this.zone = zone;
        this.detectionLevel = 0;
        this.r = r;
        this.playerZone = playerZone;

    }

    update() {
        this.zone.x = this.x;
        this.zone.y = this.y;
        

        //console.log("zone 1 - x: " + this.zone.x + "     y: " + this.zone.y)

        this.graphicEngine.clear();
        this.graphicEngine.fillStyle(0xFF4444, this.detectionLevel/150);
        this.graphicEngine.fillCircleShape(this.zone);
        this.graphicEngine.fillStyle(0xFF0000, this.detectionLevel/150);
        let temp = new Phaser.Geom.Circle(this.x, this.y, ((this.r/150) * this.detectionLevel))
        this.graphicEngine.fillCircleShape(temp);
        //this.graphicEngine.strokeCircleShape(this.zone, 64);


        this.detectionLevel <= 0 ? false : this.detectionLevel--;

        if(this.foundPlayer) this.scene.scene.start('titleScene');

        if (this.playerZone != null) this.isOverlapping(this.playerZone);

        // destroy car if it reaches past the bottom edge of the screen
        if(game.config.height + 300 < this.y) {
            this.graphicEngine.clear();
            this.destroy();
        }
    }

    isOverlapping(objCircleZone) {
        if (Phaser.Geom.Intersects.CircleToCircle(this.zone, objCircleZone)){
            console.log("overlap");
            if (this.detectionLevel < 150) this.detectionLevel += 2;
            else this.foundPlayer = true;
            return true;
        }

        return false;
    }
    
    collide() { // On collision with the player, Arrest them immidiately
        //this.scene.scene.start('temp');
    }

    cleanup() { // clear the graphics engine so when the car is deleted, the detection ring dissapears too
        this.graphicEngine.clear();
    }

}