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
