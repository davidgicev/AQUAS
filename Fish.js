function Fish(dna) {
		this.x = Math.floor(Math.random()*windowWidth/500)*500;
		this.y = Math.floor(Math.random()*windowHeight/400)*400;
		this.id = IDnumFish;
		IDnumFish++;
		this.velocity = normalize({
			x: Math.random()-0.5,
			y: Math.random()-0.5
		})
		this.acceleration = {
			x: 0,
			y: 0
		}
		this.health = 700;

		this.dna = {
			color: getRandomColor(),
			sight:  50,
			food:  20,
			brain: [],
			mutationsConn: 0,
		}
		if(dna) {
			this.dna = dna;
		}
		else {

			var numberOfLayers = 0//Math.abs(Math.round(Math.random()*maxLayersFish+1))
			var numberOfNeurons = 8
			var prethodno = 0
			var brain = []

			for(var i=0; i<numberOfLayers; i++) {
				prethodno = numberOfNeurons;
				numberOfNeurons = Math.abs(Math.round(Math.random()*maxNeuronsFish+1))
				brain.push(randomMatrix(prethodno, numberOfNeurons))
			}

			brain.push(randomMatrix(numberOfNeurons, 2));
			this.dna.brain = brain;
		}
		this.move = () => {

			this.health -= 0.2

			if(this.health > 700) {
				this.health = 700
			}

			var nSpeed = compareSpeeds(this, fish, this.dna.sight);

			var nPosition = comparePositions(this, fish, this.dna.sight);

			var fPosition = comparePositions(this, food, this.dna.food);

			//var pPosition = comparePositions(this, prepreki, this.dna.sight);

			var sPosition = comparePositions(this, sharks, this.dna.sight);

			var inputVector = createInputVectorFish(nSpeed, nPosition, fPosition, sPosition);

			var output = getOutput(inputVector, this.dna.brain);

			
			let result = {
				x: output[0][0],
				y: output[0][1]
			}

			result = normalize(result)

			

			var separation = separate(this, fish, fishWidth*7);

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
				for (var i = 0; i < fish.length; i++) {
					if(fish[i].id == this.id) {
						deadFish.unshift(fish[i].dna)
						fish.splice(i,1);
						food.push(new Food());
					}
				}
			}

			var toEat = checkEat(this, food, fishWidth)

			if(toEat != -1 && this.health < 250) {
				food.splice(toEat, 1);
				this.health += 30;
			}

			var damage = checkDamage(this)

			if(damage != -1) {
				deadFish.unshift(this.dna)
				this.health -= 400;
			}

			if(animate) {
				var ctx = document.getElementById("ocean").getContext("2d")
				ctx.save();
			    ctx.translate(this.x + (fishHeight)/2, this.y+(fishWidth)/2);
			    var angle = Math.atan(this.velocity.y/this.velocity.x)
			    ctx.rotate(angle);
			    ctx.fillStyle = this.dna.color;
			    ctx.fillRect(-(fishHeight)/2,-(fishWidth)/2, fishHeight, fishWidth);
			    ctx.restore();   

			    

			    ctx.lineWidth = 2;/*

			    ctx.beginPath();
			    ctx.strokeStyle = "blue"
			    ctx.moveTo(this.x + 5, this.y + 1.25)
			    ctx.lineTo(this.x + 5 + nSpeed.x*50, this.y + 1.25 + nSpeed.y*50)
			    ctx.stroke();*/

			    
			}

		}
	}


