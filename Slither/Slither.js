var myCanvas = null;

var WIDTH = 800;
var HEIGHT = 800;

var FIELD_WIDTH = 600;
var FIELD_HEIGHT = 600;

var SHAPE_LIST_LENGTH = 20;

var BALL_RADIUS = 10;
var BALL_COUNT = 20;
var NO_ANGLE = -99;
var SAMPLE_RATE = 50;
var MAX_VELOCITY = 150;
var NULL_POS = -999;

var TRIANGLE_COUNT = 8;
var TRIANGLE_RADIUS = BALL_RADIUS;
var TRIANGLE_ROTATE_SPEED = 200;
var TRIANGLE_ROTATION = Math.PI / 32;

var TOP = 100;
var BOTTOM = 700;
var LEFT = 100;
var RIGHT = 700;

var HAND_WIDTH = 10;
var HAND_HEIGHT = 5;
var HAND_HIT_RADIUS = 50;

var FREE_SHAPE_ID = 1;

var HandBall = { "x": NULL_POS, "y": NULL_POS, "radius": HAND_HIT_RADIUS, "direction": NO_ANGLE, "velocity": 0 };

var MousePos = { "x": NULL_POS, "y": NULL_POS };

var CollisionMap = null;

var CollisionList = null;

var ShapeList = null;

var timer = null;

function Run()
{
    UpdateVariables();

    myCanvas = document.getElementById('myCanvas');

    WIDTH = myCanvas.width;
    HEIGHT = myCanvas.height;

    TOP = HEIGHT * .1;
    BOTTOM = HEIGHT * .9;
    LEFT = WIDTH * .1;
    RIGHT = WIDTH * .9;

    FIELD_WIDTH = WIDTH * .8;
    FIELD_HEIGHT = HEIGHT * .8;

    myCanvas.addEventListener('click', CanvasClicked, false);
    myCanvas.addEventListener('mousemove', CanvasMouseMove, false);

    DrawBorder();
	
	var ctx = myCanvas.getContext("2d");
	
	var balls = BALL_COUNT;

	ShapeList = new Array();

	CollisionMap = new Array();

	CollisionList = new Array();
	
	/*var question = "How many balls do you have?";
	
	while (balls <= 0) {
	
		var ballCnt = prompt(question, "2");
		
		if (ballCnt != null && parseInt(ballCnt) > 0)
		{
			balls = parseInt(ballCnt);
		} else {
			question = "Awe come on, how many you really got?";
		}
	
	}*/
	
	for (var i = 0; i < balls; i++) {
	    ShapeList.push(GetNewBallList());
	}

	for (var i = 0; i < TRIANGLE_COUNT; i++) {
	    ShapeList.push(GetNewTriangleList());
	}

    if (timer != null) {
        clearInterval(timer);
	}

	timer = setInterval(function () { TimerUpdate() }, SAMPLE_RATE);
}

function TimerUpdate() {

    ClearField();
    
    DrawShapes();
    
    DrawHand();

    // Move The Shapes
    MoveShapes();

    // Build List of Collisions
    UpdateCollisionList();

    // Adjust Based on Collisions
    ProcessCollisionList();
}

function MoveShapes() {
    for (var i = 0; i < ShapeList.length; i++) {
        var shape = ShapeList[i];

        if (shape.type == "circle") {
            MoveBall(shape, i);
        } else if (shape.type == "triangle") {
            MoveTriangle(shape, i);
        }
    }
}

function MoveTriangle(tList) {
    var lastTriangle = tList.shapes[tList.shapes.length - 1];

    var newTriangle = GetNewTrianglePosition(lastTriangle, SAMPLE_RATE);

    var hittop = false;
    var reflect = false;

    var oldCenter = GetRightTriangleCenter(lastTriangle);
    var center = GetRightTriangleCenter(newTriangle);

    var xOffset = null;

    // OFF LEFT
    if (newTriangle.A.x <= LEFT) {
        var xOffset = LEFT - newTriangle.A.x;
        newTriangle.A.x += xOffset;
        newTriangle.B.x += xOffset;
        newTriangle.C.x += xOffset;
        reflect = true;
    }

    if (newTriangle.B.x <= LEFT) {
        var xOffset = LEFT - newTriangle.B.x;
        newTriangle.A.x += xOffset;
        newTriangle.B.x += xOffset;
        newTriangle.C.x += xOffset;
        reflect = true;
    }

    if (newTriangle.C.x <= LEFT) {
        var xOffset = LEFT - newTriangle.C.x;
        newTriangle.A.x += xOffset;
        newTriangle.B.x += xOffset;
        newTriangle.C.x += xOffset;
        reflect = true;
    }

    // OFF RIGHT
    if (newTriangle.A.x >= RIGHT) {
        var xOffset = RIGHT - newTriangle.A.x;
        newTriangle.A.x += xOffset;
        newTriangle.B.x += xOffset;
        newTriangle.C.x += xOffset;
        reflect = true;
    }

    if (newTriangle.B.x >= RIGHT) {
        var xOffset = RIGHT - newTriangle.B.x;
        newTriangle.A.x += xOffset;
        newTriangle.B.x += xOffset;
        newTriangle.C.x += xOffset;
        reflect = true;
    }

    if (newTriangle.C.x >= RIGHT) {
        var xOffset = RIGHT - newTriangle.C.x;
        newTriangle.A.x += xOffset;
        newTriangle.B.x += xOffset;
        newTriangle.C.x += xOffset;
        reflect = true;
    }

    // OFF TOP
    if (newTriangle.A.y <= TOP) {
        var yOffset = TOP - newTriangle.A.y;
        newTriangle.A.y += yOffset;
        newTriangle.B.y += yOffset;
        newTriangle.C.y += yOffset;
        reflect = true;
        hittop = true;
    }

    if (newTriangle.B.y <= TOP) {
        var yOffset = TOP - newTriangle.B.y;
        newTriangle.A.y += yOffset;
        newTriangle.B.y += yOffset;
        newTriangle.C.y += yOffset;
        reflect = true;
        hittop = true;
    }

    if (newTriangle.C.y <= TOP) {
        var yOffset = TOP - newTriangle.C.y;
        newTriangle.A.y += yOffset;
        newTriangle.B.y += yOffset;
        newTriangle.C.y += yOffset;
        reflect = true;
        hittop = true;
    }

    // OFF BOTTOM
    if (newTriangle.A.y >= BOTTOM) {
        var yOffset = BOTTOM - newTriangle.A.y;
        newTriangle.A.y += yOffset;
        newTriangle.B.y += yOffset;
        newTriangle.C.y += yOffset;
        reflect = true;
        hittop = true;
    }

    if (newTriangle.B.y >= BOTTOM) {
        var yOffset = BOTTOM - newTriangle.B.y;
        newTriangle.A.y += yOffset;
        newTriangle.B.y += yOffset;
        newTriangle.C.y += yOffset;
        reflect = true;
        hittop = true;
    }

    if (newTriangle.C.y >= BOTTOM) {
        var yOffset = BOTTOM - newTriangle.C.y;
        newTriangle.A.y += yOffset;
        newTriangle.B.y += yOffset;
        newTriangle.C.y += yOffset;
        reflect = true;
        hittop = true;
    }

    if (reflect) {
        newTriangle.direction = GetCollisionReflectionAngle(oldCenter.x, oldCenter.y, center.x, center.y, hittop);
    } else {
        // Detect Collisions
        /*var collisionResultAngle = GetTriangleCollisionAngle(newTriangle);

        if (collisionResultAngle != NO_ANGLE) {
            newTriangle.direction = collisionResultAngle;
        }*/
    }

    if (tList.shapes.length >= SHAPE_LIST_LENGTH) {
        tList.shapes.shift();
    }

    tList.shapes.push(newTriangle);
}

function MoveBall(bList, index) {
    var lastBall = bList.shapes[bList.shapes.length - 1];

    //var jumpDist = GetRandom(1, MAX_VELOCITY * SAMPLE_RATE / 1000);
    var jumpDist = lastBall.velocity * SAMPLE_RATE / 1000;

    var randomAngle = 0;

    if (lastBall.direction == NO_ANGLE) {
        randomAngle = GetRandomAngle();
    } else {
        randomAngle = lastBall.direction
        //randomAngle = lastBall.direction - (Math.PI / 8) + (Math.random() / 4 * Math.PI);
    }

    var newBall = GetBallObject(lastBall.x + Math.cos(randomAngle) * jumpDist,
                        lastBall.y + Math.sin(randomAngle) * jumpDist,
                        BALL_RADIUS, randomAngle, lastBall.velocity);

    var newAngle = randomAngle;
    var reflect = false;
    var hittop = false;
    var hitPoint = { "x": 0, "y": 0 };

    if (newBall.x - newBall.radius < LEFT) {
        newBall.x = LEFT + newBall.radius;
        reflect = true;
    } else if (newBall.x + newBall.radius > RIGHT) {
        newBall.x = RIGHT - newBall.radius;
        reflect = true;
    }

    if (newBall.y - newBall.radius < TOP) {
        newBall.y = TOP + newBall.radius;
        hittop = true;
        reflect = true;
    } else if (newBall.y + newBall.radius > BOTTOM) {
        newBall.y = BOTTOM - newBall.radius;
        hittop = true;
        reflect = true;
    }

    if (reflect) {
        newAngle = GetCollisionReflectionAngle(lastBall.x, lastBall.y, newBall.x, newBall.y, hittop);
    }

    // Detect Collisions
    if (newAngle == randomAngle) {

        //var collisionResultAngle = GetCollisionResult(newBall);

        var collisionResultAngle = GetBallCollisionAngle(newBall, index, bList);

        if (collisionResultAngle != NO_ANGLE) {
            newAngle = collisionResultAngle;
        } else {

            // Detect collisions with Triangles

            //collisionResultAngle = GetBallTriangleCollisionAngle(newBall, TriangleList);

            //if (collisionResultAngle != NO_ANGLE) {
                //newAngle = collisionResultAngle;
            //}

        }
    }

    newBall.direction = newAngle;

    if (bList.shapes.length >= SHAPE_LIST_LENGTH) {
        bList.shapes.shift();
    }

    bList.shapes.push(newBall);
}

function DetectBallTriangleCollision(ball, triangle) {
    // First check if a triangle point is inside the circle
    var collided = false;

    collided = PointWithinCircle(ball.x, ball.y, ball.radius, triangle.A.x, triangle.A.y) ||
                    PointWithinCircle(ball.x, ball.y, ball.radius, triangle.B.x, triangle.B.y) ||
                    PointWithinCircle(ball.x, ball.y, ball.radius, triangle.C.x, triangle.C.y);


    if (!collided) {
        // Second sample points along the edges and test

        var sampleRate = 5;

        // Line AB
        var deltaX = triangle.B.x - triangle.A.x;
        var deltaY = triangle.B.y - triangle.A.y;

        for (var i = 1; i <= sampleRate && !collided; i++) {
            var Sx = triangle.A.x + (deltaX * (i / sampleRate));
            var Sy = triangle.A.y + (deltaY * (i / sampleRate));
            collided = PointWithinCircle(ball.x, ball.y, ball.radius, Sx, Sy);

            //DrawLine(ball.x, ball.y, Sx, Sy, 'white');
        }

        // Line BC

        if (!collided) {
            deltaX = triangle.C.x - triangle.B.x;
            deltaY = triangle.C.y - triangle.B.y;

            for (var i = 1; i <= sampleRate && !collided; i++) {
                var Sx = triangle.B.x + (deltaX * (i / sampleRate));
                var Sy = triangle.B.y + (deltaY * (i / sampleRate));
                collided = PointWithinCircle(ball.x, ball.y, ball.radius, Sx, Sy);

               //DrawLine(ball.x, ball.y, Sx, Sy, 'white');
            }
        }

        // Line AC

        if (!collided) {
            deltaX = triangle.C.x - triangle.A.x;
            deltaY = triangle.C.y - triangle.A.y;

            for (var i = 1; i <= sampleRate && !collided; i++) {
                var Sx = triangle.A.x + (deltaX * (i / sampleRate));
                var Sy = triangle.A.y + (deltaY * (i / sampleRate));
                collided = PointWithinCircle(ball.x, ball.y, ball.radius, Sx, Sy);

                //DrawLine(ball.x, ball.y, Sx, Sy, 'white');
            }
        }

    }

    return collided;
}

function DetectBallCollision(ball1, ball2) {

    return Math.sqrt(Math.pow(Math.abs(ball1.x - ball2.x), 2) + Math.pow(Math.abs(ball1.y - ball2.y), 2)) <= (ball1.radius + ball2.radius);
}

function PointWithinCircle(Cx, Cy, Cr, Px, Py) {
    return Math.sqrt(Math.pow(Math.abs(Px - Cx), 2) + Math.pow(Math.abs(Py - Cy), 2)) <= Cr;
}

function DetectTriangleCollision(tri1, tri2) {
    return PointInsideTriangle(tri1.A.x, tri1.A.y, tri2) ||
            PointInsideTriangle(tri1.B.x, tri1.B.y, tri2) ||
            PointInsideTriangle(tri1.C.x, tri1.C.y, tri2);
}

function GetBallTriangleCollisionAngle(ball, trilist) {
    var retVal = NO_ANGLE;

    for (var i = 0; i < trilist.length; i++) {
        var tri = trilist[i].shapes[trilist[i].shapes.length - 1];

        if (DetectBallTriangleCollision(ball, tri)) {

            var tricenter = GetRightTriangleCenter(tri);

            retVal = GetCollisionReflectionAngle(ball.x, ball.y, tricenter.x, tricenter.y, Math.abs(ball.y - tricenter.y) > Math.abs(ball.x - tricenter.x));

            break;
        }
    }

    return retVal;
}


function GetBallCollisionAngle(testBall, index, ballList)
{
    var retVal = NO_ANGLE;

    var hitHand = false;

    if (HandBall.x != NULL_POS && DetectBallCollision(testBall, HandBall)) {
        retVal = GetCollisionReflectionAngle(testBall.x, testBall.y, HandBall.x, HandBall.y, false);
    } else {

        for (var i = 0; i < ballList.length; i++) {
            // Detect collision on main (front) ball only

            if (i != index) {
                var ball = ballList[i].balls[ballList[i].balls.length - 1];

                if (DetectBallCollision(testBall, ball)) {

                    retVal = GetCollisionReflectionAngle(testBall.x, testBall.y, ball.x, ball.y, Math.abs(testBall.y - ball.y) > Math.abs(testBall.x - ball.x));

                    break;
                }
            }
        }
	}
	
	return retVal;
}

function GetTriangleCollisionAngle(tri1) {
    var retVal = NO_ANGLE;

    for (var i = 0; i < trilist.length; i++) {
        if (i != index) {
            var tri = trilist[i].shapes[trilist[i].shapes.length - 1];

            if (DetectTriangleCollision(tri1, tri)) {

                var tri1center = GetRightTriangleCenter(tri1);
                var tricenter = GetRightTriangleCenter(tri);

                retVal = GetCollisionReflectionAngle(tri1center.x, tri1center.y, tricenter.x, tricenter.y, Math.abs(tri1center.y - tricenter.y) > Math.abs(tri1center.x - tricenter.x));

                break;
            }
        }
    }

    return retVal;
}

function GetCollisionReflectionAngle(x1, y1, x2, y2, hittop) {
    var retVal = 0;

    retVal = Math.atan2(y1 - y2, x2 - x1) + (hittop ? 0 : Math.PI);

    return retVal;
}

function GetAngleAtoB(Ax, Ay, Bx, By) {
    return Math.atan2(By - Ay, Bx - Ax);
}

function DrawHand() {
    if (MousePos.x != NULL_POS && MousePos.y != NULL_POS) {
        var ctx = myCanvas.getContext("2d");
        ctx.fillStyle = 'yellow';

        ctx.beginPath();
        ctx.arc(MousePos.x, MousePos.y, HAND_WIDTH, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        ctx.fillStyle = 'black';

        ctx.beginPath();
        ctx.arc(MousePos.x - (HAND_WIDTH * .3), MousePos.y - (HAND_HEIGHT * .4), HAND_WIDTH * .2, 0, 2 * Math.PI);
        ctx.arc(MousePos.x + (HAND_WIDTH * .3), MousePos.y - (HAND_HEIGHT * .4), HAND_WIDTH * .2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.arc(MousePos.x, MousePos.y + HAND_WIDTH * .1, HAND_WIDTH * .5, 0, Math.PI);
        ctx.stroke();
        ctx.closePath();
    }
}

function DrawShapes() {
    for (var i = 0; i < ShapeList.length; i++) {
        DrawShape(ShapeList[i]);
    }
}

function DrawShape(shape) {
    var offSet = 0;

    var shapeList = shape.shapes;
    var color = shape.color;

    offSet = shapeList.length - 1;

    if (shape.cycle >= shapeList.length) { shape.cycle = 0; }

    for (var i = 0; i < shapeList.length; i++) {

        var offsetColor = RGBToHex(Math.floor(color.r * ((SHAPE_LIST_LENGTH - offSet) / SHAPE_LIST_LENGTH)),
										Math.floor(color.g * ((SHAPE_LIST_LENGTH - offSet) / SHAPE_LIST_LENGTH)),
										Math.floor(color.b * ((SHAPE_LIST_LENGTH - offSet) / SHAPE_LIST_LENGTH)));

        if (shape.type == "circle") {
            DrawBall(shapeList[i], i, shapeList.length, shape.cycle, offsetColor);
        } else if (shape.type == "triangle") {
            DrawTriangle(shapeList[i], offsetColor);
        }

        offSet--
    }

    shape.cycle++;
}

function DrawTriangle(t, color) {
    var ctx = myCanvas.getContext("2d");
    ctx.fillStyle = color;

    ctx.beginPath();
    ctx.moveTo(t.A.x, t.A.y);
    ctx.lineTo(t.B.x, t.B.y);
    ctx.lineTo(t.C.x, t.C.y);
    ctx.lineTo(t.A.x, t.A.y);
    ctx.fill();
    ctx.closePath();
}

function DrawLine(x1, y1, x2, y2, color) {
    var ctx = myCanvas.getContext("2d");
    ctx.strokeStyle = color;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
}

function DrawBall(b, index, count, offset, color)
{
	var ctx = myCanvas.getContext("2d");
	ctx.fillStyle = color;


    //*************************************************************************
    //*************************************************************************
    //***********************Apply Sinusoidal Curve****************************
    //*************************************************************************
    //*************************************************************************

    var cyclePosition = index + offset;

    if (cyclePosition >= count) { cyclePosition = cyclePosition % count; }

    var sinusoidalOffset = Math.sin(2 * Math.PI / (count - 1) * cyclePosition);

    var newPos = { x: b.x, y: b.y };

    if (sinusoidalOffset != 0) {
        // So now we need to draw the ball sinusoidalOffset units perpendicular from the movement path

        var newDirection = b.direction + (Math.PI / 2);

        newPos.x += Math.cos(newDirection) * (sinusoidalOffset * BALL_RADIUS * 1.5);
        newPos.y += Math.sin(newDirection) * (sinusoidalOffset * BALL_RADIUS * 1.5);
    
        // Validate NewPos
        if (newPos.x - b.radius < LEFT) {
            newPos.x = LEFT + b.radius;
        } else if (newPos.x + b.radius > RIGHT) {
            newPos.x = RIGHT - b.radius;
        }

        if (newPos.y - b.radius < TOP) {
            newPos.y = TOP + b.radius;
        } else if (newPos.y + b.radius > BOTTOM) {
            newPos.y = BOTTOM - b.radius;
        }

    }
	
	ctx.beginPath();
	ctx.arc(newPos.x, newPos.y, b.radius, 0, 2 * Math.PI);
	ctx.fill();
	ctx.closePath();
}

function GetRandom(min, max)
{
	return Math.floor((Math.random() * (max - min)) + min);
}

function RGBToHex(r, g, b)
{
	return "#" + decimalToHex(r, 2) + decimalToHex(g, 2) + decimalToHex(b, 2);
}

function decimalToHex(d, padding) {
    var hex = Number(d).toString(16);
    padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;

    while (hex.length < padding) {
        hex = "0" + hex;
    }

    return hex;
}

function UpdateVariables()
{
    var balls = parseInt(document.getElementById('ballCount').value);
    var rate = parseInt(document.getElementById('sampleRate').value);
    var radius = parseInt(document.getElementById('radius').value);
    var velocity = parseInt(document.getElementById('velocity').value);
    var triangles = parseInt(document.getElementById('triangles').value);
    
    if (radius > 0) {
        BALL_RADIUS = radius;
        TRIANGLE_RADIUS = radius;
    }

    if (velocity > 0 && velocity != MAX_VELOCITY) {
        MAX_VELOCITY = velocity;
    }

    if (balls != BALL_COUNT) {
        BALL_COUNT = balls;
    }

    if (triangles != TRIANGLE_COUNT) {
        TRIANGLE_COUNT = triangles;
    }
    
    if (rate > 0) {
        SAMPLE_RATE = rate;
    }
}

function Update()
{
	var balls = parseInt(document.getElementById('ballCount').value);
	var rate = parseInt(document.getElementById('sampleRate').value);
	var radius = parseInt(document.getElementById('radius').value);
	var velocity = parseInt(document.getElementById('velocity').value);
	var triangles = parseInt(document.getElementById('triangles').value);
	
	if (radius > 0) {
	    BALL_RADIUS = radius;
	    TRIANGLE_RADIUS = radius;
	}

    if (velocity > 0 && velocity != MAX_VELOCITY) {
        MAX_VELOCITY = velocity;

        /*for (var i = 0; i < TriangleList.length; i++) {
            var list = TriangleList[i].shapes;

            for (var j = 0; j < list.length; j++) {
                list[j].velocity = velocity;
            }
        }

        for (var i = 0; i < BallList.length; i++) {
            var list = BallList[i].balls;

            for (var j = 0; j < list.length; j++) {
                list[j].velocity = velocity;
            }
        }*/
	}
	
	var reRun = true;

    //reRun = balls != BALL_COUNT || triangles != TRIANGLE_COUNT;

	if (balls != BALL_COUNT) {

	    /*if (balls < BALL_COUNT) {
	        for (var i = 0; i < BALL_COUNT - balls; i++) {
	            BallList.pop();
	        }
	    } else {
	        for (var i = 0; i < balls - BALL_COUNT; i++) {
	            BallList.push(GetNewBallList());
	        }
	    }*/

	    BALL_COUNT = balls;
	    reRun = true;
	}

	if (triangles != TRIANGLE_COUNT) {

	    /*if (triangles < TRIANGLE_COUNT) {
	        for (var i = 0; i < TRIANGLE_COUNT - triangles; i++) {
	            TriangleList.pop();
	        }
	    } else {
	        for (var i = 0; i < triangles - TRIANGLE_COUNT; i++) {
	            TriangleList.push(GetNewTriangleList());
	        }
	    }*/

	    TRIANGLE_COUNT = triangles;
	    reRun = true;
	}
	
	if (rate > 0) {
		if (SAMPLE_RATE != rate) {
			if (!reRun) {
				clearInterval(timer);
				timer = setInterval(function () { TimerUpdate() }, rate);
			} else {
				clearInterval(timer);
				timer = null;
			}
		}
		
		SAMPLE_RATE = rate;
	}

    if (reRun) {
		Run();
	}
}

function DetectBallCollision(ball1, ball2) {
	
	return Math.sqrt(Math.pow(Math.abs(ball1.x - ball2.x), 2) + Math.pow(Math.abs(ball1.y - ball2.y), 2)) <= (ball1.radius + ball2.radius);

}

function DetectTriangleCollision(tri1, tri2) {
    return PointInsideTriangle(tri1.A.x, tri1.A.y, tri2) ||
            PointInsideTriangle(tri1.B.x, tri1.B.y, tri2) ||
            PointInsideTriangle(tri1.C.x, tri1.C.y, tri2);
}

function PointInsideTriangle(x, y, tri) {
   var A = TriangleArea(tri.A.x, tri.A.y, tri.B.x, tri.B.y, tri.C.x, tri.C.y);
 
   var A1 = TriangleArea(x, y, tri.B.x, tri.B.y, tri.C.x, tri.C.y);

   var A2 = TriangleArea(tri.A.x, tri.A.y, x, y, tri.C.x, tri.C.y);

   var A3 = TriangleArea(tri.A.x, tri.A.y, tri.B.x, tri.B.y, x, y);
   
   //return (A == A1 + A2 + A3);

   return Math.abs(A - A1 - A2 - A3) <= 0.1;
}

function TriangleArea(x1, y1, x2, y2, x3, y3) {
    return Math.abs(((x1*(y2-y3)) + (x2*(y3-y1)) + (x3*(y1-y2))) / 2.0);
}

function getMousePos(evt) {
    return { x: evt.clientX, y: evt.clientY };
}


function CanvasClicked(evt) {
    
}

function CanvasMouseMove(evt) {
    var pos = getMousePos(evt);

    var rect = myCanvas.getBoundingClientRect();

    pos.x -= rect.left;
    pos.y -= rect.top;

    pos.x *= (myCanvas.width / myCanvas.clientWidth);
    pos.y *= (myCanvas.height / myCanvas.clientHeight);

    if (pos.x > LEFT + HAND_WIDTH && pos.x < RIGHT - HAND_WIDTH && pos.y > TOP + HAND_HEIGHT && pos.y < BOTTOM - HAND_WIDTH) {
        MousePos = pos;
        HandBall.x = pos.x;
        HandBall.y = pos.y;
    }else {
        MousePos.x = NULL_POS;
        MousePos.y = NULL_POS;
        HandBall.x = NULL_POS;
        HandBall.y = NULL_POS;
    }
}

function DrawBorder() {
    var ctx = myCanvas.getContext("2d");
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'white';
    ctx.fillStyle = 'black';

    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    ctx.beginPath();
    ctx.moveTo(LEFT, TOP);
    ctx.lineTo(RIGHT, TOP);
    ctx.lineTo(RIGHT, BOTTOM);
    ctx.lineTo(LEFT, BOTTOM);
    ctx.lineTo(LEFT, TOP);
    ctx.stroke();
    ctx.closePath();
}

function GetBallObject(x, y, radius, direction, velocity) {
    return { "x": x, "y": y, "radius": radius, "direction": direction, "velocity": velocity };
}

function GetTriangleCopy(t)
{
    return GetTriangleObject(t.A.x, t.A.y, t.B.x, t.B.y, t.C.x, t.C.y, t.radius, t.direction, t.velocity, t.rotation);
}

function GetTriangleObject(x1, y1, x2, y2, x3, y3, radius, direction, velocity, rotation) {
    return { "A": { "x": x1, "y": y1 }, "B": { "x": x2, "y": y2 }, "C": { "x": x3, "y": y3}, "radius": radius, "direction": direction, "velocity": velocity, "rotation": rotation };
}

function GetNewTrianglePosition(t, time) {
    var newTriangle = GetTriangleCopy(t);

    // Move the coordinates
    var distance = t.velocity * SAMPLE_RATE / 1000;

    newTriangle.A.x += Math.cos(newTriangle.direction) * distance;
    newTriangle.A.y += Math.sin(newTriangle.direction) * distance;
    newTriangle.B.x += Math.cos(newTriangle.direction) * distance;
    newTriangle.B.y += Math.sin(newTriangle.direction) * distance;
    newTriangle.C.x += Math.cos(newTriangle.direction) * distance;
    newTriangle.C.y += Math.sin(newTriangle.direction) * distance;

    var center = GetRightTriangleCenter(newTriangle);

    // Rotate Coordinates
    var currentAngle = GetAngleAtoB(center.x, center.y, newTriangle.A.x, newTriangle.A.y);

    newTriangle.A.x = center.x + (Math.cos(currentAngle + newTriangle.rotation) * newTriangle.radius);
    newTriangle.A.y = center.y + (Math.sin(currentAngle + newTriangle.rotation) * newTriangle.radius);

    currentAngle = GetAngleAtoB(center.x, center.y, newTriangle.B.x, newTriangle.B.y);

    newTriangle.B.x = center.x + (Math.cos(currentAngle + newTriangle.rotation) * newTriangle.radius);
    newTriangle.B.y = center.y + (Math.sin(currentAngle + newTriangle.rotation) * newTriangle.radius);

    currentAngle = GetAngleAtoB(center.x, center.y, newTriangle.C.x, newTriangle.C.y);

    newTriangle.C.x = center.x + (Math.cos(currentAngle + newTriangle.rotation) * newTriangle.radius);
    newTriangle.C.y = center.y + (Math.sin(currentAngle + newTriangle.rotation) * newTriangle.radius);

    return newTriangle;
}

function GetRightTriangleCenter(triangle)
{
    return { "x": (triangle.A.x + triangle.B.x + triangle.C.x) / 3, "y": (triangle.A.y + triangle.B.y + triangle.C.y) / 3 };
}

function GetRGBObject(r, g, b) {
    return { "r": r, "g": g, "b": b }
}

function GetRandomAngle()
{
    return Math.random() * 2 * Math.PI;
}

function ClearField() {
    var ctx = myCanvas.getContext("2d");
    ctx.clearRect(LEFT, TOP, FIELD_WIDTH, FIELD_HEIGHT);

    ctx.fillStyle = 'black';
    ctx.fillRect(LEFT, TOP, FIELD_WIDTH, FIELD_HEIGHT);
}

function GetNewTriangle() {
    var triangleCenterX = GetRandom(TRIANGLE_RADIUS, FIELD_WIDTH - BALL_RADIUS) - 1 + LEFT;
    var triangleCenterY = GetRandom(TRIANGLE_RADIUS, FIELD_HEIGHT - BALL_RADIUS) - 1 + TOP;

    var direction = GetRandomAngle();

    var Ax = triangleCenterX + Math.cos(direction) * TRIANGLE_RADIUS;
    var Ay = triangleCenterY + Math.sin(direction) * TRIANGLE_RADIUS;

    var nextAngle = direction + (2 * Math.PI / 3);

    var Bx = triangleCenterX + Math.cos(nextAngle) * TRIANGLE_RADIUS;
    var By = triangleCenterY + Math.sin(nextAngle) * TRIANGLE_RADIUS;

    nextAngle = nextAngle + (2 * Math.PI / 3);

    var Cx = triangleCenterX + Math.cos(nextAngle) * TRIANGLE_RADIUS;
    var Cy = triangleCenterY + Math.sin(nextAngle) * TRIANGLE_RADIUS;

    return GetTriangleObject(Ax, Ay, Bx, By, Cx, Cy, TRIANGLE_RADIUS, direction, GetRandom(1, MAX_VELOCITY), TRIANGLE_ROTATION);
}

function GetNewTriangleList()
{
    var list = new Array();

	list.push(GetNewTriangle());

	return { "id": FREE_SHAPE_ID++, "color": GetRandomColor(), "type": "triangle", "shapes": list };
}

function GetRandomColor() {
    return GetRGBObject(GetRandom(1, 256) - 1, GetRandom(1, 256) - 1, GetRandom(1, 256) - 1);
}

function GetNewBallList() {
    var list = new Array();

    list.push(GetBallObject(GetRandom(BALL_RADIUS, FIELD_WIDTH - BALL_RADIUS) - 1 + LEFT, GetRandom(BALL_RADIUS, FIELD_HEIGHT - BALL_RADIUS) - 1 + TOP, BALL_RADIUS, NO_ANGLE, GetRandom(1, MAX_VELOCITY)));

    return { "id": FREE_SHAPE_ID++, "cycle": 0, "color": GetRandomColor(), "type": "circle", "shapes": list };
}

function GetNewDisplayOject(type) {
    var list = new Array();

    list.push(GetBallObject(GetRandom(BALL_RADIUS, FIELD_WIDTH - BALL_RADIUS) - 1 + LEFT, GetRandom(BALL_RADIUS, FIELD_HEIGHT - BALL_RADIUS) - 1 + TOP, BALL_RADIUS, NO_ANGLE, GetRandom(1, MAX_VELOCITY)));

    return { "id": FREE_SHAPE_ID++, "color": GetRandomColor(), "type": "circle", "shapes": list };
}

function UpdateCollisionMap() {
    for (var s = 0; s < ShapeList.length; s++) {

        var shape = ShapeList[s];

        if (CollisionMap[shape.id] == null) {
            CollisionMap[shape.id] = new Array();
        }

        for (var s2 = 0; s2 < ShapeList.length; s2++) {

            if (s2 != s) {

                var shape2 = ShapeList[s2];

                CollisionMap[shape.id][shape2.id] = DetectCollision(shape, shape2);   
            }
        }
    }
}

function UpdateCollisionList() {

    CollisionList = new Array();

    for (var s = 0; s < ShapeList.length; s++) {

        var shape1 = ShapeList[s];

        for (var s2 = s + 1; s2 < ShapeList.length; s2++) {
            var shape2 = ShapeList[s2];

            if (DetectCollision(shape1, shape2)) {
                CollisionList.push({ "shape1": shape1, "shape2": shape2 });
            }
        }
    }
}

function ProcessCollisionList() {
    for (var i = 0; i < CollisionList.length; i++) {
        var shape1 = CollisionList[i].shape1;
        var shape2 = CollisionList[i].shape2;

        console.log("Process Collision");

    }
}

function DetectCollision(shape1, shape2) {
    var retVal = false;
    var ball1 = null, ball2 = null;
    var tri1 = null, tri2 = null;

    if (shape1.type == "circle") {
        ball1 = shape1.shapes[shape1.shapes.length - 1];
    }

    if (shape1.type == "triangle") {
        tri1 = shape1.shapes[shape1.shapes.length - 1];
    }

    if (shape2.type == "circle") {
        ball2 = shape2.shapes[shape2.shapes.length - 1];
    }

    if (shape2.type == "triangle") {
        tri2 = shape2.shapes[shape2.shapes.length - 1];
    }

    if (ball1 != null) {
        if (ball2 != null) {
            retVal = DetectBallCollision(ball1, ball2);
        } else if (tri2 != null) {
             retVal = DetectBallTriangleCollision(ball1, tri2);
        }
    } else if (tri1 != null) {
        if (ball2 != null) {
            retVal = DetectBallTriangleCollision(ball2, tri1);
        } else if (tri2 != null) {
            retVal = DetectTriangleCollision(tri1, tri2);
        }
    }

    return retVal;
}