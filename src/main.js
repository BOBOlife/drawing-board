var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var lineWidth = 5;
var enabled = false;
var imageDataFragment;

autoSetCanvasSize(canvas);

listenToUser(canvas);

clear.onclick = function() {context.clearRect(0, 0, canvas.width, canvas.height);};
download.onclick = function() {
  var compositeOperation = context.globalCompositeOperation;
  context.globalCompositeOperation = "destination-over";
  context.fillStyle = "#fff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  var imageData = canvas.toDataURL("image/png");
  context.putImageData(context.getImageData(0, 0, canvas.width, canvas.height),0,0);
  context.globalCompositeOperation = compositeOperation;
  var a = document.createElement("a");
  document.body.appendChild(a);
  a.href = imageData;
  a.download = "myPaint";
  a.target = "_blank";
  a.click();
};

black.onclick = function() {
  context.fillStyle = "black";
  context.strokeStyle = "black";
  black.classList.add("active");
  red.classList.remove("active");
  green.classList.remove("active");
  blue.classList.remove("active");
};
red.onclick = function() {
  context.fillStyle = "red";
  context.strokeStyle = "red";
  red.classList.add("active");
  green.classList.remove("active");
  blue.classList.remove("active");
  black.classList.remove("active");
};
green.onclick = function() {
  context.fillStyle = "green";
  context.strokeStyle = "green";
  green.classList.add("active");
  red.classList.remove("active");
  blue.classList.remove("active");
  black.classList.remove("active");
};
blue.onclick = function() {
  context.fillStyle = "blue";
  context.strokeStyle = "blue";
  blue.classList.add("active");
  green.classList.remove("active");
  red.classList.remove("active");
  black.classList.remove("active");
};
currentColor.onclick = function(e) {
  context.fillStyle = e.target.value;
  context.strokeStyle = e.target.value;
  blue.classList.remove("active");
  green.classList.remove("active");
  red.classList.remove("active");
  black.classList.remove("active");
};
currentColor.onchange = function(e) {
  context.fillStyle = e.target.value;
  context.strokeStyle = e.target.value;
  switch (e.target.value) {
    case "#000000":
      black.classList.add("active");
      break;
    case "#ff0000":
      red.classList.add("active");
      break;
    case "#008000":
      green.classList.add("active");
      break;
    case "#0000ff":
      blue.classList.add("active");
      break;
  }
};
range.onchange = function(e) {
  lineWidth = e.target.value * 1;
};

function autoSetCanvasSize(canvas) {
  canvasSize();
  window.onresize = function() {
    canvasSize();
  };
}

function canvasSize() {
  canvas.width = document.documentElement.clientWidth;
  canvas.height = document.documentElement.clientHeight;
}

function drawLine(x1, y1, x2, y2) {
  context.beginPath();
  context.moveTo(x1, y1);
  context.lineWidth = lineWidth;
  context.lineTo(x2, y2);
  context.stroke();
  context.closePath();
}

function drawCircle(x, y, radius) {
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.fill();
}

function listenToUser(canvas) {
  var using = false;
  var lastPoint = {
    x: undefined,
    y: undefined
  };
  //特性检测
  if (document.body.ontouchstart === undefined) {
    //非触屏设备
    canvas.onmousedown = function(a) {
      var x = a.clientX;
      var y = a.clientY;
      using = true;
      if (enabled) {
        clearRect(x, y);
      } else {
        lastPoint = {
          x: x,
          y: y
        };
      }
    };
    canvas.onmousemove = function(a) {
      var x = a.clientX;
      var y = a.clientY;
      if (!using) {
        return;
      }
      if (enabled) {
        clearRect(x, y);
      } else {
        var newPoint = {
          x: x,
          y: y
        };
        drawCircle(x, y, lineWidth / 2);
        drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y);
        lastPoint = newPoint;
      }
    };
    canvas.onmouseup = function() {
      using = false;
    };
  } else {
    //触屏设备
    canvas.ontouchstart = function(a) {
      var x = a.touches[0].clientX;
      var y = a.touches[0].clientY;
      using = true;
      if (enabled) {
        clearRect(x, y);
      } else {
        lastPoint = {
          x: x,
          y: y
        };
      }
    };
    canvas.ontouchmove = function(a) {
      var x = a.touches[0].clientX;
      var y = a.touches[0].clientY;
      if (!using) {
        return;
      }
      if (enabled) {
        clearRect(x, y);
      } else {
        var newPoint = {
          x: x,
          y: y
        };
        drawCircle(x, y, lineWidth / 2);
        drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y);
        lastPoint = newPoint;
      }
    };
    canvas.ontouchend = function() {
      using = false;
    };
  }
}
document.body.addEventListener(
  "touchmove",
  function(e) {
    e.preventDefault();
  },
  { passive: false }
);