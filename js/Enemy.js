export default class Enemy extends Phaser.Physics.Matter.Sprite {
    constructor(data) {
        let { type, scene, x, y } = data;
        super(scene.matter.world, x, y);
        this.scene.add.existing(this);
        this.enemyType = type;

        const { Body, Bodies } = Phaser.Physics.Matter.Matter;
        let enemyCollider = Bodies.circle(this.x, this.y, 12, { isSensor: false, label: 'enemyCollider' });
        let enemySensor = Bodies.circle(this.x, this.y, 24, { isSensor: true, label: 'enemySensor' });
        const compoundBody = Body.create({
            parts: [enemyCollider, enemySensor],
            frictionAir: 0.3
        });

        if (type === 'standard') {
            this.damage = 2;
            this.armor = 1;
            this.speed = 3.25;
            this.viewRange = 6;
        } else if (type === 'heavy') {
            this.damage = 3;
            this.armor = 4;
            this.speed = 2.75;
            this.viewRange = 5;
        } else if (type === 'elite') {
            this.damage = 3;
            this.armor = 2;
            this.speed = 3.75;
            this.viewRange = 6;
        } else if (type === 'captain') {
            this.damage = 5;
            this.armor = 8;
            this.speed = 3.75;
            this.viewRange = 7;
        }

        this.setScale(1.25);
        this.setExistingBody(compoundBody);
        this.setFixedRotation();
    }

    static preload(scene) {
        // https://superdark.itch.io/16x16-free-npc-pack
        scene.load.atlas('knight', 'assets/images/knight.png', 'assets/images/knight_atlas.json');
        scene.load.animation('knight_anim', 'assets/images/knight_anim.json');
    }

    update() {
        let enemyVelocity = new Phaser.Math.Vector2();

        if (Phaser.Math.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y) < (this.viewRange * 32)) {
            enemyVelocity.x = this.scene.player.x - this.x;
            enemyVelocity.y = this.scene.player.y - this.y;
        } else {
            enemyVelocity.x = 0;
            enemyVelocity.y = 0;
        }

        enemyVelocity.normalize().scale(this.speed);
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
