var MOUSE_ANIMATION_STEPS = 20;

function DrawMouse(x, y, length, direction, animationIndex, ctx)
    {
        // DRAW BACKGROUND FOR REFERENCE
        ctx.fillStyle = "white"
        ctx.strokeStyle = "white";
        //ctx.fillRect(x - (length / 2),y - (length / 2),length,length);

        ctx.fillStyle = '#D1E8DD';

        var bodyCenter = { x: x + (Math.cos(direction) * length / 8), y: y + (Math.sin(direction) * length / 8), radius: length / 3 };

        var frontPos = { x: bodyCenter.x + (Math.cos(direction) * bodyCenter.radius),
                        y: bodyCenter.y + (Math.sin(direction) * bodyCenter.radius),
                        radius: length / 30 };

        var tailDirection = direction + Math.PI;

        var tailPos = { x: bodyCenter.x + (Math.cos(tailDirection) * bodyCenter.radius) 
                                    + (Math.cos(direction) * length / 12),
                        y: bodyCenter.y + (Math.sin(tailDirection) * bodyCenter.radius) 
                                    + (Math.sin(direction) * length / 12),
                        radius: length / 20 };

        var bodyCurveOffset1 = Math.PI * .3;
        var bodyCurveLength1 = length * 2 / 3;

        var bodyCurveOffset2 = Math.PI / 20;
        var bodyCurveLength2 = length / 2;

        ctx.beginPath();
        ctx.moveTo(frontPos.x, frontPos.y);

        ctx.bezierCurveTo(frontPos.x + (Math.cos(tailDirection + bodyCurveOffset1) * bodyCurveLength1),
                            frontPos.y + (Math.sin(tailDirection + bodyCurveOffset1) * bodyCurveLength1),
                            frontPos.x + (Math.cos(tailDirection + bodyCurveOffset2) * bodyCurveLength2),
                            frontPos.y + (Math.sin(tailDirection + bodyCurveOffset2) * bodyCurveLength2),
                            tailPos.x, tailPos.y);

        ctx.moveTo(frontPos.x, frontPos.y);

        ctx.bezierCurveTo(frontPos.x + (Math.cos(tailDirection - bodyCurveOffset1) * bodyCurveLength1),
                            frontPos.y + (Math.sin(tailDirection - bodyCurveOffset1) * bodyCurveLength1),
                            frontPos.x + (Math.cos(tailDirection - bodyCurveOffset2) * bodyCurveLength2),
                            frontPos.y + (Math.sin(tailDirection - bodyCurveOffset2) * bodyCurveLength2),
                            tailPos.x, tailPos.y);


        ctx.stroke();
        ctx.fill();
        ctx.closePath();

        // Draw Ears
        var earOffset1 = Math.PI / 7;
        var earOffset2 = Math.PI / 9;
        var earControl = Math.PI / 8;
        var earDist = length / 3;

        ctx.lineWidth = length / 100;
        ctx.strokeStyle = "#AAAAAA";
        ctx.fillStyle = 'black';

        ctx.beginPath();

        ctx.moveTo(frontPos.x + Math.cos(tailDirection + earOffset1) * earDist,
                    frontPos.y + Math.sin(tailDirection + earOffset1) * earDist)

        ctx.quadraticCurveTo(frontPos.x + Math.cos(tailDirection + earControl) * length / 4,
                    frontPos.y + Math.sin(tailDirection + earControl) * length / 4,
                    frontPos.x + Math.cos(tailDirection + earOffset2) * earDist,
                    frontPos.y + Math.sin(tailDirection + earOffset2) * earDist)
        ctx.stroke();
        ctx.closePath();

        // Draw Eyes

        var eyeOffset = Math.PI / 8;
        var eyeDist = length / 6;

        ctx.fillStyle = 'black';

        ctx.beginPath();
        ctx.arc(frontPos.x + Math.cos(tailDirection + eyeOffset) * eyeDist,
                frontPos.y + Math.sin(tailDirection + eyeOffset) * eyeDist,
                frontPos.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(frontPos.x + Math.cos(tailDirection - eyeOffset) * eyeDist,
                frontPos.y + Math.sin(tailDirection - eyeOffset) * eyeDist,
                frontPos.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        // Nose
        var noseDist = length / 20;
        ctx.beginPath();

        ctx.arc(frontPos.x + Math.cos(tailDirection) * noseDist,
                frontPos.y + Math.sin(tailDirection) * noseDist,
                length / 40, 0, 2 * Math.PI);

        ctx.fill();
        ctx.closePath();

        // Draw Wiskers
        ctx.strokeStyle = 'black';
        ctx.beginPath();

        ctx.moveTo(frontPos.x + Math.cos(tailDirection + (Math.PI / 16)) * length / 16,
                frontPos.y + Math.sin(tailDirection + (Math.PI / 16)) * length / 16);

        ctx.quadraticCurveTo(frontPos.x + (Math.cos(tailDirection + (Math.PI / 16)) * length / 8),
                    frontPos.y + (Math.sin(tailDirection + (Math.PI / 16)) * length / 8),
                    frontPos.x + (Math.cos(tailDirection + (Math.PI / 2)) * length / 8),
                    frontPos.y + (Math.sin(tailDirection + (Math.PI / 2)) * length / 8));

        ctx.moveTo(frontPos.x + Math.cos(tailDirection + (Math.PI / 16)) * length / 16,
                frontPos.y + Math.sin(tailDirection + (Math.PI / 16)) * length / 16);

        ctx.quadraticCurveTo(frontPos.x + (Math.cos(tailDirection - (Math.PI / 16)) * length / 8),
                    frontPos.y + (Math.sin(tailDirection - (Math.PI / 16)) * length / 8),
                    frontPos.x + (Math.cos(tailDirection - (Math.PI / 2)) * length / 8),
                    frontPos.y + (Math.sin(tailDirection - (Math.PI / 2)) * length / 8));

        ctx.stroke();
        ctx.closePath();

        // Draw Animated Tail

        ctx.fillStyle = '#AABDB3';

        ctx.beginPath();
        ctx.arc(tailPos.x, tailPos.y, tailPos.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        // Terminal Point of Tail
        var angle = tailDirection - (Math.PI / 8);
        var tailEndpoint = { x: tailPos.x + (Math.cos(angle) * length / 3), 
                                y: tailPos.y + (Math.sin(angle) * length / 3) };

        ctx.beginPath();
        ctx.moveTo(tailPos.x, tailPos.y);

        var controlPoints = GetTailControlPoints(tailPos.x, tailPos.y, tailDirection, length, animationIndex);

        ctx.bezierCurveTo(controlPoints.ctrlPtn1.x,controlPoints.ctrlPtn1.y,    // Control Point 1
                            controlPoints.ctrlPtn2.x,controlPoints.ctrlPtn2.y,  // Control Point 2
                            tailEndpoint.x,tailEndpoint.y);                     // Endpoint

        ctx.lineTo(tailEndpoint.x, tailEndpoint.y);

        ctx.strokeStyle = "#5C6661";
        ctx.lineCap = 'round';
        ctx.lineWidth = length / 20;
        ctx.stroke();

        ctx.strokeStyle = "white";
        ctx.lineWidth = length / 30;
        ctx.stroke();
        ctx.closePath();

        // Print Lines to the control points
        /*ctx.beginPath();
        ctx.strokeStyle = "green";
        ctx.moveTo(tailPos.x, tailPos.y);
        ctx.lineTo(controlPoints.ctrlPtn1.x, controlPoints.ctrlPtn1.y);
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.moveTo(tailPos.x, tailPos.y);
        ctx.lineTo(controlPoints.ctrlPtn2.x, controlPoints.ctrlPtn2.y);
        ctx.stroke();
        ctx.closePath();*/
    }

function GetTailControlPoints(startX, startY, direction, length, animationIndex) {
	if (animationIndex > MOUSE_ANIMATION_STEPS - 1) {
		animationIndex = (animationIndex % (MOUSE_ANIMATION_STEPS - 1)) - 1;
	}

	var direction1 = direction + (Math.PI / 3);
	var direction2 = direction - (Math.PI / 3);
	var dist1 = length / 3;
	var dist2 = length / 3;

	switch(animationIndex) {
		case 1:
			direction1 = direction + (Math.PI / 3);
			direction2 = direction - (Math.PI / 3);
			break;
		case 2:
			direction1 = direction + (Math.PI / 4);
			direction2 = direction - (Math.PI / 3);
			break;
		case 3:
			direction1 = direction + (Math.PI / 5);
			direction2 = direction - (Math.PI / 4);
			break;
		case 4:
			direction1 = direction + (Math.PI / 6);
			direction2 = direction - (Math.PI / 4);
			break;
		case 5:
			direction1 = direction + (Math.PI / 7);
			direction2 = direction - (Math.PI / 5);
			break;
		case 6:
			direction1 = direction + (Math.PI / 8);
			direction2 = direction - (Math.PI / 5);
			break;
		case 7:
			direction1 = direction;
			direction2 = direction - (Math.PI / 6);
			break;
		case 8:
			direction1 = direction - (Math.PI / 8);
			direction2 = direction - (Math.PI / 6);
			break;
		case 9:
			direction1 = direction - (Math.PI / 4);
			direction2 = direction - (Math.PI / 8);
			break;
		case 10:
			direction1 = direction - (Math.PI / 4);
			direction2 = direction - (Math.PI / 8);
			break;
		case 11:
			direction1 = direction - (Math.PI / 8);
			direction2 = direction - (Math.PI / 6);
			break;
		case 12:
			direction1 = direction;
			direction2 = direction - (Math.PI / 6);
			break;
		case 13:
			direction1 = direction + (Math.PI / 8);
			direction2 = direction - (Math.PI / 5);
			break;
		case 14:
			direction1 = direction + (Math.PI / 7);
			direction2 = direction - (Math.PI / 5);
			break;
		case 15:
			direction1 = direction + (Math.PI / 6);
			direction2 = direction - (Math.PI / 4);
			break;
		case 16:
			direction1 = direction + (Math.PI / 5);
			direction2 = direction - (Math.PI / 4);
			break;
		case 17:
			direction1 = direction + (Math.PI / 4);
			direction2 = direction - (Math.PI / 3);
			break;
		case 18:
			direction1 = direction + (Math.PI / 3);
			direction2 = direction - (Math.PI / 3);
			break;
	}

	var pt1 = { x: startX + Math.cos(direction1) * dist1, 
						y: startY + Math.sin(direction1) * dist1 };

	var pt2 = { x: startX + Math.cos(direction2) * dist2, 
						y: startY + Math.sin(direction2) * dist2 };

	return { ctrlPtn1: { x: pt1.x, y: pt1.y }, ctrlPtn2: { x: pt2.x, y: pt2.y } };
}