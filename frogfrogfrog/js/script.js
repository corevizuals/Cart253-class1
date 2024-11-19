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

// Our frog
const frog = {
    body: { x: 320, y: 520, size: 150 },
    tongue: { x: undefined, y: 480, size: 20, speed: 20, state: "idle" },
    direction: "up" // Default direction for user-controlled frog
};

// Array for AI-controlled frogs
const aiFrogs = [];

// Array to store multiple flies
const flies = [];
const numFlies = 5; // Set the number of flies you want to have at once

// Score variables
let userScore = 0; // Score for the user-controlled frog
const aiScores = [0, 0, 0]; // Scores for the AI frogs
let gameWon = false; // Track if the user has won

/**
 * Creates the canvas and initializes the flies and AI frogs
 */
function setup() {
    createCanvas(640, 480);
    resetGame(); // Call resetGame to initialize the game
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
    aiFrogs.length = 0; // Clear existing AI frogs
    aiFrogs.push(createAIFrog(0, height / 2, "right"));   // Left side frog
    aiFrogs.push(createAIFrog(width, height / 2, "left")); // Right side frog
    aiFrogs.push(createAIFrog(width / 2, 0, "down"));      // Top side frog
    gameWon = false; // Reset winning state
}

function draw() {
    background("#87ceeb");

    if (gameWon) {
        displayWinningScreen();
    } else {
        // Move and draw each fly
        for (let fly of flies) {
            moveFly(fly);
            drawFly(fly);
        }

        // User-controlled frog
        moveFrog();
        moveTongue(frog);
        drawFrog(frog);

        // AI-controlled frogs
        moveAITongues();
        for (let aiFrog of aiFrogs) {
            drawFrog(aiFrog);
            checkTongueFlyOverlap(aiFrog, false); // Pass false for AI frogs
        }

        // Check for user frog catching flies
        checkTongueFlyOverlap(frog, true); // Pass true for user frog

        // Check if user has won 
        if (userScore >= 20) {
            gameWon = true;
        }
        // for the aifrogs

        // Display scores
        displayScores();
    }
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
    if (frog.tongue.state === "idle" && !gameWon) {
        frog.tongue.state = "outbound";
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

/**
 * Displays the scores for both the user and AI frogs
 */
function displayScores() {
    push();
    textSize(16);
    textAlign(LEFT);
    text(`Your Score: ${userScore}`, 10, 20);
    for (let i = 0; i < aiScores.length; i++) {
        text(`AI Frog ${i + 1} Score: ${aiScores[i]}`, 10, 40 + i * 20);
    }
    pop();
}