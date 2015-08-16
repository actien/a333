// A333.js
// Bullethell

var GAME_WIDTH = 1200;
var GAME_HEIGHT = 600;

var COL_SQUARE_DIM = 30;
var PLAYER_SQUARE_DIM = 50;

var COL_SQUARE_MOVE_SPEED = 4;
var COL_SQUARE_COUNT = 40;

var player;
var score;

Crafty.init(GAME_WIDTH,GAME_HEIGHT, document.getElementById('game'));

// Use Crafty way to generate collision squares
Crafty.c("CollisionSquare", {
    init: function() {
        this.addComponent('2D, Canvas, Color, Solid');
        this.w = COL_SQUARE_DIM;
        this.h = COL_SQUARE_DIM;
        this.x = Math.floor(Math.random() * (GAME_WIDTH));
        this.y = Math.floor(Math.random() * (GAME_HEIGHT));
        this.color('red');
    },

    // UP, DOWN, LEFT, RIGHT == 0, 1, 2, 3
    randomizeMovement: function(direction) {
        this.direction = direction;
        switch (direction) {
            case 0: // UP
                this.bind('EnterFrame', function(){
                    this.rotation = this.rotation + 1;
                    if (this.y < 0 - COL_SQUARE_DIM) {
                        this.y = GAME_HEIGHT + COL_SQUARE_DIM;
                    } else {
                        this.y = this.y - COL_SQUARE_MOVE_SPEED;
                    }
                });
                break;
            case 1: //DOWN
                this.bind('EnterFrame', function(){
                    this.rotation = this.rotation + 1;
                    if (this.y > GAME_HEIGHT) {
                        this.y = 0 - COL_SQUARE_DIM;
                    } else {
                        this.y = this.y + COL_SQUARE_MOVE_SPEED;
                    }
                });
                break;
            case 2:
                this.bind('EnterFrame', function(){
                    this.rotation = this.rotation + 1;
                    if (this.x < 0 - COL_SQUARE_DIM) {
                        this.x = GAME_WIDTH - COL_SQUARE_DIM;
                    } else {
                        this.x = this.x - COL_SQUARE_MOVE_SPEED;
                    }
                });
                break;
            case 3:
                this.bind('EnterFrame', function(){
                    this.rotation = this.rotation + 1;
                    if (this.x > GAME_WIDTH) {
                        this.x = 0 - COL_SQUARE_DIM;
                    } else {
                        this.x = this.x + COL_SQUARE_MOVE_SPEED;
                    }
                });
                break;
            default:
                // Don't move.
                break;
        }
        
        // Allow chaining
        return this;
    },

    resetPosition: function() {

    }
});




// Reset the game state
function resetState() {
    player.attr({
        x: GAME_WIDTH / 2 - (PLAYER_SQUARE_DIM/2), 
        y: GAME_HEIGHT / 2 - (PLAYER_SQUARE_DIM/2), 
        w: PLAYER_SQUARE_DIM, 
        h: PLAYER_SQUARE_DIM});
}

function spawnBullets() {
    // Generate 20 collisionsquares
    for (i = 0; i < COL_SQUARE_COUNT; i++) {
        Crafty.e("CollisionSquare").randomizeMovement(Math.floor(Math.random()*4));
    }
}

function spawnPlayer() {
    player = Crafty.e('2D, Canvas, Color, Fourway, Collision')
    .attr({
        x: GAME_WIDTH / 2 - (PLAYER_SQUARE_DIM/2), 
        y: GAME_HEIGHT / 2 - (PLAYER_SQUARE_DIM/2), 
        w: PLAYER_SQUARE_DIM, 
        h: PLAYER_SQUARE_DIM})
    .color('#F00')
    .fourway(4)
    .checkHits('Solid')
    .bind('HitOn', function(hitData) {
        Crafty.enterScene('mainMenu', score);
    });
}

function spawnScore() {
    var startTime = new Date().getTime() / 1000;
    var scoreText = Crafty.e('2D, DOM, Text')
        .attr({
            x: 10,
            y: 10
        })
        .textFont({
            size: '20px',
            weight: 'bold'
        })
        .bind('EnterFrame', function(){
            score = Math.floor((new Date().getTime() / 1000) - startTime);
            this.text(score);
        });
}

Crafty.defineScene('mainMenu', function(highScore){
    var menuText = Crafty.e('2D, DOM, Text, Keyboard')
        .attr({
            x: GAME_WIDTH / 4,
            y: GAME_HEIGHT / 2,
            w: GAME_WIDTH / 2
        })
        .text('A333 Press enter to start.')
        .textFont({
            size: '40px',
            weight: 'bold'
        })
        .bind('KeyDown', function(e){
            if (e.key == Crafty.keys.ENTER){
                Crafty.enterScene('mainGame');
            }
        });
    if (highScore >= 0) {
        menuText.text('Your score: ' + highScore + '. Play again?');
    }
});

Crafty.defineScene('mainGame', function(){
    spawnPlayer();
    spawnBullets();
    spawnScore();
});

Crafty.enterScene('mainMenu');



