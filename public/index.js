import Info from './classes/Info.js';
import Player from './classes/Player.js';
import Enemy from './classes/Enemy.js';
import Rocket from './classes/Rocket.js';
import Explosion from './classes/Explosion.js';
import Obstacle from './classes/Obstacle.js';
import Projectile from './classes/Projectile.js';

import constants from './constants.js';

const app = new PIXI.Application({
    width: constants.GAME_WIDTH,
    height: constants.GAME_HEIGHT,
});

document.body.appendChild(app.view);

const loadAssets = () => {
    const loader = PIXI.Loader.shared;
    loader.add("rocketSheet", "../assets/rocket/rocketSheet.json");
    loader.add("explosionSheet", "../assets/explosion/explosionSheet.json");
    loader.add("spriteSheet", "../assets/sprites/spriteSheet.json");

    loader.onComplete.once(() => {
        startGame();
    });
    loader.load();
}

window.onload = () => {
    loadAssets();
}

let player, generateEnemyID;
let enemies = [];
let rockets = [];
let obstacles = [];
let projectiles = [];

const generateEnemy = () => {
    let enemy = new Enemy();
    enemies.push(enemy);        
    app.stage.addChild(enemy);
    return enemy;
}

const generateEnemies = () => {
     //Generate first enemy
     generateEnemy();

     //Generate more enemies after (3, 5) seconds
     let n = Math.round(Math.random() * 3) + 2;
     let i = 0;
     generateEnemyID = setInterval(() => {
         i++;
         if (i === n) {
             n = Math.round(Math.random() * 3) + 2;
                 generateEnemy();
             i = 0;
         };
     }, 1000);
}

const removeElementFromArray = (arr, element) => {
    arr.splice(arr.indexOf(element), 1);
    app.stage.removeChild(element);
} 

const startGame = () => {

    const initGame = () => {
        player.hide();
        info.initPoints();
        info.initFuel();
        info.initRockets();
        info.showRockets();
        setTimeout(() => {
            player.initPosition();
            player.show();
        }, 700);
    }

    //Constantly adds points / measures the distance
    const addPoints = () => {
        info.updatePoints(1);
    }

    //Measures the burned fuel
    const useFuel = () => {
        info.updateFuel();
        if (info.fuel < 1) {
            initGame();
        }
    }

    const explosion = (x, y) => {
        let explosion = new Explosion(x, y);
        app.stage.addChild(explosion);
        setTimeout(() => {
           app.stage.removeChild(explosion);
        }, 700);
    }

    PIXI.Ticker.shared.add(addPoints);
    PIXI.Ticker.shared.add(useFuel)

    //Generate the background
    const texture = PIXI.Texture.from(`background.png`);
    const tileSprite = new PIXI.TilingSprite(
        texture,
        app.screen.width,
        app.screen.height,
    );

    const backgroundMoves = () => {
        tileSprite.tilePosition.x  -= 7;
    }

    PIXI.Ticker.shared.add(backgroundMoves);
    app.stage.addChild(tileSprite);

    //Generate Info header
    const info = new Info();
    app.stage.addChild(info);
    
    //Generate the player
    player = new Player();
    app.stage.addChild(player);
    
    generateEnemies();

    //Generates obstacles and fuel
    setInterval(() => {
        let obstacle = new Obstacle();
        obstacles.push(obstacle);
        app.stage.addChild(obstacle);
    }, 3000);

    //Random enemy shoots
    setInterval(() => {
        if (enemies.length > 0) {
            let randomIndex = Math.floor(Math.random() * enemies.length);
            let randomEnemy = enemies[randomIndex];
            let projectile = new Projectile(randomEnemy.x + randomEnemy.width / 2);
            projectiles.push(projectile);
            app.stage.addChild(projectile);
        }
    }, 2000);

    //Check whether any rocket hits enemy
    const checkRocket = () => {
        rockets.map(rocket => {
            if (rocket.isOut) {
                removeElementFromArray(rockets, rocket);
                enemies.map(enemy => {
                    if (rocket.x > enemy.x && rocket.x < enemy.x + enemy.width) {
                        removeElementFromArray(enemies, enemy);
                        info.addPoints(enemy.points);
                        explosion(enemy.x + enemy.width / 2, enemy.y);
                    }
                });
            };
        });
    }

    //Check whether the player hits obstacle
    const checkObstacle = () => {
        obstacles.map(obstacle => {
            if (obstacle.isOut) {
                removeElementFromArray(obstacles, obstacle);
            } else {
                const leftUpCornerY = obstacle.y < player.y && obstacle.y > player.y - player.height;
                const leftDownCornerY = obstacle.y + obstacle.height < player.y && obstacle.y + obstacle.height > player.y - player.height;
                const rightUpCornerX = obstacle.x < player.x && obstacle.x > player.x - player.width;
                const rightDownCornerX = obstacle.x + obstacle.x + obstacle.width < player.x && obstacle.x + obstacle.x + obstacle.width > player.x - player.width;
            if ((leftUpCornerY || leftDownCornerY) && (rightUpCornerX || rightDownCornerX)) {
                    removeElementFromArray(obstacles, obstacle);
                    if (obstacle.type === 3) {
                        info.fuelPlayer();
                    } else {
                        explosion(player.x - player.width / 2, player.y);
                        initGame();
                    }
                }   
            }
        });
    }

    //Check whether player touches enemy
    const checkEnemy = () => {
        enemies.map(enemy => {
            if (enemy.isOut) {
                removeElementFromArray(enemies, enemy);
            } else {
                if (player.y > 370 &&
                    player.x > enemy.x &&
                    player.x < enemy.x + enemy.width) {
                        removeElementFromArray(enemies, enemy);
                        explosion(player.x - player.width / 2, enemy.y);
                        initGame();
                }
            }
        });
    }

    //Checks whether projectile hits the player
    const checkProjectiles = () => {
        projectiles.map(projectile => {
            if (projectile.y < 50) {
                removeElementFromArray(projectiles, projectile);
            } else {
                if (projectile.x > player.x - player.width &&
                    projectile.x < player.x &&
                    projectile.y > player.y &&
                    projectile.y < player.y + player.height) {
                        removeElementFromArray(projectiles, projectile);
                        explosion(player.x - player.width / 2, player.y);
                        initGame();
                }
            }
        })
    }

    PIXI.Ticker.shared.add(checkRocket);
    PIXI.Ticker.shared.add(checkObstacle);
    PIXI.Ticker.shared.add(checkEnemy);
    PIXI.Ticker.shared.add(checkProjectiles);
    
    document.body.addEventListener("keydown", key => {

        if (key.code === "ArrowUp") {
            player.moveUp();
        }

        if (key.code === "ArrowDown") {
            player.moveDown();
        }
        
        if (key.code === "ArrowLeft") {
            player.moveLeft();
        }

        if (key.code === "ArrowRight") {
            player.moveRight();
        }

        if (key.code === "Space") {
            if (info.rockets > 0) {
                let rocket = new Rocket(player.x - player.width / 2, player.y + player.height);
                rockets.push(rocket);
                app.stage.addChild(rocket);
                info.updateRockets();
            }
        }
    });

    document.body.addEventListener("keyup", key => {
        if (key.code === "ArrowUp" ||
            key.code === "ArrowDown" ||
            key.code === "ArrowLeft" ||
            key.code === "ArrowRight") {
            player.stop();
        }
    })
}
