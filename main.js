/* ══════════════════════════════════════
   UlixWa – main.js
══════════════════════════════════════ */

// ─ STATE ─
let currentLang = 'lt';
const LANG_KEY = 'ulixwa_lang';

// ─ INIT ─
document.addEventListener('DOMContentLoaded', () => {
  initLang();
  initParticles();
  initLoader();
  initOnlineCount();
  initScrollReveal();
  initNav();
});

// ══════════════════════════════════════
// LANGUAGE SYSTEM
// ══════════════════════════════════════
function initLang() {
  const saved = localStorage.getItem(LANG_KEY);
  if (saved) {
    currentLang = saved;
    hideLangOverlay();
    applyLang(currentLang);
  }
}

function selectLang(lang) {
  currentLang = lang;
  localStorage.setItem(LANG_KEY, lang);
  hideLangOverlay();
  applyLang(lang);
}

function hideLangOverlay() {
  const overlay = document.getElementById('lang-overlay');
  overlay.classList.add('hidden');
  setTimeout(() => overlay.style.display = 'none', 700);
}

function openLangSelector() {
  const overlay = document.getElementById('lang-overlay');
  overlay.style.display = 'flex';
  requestAnimationFrame(() => overlay.classList.remove('hidden'));
}

function applyLang(lang) {
  // All elements with data-lt/en/pl attributes
  document.querySelectorAll('[data-lt], [data-en], [data-pl]').forEach(el => {
    const text = el.getAttribute(`data-${lang}`);
    if (text && !el.classList.contains('rank-data')) {
      el.textContent = text;
    }
  });

  // Update loader status
  const status = document.getElementById('loaderStatus');
  if (status) {
    const map = { lt: 'Kraunama...', en: 'Loading...', pl: 'Ładowanie...' };
    status.textContent = map[lang];
  }

  // Update copy toast text and modal labels if open
  updateModalLang(lang);
}

function updateModalLang(lang) {
  // Re-apply lang to modal elements
  document.querySelectorAll('#rankModal [data-lt], #rankModal [data-en], #rankModal [data-pl]').forEach(el => {
    const text = el.getAttribute(`data-${lang}`);
    if (text) el.textContent = text;
  });
  document.querySelectorAll('#rewardOverlay [data-lt], #rewardOverlay [data-en], #rewardOverlay [data-pl]').forEach(el => {
    const text = el.getAttribute(`data-${lang}`);
    if (text) el.textContent = text;
  });
}

// ══════════════════════════════════════
// PARTICLE CANVAS
// ══════════════════════════════════════
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let W, H;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function spawnParticle() {
    return {
      x: Math.random() * W,
      y: H + 10,
      vx: (Math.random() - .5) * .6,
      vy: -(1.5 + Math.random() * 2.5),
      size: .8 + Math.random() * 2.2,
      opacity: .5 + Math.random() * .5,
      color: Math.random() > .3 ? '#00ff88' : (Math.random() > .5 ? '#00e5ff' : '#ffd700'),
      life: 0,
      maxLife: 120 + Math.random() * 180
    };
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    if (Math.random() > .92) particles.push(spawnParticle());
    particles = particles.filter(p => p.life < p.maxLife);
    particles.forEach(p => {
      p.x += p.vx + Math.sin(p.life * .03) * .3;
      p.y += p.vy;
      p.life++;
      const fade = Math.min(1, Math.min(p.life / 30, (p.maxLife - p.life) / 30));
      ctx.save();
      ctx.globalAlpha = p.opacity * fade;
      ctx.shadowBlur = 6;
      ctx.shadowColor = p.color;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  for (let i = 0; i < 20; i++) {
    const p = spawnParticle();
    p.y = Math.random() * H;
    p.life = Math.random() * p.maxLife;
    particles.push(p);
  }
  draw();
}

// ══════════════════════════════════════
// LOADER
// ══════════════════════════════════════
function initLoader() {
  const loader = document.getElementById('loader');
  const messages = {
    lt: ['Jungiamasi...', 'Kraunami resursai...', 'Inicializuojama...', 'Beveik...', 'Paruošta!'],
    en: ['Connecting...', 'Loading resources...', 'Initializing...', 'Almost ready...', 'Ready!'],
    pl: ['Łączenie...', 'Ładowanie zasobów...', 'Inicjalizacja...', 'Prawie gotowe...', 'Gotowe!']
  };
  const msgs = messages[currentLang] || messages.lt;
  const status = document.getElementById('loaderStatus');
  let i = 0;
  const interval = setInterval(() => {
    if (status && msgs[i]) status.textContent = msgs[i++];
    if (i >= msgs.length) clearInterval(interval);
  }, 520);

  // Loader particles
  const lp = document.getElementById('loaderParticles');
  if (lp) {
    for (let j = 0; j < 30; j++) {
      const d = document.createElement('div');
      d.style.cssText = `
        position:absolute;
        width:${2+Math.random()*3}px;height:${2+Math.random()*3}px;
        background:${Math.random()>.5?'#00ff88':'#00e5ff'};
        border-radius:50%;
        left:${Math.random()*100}%;
        top:${Math.random()*100}%;
        opacity:0;
        box-shadow:0 0 6px currentColor;
        animation:loaderDot ${3+Math.random()*4}s ease-in-out ${Math.random()*2}s infinite alternate;
      `;
      lp.appendChild(d);
    }
    // inject keyframe
    const style = document.createElement('style');
    style.textContent = `@keyframes loaderDot{0%{opacity:0;transform:scale(.5);}50%{opacity:.8;transform:scale(1.2);}100%{opacity:.2;transform:scale(.8);}}`;
    document.head.appendChild(style);
  }

  setTimeout(() => {
    loader.classList.add('hidden');
  }, 3200);
}

// ══════════════════════════════════════
// ONLINE COUNT
// ══════════════════════════════════════
function initOnlineCount() {
  const el = document.getElementById('onlineNum');
  if (!el) return;
  
  // Animate count from 0
  function animateCount(target) {
    let cur = 0;
    const step = Math.ceil(target / 20);
    const t = setInterval(() => {
      cur = Math.min(cur + step, target);
      el.textContent = cur;
      if (cur >= target) clearInterval(t);
    }, 50);
  }

  // Try to fetch real server status via mcapi.us (CORS-friendly)
  fetch(`https://api.mcsrvstat.us/3/ulixwa.lt`)
    .then(r => r.json())
    .then(data => {
      const online = data?.players?.online ?? 0;
      animateCount(online);
      if (data?.online === false) {
        el.textContent = 'Offline';
        el.style.color = '#ff5050';
        document.querySelector('.online-dot').style.background = '#ff5050';
        document.querySelector('.online-dot').style.boxShadow = '0 0 10px #ff5050';
      }
    })
    .catch(() => {
      // Fallback: fetch with different endpoint
      fetch(`https://mcapi.us/server/status?ip=ulixwa.lt`)
        .then(r => r.json())
        .then(d => {
          const n = d?.players?.now ?? 0;
          animateCount(n);
        })
        .catch(() => {
          animateCount(0);
          el.textContent = '—';
        });
    });
}

// ══════════════════════════════════════
// SCROLL REVEAL
// ══════════════════════════════════════
function initScrollReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

// ══════════════════════════════════════
// NAV
// ══════════════════════════════════════
function initNav() {
  const nav = document.getElementById('mainNav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });

  // Smooth scroll for all anchors
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const t = document.querySelector(a.getAttribute('href'));
      if (t) t.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

// ══════════════════════════════════════
// COPY IP
// ══════════════════════════════════════
function copyIP() {
  navigator.clipboard.writeText('UlixWa.lt').then(() => {
    const toast = document.getElementById('copyToast');
    const msgs = { lt: '✓ Nukopijuota!', en: '✓ Copied!', pl: '✓ Skopiowano!' };
    toast.textContent = msgs[currentLang] || '✓ Copied!';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
  });
}

// ══════════════════════════════════════
// RANK MODAL
// ══════════════════════════════════════
function openRankModal(card) {
  const data = card.querySelector('.rank-data');
  if (!data) return;

  const lang = currentLang;
  const color = data.getAttribute('data-color');
  const icon = data.getAttribute('data-icon');
  const name = data.getAttribute('data-name');
  const price = data.getAttribute('data-price');
  const desc = data.getAttribute(`data-${lang}-desc`) || data.getAttribute('data-lt-desc');
  const cmds = data.getAttribute(`data-${lang}-cmds`) || data.getAttribute('data-lt-cmds');

  document.getElementById('modalIcon').textContent = icon;
  document.getElementById('modalName').textContent = name;
  document.getElementById('modalName').style.color = color;
  document.getElementById('modalName').style.textShadow = `0 0 20px ${color}`;
  document.getElementById('modalPrice').textContent = `${price}€`;
  document.getElementById('modalDesc').textContent = desc;

  // Format commands
  const cmdList = cmds.split('·').map(c => c.trim()).filter(Boolean);
  document.getElementById('modalCmds').innerHTML = cmdList.map(c =>
    `<div style="padding:2px 0;"><span style="color:${color};opacity:.7">▸</span> ${c}</div>`
  ).join('');

  // Style modal buy btn color
  const buyBtn = document.getElementById('modalBuyBtn');
  buyBtn.style.borderColor = `rgba(${hexToRgb(color)},.5)`;
  buyBtn.style.color = color;

  // Apply lang to labels inside modal
  updateModalLang(lang);

  document.getElementById('rankModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeRankModal(e, force) {
  if (force || e?.target === document.getElementById('rankModal')) {
    document.getElementById('rankModal').classList.remove('open');
    document.body.style.overflow = '';
  }
}

function hexToRgb(hex) {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r ? `${parseInt(r[1],16)},${parseInt(r[2],16)},${parseInt(r[3],16)}` : '0,255,136';
}

// ══════════════════════════════════════
// DAILY REWARD SYSTEM
// ══════════════════════════════════════
function confirmDailyNick() {
  const nick = document.getElementById('dailyNick').value.trim();
  if (!nick) {
    document.getElementById('dailyNick').style.animation = 'shake .3s ease';
    setTimeout(() => document.getElementById('dailyNick').style.animation = '', 350);
    return;
  }

  // Add shake CSS
  const style = document.createElement('style');
  style.textContent = `@keyframes shake{0%,100%{transform:translateX(0);}25%{transform:translateX(-8px);}75%{transform:translateX(8px);}}`;
  document.head.appendChild(style);

  const greetings = {
    lt: `Sveikas, ${nick}! 🌿 Atidaryti skrynią?`,
    en: `Welcome, ${nick}! 🌿 Open the chest?`,
    pl: `Witaj, ${nick}! 🌿 Otwórz skrzynię?`
  };

  document.getElementById('dailyGreeting').textContent = greetings[currentLang] || greetings.lt;
  document.getElementById('dailyNickStep').style.display = 'none';
  document.getElementById('dailyChestStep').style.display = 'block';

  // Make chest shake + glow
  const chest = document.getElementById('chestContainer');
  let shakeCount = 0;
  const shakeTimer = setInterval(() => {
    chest.classList.add('shake');
    setTimeout(() => chest.classList.remove('shake'), 500);
    shakeCount++;
    if (shakeCount >= 3) clearInterval(shakeTimer);
  }, 1200);

  // Rainbow glow animation on chest
  injectChestGlow();
}

function injectChestGlow() {
  const chest = document.getElementById('chestContainer');
  let hue = 0;
  const chestGlowEl = chest.querySelector('.chest-glow');
  const interval = setInterval(() => {
    hue = (hue + 3) % 360;
    if (chestGlowEl) {
      chestGlowEl.style.background = `radial-gradient(ellipse, hsla(${hue},100%,60%,.5), transparent 70%)`;
    }
  }, 30);
  chest._glowInterval = interval;
}

let chestOpened = false;

function openChest() {
  if (chestOpened) return;
  chestOpened = true;

  // Stop rainbow
  const chest = document.getElementById('chestContainer');
  if (chest._glowInterval) clearInterval(chest._glowInterval);

  // Open lid
  const lid = document.getElementById('chestLid');
  lid.classList.add('open');
  chest.querySelector('.chest-hint').style.opacity = '0';

  // Play open sound (synthesized)
  playChestSound();

  setTimeout(() => {
    // Flash white
    showReward();
  }, 600);
}

function playChestSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    // Chest creak: low freq sweep
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + .4);
    gain.gain.setValueAtTime(.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .5);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + .5);

    // Reward jingle
    setTimeout(() => {
      [523, 659, 784, 1047].forEach((freq, i) => {
        const o2 = ctx.createOscillator();
        const g2 = ctx.createGain();
        o2.connect(g2);
        g2.connect(ctx.destination);
        o2.type = 'sine';
        o2.frequency.value = freq;
        g2.gain.setValueAtTime(.06, ctx.currentTime + i * .12);
        g2.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + i * .12 + .3);
        o2.start(ctx.currentTime + i * .12);
        o2.stop(ctx.currentTime + i * .12 + .35);
      });
    }, 300);
  } catch(e) {}
}

function showReward() {
  const flash = document.getElementById('rewardFlash');
  flash.classList.add('flash');
  const overlay = document.getElementById('rewardOverlay');
  overlay.classList.add('open');

  setTimeout(() => flash.classList.remove('flash'), 200);

  // Roll reward
  const reward = rollReward();
  displayReward(reward);
  spawnRewardStars();
}

// Loot table
const LOOT_TABLE = [
  { weight: 1,  emoji: '🔑', lt_name: 'Paslaugos Raktas',   en_name: 'Service Key',     pl_name: 'Klucz Usługi',    rarity: 'LEGENDARY', rarity_color: '#ffd700', lt_claim: 'Rašyk /discord ir nurodyk nick\'ą, kad gautum raktą!', en_claim: 'Type /discord and specify your nick to claim the key!', pl_claim: 'Napisz /discord i podaj nick, aby odebrać klucz!' },
  { weight: 7,  emoji: '⭐', lt_name: 'VIP 1–3 Dienos',     en_name: 'VIP 1–3 Days',    pl_name: 'VIP 1–3 Dni',     rarity: 'EPIC',      rarity_color: '#bf5fff', lt_claim: 'Kreipkis į administraciją Discord serverio!', en_claim: 'Contact administration on Discord server!', pl_claim: 'Skontaktuj się z administracją na serwerze Discord!' },
  { weight: 10, emoji: '🎒', lt_name: 'VIP Kit',            en_name: 'VIP Kit',          pl_name: 'Zestaw VIP',      rarity: 'RARE',      rarity_color: '#00e5ff', lt_claim: 'Prisijunk ir naudok /kit vip serveryje!', en_claim: 'Log in and use /kit vip on the server!', pl_claim: 'Zaloguj się i użyj /kit vip na serwerze!' },
  { weight: 13, emoji: '🪣', lt_name: 'Hopper ×4',          en_name: 'Hopper ×4',        pl_name: 'Lej ×4',          rarity: 'UNCOMMON',  rarity_color: '#00ff88', lt_claim: 'Prisijunk – daiktai bus jūsų inventoryje!', en_claim: 'Log in – items will be in your inventory!', pl_claim: 'Zaloguj się – przedmioty będą w twoim ekwipunku!' },
  { weight: 15, emoji: '🎁', lt_name: 'Serverio Rinkinukas', en_name: 'Server Bundle',   pl_name: 'Pakiet Serwera',  rarity: 'UNCOMMON',  rarity_color: '#00ff88', lt_claim: 'Prisijunk – daiktai bus jūsų inventoryje!', en_claim: 'Log in – items will be in your inventory!', pl_claim: 'Zaloguj się – przedmioty będą w twoim ekwipunku!' },
  { weight: 50, emoji: '💎', lt_name: '16× Deimantai',      en_name: '16× Diamonds',     pl_name: '16× Diamenty',    rarity: 'COMMON',    rarity_color: '#a0d0ff', lt_claim: 'Prisijunk – deimantai bus jūsų inventoryje!', en_claim: 'Log in – diamonds will be in your inventory!', pl_claim: 'Zaloguj się – diamenty będą w twoim ekwipunku!' },
  { weight: 50, emoji: '🪨', lt_name: '16× Geležis',        en_name: '16× Iron',         pl_name: '16× Żelazo',      rarity: 'COMMON',    rarity_color: '#a0d0ff', lt_claim: 'Prisijunk – geležis bus jūsų inventoryje!', en_claim: 'Log in – iron will be in your inventory!', pl_claim: 'Zaloguj się – żelazo będzie w twoim ekwipunku!' },
  { weight: 50, emoji: '🥇', lt_name: '16× Auksas',         en_name: '16× Gold',         pl_name: '16× Złoto',       rarity: 'COMMON',    rarity_color: '#a0d0ff', lt_claim: 'Prisijunk – auksas bus jūsų inventoryje!', en_claim: 'Log in – gold will be in your inventory!', pl_claim: 'Zaloguj się – złoto będzie w twoim ekwipunku!' },
];

function rollReward() {
  const total = LOOT_TABLE.reduce((s, r) => s + r.weight, 0);
  let rand = Math.random() * total;
  for (const r of LOOT_TABLE) {
    rand -= r.weight;
    if (rand <= 0) return r;
  }
  return LOOT_TABLE[LOOT_TABLE.length - 1];
}

function displayReward(r) {
  const lang = currentLang;
  document.getElementById('rewardItemDisplay').textContent = r.emoji;
  document.getElementById('rewardItemName').textContent = r[`${lang}_name`] || r.lt_name;

  const rarityEl = document.getElementById('rewardRarity');
  rarityEl.textContent = r.rarity;
  rarityEl.style.background = `${r.rarity_color}22`;
  rarityEl.style.color = r.rarity_color;
  rarityEl.style.border = `1px solid ${r.rarity_color}44`;

  document.getElementById('rewardClaimInfo').textContent = r[`${lang}_claim`] || r.lt_claim;

  // Apply lang
  updateModalLang(lang);
}

function spawnRewardStars() {
  const container = document.getElementById('rewardStars');
  container.innerHTML = '';
  for (let i = 0; i < 20; i++) {
    const star = document.createElement('div');
    const colors = ['#ffd700','#00ff88','#00e5ff','#ff50a0','#fff'];
    star.style.cssText = `
      position:absolute;
      width:${4+Math.random()*6}px;height:${4+Math.random()*6}px;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      border-radius:50%;
      left:${Math.random()*100}%;
      top:${Math.random()*100}%;
      box-shadow:0 0 8px currentColor;
      animation:starBurst ${.8+Math.random()*1.2}s ease forwards;
      animation-delay:${Math.random()*.5}s;
    `;
    container.appendChild(star);
  }
  const style = document.createElement('style');
  if (!document.getElementById('starburst-style')) {
    style.id = 'starburst-style';
    style.textContent = `@keyframes starBurst{0%{transform:scale(0);opacity:1;}100%{transform:scale(1) translate(${Math.random()>0.5?'+':'-'}${20+Math.random()*60}px, ${Math.random()>0.5?'+':'-'}${20+Math.random()*60}px);opacity:0;}}`;
    document.head.appendChild(style);
  }
}

function closeRewardModal() {
  document.getElementById('rewardOverlay').classList.remove('open');
  // Reset chest for next play
  setTimeout(() => {
    chestOpened = false;
    document.getElementById('dailyNickStep').style.display = '';
    document.getElementById('dailyChestStep').style.display = 'none';
    document.getElementById('dailyNick').value = '';
    document.getElementById('chestLid').classList.remove('open');
    document.querySelector('.chest-hint').style.opacity = '';
    injectChestGlow();
    const chest = document.getElementById('chestContainer');
    let shakeCount = 0;
    const shakeTimer = setInterval(() => {
      chest.classList.add('shake');
      setTimeout(() => chest.classList.remove('shake'), 500);
      if (++shakeCount >= 3) clearInterval(shakeTimer);
    }, 1200);
  }, 400);
}

// Close modal on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeRankModal(null, true);
    closeRewardModal();
  }
});
