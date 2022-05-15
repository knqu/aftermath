export default class Player extends Phaser.Physics.Matter.Sprite {
    constructor(data) {
        let { scene, x, y } = data;
        super(scene.matter.world, x, y);
        this.scene.add.existing(this);

        const { Body, Bodies } = Phaser.Physics.Matter.Matter;
        let playerCollider = Bodies.circle(this.x, this.y, 12, { isSensor: false, label: 'playerCollider' });
        let playerSensor = Bodies.circle(this.x, this.y, 8 * 32, { isSensor: true, label: 'playerSensor' });
        const compoundBody = Body.create({
            parts: [playerCollider, playerSensor],
            frictionAir: 0.3
        });

        this.setScale(1.25);
        this.setExistingBody(compoundBody);
        this.setFixedRotation();
    }

    static preload(scene) {
        // https://superdark.itch.io/16x16-free-npc-pack
        scene.load.atlas('archer', 'assets/images/archer.png', 'assets/images/archer_atlas.json');
        scene.load.animation('archer_anim', 'assets/images/archer_anim.json');
    }

    update() {
        const speed = 4;
        let playerVelocity = new Phaser.Math.Vector2();

        if (this.inputKeys.keyA.isDown || this.inputKeys.keyLEFT.isDown) {
            playerVelocity.x = -1;
        } else if (this.inputKeys.keyD.isDown || this.inputKeys.keyRIGHT.isDown) {
            playerVelocity.x = 1;
        }

        if (this.inputKeys.keyW.isDown || this.inputKeys.keyUP.isDown) {
            playerVelocity.y = -1;
        } else if (this.inputKeys.keyS.isDown || this.inputKeys.keyDOWN.isDown) {
            playerVelocity.y = 1;
        }

        playerVelocity.normalize().scale(speed);
        this.setVelocity(playerVelocity.x, playerVelocity.y);

        if (this.velocity.x < 0) {
            this.anims.play('archer_walk', true);
            this.flipX = true;
        } else if (this.velocity.x > 0) {
            this.anims.play('archer_walk', true);
            this.flipX = false;
        } else if (Math.abs(this.velocity.y) > 0) {
            this.anims.play('archer_walk', true);
        } else {
            this.anims.play('archer_idle', true);
        }
    }

    get velocity() {
        return this.body.velocity;
    }
}
