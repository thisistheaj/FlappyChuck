var score;

var mainState = {
    init: function () {
        this.scale.scaleMode = Phaser.ScaleManager.RESIZE;
    },

    preload: function () {
    },

    create: function () {
        game.stage.backgroundColor = '#71c5cf';

        game.physics.startSystem(Phaser.Physics.ARCADE);

        this.bird = game.add.sprite(50, 245, 'bird');
        this.bird.anchor.setTo(-0.2, 0.5);

        this.pipes = game.add.group();
        this.timer = game.time.events.loop(2000, this.addRowOfPipes, this);
        score = 0;
        this.labelScore = game.add.text(20, 20, "0", {
            font: "30px Arial",
            fill: "#ffffff"
        });

        this.jumpSound = game.add.audio('jump');
        this.thwackSound = game.add.audio('thwack');
        this.splashSound = game.add.audio('splash');

        game.physics.arcade.enable(this.bird);

        this.bird.body.gravity.y = 1000;

        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);
        game.input.onTap.add(this.jump, this);

    },

    update: function () {
        if (this.bird.y < 0 || this.bird.y > game.world.height){
            this.splashSound.play();
            this.restartGame();
        }
        game.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this);
        if (this.bird.angle < 20) {
            this.bird.angle += 1;
        }
    },
    jump: function () {
        if (this.bird.alive == false){
            return;
        }
        this.jumpSound.play();
        this.bird.body.velocity.y = -350;
        game.add.tween(this.bird).to({
            angle: -20
        }, 100).start();
    },

    restartGame: function () {
        game.state.start('end');
    },
    addOnePipe: function (x, y) {
        var pipe = game.add.sprite(x, y, 'pipe');
        this.pipes.add(pipe);
        game.physics.arcade.enable(pipe);
        pipe.body.velocity.x = -200;
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },
    addRowOfPipes: function () {
        var max = Math.ceil(game.world.height / 44);
        var hole = Math.floor(Math.random() * Math.floor(max * 2 / 3)) + Math.floor(max * 1 / 6);
        for (var i = 0; i < max; i++){
            if (i < hole || i > hole + 3){
                this.addOnePipe(game.world.width, i * 44);
            }
        }
        score += 1;
        this.labelScore.text = score;
    },

    hitPipe: function () {
        if (this.bird.alive == false){
            return;
        }
        this.thwackSound.play();
        this.bird.alive = false;

        game.time.events.remove(this.timer);

        this.pipes.forEach(function (p) {
            p.body.velocity.x = 0;
        }, this);
    }
};

var preloader = {
    preload: function () {
        game.load.image('bird', 'assets/chuck.png');
        game.load.image('pipe', 'assets/rsz_pipe.png');
        game.load.audio('jump', 'assets/jump.wav');
        game.load.audio('thwack', 'assets/thwack.wav');
        game.load.audio('splash', 'assets/splash.wav');
    },

    create: function () {
        game.state.start('start');
    }
};

var startScreenState = {
    init: function () {
        this.scale.scaleMode = Phaser.ScaleManager.RESIZE;
    },
    create: function () {
        game.stage.backgroundColor = '#71c5cf';
        this.bird = game.add.sprite(game.world.centerX, game.world.centerY + 120, 'bird');
        this.bird.anchor.setTo(0.5, 0.5);

        this.startext = game.add.text(game.world.centerX, game.world.centerY, "Start", {
            font: "30px Arial",
            fill: "#ffffff"
        });
        this.startext.anchor.x = 0.5;
        this.startext.anchor.y = 0.5;
        this.startext.inputEnabled = true;
        // this.startext.events.onInputDown.add(this.startgame, this);
        game.input.onTap.add(this.startgame, this);
        this.titletext = game.add.text(game.world.centerX, game.world.centerY - 120, "FLAPPY CHUCK", {
            font: "36px Arial",
            fill: "#33bb33"
        });
        this.titletext.anchor.x = 0.5;
        this.titletext.anchor.y = 0.5;
    },
    startgame: function () {
        game.state.start('main');
    },
    resize: function (width, height) {
    }
};

var endScreenState = {
    init: function () {
        this.scale.scaleMode = Phaser.ScaleManager.RESIZE;
    },
    create: function () {
        game.stage.backgroundColor = '#71c5cf';
        this.bird = game.add.sprite(game.world.centerX, game.world.centerY + 120, 'bird');
        this.bird.anchor.setTo(0.5, 0.5);

        this.startext = game.add.text(game.world.centerX, game.world.centerY, "Again?", {
            font: "30px Arial",
            fill: "#33bb33"
        });
        this.startext.anchor.x = 0.5;
        this.startext.anchor.y = 0.5;
        this.startext.inputEnabled = true;
        // this.startext.events.onInputDown.add(this.startgame, this);
        game.input.onTap.add(this.startgame, this);
        this.scoreext = game.add.text(game.world.centerX, game.world.centerY - 60, "Your score: " + score, {
            font: "30px Arial",
            fill: "#ffffff"
        });
        this.scoreext.anchor.x = 0.5;
        this.scoreext.anchor.y = 0.5;
        this.titletext = game.add.text(game.world.centerX, game.world.centerY - 140, "Game Over", {
            font: "36px Arial",
            fill: "#bb3333"
        });
        this.titletext.anchor.x = 0.5;
        this.titletext.anchor.y = 0.5;
    },
    startgame: function () {
        game.state.start('main');
    }
};

var game = new Phaser.Game("100%", "100%");

game.state.add('pre', preloader);
game.state.add('main', mainState);
game.state.add('start',startScreenState);
game.state.add('end',endScreenState);

game.state.start('pre');