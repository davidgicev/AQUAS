function iterate() {

	var canvas = document.getElementById('ocean');
	var ctx = canvas.getContext('2d');

	if(animate)
		ctx.clearRect(0,0,windowWidth,windowHeight)

	if(fish.length > 0.5*food.length)
		food.push(new Food())


	if(fish.length == 0 && sharks.length == 0) {

			prepreki = [];

			IDnumFish = 0;
			IDnumSharks = 0;

			brnagen++;
			console.log("Generacija "+brnagen)
			document.getElementById("generation").innerHTML = "Generation #"+(brnagen);

			for(var i=20; i>=0; i--) {
				for(var j=0; j<10; j++)
					fish.push(new Fish(deadFish[20-i]))
			}

			for(var i=3; i>0; i--) {
				for(var j=0; j<2; j++)
					sharks.push(new Shark(deadSharks[3-i]))
			}

			deadFish = [];
			deadSharks = [];

			console.log("Generacijata pochna so "+fish.length+" ribi")
			console.log("Generacijata pochna so "+sharks.length+" ajkuli")
	}

	

	for(var i=0; i<fish.length; i++) {
		fish[i].move();
	}
	for(var i=0; i<sharks.length; i++) {
		sharks[i].move();
	}


	if(animate) {
		for (var i = 0; i < food.length; i++) {
			ctx.fillStyle = "rgba(0,51,0,0.8)";
			ctx.fillRect(food[i].x, food[i].y, 5/scalingFactor, 5/scalingFactor)
		}
		for (var i = 0; i < prepreki.length; i++) {

			ctx.beginPath();
			ctx.arc(prepreki[i].x, prepreki[i].y, 40, 0, 2 * Math.PI);
			ctx.fillStyle = "black";
			ctx.fill()
		}

		document.getElementById("numberOfFish").innerHTML = fish.length;
		document.getElementById("numberOfSharks").innerHTML = sharks.length;
		document.getElementById("numberOfPlankton").innerHTML = food.length;
		updateStats()
		if(selectedObj.object) {
			var object = selectedObj.object;
			var isFish = selectedObj.isFish;

			if(object.health < 0) {
				selectedObj = 0;
				document.getElementById("center").style.display = "none";
			}

			if(isFish) {
				input = 10;
				document.getElementById("infoHealth").innerHTML = object.health.toFixed(2);
			}
			else {
				input = 10;
				document.getElementById("infoHealth").innerHTML = object.health.toFixed(2);
			}
		}

	}

}
