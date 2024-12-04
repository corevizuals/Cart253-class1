/**
 * Hungry Hungry Frogs
 * John Compuesto
 * 
 * A game of 4 frogs competing to catch the most flies
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

// Global game state
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

//Frog Shooter
let fallingFroggies = []; // Array to store falling frog objects for Game 3
let fliesgame3 = []; // Array for flies shot by the player in Game 3
let froggame3 = { x: 320, y: 520, size: 100, speed: 5 }; // Player frog in Game 3
let froggieHitCount = 0; // To keep track of how many froggies have been hit
let gameLost = false; // Flag to indicate if the player has lost
let isFlickering = false; // Flag to control flicker effect
let flickerTimer = 0; // Timer for flicker duration
let maxFroggies = 10; // Max number of froggies that can hit the bottom before losing



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

        exitButton.show(); // Show the exit button during the game

    } else if (gameState === "gameOver") {
        displayGameOverScreen(); // Show the game over screen
        exitButton.show(); // Allow the user to exit the game
    }
}


/**
 * Show the menu screen with options to start the game
 */
function showMenu() {
    background("#87ceeb"); // Clear background

    textSize(32);
    fill(0);
    textAlign(CENTER, CENTER);
    text("Hungry Hungry Frogs", width / 2, height / 4);

    const menuOptions = [
        { label: "Family Feud", y: height / 2 },
        { label: "Frog Pong", y: height / 2 + 40 },
        { label: "Frog Shooter", y: height / 2 + 80 },
        { label: "Frog Leap", y: height / 2 + 120 }
    ];

    textSize(24);
    for (let i = 0; i < menuOptions.length; i++) {
        const option = menuOptions[i];
        const textWidthEstimate = textWidth(option.label);

        if (
            mouseX > width / 2 - textWidthEstimate / 2 &&
            mouseX < width / 2 + textWidthEstimate / 2 &&
            mouseY > option.y - 20 &&
            mouseY < option.y + 20
        ) {
            fill("#ffd700");
        } else {
            fill(0);
        }

        text(option.label, width / 2, option.y);
    }

    textSize(16);
    fill(0);
    text("Click a number to select", width / 2, height - 40);
}

/**
 * 
 * Handles key presses for restarting the game.
 */
function keyPressed() {
    if (gameState === "menu") {
        if (key === '1') {
            gameState = "playing"; // Transition to the game
            resetGame();
        }
        // Implement other options here if necessary
    } else if (gameState === "gameOver") {
        if (key === 'R' || key === 'r') {
            gameState = "playing";
            resetGame();
        }
    }

    if (gameState === "menu") {
        if (key === '2') {
            gameState = "game2"; // Transition to the game
            resetGame();
        }
    }

    if (key === 'r' || key === 'R') {
        if (gameState === "game2" && (leftScore >= winningScore || rightScore >= winningScore)) {
            resetGame2(); // Reset Game 2
            gameState = "game2"; // Set the game state to game 2
        }
    }


    if (gameState === "menu") {
        if (key === '3') {
            gameState = "game3"; // Transition to the game
            resetGame();
        }
    }

    if (gameState === "game4" && keyCode === 32 && frogGame4.onPad) { // Jump only if on pad
        frogGame4.velocityY = -10; // Jump velocity
        frogGame4.onPad = false;
    }

    if (keyCode === 32 && !gameStarted && gameState === "game4") { // 32 is the keyCode for spacebar
        gameStarted = true;
    }


        // If 'r' or 'R' is pressed, reset the appropriate game
    if (key === 'r' || key === 'R') {
        if (gameState === "game3" && (gameLost || gameWon)) {
            resetGame3();
            gameState = "game3"; // Ensure the correct game state is set
        } else if (gameState === "game4" && (gameLost || gameWon)) {
            resetGame4();
            gameState = "game4"; // Ensure the correct game state is set
        }
    }
}

/**
 * Resets the game state after winning or finishing
 */
function resetGameState() {
    gameWon = false;
    userScore = 0;
    aiScores.fill(0);
    flies.length = 0;
    gameState = "menu"; // Go back to the menu after the game ends
}


/**
 * Creates a new fly object with random position and speed
 */
function createFly() {
    const fly = { x: 0, y: 0, size: 10, speedX: 3, speedY: 0 };
    const side = floor(random(4));
    switch (side) {
        case 0: // Left
            fly.x = 0;
            fly.y = random(height);
            fly.speedX = random(1, 3);
            fly.speedY = random(-1, 1);
            break;
        case 1: // Right
            fly.x = width;
            fly.y = random(height);
            fly.speedX = -random(1, 3);
            fly.speedY = random(-1, 1);
            break;
        case 2: // Top
            fly.x = random(width);
            fly.y = 0;
            fly.speedX = random(-1, 1);
            fly.speedY = random(1, 3);
            break;
        case 3: // Bottom
            fly.x = random(width);
            fly.y = height;
            fly.speedX = random(-1, 1);
            fly.speedY = -random(1, 3);
            break;
    }
    return fly;
}


/**
 * Moves a given fly according to its speed
 */
function moveFly(fly) {
    fly.x += fly.speedX;
    fly.y += fly.speedY;
    
    // Reset fly if it goes off-screen
    if (fly.x < 0 || fly.x > width || fly.y < 0 || fly.y > height) {
        Object.assign(fly, createFly()); // Reset the fly with new random values
    }
}

/**
 * Draws a fly as a black circle
 */
function drawFly(fly) {
    push();
    noStroke();
    fill("#000000");
    ellipse(fly.x, fly.y, fly.size);
    pop();
}

/**
 * Moves the user-controlled frog to follow the mouse
 */
function moveFrog() {
    frog.body.x = mouseX;
}

/**
 * Handles moving the tongue based on its state and direction
 */
function moveTongue(frog) {
    if (frog.tongue.state === "idle") {
        frog.tongue.x = frog.body.x;
        frog.tongue.y = frog.body.y;
    }

    if (frog.tongue.state === "outbound") {
        switch (frog.direction) {
            case "up":
                frog.tongue.y -= frog.tongue.speed;
                if (frog.tongue.y <= 0) frog.tongue.state = "inbound";
                break;
            case "down":
                frog.tongue.y += frog.tongue.speed;
                if (frog.tongue.y >= height) frog.tongue.state = "inbound";
                break;
            case "left":
                frog.tongue.x -= frog.tongue.speed;
                if (frog.tongue.x <= 0) frog.tongue.state = "inbound";
                break;
            case "right":
                frog.tongue.x += frog.tongue.speed;
                if (frog.tongue.x >= width) frog.tongue.state = "inbound";
                break;
        }
    } else if (frog.tongue.state === "inbound") {
        switch (frog.direction) {
            case "up":
                frog.tongue.y += frog.tongue.speed;
                if (frog.tongue.y >= frog.body.y) frog.tongue.state = "idle";
                break;
            case "down":
                frog.tongue.y -= frog.tongue.speed;
                if (frog.tongue.y <= frog.body.y) frog.tongue.state = "idle";
                break;
            case "left":
                frog.tongue.x += frog.tongue.speed;
                if (frog.tongue.x >= frog.body.x) frog.tongue.state = "idle";
                break;
            case "right":
                frog.tongue.x -= frog.tongue.speed;
                if (frog.tongue.x <= frog.body.x) frog.tongue.state = "idle";
                break;
        }
    }
}

function updateAndDrawFrogs() {
    for (let frog of fallingFrogs) {
        // Update the frog's position
        frog.y += frog.speed;

        // Reset the frog's position if it falls off the bottom
        if (frog.y > height) {
            frog.y = random(-height, 0);
            frog.x = random(width);
        }

        // Draw the frog image
        image(frogImage, frog.x, frog.y, frog.size, frog.size);
    }
}

/**
 * Displays the tongue and body for any frog
 */
function drawFrog(frog) {
    push();
    fill("#ff0000");
    noStroke();
    ellipse(frog.tongue.x, frog.tongue.y, frog.tongue.size);
    pop();

    push();
    stroke("#ff0000");
    strokeWeight(frog.tongue.size);
    line(frog.tongue.x, frog.tongue.y, frog.body.x, frog.body.y);
    pop();

    push();
    fill("#00ff00");
    noStroke();
    ellipse(frog.body.x, frog.body.y, frog.body.size);
    pop();
}

/**
 * Checks if a frog's tongue overlaps with any fly
 */
function checkTongueFlyOverlap(frog, isUserFrog = false) {
    for (let i = flies.length - 1; i >= 0; i--) {
        const fly = flies[i];
        const d = dist(frog.tongue.x, frog.tongue.y, fly.x, fly.y);
        if (d < frog.tongue.size / 2 + fly.size / 2) {
            flies.splice(i, 1); // Remove the caught fly
            flies.push(createFly()); // Add a new fly to replace it
            frog.tongue.state = "inbound"; // Retract the tongue after catching
            if (isUserFrog) {
                userScore++; // Increment the user score
            } else {
                aiScores[aiFrogs.indexOf(frog)]++; // Increment the respective AI frog's score
            }
        }
    }
}

/**
 * Launch the tongue on click for user-controlled frog
 */
function mousePressed() {
    if (gameState === "menu") {
        // Option 1: Start Game 1
        if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100 &&
            mouseY > height / 2 - 15 && mouseY < height / 2 + 15) {
            gameState = "playing";
            resetGame(); // Assuming this starts the first game
        }
        // Game 2 - Start Game 2
        else if (mouseX > width / 2 - textWidth("Game2") / 2 && mouseX < width / 2 + textWidth("Game 2") / 2 &&
                 mouseY > height / 2 + 20 && mouseY < height / 2 + 60) {
            gameState = "game2"; // Switch to Game 2
            resetGame(); // Reset for Game 2
        }
        // Option 3: Start Game 3
        else if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100 &&
                 mouseY > height / 2 + 65 && mouseY < height / 2 + 95) {
            gameState = "game3"; // Set game state to Game 3

        }
        // Option 4: Start Game 4
        else if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100 &&
                 mouseY > height / 2 + 105 && mouseY < height / 2 + 135) {
            gameState = "game4"; // Set game state to Game 3
        }
    } else {
        // Launch the tongue in the game
        if (gameState !== "menu" && frog.tongue.state === "idle" && !gameWon) {
            frog.tongue.state = "outbound";
        }

        if (gameState === "game3") {
            // Launch the tongue when clicked in Game 3
            if (frog.tongue.state === "idle" && !gameWon) {
                frog.tongue.state = "outbound"; // Start the tongue in Game 3
                frog.tongue.x = frog.body.x + frog.body.size / 2; // Center tongue relative to frog
                frog.tongue.y = frog.body.y;
            }
        }
    }
}




/**
 * Creates a new AI frog with given x and y positions
 */
function createAIFrog(x, y, direction) {
    return {
        body: { x, y, size: 150 },
        tongue: { x, y: y - 20, size: 20, speed: 5, state: "idle" },
        direction
    };
}

/**
 * Moves AI tongues randomly to catch flies
 */
function moveAITongues() {
    for (let aiFrog of aiFrogs) {
        if (aiFrog.tongue.state === "idle" && random(1) < 0.01) { // Randomly launch tongue
            aiFrog.tongue.state = "outbound";
        }

        if (aiFrog.tongue.state === "outbound") {
            switch (aiFrog.direction) {
                case "up":
                    aiFrog.tongue.y -= aiFrog.tongue.speed;
                    if (aiFrog.tongue.y <= 0) aiFrog.tongue.state = "inbound";
                    break;
                case "down":
                    aiFrog.tongue.y += aiFrog.tongue.speed;
                    if (aiFrog.tongue.y >= height) aiFrog.tongue.state = "inbound";
                    break;
                case "left":
                    aiFrog.tongue.x -= aiFrog.tongue.speed;
                    if (aiFrog.tongue.x <= 0) aiFrog.tongue.state = "inbound";
                    break;
                case "right":
                    aiFrog.tongue.x += aiFrog.tongue.speed;
                    if (aiFrog.tongue.x >= width) aiFrog.tongue.state = "inbound";
                    break;
            }
        } else if (aiFrog.tongue.state === "inbound") {
            switch (aiFrog.direction) {
                case "up":
                    aiFrog.tongue.y += aiFrog.tongue.speed;
                    if (aiFrog.tongue.y >= aiFrog.body.y) aiFrog.tongue.state = "idle";
                    break;
                case "down":
                    aiFrog.tongue.y -= aiFrog.tongue.speed;
                    if (aiFrog.tongue.y <= aiFrog.body.y) aiFrog.tongue.state = "idle";
                    break;
                case "left":
                    aiFrog.tongue.x += aiFrog.tongue.speed;
                    if (aiFrog.tongue.x >= aiFrog.body.x) aiFrog.tongue.state = "idle";
                    break;
                case "right":
                    aiFrog.tongue.x -= aiFrog.tongue.speed;
                    if (aiFrog.tongue.x <= aiFrog.body.x) aiFrog.tongue.state = "idle";
                    break;
            }
        }

        // Check if AI frogs caught any flies
        checkTongueFlyOverlap(aiFrog, false);
    }
}

/**
 * Displays the winning screen
 */
function displayWinningScreen() {
    background(255, 223, 186); // Light background for winning screen
    textAlign(CENTER);
    textSize(32);
    fill(0);
    text("Congratulations! You Win!", width / 2, height / 2 - 20);
    textSize(20);
    text(`Your Score: ${userScore}`, width / 2, height / 2 + 20);
    text(`AI Frog Scores: ${aiScores.join(", ")}`, width / 2, height / 2 + 50);
    textSize(16);
    text("Click the button below to restart.", width / 2, height / 2 + 80);
    
    // Restart button
    fill(0, 200, 0);
    rect(width / 2 - 50, height / 2 + 100, 100, 30, 5);
    fill(255);
    textSize(16);
    text("Restart", width / 2, height / 2 + 120);
}

/**
 * Restarts the game on mouse click on the restart button
 */
function mouseClicked() {
    if (gameWon && mouseX > width / 2 - 50 && mouseX < width / 2 + 50 && mouseY > height / 2 + 100 && mouseY < height / 2 + 130) {
        resetGame();
    }
}


//Game 2: Pong game functions

function displayWinningScreenGame2(winnerMessage) {
    background(0); // Black background
    fill(255); // White text
    textSize(32);
    textAlign(CENTER, CENTER);
    text(winnerMessage, width / 2, height / 2 - 20); // Display the winner message
    textSize(16);
    text("Press 'R' to Restart", width / 2, height / 2 + 20); // Instructions to restart
}

function resetGame2() {
    // Reset positions
    leftPaddle.set(50, height / 2 - 50);
    rightPaddle.set(width - 50, height / 2 - 50);
    ball.set(width / 2, height / 2);

    // Reset scores
    leftScore = 0;
    rightScore = 0;

    // Reset ball speed (randomize direction)
    ballSpeedX = random([-3, 3]);
    ballSpeedY = random([-3, 3]);

    // Restart the game loop
    loop();
}

function moveBall() {
    // Move the ball
    ball.x += ballSpeedX;
    ball.y += ballSpeedY;

    // Bounce off top and bottom edges
    if (ball.y <= 0 || ball.y >= height) {
        ballSpeedY *= -1; // Reverse the Y direction
    }

    // Ball goes off the left or right edge (scoring logic)
    if (ball.x <= 0) {
        rightScore++; // Right player scores
        resetBall();  // Reset the ball position
    } else if (ball.x >= width) {
        leftScore++; // Left player scores
        resetBall();  // Reset the ball position
    }
}

/**
 * Moves paddles based on player input (right paddle) and AI logic (left paddle).
 */
function movePaddles() {
    // AI-controlled left paddle
    if (random(1) > aiMissChance) {  // If random number is greater than the miss chance, AI follows the ball
        // Smooth the AI's movement towards the ball by moving it gradually
        if (ball.y > leftPaddle.y + 50) {
            leftPaddle.y += aiSpeed; // Move AI paddle down gradually
        } else if (ball.y < leftPaddle.y) {
            leftPaddle.y -= aiSpeed; // Move AI paddle up gradually
        }
    } else {  // AI intentionally misses sometimes by moving randomly
        if (random(1) > 0.5) {
            leftPaddle.y += aiSpeed;  // Move AI paddle down
        } else {
            leftPaddle.y -= aiSpeed;  // Move AI paddle up
        }
    }

    // Prevent left paddle from going off-screen
    leftPaddle.y = constrain(leftPaddle.y, 0, height - 100);

    // Player-controlled right paddle
    if (keyIsDown(UP_ARROW)) {
        rightPaddle.y -= paddleSpeed;
    }
    if (keyIsDown(DOWN_ARROW)) {
        rightPaddle.y += paddleSpeed;
    }

    // Prevent right paddle from going off-screen
    rightPaddle.y = constrain(rightPaddle.y, 0, height - 100);
}

function checkCollisions() {
    // Ball collision with left paddle
    if (ball.x <= leftPaddle.x + 10 && ball.y > leftPaddle.y && ball.y < leftPaddle.y + 100) {
        ballSpeedX *= -1; // Bounce the ball back
    }

    // Ball collision with right paddle
    if (ball.x >= rightPaddle.x - 10 && ball.y > rightPaddle.y && ball.y < rightPaddle.y + 100) {
        ballSpeedX *= -1; // Bounce the ball back
    }
}

function drawPaddles() {
    fill("#FF5733");
    // Draw the left paddle
    rect(leftPaddle.x, leftPaddle.y, 10, 100);
    // Draw the right paddle
    rect(rightPaddle.x, rightPaddle.y, 10, 100);
}

function drawBall() {
    fill("#009E60");
    // Draw the ball
    ellipse(ball.x, ball.y, 20, 20);

    // Add a fading trail
    fill(255, 100, 100, 50); // Transparent red
    ellipse(ball.x, ball.y, ball.diameter + 10);

}

function displayScoresgame2() {
    // Display scores for both players
    textSize(32);
    fill(255);
    textAlign(CENTER, TOP);
    text(leftScore, width / 4, 20); // Left player's score
    text(rightScore, width * 3 / 4, 20); // Right player's score
}

function resetBall() {
    // Reset the ball position to the center
    ball.x = width / 2;
    ball.y = height / 2;

    // Give the ball a new direction after scoring
    ballSpeedX = random() > 0.5 ? 3 : -3; // Randomly choose direction
    ballSpeedY = random(-3, 3); // Randomly assign some vertical movement
}

// Function to add animated background (moving gradient + frog image)
function drawAnimatedBackground() {
    let color1 = color(135, 206, 235); // Sky blue
    let color2 = color(255, 105, 180); // Light pink
    let lerpedColor = lerpColor(color1, color2, sin(frameCount * 0.01) * 0.5 + 0.5);

    // Draw the gradient background
    background(lerpedColor);

    // Draw the frog image with some opacity and scale to make it blend in as background
    imageMode(CENTER);
    tint(255, 100); // Add some transparency to the frog image
    image(frogImage, width / 2, height / 2, width, height); // Adjust size and position of frog image

    noTint(); // Reset the tint after drawing the image
}


/**
 * Game 3 - Player frog logic
 */
function moveFroggame3() {
    froggame3.x = mouseX; // Move the frog horizontally with the mouse position
    // Optional: you can add vertical movement limits here if needed
}

/**
 * Handles the shooting of flies
 */
function handleFlies() {
    // Create a new fly on mouse press
    if (mouseIsPressed && fliesgame3.length < NUM_FLIES) {
        fliesgame3.push({
            x: froggame3.x,       // Fly starts at frog's x position
            y: froggame3.y - 50,  // Slightly above the frog
            size: 10,             // Fly size
            speed: 5              // Speed of the fly moving upwards
        });
    }

    // Move flies upwards and draw them
    for (let fly of fliesgame3) {
        fly.y -= fly.speed; // Update position
        fill(255, 0, 0);    // Red color for flies
        ellipse(fly.x, fly.y, fly.size); // Draw fly
    }

    // Remove flies that move off-screen
    fliesgame3 = fliesgame3.filter(fly => fly.y > 0);
}


function moveFallingFroggies() {
    for (let froggie of fallingFroggies) {
        froggie.y += froggie.speed; // Move the froggies downwards

        // Reset position if it goes off-screen
        if (froggie.y > height) {
            froggie.y = random(-height, 0);
            froggie.x = random(width);
        }

        // Change froggie's color intensity based on HP
        let colorIntensity = map(froggie.hp, 0, 5, 50, 255); // Adjust based on HP
        fill(0, colorIntensity, 0); // Green color with intensity
        ellipse(froggie.x, froggie.y, froggie.size);

        // Display remaining HP as text above the froggie
        fill(255);
        textSize(12);
        textAlign(CENTER);
        text(froggie.hp, froggie.x, froggie.y - froggie.size / 2);
    }
}

/**
 * Check if any flies have hit a froggie
 */
function checkForCollisions() {
    // Loop through all flies
    for (let i = 0; i < fliesgame3.length; i++) {
        // Loop through all froggies
        for (let j = 0; j < fallingFroggies.length; j++) {
            let fly = fliesgame3[i];
            let froggie = fallingFroggies[j];

            // Calculate distance between fly and froggie
            let distance = dist(fly.x, fly.y, froggie.x, froggie.y);
            
            // Check if fly and froggie are colliding
            if (distance < (fly.size / 2 + froggie.size / 2)) {
                // Remove the fly that hit the froggie
                fliesgame3.splice(i, 1);

                // Decrease froggie's HP
                fallingFroggies[j].hp -= 1;

                // If froggie's HP reaches 0, remove the froggie
                if (fallingFroggies[j].hp <= 0) {
                    froggieHitCount++; // Increment hit count when froggie is defeated
                    
                    // Remove froggie from the game
                    fallingFroggies.splice(j, 1);
                    
                    // Add a new froggie with full HP
                    fallingFroggies.push({
                        x: random(width),
                        y: random(-height, 0),
                        speed: random(1, 3),
                        size: random(30, 50),
                        hp: 5 // Reset HP for new froggie
                    });
                }

                // Check if the player has hit 10 froggies (winning condition)
                if (froggieHitCount >= 10) {
                    gameWon = true; // Player wins after hitting 10 froggies
                }

                break; // Exit the inner loop to prevent further checking for this fly
            }
        }
    }
}

function displayWinningScreenGame3() {
    background("#32cd32");
    textSize(48);
    fill(255);
    textAlign(CENTER, CENTER);
    text("You Win!", width / 2, height / 2);
    textSize(24);
    text("Press 'R' to Restart or click Exit", width / 2, height / 2 + 50);
}

/**
 * Display the score and win condition
 */

function displayScoresGame3() {
    textSize(18);
    fill(0);
    text("Froggies Hit: " + froggieHitCount, 80, 120);
}

function updateFroggies() {
    // Update froggies' positions
    for (let i = 0; i < fallingFroggies.length; i++) {
        let froggie = fallingFroggies[i];
        froggie.y += froggie.speed;

        // Check if the froggie hits the bottom
        if (froggie.y >= height - froggie.size / 2) {
            froggie.y = height - froggie.size / 2; // Stop at the bottom
            froggieHitCount++; // Increment froggie hit count

            // Trigger red flicker effect
            isFlickering = true;

            // Check if player has lost the game (after 20 froggies hit the bottom)
            if (froggieHitCount >= maxFroggies) {
                gameLost = true; // Player loses the game after 20 froggies hit the bottom
            }
        }
    }
}
function showGameOver() {
    background(0); // Black background for game over
    fill(255); // White text

    // Display "Game Over" message
    textSize(32);
    textAlign(CENTER, CENTER);
    text('Game Over!', width / 2, height / 2 - 40);

    // Display instructions to restart the game
    textSize(20);
    text('Press "R" to restart', width / 2, height / 2 + 40);

    // Check for 'R' key press to restart Game 3
    if (keyIsPressed && (key === 'R' || key === 'r')) {
        resetGame3(); // Reset the game for Game 3 (Frog Shooter)
        gameState = "game3"; // Set the gameState to "game3" to restart Game 3
    }
}

