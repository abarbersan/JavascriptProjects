var WIDTH = 1000;
var HEIGHT = 1000;

var BoardLines = new Array();

var Num_Board_Lines = 4;

var MyCanvas = null;
var MyCtx = null;

var LINE_ORIENTATIONS = { Colinear: 0, Clockwise: 1, Counterclockwise: 2 };

function Run()
{
    MyCanvas = document.getElementById('myCanvas');

    WIDTH = MyCanvas.width;
    HEIGHT = MyCanvas.height;

    MyCtx = MyCanvas.getContext("2d");

    MyCanvas.addEventListener("mousedown", tttStartCanvasMouseDown, false);

    RefreshBoard();
}

function RefreshBoard()
{
    MyCtx.clearRect(0, 0, WIDTH, HEIGHT);

    MyCtx.fillStyle = 'black';
    MyCtx.fillRect(0, 0, WIDTH, HEIGHT);

    MyCtx.strokeStyle = 'white';
    MyCtx.lineWidth = .04 * WIDTH;
    MyCtx.lineCap = 'round';

    for (var i = 0; i < BoardLines.length; i++)
    {
        MyCtx.beginPath();

        var color = 'red';
        if (i == 1) color = 'lime'
        else if (i == 2) color = 'blue'
        else if (i == 3) color = 'yellow';

        MyCtx.strokeStyle = color;

        MyCtx.moveTo(BoardLines[i].Start.x, BoardLines[i].Start.y);
        MyCtx.lineTo(BoardLines[i].End.x, BoardLines[i].End.y);
        
        MyCtx.stroke();
        MyCtx.closePath();
    }
}

function tttStartCanvasMouseDown(evt)
{
    if (BoardLines.length < Num_Board_Lines)
    {
        BoardLines.push({ Start: GetCanvasPos(evt), End: null});

        MyCanvas.addEventListener("mouseup", tttStartCanvasMouseUp, false);
    } else {
        ValidateLines();
    }
}

function ValidateLines()
{
    var rgIntersect = doIntersect(BoardLines[0].Start, BoardLines[0].End,
                            BoardLines[1].Start, BoardLines[2].End);

    alert("rgIntersect: " + rgIntersect);
}

function GetCanvasPos(evt)
{
    var rect = evt.currentTarget.getBoundingClientRect();
    return { x: (evt.clientX - rect.left) * evt.currentTarget.width / rect.width, 
                y: (evt.clientY - rect.top) * evt.currentTarget.width / rect.height };
}

function tttStartCanvasMouseUp(evt)
{
    BoardLines[BoardLines.length - 1].End = GetCanvasPos(evt);

    MyCanvas.removeEventListener("mouseup", tttStartCanvasMouseUp, false);

    RefreshBoard();
}

function onSegment(a, b, test)
{

    return (test.x <= Math.max(a.x, b.x) && test.x >= Math.min(a.x, b.x) &&
        test.y <= Math.max(a.y, b.y) && test.y >= Math.min(a.y, b.y))
}

// 0 --> a, b and c are colinear
// 1 --> Clockwise
// 2 --> Counterclockwise

function getOrientation(a, b, test)
{
    var retVal = -1;

    // See 10th slides from following link for derivation of the formula
    // http://www.dcs.gla.ac.uk/~pat/52233/slides/Geometry1x1.pdf
    var val = (test.y - a.y) * (b.x - test.x) -
              (test.x - a.x) * (b.y - test.y);
 
    if (val == 0) {
        retVal = 0;     // colinear
    } else {
        retVal =  (val > 0)? 1 : 2; // clock or counterclock wise
    }
 
    return retVal;
}

function doIntersect(a, b, x, y)
{
    var retVal = false;

    // Find the four orientations needed for general and
    // special cases
    var o1 = getOrientation(a, x, b);
    var o2 = getOrientation(a, x, y);
    var o3 = getOrientation(b, y, a);
    var o4 = getOrientation(b, y, x);
 
    retVal = ((o1 != o2 && o3 != o4) // General case
            ||
            (o1 == 0 && onSegment(a, b, x)) // a, x and b are colinear and b lies on segment ax
            ||
            (o2 == 0 && onSegment(a, y, x)) // a, x and b are colinear and y lies on segment ax
            ||
            (o3 == 0 && onSegment(b, a, y)) // b, y and a are colinear and a lies on segment by
            ||
            (o4 == 0 && onSegment(b, x, y))) // b, y and x are colinear and x lies on segment by

    return retVal;
}