class Car extends Phaser.Physics.Arcade.Sprite {
   
    constructor(scene, lane) {

        let carAsset = 'redCar';  //Phaser.Utils.Array.GetRandom(['car1', 'car2', 'car3', 'car4']);
        let carSpawn = Phaser.Utils.Array.GetRandom([100, 300, 500, 700]);
        // call Phaser Physics Sprite constructor
        super(scene, carSpawn, -30, carAsset); 
        
        this.parentScene = scene;               // maintain scene context

        // set up physics sprite
        this.parentScene.add.existing(this);    // add to existing scene, displayList, updateList
        this.parentScene.physics.add.existing(this);    // add to physics system
        this.setVelocityY(30);            // make it go!
        this.setImmovable();
        let carColors = [0xCCCC67, 0xB3CCCC, 0xCCCC98, 0x4CCCCC, 0xFFFFFF];
        this.tint = carColors[Math.floor(Math.random()* carColors.length)];
        //this.angle = Math.random() * 360;
        //this.rotateSpeed = (Math.random() * 4) - 2;
    }

    update() {

        //this.angle += this.rotateSpeed;

        // destroy paddle if it reaches the left edge of the screen
        if(game.config.height + 100 < this.y) {
            this.destroy();
        }
    }
}