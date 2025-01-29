const gameContainer = document.querySelector(".game-container");

// A div for tracking the progress of the player
const progressTracker = document.createElement("div");
progressTracker.className = "progressTracker";
const life = document.createElement("p"); // p tag for life
const score = document.createElement("p"); //p tag for score
score.style.color = "white";
let player = true; // bollean for player
let resetBtn; // declaring reset button variable
let nrOfLife = 3; // 3 life for a player

function lifeUpdate() {
  // function for life update
  if (nrOfLife > 0) {
    // check the condition
    nrOfLife--; // update life
    life.textContent = `Life:-${nrOfLife}`;
  }
  if (nrOfLife <= 0 && player) {
    // condition check if life is equal to 0
    player = false;
    score.style.opacity = "0"; // dissapear the score bord
    resetBtn = document.createElement("button");
    resetBtn.textContent = "Try Again";
    resetBtn.className = "btn";

    resetBtn.addEventListener("click", resetGame); // eventlistner while we click so reset function run
    gameContainer.append(resetBtn);
  }
}

function resetGame() {
  // reset game function
  if (resetBtn) {
    resetBtn.remove();
    player = true;
    yourScore = 0;
    nrOfLife = 3;
    score.style.opacity = "1";
    life.textContent = `Life:-${nrOfLife}`;
    score.textContent = `Your score:${yourScore}`;

    enemyArray.forEach((enemy) => enemy.remove());
  }
}

let yourScore = 0; // score start with 0
// record the score
function scoreRecord() {
  yourScore += 12; // add +12 if a laser hit ones a enemy
  score.textContent = `Your score:${yourScore}`;
} // score start form 0
life.textContent = `Life:-${nrOfLife}`; // content for player life
life.style.color = "white";
score.textContent = `Your score:${yourScore}`; // content for player score

// Define rocket and css for alling it
const rocket = document.createElement("img");
rocket.src = "./img/rocket.png";
rocket.style.height = "50px";
rocket.style.width = "50px"; // css for rocket
rocket.style.position = "absolute";
rocket.style.bottom = "10px";

const containerWidth = gameContainer.clientWidth; // finding game container width

// adding event while presing key. for rocket movements
document.addEventListener("keydown", (e) => {
  if (
    e.key === "ArrowRight" &&
    rocket.offsetLeft < containerWidth - rocket.offsetWidth
  ) {
    rocket.style.left = `${rocket.offsetLeft + 10}px`; // Move the rocket 10 pixels to the right
  }
  if (e.key === "ArrowLeft" && rocket.offsetLeft > 0) {
    rocket.style.left = `${rocket.offsetLeft - 10}px`; // Move the rocket 10 pixels to the left
  }
});

let laserAttack = []; // array for storing laser which will append while we press space bar
// Lasers section or bullet
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    const laser = document.createElement("div");
    laser.style.height = "10px";
    laser.style.width = "4px";
    laser.style.backgroundColor = "orange";
    laser.style.position = "absolute";
    laser.style.left = `${rocket.offsetLeft + rocket.offsetWidth / 2 - 5}px`;
    laser.style.top = `${rocket.offsetTop - 10}px`;

    // sound for laser
    const laserShoot = new Audio();
    laserShoot.src = "./sound/laserShoot.wav";
    laserShoot.play();
    gameContainer.append(laser);
    laserAttack.push(laser);
    moveLaserUp(laser);
  }
});

// time frame for lasers by setInterval
function moveLaserUp(laser) {
  const laserInterval = setInterval(() => {
    if (laser.offsetTop > 0) {
      laser.style.top = `${laser.offsetTop - 10}px`;
      console.log("a div created ");
    } else {
      clearInterval(laserInterval);
      laser.remove();
      console.log("dissapera");
    }
  }, 20);
}

// enemy section
let enemyArray = [];
function generateEnemy() {
  const enemy = document.createElement("img"); // enemy png
  enemy.className = "enemy";
  enemy.src = "./img/red.png";
  enemy.style.top = "80px";
  // secound enemy or variant of enemy
  const blueEnemy = document.createElement("span");
  blueEnemy.textContent = "👾";
  blueEnemy.style.top = "80px";
  blueEnemy.className = "blue-enemy";
  gameContainer.append(enemy, blueEnemy); // append enemy befor geting the position of enemy so it can generate at random position

  blueEnemy.style.left = `${
    Math.random() * (containerWidth - blueEnemy.clientWidth)
  }px`;
  enemy.style.left = `${
    Math.random() * (containerWidth - enemy.clientWidth)
  }px`; // for first enemy or red one
  enemyArray.push(enemy, blueEnemy);
  generateEnemiesPeriodically(enemy, blueEnemy);
}

const containerHeight = gameContainer.clientHeight; // for gameContainer height
// time frame for enemy
function generateEnemiesPeriodically(enemy, blueEnemy) {
  const enemyInterval = setInterval(() => {
    if (
      enemy.offsetTop < containerHeight - enemy.clientHeight &&
      blueEnemy.offsetTop < containerHeight - blueEnemy.clientHeight
    ) {
      enemy.style.top = `${enemy.offsetTop + 3}px`;
      blueEnemy.style.top = `${blueEnemy.offsetTop + 3}px`;
    } else {
      clearInterval(enemyInterval);
      enemy.remove();
      blueEnemy.remove();
    }
  }, 1000);
}

// collision deected
function collisionHandler(laserAttack, enemyArray, rocket) {
  laserAttack.forEach((laser) => {
    const laserRect = laser.getBoundingClientRect();
    enemyArray.forEach((enemy) => {
      const enemyRect = enemy.getBoundingClientRect();
      let rocketRect = rocket.getBoundingClientRect();

      if (
        laserRect.right > enemyRect.left &&
        laserRect.left < enemyRect.right && // check if all  the condition meet
        laserRect.top < enemyRect.bottom &&
        laserRect.bottom > enemyRect.top
      ) {
        // fire emoji
        const fire = document.createElement("span");

        function fireEmoji(laser, enemy) {
          // function foe fireEmoji
          fire.textContent = "💥";
          fire.style.fontSize = "50px";

          fire.style.position = "absolute";
          fire.style.left = `${laser.offsetLeft - 5}px`;
          fire.style.top = `${enemy.offsetTop - 2}px`;

          gameContainer.append(fire);
          setTimeout(() => {
            fire.remove(); // remove fire emoji after 2ms
          }, 200);
        }
        // audio when a collision detect between laser and enemy
        fireEmoji(laser, enemy);
        const explosion = new Audio();
        explosion.src = "./sound/explosion.mp3";
        explosion.play();
        laser.remove();
        enemy.remove();

        scoreRecord();
      } else if (
        enemyRect.right > rocketRect.left &&
        enemyRect.left < rocketRect.right &&
        enemyRect.bottom > rocketRect.top && // check condition if the enemy hit rocket or player
        enemyRect.top < rocketRect.bottom
      ) {
        enemy.remove(); // remove enemy from the screen
        lifeUpdate(); // update life when enemy hit the player or rocket
      }
    });
  });
}

setInterval(generateEnemy, 3000); // enemy generated after 3 sec

setInterval(() => {
  collisionHandler(laserAttack, enemyArray, rocket); // Check for collisions every 50ms
}, 50);

progressTracker.append(life, score); // apend life and score at progressTracker div

gameContainer.append(progressTracker, rocket); // append rocket and progress at gameContainer
