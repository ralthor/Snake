function target(x) {
    return x * x; //x[0] ^ x[1];
}

//var testX = [[0, 0], [0, 1], [1, 0], [1, 1]]; // Array(11).fill(0).map((_, i) => i / 10 - 0.5);
var testX = Array(11).fill(0).map((_, i) => i / 10 - 0.5);
var testY = testX.map(p => target(p));

function startLearning() {
    initData();
    GAInitialize();
    showBestError();
    timerWorking = true;
    iterateInterface();
}

var timerWorking = false;
function iterateInterface() {
    setTimeout(() => {
        for (var j = 0; j < 100; j++)
            GANextGeneration();
        showTimeLine();
        showBest();
        if (timerWorking)
            iterateInterface();
    }, 100);
}

function applyNN(indivial, inputList) {
    temporalNN.fromArray(indivial)
    var y = [].concat(...inputList.map(x => temporalNN.output(x)));
    return y;
}

function showBestError() {
    var y = applyNN(best, testX);
    var err = testY.map((j, i) => Math.abs(j - y[i]));
    document.getElementById('diagram').innerHTML = '';
    draw('diagram', testX, err);
    document.getElementById('diagram').innerHTML += '<br/> Sum of error: ' + y.reduce((t, x) => t + x);
}

function showBest() {
    var y = applyNN(best, testX);
    err = testY.map((j, i) => Math.abs(j - y[i]));
    document.getElementById('diagram').innerHTML = '';
    draw('diagram', testX, y);
    document.getElementById('diagram').innerHTML += '<br/> Sum of error: ' + err.reduce((t, x) => t + x);
}

function showTimeLine() {
    draw('timeLine', timeLine.map((_, i) => i), timeLine);
}

Array.prototype.clone = function () {
    return this.slice(0);
}

Array.prototype.shuffle = function () {
    for (var j, x, i = this.length - 1; i; j = randomNumber(i), x = this[--i], this[i] = this[j], this[j] = x);
    return this;
}

function randomNumber(boundary) {
    return parseInt(Math.random() * boundary);
}

var NetStructure;
var running;
var PopulationSize;
var CrossoverProbability;
var MutationProbability;
var UnchangedGens;
var mutationTimes;
var bestValue;
var best;
var currentGeneration;
var currentBest;
var population;
var values;
var fitnessValues;
var roulette;
var temporalNN;
var timeLine;

function initData() {
    running = false;
    NetStructure = [1, 2, 3, 2, 1];
    PopulationSize = 1000;
    CrossoverProbability = 0.95;
    MutationProbability = 0.7;
    UnchangedGens = 0;
    mutationTimes = 0;
    bestValue = undefined;
    best = [];
    currentGeneration = 0;
    currentBest;
    population = [];
    values = new Array(PopulationSize);
    fitnessValues = new Array(PopulationSize);
    roulette = new Array(PopulationSize);
    temporalNN = new NeuralNetwork(NetStructure);
}


function GAInitialize() {
    population = Array(PopulationSize).fill(0).map(x => randomIndivial());
    timeLine = []
    setBestValue();
}

function GANextGeneration() {
    currentGeneration++;
    selection();
    crossover();
    mutation();
    setBestValue();
}

function tribulate() {
    for (var i = population.length >> 1; i < PopulationSize; i++) {
        population[i] = randomIndivial();
    }
}

function selection() {
    var parents = new Array();
    var initnum = 3;
    parents.push(population[currentBest.bestPosition]);
    parents.push(mutation1(best.clone()));
    parents.push(best.clone());

    setRoulette();
    for (var i = initnum; i < PopulationSize; i++) {
        parents.push(population[wheelOut(Math.random())]);
    }
    population = parents;
}

function crossover() {
    var queue = new Array();
    for (var i = 0; i < PopulationSize; i++) {
        if (Math.random() < CrossoverProbability) {
            queue.push(i);
        }
    }
    queue.shuffle();
    for (var i = 0, j = queue.length - 1; i < j; i += 2) {
        doCrossover(queue[i], queue[i + 1]);
    }
}

function doCrossover(x, y) {
    children = getChildren(x, y);
    population[x] = children[0];
    population[y] = children[1];
}

function getChildren(x, y) {
    child1 = population[x];
    child2 = population[y];
    for (var i = 0; i < x.length; i++)
        if (Math.random() > 0.5) {
            if (Math.random() > 0.5) {
                var tmp = x[i];
                x[i] = y[i];
                y[i] = tmp;
            }
            else {
                var tmp = (x[i] + y[i]) / 2;
                x[i] = tmp;
                y[i] = tmp;
            }
        }
    return [child1, child2];
}
function mutation() {
    for (var i = 0; i < PopulationSize; i++)
        if (Math.random() < MutationProbability) {
            population[i] = mutation1(population[i]);
            i--;
        }
}

function mutation1(seq) {
    mutationTimes++;
    var mutationsPerGene = 1; //seq.length * 0.2;
    for (var i = 0; i < mutationsPerGene; i++) {
        var n = randomNumber(seq.length);
        seq[n] = Math.random() * 20 - 10;
    }
    return seq;
}

function setBestValue() {
    values = population.map(x => evaluate(x));
    currentBest = getCurrentBest();
    if (bestValue === undefined || bestValue > currentBest.bestValue) {
        best = population[currentBest.bestPosition].clone();
        bestValue = currentBest.bestValue;
        UnchangedGens = 0;
    } else {
        UnchangedGens += 1;
    }
    timeLine.push(bestValue);
}

function getCurrentBest() {
    var bestP = 0;
    var currentBestValue = values[0];

    for (var i = 1; i < population.length; i++) {
        if (values[i] < currentBestValue) {
            currentBestValue = values[i];
            bestP = i;
        }
    }
    return {
        bestPosition: bestP,
        bestValue: currentBestValue
    }
}

function setRoulette() {
    //calculate all the fitness
    fitnessValues = values.map(v => 1.0 / v);
    //set the roulette
    var sum = 0;
    sum = fitnessValues.reduce((total, f) => total + f);
    roulette = fitnessValues.map(f => f / sum);
    for (var i = 1; i < roulette.length; i++)
        roulette[i] += roulette[i - 1];
}

function wheelOut(rand) {
    for (var i = 0; i < roulette.length; i++)
        if (rand <= roulette[i])
            return i;
    console.log("in function wheelOut, rand value does not work well: " + rand)
}

function randomIndivial() {
    var neuralNetwork = new NeuralNetwork(NetStructure);
    return neuralNetwork.toArray();
}

function evaluate(indivial) {
    temporalNN.fromArray(indivial);
    y = [].concat(...testX.map(x => temporalNN.output(x))).map((j, i) => Math.abs(j - testY[i]));
    var sumOfError = y.reduce((t, x) => t + x);
    return sumOfError;
}