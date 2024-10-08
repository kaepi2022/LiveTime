const timezoneSelect = document.getElementById("timezone");
const canvas = document.getElementById("analog-clock");
const ctx = canvas.getContext("2d");
const timePeriod = document.getElementById("time-period"); // `timePeriod` 要素を取得

// タイムゾーンのリストを取得して、セレクトボックスに追加
const timezones = [
  { label: "日本 - Tokyo", value: "Asia/Tokyo" },
  { label: "アメリカ - America", value: "America/New_York" },
  { label: "イギリス - London", value: "Europe/London" },
  { label: "シドニー - Sydney", value: "Australia/Sydney" }
];

timezones.forEach(tz => {
  const option = document.createElement("option");
  option.value = tz.value;
  option.text = tz.label;
  timezoneSelect.appendChild(option);
});

// 時計を描画する関数
function drawClock(time) {
  const radius = canvas.height / 2;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.translate(radius, radius);
  drawFace(ctx, radius);
  drawNumbers(ctx, radius);
  drawTime(ctx, radius, time);
  ctx.translate(-radius, -radius);
}

function drawFace(ctx, radius) {
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, 2 * Math.PI);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 4;
  ctx.stroke();
}

function drawNumbers(ctx, radius) {
  ctx.font = radius * 0.15 + "px arial";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  for (let num = 1; num < 13; num++) {
    const ang = num * Math.PI / 6;
    ctx.rotate(ang);
    ctx.translate(0, -radius * 0.85);
    ctx.rotate(-ang);
    ctx.fillText(num.toString(), 0, 0);
    ctx.rotate(ang);
    ctx.translate(0, radius * 0.85);
    ctx.rotate(-ang);
  }
}

function drawTime(ctx, radius, time) {
  const hour = time.getHours();
  const minute = time.getMinutes();
  const second = time.getSeconds();

  // 時針
  let hourAngle = (hour % 12) * Math.PI / 6 + (minute * Math.PI / 360);
  drawHand(ctx, hourAngle, radius * 0.5, radius * 0.07);

  // 分針
  let minuteAngle = (minute * Math.PI / 30) + (second * Math.PI / 1800);
  drawHand(ctx, minuteAngle, radius * 0.8, radius * 0.07);

  // 秒針
  let secondAngle = (second * Math.PI / 30);
  drawHand(ctx, secondAngle, radius * 0.9, radius * 0.02);
}

function drawHand(ctx, pos, length, width) {
  ctx.beginPath();
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.moveTo(0, 0);
  ctx.rotate(pos);
  ctx.lineTo(0, -length);
  ctx.stroke();
  ctx.rotate(-pos);
}

// 昼夜・時間帯の判定関数
function determineTimePeriod(hour) {
  let period = '';
  let className = '';

  if (hour >= 6 && hour < 12) {
    period = '朝';
    className = 'morning';
  } else if (hour >= 12 && hour < 18) {
    period = '昼';
    className = 'afternoon';
  } else if (hour >= 18 && hour < 20) {
    period = '夕方';
    className = 'evening';
  } else {
    period = '夜 (Night)';
    className = 'night';
  }

  // 時間帯を表示
  timePeriod.textContent = `現在の時間帯: ${period}`;
  document.body.className = className; // クラスを設定
}

function updateClock() {
  const selectedTimezone = timezoneSelect.value || "Asia/Tokyo"; // デフォルトのタイムゾーン
  const currentTime = new Date(new Date().toLocaleString("ja-JP", { timeZone: selectedTimezone }));

  // デジタル時計の更新
  const digitalClock = document.getElementById("digital-clock");
  digitalClock.textContent = currentTime.toLocaleTimeString();

  // アナログ時計の更新
  drawClock(currentTime);

  // 時間帯の更新
  determineTimePeriod(currentTime.getHours());

}

// 初期化とイベントリスナー
timezoneSelect.addEventListener("change", updateClock);
window.addEventListener("DOMContentLoaded", () => {
  updateClock();
  setInterval(updateClock, 1000); // 1秒ごとに更新
});
