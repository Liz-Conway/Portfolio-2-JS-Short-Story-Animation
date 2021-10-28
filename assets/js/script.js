function playAnimation() {
	let pictureContainer = document.getElementsByClassName("storyPicture")[0];
	
	let sceneOnePic = "assets/images/spinning-pandemic-globe-large.gif";
	
	let sceneOneText = ["This story is about pandemics and the Coronavirus.  ", 
						"A pandemic is where many people in a large area become sick.  ", 
						"A pandemic is usually caused by a virus."];
	
	let sceneTwoText = ["The Coronavirus is a virus that is spreading fast and causing a worldwide pandemic now.<br><br>", 
						"Viruses are so small that it takes an electron microscope to see them.  ", 
						"People can't see if a virus is near them."];
	
	let sceneTwoPic = "assets/images/grumpy-spike.gif";
	
	let sceneOne = [sceneOnePic, sceneOneText];
	
	let sceneTwo = [sceneTwoPic, sceneTwoText];
	
	let scenes = [sceneOne, sceneTwo];
						
	/* typed.js allows you to pause a sentence
		by inserting a '^' symbol followed by the number of milliseconds to pause
		E.G. ^500 pauses the typing for a half a second (500ms)
		 */
	let sentencePause = "^1000";
	
	showScenes(scenes, pictureContainer, sentencePause);
	
	//showScene(pictureImage, sceneOnePic, sceneOneText, sentencePause);
	
	/** https://www.w3schools.com/js/tryit.asp?filename=tryjs_timing2 */
	/** https://www.programiz.com/javascript/examples/pass-parameter-setTimeout */
	//setTimeout(showScene, 30000, pictureImage, sceneTwoPic, sceneTwoText, sentencePause);
	
}

function showScenes(scenes, pictureContainer, sentencePause) {
	let sceneTime = 30000;
	
	for(let i = 0; i < scenes.length; i++) {
		let time = sceneTime * i;
		let picture = scenes[i][0];
		let text = scenes[i][1];
		setTimeout(showScene, time * i, pictureContainer, picture, text, sentencePause);
	}
}

function showScene(pictureImage, picture, sentences, sentencePause) {
	pictureImage.src = picture;
	
	let sceneParagraph = "";
	
	for(let i = 0; i < sentences.length; i++) {
		sceneParagraph += i === 0 ? "": sentencePause;
		sceneParagraph += sentences[i];
		
	}
	
	clearParagraph();
	typeParagraph(sceneParagraph);
	
}

function showSceneTwo(pictureImage, sentencePause) {
	pictureImage.src = "assets/images/grumpy-spike.gif";
	
	let sceneTwoParagraph = "The Coronavirus is a virus that is spreading fast and causing a worldwide pandemic now.\n\n";
	sceneTwoParagraph += sentencePause;
	sceneTwoParagraph += "Viruses are so small that it takes an electron microscope to see them.  ";
	sceneTwoParagraph += sentencePause;
	sceneTwoParagraph += "People can't see if a virus is near them.";
	
	clearParagraph();
	typeParagraph(sceneTwoParagraph);
	
}

/** Use typed.js to type out the entered text */
function typeParagraph($text) {
	/* The first argument is the class of the elment where the text will be typed 
		strings = The text to type
		typeSpeed = how fast the text types
		loop = whether the text is typed once (false), or over and over again (true)
		showCursor = whether to show a typing cursor as text is typed
	*/
	var typed = new Typed('.storyParagraph', {
		strings: [$text],
		typeSpeed: 100,
		loop: false,
		showCursor: false
	});
}

/** Clears the text in the storyParagraph
	Otherwise the typing for the next scene will not work
 */
function clearParagraph() {
	let storyParagraph = document.getElementsByClassName("storyParagraph")[0];
	
	storyParagraph.innerHTML = "";
}