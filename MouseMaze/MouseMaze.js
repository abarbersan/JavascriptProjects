var REFRESH_RATE = 40; // 40ms == 25 reps / s

var MOUSE_VELOCITY = 200;

var ROTATION_VELOCITY = Math.PI * 2;

var WIDTH = 1000;
var HEIGHT = 1000;

var PIXEL_WIDTH = 40;
var PIXEL_HEIGHT = 40;

var RefreshTimer = null;
var MouseMoveTimer = null;
var RandomizationTimer = null;

var DrawList = new Array();
var GridMap = new Array();
var Maze = null;
var Mice = null;

function RunMouseMaze()
{
    var canvas = document.getElementById('myCanvas');

    Maze = MAZES[1];

    GenerateGrid(canvas, GridMap, Maze);

    var miceCount = 4;

    Mice = new Array();

    for (var i = 0; i < miceCount; i++) {
        Mice.push({ type: "mouse", x: PIXEL_WIDTH * 20.9, y: PIXEL_WIDTH * 20.9, 
                width: PIXEL_WIDTH * Maze.mouseSize, height: PIXEL_WIDTH * Maze.mouseSize, 
                direction: Math.random() * 2 * Math.PI, 
                animationIndex: GetRandom(1, 20) - 1,
                RotationTimer: null });
    }

	StartMouseMove(canvas);

	RefreshTimer = setInterval(function () { Refresh(canvas, DrawList) }, REFRESH_RATE);
}

function StartMouseMove(canvas) {

    if (canvas == null) { canvas = document.getElementById('myCanvas'); }

    MouseMoveTimer = setInterval(function() { MoveMouse(canvas); }, REFRESH_RATE);
}

function GetMousePos(evt) {
    var canvas = evt.currentTarget;
    var rect = canvas.getBoundingClientRect();
    return { x: canvas.width * ((evt.clientX - rect.left) / rect.width), 
                y: canvas.height * ((evt.clientY - rect.top) / rect.height) };
}

function GetPixelFromCoords(canvas, map, x, y) {
    var col = Math.floor(x / PIXEL_WIDTH);
    var row = Math.floor(y / PIXEL_HEIGHT);
    var columns = canvas.width / PIXEL_WIDTH;

    return map[(row * columns) + col];
}

function GetSurroundingPixels(canvas, map, x, y, depth) {
    var pixel = GetPixelFromCoords(canvas, map, x, y);

    var pixelList = new Array();

    if (pixel != null) {
        var columns = canvas.width / PIXEL_WIDTH;
        var rows = canvas.height / PIXEL_WIDTH;

        // Add the Middle Pixel
        pixelList.push(pixel);

        var col = pixel.mapId % columns;
        var row = Math.floor(pixel.mapId / columns);

        // Add Left and Right
        for (var d = 1; d <= depth; d++) {
            if (col < columns - d) pixelList.push(map[pixel.mapId + d]);

            if (col > (d - 1)) pixelList.push(map[pixel.mapId - d]);

            // Add Pixels Above
            if (row > 0) {
                var aboveIndex = ((row - d) * columns) + col;

                pixelList.push(map[aboveIndex]);

                for (var a = 1; a <= depth; a++) {
                    if (col < columns - a) pixelList.push(map[aboveIndex + a]);
                    if (col > (a - 1)) pixelList.push(map[aboveIndex - a]);
                }
            }
        
            // Add Pixels Below
            if (row < rows - d) {
                var belowIndex = ((row + d) * columns) + col;

                pixelList.push(map[belowIndex]);

                for (var b = 1; b <= depth; b++) {
                    if (col < columns - b) pixelList.push(map[belowIndex + b]);
                    if (col > (b - 1)) pixelList.push(map[belowIndex - b]);
                }
            }
        }
    }

    return pixelList;
}

function GenerateGrid(canvas, map, definition)
{

    PIXEL_WIDTH = canvas.width / definition.width;
    PIXEL_HEIGHT = canvas.height / definition.height;

    var mapIndex = 0;

    for (var r = 0; r < canvas.height; r+=PIXEL_HEIGHT) {
        for (var c = 0; c < canvas.width; c+=PIXEL_HEIGHT) {
            var isWall = definition.map[mapIndex++] == "x";

            var pixel = NewPixel(isWall ? "wall" : "default", c, r, c + PIXEL_WIDTH, r + PIXEL_HEIGHT, isWall ? "#E8533A" : "#AAAAAA", map.length);
            map.push(pixel);
            DrawList.push(pixel);
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

function NewPixel(name, left, top, right, bottom, color, mapId)
{
    return { type: "pixel", name: name, left: left, top: top, right: right, bottom: bottom, color: color,
            width: Math.abs(right - left), height: Math.abs(bottom - top), mapId: mapId};
}

function MoveMouse(canvas)
{
	var moveDist = REFRESH_RATE / 1000 * MOUSE_VELOCITY;

    var random = Math.random();

    var finishMove = true;

    for (var m = 0; m < Mice.length; m++) {
        var mouse = Mice[m];
        finishMove = true;
    
        mouse.animationIndex = mouse.animationIndex >= MOUSE_ANIMATION_STEPS - 1 ? 0 : mouse.animationIndex + 1;

        if (mouse["RotationTimer"] != null) {
            DrawList.push(mouse);
            continue;
        }

        var newPos = { x: mouse.x + (Math.cos(mouse.direction) * moveDist),
                        y: mouse.y + (Math.sin(mouse.direction) * moveDist) };

        for (var i = 0; i < GridMap.length; i++) {
            if (GridMap[i].name == "wall") {
                var mouseRect = { left: newPos.x - (mouse.width / 2), right: newPos.x + (mouse.width / 2), 
                                top: newPos.y - (mouse.height / 2), bottom: newPos.y + (mouse.height / 2) };

                if (DetectRectOverlap(GridMap[i], mouseRect)) {

                    var pixel = GridMap[i];

                    var newDirection = GetCollisionReflectionAngle(newPos.x, newPos.y, newPos.x + Math.cos(mouse.direction),
                                                                    newPos.y + Math.sin(mouse.direction), 
                                                                    Math.abs((pixel.top + (pixel.height / 2)) - newPos.y) > 
                                                                    Math.abs((pixel.left + (pixel.width / 2)) - newPos.x));

                    //mouse.direction = newDirection;

                    AnimateRotation(mouse, newDirection);

                    finishMove = false;

                    break;
                }
            }
        }

        if (finishMove) {

            mouse.x = newPos.x;
            mouse.y = newPos.y;

            if (mouse.animationIndex % 4 != 0) {
                mouse.direction += ((GetRandom(1, 1000) - 501) / 1000) * Math.PI / 4;
            }

            DrawList.push(mouse);
        }
    }
}

function DetectRectOverlap(rect1, rect2) {
	return ((rect1.top <= rect2.top && rect1.top >= rect1.bottom) || (rect2.top <= rect1.top && rect2.top >= rect1.bottom) ||
		  (rect1.bottom >= rect2.top && rect1.bottom <= rect2.bottom) || (rect2.bottom >= rect1.top && rect2.bottom <= rect1.bottom)) &&
		 ((rect1.left >= rect2.left && rect1.left <= rect2.right) || (rect2.left >= rect1.left && rect2.left <= rect1.right) ||
		  (rect1.right >= rect2.left && rect1.right <= rect2.right) || (rect2.right >= rect1.left && rect2.right <= rect1.right));
}

function Refresh(canvas, drawList)
{
    if (drawList.length > 0) {
        var ctx = canvas.getContext("2d");

        var mice = new Array();

        while(drawList.length > 0) {

            var drawItem = drawList.pop();

            switch (drawItem.type) {
                case "pixel":
                    DrawPixel(drawItem, ctx);
                    break;
                case "mouse":
                    mice.push(drawItem);
                    break;
            }
        }

        if (mice.length > 0) {
            mmDrawMice(mice, canvas);
        }
    }
}

function AnimateRotation(mouse, endDirection) {

    if (mouse["RotationTimer"] != null) {
        clearInterval(mouse["RotationTimer"]);
        mouse["RotationTimer"] = null;
    }

    mouse["RotationTimer"] = setInterval(function() { AnimateRotationWorker(mouse, mouse.direction, endDirection); }, REFRESH_RATE);
}

function AnimateRotationWorker(mouse, startDirection, endDirection)
{
    if (startDirection < endDirection) {
        mouse.direction += REFRESH_RATE / 1000 * ROTATION_VELOCITY;

        if (mouse.direction > endDirection) {
            mouse.direction = endDirection;
        }
    } else {
        mouse.direction -= REFRESH_RATE / 1000 * ROTATION_VELOCITY;

        if (mouse.direction < endDirection) {
            mouse.direction = endDirection;
        }
    }

    if (mouse.direction == endDirection) {
        clearInterval(mouse["RotationTimer"]);
        mouse["RotationTimer"] = null;

        // Lets give the mouse a head start to prevent getting stuck "inside" the boundry
        var moveDist = REFRESH_RATE / 1000 * MOUSE_VELOCITY;

        mouse.x = mouse.x + (Math.cos(mouse.direction) * moveDist);
        mouse.y = mouse.y + (Math.sin(mouse.direction) * moveDist);
    }

    DrawList.push(mouse);
}

function mmDrawMice(mice, canvas) {
    var ctx = canvas.getContext("2d");

    for(var m = 0; m < mice.length; m++) {
        var mouse = mice[m];

        var pixels = GetSurroundingPixels(canvas, GridMap, mouse.x, mouse.y, Maze.mouseSize);

        for (var i = 0; i < pixels.length; i++) {
            var color = pixels[i].color;
            pixels[i].color = 'orange';
            DrawPixel(pixels[i], ctx);
            pixels[i].color = color;
            DrawPixel(pixels[i], ctx);
        }
    }

    for(var m = 0; m < mice.length; m++) {
        var mouse = mice[m];
        DrawMouse(mouse.x, mouse.y, mouse.width, mouse.direction, mouse.animationIndex, ctx);
    }
}

function mmDrawMouse(mouse, canvas) {
    var ctx = canvas.getContext("2d");

    var pixels = GetSurroundingPixels(canvas, GridMap, mouse.x, mouse.y);

    for (var i = 0; i < pixels.length; i++) {
        DrawPixel(pixels[i], ctx);
    }

    DrawMouse(mouse.x, mouse.y, mouse.width, mouse.direction, mouse.animationIndex, ctx);
}

function DrawPixel(pixel, ctx) {
    ctx.fillStyle = pixel.color;
    ctx.fillRect(pixel.left, pixel.top, pixel.width, pixel.height);
}

function GetCollisionReflectionAngle(x1, y1, x2, y2, hittop) {
    var retVal = 0;

    //console.log("GetCollisionReflectionAngle hittop: " + hittop);

    retVal = Math.atan2(y1 - y2, x2 - x1) + (hittop ? 0 : Math.PI);

    return retVal;
}