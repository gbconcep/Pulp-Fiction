class Car extends Phaser.Physics.Arcade.Sprite {
   
    constructor(scene, lane = false, asset = null) {

        let carAssets = ['orangeCar', 'yellowCar', 'greenCar', 'aquaCar', 'purpleCar'];   
        let carSpawn = lane ? lane : Phaser.Utils.Array.GetRandom([133, 320, 475, 663]);

        // Randomly select a car asset
        let carAsset = asset ? asset : Phaser.Utils.Array.GetRandom(carAssets);

        // call Phaser Physics Sprite constructor
        super(scene, carSpawn + (Math.random()*60 - 30), -50, carAsset); 
        
        this.parentScene = scene;

        // set up physics sprite
        this.parentScene.add.existing(this);
        this.parentScene.physics.add.existing(this);
        this.setVelocityY(120);
        this.setImmovable();
        this.body.setSize(60);
    }

    update() {
        // destroy car if it reaches past the bottom edge of the screen
        if(game.config.height + 100 < this.y) {
            this.destroy();
        }
    }

    collide() { // nothing special happens when a normal car collides with the player
        return;
    }

    cleanup() { // nothing in the base car class needs to be cleaned up before deletion

    }

}
