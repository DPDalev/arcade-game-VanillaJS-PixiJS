import constants from "../constants.js";

export default class Player extends PIXI.Container {
    constructor() {
        super()
        this.initPosition();
        
        this._texture = PIXI.Texture.from(`player.png`);
        
        this._player = new PIXI.Sprite(this._texture);
        
        this._player.anchor.set(1);

        // this._player.pivot.x = this.width / 2;
        // this._player.pivot.y = this.height / 2;

        this._speed = constants.PLAYER_SPEED;
        this._verticalDirection = 0;
        this._horizontalDirection = 0;
        
        this.addChild(this._player);

        PIXI.Ticker.shared.add(this.onTick, this);
    }

    moveUp() {
        this._verticalDirection = -1;
    }

    moveDown() {
        this._verticalDirection = 1;
    }

    moveLeft() {
        this._horizontalDirection = -1;
    }

    moveRight() {
        this._horizontalDirection = 1;
    }

    stop() {
        this._verticalDirection = 0;
        this._horizontalDirection = 0;

    }

    initPosition() {
        this.position.set(constants.GAME_WIDTH / 2, constants.GAME_HEIGHT / 2);
    }

    show() {
        this.visible = true;
    }

    hide() {
        this.visible = false;
    }

    onTick() {
        this.y += this._speed * this._verticalDirection;
        this.x += this._speed * this._horizontalDirection;


        if (this.y < 50) this.y = 50;
        if (this.x < 50) this.x = 50;
        if (this.x > 750) this.x = 750;

        if (this.y > 380) {
            this.y = 380;
        }
    }
}