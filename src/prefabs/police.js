class Police extends Car {
    constructor (scene, lane = false, r = 100) {
        super(scene, lane);
        this.setOrigin(.5);

        //this.carAssets = ['blackPolice', 'bluePolice'];

        this.detectionRadius = r;
        this.zone = new Phaser.Geom.Circle(this.x, this.y, r);
        // this.ellipse2 = new Phaser.Geom.Ellipse(this.x, this.y, 0);

        


        this.graphic = scene.add.graphics({ 
            fillStyle: {color: 0xff0000, alpha: 1 }
        });
        // this.graphic2 = scene.add.graphics({ 
        //     fillStyle: {color: 0x0f0, alpha: 1 }
        // });
        this.graphic.strokeCircleShape(this.zone, 64);
        // this.graphic2.strokeEllipseShape(this.ellipse2, 64);


    }

    update() {
        // destroy car if it reaches past the bottom edge of the screen
        if(game.config.height + 100 < this.y) {
            this.destroy();
        }


        this.zone.x = this.x;
        this.zone.y = this.y;
        

        //console.log("zone 1 - x: " + this.zone.x + "     y: " + this.zone.y)

        this.graphic.clear();
        // this.graphic2.clear();
        this.graphic.strokeCircleShape(this.zone, 64);
        // this.graphic2.strokeEllipseShape(this.ellipse2, 64);

        // if (Phaser.Geom.Intersects.CircleToCircle(this.zone, this.zone)) console.log("overlap")

    }

    isOverlapping(objCircleZone) {
        if (Phaser.Geom.Intersects.CircleToCircle(this.zone, objCircleZone)){
            console.log("overlap")
            return true;
        }

        return false;
    }
}