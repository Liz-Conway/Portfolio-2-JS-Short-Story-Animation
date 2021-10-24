function playAnimation() {
	let pictureImage = document.getElementsByClassName("storyPicture")[0];
	
	pictureImage.src = "assets/images/spinning-pandemic-globe-large.gif";
	
	let sceneOneText = ["This story is about pandemics and the Coronavirus.", 
						"A pandemic is where many people in a large area become sick.", 
						"A pandemic is usually caused by a virus."];
						
	/* typed.js allows you to pause a sentence
		by inserting a '^' symbol followed by the number of milliseconds to pause
		E.G. ^500 pauses the typing for a half a second (500ms)
		 */
	let sentencePause = "^1000";
	let sceneOneParagraph = "This story is about pandemics and the Coronavirus.  ";
	sceneOneParagraph += sentencePause;
	sceneOneParagraph += "A pandemic is where many people in a large area become sick.  ";
	sceneOneParagraph += sentencePause;
	sceneOneParagraph += "A pandemic is usually caused by a virus.";
	
	clearParagraph();
	typeParagraph(sceneOneParagraph);
	
	/** https://www.w3schools.com/js/tryit.asp?filename=tryjs_timing2 */
	/** https://www.programiz.com/javascript/examples/pass-parameter-setTimeout */
	setTimeout(showSceneTwo, 30000, pictureImage, sentencePause);
	
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