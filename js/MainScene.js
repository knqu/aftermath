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
                this.spawnEnemies('standard', 4);
            } else if (this.wave === 2) {
                this.spawnEnemies('standard', 4);
                this.spawnEnemies('heavy', 2);
            } else if (this.wave === 3) {
                this.spawnEnemies('standard', 4);
                this.spawnEnemies('heavy', 4);
            } else if (this.wave === 4) {
                this.spawnEnemies('elite', 6);
            } else if (this.wave === 5) {
                this.spawnEnemies('captain', 1);
            }
            this.wave += 1;
        }

        if (this.player.inputKeys.keyTAB.isDown) {
            let command = prompt('[DEBUG CONSOLE] Enter a command:');
            if (!command) {
                return;
            }
            command = command.split(' ');

            if (command[0] === 'spawnEnemies') {
                this.spawnEnemies(command[1], command[2]);
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

    generateCoordinates() {
        let coords = [];
        for (let i = 0; i < 2; i++) {
            let n = Phaser.Math.Between(4 * 32, 28 * 32);
            while (n >= this.player.x - 8 * 32 && n <= this.player.x + 8 * 32) {
                n = Phaser.Math.Between(4 * 32, 28 * 32);
            }
            coords.push(n);
        }
        return coords;
    }

    spawnEnemies(type, amount) {
        for (let i = 0; i < amount; i++) {
            let coords = this.generateCoordinates();
            this.enemies.push(new Enemy({ scene: this, x: coords[0], y: coords[1], type: type }));
        }
    }
}
