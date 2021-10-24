function playAnimation() {
	let pictureImage = document.getElementsByClassName("storyPicture")[0];
	let textParagraphs = document.getElementsByTagName("p");
	console.log(textParagraphs);
	console.log("First:  ", textParagraphs[0]);
	console.log("TEXT:  ", textParagraphs[0].innerHTML);
	
	pictureImage.src = "assets/images/spinning-pandemic-globe-large.gif";
	
	let sceneOneText = ["This story is about pandemics and the Coronavirus.", 
						"A pandemic is where many people in a large area become sick.", 
						"A pandemic is usually caused by a virus."];
	
	for(let i = 0; i < sceneOneText.length; i++) {
		console.log(textParagraphs);
		textParagraphs[i].innerHTML = sceneOneText[i];
	}
}

