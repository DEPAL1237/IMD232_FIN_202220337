let circles = [];
const circleSize = 20;
const avoidanceRadius = 150;
const canvasColor = '#000000';
const circleBaseColor = '#FFFFFF';
const gradientColor = '#A374DB';
const updateInterval = 10;

function setup() {
  setCanvasContainer('canvas', 1, 1, true);
  noLoop();
  pixelDensity(1);

  // 원 생성
  for (let y = 0; y < height; y += circleSize) {
    for (let x = 0; x < width; x += circleSize) {
      circles.push(
        new Circle(x + circleSize / 2, y + circleSize / 2, circleSize)
      );
    }
  }
}

function draw() {
  background(canvasColor);

  for (let circle of circles) {
    circle.update();
    circle.show();
  }

  if (frameCount % updateInterval === 0) {
    for (let circle of circles) {
      circle.updateAuto();
    }
  }
}

class Circle {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.initialX = x;
    this.initialY = y;
    this.size = size;
    this.velocity = createVector(random(-2, 2), random(-2, 2));
    this.isHighlighted = false;
  }

  show() {
    let colorToFill;

    if (this.isHighlighted) {
      const distance = dist(this.x, this.y, mouseX, mouseY);
      const gradientRatio = constrain(
        map(distance, 0, avoidanceRadius, 1, 0),
        0,
        1
      );
      const lerpedColor = lerpColor(
        color(circleBaseColor),
        color(gradientColor),
        gradientRatio
      );
      colorToFill = lerpedColor.levels;
    } else {
      colorToFill = color(circleBaseColor).levels;
    }

    fill(colorToFill[0], colorToFill[1], colorToFill[2]);
    noStroke();
    ellipse(this.x, this.y, this.size, this.size);
  }

  update() {
    const distance = dist(this.x, this.y, mouseX, mouseY);

    if (distance < avoidanceRadius) {
      const angle = atan2(this.y - mouseY, this.x - mouseX);
      this.velocity = createVector(cos(angle), sin(angle));
      this.isHighlighted = true;
    } else {
      const targetX = this.initialX;
      const targetY = this.initialY;
      const target = createVector(targetX, targetY);
      const direction = p5.Vector.sub(target, createVector(this.x, this.y));
      direction.setMag(2);
      this.velocity = direction;
      this.isHighlighted = false;
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}

function mouseMoved() {
  for (let circle of circles) {
    const distance = dist(circle.x, circle.y, mouseX, mouseY);
    if (distance < avoidanceRadius) {
      circle.isHighlighted = true;
    } else {
      circle.isHighlighted = false;
    }
  }
  redraw();
}
