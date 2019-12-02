function drawHistory(DNA) {
	let canvas = document.getElementById("history")
	var ctx = canvas.getContext("2d");
	let kandidati = DNA.kandidati
	canvas.width = Math.max(kandidati.length*5, windowWidth-10);
	let thickness = ((canvas.width)/(DNA.kandidati.length));
	let dosegaProcent = 0;
	let posebenProcent;

	for(var i=0; i<kandidati.length; i++) {
		for(var m=0; m<kandidati[i].length; m++) {
			for(var n=0; n<kandidati[i].length; n++) {
				if(kandidati[i][m].color > kandidati[i][n].color) {
					let temp = kandidati[i][m]
					kandidati[i][m] = kandidati[i][n]
					kandidati[i][n] = temp
				}
			}
		}
	}


	for(var i=0; i<kandidati.length; i++) {
		dosegaProcent = 0
		for(var j=0; j<kandidati[i].length; j++) {
			posebenProcent = kandidati[i][j].br/20
			ctx.fillStyle = kandidati[i][j].color;
			ctx.fillRect(thickness*(kandidati.length - i - 1), dosegaProcent*canvas.height, thickness, posebenProcent * canvas.height)
			dosegaProcent += posebenProcent
		}
	}
}