class SuperSpaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame)
        scene.add.existing(this)
        this.moveSpeed = game.settings.spaceshipSpeed * 1.5
        this.points = pointValue
        this.scale = 2
        this.height *= 2
        this.width *= 2
        this.rotation = -.5 * Math.PI
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