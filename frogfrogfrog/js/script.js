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
    tongue: { x: undefined, y: 480, size: 20, speed: 20, state: "idle" } // idle, outbound, inbound
};

// Array for AI-controlled frogs
const aiFrogs = [];

// Our fly
const fly = { x: 0, y: 200, size: 10, speedX: 3, speedY: 0 };

// Modify setup to assign directions to left and right frogs
function setup() {
    createCanvas(640, 480);

    // Give the fly its first random position
    resetFly();

    // Initializing the ai-frogs in different positions (sides of the screen)
    aiFrogs.push(createAIFrog(0, height / 2, "right")); // Left frog with right-moving tongue
    aiFrogs.push(createAIFrog(width, height / 2, "left")); // Right frog with left-moving tongue
    aiFrogs.push(createAIFrog(width / 2, 0, "up")); // Top frog with upward tongue
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
 * Moves the tongue based on its state and direction
 */
function moveTongue(frog) {
    // Set the x-position of the tongue to the frog's body position for alignment
    frog.tongue.x = frog.body.x;

    // Handle tongue movement based on its direction and state
    if (frog.tongue.state === "idle") {
        // Do nothing
    }
    else if (frog.tongue.state === "outbound") {
        // Move tongue based on direction
        if (frog.direction === "up") frog.tongue.y -= frog.tongue.speed;
        else if (frog.direction === "right") frog.tongue.x += frog.tongue.speed;
        else if (frog.direction === "left") frog.tongue.x -= frog.tongue.speed;

        // Change state to inbound if the tongue reaches a boundary
        if (frog.tongue.y <= 0 || frog.tongue.x >= width || frog.tongue.x <= 0) {
            frog.tongue.state = "inbound";
        }
    }
    else if (frog.tongue.state === "inbound") {
        // Retract the tongue based on direction
        if (frog.direction === "up") frog.tongue.y += frog.tongue.speed;
        else if (frog.direction === "right") frog.tongue.x -= frog.tongue.speed;
        else if (frog.direction === "left") frog.tongue.x += frog.tongue.speed;

        // Stop the tongue when it reaches its resting position
        if (frog.tongue.y >= frog.body.y || frog.tongue.x >= frog.body.x || frog.tongue.x <= frog.body.x) {
            frog.tongue.state = "idle";
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
 * Create a new AI frog with given x and y positions and direction
 */
function createAIFrog(x, y, direction = "up") {
    return {
        body: { x, y, size: 150 },
        tongue: { x, y, size: 20, speed: 20, state: "idle" },
        direction: direction // Direction can be "up", "left", or "right"
    };
}

/**
 * Move AI tongues by randomly deciding to extend the tongue
 */
function moveAITongues() {
    for (let aiFrog of aiFrogs) {
        if (aiFrog.tongue.state === "idle" && random() < 0.01) { // 1% chance each frame
            aiFrog.tongue.state = "outbound";
        }
        moveTongue(aiFrog);
    }
}