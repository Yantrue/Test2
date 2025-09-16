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

// Sembunyikan popup pada load halaman
window.addEventListener('DOMContentLoaded', () => {
  popup.classList.add('hidden');
});

// Fungsi update daftar nama
function updateNamesList() {
  if (names.length === 0) {
    namesList.textContent = 'Belum ada nama dimuat.';
    spinBtn.disabled = true;
    return;
  }
  namesList.textContent = names.join('\n');
  spinBtn.disabled = false;
}

// Fungsi gambar roda
function drawWheel() {
  if (names.length === 0) return;

  const outsideRadius = 160;
  const textRadius = 120;
  const insideRadius = 50;

  arc = Math.PI * 2 / names.length;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = '#4a90e2';
  ctx.lineWidth = 2;
  ctx.font = 'bold 16px Segoe UI';

  for (let i = 0; i < names.length; i++) {
    const angle = startAngle + i * arc;
    ctx.fillStyle = (i % 2 === 0) ? '#a1c4fd' : '#c2e9fb';

    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, outsideRadius, angle, angle + arc, false);
    ctx.arc(canvas.width / 2, canvas.height / 2, insideRadius, angle + arc, angle, true);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.save();
    ctx.fillStyle = '#333';
    ctx.translate(
      canvas.width / 2 + Math.cos(angle + arc / 2) * textRadius,
      canvas.height / 2 + Math.sin(angle + arc / 2) * textRadius
    );
    ctx.rotate(angle + arc / 2 + Math.PI / 2);
    ctx.fillText(names[i], -ctx.measureText(names[i]).width / 2, 0);
    ctx.restore();
  }
}

// Animasi putar
function rotateWheel() {
  spinTime += 30;
  if (spinTime >= spinTimeTotal) {
    stopRotateWheel();
    return;
  }
  const spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
  startAngle += (spinAngle * Math.PI / 180);
  drawWheel();
  spinTimeout = setTimeout(rotateWheel, 30);
}

// Setelah selesai putar
function stopRotateWheel() {
  clearTimeout(spinTimeout);
  const degrees = (startAngle * 180 / Math.PI) + 90;
  const arcd = arc * 180 / Math.PI;
  const index = Math.floor((360 - (degrees % 360)) / arcd);
  winner = names[index];

  result.textContent = `Selamat kepada ${winner}!`;

  // Tampilkan popup hanya disini
  popupMessage.textContent = `Selamat kepada ${winner}!`;
  popup.classList.remove('hidden');
}

// fungsi easing
function easeOut(t, b, c, d) {
  t /= d;
  return -c * t * (t - 2) + b;
}

// Event load/muat nama
loadNamesBtn.addEventListener('click', () => {
  const raw = namesTextarea.value.trim();
  if (!raw) {
    alert('Masukkan minimal satu nama.');
    return;
  }
  const inputNames = raw.split('\n')
    .map(n => n.trim())
    .filter(n => n.length > 0);

  if (inputNames.length === 0) {
    alert('Masukkan minimal satu nama.');
    return;
  }

  names = [...new Set(inputNames)];
  updateNamesList();
  drawWheel();
});

// Event putar
spinBtn.addEventListener('click', () => {
  if (names.length === 0) return;
  spinAngleStart = Math.floor(3600 + Math.random() * 360);
  spinTime = 0;
  spinTimeTotal = 8000;  // 8 detik
  spinBtn.disabled = true;
  loadNamesBtn.disabled = true;
  namesTextarea.disabled = true;
  result.textContent = '';
  rotateWheel();
});

// Oke tombol popup
popupOkBtn.addEventListener('click', () => {
  popup.classList.add('hidden');
  // re-enable input dan tombol
  spinBtn.disabled = names.length === 0;
  loadNamesBtn.disabled = false;
  namesTextarea.disabled = false;
});

// Hapus nama tombol popup
popupRemoveBtn.addEventListener('click', () => {
  // Hapus hanya yang menang
  names = names.filter(n => n !== winner);
  updateNamesList();
  drawWheel();
  popup.classList.add('hidden');
  spinBtn.disabled = names.length === 0;
  loadNamesBtn.disabled = false;
  namesTextarea.disabled = false;
  if (names.length === 0) {
    result.textContent = '';
  }
});
