/*
  Paste a Google Apps Script web-app URL below after following SETUP.md.
  Leaving it blank keeps the beautiful confirmation flow for previewing only.
*/
const RSVP_ENDPOINT = "";

/*
  Add as many tracks here as you like — the vinyl player cycles through them.
  Leave the array empty to hide the player entirely.
*/
const TRACKS = [
  { title: "♪ Our Song", src: "https://www.dropbox.com/scl/fi/18nhmy2iq9bbec04rref3/.mp3?rlkey=dj3liiifbrfbfbhlve7qmo8q4&st=jxlcxzhm&dl=1" }
];

let currentLanguage = "en";
const translations = {
  zh: {
    navRsvp:"回覆",heroEyebrow:"携手开启新的旅程",heroDate:"2026年9月19日，星期六",heroVenue:"金阳迎宾楼 · Golden Sun Restaurant · Kuchai Lama · 晚宴 7:00 PM 开始",heroCta:"与我们一同庆祝",
    gateEyebrow:"给家人与朋友",gateHint:"点击封蜡，开启这一切",
    cdDays:"天",cdHours:"时",cdMins:"分",cdSecs:"秒",
    vinylHint:"拖动唱片切换歌曲",
    introEyebrow:"让我们的下一段旋律，从这里开始",introTitle:"这一晚，因为有你而更加温暖。",introCopy:"我们要结婚了——在这段旅程里，有你们一路的支持与陪伴，这一天才更显完整。",
    capWarm:"就是我们，最自然的样子",capFormal:"为你精心打扮的这一刻",capRed:"双喜临门",capLake:"等不及要和你一起庆祝",leadFormal:"就这样，我们准备好了",leadLake:"每一天，都离你更近一点",
    detailsEyebrow:"给你的一封小邀请",detailsTitle:"请记下这个日子",whenLabel:"日期",whenCopy:"星期六<br /><strong>2026年9月19日</strong>",scheduleLabel:"当天安排",scheduleCopy:"<strong>5:00 PM</strong> · 敬茶仪式<br /><strong>7:00 PM</strong> · 婚宴庆祝",whereLabel:"地点",whereCopy:"<strong>金阳迎宾楼</strong><br /><span class=\"chinese-name\">Golden Sun Restaurant</span><br />Kuchai Lama",teaNote:"<span>家人及亲戚</span> 敬请于 <strong>5:00 PM</strong> 前抵达，参与敬茶仪式。",
    posterEyebrow:"我们的 Save the Date",posterTitle:"值得好好庆祝的旅程。",posterCopy:"从北海道的雪景回忆，到古仔路的这一晚，很开心在我们人生的下一章里有你们同行。",posterNote:"♫ 带上好心情，一起来庆祝吧。",
    rsvpDeadline:"请于 2026年8月31日 前回复",rsvpTitle:"你会来吗？",rsvpLead:"我们很期待在这幸福的一天和你相聚。",attendanceLabel:"是否出席",accepts:"欣然出席",declines:"抱歉无法出席",nameLabel:"您的姓名",namePlaceholder:"请填写全名",guestLabel:"同行宾客姓名",guestPlaceholder:"如有同行宾客，请填写姓名",paxLabel:"出席人数",paxPlaceholder:"请选择人数",allergyLabel:"食物过敏或饮食需求",allergyPlaceholder:"如没有，请填写“无”。",submit:"提交回覆",backTop:"回到顶部 ↑",thanksEyebrow:"谢谢你",thanksTitle:"我们已收到你的回覆。",thanksCopy:"很开心收到你的消息，期待当天与您相见。",sending:"提交中…",error:"出了点问题，请稍后再试。"
  },
  en: {}
};
function setLanguage(language) {
  currentLanguage = language;
  document.documentElement.lang = language;
  const dictionary = translations[language] || {};
  document.querySelectorAll("[data-i18n]").forEach((element) => { const key = element.dataset.i18n; if (language === "en") element.textContent = element.dataset.en || element.textContent; else if (dictionary[key]) { if (!element.dataset.en) element.dataset.en = element.textContent; element.textContent = dictionary[key]; } });
  document.querySelectorAll("[data-i18n-html]").forEach((element) => { const key = element.dataset.i18nHtml; if (language === "en") element.innerHTML = element.dataset.en || element.innerHTML; else if (dictionary[key]) { if (!element.dataset.en) element.dataset.en = element.innerHTML; element.innerHTML = dictionary[key]; } });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => { const key = element.dataset.i18nPlaceholder; if (!element.dataset.en) element.dataset.en = element.placeholder; element.placeholder = language === "en" ? element.dataset.en : dictionary[key]; });
  document.querySelector("#language-toggle").textContent = language === "en" ? "中" : "EN";
}
document.querySelector("#language-toggle").addEventListener("click", () => setLanguage(currentLanguage === "en" ? "zh" : "en"));

/* gently fade sections into view as you scroll */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("visible"); revealObserver.unobserve(entry.target); } });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

/* tap-anywhere-fun: little heart/sparkle bursts */
function burstHeartsAt(x, y, count) {
  for (let i = 0; i < count; i++) {
    const heart = document.createElement("span");
    heart.className = "floating-heart";
    heart.textContent = Math.random() > 0.4 ? "♥" : "✦";
    heart.style.left = `${x + (Math.random() * 50 - 25)}px`;
    heart.style.top = `${y}px`;
    heart.style.animationDelay = `${i * 0.05}s`;
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1500);
  }
}

document.querySelectorAll(".hero-flower").forEach((flower) => {
  flower.addEventListener("click", (event) => {
    burstHeartsAt(event.clientX, event.clientY, 10);
    flower.classList.add("flower-pop");
    setTimeout(() => flower.classList.remove("flower-pop"), 500);
  });
});

document.querySelectorAll(".scrapbook-photo").forEach((photo) => {
  photo.addEventListener("click", (event) => {
    burstHeartsAt(event.clientX, event.clientY, 6);
    photo.classList.add("photo-pop");
    setTimeout(() => photo.classList.remove("photo-pop"), 400);
  });
});

/* countdown to the celebration (7:00 PM, Malaysia time) */
const countdownTarget = new Date("2026-09-19T19:00:00+08:00").getTime();
function updateCountdown() {
  const diff = Math.max(0, countdownTarget - Date.now());
  const pad = (n) => String(n).padStart(2, "0");
  document.querySelector("#cd-days").textContent = pad(Math.floor(diff / 86400000));
  document.querySelector("#cd-hours").textContent = pad(Math.floor((diff % 86400000) / 3600000));
  document.querySelector("#cd-mins").textContent = pad(Math.floor((diff % 3600000) / 60000));
  document.querySelector("#cd-secs").textContent = pad(Math.floor((diff % 60000) / 1000));
}
updateCountdown();
setInterval(updateCountdown, 1000);

/* vinyl player: click to play/pause, drag left/right to change track */
const vinylPlayer = document.querySelector("#vinyl-player");
const vinylDisc = document.querySelector("#vinyl-disc");
const vinylTrackLabel = document.querySelector("#vinyl-track");
const musicAudio = document.querySelector("#bg-music");
let currentTrack = 0;
let isPlaying = false;
let dragging = false;
let dragged = false;
let dragStartX = 0;

function loadTrack(index, autoplay) {
  currentTrack = ((index % TRACKS.length) + TRACKS.length) % TRACKS.length;
  musicAudio.src = TRACKS[currentTrack].src;
  musicAudio.load();
  vinylTrackLabel.textContent = TRACKS[currentTrack].title;
  if (autoplay) setPlaying(true);
}

function setPlaying(playing) {
  isPlaying = playing;
  vinylDisc.classList.toggle("spinning", playing);
  vinylDisc.setAttribute("aria-pressed", playing ? "true" : "false");
  if (playing) musicAudio.play().catch(() => {});
  else musicAudio.pause();
}

if (TRACKS.length) {
  loadTrack(0, false);

  vinylDisc.addEventListener("click", () => { if (!dragged) setPlaying(!isPlaying); });

  vinylDisc.addEventListener("pointerdown", (event) => {
    dragging = true;
    dragged = false;
    dragStartX = event.clientX;
    vinylDisc.classList.remove("spinning");
  });
  window.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    const dx = event.clientX - dragStartX;
    if (Math.abs(dx) > 6) dragged = true;
    vinylDisc.style.transform = `rotate(${dx * 0.6}deg)`;
  });
  window.addEventListener("pointerup", (event) => {
    if (!dragging) return;
    dragging = false;
    const dx = event.clientX - dragStartX;
    vinylDisc.style.transform = "";
    if (dx > 70) loadTrack(currentTrack - 1, true);
    else if (dx < -70) loadTrack(currentTrack + 1, true);
    else if (isPlaying) vinylDisc.classList.add("spinning");
    setTimeout(() => { dragged = false; }, 50);
  });
} else {
  vinylPlayer.style.display = "none";
}

/* entrance gate: tap the wax seal to open the invitation */
const gate = document.querySelector("#gate");
const waxSeal = document.querySelector("#wax-seal");
waxSeal.addEventListener("click", () => {
  if (TRACKS.length) setPlaying(true);
  waxSeal.classList.add("cracking");
  setTimeout(() => {
    gate.classList.add("opening");
    document.body.classList.remove("gate-active");
  }, 350);
  setTimeout(() => { gate.style.display = "none"; }, 1300);
});

const form = document.querySelector("#rsvp-form");
const status = document.querySelector("#form-status");

function celebrateWithHearts(container) {
  for (let i = 0; i < 10; i++) {
    const heart = document.createElement("span");
    heart.className = "heart-pop";
    heart.textContent = "♥";
    heart.style.left = `${45 + (Math.random() * 20 - 10)}%`;
    heart.style.animationDelay = `${i * 0.09}s`;
    container.appendChild(heart);
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  const data = Object.fromEntries(new FormData(form));
  const button = form.querySelector("button");
  button.disabled = true;
  button.textContent = currentLanguage === "zh" ? translations.zh.sending : "Sending…";
  try {
    if (RSVP_ENDPOINT) {
      await fetch(RSVP_ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, submittedAt: new Date().toISOString() })
      });
    }
    const copy = currentLanguage === "zh" ? translations.zh : { thanksEyebrow:"Thank you", thanksTitle:"We’ve received your RSVP.", thanksCopy:"We’re so happy to hear from you and can’t wait to celebrate together." };
    form.innerHTML = `<div class="thanks"><p class="eyebrow plum">${copy.thanksEyebrow}</p><h3>${copy.thanksTitle}</h3><p>${copy.thanksCopy}</p></div>`;
    status.textContent = "";
    celebrateWithHearts(form.querySelector(".thanks"));
  } catch (error) {
    status.textContent = currentLanguage === "zh" ? translations.zh.error : "Something went wrong. Please try again in a moment.";
    button.disabled = false;
    button.textContent = currentLanguage === "zh" ? translations.zh.submit : "Send RSVP";
  }
});
