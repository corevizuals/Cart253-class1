# Planning

## Starting point

The initial idea:

> Hungry Hungry Frogs is a collection of mini-games featuring frogs as the main character. The goal is for the player to control a frog to catch targets (flies, objects, etc.) across different game modes, scoring points based on skill and timing.

## Experience design

The experience:

> The player controls a frog through different mini-games where they must interact with moving or stationary objects. Each game features unique mechanics, such as catching flies in *Frog Feast*, shooting targets in *Frog Shooter*, or jumping across platforms in *Frog Leap*. The objective in each game is to achieve the highest score possible, either by catching the most targets, avoiding obstacles, or completing challenges within a time limit.

## Breaking it down

Basic things to do:

- Draw the frog for all mini-games (with some variations for different games)
- Create movement mechanics for the frog (keyboard/mouse inputs)
- Design and animate the different targets or objects for each game
- Implement obstacles (e.g., falling objects in *Frog Shooter*)
- Develop platforming mechanics for *Frog Leap* (platforms that move, fall, or rotate)
- Implement AI-controlled frogs (for competitive play in certain games)
- Add scoring systems across all mini-games
- Design game-over and winning screens
- Implement sound effects and background music to enhance the experience

Questions:

- What does the frog look like?
    - For simplicity and consistency, the frog is designed as a cartoonish character with a wide mouth and expressive eyes.
    - Variations may occur depending on the game (e.g., different frog poses or actions).
    
- How does the user control the frog?
    - For most games, the user controls the frog with the mouse (for *Frog Feast* and *Frog Shooter*) or with keyboard inputs (for *Frog Leap*).
    - Movement for the frog is smooth and responsive, with simple directional controls.
    
- How do the objects move in each game?
    - In *Frog Feast*, flies randomly move across the screen in a non-linear pattern, adding unpredictability to their movement.
    - In *Frog Shooter*, targets (e.g., balls or objects) fall from above, forcing the player to aim and shoot while avoiding falling objects.
    - In *Frog Leap*, platforms move or shift in various directions, requiring precise timing to jump from one to another.

- What do the obstacles look like?
    - In *Frog Shooter*, obstacles are falling objects, such as rocks or debris, that the player must avoid while shooting targets.
    - In *Frog Leap*, moving platforms, disappearing tiles, or dangerous gaps act as obstacles.

- What happens if the player misses a target or fails a jump?
    - In most cases, missed targets simply reset and continue to move. In *Frog Shooter*, missing the target impact's the score directly and leads to losing the game.
    - In *Frog Leap*, falling off a platform results in losing.

- How does the AI-controlled frog interact with the player?
    - The AI-controlled frogs compete against the player in certain games, such as *Frog Feast*. They aim to catch flies or complete tasks, adding difficulty and competition to the game. In the Frog Pong, The AI-controlled left paddle is also competing agaisnt the user, the left paddle in this game is pretty accurate and can win the game 80 percent of the time.

- What does the layout look like for each mini-game?
    - All games have similar elements, including the colors, buttons, winning and losing screens, as well as elements like the frogs, tongue and flies.
    - In *Frog Feast*, the frog is positioned at the bottom of the screen with flies moving across the canvas.
    - In *Frog Shooter*, the frog is at the bottom, and falling objects or targets drop from above. The player aims and shoots at the targets while dodging obstacles.
    - In *Frog Leap*, the player’s frog jumps between floating platforms that move or disappear, and the objective is to stay on the platforms while avoiding falling off.

## The program starts to form....

### Stage 1 - Setting Up the Basics with Variables:
- **Canvas Setup:** Used p5.js to create the canvas where the action takes place. The size of the canvas adjusts based on each mini-game's needs.
- **Defining Key Variables:** Initialized variables for frog position, speed, score, timer, and any game-specific parameters like the position of targets, obstacles, or platforms.

### Stage 2 - Creating the Frog with Functions and Movement Controls:
- **Frog Movement:** Developed functions to handle frog movement for each mini-game. For *Frog Feast* and *Frog Shooter*, mouse input allows the frog to move horizontally. For *Frog Leap*, arrow keys control vertical and horizontal movement.
- **Boundary Checking:** Added logic to ensure the frog stays within the bounds of the canvas and does not move off-screen.

### Stage 3 - Target Generation, Movement, and Obstacles:
- **Targets (flies and objects):** Created functions to generate targets or objects that the frog interacts with. Targets may move randomly, drop from above, or stay in a fixed position.
- **Obstacles:** Implemented obstacles that interact with the frog’s movement, such as falling objects in *Frog Shooter* or disappearing platforms in *Frog Leap*.

### Stage 4 - AI Integration and Scoring:
- **AI-Controlled Frogs:** Added AI frogs that compete against the player. These AI frogs move randomly or use predefined paths to try to catch targets.
- **Scoring System:** Implemented a dynamic scoring system across all mini-games that tracks the player’s performance. Points are awarded for each successful action, such as catching flies or hitting targets.

### Stage 5 - Adding a Winning Screen:
- **Winning Screen:** Developed a winning screen that appears when the player achieves the target score or completes the game objective. This screen also provides options to restart or exit.
- **Game Over Conditions:** Created conditions for game over, including when time runs out or the player fails to reach the target score.

## Tools Used:

- **p5.js:** For drawing game elements, handling animations, and creating interactive gameplay.
- **JavaScript:** For game logic, including movement, scoring, collision detection, and AI.
- **Class Videos and Notes:** Used as a primary learning resource for understanding p5.js and general game development techniques.
- **ChatGPT:** Assisted with brainstorming game mechanics, debugging code, and refining gameplay ideas.
- **Freeform on iPad:** Used for initial sketching and brainstorming ideas, layouts, and flow for each mini-game.
