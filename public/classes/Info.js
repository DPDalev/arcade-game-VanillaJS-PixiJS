export default class Info extends PIXI.Container {
    constructor() {
        super()
        
        this._points = this.initPoints();
        this._fuel = this.initFuel();
        this._rockets = this.initRockets();

        const style1 = new PIXI.TextStyle({
                fontFamily: "Arial",
                fontSize: 25,
                fill: 0x000000,
                align: "left",
        });

        const style2 = new PIXI.TextStyle({
                fontFamily: "Arial",
                fontSize: 28,
                fill: 0x000000,
                align: "left",
        });

        //Generate all texts in the info header 
        this._scoreTitleText = new PIXI.Text("SCORE: ", style1);
        this._fuelTitleText = new PIXI.Text("FUEL: ", style1);
        this._rocketsTitleText = new PIXI.Text("ROCKETS: ", style1);

        this._scoreValue = String(this._points).padStart(5, "0");
        this._scoreValueText = new PIXI.Text(this._scoreValue, style2);

        this._fuelValue = String(this._fuel).padStart(5, "0");
        this._fuelValueText = new PIXI.Text(this._fuelValue, style2);

        this._rocketsValue = String(this._rockets);
        this._rocketsValueText = new PIXI.Text(this._rocketsValue, style2);
        
        //Position the texts
        this._scoreTitleText.position.set(20, 8);
        this._scoreValueText.position.set(120, 6);
        this._fuelTitleText.position.set(620, 8);
        this._fuelValueText.position.set(700, 6);
        this._rocketsTitleText.position.set(335, 8);
        this._rocketsValueText.position.set(470, 6);

        this.addChild(
            this._scoreTitleText,
            this._fuelTitleText,
            this._rocketsTitleText,
            this._scoreValueText,
            this._fuelValueText,
            this._rocketsValueText,
        )
    }

    get fuel() {
        return this._fuel;
    }

    get rockets() {
        return this._rockets;
    }

    initPoints() {
        this._points = 0;
        return this._points;
    }

    initFuel() {
        this._fuel = 1000;
        return this._fuel;
    }

    initRockets() {
        this._rockets = 9;
        return this._rockets;
    }

    updatePoints() {
        this._points++;
        this.showPoints(this._points);
    }

    updateFuel() {
        this._fuel--;
        this.showFuel(this._fuel);
    }

    updateRockets() {
        this._rockets--;
        this.showRockets(this._rockets);
    }

    addPoints(value) {
        this._points += value;
        this.showPoints(this._points);
    }
    
    fuelPlayer() {
        this._fuel += 100;
        this.showFuel(this._fuel);
    }

    showPoints(value) {
        this._scoreValue = String(value).padStart(5, "0");
        this._scoreValueText.text = this._scoreValue;
    }

    showFuel(value) {
        this._fuelValue = String(this._fuel).padStart(5, "0");
        this._fuelValueText.text = this._fuelValue;
    }

    showRockets(value) {
        this._rocketsValue = String(this._rockets);
        this._rocketsValueText.text = this._rocketsValue;
    }
}