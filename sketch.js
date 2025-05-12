let facemesh;
let video;
let predictions = [];

function setup() {
  createCanvas(640,480); // 畫布大小設置為螢幕大小
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  // 初始化 facemesh
  facemesh = ml5.facemesh(video, modelReady);

  // 確保事件監聽器正確綁定
  facemesh.on("predict", (results) => {
    predictions = results;
  });
}

function modelReady() {
  console.log("Facemesh model loaded!");
}

function draw() {
  // 計算影像的繪製比例
  let videoAspect = video.width / video.height;
  let canvasAspect = width / height;

  let drawWidth, drawHeight, offsetX, offsetY;
  if (videoAspect > canvasAspect) {
    drawWidth = width;
    drawHeight = width / videoAspect;
    offsetX = 0;
    offsetY = (height - drawHeight) / 2; // 垂直居中
  } else {
    drawHeight = height;
    drawWidth = height * videoAspect;
    offsetX = (width - drawWidth) / 2; // 水平居中
    offsetY = 0;
  }

  // 繪製影像，保持比例並居中
  image(video, offsetX, offsetY, drawWidth, drawHeight);

  if (predictions.length > 0) {
    let keypoints = predictions[0].scaledMesh;

    // 嘴唇的特徵點
    let mouthPoints = [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 375, 321, 405, 314, 17, 84, 181, 91, 146];
    drawFeature(keypoints, mouthPoints, color(0, 0, 255)); // 藍色線條

    // 左眼的特徵點
    let leftEyePoints = [243, 190, 56, 28, 27, 29, 30, 247, 130, 25, 110, 24, 23, 22, 26, 112];
    drawFeature(keypoints, leftEyePoints, color(255, 255, 0)); // 黃色線條

    // 右眼的特徵點
    let rightEyePoints = [359, 467, 260, 259, 257, 258, 286, 414, 463, 341, 256, 252, 253, 254, 339, 255];
    drawFeature(keypoints, rightEyePoints, color(0, 255, 0)); // 綠色線條
  }
}

// 繪製特徵點的通用函數
function drawFeature(keypoints, points, strokeColor) {
  stroke(strokeColor); // 設定線條顏色
  strokeWeight(5);
  noFill();

  beginShape();
  for (let i = 0; i < points.length; i++) {
    let index = points[i];
    let [x, y] = keypoints[index];

    // 映射特徵點到畫布大小
    x = map(x, 0, video.width, offsetX, offsetX + drawWidth);
    y = map(y, 0, video.height, offsetY, offsetY + drawHeight);

    vertex(x, y);
  }
  endShape(CLOSE); // 將最後一點與第一點連接
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // 當螢幕大小改變時調整畫布
}
