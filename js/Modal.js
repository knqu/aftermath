export default class Modal extends Phaser.GameObjects.Container {
    constructor(scene, message) {
        super(scene, scene.cameras.main.centerX, scene.cameras.main.centerY);

        const bg = scene.add.rectangle(0, 0, 400, 200, 0x000000, 0.8);
        bg.setStrokeStyle(2, 0xffffff);

        const text = scene.add.text(0, -27.5, message, {
            fontSize: '18px',
            color: '#ffffff',
            wordWrap: { width: 380 },
            align: 'center',
        }).setOrigin(0.5);

        const closeBtn = scene.add.text(0, 52.5, 'OK', {
            fontSize: '18px',
            color: '#000000',
            backgroundColor: '#ffffff',
            padding: { x: 160, y: 5 }
        }).setOrigin(0.5).setInteractive();

        closeBtn.on('pointerdown', () => {
            this.close(scene);
        });

        this.add([bg, text, closeBtn]);
        scene.add.existing(this);
    }

    close(scene) {
        scene.scene.resume('MainScene');
        this.destroy();
    }
}
