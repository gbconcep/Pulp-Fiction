class Car extends Phaser.Physics.Arcade.Sprite {
   
    constructor(scene, lane = false) {

        let carAssets = ['orangeCar', 'yellowCar', 'greenCar', 'aquaCar', 'purpleCar', 'bluePolice' , 'blackPolice'];   
        let carSpawn = lane ? lane : Phaser.Utils.Array.GetRandom([100, 300, 500, 700]);

        // Randomly select a car asset
        let carAsset = Phaser.Utils.Array.GetRandom(carAssets);

        // call Phaser Physics Sprite constructor
        super(scene, carSpawn, -30, carAsset); 
        
        this.parentScene = scene;

        // set up physics sprite
        this.parentScene.add.existing(this);
        this.parentScene.physics.add.existing(this);
        this.setVelocityY(120);
        this.setImmovable();
        this.setScale(3);
    }

    // ...
}
