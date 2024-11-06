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
            call