function Shark(dna) {

		this.x = Math.random()*windowWidth;
		this.y = Math.random()*windowHeight;
		this.id = IDnumSharks;
		IDnumSharks++;
		this.velocity = {
			x: 0,
			y: 0
		}
		this.acceleration = {
			x: 0,
			y: 0
		}
		this.health = 1000;
		this.dna = {
			color: getRandomColor(),
			sight: 200,
			food: 200,
			prepreka: 130,
			brain: [],
			mutationsConn: 0,
		}
		if(dna) {
		
			this.dna = dna;
		}
		else {

			var numberOfLayers = 0//Math.abs(Math.round(Math.random()*maxLayersSharks+1))
			var numberOfNeurons = 6
			var prethodno = 0
			var brain = []

			for(var i=0; i<numberOfLayers; i++) {
				prethodno = numberOfNeurons;
				numberOfNeurons = Math.abs(Math.round(Math.random()*maxNeuronsSharks+1))
				brain.push(randomMatrix(prethodno, numberOfNeurons))
			}

			brain.push(randomMatrix(numberOfNeurons, 2));
			this.dna.brain = brain
		}

		this.move = () => {
		
			this.health -= 0.2

			if(this.health > 1000)
				this.health = 1000

			var nSpeed = compareSpeeds(this, sharks, this.dna.sight);

			var nPosition = comparePositions(this, sharks, this.dna.sight);

			var fPosition = comparePositions(this, fish, this.dna.food);

			//var pPosition = comparePositions(this, prepreki, this.dna.prepreka);

			var inputVector = createInputVectorSharks(nSpeed, nPosition, fPosition);

			var output = getOutput(inputVector, this.dna.brain);

			let result = {
				x: nSpeed.x + nPosition.x + fPosition.x,
				y: nSpeed.y + nPosition.y + fPosition.y
			}

			result = normalize(result)

			var separation = separate(this, sharks, sharkWidth*5);

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
				for (var i = 0; i < sharks.length; i++) {
					if(sharks[i].id == this.id) {
						deadSharks.unshift(sharks[i].dna)
						sharks.splice(i,1);
					}
				}
				return;
			}

			var toEat = checkEat(this, fish, sharkWidth)

			if(toEat != -1) {
				fish.splice(toEat, 1);
				this.health += 50;
			}

			var damage = checkDamage(this)

			if(damage != -1) {
				this.health -= 600;
				deadSharks.unshift(this.dna)
			}

			if(animate) {
				var ctx = document.getElementById("ocean").getContext("2d")
			  	ctx.save();
			    ctx.translate(this.x + (sharkHeight)/2, this.y+(sharkWidth)/2);
			    var angle = Math.atan(this.velocity.y/this.velocity.x)
			    ctx.rotate(angle);
			    ctx.fillStyle = this.dna.color;
			    ctx.fillRect(-(sharkHeight)/2, -(sharkWidth)/2, sharkHeight, sharkWidth);
			    ctx.restore();
			}

		}
	}

	