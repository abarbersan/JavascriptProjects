var REFRESH_RATE = 1; // 40ms == 25 reps / s

var RANDOMIZATION_RATE = 100; // Rate to update random pixels

var RANDOMIZATION_PIXEL_COUNT = 10;

var WIDTH = 1000;
var HEIGHT = 1000;

var PIXEL_WIDTH = 40;
var PIXEL_HEIGHT = 40;

var RefreshTimer = null;
var RandomizationTimer = null;

function Run()
{
    var canvas = document.getElementById('myCanvas');

    var ctx = canvas.getContext("2d");
    
    var refreshList = new Array();
    var map = new Array();

    GenerateGrid(canvas, map, refreshList);

	RefreshTimer = setInterval(function () { Refresh(canvas, refreshList) }, REFRESH_RATE);

    RandomizationTimer = setInterval(function () { Randomize(map, refreshList) }, RANDOMIZATION_RATE);


    canvas.addEventListener("mousemove", function(event) { canvasMouseMove(event, map, refreshList); });
}

function GetMousePos(evt) {
    var canvas = evt.currentTarget;
    var rect = canvas.getBoundingClientRect();
    return { x: canvas.width * ((evt.clientX - rect.left) / rect.width), 
                y: canvas.height * ((evt.clientY - rect.top) / rect.height) };
}

function canvasMouseMove(evt, map, refreshList) {
    var ctx = evt.currentTarget.getContext("2d");

    var mousePos = GetMousePos(evt);

    var pixels = GetSurroundingPixels(evt.currentTarget, map, mousePos.x, mousePos.y);

    for (var i = 0; i < pixels.length; i++) {
        var pixel = pixels[i];
        pixel.color = "#000000";
        refreshList.push(pixel);
    }
}

function GetPixelFromCoords(canvas, map, x, y) {
    var col = Math.floor(x / PIXEL_WIDTH);
    var row = Math.floor(y / PIXEL_HEIGHT);
    var columns = canvas.width / PIXEL_WIDTH;

    return map[(row * columns) + col];
}

function GetSurroundingPixels(canvas, map, x, y) {
    var pixel = GetPixelFromCoords(canvas, map, x, y)
    var columns = canvas.width / PIXEL_WIDTH;
    var rows = canvas.height / PIXEL_WIDTH;

    var pixelList = new Array();

    // Add the Middle Pixel
    pixelList.push(pixel);

    var col = pixel.mapId % columns;
    var row = Math.floor(pixel.mapId / columns);

    // Add Left and Right
    if (col < columns - 1) pixelList.push(map[pixel.mapId + 1]);
    if (col > 0) pixelList.push(map[pixel.mapId - 1]);

    // Add Pixels Above
    if (row > 0) {
        var aboveIndex = (row * columns) + col;

        pixelList.push(map[aboveIndex]);

        if (col < columns - 1) pixelList.push(map[aboveIndex + 1]);
        if (col > 0) pixelList.push(map[aboveIndex - 1]);
    }

    // Add Pixels Below
    if (row < rows - 1) {
        var belowIndex = ((row + 1) * columns) + col;

        pixelList.push(map[belowIndex]);

        if (col < columns - 1) pixelList.push(map[belowIndex + 1]);
        if (col > 0) pixelList.push(map[belowIndex - 1]);
    }

    return pixelList;
}

function GenerateGrid(canvas, map, refreshList)
{
    for (var r = 0; r < canvas.height; r+=PIXEL_HEIGHT) {
        for (var c = 0; c < canvas.width; c+=PIXEL_HEIGHT) {
            var pixel = NewPixel(c, r, c + PIXEL_WIDTH, r + PIXEL_HEIGHT, "#FFFFFF", map.length);
            map.push(pixel);
            refreshList.push(pixel);
        }
    }
}

function GetRandomColor() {
    return "#" + decimalToHex(GetRandom(1, 256) - 1, 2) +       // Red
                    decimalToHex(GetRandom(1, 256) - 1, 2) +    // Green
                    decimalToHex(GetRandom(1, 256) - 1, 2);     // Blue
}

function GetRandom(min, max)
{
    return Math.floor((Math.random() * (max - min)) + min);
}

function decimalToHex(d, padding) {
    var hex = Number(d).toString(16);
    padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;

    while (hex.length < padding) {
        hex = "0" + hex;
    }

    return hex;
}

function NewPixel(left, top, right, bottom, color, mapId)
{
    return { left: left, top: top, right: right, botom: bottom, color: color,
            width: Math.abs(right - left), height: Math.abs(bottom - top), mapId: mapId};
}

function Refresh(canvas, refreshList)
{
    if (refreshList.length > 0) {
        var ctx = canvas.getContext("2d");

        while(refreshList.length > 0) {
            var pixel = refreshList.pop();

            // Clear (not needed here as we will completely cover the area)
            //ctx.clearRect(pixel.left, pixel.top, pixel.width, pixel.height);

            ctx.fillStyle = pixel.color;
            ctx.fillRect(pixel.left, pixel.top, pixel.width, pixel.height);
        }
    }
}

function Randomize(map, list)
{
    for (var i = 0; i < RANDOMIZATION_PIXEL_COUNT; i++) {
        var index = GetRandom(0, map.length - 1);

        var pixel = map[index];

        pixel.color = GetRandomColor();

        list.push(pixel);
    }
}