/**
 * Hungry Hungry Frogs
 * John Compuesto
 * 
 * A 4 mini arcade frog games series
 * 
 * Instructions:
 * - Move the frog with your mouse
 * - Click to launch the tongue
 * - Catch flies
 * 
 * Credits:
 * Made with p5
 * https://p5js.org/
 */

"use strict";

// Global game state * Includes the Menu and Game 1: Frog Feast
let exitButton;
let gameState = "menu"; // Current game state: menu or playing
let frogImage; // Variable to store the frog image
let fallingFrogs = []; // Array to store falling frog objects
const NUM_FROGS = 30; // Number of frogs to display

//Game 2:Pong game
let leftPaddle, rightPaddle, ball;
let leftScore = 0, rightScore = 0;
let paddleSpeed = 5;
let ballSpeedX = 3, ballSpeedY = 3;
let winningScore = 5; // The score required to win the game
let aiMissChance = 0.3; // AI paddle "miss" chance (percentage, e.g., 0.1 means 10% chance of missing)
let aiSpeed = 6; // Control AI speed, lower values can help smooth the movement

//Game 3: Frog Shooter
let fallingFroggies = []; // Array to store falling frog objects for Game 3
let fliesgame3 = []; // Array for flies shot by the player in Game 3
let froggame3 = { x: 320, y: 520, size: 100, speed: 5 }; // Player frog in Game 3
let froggieHitCount = 0; // To keep track of how many froggies have been hit
let gameLost = false; // Flag to indicate if the player has lost
let isFlickering = false; // Flag to control flicker effect
let flickerTimer = 0; // Timer for flicker duration
let maxFroggies = 10; // Max number of froggies that can hit the bottom before losing

//Game 4: Frog Leap
let frogGame4 = { x: 100, y: 300, velocityY: 0, onPad: false }; // Frog properties
let padsGame4 = [];
let gravity = 0.5; // Gravity pulling the frog down
let gameStarted = false; // Game starts only after spacebar is pressed
let frogMenuScreen; // Declare a variable to store the menu screen image



const NUM_FROGGIES = 10; // Number of froggies to fall
const NUM_FLIES = 5; // Number of flies the player can shoot

function preload() {
    frogImage = loadImage("assets/images/frog-menu-screen.png"); // Load the frog image
}

const frog = {
    body: { x: 320, y: 520, size: 150 },
    tongue: { x: undefined, y: 480, size: 20, speed: 20, state: "idle" },
    direction: "up" // Default direction for user-controlled frog
};
const aiFrogs = [];
const flies = [];
const numFlies = 5;
let userScore = 0;
const aiScores = [0, 0, 0];
let gameWon = false;


/**
 * Creates the canvas and initializes the flies and AI frogs
 */
function setup() {
    createCanvas(640, 480);
    resetGame(); // Initialize the game

    // Create the exit button and position it at the bottom right corner of the canvas
    exitButton = createButton('Exit');
    exitButton.position(1000, 600);
    exitButton.mousePressed(goToMenu);
    exitButton.hide();  // Hide the button initially

    // Initialize the falling frogs
    for (let i = 0; i < NUM_FROGS; i++) {
        fallingFrogs.push({
            x: random(width), // Random horizontal position
            y: random(-height, 0), // Start above the canvas
            speed: random(0.5, 0.5), // Random fall speed
            size: random(20, 40) // Random size
        });
    }

    // Initialize paddles and ball
    leftPaddle = createVector(50, height / 2 - 50); // Left paddle position
    rightPaddle = createVector(width - 50, height / 2 - 50); // Right paddle position
    ball = createVector(width / 2, height / 2); // Ball position

    // Initialize the falling froggies array
    for (let i = 0; i < NUM_FROGGIES; i++) {
        fallingFroggies.push({
            x: random(width), // Random horizontal position
            y: random(-height, 0), // Start above the canvas
            speed: random(0.5, 0.5), // Random fall speed
            size: random(30, 50), // Random size
            hp: 5 // Initial hit points
        });
    }

    frogGame4 = { x: 100, y: 300, velocityY: 0, onPad: false }; // Initialize frog
    setupPadsGame4(); // Create the pads

}

/**
 * Resets the game variables
 */
function resetGame() {
    userScore = 0;
    aiScores.fill(0);
    flies.length = 0;

    // Initialize multiple flies
    for (let i = 0; i < numFlies; i++) {
        flies.push(createFly());
    }

    // Create AI frogs with directions
    aiFrogs.length = 0;
    aiFrogs.push(createAIFrog(0, height / 2, "right"));   // Left side frog
    aiFrogs.push(createAIFrog(width, height / 2, "left")); // Right side frog
    aiFrogs.push(createAIFrog(width / 2, 0, "down"));      // Top side frog
    gameWon = false;
}


function resetGame3() {
    // Reset game state variables
    gameLost = false;  // Reset gameLost flag
    gameWon = false;   // Reset gameWon flag

    // Reset game variables
    froggieHitCount = 0; // Reset the count of froggies hit
    gameLost = false;    // Reset the game over flag
    isFlickering = false; // Reset flicker effect flag
    flickerTimer = 0;    // Reset flicker timer
    maxFroggies = 10;    // Set max froggies to default value

    // Reset player frog position
    froggame3 = { x: 320, y: 520, size: 100, speed: 5 };

    // Clear the flies array
    fliesgame3 = [];

    // Clear the falling froggies array and recreate them
    fallingFroggies = [];
    for (let i = 0; i < NUM_FROGGIES; i++) {
        fallingFroggies.push({
            x: random(width),
            y: random(-height, 0),
            speed: random(0.5, 0.5),
            size: random(30, 50),
            hp: 5 // Set initial HP
        });
    }

    gameState = "game3"; // Set the game state to 'game3'
    loop(); // Start the game loop
    
}

/**
 * Go back to the menu screen when the exit button is pressed
 */
function goToMenu() {
    gameState = "menu";  // Transition to the menu screen
    resetGameState();    // Reset the game state
    exitButton.hide();   // Hide the exit button when returning to the menu
}

/**
 * Main draw function that handles the menu screen or game screen
 */
function draw() {
    background("#87ceeb");

    if (gameState === "menu") {
        showMenu();
        exitButton.hide(); // Hide the exit button on the menu screen
        updateAndDrawFrogs(); // Add the falling frog effect

        //Game 2: Frog Pong
    } else if (gameState === "game2") {
        // Check for winning conditions
        if (leftScore >= winningScore) {
            displayWinningScreenGame2("Left Player Wins!"); // Show the winning screen for the left player
            noLoop(); // Stop the game loop after displaying the winning screen
        } else if (rightScore >= winningScore) {
            displayWinningScreenGame2("Right Player Wins!"); // Show the winning screen for the right player
            noLoop(); // Stop the game loop
        } else {
            drawAnimatedBackground();      // Background animation effect (moving gradient)
            // Pong game logic
            moveBall(); // Update ball position
            movePaddles(); // Update paddle positions based on player input
            checkCollisions(); // Check for ball collisions with paddles and walls
            drawPaddles(); // Render the paddles
            drawBall(); // Render the ball
            displayScoresgame2(); // Display the scores for the current game
        }

        //Game 3: Frog Shooter
    } else if (gameState === "game3") {
        if (gameWon) {
            displayWinningScreenGame3(); // Show the winning screen when the game is won
        } else { 
            // Game logic for Frog Shooter
            moveFroggame3(); // Move the player's frog

            // Draw the player frog
            fill(0, 255, 0); // Green color for the frog
            ellipse(froggame3.x, froggame3.y, froggame3.size);

            // If the game is lost, show the game over screen
            if (gameLost) {
                showGameOver();
                return;
            }

            // If the screen is flickering, display the red flicker
            if (isFlickering) {
                background(255, 0, 0); // Red screen
                flickerTimer++;
                if (flickerTimer > 10) { // Flicker duration (adjust to your preference)
                    isFlickering = false;
                    flickerTimer = 0;
                }
            }

            // Game logic continues here (froggies falling, etc.)
            updateFroggies();
        

        // Draw the flies
        for (let i = 0; i < fliesgame3.length; i++) {
            fill(255, 0, 0); // Red color for the flies
            ellipse(fliesgame3[i].x, fliesgame3[i].y, fliesgame3[i].size);
        }

            moveFallingFroggies(); // Move falling froggies
            handleFlies();
            checkForCollisions(); // Check if flies hit froggies

            displayScoresGame3(); // Display the score
        }

        exitButton.show(); // Show the exit button during the game
    
        //Game 4: Frog Leap
    } else if (gameState === "game4") {

        image(frogImage, 0, 0, width, height); // Ensure 'frogImage' matches the variable from preload()

        if (!gameStarted) {
            // Display "Press Space to Start" message
            fill(0);
            textSize(32);
            textAlign(CENTER, CENTER);
            text("Press Space to Start", width / 2, height / 2);
        } else {
            if (gameLost) {
                displayGameOverScreen(); // Show game over screen
            } else if (gameWon) {
                displayWinningScreenGame4(); // Show winning screen
            } else {
                background("#87ceeb"); // Sky blue
                displayPadsGame4();
                moveFrogGame4();
                checkCollisionGame4();
                gameLoopGame4();
    
                // Draw frog
                fill(0, 255, 0);
                ellipse(frogGame4.x, frogGame4.y, 30, 30);
            }
        }
    
    

        //Game 1: Frogs Catching Flies
    } else if (gameState === "playing") {
        if (gameWon) {
            displayWinningScreen(); // Show the winning screen when the game is won
        } else {
            // Check for AI victory condition
            for (let score of aiScores) {
                if (score >= 20) {
                    gameState = "gameOver"; // Transition to gameOver state
                }
            }

            // Game loop for frogs and flies
            for (let fly of flies) {
                moveFly(fly); // Move the fly
                drawFly(fly); // Draw the fly
            }

            moveFrog(); // Move the player-controlled frog
            moveTongue(frog); // Move the frog's tongue
            drawFrog(frog); // Render the player-controlled frog

            moveAITongues(); // Move AI-controlled frogs' tongues
            for (let aiFrog of aiFrogs) {
                drawFrog(aiFrog); // Render each AI-controlled frog
                checkTongueFlyOverlap(aiFrog, false); // Check if AI tongues catch flies
            }

            checkTongueFlyOverlap(frog, true); // Check if the player-controlled frog's tongue catches flies

            if (userScore >= 20) {
                gameWon = true; // Mark the game as won when user score reaches 20
            }

            displayScores(); // Display scores on the screen
        }

        exitButt