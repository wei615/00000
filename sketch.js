// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];
let circleX = 320; // Initial X position of the circle
let circleY = 240; // Initial Y position of the circle
const circleRadius = 50; // Radius of the circle
let isDrawingRight = false; // Flag to track if the right hand is drawing
let isDrawingLeft = false; // Flag to track if the left hand is drawing
let trails = []; // Array to store all trails (each trail has color and points)
let circleColor = "#00ff00"; // Default color of the circle (green)

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

  // Draw all trails
  for (let trail of trails) {
    stroke(trail.color);
    strokeWeight(100); // Set line thickness to 100
    noFill();
    beginShape();
    for (let point of trail.points) {
      vertex(point.x, point.y);
    }
    endShape();
  }

  // Draw the circle
  fill(circleColor); // Use the current circle color
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
        let thumb = hand.keypoints[4];
        let indexFinger = hand.keypoints[8];

        let thumbDistance = dist(thumb.x, thumb.y, circleX, circleY);
        let indexDistance = dist(indexFinger.x, indexFinger.y, circleX, circleY);

        if (thumbDistance <= circleRadius && indexDistance <= circleRadius) {
          // Move the circle to follow the midpoint between the thumb and index finger
          circleX = (thumb.x + indexFinger.x) / 2;
          circleY = (thumb.y + indexFinger.y) / 2;

          // Start drawing the trail based on hand type
          if (hand.handedness === "Right") {
            if (!isDrawingRight) {
              // Start a new trail for the right hand
              trails.push({ color: "#ffbe0b", points: [] });
              isDrawingRight = true;
              circleColor = "#ffbe0b"; // Change circle color to match the trail
            }
            trails[trails.length - 1].points.push({ x: circleX, y: circleY });
          } else if (hand.handedness === "Left") {
            if (!isDrawingLeft) {
              // Start a new trail for the left hand
              trails.push({ color: "#fb5607", points: [] });
              isDrawingLeft = true;
              circleColor = "#fb5607"; // Change circle color to match the trail
            }
            trails[trails.length - 1].points.push({ x: circleX, y: circleY });
          }
        } else {
          // Stop drawing the trail if fingers are not touching the circle
          if (hand.handedness === "Right") {
            isDrawingRight = false;
          } else if (hand.handedness === "Left") {
            isDrawingLeft = false;
          }
        }
      }
    }
  } else {
    // Stop drawing the trails if no hands are detected
    isDrawingRight = false;
    isDrawingLeft = false;
  }
}
