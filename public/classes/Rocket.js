export default  class Rocket extends PIXI.Container {
    constructor(x, y) {
        super()
        this.position.set(x, y);
        
        this._framesArr = [];
        for (let i = 1; i <= 4; i++) {
            this._texture = PIXI.Texture.from(`rocket${i}.png`);
            this._framesArr.push(this._texture);
        };

        this._rocket = new PIXI.AnimatedSprite(this._framesArr);

        this._rocket.angle = 180;
            
        this._rocket.anchor.set(0.5, 0.5);
        this._rocket.loop = true;
        this._rocket.animationSpeed = 0.5;
        this._rocket.scale.set(0.6);
        this._rocket.play();
        this._speed = 5;
        this._isOut = false;

        this.addChild(this._rocket);
      
        PIXI.Ticker.shared.add(this.onTick, this);
    }

    get isOut() {
        return this._isOut;
    }

    show() {
        this.visible = true;
    }

    hide() {
        this.visible = false;
    }

    onTick() {
        this.x -= this._speed / 4; //The rocket slightly falls behind the plane like in the reality
        this.y += this._speed;

        if (this.y > 350) {
            this._speed = 0;
            this._isOut = true;
        }
    }
}
