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
  image(video, 0, 0, width, height);

  if (predictions.length > 0) {
    let keypoints = predictions[0].scaledMesh;

    // 指定的點的編號
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
      vertex(x, y);
    }
    endShape(CLOSE); // 將最後一點與第一點連接
  }
}
