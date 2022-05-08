import Player from './Player.js';
import Enemy from './Enemy.js';

export default class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
        this.enemies = [];
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
        const tileset = this.map.addTilesetImage('rpg_nature_tileset', 'tiles', 32, 32, 0, 0);

        const layer1 = this.map.createLayer('Tile Layer 1', tileset, 0, 0);
        layer1.setCollisionByProperty({ collides: true });
        this.matter.world.convertTilemapLayer(layer1);

        this.player = new Player({ scene: this, x: 514, y: 514, texture: 'archer', frame: 'archer_idle_1' });

        const layer2 = this.map.createLayer('Tile Layer 2', tileset, 0, 0);
        layer2.setCollisionByProperty({ collides: true });
        this.matter.world.convertTilemapLayer(layer2);

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
    }

    generateCoordinate() {
        let n = Phaser.Math.Between(32, 992);
        while (n >= this.player.x - 320 && n <= this.player.x + 320) { // 8 tiles
            n = Phaser.Math.Between(32, 992);
        }
        return n;
    }

    createEnemy(type, amount) {
        for (let i = 0; i < amount; i++) {
            this.enemies.push(new Enemy({ scene: this, x: this.generateCoordinate(), y: this.generateCoordinate(), texture: 'knight', frame: 'knight_walk_1' }));
        }
    }
}
