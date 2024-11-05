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

// Our fly
const fly = { x: 0, y: 200, size: 10, speedX: 3, speedY: 0 };

/**
 * Creates the canvas and initializes the fly and AI frogs
 */
function setup() {
    createCanvas(640, 480);

    // Initialize the fly
    resetFly();

    // Create AI frogs with directions
    aiFrogs.push(createAIFrog(0, height / 2, "right"));   // Left side frog
    aiFrogs.push(createAIFrog(width, height / 2, "left")); // Right side frog
    aiFrogs.push(createAIFrog(width / 2, 0, "down"));      // Top side frog
}

function draw() {
    background("#87ceeb");
    
    moveFly();
    drawFly();
    
    // User-controlled frog
    moveFrog();
    moveTongue(frog);
    drawFrog(frog);

    // AI-controlled frogs
    moveAITongues();
    for (let aiFrog of aiFrogs) {
        drawFrog(aiFrog);
        checkTongueFlyOverlap(aiFrog);
    }

    // Check for user frog catching fly
    checkTongueFlyOverlap(frog);
}

/**
 * Moves the fly according to its speed
 */
function moveFly() {
    fly.x += fly.speedX;
    fly.y += fly.speedY;
    
    if (fly.x < 0 || fly.x > width || fly.y < 0 || fly.y > height) {
        resetFly();
    }
}

/**
 * Draws the fly as a black circle
 */
function drawFly() {
    push();
    noStroke();
    fill("#000000");
    ellipse(fly.x, fly.y, fly.size);
    pop();
}

/**
 * Resets the fly to a random side with random speed and direction
 */
function resetFly() {
    const side = floor(random(4));
    switch (side) {
        case 0: // Left
            fly.x = 0;
            fly.y = random(height);
            fly.speedX = random(1, 3);
            fly.speedY = 0;
            break;
        case 1: // Right
            fly.x = width;
            fly.y = random(height);
            fly.speedX = -random(1, 3);
            fly.speedY = 0;
            break;
        case 2: // Top
            fly.x = random(width);
            fly.y = 0;
            fly.speedX = 0;
            fly.speedY = random(1, 3);
            break;
        case 3: // Bottom
            fly.x = random(width);
            fly.y = height;
            fly.speedX = 0;
            fly.speedY = -random(1, 3);
            break;
    }
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
    // Only set initial position to match the frog’s body position if the tongue is idle
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
    // Draw the tongue tip
    push();
    fill("#ff0000");
    noStroke();
    ellipse(frog.tongue.x, frog.tongue.y, frog.tongue.size);
    pop();

    // Draw the rest of the tongue
    push();
    stroke("#ff0000");
    strokeWeight(frog.tongue.size);
    line(frog.tongue.x, frog.tongue.y, frog.body.x, frog.body.y);
    pop();

    // Draw the frog's body
    push();
    fill("#00ff00");
    noStroke();
    ellipse(frog.body.x, frog.body.y, frog.body.size);
    pop();
}

/**
 * Checks if the tongue overlaps with the fly
 */
function checkTongueFlyOverlap(frog) {
    const d = dist(frog.tongue.x, frog.tongue.y, fly.x, fly.y);
    if (d < frog.tongue.size / 2 + fly.size / 2) {
        resetFly();
        frog.tongue.state = "inbound"; // Retract the tongue after catching
    }
}

/**
 * Launch the tongue on click for user-controlled frog
 */
function mousePressed() {
    if (frog.tongue.state === "idle") {
        frog.tongue.state = "outbound";
    }
}

/**
 * Creates a new AI frog with given x and y positions
 */
function createAIFrog(x, y, direction) {
    return {
        body: { x, y, size: 150 },
        tongue: { x, y, size: 20, speed: 20, state: "idle" },
        direction: direction // Add direction property
    };
}

/**
 * Move AI tongues by randomly deciding to extend the tongue
 */
function moveAITongues() {
    for (let aiFrog of aiFrogs) {
        if (aiFrog.tongue.state === "idle" && random() < 0.01) {
            aiFrog.tongue.state = "outbound";
        }
        moveTongue(aiFrog);
    }
}