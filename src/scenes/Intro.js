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
    });

    // hint panel
    this.tutorialPanel = this.add.sprite(game.config.width/2, game.config.height/1.15, 'textbox').setOrigin(0.5,0.5).setDepth(101);
    this.tutorialPanel.setScale(2, .7);
    this.tutorialText = this.add.bitmapText(this.tutorialPanel.x, this.tutorialPanel.y, 'dialogW',`INTRO STAGE: \nAvoid as many cars as you can and get to the apartment!`, 20).setDepth(101).setOrigin(.5)
    this.tutorialTip = this.add.bitmapText(this.tutorialPanel.x, this.tutorialPanel.y + 50, 'dialogW',`PRESS (SHIFT) TO HIDE/SHOW`, 15).setDepth(101).setOrigin(.5)

    // sound
    this.sfx = this.sound.add('driving');
    this.damage = this.sound.add('damage');
    this.chill = this.sound.add('surfrider');
    this.sfx.setLoop(true);
    this.sfx.play()
    this.chill.setLoop(true);
    this.chill.play()

    // background Sprite
    this.road = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'city').setOrigin(0,0).setScale(1.35);

    let menuConfig = {
      fontFamily: 'Courier',
      fontSize: '30px',
      backgroundColor: 'white',
      color: 'cyan',
      align: 'center',
      padding: {
      top: 5,
      bottom: 5,
      }
    }
    //  this.add.text(game.config.width/2, game.config.height/1.4, 'Level 1: The Drive\n\nSPACE to continue', menuConfig).setOrigin(0.5);
    this.distanceRemainingText = this.add.text(game.config.width/2, 50, '', menuConfig).setOrigin(0.5).setDepth(3);


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
    this.playerCar.detectionZone = new Phaser.Geom.Circle(0, 0, 20);



    this.speed = 2;
    this.GOAL = 2000;


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
    this.script = new dialogBoxBundle(this, [
      ['left', `JULES: Okay so, tell me about the hash bars. It's legal here, right?`],
      ['right', `VINCENT: Yeah it's legal but it ain't 100% legal`],
      ['right', `VINCENT: You can't roll into a restaurant and start puffing away.`],
      ['right', `VINCENT: Only your home and certain designated places.`],
      ['right', `VINCENT: Let me break it down like this...`], 
      ['right', `VINCENT: It's legal to buy it, its legal to own it and...`],
      ['right', `VINCENT: If you're the proprietor, its legal to sell it`],
      ['right', `VINCENT: It's legal to carry it, which doesnt really matter cause...`],
      ['right', `VINCENT: Get a load of this, if the cops stop you, its illegal for them to search you.`],
      ['right', `VINCENT: Searching you is a right that Amsterdam cops don't have.`],
      ['left', `JULES: Oh man, I'm going! Haha!`],
      ['right', `VINCENT: You'd dig it the most, but you know the craziest thing about Europe?`],
      ['left', `JULES: What's that?`],
      ['right', `VINCENT: It's the little differences.`],
      ['right', `VINCENT: They have a lot of the same stuff, but they're a little different.`],
      ['left', `JULES: Examples?`],
      ['right', `VINCENT: For example in Amsterdam, they let you by a beer at a movie theatre. Like a full glass of beer.`],
      ['right', `VINCENT: In Paris, they let you buy a beer at McDonalds.`],
      ['right', `VINCENT: Actually, you know what they call a Quarter Pounder with Cheese in Paris?`],
      ['left', `JULES: They don't call it a Quarter Pounder with Cheese?`],
      ['right', `VINCENT: Nah they use the metric system over there. They don't know what a Quarter is.`],
      ['left', `JULES: So what they call it?`],
      ['right', `VINCENT: "Royale with Cheese."`],
      ['left', `JULES: Royale with Cheese. What they call a Big Mac?`],
      ['right', `VINCENT: A Big Mac's a Big Mac, but over there they call it *Le Big Mac*`],
      ['left', `JULES: What they call a Whopper?`],
      ['right', `VINCENT: I dunno. I didnt go into Burger King.`],
      ['end', "convo"]
    ], false, 'jules', 'vince');

  }


  update(){
    // console.log(this.input.mousePointer.x + "      " + this.input.mousePointer.y);

    // hint toggle
    if (Phaser.Input.Keyboard.JustDown(this.cursors.shift)) {
      this.tutorialPanel.alpha = this.tutorialPanel.alpha == 1 ? 0 : 1;
      this.tutorialText.alpha = this.tutorialText.alpha == 1 ? 0 : 1;
      this.tutorialTip.alpha = this.tutorialTip.alpha == 1 ? 0 : 1;
    }
    
    //if hint is not showing, then show dialog
    if (this.tutorialPanel.alpha === 0) {
      this.script.activeBox.show()
      this.script.update();
    } else {
      this.script.leftBox.hide()
      this.script.rightBox.hide()
    }
    
    // if (!this.screenFadeing) this.dialog.update();

    this.playerCar.setMaxVelocity(40 * this.speed, 40 * this.speed);
    this.distance += this.speed/10
    this.distanceRemainingText.text = "Distance Left: " + Math.floor( this.GOAL - this.distance );

    // player input
    if(this.cursors.up.isDown) {
        this.playerCar.body.velocity.y -= (this.CAR_VELOCITY);
    } else if(this.cursors.down.isDown) {
        this.playerCar.body.velocity.y += (this.CAR_VELOCITY);
    } else this.playerCar.body.velocity.y = 30 * this.speed/2;

    if(this.cursors.left.isDown) {
        this.playerCar.body.velocity.x -= (this.CAR_VELOCITY);
    } else if(this.cursors.right.isDown) {
        this.playerCar.body.velocity.x += (this.CAR_VELOCITY);
    }
    if (this.playerCar.y < game.config.height/5) this.playerCar.y = game.config.height/5;
    if (this.playerCar.y > game.config.height * 7/8) this.playerCar.y = game.config.height* 7/8;

    // speed updates
    this.road.tilePositionY -= this.speed;
    if (this.speed < 7)this.speed += .005


    // debug scene skip w SPACE
    
    // if (Phaser.Input.Keyboard.JustDown(this.cursors.space)) { 
    //   this.distanceRemainingText.removeFromDisplayList();   
    //   this.cam = this.cameras.main.fadeOut(2000, 0, 0, 0);
    //   this.cam.on('camerafadeoutcomplete', () => {
    //     this.scene.start('timeScene');
    //     this.sfx.stop() 
    //   })     
    // }

    // collision detection
    this.playerCar.detectionZone.x = this.playerCar.x;
    this.playerCar.detectionZone.y = this.playerCar.y
    if (this.carDamaged) this.playerCar.alpha = this.carInvulnerable.elapsed % 1;
    this.physics.add.collider(this.playerCar, this.carGroup, null, this.carCollision, this);

    
    this.templist = this.carGroup.getChildren()
    this.templist.forEach((car) => {
      car.setVelocityY((this.speed * 30) + 30);
    });

    // set car frequency with the constant val
    this.carSpawnDelay.delay = 4000 / this.speed


    // check win condition
    if (this.distance >= this.GOAL && !this.screenFadeing) {
      this.screenFadeing = true;
      this.distanceRemainingText.removeFromDisplayList();   
      this.cam = this.cameras.main.fadeOut(3000, 0, 0, 0);
      this.cam.on('camerafadeoutcomplete', () => {
        this.scene.start('timeScene');
        this.sfx.stop() 
        this.chill.stop()
      })   
    }
  }

  carCollision(object1, object2) { 
    if (!this.carDamaged){
        object1.y += 100;
        this.carDamaged = true;
        this.damage.play()
        this.carInvulnerable = this.time.delayedCall(3000, () => {
            this.carDamaged = false;
            object1.alpha = 1;
        }, null, this);
    }
    object2.destroy();
    if (this.speed > 3) this.speed = this.speed/2;      
  }

}