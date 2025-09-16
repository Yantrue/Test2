const namesTextarea = document.getElementById('namesTextarea');
const loadNamesBtn = document.getElementById('loadNamesBtn');
const spinBtn = document.getElementById('spinBtn');
const namesList = document.getElementById('namesList');
const result = document.getElementById('result');
const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');

const popup = document.getElementById('popup');
const popupMessage = document.getElementById('popupMessage');
const popupOkBtn = document.getElementById('popupOkBtn');
const popupRemoveBtn = document.getElementById('popupRemoveBtn');

let names = [];
let startAngle = 0;
let arc = 0;
let spinTimeout = null;
let spinAngleStart = 0;
let spinTime = 0;
let spinTimeTotal = 0;
let winner = '';

function updateNamesList() {
  if(names.length === 0) {
    namesList.textContent = 'Belum ada nama dimuat.';
    spinBtn.disabled = true;
    return;
  }
  namesList.textContent = names.join('\n');
  spinBtn.disabled = false;
}

function drawWheel() {
  if(names.length === 0) return;

  const outsideRadius = 160;
  const textRadius = 120;
  const insideRadius = 50;

  arc = Math.PI * 2 / names.length;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = '#4a90e2';
  ctx.lineWidth = 2;

  ctx.font = 'bold 16px Segoe UI';

  for(let i = 0; i < names.length; i++) {
    const angle = startAngle + i * arc;
    ctx.fillStyle = i % 2 === 0 ? '#a1c4fd' : '#c2e9fb';

    ctx.beginPath();
    ctx.arc(canvas.width/2, canvas.height/2, outsideRadius, angle, angle + arc, false);
    ctx.arc(canvas.width/2, canvas.height/2, insideRadius, angle + arc, angle, true);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.save();
    ctx.fillStyle = '#333';
    ctx.translate(
      canvas.width/2 + Math.cos(angle + arc/2) * textRadius,
      canvas.height/2 + Math.sin(angle + arc/2) * textRadius
    );
    ctx.rotate(angle + arc/2 + Math.PI/2);
    ctx.fillText(names[i], -ctx.measureText(names[i]).width/2, 0);
    ctx.restore();
  }
}

function rotateWheel() {
  spinTime += 30;
  if(spinTime >= spinTimeTotal) {
    stopRotateWheel();
    return;
  }
  const spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
  startAngle += (spinAngle * Math.PI / 180);
  drawWheel();
  spinTimeout = setTimeout(rotateWheel, 30);
}

function stopRotateWheel() {
  clearTimeout(spinTimeout);
  const degrees = startAngle * 180 / Math.PI + 90;
  const arcd = arc * 180 / Math.PI;
  const index = Math.floor((360 - (degrees % 360)) / arcd);
  winner = names[index];

  result.textContent = `Selamat kepada ${winner}!`;

  popupMessage.textContent = `Selamat kepada ${winner}!`;
  popup.classList.remove('hidden');

  spinBtn.disabled = true;
  loadNamesBtn.disabled = true;
  namesTextarea.disabled = true;
}

function easeOut(t, b, c, d) {
  t /= d;
  return -c * t*(t-
