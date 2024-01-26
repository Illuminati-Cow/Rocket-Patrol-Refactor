/*
    Cole Falxa-Sturken
    Rocket Patrol: Ultimate Anniversary Edition
    Time to complete: 5-6 Hours
    Features:
        New Spaceship:
            Trivial to implement as I had already created a second ship asset
            due to oringally thinking there was a player sprite. Tried to inherit
            from Spaceship but was easier to just copy code and tweak slightly.
        Time Bonus / Penalty for Hits or Misses:
            Took a couple hours to figure out and I had to consult JS documentation
            and ask Chat GPT to explain how JS time worked. Had a lot of syntax issues
            that of course didnt raise errors because they basically dont exist in JS.
            I *really* do not like not strongly typed langauges and that combined with
            JS's classes that add properties so easily it can be done on accident made
            debugging a nightmare since I didn't expect a naming issue to be so sneaky.
            I implemented this using JS's Date and thats pretty much it.
        Mouse Control:
            The hardest part of implementing this was figuring out how to get the mouse
            pointers position. The naming conventions for Phaser are quite odd and I do
            not like how they organize their classes as it feels like I'm always wrong when
            predicting how to access a basic feature. I set the x position of the rocket
            to the x position of the mouse and then clamped the position to the screen
            using a min and max function (since apparently the Math library doesn't have one?)
        Particle Explosions:
            This took the most time by far and was quite confusing. I wish the Phaser docs included
            in-line examples or explained how to create the object similar to Unity or Godot but
            as this is a much smaller project I can't complain too much. I ran into weird issues when
            restarting the game after deleting particle emitters despite using the methods that appeared
            to be correct. Instead I used one particle emitter and then move it around to create
            explosions. I hide the emitter using a Phaser timer callback function that makes
            it invisible and stop emitting. 
*/

let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [Menu, Play],
    pixelArt: true
}

let game = new Phaser.Game(config)

// set UI sizes
let borderUISize = game.config.height / 15
let borderPadding = borderUISize / 3

// define actions
let keyFIRE, keyRESET, keyLEFT, keyRIGHT