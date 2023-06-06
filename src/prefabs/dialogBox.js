class Dialog {

    constructor(scene, side, textSpeed = 30, inFocus = false, bodyText = '') {

        let x, y;
        let textWidth = (side != 'center' ? 300 : game.config.width * 4/5)
        let bubbleType = '';
        let textOffset = 0;
        let arrowOffset = {x: 0, y: 110};


        if (side == 'left') {
            x = game.config.width / 5
            y = inFocus ? game.config.width / 2 : game.config.height * 5/6
            bubbleType = 'playerBubble';
            textOffset = 20
            arrowOffset.x = 20

        } else if (side == 'right') {
            x = game.config.width * 3/4
            y = inFocus ? game.config.width / 2 : game.config.height * 5/6
            bubbleType = 'grandBubble'
            textOffset = -10
            arrowOffset.x = -10

        } else if (side == 'center'){
            x = game.config.width / 2 
            y = inFocus ? game.config.width / 2 : game.config.height * 4/5
            bubbleType = 'largeGrandBubble'
            arrowOffset.y = 150;

        } else {
            console.log('Undifined Side on Dialog Box with :' + bodyText)
        }
        
        this.image = scene.add.sprite(x, y, bubbleType).setOrigin(.5);

        if (side !== 'center') this.boxText = scene.add.bitmapText(x + textOffset,y, "CraftyGirls24", '').setOrigin(0.5).setCenterAlign().setMaxWidth(textWidth);
        else {
            this.boxText = scene.add.bitmapText(x, y + 75, "CraftyGirls24", '').setOrigin(0.5).setCenterAlign().setMaxWidth(textWidth);
            this.oldText = scene.add.bitmapText(x, y - 65, "CraftyGirls24", '').setOrigin(0.5).setCenterAlign().setMaxWidth(textWidth).setAlpha(.45);
        }

        this.waitArrow = scene.add.sprite(x + arrowOffset.x, y + arrowOffset.y, bubbleType === 'playerBubble' ? 'playerTri' : (bubbleType === 'grandBubble' || bubbleType === 'largeGrandBubble') ? 'grandTri' : null).setOrigin(.5);
        this.waitArrow.setDepth(100).removeFromDisplayList();

        this.x = x;
        this.y = y;
        this.arrowOffset = arrowOffset;
        this.bounceTween = null;
        this.isTweening = false;
        this.textWidth = textWidth;
        this.scene = scene;
        this.textSpeed = textSpeed;
        this.textOffset = textOffset;
        this.isWaiting = false;
        this.isTyping = false;
        this.side = side;
        this.DialogToDisplayQ = new Queue();
        this.text = '';
        this.showTextFlag = false;

    }

    addText(body, speed = this.textSpeed) {
        this.show()
        if (this.isTyping) {
            this.DialogToDisplayQ.enqueue(body)
        } else {
            this.displaySlowText(body, speed)
        }
    }

    displaySlowText(fullText, textSpeeeeeed = this.textSpeed) {
        this.isTyping = true;
        this.isWaiting = false;
        if (this.side == 'center') {
            this.oldText.text = this.text;
        }
        this.text = fullText;
        this.displaySlowTextR(fullText, textSpeeeeeed, 0);
        let timeToType = fullText.length * textSpeeeeeed * 2;
        this.typingTimer = this.scene.time.delayedCall(timeToType, () => {console.log('done writing'); this.isWaiting = true; this.isTyping = false}, null, this.scene)
              
    }

    displaySlowTextR(fullText, textSpeeeeeed, textIndex) {

        if (textIndex > fullText.length) return;
        this.boxText.setText(fullText.slice(0, textIndex))

        if (this.showTextFlag) {
            this.showTextFlag = false;
            this.boxText.setText(this.text);
            this.typingTimer.hasDispatched = true;
                console.log('done writing'); this.isWaiting = true; this.isTyping = false;
            return;
        }

        this.scene.time.delayedCall(textSpeeeeeed, () => {
            this.displaySlowTextR(fullText, textSpeeeeeed, textIndex+1)
            //this.side === 'center' ? this.boxText.setPosition(this.x, this.y + 65) : this.boxText.setPosition(this.x + this.textOffset, this.y) 
        }, null, this.scene);
    }

    hide() {
        this.image.removeFromDisplayList();
        this.boxText.removeFromDisplayList().setText('');
        this.waitArrow.removeFromDisplayList();
        if (this.side == 'center') this.oldText.removeFromDisplayList().setText('') 
    }

    show() {
        this.image.addToDisplayList();
        this.boxText.addToDisplayList();
        if (this.side == 'center') this.oldText.addToDisplayList() 
    }

    // when a box is clicked
    click() {
        if (!this.isTyping){
            if (this.DialogToDisplayQ.isEmpty) this.hide()
            else {
                this.displaySlowText(this.DialogToDisplayQ.dequeue())
            }
        } else {
            this.showTextFlag = true;
        }
    }

    createArrowBounce() {
        this.waitArrow.addToDisplayList()
        if (this.bounceTween === null)
        this.bounceTween = this.scene.tweens.add({
            targets: this.waitArrow,
            y: (this.y + this.arrowOffset.y + 25),
            ease: 'Quad.Out',
            duration: 1000,
            yoyo: true,
            repeat: 10000000
        });
    }
    
    shift(target) {
        if(this.isTweening) return;
        console.log('shift')
        this.isTweening = true;

        if (this.bounceTween != null) {
            this.bounceTween.complete();
            this.bounceTween = null;
        }

        this.scene.time.delayedCall(1600, () => {
            this.isTweening = false;
        }, null, this.scene);

        
        if (this.side === 'center') {
            if (target >= game.config.height * 4/5) target = game.config.height * 4/5;
            this.scene.tweens.add({
                targets: this.image,
                y: target,
                ease: 'Quad.InOut',
                duration: 1500,
            });

            this.scene.tweens.add({
                targets: this.boxText,
                y: (target + 75),
                ease: 'Quad.InOut',
                duration: 1500,
            });

            this.scene.tweens.add({
                targets: this.oldText,
                y: (target-65),
                ease: 'Quad.InOut',
                duration: 1500,
            });

            this.scene.tweens.add({
                targets: this.waitArrow,
                y: (target + 150),
                ease: 'Quad.InOut',
                duration: 1500,
            });

        } else {
            if (target >= game.config.height * 5/6) target = game.config.height * 5/6;
            this.scene.tweens.add({
                targets: [this.boxText, this.image],
                y: target,
                ease: 'Quad.InOut',
                duration: 1500,
            });

            this.scene.tweens.add({
                targets: this.waitArrow,
                y: (target + 150),
                ease: 'Quad.InOut',
                duration: 1500,
            });
        }

        this.y = target
    }

    get finished (){
        return this.DialogToDisplayQ.isEmpty && !this.isTyping
    }

    
}

class Queue {
    constructor() {
      this.elements = {};
      this.head = 0;
      this.tail = 0;
    }
    enqueue(element) {
      this.elements[this.tail] = element;
      this.tail++;
    }
    dequeue() {
      const item = this.elements[this.head];
      delete this.elements[this.head];
      this.head++;
      return item;
    }
    peek() {
      return this.elements[this.head];
    }
    get length() {
      return this.tail - this.head;
    }
    get isEmpty() {
      return this.length === 0;
    }
}

