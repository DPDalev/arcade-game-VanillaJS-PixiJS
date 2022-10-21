export default class Projectile extends PIXI.Container {
    constructor(x) {
        super()
        this._speed = 5;
        this.position.set(x, 310)

        this._texture = PIXI.Texture.from(`projectile.png`);
        this._projectile = new PIXI.Sprite(this._texture);
        this._projectile.scale.x = 1.5;
        this._projectile.scale.y = 2;

        this.addChild(this._projectile);

        PIXI.Ticker.shared.add(this.onTick, this);
    }

    onTick() {
        this.y -= this._speed
    }
}