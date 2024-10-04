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
  // Movement: Horizontal mouse movement shifts background from dark to light
  let bgColor = map(mouseX, 0, width, 0, 255);
  background(bgColor, 220, 220);
  
  // Continuous animation of the central circle
  // pulsing effect
  angle += 0.02;
  let oscillation = sin(angle) * 50;
  
  // Circle size changes based on mouseY
  // Vertical mouse movement changes circle size
  let mappedSize = map(mouseY, 0, height, circleSize / 2, circleSize * 2);

}