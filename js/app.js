import MainScene from './MainScene.js';

const config = {
    type: Phaser.AUTO,
    width: 600,
    height: 600,
    parent: 'game',
    backgroundColor: '#639bff',
    scale: {
        zoom: 1.25
    },
    physics: {
        default: 'matter',
        matter: {
            gravity: { y: 0 },
            debug: true
        }
    },
    scene: [MainScene],
    plugins: {
        scene: [{
            plugin: PhaserMatterCollisionPlugin,
            key: "matterCollision",
            mapping: "matterCollision"
        }]
    }

};

const game = new Phaser.Game(config);
