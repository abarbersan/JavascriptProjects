	var WIDTH = 1000;
	var HEIGHT = 1000;

    var Progress_Test_1 = 

    { FontSize: 10, Font: "Arial", Steps: [ "Start", "Second", "Third", "Fourth", "End"]};

	function Run()
	{
	    var canvas = document.getElementById('myCanvas');

	    WIDTH = canvas.width;
	    HEIGHT = canvas.height;

	    var ctx = canvas.getContext("2d");

        DrawProgress(ctx, WIDTH, HEIGHT, Progress_Test_1, 3);
	}

    function DrawProgress(ctx, width, height, obj, step) {

        var steps = obj.Steps.length;

        ctx.clearRect(0, 0, width, height);

        var r = width / (4 * steps);

        ctx.fillStyle = 'blue';
        ctx.strokeStyle = 'blue';

        ctx.font = obj.FontSize + "px " + obj.Font;
        
        for (var i = 0; i < steps; i++) {
            ctx.beginPath();

            var stepCenter = (i * 4 * r) + (2 * r);

            ctx.arc(stepCenter, height / 2, r, 0, 2 * Math.PI);

            if (i < step) {
                ctx.fill();
            } else {
                ctx.stroke();
            }

            ctx.closePath();

            ctx.lineWidth = r / 10;

            if (i > 0) {
                ctx.beginPath();
                ctx.moveTo(r + (i * 2 * r), height / 2);
                ctx.lineTo((i * 2 * r) + (3 * r), height / 2);
                ctx.stroke();
                ctx.closePath();
            }

            var textSize = ctx.measureText(obj.Steps[i]);

            ctx.fillText(obj.Steps[i], stepCenter - (textSize.width / 2), (height / 2) - r - (obj.FontSize * 1.2));

        }
    }