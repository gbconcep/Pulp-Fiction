class Stealth extends Phaser.Scene {
  constructor() {
    super("stealthScene");
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

    // hint panel
    this.tutorialPanel = this.add.sprite(game.config.width/2, game.config.height/1.15, 'textbox').setOrigin(0.5,0.5).setDepth(101);
    this.tutorialPanel.setScale(2, .7);
    this.tutorialText = this.add.bitmapText(this.tutorialPanel.x, this.tutorialPanel.y, 'dialogW',`INTRO STAGE: \nGet to Jimmie's without getting caught!`, 20).setDepth(101).setOrigin(.5)
    this.tutorialTip = this.add.bitmapText(this.tutorialPanel.x, this.tutorialPanel.y + 50, 'dialogW',`PRESS (SHIFT) TO HIDE/SHOW`, 15).setDepth(101).setOrigin(.5)

    // sound
    this.sfx = this.sound.add('driving');
    this.damage = this.sound.add('damage');
    this.sfx.setLoop(true);
    this.sfx.play()

    // Background Road
    this.road = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'city').setOrigin(0,0).setScale(1.35);

    // Player Car Setup
    this.playerCar = this.physics.add.sprite(game.config.width/1.5, game.config.height/2, 'bloodCar').setOrigin(0.5, 0.5);
    this.playerCar.body.onCollide = true;      // must be set for collision event to work
    this.playerCar.body.onWorldBounds = true;  
    this.playerCar.body.onOverlap = true;      
    this.playerCar.setDebugBodyColor(0xFFFF00);
    this.playerCar.setCollideWorldBounds(true);
    this.playerCar.setBounceY(.3).setDrag(900);
    this.playerCar.setDepth(10);
    this.playerCar.body.setSize(60);
    this.playerCar.body.onOverlap = true;
    this.CAR_VELOCITY = 50;
    this.speed = 3;
    this.GOAL = 2000;
    this.playerCar.detectionZone = new Phaser.Geom.Circle(this.x, this.y, 20);


    // Car obstacles
    this.carGroup = this.add.group({
      runChildUpdate: true    // make sure update runs on group children
    });

    // Initialize a variable to keep track of the spawn count
    let spawnCount = 0;

    // Car spawner
    this.carSpawnDelay = this.time.addEvent({
      delay: 1500,
      callback: () => {
        console.log("added car");
        if (spawnCount % 4 === 0) {
          this.carGroup.add(new Police(this, 250, this.playerCar.detectionZone));
        } else {
          this.carGroup.add(new Car(this));
        }
        spawnCount++;
      },
      callbackScope: this,
      loop: true,
    });

    
    
    this.timeAlive = 0;
    this.distance = 0;    
    this.carInvulnerable = false;
    this.carDamaged = false;
    this.timeLeft = 60;

    let menuConfig = {
      fontFamily: 'Courier',
      fontSize: '30px',
      backgroundColor: 'white',
      color: 'red',
      align: 'center',
      padding: {
      top: 5,
      bottom: 5,
      }
    }

    //this.add.text(game.config.width/2, game.config.height/1.4, 'Level 2: The Rush\n\nSPACE to continue', menuConfig).setOrigin(0.5);
    this.distanceRemainingText = this.add.text(game.config.width/2, 50, '', menuConfig).setOrigin(0.5);
    this.timerText = this.add.text(game.config.width/2, 100, '', menuConfig).setOrigin(.5);


    // basically a diy tween for easing movement into the scene at startup 
    // this.speedRamp = .3;
    // this.delayedRamp = this.time.delayedCall(2000, () => {
    //   this.speedRamp = 0;
    // }, null, this);

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

    // dialogue
    this.script = new dialogBoxBundle(this, [
      ['left', `JULES: Wtf is happening?`],
      ['right', `VINCENT: Ah man, I just shot Marvin in the face...`],
      ['left', `JULES: Why the fuck did you do that?`],
      ['right', `VINCENT: I didn't mean to do it. It was an accident!`],
      ['left', `JULES: Man I have seen a lot of craziness in my time and-`],
      ['right', `VINCENT: Chill out man, it was an accident! You hit a bump or somethin'...`], 
      ['left', `JULES: This car didn't hit no bump!`],
      ['right', `VINCENT: Look, I didn't mean to shoot him. The gun just went off, dont ask me out!`],
      ['left', `JULES: Look at this mess! We are driving on the city streets in broad daylight!`],
      ['right', `VINCENT: I know, I know! I wasn't thinking about the splatter...`],
      ['left', `JULES: Well you better be thinking about the splatter!`],
      ['left', `JULES: We have to get this car off the road.`],
      ['left', `JULES: Cops tend to notice when a car is drenched in blood!`],
      ['right', `VINCENT: Can't we just take it to a friendly place?`],
      ['left', `JULES: Friendlyplace-this is the Valley, Vincent!`],
      ['left', `JULES: Marsellus got no friendly places in the Valley!`],
      ['right', `VINCENT: Well don't look at me! This is your town, Jules!`],
      ['left', `JULES: *sigh* Hang on, lemme make a call...`],
      ['right', `VINCENT: Who you callin'?`],
      ['left', `JULES: A buddy of mine in Toluca Lake.`],
      ['right', `VINCENT: Wheres Toluca Lake?`],
      ['left', `JULES: On the other side of the hill, by Burbank Studios.`],
      ['left', `JULES: If Jimmie ain't home, I dont know what we are going to do!`],
      ['left', `JULES: Jimmie! How you doin, man it Jules.`],
      ['left', `JULES: Me and a friend need to use your garage for a couple hours...`],
      ['end', "convo"]
    ], false, 'jules', 'vince')
  }


  update(){
    // hint toggle
    if (Phaser.Input.Keyboard.JustDown(this.cursors.shift)) {
      //console.log('bruh');
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
        this.scene.start('titleScene');
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
    object2.cleanup()
    object2.destroy();
    if (this.speed > 3) this.speed = this.speed/2;      
  }
}