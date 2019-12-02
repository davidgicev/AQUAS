var windowWidth  = window.innerWidth - 15;
var windowHeight = window.innerHeight - 15;

var scalingFactor = 2;

var maxSpeedFish   = 1;
var maxSpeedSharks = 1.25;

var fishHeight  = 8
var fishWidth   = 2.5
var sharkHeight = 20 
var sharkWidth  = 10

var cTrienjeFish = 0.1;
var cTrienjeSharks = 0.064;

var animate = true;

var brnasekundi = 10

var mutationRate = 0.5

var freeIDsFish = [];
var freeIDsSharks = [];

var maxLayersFish = 0;
var maxNeuronsFish = 5;
var maxLayersSharks = 0;
var maxNeuronsSharks = 5;

var maxBrFish = 700;
var maxBrSharks = 100;

var koefTrienje = 2;

var time = 0;

var selectedObj = 0;

var fish = [];
var food = [];
var sharks = [];
var interval;
var deadFish = [];
var deadSharks = [];
var prepreki = [];
var brnagen = 0;

var didspawn = false;
var buildingMode = false;

var IDnumFish = 0;
var IDnumSharks = 0;