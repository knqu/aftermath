export default class Enemy extends Phaser.Physics.Matter.Sprite {
    constructor(data) {
        let { scene, x, y, texture, frame } = data;
        super(scene.matter.world, x, y, texture, frame);
        this.scene.add.existing(this);

        const { Body, Bodies } = Phaser.Physics.Matter.Matter;
        let enemyCollider = Bodies.circle(this.x, this.y, 12, { isSensor: false, label: 'enemyCollider' });
        let enemySensor = Bodies.circle(this.x, this.y, 24, { isSensor: true, label: 'enemySensor' });
        const compoundBody = Body.create({
            parts: [enemyCollider, enemySensor],
            frictionAir: 0.3
        });

        this.setScale(1.25);
        this.setExistingBody(compoundBody);
        this.setFixedRotation();
    }

    static preload(scene) {
        scene.load.atlas('knight', 'assets/images/knight.png', 'assets/images/knight_atlas.json');
        // https://superdark.itch.io/16x16-free-npc-pack
        scene.load.atlas('knight_mirror', 'assets/images/knight_mirror.png', 'assets/images/knight_mirror_atlas.json');
        scene.load.animation('knight_anim', 'assets/images/knight_anim.json');
        scene.load.animation('knight_mirror_anim', 'assets/images/knight_mirror_anim.json');
    }

    update() {
        const speed = 3.25;
        let enemyVelocity = new Phaser.Math.Vector2();

        if (Phaser.Math.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y) < 192) { // 6 tiles
            enemyVelocity.x = this.scene.player.x - this.x;
            enemyVelocity.y = this.scene.player.y - this.y;
        } else {
            enemyVelocity.x = 0;
            enemyVelocity.y = 0;
        }

        enemyVelocity.normalize().scale(speed);
        this.setVelocity(enemyVelocity.x, enemyVelocity.y);

        if (this.velocity.x < 0) {
            this.anims.play('knight_walk', true);
            this.flipX = true;
        } else if (this.velocity.x > 0) {
            this.anims.play('knight_walk', true);
            this.flipX = false;
        } else if (Math.abs(this.velocity.y) > 0) {
            this.anims.play('knight_walk', true);
        } else {
            this.anims.play('knight_idle', true);
        }
    }

    get velocity() {
        return this.body.velocity;
    }

    getRandomIntger(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
}
