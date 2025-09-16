const nameInput = document.getElementById('nameInput');
const addNameBtn = document.getElementById('addNameBtn');
const spinBtn = document.getElementById('spinBtn');
const namesList = document.getElementById('namesList');
const result = document.getElementById('result');
const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');

let names = [];
let startAngle = 0;
let arc = 0;
let spinTimeout = null;
let spinAngleStart = 0;
let spinTime = 0;
let spinTimeTotal = 0;

// Fungsi update tampilan list nama
function updateNamesList() {
  if(names.length === 0) {
    namesList.textContent = 'Belum ada nama ditambahkan.';
    spinBtn.disabled = true;
    return;
  }
  namesList.textContent = 'Nama yang dimasukkan: ' + names.join(', ');
  spinBtn.disabled = false;
}

// Fungsi gambar roda roulette
function drawWheel() {
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
    // Warna tiap slice bergantian
    ctx.fillStyle = i % 2 === 0 ? '#a1c4fd' : '#c2e9fb';

    ctx.beginPath();
    ctx.arc(canvas.width/2, canvas.height/2, outsideRadius, angle, angle + arc, false);
    ctx.arc(canvas.width/2, canvas.height/2, insideRadius, angle + arc, angle, true);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Tulisan nama
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

// Fungsi animasi putar
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
  result.textContent = 'Hasil: ' + names[index];
  spinBtn.disabled = false;
  addNameBtn.disabled = false;
  nameInput.disabled = false;
}

// Fungsi easing untuk animasi halus
function easeOut(t, b, c, d) {
  const ts = (t/=d)*t;
  const tc = ts*t;
  return b + c*(tc + -3*ts + 3*t);
}

// Event tambah nama
addNameBtn.addEventListener('click', () => {
  const name = nameInput.value.trim();
  if(name && !names.includes(name)) {
    names.push(name);
    updateNamesList();
    drawWheel();
    nameInput.value = '';
    nameInput.focus();
  }
});

// Event putar roulette
spinBtn.addEventListener('click', () => {
  if(names.length === 0) return;
  spinAngleStart = Math.floor(3600 + Math.random() * 360); // Putaran total antara 10-11 kali
  spinTime = 0;
  spinTimeTotal = 4000; // durasi 4 detik
  spinBtn.disabled = true;
  addNameBtn.disabled = true;
  nameInput.disabled = true;
  result.textContent = '';
  rotateWheel();
});

// Inisialisasi tampilan
updateNamesList();
