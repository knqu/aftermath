export default class Player extends Phaser.Physics.Matter.Sprite {
    constructor(data) {
        let { scene, x, y } = data;
        super(scene.matter.world, x, y);
        this.scene.add.existing(this);

        this.damage = 4;
        this.health = 20;
        this.armor = 0;
        this.speed = 4;
        this.viewRange = 8;
        this.radius = 12;

        this.sword = new Phaser.GameObjects.Sprite(this.scene, 0, 0, 'swords', 22);
        this.sword.setScale(1.2);
        this.sword.setOrigin(0.25, 0.75);
        this.scene.add.existing(this.sword);

        const { Body, Bodies } = Phaser.Physics.Matter.Matter;
        let playerCollider = Bodies.circle(this.x, this.y, this.radius, { isSensor: false, label: 'playerCollider' });
        let playerSensor = Bodies.circle(this.x, this.y, this.viewRange * 32, { isSensor: true, label: 'playerSensor' });
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
        scene.load.atlas('archer', 'assets/sprites/archer.png', 'assets/sprites/archer_atlas.json');
        scene.load.animation('archer_anim', 'assets/sprites/archer_anim.json');
        // https://disven.itch.io/pixel-swords-assets-16x16
        scene.load.spritesheet('swords', 'assets/sprites/swords.png', { frameWidth: 16, frameHeight: 16 });
    }

    get velocity() {
        return this.body.velocity;
    }

    update(delta) {
        if (!this.active) {
            return;
        }

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

        playerVelocity.normalize().scale(this.speed);
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

        this.sword.setPosition(this.x, this.y);
        this.rotateSword(delta);
    }

    rotateSword(delta) {
        let pointer = this.scene.input.activePointer;
        if (pointer.isDown) {
            this.swordRotation += delta * 0.4;
        } else {
            this.swordRotation = 0;
        }

        if (this.swordRotation > 100) {
            this.attack();
            this.swordRotation = 0;
        }

        if (this.flipX) {
            this.sword.setAngle(-this.swordRotation - 90);
        } else {
            this.sword.setAngle(this.swordRotation);
        }
    }

    attack() {
        for (let enemy of this.scene.enemies) {
            if ((Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y) < 2 * 32) && ((this.flipX && enemy.x < this.x) || (!this.flipX && enemy.x > this.x))) {
                if (enemy.armor > 0) {
                    enemy.armor -= this.damage;
                } else if (enemy.health > 0) {
                    enemy.health -= this.damage;
                }
                if (enemy.health <= 0) {
                    enemy.destroy();
                    let index = this.scene.enemies.indexOf(enemy);
                    if (index > -1) {
                        this.scene.enemies.splice(index, 1);
                    }
                }
            }
        }
    }
}
