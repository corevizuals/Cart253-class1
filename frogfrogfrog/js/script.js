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
                if (frog