class Intro extends Phaser.Scene {
  constructor() {
    super("introScene");
  }

  create() {
    this.screenFadeing = true;
    // fade scene in from black at start of scene
    this.cam = this.cameras.main.fadeIn(5000, 0, 0, 0, null, this);

    // enable player input after camera finished fading in
    this.cam.on('camerafadeincomplete', () => {
      this.input.keyboard.enabled = true;
      this.screenFadeing = false;
      this.dialog = new dialogBoxBundle(this, [
        ['left', "Basic starter text for the conversation"],
        ['center', "Some other response to dialog"],
        ['end', "convo"]
      ])
      }
  );

    this.tutorialPanel = this.add.sprite(game.config.width/2,game.config.height/1.2, 'textbox').setOrigin(0.5,0.5).setDepth(101);
        this.tutorialText = this.add.text(game.config.width/2 - 13,game.config.height/1.2 - 5,
        `
        INTRO STAGE:
        Avoid as many cars as you can and get to the apartment!
        `, {
            fontFamily: 'Verdana',
            fontSize: '11px',
            padding: {
                top: 0,
                bottom: 0,
            }
        }).setOrigin(0.5,0.5).setDepth(101);

    this.sfx = this.sound.add('driving');
        this.sfx.setLoop(true);
        this.sfx.play()

    this.road = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'city').setOrigin(0,0).setScale(2.05);

    let menuConfig = {
      fontFamily: 'Arial',
      fontSize: '30px',
      backgroundColor: 'cyan',
      color: 'purple',
      align: 'center',
      padding: {
      top: 5,
      bottom: 5,
      }
    }
    //  this.add.text(game.config.width/2, game.config.height/1.4, 'Level 1: The Drive\n\nSPACE to continue', menuConfig).setOrigin(0.5);
    this.distanceRemainingText = this.add.text(game.config.width/2, 50, '', menuConfig).setOrigin(0.5);


    this.playerCar = this.physics.add.sprite(game.config.width/3, game.config.height/2, 'whiteCar').setOrigin(0.5, 0.5);
    this.playerCar.body.onCollide = true;      // must be set for collision event to work
    this.playerCar.body.onWorldBounds = true;  
    this.playerCar.body.onOverlap = true;      
    this.playerCar.setDebugBodyColor(0xFFFF00);
    this.playerCar.setCollideWorldBounds(true);
    this.playerCar.setBounceY(.3).setDrag(900);
    this.playerCar.setDepth(10);
    //this.playerCar.setScale(3.5);
    this.playerCar.body.setSize(60);
    this.playerCar.body.onOverlap = true;
    this.CAR_VELOCITY = 50;
    this.speed = 2;
    this.GOAL = 1000;


    // Car obstacles
    this.carGroup = this.add.group({
      runChildUpdate: true    // make sure update runs on group children
    });

    //car spawner
    this.carSpawnDelay = this.time.addEvent(
      {   delay: 1500, 
          callback: () => {
            console.log("added car")
            this.carGroup.add(new Car(this));
          },
          callbackScope: this,
          loop: true 
      }
    );
    
    
    
    this.timeAlive = 0;
    this.distance = 0;    
    this.carInvulnerable = false;
    this.carDamaged = false;

    // basically a diy tween for easing movement into the scene at startup 
    // this.speedRamp = .3;
    // this.delayedRamp = this.time.delayedCall(2000, () => {
    //   this.speedRamp = 0;
    // }, null, this);

    // Player Input
    this.cursors = this.input.keyboard.createCursorKeys();

    // dialogue
    // this.script = new dialogueBoxBundle(this, [
    //   ['JULES', 'So, tell me about hash.']
    // ], true)

  }


  update(){
  //   if (Phaser.Input.Keyboard.JustDown(keyH)) {
  //     //console.log('bruh');
  //     this.tutorialPanel.alpha = this.tutorialPanel.alpha == 1 ? 0 : 1;
  //     this.tutorialText.alpha = this.tutorialText.alpha == 1 ? 0 : 1;
  //     this.tutorialTip.alpha = this.tutorialTip.alpha == 1 ? 0 : 1;
  // }
    
    // if (!this.screenFadeing) this.dialog.update();

    this.playerCar.setMaxVelocity(40 * this.speed, 40 * this.speed);
    this.distance += this.speed/10
    this.distanceRemainingText.text = "Distance Left: " + Math.floor( this.GOAL - this.distance );

    // player input
    if(this.cursors.up.isDown) {
        this.playerCar.body.velocity.y -= (this.CAR_VELOCITY);
    } else if(this.cursors.down.isDown) {
        this.playerCar.body.velocity.y += (this.CAR_VELOCITY);
    }
    if(this.cursors.left.isDown) {
        this.playerCar.body.velocity.x -= (this.CAR_VELOCITY);
    } else if(this.cursors.right.isDown) {
        this.playerCar.body.velocity.x += (this.CAR_VELOCITY);
    }
    if (this.playerCar.y < game.config.height/5) this.playerCar.y = game.config.height/5;
    if (this.playerCar.y > game.config.height * 7/8) this.playerCar.y = game.config.height* 7/8;


    this.road.tilePositionY -= this.speed;
    if (this.speed < 10)this.speed += .005

    if (Phaser.Input.Keyboard.JustDown(this.cursors.space)) { 
      this.distanceRemainingText.removeFromDisplayList();   
      this.cam = this.cameras.main.fadeOut(2000, 0, 0, 0);
      this.cam.on('camerafadeoutcomplete', () => {
        this.scene.start('timeScene');
        this.sfx.stop() 
      })     
    }

    if (this.carDamaged) this.playerCar.alpha = this.carInvulnerable.elapsed % 1;
    this.physics.add.collider(this.playerCar, this.carGroup, null, this.carCollision, this);
    
    this.templist = this.carGroup.getChildren()
    this.templist.forEach((car) => {
      car.setVelocityY((this.speed * 30) + 30);
    });

    // set car frequency with the constant val
    this.carSpawnDelay.delay = 4000 / this.speed

    if (this.distance >= this.GOAL) {
      this.distanceRemainingText.removeFromDisplayList();   
      this.cam = this.cameras.main.fadeOut(3000, 0, 0, 0);
      this.cam.on('camerafadeoutcomplete', () => {
        this.scene.start('timeScene');
        this.sfx.stop() 
      })   
    }
  }

  carCollision(object1, object2) { 
    if (!this.carDamaged){
        object1.y += 100;
        this.carDamaged = true;
        this.carInvulnerable = this.time.delayedCall(3000, () => {
            this.carDamaged = false;
            object1.alpha = 1;
        }, null, this);
    }
    object2.destroy();
    if (this.speed > 3) this.speed = this.speed/2;      
  }

}