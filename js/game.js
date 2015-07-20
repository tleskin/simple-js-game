// Create canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// trainer image
var trainerReady = false;
var trainerImage = new Image();
trainerImage.onload = function () {
	trainerReady = true;
};
trainerImage.src = "images/trainer.png";

// pokemon image
var pokemonReady = false;
var pokemonImage = new Image();
pokemonImage.onload = function () {
	pokemonReady = true;
};
pokemonImage.src = "images/pokemon.png";

// Game objects
var trainer = {
	speed: 256, // movement in pixels per second
	x: 0,
	y: 0
};
var pokemon = {
	x: 0,
	y: 0
};
var pokemonCaught = 0;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a pokemon
var reset = function () {
	trainer.x = canvas.width / 2;
	trainer.y = canvas.height / 2;

	// Throw the monster somewhere on the screen randomly
	pokemon.x = 32 + (Math.random() * (canvas.width - 64));
	pokemon.y = 32 + (Math.random() * (canvas.height - 64));
};


// Update game objects
var update = function (modifier) {
	if (38 in keysDown) { // Player holding up
		trainer.y -= trainer.speed * modifier;
	}
	if (40 in keysDown) { // Player holding down
		trainer.y += trainer.speed * modifier;
	}
	if (37 in keysDown) { // Player holding left
		trainer.x -= trainer.speed * modifier;
	}
	if (39 in keysDown) { // Player holding right
		trainer.x += trainer.speed * modifier;
	}

	// Are they touching?
	if (
		trainer.x <= (pokemon.x + 32)
		&& pokemon.x <= (trainer.x + 32)
		&& trainer.y <= (pokemon.y + 32)
		&& pokemon.y <= (trainer.y + 32)
	) {
		++pokemonCaught;
		reset();
	}
};

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (trainerReady) {
		ctx.drawImage(trainerImage, trainer.x, trainer.y);
	}

	if (pokemonReady) {
		ctx.drawImage(pokemonImage, pokemon.x, pokemon.y);
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Pokemon caught: " + pokemonCaught, 32, 32);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();
main();
