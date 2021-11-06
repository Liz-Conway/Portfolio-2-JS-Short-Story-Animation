/*I could not find any way around using global variables
since these variables need to be accessed by multiple functions*/
//var currentScene = 0;
var timer = [];

function playAnimation() {
	let pictureContainer = document.getElementsByClassName("storyPicture")[0];

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

	let scenes = [sceneOne, sceneTwo, sceneThree, sceneFour];

	showScenes(scenes, pictureContainer);

}

function showScenes(scenes, pictureContainer) {
	let sceneTime = 25000;

	for (let i = 0; i < scenes.length; i++) {
		let time = sceneTime * i;
		let picture = scenes[i][0];
		let text = scenes[i][1];
		let audio = scenes[i][2];

		if (i === 0) {
			time = 0;	// Play first scene immediately
			/* Display the total number of scenes */
			updateSceneTotal(scenes.length);
		}
		/** https://www.w3schools.com/js/tryit.asp?filename=tryjs_timing2 */
		/** https://www.programiz.com/javascript/examples/pass-parameter-setTimeout */
		timer[i] = setTimeout(showScene, time, pictureContainer, picture, text, audio, i + 1, sceneTime);
		
		//timer[i] = new Timer(showScene, time, pictureContainer, picture, text, audio, i + 1, sceneTime);

	}
}

/*https://stackoverflow.com/questions/3969475/javascript-pause-settimeout*/
function Timer(callback, delay) {
    var args = arguments,
        self = this,
        timer, start;

    this.clear = function () {
        console.log("In Timer::clear function");
		console.log("timer to clear :  ", timer);
		console.log("this object :  ", this);
		console.log("self object :  ", self);
		console.log("start object : ", start);
		console.log("this === self : ", this === self);
		clearTimeout(self);
    };

    this.pause = function () {
        console.log("In Timer::pause function");
		this.clear();
        delay -= new Date() - start;
    };

    this.resume = function () {
        start = new Date();
        timer = setTimeout(function () {
            callback.apply(self, Array.prototype.slice.call(args, 2, args.length));
        }, delay);
    };

    this.resume();
}

function showScene(pictureImage, picture, sentences, audio, sceneNumber, sceneTime) {
	/*Set the currentScene number*/
	//currentScene = sceneNumber - 1;
	
	/* Display the number of this scene */
	updateSceneNumber(sceneNumber);
	
	/*Start running the progress bar*/
	progress(sceneTime);

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
	if(isPaused()) {
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
	let i = 0;
	if (i == 0) {
		i = 1;
		let elem = document.getElementById("progressBar");
		let width = 1;
		let id = setInterval(frame, barTime/100);
		
		function frame() {
			if (width >= 100) {
				clearInterval(id);
				i = 0;
			} else {
				width++;
				elem.style.width = width + "%";
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

/*https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_win_settimeout_cleartimeout2*/
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

function timedCount(scene) {
	let pictureContainer = document.getElementsByClassName("storyPicture")[0];
	//document.getElementById("sceneTotal").innerText = scene;
	//currentScene = scene;
	let sceneTime = 25000;
	//let time = sceneTime * scene;
	let time = sceneTime;
	let picture = scenes[scene][0];
	let text = scenes[scene][1];
	let audio = scenes[scene][2];

	if(scene === 0) {
		//time = 0;	// Play first scene immediately
		/* Display the total number of scenes */
		updateSceneTotal(scenes.length);
	}
	/** https://www.w3schools.com/js/tryit.asp?filename=tryjs_timing2 */
	/** https://www.programiz.com/javascript/examples/pass-parameter-setTimeout */
	//timer[i] = setTimeout(showScene, time, pictureContainer, picture, text, audio, i + 1, sceneTime);
	showScene(pictureContainer, picture, text, audio, scene + 1, sceneTime);
	if(scene < 9) {
		t = setTimeout(timedCount, time, ++scene);
	} else {
		stopCount();
	}
}

function startCount() {
	let paused = isPaused();
	
	console.log("Starting");
	if(!scenesSetUp || scenes.length === 0) {
		setUpScenes();
	}
	
	let scene = getCurrentScene();
	if (!timer_is_on) {
		timer_is_on = true;
		timedCount(scene);
	}
	
	/* Hide Play button & show Pause button*/
	let pauseButton = document.getElementById("pauseButton");
	hideAllButtons(); 
	showButton(pauseButton);
}

function stopCount() {
	console.log("Stopping");
	/*Pauses all scenes after this one*/
	clearTimeout(t);
	timer_is_on = false;
	pauseRunningScene(getCurrentScene());
}

function getCurrentScene() {
	let sceneNumber = parseInt(document.getElementById("sceneNumber").textContent);
	if(sceneNumber === 0) {
		sceneNumber++;
	}
	return --sceneNumber; 
}

function pauseRunningScene() {
	console.log("Scene Number :  ", getCurrentScene());
	let audio = scenes[getCurrentScene()][2];
	console.log("Pausing audio");
	audio.pause();
	console.log("Audio now paused");
	console.log("Attempting to pause typing");
	typed.stop();
	console.log("Typing is paused?");
	
	showAllButtons();
	let pauseButton = document.getElementById("pauseButton");
	console.log("Text of pauseButton :  ", pauseButton.innerText);
	hideButton(pauseButton);
}

function restartCount() {
	console.log("Restarting");
	pausedScene = 0;
	startCount();
}

function rewindCount() {
	console.log("Rewinding");
	currentScene--;
	//startCount();
}

function fastForwardCount() {
	console.log("Fast Forwarding");
	currentScene++;
	//startCount();
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
 * If the 'Rewind' button is visible when the user
 * clicked the 'Play' button
 * then the Animation had been paused
 */
function isPaused() {
	let rewindButton = document.getElementById("rewindButton");
	
	return isButtonVisible(rewindButton);
}
