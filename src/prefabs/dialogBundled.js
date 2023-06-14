class dialogBoxBundle {
    constructor(scene, script, inFocus = false, leftAsset = null, rightAsset = null, centerAsset = null){
        this.scene = scene;
        this.rightBox = new Dialog(scene, 'right', 20, inFocus, '', rightAsset);
        this.leftBox = new Dialog(scene, 'left', 20, inFocus, '', leftAsset);
        this.leftBox.hide(true);
        this.rightBox.hide(true);

        
        this.script = script;
        this.nextInstruction = this.script[0][0];
        this.activeBox = this.leftBox;
        this.scriptIndex = -1;
        this.unusable = false;
        this.lastBoxClicked = false;
        this.paused = false;
        this.pauseTimer;

        if (scene.dialogImages === undefined) scene.dialogImages = [];
    }

    update(){
        if (this.unusable || this.paused) return;
        if (this.scriptIndex == -1) this.cycleScript();
        //if (this.activeBox.isWaiting && !this.activeBox.isTweening) this.activeBox.createArrowBounce();

        
        // Code for if we want a pointer CLICK to also advance the dialog

        /*this.scene.input.on('pointerup', () => {
            this.activeBox.waitArrow.removeFromDisplayList()
            if (this.scene.input.activePointer.upY > 600) 
                if(this.activeBox.DialogToDisplayQ.isEmpty && this.nextInstruction !== 'end')this.cycleScript();
                else if (this.activeBox.finished && this.nextInstruction === 'end') {
                    this.lastBoxClicked = true;
                    this.activeBox.isTyping = true;
                    this.unusable = true;
                }
                else this.activeBox.click()
        });*/


        // Code for advancing the dialog boxes with SPACE

        /*if (Phaser.Input.Keyboard.JustDown(this.scene.cursors.space)) {
            //console.log("space pressed")              DEBUG COMMENT
            this.activeBox.waitArrow.removeFromDisplayList()
            if (this.activeBox.isTyping) this.activeBox.showTextFlag = true;
                else if(this.activeBox.DialogToDisplayQ.isEmpty && this.nextInstruction !== 'end')this.cycleScript();
                else if (this.activeBox.finished && this.nextInstruction === 'end') {
                    this.lastBoxClicked = true;
                    this.activeBox.isTyping = true;
                    this.unusable = true;
                }
                else this.activeBox.click();
        }*/

        if (this.activeBox.finished) this.cycleScript();

    }

    cycleScript(){
        //console.log(this.activeBox.isTyping + "   " + this.nextInstruction)               DEBUG COMMENT

        // do nothing if text is not finished from current box or if we reached the end of the script   
        if (this.activeBox.isTyping || this.nextInstruction === 'end') return;

        let currentBox = '', boxChosen = false;
        for (let i = this.scriptIndex + 1; i < this.script.length-1; i++, this.scriptIndex++) {

            if (this.paused) return; //if the pause command was just read, leave and cycleScript will automatically be called at the end of the pause duration

            if (currentBox != this.nextInstruction && boxChosen) return; // if the next script line is not about giving the current box dialog, then we will come back to it later

            if (this.nextInstruction === 'left') { // left is our next dialog sequence
                currentBox = 'left'; 
                boxChosen = true;
                this.activeBox = this.leftBox;
                this.activeBox.addText(this.script[i][1]);
                

            } else if (this.nextInstruction === 'right') { // right is our next dialog sequence
                currentBox = 'right'; 
                boxChosen = true;
                this.activeBox = this.rightBox;
                this.activeBox.addText(this.script[i][1])

            } else if (this.nextInstruction === 'sound') { // make noise
                // PLAY THE SOUND AT THE FILE PATH
                console.log('sfx: ', this.script[i][1]);
                this.sfx = this.scene.sound.add(this.script[i][1])
                this.sfx.play();

            } else if (this.nextInstruction === 'hide') {  // hide a box
                this.script[i][1] === 'left' ? this.leftBox.hide() : 
                (this.script[i][1] === 'right' ? this.rightBox.hide() : false)
            
            } else if (this.nextInstruction === 'shift') { // shift the boxes to a certain y position on the screen
                if (this.script[i][1] === 'right') this.rightBox.shift(this.script[i][2]);
                else if (this.script[i][1] === 'left') this.leftBox.shift(this.script[i][2]);
                else this.shiftFocus(this.script[i][1]);

            } else if (this.nextInstruction === 'image') { // load an image onto the screen with the given key
                let tempImage = this.scene.add.image(this.script[i][1], this.script[i][2], this.script[i][3]).setOrigin(.5).setScale(this.script[i][4])
                this.scene.dialogImages.push(tempImage);
                tempImage.alpha = 0;
                this.tweenImageAlpha(tempImage, 1);

            } else if (this.nextInstruction === 'pause') { // pause the dialog for a specified ammount of time
                this.paused = true;
                this.scene.time.delayedCall(this.script[i][1], () => {
                    this.paused = false;
                    this.cycleScript();
                })

            } else if (this.nextInstruction === 'end') {
                return; // our script is DONE!

            } else {
                console.log("UNDEFINED INSTRUCTION ON LINE " + i + ":  " + this.script[i][0])
            }
            
            try {
                this.nextInstruction = this.script[i+1][0];
            } catch {
                console.log("INCORRECT SCRIPT FORMATTING (check your commas!!)");
            }
        }
    }

    shiftFocus(targetY) {
        if (this.activeBox.isWaiting) {
            this.activeBox.waitArrow.removeFromDisplayList();
        }

        this.leftBox.shift(targetY);
        this.rightBox.shift(targetY);
        
    }

    get scriptFinished() {
        return (this.lastBoxClicked && ((this.scriptIndex >= this.script.length) || this.nextInstruction === 'end')) ? this.script[this.scriptIndex+1][1] : false;

    }

    tweenImageAlpha(image, targetAlpha){
        this.scene.tweens.add({
            targets: image,
            alpha: targetAlpha,
            ease: 'Quad.InOut',
            duration: 1500,
        });
    }

    removeAllDialogImages() {
        if (this.scene.dialogImages) {
            this.scene.dialogImages.forEach(curr => this.tweenImageAlpha(curr, 0));
        }
    }

    remove(instantly = false) {
        
        if(instantly) {
            this.leftBox.image.removeFromDisplayList();
            this.leftBox.boxText.removeFromDisplayList();
            this.leftBox.waitArrow.removeFromDisplayList();

            this.rightBox.image.removeFromDisplayList();
            this.rightBox.boxText.removeFromDisplayList();
            this.rightBox.waitArrow.removeFromDisplayList();
        }

        if (!(this.leftBox.isHidden === true || this.leftBox.alpha === 0)) this.leftBox.hide(instantly)
        if (!(this.rightBox.isHidden === true || this.rightBox.alpha === 0))this.rightBox.hide(instantly)
        
        this.unusable = true;
    }

}