import Player from './Player.js';
import Enemy from './Enemy.js';

export default class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
        this.enemies = [];
        this.wave = 1;
    }

    preload() {
        Player.preload(this);
        Enemy.preload(this);
        this.load.image('tiles', 'assets/map/rpg_nature_tileset.png');
        // https://stealthix.itch.io/rpg-nature-tileset
        this.load.tilemapTiledJSON('map', 'assets/map/map.json'); // 32x32 (32x32 padding)
    }

    create() {
        this.map = this.make.tilemap({ key: 'map' });
        this.tileset = this.map.addTilesetImage('rpg_nature_tileset', 'tiles', 32, 32, 0, 0);

        this.layer1 = this.map.createLayer('Tile Layer 1', this.tileset, 0, 0);
        this.layer1.setCollisionByProperty({ collides: true });
        this.matter.world.convertTilemapLayer(this.layer1);

        this.layer2 = this.map.createLayer('Tile Layer 2', this.tileset, 0, 0);
        this.layer2.setCollisionByProperty({ collides: true });
        this.matter.world.convertTilemapLayer(this.layer2);

        this.player = new Player({ scene: this, x: 514, y: 514 });
        this.player.inputKeys = this.input.keyboard.addKeys({
            keyW: Phaser.Input.Keyboard.KeyCodes.W,
            keyA: Phaser.Input.Keyboard.KeyCodes.A,
            keyS: Phaser.Input.Keyboard.KeyCodes.S,
            keyD: Phaser.Input.Keyboard.KeyCodes.D,
            keyTAB: Phaser.Input.Keyboard.KeyCodes.TAB
        });

        this.camera = this.cameras.main;
        this.camera.zoom = 1.5;
        this.camera.startFollow(this.player);
    }

    update() {
        this.player.update();
        this.enemies.forEach(function (enemy) { enemy.update(); });

        if (this.enemies.length === 0) {
            if (this.wave === 1) {
                this.spawnEnemy('standard', 4);
            } else if (this.wave === 2) {
                this.spawnEnemy('standard', 4);
                this.spawnEnemy('heavy', 2);
            } else if (this.wave === 3) {
                this.spawnEnemy('standard', 4);
                this.spawnEnemy('heavy', 4);
            } else if (this.wave === 4) {
                this.spawnEnemy('elite', 6);
            } else if (this.wave === 5) {
                this.spawnEnemy('captain', 1);
            }
            this.wave += 1;
        }

        if (this.player.inputKeys.keyTAB.isDown) {
            let command = prompt('Enter a command using the following format: \n[command] [arg1] [arg2]');
            if (!command) {
                return;
            }
            command = command.split(' ');

            if (command[0] === 'spawnEnemies') {
                this.spawnEnemy(command[1], command[2]);
            } else if (command[0] === 'setWave') {
                this.wave = parseInt(command[1]);
                this.enemies.forEach(function (enemy) {
                    enemy.destroy();
                });
                this.enemies = [];
            } else if (command[0] === 'teleport') {
                this.player.x = command[1] * 32;
                this.player.y = command[2] * 32;
            } else if (command[0] === 'locateEnemies') {
                let coords = [];
                this.enemies.forEach(function (enemy) {
                    coords.push(`[${enemy.enemyType}] ${enemy.x / 32}, ${enemy.y / 32}`);
                });
                if (command[1] === 'console') {
                    for (let i = 0; i < coords.length; i++) {
                        console.log(coords[i]);
                    }
                    console.log('');
                } else {
                    alert(coords.join('\n'));
                }
            } else if (command[0] === 'invisible') {
                this.player.visible = false;
            } else if (command[0] === 'visible') {
                this.player.visible = true;
            }
        }
    }

    generateCoordinate() {
        let n = Phaser.Math.Between(32, 992);
        while (n >= this.player.x - 320 && n <= this.player.x + 320) { // 8 tiles
            n = Phaser.Math.Between(32, 992);
        }
        return n;
    }

    spawnEnemy(type, amount) {
        if (type === 'standard') {
            for (let i = 0; i < amount; i++) {
                this.enemies.push(new Enemy({ scene: this, x: this.generateCoordinate(), y: this.generateCoordinate(), type: 'standard' }));
            }
        } else if (type === 'heavy') {
            for (let i = 0; i < amount; i++) {
                this.enemies.push(new Enemy({ scene: this, x: this.generateCoordinate(), y: this.generateCoordinate(), type: 'heavy' }));
            }
        } else if (type === 'elite') {
            for (let i = 0; i < amount; i++) {
                this.enemies.push(new Enemy({ scene: this, x: this.generateCoordinate(), y: this.generateCoordinate(), type: 'elite' }));
            }
        } else if (type === 'captain') {
            for (let i = 0; i < amount; i++) {
                this.enemies.push(new Enemy({ scene: this, x: this.generateCoordinate(), y: this.generateCoordinate(), type: 'captain' }));
            }
        }
    }
}
