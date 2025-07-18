const canvas = document.getElementById("airplaneCanvas");
const ctx = canvas.getContext("2d");
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

// Define journey points
const locations = [
  { x: 60, y: 80, label: "2022: Started HTML, CSS, JS" },
  { x: 140, y: 280, label: "2023: MERN Stack Projects" },
  { x: 350, y: 60, label: "2024: Web Dev Intern" },
  { x: 380, y: 350, label: "2025: APIs & Deployment" } // shifted into frame
];



let current = 0;
let airplane = { x: locations[0].x, y: locations[0].y };
let trail = [];
let labelShown = Array(locations.length).fill(false);
let waiting = false;

function drawDottedLine(from, to) {
  ctx.strokeStyle = "#00ffe5";
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.stroke();
  ctx.setLineDash([]); // reset
}

function drawLocation(point, index) {
  ctx.beginPath();
  ctx.fillStyle = "#ff6b6b";
  ctx.arc(point.x, point.y, 7, 0, Math.PI * 2);
  ctx.fill();

  if (labelShown[index]) {
    ctx.fillStyle = "#ffffff";
    ctx.font = "14px Arial";
    ctx.fillText(point.label, point.x + 10, point.y - 10);
  }
}

function drawAirplane() {
  ctx.fillStyle = "#ff6b6b";
  ctx.beginPath();
  ctx.moveTo(airplane.x, airplane.y);
  ctx.lineTo(airplane.x - 10, airplane.y - 5);
  ctx.lineTo(airplane.x - 10, airplane.y + 5);
  ctx.closePath();
  ctx.fill();
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw trail line dynamically
  if (trail.length > 1) {
    ctx.strokeStyle = "#00ffe5";
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(trail[0].x, trail[0].y);
    for (let i = 1; i < trail.length; i++) {
      ctx.lineTo(trail[i].x, trail[i].y);
    }
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Draw all locations and their labels if revealed
  locations.forEach(drawLocation);

  // Draw airplane
  drawAirplane();

  if (waiting) {
    requestAnimationFrame(animate);
    return;
  }

  const target = locations[current + 1];
  // if (!target) return;

  if (!target) {
  // Restart journey
  current = 0;
  airplane = { x: locations[0].x, y: locations[0].y };
  trail = [{ x: airplane.x, y: airplane.y }];
  labelShown = Array(locations.length).fill(false);
  labelShown[0] = true;
  requestAnimationFrame(animate);
  return;
}


  const dx = target.x - airplane.x;
  const dy = target.y - airplane.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < 2) {
    airplane.x = target.x;
    airplane.y = target.y;
    labelShown[current + 1] = true;
    trail.push({ x: target.x, y: target.y }); // Push final position
    current++;
    waiting = true;
    setTimeout(() => {
      waiting = false;
      requestAnimationFrame(animate);
    }, 1000);
  } else {
    // Push current airplane position to trail as it moves
    const stepX = (dx / distance) * 2;
    const stepY = (dy / distance) * 2;
    airplane.x += stepX;
    airplane.y += stepY;
    trail.push({ x: airplane.x, y: airplane.y }); // <- LIVE TRAIL
    requestAnimationFrame(animate);
  }
}



trail.push({ x: airplane.x, y: airplane.y });
labelShown[0] = true;
animate();
