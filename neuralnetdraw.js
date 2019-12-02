function drawNN (event) {

	var x = event.clientX;
	var y = event.clientY + window.pageYOffset;
	document.getElementById("center").style.display = "block";

	ctx = document.getElementById("display").getContext("2d");
	ctx.clearRect(0,0, 500, 400);
	var minimumdist = 10000;
	var minIndex = 0;
	var distance;
	var isFish = true;

	for(var i=0; i<fish.length; i++) {
		distance = Math.sqrt(Math.pow(fish[i].x - x, 2) + Math.pow(fish[i].y - y, 2))
		if(distance < minimumdist) {
			minIndex = i;
			minimumdist = distance;
		}
	}

	for(var i=0; i<sharks.length; i++) {
		distance = Math.sqrt(Math.pow(sharks[i].x - x, 2) + Math.pow(sharks[i].y - y, 2))
		if(distance < minimumdist) {
			minIndex = i;
			minimumdist = distance;
			isFish = false;
		}
	}

	var object, input;
	selectedObj = {
		object: 0,
		isFish: isFish
	}

	if(isFish) {
		object = fish[minIndex]
		selectedObj.object = object;
		document.getElementById("infoType").innerHTML = "Fish";
	}
	else {
		object = sharks[minIndex]
		selectedObj.object = object;
		document.getElementById("infoType").innerHTML = "Shark";
	}


	document.getElementById("infoHealth").innerHTML = object.health.toFixed(2);
	document.getElementById("infoID").innerHTML = object.id;
	document.getElementById("infoColor").style.backgroundColor = object.dna.color;
	document.getElementById("infoMutationsConn").innerHTML = object.dna.mutationsConn;

	var brain = object.dna.brain;
	console.log(object.dna)

	var paddingLayers = 100, paddingNeurons = 15, radius = 10, paddingTop = 50;

	var width = Math.max((brain.length-1)*paddingLayers+2*radius+100, 500), height = (maxNeurons(brain)-1)*paddingNeurons+maxNeurons(brain)*2*radius+100;
	var paddingSides = (width-((brain.length)*paddingLayers))/2;

	document.getElementById("display").width = width;
	document.getElementById("display").height = height;

	document.getElementById("historyContainer").style.top = (height-150) + "px";



	for(var i=0; i<brain.length; i++) {

		for(var sloj=0; sloj<brain[i].length; sloj++) {
			for(var nevron = 0; nevron<brain[i][sloj].length; nevron++) {
				ctx.beginPath();
				paddingTop = (height - (brain[i].length*radius*2 + (brain[i].length-1)*paddingNeurons))/2;
				ctx.moveTo(paddingSides+i*paddingLayers, paddingTop + radius + sloj*(2*radius + paddingNeurons))
				paddingTop = (height - (brain[i][0].length*radius*2 + (brain[i][0].length-1)*paddingNeurons))/2;
				ctx.lineTo(paddingSides+(i+1)*paddingLayers, paddingTop + radius + nevron*(2*radius + paddingNeurons))
				ctx.strokeStyle = "rgb(" + Math.max(-255*brain[i][sloj][nevron], 0) + ", 0, " + Math.max(255*brain[i][sloj][nevron], 0) + ")";
				ctx.lineWidth = 1;
				ctx.stroke();
			}
			ctx.beginPath();
			ctx.fillStyle = "black";
			paddingTop = (height - (brain[i].length*radius*2 + (brain[i].length-1)*paddingNeurons))/2;
			ctx.arc(paddingSides+i*paddingLayers, paddingTop+radius+sloj*(radius*2+paddingNeurons), radius, 0, 2 * Math.PI);
			ctx.lineWidth = 1
			ctx.fill()
			ctx.strokeStyle="white"
			ctx.stroke()
		}

		if(i == brain.length - 1) {
			for(var nevron = 0; nevron<2; nevron++) {
				ctx.beginPath();
				paddingTop = (height - (4*radius + 1*paddingNeurons))/2;
				ctx.arc(paddingSides+(i+1)*paddingLayers, paddingTop+radius+nevron*(radius*2+paddingNeurons), radius, 0, 2 * Math.PI);
				ctx.lineWidth = 1
				ctx.fill()
				ctx.strokeStyle="white"
				ctx.stroke()
			}
		}
	}
}

function maxNeurons(brain) {
	max = 10;
	for(var i=0; i<brain.length; i++) {
		if(max < brain[i][0].length) {
			max = brain[i][0].length;
		}
	}
	return max;
}