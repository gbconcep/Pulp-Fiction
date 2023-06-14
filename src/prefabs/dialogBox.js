class Dialog {

    constructor(scene, side, textSpeed = 30, inFocus = false, bodyText = '', backgroundAsset = null) {

        let x, y;
        let textWidth = (side === 'center' ? game.config.width * 4/5 : 300)
        let bubbleType = '';
        let textOffset = {x: 0, y: 0};
        let arrowOffset = {x: 0, y: 110};
        this.DEFAULT_ALPHA = .75;


        if (side == 'left') {
            x = game.config.width/4
            y = game.config.height * 6/7
            bubbleType = 'jules';
            

        } else if (side == 'right') {
            x = game.config.width * 3/4
            y = game.config.height * 6/7
            bubbleType = 'vince'

        } else {
            console.log('Undifined Side on Dialog Box with :' + bodyText)
        }
        
        bubbleType = backgroundAsset === null ? bubbleType : backgroundAsset;
        this.image = scene.add.sprite(x, y, bubbleType).setOrigin(.5).setScale(4.5, 6.5);
        this.image.setAlpha(this.DEFAULT_ALPHA).setDepth(50);
        this.boxText = scene.add.bitmapText(x + textOffset.x, y + textOffset.y, "dialogB", '', 30).setOrigin(0.5).setCenterAlign().setMaxWidth(textWidth).setDepth(50);

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

    get finished (){
        return this.DialogToDisplayQ.isEmpty && !this.isTyping && !this.isWaiting
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
        this.text = fullText;
        this.displaySlowTextR(fullText, textSpeeeeeed, 0);
        let timeToType = fullText.length * textSpeeeeeed * 2;
        this.typingTimer = this.scene.time.delayedCall(timeToType, () => {console.log('done writing'); this.isWaiting = true; this.isTyping = false}, null, this.scene)
        this.textdelay = this.scene.time.delayedCall(timeToType + 1000, () => {
            this.isWaiting = false
            if (!this.DialogToDisplayQ.isEmpty) this.displaySlowText(this.DialogToDisplayQ.dequeue(), this.textSpeed) 
        }, null, this.scene);     
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
        }, null, this.scene);
    }

    hide(instantly = false) {
        if (this.isHidden) return;
        
        if (instantly) {
            this.image.alpha = 0;
            this.boxText.alpha = 0;
            this.waitArrow.alpha = 0;

        } else {
            this.scene.tweens.add({
                targets: [this.image, this.boxText, this.waitArrow],
                alpha: 0,
                ease: 'Quad.InOut',
                duration: 500,
            });
        }

        this.isHidden = true;
    }

    show(instantly = false) {

        if(this.isHidden) {
            this.image.alpha = 0;
            this.boxText.alpha = 0;
            this.waitArrow.alpha = 0;
        } else {
            return;
        }

        if(instantly){
            this.image.alpha = this.DEFAULT_ALPHA;
            this.boxText.alpha = 1;
            this.waitArrow.alpha = 1;
            return;
        }

        
        this.scene.tweens.add({
            targets: [this.image, this.boxText, this.waitArrow],
            alpha: this.DEFAULT_ALPHA,
            ease: 'Quad.InOut',
            duration: 500,
        });
        

        this.isHidden = false
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
            repeat: -1
        });
    }
    
    shift(target) {
        if(this.isTweening) return;
        this.isTweening = true;
        //console.log('shift')         DEBUG COMMENT

        if (this.bounceTween != null) {
            this.bounceTween.complete();
            this.bounceTween = null;
        }

        this.scene.time.delayedCall(1600, () => {
            this.isTweening = false;
        }, null, this.scene);

        
        
        if (target >= game.config.height * 5/6) target = (game.config.height * 5/6) - 61;
        this.scene.tweens.add({
            targets: [this.boxText],
            y: (target + this.textOffset.y),
            ease: 'Quad.InOut',
            duration: 1500,
        });

        this.scene.tweens.add({
            targets: [this.image],
            y: target,
            ease: 'Quad.InOut',
            duration: 1500,
        });

        this.scene.tweens.add({
            targets: this.waitArrow,
            y: (target + this.arrowOffset.y),
            ease: 'Quad.InOut',
            duration: 1500,
        });
    
        this.y = target
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

