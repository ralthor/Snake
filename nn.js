class Neuron {
    constructor(n) {
        var temp = Array(n).fill(0);
        this.weigths = temp.map(i => Math.random() * 2 - 1);
        this.bias =  temp.map(i => Math.random() * 2 - 1);
        this.n = n;
    }

    output(a) {
        return this.sigmoid(this.weigths.map((x, i) => x * a[i]).map((x, i) => x + this.bias[i]).reduce((total, x) => total + x));
    }

    sigmoid(t) {
        return 1 / (1 + Math.exp(-t));
    }

    toArray() {
        return this.weigths.concat(this.bias);
    }

    fromArray(array) {
        var n = array.length;
        this.weigths = array.slice(0, n/2)
        this.bias = array.slice(n/2)
    }
}

class NeuralNetworkLayer {
    constructor(n, numberOfPreviousLayerNeurons, firstLayer = false) {
        this.neurons = Array(n).fill(0).map(i => new Neuron(firstLayer ? 1: numberOfPreviousLayerNeurons));
        this.firstLayer = firstLayer;
        this.size = n * this.neurons[0].n;
    }

    output (a) {
        if(this.firstLayer)
            return this.neurons.map((x, i) => x.output([a[i]]));
        else
            return this.neurons.map(x => x.output(a));
    }

    toArray() {
        return [].concat(...this.neurons.map(x => x.toArray()));
    }

    fromArray(array) {
        var n = array.length;
        var m = this.neurons[0].n * 2;
        for(var i = 0; i < n / m; i++)
            this.neurons[i].fromArray(array.slice(i * m, (i + 1) * m))
    }
}

class NeuralNetwork {
    constructor(layers) {
        this.layers = Array(layers.length).fill(0).map(
            (_, i) => new NeuralNetworkLayer(layers[i], i != 0 ? layers[i - 1]: 1, i == 0));
    }

    output(a) {
        for(var i = 0; i < this.layers.length; i++)
            a = this.layers[i].output(a);
        return a;
    }

    toArray() {
        return [].concat(...this.layers.map(x => x.toArray()));
    }

    fromArray(array) {
        for(var i = 0, j = 0; i < this.layers.length; i++) {
            var nextJ = j + this.layers[i].size * 2;
            this.layers[i].fromArray(array.slice(j, nextJ));
            j = nextJ;
        }
    }
}

function nnInit() {
    var nn = new NeuralNetwork([2, 3, 2]);
    var b = nn.layers[2].toArray();
    b[0] = 0;
    nn.layers[2].fromArray(b);
    a = nn.toArray();
    console.log(a[16]);
    a[16] = 1;
    nn.fromArray(a);
    a = nn.toArray();
    console.log(a[16]);
}