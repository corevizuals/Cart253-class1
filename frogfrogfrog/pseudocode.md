// Hungry Hungry Frogs Game
// A four-frog game where each frog tries to catch the most flies using their tongue

// Initialize user-controlled frog with position, tongue, and direction
frog = {
    body: { x: 320, y: 520, size: 150 },
    tongue: { x: undefined, y: 480, size: 20, speed: 20, state: "idle" },
    direction: "up" // Default direction for user-controlled frog
}

// Array to hold AI frogs, each with their own position and direction
aiFrogs = []

// Array to hold multiple flies, with a defined number of flies
flies = []
numFlies = 5

// Initialize user and AI scores
userScore = 0
aiScores = [0, 0, 0]
gameWon = false // Flag to check if game-winning condition is met

// setup()
// Sets up the game canvas and initializes game elements (flies and frogs)
function setup():
    create canvas of size 640x480
    call resetGame() to initialize/reset game variables

// resetGame()
// Resets game variables and initializes flies and AI frogs
function resetGame():
    reset userScore to 0
    reset aiScores to [0, 0, 0]
    clear flies array and repopulate with new fly objects
    clear aiFrogs array and add AI frogs at designated positions with specified directions
    set gameWon to false

// draw()
// Main game loop, updates game state and draws elements on the canvas
function draw():
    set background color to sky blue

    if gameWon:
        display winning screen
    else:
        // Move and draw flies
        for each fly in flies:
            call moveFly(fly) to update position
            call drawFly(fly) to display on canvas

        // User frog movement and actions
        call moveFrog() to make frog follow mouse
        call moveTongue(frog) to handle tongue movement
        call drawFrog(frog) to display frog and tongue

        // AI frog actions
        call moveAITongues() to randomly trigger AI frogs’ tongues
        for each aiFrog in aiFrogs:
            call drawFrog(aiFrog) to display AI frog and tongue
            call checkTongueFlyOverlap(aiFrog, false) to check if AI frog catches any fly

        // Check if user frog caught any fly
        call checkTongueFlyOverlap(frog, true)

        // Check if user won by reaching a score of 20
        if userScore >= 20:
            set gameWon to true

        // Display user and AI scores
        call displayScores()

// createFly()
// Generates a new fly with a random starting position and speed from one of four sides of the canvas
function createFly():
    initialize fly with size and default speed
    choose random side (0 = left, 1 = right, 2 = top, 3 = bottom)
    set fly's position and speed based on chosen side
    return fly

// moveFly(fly)
// Updates fly's position according to its speed and resets fly if it moves off-screen
function moveFly(fly):
    update fly.x and fly.y based on fly's speedX and speedY
    if fly goes off canvas:
        reset fly by assigning new position and speed

// drawFly(fly)
// Draws a fly as a black circle at its current position
function drawFly(fly):
    set fill color to black
    draw ellipse at fly's x, y position with fly's size

// moveFrog()
// Updates user frog's x position to follow the mouse x position
function moveFrog():
    set frog.body.x to mouseX

// moveTongue(frog)
// Controls tongue movement based on its current state and direction
function moveTongue(frog):
    if tongue state is "idle":
        reset tongue x and y to frog body position
    if tongue state is "outbound":
        move tongue in direction specified by frog.direction (up, down, left, right)
        if tongue reaches edge of canvas, set state to "inbound"
    if tongue state is "inbound":
        move tongue back towards frog body position
        if tongue reaches frog body, set state to "idle"

// drawFrog(frog)
// Draws the frog's body and tongue on the canvas
function drawFrog(frog):
    set fill color to red for tongue
    draw ellipse for tongue
    draw line from tongue to frog body
    set fill color to green for frog body
    draw ellipse for frog body

// checkTongueFlyOverlap(frog, isUserFrog)
// Checks if the frog's tongue overlaps with any fly and increments score if a fly is caught
function checkTongueFlyOverlap(frog, isUserFrog):
    for each fly in flies:
        calculate distance d between tongue and fly
        if d is less than combined radius of tongue and fly:
            remove fly from flies array and replace with a new fly
            set tongue state to "inbound"
            if frog is user-controlled:
                increment userScore
            else:
                increment AI frog's score based on AI frog index

// mousePressed()
// Launches the user-controlled frog's tongue when clicked, if it’s idle
function mousePressed():
    if frog's tongue is idle and game has not been won:
        set tongue state to "outbound"

// createAIFrog(x, y, direction)
// Creates an AI frog at specified x, y position with a set direction
function createAIFrog(x, y, direction):
    initialize AI frog body and tongue properties
    set AI frog's direction
    return AI frog

// moveAITongues()
// Randomly launches AI frogs' tongues with a low probability and handles inbound/outbound movements
function moveAITongues():
    for each aiFrog in aiFrogs:
        if tongue is idle and random condition met:
            set tongue state to "outbound"
        if tongue is outbound:
            move tongue in direction specified by aiFrog.direction
            if tongue reaches canvas edge, set state to "inbound"
        if tongue is inbound:
            move tongue back towards aiFrog body
            if tongue reaches body, set state to "idle"
        call checkTongueFlyOverlap(aiFrog, false) to check for fly capture

// displayWinningScreen()
// Displays a winning message and final scores on the canvas
function displayWinningScreen():
    set background to light color
    display "Congratulations" message and final scores for user and AI frogs