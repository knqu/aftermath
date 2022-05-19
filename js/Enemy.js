export default class Enemy extends Phaser.Physics.Matter.Sprite {
    constructor(data) {
        let { scene, x, y, type } = data;
        super(scene.matter.world, x, y, type);
        this.scene.add.existing(this);
        this.enemyType = type;

        if (this.enemyType === 'standard') {
            this.sword = new Phaser.GameObjects.Sprite(this.scene, 0, 0, 'swords', 0);
        } else if (this.enemyType === 'heavy') {
            this.sword = new Phaser.GameObjects.Sprite(this.scene, 0, 0, 'swords', 4);
            this.sword.setScale(1.2);
        } else if (this.enemyType === 'elite') {
            this.sword = new Phaser.GameObjects.Sprite(this.scene, 0, 0, 'swords', 1);
        } else if (this.enemyType === 'captain') {
            this.sword = new Phaser.GameObjects.Sprite(this.scene, 0, 0, 'swords', 17);
            this.sword.setScale(1.6);
        }
        this.sword.setOrigin(0.25, 0.75);
        this.scene.add.existing(this.sword);

        if (this.enemyType === 'standard') {
            this.damage = 2;
            this.health = 6;
            this.armor = 4;
            this.speed = 3.25;
            this.viewRange = 5;
            this.radius = 12;
        } else if (this.enemyType === 'heavy') {
            this.damage = 3;
            this.health = 8;
            this.armor = 10;
            this.speed = 2.75;
            this.viewRange = 5;
            this.radius = 14;
        } else if (this.enemyType === 'elite') {
            this.damage = 3;
            this.health = 10;
            this.armor = 6;
            this.speed = 3.75;
            this.viewRange = 6;
            this.radius = 12;
        } else if (this.enemyType === 'captain') {
            this.damage = 5;
            this.health = 16;
            this.armor = 20;
            this.speed = 3.5;
            this.viewRange = 7;
            this.radius = 18;
        }

        const { Body, Bodies } = Phaser.Physics.Matter.Matter;
        let enemyCollider = Bodies.circle(this.x, this.y, this.radius, { isSensor: false, label: 'enemyCollider' });
        let enemySensor = Bodies.circle(this.x, this.y, this.viewRange * 32, { isSensor: true, label: 'enemySensor' });
        const compoundBody = Body.create({
            parts: [enemyCollider, enemySensor],
            frictionAir: 0.3
        });

        if (this.enemyType === 'standard' || this.enemyType === 'elite') {
            this.setScale(1.25);
        } else if (this.enemyType === 'heavy') {
            this.setScale(1.5);
        }

        this.setScale(1.25);
        this.setExistingBody(compoundBody);
        this.setFixedRotation();
    }

    static preload(scene) {
        // https://superdark.itch.io/16x16-free-npc-pack
        scene.load.atlas('knight', 'assets/sprites/knight.png', 'assets/sprites/knight_atlas.json');
        scene.load.animation('knight_anim', 'assets/sprites/knight_anim.json');
        scene.load.atlas('heavyknight', 'assets/sprites/heavyknight.png', 'assets/sprites/heavyknight_atlas.json');
        scene.load.animation('heavyknight_anim', 'assets/sprites/heavyknight_anim.json');
        scene.load.atlas('eliteknight', 'assets/sprites/eliteknight.png', 'assets/sprites/eliteknight_atlas.json');
        scene.load.animation('eliteknight_anim', 'assets/sprites/eliteknight_anim.json');
        scene.load.atlas('captain', 'assets/sprites/captain.png', 'assets/sprites/captain_atlas.json');
        scene.load.animation('captain_anim', 'assets/sprites/captain_anim.json');
        // https://disven.itch.io/pixel-swords-assets-16x16
        scene.load.spritesheet('swords', 'assets/sprites/swords.png', { frameWidth: 16, frameHeight: 16 });
    }

    get velocity() {
        return this.body.velocity;
    }

    update(delta) {
        if (!this.active || !this.scene.player.active) {
            return;
        }

        if (this.enemyType === 'standard') {
            this.idleAnim = 'knight_idle';
            this.walkAnim = 'knight_walk';
        } else if (this.enemyType === 'heavy') {
            this.idleAnim = 'heavyknight_idle';
            this.walkAnim = 'heavyknight_walk';
        } else if (this.enemyType === 'elite') {
            this.idleAnim = 'eliteknight_idle';
            this.walkAnim = 'eliteknight_walk';
        } else if (this.enemyType === 'captain') {
            this.idleAnim = 'captain_idle';
            this.walkAnim = 'captain_walk';
        }

        let enemyVelocity = new Phaser.Math.Vector2();

        if (Phaser.Math.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y) < (this.viewRange * 32) && this.scene.player.visible) {
            enemyVelocity.x = this.scene.player.x - this.x;
            enemyVelocity.y = this.scene.player.y - this.y;

            if (Phaser.Math.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y) < 32) {
                this.attack(delta);
            }
        }

        enemyVelocity.normalize().scale(this.speed);
        this.setVelocity(enemyVelocity.x, enemyVelocity.y);

        if (this.velocity.x < 0) {
            this.anims.play(this.walkAnim, true);
            this.flipX = true;
        } else if (this.velocity.x > 0) {
            this.anims.play(this.walkAnim, true);
            this.flipX = false;
        } else if (Math.abs(this.velocity.y) > 0) {
            this.anims.play(this.idleAnim, true);
        } else {
            this.anims.play(this.idleAnim, true);
        }

        this.sword.setPosition(this.x, this.y);
        this.rotateSword(delta);
    }

    rotateSword(delta) {
        let player = this.scene.player;
        if (Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y) < 32) {
            this.swordRotation += delta * 0.4;
        } else {
            this.swordRotation = 0;
        }

        if (this.swordRotation > 100) {
            this.attack(player);
            this.swordRotation = 0;
        }

        if (this.flipX) {
            this.sword.setAngle(-this.swordRotation - 90);
        } else {
            this.sword.setAngle(this.swordRotation);
        }
    }

    attack(player) {
        if (player.armor > 0) {
            player.armor -= this.damage;
        } else if (player.health > 0) {
            player.health -= this.damage;
        }
        if (player.health <= 0) {
            player.destroy();
            alert('You died! Reload to start a new game.');
        }
    }

    getRandomIntger(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
}
