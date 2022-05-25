export default class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UIScene' });
        Phaser.Scene.call(this, { key: 'UIScene', active: true });
    }

    create() {
        this.arBar = this.add.text(286, 250, '', { fontFamily: 'Courier', fontSize: '10px' });
        this.hpBar = this.add.text(286, 260, '', { fontFamily: 'Courier', fontSize: '10px' });
    }

    update() {
        const mainScene = this.scene.get('MainScene');

        if (!mainScene.player) {
            return;
        }

        if (mainScene.player) {
            this.arBar.setText(`AR:${mainScene.player.armor}`);
            this.hpBar.setText(`HP:${mainScene.player.health}`);
        }
    }
}
