class Intro extends Phaser.Scene {
  constructor() {
    super("introScene");
  }

  preload() {
    this.load.image('white-car', './assets/white-car.png');
    this.load.image('road', './assets/road.png');
  }

  create() {
    this.road = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'road').setOrigin(0,0);

    let menuConfig = {
      fontFamily: 'Arial',
      fontSize: '20px',
      backgroundColor: 'cyan',
      color: 'purple',
      align: 'right',
      padding: {
      top: 5,
      bottom: 5,
      }
    }
    this.add.text(game.config.width/2, game.config.height/1.4, 'Level 1: The Drive\n\nSPACE to continue', menuConfig).setOrigin(0.5);

    this.playerCar = this.physics.add.sprite(game.config.width/3, game.config.height/2, 'white-car').setOrigin(0.5, 0.5);
    this.playerCar.body.onCollide = true;      // must be set for collision event to work
    this.playerCar.body.onWorldBounds = true;  // ditto for worldbounds
    this.playerCar.body.onOverlap = true;      // ditto for overlap
    this.playerCar.setDebugBodyColor(0xFFFF00);
    this.playerCar.setCollideWorldBounds(true);
    this.playerCar.setMaxVelocity(250, 430).setBounceY(.3).setDrag(900);
    this.playerCar.setDepth(10);
    this.playerCar.setScale(2.5);
    this.playerCar.body.onOverlap = true;
    this.SHIP_VELOCITY = 50;


    // Asteroid belt objects
    this.carGroup = this.add.group({
      runChildUpdate: true    // make sure update runs on group children
    });

    this.timeAlive = 0;

    // basically a diy tween for easing movement into the scene at startup 
    // this.speedRamp = .3;
    // this.delayedRamp = this.time.delayedCall(2000, () => {
    //   this.speedRamp = 0;
    // }, null, this);

    // Player Input
    cursors = this.input.keyboard.createCursorKeys();

  }


  update(){

    // player input
    this.direction = new Phaser.Math.Vector2(0);
    if(cursors.up.isDown) {
        this.playerCar.body.velocity.y -= (this.SHIP_VELOCITY);
    } else if(cursors.down.isDown) {
        this.playerCar.body.velocity.y += (this.SHIP_VELOCITY);
    }
    if(cursors.left.isDown) {
        this.playerCar.body.velocity.x -= (this.SHIP_VELOCITY);
    } else if(cursors.right.isDown) {
        this.playerCar.body.velocity.x += (this.SHIP_VELOCITY);
    }
    if (this.playerCar.y < game.config.height/3) this.playerCar.y = game.config.height/3;
    if (this.playerCar.y > game.config.height * 7/8) this.playerCar.y = game.config.height* 7/8;
    this.direction.normalize();

    this.physics.add.collider(this.playerCar, this.carGroup, null, () => {
      // start next scene
      this.scene.start('timeScene');
    }, this);

    this.road.tilePositionY += 2;

    if (Phaser.Input.Keyboard.JustDown(cursors.space)) {    
      this.scene.start('timeScene');    
    }

  }

}