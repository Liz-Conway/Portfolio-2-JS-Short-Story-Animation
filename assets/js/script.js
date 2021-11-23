/*I could not find any way around using global variables
since these variables need to be accessed by multiple functions*/
var typed;	// For typed.js, used in writing out phrases character by character
var t;			// Current timed animation
var timer_is_on = false;
var scenes;		// Array holding all the scenes data
var scenesSetUp = false;

/*
 * Only let the user play the animation once the DOM has finished loading
 * Wait for the DOM to finish loading
*/
document.addEventListener("DOMContentLoaded", pageLoaded());

/**
 * This function is called only when the page has fully loaded the DOM content
 */
function pageLoaded() {
	/* Create the arrays with the information for each scene
	 * text, audio and image */
	setUpScenes();
	
	/* Get references to each of the buttons */
	let playButton = document.getElementById("playButton");
	let pauseButton = document.getElementById("pauseButton");
	let restartButton = document.getElementById("restartButton");
	let rewindButton = document.getElementById("rewindButton");
	let fastForwardButton = document.getElementById("fastForwardButton");
	
	/* Initially the only option is to play the animation */
	showElement(playButton);
	
	/* Set the function to be called when the speaker image is clicked */
	let speakerImage = document.getElementById("speaker");
	speakerImage.addEventListener("click", toggleMute);
	/* Don't forget about keyboard users */
	speakerImage.addEventListener("keydown", toggleMute);
	
	/* Set event listeners for all the buttons
	 * When the button is clicked this function will be called.
	 */
	playButton.addEventListener("click", playAnimation);
	pauseButton.addEventListener("click", stopAnimation);
	restartButton.addEventListener("click", restartAnimation);
	rewindButton.addEventListener("click", rewindAnimation);
	fastForwardButton.addEventListener("click", fastForwardAnimation);
	
	/* Add tooltip to each button */
	setTitle(playButton, "Click to play the animation");
	setTitle(pauseButton, "After pausing you can restart, rewind, fast forward or continue playing");
	setTitle(restartButton, "Restarts the animation from the 1st scene");
	setTitle(rewindButton, "Plays the animation from the last scene");
	setTitle(fastForwardButton, "Start playing at the next scene");
	setTitle(speakerImage, "Click to mute/unmute the sound");
}

/**
 * If sound is unmuted then mute the sound
 * If sound is already muted then unmute it
 */
function toggleMute(event) {
	const allowableEvents = ["click", "keydown"];
	/* Only respond to click or keydown events */
	if(!allowableEvents.includes(event.type)) {
		return;
	}
	/* Check that the key pressed was 'Enter' or 'Space
	 * otherwise do nothing */
	if(event.type === "keydown") {
		if(event.key !== "Enter" && event.key !== " ") {
			return;
		}
	}
	
	/* Get references to speaker and muted images */
	let soundImage = "assets/images/speaker.png";
	let mutedImage = "assets/images/speaker-muted.png";
	
	/* 'this' refers to the speakerImage element */
	let image = this.getAttribute("src");
	if(image === soundImage) {
		/* Speaker image so we must mute the sound, 
			then change to the muted image */
		for(let scene of scenes) {
			/* Audio is stored in scene[2] */
			/*https://www.developphp.com/video/JavaScript/Audio-Play-Pause-Mute-Buttons-Tutorial*/
			scene[2].muted = true;
		}
		
		this.setAttribute('src', mutedImage);
	} else {
		/* Sound is already muted, so unmute it
			then change to the unmuted image */
		for(let scene of scenes) {
			/* Audio is stored in scene[2] */
			/*https://www.developphp.com/video/JavaScript/Audio-Play-Pause-Mute-Buttons-Tutorial*/
			scene[2].muted = false;
		}
		
		this.setAttribute('src', soundImage);
	}
}

/**
 * This function shows the animation scene
 * showing the picture, text, audio and scene number passed in
 */
function showScene(picture, sentences, audio, sceneNumber) {
	/* Get reference to the main image on the page */
	let pictureImage = document.getElementById("storyPicture");
	/* Set the image on the screen to the picture passed into this function */
	pictureImage.src = picture;

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

	let sceneParagraph = "";

	/* Build the sentence to be displayed */
	for (let i = 0; i < sentences.length; i++) {
		sceneParagraph += i === 0 ? "" : sentencePause;
		sceneParagraph += sentences[i];
	}

	/* Clear any existing text */
	clearParagraph();
	/* Display the text character by character */
	typeParagraph(sceneParagraph);
	/* Play the audio */
	audio.play();
	
	/* Get a reference to the container that wraps the main image */
	let picContainer = document.getElementsByClassName("storyPicContainer")[0];
	/* Scene number 7 has a background picture
	 * - only add this if scene is 7
	 */
	if(sceneNumber === 7) {
		/*https://www.developphp.com/video/JavaScript/Audio-Play-Pause-Mute-Buttons-Tutorial*/
		picContainer.style.background = "url(assets/images/holidays.gif) no-repeat center";
		picContainer.style.backgroundSize = "cover";
	}
	/* Reset the background image for other scenes */
	if(sceneNumber === 1 || sceneNumber === 6 || sceneNumber === 8) {
		/* 1 = User Restarted the animation
		 * 6 = User Rewound to the previous scene
		 * 8 = Normal Play or user Fast Forwarded the animation
		 */
		if(picContainer.style.backgroundImage !== "") {
			picContainer.style.backgroundImage = "";
		}
	}
}

/** 
 * Use typed.js to type out the passed in text
 */
function typeParagraph(text) {
	/* Retrieve the status of the animation */
	let status = getStatus();
	
	/* If the animation was paused and is not restarting
	 * then resume the typing */
	if(isPaused() && status !== "Restarting") {
		typed.start();
	} else {		// Animation playing normally, or restarting
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

/** 
 * Clears the text in the storyParagraph
 * Otherwise the typing for the next scene will not work
 */
function clearParagraph() {
	if(typed !== undefined) {
		typed.reset(false);
	}
	/* Get reference to the paragraph where the story is being typed out */
	let storyParagraphs = document.getElementsByClassName("storyParagraph");
	
	/* Set the text in the paragraph to an empty string */
	for(let paragraph of storyParagraphs) {
		paragraph.innerText = "";
	}
}

/**
 *  Updates the HTML Page with the number of this scene
 */
function updateSceneNumber(sceneNumber) {
	/* Get reference to the sceneNumber span element */
	let sceneNum = document.getElementById("sceneNumber");
	/* Set the text of the sceneNumber span element to the passed in number */
	sceneNum.innerText = sceneNumber;
}

/**
 *  Updates the HTML Page with the total number of scenes
 */
function updateSceneTotal(sceneTotal) {
	/* Get reference to the sceneTotal span element */
	let scenes = document.getElementById("sceneTotal");
	/* Set the text of the sceneTotal span element to the passed in number */
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
		/* Get reference to the progressBar div element */
		let progressBar = document.getElementById("progressBar");
		/* Progress bar starts at width of 1% */
		let width = 1;
		let id = setInterval(frame, barTime/100);
		
		/* JSHint complains about this function
		 * but it is as I copied from W3 Schools */
		function frame() {
			/* When restarting need to reset the width of the progress bar */
			if(getStatus() === "Restarting") {
				width = 1;
				setStatus("");
			}
			
			/* If the scene is finished */
			if(width >= 100) {
				clearInterval(id);
				running = false;
			} else {		// The scene is still running
				if(!isPaused()) {
					/* Increase the width to move the progress bar on */
					width++;
					/* Set the progress bar to the new width */
					progressBar.style.width = width + "%";
				}
			}
		}
	}
} 

/**
 * Create the data for all scenes
 * Each scene consists of a picture, text and an audio file
 */
function setUpScenes() {
	
	/* Create individual pictures, texts and audios*/
	
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

	let sceneFivePic = "assets/images/keep-distance.gif";

	let sceneFiveText = ["The Coronavirus has been traveling fast from one person to another.  ",
		"If many people are close together in the same place, that makes it easier for a virus to spread.  ",
		"More people become sick faster."];

	let sceneFiveAudio = new Audio("assets/audio/scene5.mp3");

	let sceneSixPic = "assets/images/schools-closed.gif";

	let sceneSixText = ["Sometimes schools close during a pandemic.  ",
		"That way, children are farther apart from one another and it’s harder for a virus to spread."];

	let sceneSixAudio = new Audio("assets/audio/scene6.mp3");

	let sceneSevenPic = "assets/images/changing-calendar.gif";

	let sceneSevenText = ["A pandemic can cause people to reschedule their vacation plans.  ",
		"This is because vacations are often in fun and crowded places.  ",
		"People try to avoid crowds in a pandemic.  ",
		"They may re-schedule their trip."];

	let sceneSevenAudio = new Audio("assets/audio/scene7.mp3");

	let sceneEightPic = "assets/images/parents-child.gif";

	let sceneEightText = ["My parents are learning more about the Coronavirus every day.  ",
		"They watch the news and look for information.  ",
		"They are watching out for me, too.  ",
		"If I have questions, they can help."];

	let sceneEightAudio = new Audio("assets/audio/scene8.mp3");

	let sceneNinePic = "assets/images/belting-covid.gif";

	let sceneNineText = ["It’s good to know that pandemics don’t happen very often.  ",
		"They occur about once every twenty-five or thirty years, or about three times every one hundred years.  ",
		"It’s also helpful to remember that the Coronavirus pandemic will end; probably not by tomorrow morning, but it will end."];

	let sceneNineAudio = new Audio("assets/audio/scene9.mp3");

	/* Combine individual elements for each scene into an array */
	let sceneOne = [sceneOnePic, sceneOneText, sceneOneAudio];

	let sceneTwo = [sceneTwoPic, sceneTwoText, sceneTwoAudio];

	let sceneThree = [sceneThreePic, sceneThreeText, sceneThreeAudio];

	let sceneFour = [sceneFourPic, sceneFourText, sceneFourAudio];

	let sceneFive = [sceneFivePic, sceneFiveText, sceneFiveAudio];

	let sceneSix = [sceneSixPic, sceneSixText, sceneSixAudio];

	let sceneSeven = [sceneSevenPic, sceneSevenText, sceneSevenAudio];

	let sceneEight = [sceneEightPic, sceneEightText, sceneEightAudio];
	
	let sceneNine = [sceneNinePic, sceneNineText, sceneNineAudio];

	/* Combine all individual scenes together in one array */
	scenes = [sceneOne, sceneTwo, sceneThree, sceneFour, sceneFive, sceneSix, sceneSeven, sceneEight, sceneNine];
	
	/* Set a flag indicating that the scenes have been set up */
	scenesSetUp = true;
}

/*https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_win_settimeout_cleartimeout2*/
/**
 * Function to :
 * 1.  Display all elements for a particular scene
 * 2.  Wait a specified interval then Call itself again for the next scene
 */
function timedAnimation(scene) {
	/* Get the duration to play a scene for */
	let sceneTime = getSceneTime();
	/* Get the reference to this scenes picture */
	let picture = scenes[scene][0];
	/* Get the reference to this scenes text */
	let text = scenes[scene][1];
	/* Get the reference to this scenes audio */
	let audio = scenes[scene][2];

	/* Initial setup - should only be done once */
	if(scene === 0) {
		/* Display the total number of scenes */
		updateSceneTotal(scenes.length);
		/* Get a reference to the speaker image */
		let speakerImage = document.getElementById("speaker");
		/* ... and show it */
		showElement(speakerImage);
	}
	
	/* Call the function that displays the scene */
	showScene(picture, text, audio, scene + 1);
	
	/* If there are more scenes */
	if(scene < scenes.length -1) {
		/** https://www.w3schools.com/js/tryit.asp?filename=tryjs_timing2 */
		/** https://www.programiz.com/javascript/examples/pass-parameter-setTimeout */
		/* Call this function again after a delay (sceneTime) passing the next scenes number */
		t = setTimeout(timedAnimation, sceneTime, ++scene);
	} else {
		/* No more scenes so stop the animation */
		setTimeout(stopAnimation, sceneTime);
	}
}

/**
 * Retrieve the duration for a scene
 * This duration is stored in a hidden span on the web page
 * If a scene has been paused, we need to run it only for the 
 * remaining time after it had been paused
 * E.G. If the scene duration is 25 seconds but this scene was
 * paused after 15seconds, then we should only run it for another 10 seconds
 */
function getSceneTime() {
	/* Retrieve scene duration from the hidden span */
	let sceneText = document.getElementById("sceneTime").innerText;
	/* Convert it to a number */
	let sceneTime = parseInt(sceneText);
	
	/* If the progress bar is not at 1%
	 * this means the scene has been paused midway through
	 * Since the progress bar goes from 1% to 100%
	 * We can use this to calculate the remaining time for this scenario
	 */
	let progress = getProgressBarWidth();

	/* IF Progress bar is not at the start or the end, 
	 * i.e. midway during the scene */
	if(!isNaN(progress) && progress < 97) {
		/* Scene has been paused during the playback
		 * Calculate the remaining time
		 * Use the remaining time as the duration for this scene */
		let remainingTime = calculateRemainingTime(sceneTime, progress);
		if(remainingTime > 1000) {	// More than one second remaining
			sceneTime = remainingTime; 
		}		 
	}
	return sceneTime;
}

/**
 * If a scene has been paused then the progress bar will be between 1% and 100%
 * Retrieving this width will tell us how much of the scene duration has elapsed
 */
function getProgressBarWidth() {
	/* Get reference to the progress bar div */
	let progressBar = document.getElementById("progressBar");
	/* Get the width, i.e. percentage of the duration that has elapsed */
	let progress = progressBar.style.width;	// E.G. 24%
	/* Remove the '%' last character */
	progress = removeLastCharacter(progress);
	/* Convert to a number */
	progress = parseInt(progress);
	
	return progress;
}

/**
 * Function called when the play button is clicked
 * This function will determine the current scene to run
 * then call the 'timedAmnimation' function passing the scene to run.
 * When playing the play button is hidden and the pause button is shown.
 * When the animation is run for the first time
 * this function will display the "Scene X of Y" element.
 */
function playAnimation() {
	/* Get reference to the "Scene X of Y" element */
	let sceneOfScenes = document.getElementById("sceneOfScenes");
	/* If it is not showing then show the "Scene X of Y" element */
	if(!isElementVisible(sceneOfScenes)) {
		showElement(sceneOfScenes);
	}
	
	/* Get the index of the current scene to run */
	let scene = getCurrentIndex();
	if (!timer_is_on) {
		timer_is_on = true;
		/* Run the timed animation */
		timedAnimation(scene);
	}
	
	/* Hide Play button & show Pause button*/
	let pauseButton = document.getElementById("pauseButton");
	hideAllButtons(); 
	showElement(pauseButton);
}

/**
 * Stops or pauses the animation
 * Called when the pause button is clicked, or the animation ends
 */
function stopAnimation() {
	/*Pauses all scenes after this one*/
	clearTimeout(t);
	timer_is_on = false;
	
	/* If  at the end then only show Restart and Rewind buttons */
	if(animationEnded()) {
		hideAllButtons();
		
		let restart = document.getElementById("restartButton");
		let rewind = document.getElementById("rewindButton");
		showElement(restart);
		showElement(rewind);
	} else {
		/* Animation has been paused by the user */
		pauseRunningScene(getCurrentIndex());
	}
}

/**
 * Function to retrieve the index of the current scene
 * Scene data is stored in an array which starts at index = 0
 * Scene numbers start at 1, hence index is always 1 less than current scene number
 */
function getCurrentIndex() {
	/* Get current scene number */
	let sceneNumber = parseInt(document.getElementById("sceneNumber").textContent);
	
	/* Animation has not started, so scene number is 0
	 * using 0 as scene number would give an index of -1
	 * A negative index number would throw an error
	 * so increase scene number by 1 to give an index of 0
	 * This will play the first scene which is what we want in this situation */
	if(sceneNumber === 0) {
		sceneNumber++;
	}
	return --sceneNumber; 
}

/**
 * Function to pause the currently running scene
 * Pause the audio
 * Pause the typing
 */
function pauseRunningScene(sceneIndex) {
	/* Get reference to the audio for the current scene */
	let audio = scenes[sceneIndex][2];
	/* Pause the audio */
	audio.pause();
	/* Pause the typing */
	typed.stop();
	
	/* Show all buttons except the pause button (since the scene is already paused) */
	showAllButtons();
	let pauseButton = document.getElementById("pauseButton");
	hideElement(pauseButton);
	
	/* Cannot rewind the first scene - so hide the rewind button
	 First scene has index of 0*/
	if(sceneIndex === 0) {
		let rewindButton = document.getElementById("rewindButton");
		hideElement(rewindButton);
	}
	
	/* Cannot fast forward the last scene 
	 * So hide the fast forward button*/
	if(sceneIndex === scenes.length - 1) {
		let fastForwardButton = document.getElementById("fastForwardButton");
		hideElement(fastForwardButton);
	}
	
}

/**
 * Function to determine the end of the animation is reached
 * If on the last scene AND the progress bar is at the end
 */
function animationEnded() {
	let ended = false;
	
	if(getCurrentIndex() === scenes.length -1) {	// Last scene
		let progress = getProgressBarWidth();
		if(progress > 98) {		// Last Scene has ended
			ended = true;
		}
	}
	
	return ended;
}

/**
 * Function called when Restart button clicked
 * Set the status to "Restarting"
 * Reset scene number to 1, audio, typing, progress bar
 * Show only Pause button
 * Play animation
 */
function restartAnimation() {
	/* Set the status to "Restarting" */
	setStatus("Restarting");
	/* Reset scene number to 1, audio, typing, progress bar */
	resetTyping();
	updateSceneNumber(1);
	resetAudio();
	resetProgressBar();
	/* When everything has been reset - play the animation */
	playAnimation();
	
	/* Show only Pause button */
	hideAllButtons();
	let pauseButton = document.getElementById("pauseButton");
	showElement(pauseButton);
}

/**
 * Function called when Rewind button clicked
 * Set the status to "Restarting"
 * Set scene number to the previous scene number 
 * Reset audio, typing, progress bar
 * Show only Pause button
 * Play animation */
function rewindAnimation() {
	/* Set the status to "Restarting" 
	 * This will reset the progress bar */
	setStatus("Restarting");
	resetTyping();

	/*Change the scene number on the page to current scene number -1
	Since the current Index is one less than the current scene number
	we will use currentIndex instead.
	The 'playAnimation' function uses the current scene number on the page
	to determine where to play from.*/
	updateSceneNumber(getCurrentIndex());

	/* Reset audio, typing, progress bar */
	resetAudio();
	resetProgressBar();
	
	/* Play */
	playAnimation();
	
	/* Show only Pause button */
	hideAllButtons();
	let pauseButton = document.getElementById("pauseButton");
	showElement(pauseButton);
}

/**
 * Function called when Fast Forward button clicked
 * Set the status to "Restarting"
 * Set scene number to the next scene number 
 * Reset audio, typing, progress bar
 * Show only Pause button
 * Play animation */

function fastForwardAnimation() {
	/* setStatus("Restarting"); */
	setStatus("Restarting");

	/*Change the scene number on the page to current scene number +1
	Since the currentIndex is one less than the current scene number
	currentIndex +1 gives the current scene number, 
	currentIndex + 2 give the next scene number.
	The 'playAnimation' function uses the current scene number on the page
	to determine where to play from.*/
	updateSceneNumber(getCurrentIndex() + 2);	// Next scene number

	/* Reset audio, typing, progress bar */
	resetTyping();
	resetAudio();
	resetProgressBar();
	
	/* Play */
	playAnimation();
	
	/* Show only Pause button */
	hideAllButtons();
	let pauseButton = document.getElementById("pauseButton");
	showElement(pauseButton);
}

/**
 * Function to hide a specified element
 * Hides the element by giving the class 'invisible'
 */
function hideElement(element) {
	/* Hide the element  */
	/*https://www.w3schools.com/howto/howto_js_add_class.asp*/
	element.classList.add("invisible");
}

/**
 * Function to show a specified element
 * Shows the element by removing the class 'invisible'
 */
function showElement(element) {
	/* Show the element */
	/*https://www.w3schools.com/howto/howto_js_remove_class.asp*/
	element.classList.remove("invisible");	
}

/**
 * Function to show all the buttons on the page
 */
function showAllButtons() {
	/* Get reference to array of buttons */
	let buttons = document.getElementsByTagName("button");
	
	/* Loop through all buttons */
	for(let button of buttons) {
		/* Show the button*/
		/*https://www.w3schools.com/howto/howto_js_remove_class.asp*/
		button.classList.remove("invisible");	
	}
}

/**
 * Function to hide all the buttons on the page
 */
function hideAllButtons() {
	/* Get reference to array of buttons */
	let buttons = document.getElementsByTagName("button");
	
	/* Loop through all buttons */
	for(let button of buttons) {
		/* Hide the button*/
		/*https://www.w3schools.com/howto/howto_js_add_class.asp*/
		button.classList.add("invisible");	
	}
}

/**
 * Function to determine if an element is visible
 * Does this by checking if the element has a class of 'invisible'
 */
function isElementVisible(element) {
	/*https://blog.learnjavascript.online/posts/javascript-has-class/*/
	return !element.classList.contains("invisible");
}

/**
 * Function to determine if the animation is paused
 * If the 'Restart' button is visible when the user
 * clicked the 'Play' button
 * then the Animation had been paused
 */
function isPaused() {
	/* Get reference to restart button */
	let restartButton = document.getElementById("restartButton");
	
	return isElementVisible(restartButton);
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

/**
 * Function to reset the progress bar
 * Does this by resetting its width to 1%
 */
function resetProgressBar() {
	/* Get reference to progress bar */
	let progressBar = document.getElementById("progressBar");
	/* Set its width to 1% */
	progressBar.style.width = "1%";
}

/**
 * Function to reset the audio
 */
function resetAudio() {
	/*https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/currentTime*/
	/*Reset the audio of all scenes to the beginning*/
	for(let i = 0; i < scenes.length; i++) {
		let audio = scenes[i][2];
		/* Reset the audio */
		audio.currentTime = 0;
	}
}

/**
 * Function to reset the typing
 */
function resetTyping() {
	/* clear any text already there */
	/* Reset the typing */
	typed.reset(false);
}

/**
 * Function to set the current status 
 */
function setStatus(newStatus) {
	/* Get reference to the hidden span "status" */
	let status = document.getElementById("status");
	/* Set the status to the passed in status value */
	status.innerText = newStatus;
}

/**
 * Function to retrieve the current status 
 */
function getStatus() {
	/* Get reference to the hidden span "status" */
	let status = document.getElementById("status");
	/* Return the status stored in the hidden status span */
	return status.innerText;
}

/**
 * Set the title attribute of a specified element to a given string
 */
function setTitle(element, title) {
	/* Set the title of the element  */
	/*https://stackoverflow.com/questions/27466969/how-to-add-attribute-to-html-element-using-javascript*/
	element.setAttribute("title", title);
}
