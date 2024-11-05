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
 * 
 * 
 * 
 * Notes for Johnny:
 * Variables: 1. Global Variables: Store frogs, flies and the user controlled frog's state 2. Properties for frogs and flies: Use objects to represent each frog and fly, storing properties like position, size, and the 'isUserControlled' for the player's frog.
 * Functions: 1. Setting up the fuction: Use function to initalize the game, place the frogs and fleis on the canvas. 2. Drawing Functions: each frame, update and display the game objects in a 'draw' function. 3. Helper functions: use helper functions to extend the frog's tongue, move flies and check for collisions.
 * 
 */

"use strict";

// Our frog
const frog = {
    // The frog's body has a position and size
    body: {
        x: 320,
        y: 520,
        size: 150
    },
    // The frog's tongue has a position, size, speed, and state
    tongue: {
        x: undefined,
        y: 480,
        size: 20,
        speed: 20,
        // Determines how the tongue moves each frame
        state: "idle" // State can be: idle, outbound, inbound
    }
};
//Array for AI-controlled frogs
const aiFrogs = [];

// Our fly
// Has a position, size, and speed of horizontal movement
const fly = {
    x: 0,
    y: 200, // Will be random
    size: 10,
    speedX: 3,
    speedY: 0 
};

/**
 * Creates the canvas and initializes the fly and AI frogs
 */
function setup() {
    createCanvas(640, 480);

    // Give the fly its first random position
    resetFly();

    //Initializing the ai-frogs in different positions (sides of the screen)
    aiFrogs.push(createAIfrog(0, height / 2)); //left side
    aiFrogs.push(createAIfrog(width, height / 2)); //right side
    aiFrogs.push(createAIfrog(width / 2, 0)); //top side
}


function draw() {
    background("#87ceeb");
    
    // Move and draw the flies
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
 * Resets the fly if it gets off the canvas
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
 * Moves the frog to the mouse position on x
 */
function moveFrog() {
    frog.body.x = mouseX;
}

/**
 * Handles moving the tongue based on its state
 */
function moveTongue() {
    // Tongue matches the frog's x
    frog.tongue.x = frog.body.x;
    // If the tongue is idle, it doesn't do anything
    if (frog.tongue.state === "idle") {
        // Do nothing
    }
    // If the tongue is outbound, it moves up
    else if (frog.tongue.state === "outbound") {
        frog.tongue.y += -frog.tongue.speed;
        // The tongue bounces back if it hits the top
        if (frog.tongue.y <= 0) {
            frog.tongue.state = "inbound";
        }
    }
    // If the tongue is inbound, it moves down
    else if (frog.tongue.state === "inbound") {
        frog.tongue.y += frog.tongue.speed;
        // The tongue stops if it hits the bottom
        if (frog.tongue.y >= height) {
            frog.tongue.state = "idle";
        }
    }
}

/**
 * Displays the tongue (tip and line connection) and the frog (body)
 */
function drawFrog() {
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
    const eaten = (d < frog.tongue.size / 2 + fly.size / 2);
    if (eaten) {
        resetFly();
        frog.tongue.state = "inbound"; // Retract the tongue after catching
    }
}

/**
 * Launch the tongue on click (for the user-controlled frog)
 */
function mousePressed() {
    if (frog.tongue.state === "idle") {
        frog.tongue.state = "outbound";
    }
}


