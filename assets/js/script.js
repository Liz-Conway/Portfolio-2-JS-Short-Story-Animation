/*
 * Only let the user play the animation once the DOM has finished loading
 * Wait for the DOM to finish loading
*/
document.addEventListener("DOMContentLoaded", pageLoaded());

function pageLoaded() {
	setUpScenes();
	
	let playButton = document.getElementById("playButton");
	console.log("Play button :  ", playButton);
	let pauseButton = document.getElementById("pauseButton");
	let restartButton = document.getElementById("restartButton");
	let rewindButton = document.getElementById("rewindButton");
	let fastForwardButton = document.getElementById("fastForwardButton");
	
	/* Initially the only option is to play the animation */
	hideAllButtons();
	showButton(playButton);
	
	/* Set the function to be called when the speaker image is clicked */
	let speakerImage = document.getElementById("speaker");
	speakerImage.addEventListener("click", toggleMute);
	
	/* Set event listeners for all the buttons
	 * When the button is clicked this function will be called.
	 */
	playButton.addEventListener("click", playAnimation);
	pauseButton.addEventListener("click", stopAnimation);
	restartButton.addEventListener("click", restartAnimation);
	rewindButton.addEventListener("click", rewindAnimation);
	fastForwardButton.addEventListener("click", fastForwardAnimation);
}

/**
 * If sound is unmuted then mute the sound
 * If sound is already muted then unmute it
 */
function toggleMute() {
	let soundImage = "assets/images/speaker.png";
	let mutedImage = "assets/images/speaker-muted.png";
	
	console.log("toggleMute()");
	console.log("this ::  ", this);
	
	/* this refers to the speakerImage element */
	let image = this.getAttribute("src");
	console.log("Image ::  ", image);
	if(image === soundImage) {
		/* Speaker image so we must mute the sound, 
			then change to the muted image */
		for(scene of scenes) {
			/* Audio is stored in scene[2] */
			console.log("Scene::  ", scene[0]);
			/*https://www.developphp.com/video/JavaScript/Audio-Play-Pause-Mute-Buttons-Tutorial*/
			scene[2].muted = true;
		}
		
		this.setAttribute('src', mutedImage);
	} else {
		/* Sound is already muted, so unmute it
			then change to the unmuted image */
		for(scene of scenes) {
			/* Audio is stored in scene[2] */
			console.log("Scene::  ", scene[0]);
			/*https://www.developphp.com/video/JavaScript/Audio-Play-Pause-Mute-Buttons-Tutorial*/
			scene[2].muted = false;
		}
		
		this.setAttribute('src', soundImage);
	}
}


/*I could not find any way around using global variables
since these variables need to be accessed by multiple functions*/
function showScene(pictureImage, picture, sentences, audio, sceneNumber) {
	/* Display the number of this scene */
	updateSceneNumber(sceneNumber);
	
	/*Start running the progress bar*/
	if(!isPaused()) {
		progress(getSceneTime());
	}

	/* typed.js allows you to pause a sentence
		by inserting a '^' symbol followed by the number of milliseconds to pause
		E.G. ^500 pauses the typing for a half a second (500ms)
	 */
	let sentencePause = "^1000";

	pictureImage.src = picture;

	let sceneParagraph = "";

	for (let i = 0; i < sentences.length; i++) {
		sceneParagraph += i === 0 ? "" : sentencePause;
		sceneParagraph += sentences[i];
	}

	clearParagraph();
	typeParagraph(sceneParagraph);
	audio.play();
}

var typed;
/** Use typed.js to type out the entered text */
function typeParagraph(text) {
	let status = getStatus();
	if(isPaused() && status !== "Restarting") {
		console.log("Unpausing typing");
		typed.start();
	} else {
		/* The first argument is the class of the element where the text will be typed 
			strings = The text to type
			typeSpeed = how fast the text types
			loop = whether the text is typed once (false), or over and over again (true)
			showCursor = whether to show a typing cursor as text is typed
		*/
		typed = new Typed('.storyParagraph', {
			strings: [text],
			typeSpeed: 45,
			loop: false,
			showCursor: false
		});
	}
}

/** Clears the text in the storyParagraph
	Otherwise the typing for the next scene will not work
 */
function clearParagraph() {
	let storyParagraph = document.getElementsByClassName("storyParagraph")[0];

	storyParagraph.innerHTML = "";
}

/**
 *  Updates the HTML Page with the number of this scene
 */
function updateSceneNumber(sceneNumber) {
	let sceneNum = document.getElementById("sceneNumber");
	sceneNum.innerText = sceneNumber;
}

/**
 *  Updates the HTML Page with the total number of scenes
 */
function updateSceneTotal(sceneTotal) {
	let scenes = document.getElementById("sceneTotal");
	scenes.innerText = sceneTotal;
}

/*https://www.w3schools.com/howto/howto_js_progressbar.asp*/
/**
 * Function to animate a progress bar to show user how long is left
 * for this scene
 */
function progress(barTime) {
	let running = false;
	if (!running) {
		running = true;
		let progressBar = document.getElementById("progressBar");
		let width = 1;
		let id = setInterval(frame, barTime/100);
		
		function frame() {
			if(getStatus() == "Restarting") {
				width = 1;
				setStatus("");
				console.log("ProgressBar:Restarting::  ");
				console.log("isPaused() ::  ", isPaused());
			} else  if(width >= 100) {
				clearInterval(id);
				running = false;
			} else {
					console.log("Running Progress bar")
				if(!isPaused()) {
					width++;
					progressBar.style.width = width + "%";
				}
			}
		}
	}
} 

/**
 * Function to pause the current scene
 */
function pauseScene() {
	console.log("Attempting to pause the current scene");
	let sceneNumber = parseInt(document.getElementById("sceneNumber").textContent);
	console.log("sceneNumber :  ", sceneNumber);
	let currentScene = sceneNumber - 1;	// Since arrays are zero-based
	console.log("currentScene :  ", currentScene);
	
	console.log("Timer");
	console.log(timer);
	console.log("Current Timer");
	console.log(timer[currentScene]);
	
	//timer[currentScene].pause();
	//timer[currentScene].clear();
	//clearTimeout(timer[currentScene]);
	console.log("Scenes to pause :  ", timer.length);
	for(let i = 0; i < timer.length; i++) {
		console.log("Clearing timeout :  ", i);
		clearTimeout(timer[i]);
	}
}

var c = 0;
var t;
var timer_is_on = false;
//var currentScene = 0;
var scenes;
var scenesSetUp = false;
//var pictureContainer;

function setUpScenes() {
	
	let sceneOnePic = "assets/images/spinning-pandemic-globe-large.gif";

	let sceneOneText = ["This story is about pandemics and the Coronavirus.  ",
		"A pandemic is when many people in a large area become sick.  ",
		"A pandemic is usually caused by a new virus."];

	/* https://www.delftstack.com/howto/javascript/play-audio-javascript/ */
	let sceneOneAudio = new Audio("assets/audio/scene1.mp3");

	let sceneTwoText = ["The Coronavirus is a virus that is spreading fast and causing a worldwide pandemic now.<br><br>",
		"Viruses are so small that it takes an electron microscope to see them.  ",
		"People can't see if a virus is near them."];

	let sceneTwoPic = "assets/images/grumpy-spike.gif";

	let sceneTwoAudio = new Audio("assets/audio/scene2.mp3");

	let sceneThreePic = "assets/images/light-bulb.gif";

	let sceneThreeText = ["People are smart.  ",
		"Even though they can't see the Coronavirus, they know what to do.  ",
		"They use healthy habits and work together to make it harder for the Coronavirus to spread.  ",
		"This helps to keep people healthy during the pandemic."];

	let sceneThreeAudio = new Audio("assets/audio/scene3.mp3");

	let sceneFourPic = "assets/images/wash-hands.gif";

	let sceneFourText = ["People wash their hands really well and often during a pandemic.  ",
		"Adults make sure kids know how to wash their hands well.  ",
		"And, adults remind kids to wash their hands a lot."];

	let sceneFourAudio = new Audio("assets/audio/scene4.mp3");

	let sceneOne = [sceneOnePic, sceneOneText, sceneOneAudio];

	let sceneTwo = [sceneTwoPic, sceneTwoText, sceneTwoAudio];

	let sceneThree = [sceneThreePic, sceneThreeText, sceneThreeAudio];

	let sceneFour = [sceneFourPic, sceneFourText, sceneFourAudio];

	scenes = [sceneOne, sceneTwo, sceneThree, sceneFour];
	scenesSetUp = true;
}

/*https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_win_settimeout_cleartimeout2*/
function timedAnimation(scene) {
	let pictureContainer = document.getElementsByClassName("storyPicture")[0];
	let sceneTime = getSceneTime();
	let picture = scenes[scene][0];
	let text = scenes[scene][1];
	let audio = scenes[scene][2];

	if(scene === 0) {
		/* Display the total number of scenes */
		updateSceneTotal(scenes.length);
	}
	
	/** https://www.w3schools.com/js/tryit.asp?filename=tryjs_timing2 */
	/** https://www.programiz.com/javascript/examples/pass-parameter-setTimeout */
	showScene(pictureContainer, picture, text, audio, scene + 1);
	if(scene < 9) {
		t = setTimeout(timedAnimation, sceneTime, ++scene);
	} else {
		stopAnimation();
	}
}

function getSceneTime() {
	let sceneText = document.getElementById("sceneTime").innerText;
	let sceneTime = parseInt(sceneText);
	/* If the progress bar is not at 1%
	 * this means the scene has been paused midway through
	 * Since the progress bar goes from 1% to 100%
	 * We can use this to calculate the remaining time for this scenario
	 */
	let progressBar = document.getElementById("progressBar");
	let progress = progressBar.style.width;	// E.G. 24%
	/* Remove the '%' last character */
	progress = removeLastCharacter(progress);
	/* Convert to a number */
	progress = parseInt(progress);
	//console.log("getSceneTime()::  ", sceneTime);
	//console.log("getSceneTime():: progress bar width :  ", progress);
	/* Progress bar is not at the start or the end, i.e. midway during the scene */
	if(!isNaN(progress) && progress < 99) {
		sceneTime = calculateRemainingTime(sceneTime, progress);
	} 
	return sceneTime;
}

function playAnimation() {
	console.log("Start Animation");
	let paused = isPaused();
	
	console.log("Starting");
	if(!scenesSetUp || scenes.length === 0) {
		setUpScenes();
	}
	
	let scene = getCurrentIndex();
	if (!timer_is_on) {
		timer_is_on = true;
		timedAnimation(scene);
	}
	
	/* Hide Play button & show Pause button*/
	let pauseButton = document.getElementById("pauseButton");
	hideAllButtons(); 
	showButton(pauseButton);
}

function stopAnimation() {
	console.log("Stopping");
	/*Pauses all scenes after this one*/
	clearTimeout(t);
	timer_is_on = false;
	pauseRunningScene(getCurrentIndex());
}

function getCurrentIndex() {
	let sceneNumber = parseInt(document.getElementById("sceneNumber").textContent);
	if(sceneNumber === 0) {
		sceneNumber++;
	}
	return --sceneNumber; 
}

function pauseRunningScene() {
	let audio = scenes[getCurrentIndex()][2];
	audio.pause();
	typed.stop();
	
	showAllButtons();
	let pauseButton = document.getElementById("pauseButton");
	hideButton(pauseButton);
	
	/* Cannot rewind the first scene - use restart instead
	 First scene has index of 0*/
	if(getCurrentIndex() === 0) {
		let rewindButton = document.getElementById("rewindButton");
		hideButton(rewindButton);
	}
	
}

function restartAnimation() {
	console.log("Restarting");
	setStatus("Restarting");
	resetTyping();
	resetCurrentScene(1);
	resetAudio();
	resetProgressBar();
	playAnimation();
	hideAllButtons();
	let pauseButton = document.getElementById("pauseButton");
	showButton(pauseButton);
	//timerCount(0);
}

function rewindAnimation() {
	console.log("Rewinding");
	resetTyping();
	/*Change the scene number on the page to current scene number -1
	Since the current Index is one less than the current scene number
	we will use currentIndex instead.
	The 'playAnimation' function uses the current scene number on the page
	to determine where to play from.*/
	resetCurrentScene(getCurrentIndex());
	resetAudio();
	resetProgressBar();
	playAnimation();
	hideAllButtons();
	let pauseButton = document.getElementById("pauseButton");
	showButton(pauseButton);
}

function fastForwardAnimation() {
	console.log("Fast Forwarding");
	//playAnimation();
}


function hideButton(button) {
	/* Hide the button */
	/*https://www.w3schools.com/howto/howto_js_add_class.asp*/
	button.classList.add("invisible");
}

function showButton(button) {
	/* Show the button*/
	/*https://www.w3schools.com/howto/howto_js_remove_class.asp*/
	button.classList.remove("invisible");	
}

function showAllButtons() {
	let buttons = document.getElementsByTagName("button");
	
	for(button of buttons) {
		/* Show the button*/
		/*https://www.w3schools.com/howto/howto_js_remove_class.asp*/
		button.classList.remove("invisible");	
	}
}

function hideAllButtons() {
	let buttons = document.getElementsByTagName("button");
	
	for(button of buttons) {
		/* Hide the button*/
		/*https://www.w3schools.com/howto/howto_js_add_class.asp*/
		button.classList.add("invisible");	
	}
}

function isButtonVisible(button) {
	/*https://blog.learnjavascript.online/posts/javascript-has-class/*/
	return !button.classList.contains("invisible");
}

/**
 * If the 'Restart' button is visible when the user
 * clicked the 'Play' button
 * then the Animation had been paused
 */
function isPaused() {
	let restartButton = document.getElementById("restartButton");
	
	return isButtonVisible(restartButton);
}

/**
 * Manipulate a String to remove the last character
 */
function removeLastCharacter(fullString) {
/*https://herewecode.io/blog/remove-last-character-string-javascript/*/
	return fullString.slice(0, -1);	
}

/**
 * Calculate the remaining time for a scene
 * Based on overall time (ms) and the percentage already played
 */
function calculateRemainingTime(sceneTime, playedPercentage) {
	/*E.G. sceneTime = 25000ms (25 seconds)
	     playedPercentage = 24
		playedTime = 25000 * 24/100 = 6,000 (Scene has been playing for 6 seconds)
		remainingTime = 25000 - 6000 = 19000 (19 seconds left to play)*/
	let playedTime = sceneTime * playedPercentage / 100;
	let remainingTime = sceneTime - playedTime;
	return remainingTime;
}

function resetProgressBar() {
	let progressBar = document.getElementById("progressBar");
	progressBar.style.width = "1%";
}

function resetAudio() {
	/*https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/currentTime*/
	/*Reset the audio to the beginning*/
	for(let i = 0; i < scenes.length; i++) {
		let audio = scenes[i][2];
		audio.currentTime = 0;
	}
}

function resetCurrentScene(sceneNumber) {
	let currentScene = document.getElementById("sceneNumber");
	currentScene.innerText = sceneNumber;
	
}

function resetTyping() {
	clearParagraph();
	typed.reset();
}

function setStatus(newStatus) {
	let status = document.getElementById("status");
	status.innerText = newStatus;
}

function getStatus() {
	let status = document.getElementById("status");
	return status.innerText;
}
