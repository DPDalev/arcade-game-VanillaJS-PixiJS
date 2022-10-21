export default class Obstacle extends PIXI.Container {
    constructor() {
        super()

        this._randomYPosition = Math.round(Math.random() * 250 + 70); // 40-320
        this.position.set(800, this._randomYPosition);
        
        //Sets 3 random types of obstacles
        this._obstacleType = Math.round(Math.random() * 2) + 1;

        this._texture = null;

        if (this._obstacleType != 3) {
            this._speed = (this._obstacleType === 1) ? 1 : 2;
            this._points = (this._obstacleType === 1) ? 20 : 50;
            this._texture = PIXI.Texture.from(`obstacle${this._speed}.png`);
        } else {
            this._speed = 1.5;
            this._points = 100;
            this._texture = PIXI.Texture.from(`fuel.png`);
        }
        this._obstacle = new PIXI.Sprite(this._texture);
        this._obstacle.anchor.set(0.5);
        
        this.addChild(this._obstacle);

        PIXI.Ticker.shared.add(this.onTick, this);
    }

    get points() {
        return this._points;
    }

    get type() {
        return this._obstacleType;
    }

    get isOut() {
        if (this.x < 10) {
            return true;
        } else {
            return false;
        }
    }

    onTick() {
        this.x -= this._speed;
    }   
}