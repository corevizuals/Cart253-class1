# Planning

## Starting point

The initial idea:

> Frog eating flies

## Experience design

The experience:

> The user controls a frog at the bottom of the screen, they can shoot out the frog's tongue and catch a fly which is moving on the screen. If the tongue hits the fly it gets eaten.

## Breaking it down

Basic things to do:

- Draw the frog (image? a circle?)
- Draw the tongue...
- Move the frog (how? mouse? keyboard? breathing?)
- Move the fly (in line? buzzing around? random?)
- Figure out if the tongue hits the fly?

Questions:

- What does the frog look like?
    - Circles!
- How does the user control the frog?
    - User controls frog with the mouse position, just to the left and right
    - User launches the tongue with a mouse click
- How does the fly move?
    - The fly starts on the left at a random y position, and moves to the right in a line
- What does the tongue look like?
    - A red line coming out of the frog...
- What happens if the user doesn't catch the fly?
    - If the fly goes off the right side, it just resets to a new random y on the left
- What does it all look like on the screen? Layout?
    - Frog at the bottom, fly moving across, tongue shooting out of frog

## The program starts to form....

Stage 1 - Setting Up the Basics with Variables:

Canvas Setup: Used p5.js to create the game canvas where the action takes place.
Defining Key Variables: Initialized essential variables, including those for the frog's position, speed, score, and a timer. Also set up variables to store target properties, like position and whether a target is "active."


Stage 2 - Creating the Frog with Functions and Movement Controls:

Frog Movement: Created a function to update the frog's position based on player's mouse movements and mouse clicks.
Boundary Checking: Added conditionals to ensure the frog stays within the canvas area and doesn’t move outside the boundaries.


Stage 3 - Target (flies) Generation and Management Using Arrays and Conditionals:

Array for Targets: Set up an array to hold multiple targets, allowing multiple flies to appear on screen at once.
Spawning Targets: Created a function to generate targets at random positions. Used conditionals within this function to determine when and where a new target should appear.
Moving Targets: Defined logic to move each target in the array, with random.


Stage 4 - Detecting Collisions and Scoring with Functions and Conditionals:
Collision Detection: Wrote a function to check if the frog's position overlaps with any target. Used conditionals within this function to confirm a "hit."
Updating Score: When a collision is detected, added a conditional to increase the score variable and remove the "eaten" flies from the array.


Stage 5 - Adding a Winning Screen:

Winning Screen Display: Implemented a simple winning screen that ap