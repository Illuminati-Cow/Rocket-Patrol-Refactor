class Play extends Phaser.Scene {
    constructor() {
        super("playScene")
    }

    create() {
        // Create background
        // Credit to http://pixelartmaker.com/art/ece60cc31aeebda
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0)
        this.bgScrollSpeed = config.width / 120
        // add spaceships (x3)
        this.ship01 = new SuperSpaceship(this, game.config.width + borderUISize*6, borderUISize*5, 'superspaceship', 0, 50).setOrigin(0, 0)
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*4 + borderPadding * 6, 'spaceship', 0, 20).setOrigin(0,0)
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*6, 'spaceship', 0, 10).setOrigin(0,0)
        // Player Rocket
        this.p1Rocket = new Rocket(this, game.config.width, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0, 0 )
        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0)
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0)
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0)
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0)
        // Bind keys to actions
        keyFIRE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)
        keyRESET = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
        this.input.on('pointerdown', this.p1Rocket.fire, this.p1Rocket)
        this.p1Score = 0
        this.gameOver = false
        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig)
        // 60-second play clock
        this.date = new Date()
        this.timer = {
            deltaTime: 0,
            lastFrameTime: this.date.getTime(),
            timeLeft: game.settings.gameTimer,
            timeLeftS: game.settings.gameTimer / 1000
        }
        // Added a time left counter so player can see time added and subtracted
        this.timeLeft = this.add.text(game.config.width - borderUISize - borderPadding, borderUISize + borderPadding*2, this.timer.timeLeftS, scoreConfig).setOrigin(1, 0)
        // Create a particle system manager to create explosions   
        this.explosionEmitter = new Phaser.GameObjects.Particles.ParticleEmitter(this, 100, 100, 'debris', {
            speed: 500,
            lifespan: 100,
            scale: {min: 0.3, max:1.25},
            rotation: {
                onUpdate: (particle, key, t, value) => {
                    value += 1
                    return value;
                }
            },
            radial: true,
            
        })
        this.explosionEmitter.emitting = false
        this.explosionEmitter.visible = false
        this.add.existing(this.explosionEmitter)
    }

    update() {
        if (!this.gameOver)
            this.timerUpdate()
        if (this.timer.timeLeft <= 0) {
            this.endGame()
        }
        // check key input for restart or menu
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyRESET)) {
            this.scene.restart()
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene")
          }   
        // Scroll background
        this.starfield.tilePositionX -= this.bgScrollSpeed
        // Update game objects
        if (!this.gameOver) {
            this.p1Rocket.update()
            this.ship01.update()
            this.ship02.update()
            this.ship03.update()
        }
        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset()
            this.shipExplode(this.ship03)
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset()
            this.shipExplode(this.ship02)
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset()
            this.shipExplode(this.ship01)
        }
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height && rocket.height + rocket.y > ship. y) {
            return true
        } 
        else {
            return false
        }
    }

    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0                         
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0)
        boom.anims.play('explode')           // play explode animation
        boom.on('animationcomplete', () => { // callback after ani completes
            ship.reset()                       // reset ship position
            ship.alpha = 1                     // make ship visible again
            boom.destroy()                     // remove explosion sprite
        })
        // score add and text update
        this.p1Score += ship.points
        this.scoreLeft.text = this.p1Score
        this.timer.timeLeft += game.settings.timeBonus
        this.sound.play('sfx-explosion')       
        this.createExplosion(ship.x + ship.width / 2 - 10, ship.y + ship.height/2 - 10)
    }

    endGame() {
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 0
        }
        this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5)
        this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu', scoreConfig).setOrigin(0.5)
        this.gameOver = true
    }

    timerUpdate() {
        this.timer.lastFrameTime = this.date.getTime()
        this.date = new Date()
        this.timer.deltaTime = this.date.getTime() - this.timer.lastFrameTime
        this.timer.timeLeft -= this.timer.deltaTime
        this.timer.timeLeftS =  Math.max((Math.floor(this.timer.timeLeft / 100) / 10), 0)
        this.timeLeft.text = this.timer.timeLeftS
    }

    createExplosion(x, y) {
        // Advice to use one emitter and move it:
        // https://phaser.discourse.group/t/how-to-manage-lots-of-particle-emitter-managers/12654/4
        this.explosionEmitter.setPosition(x, y, 0)
        this.explosionEmitter.emitting = true
        this.explosionEmitter.visible = true
        this.time.delayedCall(250, () => {
            this.explosionEmitter.visible = false;
            this.explosionEmitter.emitting = false;
        }, [], this)
    }
}