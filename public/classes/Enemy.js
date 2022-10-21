export default class Enemy extends PIXI.Container {
    constructor() {
        super()
        this.position.set(800, 370);
        
        this._enemyType = Math.round(Math.random()) + 1;
        this._speed = (this._enemyType === 1) ? 2 : 4;
        this._points = (this._enemyType === 1) ? 20 : 50;
        
        this._texture = PIXI.Texture.from(`enemy_${this._points}.png`);
        this._enemy = new PIXI.Sprite(this._texture);
        
        this.addChild(this._enemy);

        PIXI.Ticker.shared.add(this.onTick, this);
    }

    get points() {
        return this._points;
    }

    get isOut() {
        if (this.x < -this.width) {
            return true;
        } else {
            return false;
        }
    }

    onTick() {
        this.x -= this._speed;
    }   
}