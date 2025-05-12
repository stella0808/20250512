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
  // 計算影像的繪製比例
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

  // 反轉畫布的 X 軸
  push(); // 儲存當前繪圖狀態
  translate(width, 0); // 將畫布平移到右側
  scale(-1, 1); // 水平翻轉畫布

  // 繪製影像，保持比例
  image(video, 0, 0, drawWidth, drawHeight);

  pop(); // 恢復繪圖狀態

  if (predictions.length > 0) {
    let keypoints = predictions[0].scaledMesh;

    // 嘴唇的特徵點
    let points = [409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291];

    // 設定線條樣式
    stroke(0, 0, 255); // 藍色
    strokeWeight(5);
    noFill();

    // 畫線將所有點串接在一起
    beginShape();
    for (let i = 0; i < points.length; i++) {
      let index = points[i];
      let [x, y] = keypoints[index];

      // 映射特徵點到畫布大小
      x = map(x, 0, video.width, 0, drawWidth);
      y = map(y, 0, video.height, 0, drawHeight);

      // 反轉 X 座標
      x = width - x;

      vertex(x, y);
    }
    endShape(CLOSE); // 將最後一點與第一點連接
  }
}
