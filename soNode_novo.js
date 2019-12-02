var fs = require("fs")

var windowWidth  = 1400;
var windowHeight = 3000;

var scalingFactor = 2;

var fishHeight  = 10 
var fishWidth   = 5
var sharkHeight = 20 
var sharkWidth  = 10

var maxSpeedFish   = 1;
var maxSpeedSharks = 1.25;

var cTrienjeFish = 0.1;
var cTrienjeSharks = 0.064;

var animate = true;

var brnasekundi = 60

var mutationRate = 0.5

var maxBrFish = 700;
var maxBrSharks = 100;
var maxLayersFish = 5;
var maxNeuronsFish = 15;
var maxLayersSharks = 5;
var maxNeuronsSharks = 15;

var koefTrienje = 2;

var sumAgeFish = 0;
var sumAgeSharks = 0;

var time = 0;

var subspaces = [];

function Subspace(parameters) {
	this.id = subspaces.length;
	this.fish = [];
	this.sharks = [];
	this.prepreki = [];
	this.food = [];
	this.deadFish = [];
	this.deadSharks = [];
	this.parameters = parameters
	this.generation = 0
	this.kandidati = [];
	this.init = () => {

		for(var i=0; i<this.parameters.numberOfObjects.fish; i++) {
			this.fish.push(new Fish(null, this.id))
		}
		for(var i=0; i<this.parameters.numberOfObjects.sharks; i++) {
			this.sharks.push(new Shark(null, this.id))
		}
		for(var i=0; i<this.parameters.numberOfObjects.prepreki; i++) {
			this.prepreki.push(new Prepreka())
		}
		for(var i=0; i<this.parameters.numberOfObjects.food; i++) {
			this.food.push(new Food())
		}

	}
}

var beginning = (new Date()).getTime()
spawn()
while(true) {
	iterate()
}


function spawn() {
	for(var i=0; i<3; i++) {
		subspaces.push(new Subspace({
			numberOfObjects: {
				fish: 200,
				sharks: 6,
				food: 200,
				prepreki: 0,
			},
			fishBrain:  [],
			sharkBrain: []
		}))
		subspaces[i].init();
	}
}

function Food() {
	this.x = Math.floor(Math.random()*windowWidth/200)*200;
	this.y = Math.floor(Math.random()*windowHeight/100)*100;
}

function Prepreka(position) {
	this.x = Math.random()*windowWidth;
	this.y = Math.random()*windowHeight;
	if(position) {
		this.x = position.x;
		this.y = position.y;
	}
}


function iterate() {

	for(var sektor = 0; sektor < subspaces.length; sektor++) {

	let subspace = subspaces[sektor]

	if(subspace.fish.length > 0.5*subspace.food.length)
		subspace.food.push(new Food())

	if(subspace.fish.length == 0 && subspace.sharks.length == 0) {

			subspace.generation++;

			console.log("Generation "+subspace.generation+" for subspace #"+sektor)

			subspace.kandidati.unshift([]);

			for(var i=0; i<20; i++) {
				let index = -1;
				for(var j=0; j<subspace.kandidati[0].length; j++) {
					if(subspace.kandidati[0][j].color == subspace.deadFish[i].color)
						index = j;
				}
				if(index == -1) {
					subspace.kandidati[0].push({
						color: subspace.deadFish[i].color,
						br: 1,
					})
				}
				else {
					subspace.kandidati[0][index].br++;
				}
			}

			if(subspace.generation % 10 == 0) {
				fs.writeFileSync("./DNA/subspace_#"+sektor+"_DNA.json", JSON.stringify({
					DNKfish: subspace.deadFish,
					DNKsharks: subspace.deadSharks,
					kandidati: subspace.kandidati,
					brnagen: subspace.generation,
				}))
				console.log("DNA progress saved for subspace #"+sektor)
			}

			for(var i=0; i<20; i++) {
				for(var j=0; j<10; j++)
					subspace.fish.push(new Fish(subspace.deadFish[i], sektor))
			}

			for(var i=0; i<4; i++) {
				for(var j=0; j<1; j++)
					subspace.sharks.push(new Shark(subspace.deadSharks[i], sektor))
			}

			for(var i=0; i<50; i++)
				subspace.fish.push(new Fish(null, sektor))
			for(var i=0; i<2; i++)
				subspace.sharks.push(new Shark(null, sektor))
			for(var i=0; i<0; i++)
				subspace.prepreki.push(new Prepreka())

			subspace.deadFish = [];
			subspace.deadSharks = [];
	}

		for(var i=0; i<subspace.fish.length; i++) {
			subspace.fish[i].move();
		}
		for(var i=0; i<subspace.sharks.length; i++) {
			subspace.sharks[i].move();
		}

	subspaces[sektor] = subspace
	}

	if(subspaces[0].generation % 10 == 0 && subspaces[0].generation > 0 && subspaces.length > 1) {
		console.log("Shit's about to happen");
		let cleared = []
		for(let i=0; i<subspaces[0].fish.length; i++) {
			if(Math.random() > 0.5) {
				cleared.push(subspaces[0].fish[i])
			}
		}
		subspaces[0].fish = cleared
		for(let i=0; i<subspaces[subspaces.length-1].fish.length; i++) {
			if(Math.random() > 0.5) {
				let tobepushed = subspaces[subspaces.length-1].fish[i]
				tobepushed.dna.subspaceID = 0;
				subspaces[0].fish.push(tobepushed)
			}
		}
		subspaces.pop()
		subspaces[0].generation++
		console.log("Remaining number of subspaces: "+subspaces.length)
	}
}

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

function Fish(dna, subspaceID) {
		this.x = Math.floor(Math.random()*windowWidth/500)*500;
		this.y = Math.floor(Math.random()*windowHeight/400)*400;
		this.id = subspaces[subspaceID].fish.length
		this.velocity = normalize({
			x: Math.random()-0.5,
			y: Math.random()-0.5
		})
		this.acceleration = {
			x: 0,
			y: 0
		}
		this.health = 400;

		this.dna = {
			color: getRandomColor(),
			sight:  150,
			food:  60,
			brain: [],
			mutationsConn: 0,
			subspaceID: subspaceID
		}

		if(dna) {

			this.dna = dna;

			/*

			if(Math.random() < 0.001) {
				var brain = dna.brain;
				for(var i=0; i<brain.length; i++) {
					for(var j=0; j<brain[i].length; j++) {
						for(var k=0; k<brain[i][0].length; k++) {
							if(Math.random() < 0.5) {
								brain[i][j][k] += Math.random()-0.5;
								dna.mutationsConn++;					
							}
						}
					}
				}
			}
			*/
		}
		else {
			var prethodno = 8
			var brain = []
			var brainTemplate = subspaces[subspaceID].parameters.fishBrain

			for(var i=0; i<brainTemplate.length; i++) {
				brain.push(randomMatrix(prethodno, brainTemplate[i]))
				prethodno = brainTemplate[i]
			}

			brain.push(randomMatrix(prethodno, 2));
			this.dna.brain = brain;
		}
		this.move = () => {

			var subspace = subspaces[this.dna.subspaceID]

			this.health -= 0.2

			if(this.health > 400) {
				this.health = 400
			}

			var nSpeed = 	compareSpeeds(this, subspace.fish, this.dna.sight);

			var nPosition = comparePositions(this, subspace.fish, this.dna.sight);

			var fPosition = comparePositions(this, subspace.food, this.dna.food);

			//var pPosition = comparePositions(this, subspace.prepreki, this.dna.sight);

			var sPosition = comparePositions(this, subspace.sharks, this.dna.sight);

			var inputVector = createInputVectorFish(nSpeed, nPosition, fPosition, sPosition);

			var output = getOutput(inputVector, this.dna.brain);

			let currentVelocity = normalize(this.velocity) 

			let result = {
				x: output[0][0],
				y: output[0][1]
			}

			result = normalize(result)

			var separation = separate(this, subspace.fish, fishWidth);

			if(separation.x != 0 && separation.y != 0) {
				result.x = 0.2*separation.x;
				result.y = 0.2*separation.y;
			}
			else {
				result.x = 0.1*result.x
				result.y = 0.1*result.y
			}

			this.acceleration.x = result.x;
			this.acceleration.y = result.y;

			this.velocity.x += this.acceleration.x;
			this.velocity.y += this.acceleration.y;

			this.velocity = normalize(this.velocity)

			this.x += maxSpeedFish*this.velocity.x;
			this.y += maxSpeedFish*this.velocity.y;

			if(this.x > windowWidth)
				this.x = 0;
			if(this.x < 0)
				this.x = windowWidth;
			if(this.y > windowHeight)
				this.y = 0;
			if(this.y < 0)
				this.y = windowHeight;

			if(this.health < 0) {
				for (var i = 0; i < subspace.fish.length; i++) {
					if(subspace.fish[i].id == this.id) {
						subspace.deadFish.unshift(subspace.fish[i].dna)
						subspace.fish.splice(i,1);
						subspace.food.push(new Food());
					}
				}
			}

			var toEat = checkEat(this, subspace.food, fishWidth)

			if(toEat != -1 && this.health < 250) {
				subspace.food.splice(toEat, 1);
				this.health += 30;
			}
/*
			var damage = checkDamage(this)

			if(damage != -1) {
				deadFish.unshift(this.dna)
				this.health -= 400;
			}
*/
		}
	}


function Shark(dna, subspaceID) {
		this.x = Math.random()*windowWidth;
		this.y = Math.random()*windowHeight;
		this.id = subspaces[subspaceID].sharks.length;
		this.velocity = {
			x: 0,
			y: 0
		}
		this.acceleration = {
			x: 0,
			y: 0
		}
		this.health = 700;
		this.dna = {
			color: getRandomColor(),
			sight: 300,
			food: 300,
			prepreka: 100,
			brain: [],
			mutationsConn: 0,
			subspaceID: subspaceID
		}

		if(dna) {

			this.dna = dna;

			/*

			if(Math.random() < 0.01) {
				var brain = dna.brain;
				for(var i=0; i<brain.length; i++) {
					for(var j=0; j<brain[i].length; j++) {
						for(var k=0; k<brain[i][0].length; k++) {
							if(Math.random() < 0.05) {
								brain[i][j][k] += Math.random()-0.5;
								dna.mutationsConn++;					
							}
						}
					}
				}
			}
			*/
		}
		else {

			var prethodno = 6
			var brain = []
			var brainTemplate = subspaces[subspaceID].parameters.sharkBrain

			for(var i=0; i<brainTemplate.length; i++) {
				brain.push(randomMatrix(prethodno, brainTemplate[i]))
				prethodno = brainTemplate[i]
			}

			brain.push(randomMatrix(prethodno, 2));
			this.dna.brain = brain;
		}

		this.move = () => {

			var subspace = subspaces[this.dna.subspaceID]
		
			this.health -= 0.2

			if(this.health > 700)
				this.health = 700

			var nSpeed = 	compareSpeeds(this, subspace.sharks, this.dna.sight);

			var nPosition = comparePositions(this, subspace.sharks, this.dna.sight);

			var fPosition = comparePositions(this, subspace.fish, this.dna.food);

			//var pPosition = comparePositions(this, subspace.prepreki, this.dna.prepreka);

			var inputVector = createInputVectorSharks(nSpeed, nPosition, fPosition);

			var output = getOutput(inputVector, this.dna.brain);

			let currentVelocity = normalize(this.velocity) 

			let result = {
				x: output[0][0],
				y: output[0][1]
			}

			result = normalize(result)

			var separation = separate(this, subspace.sharks, sharkWidth);

			if(separation.x != 0 && separation.y != 0) {
				result.x = 0.2*separation.x;
				result.y = 0.2*separation.y;
			}
			else {
				result.x = 0.1*result.x
				result.y = 0.1*result.y
			}

			this.acceleration.x = result.x;
			this.acceleration.y = result.y;

			this.velocity.x += this.acceleration.x;
			this.velocity.y += this.acceleration.y;

			this.velocity = normalize(this.velocity)

			this.x += maxSpeedSharks*this.velocity.x;
			this.y += maxSpeedSharks*this.velocity.y;	

			if(this.x > windowWidth)
				this.x = 0;
			if(this.x < 0)
				this.x = windowWidth;
			if(this.y > windowHeight)
				this.y = 0;
			if(this.y < 0)
				this.y = windowHeight;

			
			if(this.health < 0) {
				for (var i = 0; i < subspace.sharks.length; i++) {
					if(subspace.sharks[i].id == this.id) {
						subspace.deadSharks.unshift(subspace.sharks[i].dna)
						subspace.sharks.splice(i,1);
					}
				}
				return;
			}
			var toEat = checkEat(this, subspace.fish, fishWidth)

			if(toEat != -1) {
				subspace.deadFish.unshift(subspace.fish[toEat].dna)
				subspace.fish.splice(toEat, 1);
				this.health += 50;
			}
/*
			var damage = checkDamage(this)

			if(damage != -1) {
				this.health -= 600;
				deadSharks.unshift(this.dna)
			}
*/
		}
	}

	