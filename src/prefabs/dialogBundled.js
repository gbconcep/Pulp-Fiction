class dialogBoxBundle {
    constructor(scene, script, inFocus = false){
        this.scene = scene;
        this.leftBox = new Dialog(scene, 'left', 20, inFocus);
        this.rightBox = new Dialog(scene, 'right', 20, inFocus);
        this.centerBox = new Dialog(scene, 'center', 20, inFocus);
        this.centerBox.hide();
        this.leftBox.hide();
        this.rightBox.hide();

        
        this.script = script;
        this.nextInstruction = this.script[0][0];
        this.activeBox = this.leftBox;
        this.scriptIndex = -1;
        this.unusable = false;
        this.lastBoxClicked = false;
        this.paused = false;
        this.pauseTimer;
    }

    update(){
        if (this.unusable || this.paused) return;
        if (this.scriptIndex == -1) this.cycleScript();
        if (this.activeBox.isWaiting && !this.activeBox.isTweening) this.activeBox.createArrowBounce();
        
        // Code for if we want a pointer click to also advance the dialog

        // this.scene.input.on('pointerup', () => {
        //     this.activeBox.waitArrow.removeFromDisplayList()
        //     if (this.scene.input.activePointer.upY > 600) 
        //         if(this.activeBox.DialogToDisplayQ.isEmpty && this.nextInstruction !== 'end')this.cycleScript();
        //         else if (this.activeBox.finished && this.nextInstruction === 'end') {
        //             this.lastBoxClicked = true;
        //             this.activeBox.isTyping = true;
        //             this.unusable = true;
        //         }
        //         else this.activeBox.click()
        // });

        if (Phaser.Input.Keyboard.JustDown(this.scene.cursors.space)) {
            console.log("space pressed")
            this.activeBox.waitArrow.removeFromDisplayList()
            if (this.activeBox.isTyping) this.activeBox.showTextFlag = true;
                else if(this.activeBox.DialogToDisplayQ.isEmpty && this.nextInstruction !== 'end')this.cycleScript();
                else if (this.activeBox.finished && this.nextInstruction === 'end') {
                    this.lastBoxClicked = true;
                    this.activeBox.isTyping = true;
                    this.unusable = true;
                }
                else this.activeBox.click();
        }

    }

    cycleScript(){
        console.log(this.activeBox.isTyping + "   " + this.nextInstruction)

        // do nothing if text is not finished from current box or if we reached the end of the script   
        if (this.activeBox.isTyping || this.nextInstruction === 'end') return;

        let currentBox = '', boxChosen = false;
        for (let i = this.scriptIndex + 1; i < this.script.length-1; i++, this.scriptIndex++) {

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

            } else if (this.nextInstruction === 'center') { // center is our next dialog sequence
                currentBox = 'center'; 
                this.leftBox.hide()
                this.rightBox.hide()
                boxChosen = true;
                this.activeBox = this.centerBox;
                this.activeBox.addText(this.script[i][1])

            } else if (this.nextInstruction === 'sound') { // make noise
                this.scene.sound.add(this.script[i][1]).play();

            } else if (this.nextInstruction === 'hide') {  // hide a box
                this.script[i][1] === 'left' ? this.leftBox.hide() : 
                (this.script[i][1] === 'right' ? this.rightBox.hide() : 
                (this.script[i][1] === 'center' ? this.centerBox.hide() : false))

            } else if (this.nextInstruction === 'puzzle') { // start the scene's puzzle when this keyword is found
                this.scene.puzzleIsActive = true;

            } else if (this.nextInstruction === 'shift') { // start the scene's puzzle when this keyword is found
                this.shiftFocus(this.script[i][1]);

            } else if (this.nextInstruction === 'end') {
                return; // our script is DONE!

            } else {
                console.log("UNDEFINED INSTRUCTION ON LINE " + i + ":  " + this.script[i][0])
            }
            
            try {
                this.nextInstruction = this.script[i+1][0];
            } catch {
                console.log("INCORRECT SCRIPT FORMATTING");
            }
        }
    }

    shiftFocus(targetY) {
        if (this.activeBox.isWaiting) {
            this.activeBox.waitArrow.removeFromDisplayList();
        }

        this.leftBox.shift(targetY);
        this.rightBox.shift(targetY);
        this.centerBox.shift(targetY);
        
    }

    get scriptFinished() {
        return (this.lastBoxClicked && ((this.scriptIndex >= this.script.length) || this.nextInstruction === 'end')) ? this.script[this.scriptIndex+1][1] : false;

    }

    remove() {
        this.leftBox.hide()
        this.rightBox.hide()
        this.centerBox.hide()
        this.unusable = true;
    }

}