let solar_data;

let xspacing = 1; // Distance between each horizontal location
let w = 1600; // Width of entire wave
let amplitude = 250.0; // Height of wave
let dx; // Value for incrementing x
let yvalues; // Using an array to store height values for the wave
let x = 0;
let y = 0;
let n = 0;
let sunriseR = 34;
let sunriseG = 34;
let sunriseB = 31;


function preload() {
    //get solar data from API
    let api_url =
        'https://api.sunrise-sunset.org/json?lat=33.7489924&lng=-84.3902644=today';

    httpGet(api_url, 'json', false, function (response) {
        solar_data = response;
    });
}

function setup() {
    createCanvas(1600, 950);
    textSize(18);
    dx = (TWO_PI / 1400) * xspacing;
    yvalues = new Array(floor(w / xspacing))
}

function draw() {
    clear();
    if (!solar_data)
        return;

    //formatting data from API call (UTC-->EST)    
    var sunrise = moment(solar_data.results.sunrise, 'hh:mm:ss A').subtract(4, 'hours').format('LTS');
    var sunset = moment(solar_data.results.sunset, 'hh:mm:ss A').subtract(4, 'hours').format('LTS');
    var solar_noon = moment(solar_data.results.solar_noon, 'hh:mm:ss A').subtract(4, 'hours').format('LTS');
    var day_length = moment(solar_data.results.day_length, 'hh:mm:ss').format('hh:mm:ss');

    background(221, 221, 221);
    noFill();
    stroke(255);
    strokeWeight(3);

    //timeline
    line(0, 500, 1600, 500); //x1, y1, x2, y2

    textSize(48);
    noStroke();
    fill(106, 195, 228);
    text('Day length in Atlanta, Georgia: ' + day_length, 350, 75);
    textSize(24);
    noStroke();
    fill(93, 91, 67);
    text('Sunrise: ' + sunrise, 220, 495);
    fill(100, 100, 0);
    text('Solar Noon: ' + solar_noon, 700, 495);
    fill(100, 65, 0);
    text('Sunset: ' + sunset, 1210, 495);


    calcWave();
    renderWave();
    move();

}
function calcWave() {
    // For every x value, calculate a y value with sine function
    let x = 1.0;
    for (let i = 0; i < yvalues.length; i++) {
        yvalues[i] = sin(x) * amplitude;
        x += dx;
    }
}

function renderWave() {
    noStroke();
    fill(255);
    // A simple way to draw the wave with an ellipse at each location
    for (let x = 0; x < yvalues.length; x++) {
        ellipse(x * xspacing, height / 2 + yvalues[x], 5, 5);
    }
}

function move() {
    stroke(50);
    let c = getMovingColor(x);
    fill(c);
    y = height / 2 + yvalues[n];
    ellipse(x, y, 50, 50);
    //moving to the right on the horizontal axis
    x = (x * xspacing) + 1;
    // Moving up at a constant speed
    y = height / 2 + yvalues[n++];
    // Reset to the curve
    if (x > 1600) {
        x = 0;
        n = 0;
        y = height / 2 + yvalues[n];
    }
}

function getMovingColor(x) {
    if (x < 475) { //before sunrise
        c = color(sunriseR, sunriseG, sunriseB);
        sunriseR += 0.30;
        sunriseG += 0.30;
    } else if (x >= 475 && x < 800) { //solar noonish
        c = color(sunriseR, sunriseG, sunriseB);
        if (sunriseR < 255) {
            sunriseR += 0.375;
        }
        if (sunriseG < 255) {
            sunriseG += 0.375;
        }
    } else if (x >= 800 && x < 1000) {
        c = color(sunriseR, sunriseG, sunriseB);
        sunriseG -= 0.25;
    } else if (x >= 1000 && x < 1050) {
        c = color(sunriseR, sunriseG, sunriseB);
        sunriseG += 0.25;
        sunriseB += 0.25;
    } else if (x >= 1050 && x < 1275) {
        c = color(sunriseR, sunriseG, sunriseB);
        sunriseB += 0.45;
        sunriseR -= 0.15;
        sunriseG -= 0.45;
    } else if (x >= 1275 && x < 1300) {
        c = color(sunriseR, sunriseG, sunriseB);
        sunriseB += 0.65;
        sunriseG -= 0.45;
        sunriseR -= 0.25;
    } else if (x >= 1300 && x < 1500) {
        c = color(sunriseR, sunriseG, sunriseB);
        sunriseR -= 0.75;
        sunriseG -= 0.75;
        sunriseB -= 0.75;
    }
    else {
        sunriseR = 34;
        sunriseG = 34;
        sunriseB = 31;
        c = color(sunriseR, sunriseG, sunriseB);
    }
    return c;
}

