let facemesh;
let video;
let predictions = [];

function setup() {
  createCanvas(640, 480);
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
  // 計算比例，讓影像適應畫布而不變形
  let videoAspect = video.width / video.height;
  let canvasAspect = width / height;

  let drawWidth, drawHeight;
  if (videoAspect > canvasAspect) {
    drawWidth = width;
    drawHeight = width / videoAspect;
  } else {
    drawHeight = height;
    drawWidth = height * videoAspect;
  }

  // 繪製影像，保持比例
  image(video, 0, 0, drawWidth, drawHeight);

  if (predictions.length > 0) {
    let keypoints = predictions[0].scaledMesh;

    let points = [409,270,269,267,0,37,39,40,185,61,146,91,181,84,17,314,405,321,375,291];

    stroke(0, 0, 255);
    strokeWeight(5);
    noFill();

    beginShape();
    for (let i = 0; i < points.length; i++) {
      let index = points[i];
      let [x, y] = keypoints[index];
      vertex(x, y);
    }
    endShape(CLOSE);
  }
}
