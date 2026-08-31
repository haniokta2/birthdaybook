/* =========================================================
   DATA YANG PALING MUDAH DIEDIT
   ========================================================= */
const CONFIG = {
  name: 'ASEP AFANDI',
  birthday: '2004-09-01', // format: YYYY-MM-DD
  photos: [
    "asep1.jpeg","asep2.jpeg","asep3.jpeg","asep4.jpeg",
    "asep5.jpeg","asep6.jpeg","asep7.jpeg","asep8.jpeg",
    "asep11.jpeg","asep9.jpeg","asep10.jpeg"
  ]
};

/* =========================================================
   PAGE / FLIPBOOK
   ========================================================= */
const pages = [...document.querySelectorAll(".page")];
let current = 0;

const progress = document.getElementById("progress");
pages.forEach((_,i)=>{
  const d=document.createElement("span");
  d.className="dot"+(i===0?" active":"");
  progress.appendChild(d);
});

function renderPage(){
  pages.forEach((p,i)=>p.classList.toggle("active",i===current));
  document.querySelectorAll(".dot").forEach((d,i)=>d.classList.toggle("active",i===current));
  document.getElementById("pageNumber").textContent=`${current+1} / ${pages.length}`;
  document.getElementById("prevBtn").disabled=current===0;
  document.getElementById("nextBtn").disabled=current===pages.length-1;
  window.scrollTo({top:0,behavior:"smooth"});
}
function gameUnlocked(){
  return current !== 0 || (bearGameWon && !bearGameRunning);
}

function showGameLockMessage(){
  const message=document.getElementById("gameMessage");
  if(!message)return;
  message.textContent="HEY! Selesaikan gamenya dulu ya! 🧸😤";
  message.classList.remove("bump");
  void message.offsetWidth;
  message.classList.add("bump");
}

function goTo(n){current=Math.max(0,Math.min(pages.length-1,n));renderPage()}
function nextPage(){if(current<pages.length-1){if(gameUnlocked()){current++;renderPage()}else{showGameLockMessage()}}}
function prevPage(){if(current>0){current--;renderPage()}}

document.addEventListener("keydown",e=>{
  const lb=document.getElementById("lightbox");
  if(lb&&lb.classList.contains("show")){
    if(e.key==="Escape")closeLightbox();
    if(e.key==="ArrowRight")lightboxNav(1);
    if(e.key==="ArrowLeft")lightboxNav(-1);
    return;
  }
  if(e.key==="ArrowRight")nextPage();
  if(e.key==="ArrowLeft")prevPage();
});

/* =========================================================
   DATA NAMA + UMUR
   ========================================================= */
function calculateAge(dateString){
  const birth=new Date(dateString+"T00:00:00");
  const today=new Date();
  let age=today.getFullYear()-birth.getFullYear();
  const m=today.getMonth()-birth.getMonth();
  if(m<0 || (m===0 && today.getDate()<birth.getDate())) age--;
  return age;
}

function applyConfig(){
  const age=calculateAge(CONFIG.birthday);
  document.title=`Happy Birthday ${CONFIG.name} 22!🎂`;
  document.getElementById("coverAge").textContent="22!";
  document.querySelector(".cover .small").textContent=`A SPECIAL DAY FOR ${CONFIG.name.toUpperCase()}`;
  document.querySelector(".cover-note").textContent=`a tiny digital scrapbook made especially for ${CONFIG.name} ♡`;

  const [y,m,d]=CONFIG.birthday.split("-").map(Number);
  const date=new Date(y,m-1,d);
  const month=date.toLocaleString("en-US",{month:"long"});
  document.getElementById("monthName").textContent=month;

  buildCalendar(y,m-1,d);
}

function buildCalendar(y,m,d){
  const calendar=document.getElementById("calendar");
  calendar.innerHTML="";
  const first=new Date(y,m,1).getDay();
  const last=new Date(y,m+1,0).getDate();

  for(let i=0;i<first;i++){
    const x=document.createElement("div");x.className="empty";x.textContent="0";calendar.appendChild(x);
  }
  for(let day=1;day<=last;day++){
    const x=document.createElement("div");
    x.textContent=day;
    if(day===d)x.className="birthday";
    calendar.appendChild(x);
  }
}

/* =========================================================
   BINTANG BACKGROUND
   ========================================================= */
const stars=document.getElementById("stars");
for(let i=0;i<34;i++){
  const s=document.createElement("span");
  s.className="star";
  s.textContent=Math.random()>.5?"✦":"✧";
  s.style.left=Math.random()*100+"%";
  s.style.top=Math.random()*100+"%";
  s.style.fontSize=(8+Math.random()*15)+"px";
  s.style.animationDelay=(-Math.random()*5)+"s";
  stars.appendChild(s);
}

/* =========================================================
   FOTO
   ========================================================= */
function setImage(selector,src){
  document.querySelectorAll(selector).forEach(img=>img.src=src);
}
CONFIG.photos.forEach((src, i) => {

  if (i === 0) {

    const cover =
      document.getElementById("coverPhoto");

    if (cover) {
      cover.src = src;
    }

    return;

  }

  const memory =
    document.querySelector(
      `img[alt="Memory ${i}"]`
    );

  if (memory) {
    memory.src = src;
  }

});

/* Jika foto lokal belum ada, tampilkan placeholder yang tetap rapi */
document.querySelectorAll("img").forEach(img=>{
  img.addEventListener("error",()=>{
    img.src="data:image/svg+xml;charset=UTF-8,"+encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="600" height="600">
        <rect width="100%" height="100%" fill="#e9ece8"/>
        <text x="50%" y="48%" text-anchor="middle" font-family="Arial" font-size="28" fill="#7d8788">FOTO KAMU</text>
        <text x="50%" y="56%" text-anchor="middle" font-family="Arial" font-size="16" fill="#9aa2a2">ganti dengan foto sendiri</text>
      </svg>
    `);
  },{once:true});
});

/* =========================================================
   EDITOR FOTO DARI BROWSER
   ========================================================= */
const nameInput = document.getElementById("nameInput");
const ageInput = document.getElementById("ageInput");
const dateInput = document.getElementById("dateInput");
const photoInput = document.getElementById("photoInput");

if (nameInput) {
  nameInput.value = CONFIG.name;
  nameInput.addEventListener("input", e => {
    CONFIG.name = e.target.value || "NAMA KAMU";
    applyConfig();
  });
}

if (dateInput) {
  dateInput.value = CONFIG.birthday;
  dateInput.addEventListener("change", e => {
    if (e.target.value) {
      CONFIG.birthday = e.target.value;
      applyConfig();
    }
  });
}

if (ageInput) {
  ageInput.value = calculateAge(CONFIG.birthday);
}

if (photoInput) {
  photoInput.addEventListener("change", e => {
    const files = [...e.target.files].slice(0, 8);
    files.forEach((file, i) => {
      const url = URL.createObjectURL(file);
      const imgs = document.querySelectorAll("img");
      if (i === 0) document.getElementById("coverPhoto").src = url;
      const target = document.querySelector(`img[alt="Memory ${i}"]`);
      if (target) target.src = url;
      const wish = document.querySelector('img[alt="Foto ucapan"]');
      if (i === 7 && wish) wish.src = url;
    });
  });
}

/* =========================================================
   AUDIO
   Musik halaman 5: tombol ▶ membuka link mp3 yang bisa diputar
   ========================================================= */

function toggleMusic(btn, key) {
  if (!btn) return;

  if (btn.textContent === "Ⅱ") {
    btn.textContent = "▶";
    const song = btn.closest(".song");
    if (song) song.classList.remove("playing");
    return;
  }

  document.querySelectorAll(".song").forEach(s => s.classList.remove("playing"));

  const song = btn.closest(".song");
  if (song) song.classList.add("playing");

  btn.textContent = "Ⅱ";
  window.open(key + ".mp3", "_blank");
}

applyConfig();
renderPage();
/* =========================================================
   🧸 CUTE BIRTHDAY EFFECT SYSTEM
========================================================= */


/* =========================================================
   ✨ SPARKLE SAAT PINDAH HALAMAN
========================================================= */

function createPageSparkles() {

  const symbols = [
    "✦",
    "✧",
    "✨",
    "💫"
  ];

  for (let i = 0; i < 14; i++) {

    const sparkle =
      document.createElement("span");

    sparkle.className =
      "page-sparkle";

    sparkle.textContent =
      symbols[
        Math.floor(
          Math.random() * symbols.length
        )
      ];

    sparkle.style.left =
      Math.random() * 100 + "vw";

    sparkle.style.top =
      Math.random() * 100 + "vh";

    sparkle.style.fontSize =
      (10 + Math.random() * 18) + "px";

    sparkle.style.animationDelay =
      Math.random() * .3 + "s";

    document.body.appendChild(sparkle);

    setTimeout(() => {

      sparkle.remove();

    }, 1500);

  }

}


/* =========================================================
   💕 HATI SAAT KLIK LAYAR
========================================================= */

document.addEventListener("click", function(e) {

  if (
    e.target.closest("button") ||
    e.target.closest("input") ||
    e.target.closest("summary")
  ) {
    return;
  }

  const emojis = [
    "💫",
    "🎈",
    "✧",
    "🌸",
    "✨",
    "🧸"
  ];

  const heart =
    document.createElement("div");

  heart.className =
    "click-heart";

  heart.textContent =
    emojis[
      Math.floor(
        Math.random() * emojis.length
      )
    ];

  heart.style.left =
    e.clientX + "px";

  heart.style.top =
    e.clientY + "px";

  document.body.appendChild(heart);

  setTimeout(() => {

    heart.remove();

  }, 1000);

});


/* =========================================================
   🎈 FLOATING DECORATIONS
========================================================= */

function createFloatingDecoration() {

  const emojis = [
    "🎈",
    "💗",
    "✨",
    "🌸",
    "🧸",
    "✨",
    "💫",
  ];

  const item =
    document.createElement("div");

  item.className =
    "float-decoration";

  item.textContent =
    emojis[
      Math.floor(
        Math.random() * emojis.length
      )
    ];

  item.style.left =
    Math.random() * 100 + "vw";

  item.style.fontSize =
    (15 + Math.random() * 20) + "px";

  item.style.animationDuration =
    (5 + Math.random() * 5) + "s";

  document
    .getElementById("floatingDecorations")
    .appendChild(item);

  setTimeout(() => {

    item.remove();

  }, 11000);

}


/* Jalankan terus */

setInterval(
  createFloatingDecoration,
  1800
);


/* =========================================================
   🎉 CONFETTI
========================================================= */

function birthdayConfetti(amount = 40) {

  const emojis = [
    "🎉",
    "🎊",
    "🎂",
    "✨",
    "🎈",
    "💖",
    "🎈",
    "🧸",
    "✨",
    "💫"
  ];

  for (let i = 0; i < amount; i++) {

    const confetti =
      document.createElement("div");

    confetti.textContent =
      emojis[
        Math.floor(
          Math.random() * emojis.length
        )
      ];

    confetti.style.position =
      "fixed";

    confetti.style.left =
      Math.random() * 100 + "vw";

    confetti.style.top =
      "-50px";

    confetti.style.fontSize =
      (15 + Math.random() * 20) + "px";

    confetti.style.zIndex =
      "20001";

    confetti.style.pointerEvents =
      "none";

    const duration =
      2 + Math.random() * 3;

    confetti.style.transition =
      `transform ${duration}s linear,
       opacity ${duration}s linear`;

    document.body.appendChild(confetti);

    requestAnimationFrame(() => {

      confetti.style.transform =
        `translateY(110vh)
         rotate(${Math.random() * 720}deg)`;

      confetti.style.opacity = "0";

    });

    setTimeout(() => {

      confetti.remove();

    }, duration * 1000 + 300);

  }

}


/* =========================================================
   🎁 SURPRISE
========================================================= */

function showSurprise() {

  const surprise =
    document.getElementById(
      "birthdaySurprise"
    );

  if (!surprise) return;

  surprise.classList.add("show");

  birthdayConfetti(60);

}


/* =========================================================
   ❌ CLOSE SURPRISE
========================================================= */

function closeSurprise() {

  const surprise =
    document.getElementById(
      "birthdaySurprise"
    );

  if (!surprise) return;

  surprise.classList.remove("show");

}


/* =========================================================
   🧸 PELUK BERUANG
========================================================= */

function hugBear() {

  const hug =
    document.createElement("div");

  hug.className =
    "hug-animation";

  hug.textContent =
    "HAPPY BIRTHDAY YAAAA! 🧸💖";

  document.body.appendChild(hug);

  birthdayConfetti(25);

  setTimeout(() => {

    hug.remove();

  }, 1600);

}


/* =========================================================
   📖 MODIFIKASI renderPage
========================================================= */

const originalRenderPage =
  renderPage;

renderPage = function() {

  originalRenderPage();

  createPageSparkles();

  /*
    Halaman pertama = confetti kecil
    Halaman terakhir = confetti besar
  */

  if (current === 0) {

    setTimeout(() => {

      birthdayConfetti(20);

    }, 300);

  }

  if (current === pages.length - 1) {

    setTimeout(() => {

      birthdayConfetti(45);

    }, 500);

  }

  if (current === 4) {

    startPopGame();

  }

  if (current === 5) {

    buildGifts();

    if (!wishTyped) {
      setTimeout(typeWishLetter, 600);
    }

  }

  if (current === pages.length - 1) {

    fireworksStart();

  } else {

    fireworksStop();

  }

};


/* =========================================================
   🎵 MUSIC VISUALIZER
========================================================= */

document
  .querySelectorAll(".play")
  .forEach(button => {

    button.addEventListener(
      "click",
      function() {

        const song =
          this.closest(".song");

        setTimeout(() => {

          document
            .querySelectorAll(".song")
            .forEach(s => {

              s.classList.remove(
                "playing"
              );

            });

          if (
            this.textContent === "Ⅱ" &&
            song
          ) {

            song.classList.add(
              "playing"
            );

          }

        }, 100);

      }
    );

  });


/* =========================================================
   🎂 FIRST LOAD
========================================================= */

setTimeout(() => {

  birthdayConfetti(35);

}, 700);
/* =========================================================
   🧸 RUNNING BEAR GAME
========================================================= */

let bearScore = 0;
let bearTime = 15;
let bearGameRunning = false;
let bearGameWon = false;
let bearTimerInterval = null;
let bearMoveTimeout = null;

const BEAR_TARGET = 3;


/* =========================================================
   🎮 START GAME
========================================================= */

function startBearGame() {

  if (bearGameRunning) return;

  bearScore = 0;
  bearTime = 15;
  bearGameRunning = true;
  bearGameWon = false;

  const score =
    document.getElementById("bearScore");

  const timer =
    document.getElementById("bearTimer");

  const bear =
    document.getElementById("runningBear");

  const button =
    document.getElementById("startBearGame");

  const openButton =
    document.getElementById("openBirthdayBook");

  const message =
    document.getElementById("gameMessage");

  score.textContent = "0";
  timer.textContent = "15";

  button.disabled = true;

  button.textContent =
    "🏃 BERUANGNYA LARI!";

  openButton.style.display =
    "none";

  message.textContent =
    "HAHA! Tangkap aku! 😝";

  bear.classList.add("running");

  moveBear();

  bearTimerInterval =
    setInterval(() => {

      bearTime--;

      timer.textContent =
        bearTime;

      if (bearTime <= 0) {

        endBearGame(false);

      }

    }, 1000);

}


/* =========================================================
   🏃 BERUANG PINDAH POSISI
========================================================= */

function moveBear() {

  if (!bearGameRunning) return;

  const area =
    document.getElementById(
      "bearGameArea"
    );

  const bear =
    document.getElementById(
      "runningBear"
    );

  const areaWidth =
    area.clientWidth;

  const areaHeight =
    area.clientHeight;

  const bearWidth =
    bear.offsetWidth;

  const bearHeight =
    bear.offsetHeight;


  const maxX =
    areaWidth - bearWidth - 10;

  const maxY =
    areaHeight - bearHeight - 10;


  const x =
    10 +
    Math.random() *
    Math.max(10, maxX);


  const y =
    25 +
    Math.random() *
    Math.max(10, maxY - 20);


  bear.style.left =
    x + "px";

  bear.style.top =
    y + "px";

  bear.style.transform =
    "translate(0,0)";


  /*
    Semakin tinggi skor,
    semakin cepat dia kabur.
  */

  const speed =
    Math.max(
      280,
      750 - bearScore * 65
    );


  bearMoveTimeout =
    setTimeout(
      moveBear,
      speed
    );

}


/* =========================================================
   🧸 BERHASIL MENANGKAP
========================================================= */

function catchBear(event) {

  if (!bearGameRunning) return;

  event.stopPropagation();

  bearScore++;


  const score =
    document.getElementById(
      "bearScore"
    );

  const message =
    document.getElementById(
      "gameMessage"
    );

  const area =
    document.getElementById(
      "bearGameArea"
    );


  score.textContent =
    bearScore;


  /* 💥 efek tangkap */

  const effect =
    document.createElement("div");

  effect.className =
    "catch-effect";

  effect.textContent =
    bearScore >= BEAR_TARGET
      ? "🎉"
      : "🥹🎉🎂🎊";


  const areaRect =
    area.getBoundingClientRect();

  effect.style.left =
    (event.clientX - areaRect.left) + "px";

  effect.style.top =
    (event.clientY - areaRect.top) + "px";


  area.appendChild(effect);


  setTimeout(() => {

    effect.remove();

  }, 800);


  const messages = [

    "KETANGKEP! 😭",

    "IHHH CURANG! 😭",

    "Lepasin aku! 🧸",

    "Kok jago sih?! 😭",

    "Aduhhh ketangkep lagi! 💨",

    "Jangan ditangkap terus! 😂"

  ];


  message.textContent =
    messages[
      Math.floor(
        Math.random() *
        messages.length
      )
    ];


  if (bearScore >= BEAR_TARGET) {

    endBearGame(true);

    return;

  }


  /*
    Langsung pindah sebelum tertangkap
  */

  clearTimeout(
    bearMoveTimeout
  );

  moveBear();

}


/* =========================================================
   ⏰ GAME SELESAI
========================================================= */

function endBearGame(won) {

  bearGameRunning = false;

  bearGameWon = won;


  clearInterval(
    bearTimerInterval
  );

  clearTimeout(
    bearMoveTimeout
  );


  const bear =
    document.getElementById(
      "runningBear"
    );

  const button =
    document.getElementById(
      "startBearGame"
    );

  const openButton =
    document.getElementById(
      "openBirthdayBook"
    );

  const message =
    document.getElementById(
      "gameMessage"
    );


  bear.classList.remove(
    "running"
  );


  if (won) {

    message.textContent =
      "AAAA KAMU MENANG! 🎉🧸";

    button.textContent =
      "🎉 BERUANG KALAH!";

    openButton.style.display =
      "inline-block";


    /* 🎉 confetti */

    if (
      typeof birthdayConfetti ===
      "function"
    ) {

      birthdayConfetti(45);

    }


    /* 🥹🎉 🎂 🎊 sparkle */

    if (
      typeof createPageSparkles ===
      "function"
    ) {

      createPageSparkles();

    }

  } else {

    message.textContent =
      "HAHAHA KAMU KETINGGALAN! 😝🧸";

    button.disabled = false;

    button.textContent =
      "🔄 COBA LAGI";

  }

}


/* =========================================================
   🎯 RESET KALAU KEMBALI KE PAGE 1
========================================================= */

function resetBearGame() {

  clearInterval(
    bearTimerInterval
  );

  clearTimeout(
    bearMoveTimeout
  );

  bearGameRunning = false;

  bearScore = 0;

  bearTime = 15;

  bearGameWon = false;


  const score =
    document.getElementById(
      "bearScore"
    );

  const timer =
    document.getElementById(
      "bearTimer"
    );

  const button =
    document.getElementById(
      "startBearGame"
    );

  const openButton =
    document.getElementById(
      "openBirthdayBook"
    );

  const message =
    document.getElementById(
      "gameMessage"
    );


  if (score)
    score.textContent = "0";

  if (timer)
    timer.textContent = "15";

  if (button) {

    button.disabled = false;

    button.textContent =
      "🧸 MULAI TANGKAP!";

  }

  if (openButton) {

    openButton.style.display =
      "none";

  }

  if (message) {

    message.textContent =
      "Tangkap aku kalau bisa! 😝";

  }

}


/* =========================================================
   📖 DETEKSI PAGE
========================================================= */

const oldGoTo =
  goTo;

goTo = function(n) {

  if (n > current && !gameUnlocked()) {

    showGameLockMessage();

    return;

  }

  oldGoTo(n);

  if (n === 0) {

    resetBearGame();

  }

};
/* =========================================================
   🎶 BIRTHDAY MUSIC
========================================================= */

function openBirthdayBook() {

  // Buka halaman Birthday Book
  const before = current;
  goTo(1);

  // Kalau masih terkunci (game belum menang), jangan putar musik
  if (current <= before) return;

  // Ambil musik
  const music = document.getElementById("birthdayMusic");

  // Volume 70%
  music.volume = 0.70;

  // Putar musik
  music.play().catch(error => {
    console.log("Musik gagal diputar:", error);
  });
}

/* =========================================================
   🎈 POP BALOON GAME (HALAMAN 5)
========================================================= */

const POP_TARGET = 10;

const POP_WISHES = [
  "Semoga selalu bahagia ya! 💖",
  "Semoga sehat selalu! 🥹",
  "Impianmu satu-satu nyampe nanti ✨",
  "Kamu keren banget, jangan lupa itu! 🤍",
  "Semoga rezekinya lancar terus 💰",
  "Tersenyumlah, dunia butuh itu 😊",
  "Doa terbaik buat langkah kamu ke depannya 🎓",
  "Capek boleh, nyerah jangan oke! 💪",
  "Kamu layak dapat yang terbaik di dunia ini 🌸",
  "Tetap jadi versi dirimu yang terbaik! 🧸"
];

let popCount = 0;
let popGameRunning = false;
let popTimer = null;

function spawnBalloon() {
  const area = document.getElementById("popArea");
  if (!area) return;
  const balloon = document.createElement("div");
  balloon.className = "pop-balloon";
  balloon.textContent = "🎈";
  balloon.style.left = (8 + Math.random() * 80) + "%";
  balloon.style.animationDuration = (5 + Math.random() * 4) + "s";
  balloon.addEventListener("click", () => popBalloon(balloon));
  balloon.addEventListener("animationend", () => balloon.remove());
  area.appendChild(balloon);
}

function popBalloon(balloon) {
  if (!balloon || balloon.classList.contains("popped")) return;
  balloon.classList.add("popped");

  const wish = POP_WISHES[popCount % POP_WISHES.length];
  popCount++;

  const wishEl = document.getElementById("popWish");
  if (wishEl) {
    wishEl.textContent = wish;
    wishEl.classList.remove("show");
    void wishEl.offsetWidth;
    wishEl.classList.add("show");
  }

  const count = document.getElementById("popCount");
  if (count) count.textContent = popCount;

  setTimeout(() => balloon.remove(), 400);

  if (popCount >= POP_TARGET) {
    const msg = document.getElementById("popMessage");
    if (msg) {
      msg.textContent = "KAMU POP SEMUA! 🎉🎈 SELAMAT!";
      msg.classList.add("show");
    }
    if (typeof birthdayConfetti === "function") birthdayConfetti(60);
    if (typeof createPageSparkles === "function") createPageSparkles();
    clearInterval(popTimer);
    popGameRunning = false;
    return;
  }

  setTimeout(spawnBalloon, 400);
}

function startPopGame() {
  const area = document.getElementById("popArea");
  if (!area) return;
  if (popGameRunning) return;
  popGameRunning = true;
  popCount = 0;

  const count = document.getElementById("popCount");
  if (count) count.textContent = "0";

  const msg = document.getElementById("popMessage");
  if (msg) msg.classList.remove("show");

  area.innerHTML = "";
  for (let i = 0; i < 5; i++) spawnBalloon();

  popTimer = setInterval(() => {
    if (area.children.length < 6) spawnBalloon();
  }, 3500);
}

/* =========================================================
   🎁 BUKA KADO KEJUTAN (HALAMAN 6)
========================================================= */

const GIFTS = [
  { emoji: "🎂", text: "Satu tahun lagi bertambah — makasih udah berjuang sejauh ini! 🎂" },
  { emoji: "🎓", text: "Selamat atas kelulusannya, bangga banget sama kamu! 🎓" },
  { emoji: "💖", text: "Jangan lupa bahagia di setiap langkah kamu ya! 💖" },
  { emoji: "✨", text: "Semoga semua impianmu satu per satu terwujud. Aamiin 🤲✨" }
];

let giftOpened = 0;

function buildGifts() {
  const row = document.getElementById("giftRow");
  if (!row) return;

  row.innerHTML = "";
  giftOpened = 0;

  const count = document.getElementById("giftCount");
  if (count) count.textContent = "0";

  const reveal = document.getElementById("giftReveal");
  if (reveal) reveal.classList.remove("show");

  const msg = document.getElementById("giftMessage");
  if (msg) msg.classList.remove("show");

  const btn = document.getElementById("giftSurpriseBtn");
  if (btn) btn.style.display = "none";

  GIFTS.forEach((gift, i) => {
    const box = document.createElement("button");
    box.className = "gift-box";
    box.type = "button";
    box.setAttribute("aria-label", "Buka kado " + (i + 1));
    const icon = document.createElement("span");
    icon.className = "gift-icon";
    icon.textContent = "🎁";
    box.appendChild(icon);
    box.addEventListener("click", () => openGift(box, i));
    row.appendChild(box);
  });
}

function openGift(box, i) {
  if (box.classList.contains("opened")) return;
  box.classList.add("opened");

  const gift = GIFTS[i];
  const icon = box.querySelector(".gift-icon");
  if (icon) icon.textContent = gift.emoji;

  giftOpened++;
  const count = document.getElementById("giftCount");
  if (count) count.textContent = giftOpened;

  const reveal = document.getElementById("giftReveal");
  if (reveal) {
    reveal.innerHTML = "";
    const e = document.createElement("span");
    e.className = "gift-reveal-emoji";
    e.textContent = gift.emoji;
    const t = document.createElement("div");
    t.className = "gift-reveal-text";
    t.textContent = gift.text;
    reveal.appendChild(e);
    reveal.appendChild(t);
    reveal.classList.remove("show");
    void reveal.offsetWidth;
    reveal.classList.add("show");
  }

  if (typeof birthdayConfetti === "function") birthdayConfetti(25);

  if (giftOpened === GIFTS.length) {
    const msg = document.getElementById("giftMessage");
    if (msg) {
      msg.textContent = "SEMUA KADO TERBUKA! 🎉🎂";
      msg.classList.add("show");
    }
    const btn = document.getElementById("giftSurpriseBtn");
    if (btn) btn.style.display = "inline-block";

    if (typeof birthdayConfetti === "function") birthdayConfetti(60);
    if (typeof createPageSparkles === "function") createPageSparkles();
    if (typeof fireworksBurst === "function") fireworksBurst(6);
  }
}


/* =========================================================
   ?? KEMBANG API CANVAS
========================================================= */

const fwCanvas = document.getElementById("fireworksCanvas");
const fwx = fwCanvas ? fwCanvas.getContext("2d") : null;
let fwActive = false;
let fwRAF = null;
let fwRockets = [];
let fwParticles = [];

function fireworksResize() {
  if (!fwCanvas) return;
  fwCanvas.width = innerWidth;
  fwCanvas.height = innerHeight;
}

addEventListener("resize", fireworksResize);
fireworksResize();

function fwLaunchRocket(targetX) {
  const x = targetX !== undefined
    ? targetX
    : fwCanvas.width * (0.12 + Math.random() * 0.76);
  const hue = Math.floor(Math.random() * 360);
  fwRockets.push({
    x: x + (Math.random() * 30 - 15),
    y: fwCanvas.height + 8,
    vy: -(fwCanvas.height / 95) - Math.random() * 2.2,
    targetY: fwCanvas.height * (0.16 + Math.random() * 0.34),
    hue: hue
  });
}

function fwExplode(x, y, hue) {
  const count = 55 + Math.floor(Math.random() * 45);
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1.5 + Math.random() * 4.6;
    fwParticles.push({
      x: x,
      y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      decay: 0.011 + Math.random() * 0.02,
      hue: hue + (Math.random() * 36 - 18),
      size: 1.4 + Math.random() * 2.4,
      twinkle: Math.random() > 0.7
    });
  }
}

function fireworksTick() {
  if (!fwActive || !fwx) return;

  fwx.globalCompositeOperation = "destination-out";
  fwx.fillStyle = "rgba(0,0,0,0.16)";
  fwx.fillRect(0, 0, fwCanvas.width, fwCanvas.height);
  fwx.globalCompositeOperation = "lighter";

  /* Roket naik */
  for (let i = fwRockets.length - 1; i >= 0; i--) {
    const r = fwRockets[i];
    r.y += r.vy;
    fwx.beginPath();
    fwx.arc(r.x, r.y, 2.2, 0, Math.PI * 2);
    fwx.fillStyle = "hsla(" + r.hue + ",100%,75%,0.9)";
    fwx.fill();
    if (r.y <= r.targetY || r.vy >= -0.5) {
      fwExplode(r.x, r.y, r.hue);
      fwRockets.splice(i, 1);
    }
  }

  /* Partikel ledakan */
  for (let i = fwParticles.length - 1; i >= 0; i--) {
    const p = fwParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.035;
    p.vx *= 0.985;
    p.vy *= 0.985;
    p.life -= p.decay;

    if (p.life <= 0) {
      fwParticles.splice(i, 1);
      continue;
    }

    const alpha = p.twinkle && Math.random() > 0.5 ? p.life * 0.35 : p.life;
    fwx.beginPath();
    fwx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    fwx.fillStyle = "hsla(" + p.hue + ",100%," + (58 + p.life * 22) + "%," + alpha + ")";
    fwx.fill();
  }

  if (Math.random() < 0.028) fwLaunchRocket();

  fwRAF = requestAnimationFrame(fireworksTick);
}

function fireworksStart() {
  if (!fwCanvas || fwActive) return;
  fwActive = true;
  fireworksResize();
  fwCanvas.classList.add("active");
  for (let i = 0; i < 3; i++) {
    setTimeout(() => fwLaunchRocket(), i * 350);
  }
  fwRAF = requestAnimationFrame(fireworksTick);
}

function fireworksStop() {
  if (!fwActive) return;
  fwActive = false;
  cancelAnimationFrame(fwRAF);
  fwRockets = [];
  fwParticles = [];
  if (fwCanvas && fwx) {
    fwx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);
  }
  fwCanvas.classList.remove("active");
}

/* Ledakan besar sesaat */
function fireworksBurst(amount = 5) {
  if (!fwCanvas) return;
  if (!fwActive) fireworksStart();
  for (let i = 0; i < amount; i++) {
    setTimeout(() => {
      fwLaunchRocket(fwCanvas.width * (0.2 + Math.random() * 0.6));
    }, i * 260);
  }
}


/* =========================================================
   ?? TIUP LILIN KUE
========================================================= */

let candlesLit = 0;

function buildBirthdayCake() {
  const row = document.getElementById("candleRow");
  if (!row || row.dataset.built) return;
  row.dataset.built = "1";

  for (let i = 0; i < 5; i++) {
    const candle = document.createElement("div");
    candle.className = "cake-candle";
    candle.style.left = (14 + i * 18) + "%";
    candle.setAttribute("aria-label", "Tiup lilin " + (i + 1));
    candle.innerHTML =
      '<span class="cake-flame"></span>' +
      '<span class="cake-smoke"></span>';
    candle.addEventListener("click", function (e) {
      e.stopPropagation();
      blowCandle(candle);
    });
    row.appendChild(candle);
  }

  candlesLit = row.children.length;
}

function blowCandle(candle) {
  if (!candle || candle.classList.contains("out")) return;
  candle.classList.add("out");
  candlesLit--;

  if (typeof createPageSparkles === "function") createPageSparkles();

  if (candlesLit === 0) {
    const msg = document.getElementById("cakeMessage");
    if (msg) {
      msg.textContent = "SEMUA LILIN MATI! Semoga semua doamu terkabul ????";
      msg.classList.add("show");
    }
    const btn = document.getElementById("relightBtn");
    if (btn) btn.style.display = "inline-block";

    if (typeof birthdayConfetti === "function") birthdayConfetti(50);
    if (typeof fireworksBurst === "function") fireworksBurst(5);
  }
}

function relightCandles() {
  const row = document.getElementById("candleRow");
  if (!row) return;
  [...row.children].forEach(c => c.classList.remove("out"));
  candlesLit = row.children.length;

  const msg = document.getElementById("cakeMessage");
  if (msg) msg.classList.remove("show");

  const btn = document.getElementById("relightBtn");
  if (btn) btn.style.display = "none";
}


/* =========================================================
   ?? LIGHTBOX GALLERY
========================================================= */

let lightboxIndex = 0;

function getGalleryImages() {
  return [...document.querySelectorAll(".gallery .photo img")];
}

function openLightbox(i) {
  const imgs = getGalleryImages();
  const box = document.getElementById("lightbox");
  const imgEl = document.getElementById("lightboxImg");
  const caption = document.getElementById("lightboxCaption");
  if (!imgs.length || !box || !imgEl) return;

  lightboxIndex = ((i % imgs.length) + imgs.length) % imgs.length;
  imgEl.src = imgs[lightboxIndex].src;
  imgEl.alt = imgs[lightboxIndex].alt || "Foto diperbesar";
  if (caption) caption.textContent = "Foto " + (lightboxIndex + 1) + " dari " + imgs.length + " ?";

  box.classList.add("show");

  /* Re-trigger animasi zoom tiap ganti foto */
  const figure = box.querySelector(".lightbox-figure");
  if (figure) {
    figure.style.animation = "none";
    void figure.offsetWidth;
    figure.style.animation = "";
  }
}

function closeLightbox() {
  const box = document.getElementById("lightbox");
  if (box) box.classList.remove("show");
}

function lightboxNav(direction) {
  openLightbox(lightboxIndex + direction);
}

function lightboxBackdropClose(e) {
  if (e.target === e.currentTarget) closeLightbox();
}

document.querySelectorAll(".gallery .photo").forEach((photo, i) => {
  photo.addEventListener("click", () => openLightbox(i));
});


/* =========================================================
   ?? EFEK MESIN KETIK � HALAMAN UCAPAN
========================================================= */

let wishTyped = false;
let wishTypeTimer = null;

function typeWishLetter() {
  const el = document.querySelector(".wish-text");
  if (!el || wishTyped) return;
  wishTyped = true;

  /* Simpan teks asli lalu ketik ulang huruf per huruf */
  const raw = el.innerHTML
    .replace(/<br\s*\/?>(\s*)/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  const fullText = raw;

  el.innerHTML = "";
  el.classList.add("typed");

  const cursor = document.createElement("span");
  cursor.className = "type-cursor";
  el.appendChild(cursor);

  let pos = 0;

  function step() {
    if (pos >= fullText.length) {
      cursor.classList.add("done");
      setTimeout(() => cursor.remove(), 1200);
      if (typeof createPageSparkles === "function") createPageSparkles();
      return;
    }

    let chunk = 1;
    /* Ketik sedikit lebih cepat setelah spasi/jeda biar tidak terlalu lama */
    if (fullText[pos] === "\n") chunk = 1;

    const textNode = document.createTextNode(fullText.slice(pos, pos + chunk));
    el.insertBefore(textNode, cursor);
    pos += chunk;

    wishTypeTimer = setTimeout(step, fullText[pos - 1] === "\n" ? 220 : 17);
  }

  step();
}


/* =========================================================
   ? HITUNG HARI HIDUP � REAL-TIME
========================================================= */

function updateLifeCounter() {
  const d = document.getElementById("lcDays");
  const h = document.getElementById("lcHours");
  const m = document.getElementById("lcMinutes");
  const s = document.getElementById("lcSeconds");
  if (!d || !h || !m || !s) return;

  const birth = new Date(CONFIG.birthday + "T00:00:00");
  let diff = Math.max(0, Date.now() - birth.getTime());

  const days = Math.floor(diff / 86400000); diff -= days * 86400000;
  const hours = Math.floor(diff / 3600000); diff -= hours * 3600000;
  const minutes = Math.floor(diff / 60000); diff -= minutes * 60000;
  const seconds = Math.floor(diff / 1000);

  d.textContent = days.toLocaleString("id-ID");
  h.textContent = hours;
  m.textContent = minutes;
  s.textContent = seconds;
}

setInterval(updateLifeCounter, 1000);
updateLifeCounter();

/* ===================================================
   ?? INIT FITUR BARU
=================================================== */

buildBirthdayCake();

cript.js‎
Original file line number	Diff line number	Diff line change
@@ -1692,67 +1692,3 @@ function updateLifeCounter() {
  m.textContent = minutes;
  s.textContent = seconds;
}
setInterval(updateLifeCounter, 1000);
updateLifeCounter();

/* =========================================================
   ⏳ COUNTDOWN — TERKUNCI SAMPAI 1 SEPTEMBER
========================================================= */

(function () {
  const overlay = document.getElementById("countdownOverlay");
  if (!overlay) return;
   
  /* Target: 1 September tahun ini jam 00:00:00 WIB (UTC+7) */
  const now = new Date();
  let targetYear = now.getFullYear();
  let target = new Date(targetYear, 8, 1, 0, 0, 0); // bulan 8 = September (0-indexed)
  /* tetap terbuka di 1 September 2026 */
  if (now >= target) {
    targetYear++;
    target = new Date(targetYear, 8, 1, 0, 0, 0);
  }
  /* Update countdown setiap detik */
  function updateCountdown() {
    const current = new Date();
    let diff = target.getTime() - current.getTime();
     
    /* Kalau sudah waktunya, buka overlay */
    if (diff <= 0) {
      overlay.classList.add("hidden");
      document.body.classList.remove("countdown-active");
      return;
    }
    const days = Math.floor(diff / 86400000); diff -= days * 86400000;
    const hours = Math.floor(diff / 3600000); diff -= hours * 3600000;
    const minutes = Math.floor(diff / 60000); diff -= minutes * 60000;
    const seconds = Math.floor(diff / 1000);
    document.getElementById("cdDays").textContent = String(days).padStart(2, "0");
    document.getElementById("cdHours").textContent = String(hours).padStart(2, "0");
    document.getElementById("cdMinutes").textContent = String(minutes).padStart(2, "0");
    document.getElementById("cdSeconds").textContent = String(seconds).padStart(2, "0");
  }
  /* Update teks tahun */
  const dateEl = document.getElementById("countdownDate");
  if (dateEl) dateEl.textContent = "🗓️ 1 SEPTEMBER " + targetYear;
  /* Sembunyikan dulu semua konten */
  document.body.classList.add("countdown-active");
  /* Update pertama kali + timer */
  updateCountdown();
  setInterval(updateCountdown, 1000);
})();
