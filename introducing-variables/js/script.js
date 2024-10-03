/**
 * Title of Project
 * Author Name
 * 
 * Learning what a variable is and does
 */

"use strict";

/**
 * Create a canvas
*/
function setup() {
    createCanvas(1000,480);
}


/**
 * OOPS I DIDN'T DESCRIBE WHAT MY DRAW DOES!
*/
function draw() {
    background(0);

    //Draw the circle
    push ();
    fill (mouseX, mouseY,0);
    noStroke ();
    ellipse (width / 2, height / 2, 100, 100);
    pop ();
}