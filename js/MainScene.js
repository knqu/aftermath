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
            keyUP: Phaser.Input.Keyboard.KeyCodes.UP,
            keyDOWN: Phaser.Input.Keyboard.KeyCodes.DOWN,
            keyLEFT: Phaser.Input.Keyboard.KeyCodes.LEFT,
            keyRIGHT: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            keyTAB: Phaser.Input.Keyboard.KeyCodes.TAB
        });

        this.camera = this.cameras.main;
        this.camera.zoom = 1.5;
        this.camera.startFollow(this.player);
    }

    update(time, delta) {
        if (!this.player.active) {
            return;
        }

        this.player.update(delta);
        this.enemies.forEach(function (enemy) { enemy.update(delta); });

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
            } else if (command[0] === 'enemies') {
                let txt = [];
                this.enemies.forEach(function (enemy) {
                    txt.push(`${enemy.enemyType}: [HP: ${enemy.health}, AR: ${enemy.armor}] [${Math.round(enemy.x / 32)}, ${Math.round(enemy.y / 32)}]`);
                });
                if (command[1] === 'console') {
                    for (let i = 0; i < txt.length; i++) {
                        console.log(txt[i]);
                    }
                    console.log('');
                } else {
                    alert(txt.join('\n'));
                }
            } else if (command[0] === 'invisible') {
                this.player.visible = false;
            } else if (command[0] === 'visible') {
                this.player.visible = true;
            } else if (command[0] === 'currentWave') {
                alert(`Spawned Wave: ${this.wave - 1}\nWave Variable: ${this.wave}`);
            } else if (command[0] === 'player') {
                let txt = `player: [HP: ${this.player.health}, AR: ${this.player.armor}]`;
                if (command[1] === 'console') {
                    console.log(txt);
                } else {
                    alert(txt);
                }
            }
        }

        if (this.player.x <= 0 || this.player.x >= 32 * 32 || this.player.y <= 0 || this.player.y >= 32 * 32) {
            alert('Uh oh... you noclipped out of reality. Thankfully, the gods have chosen to save you and push you back in time to the start of the previous wave.');
            this.player.x = 16 * 32;
            this.player.y = 16 * 32;
            this.wave -= 1;
            this.enemies.forEach(function (enemy) {
                enemy.destroy();
            });
            this.enemies = [];
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
