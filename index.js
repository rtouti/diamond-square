var canvas = document.getElementsByTagName("canvas")[0],
	ctx	   = canvas.getContext("2d");
//var size	   = 1024+1;

generate(1024+1);

function generate(size){
	var map = build_map(size);
	var imageData = ctx.createImageData(size, size);
	var data = imageData.data;
	for(var i = 0; i < data.length; i+=4){
		var rgb = Math.round(map[i/4]*255);
		if(rgb < 150){
			data[i+0] = 0; data[i+1] = 0; data[i+2] = (rgb < 50) ? 50 : rgb;
		}
		else if(rgb < 210){
			data[i+0] = Math.round(rgb/2); data[i+1] = rgb; data[i+2] = Math.round(rgb/2);
		}
		else{
			data[i+0] = rgb; data[i+1] = rgb; data[i+2] = rgb;
		}
		
		data[i+3] = 255;
	}
	ctx.putImageData(imageData, 0, 0);
}

function build_map(size){
	//console.log(size);
	var map = new Array(size*size);
	
	//Initialize the 4 corners
	map[0 + 0*size] = Math.random();
	map[(size-1) + 0*size] = Math.random();
	map[(size-1) + (size-1)*size] = Math.random();
	map[0 + (size-1)*size] = Math.random();
	
	var e = 0.3;
	diamond(map, size, 0, 0, size-1, size-1, e);
	
	return map;
}

function diamond(map, size, x1, y1, x2, y2, e){
	var mid_x = (x1+x2)/2;
	var mid_y = (y1+y2)/2;
	var mean  = (map[x1+y1*size] + map[x2+y1*size] + map[x2+y2*size] + map[x1+y2*size]) / 4.0;
	
	var r = Math.random()*2.0 - 1.0;
	map[mid_x + mid_y*size] = mean + r*e;
	
	square(map, size, [mid_x, y1-(mid_y-y1), mid_x, mid_y, x2, y1, x1, y1], mid_x, y1, e);		//Up
	square(map, size, [mid_x, mid_y, mid_x, y2+(y2-mid_y), x2, y2, x1, y2], mid_x, y2, e);		//Down
	square(map, size, [x2, y1, x2, y2, x2+(x2-mid_x), mid_y, mid_x, mid_y], x2, mid_y, e);		//Right
	square(map, size, [x1, y1, x1, y2, mid_x, mid_y, x1-(mid_x-x1), mid_y], x1, mid_y, e);		//Left
	
	if(mid_x-x1 > 1){
		e *= 0.7;
		diamond(map, size, mid_x, y1, x2, mid_y, e);		//Top-right
		diamond(map, size, x1, y1, mid_x, mid_y, e);		//Top-left
		diamond(map, size, x1, mid_y, mid_x, y2, e);		//Bottom-left
		diamond(map, size, mid_x, mid_y, x2, y2, e);		//Bottom-right
	}
}

function square(map, size, points, diamond_mid_x, diamond_mid_y, e){
	var mean  = 0.0,
		count = 0;
	
	//If the value has already been set in a previous call, return
	if(map[diamond_mid_x + diamond_mid_y*size] !== undefined)
		return;
	
	for(var i = 0; i < points.length; i+=2){
		var x = points[i],
			y = points[i+1];
		
		if(x < 0)
			x = size+x;
		if(x >= size)
			x = x-size-1;
		if(y < 0)
			y = size+y;
		if(y >= size)
			y = y-size-1;
		if(map[x + y*size] === undefined)
			continue;
		
		mean += map[x + y*size];
		count++;
	}
	
	var r = Math.random()*2.0 - 1.0;
	map[diamond_mid_x + diamond_mid_y*size] = mean/count + r*e;
}

var select_input = document.getElementsByTagName("select")[0];

document.getElementsByTagName("input")[0].addEventListener("click", function(e){
	generate(parseInt(select_input.options[select_input.selectedIndex].value));
});
select_input.addEventListener("change", function(e){
	var size = parseInt(e.target.options[e.target.selectedIndex].value);
	canvas.width = size;
	canvas.height = size;
	generate(size);
});

