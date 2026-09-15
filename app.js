import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, get, set, update, push, onValue, query, orderByChild, equalTo, runTransaction } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Lets the boot-watchdog script in index.html (which runs independently of
// this module) tell "module never loaded" apart from "module loaded but
// init() hung/failed" when diagnosing stuck-loading reports.
window.__scriptStarted = true;


const ICONS = {
  tag:      `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41L11 22.99a2 2 0 0 1-2.83 0L1.5 16.32a2 2 0 0 1 0-2.83L11 4h9v9z"></path><circle cx="16.5" cy="7.5" r="1.5"></circle></svg>`,
  rocket:   `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path></svg>`,
  diamond:  `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12l4 6-10 12L2 9z"></path><path d="M2 9h20M9 3l3 6-3 12M15 3l-3 6 3 12"></path></svg>`,
  crown:    `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 19h20l-2-9-5 4-3-8-3 8-5-4z"></path></svg>`,
  shield:   `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z"></path></svg>`,
  scale:    `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"></path><path d="M5 7h14"></path><path d="M5 7l-3 7a3.5 3.5 0 0 0 6 0z"></path><path d="M19 7l-3 7a3.5 3.5 0 0 0 6 0z"></path></svg>`,
  flame:    `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 17a2.5 2.5 0 0 0 2.5-2.5c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7.5 7.5 0 1 1-15 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>`,
  chart:    `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>`,
  mail:     `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="M22 6l-10 7L2 6"></path></svg>`,
  share:    `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>`,
  pickaxe:  `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 3.5l6 6L9 21l-6-6z"></path><path d="M12 6l6 6"></path></svg>`,
  people:   `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
  telegram: `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M21.5 2.5l-19 7.5 6 2.3 2.3 7.2 3.4-4.3 5.6 4.1z"></path></svg>`,
  card:     `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"></rect><path d="M2 10h20"></path></svg>`,
  code:     `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`,
  play:     `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"></polygon></svg>`,
  pause:    `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`,
  bolt:     `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`,
  headset:  `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 14v-2a9 9 0 0 1 18 0v2"></path><path d="M21 15a2 2 0 0 1-2 2h-1v-5h1a2 2 0 0 1 2 2zM3 15a2 2 0 0 0 2 2h1v-5H5a2 2 0 0 0-2 2z"></path></svg>`,
  copy:     `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`,
  gift:     `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="4" rx="1"></rect><path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"></path><path d="M12 8c-1.5-3-5-4-6-2s1 3 6 2zM12 8c1.5-3 5-4 6-2s-1 3-6 2z"></path></svg>`,
  bell:     `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>`,
  inbox:    `<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-6l-2 3h-4l-2-3H2"></path><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path></svg>`,
  coin:     `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v10M9 9.5c0-1.4 1.3-2.5 3-2.5s3 1.1 3 2.5-1.3 2-3 2-3 .6-3 2 1.3 2.5 3 2.5 3-1.1 3-2.5"></path></svg>`,
  plus:     `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
  download: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`,
  lock:     `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="10.5" width="16" height="10" rx="2"></rect><path d="M7.5 10.5V7a4.5 4.5 0 0 1 9 0v3.5"></path></svg>`,
  minus:    `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
  check:    `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
  circle:   `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"></circle></svg>`,
  warning:  `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4"></path><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><circle cx="12" cy="17" r=".5"></circle></svg>`,
  success:  `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><polyline points="8 12 11 15 16 9"></polyline></svg>`,
  megaphone:`<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l18-5v12L3 14v-3z"></path><path d="M7 14v5a2 2 0 0 0 2 2h1v-6"></path></svg>`,
  hourglass:`<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 22h14M5 2h14M5 22v-4a7 7 0 0 1 7-7 7 7 0 0 1 7 7v4M5 2v4a7 7 0 0 0 7 7 7 7 0 0 0 7-7V2"></path></svg>`,
  exchange: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>`,
  calendar: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
  facebook: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>`,
  cart:     `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h16l-2 8H6z"></path><path d="M4 8V5h16v3"></path><circle cx="8" cy="19" r="1.5"></circle><circle cx="16" cy="19" r="1.5"></circle></svg>`,
  upload:   `<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16V4"></path><polyline points="7 9 12 4 17 9"></polyline><path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"></path></svg>`,
};


const firebaseConfig = {
  apiKey: "AIzaSyAHzOBX_27Mc1T5oTbQ4ryP8qjnwaQm0PU",
  authDomain: "atrenva-mining-moe.firebaseapp.com",
  databaseURL: "https://atrenva-mining-moe-default-rtdb.firebaseio.com",
  projectId: "atrenva-mining-moe",
  storageBucket: "atrenva-mining-moe.firebasestorage.app",
  messagingSenderId: "507707831828",
  appId: "1:507707831828:web:2d080d3c167cec6e379901",
  measurementId: "G-FKC0Q63717"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);

// Load the rewarded-ad SDK immediately (before login) and keep it live-updated from admin settings.
listenAdSdkSettings();
// Keep the Mining "Uncle" roster (rate/cap/price/refer requirements per Uncle) live-updated from admin settings.
listenMiningSettings();


const tg = window.Telegram ? window.Telegram.WebApp : null;
if (tg) {
  tg.ready();
  // tg.expand(); // removed so title bar stays visible
  try { tg.disableVerticalSwipes && tg.disableVerticalSwipes(); } catch(e){}
  try { tg.setHeaderColor && tg.setHeaderColor('secondary_bg_color'); } catch(e){}
  try { tg.setBackgroundColor && tg.setBackgroundColor('#0f0f10'); } catch(e){}
  // requestFullscreen removed — was pushing the top bar under the status bar
}

function getTelegramUser(){
  return tg?.initDataUnsafe?.user || null;
}

// Generic helper: races any promise against a timeout so a hung network/WebSocket
// call (common inside Telegram's in-app WebView) can never block init() forever.
function withTimeout(promise, ms, label){
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout: ' + label)), ms))
  ]);
}

async function getUserIP(){
  try{
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res = await fetch('https://api.ipify.org?format=json', { signal: controller.signal });
    clearTimeout(timer);
    const data = await res.json();
    return data.ip || null;
  }catch(e){
    return null;
  }
}

function buildProfileFromTelegram(tgUser){
  return {
    id: tgUser.id,
    uid: String(tgUser.id),
    firstName: tgUser.first_name || '',
    lastName: tgUser.last_name || '',
    username: tgUser.username || ('user' + tgUser.id),
    hasUsername: !!tgUser.username,
    photoUrl: tgUser.photo_url || ''
  };
}


let CURRENCY_SYMBOL = 'AENVA';
function listenCurrencySymbol(){
  onValue(ref(db, 'settings/currencySymbol'), snap => {
    CURRENCY_SYMBOL = snap.exists() && snap.val() ? String(snap.val()) : 'AENVA';
    if (currentScreen === 'home') renderHome();
    if (currentScreen === 'profile') renderProfile();
    if (currentScreen === 'transaction'){
      const activeTab = document.querySelector('.trans-tab.active');
      renderTransactions(activeTab ? activeTab.dataset.tab : 'all');
    }
  });
}
function fmt(n){
  const v = Number(n || 0);
  let s = v.toFixed(8);
  if (s.includes('.')) s = s.replace(/0+$/, '').replace(/\.$/, '');
  const dot = s.indexOf('.');
  if (dot === -1){ s += '.00'; }
  else if (s.length - dot - 1 < 2){ s = s + '0'.repeat(2 - (s.length - dot - 1)); }
  return s + ' ' + CURRENCY_SYMBOL;
}
function fmtNum(n){
  const v = Number(n || 0);
  let s = v.toFixed(8);
  if (s.includes('.')) s = s.replace(/0+$/, '').replace(/\.$/, '');
  const dot = s.indexOf('.');
  if (dot === -1){ s += '.00'; }
  else if (s.length - dot - 1 < 2){ s = s + '0'.repeat(2 - (s.length - dot - 1)); }
  return s;
}
function fmtCredit(n){ return Number(n||0).toFixed(2) + ' AENVA'; } // legacy name kept for compat; now formats AENVA

// ---- Deposit/withdraw fees (admin-controlled, realtime) ----
let DEPOSIT_FEE_PERCENT = 3;
let WITHDRAW_FEE_PERCENT = 3;
function listenAtrvaSettings(){
  onValue(ref(db, 'settings/depositFeePercent'), snap => {
    DEPOSIT_FEE_PERCENT = snap.exists() ? Number(snap.val()) : 3;
    if (currentScreen === 'deposit') onDepositAmountChange();
  });
  onValue(ref(db, 'settings/withdrawFeePercent'), snap => {
    WITHDRAW_FEE_PERCENT = snap.exists() ? Number(snap.val()) : 3;
    if (currentScreen === 'withdraw') onWithdrawAmountChange();
  });
}
function methodRate(m){
  const v = Number(m && (m.atrRate ?? m.rate));
  return Number.isFinite(v) && v > 0 ? v : 0;
}
function methodCurrency(m){
  return String((m && (m.currency || m.name)) || 'COIN').trim() || 'COIN';
}
function coinFmt(n, decimals=8){
  const v = Number(n || 0);
  return v.toFixed(decimals).replace(/\.?0+$/, '');
}
function depositPayableCoin(atrAmt, m){
  const rate = methodRate(m);
  const base = Number(atrAmt || 0) * rate;
  const withFee = base * (1 + (DEPOSIT_FEE_PERCENT || 0) / 100);
  if (!appliedDepositCoupon) return Number(withFee.toFixed(8));
  return Number((withFee * (1 - appliedDepositCoupon.discount / 100)).toFixed(8));
}
function withdrawPayoutCoin(atrAmt, m){
  return Number((Number(atrAmt || 0) * methodRate(m)).toFixed(8));
}
// Net AENVA after the admin-controlled withdrawal fee. Kept under both spellings
// for backward compatibility with older cached UI code.
function withdrawNetAtrva(atrAmt){
  const amt = Number(atrAmt || 0);
  return amt * (1 - (WITHDRAW_FEE_PERCENT || 0) / 100);
}
function withdrawNetAtva(atrAmt){
  return withdrawNetAtrva(atrAmt);
}
function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

function showToast(msg, icon){
  const t = document.getElementById('toast');
  document.getElementById('toast-icon').innerHTML = icon || ICONS.success;
  document.getElementById('toast-message').textContent = msg;
  t.classList.remove('hidden');
  requestAnimationFrame(()=> t.classList.add('show'));
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(()=>{
    t.classList.remove('show');
    setTimeout(()=> t.classList.add('hidden'), 350);
  }, 2200);
}

function showLoading(on){
  document.getElementById('loading-overlay').classList.toggle('hidden', !on);
}

function haptic(style){
  try{ tg?.HapticFeedback?.impactOccurred(style || 'light'); }catch(e){}
}

function isSameDay(a,b){
  const da = new Date(a), db = new Date(b);
  return da.getFullYear()===db.getFullYear() && da.getMonth()===db.getMonth() && da.getDate()===db.getDate();
}


function isConsecutiveDay(prevTs, nowTs){
  const prev = new Date(prevTs);
  const now = new Date(nowTs);
  const prevMidnight = new Date(prev.getFullYear(), prev.getMonth(), prev.getDate()).getTime();
  const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  return (nowMidnight - prevMidnight) === 24*60*60*1000;
}


const FREE_PLAN_DAYS = 90;

const INFINITE_EXPIRY = 99999999999999;


// ---- PLAN SYSTEM REMOVED ----
// There are no plan tiers, no daily limits, and no plan-gated features anymore.
// Every economic parameter that used to vary per-plan is now a single global value,
// admin-editable in realtime from settings/economy (see listenEconomySettings()).
const DEFAULT_ECONOMY = {
  exchangeRate: 0.90,          // fixed exchange rate for everyone
  referBonusPercent: 5,        // default referral commission %, admin can raise per-user up to referBonusMax
  referBonusMax: 20,           // ceiling for any per-user override
};
let ECONOMY = { ...DEFAULT_ECONOMY };

function listenEconomySettings(){
  onValue(ref(db, 'settings/economy'), snap => {
    const v = snap.exists() ? snap.val() : null;
    ECONOMY = {
      exchangeRate: (v && v.exchangeRate != null && !isNaN(Number(v.exchangeRate))) ? Number(v.exchangeRate) : DEFAULT_ECONOMY.exchangeRate,
      referBonusPercent: (v && v.referBonusPercent != null && !isNaN(Number(v.referBonusPercent))) ? Number(v.referBonusPercent) : DEFAULT_ECONOMY.referBonusPercent,
      referBonusMax: (v && v.referBonusMax != null && !isNaN(Number(v.referBonusMax))) ? Number(v.referBonusMax) : DEFAULT_ECONOMY.referBonusMax,
    };
    if (currentScreen === 'home') renderHome();
    if (currentScreen === 'profile') renderProfile();
    if (currentScreen === 'refer') renderRefer();
  });
}

// Per-user referral commission %: defaults to ECONOMY.referBonusPercent, but an admin can
// override an individual user up to ECONOMY.referBonusMax (users/{uid}/referBonusPercent).
function userReferBonusPercent(u){
  const override = u && u.referBonusPercent;
  if (override != null && !isNaN(Number(override))){
    return Math.max(0, Math.min(ECONOMY.referBonusMax, Number(override)));
  }
  return ECONOMY.referBonusPercent;
}

// ---- Badge system ----
// Only ONE badge exists: the Moderator badge, granted per-user by the admin
// (users/{uid}/isModerator = true/false). No more plan-tier badges.
// Every badge is stamped with a repeating "AENVA" watermark pattern clipped to the badge shape.
const BADGE_SHAPE_PATH = "M100,10C107.62,10,113.51,20.65,120.71,22.68C128.16,24.79,138.06,17.68,144.64,21.34C151.31,25.06,148.84,37.06,154.02,42.24C159.2,47.42,171.2,44.95,174.92,51.62C178.58,58.2,171.47,68.1,173.58,75.55C175.61,82.75,186.26,88.64,186.26,96.26C186.26,103.88,175.61,109.77,173.58,116.97C171.47,124.42,178.58,134.32,174.92,140.9C171.2,147.57,159.2,145.1,154.02,150.28C148.84,155.46,151.31,167.46,144.64,171.18C138.06,174.84,128.16,167.73,120.71,169.84C113.51,171.87,107.62,182.52,100,182.52C92.38,182.52,86.49,171.87,79.29,169.84C71.84,167.73,61.94,174.84,55.36,171.18C48.69,167.46,51.16,155.46,45.98,150.28C40.8,145.1,28.8,147.57,25.08,140.9C21.42,134.32,28.53,124.42,26.42,116.97C24.39,109.77,13.74,103.88,13.74,96.26C13.74,88.64,24.39,82.75,26.42,75.55C28.53,68.1,21.42,58.2,25.08,51.62C28.8,44.95,40.8,47.42,45.98,42.24C51.16,37.06,48.69,25.06,55.36,21.34C61.94,17.68,71.84,24.79,79.29,22.68C86.49,20.65,92.38,10,100,10Z";

let _badgeUid = 0;
// Moderator badge — the ONLY badge in the app. Admin-grantable per user
// (users/{uid}/isModerator). Same shape + AENVA watermark, animated rainbow fill.
function moderatorBadgeSvg(){
  const uid = 'mod-' + (_badgeUid++);
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" data-badge="moderator">
    <defs>
      <linearGradient id="pbGrad-${uid}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ff5f6d">
          <animate attributeName="stop-color" values="#ff5f6d;#ffc371;#f9f871;#7bdb7f;#63c7ff;#a78bfa;#ff5f6d" dur="6s" repeatCount="indefinite"/>
        </stop>
        <stop offset="50%" stop-color="#7bdb7f">
          <animate attributeName="stop-color" values="#7bdb7f;#63c7ff;#a78bfa;#ff5f6d;#ffc371;#f9f871;#7bdb7f" dur="6s" repeatCount="indefinite"/>
        </stop>
        <stop offset="100%" stop-color="#a78bfa">
          <animate attributeName="stop-color" values="#a78bfa;#ff5f6d;#ffc371;#f9f871;#7bdb7f;#63c7ff;#a78bfa" dur="6s" repeatCount="indefinite"/>
        </stop>
      </linearGradient>
      <pattern id="pbAtr-${uid}" width="46" height="30" patternUnits="userSpaceOnUse" patternTransform="rotate(-20)">
        <text x="0" y="20" font-family="Arial, sans-serif" font-weight="800" font-size="16" fill="#ffffff" fill-opacity="0.22">AENVA</text>
      </pattern>
      <clipPath id="pbClip-${uid}">
        <path d="${BADGE_SHAPE_PATH}"/>
      </clipPath>
    </defs>
    <path fill="url(#pbGrad-${uid})" d="${BADGE_SHAPE_PATH}"/>
    <rect x="0" y="0" width="200" height="200" fill="url(#pbAtr-${uid})" clip-path="url(#pbClip-${uid})"/>
    <path d="M68,98 L90,120 L134,72" fill="none" stroke="#ffffff" stroke-width="15" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}
// Applies the Moderator badge to `el` if isModerator is true; otherwise hides the badge element.
function applyModeratorBadge(el, isModerator){
  if (!el) return;
  if (!isModerator){
    el.classList.add('hidden');
    el.innerHTML = '';
    el.onclick = null;
    return;
  }
  el.innerHTML = moderatorBadgeSvg();
  el.classList.remove('hidden');
  el.classList.add('badge-pulse', 'badge-clickable');
  el.onclick = (e) => { e.stopPropagation(); openBadgeLightbox(); };
}

// ---- Badge lightbox: click the Moderator badge to zoom it in with a blurred backdrop ----
function openBadgeLightbox(){
  let overlay = document.getElementById('badge-lightbox');
  if (!overlay){
    overlay = document.createElement('div');
    overlay.id = 'badge-lightbox';
    overlay.className = 'badge-lightbox';
    overlay.innerHTML = `<div class="badge-lightbox-inner"><div class="badge-lightbox-icon" id="badge-lightbox-icon"></div></div>`;
    overlay.addEventListener('click', closeBadgeLightbox);
    document.body.appendChild(overlay);
  }
  document.getElementById('badge-lightbox-icon').innerHTML = moderatorBadgeSvg();
  document.body.classList.add('badge-lightbox-open');
  requestAnimationFrame(() => overlay.classList.add('show'));
}
function closeBadgeLightbox(){
  const overlay = document.getElementById('badge-lightbox');
  if (!overlay) return;
  overlay.classList.remove('show');
  document.body.classList.remove('badge-lightbox-open');
}
window.openBadgeLightbox = openBadgeLightbox;
window.closeBadgeLightbox = closeBadgeLightbox;

// Live admin-configured Telegram bot token, used only by "Join" tasks with verifyMode:'auto'
// to check real channel membership via the Telegram Bot API's getChatMember method.
let TELEGRAM_BOT_TOKEN = '';
function listenTelegramBotToken(){
  onValue(ref(db, 'settings/telegramBotToken'), snap => {
    TELEGRAM_BOT_TOKEN = snap.exists() && snap.val() ? String(snap.val()) : '';
  });
}
listenTelegramBotToken();

// Checks whether the current Telegram user is a member of chatId (channel/group the
// bot must be an admin in). Returns true/false, or null if the check couldn't be
// performed (no bot token configured, no chat id, network/API error).
async function checkTelegramJoinStatus(chatId){
  if (!TELEGRAM_BOT_TOKEN || !chatId || !state.uid) return null;
  try{
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getChatMember?chat_id=${encodeURIComponent(chatId)}&user_id=${encodeURIComponent(state.uid)}`;
    const res = await fetch(url);
    const data = await res.json();
    if (!data || !data.ok || !data.result) return null;
    const status = String(data.result.status || '').toLowerCase();
    return ['creator', 'administrator', 'member', 'restricted'].includes(status);
  }catch(e){
    console.error('Telegram join check failed', e);
    return null;
  }
}

// =====================================================================
// Mining Activity Check
// Admin controls the interval from Firebase: settings/miningActivityCheck
// { enabled: true, intervalMinutes: 20 }. The check is independent from
// Stone Hunt and is used only to verify that a mining session is active.
let MINING_ACTIVITY_CHECK_ENABLED = true;
let MINING_ACTIVITY_CHECK_MS = 20 * 60 * 1000;
let miningActivityCheckBusy = false;
let miningActivityModalOpen = false;
const MINING_ACTIVITY_MAX_FAILS = 3;
const MINING_ACTIVITY_EMOJI_POOL = [
  '🫐','🙂','⏰','⛏️','🌚','🐶','🤦🏻\u200d♂️','🫠','🥹','😎','🍕','🚀',
  '🎯','🐱','🔥','🍀','⚡','🎈','🍩','🦄','🐸','🎮','🌈','🍉',
  '🥶','🤖','👻','🎃','🐷','🍎'
];
function listenMiningActivityCheckSettings(){
  onValue(ref(db, 'settings/miningActivityCheck'), snap => {
    const v = snap.exists() && snap.val() && typeof snap.val() === 'object' ? snap.val() : {};
    MINING_ACTIVITY_CHECK_ENABLED = v.enabled !== false;
    let mins = Number(v.intervalMinutes);
    if (!Number.isFinite(mins)) mins = 20;
    mins = Math.max(1, Math.min(1440, mins));
    MINING_ACTIVITY_CHECK_MS = mins * 60 * 1000;
    if (state && state.mining && state.mining.isActive && !state.mining.activityCheckRequired){
      const m = state.mining;
      if (!m.nextActivityCheckAt) m.nextActivityCheckAt = Date.now() + MINING_ACTIVITY_CHECK_MS;
    }
  });
}
listenMiningActivityCheckSettings();

function miningActivityShuffle(arr){
  const a = arr.slice();
  for (let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
  return a;
}
function generateMiningActivityPuzzle(){
  const pool = miningActivityShuffle(MINING_ACTIVITY_EMOJI_POOL);
  const target = pool[0];
  return { target, grid: miningActivityShuffle([target, ...pool.slice(1,9)]) };
}
function openMiningActivityCheck(){
  miningActivityModalOpen = true;
  const modal=document.getElementById('mining-activity-modal');
  if(modal) modal.classList.remove('hidden');
  renderMiningActivityPuzzle();
}
function closeMiningActivityCheck(){
  miningActivityModalOpen = false;
  const modal=document.getElementById('mining-activity-modal');
  if(modal) modal.classList.add('hidden');
}
function renderMiningActivityPuzzle(){
  const m=miningState();
  if(!m || !m.activityCheckRequired) return;
  const t=document.getElementById('mining-activity-target');
  const g=document.getElementById('mining-activity-grid');
  const a=document.getElementById('mining-activity-attempts');
  if(t) t.textContent=m.activityCheckTarget || '⛏️';
  if(g){
    const grid=Array.isArray(m.activityCheckGrid)&&m.activityCheckGrid.length===9?m.activityCheckGrid:generateMiningActivityPuzzle().grid;
    g.classList.remove('disabled');
    g.innerHTML=grid.map((em,i)=>`<button type="button" class="mining-activity-cell" onclick="miningActivityCellClick(${i})">${em}</button>`).join('');
  }
  if(a){
    const fails=Number(m.activityCheckFails||0), left=Math.max(0,MINING_ACTIVITY_MAX_FAILS-fails);
    a.textContent=fails ? `Activity Check Fail — ${left} attempt${left===1?'':'s'} left (total ${MINING_ACTIVITY_MAX_FAILS})` : '';
  }
}
async function triggerMiningActivityCheck(){
  if(miningActivityCheckBusy || !state) return;
  const m=miningState();
  if(!m.isActive || m.activityCheckRequired || !MINING_ACTIVITY_CHECK_ENABLED) return;
  const now=Date.now();
  if(!m.nextActivityCheckAt || now < Number(m.nextActivityCheckAt)) return;
  miningActivityCheckBusy=true;
  try{
    const puzzle=generateMiningActivityPuzzle();
    m.activityCheckRequired=true;
    m.activityCheckAt=now;
    m.activityCheckTarget=puzzle.target;
    m.activityCheckGrid=puzzle.grid;
    m.activityCheckFails=0;
    // Mining time is frozen at activityCheckAt; on successful verification the
    // paused duration is added to miningStartTime so no reward is earned while paused.
    await patchState({mining:m});
    openMiningActivityCheck();
    renderMiningActionArea();
  } finally { miningActivityCheckBusy=false; }
}
async function miningActivityCellClick(idx){
  const m=miningState();
  if(!m || !m.activityCheckRequired) return;
  const grid=Array.isArray(m.activityCheckGrid)?m.activityCheckGrid:[];
  const picked=grid[idx];
  if(picked==null || m.activityCheckBusy) return;
  m.activityCheckBusy=true;
  const gridEl=document.getElementById('mining-activity-grid');
  if(gridEl) gridEl.classList.add('disabled');
  try{
    // Same active rewarded-ad network used elsewhere in the app. This is part of
    // the verification step, not a standalone Watch Ad earning feature.
    await showRewardedAdGate();
    const correct=picked===m.activityCheckTarget;
    if(correct){
      const now=Date.now();
      const pauseAt=Number(m.activityCheckAt||now);
      const paused=Math.max(0,now-pauseAt);
      if(m.miningStartTime) m.miningStartTime += paused;
      m.activityCheckRequired=false; m.activityCheckAt=null; m.activityCheckTarget=null; m.activityCheckGrid=null; m.activityCheckFails=0;
      m.nextActivityCheckAt=MINING_ACTIVITY_CHECK_ENABLED ? now + MINING_ACTIVITY_CHECK_MS : null;
      m.activityCheckBusy=false;
      await patchState({mining:m});
      closeMiningActivityCheck(); haptic('success');
      showToast('Activity check passed — Mining resumed', ICONS.pickaxe);
      renderMiningActionArea();
    }else{
      const fails=Number(m.activityCheckFails||0)+1;
      if(fails>=MINING_ACTIVITY_MAX_FAILS){
        m.isActive=false; m.miningStartTime=null; m.cooldownUntil=null;
        m.activityCheckRequired=false; m.activityCheckAt=null; m.activityCheckTarget=null; m.activityCheckGrid=null; m.activityCheckFails=0; m.nextActivityCheckAt=null; m.activityCheckBusy=false;
        await patchState({mining:m});
        closeMiningActivityCheck(); haptic('error');
        showToast(`Activity Check failed ${fails}/${MINING_ACTIVITY_MAX_FAILS} — Mining reset, no reward.`, ICONS.warning);
        renderMiningActionArea();
      }else{
        const puzzle=generateMiningActivityPuzzle();
        m.activityCheckFails=fails; m.activityCheckTarget=puzzle.target; m.activityCheckGrid=puzzle.grid; m.activityCheckBusy=false;
        await patchState({mining:m});
        haptic('error');
        showToast(`Activity Check failed — ${MINING_ACTIVITY_MAX_FAILS-fails} attempt${MINING_ACTIVITY_MAX_FAILS-fails===1?'':'s'} left`, ICONS.warning);
        renderMiningActivityPuzzle();
      }
    }
  }catch(e){
    m.activityCheckBusy=false;
    if(gridEl) gridEl.classList.remove('disabled');
    showToast('Ad not completed — Mining remains paused. Try again.', ICONS.warning);
  }
}

// =====================================================================
// Mining module — Mining Models
// One-tap idle mining: Start Mining -> accumulates AENVA automatically up to
// a per-model cap (capHours) -> user must Claim (gated by adsToClaim rewarded
// ads, each separated by a breakSeconds cooldown) -> a per-model cooldown
// runs -> user can Start Mining again manually.
// Users own one or more Models (bought with Earning Balance + optional
// referral/plan requirements) and pick exactly one as the active miner at a
// time. The model cannot be switched while mining is active — user must
// claim (or the run resets) first.
// The full roster is admin-managed (full CRUD: add/edit/delete) live via
// mining_models/{pushId} in Firebase, so admins can add, rebalance, rename,
// or remove models freely without a client update.
// =====================================================================
const UNCLES_DEFAULT = [
  { id:'u1', name:'Model Rookie',   emoji:'👷', rate:0.05, capHours:4,  cooldownMin:20, price:0,    refer:{normalCount:0}, adsToClaim:1, breakSeconds:30, ability:'Your first miner. Steady digging, no experience needed.' },
];
let MINING_UNCLES = UNCLES_DEFAULT.map(u => ({...u, refer:{...u.refer}}));
let miningTicker = null;

function normalizeMiningModel(id, o){
  o = o || {};
  const rateUnit = o.rateUnit === 'minute' ? 'minute' : 'hour';
  return {
    id: id,
    name: o.name || 'Mining Model',
    image: o.image || '',
    emoji: o.emoji || '⛏️',
    ability: o.ability || '',
    rate: Number.isFinite(Number(o.rate)) ? Number(o.rate) : 0.05,
    rateUnit: rateUnit,
    capHours: Number.isFinite(Number(o.capHours)) ? Number(o.capHours) : 4,
    cooldownMin: Number.isFinite(Number(o.cooldownMin)) ? Number(o.cooldownMin) : 20,
    price: Number.isFinite(Number(o.price)) ? Number(o.price) : 0,
    // Refer requirement only — the plan requirement is gone and cannot be set anymore.
    refer: o.refer ? normalizeReferReq(o.refer) : { normalCount:0 },
    adsToClaim: Number.isFinite(Number(o.adsToClaim)) ? Math.max(1, Number(o.adsToClaim)) : 1,
    breakSeconds: Number.isFinite(Number(o.breakSeconds)) ? Math.max(0, Number(o.breakSeconds)) : 30,
    // Purchase method: 'price' (deduct Earning Balance, default) or 'ad' (free —
    // gated behind watching buyAdsRequired rewarded ads, buyAdBreakSeconds apart).
    buyType: o.buyType === 'ad' ? 'ad' : 'price',
    buyAdsRequired: Number.isFinite(Number(o.buyAdsRequired)) ? Math.max(1, Number(o.buyAdsRequired)) : 3,
    buyAdBreakSeconds: Number.isFinite(Number(o.buyAdBreakSeconds)) ? Math.max(0, Number(o.buyAdBreakSeconds)) : 30,
    // Explicit free-starter flag set by admin (Firebase: mining_models/{id}/isDefault = true).
    isDefault: o.isDefault === true,
  };
}

// The one model every brand-new user should own for free. Prefer an explicit
// admin flag; fall back to the cheapest fully-free model (price 0, not ad-gated);
// only fall back to MINING_UNCLES[0] (arbitrary Firebase key order) as a last resort.
function defaultMiningModelId(){
  const flagged = MINING_UNCLES.find(u => u.isDefault);
  if (flagged) return flagged.id;
  const free = MINING_UNCLES.find(u => u.price === 0 && u.buyType !== 'ad');
  if (free) return free.id;
  return (MINING_UNCLES[0] && MINING_UNCLES[0].id) || 'u1';
}

// Per-ms rate regardless of whether the admin set rateUnit to 'hour' or 'minute' —
// every accumulation/label calculation below is derived from this single source
// so the two units never drift apart.
function miningRatePerMs(uncle){
  const rate = Number(uncle.rate || 0);
  const perUnitMs = uncle.rateUnit === 'minute' ? 60000 : 3600000;
  return rate / perUnitMs;
}
function miningRateLabel(uncle, rateValue){
  const rate = rateValue != null ? rateValue : Number(uncle.rate || 0);
  const unit = uncle.rateUnit === 'minute' ? 'min' : 'hr';
  return `${fmt(rate)}/${unit}`;
}

function listenMiningSettings(){
  // New schema: mining_models/{pushId} -> { name, emoji, ability, rate, capHours,
  // cooldownMin, price, refer, adsToClaim, breakSeconds }
  // Fully admin-managed list (push-id keyed) — supports true add/edit/delete,
  // unlimited models, same pattern as Investment Plans.
  onValue(ref(db, 'mining_models'), snap => {
    const v = snap.exists() ? snap.val() : null;
    if (!v || typeof v !== 'object'){
      MINING_UNCLES = UNCLES_DEFAULT.map(u => ({...u, refer:{...u.refer}}));
    } else {
      MINING_UNCLES = Object.keys(v).map(id => normalizeMiningModel(id, v[id]));
      if (MINING_UNCLES.length === 0){
        MINING_UNCLES = UNCLES_DEFAULT.map(u => ({...u, refer:{...u.refer}}));
      }
    }
    if (currentScreen === 'mining') renderMining();
    if (currentScreen === 'mining-models') renderMiningUncleGrid();
    // If the user's active model no longer exists (deleted by admin), fall back safely.
    if (state){
      const m = miningState();
      if (m.activeUncleId && !MINING_UNCLES.find(u => u.id === m.activeUncleId)){
        if (!m.isActive) m.activeUncleId = defaultMiningModelId();
      }
    }
  });
}

function miningState(){
  const defaultId = defaultMiningModelId();
  if (!state) return { ownedUncles:[defaultId], activeUncleId:defaultId, miningStartTime:null, isActive:false, lastClaimTime:null, cooldownUntil:null, speedUpCount:0, speedUpBonus:0, activityCheckRequired:false, activityCheckAt:null, activityCheckTarget:null, activityCheckGrid:null, activityCheckFails:0, nextActivityCheckAt:null };
  if (!state.mining || typeof state.mining !== 'object'){
    state.mining = { ownedUncles:[defaultId], activeUncleId:defaultId, miningStartTime:null, isActive:false, lastClaimTime:null, cooldownUntil:null, speedUpCount:0, speedUpBonus:0, activityCheckRequired:false, activityCheckAt:null, activityCheckTarget:null, activityCheckGrid:null, activityCheckFails:0, nextActivityCheckAt:null };
  }
  if (!Array.isArray(state.mining.ownedUncles) || state.mining.ownedUncles.length === 0){
    state.mining.ownedUncles = [defaultId];
  }
  if (!state.mining.activeUncleId || !state.mining.ownedUncles.includes(state.mining.activeUncleId)){
    state.mining.activeUncleId = state.mining.ownedUncles[0];
  }
  if (!Number.isFinite(Number(state.mining.speedUpCount))) state.mining.speedUpCount = 0;
  // speedUpBonus: a FIXED, flat AENVA amount — the sum of every Speed Up tap's reward.
  // It is credited once per tap and does NOT scale with elapsed/remaining mining time,
  // so it never turns into "bonus × hours". See miningAccumulated() below.
  if (!Number.isFinite(Number(state.mining.speedUpBonus))) state.mining.speedUpBonus = 0;
  return state.mining;
}
function activeUncle(){
  const m = miningState();
  return MINING_UNCLES.find(u => u.id === m.activeUncleId) || null;
}
function miningCapMs(uncle){ return ((uncle && uncle.capHours) || 4) * 3600 * 1000; }
function miningElapsedMs(m, uncle, now){
  if (!uncle || !m.isActive || !m.miningStartTime) return 0;
  return Math.max(0, Math.min(now - m.miningStartTime, miningCapMs(uncle)));
}
// Reward math: the base rate accrues normally over elapsed time (rate × hours), but each
// Speed Up tap grants a flat, one-time AENVA bonus that is added directly to the total —
// it is a fixed amount, not a per-hour rate, so it never gets multiplied by how long is
// left in the mining session. Watching 10 ads always adds up to the same total bonus
// AENVA regardless of when in the session you tapped Speed Up.
function miningAccumulated(m, uncle, now){
  if (!uncle) return 0;
  const capMs = miningCapMs(uncle);
  const startTime = m.miningStartTime;
  if (!m.isActive || !startTime) return 0;
  const frozenNow = m.activityCheckRequired && m.activityCheckAt ? Math.min(now, Number(m.activityCheckAt)) : now;
  const cappedNow = Math.min(frozenNow, startTime + capMs);
  const elapsedMs = Math.max(0, cappedNow - startTime);
  if (elapsedMs <= 0) return 0;

  const baseTotal = elapsedMs * miningRatePerMs(uncle);
  const fixedBonus = Number(m.speedUpBonus || 0);
  return baseTotal + fixedBonus;
}
function miningCapReached(m, uncle, now){
  if (!uncle || !m.isActive || !m.miningStartTime) return false;
  return (now - m.miningStartTime) >= miningCapMs(uncle);
}
function miningPhase(m, uncle, now){
  if (!uncle) return 'idle';
  if (m.isActive) { if (m.activityCheckRequired) return 'activitycheck'; return miningCapReached(m, uncle, now) ? 'capfull' : 'mining'; }
  if (m.cooldownUntil && now < m.cooldownUntil) return 'cooldown';
  return 'idle';
}

function openMining(){
  renderMining();
  openOverlay('mining');
  if (!miningTicker) miningTicker = setInterval(renderMiningActionArea, 1000);
}

function openMiningModels(){
  renderMiningUncleGrid();
  openOverlay('mining-models');
}

function renderMining(){
  if (!state) return;
  renderMiningActionArea();
  if (document.getElementById('mining-uncle-grid')) renderMiningUncleGrid();
}

function renderMiningUncleGrid(){
  const wrap = document.getElementById('mining-uncle-grid');
  if (!wrap) return;
  const m = miningState();
  // Display order: the admin-flagged default model first, then every ad-unlock model
  // (buyType 'ad') sorted by ascending ads-required (e.g. 10 → 20 → 40), then every
  // price-unlock model sorted by ascending price (e.g. 1 → 2 → 30). Models within the
  // same group that tie on the sort key keep their original relative order.
  const sortedUncles = MINING_UNCLES.map((u, i) => ({ u, i })).sort((a, b) => {
    const groupOf = (x) => x.isDefault ? 0 : (x.buyType === 'ad' ? 1 : 2);
    const ga = groupOf(a.u), gb = groupOf(b.u);
    if (ga !== gb) return ga - gb;
    if (ga === 1) return (Number(a.u.buyAdsRequired) || 0) - (Number(b.u.buyAdsRequired) || 0);
    if (ga === 2) return (Number(a.u.price) || 0) - (Number(b.u.price) || 0);
    return a.i - b.i;
  }).map(x => x.u);
  wrap.innerHTML = sortedUncles.map(u => {
    const owned = m.ownedUncles.includes(u.id);
    const active = m.activeUncleId === u.id;
    const reqOk = referReqMet(u.refer);
    const lockLabel = referReqLabel(u.refer);

    // What the user still has to pay/do to actually unlock the model, once the refer/plan
    // requirement above is met — shown so a locked card doesn't hide the real cost.
    const unlockCostLabel = (u.buyType === 'ad')
      ? `${ICONS.megaphone} Watch ${Math.max(1, Number(u.buyAdsRequired) || 1)} ad${Math.max(1, Number(u.buyAdsRequired) || 1) > 1 ? 's' : ''} to unlock`
      : (Number(u.price) > 0 ? `${ICONS.cart} Buy · ${fmt(u.price)}` : `${ICONS.check} Free unlock`);

    let btnHtml;
    let lockedCostLine = '';
    if (active){
      btnHtml = `<button class="mining-uncle-btn selected" disabled>${ICONS.check} Selected</button>`;
    } else if (owned){
      btnHtml = `<button class="mining-uncle-btn" onclick="selectUncle('${u.id}')">Select</button>`;
    } else if (!reqOk){
      btnHtml = `<button class="mining-uncle-btn locked" disabled>${esc(lockLabel)} needed</button>`;
      // Locked cards still show the follow-up cost (ads or price) right under the button,
      // so the user knows what's waiting for them after they hit the refer/plan requirement.
      lockedCostLine = `<div class="mining-uncle-unlock-cost">Then: ${unlockCostLabel}</div>`;
    } else if (u.buyType === 'ad'){
      const buyAds = Math.max(1, Number(u.buyAdsRequired) || 1);
      btnHtml = `<button class="mining-uncle-btn buy" onclick="openMiningBuyAdDialog('${u.id}')">${ICONS.megaphone} Watch ${buyAds} Ad${buyAds>1?'s':''} to Unlock</button>`;
    } else {
      btnHtml = `<button class="mining-uncle-btn buy" onclick="buyUncle('${u.id}')">${u.price > 0 ? ('Buy · ' + fmt(u.price)) : 'Unlock Free'}</button>`;
    }
    const claimAds = Math.max(1, Number(u.adsToClaim) || 1);
    const bigVisual = u.image ? `<img class="mining-uncle-img-big" src="${esc(u.image)}" alt="" referrerpolicy="no-referrer" loading="lazy" onclick="event.stopPropagation(); openModelImageLightbox('${u.id}')" onerror="this.onerror=null; this.replaceWith(Object.assign(document.createElement('div'),{className:'mining-uncle-emoji-big',textContent:'${u.emoji}'}));">` : `<div class="mining-uncle-emoji-big">${u.emoji}</div>`;
    return `<div class="mining-uncle-card ${active ? 'active' : ''}">
      ${bigVisual}
      <div class="mining-uncle-name">${esc(u.name)}</div>
      <div class="mining-uncle-ability">${esc(u.ability || '')}</div>
      <div class="mining-uncle-stats">${miningRateLabel(u)} · cap ${u.capHours}h · cooldown ${u.cooldownMin}m</div>
      <div class="mining-uncle-stats">${claimAds} ad${claimAds>1?'s':''} to claim</div>
      ${btnHtml}
      ${lockedCostLine}
    </div>`;
  }).join('');
}

function renderMiningActionArea(){
  const container = document.getElementById('mining-action-area');
  if (!container || !state) return;
  const m = miningState();
  const uncle = activeUncle();
  const now = Date.now();
  const phase = miningPhase(m, uncle, now);
  const capMs = miningCapMs(uncle);
  const elapsedMs = miningElapsedMs(m, uncle, now);
  const accumulated = miningAccumulated(m, uncle, now);
  const pct = (phase === 'mining' || phase === 'capfull') ? Math.min(100, (elapsedMs / capMs) * 100) : 0;
  // Animation (coin pulse + flying sparks) only plays while mining is truly in progress
  // (Status: Active). Once the cap fills (Status: Complete) or mining is stopped/cooling
  // down, the coin should sit still — no more charging effect.
  const charging = (phase === 'mining');

  const statusMap = {
    mining:   { label:'Active',    cls:'is-active',   icon: ICONS.bolt },
    capfull:  { label:'Complete',  cls:'is-complete',  icon: ICONS.check },
    cooldown: { label:'Stopped',   cls:'is-stopped',  icon: ICONS.pause },
    activitycheck: { label:'Verify Activity', cls:'is-paused', icon: ICONS.shield },
    idle:     { label:'Stopped',   cls:'is-stopped',  icon: ICONS.pause },
  };
  const st = statusMap[phase] || statusMap.idle;

  const noModelSelected = !uncle;

  let html = `<div class="mining-hero-block">
    <div class="mining-hero-value">+${accumulated.toFixed(6)} <span class="mining-hero-unit">AENVA</span></div>
    <div class="mining-status-line ${st.cls}">${st.icon}<span>Status: ${st.label}</span></div>
  </div>`;

  html += `<div class="mining-coin-block"><div class="mining-coin-stage" id="mining-coin-stage">
    <img class="mining-direct-image${charging ? ' is-charging' : ''}" id="mining-coin-img" src="https://i.postimg.cc/tTSjkVt6/151204-removebg-preview.png" alt="Mining" width="250" height="250">
  </div></div>`;

  const speedUpCount = Number(m.speedUpCount || 0);
  const speedUpBonus = Number(m.speedUpBonus || 0);

  html += `<div class="mining-model-progress-card">`;
  if (noModelSelected){
    html += `<div class="mining-model-card mining-model-empty">
      <span class="mining-model-emoji">${ICONS.cart}</span>
      <div>
        <div class="mining-model-name">No model selected</div>
        <div class="mining-model-rate">Please select your model</div>
      </div>
    </div>`;
  } else {
    html += `<div class="mining-model-card">
      ${uncle.image ? `<img class="mining-model-img" src="${esc(uncle.image)}" alt="" referrerpolicy="no-referrer" loading="lazy" onclick="event.stopPropagation(); openModelImageLightbox('${uncle.id}')" onerror="this.onerror=null; this.replaceWith(Object.assign(document.createElement('span'),{className:'mining-model-emoji',textContent:'${uncle.emoji}'}));">` : `<span class="mining-model-emoji">${uncle.emoji}</span>`}
      <div class="mining-model-info">
        <div class="mining-model-name">${esc(uncle.name)}</div>
        <div class="mining-model-rate">${miningRateLabel(uncle)} · cap ${uncle.capHours}h</div>
      </div>
      ${speedUpBonus > 0 ? `<div class="mining-bonus-badge" title="Fixed AENVA bonus from Speed Up — a flat amount, not a per-hour rate">${ICONS.bolt}<span>+${fmt(speedUpBonus)}</span></div>` : ''}
    </div>`;
  }
  // Nicer progress bar: rounded pill track + shine, plus a live % and time-remaining
  // readout underneath so the cap progress is easy to read at a glance.
  const remainingMs = Math.max(0, capMs - elapsedMs);
  let progressTimeLabel = '';
  if (phase === 'mining') progressTimeLabel = `${formatCountdown(remainingMs)} left`;
  else if (phase === 'capfull') progressTimeLabel = 'Cap full';
  html += `<div class="mining-progress-wrap">
    <div class="mining-progress-track"><div class="mining-progress-fill${pct >= 100 ? ' limit-full' : ''}${charging ? ' is-live' : ''}" style="width:${pct.toFixed(1)}%;"></div></div>
    <div class="mining-progress-meta">
      <span class="mining-progress-pct">${pct.toFixed(0)}%</span>
      ${progressTimeLabel ? `<span class="mining-progress-time">${progressTimeLabel}</span>` : ''}
    </div>
  </div>
  </div>`;

  // 3 stat cards under the cap progress bar (Invalid Work removed).
  const hashRate = charging ? (Number(uncle.rate||0) * (0.85 + Math.random() * 0.3)) : 0;
  const miningReward = Number(state.miningReward || 0);
  const speedUpMaxed = speedUpCount >= MINING_SPEEDUP_MAX;
  const speedUpDisabled = !charging || phase === 'capfull' || speedUpMaxed;
  html += `<div class="mining-stats-grid">
    <div class="mining-stat-card">
      <div class="mining-stat-label">${ICONS.chart} Hash Rate</div>
      <div class="mining-stat-value" id="mining-hashrate-value">${hashRate.toFixed(3)} H/s</div>
    </div>
    <div class="mining-stat-card">
      <div class="mining-stat-label">${ICONS.pickaxe} Total Mining</div>
      <div class="mining-stat-value">${fmt(miningReward)}</div>
    </div>
    <div class="mining-stat-card ${speedUpCount > 0 ? 'is-boosted' : ''} ${speedUpDisabled ? 'is-disabled' : ''}" ${speedUpDisabled ? '' : 'onclick="miningSpeedUp()"'} id="mining-speedup-card">
      <div class="mining-stat-label">${ICONS.rocket} Speed Up (${speedUpCount}/${MINING_SPEEDUP_MAX})</div>
      <div class="mining-stat-value">${speedUpMaxed ? 'Maxed' : (phase === 'capfull' ? 'Cap Full' : 'Watch Ad')}</div>
    </div>
  </div>`;

  html += `<div class="mining-action-block">`;
  if (noModelSelected){
    html += `<button class="wd-action-btn" onclick="openMiningModels()">${ICONS.cart} Please Select Your Model</button>`;
  } else if (phase === 'idle'){
    html += `<button class="wd-action-btn" id="mining-start-btn" onclick="startMining()">${ICONS.play} Start Mining</button>`;
  } else if (phase === 'activitycheck'){
    html += `<button class="wd-action-btn" onclick="openMiningActivityCheck()">${ICONS.shield} Verify Activity</button>`;
  } else if (phase === 'mining'){
    html += `<button class="wd-action-btn" disabled>${ICONS.pickaxe} Mining…</button>`;
  } else if (phase === 'capfull'){
    // Single merged button: the Watch-Ad CTA, the "X/Y" progress count, the break-time
    // countdown, and the progress bar all live INSIDE this one button — no separate
    // progress panel above it, so nothing is ever shown twice.
    const adsNeeded = Math.max(1, Number(uncle.adsToClaim) || 1);
    const done = Math.min(adMultiProgress['mining-claim-btn'] || 0, adsNeeded);
    const pctDone = adsNeeded > 0 ? Math.min(100, (done / adsNeeded) * 100) : 0;
    let claimLabel = done >= adsNeeded ? 'Claim Now' : (adsNeeded > 1 ? `${ICONS.megaphone} Watch Ad ${done}/${adsNeeded}` : `${ICONS.megaphone} Watch Ad to Claim`);
    html += `<button class="wd-action-btn mining-adbtn" id="mining-claim-btn" onclick="claimMining()">
      <span class="mining-adbtn-label" id="mining-claim-btn-label">${claimLabel}</span>
      ${adsNeeded > 1 ? `<div class="mining-adbtn-progress-track"><div class="mining-adbtn-progress-fill" id="mining-claim-ad-fill" style="width:${pctDone.toFixed(1)}%;"></div></div>` : ''}
    </button>`;
  } else if (phase === 'cooldown'){
    html += `<button class="wd-action-btn" disabled>${ICONS.hourglass} Cooling down</button>`;
  }
  html += `</div>`;

  container.innerHTML = html;
  if (phase === 'mining' && MINING_ACTIVITY_CHECK_ENABLED && m.nextActivityCheckAt && Date.now() >= Number(m.nextActivityCheckAt)) triggerMiningActivityCheck();
  if (phase === 'activitycheck') openMiningActivityCheck();
  if (phase === 'capfull'){
    const adsNeeded = Math.max(1, Number(uncle.adsToClaim) || 1);
    const done = adMultiProgress['mining-claim-btn'] || 0;
    if (done >= adsNeeded){
      // All ads already watched (survived a re-render) — ready to claim, no countdown needed.
    } else if (adsNeeded > 1) {
      const waitLeft = (nextAdAllowedAt['mining-claim-btn'] || 0) - Date.now();
      if (waitLeft > 0) startMiningClaimAdTicker(adsNeeded);
    }
  } else {
    clearMiningClaimAdTicker();
  }
  if (charging) spawnMiningSparks();
}

// Live countdown for the mining-claim multi-ad flow — ticks the label INSIDE the button
// (no separate element above it), so the wait between ads is always a real ticking
// countdown shown in exactly one place.
let miningClaimAdTicker = null;
function clearMiningClaimAdTicker(){
  if (miningClaimAdTicker){ clearInterval(miningClaimAdTicker); miningClaimAdTicker = null; }
}
function startMiningClaimAdTicker(adsNeeded){
  clearMiningClaimAdTicker();
  const tick = () => {
    const btn = document.getElementById('mining-claim-btn');
    const label = document.getElementById('mining-claim-btn-label');
    if (!btn){ clearMiningClaimAdTicker(); return; }
    const left = (nextAdAllowedAt['mining-claim-btn'] || 0) - Date.now();
    const done = adMultiProgress['mining-claim-btn'] || 0;
    if (left <= 0){
      clearMiningClaimAdTicker();
      btn.disabled = false;
      if (label) label.innerHTML = `${ICONS.megaphone} Watch Ad ${done}/${adsNeeded}`;
      return;
    }
    btn.disabled = true;
    if (label) label.innerHTML = `${ICONS.hourglass} Wait ${formatCountdown(left)}`;
  };
  tick();
  miningClaimAdTicker = setInterval(tick, 1000);
}

// ---- Blue spark animation: sparks fly from a random point on the coin image
// up to the "+0.xxx AENVA" hero value and are absorbed into it (vibrates on hit). ----
let miningSparkTimer = null;
function spawnMiningSparks(){
  if (miningSparkTimer) return;
  const fire = () => {
    const stage = document.getElementById('mining-coin-stage');
    const hero = document.querySelector('.mining-hero-value');
    if (!stage || !hero){ return; }
    const stageRect = stage.getBoundingClientRect();
    const heroRect = hero.getBoundingClientRect();
    if (!stageRect.width || !heroRect.width) return;
    // Random origin point somewhere on the coin image.
    const originX = stageRect.left + stageRect.width * (0.25 + Math.random() * 0.5);
    const originY = stageRect.top + stageRect.height * (0.25 + Math.random() * 0.5);
    const targetX = heroRect.left + heroRect.width * (0.75 + Math.random() * 0.2);
    const targetY = heroRect.top + heroRect.height * 0.5;

    const spark = document.createElement('div');
    spark.className = 'mining-flying-spark';
    spark.style.left = originX + 'px';
    spark.style.top = originY + 'px';
    spark.style.setProperty('--dx', (targetX - originX) + 'px');
    spark.style.setProperty('--dy', (targetY - originY) + 'px');
    document.body.appendChild(spark);
    spark.addEventListener('animationend', () => {
      spark.remove();
      hero.classList.remove('mining-hero-vibrate');
      void hero.offsetWidth;
      hero.classList.add('mining-hero-vibrate');
    }, { once:true });
    setTimeout(() => { if (spark.parentNode) spark.remove(); }, 1300);
  };
  fire();
  miningSparkTimer = setInterval(() => {
    const container = document.getElementById('mining-action-area');
    if (!container || !document.body.contains(container)){
      clearInterval(miningSparkTimer);
      miningSparkTimer = null;
      return;
    }
    const m = miningState();
    const uncle = activeUncle();
    // Sparks only fly while Status is Active (mining in progress) — stop once Complete/Stopped.
    if (miningPhase(m, uncle, Date.now()) !== 'mining'){
      clearInterval(miningSparkTimer);
      miningSparkTimer = null;
      return;
    }
    fire();
  }, 550);
}

let miningBuyBusy = {};
let miningBuyAdTicker = null;

// Buying with Earning Balance (price mode) stays instant. Buying with ads opens
// a dedicated live-progress dialog instead of reusing the plain claim-button pattern,
// since the user asked to see total ads needed / watched so far / a progress bar /
// and a live countdown for the break time between ads.
async function buyUncle(id){
  const uncle = MINING_UNCLES.find(u => u.id === id);
  if (!uncle || !state) return;
  const m = miningState();
  if (m.ownedUncles.includes(id)){ selectUncle(id); return; }
  if (!referReqMet(uncle.refer)){
    showToast(`Need ${referReqLabel(uncle.refer)} to unlock ${uncle.name}`, ICONS.people);
    return;
  }
  if (uncle.buyType === 'ad'){
    openMiningBuyAdDialog(id);
    return;
  }
  const price = Number(uncle.price) || 0;
  if (price > 0 && Number(state.depositBalance || 0) < price){
    showToast(`Not enough Deposit Balance. Need ${fmt(price)}`, ICONS.warning);
    return;
  }
  if (price > 0){
    state.depositBalance = Number(state.depositBalance || 0) - price;
    recomputeTotalBalance();
    addTransaction('withdraw', `Bought ${uncle.name}`, -price);
  }
  m.ownedUncles.push(id);
  m.activeUncleId = id;
  await saveState();
  haptic('success');
  showToast(`${uncle.name} unlocked!`, ICONS.pickaxe);
  renderMining();
  if (currentScreen === 'home') renderHome();
}

async function finalizeMiningAdBuy(id){
  const uncle = MINING_UNCLES.find(u => u.id === id);
  if (!uncle || !state) return;
  const m = miningState();
  if (m.ownedUncles.includes(id)) return;
  m.ownedUncles.push(id);
  m.activeUncleId = id;
  await saveState();
  haptic('success');
  showToast(`${uncle.name} unlocked!`, ICONS.pickaxe);
  renderMining();
  if (currentScreen === 'home') renderHome();
}

window.openMiningBuyAdDialog = function(id){
  const uncle = MINING_UNCLES.find(u => u.id === id);
  if (!uncle) return;
  if (miningBuyBusy[id]) return;
  const adsNeeded = Math.max(1, Number(uncle.buyAdsRequired) || 1);
  const breakSec = Math.max(0, Number(uncle.buyAdBreakSeconds) || 0);

  let overlay = document.getElementById('mining-buy-ad-overlay');
  if (overlay) overlay.remove();
  overlay = document.createElement('div');
  overlay.className = 'mining-buy-ad-overlay';
  overlay.id = 'mining-buy-ad-overlay';
  overlay.innerHTML = `
    <div class="mining-buy-ad-modal">
      <h3>Unlock ${esc(uncle.name)}</h3>
      <p>Watch ${adsNeeded} ad${adsNeeded>1?'s':''} to unlock this model for free — no Earning Balance is used.</p>
      <div class="mining-buy-ad-actions">
        <button class="btn btn-secondary" onclick="closeMiningBuyAdDialog()">Cancel</button>
        <button class="wd-action-btn mining-adbtn" id="mining-buy-ad-action-btn" onclick="miningBuyAdWatchNext('${id}')">
          <span class="mining-adbtn-label" id="mining-buy-ad-label">${ICONS.megaphone} Watch Ad ${adsNeeded > 1 ? `0/${adsNeeded}` : ''}</span>
          ${adsNeeded > 1 ? `<div class="mining-adbtn-progress-track"><div class="mining-adbtn-progress-fill" id="mining-buy-ad-fill" style="width:0%;"></div></div>` : ''}
        </button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  miningRenderBuyAdProgress(id);
};

window.closeMiningBuyAdDialog = function(){
  const overlay = document.getElementById('mining-buy-ad-overlay');
  if (overlay) overlay.remove();
  if (miningBuyAdTicker){ clearInterval(miningBuyAdTicker); miningBuyAdTicker = null; }
};

function miningRenderBuyAdProgress(id){
  const uncle = MINING_UNCLES.find(u => u.id === id);
  if (!uncle) return;
  const adsNeeded = Math.max(1, Number(uncle.buyAdsRequired) || 1);
  const btnId = 'mining-buy-btn-' + id; // shared progress key with requireMultipleAdsBeforeAction
  const done = Math.min(adMultiProgress[btnId] || 0, adsNeeded);
  const fill = document.getElementById('mining-buy-ad-fill');
  const label = document.getElementById('mining-buy-ad-label');
  const actionBtn = document.getElementById('mining-buy-ad-action-btn');
  if (fill) fill.style.width = Math.min(100, (done / adsNeeded) * 100).toFixed(1) + '%';

  if (miningBuyAdTicker){ clearInterval(miningBuyAdTicker); miningBuyAdTicker = null; }
  const waitUntil = nextAdAllowedAt[btnId] || 0;
  const waitLeft = waitUntil - Date.now();
  if (done >= adsNeeded){
    if (actionBtn) actionBtn.disabled = true;
    if (label) label.innerHTML = 'Unlocking…';
  } else if (waitLeft > 0){
    if (actionBtn) actionBtn.disabled = true;
    const tick = () => {
      const left = (nextAdAllowedAt[btnId] || 0) - Date.now();
      if (left <= 0){
        clearInterval(miningBuyAdTicker); miningBuyAdTicker = null;
        if (actionBtn) actionBtn.disabled = false;
        if (label) label.innerHTML = `${ICONS.megaphone} Watch Ad ${adsNeeded > 1 ? `${done}/${adsNeeded}` : ''}`;
        return;
      }
      if (label) label.innerHTML = `${ICONS.hourglass} Wait ${formatCountdown(left)}`;
    };
    tick();
    miningBuyAdTicker = setInterval(tick, 1000);
  } else {
    if (actionBtn) actionBtn.disabled = false;
    if (label) label.innerHTML = `${ICONS.megaphone} Watch Ad ${adsNeeded > 1 ? `${done}/${adsNeeded}` : ''}`;
  }
}

window.miningBuyAdWatchNext = async function(id){
  const uncle = MINING_UNCLES.find(u => u.id === id);
  if (!uncle || miningBuyBusy[id]) return;
  const adsNeeded = Math.max(1, Number(uncle.buyAdsRequired) || 1);
  const breakSec = Math.max(0, Number(uncle.buyAdBreakSeconds) || 0);
  const btnId = 'mining-buy-btn-' + id;
  miningBuyBusy[id] = true;
  try{
    const done = adMultiProgress[btnId] || 0;
    if (done >= adsNeeded){
      await finalizeMiningAdBuy(id);
      closeMiningBuyAdDialog();
      return;
    }
    try{
      await showRewardedAdGate();
      adMultiProgress[btnId] = done + 1;
      if (adMultiProgress[btnId] >= adsNeeded){
        nextAdAllowedAt[btnId] = 0;
        miningRenderBuyAdProgress(id);
        await finalizeMiningAdBuy(id);
        delete adMultiProgress[btnId];
        closeMiningBuyAdDialog();
        return;
      }
      if (breakSec > 0) nextAdAllowedAt[btnId] = Date.now() + breakSec * 1000;
      miningRenderBuyAdProgress(id);
    }catch(e){
      showToast('Watch the full ad to continue', ICONS.warning);
    }
  } finally {
    miningBuyBusy[id] = false;
  }
};

function selectUncle(id){
  if (!state) return;
  const m = miningState();
  if (!m.ownedUncles.includes(id)){ buyUncle(id); return; }
  if (m.isActive){ showToast('Claim your current mining before switching Model', ICONS.warning); return; }
  m.activeUncleId = id;
  patchState({ mining: m });
  haptic('light');
  renderMining();
}

function startMining(){
  if (!state) return;
  const m = miningState();
  const now = Date.now();
  if (m.isActive) return;
  if (m.cooldownUntil && now < m.cooldownUntil){
    showToast(`Wait ${formatCountdown(m.cooldownUntil - now)} before starting again`, ICONS.hourglass);
    return;
  }
  m.isActive = true;
  m.miningStartTime = now;
  m.cooldownUntil = null;
  // New mining session -> speed up level resets back to 1x (0 bonus, 0 ads used).
  m.speedUpCount = 0;
  m.speedUpBonus = 0;
  m.activityCheckRequired = false; m.activityCheckAt = null; m.activityCheckTarget = null; m.activityCheckGrid = null; m.activityCheckFails = 0;
  m.nextActivityCheckAt = MINING_ACTIVITY_CHECK_ENABLED ? now + MINING_ACTIVITY_CHECK_MS : null;
  patchState({ mining: m });
  haptic('medium');
  showToast('Mining started!', ICONS.pickaxe);
  renderMiningActionArea();
}

let miningClaimBusy = false;
async function claimMining(){
  if (miningClaimBusy || !state) return;
  const m = miningState();
  const uncle = activeUncle();
  const now = Date.now();
  if (m.activityCheckRequired){ openMiningActivityCheck(); showToast('Complete the Activity Check first', ICONS.warning); return; }
  if (!m.isActive || !m.miningStartTime){ showToast('Nothing to claim yet', ICONS.hourglass); return; }
  if (!miningCapReached(m, uncle, now)){ showToast('Mining still in progress — wait for it to fill up', ICONS.hourglass); return; }

  miningClaimBusy = true;
  const btn = document.getElementById('mining-claim-btn');
  if (btn) btn.disabled = true;
  try{
    const adsNeeded = Math.max(1, Number(uncle.adsToClaim) || 1);
    const breakSec = Math.max(0, Number(uncle.breakSeconds) || 0);
    // Same ad SDK / same showRewardedAdGate() call used by Daily Bonus — only the
    // loop count (adsToClaim) and the wait between ads (breakSeconds) differ.
    const adOk = await requireMultipleAdsBeforeAction('mining-claim-btn', adsNeeded, breakSec);
    if (!adOk){
      // Ad watched (or break started) but more ads remain — refresh the progress bar,
      // "watched X/Y" count, and countdown right away instead of leaving the old state
      // on screen until some other re-render happens to fire.
      renderMiningActionArea();
      return;
    }

    // Recompute "now" at the moment of actual credit — accumulation is capped so
    // watching ads afterward doesn't change the payout, but this keeps it accurate.
    const claimNow = Date.now();
    const amount = miningAccumulated(m, uncle, claimNow);
    state.EarningBalance = Number(state.EarningBalance || 0) + amount;
    recomputeTotalBalance();
    state.totalClaim = (state.totalClaim || 0) + 1;
    state.totalMined = Number(state.totalMined || 0) + amount;
    // Dedicated Firebase path tracking cumulative mining rewards only (separate
    // from EarningBalance/totalMined), shown in the "Total Mining" stat card.
    state.miningReward = Number(state.miningReward || 0) + amount;
    addTransaction('mining', `${uncle.name} Mining`, amount);
    sessionEarnedToday += amount;
    m.isActive = false;
    m.miningStartTime = null;
    m.lastClaimTime = claimNow;
    m.cooldownUntil = claimNow + (Number(uncle.cooldownMin) || 20) * 60 * 1000;
    // Speed Up level resets to 1x for the next mining session.
    m.speedUpCount = 0;
    m.speedUpBonus = 0;
    await saveState();
    haptic('success');
    showToast(`+${fmt(amount)} claimed!`, ICONS.pickaxe);
    if (currentScreen === 'home') renderHome();
    renderMiningActionArea();
  }catch(e){
    showToast('Ad not completed', ICONS.warning);
  }finally{
    miningClaimBusy = false;
    if (document.getElementById('mining-claim-btn')) document.getElementById('mining-claim-btn').disabled = false;
  }
}

// ---- Mining "Speed Up" ----
// Each tap plays one rewarded ad (same ad network / same showRewardedAdGate()
// call used by Daily Bonus and Mining Claim). On full watch, a random bonus
// between +0.01 and +0.05 AENVA/hr is permanently added to the active model's
// rate for the REST of the current mining session (stacks with each watch).
// A higher rate fills the same cap faster, so cap-fill time drops as the user
// speeds up. Max 10 speed-ups per mining session. A brand new mining session
// (after Start Mining or after a Claim) always resets back to 1x (0 bonus).
const MINING_SPEEDUP_MAX = 10;
let miningSpeedUpBusy = false;
async function miningSpeedUp(){
  if (miningSpeedUpBusy || !state) return;
  const m = miningState();
  if (!m.isActive){ showToast('Start mining first', ICONS.hourglass); return; }
  const uncle = activeUncle();
  if (miningCapReached(m, uncle, Date.now())){ showToast('Cap already full — claim your reward', ICONS.pickaxe); return; }
  const used = Number(m.speedUpCount || 0);
  if (used >= MINING_SPEEDUP_MAX){ showToast(`Speed Up limit reached (${MINING_SPEEDUP_MAX}/${MINING_SPEEDUP_MAX}) for this session`, ICONS.warning); return; }
  miningSpeedUpBusy = true;
  try{
    await showRewardedAdGate();
    // Fixed, one-time AENVA bonus (0.01–0.05) — added straight to the total, no per-hour
    // scaling, so it's the same reward whether tapped at the start or the end of the session.
    const bonus = 0.01 + Math.random() * 0.04; // random between 0.01 and 0.05
    m.speedUpBonus = Number(m.speedUpBonus || 0) + bonus;
    m.speedUpCount = used + 1;
    patchState({ mining: m });
    haptic('success');
    showToast(`+${bonus.toFixed(3)} AENVA speed boost! (${m.speedUpCount}/${MINING_SPEEDUP_MAX})`, ICONS.bolt);
    renderMiningActionArea();
  }catch(e){
    showToast('Watch the full ad to speed up', ICONS.warning);
  }finally{
    miningSpeedUpBusy = false;
  }
}
// Live admin-configurable rewarded-ad SDK zone (settings/adSdk -> { zoneId }).
// The libtl.com SDK script tag is (re)injected on change so ads keep working without a page reload.
// Declared here (module scope) — app.js runs as a module (strict mode), so assigning to these
// without a prior declaration throws "MONETAG_ZONE_ID is not defined".
let MONETAG_ZONE_ID = null;
let MONETAG_ZONE_FUNC = null;
function loadMonetagSdk(zoneId){
  const id = String(zoneId || '11692895').replace(/[^0-9]/g, '') || '11692895';
  const funcName = 'show_' + id;
  const existing = document.getElementById('monetag-sdk-script');
  if (existing && existing.dataset.zone === id){
    MONETAG_ZONE_ID = id;
    MONETAG_ZONE_FUNC = funcName;
    return;
  }
  if (existing) existing.remove();
  const script = document.createElement('script');
  script.id = 'monetag-sdk-script';
  script.src = '//libtl.com/sdk.js';
  script.setAttribute('data-zone', id);
  script.setAttribute('data-sdk', funcName);
  script.dataset.zone = id;
  document.head.appendChild(script);
  MONETAG_ZONE_ID = id;
  MONETAG_ZONE_FUNC = funcName;
}

// ---- Multi-network ad system (Monetag / Adsgram / GigaPub) ----
// Admin picks exactly ONE active network in settings/adNetwork -> { active: 'monetag'|'adsgram'|'gigapub' }.
// Every network's SDK+ID is loaded in the background (so switching is instant, no reload needed),
// but only the ACTIVE_AD_NETWORK is actually used to serve ads to the user.
let ACTIVE_AD_NETWORK = 'monetag';
let ADSGRAM_BLOCK_ID = '';
let ADSGRAM_CONTROLLER = null;
let GIGAPUB_PROJECT_ID = '';

function loadAdsgramSdk(blockId){
  const id = String(blockId || '').trim() || 'int-45884';
  const existing = document.getElementById('adsgram-sdk-script');
  const initController = () => {
    try{ ADSGRAM_CONTROLLER = (window.Adsgram && window.Adsgram.init) ? window.Adsgram.init({ blockId: id }) : null; }
    catch(e){ ADSGRAM_CONTROLLER = null; }
  };
  if (existing){
    if (existing.dataset.block === id){
      ADSGRAM_BLOCK_ID = id;
      if (!ADSGRAM_CONTROLLER) initController();
      return;
    }
    existing.remove();
    ADSGRAM_CONTROLLER = null;
  }
  ADSGRAM_BLOCK_ID = id;
  const script = document.createElement('script');
  script.id = 'adsgram-sdk-script';
  script.src = 'https://sad.adsgram.ai/js/sad.min.js';
  script.dataset.block = id;
  script.onload = initController;
  document.head.appendChild(script);
}

function loadGigapubSdk(projectId){
  const id = String(projectId || '').trim() || '8009';
  const existing = document.getElementById('gigapub-sdk-script');
  if (existing && existing.dataset.pid === id){ GIGAPUB_PROJECT_ID = id; return; }
  if (existing) existing.remove();
  GIGAPUB_PROJECT_ID = id;
  const script = document.createElement('script');
  script.id = 'gigapub-sdk-script';
  script.src = 'https://ad.gigapub.tech/script?id=' + encodeURIComponent(id);
  script.dataset.pid = id;
  document.head.appendChild(script);
}

function listenAdSdkSettings(){
  onValue(ref(db, 'settings/adSdk'), snap => {
    const v = snap.exists() ? snap.val() : null;
    loadMonetagSdk(v && v.zoneId);
  });
  onValue(ref(db, 'settings/adsgramConfig'), snap => {
    const v = snap.exists() ? snap.val() : null;
    loadAdsgramSdk(v && v.blockId);
  });
  onValue(ref(db, 'settings/gigapubConfig'), snap => {
    const v = snap.exists() ? snap.val() : null;
    loadGigapubSdk(v && v.projectId);
  });
  onValue(ref(db, 'settings/adNetwork'), snap => {
    const v = snap.exists() ? snap.val() : null;
    const active = (v && v.active) ? String(v.active) : 'monetag';
    ACTIVE_AD_NETWORK = ['monetag','adsgram','gigapub'].includes(active) ? active : 'monetag';
  });
}

// Keep a safe bootstrap state during Telegram/Firebase startup.
// Telegram WebView can fire UI/listener callbacks before loadState() finishes.
let state = {
  uid: null,
  isModerator: false,
  totalBalance: 0,
  referBalance: 0,
  EarningBalance: 0,
  depositBalance: 0,
  credit: 0,
  totalWatchAd: 0,
  streak: 0,
  totalClaim: 0,
  invalidWork: 0,
  totalMined: 0,
  transactions: [],
  completedTasks: {},
  taskCompletionCount: {},
  adCampaigns: [],
  referrals: [],
  notifications: []
};
let userPath = null;
let isGuest = false;
let appInitialized = false;

let sessionEarnedToday = 0;


function referCodeNamePart(firstName){
  const letters = String(firstName || '').replace(/[^a-zA-Z]/g, '').toUpperCase();
  if (letters.length >= 2) return letters.slice(0, 2);
  if (letters.length === 1) return letters + 'X';
  return 'US';
}
function referCodeUidPart(uid){
  const digits = String(uid || '').replace(/\D/g, '');
  if (digits.length >= 4) return digits.slice(-4);
  return digits.padStart(4, '0');
}
function referCodeRandomPart(){
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return chars[Math.floor(Math.random() * chars.length)];
}
function buildReferCode(firstName, uid){
  return referCodeNamePart(firstName) + referCodeUidPart(uid) + referCodeRandomPart();
}

async function generateUniqueReferCode(firstName, uid){
  for (let attempt = 0; attempt < 20; attempt++){
    const candidate = buildReferCode(firstName, uid);
    try{
      const q = query(ref(db, 'users'), orderByChild('referCode'), equalTo(candidate));
      const snap = await get(q);
      if (!snap.exists()) return candidate;
    }catch(e){
      console.error('Refer code uniqueness check failed — check that users/.indexOn includes "referCode".', e);
      return candidate;
    }
  }

  return buildReferCode(firstName, uid) + Date.now().toString(36).slice(-2).toUpperCase();
}

function emptyState(profile, ip){
  return {
    username: profile.username,
    firstName: profile.firstName,
    lastName: profile.lastName,
    uid: profile.uid,
    profilePic: profile.photoUrl || '',
    localIP: ip || null,
    referCount: 0,
    totalClaim: 0,
    invalidWork: 0,
    totalMined: 0,
    referBalance: 0,
    EarningBalance: 0,
    depositBalance: 0,
    credit: 0,
    totalWatchAd: 0,
    totalBalance: 0,
    referCode: 'MX' + profile.id,
    usedRefer: null,
    joinedBy: null,
    isModerator: false,


    referralEarnings: 0,


    accountCreatedAt: Date.now(),

    lastActiveAt: null,

    streak: 0,
    referrals: [],
    transactions: [],
    copiedTrades: {},
    completedTasks: {},
    taskCompletionCount: {},
    dailyBonusClaimedAt: null,
      adCampaigns: [],
    notifications: []
  };
}


function normalizeLoadedState(raw, profile, ip){
  const base = emptyState(profile, ip);
  const src = (raw && typeof raw === 'object') ? raw : {};
  const merged = { ...base, ...src };
  if (typeof merged.isModerator !== 'boolean') merged.isModerator = merged.isModerator === true || merged.isModerator === 'yes';
  if (!Array.isArray(merged.transactions)) merged.transactions = [];
  if (!merged.completedTasks || typeof merged.completedTasks !== 'object') merged.completedTasks = {};
  if (!merged.taskCompletionCount || typeof merged.taskCompletionCount !== 'object') merged.taskCompletionCount = {};
  if (!Array.isArray(merged.adCampaigns)) merged.adCampaigns = [];
  if (!Array.isArray(merged.referrals)) merged.referrals = [];
  if (!Array.isArray(merged.notifications)) merged.notifications = [];
  return merged;
}

async function loadState(profile, ip){
  if (isGuest){
    state = emptyState(profile, ip);
    userPath = null;
    return state;
  }
  userPath = 'users/' + profile.uid;
  const snap = await withTimeout(get(ref(db, userPath)), 12000, 'firebase-load-state');
  if (snap.exists()){
    state = normalizeLoadedState(snap.val(), profile, ip);
    state.username = profile.username || state.username;
    state.firstName = profile.firstName || state.firstName;
    state.lastName = profile.lastName || state.lastName;
    state.profilePic = profile.photoUrl || state.profilePic;
    state.localIP = ip || state.localIP || null;


    const legacyBuckets = ['gBalance', 'fBalance', 'adBalance'];
    let legacySum = 0;
    let hadLegacy = false;
    for (const k of legacyBuckets){
      if (k in state){ hadLegacy = true; legacySum += Number(state[k] || 0); delete state[k]; }
    }
    if (hadLegacy){
      state.EarningBalance = Number(state.EarningBalance || 0) + legacySum;
    }
    if ('todayEarn' in state) delete state.todayEarn;

    const base = emptyState(profile, ip);
    for (const k in base){ if (!(k in state)) state[k] = base[k]; }
    recomputeTotalBalance();
    await saveState();
  } else {
    state = emptyState(profile, ip);
    state.referCode = await generateUniqueReferCode(profile.firstName, profile.uid);
    await saveState();
    incrementTotalUsersCounter();
  }
  return state;
}

async function saveState(){
  if (isGuest) return;
  if (!userPath || !state) return;
  try{ await set(ref(db, userPath), state); }catch(e){ console.error('saveState failed', e); }
}

async function patchState(partial){
  if (isGuest) return;
  if (!userPath) return;
  try{ await update(ref(db, userPath), partial); }catch(e){ console.error('patchState failed', e); }
}

// ---------------------------------------------------------------------
// Last-active tracking — lets the admin console see when each user was
// last using the app, and builds a real per-day "who was active" record
// at analytics/dau/{dateKey}/{uid} so yesterday's active count stays
// intact even after that user opens the app again today. Uses the same
// midnight (12:00 AM) day boundary as the rest of the app's daily limits/resets.
// ---------------------------------------------------------------------
let lastActiveHeartbeatTimer = null;

async function markUserActive(){
  if (isGuest || !userPath || !state || !state.uid) return;
  const now = Date.now();
  try{
    await patchState({ lastActiveAt: now });
    await set(ref(db, 'analytics/dau/' + dailyLimitDateKey() + '/' + state.uid), now);
  }catch(e){ console.error('markUserActive failed', e); }
}

function startActiveHeartbeat(){
  if (isGuest || lastActiveHeartbeatTimer) return;
  markUserActive();
  lastActiveHeartbeatTimer = setInterval(markUserActive, 5 * 60 * 1000);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible'){
      markUserActive();
          }
  });
}

function recomputeTotalBalance(){
  state.totalBalance = Number(state.referBalance||0) + Number(state.EarningBalance||0) + Number(state.depositBalance||0);
}


function withdrawableBalance(){
  return Number(state.referBalance||0) + Number(state.EarningBalance||0);
}


function adSpendableBalance(){
  return withdrawableBalance() + Number(state.depositBalance||0);
}


function reconcileDepositBalance(){
  if (!state) return;
  const earnedSum = Number(state.referBalance||0) + Number(state.EarningBalance||0);
  const knownSum = earnedSum + Number(state.depositBalance||0);
  const diff = Number(state.totalBalance||0) - knownSum;
  if (diff > 0.0001){
    state.depositBalance = Number(state.depositBalance||0) + diff;
  }
}


let depositMethodsCache = [];
let withdrawMethodsCache = [];
let depositMethodsLoaded = false;
let withdrawMethodsLoaded = false;

function listenDepositMethods(cb){
  onValue(ref(db, 'deposit_methods'), snap => {
    const val = snap.exists() ? snap.val() : {};
    depositMethodsCache = Object.keys(val).map(id => ({ id, ...val[id] })).filter(m => m.status === true);
    depositMethodsLoaded = true;
    if (cb) cb(depositMethodsCache);
  });
}
function listenWithdrawMethods(cb){
  onValue(ref(db, 'withdraw_methods'), snap => {
    const val = snap.exists() ? snap.val() : {};
    withdrawMethodsCache = Object.keys(val).map(id => ({ id, ...val[id] })).filter(m => m.status === true);
    withdrawMethodsLoaded = true;
    if (cb) cb(withdrawMethodsCache);
  });
}


async function fetchLeaderboard(limit=10){
  const snap = await get(ref(db, 'users'));
  if (!snap.exists()) return [];
  const val = snap.val();
  const rows = Object.keys(val).map(uid => {
    const u = val[uid] || {};
    const name = [u.firstName, u.lastName].filter(Boolean).join(' ').trim() || ('@' + (u.username || 'user'));


    const earn = Number(u.totalBalance) || (
      Number(u.referBalance||0) + Number(u.EarningBalance||0) + Number(u.depositBalance||0)
    );
    return {
      uid,
      name,
      photo: u.profilePic || '',
      earn,
      isModerator: u.isModerator === true || u.isModerator === 'yes'
    };
  });
  return rows.sort((a,b)=>b.earn-a.earn).slice(0, limit);
}


async function captureReferralIfAny(tg, newState){
  if (isGuest) return;
  if (newState.usedRefer) return;


  const raw = tg?.initDataUnsafe?.start_param || tg?.initDataUnsafe?.startapp || '';
  const startParam = String(raw).trim();
  if (startParam.toLowerCase().startsWith('ref_')){
    const code = startParam.slice(4);
    const linked = await linkReferralByCode(code, newState, 'telegram_deep_link', startParam);
    if (linked) return;
  }

  // Fallback: the Telegram bot (bot.php) records a 'pendingReferrals/{uid}' entry the
  // moment someone taps a referral link via /start — often before they've ever opened
  // this mini app. The bot sends its "New Referral!" notification right away too, but
  // that pending record is only ever a placeholder: nothing finalizes it into the real
  // users/{referrerUid} data. If the mini app later gets opened from the persistent
  // menu button (no start_param at all, as happens most of the time) the block above
  // finds nothing and the referral silently never gets credited, even though Telegram
  // already told the referrer it succeeded. This fallback consumes that pending record
  // so the referral still gets linked and counted.
  await linkReferralFromPending(newState);
}


async function linkReferralFromPending(newState){
  if (isGuest || newState.usedRefer) return false;

  let snap;
  try{
    snap = await get(ref(db, 'pendingReferrals/' + newState.uid));
  }catch(e){
    console.error('Pending referral lookup failed', e);
    return false;
  }
  if (!snap.exists()) return false;

  const pending = snap.val() || {};
  const referrerId = String(pending.referrerUid || '');
  const clearPending = () => set(ref(db, 'pendingReferrals/' + newState.uid), null).catch(()=>{});

  if (!referrerId || referrerId === newState.uid){ await clearPending(); return false; }

  let referrerSnap;
  try{
    referrerSnap = await get(ref(db, 'users/' + referrerId));
  }catch(e){
    console.error('Referrer lookup failed while finalizing pending referral', e);
    return false; // don't clear — worth retrying on the next app launch
  }
  if (!referrerSnap.exists()){ await clearPending(); return false; }
  const referrer = referrerSnap.val() || {};

  const now = Date.now();
  const referrals = referrer.referrals || [];
  referrals.unshift({
    uid: newState.uid,
    username: newState.username || '',
    firstName: newState.firstName || '',
    joinedAt: now,
    source: pending.source || 'telegram_bot'
  });

  await update(ref(db, 'users/' + referrerId), {
    referrals,
    referCount: (referrer.referCount || 0) + 1
  });

  newState.usedRefer = { username: referrer.username || pending.referrerUsername || '', telegramUid: referrerId };
  newState.joinedBy = {
    referrerUid: referrerId,
    referrerCode: pending.referrerCode || referrer.referCode || '',
    referrerUsername: referrer.username || pending.referrerUsername || '',
    referrerFirstName: referrer.firstName || pending.referrerFirstName || '',
    joinedAt: now,
    source: pending.source || 'telegram_bot',
    startParamRaw: pending.startParamRaw || null,
    valid: true
  };

  await clearPending();
  return true;
}


async function linkReferralByCode(code, newState, source, startParamRaw){
  if (isGuest) return false;
  if (newState.usedRefer) return false;


  const normalized = String(code || '').trim().toUpperCase();
  if (!normalized || normalized === newState.referCode) return false;

  let snap;
  try{
    const q = query(ref(db, 'users'), orderByChild('referCode'), equalTo(normalized));
    snap = await get(q);
  }catch(e){


    console.error('Referral lookup failed — check that users/.indexOn includes "referCode" in your Firebase rules.', e);
    throw e;
  }

  if (!snap.exists()) return false;

  const [referrerId, referrer] = Object.entries(snap.val())[0];
  if (referrerId === newState.uid) return false;

  const now = Date.now();
  const referrals = referrer.referrals || [];
  referrals.unshift({
    uid: newState.uid,
    username: newState.username || '',
    firstName: newState.firstName || '',
    joinedAt: now,
    source: source || 'unknown'
  });

  await update(ref(db, 'users/' + referrerId), {
    referrals,
    referCount: (referrer.referCount || 0) + 1
  });

  newState.usedRefer = { username: referrer.username || '', telegramUid: referrerId };
  newState.joinedBy = {
    referrerUid: referrerId,
    referrerCode: normalized,
    referrerUsername: referrer.username || '',
    referrerFirstName: referrer.firstName || '',
    joinedAt: now,
    source: source || 'unknown',
    startParamRaw: startParamRaw || null,
    valid: true
  };
  return true;
}


async function addReferralCommissionToUpdates(updates, baseWithdrawAmount){
  if (isGuest) return;
  const referrerId = state.usedRefer && state.usedRefer.telegramUid;
  if (!referrerId || referrerId === state.uid) return;
  try{
    const snap = await get(ref(db, 'users/' + referrerId));
    if (!snap.exists()) return;
    const referrer = snap.val();
    const rate = userReferBonusPercent(referrer) / 100;
    const commission = Number((Number(baseWithdrawAmount) * rate).toFixed(2));
    if (!(commission > 0)) return;

    const newEarningBalance = Number(referrer.EarningBalance || 0) + commission;
    const newEarnings = Number(referrer.referralEarnings || 0) + commission;
    const newTotal = Number(referrer.referBalance || 0) + newEarningBalance + Number(referrer.depositBalance || 0);

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric'});
    const timeStr = now.toLocaleTimeString('en-US', {hour:'2-digit', minute:'2-digit'});
    const referrerTransactions = Array.isArray(referrer.transactions) ? referrer.transactions.slice() : [];
    referrerTransactions.unshift({
      type: 'earn',
      title: `Referral Commission from @${state.username || 'user'} (Withdraw)`,
      amount: commission,
      date: `${dateStr}, ${timeStr}`,
      status: 'Completed',
      requestId: null
    });

    updates['users/' + referrerId + '/EarningBalance'] = newEarningBalance;
    updates['users/' + referrerId + '/referralEarnings'] = newEarnings;
    updates['users/' + referrerId + '/totalBalance'] = newTotal;
    updates['users/' + referrerId + '/transactions'] = referrerTransactions;
  }catch(e){
    console.error('referral commission failed', e);
  }
}


let currentScreen = 'home';
let baseScreen = 'home';
let overlayStack = [];

function navigateTo(name){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  const el = document.getElementById('screen-' + name);
  if (el) el.classList.add('active');
  currentScreen = name;
  baseScreen = name;
  overlayStack = [];
  document.querySelectorAll('.nav-item').forEach(n=>{
    n.classList.toggle('active', n.dataset.screen === name);
  });
  document.getElementById('main-content').scrollTo(0,0);
  window.scrollTo(0,0);
  if (name === 'work') renderWorkItems('all');
  if (name === 'transaction') renderTransactions('all');
  if (name === 'refer') renderReferrals();
  if (name === 'profile') renderProfile();
  if (name === 'home') renderHome();
}

function openOverlay(name){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById('screen-' + name).classList.add('active');
  overlayStack.push(name);
  currentScreen = name;
}
function closeOverlay(){
  overlayStack.pop();
  if (overlayStack.length > 0){
    const prev = overlayStack[overlayStack.length-1];
    document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
    document.getElementById('screen-' + prev).classList.add('active');
    currentScreen = prev;
  } else {
    navigateTo(baseScreen);
  }
}


// Today's real net transaction total for the home balance card — sums every
// transaction dated today (deposits +, withdraws already stored as negative, and all
// earning types), not just the 8 "activity" categories. Since this reads straight from
// `state`, and `state` itself is kept in sync via the live Firebase listener, this number
// updates in real time the moment a new transaction lands — no page refresh needed.
function computeTodayEarnedTotal(){
  if (!state) return 0;
  const todayKey = activityDayKey(new Date());
  let total = 0;
  (state.transactions || []).forEach(tx => {
    const d = new Date(tx?.date);
    if (isNaN(d.getTime())) return;
    if (activityDayKey(d) !== todayKey) return;
    total += Number(tx.amount || 0);
  });
  return total;
}

function renderHome(){
  if (!state) return;
  document.getElementById('home-balance').textContent = fmt(state.totalBalance);
  const todayTotal = computeTodayEarnedTotal();
  document.getElementById('balance-change').innerHTML = `${fmt(Math.abs(todayTotal))} today`;
  document.getElementById('stat-total-claim').textContent = state.totalClaim || 0;
  document.getElementById('stat-invalid-work').textContent = state.invalidWork || 0;
  document.getElementById('streak-count').textContent = state.streak;
  document.getElementById('home-refer-count').textContent = state.referCount || (state.referrals||[]).length;

  const guestBanner = document.getElementById('guest-banner');
  if (guestBanner) guestBanner.style.display = isGuest ? 'block' : 'none';

  renderLeaderboardPreview();
  renderDailyBonus();
}


async function renderLeaderboardPreview(){
  const wrap = document.getElementById('leaderboard-preview');
  const rows = await fetchLeaderboard(10);
  if (rows.length === 0){
    wrap.innerHTML = `<div class="empty-state"><div class="empty-icon">${ICONS.inbox}</div><div class="empty-title">No leaderboard data yet</div><div class="empty-desc">Be the first to earn and top the board</div></div>`;
    return;
  }
  wrap.innerHTML = rows.map((u,i)=>{
    const rankClass = i===0?'top1':i===1?'top2':i===2?'top3':'';
    const initial = (u.name.replace('@','').charAt(0) || '?').toUpperCase();
    const avatarInner = u.photo
      ? `<img src="${u.photo}" alt="" loading="lazy" onerror="this.parentElement.textContent='${initial}';">`
      : initial;
    return `<div class="lb-row">
      <div class="lb-rank ${rankClass}">${i+1}</div>
      <div class="lb-avatar">${avatarInner}</div>
      <div class="lb-info"><div class="lb-name">${esc(u.name)}${u.isModerator ? `<span class="mod-badge-icon lb-badge badge-pulse badge-clickable" onclick="event.stopPropagation(); openBadgeLightbox()">${moderatorBadgeSvg()}</span>` : ''}</div><div class="lb-sub">Top Earner</div></div>
      <div class="lb-amount">${fmt(u.earn)}</div>
    </div>`;
  }).join('');
}


function dailyBonusAmount(){
  return dailyBonusBase;
}

function renderDailyBonus(){
  const btn = document.getElementById('claim-bonus-btn');
  const desc = document.getElementById('daily-bonus-desc');
  const claimedToday = state.dailyBonusClaimedAt && isSameDay(state.dailyBonusClaimedAt, Date.now());
  const amount = dailyBonusAmount();
  if (claimedToday){
    setAdLockButtonLabel('claim-bonus-btn', 'Claimed');
    btn.disabled = true;
    desc.textContent = 'Come back tomorrow for more!';
  } else {
    setAdLockButtonLabel('claim-bonus-btn', 'Claim');
    btn.disabled = false;
    desc.textContent = `Claim +${fmt(amount)} today!`;
  }
  initAdLockButton('claim-bonus-btn');
}


let dailyBonusClaiming = false;

async function claimDailyBonus(){
  if (dailyBonusClaiming) return;


  const claimedTodayLocal = state.dailyBonusClaimedAt && isSameDay(state.dailyBonusClaimedAt, Date.now());
  if (claimedTodayLocal){ showToast('Already claimed today', ICONS.hourglass); return; }

  dailyBonusClaiming = true;
  const btn = document.getElementById('claim-bonus-btn');
  if (btn) btn.disabled = true;

  try{
    const adOk = await requireAdBeforeAction('claim-bonus-btn');
    if (!adOk) return;


    if (!isGuest && userPath){
      try{
        const snap = await get(ref(db, userPath + '/dailyBonusClaimedAt'));
        const liveClaimedAt = snap.exists() ? snap.val() : null;
        if (liveClaimedAt && isSameDay(liveClaimedAt, Date.now())){
          state.dailyBonusClaimedAt = liveClaimedAt;
          renderDailyBonus();
          showToast('Already claimed today', ICONS.hourglass);
          return;
        }
      }catch(e){
        console.error('daily bonus verify read failed', e);
      }
    }

    const now = Date.now();
    const amount = dailyBonusAmount();


    if (!state.dailyBonusClaimedAt){
      state.streak = 1;
    } else if (isConsecutiveDay(state.dailyBonusClaimedAt, now)){
      state.streak = (state.streak||0) + 1;
    } else {
      state.streak = 1;
    }

    state.EarningBalance = (state.EarningBalance||0) + amount;
    recomputeTotalBalance();
    sessionEarnedToday += amount;
    state.dailyBonusClaimedAt = now;
    state.totalClaim = (state.totalClaim||0) + 1;
    addTransaction('earn', 'Daily Bonus', amount);
    await saveState();
    haptic('medium');
    showToast(`+${fmt(amount)} daily bonus claimed!`, ICONS.gift);
    renderHome();
  } finally {
    dailyBonusClaiming = false;
    if (btn) renderDailyBonus();
  }
}

function addTransaction(type, title, amount, status, requestId, extra){
  const tx = {
    type, title, amount,
    date: new Date().toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric'}),
    status: status || 'Completed',
    requestId: requestId || null
  };
  if (extra && typeof extra === 'object'){
    Object.assign(tx, extra);
  }
  state.transactions.unshift(tx);
}


let selectedDepositMethod = null;
let selectedWithdrawMethod = null;
let depositSubmitting = false;
let withdrawSubmitting = false;


let appliedDepositCoupon = null;
let appliedWithdrawCoupon = null;
let depositCouponChecking = false;
let withdrawCouponChecking = false;

function openDeposit(){
  selectedDepositMethod = null;
  document.getElementById('deposit-amount').value = '';
  document.getElementById('deposit-txid').value = '';
  document.getElementById('deposit-amount-error').classList.remove('show');
  document.getElementById('deposit-txid-error').classList.remove('show');
  document.getElementById('deposit-amount-section').style.display = 'none';
  document.getElementById('deposit-txid-section').style.display = 'none';
  document.getElementById('deposit-method-details').style.display = 'none';
  document.getElementById('deposit-submit-btn').disabled = true;
  appliedDepositCoupon = null;
  document.getElementById('deposit-coupon').value = '';
  document.getElementById('deposit-coupon-error').classList.remove('show');
  document.getElementById('deposit-coupon-result').style.display = 'none';
  openOverlay('deposit');
  if (!depositMethodsLoaded){
    document.getElementById('deposit-methods').innerHTML = `<div class="empty-state"><div class="empty-icon">${ICONS.hourglass}</div><div class="empty-title">Loading methods...</div></div>`;
  } else {
    renderDepositMethodsUI(depositMethodsCache);
  }
}

function renderDepositMethodsUI(methods){
  const wrap = document.getElementById('deposit-methods');
  if (!methods || methods.length === 0){
    wrap.innerHTML = `<div class="empty-state"><div class="empty-icon">${ICONS.warning}</div><div class="empty-title">No deposit methods yet</div><div class="empty-desc">Please check back later</div></div>`;
    selectedDepositMethod = null;
    document.getElementById('deposit-method-details').style.display = 'none';
    document.getElementById('deposit-amount-section').style.display = 'none';
    document.getElementById('deposit-txid-section').style.display = 'none';
    document.getElementById('deposit-submit-btn').disabled = true;
    return;
  }
  wrap.innerHTML = methods.map(m=> `<div class="deposit-method${selectedDepositMethod && selectedDepositMethod.id===m.id?' selected':''}" data-id="${m.id}" onclick="selectDepositMethod('${m.id}')">${m.image?`<img class="method-logo" src="${m.image}" alt="">`:`<span>${ICONS.coin}</span>`} ${m.name}</div>`).join('');
  if (selectedDepositMethod){
    const stillValid = methods.find(m=>m.id===selectedDepositMethod.id);
    if (stillValid){ selectedDepositMethod = stillValid; showDepositMethodDetail(selectedDepositMethod); }
    else { selectedDepositMethod = null; document.getElementById('deposit-method-details').style.display='none'; document.getElementById('deposit-amount-section').style.display='none'; document.getElementById('deposit-txid-section').style.display='none'; }
  }
  validateDepositForm();
}

function selectDepositMethod(id){
  const m = depositMethodsCache.find(x=>x.id===id);
  if (!m) return;
  selectedDepositMethod = m;
  document.querySelectorAll('#deposit-methods .deposit-method').forEach(el=> el.classList.toggle('selected', el.dataset.id===id));
  showDepositMethodDetail(m);
  document.getElementById('deposit-amount-section').style.display = 'block';
  document.getElementById('deposit-txid-section').style.display = 'block';
  validateDepositForm();
}

function showDepositMethodDetail(m){
  const box = document.getElementById('deposit-method-details');
  const label = document.getElementById('deposit-method-detail-label');
  const val = document.getElementById('deposit-method-detail-value');
  const qrBox = document.getElementById('deposit-method-qr');
  const limitText = document.getElementById('deposit-limit-text');
  const noteBox = document.getElementById('deposit-method-note');

  box.style.display = 'block';
  label.textContent = 'Send payment to (' + m.name + ')';
  val.textContent = m.address || m.note || '—';

  if (m.qr){
    qrBox.style.display = 'block';
    qrBox.innerHTML = `<img id="deposit-qr-image" src="${esc(m.qr)}" alt="QR" referrerpolicy="no-referrer" loading="lazy" onclick="event.stopPropagation(); openQrImageLightbox()" onerror="this.onerror=null; this.replaceWith(Object.assign(document.createElement('div'),{className:'qr-fallback',textContent:'QR unavailable'}));">`;
  } else {
    qrBox.style.display = 'none';
    qrBox.innerHTML = '';
  }

  const rate = methodRate(m);
  const unit = methodCurrency(m);
  if (limitText) limitText.textContent = `Rate: 1 AENVA = ${coinFmt(rate)} ${unit} · Min ${fmt(m.min||0)} · Max ${fmt(m.max||0)}`;

  if (noteBox){
    if (m.note){
      noteBox.style.display = 'block';
      noteBox.textContent = m.note;
    } else {
      noteBox.style.display = 'none';
      noteBox.textContent = '';
    }
  }
}

function copyDepositAddress(){
  if (!selectedDepositMethod){ return; }
  const text = selectedDepositMethod.address || selectedDepositMethod.note || '';
  if (!text){ showToast('No address to copy', ICONS.warning); return; }
  try{ navigator.clipboard?.writeText(text); }catch(e){}
  haptic('light');
  showToast('Address copied!', ICONS.copy);
}

function onDepositAmountChange(){
  validateDepositForm();
  renderDepositCouponResult();
  renderDepositPaymentBreakdown();
}

function renderDepositPaymentBreakdown(){
  const box = document.getElementById('deposit-usd-breakdown');
  if (!box) return;
  const atrAmt = parseFloat(document.getElementById('deposit-amount').value);
  if (!selectedDepositMethod || !atrAmt || atrAmt <= 0){ box.style.display = 'none'; return; }
  const rate = methodRate(selectedDepositMethod);
  const unit = methodCurrency(selectedDepositMethod);
  if (!(rate > 0)){ box.style.display = 'block'; box.textContent = 'This payment method has no valid AENVA conversion rate.'; return; }
  const base = Number(atrAmt) * rate;
  const feeCoin = base * (DEPOSIT_FEE_PERCENT || 0) / 100;
  const beforeCoupon = base + feeCoin;
  const payable = depositPayableCoin(atrAmt, selectedDepositMethod);
  box.style.display = 'block';
  box.innerHTML = `Rate: 1 AENVA = ${coinFmt(rate)} ${unit}<br>Deposit fee (${DEPOSIT_FEE_PERCENT}%): ${coinFmt(feeCoin)} ${unit}<br>You must send: <strong>${coinFmt(payable)} ${esc(unit)}</strong>`;
}



async function applyDepositCoupon(){
  const codeInput = document.getElementById('deposit-coupon');
  const errEl = document.getElementById('deposit-coupon-error');
  const code = codeInput.value.trim().toUpperCase();
  errEl.classList.remove('show');

  if (!code){
    errEl.textContent = 'Enter a coupon code';
    errEl.classList.add('show');
    return;
  }
  if (depositCouponChecking) return;
  depositCouponChecking = true;
  const btn = document.getElementById('deposit-coupon-btn');
  btn.disabled = true;
  showLoading(true);
  try{
    const snap = await get(ref(db, 'coupons/' + code));
    if (!snap.exists()){
      appliedDepositCoupon = null;
      document.getElementById('deposit-coupon-result').style.display = 'none';
      errEl.textContent = 'Invalid coupon code';
      errEl.classList.add('show');
      return;
    }
    const c = snap.val();
    if (c.type !== 'Deposit'){
      appliedDepositCoupon = null;
      document.getElementById('deposit-coupon-result').style.display = 'none';
      errEl.textContent = 'This coupon is not valid for deposits';
      errEl.classList.add('show');
      return;
    }
    if (c.used){
      appliedDepositCoupon = null;
      document.getElementById('deposit-coupon-result').style.display = 'none';
      errEl.textContent = 'This coupon has already been used';
      errEl.classList.add('show');
      return;
    }
    appliedDepositCoupon = { code: c.code, discount: Number(c.discount) || 0 };
    haptic('light');
    showToast(`Coupon ${c.code} applied — ${appliedDepositCoupon.discount}% off`, ICONS.gift);
    renderDepositCouponResult();
  }catch(e){
    console.error(e);
    errEl.textContent = 'Failed to check coupon, try again';
    errEl.classList.add('show');
  }finally{
    depositCouponChecking = false;
    btn.disabled = false;
    showLoading(false);
  }
}

function removeDepositCoupon(){
  appliedDepositCoupon = null;
  document.getElementById('deposit-coupon').value = '';
  document.getElementById('deposit-coupon-result').style.display = 'none';
  document.getElementById('deposit-coupon-error').classList.remove('show');
}

function renderDepositCouponResult(){
  const resultEl = document.getElementById('deposit-coupon-result');
  if (!resultEl) return;
  if (!appliedDepositCoupon){ resultEl.style.display = 'none'; return; }
  const atrAmt = parseFloat(document.getElementById('deposit-amount').value);
  if (!selectedDepositMethod || !atrAmt || atrAmt <= 0){ resultEl.style.display = 'none'; return; }
  const unit = methodCurrency(selectedDepositMethod);
  const fullCoin = Number((atrAmt * methodRate(selectedDepositMethod) * (1 + (DEPOSIT_FEE_PERCENT||0)/100)).toFixed(8));
  const payCoin = depositPayableCoin(atrAmt, selectedDepositMethod);
  resultEl.className = 'coupon-result discount';
  resultEl.style.display = 'block';
  resultEl.innerHTML = `${appliedDepositCoupon.discount}% discount applied (${appliedDepositCoupon.code})<br>You'll send only <strong>${coinFmt(payCoin)} ${esc(unit)}</strong> instead of ${coinFmt(fullCoin)} ${esc(unit)}<br>You'll still receive <strong>${fmt(atrAmt)}</strong><br><span class="coupon-result-remove" onclick="removeDepositCoupon()">Remove coupon</span>`;
}

function getDepositPayAmount(atrAmt){
  return depositPayableCoin(atrAmt, selectedDepositMethod);
}

function validateDepositForm(){
  const errEl = document.getElementById('deposit-amount-error');
  const txidErrEl = document.getElementById('deposit-txid-error');
  const btn = document.getElementById('deposit-submit-btn');
  const atrAmt = parseFloat(document.getElementById('deposit-amount').value);
  const txid = document.getElementById('deposit-txid').value.trim();
  errEl.classList.remove('show');
  txidErrEl.classList.remove('show');

  if (!selectedDepositMethod){ btn.disabled = true; return; }
  if (!(methodRate(selectedDepositMethod) > 0)){
    errEl.textContent = 'This deposit method has no valid AENVA conversion rate';
    errEl.classList.add('show'); btn.disabled = true; return;
  }
  if (!atrAmt || atrAmt <= 0){ btn.disabled = true; return; }
  if (atrAmt < (selectedDepositMethod.min||0)){
    errEl.textContent = `Minimum deposit is ${fmt(selectedDepositMethod.min)}`;
    errEl.classList.add('show'); btn.disabled = true; return;
  }
  if (selectedDepositMethod.max && atrAmt > selectedDepositMethod.max){
    errEl.textContent = `Maximum deposit is ${fmt(selectedDepositMethod.max)}`;
    errEl.classList.add('show'); btn.disabled = true; return;
  }
  if (!txid){
    txidErrEl.textContent = 'Transaction ID / proof is required';
    txidErrEl.classList.add('show');
    btn.disabled = true; return;
  }
  btn.disabled = false;
}



function openWithdraw(){
  selectedWithdrawMethod = null;
  document.getElementById('withdraw-available').textContent = fmt(withdrawableBalance());
  document.getElementById('withdraw-amount').value = '';
  document.getElementById('withdraw-address').value = '';
  document.getElementById('withdraw-amount-error').classList.remove('show');
  document.getElementById('withdraw-amount-success').classList.remove('show');
  document.getElementById('withdraw-submit-btn').disabled = true;
  appliedWithdrawCoupon = null;
  document.getElementById('withdraw-coupon').value = '';
  document.getElementById('withdraw-coupon-error').classList.remove('show');
  document.getElementById('withdraw-coupon-result').style.display = 'none';
  openOverlay('withdraw');
  if (!withdrawMethodsLoaded){
    document.getElementById('withdraw-methods').innerHTML = `<div class="empty-state"><div class="empty-icon">${ICONS.hourglass}</div><div class="empty-title">Loading methods...</div></div>`;
  } else {
    renderWithdrawMethodsUI(withdrawMethodsCache);
  }
}

function renderWithdrawMethodsUI(methods){
  const wrap = document.getElementById('withdraw-methods');
  if (!methods || methods.length === 0){
    wrap.innerHTML = `<div class="empty-state"><div class="empty-icon">${ICONS.warning}</div><div class="empty-title">No withdraw methods yet</div><div class="empty-desc">Please check back later</div></div>`;
    selectedWithdrawMethod = null;
    document.getElementById('withdraw-submit-btn').disabled = true;
    return;
  }
  wrap.innerHTML = methods.map(m=> `<div class="withdraw-method${selectedWithdrawMethod && selectedWithdrawMethod.id===m.id?' selected':''}" data-id="${m.id}" onclick="selectWithdrawMethod('${m.id}')">${m.image?`<img class="method-logo" src="${m.image}" alt="">`:`<span>${ICONS.coin}</span>`} ${m.name}</div>`).join('');
  if (selectedWithdrawMethod){
    const stillValid = methods.find(m=>m.id===selectedWithdrawMethod.id);
    selectedWithdrawMethod = stillValid || null;
  }
  updateWithdrawMethodInfo();
  onWithdrawAmountChange();
}

function selectWithdrawMethod(id){
  const m = withdrawMethodsCache.find(x=>x.id===id);
  if (!m) return;
  selectedWithdrawMethod = m;
  document.querySelectorAll('#withdraw-methods .withdraw-method').forEach(el=> el.classList.toggle('selected', el.dataset.id===id));
  updateWithdrawMethodInfo();
  onWithdrawAmountChange();
}

function updateWithdrawMethodInfo(){
  const limitText = document.getElementById('withdraw-limit-text');
  const noteBox = document.getElementById('withdraw-method-note');
  if (!selectedWithdrawMethod){
    if (limitText) limitText.textContent = '';
    if (noteBox){ noteBox.style.display = 'none'; noteBox.textContent = ''; }
    return;
  }
  if (limitText) limitText.textContent = `Rate: 1 AENVA = ${coinFmt(methodRate(selectedWithdrawMethod))} ${esc(methodCurrency(selectedWithdrawMethod))} · Min ${fmt(selectedWithdrawMethod.min)} · Max ${fmt(selectedWithdrawMethod.max)}`;
  if (noteBox){
    if (selectedWithdrawMethod.note){
      noteBox.style.display = 'block';
      noteBox.textContent = selectedWithdrawMethod.note;
    } else {
      noteBox.style.display = 'none';
      noteBox.textContent = '';
    }
  }
}

function onWithdrawAmountChange(){
  const errEl = document.getElementById('withdraw-amount-error');
  const successEl = document.getElementById('withdraw-amount-success');
  const btn = document.getElementById('withdraw-submit-btn');
  const amt = parseFloat(document.getElementById('withdraw-amount').value);
  const addr = document.getElementById('withdraw-address').value.trim();
  errEl.classList.remove('show');
  successEl.classList.remove('show');
  renderWithdrawFeeBreakdown(amt);

  if (!selectedWithdrawMethod){ btn.disabled = true; return; }
  if (!(methodRate(selectedWithdrawMethod) > 0)){
    errEl.textContent = 'This withdrawal method has no valid AENVA conversion rate';
    errEl.classList.add('show'); btn.disabled = true; return;
  }
  if (!amt || amt <= 0){ btn.disabled = true; return; }
  if (amt < (selectedWithdrawMethod.min||0)){
    errEl.textContent = `Minimum withdraw is ${fmt(selectedWithdrawMethod.min)}`;
    errEl.classList.add('show'); btn.disabled = true; return;
  }
  if (selectedWithdrawMethod.max && amt > selectedWithdrawMethod.max){
    errEl.textContent = `Maximum withdraw is ${fmt(selectedWithdrawMethod.max)}`;
    errEl.classList.add('show'); btn.disabled = true; return;
  }
  if (amt > withdrawableBalance()){
    errEl.textContent = `Insufficient balance`;
    errEl.classList.add('show'); btn.disabled = true; return;
  }
  successEl.textContent = 'Amount verified against your balance';
  successEl.classList.add('show');
  renderWithdrawCouponResult(amt);
  if (!addr){ btn.disabled = true; return; }
  btn.disabled = false;
}

function renderWithdrawFeeBreakdown(amt){
  const box = document.getElementById('withdraw-fee-breakdown');
  if (!box) return;
  if (!amt || amt <= 0 || !selectedWithdrawMethod){ box.style.display = 'none'; return; }
  const feeAtr = Number(amt) * (WITHDRAW_FEE_PERCENT || 0) / 100;
  const netAtr = withdrawNetAtrva(amt);
  let bonusAtr = 0;
  if (appliedWithdrawCoupon){
    bonusAtr = Number((netAtr * appliedWithdrawCoupon.discount / 100).toFixed(2));
  }
  const finalAtr = Number((netAtr + bonusAtr).toFixed(2));
  const unit = methodCurrency(selectedWithdrawMethod);
  const payoutCoin = withdrawPayoutCoin(finalAtr, selectedWithdrawMethod);
  box.style.display = 'block';
  box.innerHTML = `Withdraw fee (${WITHDRAW_FEE_PERCENT}%): ${fmt(feeAtr)}<br>You will receive: <strong>${fmt(finalAtr)}</strong><br>Payout: <strong>${coinFmt(payoutCoin)} ${esc(unit)}</strong>`;
}



async function applyWithdrawCoupon(){
  const codeInput = document.getElementById('withdraw-coupon');
  const errEl = document.getElementById('withdraw-coupon-error');
  const code = codeInput.value.trim().toUpperCase();
  errEl.classList.remove('show');

  if (!code){
    errEl.textContent = 'Enter a coupon code';
    errEl.classList.add('show');
    return;
  }
  if (withdrawCouponChecking) return;
  withdrawCouponChecking = true;
  const btn = document.getElementById('withdraw-coupon-btn');
  btn.disabled = true;
  showLoading(true);
  try{
    const snap = await get(ref(db, 'coupons/' + code));
    if (!snap.exists()){
      appliedWithdrawCoupon = null;
      document.getElementById('withdraw-coupon-result').style.display = 'none';
      errEl.textContent = 'Invalid coupon code';
      errEl.classList.add('show');
      return;
    }
    const c = snap.val();
    if (c.type !== 'Withdraw'){
      appliedWithdrawCoupon = null;
      document.getElementById('withdraw-coupon-result').style.display = 'none';
      errEl.textContent = 'This coupon is not valid for withdrawals';
      errEl.classList.add('show');
      return;
    }
    if (c.used){
      appliedWithdrawCoupon = null;
      document.getElementById('withdraw-coupon-result').style.display = 'none';
      errEl.textContent = 'This coupon has already been used';
      errEl.classList.add('show');
      return;
    }
    appliedWithdrawCoupon = { code: c.code, discount: Number(c.discount) || 0 };
    haptic('light');
    showToast(`Coupon ${c.code} applied — ${appliedWithdrawCoupon.discount}% bonus`, ICONS.gift);
    const amt = parseFloat(document.getElementById('withdraw-amount').value);
    renderWithdrawCouponResult(amt);
  }catch(e){
    console.error(e);
    errEl.textContent = 'Failed to check coupon, try again';
    errEl.classList.add('show');
  }finally{
    withdrawCouponChecking = false;
    btn.disabled = false;
    showLoading(false);
  }
}

function removeWithdrawCoupon(){
  appliedWithdrawCoupon = null;
  document.getElementById('withdraw-coupon').value = '';
  document.getElementById('withdraw-coupon-result').style.display = 'none';
  document.getElementById('withdraw-coupon-error').classList.remove('show');
}

function renderWithdrawCouponResult(amt){
  const resultEl = document.getElementById('withdraw-coupon-result');
  if (!resultEl) return;
  if (!appliedWithdrawCoupon){ resultEl.style.display = 'none'; return; }
  if (!amt || amt <= 0){ resultEl.style.display = 'none'; return; }
  const netAtr = withdrawNetAtrva(amt);
  const bonusAmount = Number((netAtr * appliedWithdrawCoupon.discount / 100).toFixed(2));
  const totalAmount = Number((netAtr + bonusAmount).toFixed(2));
  resultEl.className = 'coupon-result bonus';
  resultEl.style.display = 'block';
  resultEl.innerHTML = `${appliedWithdrawCoupon.discount}% bonus applied (${appliedWithdrawCoupon.code})<br>You'll receive a total of <strong>${fmt(totalAmount)}</strong> (${fmt(netAtr)} after fee + ${fmt(bonusAmount)} bonus)<br><span class="coupon-result-remove" onclick="removeWithdrawCoupon()">Remove coupon</span>`;
}

// Final net AENVA the withdrawer receives (fee deducted, coupon bonus added). `amt` is the AENVA
// deducted from the user's balance.
function getWithdrawTotalAmount(amt){
  const netAtr = withdrawNetAtrva(amt);
  if (!appliedWithdrawCoupon) return Number(netAtr.toFixed(2));
  const bonusAmount = Number((netAtr * appliedWithdrawCoupon.discount / 100).toFixed(2));
  return Number((netAtr + bonusAmount).toFixed(2));
}




let EVENTS_CACHE = [];
let eventsLoaded = false;

async function fetchEvents(){
  const snap = await get(ref(db, 'events'));
  if (!snap.exists()) return [];
  const val = snap.val();
  return Object.keys(val)
    .map(id => ({ id, ...val[id] }))
    .filter(e => e.status !== false)
    .sort((a,b) => (b.createdAt||0) - (a.createdAt||0));
}

async function openEvents(){
  openOverlay('events');
  await renderEvents();
}

async function renderEvents(){
  const wrap = document.getElementById('events-list');
  if (!wrap) return;
  if (!eventsLoaded){
    EVENTS_CACHE = await fetchEvents();
    eventsLoaded = true;
  }
  if (EVENTS_CACHE.length === 0){
    wrap.innerHTML = `<div class="empty-state"><div class="empty-icon">${ICONS.inbox}</div><div class="empty-title">No events right now</div><div class="empty-desc">Check back later for new events</div></div>`;
    return;
  }
  wrap.innerHTML = EVENTS_CACHE.map(e => `
    <div class="event-card">
      <div class="event-card-img-wrap" onclick="openEventImageLightbox('${e.id}')">
        <img class="event-card-img" src="${e.image || ''}" alt="" loading="lazy" onerror="this.closest('.event-card-img-wrap').style.display='none';">
      </div>
      <div class="event-card-body">
        <div class="event-card-title">${e.title || ''}</div>
        <div class="event-card-desc" id="event-desc-${e.id}">${e.description || ''}</div>
        <button class="event-card-seemore-btn" id="event-seemore-${e.id}" onclick="toggleEventDesc('${e.id}')" style="display:none;">See more</button>
        ${e.link ? `<button class="event-card-visit-btn" onclick="visitEventLink('${e.id}')">${ICONS.rocket} Visit</button>` : ''}
      </div>
    </div>
  `).join('');

  EVENTS_CACHE.forEach(e => {
    const descEl = document.getElementById(`event-desc-${e.id}`);
    const btnEl = document.getElementById(`event-seemore-${e.id}`);
    if (!descEl || !btnEl) return;
    if (descEl.scrollHeight > descEl.clientHeight + 1){
      btnEl.style.display = 'inline-block';
    }
  });
}

function toggleEventDesc(id){
  const descEl = document.getElementById(`event-desc-${id}`);
  const btnEl = document.getElementById(`event-seemore-${id}`);
  if (!descEl || !btnEl) return;
  const expanded = descEl.classList.toggle('expanded');
  btnEl.textContent = expanded ? 'See less' : 'See more';
  haptic('light');
}
window.toggleEventDesc = toggleEventDesc;

function openEventImageLightbox(id){
  const e = EVENTS_CACHE.find(x => x.id === id);
  if (!e || !e.image) return;
  haptic('light');
  let overlay = document.getElementById('event-image-lightbox');
  if (!overlay){
    overlay = document.createElement('div');
    overlay.id = 'event-image-lightbox';
    overlay.className = 'event-image-lightbox';
    overlay.innerHTML = `
      <div class="event-image-lightbox-inner">
        <img id="event-image-lightbox-img" src="" alt="">
        <div class="event-image-lightbox-actions">
          <button class="event-image-lightbox-btn" id="event-image-lightbox-download" title="Download image">${ICONS.download || '⬇'}</button>
          <button class="event-image-lightbox-btn" onclick="closeEventImageLightbox()" title="Close">✕</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', (ev) => { if (ev.target === overlay) closeEventImageLightbox(); });
  }
  document.getElementById('event-image-lightbox-img').src = e.image;
  const dlBtn = document.getElementById('event-image-lightbox-download');
  dlBtn.onclick = (ev) => { ev.stopPropagation(); downloadEventImage(e.image, e.title || 'event'); };
  document.body.classList.add('event-image-lightbox-open');
}
window.openEventImageLightbox = openEventImageLightbox;

function closeEventImageLightbox(){
  document.body.classList.remove('event-image-lightbox-open');
}
window.closeEventImageLightbox = closeEventImageLightbox;

// ---- Model / QR image lightboxes ----
// These use the same lightbox behavior as the Event image system above.
// Separate IDs are intentionally used so they cannot conflict with the Event lightbox.
function openModelImageLightbox(id){
  const model = MINING_UNCLES.find(x => x.id === id);
  if (!model || !model.image) return;
  haptic('light');
  let overlay = document.getElementById('model-image-lightbox');
  if (!overlay){
    overlay = document.createElement('div');
    overlay.id = 'model-image-lightbox';
    overlay.className = 'event-image-lightbox';
    overlay.innerHTML = `
      <div class="event-image-lightbox-inner">
        <img id="model-image-lightbox-img" src="" alt="" referrerpolicy="no-referrer">
        <div class="event-image-lightbox-actions">
          <button class="event-image-lightbox-btn" onclick="closeModelImageLightbox()" title="Close">✕</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', (ev) => { if (ev.target === overlay) closeModelImageLightbox(); });
  }
  document.getElementById('model-image-lightbox-img').src = model.image;
  document.body.classList.add('model-image-lightbox-open');
}
window.openModelImageLightbox = openModelImageLightbox;

function closeModelImageLightbox(){
  document.body.classList.remove('model-image-lightbox-open');
}
window.closeModelImageLightbox = closeModelImageLightbox;

function openQrImageLightbox(){
  const img = document.getElementById('deposit-qr-image');
  if (!img || !img.src) return;
  haptic('light');
  let overlay = document.getElementById('qr-image-lightbox');
  if (!overlay){
    overlay = document.createElement('div');
    overlay.id = 'qr-image-lightbox';
    overlay.className = 'event-image-lightbox';
    overlay.innerHTML = `
      <div class="event-image-lightbox-inner">
        <img id="qr-image-lightbox-img" src="" alt="QR" referrerpolicy="no-referrer">
        <div class="event-image-lightbox-actions">
          <button class="event-image-lightbox-btn" onclick="closeQrImageLightbox()" title="Close">✕</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', (ev) => { if (ev.target === overlay) closeQrImageLightbox(); });
  }
  document.getElementById('qr-image-lightbox-img').src = img.src;
  document.body.classList.add('qr-image-lightbox-open');
}
window.openQrImageLightbox = openQrImageLightbox;

function closeQrImageLightbox(){
  document.body.classList.remove('qr-image-lightbox-open');
}
window.closeQrImageLightbox = closeQrImageLightbox;

async function downloadEventImage(url, name){
  haptic('light');
  try{
    const res = await fetch(url, { mode: 'cors' });
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = `${(name || 'event').replace(/[^a-z0-9\-_]+/gi, '_')}.jpg`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
  }catch(err){
    window.open(url, '_blank');
  }
}
window.downloadEventImage = downloadEventImage;

function visitEventLink(id){
  const e = EVENTS_CACHE.find(x => x.id === id);
  if (!e || !e.link) return;
  haptic('light');
  if (tg && tg.openLink){
    tg.openLink(e.link);
  } else {
    window.open(e.link, '_blank');
  }
}


onValue(ref(db, 'events'), snap => {
  const val = snap.exists() ? snap.val() : {};
  EVENTS_CACHE = Object.keys(val)
    .map(id => ({ id, ...val[id] }))
    .filter(e => e.status !== false)
    .sort((a,b) => (b.createdAt||0) - (a.createdAt||0));
  eventsLoaded = true;
  if (document.getElementById('screen-events') && document.getElementById('screen-events').classList.contains('active')){
    renderEvents();
  }
});


let appliedGiftCode = null;
let giftCodeChecking = false;
let giftClaiming = false;


let exchangeSubmitting = false;

// Exchange rate is now a single fixed global rate for everyone — see ECONOMY.exchangeRate
// (admin-editable in realtime via settings/economy).

function openExchange(){
  renderExchangeScreen();
  openOverlay('exchange');
}

function renderExchangeScreen(){
  const rate = ECONOMY.exchangeRate;
  const locked = rate <= 0;

  document.getElementById('exchange-rate-value').textContent = Math.round(rate * 100) + '%';
  document.getElementById('exchange-rate-plan').textContent = 'Fixed Rate';
  document.getElementById('exchange-available-deposit').textContent = fmt(state.depositBalance || 0);

  document.getElementById('exchange-locked-note').style.display = locked ? 'block' : 'none';
  document.getElementById('exchange-form-card').style.display = locked ? 'none' : 'block';

  const fromInput = document.getElementById('exchange-from-amount');
  fromInput.value = '';
  document.getElementById('exchange-to-amount').value = fmt(0);
  document.getElementById('exchange-amount-error').classList.remove('show');
  document.getElementById('exchange-submit-btn').disabled = true;
}

function onExchangeAmountChange(){
  const rate = ECONOMY.exchangeRate;
  const errEl = document.getElementById('exchange-amount-error');
  const submitBtn = document.getElementById('exchange-submit-btn');
  const toInput = document.getElementById('exchange-to-amount');
  errEl.classList.remove('show');

  const amt = parseFloat(document.getElementById('exchange-from-amount').value);
  const available = Number(state.depositBalance || 0);

  if (isNaN(amt) || amt <= 0){
    toInput.value = fmt(0);
    submitBtn.disabled = true;
    return;
  }
  if (rate <= 0){
    toInput.value = fmt(0);
    submitBtn.disabled = true;
    errEl.textContent = 'Exchange is currently unavailable';
    errEl.classList.add('show');
    return;
  }
  if (amt > available){
    toInput.value = fmt(0);
    submitBtn.disabled = true;
    errEl.textContent = 'Amount exceeds your available deposit balance';
    errEl.classList.add('show');
    return;
  }

  const receiveAmt = Number((amt * rate).toFixed(2));
  toInput.value = fmt(receiveAmt);
  submitBtn.disabled = false;
}

async function submitExchange(){
  if (exchangeSubmitting) return;
  if (isGuest){
    showToast('Open this app from Telegram to exchange balance', ICONS.warning);
    return;
  }

  const rate = ECONOMY.exchangeRate;
  if (rate <= 0){
    showToast('Exchange is currently unavailable', ICONS.warning);
    return;
  }

  const amt = parseFloat(document.getElementById('exchange-from-amount').value);
  const available = Number(state.depositBalance || 0);
  if (isNaN(amt) || amt <= 0){
    showToast('Enter a valid amount', ICONS.warning);
    return;
  }
  if (amt > available){
    showToast('Amount exceeds your available deposit balance', ICONS.warning);
    return;
  }

  exchangeSubmitting = true;
  const submitBtn = document.getElementById('exchange-submit-btn');
  submitBtn.disabled = true;
  try{
    const adOk = await requireAdBeforeAction('exchange-submit-btn');
    if (!adOk){ submitBtn.disabled = false; exchangeSubmitting = false; return; }
  }catch(e){ submitBtn.disabled = false; exchangeSubmitting = false; return; }
  showLoading(true);
  try{
    const receiveAmt = Number((amt * rate).toFixed(2));


    state.depositBalance = Number((Number(state.depositBalance||0) - amt).toFixed(2));
    state.EarningBalance = Number((Number(state.EarningBalance||0) + receiveAmt).toFixed(2));
    recomputeTotalBalance();
    sessionEarnedToday += receiveAmt;
    state.totalClaim = (state.totalClaim||0) + 1;
    addTransaction('earn', `Exchange: ${fmt(amt)} Deposit → ${fmt(receiveAmt)} Earning (${Math.round(rate*100)}%)`, receiveAmt);

    await saveState();

    showLoading(false);
    haptic('medium');
    showToast(`Exchanged! +${fmt(receiveAmt)} added to Earning Balance`, ICONS.success);
    renderExchangeScreen();
    renderHome();
  }catch(e){
    console.error(e);
    showLoading(false);
    showToast('Exchange failed, try again', ICONS.warning);
    submitBtn.disabled = false;
  }finally{
    exchangeSubmitting = false;
  }
}


// ======================================================================
// ---- (Credit → Deposit exchange removed: Credit system deprecated) ----
// ======================================================================
/* REMOVED_CREDIT_EXCHANGE_START
function listenCreditExchangeSettings(){
  onValue(ref(db, 'settings/creditExchange'), snap => {
    const v = snap.exists() ? snap.val() : null;
    CREDIT_EXCHANGE_RATE = (v && v.rate != null && !isNaN(Number(v.rate))) ? Number(v.rate) : 0;
    if (document.getElementById('screen-exchange') && document.getElementById('screen-exchange').classList.contains('active')){
      renderCreditExchangeScreen();
    }
  });
}

function renderCreditExchangeScreen(){
  if (!state) return;
  const rate = CREDIT_EXCHANGE_RATE;
  const locked = rate <= 0;

  document.getElementById('credit-exchange-rate-value').textContent = Math.round(rate * 100) + '%';
  document.getElementById('credit-exchange-rate-desc').textContent = fmt(rate);
  document.getElementById('credit-exchange-available').textContent = fmtCredit(state.credit || 0);

  document.getElementById('credit-exchange-locked-note').style.display = locked ? 'block' : 'none';
  document.getElementById('credit-exchange-form-card').style.display = locked ? 'none' : 'block';

  const fromInput = document.getElementById('credit-exchange-from-amount');
  if (fromInput) fromInput.value = '';
  document.getElementById('credit-exchange-to-amount').value = fmt(0);
  document.getElementById('credit-exchange-amount-error').classList.remove('show');
  document.getElementById('credit-exchange-submit-btn').disabled = true;
}

function onCreditExchangeAmountChange(){
  const rate = CREDIT_EXCHANGE_RATE;
  const errEl = document.getElementById('credit-exchange-amount-error');
  const submitBtn = document.getElementById('credit-exchange-submit-btn');
  const toInput = document.getElementById('credit-exchange-to-amount');
  errEl.classList.remove('show');

  const amt = parseFloat(document.getElementById('credit-exchange-from-amount').value);
  const available = Number(state.credit || 0);

  if (isNaN(amt) || amt <= 0){
    toInput.value = fmt(0);
    submitBtn.disabled = true;
    return;
  }
  if (rate <= 0){
    toInput.value = fmt(0);
    submitBtn.disabled = true;
    errEl.textContent = 'Credit exchange is currently disabled';
    errEl.classList.add('show');
    return;
  }
  if (amt > available){
    toInput.value = fmt(0);
    submitBtn.disabled = true;
    errEl.textContent = 'Amount exceeds your available credit';
    errEl.classList.add('show');
    return;
  }

  const receiveAmt = Number((amt * rate).toFixed(2));
  toInput.value = fmt(receiveAmt);
  submitBtn.disabled = false;
}

async function submitCreditExchange(){
  if (creditExchangeSubmitting) return;
  if (isGuest){
    showToast('Open this app from Telegram to exchange credit', ICONS.warning);
    return;
  }

  const rate = CREDIT_EXCHANGE_RATE;
  if (rate <= 0){
    showToast('Credit exchange is currently disabled', ICONS.warning);
    return;
  }

  const amt = parseFloat(document.getElementById('credit-exchange-from-amount').value);
  const available = Number(state.credit || 0);
  if (isNaN(amt) || amt <= 0){
    showToast('Enter a valid amount', ICONS.warning);
    return;
  }
  if (amt > available){
    showToast('Amount exceeds your available credit', ICONS.warning);
    return;
  }

  creditExchangeSubmitting = true;
  const submitBtn = document.getElementById('credit-exchange-submit-btn');
  submitBtn.disabled = true;
  try{
    const adOk = await requireAdBeforeAction('credit-exchange-submit-btn');
    if (!adOk){ submitBtn.disabled = false; creditExchangeSubmitting = false; return; }
  }catch(e){ submitBtn.disabled = false; creditExchangeSubmitting = false; return; }
  showLoading(true);
  try{
    const receiveAmt = Number((amt * rate).toFixed(2));

    state.credit = Number((Number(state.credit||0) - amt).toFixed(2));
    state.depositBalance = Number((Number(state.depositBalance||0) + receiveAmt).toFixed(2));
    recomputeTotalBalance();
    addTransaction('earn', `Exchange: ${fmtCredit(amt)} → ${fmt(receiveAmt)} Deposit (${Math.round(rate*100)}%)`, receiveAmt);

    await saveState();

    showLoading(false);
    haptic('medium');
    showToast(`Exchanged! +${fmt(receiveAmt)} added to Deposit Balance`, ICONS.success);
    renderCreditExchangeScreen();
    renderHome();
  }catch(e){
    console.error(e);
    showLoading(false);
    showToast('Exchange failed, try again', ICONS.warning);
    submitBtn.disabled = false;
  }finally{
    creditExchangeSubmitting = false;
  }
}
REMOVED_CREDIT_EXCHANGE_END */

function giftCodeMonthKey(){
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
}
function giftCodeMonthlyLimitForPlan(planId){
  return Infinity; // plan system removed — no monthly gift-code limit for anyone
}

async function claimGiftCodeMonthlySlot(){
  const limit = giftCodeMonthlyLimitForPlan(state.plan);
  const counterRef = ref(db, `gift_limits/${state.uid}/${giftCodeMonthKey()}`);
  const txResult = await runTransaction(counterRef, (current) => {
    const count = Number(current || 0);
    if (count >= limit) return undefined;
    return count + 1;
  });
  return txResult.committed;
}

function openGift(){
  resetGiftForm();
  openOverlay('gift');
}

function resetGiftForm(){
  appliedGiftCode = null;
  giftCodeChecking = false;
  giftClaiming = false;
  const codeInput = document.getElementById('gift-code');
  if (codeInput) codeInput.value = '';
  const errEl = document.getElementById('gift-code-error');
  if (errEl) errEl.classList.remove('show');
  const resultEl = document.getElementById('gift-code-result');
  if (resultEl) resultEl.style.display = 'none';
  const claimBtn = document.getElementById('gift-claim-btn');
  if (claimBtn) claimBtn.disabled = true;
}

function onGiftCodeChange(){


  if (appliedGiftCode){
    appliedGiftCode = null;
    document.getElementById('gift-code-result').style.display = 'none';
    document.getElementById('gift-claim-btn').disabled = true;
  }
  document.getElementById('gift-code-error').classList.remove('show');
}

async function applyGiftCode(){
  const codeInput = document.getElementById('gift-code');
  const errEl = document.getElementById('gift-code-error');
  const resultEl = document.getElementById('gift-code-result');
  const claimBtn = document.getElementById('gift-claim-btn');
  const code = codeInput.value.trim().toUpperCase();
  errEl.classList.remove('show');
  resultEl.style.display = 'none';
  claimBtn.disabled = true;
  appliedGiftCode = null;

  if (!code){
    errEl.textContent = 'Enter a gift code';
    errEl.classList.add('show');
    return;
  }
  const monthlyLimit = giftCodeMonthlyLimitForPlan(state.plan);
  if (monthlyLimit <= 0){
    errEl.textContent = 'Your current plan does not include gift code redemptions';
    errEl.classList.add('show');
    return;
  }
  if (giftCodeChecking) return;
  giftCodeChecking = true;
  const btn = document.getElementById('gift-apply-btn');
  btn.disabled = true;
  showLoading(true);
  try{
    const snap = await get(ref(db, 'coupons/' + code));
    if (!snap.exists()){
      errEl.textContent = 'Invalid gift code';
      errEl.classList.add('show');
      return;
    }
    const c = snap.val();
    if (c.type !== 'Gift'){
      errEl.textContent = 'This code is not a gift code';
      errEl.classList.add('show');
      return;
    }
    if (c.used){
      errEl.textContent = 'This gift code has already been used';
      errEl.classList.add('show');
      return;
    }
    const reward = Number(c.discount) || 0;
    if (reward <= 0){
      errEl.textContent = 'This gift code has no reward value';
      errEl.classList.add('show');
      return;
    }
    appliedGiftCode = { code: c.code, reward };
    haptic('light');
    resultEl.className = 'coupon-result bonus';
    resultEl.style.display = 'block';
    resultEl.innerHTML = `Gift code <strong>${appliedGiftCode.code}</strong> is valid!<br>You'll receive <strong>${fmt(reward)}</strong> when you claim it.`;
    claimBtn.disabled = false;
    showToast(`Code valid — you'll get ${fmt(reward)}`, ICONS.gift);
  }catch(e){
    console.error(e);
    errEl.textContent = 'Failed to check gift code, try again';
    errEl.classList.add('show');
  }finally{
    giftCodeChecking = false;
    btn.disabled = false;
    showLoading(false);
  }
}

async function claimGiftCode(){
  if (!appliedGiftCode || giftClaiming) return;
  if (isGuest){
    showToast('Open this app from Telegram to claim gifts', ICONS.warning);
    return;
  }
  giftClaiming = true;
  const claimBtn = document.getElementById('gift-claim-btn');
  claimBtn.disabled = true;
  try{
    const adOk = await requireAdBeforeAction('gift-claim-btn');
    if (!adOk){ claimBtn.disabled = false; giftClaiming = false; return; }
  }catch(e){ claimBtn.disabled = false; giftClaiming = false; return; }
  showLoading(true);
  try{


    const snap = await get(ref(db, 'coupons/' + appliedGiftCode.code));
    if (!snap.exists() || snap.val().used || snap.val().type !== 'Gift'){
      showLoading(false);
      showToast('This gift code was just used or is no longer valid', ICONS.warning);
      resetGiftForm();
      return;
    }
    const reward = Number(snap.val().discount) || 0;

    const slotOk = await claimGiftCodeMonthlySlot();
    if (!slotOk){
      showLoading(false);
      showToast('You have reached your plan\'s monthly gift code limit', ICONS.warning);
      resetGiftForm();
      return;
    }

    state.EarningBalance = (state.EarningBalance||0) + reward;
    recomputeTotalBalance();
    sessionEarnedToday += reward;
    state.totalClaim = (state.totalClaim||0) + 1;
    addTransaction('earn', 'Gift Code: ' + appliedGiftCode.code, reward);

    await saveState();
    await markCouponUsed(appliedGiftCode.code, state.uid);

    showLoading(false);
    haptic('medium');
    showToast(`+${fmt(reward)} claimed!`, ICONS.success);
    resetGiftForm();
    renderHome();
  }catch(e){
    console.error(e);
    showLoading(false);
    showToast('Failed to claim gift, try again', ICONS.warning);
    claimBtn.disabled = false;
  }finally{
    giftClaiming = false;
  }
}


function dailyLimitForPlan(planId, feature){
  // Plan system removed — the only feature with an admin-configured daily cap left is
  // Watch Ad (settings/watchAd, global, not plan-tied). Everything else is unlimited.
  return Infinity;
}


// Daily limits reset at midnight (12:00 AM)
// local time — this is the single source of truth for that boundary.
function dailyLimitDateKey(){
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth()+1).padStart(2,'0');
  const d = String(now.getDate()).padStart(2,'0');
  return `${y}-${m}-${d}`;
}

function msUntilNextDailyReset(){
  const now = new Date();
  const reset = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
  return reset.getTime() - now.getTime();
}

function formatCountdown(ms){
  if (ms < 0) ms = 0;
  const totalSec = Math.floor(ms/1000);
  const h = String(Math.floor(totalSec/3600)).padStart(2,'0');
  const m = String(Math.floor((totalSec%3600)/60)).padStart(2,'0');
  const s = String(totalSec%60).padStart(2,'0');
  return `${h}:${m}:${s}`;
}


let dailyLimitCounts = { task: 0, gmail: 0, facebook: 0 };
let dailyLimitListenersStarted = { task: false, gmail: false, facebook: false };
let dailyLimitRenderCallbacks = { task: null, gmail: null, facebook: null };

function ensureDailyLimitListener(feature, onChange){
  if (onChange) dailyLimitRenderCallbacks[feature] = onChange;
  if (dailyLimitListenersStarted[feature] || isGuest || !state.uid) return;
  dailyLimitListenersStarted[feature] = true;
  const dateKey = dailyLimitDateKey();
  onValue(ref(db, `daily_limits/${state.uid}/${feature}/${dateKey}`), snap => {
    dailyLimitCounts[feature] = Number(snap.exists() ? snap.val() : 0);
    if (dailyLimitRenderCallbacks[feature]) dailyLimitRenderCallbacks[feature]();
  });
}

function isDailyLimitHit(feature){
  const limit = dailyLimitForPlan(state ? state.plan : 'free', feature);
  return dailyLimitCounts[feature] >= limit;
}


async function claimDailyLimitSlot(feature){
  const limit = dailyLimitForPlan(state.plan, feature);
  const dateKey = dailyLimitDateKey();
  const counterRef = ref(db, `daily_limits/${state.uid}/${feature}/${dateKey}`);
  const txResult = await runTransaction(counterRef, (current) => {
    const count = Number(current || 0);
    if (count >= limit) return undefined;
    return count + 1;
  });
  if (txResult.committed){
    dailyLimitCounts[feature] = Number(txResult.snapshot.val() || 0);
  }
  return txResult.committed;
}


function renderDailyLimitCard(feature){
  const countEl = document.getElementById(feature+'-limit-count');
  const barEl = document.getElementById(feature+'-limit-bar');
  const resetEl = document.getElementById(feature+'-limit-reset');
  if (!countEl) return;
  const limit = dailyLimitForPlan(state.plan, feature);
  const used = dailyLimitCounts[feature];
  if (!isFinite(limit)){
    // No plan system -> no daily limit for this feature.
    countEl.textContent = `${used} · No daily limit`;
    if (barEl){ barEl.style.width = '100%'; barEl.classList.remove('limit-full'); }
    if (resetEl) resetEl.textContent = '';
    return;
  }
  const pct = limit > 0 ? Math.min(100, Math.round((used/limit)*100)) : 0;
  countEl.textContent = `${used}/${limit}`;
  if (barEl){
    barEl.style.width = pct + '%';
    barEl.classList.toggle('limit-full', used >= limit);
  }
  if (resetEl){
    // Always a live, real-time ticking countdown to the next midnight reset — never a
    // static "Resets at ..." string. startDailyLimitTicker() re-runs this every second for
    // every feature (not just once the limit is hit), and msUntilNextDailyReset() is computed
    // fresh from the real clock each call, so this stays accurate even if the app was closed
    // and reopened — it's never a stored/frozen countdown.
    const left = msUntilNextDailyReset();
    resetEl.textContent = (used >= limit ? 'Limit reached — resets in ' : 'Resets in ') + formatCountdown(left);
  }
}


let dailyLimitTickerInterval = null;
function startDailyLimitTicker(){
  if (dailyLimitTickerInterval) return;
  dailyLimitTickerInterval = setInterval(() => {
    // Tick every feature's reset countdown every second — not just once its limit is hit —
    // so the "Resets in HH:MM:SS" text is always live, whether or not the card is currently
    // visible in the limit-reached state.
    ['task','gmail','facebook'].forEach(f => {
      renderDailyLimitCard(f);
    });
  }, 1000);
}
startDailyLimitTicker();


let TASKS_BY_CATEGORY = {};
let currentTaskCategory = 'task';
let taskProofCtx = null;
let proofPickedDataUrl = null;
let taskClaimBusy = {};


let taskCompletionListeners = {};
function startTaskCompletionListener(taskId){
  if (isGuest) return;
  if (!state || !state.uid) return;
  if (taskCompletionListeners[taskId]) return;
  taskCompletionListeners[taskId] = true;
  onValue(ref(db, `task_completions/${taskId}/${state.uid}`), snap => {
    if (!state.taskCompletionCount) state.taskCompletionCount = {};
    state.taskCompletionCount[taskId] = Number(snap.exists() ? snap.val() : 0);


    if (document.getElementById('screen-task') && document.getElementById('screen-task').classList.contains('active')){
      renderTaskItems('task');
    }
  });
}


function isTaskLimitHit(t){
  if (!t) return true;
  const myCount = (state.taskCompletionCount && state.taskCompletionCount[t.id]) || 0;
  return myCount >= Number(t.perUserLimit || 1);
}

// ===== "Refer" category tasks =====
// Progress is derived from the user's own real referrals array (state.referrals,
// each entry has a joinedAt timestamp), never a separate counter — so it's always
// in sync in real time as new people join via the user's link.
// A per-task, per-user "cursor" timestamp (task_refer_cursor/{taskId}/{uid}) marks
// where counting starts: it defaults to the task's createdAt (so referrals the user
// already had before the task existed don't count), and is pushed forward to "now"
// every time the user successfully claims — so a repeatable Refer task always asks
// for a fresh batch of NEW referrals, never reuses old ones.
let taskReferCursors = {};
let taskReferCursorListeners = {};
function startTaskReferCursorListener(taskId){
  if (isGuest) return;
  if (!state || !state.uid) return;
  if (taskReferCursorListeners[taskId]) return;
  taskReferCursorListeners[taskId] = true;
  onValue(ref(db, `task_refer_cursor/${taskId}/${state.uid}`), snap => {
    taskReferCursors[taskId] = snap.exists() ? Number(snap.val()) : null;
    if (document.getElementById('screen-task') && document.getElementById('screen-task').classList.contains('active')){
      renderTaskItems('task');
    }
  });
}

function getReferTaskProgress(t){
  const required = Math.max(1, Number(t.requiredReferrals || 0));
  const cursor = (taskReferCursors[t.id] != null) ? taskReferCursors[t.id] : Number(t.createdAt || 0);
  const count = (state.referrals || []).filter(r => Number(r.joinedAt || 0) >= cursor).length;
  return { count: Math.min(count, required), required, metRequirement: count >= required };
}

const TASK_SCREEN_MAP = {
  task:  { list:'task',  items:'task-items'  },
};

let taskListenersStarted = false;
function startTaskListeners(){
  if (taskListenersStarted) return;
  taskListenersStarted = true;


  onValue(ref(db, 'tasks'), snap => {
    const val = snap.exists() ? snap.val() : {};
    TASKS_BY_CATEGORY = { task: [] };
    for (const id in val){
      const t = { id, ...val[id] };
      if (t.status === false) continue;
      TASKS_BY_CATEGORY.task.push(t);


      startTaskCompletionListener(t.id);
      if (t.category === 'refer') startTaskReferCursorListener(t.id);
    }
    if (document.getElementById('screen-task') && document.getElementById('screen-task').classList.contains('active')){
      renderTaskItems('task');
    }
  });
}

async function openTaskCenter(category){
  currentTaskCategory = 'task';
  startTaskListeners();
  ensureDailyLimitListener('task', () => { renderDailyLimitCard('task'); renderTaskItems('task'); });
  renderTaskItems('task');
  renderDailyLimitCard('task');
  openOverlay('task');
}

function findTask(id){
  for (const cat in TASKS_BY_CATEGORY){
    const found = (TASKS_BY_CATEGORY[cat]||[]).find(t=>t.id===id);
    if (found) return found;
  }
  return null;
}

function renderTaskItems(category){
  const map = TASK_SCREEN_MAP[category] || TASK_SCREEN_MAP.task;
  const wrap = document.getElementById(map.items);
  if (!wrap) return;
  const items = (TASKS_BY_CATEGORY[category] || []).filter(t => {
    if (Number(t.completedCount||0) >= Number(t.totalQty||0)) return false;
    const myCount = (state.taskCompletionCount && state.taskCompletionCount[t.id]) || 0;
    if (myCount >= Number(t.perUserLimit||1)) return false;
    return true;
  });

  if (items.length === 0){
    wrap.innerHTML = `<div class="task-empty-row"><div class="empty-state"><div class="empty-icon">${ICONS.inbox}</div><div class="empty-title">No tasks available</div><div class="empty-desc">Check back later for new tasks</div></div></div>`;
    return;
  }

  wrap.innerHTML = items.map(t => {
    const dailyHit = isDailyLimitHit('task');
    const catLabel = (t.category||'').charAt(0).toUpperCase() + (t.category||'').slice(1);
    const remaining = Math.max(0, Number(t.totalQty||0) - Number(t.completedCount||0));
    const usedQty = Number(t.totalQty||0) - remaining;

    let actionsHtml;
    let referProgressHtml = '';
    const flow = taskFlowState[t.id];
    if (t.category === 'refer'){
      const progress = getReferTaskProgress(t);
      referProgressHtml = `<div class="task-card-qty">Referrals: ${progress.count}/${progress.required}</div>`;
      if (progress.metRequirement){
        if (dailyHit){
          actionsHtml = `<button class="task-card-btn task-card-limit-full" disabled>Daily Limit</button>`;
        } else if (flow && flow.stage === 'claiming'){
          actionsHtml = `<button class="task-card-btn" data-task-id="${escapeHtml(t.id)}" disabled>Claiming...</button>`;
        } else {
          actionsHtml = `<button class="task-card-btn claim-ready" data-task-id="${escapeHtml(t.id)}" onclick="claimReferTask('${category}','${t.id}')">Claim</button>`;
        }
      } else {
        actionsHtml = `<button class="task-card-btn" data-task-id="${escapeHtml(t.id)}" onclick="inviteForReferTask('${t.id}')">Invite</button>`;
      }
    } else if (dailyHit){
      actionsHtml = `<button class="task-card-btn task-card-limit-full" disabled>Daily Limit</button>`;
    } else if (t.proofRequired){

      if (flow && flow.stage === 'proofReady'){
        actionsHtml = `<button class="task-card-btn submit-proof" data-task-id="${escapeHtml(t.id)}" onclick="openProofModal('${category}','${t.id}')">Submit Proof</button>`;
      } else if (flow && flow.stage === 'proofWaiting'){
        actionsHtml = `<button class="task-card-btn" data-task-id="${escapeHtml(t.id)}" disabled>Go</button>`;
      } else {
        actionsHtml = `<button class="task-card-btn" data-task-id="${escapeHtml(t.id)}" onclick="startProofTask('${category}','${t.id}')">Go</button>`;
      }
    } else if (t.category === 'join' && t.verifyMode === 'auto'){

      if (flow && flow.stage === 'ready'){
        actionsHtml = `<button class="task-card-btn claim-ready" data-task-id="${escapeHtml(t.id)}" onclick="claimTaskReward('${category}','${t.id}')">Claim</button>`;
      } else if (flow && flow.stage === 'verifying'){
        actionsHtml = `<button class="task-card-btn" data-task-id="${escapeHtml(t.id)}" disabled>Verifying.....</button>`;
      } else if (flow && flow.stage === 'waiting'){
        actionsHtml = `<button class="task-card-btn" data-task-id="${escapeHtml(t.id)}" disabled>Go</button>`;
      } else if (flow && flow.stage === 'notjoined'){
        actionsHtml = `<button class="task-card-btn task-card-notjoined" data-task-id="${escapeHtml(t.id)}" onclick="retryJoinVerify('${category}','${t.id}')">Not Joined — Tap to Verify</button>`;
      } else if (flow && flow.stage === 'checkfailed'){
        actionsHtml = `<button class="task-card-btn task-card-notjoined" data-task-id="${escapeHtml(t.id)}" onclick="retryJoinVerify('${category}','${t.id}')">Couldn't Verify — Retry</button>`;
      } else {
        actionsHtml = `<button class="task-card-btn" data-task-id="${escapeHtml(t.id)}" onclick="startJoinVerifyTask('${category}','${t.id}')">Go</button>`;
      }
    } else {

      if (flow && flow.stage === 'ready'){
        actionsHtml = `<button class="task-card-btn claim-ready" data-task-id="${escapeHtml(t.id)}" onclick="claimTaskReward('${category}','${t.id}')">Claim</button>`;
      } else if (flow && flow.stage === 'verifying'){
        actionsHtml = `<button class="task-card-btn" data-task-id="${escapeHtml(t.id)}" disabled>Verifying.....</button>`;
      } else if (flow && flow.stage === 'waiting'){
        actionsHtml = `<button class="task-card-btn" data-task-id="${escapeHtml(t.id)}" disabled>Go</button>`;
      } else {
        actionsHtml = `<button class="task-card-btn" data-task-id="${escapeHtml(t.id)}" onclick="startTask('${category}','${t.id}')">Go</button>`;
      }
    }

    return `<div class="task-card">
      <div class="task-card-left">
        <div class="task-card-img-wrap">
          <img class="task-card-img" src="${escapeHtml(t.image||'')}" alt="" loading="lazy" onerror="this.closest('.task-card-img-wrap').style.visibility='hidden';">
        </div>
        <div class="task-card-reward">+${fmt(t.reward||0)}</div>
      </div>
      <div class="task-card-body">
        <div class="task-card-name">${escapeHtml(t.name||'')}</div>
        ${t.category ? `<span class="task-cat-pill">${escapeHtml(catLabel)}</span>` : ''}
        ${t.proofRequired ? `<div class="task-card-details proof-glow">(need proof)</div>` : ''}
        ${t.category === 'refer' ? referProgressHtml : `<div class="task-card-qty">Qty: ${usedQty}/${Number(t.totalQty||0)} used · Limit: ${Number(t.perUserLimit||1)}/user</div>`}
      </div>
      <div class="task-card-actions">
        ${actionsHtml}
      </div>
    </div>`;
  }).join('');
}


function startTaskLinkOnly(link){
  if (!link) return;
  if (tg && tg.openLink) tg.openLink(link);
  else window.open(link, '_blank');
}


const TASK_LINK_VERIFY_MS = 10000;
let taskLinkTimers = {};

// Tracks the button flow per task id so re-renders (triggered by daily-limit /
// completion listeners) don't reset an in-progress Go -> Verifying -> Claim
// or Go -> Submit Proof sequence.
// stage: 'waiting' | 'verifying' | 'ready'      (non-proof tasks)
// stage: 'proofWaiting' | 'proofReady'          (proof-required tasks)
let taskFlowState = {};
let taskProofTimers = {};
// Watches a single task_submissions/{id} node so a "Pending" transaction row
// can flip to "Approved" / "Rejected" once the admin reviews it. Reward
// crediting itself is done server-side by the admin panel (it writes
// EarningBalance/totalBalance directly), so this only reconciles the
// transaction's displayed status.
let proofSubmissionListeners = {};
function watchProofSubmission(subId){
  if (!subId || proofSubmissionListeners[subId]) return;
  proofSubmissionListeners[subId] = true;
  onValue(ref(db, `task_submissions/${subId}`), snap => {
    if (!snap.exists()) return;
    const val = snap.val() || {};
    const statusRaw = String(val.status || 'pending').toLowerCase();
    if (statusRaw === 'pending') return;

    const tx = (state.transactions || []).find(x => x.requestId === subId && x.proofSubmission);
    if (!tx || tx.status !== 'Pending') return;

    if (statusRaw === 'approved'){
      tx.status = 'Approved';
      showToast(`Proof approved — +${fmt(tx.amount||0)} credited!`, ICONS.success);
    } else if (statusRaw === 'rejected'){
      tx.status = 'Rejected';
      showToast(`Proof for "${tx.title||'task'}" was rejected${val.reason ? ': ' + val.reason : ''}`, ICONS.warning);
    } else {
      return;
    }

    saveState();
    const activeTab = document.querySelector('.trans-tab.active');
    if (activeTab && document.getElementById('screen-transaction') && document.getElementById('screen-transaction').classList.contains('active')){
      renderTransactions(activeTab.dataset.tab);
    }
  });
}

// Re-attach review listeners for any proof submissions still awaiting a
// decision — needed after a fresh page load / app restart so status updates
// keep flowing in even if the wait happened in a previous session.
function attachPendingProofListeners(){
  (state.transactions || []).forEach(tx => {
    if (tx.proofSubmission && tx.status === 'Pending' && tx.requestId){
      watchProofSubmission(tx.requestId);
    }
  });
}
const TASK_VERIFY_STAGE_MS = 5000;   // Go click -> "Verifying....." appears
const TASK_CLAIM_STAGE_MS  = 10000;  // "Verifying....." -> "Claim" appears
const TASK_PROOF_STAGE_MS  = 10000;  // Go click -> "Submit Proof" appears

function updateTaskButton(id, html){
  const btn = document.querySelector(`.task-card-btn[data-task-id="${id}"]`);
  if (!btn) return;
  btn.outerHTML = html;
}

function startTask(category, id){
  const t = findTask(id);
  if (!t) return;


  if (isTaskLimitHit(t)){
    showToast('You have already reached the limit for this task', ICONS.warning);
    renderTaskItems(category);
    return;
  }
  if (isDailyLimitHit('task')){
    showToast(`Daily task limit reached (${dailyLimitCounts.task}/${dailyLimitForPlan(state.plan, 'task')}). Resets at 12:00 AM.`, ICONS.warning);
    return;
  }
  if (taskClaimBusy[id] || taskLinkTimers[id]) return;

  if (t.actionLink){
    if (tg && tg.openLink) tg.openLink(t.actionLink);
    else window.open(t.actionLink, '_blank');
  }

  taskFlowState[id] = { stage: 'waiting' };
  const btn = document.querySelector(`.task-card-btn[data-task-id="${id}"]`);
  if (btn){ btn.disabled = true; }

  taskLinkTimers[id] = setTimeout(() => {
    taskFlowState[id] = { stage: 'verifying' };
    updateTaskButton(id, `<button class="task-card-btn" data-task-id="${id}" disabled>Verifying.....</button>`);

    taskLinkTimers[id] = setTimeout(() => {
      delete taskLinkTimers[id];
      taskFlowState[id] = { stage: 'ready' };
      updateTaskButton(id, `<button class="task-card-btn claim-ready" data-task-id="${id}" onclick="claimTaskReward('${category}','${id}')">Claim</button>`);
    }, TASK_CLAIM_STAGE_MS);
  }, TASK_VERIFY_STAGE_MS);
}


// "Join" task with verifyMode:'auto' — after the user opens the channel link, this
// actually asks the Telegram Bot API whether state.uid is a member of t.telegramChatId
// (the bot must be an admin there). Only a real, confirmed membership unlocks Claim;
// otherwise no reward, no limit/quota is consumed, and the user can tap to re-check.
function startJoinVerifyTask(category, id){
  const t = findTask(id);
  if (!t) return;

  if (isTaskLimitHit(t)){
    showToast('You have already reached the limit for this task', ICONS.warning);
    renderTaskItems(category);
    return;
  }
  if (isDailyLimitHit('task')){
    showToast(`Daily task limit reached (${dailyLimitCounts.task}/${dailyLimitForPlan(state.plan, 'task')}). Resets at 12:00 AM.`, ICONS.warning);
    return;
  }
  if (taskClaimBusy[id] || taskLinkTimers[id]) return;

  if (t.actionLink){
    if (tg && tg.openLink) tg.openLink(t.actionLink);
    else window.open(t.actionLink, '_blank');
  }

  taskFlowState[id] = { stage: 'waiting' };
  const btn = document.querySelector(`.task-card-btn[data-task-id="${id}"]`);
  if (btn){ btn.disabled = true; }

  taskLinkTimers[id] = setTimeout(() => {
    delete taskLinkTimers[id];
    runJoinVerification(category, id);
  }, TASK_VERIFY_STAGE_MS);
}

async function runJoinVerification(category, id){
  const t = findTask(id);
  if (!t) return;

  taskFlowState[id] = { stage: 'verifying' };
  updateTaskButton(id, `<button class="task-card-btn" data-task-id="${id}" disabled>Verifying.....</button>`);

  const isMember = await checkTelegramJoinStatus(t.telegramChatId);

  // Task may have changed screens/been removed while we were waiting on the network.
  if (!findTask(id)) return;

  if (isMember === true){
    taskFlowState[id] = { stage: 'ready' };
    updateTaskButton(id, `<button class="task-card-btn claim-ready" data-task-id="${id}" onclick="claimTaskReward('${category}','${id}')">Claim</button>`);
  } else if (isMember === false){
    taskFlowState[id] = { stage: 'notjoined' };
    updateTaskButton(id, `<button class="task-card-btn task-card-notjoined" data-task-id="${id}" onclick="retryJoinVerify('${category}','${id}')">Not Joined — Tap to Verify</button>`);
    showToast("Looks like you haven't joined yet. Join the channel, then tap to verify again.", ICONS.warning);
  } else {
    // isMember === null: couldn't run the check (missing bot token/chat id, or a network/API error)
    taskFlowState[id] = { stage: 'checkfailed' };
    updateTaskButton(id, `<button class="task-card-btn task-card-notjoined" data-task-id="${id}" onclick="retryJoinVerify('${category}','${id}')">Couldn't Verify — Retry</button>`);
  }
}

function retryJoinVerify(category, id){
  const t = findTask(id);
  if (!t) return;
  const flow = taskFlowState[id];
  if (flow && flow.stage === 'verifying') return;
  runJoinVerification(category, id);
}

function startProofTask(category, id){
  const t = findTask(id);
  if (!t) return;

  if (isTaskLimitHit(t)){
    showToast('You have already reached the limit for this task', ICONS.warning);
    renderTaskItems(category);
    return;
  }
  if (isDailyLimitHit('task')){
    showToast(`Daily task limit reached (${dailyLimitCounts.task}/${dailyLimitForPlan(state.plan, 'task')}). Resets at 12:00 AM.`, ICONS.warning);
    return;
  }
  if (taskProofTimers[id]) return;

  if (t.actionLink){
    if (tg && tg.openLink) tg.openLink(t.actionLink);
    else window.open(t.actionLink, '_blank');
  }

  taskFlowState[id] = { stage: 'proofWaiting' };
  const btn = document.querySelector(`.task-card-btn[data-task-id="${id}"]`);
  if (btn){ btn.disabled = true; }

  taskProofTimers[id] = setTimeout(() => {
    delete taskProofTimers[id];
    taskFlowState[id] = { stage: 'proofReady' };
    updateTaskButton(id, `<button class="task-card-btn submit-proof" data-task-id="${id}" onclick="openProofModal('${category}','${id}')">Submit Proof</button>`);
  }, TASK_PROOF_STAGE_MS);
}


async function claimTaskReward(category, id){
  if (taskClaimBusy[id]) return;
  if (isGuest){ showToast('Open this app from Telegram to complete tasks', ICONS.warning); return; }
  const t = findTask(id);
  if (!t){ showToast('This task is no longer available', ICONS.warning); return; }
  if (isTaskLimitHit(t)){
    showToast('You have already reached the limit for this task', ICONS.warning);
    delete taskFlowState[id];
    renderTaskItems(category);
    return;
  }
  if (isDailyLimitHit('task')){
    showToast(`Daily task limit reached (${dailyLimitCounts.task}/${dailyLimitForPlan(state.plan, 'task')}). Resets at 12:00 AM.`, ICONS.warning);
    return;
  }

  taskClaimBusy[id] = true;
  showLoading(true);
  try{
    const dailyOk = await claimDailyLimitSlot('task');
    if (!dailyOk){
      showLoading(false);
      showToast(`Daily task limit reached (${dailyLimitCounts.task}/${dailyLimitForPlan(state.plan, 'task')}). Resets at 12:00 AM.`, ICONS.warning);
      renderDailyLimitCard('task');
      return;
    }

    const perUserLimit = Number(t.perUserLimit || 1);
    const completionRef = ref(db, `task_completions/${id}/${state.uid}`);

    const txResult = await runTransaction(completionRef, (current) => {
      const count = Number(current || 0);
      if (count >= perUserLimit) return undefined;
      return count + 1;
    });

    if (!txResult.committed){
      showLoading(false);
      showToast('You have already reached the limit for this task', ICONS.warning);
      if (!state.taskCompletionCount) state.taskCompletionCount = {};
      state.taskCompletionCount[id] = perUserLimit;
      delete taskFlowState[id];
      renderTaskItems(category);
      return;
    }


    if (!state.taskCompletionCount) state.taskCompletionCount = {};
    state.taskCompletionCount[id] = Number(txResult.snapshot.val() || 1);
    delete taskFlowState[id];


    const taskRef = ref(db, `tasks/${id}`);
    let soldOutSnapshot = null;
    await runTransaction(taskRef, (current) => {
      if (!current) return current;
      const completed = Number(current.completedCount || 0);
      const totalQty = Number(current.totalQty || 0);
      if (completed >= totalQty) return current;
      current.completedCount = completed + 1;
      if (current.completedCount >= totalQty){
        soldOutSnapshot = { ...current, id };
        return null;
      }
      return current;
    });

    if (soldOutSnapshot){
      try{
        await push(ref(db, 'task_history'), {
          taskId: id,
          name: soldOutSnapshot.name || '',
          category: soldOutSnapshot.category || '',
          reward: soldOutSnapshot.reward || 0,
          totalQty: soldOutSnapshot.totalQty || 0,
          perUserLimit: soldOutSnapshot.perUserLimit || 0,
          soldOutAt: Date.now()
        });
      }catch(e){ console.error('Failed to log sold-out history', e); }
    }

    state.EarningBalance = (state.EarningBalance||0) + Number(t.reward||0);
    recomputeTotalBalance();
    sessionEarnedToday += Number(t.reward||0);
    state.totalClaim = (state.totalClaim||0) + 1;
    addTransaction('earn', 'Task Reward: ' + (t.name||''), Number(t.reward||0));
    await saveState();

    showLoading(false);
    haptic('medium');
    showToast(`+${fmt(t.reward||0)} earned!`, ICONS.success);
    renderTaskItems(category);
  }catch(e){
    console.error(e);
    showLoading(false);
    showToast('Failed to complete task, try again', ICONS.warning);
  }finally{
    taskClaimBusy[id] = false;
  }
}


// Opens Telegram's share sheet pre-filled with the user's own referral link, so
// friends they invite through THIS task's button still count as normal referrals
// (same referCode, same referrals array) — the task just watches that array.
function inviteForReferTask(taskId){
  if (isGuest){ showToast('Open this app from Telegram to invite friends', ICONS.warning); return; }
  const link = `https://t.me/atrenvaBot?start=ref_${state.referCode}`;
  const text = encodeURIComponent('Join ATRENVA and start earning with me!');
  const url = `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${text}`;
  if (tg && tg.openTelegramLink){ tg.openTelegramLink(url); }
  else { window.open(url, '_blank'); }
}

async function claimReferTask(category, id){
  if (taskClaimBusy[id]) return;
  if (isGuest){ showToast('Open this app from Telegram to complete tasks', ICONS.warning); return; }
  const t = findTask(id);
  if (!t){ showToast('This task is no longer available', ICONS.warning); return; }
  if (isTaskLimitHit(t)){
    showToast('You have already reached the limit for this task', ICONS.warning);
    renderTaskItems(category);
    return;
  }
  if (isDailyLimitHit('task')){
    showToast(`Daily task limit reached (${dailyLimitCounts.task}/${dailyLimitForPlan(state.plan, 'task')}). Resets at 12:00 AM.`, ICONS.warning);
    return;
  }
  // Re-check the real referral count right before crediting — never trust the
  // last render, in case referrals array changed (or hasn't loaded) since then.
  const progress = getReferTaskProgress(t);
  if (!progress.metRequirement){
    showToast(`You still need ${progress.required - progress.count} more referral(s) for this task`, ICONS.warning);
    renderTaskItems(category);
    return;
  }

  taskClaimBusy[id] = true;
  taskFlowState[id] = { stage: 'claiming' };
  updateTaskButton(id, `<button class="task-card-btn" data-task-id="${id}" disabled>Claiming...</button>`);
  showLoading(true);
  try{
    const dailyOk = await claimDailyLimitSlot('task');
    if (!dailyOk){
      showLoading(false);
      delete taskFlowState[id];
      showToast(`Daily task limit reached (${dailyLimitCounts.task}/${dailyLimitForPlan(state.plan, 'task')}). Resets at 12:00 AM.`, ICONS.warning);
      renderDailyLimitCard('task');
      renderTaskItems(category);
      return;
    }

    const perUserLimit = Number(t.perUserLimit || 1);
    const completionRef = ref(db, `task_completions/${id}/${state.uid}`);

    const txResult = await runTransaction(completionRef, (current) => {
      const count = Number(current || 0);
      if (count >= perUserLimit) return undefined;
      return count + 1;
    });

    if (!txResult.committed){
      showLoading(false);
      showToast('You have already reached the limit for this task', ICONS.warning);
      if (!state.taskCompletionCount) state.taskCompletionCount = {};
      state.taskCompletionCount[id] = perUserLimit;
      delete taskFlowState[id];
      renderTaskItems(category);
      return;
    }

    if (!state.taskCompletionCount) state.taskCompletionCount = {};
    state.taskCompletionCount[id] = Number(txResult.snapshot.val() || 1);
    delete taskFlowState[id];

    const taskRef = ref(db, `tasks/${id}`);
    let soldOutSnapshot = null;
    await runTransaction(taskRef, (current) => {
      if (!current) return current;
      const completed = Number(current.completedCount || 0);
      const totalQty = Number(current.totalQty || 0);
      if (completed >= totalQty) return current;
      current.completedCount = completed + 1;
      if (current.completedCount >= totalQty){
        soldOutSnapshot = { ...current, id };
        return null;
      }
      return current;
    });

    if (soldOutSnapshot){
      try{
        await push(ref(db, 'task_history'), {
          taskId: id,
          name: soldOutSnapshot.name || '',
          category: soldOutSnapshot.category || '',
          reward: soldOutSnapshot.reward || 0,
          totalQty: soldOutSnapshot.totalQty || 0,
          perUserLimit: soldOutSnapshot.perUserLimit || 0,
          soldOutAt: Date.now()
        });
      }catch(e){ console.error('Failed to log sold-out history', e); }
    }

    // Push the cursor forward so a repeatable Refer task (perUserLimit > 1)
    // always requires a fresh batch of NEW referrals for the next claim.
    try{ await set(ref(db, `task_refer_cursor/${id}/${state.uid}`), Date.now()); }catch(e){ console.error('Failed to advance refer cursor', e); }

    state.EarningBalance = (state.EarningBalance||0) + Number(t.reward||0);
    recomputeTotalBalance();
    sessionEarnedToday += Number(t.reward||0);
    state.totalClaim = (state.totalClaim||0) + 1;
    addTransaction('earn', 'Task Reward: ' + (t.name||''), Number(t.reward||0));
    await saveState();

    showLoading(false);
    haptic('medium');
    showToast(`+${fmt(t.reward||0)} earned!`, ICONS.success);
    renderTaskItems(category);
  }catch(e){
    console.error(e);
    showLoading(false);
    delete taskFlowState[id];
    showToast('Failed to complete task, try again', ICONS.warning);
    renderTaskItems(category);
  }finally{
    taskClaimBusy[id] = false;
  }
}


function openProofModal(category, id){
  const t = findTask(id);
  if (!t) return;


  if (isTaskLimitHit(t)){
    showToast('You have already reached the limit for this task', ICONS.warning);
    renderTaskItems(category);
    return;
  }
  taskProofCtx = { category, id };
  proofPickedDataUrl = null;
  document.getElementById('proof-modal-task-name').textContent = `Upload a screenshot proving you completed "${t.name}"`;
  document.getElementById('proof-picker-content').innerHTML = `<div class="proof-picker-icon">${ICONS.upload}</div><div class="proof-picker-hint">Tap to choose an image from your gallery</div>`;
  document.getElementById('proof-file-input').value = '';
  document.getElementById('proof-send-btn').disabled = true;
  document.getElementById('proof-modal-overlay').classList.add('show');
}

function closeProofModal(){
  document.getElementById('proof-modal-overlay').classList.remove('show');
  taskProofCtx = null;
  proofPickedDataUrl = null;
}

function onProofFileSelected(evt){
  const file = evt.target.files && evt.target.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')){
    showToast('Please select an image file', ICONS.warning);
    return;
  }
  if (file.size > 8 * 1024 * 1024){
    showToast('Image is too large — please choose one under 8MB', ICONS.warning);
    return;
  }
  document.getElementById('proof-picker-content').innerHTML = `<div class="proof-picker-hint">Processing image...</div>`;
  compressImageForProof(file)
    .then(dataUrl => {
      proofPickedDataUrl = dataUrl;
      document.getElementById('proof-picker-content').innerHTML = `<img src="${proofPickedDataUrl}" alt="">`;
      document.getElementById('proof-send-btn').disabled = false;
    })
    .catch(err => {
      console.error(err);
      showToast('Failed to read image, try again', ICONS.warning);
      document.getElementById('proof-picker-content').innerHTML = `<div class="proof-picker-icon">${ICONS.upload}</div><div class="proof-picker-hint">Tap to choose an image from your gallery</div>`;
    });
}


function compressImageForProof(file){
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('file read failed'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('image decode failed'));
      img.onload = () => {
        const MAX_EDGE = 1280;
        let { width, height } = img;
        if (width > MAX_EDGE || height > MAX_EDGE){
          if (width >= height){ height = Math.round(height * (MAX_EDGE / width)); width = MAX_EDGE; }
          else { width = Math.round(width * (MAX_EDGE / height)); height = MAX_EDGE; }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        try{
          resolve(canvas.toDataURL('image/jpeg', 0.72));
        }catch(e){ reject(e); }
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}


async function sendProofSubmission(){
  if (!taskProofCtx || !proofPickedDataUrl) return;
  const { category, id } = taskProofCtx;
  const t = findTask(id);
  if (!t){ showToast('This task is no longer available', ICONS.warning); closeProofModal(); return; }
  if (isGuest){ showToast('Open this app from Telegram to submit proof', ICONS.warning); return; }
  if (isTaskLimitHit(t)){
    showToast('You have already reached the limit for this task', ICONS.warning);
    closeProofModal();
    renderTaskItems(category);
    return;
  }
  if (isDailyLimitHit('task')){
    showToast(`Daily task limit reached (${dailyLimitCounts.task}/${dailyLimitForPlan(state.plan, 'task')}). Resets at 12:00 AM.`, ICONS.warning);
    return;
  }

  const btn = document.getElementById('proof-send-btn');
  btn.disabled = true;
  showLoading(true);
  try{
    const dailyOk = await claimDailyLimitSlot('task');
    if (!dailyOk){
      showLoading(false);
      showToast(`Daily task limit reached (${dailyLimitCounts.task}/${dailyLimitForPlan(state.plan, 'task')}). Resets at 12:00 AM.`, ICONS.warning);
      renderDailyLimitCard('task');
      btn.disabled = false;
      return;
    }

    const perUserLimit = Number(t.perUserLimit || 1);
    const completionRef = ref(db, `task_completions/${id}/${state.uid}`);
    const txResult = await runTransaction(completionRef, (current) => {
      const count = Number(current || 0);
      if (count >= perUserLimit) return undefined;
      return count + 1;
    });

    if (!txResult.committed){
      showLoading(false);
      showToast('You have already reached the limit for this task', ICONS.warning);
      if (!state.taskCompletionCount) state.taskCompletionCount = {};
      state.taskCompletionCount[id] = perUserLimit;
      delete taskFlowState[id];
      closeProofModal();
      renderTaskItems(category);
      return;
    }

    if (!state.taskCompletionCount) state.taskCompletionCount = {};
    state.taskCompletionCount[id] = Number(txResult.snapshot.val() || 1);
    delete taskFlowState[id];


    const submissionRef = push(ref(db, 'task_submissions'));
    const submissionKey = submissionRef.key;

    await Promise.race([
      set(submissionRef, {
        uid: state.uid,
        taskId: id,
        taskName: t.name || '',
        proof: proofPickedDataUrl,
        status: 'pending',
        createdAt: Date.now()
      }),
      new Promise((_, rej) => setTimeout(() => rej(new Error('Submission timed out')), 20000))
    ]);

    addTransaction('earn', 'Task Proof: ' + (t.name || ''), Number(t.reward || 0), 'Pending', submissionKey, { proofSubmission: true, taskId: id });
    watchProofSubmission(submissionKey);

    await saveState();

    showLoading(false);
    haptic('medium');
    showToast('Proof submitted — waiting for admin review', ICONS.success);
    closeProofModal();
    renderTaskItems(category);
  }catch(e){
    console.error(e);
    showLoading(false);
    const msg = (e && e.message === 'Submission timed out')
      ? 'Submission is taking too long — check your connection and try again'
      : 'Failed to submit proof, try again';
    showToast(msg, ICONS.warning);
    btn.disabled = false;
  }
}


const GMAIL_FIRST_NAMES = [
  "james","john","robert","michael","william","david","richard","joseph","thomas","charles",
  "daniel","matthew","anthony","mark","donald","steven","paul","andrew","joshua","kevin",
  "emma","olivia","ava","isabella","sophia","mia","charlotte","amelia","evelyn","abigail",
  "luca","marco","giovanni","alessandro","matteo","andrea","lorenzo","francesco","stefano","paolo",
  "pierre","jean","louis","henri","francois","antoine","gabriel","raphael","alexandre","julien",
  "hans","klaus","werner","otto","heinrich","friedrich","wolfgang","dieter","gunter","manfred",
  "omar","amir","karim","youssef","ahmed","mahmoud","tariq","hassan","khalid","mostafa",
  "kenji","takeshi","hiroshi","yuki","satoshi","daisuke","ryo","takumi","sho","naoki",
  "arjun","vikram","rajesh","amit","suresh","ravi","deepak","naveen","kiran","rahul",
  "wei","ming","hao","chen","liang","jun","feng","yang","xin","jian"
];
const GMAIL_LAST_NAMES = [
  "smith","johnson","williams","brown","jones","garcia","miller","davis","rodriguez","martinez",
  "anderson","taylor","thomas","jackson","white","harris","martin","thompson","gomez","clark",
  "rossi","ferrari","esposito","bianchi","romano","colombo","ricci","marino","greco","bruno",
  "bernard","dubois","robert","petit","durand","leroy","moreau","simon","laurent","michel",
  "mueller","schmidt","fischer","weber","meyer","wagner","becker","hoffmann","schulz","koch",
  "ali","rahman","hassan","mohamed","abdullah","sayed","hussein","farsi","omar","khalil",
  "sato","suzuki","takahashi","tanaka","watanabe","ito","yamamoto","nakamura","kobayashi","yoshida",
  "sharma","kumar","singh","patel","gupta","reddy","nair","iyer","desai","bose",
  "wang","li","zhang","liu","chen","yang","huang","zhao","wu","zhou"
];
function generateStrongPassword(){
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const digits = '0123456789';
  const special = '@#$%&!*';
  const all = upper + lower + digits + special;

  let pwd = '';
  // Ensure at least one of each type
  pwd += upper[Math.floor(Math.random() * upper.length)];
  pwd += lower[Math.floor(Math.random() * lower.length)];
  pwd += lower[Math.floor(Math.random() * lower.length)];
  pwd += lower[Math.floor(Math.random() * lower.length)];
  pwd += lower[Math.floor(Math.random() * lower.length)];
  pwd += lower[Math.floor(Math.random() * lower.length)];
  pwd += special[Math.floor(Math.random() * special.length)];
  pwd += special[Math.floor(Math.random() * special.length)];
  pwd += digits[Math.floor(Math.random() * digits.length)];
  pwd += digits[Math.floor(Math.random() * digits.length)];
  pwd += digits[Math.floor(Math.random() * digits.length)];

  // Shuffle the password
  pwd = pwd.split('').sort(() => Math.random() - 0.5).join('');
  return pwd;
}

function gmailHasAllSameDigits(numStr){
  return numStr.split('').every(c => c === numStr[0]);
}

function generateFacebookIdentity(){
  const first = GMAIL_FIRST_NAMES[Math.floor(Math.random()*GMAIL_FIRST_NAMES.length)];
  const last = GMAIL_LAST_NAMES[Math.floor(Math.random()*GMAIL_LAST_NAMES.length)];
  return {
    firstName: first.charAt(0).toUpperCase() + first.slice(1).toLowerCase(),
    lastName: last.charAt(0).toUpperCase() + last.slice(1).toLowerCase()
  };
}

// Facebook identity password: lowercase name + @ or # + 3-4 digits, e.g. Mriyad#817 / Tsiyam#289
function generateFacebookPassword(){
  const nameList = GMAIL_FIRST_NAMES;
  const raw = nameList[Math.floor(Math.random()*nameList.length)];
  const name = raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
  const symbol = Math.random() < 0.5 ? '#' : '@';
  const digitCount = Math.random() < 0.5 ? 3 : 4;
  let digits = '';
  for (let i = 0; i < digitCount; i++) digits += String(Math.floor(Math.random()*10));
  return `${name}${symbol}${digits}`;
}

function generateGmailAddress(){
  const first = GMAIL_FIRST_NAMES[Math.floor(Math.random()*GMAIL_FIRST_NAMES.length)];
  const last = GMAIL_LAST_NAMES[Math.floor(Math.random()*GMAIL_LAST_NAMES.length)];
  let num;
  do { num = String(Math.floor(Math.random()*9990)+10); } while (gmailHasAllSameDigits(num));
  const pattern = Math.floor(Math.random()*4);
  let username;
  switch(pattern){
    case 0: username = `${first}.${last}${num}`; break;
    case 1: username = `${first}${num}`; break;
    case 2: username = `${last}.${first}${num}`; break;
    default: username = `${first}${last}${num}`; break;
  }
  return username.toLowerCase() + '@gmail.com';
}

let GMAIL_HISTORY_CACHE = [];
let gmailListenerStarted = false;
let gmailGenerating = false;
let gmailSubmitting = false;


function switchGmailTab(tab){
  document.querySelectorAll('#screen-gmail .social-tab-btn').forEach(b => b.classList.toggle('active', b.dataset.gmailtab === tab));
  document.getElementById('gmail-tab-sell').classList.toggle('active', tab === 'sell');
  document.getElementById('gmail-tab-buy').classList.toggle('active', tab === 'buy');
  if (tab === 'buy'){ startSocialBuyListener('gmail'); renderSocialBuyList('gmail'); }
}

/* ===== New Gmail Step 1 (identity) added on top of existing Gmail system, mirrors Facebook's 2-step flow ===== */
let gmailIdentity = { firstName: '', lastName: '', year: '' };
let gmailFlowLocked = false;

function generateGmailIdentity(){
  const first = GMAIL_FIRST_NAMES[Math.floor(Math.random()*GMAIL_FIRST_NAMES.length)];
  const last = GMAIL_LAST_NAMES[Math.floor(Math.random()*GMAIL_LAST_NAMES.length)];
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 45;
  const maxYear = currentYear - 19;
  const year = String(minYear + Math.floor(Math.random() * (maxYear - minYear + 1)));
  return { firstName: first, lastName: last, year };
}

// Gmail username generated to match the Step 1 first name (e.g. Rahim -> rahim482@gmail.com)
function generateGmailUsernameForIdentity(identity){
  const first = (identity.firstName || 'user').toLowerCase();
  const last = (identity.lastName || '').toLowerCase();
  let num;
  do { num = String(Math.floor(Math.random()*9990)+10); } while (gmailHasAllSameDigits(num));
  const pattern = Math.floor(Math.random()*3);
  let username;
  switch(pattern){
    case 0: username = `${first}${num}`; break;
    case 1: username = `${first}.${last}${num}`; break;
    default: username = `${first}${last}${num}`; break;
  }
  return username.toLowerCase() + '@gmail.com';
}

function resetGmailStep1(){
  if (gmailFlowLocked) return;
  gmailIdentity = generateGmailIdentity();
  const fnEl = document.getElementById('gmail-identity-fname');
  const lnEl = document.getElementById('gmail-identity-lname');
  const yrEl = document.getElementById('gmail-identity-year');
  if (fnEl) fnEl.textContent = gmailIdentity.firstName;
  if (lnEl) lnEl.textContent = gmailIdentity.lastName;
  if (yrEl) yrEl.textContent = gmailIdentity.year;
  const step1 = document.getElementById('gmail-step-1');
  const step2 = document.getElementById('gmail-step-2');
  if (step1) step1.style.display = '';
  if (step2) step2.style.display = 'none';
}

// User has moved to Step 2 without submitting yet -> lock so re-entering the
// screen (e.g. via Back then re-open) doesn't hand out a fresh identity/account
// until they Submit or Cancel.
function goToGmailStep2(){
  const step1 = document.getElementById('gmail-step-1');
  const step2 = document.getElementById('gmail-step-2');
  if (step1) step1.style.display = 'none';
  if (step2) step2.style.display = '';
  if (!gmailFlowLocked){
    gmailFlowLocked = true;
    const idEl = document.getElementById('gmail-generated-id');
    const passEl = document.getElementById('gmail-generated-password');
    if (idEl) idEl.value = generateGmailUsernameForIdentity(gmailIdentity);
    if (passEl) passEl.value = generateStrongPassword();
  }
}

// Lets the user go back to view Step 1 (name/year) without losing or
// regenerating the already-locked identity/account from Step 2.
function goToGmailStep1(){
  const step1 = document.getElementById('gmail-step-1');
  const step2 = document.getElementById('gmail-step-2');
  if (step1) step1.style.display = '';
  if (step2) step2.style.display = 'none';
}

function cancelGmailFlow(){
  gmailFlowLocked = false;
  document.getElementById('gmail-generated-id').value = '';
  document.getElementById('gmail-generated-password').value = '';
  resetGmailStep1();
}

function copyGmailIdentityField(fieldId){
  const el = document.getElementById(fieldId);
  if (!el || !el.textContent || el.textContent === '—'){ showToast('Nothing to copy', ICONS.warning); return; }
  const text = el.textContent;
  const done = () => { haptic('light'); showToast('Copied', ICONS.success); };
  const fail = () => showToast('Copy failed', ICONS.warning);
  if (navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(done).catch(() => {
      try{
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        done();
      }catch(e){ fail(); }
    });
  } else {
    try{
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      done();
    }catch(e){ fail(); }
  }
}
/* ===== END Gmail Step 1 additions ===== */

function openGmailCenter(){
  if (!gmailFlowLocked){
    document.getElementById('gmail-generated-id').value = '';
    document.getElementById('gmail-generated-password').value = '';
  }
  startGmailListener();
  startGmailNoteListener();
  startSocialRewardListener();
  renderSocialRewardHint('gmail');
  switchGmailTab('sell');
  if (gmailFlowLocked){
    // Re-entering mid-flow (e.g. pressed Back after reaching Step 2): keep the
    // same identity/account and stay on Step 2 until Submit or Cancel.
    const step1 = document.getElementById('gmail-step-1');
    const step2 = document.getElementById('gmail-step-2');
    if (step1) step1.style.display = 'none';
    if (step2) step2.style.display = '';
  } else {
    resetGmailStep1();
  }
  ensureDailyLimitListener('gmail', () => renderDailyLimitCard('gmail'));
  renderGmailHistory();
  renderDailyLimitCard('gmail');
  openOverlay('gmail');
}


let socialRewardRange = { min: 0.10, max: 0.30 };
let socialRewardListenerStarted = false;
function startSocialRewardListener(){
  if (socialRewardListenerStarted) return;
  socialRewardListenerStarted = true;
  onValue(ref(db, 'settings/socialReward'), snap => {
    const v = snap.exists() ? snap.val() : null;
    socialRewardRange = {
      min: (v && v.min != null && !isNaN(Number(v.min))) ? Number(v.min) : 0.10,
      max: (v && v.max != null && !isNaN(Number(v.max))) ? Number(v.max) : 0.30
    };
    renderSocialRewardHint('gmail');
    renderSocialRewardHint('facebook');
  });
}


let dailyBonusBase = 0.10;
let dailyBonusSettingsListenerStarted = false;
function startDailyBonusSettingsListener(){
  if (dailyBonusSettingsListenerStarted) return;
  dailyBonusSettingsListenerStarted = true;
  onValue(ref(db, 'settings/dailyBonus'), snap => {
    const v = snap.exists() ? snap.val() : null;
    dailyBonusBase = (v && v.base != null && !isNaN(Number(v.base))) ? Number(v.base) : 0.10;
    if (currentScreen === 'home') renderDailyBonus();
  });
}

function renderSocialRewardHint(type){
  const el = document.getElementById(type === 'gmail' ? 'gmail-reward-hint' : 'fb-reward-hint');
  if (!el) return;
  el.innerHTML = '';
}


let gmailNoteListenerStarted = false;
function startGmailNoteListener(){
  if (gmailNoteListenerStarted) return;
  gmailNoteListenerStarted = true;
  onValue(ref(db, 'settings/gmailNote'), snap => {
    const el = document.getElementById('gmail-note-text');
    if (!el) return;
    if (snap.exists() && String(snap.val()).trim()){
      el.textContent = snap.val();
    }
  });
}

function startGmailListener(){
  if (gmailListenerStarted || isGuest) return;
  gmailListenerStarted = true;
  onValue(ref(db, 'Gmail'), snap => {
    const val = snap.exists() ? snap.val() : {};
    GMAIL_HISTORY_CACHE = Object.keys(val)
      .map(id => ({ id, ...val[id] }))
      .filter(s => s.uid === state.uid)
      .sort((a,b) => (b.createdAt||0) - (a.createdAt||0));
    if (document.getElementById('screen-gmail') && document.getElementById('screen-gmail').classList.contains('active')){
      renderGmailHistory();
    }
  });
}

function renderGmailHistory(){
  const wrap = document.getElementById('gmail-history-list');
  if (!wrap) return;
  if (GMAIL_HISTORY_CACHE.length === 0){
    wrap.innerHTML = `<div class="empty-state"><div class="empty-icon">${ICONS.inbox}</div><div class="empty-title">No history yet</div><div class="empty-desc">Generated Gmail submissions will show up here</div></div>`;
    return;
  }
  wrap.innerHTML = GMAIL_HISTORY_CACHE.map(s => {
    const status = s.status || 'pending';
    const label = status === 'approved' ? 'Accepted' : status === 'rejected' ? 'Rejected' : 'Pending';
    return `<div class="social-history-card">
      <div class="social-history-icon">${ICONS.mail}</div>
      <div class="social-history-info">
        <div class="social-history-id">${escapeHtml(s.firstName || s.gtaskid || '--')}</div>
        <div class="social-history-date">${s.createdAt ? new Date(s.createdAt).toLocaleString('en-US',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}) : ''}</div>
        ${s.reason ? `<div class="social-history-reason">Reason: ${escapeHtml(s.reason)}</div>` : ''}
      </div>
      <span class="status-pill status-${status}">${label}</span>
    </div>`;
  }).join('');
}


async function refreshGmailId(){
  if (gmailGenerating) return;
  if (isGuest){ showToast('Open this app from Telegram to generate a Gmail id', ICONS.warning); return; }

  gmailGenerating = true;
  const btn = document.getElementById('gmail-refresh-btn');
  btn.disabled = true;
  showLoading(true);
  try{
    let email = null;
    for (let attempt = 0; attempt < 6; attempt++){
      const candidate = generateGmailAddress();
      const key = candidate.replace(/\./g, '_');
      const snap = await get(ref(db, 'used_gmail_ids/'+key));
      if (!snap.exists()){
        await set(ref(db, 'used_gmail_ids/'+key), true);
        email = candidate;
        break;
      }
    }
    if (!email){
      showLoading(false);
      showToast('Could not generate a unique id, try again', ICONS.warning);
      return;
    }
    document.getElementById('gmail-generated-id').value = email;
    document.getElementById('gmail-generated-password').value = generateStrongPassword();
    showLoading(false);
    haptic('light');
  }catch(e){
    console.error(e);
    showLoading(false);
    showToast('Failed to generate, try again', ICONS.warning);
  }finally{
    gmailGenerating = false;
    btn.disabled = false;
  }
}

function copyGmailField(fieldId){
  const input = document.getElementById(fieldId);
  if (!input || !input.value){ showToast('Nothing to copy', ICONS.warning); return; }
  navigator.clipboard.writeText(input.value).then(() => {
    haptic('light');
    showToast('Copied', ICONS.success);
  }).catch(() => {
    input.select();
    try{ document.execCommand('copy'); showToast('Copied', ICONS.success); }
    catch(e){ showToast('Copy failed', ICONS.warning); }
  });
}


async function submitGmailId(){
  if (gmailSubmitting) return;
  const email = document.getElementById('gmail-generated-id').value.trim();
  const password = document.getElementById('gmail-generated-password').value.trim();

  if (!email || !password){
    showToast('Tap Refresh to generate a Gmail id first', ICONS.warning);
    return;
  }
  if (isGuest){
    showToast('Open this app from Telegram to submit', ICONS.warning);
    return;
  }
  if (isDailyLimitHit('gmail')){
    showToast(`Daily limit reached (${dailyLimitCounts.gmail}/${dailyLimitForPlan(state.plan, 'gmail')}). Resets at 12:00 AM.`, ICONS.warning);
    return;
  }

  gmailSubmitting = true;
  const btn = document.getElementById('gmail-done-btn');
  btn.disabled = true;
  try{
    const adOk = await requireAdBeforeAction('gmail-done-btn');
    if (!adOk){ btn.disabled = false; gmailSubmitting = false; return; }
  }catch(e){ btn.disabled = false; gmailSubmitting = false; return; }
  showLoading(true);
  try{
    const dailyOk = await claimDailyLimitSlot('gmail');
    if (!dailyOk){
      showLoading(false);
      showToast(`Daily limit reached (${dailyLimitCounts.gmail}/${dailyLimitForPlan(state.plan, 'gmail')}). Resets at 12:00 AM.`, ICONS.warning);
      renderDailyLimitCard('gmail');
      btn.disabled = false;
      return;
    }
    await push(ref(db, 'Gmail'), {
      uid: state.uid,
      gtaskid: email,
      gtaskpassword: password,
      firstName: gmailIdentity.firstName || '',
      lastName: gmailIdentity.lastName || '',
      year: gmailIdentity.year || '',
      status: 'pending',
      createdAt: Date.now()
    });
    document.getElementById('gmail-generated-id').value = '';
    document.getElementById('gmail-generated-password').value = '';
    gmailFlowLocked = false;
    resetGmailStep1();
    showLoading(false);
    haptic('medium');
    showToast('Submitted for review', ICONS.success);
  }catch(e){
    console.error(e);
    showLoading(false);
    showToast('Failed to submit, try again', ICONS.warning);
  }finally{
    gmailSubmitting = false;
    btn.disabled = false;
  }
}


let FACEBOOK_SUBMISSIONS_CACHE = [];
let facebookListenerStarted = false;
let facebookSubmitting = false;
let facebookIdentity = { firstName: '', lastName: '' };
let facebookGeneratedPassword = '';
let facebookFlowLocked = false;


function switchFacebookTab(tab){
  document.querySelectorAll('#screen-facebook .social-tab-btn').forEach(b => b.classList.toggle('active', b.dataset.fbtab === tab));
  document.getElementById('fb-tab-sell').classList.toggle('active', tab === 'sell');
  document.getElementById('fb-tab-buy').classList.toggle('active', tab === 'buy');
  if (tab === 'buy'){ startSocialBuyListener('facebook'); renderSocialBuyList('facebook'); }
}

function resetFacebookStep1(){
  if (facebookFlowLocked) return;
  facebookIdentity = generateFacebookIdentity();
  facebookGeneratedPassword = generateFacebookPassword();
  const fnEl = document.getElementById('fb-identity-fname');
  const lnEl = document.getElementById('fb-identity-lname');
  const passEl = document.getElementById('fb-identity-password');
  if (fnEl) fnEl.textContent = facebookIdentity.firstName;
  if (lnEl) lnEl.textContent = facebookIdentity.lastName;
  if (passEl) passEl.textContent = facebookGeneratedPassword;
  document.getElementById('fb-step-1').style.display = '';
  document.getElementById('fb-step-2').style.display = 'none';
}

// User has moved to Step 2 without submitting yet -> lock so re-entering the
// screen (e.g. via Back then re-open) doesn't hand out a fresh identity until
// they Submit or Cancel.
function goToFacebookStep2(){
  facebookFlowLocked = true;
  document.getElementById('fb-step-1').style.display = 'none';
  document.getElementById('fb-step-2').style.display = '';
}

// Lets the user go back to view Step 1 (name/password) without losing or
// regenerating the already-locked identity from Step 2.
function goToFacebookStep1(){
  document.getElementById('fb-step-1').style.display = '';
  document.getElementById('fb-step-2').style.display = 'none';
}

function cancelFacebookFlow(){
  facebookFlowLocked = false;
  document.getElementById('fb-task-uid').value = '';
  document.getElementById('fb-task-cookies').value = '';
  document.getElementById('fb-task-uid-error').classList.remove('show');
  document.getElementById('fb-task-cookies-error').classList.remove('show');
  resetFacebookStep1();
}

function copyFacebookIdentityField(fieldId){
  const el = document.getElementById(fieldId);
  if (!el || !el.textContent || el.textContent === '—'){ showToast('Nothing to copy', ICONS.warning); return; }
  const text = el.textContent;
  const done = () => { haptic('light'); showToast('Copied', ICONS.success); };
  const fail = () => showToast('Copy failed', ICONS.warning);
  if (navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(done).catch(() => {
      try{
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        done();
      }catch(e){ fail(); }
    });
  } else {
    try{
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      done();
    }catch(e){ fail(); }
  }
}

function openFacebookCenter(){
  if (!facebookFlowLocked){
    document.getElementById('fb-task-uid').value = '';
    document.getElementById('fb-task-cookies').value = '';
    document.getElementById('fb-task-uid-error').classList.remove('show');
    document.getElementById('fb-task-cookies-error').classList.remove('show');
  }
  startFacebookListener();
  startFacebookNoteListener();
  startSocialRewardListener();
  renderSocialRewardHint('facebook');
  switchFacebookTab('sell');
  if (facebookFlowLocked){
    // Re-entering mid-flow (e.g. pressed Back after reaching Step 2): keep the
    // same identity until Submit or Cancel.
    document.getElementById('fb-step-1').style.display = 'none';
    document.getElementById('fb-step-2').style.display = '';
  } else {
    resetFacebookStep1();
  }
  ensureDailyLimitListener('facebook', () => renderDailyLimitCard('facebook'));
  renderFacebookHistory();
  renderDailyLimitCard('facebook');
  openOverlay('facebook');
}

let facebookNoteListenerStarted = false;
function startFacebookNoteListener(){
  if (facebookNoteListenerStarted) return;
  facebookNoteListenerStarted = true;
  onValue(ref(db, 'settings/facebookNote'), snap => {
    const el = document.getElementById('fb-note-text');
    if (!el) return;
    if (snap.exists() && String(snap.val()).trim()){
      el.textContent = snap.val();
    }
  });
}

function startFacebookListener(){
  if (facebookListenerStarted || isGuest) return;
  facebookListenerStarted = true;
  onValue(ref(db, 'Facebook'), snap => {
    const val = snap.exists() ? snap.val() : {};
    FACEBOOK_SUBMISSIONS_CACHE = Object.keys(val)
      .map(id => ({ id, ...val[id] }))
      .filter(s => s.uid === state.uid)
      .sort((a,b) => (b.createdAt||0) - (a.createdAt||0));
    if (document.getElementById('screen-facebook') && document.getElementById('screen-facebook').classList.contains('active')){
      renderFacebookHistory();
    }
  });
}

function renderFacebookHistory(){
  const wrap = document.getElementById('fb-history-list');
  if (!wrap) return;
  if (FACEBOOK_SUBMISSIONS_CACHE.length === 0){
    wrap.innerHTML = `<div class="empty-state"><div class="empty-icon">${ICONS.inbox}</div><div class="empty-title">No submissions yet</div><div class="empty-desc">Your submitted requests will show up here</div></div>`;
    return;
  }
  wrap.innerHTML = FACEBOOK_SUBMISSIONS_CACHE.map(s => {
    const status = s.status || 'pending';
    const label = status === 'approved' ? 'Accepted' : status === 'rejected' ? 'Rejected' : 'Pending';
    return `<div class="social-history-card">
      <div class="social-history-icon">${ICONS.facebook}</div>
      <div class="social-history-info">
        <div class="social-history-id">${escapeHtml(s.firstName || s.fbuid || '--')}</div>
        <div class="social-history-date">${s.createdAt ? new Date(s.createdAt).toLocaleString('en-US',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}) : ''}</div>
        ${s.reason ? `<div class="social-history-reason">Reason: ${escapeHtml(s.reason)}</div>` : ''}
      </div>
      <span class="status-pill status-${status}">${label}</span>
    </div>`;
  }).join('');
}

function escapeHtml(s){
  return String(s==null?'':s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

async function submitFacebookRequest(){
  if (facebookSubmitting) return;
  const uidInput = document.getElementById('fb-task-uid');
  const cookiesInput = document.getElementById('fb-task-cookies');
  const uidErr = document.getElementById('fb-task-uid-error');
  const cookiesErr = document.getElementById('fb-task-cookies-error');
  uidErr.classList.remove('show');
  cookiesErr.classList.remove('show');

  const fbuid = uidInput.value.trim();
  const cookies = cookiesInput.value.trim();

  let hasError = false;
  if (!fbuid){ uidErr.textContent = 'Enter your Facebook UID'; uidErr.classList.add('show'); hasError = true; }
  if (!cookies){ cookiesErr.textContent = 'Enter your Facebook cookies'; cookiesErr.classList.add('show'); hasError = true; }
  if (hasError) return;

  if (isGuest){
    showToast('Open this app from Telegram to submit a request', ICONS.warning);
    return;
  }
  if (isDailyLimitHit('facebook')){
    showToast(`Daily limit reached (${dailyLimitCounts.facebook}/${dailyLimitForPlan(state.plan, 'facebook')}). Resets at 12:00 AM.`, ICONS.warning);
    return;
  }

  facebookSubmitting = true;
  const btn = document.getElementById('fb-submit-btn');
  btn.disabled = true;
  try{
    const adOk = await requireAdBeforeAction('fb-submit-btn');
    if (!adOk){ btn.disabled = false; facebookSubmitting = false; return; }
  }catch(e){ btn.disabled = false; facebookSubmitting = false; return; }
  showLoading(true);
  try{
    const dailyOk = await claimDailyLimitSlot('facebook');
    if (!dailyOk){
      showLoading(false);
      showToast(`Daily limit reached (${dailyLimitCounts.facebook}/${dailyLimitForPlan(state.plan, 'facebook')}). Resets at 12:00 AM.`, ICONS.warning);
      renderDailyLimitCard('facebook');
      btn.disabled = false;
      return;
    }
    await push(ref(db, 'Facebook'), {
      uid: state.uid,
      fbuid,
      cookies,
      firstName: facebookIdentity.firstName || '',
      lastName: facebookIdentity.lastName || '',
      password: facebookGeneratedPassword || '',
      status: 'pending',
      createdAt: Date.now()
    });
    uidInput.value = '';
    cookiesInput.value = '';
    facebookFlowLocked = false;
    resetFacebookStep1();
    showLoading(false);
    haptic('medium');
    showToast('Request submitted for review', ICONS.success);
  }catch(e){
    console.error(e);
    showLoading(false);
    showToast('Failed to submit request, try again', ICONS.warning);
  }finally{
    facebookSubmitting = false;
    btn.disabled = false;
  }
}


const SOCIAL_BUY_CONFIG = {
  gmail:    { path: 'Gmail',    salesPath: 'gmail_sales',    idField: 'gtaskid', passField: 'gtaskpassword', label: 'Gmail' },
  facebook: { path: 'Facebook', salesPath: 'facebook_sales', idField: 'fbuid', passField: 'cookies', label: 'Facebook' }
};
let SOCIAL_BUY_CACHE = { gmail: [], facebook: [] };
let socialBuyListenerStarted = { gmail: false, facebook: false };
let socialBuyCtx = null;
let socialBuyBusy = false;

function startSocialBuyListener(type){
  if (socialBuyListenerStarted[type] || isGuest) return;
  socialBuyListenerStarted[type] = true;
  const cfg = SOCIAL_BUY_CONFIG[type];
  onValue(ref(db, cfg.path), snap => {
    const val = snap.exists() ? snap.val() : {};
    SOCIAL_BUY_CACHE[type] = Object.keys(val)
      .map(id => ({ id, ...val[id] }))
      .filter(s => s.listedForSale && !s.soldTo)
      .sort((a,b) => (b.listedAt||0) - (a.listedAt||0));
    const activeTab = type === 'gmail' ? 'gmail-tab-buy' : 'fb-tab-buy';
    if (document.getElementById(activeTab) && document.getElementById(activeTab).classList.contains('active')){
      renderSocialBuyList(type);
    }
  });
}


function socialBuyInitial(type, accountId){
  const id = String(accountId||'').trim();
  if (!id) return type === 'gmail' ? 'G' : 'F';
  const localPart = type === 'gmail' ? id.split('@')[0] : id;
  return (localPart.charAt(0) || (type==='gmail'?'G':'F')).toUpperCase();
}


function maskSocialAccountId(type, accountId){
  const raw = String(accountId||'').trim();
  if (!raw) return '--';

  if (type === 'gmail'){
    const atIdx = raw.indexOf('@');
    const local = atIdx === -1 ? raw : raw.slice(0, atIdx);
    const domain = atIdx === -1 ? 'gmail.com' : raw.slice(atIdx + 1);
    if (local.length <= 3) return local.charAt(0) + '******@' + domain;
    const first2 = local.slice(0, 2);
    const last1 = local.slice(-1);
    return first2 + '******' + last1 + '@' + domain;
  }


  if (raw.length <= 4) return raw.charAt(0) + '******';
  const first2 = raw.slice(0, 2);
  const last2 = raw.slice(-2);
  return first2 + '******' + last2;
}

function renderSocialBuyList(type){
  const cfg = SOCIAL_BUY_CONFIG[type];
  const wrap = document.getElementById(type === 'gmail' ? 'gmail-buy-list' : 'fb-buy-list');
  if (!wrap) return;
  const items = SOCIAL_BUY_CACHE[type] || [];

  if (items.length === 0){
    wrap.innerHTML = `<div class="empty-state"><div class="empty-icon">${ICONS.inbox}</div><div class="empty-title">No accounts available</div><div class="empty-desc">Check back later for new ${cfg.label} accounts</div></div>`;
    return;
  }

  wrap.innerHTML = items.map(s => {
    const accountId = s[cfg.idField] || '--';
    const initial = (s.firstName ? s.firstName.charAt(0) : socialBuyInitial(type, accountId)).toUpperCase();
    const firstName = s.firstName || '--';
    const lastName = s.lastName || '--';
    const maskedId = maskSocialAccountId(type, accountId);
    const idLabel = type === 'gmail' ? 'Gmail' : 'Facebook ID';
    const year = s.year || '--';
    return `<div class="buy-account-card">
      <div class="buy-account-logo">${escapeHtml(initial)}</div>
      <div class="buy-account-info">
        <div class="buy-account-detail-row"><span class="buy-account-detail-label">First Name:</span><span class="buy-account-detail-value">${escapeHtml(firstName)}</span></div>
        <div class="buy-account-detail-row"><span class="buy-account-detail-label">Last Name:</span><span class="buy-account-detail-value">${escapeHtml(lastName)}</span></div>
        <div class="buy-account-detail-row"><span class="buy-account-detail-label">${idLabel}:</span><span class="buy-account-detail-value buy-account-masked">${escapeHtml(maskedId)}</span></div>
        <div class="buy-account-detail-row"><span class="buy-account-detail-label">Year:</span><span class="buy-account-detail-value">${escapeHtml(year)}</span></div>
        <div class="buy-account-price">${fmt(s.sellPrice||0)}</div>
      </div>
      <button class="buy-account-btn" onclick="openSocialBuyModal('${type}','${s.id}')">Buy</button>
    </div>`;
  }).join('');
}

function findSocialListing(type, id){
  return (SOCIAL_BUY_CACHE[type] || []).find(s => s.id === id) || null;
}

function openSocialBuyModal(type, id){
  if (isGuest){ showToast('Open this app from Telegram to buy an account', ICONS.warning); return; }
  const cfg = SOCIAL_BUY_CONFIG[type];
  const s = findSocialListing(type, id);
  if (!s){ showToast('This account is no longer available', ICONS.warning); return; }

  const price = Number(s.sellPrice||0);
  const available = Number(state.depositBalance||0);
  socialBuyCtx = { type, id };

  const modalLabel = s.firstName ? escapeHtml(s.firstName) : escapeHtml(maskSocialAccountId(type, s[cfg.idField]||'--'));
  document.getElementById('social-buy-modal-title').textContent = 'Buy ' + cfg.label + ' Account';
  document.getElementById('social-buy-modal-desc').innerHTML =
    `${modalLabel}<br><br>` +
    `Price: <strong>${fmt(price)}</strong><br>` +
    `Your Deposit Balance: <strong>${fmt(available)}</strong>`;

  const confirmBtn = document.getElementById('social-buy-confirm-btn');
  if (available < price){
    confirmBtn.disabled = true;
    confirmBtn.textContent = 'Insufficient Deposit Balance';
  } else {
    confirmBtn.disabled = false;
    confirmBtn.textContent = 'Buy';
  }
  document.getElementById('social-buy-modal-overlay').classList.add('show');
}

function closeSocialBuyModal(){
  document.getElementById('social-buy-modal-overlay').classList.remove('show');
  socialBuyCtx = null;
}


function maskSocialCookies(value){
  const raw = String(value || '');
  if (!raw) return '';
  return raw.split(';').map(part => {
    const i = part.indexOf('=');
    if (i < 0) return part.trim();
    const key = part.slice(0, i).trim();
    const val = part.slice(i + 1).trim();
    if (!val) return key + '=••••';
    const keep = Math.min(2, val.length);
    return key + '=' + val.slice(0, keep) + '••••••';
  }).filter(Boolean).join('; ');
}

async function confirmSocialBuy(){
  if (socialBuyBusy || !socialBuyCtx) return;
  const { type, id } = socialBuyCtx;
  const cfg = SOCIAL_BUY_CONFIG[type];
  const s = findSocialListing(type, id);
  if (!s){ showToast('This account is no longer available', ICONS.warning); closeSocialBuyModal(); return; }

  const price = Number(s.sellPrice||0);
  const available = Number(state.depositBalance||0);
  if (available < price){
    showToast('Insufficient Deposit Balance', ICONS.warning);
    return;
  }

  socialBuyBusy = true;
  const btn = document.getElementById('social-buy-confirm-btn');
  btn.disabled = true;
  showLoading(true);
  try{
    const listingRef = ref(db, cfg.path + '/' + id);
    const txResult = await runTransaction(listingRef, (current) => {
      if (!current) return current;
      if (!current.listedForSale || current.soldTo) return;
      current.soldTo = state.uid;
      current.soldAt = Date.now();
      current.listedForSale = false;
      return current;
    });

    if (!txResult.committed){
      showLoading(false);
      showToast('Sorry, this account was just sold to someone else', ICONS.warning);
      closeSocialBuyModal();
      renderSocialBuyList(type);
      return;
    }


    state.depositBalance = Math.max(0, Number(state.depositBalance||0) - price);
    recomputeTotalBalance();
    addTransaction('earn', 'Bought ' + cfg.label + ' Account', -price, 'Completed', null, {
      socialBuy: true,
      socialType: type,
      firstName: s.firstName || '',
      lastName: s.lastName || '',
      year: s.year || '',
      accountId: s[cfg.idField] || '',
      accountPassword: type === 'facebook' ? (s.password || '') : (s[cfg.passField] || ''),
      accountCookiesMasked: type === 'facebook' ? maskSocialCookies(s.cookies || '') : ''
    });
    await saveState();


    await push(ref(db, cfg.salesPath), {
      uid: state.uid,
      accountId: s[cfg.idField] || '',
      firstName: s.firstName || '',
      price,
      soldAt: Date.now()
    });

    showLoading(false);
    haptic('medium');
    closeSocialBuyModal();
    renderSocialBuyList(type);

    document.getElementById('social-buy-success-id').value = s[cfg.idField] || '';
    document.getElementById('social-buy-success-password').value = type === 'facebook' ? (s.password || '') : (s[cfg.passField] || '');
    document.getElementById('social-buy-success-cookies').value = type === 'facebook' ? maskSocialCookies(s.cookies || '') : '';
    document.getElementById('social-buy-success-cookies').parentElement.style.display = type === 'facebook' ? 'flex' : 'none';
    document.getElementById('social-buy-success-overlay').classList.add('show');
  }catch(e){
    console.error(e);
    showLoading(false);
    showToast('Purchase failed, try again', ICONS.warning);
  }finally{
    socialBuyBusy = false;
    btn.disabled = false;
  }
}

function closeSocialBuySuccess(){
  document.getElementById('social-buy-success-overlay').classList.remove('show');
  document.getElementById('social-buy-success-id').value = '';
  document.getElementById('social-buy-success-password').value = '';
  document.getElementById('social-buy-success-cookies').value = '';
}


let INVESTMENT_PLANS = [];
let investmentPlansLoaded = false;
let USER_INVESTMENTS = {};
let investmentWorkFilter = 'all';
let currentInvestmentDetailId = null;
let currentInvestmentEntryId = null;
let investmentEntryBusy = false;
let investmentWatchBusy = false;
let investmentProgressTicker = null;
let investmentLifecycleTimer = null;
let currentAdIframeEntryId = null;
let adIframeCountdownTimer = null;

function startInvestmentPlansListener(){
  onValue(ref(db, 'investment_plans'), snap => {
    const val = snap.exists() ? snap.val() : {};
    INVESTMENT_PLANS = Object.keys(val).map(id => ({ id, ...val[id] })).filter(p => p.status === true);
    investmentPlansLoaded = true;
    if (currentScreen === 'work') renderWorkItems(investmentWorkFilter);
    if (document.getElementById('screen-work-detail').classList.contains('active') && currentInvestmentDetailId){
      renderInvestmentDetail(currentInvestmentDetailId);
    }
  });
}

function startUserInvestmentsListener(){
  if (isGuest || !state.uid) return;
  onValue(ref(db, `user_investments/${state.uid}`), snap => {
    USER_INVESTMENTS = snap.exists() ? snap.val() : {};
    processInvestmentLifecycle();
    if (currentScreen === 'work') renderWorkItems(investmentWorkFilter);
    if (document.getElementById('screen-work-detail').classList.contains('active') && currentInvestmentDetailId){
      renderInvestmentDetail(currentInvestmentDetailId);
    }
    if (document.getElementById('screen-investment-progress').classList.contains('active') && currentInvestmentEntryId){
      renderInvestmentProgress(currentInvestmentEntryId);
    }
  });
  if (!investmentLifecycleTimer){
    investmentLifecycleTimer = setInterval(processInvestmentLifecycle, 15*60*1000);
  }
}

function findActiveEntryForPlan(planId){
  return Object.entries(USER_INVESTMENTS).find(([id, e]) => e.planId === planId && e.status === 'active');
}

// Normalizes refer requirement shapes (new {normalCount} and legacy {type,count}) into
// a single { normalCount } object. There is only ONE refer type (not "active") — no more
// active-referral tier.
function normalizeReferReq(refer){
  if (!refer) return { normalCount: 0 };
  if (refer.type){
    return { normalCount: Number(refer.count||0) };
  }
  return { normalCount: Number(refer.normalCount||0) };
}
function referReqLabel(refer){
  const { normalCount } = normalizeReferReq(refer);
  return normalCount ? `Refer x${normalCount}` : 'Refer requirement';
}
function referReqMet(refer){
  const { normalCount } = normalizeReferReq(refer);
  return normalCount <= 0 || (state.referrals||[]).length >= normalCount;
}

// Plan system removed — mining models are no longer gated by any subscription tier,
// only by the refer requirement above (and the buy price/ad-unlock cost).
function userEligibleForPlan(p){
  return true;
}

function vipPlanNames(p){
  return '';
}

// Does this plan have any requirement that has to be repeated every day (as opposed to one-time)?
function planDailyReqActive(req){
  if (!req) return false;
  if (req.watchad) return true;
  if (req.custom && req.custom.mode === 'daily') return true;
  return false;
}

function dateKeyOf(ts){
  const d = new Date(ts);
  const y = d.getFullYear(), m = String(d.getMonth()+1).padStart(2,'0'), dd = String(d.getDate()).padStart(2,'0');
  return `${y}-${m}-${dd}`;
}
function prevDateKey(key){
  const [y,m,d] = key.split('-').map(Number);
  const dt = new Date(y, m-1, d);
  dt.setDate(dt.getDate()-1);
  return `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`;
}

// Runs on every investments update + every 15 min while the app is open:
// 1) matures finished investments (credits Earning Balance + adds to Transactions/Others)
// 2) checks whether yesterday's daily requirement was missed, raises an alert (logged as a
//    zero-amount entry in Transactions/Others so the user can find it later), and
//    auto-cancels (no refund, also logged) once the plan's maxAlerts is reached.
async function processInvestmentLifecycle(){
  if (isGuest || !state.uid) return;
  const now = Date.now();
  const todayKey = dailyLimitDateKey();
  const yestKey = prevDateKey(todayKey);

  for (const [entryId, entry] of Object.entries(USER_INVESTMENTS)){
    if (!entry || entry.status !== 'active') continue;
    const plan = entry.plan || {};
    const req = plan.requirements || {};

    if (now >= Number(entry.expiresAt||0)){
      try{
        const reward = Number(entry.totalProfit||0);
        await update(ref(db, `user_investments/${state.uid}/${entryId}`), { status: 'completed', completedAt: now });
        state.EarningBalance = Number(state.EarningBalance||0) + reward;
        recomputeTotalBalance();
        addTransaction('earn', 'Investment Matured: ' + (plan.name||'Investment Plan'), reward);
        await saveState();

        const willRenew = plan.onExpiry === 'renew';
        if (willRenew){
          // Auto-renew: open a brand-new entry with the exact same terms (entry fee, profit, requirements, duration).
          const durationDays = Number(plan.durationDays||entry.durationDays||0);
          const renewedEntry = {
            planId: entry.planId,
            plan: {
              name: plan.name || '', image: plan.image || '',
              entryFee: Number(entry.entryFee||0), totalProfit: Number(plan.totalProfit||0),
              durationDays, requirements: plan.requirements || {},
              maxAlerts: Number(plan.maxAlerts||3), vipPlans: plan.vipPlans || [],
              onExpiry: plan.onExpiry || 'remove'
            },
            entryFee: Number(entry.entryFee||0),
            totalProfit: Number(plan.totalProfit||0),
            durationDays,
            startedAt: now,
            expiresAt: now + durationDays*24*3600*1000,
            status: 'active',
            alerts: 0,
            lastEvalDateKey: dailyLimitDateKey(),
            renewedFrom: entryId
          };
          if (plan.requirements && plan.requirements.watchad){
            renewedEntry.watchAd = { dateKey: dailyLimitDateKey(), count: 0, lastWatchAt: 0 };
          }
          if (plan.requirements && plan.requirements.custom){
            if (plan.requirements.custom.mode === 'daily') renewedEntry.customDaily = { dateKey: '', done: false };
            else renewedEntry.customDone = false;
          }
          await push(ref(db, `user_investments/${state.uid}`), renewedEntry);
          showToast(`${plan.name||'Investment'} matured! +${fmt(reward)} credited, and auto-renewed for another ${durationDays} day${durationDays===1?'':'s'}`, ICONS.success);
        } else {
          showToast(`${plan.name||'Investment'} matured! +${fmt(reward)} added to Earning Balance`, ICONS.success);
        }
      }catch(e){ console.error(e); }
      continue;
    }

    if (!planDailyReqActive(req)) continue;
    const startedKey = dateKeyOf(entry.startedAt||now);
    if (entry.lastEvalDateKey === todayKey) continue;
    if (startedKey >= todayKey || startedKey >= yestKey){
      try{ await update(ref(db, `user_investments/${state.uid}/${entryId}`), { lastEvalDateKey: todayKey }); }catch(e){}
      continue;
    }

    let metYesterday = true;
    if (req.watchad){
      const wa = entry.watchAd || {};
      const target = Number(req.watchad.dailyTarget||0);
      if (!(wa.dateKey === yestKey && Number(wa.count||0) >= target)) metYesterday = false;
    }
    if (metYesterday && req.custom && req.custom.mode === 'daily'){
      const cd = entry.customDaily || {};
      if (!(cd.dateKey === yestKey && cd.done === true)) metYesterday = false;
    }

    try{
      if (!metYesterday){
        const maxAlerts = Number(plan.maxAlerts||3);
        const newAlerts = Number(entry.alerts||0) + 1;
        if (newAlerts >= maxAlerts){
          const refundPercent = (plan.investmentRefund != null && !isNaN(Number(plan.investmentRefund))) ? Number(plan.investmentRefund) : 0.90;
          const entryFee = Number(entry.entryFee||0);
          const refundAmount = Number((entryFee * refundPercent).toFixed(2));
          await update(ref(db, `user_investments/${state.uid}/${entryId}`), {
            status: 'cancelled', cancelledAt: now, alerts: newAlerts, lastEvalDateKey: todayKey,
            refunded: refundAmount > 0, refundAmount: refundAmount, refundPercent: refundPercent
          });
          if (refundAmount > 0){
            state.depositBalance = Number((Number(state.depositBalance||0) + refundAmount).toFixed(2));
            recomputeTotalBalance();
            addTransaction('earn', `Investment Refund: ${plan.name||'Investment Plan'} — cancelled after missing daily requirement ${newAlerts}/${maxAlerts} times (${Math.round(refundPercent*100)}% refund)`, refundAmount, 'Refunded');
            showToast(`${plan.name||'Investment'} was cancelled — daily requirement missed ${newAlerts} times. ${fmt(refundAmount)} refunded to Deposit Balance (${Math.round(refundPercent*100)}%).`, ICONS.warning);
          } else {
            addTransaction('earn', `Investment Cancelled: ${plan.name||'Investment Plan'} — missed daily requirement ${newAlerts}/${maxAlerts} times, no refund`, 0, 'Cancelled');
            showToast(`${plan.name||'Investment'} was cancelled — daily requirement missed ${newAlerts} times. No refund.`, ICONS.warning);
          }
          await saveState();
        } else {
          await update(ref(db, `user_investments/${state.uid}/${entryId}`), { alerts: newAlerts, lastEvalDateKey: todayKey });
          addTransaction('earn', `Investment Alert ${newAlerts}/${maxAlerts}: missed yesterday's requirement for ${plan.name||'your investment'}`, 0, 'Alert');
          await saveState();
          showToast(`Alert ${newAlerts}/${maxAlerts}: you missed yesterday's requirement for ${plan.name||'your investment'}`, ICONS.warning);
        }
      } else {
        await update(ref(db, `user_investments/${state.uid}/${entryId}`), { lastEvalDateKey: todayKey });
      }
    }catch(e){ console.error(e); }
  }
}

function filterWork(cat){
  investmentWorkFilter = cat;
  document.querySelectorAll('.work-cat-btn').forEach(b=> b.classList.toggle('active', b.dataset.cat===cat));
  renderWorkItems(cat);
}

function renderWorkItems(cat){
  const wrap = document.getElementById('work-items');
  if (!wrap) return;

  if (cat === 'mine'){
    const wrapEl = document.getElementById('work-items');
    if (wrapEl) wrapEl.classList.remove('work-items-grid');
    const entries = Object.entries(USER_INVESTMENTS).filter(([id, e]) => e.status === 'active');
    if (entries.length === 0){
      wrap.innerHTML = `<div class="empty-state"><div class="empty-icon">${ICONS.inbox}</div><div class="empty-title">No investments yet</div><div class="empty-desc">Pick a plan below and make your first investment</div></div>`;
      return;
    }
    entries.sort((a,b)=> (b[1].startedAt||0) - (a[1].startedAt||0));
    wrap.innerHTML = entries.map(([id, e])=>{
      const plan = e.plan || {};
      const now = Date.now();
      const daysLeftNum = Math.max(0, Math.ceil((Number(e.expiresAt||0) - now)/(24*3600*1000)));
      const matured = now >= Number(e.expiresAt||0);
      const alerts = Number(e.alerts||0);
      return `<div class="work-item" onclick="openInvestmentProgress('${id}')">
        <div class="work-item-icon" style="background:#F1EEFF;padding:0;overflow:hidden;">
          <img src="${esc(plan.image||'')}" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display='none'">
        </div>
        <div class="work-item-info">
          <div class="work-item-title">${esc(plan.name||'')}</div>
          <div class="work-item-desc">${matured?'Matured':daysLeftNum+' day'+(daysLeftNum===1?'':'s')+' left'} · Entry ${fmt(e.entryFee)}${alerts>0?' · ⚠ '+alerts+' alert'+(alerts===1?'':'s'):''}</div>
        </div>
        <div class="work-item-right">
          <div class="work-item-reward">+${fmt(e.totalProfit)}</div>
          <div class="work-item-status status-progress">${matured?'Matured':'Active'}</div>
        </div>
      </div>`;
    }).join('');
    return;
  }

  if (!investmentPlansLoaded){
    wrap.innerHTML = `<div class="empty-state"><div class="empty-icon">${ICONS.inbox}</div><div class="empty-title">Loading plans...</div><div class="empty-desc">Please wait a moment</div></div>`;
    return;
  }

  let plans = INVESTMENT_PLANS;
  if (cat === 'free'){
    plans = plans.filter(p => Number(p.entryFee||0) === 0);
  } else if (cat === '7day'){
    plans = plans.filter(p => Number(p.durationDays||0) === 7);
  } else if (cat === '30day'){
    plans = plans.filter(p => Number(p.durationDays||0) === 30);
  }

  if (plans.length === 0){
    wrap.innerHTML = `<div class="empty-state"><div class="empty-icon">${ICONS.inbox}</div><div class="empty-title">No plans available</div><div class="empty-desc">Check back later for new investment plans</div></div>`;
    return;
  }

  wrap.classList.add('work-items-grid');
  wrap.innerHTML = plans.map(p=>{
    const invested = !!findActiveEntryForPlan(p.id);
    const eligible = userEligibleForPlan(p);
    const req = p.requirements || {};
    const reqLines = [];
    if (req.watchad) reqLines.push(`Watch ${Number(req.watchad.dailyTarget||0)} ad${Number(req.watchad.dailyTarget)===1?'':'s'}/day`);
    if (req.refer) reqLines.push(referReqLabel(req.refer));
    if (req.custom && req.custom.text) reqLines.push(`${esc(req.custom.text)} (${req.custom.mode==='daily'?'daily':'one-time'})`);
    const reqText = reqLines.length ? reqLines.join(' · ') : 'No extra requirements';
    let btnLabel = invested ? 'Invested' : (eligible ? 'Join' : 'Locked');
    const btnDisabled = invested || !eligible;
    const cardStateClass = invested ? 'is-invested' : (!eligible ? 'is-locked' : '');
    return `<div class="ip-plan-card ${cardStateClass}" onclick="openInvestmentDetail('${p.id}')">
      <div class="ip-plan-card-top">
        <div class="ip-plan-card-img">
          <img src="${esc(p.image||'')}" alt="" onerror="this.style.display='none'">
        </div>
        <div class="ip-plan-card-info">
          <div class="ip-plan-card-name">${esc(p.name||'')}</div>
          <div class="ip-plan-card-stats">
            <div class="ip-plan-card-stat"><span class="ip-plan-card-stat-label">Entry</span><span class="ip-plan-card-stat-value">${fmt(p.entryFee)}</span></div>
            <div class="ip-plan-card-stat"><span class="ip-plan-card-stat-label">Profit</span><span class="ip-plan-card-stat-value profit">${fmt(p.totalProfit)}</span></div>
          </div>
        </div>
        <button class="ip-plan-card-btn" ${btnDisabled?'disabled':''} onclick="event.stopPropagation(); openInvestmentDetail('${p.id}');">${btnLabel}</button>
      </div>
      <div class="ip-plan-card-req">${reqText}</div>
    </div>`;
  }).join('');
}

function openInvestmentDetail(planId){
  currentInvestmentDetailId = planId;
  renderInvestmentDetail(planId);
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById('screen-work-detail').classList.add('active');
}

function renderInvestmentDetail(planId){
  const wrap = document.getElementById('work-detail-content');
  if (!wrap) return;
  const p = INVESTMENT_PLANS.find(x => x.id === planId);
  if (!p){
    wrap.innerHTML = `<div class="empty-state"><div class="empty-icon">${ICONS.inbox}</div><div class="empty-title">Plan unavailable</div><div class="empty-desc">This investment plan is no longer active.</div></div>`;
    return;
  }
  const existing = findActiveEntryForPlan(planId);
  const req = p.requirements || {};
  const reqSteps = [];
  if (req.watchad){
    const dt = Number(req.watchad.dailyTarget||0), bs = Number(req.watchad.breakSeconds||0);
    reqSteps.push(`<div class="wd-step"><div class="wd-step-num">${ICONS.play}</div><div class="wd-step-text">Watch ${dt} ad${dt===1?'':'s'} per day (${bs}s between each ad) — resets daily</div></div>`);
  }
  if (req.refer){
    reqSteps.push(`<div class="wd-step"><div class="wd-step-num">${ICONS.people}</div><div class="wd-step-text">Bring ${esc(referReqLabel(req.refer))} (one-time)</div></div>`);
  }
  if (req.custom && req.custom.text){
    reqSteps.push(`<div class="wd-step"><div class="wd-step-num">${ICONS.tag}</div><div class="wd-step-text">${esc(req.custom.text)} (${req.custom.mode==='daily'?'daily':'one-time'})</div></div>`);
  }

  const eligible = userEligibleForPlan(p);
  let btnHtml;
  if (existing){
    btnHtml = `<button class="wd-action-btn" onclick="openInvestmentProgress('${esc(existing[0])}')">See Progress</button>`;
  } else if (!eligible){
    btnHtml = `<button class="wd-action-btn" disabled style="opacity:.5;">Requires ${esc(vipPlanNames(p))} plan</button>`;
  } else {
    btnHtml = `<button class="wd-action-btn" id="ip-entry-btn" onclick="enterInvestmentPlan('${esc(p.id)}')">Entry — ${fmt(p.entryFee)}</button>`;
  }

  wrap.innerHTML = `
    <div class="ip-detail-banner">
      <img class="ip-detail-banner-bg" src="${esc(p.image||'')}" alt="" aria-hidden="true" onerror="this.style.display='none'">
      <img class="ip-detail-banner-fg" src="${esc(p.image||'')}" alt="" onerror="this.style.display='none'">
    </div>
    <div class="wd-title">${esc(p.name||'')}</div>
    <div class="wd-plan-stats">
      <div class="wd-plan-stat"><div class="wd-plan-stat-label">Entry Fee</div><div class="wd-plan-stat-value">${fmt(p.entryFee)}</div></div>
      <div class="wd-plan-stat"><div class="wd-plan-stat-label">Total Profit</div><div class="wd-plan-stat-value">${fmt(p.totalProfit)}</div></div>
    </div>
    <div class="wd-desc">Duration <strong>${Number(p.durationDays||0)} day${Number(p.durationDays)===1?'':'s'}</strong>. Entry fee is deducted from your Deposit Balance.
    ${(p.vipPlans && p.vipPlans.length) ? `<br>Eligible plans: <strong>${esc(vipPlanNames(p))}</strong>` : ''}
    </div>
    <div class="section-title">Requirements</div>
    <div class="wd-steps">${reqSteps.length ? reqSteps.join('') : `<div class="wd-step"><div class="wd-step-text">No extra requirements — just the entry fee.</div></div>`}</div>
    ${btnHtml}
  `;
  if (!existing && eligible) initAdLockButton('ip-entry-btn');
}

async function enterInvestmentPlan(planId){
  if (investmentEntryBusy) return;
  if (isGuest){ showToast('Open this app from Telegram to invest', ICONS.warning); return; }
  const p = INVESTMENT_PLANS.find(x => x.id === planId);
  if (!p) return;
  if (findActiveEntryForPlan(planId)){ showToast('You already invested in this plan', ICONS.warning); return; }
  if (!userEligibleForPlan(p)){ showToast('Your current plan is not eligible for this investment', ICONS.warning); return; }
  const fee = Number(p.entryFee||0);
  if (Number(state.depositBalance||0) < fee){
    showToast('Insufficient deposit balance. Please deposit funds first.', ICONS.warning);
    return;
  }

  investmentEntryBusy = true;
  const btn = document.getElementById('ip-entry-btn');
  if (btn) btn.disabled = true;
  try{
    const adOk = await requireAdBeforeAction('ip-entry-btn');
    if (!adOk){ if (btn) btn.disabled = false; investmentEntryBusy = false; return; }
  }catch(e){ if (btn) btn.disabled = false; investmentEntryBusy = false; return; }
  showLoading(true);
  try{
    const now = Date.now();
    const durationDays = Number(p.durationDays||0);
    const entry = {
      planId: p.id,
      plan: {
        name: p.name || '',
        image: p.image || '',
        entryFee: fee,
        totalProfit: Number(p.totalProfit||0),
        durationDays: durationDays,
        requirements: p.requirements || {},
        maxAlerts: Number(p.maxAlerts||3),
        vipPlans: p.vipPlans || []
      },
      entryFee: fee,
      totalProfit: Number(p.totalProfit||0),
      durationDays: durationDays,
      startedAt: now,
      expiresAt: now + durationDays*24*3600*1000,
      status: 'active',
      alerts: 0,
      lastEvalDateKey: dailyLimitDateKey()
    };
    if (p.requirements && p.requirements.watchad){
      entry.watchAd = { dateKey: dailyLimitDateKey(), count: 0, lastWatchAt: 0 };
    }
    if (p.requirements && p.requirements.custom){
      if (p.requirements.custom.mode === 'daily') entry.customDaily = { dateKey: '', done: false };
      else entry.customDone = false;
    }
    const newRef = push(ref(db, `user_investments/${state.uid}`));
    await set(newRef, entry);

    state.depositBalance = Number(state.depositBalance||0) - fee;
    recomputeTotalBalance();
    addTransaction('withdraw', 'Invested in ' + (p.name||'Investment Plan'), -fee);
    await saveState();

    showLoading(false);
    haptic('medium');
    showToast(`Invested ${fmt(fee)} in ${p.name}!`, ICONS.chart);
    openInvestmentProgress(newRef.key);
  }catch(e){
    console.error(e);
    showLoading(false);
    showToast('Failed to enter plan, try again', ICONS.warning);
  }finally{
    investmentEntryBusy = false;
    if (btn) btn.disabled = false;
  }
}

function openInvestmentProgress(entryId){
  currentInvestmentEntryId = entryId;
  renderInvestmentProgress(entryId);
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById('screen-investment-progress').classList.add('active');
  ensureInvestmentProgressTicker();
}

function closeInvestmentProgress(){
  stopInvestmentProgressTicker();
  navigateTo('work');
}

function ensureInvestmentProgressTicker(){
  stopInvestmentProgressTicker();
  investmentProgressTicker = setInterval(()=>{
    if (currentInvestmentEntryId && document.getElementById('screen-investment-progress').classList.contains('active')){
      renderInvestmentProgress(currentInvestmentEntryId);
    } else {
      stopInvestmentProgressTicker();
    }
  }, 1000);
}
function stopInvestmentProgressTicker(){
  if (investmentProgressTicker){ clearInterval(investmentProgressTicker); investmentProgressTicker = null; }
}

function renderInvestmentProgress(entryId){
  const wrap = document.getElementById('investment-progress-content');
  if (!wrap) return;
  const entry = USER_INVESTMENTS[entryId];
  if (!entry){
    wrap.innerHTML = `<div class="empty-state"><div class="empty-icon">${ICONS.inbox}</div><div class="empty-title">Loading...</div><div class="empty-desc">Fetching your investment details</div></div>`;
    return;
  }
  const plan = entry.plan || {};
  const req = plan.requirements || {};
  const now = Date.now();
  const daysLeftNum = Math.max(0, Math.ceil((Number(entry.expiresAt||0) - now)/(24*3600*1000)));
  const matured = now >= Number(entry.expiresAt||0);
  const totalMs = Math.max(1, Number(entry.expiresAt||0) - Number(entry.startedAt||0));
  const elapsedMs = Math.min(totalMs, Math.max(0, now - Number(entry.startedAt||0)));
  const overallPct = Math.min(100, Math.round((elapsedMs/totalMs)*100));

  const alerts = Number(entry.alerts||0);
  const maxAlerts = Number(plan.maxAlerts||3);
  let alertBanner = '';
  if (entry.status === 'cancelled'){
    const refundMsg = (entry.refunded && Number(entry.refundAmount||0) > 0)
      ? `You received a refund of ${fmt(entry.refundAmount)} (${Math.round(Number(entry.refundPercent||0)*100)}%) to your Deposit Balance.`
      : `No refund for this plan.`;
    alertBanner = `<div class="ip-alert-banner ip-alert-danger">This investment was cancelled after missing the daily requirement ${alerts} time${alerts===1?'':'s'}. ${refundMsg} You can join a new investment any time.</div>`;
  } else if (alerts > 0){
    alertBanner = `<div class="ip-alert-banner">⚠ Alert ${alerts}/${maxAlerts}: you missed a previous day's requirement. ${maxAlerts-alerts} more miss${(maxAlerts-alerts)===1?'':'es'} will cancel this investment with no refund.</div>`;
  }

  let reqHtml = '';

  if (req.watchad){
    const today = dailyLimitDateKey();
    const wa = entry.watchAd || { dateKey: today, count: 0, lastWatchAt: 0 };
    const doneToday = wa.dateKey === today ? Number(wa.count||0) : 0;
    const target = Number(req.watchad.dailyTarget||0);
    const remaining = Math.max(0, target - doneToday);
    const pct = target > 0 ? Math.min(100, Math.round((doneToday/target)*100)) : 0;
    const breakMs = Number(req.watchad.breakSeconds||0)*1000;
    const cooldownLeft = (wa.dateKey === today && wa.lastWatchAt) ? Math.max(0, (wa.lastWatchAt + breakMs) - now) : 0;
    const hitTarget = doneToday >= target;
    const disabled = hitTarget || cooldownLeft > 0 || entry.status !== 'active';
    let btnLabel = 'Watch Ad';
    if (hitTarget) btnLabel = "Today's target complete";
    else if (cooldownLeft > 0) btnLabel = `Wait ${formatCountdown(cooldownLeft)}`;

    reqHtml += `
      <div class="ip-req-card">
        <div class="ip-req-top">
          <div class="ip-req-left">${ICONS.play} Watch Ad <span class="ip-req-daily-tag">Daily</span></div>
          <div class="ip-req-count">${doneToday}/${target}</div>
        </div>
        <div class="gmail-limit-bar-track"><div class="gmail-limit-bar-fill${hitTarget?' limit-full':''}" style="width:${pct}%;"></div></div>
        <div class="ip-req-remaining">${hitTarget ? "Today's target complete!" : remaining + ' ad' + (remaining===1?'':'s') + ' remaining today'} · Resets in ${formatCountdown(msUntilNextDailyReset())}</div>
        <button class="wd-action-btn" id="ip-watchad-btn" style="margin-top:12px;" ${disabled?'disabled':''} onclick="watchInvestmentAd('${esc(entryId)}')">${btnLabel}</button>
      </div>`;
  }

  if (req.refer){
    const { normalCount } = normalizeReferReq(req.refer);
    const parts = [];
    if (normalCount > 0) parts.push({ label: 'Refer', required: normalCount, current: (state.referrals||[]).length });
    parts.forEach(part => {
      const { label, required, current } = part;
      const done = Math.min(current, required);
      const remaining = Math.max(0, required - current);
      const pct = required > 0 ? Math.min(100, Math.round((done/required)*100)) : 0;
      const complete = current >= required;
      reqHtml += `
        <div class="ip-req-card">
          <div class="ip-req-top">
            <div class="ip-req-left">${ICONS.people} ${label} <span class="ip-req-onetime-tag">One-time</span></div>
            <div class="ip-req-count">${done}/${required}</div>
          </div>
          <div class="gmail-limit-bar-track"><div class="gmail-limit-bar-fill${complete?' limit-full':''}" style="width:${pct}%;"></div></div>
          <div class="ip-req-remaining">${complete ? 'Referral requirement complete!' : remaining + ' referral' + (remaining===1?'':'s') + ' remaining'}</div>
          ${complete ? '' : `<button class="wd-action-btn" style="margin-top:12px;" onclick="closeInvestmentProgress(); navigateTo('refer');">Invite Friends</button>`}
        </div>`;
    });
  }

  if (req.custom && req.custom.text){
    const isDaily = req.custom.mode === 'daily';
    if (isDaily){
      const today = dailyLimitDateKey();
      const cd = entry.customDaily || {};
      const doneToday = cd.dateKey === today && cd.done === true;
      reqHtml += `
        <div class="ip-req-card">
          <div class="ip-req-top"><div class="ip-req-left">${ICONS.tag} ${esc(req.custom.text)} <span class="ip-req-daily-tag">Daily</span></div></div>
          <div class="ip-req-remaining" style="margin-top:6px;">${doneToday ? 'Completed for today · resets in '+formatCountdown(msUntilNextDailyReset()) : 'Not completed today'}</div>
          <button class="wd-action-btn" style="margin-top:12px;" ${doneToday||entry.status!=='active'?'disabled':''} onclick="markInvestmentCustomDone('${esc(entryId)}')">${doneToday?'Done for today':'Mark Done'}</button>
        </div>`;
    } else {
      const done = entry.customDone === true;
      reqHtml += `
        <div class="ip-req-card">
          <div class="ip-req-top"><div class="ip-req-left">${ICONS.tag} ${esc(req.custom.text)} <span class="ip-req-onetime-tag">One-time</span></div></div>
          <div class="ip-req-remaining" style="margin-top:6px;">${done ? 'Completed' : 'Not completed yet'}</div>
          ${done?'':`<button class="wd-action-btn" style="margin-top:12px;" onclick="markInvestmentCustomDone('${esc(entryId)}')">Mark Done</button>`}
        </div>`;
    }
  }

  if (!reqHtml){
    reqHtml = `<div class="empty-state"><div class="empty-icon">${ICONS.inbox}</div><div class="empty-title">No requirements</div><div class="empty-desc">This plan only needed the entry fee.</div></div>`;
  }

  wrap.innerHTML = `
    <div class="ip-detail-banner">
      <img class="ip-detail-banner-bg" src="${esc(plan.image||'')}" alt="" aria-hidden="true" onerror="this.style.display='none'">
      <img class="ip-detail-banner-fg" src="${esc(plan.image||'')}" alt="" onerror="this.style.display='none'">
    </div>
    <div class="wd-title">${esc(plan.name||'')}</div>
    <div class="wd-plan-stats">
      <div class="wd-plan-stat"><div class="wd-plan-stat-label">Entry Fee</div><div class="wd-plan-stat-value">${fmt(entry.entryFee)}</div></div>
      <div class="wd-plan-stat"><div class="wd-plan-stat-label">Total Profit</div><div class="wd-plan-stat-value">${fmt(plan.totalProfit)}</div></div>
    </div>
    ${alertBanner}
    <div class="wd-desc">
      ${entry.status==='cancelled' ? (
        (entry.refunded && Number(entry.refundAmount||0) > 0)
          ? `<span style="color:var(--mint);font-weight:700;">Cancelled — Refunded ${fmt(entry.refundAmount)}</span>`
          : `<span style="color:var(--coral);font-weight:700;">Cancelled — no refund</span>`
      ) :
        matured ? `<span style="color:var(--mint);font-weight:700;">Matured — duration complete</span>` :
        `<strong>${daysLeftNum}</strong> day${daysLeftNum===1?'':'s'} left of ${Number(entry.durationDays||0)}`}
    </div>
    <div class="ip-overall-progress">
      <div class="ip-req-top"><div class="ip-req-left">Investment Progress</div><div class="ip-req-count">${overallPct}%</div></div>
      <div class="gmail-limit-bar-track"><div class="gmail-limit-bar-fill${overallPct>=100?' limit-full':''}" style="width:${overallPct}%;"></div></div>
    </div>
    <div class="section-title">Requirements Progress</div>
    ${reqHtml}
  `;
}

async function markInvestmentCustomDone(entryId){
  const entry = USER_INVESTMENTS[entryId];
  if (!entry || entry.status !== 'active') return;
  const req = (entry.plan && entry.plan.requirements && entry.plan.requirements.custom) || null;
  if (!req) return;
  try{
    if (req.mode === 'daily'){
      const today = dailyLimitDateKey();
      const cd = entry.customDaily || {};
      if (cd.dateKey === today && cd.done === true) return;
      await update(ref(db, `user_investments/${state.uid}/${entryId}/customDaily`), { dateKey: today, done: true });
    } else {
      if (entry.customDone === true) return;
      await update(ref(db, `user_investments/${state.uid}/${entryId}`), { customDone: true });
    }
    haptic('light');
    showToast('Marked complete', ICONS.success);
  }catch(e){
    console.error(e);
    showToast('Failed, try again', ICONS.warning);
  }
}

function watchInvestmentAd(entryId){
  if (investmentWatchBusy) return;
  if (isGuest){ showToast('Open this app from Telegram to watch ads', ICONS.warning); return; }
  const entry = USER_INVESTMENTS[entryId];
  if (!entry || entry.status !== 'active' || !entry.plan || !entry.plan.requirements || !entry.plan.requirements.watchad) return;
  const req = entry.plan.requirements.watchad;
  const today = dailyLimitDateKey();
  const wa = entry.watchAd || { dateKey: today, count: 0, lastWatchAt: 0 };
  const doneToday = wa.dateKey === today ? Number(wa.count||0) : 0;
  const now = Date.now();
  const breakMs = Number(req.breakSeconds||0)*1000;
  if (doneToday >= Number(req.dailyTarget||0)){ showToast("Today's ad target already complete", ICONS.warning); return; }
  if (wa.dateKey === today && wa.lastWatchAt && (now - wa.lastWatchAt) < breakMs){ showToast('Please wait before watching the next ad', ICONS.warning); return; }
  if (!req.adUrl){ showToast('Ad not configured for this plan yet', ICONS.warning); return; }
  openInvestmentAdIframe(entryId, req.adUrl);
}

function openInvestmentAdIframe(entryId, url){
  currentAdIframeEntryId = entryId;
  const overlay = document.getElementById('investment-ad-overlay');
  const frame = document.getElementById('investment-ad-iframe');
  const closeBtn = document.getElementById('investment-ad-close-btn');
  const countEl = document.getElementById('investment-ad-countdown');
  if (!overlay || !frame || !closeBtn || !countEl) return;
  frame.src = url;
  closeBtn.disabled = true;
  closeBtn.classList.remove('ready');
  overlay.classList.add('show');
  let secondsLeft = 15;
  countEl.textContent = secondsLeft;
  if (adIframeCountdownTimer) clearInterval(adIframeCountdownTimer);
  adIframeCountdownTimer = setInterval(()=>{
    secondsLeft -= 1;
    if (secondsLeft <= 0){
      clearInterval(adIframeCountdownTimer);
      adIframeCountdownTimer = null;
      countEl.textContent = '0';
      closeBtn.disabled = false;
      closeBtn.classList.add('ready');
    } else {
      countEl.textContent = secondsLeft;
    }
  }, 1000);
}

async function closeInvestmentAdIframe(confirmed){
  const overlay = document.getElementById('investment-ad-overlay');
  const frame = document.getElementById('investment-ad-iframe');
  const closeBtn = document.getElementById('investment-ad-close-btn');
  if (adIframeCountdownTimer){ clearInterval(adIframeCountdownTimer); adIframeCountdownTimer = null; }

  if (!confirmed || !closeBtn || closeBtn.disabled){
    if (overlay) overlay.classList.remove('show');
    if (frame) frame.src = 'about:blank';
    currentAdIframeEntryId = null;
    return;
  }

  const entryId = currentAdIframeEntryId;
  if (overlay) overlay.classList.remove('show');
  if (frame) frame.src = 'about:blank';
  currentAdIframeEntryId = null;
  if (!entryId) return;

  investmentWatchBusy = true;
  showLoading(true);
  try{
    const waRef = ref(db, `user_investments/${state.uid}/${entryId}/watchAd`);
    await runTransaction(waRef, (current) => {
      const todayKey = dailyLimitDateKey();
      const liveEntry = USER_INVESTMENTS[entryId] || {};
      const target = Number(((liveEntry.plan && liveEntry.plan.requirements && liveEntry.plan.requirements.watchad) || {}).dailyTarget || 0);
      if (!current || current.dateKey !== todayKey){
        return { dateKey: todayKey, count: 1, lastWatchAt: Date.now() };
      }
      if (Number(current.count||0) >= target) return current;
      return { dateKey: todayKey, count: Number(current.count||0)+1, lastWatchAt: Date.now() };
    });
    showLoading(false);
    haptic('medium');
    showToast('Ad watched! Progress updated.', ICONS.success);
  }catch(e){
    console.error(e);
    showLoading(false);
    showToast('Failed to record ad watch, try again', ICONS.warning);
  }finally{
    investmentWatchBusy = false;
    renderInvestmentProgress(entryId);
  }
}



function deductFromBalances(amt){
  let remaining = amt;
  const buckets = ['EarningBalance','referBalance'];
  for (const b of buckets){
    if (remaining <= 0) break;
    const avail = state[b] || 0;
    const take = Math.min(avail, remaining);
    state[b] = avail - take;
    remaining -= take;
  }
  recomputeTotalBalance();
}


function deductFromBalancesWithDeposit(amt){
  let remaining = amt;
  const buckets = ['EarningBalance','referBalance','depositBalance'];
  for (const b of buckets){
    if (remaining <= 0) break;
    const avail = state[b] || 0;
    const take = Math.min(avail, remaining);
    state[b] = avail - take;
    remaining -= take;
  }
  recomputeTotalBalance();
}

const TX_ICON = { deposit:{icon:ICONS.plus, bg:'#DFF6EE'}, withdraw:{icon:ICONS.minus, bg:'#FFE9E6'}, earn:{icon:ICONS.coin, bg:'#EDEBFF'}, mining:{icon:ICONS.cart, bg:'#DFF6EE'}, watchad:{icon:ICONS.megaphone||ICONS.coin, bg:'#FFEAEA'} };

function renderTransactions(tab){
  if (!state) return;
  document.getElementById('trans-balance').textContent = fmt(state.totalBalance);
  const wrap = document.getElementById('transaction-list');
  const list = state.transactions.filter(t => tab==='all' || t.type===tab);
  if (list.length===0){
    wrap.innerHTML = `<div class="empty-state"><div class="empty-icon">${ICONS.card}</div><div class="empty-title">No transactions</div><div class="empty-desc">Your history will show up here</div></div>`;
    return;
  }
  wrap.innerHTML = list.map((t, idx)=>{
    const style = TX_ICON[t.type] || TX_ICON.earn;
    const pos = t.amount >= 0;
    const amountText = fmt(t.amount);
    const viewBtn = t.socialBuy
      ? `<button class="tx-view-btn" onclick="viewSocialBuyTransaction(${idx})">View</button>`
      : '';
    return `<div class="tx-row">
      <div class="tx-icon" style="background:${style.bg};">${style.icon}</div>
      <div class="tx-info"><div class="tx-title">${t.title}</div><div class="tx-date">${t.date}</div></div>
      <div style="text-align:right;">
        <div class="tx-amount ${pos?'pos':'neg'}">${pos?'+':''}${amountText}</div>
        <div class="tx-status"><span class="status-pill status-${(t.status||'Completed').toLowerCase()}">${t.status||'Completed'}</span></div>
        ${viewBtn}
      </div>
    </div>`;
  }).join('');
}

// Shows the saved credentials for a previously bought Gmail/Facebook account
// by reusing the existing purchase-success modal. idx is the index of the
// transaction within the currently rendered/filtered list.
function viewSocialBuyTransaction(idx){
  const tab = document.querySelector('.trans-tab.active');
  const tabId = tab ? tab.dataset.tab : 'all';
  const list = state.transactions.filter(t => tabId==='all' || t.type===tabId);
  const t = list[idx];
  if (!t || !t.socialBuy){ showToast('Details not available', ICONS.warning); return; }
  document.getElementById('social-buy-success-id').value = t.accountId || '';
  document.getElementById('social-buy-success-password').value = t.accountPassword || '';
  document.getElementById('social-buy-success-cookies').value = t.accountCookiesMasked || '';
  document.getElementById('social-buy-success-cookies').parentElement.style.display = t.socialType === 'facebook' && t.accountCookiesMasked ? 'flex' : 'none';
  document.getElementById('social-buy-success-overlay').classList.add('show');
}
function switchTransTab(tab){
  document.querySelectorAll('.trans-tab').forEach(b=> b.classList.toggle('active', b.dataset.tab===tab));
  renderTransactions(tab);
}

function setAmount(fieldId, val){
  document.getElementById(fieldId).value = val;
  if (fieldId === 'deposit-amount') onDepositAmountChange();
  if (fieldId === 'withdraw-amount') onWithdrawAmountChange();
}
function selectMethod(el, groupId){
  document.querySelectorAll('#'+groupId+' > *').forEach(m=> m.classList.remove('selected'));
  el.classList.add('selected');
}


async function submitDeposit(){
  if (depositSubmitting) return;
  const atrAmt = parseFloat(document.getElementById('deposit-amount').value);
  const txid = document.getElementById('deposit-txid').value.trim();
  if (!selectedDepositMethod){ showToast('Select a deposit method', ICONS.warning); return; }
  if (!atrAmt || atrAmt <= 0){ showToast('Enter a valid amount', ICONS.warning); return; }
  if (!(methodRate(selectedDepositMethod) > 0)){ showToast('This deposit method has no valid AENVA conversion rate', ICONS.warning); return; }
  if (atrAmt < (selectedDepositMethod.min||0)){ showToast(`Minimum deposit is ${fmt(selectedDepositMethod.min)}`, ICONS.warning); return; }
  if (selectedDepositMethod.max && atrAmt > selectedDepositMethod.max){ showToast(`Maximum deposit is ${fmt(selectedDepositMethod.max)}`, ICONS.warning); return; }
  if (!txid){ showToast('Transaction ID / proof is required', ICONS.warning); return; }

  depositSubmitting = true;
  document.getElementById('deposit-submit-btn').disabled = true;
  showLoading(true);
  try{
    if (isGuest){
      showLoading(false);
      showToast('Deposits require a Telegram account — open this app from Telegram', ICONS.warning);
      depositSubmitting = false;
      document.getElementById('deposit-submit-btn').disabled = false;
      return;
    }
    const adOk = await requireAdBeforeAction('deposit-submit-btn');
    if (!adOk){
      showLoading(false);
      depositSubmitting = false;
      document.getElementById('deposit-submit-btn').disabled = false;
      return;
    }
    const payAmount = getDepositPayAmount(atrAmt); // payment amount in the selected method's currency

    const reqRef = push(ref(db, 'deposit_requests'));
    const reqId = reqRef.key;
    const record = {
      uid: state.uid,
      method: selectedDepositMethod.name,
      methodId: selectedDepositMethod.id,
      amount: atrAmt,            // AENVA credited to balance on approval
      atrRate: methodRate(selectedDepositMethod), // rate at time of request (audit trail)
      paymentCurrency: methodCurrency(selectedDepositMethod),
      depositFeePercent: DEPOSIT_FEE_PERCENT,
      payAmount: payAmount,      // amount to send in the selected method's currency
      couponCode: appliedDepositCoupon ? appliedDepositCoupon.code : null,
      couponDiscount: appliedDepositCoupon ? appliedDepositCoupon.discount : 0,
      txid: txid,
      status: 'pending',
      createdAt: Date.now()
    };

    addTransaction('deposit', 'Deposit Request (' + selectedDepositMethod.name + ')' + (appliedDepositCoupon ? ` [${appliedDepositCoupon.code} -${appliedDepositCoupon.discount}%]` : ''), atrAmt, 'Pending', reqId);


    const updates = {};
    updates['deposit_requests/' + reqId] = record;
    updates['users/' + state.uid + '/transactions'] = state.transactions;
    await update(ref(db), updates);

    if (appliedDepositCoupon) await markCouponUsed(appliedDepositCoupon.code, state.uid);

    track('deposits', 1);
    track('revenue', atrAmt);

    showLoading(false);
    haptic('medium');
    showToast(`Deposit request of ${fmt(atrAmt)} submitted — send ${coinFmt(payAmount)} ${methodCurrency(selectedDepositMethod)} to complete`, ICONS.hourglass);
    document.getElementById('deposit-amount').value = '';
    document.getElementById('deposit-txid').value = '';
    removeDepositCoupon();
    closeOverlay();
    renderHome();
  }catch(e){
    console.error(e);
    showLoading(false);
    showToast('Failed to submit deposit request', ICONS.warning);
  }finally{
    depositSubmitting = false;
  }
}

async function submitWithdraw(){
  if (withdrawSubmitting) return;
  const amt = parseFloat(document.getElementById('withdraw-amount').value);
  const addr = document.getElementById('withdraw-address').value.trim();
  if (!selectedWithdrawMethod){ showToast('Select a withdrawal method', ICONS.warning); return; }
  if (!(methodRate(selectedWithdrawMethod) > 0)){ showToast('This withdrawal method has no valid AENVA conversion rate', ICONS.warning); return; }
  if (!amt || amt <= 0){ showToast('Enter a valid amount', ICONS.warning); return; }
  if (amt < (selectedWithdrawMethod.min||0)){ showToast(`Minimum withdraw is ${fmt(selectedWithdrawMethod.min)}`, ICONS.warning); return; }
  if (selectedWithdrawMethod.max && amt > selectedWithdrawMethod.max){ showToast(`Maximum withdraw is ${fmt(selectedWithdrawMethod.max)}`, ICONS.warning); return; }
  if (amt > withdrawableBalance()){ showToast('Insufficient balance', ICONS.warning); return; }
  if (!addr){ showToast('Enter a wallet/account address', ICONS.warning); return; }

  if (isGuest){
    showToast('Withdrawals require a Telegram account — open this app from Telegram', ICONS.warning);
    return;
  }

  withdrawSubmitting = true;
  document.getElementById('withdraw-submit-btn').disabled = true;
  try{
    const adOk = await requireAdBeforeAction('withdraw-submit-btn');
    if (!adOk){ document.getElementById('withdraw-submit-btn').disabled = false; withdrawSubmitting = false; return; }
  }catch(e){ document.getElementById('withdraw-submit-btn').disabled = false; withdrawSubmitting = false; return; }
  showLoading(true);
  try{

    const balancesBefore = {
      referBalance: state.referBalance,
      EarningBalance: state.EarningBalance,
      depositBalance: state.depositBalance,
      totalBalance: state.totalBalance
    };
    const transactionsBefore = state.transactions.slice();

    deductFromBalances(amt);


    const feeAmount = Number((amt * (WITHDRAW_FEE_PERCENT||0) / 100).toFixed(2));
    const totalAmount = getWithdrawTotalAmount(amt); // net AENVA after fee + coupon bonus
    const bonusAmount = Number((totalAmount - (amt - feeAmount)).toFixed(2));
    const payoutAmount = withdrawPayoutCoin(totalAmount, selectedWithdrawMethod);

    const reqRef = push(ref(db, 'withdraw_requests'));
    const reqId = reqRef.key;
    const record = {
      uid: state.uid,
      method: selectedWithdrawMethod.name,
      methodId: selectedWithdrawMethod.id,
      amount: totalAmount,       // net AENVA the user should be paid out
      payoutAmount: payoutAmount, // native payout amount for the selected withdrawal method
      payoutCurrency: methodCurrency(selectedWithdrawMethod),
      baseAmount: amt,           // full AENVA deducted from balance
      feePercent: WITHDRAW_FEE_PERCENT,
      feeAmount: feeAmount,
      atrRate: methodRate(selectedWithdrawMethod),
      bonusAmount: bonusAmount,
      couponCode: appliedWithdrawCoupon ? appliedWithdrawCoupon.code : null,
      couponBonusPercent: appliedWithdrawCoupon ? appliedWithdrawCoupon.discount : 0,
      address: addr,
      status: 'pending',
      createdAt: Date.now()
    };

    addTransaction('withdraw', 'Withdrawal Request (' + selectedWithdrawMethod.name + ')' + (appliedWithdrawCoupon ? ` [${appliedWithdrawCoupon.code} +${appliedWithdrawCoupon.discount}%]` : ''), -amt, 'Pending', reqId);


    const updates = {};
    updates['withdraw_requests/' + reqId] = record;
    updates['users/' + state.uid + '/referBalance'] = state.referBalance;
    updates['users/' + state.uid + '/EarningBalance'] = state.EarningBalance;
    updates['users/' + state.uid + '/depositBalance'] = state.depositBalance;
    updates['users/' + state.uid + '/totalBalance'] = state.totalBalance;
    updates['users/' + state.uid + '/transactions'] = state.transactions;


    await addReferralCommissionToUpdates(updates, amt);

    await update(ref(db), updates);

    if (appliedWithdrawCoupon) await markCouponUsed(appliedWithdrawCoupon.code, state.uid);

    track('withdrawals', 1);

    showLoading(false);
    haptic('medium');
    showToast(`Withdrawal requested! You'll receive ${fmt(totalAmount)} — ${coinFmt(payoutAmount)} ${methodCurrency(selectedWithdrawMethod)} after ${WITHDRAW_FEE_PERCENT}% fee`, ICONS.hourglass);
    document.getElementById('withdraw-amount').value = '';
    document.getElementById('withdraw-address').value = '';
    removeWithdrawCoupon();
    closeOverlay();
    renderHome();
  }catch(e){
    console.error(e);


    if (typeof balancesBefore !== 'undefined'){
      state.referBalance = balancesBefore.referBalance;
      state.EarningBalance = balancesBefore.EarningBalance;
      state.depositBalance = balancesBefore.depositBalance;
      state.totalBalance = balancesBefore.totalBalance;
    }
    if (typeof transactionsBefore !== 'undefined'){
      state.transactions = transactionsBefore;
    }
    showLoading(false);
    showToast('Failed to submit withdrawal request', ICONS.warning);
  }finally{
    withdrawSubmitting = false;
  }
}


// ============================================================
// ---- Shared "watch ad before action" gate ----
// Dispatches to whichever ad network the admin has switched ON (settings/adNetwork.active):
// Monetag (libtl.com show_ZONE()), Adsgram (AdController.show()), or GigaPub (window.showGiga()).
// Used by every user-facing action button (daily bonus, gmail/facebook submit, exchange,
// gift claim, withdraw, deposit confirm, plan purchase, investment join) so the action only
// runs after a rewarded ad actually completes. If the ad SDK is unavailable or the
// user closes/skips the ad, the action is blocked and the user sees a toast — no silent bypass.
function showRewardedAdGate(){
  return new Promise((resolve, reject) => {
    try{
      if (ACTIVE_AD_NETWORK === 'adsgram'){
        if (!ADSGRAM_CONTROLLER){ reject(new Error('ad sdk unavailable')); return; }
        ADSGRAM_CONTROLLER.show().then(() => resolve(true)).catch((e) => reject(e || new Error('ad failed')));
        return;
      }
      if (ACTIVE_AD_NETWORK === 'gigapub'){
        if (typeof window.showGiga !== 'function'){ reject(new Error('ad sdk unavailable')); return; }
        window.showGiga().then(() => resolve(true)).catch((e) => reject(e || new Error('ad failed')));
        return;
      }
      // default / 'monetag'
      const fn = window[MONETAG_ZONE_FUNC];
      if (typeof fn !== 'function'){ reject(new Error('ad sdk unavailable')); return; }
      fn().then(() => resolve(true)).catch((e) => reject(e || new Error('ad failed')));
    }catch(e){ reject(e); }
  });
}

// ---- 9-button ad-lock UX ----
// Every gated button starts LOCKED (small lock badge visible, dimmed label).
// Tap 1: plays the active network's rewarded ad, then UNLOCKS the button (lock badge disappears)
//        — the underlying action does NOT run yet, so the caller returns early.
// Tap 2: action runs immediately (no ad this time, already earned), then the button RE-LOCKS
//        with a small pop animation, ready for next time.
const adUnlockedButtons = {};

function ensureAdLockBadge(btn){
  if (!btn || btn.dataset.adLockReady === '1') return;
  btn.dataset.adLockReady = '1';
  const label = btn.innerHTML;
  btn.dataset.adLockRealLabel = label;
  btn.title = 'Tap to watch an ad first — the button unlocks after, then tap again to perform the action.';
  btn.innerHTML = `<span class="ad-lock-label">${label}</span>`;
  applyAdLockButtonState(btn, true);
}

// For buttons whose text is rewritten on every render (e.g. Claim/Claimed), call this instead of
// touching textContent/innerHTML directly — it keeps the lock badge intact.
function setAdLockButtonLabel(btnId, text){
  const btn = document.getElementById(btnId);
  if (!btn) return;
  ensureAdLockBadge(btn);
  btn.dataset.adLockRealLabel = text;
  const locked = btn.classList.contains('ad-locked');
  applyAdLockButtonState(btn, locked);
}

// Swaps the visible button content between the "locked" state (ad icon + Watch 1 Ad to Process)
// and the "unlocked" state (the button's real action label, e.g. Claim Now / Submit / Done).
function applyAdLockButtonState(btn, locked){
  const label = btn.querySelector('.ad-lock-label');
  if (locked){
    btn.innerHTML = `<span class="ad-lock-badge">${ICONS.megaphone}</span><span class="ad-lock-label">Watch 1 Ad to Process</span>`;
  } else {
    btn.innerHTML = `<span class="ad-lock-label">${btn.dataset.adLockRealLabel || (label ? label.innerHTML : btn.innerHTML)}</span>`;
  }
}

function setAdLockVisual(btnId, locked){
  const btn = document.getElementById(btnId);
  if (!btn) return;
  ensureAdLockBadge(btn);
  applyAdLockButtonState(btn, locked);
  if (locked){
    // restart the pop animation even if the class was already present
    btn.classList.remove('ad-locked');
    void btn.offsetWidth;
    btn.classList.add('ad-locked');
  } else {
    btn.classList.remove('ad-locked');
  }
}

// Watches `adsNeeded` sequential rewarded ads before allowing an action (used
// by mining claim, where admin sets both how many ads (adsToClaim) and the
// break/cooldown in seconds between each ad (breakSeconds) per model).
// Tracks progress in adMultiProgress[btnId] so a partial run survives re-renders,
// and nextAdAllowedAt[btnId] enforces the break time between ad watches —
// mirrors the same break-time pattern used by Watch Ad earn and Investment Plans.
let adMultiProgress = {};
let nextAdAllowedAt = {};
let adBreakTicker = {};
function clearAdBreakTicker(btnId){
  if (adBreakTicker[btnId]){ clearInterval(adBreakTicker[btnId]); delete adBreakTicker[btnId]; }
}
function startAdBreakTicker(btnId, adsNeeded){
  clearAdBreakTicker(btnId);
  adBreakTicker[btnId] = setInterval(() => {
    const btn = document.getElementById(btnId);
    const until = nextAdAllowedAt[btnId] || 0;
    const left = until - Date.now();
    if (!btn){ clearAdBreakTicker(btnId); return; }
    if (left <= 0){
      clearAdBreakTicker(btnId);
      setAdLockVisual(btnId, false);
      const done = adMultiProgress[btnId] || 0;
      btn.disabled = false;
      setAdLockButtonLabel(btnId, `Watch Ad ${done + 1}/${adsNeeded} to Claim`);
      return;
    }
    btn.disabled = true;
    setAdLockButtonLabel(btnId, `Wait ${formatCountdown(left)}`);
  }, 1000);
}
// Buttons in this set render their OWN persistent progress bar + "watched X/Y" count +
// live countdown (see startMiningClaimAdTicker / miningRenderBuyAdProgress), so this shared
// helper must not also slap the generic lock-badge markup on them or fire duplicate toasts —
// that was the "toast instead of a real progress UI" bug. Everything else keeps the old
// lock-badge + toast behaviour unchanged.
const AD_FLOW_HAS_OWN_UI = new Set(['mining-claim-btn']);

async function requireMultipleAdsBeforeAction(btnId, adsNeeded, breakSeconds){
  adsNeeded = Math.max(1, Number(adsNeeded) || 1);
  breakSeconds = Math.max(0, Number(breakSeconds) || 0);
  if (adsNeeded <= 1 && breakSeconds <= 0 && !AD_FLOW_HAS_OWN_UI.has(btnId)) return requireAdBeforeAction(btnId);
  const hasOwnUi = AD_FLOW_HAS_OWN_UI.has(btnId);

  const done = adMultiProgress[btnId] || 0;
  if (done >= adsNeeded){
    delete adMultiProgress[btnId];
    delete nextAdAllowedAt[btnId];
    clearAdBreakTicker(btnId);
    if (!hasOwnUi) setAdLockVisual(btnId, true);
    return true;
  }
  // Enforce the break time between ads — block early taps with a live countdown.
  const waitUntil = nextAdAllowedAt[btnId] || 0;
  const waitLeft = waitUntil - Date.now();
  if (waitLeft > 0){
    if (!hasOwnUi){
      showToast(`Wait ${formatCountdown(waitLeft)} before the next ad`, ICONS.hourglass);
      startAdBreakTicker(btnId, adsNeeded);
    }
    return false;
  }
  try{
    await showRewardedAdGate();
    adMultiProgress[btnId] = done + 1;
    const remaining = adsNeeded - adMultiProgress[btnId];
    if (remaining > 0){
      if (breakSeconds > 0){
        nextAdAllowedAt[btnId] = Date.now() + breakSeconds * 1000;
        if (!hasOwnUi){
          showToast(`Ad ${adMultiProgress[btnId]}/${adsNeeded} watched — wait ${breakSeconds}s for the next ad`, ICONS.bolt);
          startAdBreakTicker(btnId, adsNeeded);
        }
      } else if (!hasOwnUi){
        setAdLockVisual(btnId, false);
        showToast(`Ad ${adMultiProgress[btnId]}/${adsNeeded} watched — ${remaining} more to go`, ICONS.bolt);
      }
      return false;
    }
    delete nextAdAllowedAt[btnId];
    clearAdBreakTicker(btnId);
    if (!hasOwnUi){
      setAdLockVisual(btnId, false);
      showToast(`All ${adsNeeded} ads watched — tap again to claim`, ICONS.bolt);
    }
    return false;
  }catch(e){
    showToast('Watch the full ad to continue', ICONS.warning);
    return false;
  }
}

async function requireAdBeforeAction(btnId){
  // Second tap of a lock-gated button: consume the unlock, let the action run, then re-lock.
  if (btnId && adUnlockedButtons[btnId]){
    delete adUnlockedButtons[btnId];
    setAdLockVisual(btnId, true);
    return true;
  }
  try{
    // Tell the user up front, before the ad even opens, exactly what is about to happen:
    // an ad will play now; watching it fully will unlock this button; then they need to
    // tap it again to actually perform the action.
    await showRewardedAdGate();
    if (btnId){
      // First tap: ad watched — unlock the button and stop here; user taps again to fire the action.
      adUnlockedButtons[btnId] = true;
      setAdLockVisual(btnId, false);
      showToast('Ad watched — tap again to continue', ICONS.bolt);
      return false;
    }
    return true;
  }catch(e){
    showToast('Watch the full ad to continue', ICONS.warning);
    return false;
  }
}

let AD_CAMPAIGNS_CACHE = [];
let adListenerStarted = false;
let adRequestSubmitting = false;
let adActionBusy = false;
let adCountdownInterval = null;

function openAdCampaign(){
  document.getElementById('ad-image-link').value = '';
  document.getElementById('ad-days').value = '';
  document.getElementById('ad-amount').value = '';
  document.getElementById('ad-balance').textContent = fmt(state.depositBalance || 0);
  startAdListener();
  renderAdCampaigns();
  openOverlay('ad');
}

function startAdListener(){
  if (adListenerStarted || isGuest) return;
  adListenerStarted = true;
  onValue(ref(db, 'adCampaignRequests'), snap => {
    const val = snap.exists() ? snap.val() : {};
    AD_CAMPAIGNS_CACHE = Object.keys(val)
      .map(id => ({ id, ...val[id] }))
      .filter(c => c.uid === state.uid)
      .sort((a,b) => (b.createdAt||0) - (a.createdAt||0));
    if (currentScreen === 'home') renderHome();
    if (document.getElementById('screen-ad') && document.getElementById('screen-ad').classList.contains('active')){
      renderAdCampaigns();
    }
  });
}

function daysRemaining(c){
  if (c.status !== 'published' || !c.startedAt || !c.days) return null;
  const elapsedMs = Date.now() - c.startedAt;
  const totalMs = Number(c.days) * 24 * 60 * 60 * 1000;
  const remainMs = totalMs - elapsedMs;
  if (remainMs <= 0) return 0;
  return Math.ceil(remainMs / (24 * 60 * 60 * 1000));
}

function renderAdCampaigns(){
  document.getElementById('ad-balance').textContent = fmt(state.depositBalance || 0);
  const wrap = document.getElementById('ad-campaigns-list');
  if (!wrap) return;
  if (AD_CAMPAIGNS_CACHE.length === 0){
    wrap.innerHTML = `<div class="empty-state"><div class="empty-icon">${ICONS.megaphone}</div><div class="empty-title">No campaigns yet</div><div class="empty-desc">Send your first campaign request above</div></div>`;
    return;
  }
  wrap.innerHTML = AD_CAMPAIGNS_CACHE.map(c => {
    const status = c.status || 'pending';
    const statusLabel = {
      pending: 'Pending',
      replied: 'Awaiting Your Response',
      waiting_publish: 'Waiting for Publish',
      published: 'Active',
      rejected: 'Rejected'
    }[status] || status;
    const pillClass = status === 'published' ? 'status-approved'
      : status === 'rejected' ? 'status-rejected'
      : status === 'waiting_publish' ? 'status-waiting'
      : 'status-pending';
    const remain = daysRemaining(c);
    const totalDays = Number(c.days) || 0;
    const progressPct = (status === 'published' && remain !== null && totalDays > 0)
      ? Math.max(0, Math.min(100, Math.round(((totalDays - remain) / totalDays) * 100)))
      : 0;

    let progressHtml = '';
    if (status === 'published'){
      progressHtml = `
        <div class="ad-campaign-remain">${remain === 0 ? 'Campaign ended' : `${remain} of ${totalDays} day${totalDays===1?'':'s'} remaining`}</div>
        <div class="ad-campaign-progress"><div class="ad-campaign-progress-bar" style="width:${progressPct}%;"></div></div>
        <div class="ad-campaign-live-msg">${ICONS.success} Ad campaign started successfully</div>`;
    } else if (status === 'waiting_publish'){
      progressHtml = `<div class="ad-campaign-waiting-msg">Waiting for publish — admin will start your campaign shortly.</div>`;
    }

    const noteHtml = c.adminNote
      ? `<div class="ad-admin-note"><div class="ad-admin-note-label">Management Team Reply</div>${escapeHtml(c.adminNote)}</div>`
      : '';

    const actionsHtml = status === 'replied'
      ? `<div class="ad-campaign-actions">
           <button class="ad-accept-btn" onclick="acceptAdCampaign('${c.id}')">Accept</button>
           <button class="ad-reject-btn" onclick="rejectAdCampaign('${c.id}')">Reject</button>
         </div>`
      : '';

    return `<div class="ad-campaign-card">
      <div class="ad-campaign-top">
        <img class="ad-campaign-thumb" src="${escapeHtml(c.imageLink||'')}" alt="" loading="lazy" onerror="this.style.visibility='hidden';">
        <div class="ad-campaign-info">
          <div class="ad-campaign-days">${escapeHtml(c.name||'Campaign')} <span class="status-pill ${pillClass}">${statusLabel}</span></div>
          <div class="ad-campaign-amount">${c.target === 'event' ? 'Event' : c.target === 'ad' ? 'Ad' : 'Task'} · ${c.days || '--'} day${Number(c.days)===1?'':'s'} · ${fmt(c.amount||0)}</div>
          ${c.link ? `<div class="ad-campaign-link">${escapeHtml(c.link)}</div>` : ''}
          <div class="ad-campaign-date">${c.createdAt ? new Date(c.createdAt).toLocaleString('en-US',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}) : ''}</div>
        </div>
      </div>
      ${noteHtml}
      ${progressHtml}
      ${actionsHtml}
    </div>`;
  }).join('');


  if (AD_CAMPAIGNS_CACHE.some(c => c.status === 'published') && !adCountdownInterval){
    adCountdownInterval = setInterval(() => {
      if (document.getElementById('screen-ad') && document.getElementById('screen-ad').classList.contains('active')){
        renderAdCampaigns();
      } else {
        clearInterval(adCountdownInterval);
        adCountdownInterval = null;
      }
    }, 60000);
  }
}

async function submitAdCampaignRequest(){
  if (adRequestSubmitting) return;
  const name = document.getElementById('ad-name').value.trim();
  const target = document.getElementById('ad-target').value;
  const link = document.getElementById('ad-link').value.trim();
  const imageLink = document.getElementById('ad-image-link').value.trim();
  const days = parseInt(document.getElementById('ad-days').value, 10);
  const amount = parseFloat(document.getElementById('ad-amount').value);

  if (!name){ showToast('Enter a campaign name', ICONS.warning); return; }
  if (!link){ showToast('Enter the action/direct link', ICONS.warning); return; }
  if (!imageLink){ showToast('Enter the ad image link', ICONS.warning); return; }
  if (!days || days < 1){ showToast('Enter a valid number of days', ICONS.warning); return; }
  if (!amount || amount <= 0){ showToast('Enter a valid amount', ICONS.warning); return; }
  if (isGuest){ showToast('Open this app from Telegram to request a campaign', ICONS.warning); return; }

  adRequestSubmitting = true;
  const btn = document.getElementById('ad-request-btn');
  btn.disabled = true;
  showLoading(true);
  try{
    await push(ref(db, 'adCampaignRequests'), {
      uid: state.uid,
      name,
      target,
      link,
      imageLink,
      days,
      amount,
      status: 'pending',
      adminNote: '',
      createdAt: Date.now()
    });
    document.getElementById('ad-name').value = '';
    document.getElementById('ad-link').value = '';
    document.getElementById('ad-image-link').value = '';
    document.getElementById('ad-days').value = '';
    document.getElementById('ad-amount').value = '';
    showLoading(false);
    haptic('medium');
    showToast('Campaign request sent to admin', ICONS.megaphone);
  }catch(e){
    console.error(e);
    showLoading(false);
    showToast('Failed to send request, try again', ICONS.warning);
  }finally{
    adRequestSubmitting = false;
    btn.disabled = false;
  }
}


async function acceptAdCampaign(id){
  if (adActionBusy) return;
  const c = AD_CAMPAIGNS_CACHE.find(x => x.id === id);
  if (!c || c.status !== 'replied') return;

  const amount = Number(c.amount || 0);
  if (amount > Number(state.depositBalance || 0)){
    showToast('Insufficient Deposit Balance for this campaign', ICONS.warning);
    return;
  }

  adActionBusy = true;
  showLoading(true);
  try{


    const snap = await get(ref(db, 'adCampaignRequests/' + id));
    if (!snap.exists() || snap.val().status !== 'replied'){
      showLoading(false);
      showToast('This request is no longer awaiting your response', ICONS.warning);
      return;
    }

    state.depositBalance = Number((Number(state.depositBalance||0) - amount).toFixed(2));
    recomputeTotalBalance();
    addTransaction('withdraw', `Ad Campaign: ${c.name || 'Campaign'} (${c.days} day${Number(c.days)===1?'':'s'})`, -amount);
    await saveState();

    await update(ref(db, 'adCampaignRequests/' + id), {
      status: 'waiting_publish',
      userConfirmedAt: Date.now(),
      userConfirmMsg: 'User agreed to this deal and confirmed payment. Waiting for you to publish.'
    });

    showLoading(false);
    haptic('medium');
    showToast('Deal confirmed! Waiting for admin to publish', ICONS.success);
    renderAdCampaigns();
  }catch(e){
    console.error(e);
    showLoading(false);
    showToast('Failed to confirm campaign, try again', ICONS.warning);
  }finally{
    adActionBusy = false;
  }
}

async function rejectAdCampaign(id){
  if (adActionBusy) return;
  const c = AD_CAMPAIGNS_CACHE.find(x => x.id === id);
  if (!c || c.status !== 'replied') return;

  adActionBusy = true;
  showLoading(true);
  try{
    await update(ref(db, 'adCampaignRequests/' + id), {
      status: 'rejected',
      userRejectedAt: Date.now()
    });
    showLoading(false);
    haptic('light');
    showToast('Campaign request rejected', ICONS.warning);
    renderAdCampaigns();
  }catch(e){
    console.error(e);
    showLoading(false);
    showToast('Failed to reject, try again', ICONS.warning);
  }finally{
    adActionBusy = false;
  }
}


// Applies (or re-applies) the locked-by-default look to a gated button right after it's placed
// in the DOM.
function initAdLockButton(btnId){
  const btn = document.getElementById(btnId);
  if (!btn) return;
  ensureAdLockBadge(btn);
  const locked = !adUnlockedButtons[btnId];
  applyAdLockButtonState(btn, locked);
  btn.classList.toggle('ad-locked', locked);
}
function initAllAdLockButtons(){
  ['claim-bonus-btn','exchange-submit-btn','gift-claim-btn','gmail-done-btn','fb-submit-btn','ip-entry-btn','deposit-submit-btn','withdraw-submit-btn']
    .forEach(initAdLockButton);
}


let referralsRenderToken = 0;

function renderReferrals(){
  if (!state) return;
  document.getElementById('refer-count').textContent = state.referCount || (state.referrals||[]).length;
  document.getElementById('refer-earnings').textContent = fmt(state.referralEarnings || 0);
  const pct = userReferBonusPercent(state);
  document.getElementById('refer-commission').textContent = pct + '%';
  const subtitleEl = document.getElementById('refer-subtitle');
  if (subtitleEl) subtitleEl.textContent = `Share your link — earn ${pct}% commission on every referral!`;
  document.getElementById('referral-code').textContent = state.referCode;
  document.getElementById('referral-link').value = `https://t.me/atrenvaBot?start=ref_${state.referCode}`;

  const joinedByCard = document.getElementById('joined-by-card');
  const joinedByText = document.getElementById('joined-by-text');
  if (joinedByCard && joinedByText){
    if (state.joinedBy){
      const jb = state.joinedBy;
      const refName = jb.referrerUsername ? ('@' + jb.referrerUsername) : (jb.referrerFirstName || 'Unknown');
      const joined = jb.joinedAt ? new Date(jb.joinedAt).toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric'}) : '';
      const srcLabel = jb.source === 'telegram_deep_link' ? 'Telegram link' : (jb.source === 'manual_code' ? 'manual code' : jb.source || '');
      joinedByText.textContent = `${refName} · code ${jb.referrerCode}${joined ? ' · ' + joined : ''}${srcLabel ? ' · ' + srcLabel : ''}`;
      joinedByCard.style.display = '';
    } else {
      joinedByCard.style.display = 'none';
    }
  }

  const wrap = document.getElementById('referrals-list');
  const list = state.referrals || [];
  if (list.length === 0){
    wrap.innerHTML = `<div class="empty-state"><div class="empty-icon">${ICONS.people}</div><div class="empty-title">No referrals yet</div><div class="empty-desc">Share your link to start earning!</div></div>`;
    return;
  }

  const myToken = ++referralsRenderToken;
  wrap.innerHTML = `<div class="empty-state"><div class="empty-icon">${ICONS.hourglass}</div><div class="empty-title">Loading referrals...</div></div>`;

  renderReferralsLive(list, myToken);
}


async function renderReferralsLive(list, myToken){
  const wrap = document.getElementById('referrals-list');

  const rows = await Promise.all(list.map(async r => {
    if (!r.uid){
      return { legacy: true, name: r.name || 'Referral', sub: r.date || '', photo: '' };
    }
    try{
      const snap = await get(ref(db, 'users/' + r.uid));
      if (!snap.exists()){
        return { legacy:true, name:'Deleted user', sub:'', photo:'' };
      }
      const u = snap.val();
      const name = [u.firstName, u.lastName].filter(Boolean).join(' ').trim() || ('@' + (u.username || 'user'));
      const username = u.username ? '@' + u.username : '';
      const joined = r.joinedAt ? new Date(r.joinedAt).toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric'}) : '';
      return {
        legacy: false,
        name,
        username,
        sub: [username, joined].filter(Boolean).join(' · '),
        photo: u.profilePic || ''
      };
    }catch(e){
      console.error('live referral lookup failed', e);
      return { legacy:true, name:'Referral', sub:'', photo:'' };
    }
  }));

  if (myToken !== referralsRenderToken) return;

  wrap.innerHTML = rows.map(row => {
    const initial = escapeHtml(row.name.charAt(0).toUpperCase());
    const avatarHtml = row.photo
      ? `<img class="ref-avatar-img" src="${escapeHtml(row.photo)}" alt="" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
         <span class="ref-avatar-fallback" style="display:none;">${initial}</span>`
      : `<span class="ref-avatar-fallback" style="display:flex;">${initial}</span>`;
    return `
    <div class="ref-row">
      <div class="ref-avatar">${avatarHtml}</div>
      <div class="ref-info">
        <div class="ref-name">${escapeHtml(row.name)}</div>
        <div class="ref-date">${escapeHtml(row.sub)}</div>
      </div>
    </div>`;
  }).join('');
}
function copyReferralLink(){
  const input = document.getElementById('referral-link');
  input.select();
  try{ navigator.clipboard?.writeText(input.value); }catch(e){}
  haptic('light');
  showToast('Referral link copied!', ICONS.copy);
}
function shareOnTelegram(){
  const link = document.getElementById('referral-link') ? document.getElementById('referral-link').value : `https://t.me/atrenvaBot?start=ref_${state.referCode}`;
  const text = encodeURIComponent('Join ATRENVA and start earning with me!');
  const url = `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${text}`;
  if (tg && tg.openTelegramLink){ tg.openTelegramLink(url); }
  else { window.open(url, '_blank'); }
}




function computeTotalDeposit(){
  return state.transactions.filter(t=>t.type==='deposit').reduce((sum,t)=> sum + t.amount, 0);
}

function computeTotalWithdraw(){
  return state.transactions
    .filter(t => t.type==='withdraw' && t.requestId && t.status === 'Approved')
    .reduce((sum,t)=> sum + Math.abs(t.amount), 0);
}
function renderProfile(){
  if (!state) return;
  document.getElementById('profile-name').textContent = `${state.firstName} ${state.lastName}`.trim();
  document.getElementById('profile-username').textContent = '@' + state.username;
  applyModeratorBadge(document.getElementById('profile-username-badge'), !!state.isModerator);
  document.getElementById('profile-uid').textContent = state.uid;
  document.getElementById('profile-withdrawable-aenva').textContent = fmtNum(state.EarningBalance || 0);
  document.getElementById('profile-streak').textContent = state.streak;
  document.getElementById('profile-total-deposit').textContent = fmtNum(computeTotalDeposit());
  document.getElementById('profile-total-withdraw').textContent = fmtNum(computeTotalWithdraw());
  document.getElementById('profile-refs').textContent = state.referCount || (state.referrals||[]).length;
  document.getElementById('profile-balance').textContent = fmtNum(state.totalBalance);
  document.getElementById('profile-earnings').textContent = fmtNum((state.referBalance||0) + (state.EarningBalance||0));
  document.getElementById('profile-total-ad-campaign').textContent = (state.adCampaigns||[]).length;

  applyProfileAvatar(state.profilePic);

  const guestBannerProfile = document.getElementById('guest-banner-profile');
  if (guestBannerProfile) guestBannerProfile.style.display = isGuest ? 'block' : 'none';

  renderProfileActivityChart();
}

// ---------------------------------------------------------------------
// "Your Activity" dashboard (bottom of Profile) — a real 7-day line chart
// built straight from the user's own state.transactions, split into the
// earning categories that actually exist in this app: mining, watch-ad,
// referral commission, daily bonus, task rewards, and Gmail/
// Facebook account sales. Deposits/withdrawals/exchanges/investments are
// intentionally excluded — this dashboard is about *earning activity*,
// not balance movements. No fake/sample data: a category with nothing
// recorded simply shows a flat zero line.
// ---------------------------------------------------------------------
const ACTIVITY_CATEGORIES = [
  { key: 'mining',     label: 'Mining',     color: 'var(--act-mining)' },
  { key: 'referral',   label: 'Referral',   color: 'var(--act-referral)' },
  { key: 'dailybonus', label: 'Daily Bonus',color: 'var(--act-dailybonus)' },
  { key: 'task',       label: 'Task',       color: 'var(--act-task)' },
  { key: 'gmail',      label: 'Gmail',      color: 'var(--act-gmail)' },
  { key: 'facebook',   label: 'Facebook',   color: 'var(--act-facebook)' }
];

// Maps one transaction to one of the categories above, or null if it
// doesn't belong on this chart (deposit/withdraw/exchange/investment/etc).
function classifyActivityTx(tx){
  const type = String(tx?.type || '');
  const title = String(tx?.title || '');
  if (type === 'mining') return 'mining';
  // Gmail/Facebook sales are logged as type 'earn' (so they land in the "Others" Trans
  // tab alongside Daily Bonus/Task/Referral, same as everything else) — matched here by
  // title. The direct type checks stay too, in case older records were logged that way.
  if (type === 'gmail' || /^Gmail Account Sold/i.test(title)) return 'gmail';
  if (type === 'facebook' || /^Facebook Account Sold/i.test(title)) return 'facebook';
  if (type === 'earn'){
    if (/^Daily Bonus/i.test(title)) return 'dailybonus';
    if (/^Task Reward:|^Task Proof:/i.test(title)) return 'task';
    if (/Referral Commission/i.test(title)) return 'referral';
  }
  return null;
}

// tx.date is stored as a locale string like "Sep 15, 2026" (local time,
// same boundary the rest of the app uses for daily resets/streaks), so a
// plain `new Date(...)` parse lines up correctly with local midnight.
function activityDayKey(d){
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function buildActivityChartData(){
  const days = [];
  const today = new Date();
  today.setHours(0,0,0,0);
  for (let i = 6; i >= 0; i--){
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push({ key: activityDayKey(d), label: d.toLocaleDateString('en-US', { weekday: 'short' }) });
  }
  const dayIndex = {};
  days.forEach((d, i) => { dayIndex[d.key] = i; });

  const series = {};
  ACTIVITY_CATEGORIES.forEach(c => { series[c.key] = new Array(7).fill(0); });

  (state.transactions || []).forEach(tx => {
    const cat = classifyActivityTx(tx);
    if (!cat) return;
    const parsed = new Date(tx.date);
    if (isNaN(parsed.getTime())) return;
    const key = activityDayKey(parsed);
    const idx = dayIndex[key];
    if (idx == null) return;
    const amt = Number(tx.amount || 0);
    if (amt <= 0) return; // only count actual earnings, never a negative/spend entry
    series[cat][idx] += amt;
  });

  return { days, series };
}

function renderProfileActivityChart(){
  const wrap = document.getElementById('activity-chart-wrap');
  const legendWrap = document.getElementById('activity-legend');
  if (!wrap || !legendWrap) return;
  if (!state){ wrap.innerHTML = ''; legendWrap.innerHTML = ''; return; }

  const { days, series } = buildActivityChartData();

  const totals = {};
  let grandTotal = 0;
  let maxVal = 0;
  ACTIVITY_CATEGORIES.forEach(c => {
    const sum = series[c.key].reduce((a,b) => a+b, 0);
    totals[c.key] = sum;
    grandTotal += sum;
    series[c.key].forEach(v => { if (v > maxVal) maxVal = v; });
  });

  if (grandTotal <= 0){
    wrap.innerHTML = `<div class="activity-chart-empty">No earning activity in the last 7 days yet — mine, refer friends, or complete tasks to see your trend here.</div>`;
    legendWrap.innerHTML = '';
    return;
  }

  const W = 320, H = 150, padL = 8, padR = 8, padT = 10, padB = 22;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const niceMax = maxVal > 0 ? maxVal * 1.15 : 1;
  const xStep = plotW / 6;

  const pointsFor = (arr) => arr.map((v, i) => {
    const x = padL + i * xStep;
    const y = padT + plotH - (v / niceMax) * plotH;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  let linesSvg = '';
  ACTIVITY_CATEGORIES.forEach(c => {
    const arr = series[c.key];
    if (totals[c.key] <= 0) return; // skip flat-zero categories entirely — keeps the chart readable
    const pts = pointsFor(arr);
    linesSvg += `<polyline points="${pts}" fill="none" stroke="${c.color}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" opacity="0.95"></polyline>`;
    arr.forEach((v, i) => {
      if (v <= 0) return;
      const x = padL + i * xStep;
      const y = padT + plotH - (v / niceMax) * plotH;
      linesSvg += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.6" fill="${c.color}"></circle>`;
    });
  });

  const gridSvg = [0,1,2,3].map(i => {
    const y = padT + (plotH / 3) * i;
    return `<line x1="${padL}" y1="${y.toFixed(1)}" x2="${W-padR}" y2="${y.toFixed(1)}" stroke="var(--line)" stroke-width="1"></line>`;
  }).join('');

  const labelsSvg = days.map((d, i) => {
    const x = padL + i * xStep;
    return `<text x="${x.toFixed(1)}" y="${H-6}" font-size="9" font-weight="700" fill="var(--ink-soft)" text-anchor="middle">${esc(d.label)}</text>`;
  }).join('');

  wrap.innerHTML = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">${gridSvg}${linesSvg}${labelsSvg}</svg>`;

  legendWrap.innerHTML = ACTIVITY_CATEGORIES
    .filter(c => totals[c.key] > 0)
    .map(c => `<div class="activity-legend-item"><span class="activity-legend-dot" style="background:${c.color}"></span>${esc(c.label)} · <span class="activity-legend-amt">${fmtNum(totals[c.key])}</span></div>`)
    .join('');
}


let broadcastNotifs = [];
let userNotifs = [];
let readNotifIds = [];

function readNotifIdsKey(){ return 'atrenva_read_notifs_' + (state ? state.uid : 'guest'); }
function loadReadNotifIds(){
  try{ readNotifIds = JSON.parse(localStorage.getItem(readNotifIdsKey())) || []; }
  catch(e){ readNotifIds = []; }
}
function saveReadNotifIds(){
  try{ localStorage.setItem(readNotifIdsKey(), JSON.stringify(readNotifIds)); }catch(e){}
}

function allNotifs(){
  return [...broadcastNotifs, ...userNotifs].sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));
}

function fmtNotifTime(ts){
  if (!ts) return '';
  return new Date(ts).toLocaleString('en-US',{month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'});
}

function listenNotifications(){
  if (isGuest) return;
  onValue(ref(db, 'notifications/broadcast'), snap => {
    const val = snap.exists() ? snap.val() : {};
    broadcastNotifs = Object.keys(val).map(id => ({ id: 'b_'+id, ...val[id] }));
    updateNotifBadge();
    if (document.getElementById('screen-notifications').classList.contains('active')) renderNotifications();
  });
  onValue(ref(db, 'notifications/users/' + state.uid), snap => {
    const val = snap.exists() ? snap.val() : {};
    userNotifs = Object.keys(val).map(id => ({ id: 'u_'+id, ...val[id] }));
    updateNotifBadge();
    if (document.getElementById('screen-notifications').classList.contains('active')) renderNotifications();
  });
}

function updateNotifBadge(){
  const unread = allNotifs().filter(n => !readNotifIds.includes(n.id)).length;
  const badge = document.getElementById('notif-badge');
  if (!badge) return;
  if (unread > 0){ badge.textContent = unread; badge.style.display = 'flex'; }
  else { badge.style.display = 'none'; }
}

function openNotifications(){ renderNotifications(); openOverlay('notifications'); }

function renderNotifications(){
  const wrap = document.getElementById('notifications-list');
  const items = allNotifs();
  if (items.length === 0){
    wrap.innerHTML = `<div class="empty-state"><div class="empty-icon">${ICONS.inbox}</div><div class="empty-title">No notifications yet</div><div class="empty-desc">You'll see updates from the team here</div></div>`;
  } else {
    wrap.innerHTML = items.map(n=>`
      <div class="notif-item ${!readNotifIds.includes(n.id)?'unread':''}">
        <div class="notif-icon">${ICONS.bell}</div>
        <div class="notif-body">
          <div class="notif-title">${n.title||''}</div>
          <div class="notif-desc">${n.message||''}</div>
          <div class="notif-time">${fmtNotifTime(n.createdAt)}</div>
        </div>
      </div>`).join('');
  }
  readNotifIds = [...new Set([...readNotifIds, ...items.map(n=>n.id)])];
  saveReadNotifIds();
  updateNotifBadge();
}


let appLinks = {
  telegram: 'https://t.me/atrenva_channel',
  developer: 'https://t.me/atrenva_dev',
  tutorials: 'https://t.me/atrenva_channel/10',
  support: 'https://t.me/atrenva_support'
};
function listenAppLinks(){
  onValue(ref(db, 'links'), snap => {
    const val = snap.exists() ? snap.val() : {};
    appLinks = {
      telegram: val.telegram || appLinks.telegram,
      developer: val.developer || appLinks.developer,
      tutorials: val.tutorials || appLinks.tutorials,
      support: val.support || appLinks.support
    };
  });
}

function openExternalLink(url, toastMsg, icon){
  haptic('light');
  showToast(toastMsg, icon || ICONS.telegram);
  if (tg && tg.openTelegramLink && url.includes('t.me')) tg.openTelegramLink(url);
  else if (tg && tg.openLink) tg.openLink(url);
  else window.open(url, '_blank');
}
function openTelegramChannel(){ openExternalLink(appLinks.telegram, 'Opening Telegram Channel...', ICONS.telegram); }
function openDeveloper(){ openExternalLink(appLinks.developer, 'Opening Developer contact...', ICONS.code); }
function openTutorials(){ openExternalLink(appLinks.tutorials, 'Opening Tutorials...', ICONS.play); }
function openSupport(){ openExternalLink(appLinks.support, 'Opening Support chat...', ICONS.headset); }


function applyHeaderAvatar(photoUrl){
  const wrap = document.getElementById('app-logo-wrap');
  const img = document.getElementById('app-user-avatar');
  if (!wrap) return;
  if (photoUrl){
    img.onload = ()=>{
      wrap.classList.add('resolved', 'has-photo');
      wrap.classList.remove('no-photo');
    };
    img.onerror = ()=>{
      wrap.classList.add('resolved', 'no-photo');
      wrap.classList.remove('has-photo');
    };
    img.src = photoUrl;
  } else {
    wrap.classList.add('resolved', 'no-photo');
    wrap.classList.remove('has-photo');
  }
}

function applyProfileAvatar(photoUrl){
  const wrap = document.getElementById('profile-avatar');
  const img = document.getElementById('profile-avatar-img');
  if (!wrap || !img) return;
  if (photoUrl){
    img.onload = ()=>{
      wrap.classList.add('resolved', 'has-photo');
      wrap.classList.remove('no-photo');
    };
    img.onerror = ()=>{
      wrap.classList.add('resolved', 'no-photo');
      wrap.classList.remove('has-photo');
    };
    img.src = photoUrl;
  } else {
    wrap.classList.add('resolved', 'no-photo');
    wrap.classList.remove('has-photo');
  }
}

function applyHeaderName(u){
  const nameEl = document.getElementById('app-name');
  if (!nameEl || !u) return;
  nameEl.classList.remove('name-loading');
  if (u.username && u.username !== ('user'+u.uid)){
    nameEl.textContent = '@' + u.username;
  } else if (u.firstName){
    nameEl.textContent = u.firstName;
  } else {
    nameEl.textContent = 'ATRENVA';
  }
  applyModeratorBadge(document.getElementById('app-name-badge'), !!u.isModerator);
}


Object.assign(window, {
  navigateTo, openOverlay, closeOverlay,
  openDeposit: openDeposit, openWithdraw: openWithdraw,
  openAdCampaign: openAdCampaign,
  openEvents: openEvents, openExchange: openExchange, openGift: openGift, claimDailyBonus: claimDailyBonus,
  visitEventLink: visitEventLink,
  onGiftCodeChange: onGiftCodeChange, applyGiftCode: applyGiftCode, claimGiftCode: claimGiftCode,
  onExchangeAmountChange: onExchangeAmountChange, submitExchange: submitExchange,
  openTaskCenter: openTaskCenter, openGmailCenter: openGmailCenter, openFacebookCenter: openFacebookCenter,
  switchGmailTab: switchGmailTab, switchFacebookTab: switchFacebookTab,
  goToFacebookStep2: goToFacebookStep2, copyFacebookIdentityField: copyFacebookIdentityField,
  openSocialBuyModal: openSocialBuyModal, closeSocialBuyModal: closeSocialBuyModal,
  confirmSocialBuy: confirmSocialBuy, closeSocialBuySuccess: closeSocialBuySuccess,
  refreshGmailId: refreshGmailId, submitGmailId: submitGmailId, copyGmailField: copyGmailField,
  startTask: startTask, startProofTask: startProofTask, startTaskLinkOnly: startTaskLinkOnly, openProofModal: openProofModal, closeProofModal: closeProofModal,
  claimTaskReward: claimTaskReward,
  startJoinVerifyTask: startJoinVerifyTask, retryJoinVerify: retryJoinVerify,
  inviteForReferTask: inviteForReferTask, claimReferTask: claimReferTask,
  onProofFileSelected: onProofFileSelected, sendProofSubmission: sendProofSubmission,
  submitFacebookRequest: submitFacebookRequest,
  submitAdCampaignRequest: submitAdCampaignRequest,
  acceptAdCampaign: acceptAdCampaign, rejectAdCampaign: rejectAdCampaign,
  filterWork: filterWork, openInvestmentDetail: openInvestmentDetail,
  enterInvestmentPlan: enterInvestmentPlan, openInvestmentProgress: openInvestmentProgress,
  markInvestmentCustomDone: markInvestmentCustomDone, closeInvestmentAdIframe: closeInvestmentAdIframe,
  closeInvestmentProgress: closeInvestmentProgress, watchInvestmentAd: watchInvestmentAd,
  switchTransTab: switchTransTab, setAmount: setAmount, selectMethod: selectMethod,
  selectDepositMethod: selectDepositMethod, selectWithdrawMethod: selectWithdrawMethod,
  onDepositAmountChange: onDepositAmountChange, onWithdrawAmountChange: onWithdrawAmountChange,
  copyDepositAddress: copyDepositAddress,
  applyDepositCoupon: applyDepositCoupon, removeDepositCoupon: removeDepositCoupon,
  applyWithdrawCoupon: applyWithdrawCoupon, removeWithdrawCoupon: removeWithdrawCoupon,
  submitDeposit: submitDeposit, submitWithdraw: submitWithdraw,
  copyReferralLink: copyReferralLink, shareOnTelegram: shareOnTelegram,
  openNotifications, renderNotifications,
  openTelegramChannel: openTelegramChannel,
  openDeveloper: openDeveloper, openSupport: openSupport,
});

function buildGuestProfile(){
  const gid = 'guest_' + Math.random().toString(36).slice(2, 10);
  return {
    id: gid,
    uid: gid,
    firstName: 'Guest',
    lastName: '',
    username: 'guest',
    photoUrl: ''
  };
}

function showFatalErrorBanner(context, err){
  try {
    console.error('[FATAL:' + context + ']', err);
    let el = document.getElementById('fatal-error-banner');
    if (!el){
      el = document.createElement('div');
      el.id = 'fatal-error-banner';
      el.style.cssText = 'position:fixed;left:0;right:0;top:0;z-index:999999;background:#c0392b;color:#fff;font-size:12px;line-height:1.4;padding:10px 12px;font-family:sans-serif;white-space:pre-wrap;word-break:break-word;';
      document.body.appendChild(el);
    }
    const msg = (err && (err.message || err.toString())) || String(err);
    el.textContent = 'App error [' + context + ']: ' + msg + ' — screenshot this and send to support.';
  } catch(e2){ /* ignore banner failure */ }
}

window.addEventListener('error', (e) => {
  showFatalErrorBanner('window.onerror', e.error || e.message);
});
window.addEventListener('unhandledrejection', (e) => {
  showFatalErrorBanner('unhandledrejection', e.reason);
});

async function init(){
  const tgUser = getTelegramUser();
  let profile, ip;

  if (tgUser){
   try {
    isGuest = false;
    profile = buildProfileFromTelegram(tgUser);
    ip = await getUserIP();
    await loadState(profile, ip);
    const hadRefBefore = !!state.usedRefer;
    await captureReferralIfAny(tg, state);
    const joinedViaDeepLinkNow = !hadRefBefore && !!state.usedRefer;
    reconcileDepositBalance();
    await saveState();
    appInitialized = true;
    attachPendingProofListeners();
    onValue(ref(db, userPath), snap => {
      if (!snap.exists()) return;
      state = normalizeLoadedState(snap.val(), profile, ip);


      if (!Array.isArray(state.transactions)) state.transactions = [];
      if (!state.completedTasks) state.completedTasks = {};
      if (!state.taskCompletionCount) state.taskCompletionCount = {};
      if (!Array.isArray(state.adCampaigns)) state.adCampaigns = [];
      if (!Array.isArray(state.referrals)) state.referrals = [];
      if (!Array.isArray(state.notifications)) state.notifications = [];
          if (typeof state.depositBalance !== 'number') state.depositBalance = 0;
      reconcileDepositBalance();
      attachPendingProofListeners();

      if (currentScreen === 'home') renderHome();
      if (currentScreen === 'profile') renderProfile();
      if (currentScreen === 'refer') renderReferrals();
      applyHeaderName(state);
      if (document.getElementById('screen-task') && document.getElementById('screen-task').classList.contains('active')){
        renderTaskItems('task');
      }
      if (currentScreen === 'transaction'){


        const activeTab = document.querySelector('.trans-tab.active');
        renderTransactions(activeTab ? activeTab.dataset.tab : 'all');
      }
      const wdAvail = document.getElementById('withdraw-available');
      if (wdAvail && document.getElementById('screen-withdraw').classList.contains('active')){
        wdAvail.textContent = fmt(state.totalBalance);
      }
    });
    startAdListener();
    startFacebookListener();
    startFacebookNoteListener();
    startUserInvestmentsListener();
    startActiveHeartbeat();
    startTotalUsersOHLCListener(); // On user data load -> updateOHLC(totalUsers)
    startAnalyticsHeartbeat();     // Every 60s -> increment activeUsers


    if (joinedViaDeepLinkNow && state.joinedBy){
      const jb = state.joinedBy;
      const refName = jb.referrerUsername ? ('@' + jb.referrerUsername) : (jb.referrerFirstName || 'your referrer');
      setTimeout(() => {
        showToast(`Joined via referral! Linked to ${refName} (code ${jb.referrerCode}).`, ICONS.success);
      }, 600);
    }
   } catch (err){
     showFatalErrorBanner('telegram-init', err);
     if (window.__markAppBooted) window.__markAppBooted();
     return;
   }
  } else {

    isGuest = true;
    profile = buildGuestProfile();
    await loadState(profile, null);
    userPath = null;
    appInitialized = true;
  }

  listenDepositMethods((methods)=>{
    if (document.getElementById('screen-deposit').classList.contains('active')){
      renderDepositMethodsUI(methods);
    }
  });
  listenWithdrawMethods((methods)=>{
    if (document.getElementById('screen-withdraw').classList.contains('active')){
      renderWithdrawMethodsUI(methods);
    }
  });
  listenAppLinks();  listenCurrencySymbol();  listenAtrvaSettings();
  listenEconomySettings();
  startInvestmentPlansListener();
  startDailyBonusSettingsListener();
  loadReadNotifIds();
  listenNotifications();

  applyHeaderAvatar(state.profilePic);
  applyHeaderName(state);
  renderHomeSafe();
  navigateTo('home');
  initAllAdLockButtons();
  if (window.__markAppBooted) window.__markAppBooted();
}

function renderHomeSafe(){
  try{ renderHome(); }catch(e){ console.error(e); }
}

document.addEventListener('contextmenu', function(e){
  if (e.target.closest('.copy-btn, .address-copy-btn, .share-btn, input, textarea')) return;
  e.preventDefault();
});

document.addEventListener('DOMContentLoaded', () => {
  init().catch(err => showFatalErrorBanner('init', err));
});

// ---------------------------------------------------------------------
// Expose functions to window so the onclick="..." attributes in
// index.html can find them. This file is loaded as <script type="module">,
// and top-level function declarations inside a module are NOT added to
// the global window object (unlike a normal script).
// ---------------------------------------------------------------------

// ======================================================================
// ---- Analytics Tracking (feeds the admin analytics dashboard) ----
// Writes live counters into analytics_temp/{YYYY-MM-DD}/... throughout
// the day. A separate admin-side midnight job snapshots this bucket into
// analytics/daily/{date} (OHLC + totals) and starts the next day fresh.
// Every write uses runTransaction so concurrent users/tabs never clobber
// each other's counts — safe, atomic, duplicate-free increments.
// This block is purely additive: it does not alter any existing balance,
// deposit/withdraw, or ad-reward logic above, only observes it.
// ======================================================================

function analyticsDateKey(){
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

// Generic counter: analytics_temp/{date}/{type} += value (default 1).
// Used for deposits, withdrawals, ads, revenue, activeUsers, etc.
async function track(type, value = 1){
  try{
    await runTransaction(ref(db, `analytics_temp/${analyticsDateKey()}/${type}`), curr => {
      return Number(curr || 0) + Number(value || 0);
    });
  }catch(e){ console.error('analytics track() failed:', type, e); }
}

// OHLC (open/high/low/close) candle for "currentUsers" for today.
// open  = first value seen today (locked in once, never overwritten)
// high  = running max seen today
// low   = running min seen today
// close = most recent value (always updated)
async function updateOHLC(currentUsers){
  const v = Number(currentUsers);
  if (!isFinite(v)) return;
  try{
    await runTransaction(ref(db, `analytics_temp/${analyticsDateKey()}/ohlc`), curr => {
      if (!curr || curr.open == null){
        return { open: v, high: v, low: v, close: v };
      }
      return {
        open: curr.open,
        high: Math.max(Number(curr.high != null ? curr.high : v), v),
        low: Math.min(Number(curr.low != null ? curr.low : v), v),
        close: v
      };
    });
  }catch(e){ console.error('analytics updateOHLC() failed:', e); }
}

// Total registered users (all-time, monotonically increasing) is used as
// the OHLC "price" series — every session refreshes today's candle with
// the latest total the moment user data loads.
async function incrementTotalUsersCounter(){
  try{
    await runTransaction(ref(db, 'analytics_meta/totalUsers'), curr => Number(curr || 0) + 1);
  }catch(e){ console.error('analytics incrementTotalUsersCounter() failed:', e); }
}

let analyticsTotalUsersListenerStarted = false;
function startTotalUsersOHLCListener(){
  if (analyticsTotalUsersListenerStarted) return; // avoid duplicate listeners across re-inits
  analyticsTotalUsersListenerStarted = true;
  onValue(ref(db, 'analytics_meta/totalUsers'), snap => {
    updateOHLC(snap.exists() ? snap.val() : 0); // "On user data load -> updateOHLC(totalUsers)"
  });
}

// "Every 60 seconds -> increment activeUsers"
let analyticsHeartbeatTimer = null;
function startAnalyticsHeartbeat(){
  if (isGuest || analyticsHeartbeatTimer) return; // guard against duplicate intervals
  track('activeUsers', 1); // immediate tick on load, then every 60s
  analyticsHeartbeatTimer = setInterval(() => track('activeUsers', 1), 60 * 1000);
}

// ======================================================================

Object.assign(window, {
  applyDepositCoupon, applyGiftCode, applyWithdrawCoupon, claimDailyBonus,
  claimGiftCode, closeInvestmentAdIframe, closeInvestmentProgress, closeOverlay,
  closeProofModal, closeSocialBuyModal, closeSocialBuySuccess,
  confirmSocialBuy, copyDepositAddress, copyGmailField, copyReferralLink,
  copyFacebookIdentityField, goToFacebookStep2,
  copyGmailIdentityField, goToGmailStep2, goToGmailStep1, cancelGmailFlow, cancelFacebookFlow, goToFacebookStep1, viewSocialBuyTransaction,
  filterWork, navigateTo, openAdCampaign, openDeposit,
  openDeveloper, openEvents, openExchange, openFacebookCenter, openGift,
  openGmailCenter, openNotifications, openSupport,
  openMining, openMiningModels, startMining, claimMining, buyUncle, selectUncle, miningSpeedUp, openMiningActivityCheck, closeMiningActivityCheck, miningActivityCellClick,
  openTaskCenter, openTelegramChannel, openWithdraw,
  refreshGmailId, sendProofSubmission, setAmount, shareOnTelegram,
  submitAdCampaignRequest, submitDeposit, submitExchange, submitFacebookRequest,
  submitGmailId, submitWithdraw, switchFacebookTab,
  switchGmailTab, switchTransTab,
});