(function () {
  const canvas = document.getElementById('game');
  const context = canvas.getContext('2d');

  const SPACESHIP_SIZE = { width: 20, height: 30 };
  const SPACESHIP_POSITION = { x: 200, y: 200 };
  const GRAVITY = 2;
  const THRUST = 5;

  class SpaceShip {
    constructor(size, position) {
      this.color = 'white';
      this.size = size;
      this.position = position;
      this.angle = 0;
      this.engineOn = false;
      this.rotatingLeft = false;
      this.rotatingRight = false;
      this.velocity = {
        x: 0,
        y: 0,
      };
    }

    draw() {
      const triangleCenterX = this.position.x + 0.5 * this.size.width;
      const triangleCenterY = this.position.y + 0.5 * this.size.height;

      context.save();
      context.translate(triangleCenterX, triangleCenterY);
      context.rotate(this.angle);
      context.lineWidth = 1;
      context.beginPath();
      // Triangle
      context.moveTo(0, -this.size.height / 2);
      context.lineTo(-this.size.width / 2, this.size.height / 2);
      context.lineTo(this.size.width / 2, this.size.height / 2);
      context.closePath();

      context.strokeStyle = this.color;
      context.stroke();

      // Flame for engine
      if (this.engineOn) {
        const fireYPos = this.size.height / 2 + 5;
        const fireXPos = this.size.width * 0.25;
        context.beginPath();
        context.moveTo(-fireXPos, fireYPos);
        context.lineTo(fireXPos, fireYPos);
        context.lineTo(0, fireYPos + Math.random() * 50);
        context.lineTo(-fireXPos, fireYPos);
        context.closePath();
        context.fillStyle = 'orange';
        context.fill();
      }
      context.restore();
    }

    moveSpaceShip() {
      // Angle has to be in radians
      const degToRad = Math.PI / 180;
      // Change the position based on velocity
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
      // Move spaceship to other side when leaving screen
      this.position.x = (canvas.width + this.position.x) % canvas.width;
      this.position.y = (canvas.height + this.position.y) % canvas.height;
      // Turning
      if (this.rotatingLeft) this.angle -= degToRad;
      if (this.rotatingRight) this.angle += degToRad;
      // Acceleration
      if (this.engineOn) {
        this.velocity.x += (THRUST / 100) * Math.sin(this.angle);
        this.velocity.y -= (THRUST / 100) * Math.cos(this.angle);
      }
      // Update the velocity depending on gravity
      this.velocity.y += GRAVITY / 100;
    }
  }

  const spaceShip = new SpaceShip(SPACESHIP_SIZE, SPACESHIP_POSITION);

  function handleKeyInput(event) {
    const { keyCode, type } = event;
    const isKeyDown = type === 'keydown' ? true : false;

    if (keyCode === 37) spaceShip.rotatingLeft = isKeyDown;
    if (keyCode === 39) spaceShip.rotatingRight = isKeyDown;
    if (keyCode === 38) spaceShip.engineOn = isKeyDown;
  }

  function draw() {
    console.log('drawing');
    // Clear screen
    context.fillStyle = '#111';
    context.fillRect(0, 0, canvas.width, canvas.height);
    spaceShip.moveSpaceShip();
    // Begin drawing
    spaceShip.draw();
    // Repeat
    requestAnimationFrame(draw);
  }

  // Event Listeners
  document.addEventListener('keydown', handleKeyInput);
  document.addEventListener('keyup', handleKeyInput);
  // Start the game
  draw();
})();
