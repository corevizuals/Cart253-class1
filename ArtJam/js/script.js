/**
 * 
 * Art Jam Project
 * 
 * 
 * Fun Circles is an interactive art piece.
 */

"use strict";

let angle = 0;
let circleSize;

function setup() {
  createCanvas(400, 400);
  circleSize = width / 4;
}

function draw() {
  // Background color changes based on mouseX
  // mouse movement shifts background from dark to light
  let bgColor = map(mouseX, 0, width, 0, 255);
  background(bgColor, 220, 220);
  
  // Continuous animation of the central circle
  // pulsing effect
  angle += 0.02;
  let oscillation = sin(angle) * 50;
  
  // Circle size changes based on mouseY
  // Vertical mouse movement changes circle size
  let mappedSize = map(mouseY, 0, height, circleSize / 2, circleSize * 2);

  // Draw the main circle
  // Mouse size change and continuous pulsing
  fill(255, 100, 100);
  ellipse(width / 2, height / 2, mappedSize + oscillation);
  
  // Conditional rendering when mouse is pressed
  // Orbiting smaller circles appear
  if (mouseIsPressed) {
    for (let i = 0; i < 5; i++) {
      // Calculate position for each orbiting circle
      // Circular motion around the center
      let x = width / 2 + cos(angle * (i + 1)) * 100;
      let y = height / 2 + sin(angle * (i + 1)) * 100;
      fill(100, 100, 255);
      ellipse(x, y, 30);
    }
  }
}