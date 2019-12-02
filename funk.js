function normalize(vector) {
		var dolzhina = Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));
		if(dolzhina == 0)
			return {
				x: 0,
				y: 0,
			}
		vector.x /= dolzhina;
		vector.y /= dolzhina;
		return vector;
	}

function comparePositions(object, targets, threshold) {
	var sum = {
		x: 0,
		y: 0
	} 
	var br = 0;
	for(var i=0; i<targets.length; i++) {
		if(closeEnough(object, targets[i], threshold)) {
			br++;
			sum.x += targets[i].x;
			sum.y += targets[i].y;
		}
	}
	var result;
	if(br == 0) {
		return {
			x: 0,
			y: 0
		}
	}

	else {
		return normalize({
			x: sum.x/br - object.x,
			y: sum.y/br - object.y
		})
	}
}


function compareSpeeds(object, targets, threshold) {
	var sum = {
		x: 0,
		y: 0
	}
	var br = 0;
	for(var i=0; i<targets.length; i++) {
		if(closeEnough(object, targets[i], threshold)) {
			br++;
			sum.x += targets[i].velocity.x;
			sum.y += targets[i].velocity.y;
		}
	}

	var result = {
		x: 0,
		y: 0
	}

	if(br == 0) {
		return result;
	}
	else {
		result = ({
			x: sum.x/br - object.velocity.x,
			y: sum.y/br - object.velocity.y
		})
	}
	return normalize(result);
}

function separate(object, targets, threshold) {
	var sum = {
		x: 0,
		y: 0
	} 
	var br = 0;
	for(var i=0; i<targets.length; i++) {
		if(closeEnough(object, targets[i], threshold)) {
			let distance = Math.sqrt(Math.pow(object.x - targets[i].x, 2) + Math.pow(object.y - targets[i].y, 2));
			br++;
			sum.x += (object.x - targets[i].x)/distance
			sum.y += (object.y - targets[i].y)/distance
		}
	}
	var result;
	if(br == 0) {
		return {
			x: 0,
			y: 0
		}
	}
	
	else {
		result = {
			x: sum.x,
			y: sum.y
		}
	}
	
	return normalize(result)
}

function checkEat(object, targets, threshold) {
	for(var i=0; i<targets.length; i++) {
		if(closeEnough(object, targets[i], threshold)) {
			return i;
		}
	}
	return -1;
}

function checkDamage(fishObj) {
	for(var i=0; i<prepreki.length; i++) {
		if(closeEnough(fishObj, prepreki[i], 40)) {
			return i;
		}
	}
	return -1;
}

function closeEnough(obj1, obj2, threshold) {
	var distance = Math.sqrt(Math.pow(obj1.x - obj2.x, 2)+Math.pow(obj1.y - obj2.y, 2));
	if((distance < threshold) && (distance != 0)) {
		return true;
	}
	return false;
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function addFish() {
	for(var i=0; i<10; i++)
		fish.push(new Fish())
}

function addSharks() {
	for(var i=0; i<5; i++)
		sharks.push(new Shark())
}

function addPlankton() {
	for(var i=0; i<20; i++)
		food.push(new Food())
}

function speedUp() {
	animate = false;
	brnasekundi = prompt("Broj na sekundi: ", brnasekundi)
	start();
}




function build() {
	if(!buildingMode) {
		buildingMode = true;
		document.getElementById("build").style.color = "green";
	}
	else {
		buildingMode = false;
		document.getElementById("build").style.color = "red";
	}
}

function mouse(event) {
	if(!buildingMode)
		return
	mousex = event.clientX;
	mousey = event.clientY;
	prepreki.push(new Prepreki({
		x: mousex,
		y: mousey
	}))
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}


function createInputVectorFish(nS, nP, fP, sP) {
	var vector = [];
	vector[0] = [
		nS.x, nS.y,
		nP.x, nP.y,
		fP.x, fP.y,
		sP.x, sP.y,
	];
	return vector;
}

function createInputVectorSharks(nS, nP, fP) {
	var vector = [];
	vector[0] = [
		nS.x, nS.y,
		nP.x, nP.y,
		fP.x, fP.y,
	];
	return vector;
}

function matrixMultiply(matrix1, matrix2) {

	var a, b, c, d;

	if(!matrix1[0]) 
		n = 1;
	else
		n = matrix1[0].length;


	if(!matrix2[0]) 
		b = 1;
	else
		b = matrix2[0].length;


	m = matrix1.length;
	a = matrix2.length;


	var result = [];

	for(var i=0; i<m; i++)
		result[i] = [];

	var zbir = 0;

	for(var i=0; i<m; i++) {
		for(var j=0; j<b; j++) {
			for(var k=0; k<n; k++) {
				zbir += matrix1[i][k]*matrix2[k][j];
			}
			result[i][j] = zbir;
			zbir = 0;
		}
	}
	return result;
}

function activation(value) {
	if(value > 0)
		return value;
	return 0;
}

function getOutput(inputVector, brain) {

	var layer = inputVector;
	for(var i=0; i<brain.length; i++) {
		layer = matrixMultiply(layer, brain[i]);
		if(i != brain.length-1) {
			for(var m=0; m<layer.length; m++) {
				for(var n=0; n<layer[0].length; n++)
					layer[m][n] = activation(layer[m][n])
			}
		}
	}

	return layer;
}

function randomMatrix(m, n) {
	var result = [];

	for(var i=0; i<m; i++)
		result[i] = [];
	
	for(var i=0; i<m; i++) {
		for(var j=0; j<n; j++) {
			result[i][j] = Math.random()*2-1;
		}
	}	
	return result;
}

function sigmoid(x) {
	return 1/(1+Math.pow(Math.E, -x))
}