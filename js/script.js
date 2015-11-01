$(document).ready(function(e) {
	var MAX_HEIGHT = 244;
	var canvas = document.getElementById("myCanvas");
	var canvasd = document.getElementById("dropper");

	function render(src){
		var image = new Image();
		image.onload = function(){
			if(image.height > MAX_HEIGHT) {
				image.width *= MAX_HEIGHT / image.height;
				image.height = MAX_HEIGHT;
			}
			var ctx = canvas.getContext("2d");
			var ctxd = canvasd.getContext("2d");
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			canvas.width = image.width;
			canvas.height = image.height;
			canvasd.width = image.width;
			canvasd.height = image.height;
			ctx.drawImage(image, 0, 0, image.width, image.height);
			ctxd.drawImage(image, 0, 0, image.width, image.height);
		};
		image.src = src;
	}

	// Image show
	function loadImage(src){
		//	Prevent any non-image file type from being read.
		if(!src.type.match(/image.*/)){
			alert("The dropped file is not an image: ", src.type);
			return;
		}

		//	Create FileReader and run the results through the render function.
		var reader = new FileReader();
		reader.onload = function(e){
			render(e.target.result);
		};
		reader.readAsDataURL(src);
	}

	// Drag & Drop
	var target = document.getElementById("dropper");

	target.addEventListener("dragover", function(e){
		e.preventDefault();
	}, true);

	target.addEventListener("drop", function(e){
		e.preventDefault(); 
		loadImage(e.dataTransfer.files[0]);
	}, true);

	// Threshold

	function convertCanvasToImage(canvas) {
		var image = new Image();
		image.src = canvas.toDataURL("image/png");
		image.id = "dimg";
		return image;
	}

	function filter(threshold) {
		var c = document.getElementById("myCanvas");
		var ctx = c.getContext("2d");
		var img = document.getElementById("dimg");
		ctx.drawImage(img, 0, 0);
		var imgData = ctx.getImageData(0, 0, c.width, c.height);
		var d = imgData.data;
		// threshold
		var i;
		for (i = 0; i < d.length; i+=4) {
			var r = d[i];
			var g = d[i+1];
			var b = d[i+2];
			var v = (0.2126*r + 0.7152*g + 0.0722*b >= threshold) ? 255 : 0;
			d[i] = d[i+1] = d[i+2] = v
		}
		ctx.putImageData(imgData, 0, 0);
	}

	$('#myRange').one('mousemove', function() {
		document.getElementById("holder").appendChild(convertCanvasToImage(canvas));
		$('#dimg').css('display', 'none');
		x = $('#myRange').val();
		filter(x);
	});

	$('#myRange').on('mousemove', function(){
		x = $('#myRange').val()
		$('#thresholdval').text(x);
		convertCanvasToImage(canvas);
		$('#dimg').css('display', 'none');
		filter(x);
	});
});