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
            up: Phaser.Input.Keyboard.KeyCodes.W,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        this.camera = this.cameras.main;
        this.camera.zoom = 1.5;
        this.camera.startFollow(this.player);

        this.createEnemy('standard', 4);
    }

    update() {
        this.player.update();
        this.enemies.forEach(function (enemy) { enemy.update(); });

        if (this.enemies.length === 0) {
            if (this.wave === 1) {
                this.createEnemy('standard', 4);
                this.createEnemy('heavy', 2);
            } else if (this.wave === 2) {
                this.createEnemy('standard', 4);
                this.createEnemy('heavy', 4);
            } else if (this.wave === 3) {
                this.createEnemy('elite', 6);
            } else if (this.wave === 4) {
                this.createEnemy('captain', 1);
            }
            this.wave += 1;
        }
    }

    generateCoordinate() {
        let n = Phaser.Math.Between(32, 992);
        while (n >= this.player.x - 320 && n <= this.player.x + 320) { // 8 tiles
            n = Phaser.Math.Between(32, 992);
        }
        return n;
    }

    createEnemy(type, amount) {
        if (type === 'standard') {
            for (let i = 0; i < amount; i++) {
                this.enemies.push(new Enemy({ type: 'standard', scene: this, x: this.generateCoordinate(), y: this.generateCoordinate() }));
            }
        } else if (type === 'heavy') {
            for (let i = 0; i < amount; i++) {
                this.enemies.push(new Enemy({ type: 'heavy', scene: this, x: this.generateCoordinate(), y: this.generateCoordinate() }));
            }
        } else if (type === 'elite') {
            for (let i = 0; i < amount; i++) {
                this.enemies.push(new Enemy({ type: 'elite', scene: this, x: this.generateCoordinate(), y: this.generateCoordinate() }));
            }
        } else if (type === 'captain') {
            for (let i = 0; i < amount; i++) {
                this.enemies.push(new Enemy({ type: 'captain', scene: this, x: this.generateCoordinate(), y: this.generateCoordinate() }));
            }
        }
    }
}
