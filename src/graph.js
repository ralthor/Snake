var trace1 = {
  x: [1, 2, 3, 4],
  y: [10, 15, 13, 17],
  type: 'scatter',
};

var trace2 = {
  x: [1, 2, 3, 4],
  y: [16, 5, 11, 9],
  type: 'scatter'
};

function draw(divId, x, y) {
    var trace = {
        x: x,
        y: y,
        type: 'scatter'
    }
    var data = [trace];
    Plotly.newPlot(divId, data, {}, {showSendToCloud: true});
}

function test() {
    x = Array(11).fill(0).map((_, i) => i / 10 - 0.5);
    y = x.map(p => Math.pow(p, 2));
    draw('myDiv', x, y);
}