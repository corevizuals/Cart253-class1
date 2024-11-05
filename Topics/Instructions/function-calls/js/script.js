/**
 * Title of Project
 * Author Name
 * 
 * Working on the function calls exaples.
 */

"use strict";


function setup() {
    //Once at the beginning of the program
    createCanvas(640, 640); 
}


function draw() {
    //Every frame
    background(150)

    // The main part of the record
    push ();
    fill (255, 0, 0);
    stroke (255);
    ellipse(320, 320, 480);
    pop();

    //the label, the white bit

    push();
    fill("white");
    noStroke ();
    ellipse (320,320, 140, 140);
    pop();

    push();
    fill("#000000");
    nostroke();
    ellipse (320, 320, 20);
    pop()

}