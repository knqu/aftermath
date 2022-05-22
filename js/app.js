import MainScene from './MainScene.js';
import UIScene from './UIScene.js';

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
            debug: false
        }
    },
    scene: [MainScene, UIScene],
    plugins: {
        scene: [
            {
                plugin: PhaserMatterCollisionPlugin.default,
                key: "matterCollision",
                mapping: "matterCollision"
            }
        ]
    }

};

const game = new Phaser.Game(config);
