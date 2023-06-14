class Time extends Phaser.Scene {
  constructor() {
    super("timeScene");
  }

  create() {

    this.screenFadeing = true;
    // fade scene in from black at start of scene
    this.cam = this.cameras.main.fadeIn(4000, 0, 0, 0, null, this);

    // enable player input after camera finished fading in
    this.cam.on('camerafadeincomplete', () => {
      this.input.keyboard.enabled = true;
      this.screenFadeing = false;
    });

    //sound
    this.sfx = this.sound.add('driving');
    this.damage = this.sound.add('damage');
    this.sfx.setLoop(true);
    this.sfx.play()

    //Background Road
    this.road = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'city').setOrigin(0,0).setScale(1.35);
    this.vignette = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'vignette').setOrigin(0, 0).setScale(2.05).setDepth(3);

    let menuConfig = {
      fontFamily: 'Courier',
      fontSize: '30px',
      backgroundColor: 'red',
      color: 'black',
      align: 'center',
      padding: {
      top: 5,
      bottom: 5,
      }
    }

    this.distanceRemainingText = this.add.text(game.config.width/2, 50, '', menuConfig).setOrigin(0.5).setDepth(5);
    this.timerText = this.add.text(game.config.width/2, 100, '', menuConfig).setOrigin(.5).setDepth(5);

    // Player Car Setup
    this.playerCar = this.physics.add.sprite(game.config.width/2, game.config.height/2, 'redCar').setOrigin(0.5, 0.5);
    this.playerCar.body.onCollide = true;      // must be set for collision event to work
    this.playerCar.body.onWorldBounds = true;  
    this.playerCar.body.onOverlap = true;      
    this.playerCar.setDebugBodyColor(0xFFFF00);
    this.playerCar.setCollideWorldBounds(true);
    this.playerCar.setBounceY(.3).setDrag(900);
    this.playerCar.setDepth(2);
    this.playerCar.body.setSize(60);
    this.playerCar.body.onOverlap = true;
    this.CAR_VELOCITY = 50;
    this.speed = 4;
    this.GOAL = 2000;
    this.lights = this.add.sprite(this.playerCar.x, this.playerCar.y, 'lights').setDepth(3);    
    

    //Testing Night-like visuals w the Camera
    //this.cameras.main.postFX.addVignette()

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
    this.timeLeft = 60;

    // Player Input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

    this.gameOver = false;

    // 60 sec play clock
    this.clock = this.time.delayedCall(60000, () => {
        
      this.add.text(game.config.width/2, game.config.height/2, "GAME OVER", menuConfig).setOrigin(0.5);
      this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) for Menu Screen', menuConfig).setOrigin(0.5);
      this.gameOver = true;
  
    }, null, this);

    // hint panel
    this.tutorialPanel = this.add.sprite(game.config.width/2, game.config.height/1.15, 'textbox').setOrigin(0.5,0.5).setDepth(5);
    this.tutorialPanel.setScale(2, .7);
    this.tutorialText = this.add.bitmapText(this.tutorialPanel.x, this.tutorialPanel.y, 'dialogW',`INTRO STAGE: \nAvoid as many cars as you can and get to the apartment!`, 20).setDepth(101).setOrigin(.5).setDepth(5);
    this.tutorialTip = this.add.bitmapText(this.tutorialPanel.x, this.tutorialPanel.y + 50, 'dialogW',`PRESS (SHIFT) TO HIDE/SHOW`, 15).setDepth(101).setOrigin(.5).setDepth(5);

    // dialogue
    this.script = new dialogBoxBundle(this, [
      ['left', `LANCE: Hello, do you know how late it is? You're not supposed to be callin' me this late.`],
      ['right', `VINCENT: Lance, this is Vincent! Im driving to your place right now!!`],
      ['left', `LANCE: Whoa, hold your horses man, whats the problem?`],
      ['right', `VINCENT: You still got an adrenaline shot?`],
      ['left', `LANCE: ...maybe.`],
      ['right', `VINCENT: I need it, man, I got a chick D.O.ing on me!`],
      ['left', `LANCE: Well, don't bring her here man!`],
      ['left', `LANCE: I'm not kidding man! Dont you bring some-`],
      ['right', `VINCENT: No choice.`],
      ['left', `LANCE: Shes O.D.ing??`],
      ['right', `VINCENT: Yeah, shes dyin'.`],
      ['left', `LANCE: Then bite the bullet, take her to a hospital, and call a lawyer!`],
      ['right', `VINCENT: Negative.`],
      ['left', `LANCE: She ain't my problem, you did this to her, you deal with it!`], 
      ['left', `LANCE: ...are you talking to me on a cellular phone?`], 
      ['right', `VINCENT: Yeah why-`],
      ['left', `LANCE: I don't know you, who is this, don't come here, I'm hanging up!`], 
      ['right', `VINCENT: Too late! Already here!`],
      ['left', `LANCE: What!?`], 
      ['end', "convo"]
    ], false, 'lance', 'vince')
    
  }


  update(){

    this.lights.setPosition(this.playerCar.x, this.playerCar.y - 50);

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

    // check for lose condition
    if (this.gameOver && Phaser.Input.Keyboard.JustDown(this.keyR)) {
      this.scene.start("titleScene");
    }

    // update timer
    this.timerText.text = "Time Remaining: " + Math.floor((this.clock.getRemaining())/1000);

    if(this.gameOver){
      this.carGroup.runChildUpdate = false;
      this.playerCar.removeFromDisplayList();
      this.playerCar.setPosition(100000,10000);
    } else {
      this.playerCar.setMaxVelocity(40 * this.speed, 40 * this.speed)
      this.distance += this.speed/10
      this.distanceRemainingText.text = "Distance Left: " + Math.floor( this.GOAL - this.distance );
      
      if (this.speed < 10) this.speed += .005;
    }
    this.road.tilePositionY -= this.speed;

    

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


   
    // if (Phaser.Input.Keyboard.JustDown(cursors.space)) {    
    //   this.scene.start('stealthScene');
    //   this.sfx.stop()      
    // }

    // colision detection
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
      this.clock.hasDispatched = true;
      this.distanceRemainingText.removeFromDisplayList();   
      this.cam = this.cameras.main.fadeOut(3000, 0, 0, 0);
      this.cam.on('camerafadeoutcomplete', () => {
        this.scene.start('stealthScene');
        this.sfx.stop() 
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