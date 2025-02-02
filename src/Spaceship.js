class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame)
        scene.add.existing(this)
        this.scale = 3
        this.height *= 3
        this.width *= 3
        this.points = pointValue
        this.moveSpeed = game.settings.spaceshipSpeed
    }

    update() {
        this.x -= this.moveSpeed
        if(this.x <= 0 - this.width)
            this.x = game.config.width
    }

    reset() {
        this.x = config.width
    }
}