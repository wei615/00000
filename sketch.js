// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];
let circleX = 320; // Initial X position of the circle
let circleY = 240; // Initial Y position of the circle
const circleRadius = 50; // Radius of the circle

function preload() {
  // Initialize HandPose model with flipped video input
  handPose = ml5.handPose({ flipped: true });
}

function mousePressed() {
  console.log(hands);
}

function gotHands(results) {
  hands = results;
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  // Start detecting hands
  handPose.detectStart(video, gotHands);
}

function draw() {
  image(video, 0, 0);

  // Draw the circle
  fill(0, 255, 0, 150); // Semi-transparent green
  noStroke();
  ellipse(circleX, circleY, circleRadius * 2);

  // Ensure at least one hand is detected
  if (hands.length > 0) {
    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        // Loop through keypoints and draw circles
        for (let i = 0; i < hand.keypoints.length; i++) {
          let keypoint = hand.keypoints[i];

          // Color-code based on left or right hand
          if (hand.handedness == "Left") {
            fill("#ff006e");
          } else {
            fill("#8338ec");
          }

          noStroke();
          circle(keypoint.x, keypoint.y, 16);
        }

        // Check if both the index finger (keypoint 8) and thumb (keypoint 4) are touching the circle
        let indexFinger = hand.keypoints[8];
        let thumb = hand.keypoints[4];

        let indexDistance = dist(indexFinger.x, indexFinger.y, circleX, circleY);
        let thumbDistance = dist(thumb.x, thumb.y, circleX, circleY);

        if (
          indexDistance <= circleRadius &&
          thumbDistance <= circleRadius
        ) {
          // Move the circle to follow the midpoint between the index finger and thumb
          circleX = (indexFinger.x + thumb.x) / 2;
          circleY = (indexFinger.y + thumb.y) / 2;
        }
      }
    }
  }
}
