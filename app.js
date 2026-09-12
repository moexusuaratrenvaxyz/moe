import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, get, set, update, push, onValue, query, orderByChild, equalTo, runTransaction } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


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
// Keep stonehunt duration/reward live-updated from admin settings (available pre-login too).
listenStoneHuntModuleSettings();
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

async function getUserIP(){
  try{
    const res = await fetch('https://api.ipify.org?format=json');
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

const BASE_STONEHUNT_RATE = 5;


const PLANS = [
  { id:'free',    name:'Free',    icon:ICONS.tag,     price:0,     days:FREE_PLAN_DAYS, badge:'FREE',
    taskLimit:5,  gmailLimit:5,  facebookLimit:5,  giftCodeMin:0, giftCodeMax:0,
    refBonusNormal:0.05, refBonusActive:0.10, exchangeRate:0,    stoneHuntSpeed:1, investmentRefund:0, dailyBonusMultiplier:1,
    stoneHuntDailyLimit:5,  stoneHuntBaseSpeed:1, stoneHuntMaxSpeed:1, stoneHuntBoostTarget:0, watchAdCredit:0.01,
    features:['Task / Gmail / Facebook limit: 5 per day','Stone Hunt limit: 5 sessions per day','Daily claim bonus: 1x reward','0 monthly gift codes','Referral commission: 5% normal, 10% active','Exchange not available','1x Stone Hunt speed (no boost)','No refund on early investment withdrawal'] },
  { id:'starter', name:'Starter', icon:ICONS.rocket,  price:9.99,  days:30, badge:'STARTER',
    taskLimit:10, gmailLimit:10, facebookLimit:10, giftCodeMin:1, giftCodeMax:2,
    refBonusNormal:0.10, refBonusActive:0.15, exchangeRate:0.50, stoneHuntSpeed:2, investmentRefund:0.01, dailyBonusMultiplier:1,
    stoneHuntDailyLimit:10, stoneHuntBaseSpeed:1, stoneHuntMaxSpeed:2, stoneHuntBoostTarget:10, watchAdCredit:0.02,
    features:['Task / Gmail / Facebook limit: 10 per day','Stone Hunt limit: 10 sessions per day','Daily claim bonus: 1x reward','1-2 monthly gift codes','Referral commission: 10% normal, 15% active','Exchange up to 50%','Up to 2x Stone Hunt speed (10 ads to max boost)','1% refund on early investment withdrawal'] },
  { id:'pro',     name:'Pro',     icon:ICONS.diamond, price:24.99, days:30, badge:'PRO',
    taskLimit:20, gmailLimit:20, facebookLimit:20, giftCodeMin:1, giftCodeMax:5,
    refBonusNormal:0.10, refBonusActive:0.20, exchangeRate:0.70, stoneHuntSpeed:2, investmentRefund:0.10, dailyBonusMultiplier:2,
    stoneHuntDailyLimit:15, stoneHuntBaseSpeed:1, stoneHuntMaxSpeed:2, stoneHuntBoostTarget:7, watchAdCredit:0.035,
    features:['Task / Gmail / Facebook limit: 20 per day','Stone Hunt limit: 15 sessions per day','Daily claim bonus: 2x reward','1-5 monthly gift codes','Referral commission: 10% normal, 20% active','Exchange up to 70%','Up to 2x Stone Hunt speed (7 ads to max boost)','10% refund on early investment withdrawal'],
    recommended:true },
  { id:'elite',   name:'Elite',   icon:ICONS.crown,   price:49.99, days:30, badge:'ELITE',
    taskLimit:49, gmailLimit:49, facebookLimit:49, giftCodeMin:0, giftCodeMax:0,
    refBonusNormal:0.20, refBonusActive:0.30, exchangeRate:0.90, stoneHuntSpeed:3, investmentRefund:0.49, dailyBonusMultiplier:3,
    stoneHuntDailyLimit:20, stoneHuntBaseSpeed:1, stoneHuntMaxSpeed:3, stoneHuntBoostTarget:3, watchAdCredit:0.05,
    features:['Task / Gmail / Facebook limit: 49 per day','Stone Hunt limit: 20 sessions per day','Daily claim bonus: 3x reward','0 monthly gift codes','Referral commission: 20% normal, 30% active','Exchange up to 90%','Up to 3x Stone Hunt speed (3 ads to max boost)','49% refund on early investment withdrawal'] },
];

// ---- Plan verification badges (username badge shown per current plan) ----
// Same badge artwork/shape as the base verified badge, recolored per plan.
// Every badge is stamped with a repeating "AENVA" watermark pattern clipped to the badge shape.
const BADGE_SHAPE_PATH = "M100,10C107.62,10,113.51,20.65,120.71,22.68C128.16,24.79,138.06,17.68,144.64,21.34C151.31,25.06,148.84,37.06,154.02,42.24C159.2,47.42,171.2,44.95,174.92,51.62C178.58,58.2,171.47,68.1,173.58,75.55C175.61,82.75,186.26,88.64,186.26,96.26C186.26,103.88,175.61,109.77,173.58,116.97C171.47,124.42,178.58,134.32,174.92,140.9C171.2,147.57,159.2,145.1,154.02,150.28C148.84,155.46,151.31,167.46,144.64,171.18C138.06,174.84,128.16,167.73,120.71,169.84C113.51,171.87,107.62,182.52,100,182.52C92.38,182.52,86.49,171.87,79.29,169.84C71.84,167.73,61.94,174.84,55.36,171.18C48.69,167.46,51.16,155.46,45.98,150.28C40.8,145.1,28.8,147.57,25.08,140.9C21.42,134.32,28.53,124.42,26.42,116.97C24.39,109.77,13.74,103.88,13.74,96.26C13.74,88.64,24.39,82.75,26.42,75.55C28.53,68.1,21.42,58.2,25.08,51.62C28.8,44.95,40.8,47.42,45.98,42.24C51.16,37.06,48.69,25.06,55.36,21.34C61.94,17.68,71.84,24.79,79.29,22.68C86.49,20.65,92.38,10,100,10Z";

let _badgeUid = 0;
function planBadgeSvg(planId, grad){
  // unique suffix so multiple copies of the same badge on one page don't collide on def ids
  const uid = planId + '-' + (_badgeUid++);
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" data-plan="${planId}">
    <defs>
      <radialGradient id="pbGrad-${uid}" cx="35%" cy="30%" r="75%">
        <stop offset="0%" stop-color="${grad[0]}"/>
        <stop offset="55%" stop-color="${grad[1]}"/>
        <stop offset="100%" stop-color="${grad[2]}"/>
      </radialGradient>
      <pattern id="pbAtr-${uid}" width="46" height="30" patternUnits="userSpaceOnUse" patternTransform="rotate(-20)">
        <text x="0" y="20" font-family="Arial, sans-serif" font-weight="800" font-size="16" fill="#ffffff" fill-opacity="0.18">AENVA</text>
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

// Rainbow "Management Badge" — a special admin-grantable badge, same shape + AENVA watermark,
// but with an animated rainbow gradient fill instead of a flat plan color.
function rainbowBadgeSvg(){
  const uid = 'rainbow-' + (_badgeUid++);
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" data-plan="rainbow">
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

function getPlanBadgeSvg(planId){
  switch(planId){
    case 'free':    return planBadgeSvg('free',    ['#ff8a80', '#e6392f', '#b8241c']);
    case 'starter': return planBadgeSvg('starter', ['#63c7ff', '#2fa1e8', '#1c86d6']);
    case 'pro':     return planBadgeSvg('pro',     ['#7bdb7f', '#33b04a', '#1f8f37']);
    case 'elite':   return planBadgeSvg('elite',   ['#4a4a4d', '#232326', '#0a0a0b']);
    case 'rainbow': return rainbowBadgeSvg();
    default:        return planBadgeSvg('free',    ['#ff8a80', '#e6392f', '#b8241c']);
  }
}
// planId here is the plan's normal badge id (free/starter/pro/elite). If the user has been
// granted the admin "Management Badge" (state.managementBadge === true/'yes'), the rainbow
// badge always overrides the plan badge — checked in the two helpers below.
function resolveBadgeId(planId, hasManagementBadge){
  return hasManagementBadge ? 'rainbow' : (planId || 'free');
}
function planBadgeIcon(planId, hasManagementBadge){
  return getPlanBadgeSvg(resolveBadgeId(planId, hasManagementBadge));
}
function applyPlanBadge(el, planId, hasManagementBadge){
  if (!el) return;
  el.innerHTML = planBadgeIcon(planId, hasManagementBadge);
  el.classList.remove('hidden');
  el.classList.add('badge-pulse', 'badge-clickable');
  el.dataset.badgePlan = resolveBadgeId(planId, hasManagementBadge);
  el.onclick = (e) => { e.stopPropagation(); openBadgeLightbox(el.dataset.badgePlan); };
}

// ---- Badge lightbox: click any plan badge to zoom it in with a blurred backdrop ----
function openBadgeLightbox(planId){
  let overlay = document.getElementById('badge-lightbox');
  if (!overlay){
    overlay = document.createElement('div');
    overlay.id = 'badge-lightbox';
    overlay.className = 'badge-lightbox';
    overlay.innerHTML = `<div class="badge-lightbox-inner"><div class="badge-lightbox-icon" id="badge-lightbox-icon"></div></div>`;
    overlay.addEventListener('click', closeBadgeLightbox);
    document.body.appendChild(overlay);
  }
  document.getElementById('badge-lightbox-icon').innerHTML = getPlanBadgeSvg(planId);
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

// ---- StoneHunt module config ----
// These are admin-configurable via Firebase (settings/stonehunt, settings/adSdk) and update live.
let MONETAG_ZONE_ID = '11692895';
let MONETAG_ZONE_FUNC = 'show_11692895'; // window[MONETAG_ZONE_FUNC]() returns a Promise that resolves after a completed rewarded ad
let STONEHUNT_BASE_DURATION_MS = 2 * 60 * 60 * 1000; // configurable total stonehunt time (min 1 minute, max 100 hours)
let STONEHUNT_TOTAL_REWARD = BASE_STONEHUNT_RATE * 2; // total coins earned per completed session at 1x speed (not per-hour)
let STONEHUNT_ACTIVITY_CHECK_MS = 20 * 60 * 1000; // configurable fixed interval between activity checks

// Live admin-configurable stonehunt duration + reward (settings/stonehunt -> { durationMinutes, totalReward, activityCheckMinutes })
function listenStoneHuntModuleSettings(){
  onValue(ref(db, 'settings/stonehunt'), snap => {
    const v = snap.exists() ? snap.val() : null;
    let minutes = (v && v.durationMinutes != null && !isNaN(Number(v.durationMinutes))) ? Number(v.durationMinutes) : 120;
    minutes = Math.max(1, Math.min(6000, minutes)); // 1 minute .. 100 hours
    const totalReward = (v && v.totalReward != null && !isNaN(Number(v.totalReward))) ? Number(v.totalReward) : BASE_STONEHUNT_RATE * 2;
    let checkMinutes = (v && v.activityCheckMinutes != null && !isNaN(Number(v.activityCheckMinutes))) ? Number(v.activityCheckMinutes) : 20;
    checkMinutes = Math.max(1, checkMinutes);
    STONEHUNT_BASE_DURATION_MS = minutes * 60 * 1000;
    STONEHUNT_TOTAL_REWARD = totalReward;
    STONEHUNT_ACTIVITY_CHECK_MS = checkMinutes * 60 * 1000;
    if (currentScreen === 'stonehunt') renderStoneHunt();
  });
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
  { id:'u1', name:'Model Rookie',   emoji:'👷', rate:0.05, capHours:4,  cooldownMin:20, price:0,    refer:{normalCount:0, activeCount:0}, requiredPlan:'', adsToClaim:1, breakSeconds:30, ability:'Your first miner. Steady digging, no experience needed.' },
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
    refer: o.refer ? normalizeReferReq(o.refer) : { normalCount:0, activeCount:0 },
    requiredPlan: o.requiredPlan != null ? String(o.requiredPlan) : '',
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
  // cooldownMin, price, refer, requiredPlan, adsToClaim, breakSeconds }
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
  if (!state) return { ownedUncles:[defaultId], activeUncleId:defaultId, miningStartTime:null, isActive:false, lastClaimTime:null, cooldownUntil:null, speedUpCount:0, speedUpBonus:0 };
  if (!state.mining || typeof state.mining !== 'object'){
    state.mining = { ownedUncles:[defaultId], activeUncleId:defaultId, miningStartTime:null, isActive:false, lastClaimTime:null, cooldownUntil:null, speedUpCount:0, speedUpBonus:0 };
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
  const cappedNow = Math.min(now, startTime + capMs);
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
  if (m.isActive) return miningCapReached(m, uncle, now) ? 'capfull' : 'mining';
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
    const reqOk = referReqMet(u.refer) && planReqMet(u.requiredPlan);
    let lockLabel = referReqLabel(u.refer);
    if (!referReqMet(u.refer) && !planReqMet(u.requiredPlan)) lockLabel = referReqLabel(u.refer) + ' + ' + planReqLabel(u.requiredPlan);
    else if (!planReqMet(u.requiredPlan)) lockLabel = planReqLabel(u.requiredPlan);

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
      <div class="mining-uncle-stats">${claimAds} ad${claimAds>1?'s':''} to claim${u.requiredPlan ? ' · ' + esc(planReqLabel(u.requiredPlan)) : ''}</div>
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
    idle:     { label:'Stopped',   cls:'is-stopped',  icon: ICONS.pause },
  };
  const st = statusMap[phase] || statusMap.idle;

  const noModelSelected = !uncle;

  let html = `<div class="mining-hero-block">
    <div class="mining-hero-value">+${accumulated.toFixed(6)} <span class="mining-hero-unit">AENVA</span></div>
    <div class="mining-status-line ${st.cls}">${st.icon}<span>Status: ${st.label}</span></div>
  </div>`;

  html += `<div class="mining-coin-block"><div class="mining-coin-stage" id="mining-coin-stage">
    <img class="mining-direct-image${charging ? ' is-charging' : ''}" id="mining-coin-img" src="https://i.postimg.cc/tTSjkVt6/151204-removebg-preview.png" alt="Mining" width="150" height="150">
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
  if (!planReqMet(uncle.requiredPlan)){
    showToast(`Need ${planReqLabel(uncle.requiredPlan)} to unlock ${uncle.name}`, ICONS.warning);
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

function stoneHuntPlanConfig(planId){
  const p = PLANS.find(x => x.id === planId) || PLANS[0];
  return {
    dailyLimit: p.stoneHuntDailyLimit != null ? p.stoneHuntDailyLimit : PLANS[0].stoneHuntDailyLimit,
    baseSpeed: p.stoneHuntBaseSpeed != null ? p.stoneHuntBaseSpeed : 1,
    maxSpeed: p.stoneHuntMaxSpeed != null ? p.stoneHuntMaxSpeed : 1,
    boostTarget: p.stoneHuntBoostTarget != null ? p.stoneHuntBoostTarget : 0,
  };
}


function applyPlanPriceOverrides(settings){
  if (!settings) return;
  PLANS.forEach(p => {
    const saved = settings[p.id];
    if (saved && saved.price != null && !isNaN(Number(saved.price))){
      p.price = Number(saved.price);
    }
  });
}
function listenPlanSettings(){
  onValue(ref(db, 'settings/plans'), snap => {
    applyPlanPriceOverrides(snap.exists() ? snap.val() : {});
    if (currentScreen === 'home') renderHome();
    if (currentScreen === 'profile') renderProfile();
    if (document.getElementById('screen-plans').classList.contains('active')) renderPlans();
  });
}

function currentPlan(state){ return PLANS.find(p=>state && p.id===state.plan) || PLANS[0]; }


function isUnlimitedPlan(state){
  if (!state) return true;
  return (state.plan || 'free') === 'free' || Number(state.planExpiry||0) >= INFINITE_EXPIRY;
}

function daysLeft(state){
  if (!state || isUnlimitedPlan(state)) return Infinity;
  const expiry = Number(state.planExpiry || INFINITE_EXPIRY);
  const d = Math.ceil((expiry - Date.now())/(24*3600*1000));
  return Math.max(0, d);
}


function planExpireText(state){
  if (isUnlimitedPlan(state)) return 'Unlimited';
  return daysLeft(state) + ' days left';
}
function planDaysLeftText(state){
  if (isUnlimitedPlan(state)) return '∞';
  return String(daysLeft(state));
}


async function autoSwitchToFreeIfExpired(){
  if (!state) return false;
  if (state.plan === 'free') return false;
  if (Date.now() < Number(state.planExpiry||0)) return false;
  state.plan = 'free';
  state.planExpiry = INFINITE_EXPIRY;

  // Plan expired -> this user's "active referral" status with their referrer
  // no longer holds. Remove them from the referrer's activeReferrals list so
  // they fall back to normal-commission-rate referral, and clear the local
  // credited flag so a future re-upgrade can re-credit active status.
  if (state.usedRefer && state.usedRefer.telegramUid && state.usedRefer.telegramUid !== state.uid){
    await removeActiveReferral(state.usedRefer.telegramUid, state.uid);
  }
  state.activeReferralCredited = false;

  await saveState();
  showToast('Your plan expired — switched back to Free', ICONS.hourglass);
  return true;
}

// Removes referredUid from referrerId's activeReferrals list (used when a
// referred user's paid plan expires and they drop back to Free — they should
// no longer count as an "active" referral for commission purposes).
async function removeActiveReferral(referrerId, referredUid){
  try{
    const snap = await get(ref(db, 'users/' + referrerId + '/activeReferrals'));
    if (!snap.exists()) return;
    const raw = snap.val();
    const arr = Array.isArray(raw) ? raw.slice() : Object.values(raw || {});
    const next = arr.filter(r => !(r && r.uid === referredUid));
    if (next.length === arr.length) return; // nothing to remove
    await update(ref(db, 'users/' + referrerId + '/activeReferrals'), next);
  }catch(e){
    console.error('removeActiveReferral failed', e);
  }
}


// Keep a safe bootstrap state during Telegram/Firebase startup.
// Telegram WebView can fire UI/listener callbacks before loadState() finishes;
// those callbacks must never be allowed to read state.plan from null.
let state = {
  uid: null,
  plan: 'free',
  planExpiry: INFINITE_EXPIRY,
  managementBadge: null,
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
  stonehunt: { session: null },
  stoneHuntHistory: {},
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
    plan: 'free',
    planExpiry: INFINITE_EXPIRY,


    referralEarnings: 0,


    activeReferralCredited: false,


    activeReferrals: [],


    accountCreatedAt: Date.now(),

    lastActiveAt: null,

    streak: 0,
    referrals: [],
    transactions: [],
    copiedTrades: {},
    completedTasks: {},
    taskCompletionCount: {},
    dailyBonusClaimedAt: null,
    stonehunt: {
      session: null, // { planId, status, startedAt, baseDurationMs, progressUnitsMs, lastChangeAt, currentSpeed, adsWatched, boostTarget, maxSpeed, boostApplied, activityCheckRequired, activityCheckAt, nextActivityCheckAt, dailySessionNumber, completedAt }
    },
    stoneHuntHistory: {},
    adCampaigns: [],
    notifications: []
  };
}


function normalizeLoadedState(raw, profile, ip){
  const base = emptyState(profile, ip);
  const src = (raw && typeof raw === 'object') ? raw : {};
  const merged = { ...base, ...src };
  if (!merged.plan) merged.plan = 'free';
  if (!Number.isFinite(Number(merged.planExpiry))) merged.planExpiry = INFINITE_EXPIRY;
  if (!merged.stonehunt || typeof merged.stonehunt !== 'object') merged.stonehunt = { session: null };
  if (!('session' in merged.stonehunt)) merged.stonehunt.session = null;
  if (!Array.isArray(merged.transactions)) merged.transactions = [];
  if (!merged.completedTasks || typeof merged.completedTasks !== 'object') merged.completedTasks = {};
  if (!merged.taskCompletionCount || typeof merged.taskCompletionCount !== 'object') merged.taskCompletionCount = {};
  if (!Array.isArray(merged.adCampaigns)) merged.adCampaigns = [];
  if (!Array.isArray(merged.referrals)) merged.referrals = [];
  if (!Array.isArray(merged.notifications)) merged.notifications = [];
  if (!merged.stoneHuntHistory || typeof merged.stoneHuntHistory !== 'object') merged.stoneHuntHistory = {};
  return merged;
}

async function loadState(profile, ip){
  if (isGuest){
    state = emptyState(profile, ip);
    userPath = null;
    return state;
  }
  userPath = 'users/' + profile.uid;
  const snap = await get(ref(db, userPath));
  if (snap.exists()){
    state = normalizeLoadedState(snap.val(), profile, ip);
    state.username = profile.username || state.username;
    state.firstName = profile.firstName || state.firstName;
    state.lastName = profile.lastName || state.lastName;
    state.profilePic = profile.photoUrl || state.profilePic;
    state.localIP = ip || state.localIP || null;


    const legacyBuckets = ['gBalance', 'fBalance', 'stoneHuntBalance', 'adBalance'];
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
    if (document.visibilityState === 'visible') markUserActive();
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
      plan: u.plan || 'free',
      managementBadge: u.managementBadge === true || u.managementBadge === 'yes'
    };
  });
  return rows.sort((a,b)=>b.earn-a.earn).slice(0, limit);
}


async function captureReferralIfAny(tg, newState){
  if (isGuest) return;
  if (newState.usedRefer) return;


  const raw = tg?.initDataUnsafe?.start_param || tg?.initDataUnsafe?.startapp || '';
  const startParam = String(raw).trim();
  if (!startParam.toLowerCase().startsWith('ref_')) return;
  const code = startParam.slice(4);
  await linkReferralByCode(code, newState, 'telegram_deep_link', startParam);
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
    const activeReferralsRaw = referrer.activeReferrals || [];
    const activeReferralsArr = Array.isArray(activeReferralsRaw) ? activeReferralsRaw : Object.values(activeReferralsRaw);
    const isActiveReferral = activeReferralsArr.some(r => r && r.uid === state.uid);
    const rate = isActiveReferral ? currentPlan(referrer).refBonusActive : currentPlan(referrer).refBonusNormal;
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
      title: `Referral Commission from @${state.username || 'user'} (Withdraw, ${isActiveReferral ? 'Active' : 'Normal'})`,
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


function renderHome(){
  if (!state) return;
  if (isGuest && Date.now() >= Number(state.planExpiry||0) && state.plan !== 'free'){
    state.plan = 'free';
    state.planExpiry = INFINITE_EXPIRY;
  }
  document.getElementById('home-balance').textContent = fmt(state.totalBalance);
  document.getElementById('balance-change').innerHTML = `<span>↗</span> +${fmt(sessionEarnedToday)} today`;
  document.getElementById('stat-total-claim').textContent = state.totalClaim || 0;
  document.getElementById('stat-invalid-work').textContent = state.invalidWork || 0;
  document.getElementById('streak-count').textContent = state.streak;
  document.getElementById('ad-campaign-count').textContent = (typeof AD_CAMPAIGNS_CACHE !== 'undefined' ? AD_CAMPAIGNS_CACHE.length : 0);

  const p = currentPlan(state);
  document.getElementById('plan-badge').textContent = p.badge;
  document.getElementById('plan-badge').className = 'plan-badge ' + (p.id==='pro'?'plat':p.id==='elite'?'diamond':p.id==='starter'?'gold':'');
  const planIconEl = document.getElementById('plan-icon');
  planIconEl.innerHTML = planBadgeIcon(p.id, state.managementBadge);
  planIconEl.classList.add('badge-pulse', 'badge-clickable');
  planIconEl.dataset.badgePlan = resolveBadgeId(p.id, state.managementBadge);
  planIconEl.onclick = (e) => { e.stopPropagation(); openBadgeLightbox(planIconEl.dataset.badgePlan); };
  document.getElementById('plan-days').textContent = planDaysLeftText(state);
  const pct = isUnlimitedPlan(state) ? 100 : Math.min(100, Math.max(0, (daysLeft(state)/p.days)*100));
  document.getElementById('plan-progress-bar').style.width = pct + '%';
  document.getElementById('plan-features').innerHTML = p.features.map(f=>`<div class="plan-feature-mini"><span class="check">${ICONS.check}</span> ${f}</div>`).join('');

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
      <div class="lb-info"><div class="lb-name">${esc(u.name)}<span class="plan-badge-icon lb-badge badge-pulse badge-clickable" data-badge-plan="${resolveBadgeId(u.plan, u.managementBadge)}" onclick="event.stopPropagation(); openBadgeLightbox('${resolveBadgeId(u.plan, u.managementBadge)}')">${planBadgeIcon(u.plan, u.managementBadge)}</span></div><div class="lb-sub">Top Earner</div></div>
      <div class="lb-amount">${fmt(u.earn)}</div>
    </div>`;
  }).join('');
}


function dailyBonusAmount(){
  const mult = currentPlan(state).dailyBonusMultiplier || 1;
  return dailyBonusBase * mult;
}

function renderDailyBonus(){
  const btn = document.getElementById('claim-bonus-btn');
  const desc = document.getElementById('daily-bonus-desc');
  const claimedToday = state.dailyBonusClaimedAt && isSameDay(state.dailyBonusClaimedAt, Date.now());
  const amount = dailyBonusAmount();
  const mult = currentPlan(state).dailyBonusMultiplier || 1;
  if (claimedToday){
    setAdLockButtonLabel('claim-bonus-btn', 'Claimed');
    btn.disabled = true;
    desc.textContent = 'Come back tomorrow for more!';
  } else {
    setAdLockButtonLabel('claim-bonus-btn', 'Claim');
    btn.disabled = false;
    desc.textContent = mult > 1
      ? `Claim +${fmt(amount)} today (${currentPlan(state).name} ×${mult} bonus)!`
      : `Claim +${fmt(amount)} today!`;
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

function openPlans(){ renderPlans(); openOverlay('plans'); }


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

function exchangeRateForPlan(planId){
  const plan = PLANS.find(p => p.id === planId) || PLANS[0];
  return plan.exchangeRate || 0;
}

function openExchange(){
  renderExchangeScreen();
  openOverlay('exchange');
}

function renderExchangeScreen(){
  const p = currentPlan(state);
  const rate = exchangeRateForPlan(p.id);
  const locked = rate <= 0;

  document.getElementById('exchange-rate-value').textContent = Math.round(rate * 100) + '%';
  document.getElementById('exchange-rate-plan').textContent = p.name + ' Plan';
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
  const p = currentPlan(state);
  const rate = exchangeRateForPlan(p.id);
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
    errEl.textContent = 'Your current plan cannot exchange';
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

  const p = currentPlan(state);
  const rate = exchangeRateForPlan(p.id);
  if (rate <= 0){
    showToast("Your plan doesn't allow exchange — upgrade to unlock", ICONS.warning);
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
  const plan = PLANS.find(p => p.id === planId) || PLANS[0];
  return plan.giftCodeMax || 0;
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


const DAILY_LIMIT_FIELD_BY_FEATURE = { task:'taskLimit', gmail:'gmailLimit', facebook:'facebookLimit', stonehunt:'stoneHuntDailyLimit' };

function dailyLimitForPlan(planId, feature){
  if (feature === 'watchad') return WATCH_AD_SETTINGS.dailyLimit;
  const plan = PLANS.find(p => p.id === planId) || PLANS[0];
  const field = DAILY_LIMIT_FIELD_BY_FEATURE[feature] || 'taskLimit';
  return plan[field] != null ? plan[field] : PLANS[0][field];
}


// Daily limits (tasks, gmail, facebook, stone hunt, watch-ad) all reset at midnight (12:00 AM)
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


let dailyLimitCounts = { task: 0, gmail: 0, facebook: 0, watchad: 0 };
let dailyLimitListenersStarted = { task: false, gmail: false, facebook: false, watchad: false };
let dailyLimitRenderCallbacks = { task: null, gmail: null, facebook: null, watchad: null };

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
    ['task','gmail','facebook','stonehunt','watchad'].forEach(f => {
      renderDailyLimitCard(f);
    });
    if (typeof watchAdRenderCooldown === 'function') watchAdRenderCooldown();
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
  const items = (TASKS_BY_CATEGORY[category] || []).filter(t => Number(t.completedCount||0) < Number(t.totalQty||0));

  if (items.length === 0){
    wrap.innerHTML = `<div class="task-empty-row"><div class="empty-state"><div class="empty-icon">${ICONS.inbox}</div><div class="empty-title">No tasks available</div><div class="empty-desc">Check back later for new tasks</div></div></div>`;
    return;
  }

  wrap.innerHTML = items.map(t => {
    const myCount = (state.taskCompletionCount && state.taskCompletionCount[t.id]) || 0;
    const limitHit = myCount >= Number(t.perUserLimit||1);
    const dailyHit = isDailyLimitHit('task');
    const catLabel = (t.category||'').charAt(0).toUpperCase() + (t.category||'').slice(1);
    const remaining = Math.max(0, Number(t.totalQty||0) - Number(t.completedCount||0));
    const usedQty = Number(t.totalQty||0) - remaining;

    let actionsHtml;
    if (dailyHit){
      actionsHtml = `<button class="task-card-btn task-card-limit-full" disabled>Daily Limit</button>`;
    } else if (limitHit){
      actionsHtml = `<button class="task-card-btn task-card-limit-full" disabled>Limit</button>`;
    } else if (t.proofRequired){

      actionsHtml = `
        <button class="task-card-btn" onclick="startTaskLinkOnly('${escapeHtml(t.actionLink||'')}')">Go</button>
        <button class="task-card-btn verify" onclick="openProofModal('${category}','${t.id}')">Verify</button>`;
    } else {

      actionsHtml = `<button class="task-card-btn" data-task-id="${escapeHtml(t.id)}" onclick="startTask('${category}','${t.id}')">Go</button>`;
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
        ${t.proofRequired ? `<div class="task-card-details">(need proof)</div>` : ''}
        <div class="task-card-qty">Qty: ${usedQty}/${Number(t.totalQty||0)} used · Limit: ${Number(t.perUserLimit||1)}/user</div>
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

  const btn = document.querySelector(`.task-card-btn[data-task-id="${id}"]`);
  if (btn){ btn.disabled = true; btn.textContent = 'Verifying...'; }

  taskLinkTimers[id] = setTimeout(() => {
    delete taskLinkTimers[id];
    claimTaskReward(category, id);
  }, TASK_LINK_VERIFY_MS);
}


async function claimTaskReward(category, id){
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
      renderTaskItems(category);
      return;
    }


    if (!state.taskCompletionCount) state.taskCompletionCount = {};
    state.taskCompletionCount[id] = Number(txResult.snapshot.val() || 1);


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
  document.getElementById('proof-picker-content').innerHTML = `<div class="proof-picker-hint">Tap to choose an image from your gallery</div>`;
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
      document.getElementById('proof-picker-content').innerHTML = `<div class="proof-picker-hint">Tap to choose an image from your gallery</div>`;
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
      closeProofModal();
      renderTaskItems(category);
      return;
    }

    if (!state.taskCompletionCount) state.taskCompletionCount = {};
    state.taskCompletionCount[id] = Number(txResult.snapshot.val() || 1);


    await Promise.race([
      push(ref(db, 'task_submissions'), {
        uid: state.uid,
        taskId: id,
        taskName: t.name || '',
        proof: proofPickedDataUrl,
        status: 'pending',
        createdAt: Date.now()
      }),
      new Promise((_, rej) => setTimeout(() => rej(new Error('Submission timed out')), 20000))
    ]);


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

// A plan with no vipPlans list (or an empty one) is open to every plan tier.
// Normalizes both new ({normalCount, activeCount}) and legacy ({type, count}) refer requirement shapes
// into a single { normalCount, activeCount } object.
function normalizeReferReq(refer){
  if (!refer) return { normalCount: 0, activeCount: 0 };
  if (refer.type){
    return { normalCount: refer.type === 'active' ? 0 : Number(refer.count||0), activeCount: refer.type === 'active' ? Number(refer.count||0) : 0 };
  }
  return { normalCount: Number(refer.normalCount||0), activeCount: Number(refer.activeCount||0) };
}
function referReqLabel(refer){
  const { normalCount, activeCount } = normalizeReferReq(refer);
  const bits = [];
  if (normalCount) bits.push(`Normal refer x${normalCount}`);
  if (activeCount) bits.push(`Active refer x${activeCount}`);
  return bits.join(' + ') || 'Refer requirement';
}
function referReqMet(refer){
  const { normalCount, activeCount } = normalizeReferReq(refer);
  const normalOk = normalCount <= 0 || (state.referrals||[]).length >= normalCount;
  const activeOk = activeCount <= 0 || (state.activeReferrals||[]).length >= activeCount;
  return normalOk && activeOk;
}

// Required plan tier for a mining model — empty/'' means any plan (including Free) is fine.
// Uses PLANS order to compare tiers, so e.g. requiredPlan:'pro' also allows 'elite'.
function planReqMet(requiredPlan){
  if (!requiredPlan) return true;
  if (!state) return false;
  const reqIdx = PLANS.findIndex(p => p.id === requiredPlan);
  if (reqIdx < 0) return true;
  const curIdx = PLANS.findIndex(p => p.id === state.plan);
  return curIdx >= reqIdx;
}
function planReqLabel(requiredPlan){
  if (!requiredPlan) return '';
  const p = PLANS.find(x => x.id === requiredPlan);
  return p ? (p.name + ' plan') : '';
}

function userEligibleForPlan(p){
  const vip = p.vipPlans;
  if (!vip || !Array.isArray(vip) || vip.length === 0) return true;
  return vip.includes(state.plan || 'free');
}

function vipPlanNames(p){
  return (p.vipPlans||[]).map(id => (PLANS.find(pl=>pl.id===id)||{}).name || id).join(', ');
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
          const refundPercent = Number(plan.investmentRefund||0);
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
    return `<div class="ip-plan-card" onclick="openInvestmentDetail('${p.id}')">
      <div class="ip-plan-card-img">
        <img src="${esc(p.image||'')}" alt="" onerror="this.style.display='none'">
      </div>
      <div class="ip-plan-card-name">${esc(p.name||'')}</div>
      <div class="ip-plan-card-stats">
        <div class="ip-plan-card-stat"><div class="ip-plan-card-stat-label">Entry Fee</div><div class="ip-plan-card-stat-value">${fmt(p.entryFee)}</div></div>
        <div class="ip-plan-card-stat"><div class="ip-plan-card-stat-label">Total Profit</div><div class="ip-plan-card-stat-value">${fmt(p.totalProfit)}</div></div>
      </div>
      <div class="ip-plan-card-req">${reqText}</div>
      <button class="ip-plan-card-btn" ${btnDisabled?'disabled':''} onclick="event.stopPropagation(); openInvestmentDetail('${p.id}');">${btnLabel}</button>
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
    <div class="wd-icon-lg" style="background:#F1EEFF;padding:0;overflow:hidden;">
      <img src="${esc(p.image||'')}" style="width:100%;height:100%;object-fit:cover;border-radius:20px;" onerror="this.style.display='none'">
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
    const { normalCount, activeCount } = normalizeReferReq(req.refer);
    const parts = [];
    if (normalCount > 0) parts.push({ label: 'Normal Refer', required: normalCount, current: (state.referrals||[]).length });
    if (activeCount > 0) parts.push({ label: 'Active Refer', required: activeCount, current: (state.activeReferrals||[]).length });
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
    <div class="wd-icon-lg" style="background:#F1EEFF;padding:0;overflow:hidden;">
      <img src="${esc(plan.image||'')}" style="width:100%;height:100%;object-fit:cover;border-radius:20px;" onerror="this.style.display='none'">
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

const TX_ICON = { deposit:{icon:ICONS.plus, bg:'#DFF6EE'}, withdraw:{icon:ICONS.minus, bg:'#FFE9E6'}, earn:{icon:ICONS.coin, bg:'#EDEBFF'}, stonehunt:{icon:ICONS.diamond, bg:'#DFF6EE'}, mining:{icon:ICONS.cart, bg:'#DFF6EE'}, watchad:{icon:ICONS.megaphone||ICONS.coin, bg:'#FFEAEA'} };

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
    const style = TX_ICON[t.type];
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
// STONEHUNT SYSTEM
// ============================================================
// Firebase RTDB layout used by this module (under existing db):
//   users/{uid}/stonehunt/session   -> the single active/last session object
//   users/{uid}/stonehunt/nextActivityCheckAt -> ms epoch (server-clock based)
//   stonehuntHistory/{uid}/{pushId} -> completed session records
//   daily_limits/{uid}/stonehunt/{dateKey} -> counter (reuses existing daily-limit pattern)
//
// Server-time note: this app has no Cloud Functions, so true server-side
// validation of ad completion / boost rolls / reward math is not possible.
// We reduce clock-tampering risk by never trusting the device clock for
// elapsed-time math: instead we read Firebase's `.info/serverTimeOffset`
// once and use (Date.now() + offset) as "now" everywhere stonehunt-related.
// Changing the phone's clock does not change this offset. The reward/boost
// math itself still runs on the client because no backend exists to run it
// on; if you later add Cloud Functions, move computeStoneHuntReward(),
// rollBoostMultiplier() and the completion write into a callable function.

let stoneHuntServerOffset = 0;
function stoneHuntNow(){ return Date.now() + stoneHuntServerOffset; }
function startStoneHuntServerClock(){
  onValue(ref(db, '.info/serverTimeOffset'), snap => {
    stoneHuntServerOffset = Number(snap.val() || 0);
  });
}

let stoneHuntTickInterval = null;
let stoneHuntHistoryCache = [];
let stoneHuntActivityModalOpen = false;
let stoneHuntAdBusy = false;

function stoneHuntSession(){ return (state && state.stonehunt && state.stonehunt.session) || null; }

function stoneHuntPath(sub){ return `${userPath}/stonehunt${sub ? '/' + sub : ''}`; }

// ---- guest-mode local stonehunt (no Firebase, no reward) ----
// Guests can run the full stonehunt animation/timer locally so they can see how it works,
// but nothing is written to Firebase and no coins are credited. Daily limit + stone count
// still apply, tracked in localStorage only, and reset the same way as logged-in accounts.
const GUEST_STONEHUNT_KEY = 'guestStoneHuntSession';
const GUEST_STONEHUNT_COUNT_KEY = 'guestStoneHuntCount';
function guestStoneHuntLoadSession(){
  try{ const raw = localStorage.getItem(GUEST_STONEHUNT_KEY); return raw ? JSON.parse(raw) : null; }catch(e){ return null; }
}
function guestStoneHuntSaveSession(session){
  try{
    if (session) localStorage.setItem(GUEST_STONEHUNT_KEY, JSON.stringify(session));
    else localStorage.removeItem(GUEST_STONEHUNT_KEY);
  }catch(e){}
}
function guestStoneHuntLoadCount(){
  try{
    const raw = JSON.parse(localStorage.getItem(GUEST_STONEHUNT_COUNT_KEY) || 'null');
    const dateKey = dailyLimitDateKey();
    if (!raw || raw.dateKey !== dateKey) return 0;
    return Number(raw.count || 0);
  }catch(e){ return 0; }
}
function guestStoneHuntSaveCount(count){
  try{ localStorage.setItem(GUEST_STONEHUNT_COUNT_KEY, JSON.stringify({ dateKey: dailyLimitDateKey(), count })); }catch(e){}
}
function guestStoneHuntInit(){
  dailyLimitCounts.stonehunt = guestStoneHuntLoadCount();
  const s = guestStoneHuntLoadSession();
  if (s) state.stonehunt.session = s;
}

// ---- progress math ----
// progressUnitsMs = "work" already completed, measured in 1x-equivalent ms.
// remaining work = baseDurationMs - (progressUnitsMs + (now-lastChangeAt)*currentSpeed)
// remaining real ms = remaining work / currentSpeed
function stoneHuntFlushedProgress(session, now){
  if (!session) return 0;
  if (session.status !== 'active') return session.progressUnitsMs || 0;
  const elapsed = Math.max(0, now - session.lastChangeAt);
  return (session.progressUnitsMs || 0) + elapsed * (session.currentSpeed || 1);
}
function stoneHuntRemainingRealMs(session, now){
  if (!session) return 0;
  const done = stoneHuntFlushedProgress(session, now);
  const remainingWork = Math.max(0, session.baseDurationMs - done);
  const speed = session.status === 'active' ? (session.currentSpeed || 1) : (session.currentSpeed || 1);
  return remainingWork / speed;
}
function stoneHuntProgressPct(session, now){
  if (!session) return 0;
  const done = stoneHuntFlushedProgress(session, now);
  return Math.max(0, Math.min(100, (done / session.baseDurationMs) * 100));
}

// ---- stone helpers ----
// "Stones" shown in the cave === the plan's daily stonehunt limit (dailyLimitCounts.stonehunt already-mined
// stones are shown as broken/crumbled). Each Start StoneHunt press mines exactly ONE stone (one session),
// worth totalReward / stoneCount coins, paid out the moment that stone breaks.
function stoneHuntStoneCount(){
  return stoneHuntPlanConfig(state.plan).dailyLimit;
}
function stoneHuntRewardEach(){
  // Admin-set reward is PER STONE (not divided across the plan's daily stone count).
  return STONEHUNT_TOTAL_REWARD;
}

// ---- start ----
async function startStoneHunt(){
  if (!appInitialized){
    showToast('Account is still loading. Please wait a moment.', ICONS.hourglass);
    return;
  }
  const existing = stoneHuntSession();
  if (existing && (existing.status === 'active' || existing.status === 'paused_check')){
    showToast('Stone Hunt is already running', ICONS.warning);
    return;
  }
  const cfg = stoneHuntPlanConfig(state.plan);
  const dateKey = dailyLimitDateKey();

  if (isGuest){
    // Local-only: enforce the same daily stone limit, but never touches Firebase and pays no reward.
    if (guestStoneHuntLoadCount() >= cfg.dailyLimit){
      showToast('Daily stonehunt limit reached. Come back tomorrow.', ICONS.warning);
      renderStoneHunt();
      return;
    }
    const now = stoneHuntNow();
    const stoneIndex = dailyLimitCounts.stonehunt;
    const session = {
      planId: state.plan, status: 'active', startedAt: now,
      baseDurationMs: STONEHUNT_BASE_DURATION_MS,
      totalReward: 0, // guests never earn coins
      stoneIndex, stoneCount: cfg.dailyLimit,
      progressUnitsMs: 0, lastChangeAt: now,
      currentSpeed: cfg.baseSpeed, maxSpeed: cfg.maxSpeed, boostTarget: cfg.boostTarget,
      adsWatched: 0, boostApplied: false,
      activityCheckRequired: false, activityCheckAt: null,
      nextActivityCheckAt: now + stoneHuntRandomCheckDelay(),
      dailySessionNumber: dailyLimitCounts.stonehunt, dateKey, completedAt: null,
      guest: true,
    };
    state.stonehunt.session = session;
    guestStoneHuntSaveSession(session);
    haptic('medium');
    showToast('Stone Hunt started! (Guest mode — sign in via Telegram to earn coins)', ICONS.pickaxe);
    renderStoneHunt();
    stoneHuntEnsureTicker();
    caveStartStoneHuntAnim(stoneIndex);
    return;
  }

  const stoneIndex = dailyLimitCounts.stonehunt; // 0-based index of the stone being mined right now (captured BEFORE claiming the slot, so it isn't off by one)
  const committed = await claimDailyLimitSlot('stonehunt');
  if (!committed){
    showToast('Daily stonehunt limit reached. Come back tomorrow.', ICONS.warning);
    renderStoneHunt();
    return;
  }
  const now = stoneHuntNow();
  const session = {
    planId: state.plan,
    status: 'active',
    startedAt: now,
    baseDurationMs: STONEHUNT_BASE_DURATION_MS, // duration for THIS ONE stone
    totalReward: stoneHuntRewardEach(),     // reward for THIS ONE stone (totalReward / stoneCount)
    stoneIndex,
    stoneCount: cfg.dailyLimit,
    progressUnitsMs: 0,
    lastChangeAt: now,
    currentSpeed: cfg.baseSpeed, // always starts at 1x per spec
    maxSpeed: cfg.maxSpeed,
    boostTarget: cfg.boostTarget,
    adsWatched: 0,
    boostApplied: false,
    activityCheckRequired: false,
    activityCheckAt: null,
    nextActivityCheckAt: cfg.boostTarget > 0 || true ? now + stoneHuntRandomCheckDelay() : null,
    dailySessionNumber: stoneIndex,
    dateKey,
    completedAt: null,
  };
  await set(ref(db, stoneHuntPath('session')), session);
  state.stonehunt.session = session;
  haptic('medium');
  showToast('Stone Hunt started!', ICONS.pickaxe);
  renderStoneHunt();
  stoneHuntEnsureTicker();
  caveStartStoneHuntAnim(stoneIndex);
}

function stoneHuntRandomCheckDelay(){
  return STONEHUNT_ACTIVITY_CHECK_MS;
}

// ---- restore on load / reconnect ----
async function restoreStoneHuntOnLoad(){
  if (isGuest){
    guestStoneHuntInit();
    if (currentScreen === 'stonehunt') renderStoneHunt();
    stoneHuntEnsureTicker();
    return;
  }
  if (!userPath) return;
  const snap = await get(ref(db, stoneHuntPath('session')));
  if (snap.exists()){
    state.stonehunt.session = snap.val();
  }
  onValue(ref(db, stoneHuntPath('session')), s => {
    state.stonehunt.session = s.exists() ? s.val() : null;
    if (currentScreen === 'stonehunt') { renderStoneHunt(); caveResumeAnimIfActive(); }
    stoneHuntEnsureTicker();
  });
  onValue(ref(db, `stonehuntHistory/${state.uid}`), s => {
    const val = s.exists() ? s.val() : {};
    stoneHuntHistoryCache = Object.keys(val).map(id => ({ id, ...val[id] })).sort((a,b) => (b.completedAt||0)-(a.completedAt||0));
    if (currentScreen === 'stonehunt') renderStoneHuntHistoryList();
  });
  ensureDailyLimitListener('stonehunt', () => { if (currentScreen === 'stonehunt') renderStoneHunt(); });
  stoneHuntEnsureTicker();
}

function stoneHuntEnsureTicker(){
  const s = stoneHuntSession();
  const needsTicker = s && (s.status === 'active' || s.status === 'paused_check');
  if (needsTicker && !stoneHuntTickInterval){
    stoneHuntTickInterval = setInterval(stoneHuntTick, 1000);
  } else if (!needsTicker && stoneHuntTickInterval){
    clearInterval(stoneHuntTickInterval);
    stoneHuntTickInterval = null;
  }
}

// ---- main tick: activity-check trigger + completion, runs every second ----
async function stoneHuntTick(){
  const s = stoneHuntSession();
  if (!s) { stoneHuntEnsureTicker(); return; }
  const now = stoneHuntNow();

  if (s.status === 'active'){
    if (s.nextActivityCheckAt && now >= s.nextActivityCheckAt){
      await stoneHuntTriggerActivityCheck();
      return;
    }
    const remaining = stoneHuntRemainingRealMs(s, now);
    if (remaining <= 0){
      await stoneHuntCompleteSession();
      return;
    }
  }

  if (currentScreen === 'stonehunt') renderStoneHuntLiveBits();
}

// ---- activity check ----
// Applies a partial update to the current stonehunt session, writing to Firebase for signed-in
// users or to localStorage for guests. Keeps activity-check/boost logic identical for both.
async function stoneHuntPatchSession(patch){
  const s = stoneHuntSession();
  if (!s) return null;
  const updated = { ...s, ...patch };
  if (isGuest){
    guestStoneHuntSaveSession(updated);
  } else {
    await update(ref(db, stoneHuntPath('session')), patch);
  }
  state.stonehunt.session = updated;
  return updated;
}

async function stoneHuntTriggerActivityCheck(){
  const s = stoneHuntSession();
  if (!s || s.status !== 'active') return;
  const now = stoneHuntNow();
  const flushed = stoneHuntFlushedProgress(s, now);
  await stoneHuntPatchSession({
    status: 'paused_check', progressUnitsMs: flushed, lastChangeAt: now,
    activityCheckRequired: true, activityCheckAt: now,
  });
  renderStoneHunt();
  stoneHuntOpenActivityCheckModal();
}

function stoneHuntOpenActivityCheckModal(){
  stoneHuntActivityModalOpen = true;
  const modal = document.getElementById('stonehunt-activity-modal');
  if (modal) modal.classList.remove('hidden');
}
function stoneHuntCloseActivityCheckModal(){
  stoneHuntActivityModalOpen = false;
  const modal = document.getElementById('stonehunt-activity-modal');
  if (modal) modal.classList.add('hidden');
}

async function stoneHuntActivityCheckNow(){
  const s = stoneHuntSession();
  if (!s || !s.activityCheckRequired) return;
  if (stoneHuntAdBusy) return;
  stoneHuntAdBusy = true;
  const btn = document.getElementById('stonehunt-activity-check-btn');
  if (btn) btn.disabled = true;
  try{
    await stoneHuntShowRewardedAd();
    const now = stoneHuntNow();
    const next = now + stoneHuntRandomCheckDelay();
    await stoneHuntPatchSession({
      status: 'active',
      activityCheckRequired: false,
      activityCheckAt: null,
      lastChangeAt: now,
      nextActivityCheckAt: next,
    });
    haptic('success');
    showToast('Stone Hunt resumed', ICONS.pickaxe);
    stoneHuntCloseActivityCheckModal();
    renderStoneHunt();
    stoneHuntEnsureTicker();
  }catch(e){
    showToast('Ad not completed — stonehunt stays paused. Try again.', ICONS.warning);
  }finally{
    stoneHuntAdBusy = false;
    if (btn) btn.disabled = false;
  }
}

// ---- boost ----
function stoneHuntBoostMaxedOut(){
  const s = stoneHuntSession();
  if (!s) return false;
  const cfg = stoneHuntPlanConfig(s.planId);
  return (s.currentSpeed || 1) >= cfg.maxSpeed - 0.001;
}

async function stoneHuntWatchBoostAd(){
  const s = stoneHuntSession();
  if (!s || s.status === 'completed'){ showToast('Start stonehunt first', ICONS.warning); return; }
  if (stoneHuntAdBusy) return;
  const cfg = stoneHuntPlanConfig(s.planId);
  if (cfg.maxSpeed <= 1){ showToast('This plan has no boost available', ICONS.warning); return; }
  if (stoneHuntBoostMaxedOut()){ showToast('Maximum boost speed already reached', ICONS.warning); return; }
  stoneHuntAdBusy = true;
  const btn = document.getElementById('stonehunt-boost-btn');
  if (btn) btn.disabled = true;
  try{
    await stoneHuntShowRewardedAd();
    // Each completed ad rolls an incremental speed bump, never exceeding the plan's max speed.
    // Clamping to cfg.maxSpeed enforces: Starter/Pro <= 2x, Elite <= 3x, regardless of client tampering attempts.
    const current = s.currentSpeed || 1;
    const step = Math.random() * ((cfg.maxSpeed - 1) / Math.max(1, cfg.boostTarget || 3));
    const newSpeed = Math.min(cfg.maxSpeed, Math.round((current + Math.max(0.05, step)) * 100) / 100);

    const now = stoneHuntNow();
    const flushed = stoneHuntFlushedProgress(s, now); // preserve completed work, only remaining portion sped up
    const newAdsWatched = (s.adsWatched || 0) + 1;
    await stoneHuntPatchSession({
      currentSpeed: newSpeed,
      progressUnitsMs: flushed,
      lastChangeAt: now,
      adsWatched: newAdsWatched,
      boostApplied: true,
    });
    haptic('success');
    showToast(`🎉 Boost! Speed now ${newSpeed.toFixed(2)}×`, ICONS.bolt);
    renderStoneHunt();
  }catch(e){
    showToast('Ad not completed', ICONS.warning);
  }finally{
    stoneHuntAdBusy = false;
    if (btn) btn.disabled = false;
  }
}

function stoneHuntShowRewardedAd(){
  return showRewardedAdGate();
}

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

// ---- completion ----
let stoneHuntCompletionInFlight = false;
async function stoneHuntCompleteSession(){
  if (stoneHuntCompletionInFlight) return;
  stoneHuntCompletionInFlight = true;
  try{
    if (isGuest){
      const current = stoneHuntSession();
      if (!current || current.status === 'completed') return;
      const now = stoneHuntNow();
      const remaining = stoneHuntRemainingRealMs(current, now);
      if (remaining > 500) return;
      const finalSession = { ...current, status: 'completed', completedAt: now, progressUnitsMs: current.baseDurationMs, lastChangeAt: now };
      state.stonehunt.session = finalSession;
      guestStoneHuntSaveSession(finalSession);
      const newCount = dailyLimitCounts.stonehunt + 1;
      dailyLimitCounts.stonehunt = newCount;
      guestStoneHuntSaveCount(newCount);
      haptic('success');
      showToast('Stone Hunt complete! Sign in via Telegram to earn coins.', ICONS.success);
      caveBreakStone(finalSession.stoneIndex != null ? finalSession.stoneIndex : newCount - 1);
      renderStoneHunt();
      return;
    }
    // Idempotency guard: only proceed if the session in Firebase is still active/paused (not already completed).
    const txResult = await runTransaction(ref(db, stoneHuntPath('session')), (current) => {
      if (!current) return current;
      if (current.status === 'completed') return current; // already done, no-op
      const now = stoneHuntNow();
      const remaining = stoneHuntRemainingRealMs(current, now);
      if (remaining > 500) return current; // not actually finished yet, leave untouched
      return { ...current, status: 'completed', completedAt: now, progressUnitsMs: current.baseDurationMs, lastChangeAt: now };
    });
    if (!txResult.committed) return;
    const finalSession = txResult.snapshot.val();
    if (!finalSession || finalSession.status !== 'completed') return;
    // if it was already marked completed before (someone else/tab beat us), don't double-reward
    if (finalSession._rewarded) return;

    const totalRealMs = Math.max(1, finalSession.completedAt - finalSession.startedAt);
    const overallSpeed = finalSession.baseDurationMs / totalRealMs;
    const baseReward = finalSession.totalReward != null ? finalSession.totalReward : STONEHUNT_TOTAL_REWARD;
    const reward = Math.round(baseReward * overallSpeed * 100) / 100;

    await update(ref(db, stoneHuntPath('session')), { _rewarded: true });

    state.EarningBalance = Number(state.EarningBalance || 0) + reward;
    recomputeTotalBalance();
    sessionEarnedToday += reward;
    addTransaction('stonehunt', 'Stone Hunt reward', reward, 'completed');
    await patchState({ EarningBalance: state.EarningBalance, totalBalance: state.totalBalance, transactions: state.transactions });

    await push(ref(db, `stonehuntHistory/${state.uid}`), {
      date: finalSession.startedAt,
      planId: finalSession.planId,
      startedAt: finalSession.startedAt,
      completedAt: finalSession.completedAt,
      baseSpeed: finalSession.maxSpeed ? stoneHuntPlanConfig(finalSession.planId).baseSpeed : 1,
      boostMultiplier: finalSession.boostApplied ? finalSession.currentSpeed : 1,
      finalSpeed: Math.round(overallSpeed * 100) / 100,
      durationMs: totalRealMs,
      status: 'completed',
      reward,
    });

    haptic('success');
    showToast(`Stone Hunt complete! +${fmt(reward)}`, ICONS.success);
    caveBreakStone(finalSession.stoneIndex != null ? finalSession.stoneIndex : dailyLimitCounts.stonehunt - 1);
    renderStoneHunt();
  } finally {
    stoneHuntCompletionInFlight = false;
    stoneHuntEnsureTicker();
  }
}

// ---- rendering ----
function openStoneHunt(){ renderStoneHunt(); openOverlay('stonehunt'); stoneHuntEnsureTicker(); caveResumeAnimIfActive(); }

function openComingSoon(name){
  haptic('light');
  showToast(`${name || 'This feature'} is coming soon — stay tuned!`, ICONS.hourglass || ICONS.warning);
}
window.openComingSoon = openComingSoon;

let caveAnimResumedForSession = null;
function caveResumeAnimIfActive(){
  const s = stoneHuntSession();
  if (s && (s.status === 'active' || s.status === 'paused_check')){
    const key = s.startedAt + ':' + s.stoneIndex;
    if (caveAnimResumedForSession !== key){
      caveAnimResumedForSession = key;
      caveStartStoneHuntAnim(s.stoneIndex);
    }
  } else {
    caveAnimResumedForSession = null;
    caveMinerActiveForIndex = null;
    if (caveSwingInterval){ clearInterval(caveSwingInterval); caveSwingInterval = null; }
  }
}

function renderStoneHunt(){
  if (!state) return;
  renderStoneHuntLiveBits();
  renderStoneHuntBoostCard();
  renderDailyLimitCard('stonehunt');
  renderStoneHuntHistoryList();
  renderCaveStones();
  renderCaveSkeleton();
  const s = stoneHuntSession();
  if (s && s.activityCheckRequired && !stoneHuntActivityModalOpen){
    stoneHuntOpenActivityCheckModal();
  } else if ((!s || !s.activityCheckRequired) && stoneHuntActivityModalOpen){
    stoneHuntCloseActivityCheckModal();
  }
}

function renderStoneHuntLiveBits(){
  const s = stoneHuntSession();
  const now = stoneHuntNow();
  const cfg = stoneHuntPlanConfig(state.plan);

  const statusEl = document.getElementById('stonehunt-status-badge');
  const speedEl = document.getElementById('stonehunt-speed-value');
  const remainEl = document.getElementById('stonehunt-remaining-value');
  const progBar = document.getElementById('stonehunt-progress-bar');
  const progPct = document.getElementById('stonehunt-progress-pct');
  const startBtn = document.getElementById('stonehunt-start-btn');
  const circle = document.getElementById('stonehunt-circle');
  const usedEl = document.getElementById('stonehunt-used-count');
  const remainingLimitEl = document.getElementById('stonehunt-remaining-limit');

  const active = s && s.status === 'active';
  const paused = s && s.status === 'paused_check';
  const running = active || paused;

  if (circle) circle.classList.toggle('active', !!active);
  if (statusEl){
    statusEl.innerHTML = active ? '🟢 ACTIVE' : (paused ? '🟠 PAUSED — Activity Check' : (s && s.status==='completed' ? '✅ COMPLETED' : '⚪ INACTIVE'));
  }
  if (speedEl) speedEl.textContent = (s ? (s.currentSpeed || 1) : 1).toFixed(2) + '×';
  if (remainEl) remainEl.textContent = running ? formatCountdown(stoneHuntRemainingRealMs(s, now)) : '--:--:--';
  const pct = running ? stoneHuntProgressPct(s, now) : (s && s.status==='completed' ? 100 : 0);
  if (progBar) progBar.style.width = pct.toFixed(1) + '%';
  if (progPct) progPct.textContent = Math.round(pct) + '%';

  const limitHit = isDailyLimitHit('stonehunt');
  if (startBtn){
    if (running){
      startBtn.disabled = true;
      startBtn.innerHTML = ICONS.pickaxe + (paused ? ' Paused' : ' Stone Hunt...');
    } else if (limitHit){
      startBtn.disabled = true;
      startBtn.innerHTML = 'Daily stonehunt limit reached';
    } else {
      startBtn.disabled = false;
      startBtn.innerHTML = ICONS.play + ' Start Stone Hunt';
    }
  }
  if (usedEl) usedEl.textContent = `${dailyLimitCounts.stonehunt}/${cfg.dailyLimit}`;
  if (remainingLimitEl) remainingLimitEl.textContent = Math.max(0, cfg.dailyLimit - dailyLimitCounts.stonehunt);
  const stoneCounterEl = document.getElementById('stonehunt-stone-counter');
  if (stoneCounterEl) stoneCounterEl.textContent = `Stone ${dailyLimitCounts.stonehunt}/${cfg.dailyLimit}`;

  const limitMsg = document.getElementById('stonehunt-limit-msg');
  if (limitMsg) limitMsg.classList.toggle('hidden', !limitHit || running);
}

let stoneHuntBoostPanelOpen = false;

// =====================================================================
// Cave stonehunt visual engine
// Renders `stoneCount` (= plan daily limit) stone slots into the cave.
// Stones with index < dailyLimitCounts.stonehunt are shown broken/crumbled.
// The stone at index === dailyLimitCounts.stonehunt is the "active" stone —
// the one currently being mined (or about to be, if idle).
// =====================================================================
const CAVE_STONE_COLORS = [
  { base:'#8a6b52', edge:'#5c4530', ore:'#ffd76b' },
  { base:'#7d6a5a', edge:'#4f4133', ore:'#8fd6ff' },
  { base:'#8f5f4a', edge:'#5a3a2c', ore:'#9dff8f' },
  { base:'#6f6458', edge:'#453e35', ore:'#ff9d6b' },
];
function caveStoneSVG(c){
  // Ore lump chiseled directly into the wall — no separate round socket ring.
  return `<svg viewBox="0 0 76 76">
    <g class="cave-rock-body">
      <polygon points="38,10 58,19 65,41 55,62 22,66 10,42 16,20" fill="${c.base}" stroke="${c.edge}" stroke-width="2"/>
      <polygon points="38,10 58,19 46,30 27,24" fill="${c.edge}" opacity=".35"/>
      <polygon points="22,66 10,42 26,42 30,55" fill="${c.edge}" opacity=".4"/>
      <circle cx="39" cy="37" r="6" fill="${c.ore}" opacity=".85"/>
      <circle cx="50" cy="47" r="3.5" fill="${c.ore}" opacity=".7"/>
    </g>
    <path class="cave-crack-line c1" d="M30 16 L36 32 L26 40 L34 52"/>
    <path class="cave-crack-line c2" d="M52 20 L46 34 L58 44 L48 60"/>
  </svg>`;
}
// Fixed layout slots around the cave wall (percent positions), reused/cycled if stoneCount > slots.
// Positions are percentages *within the wall band only* (#cave-stones is clipped
// to the top 70% of the scene, floor takes the bottom 30%) so stones always sit
// embedded in the rock face and never drift down onto the cave floor.
const CAVE_SLOT_POSITIONS = [
  {top:'4%',  left:'16%'}, {top:'4%',  left:'38%'}, {top:'4%',  left:'60%'}, {top:'4%',  left:'82%'},
  {top:'23%', left:'27%'}, {top:'23%', left:'49%'}, {top:'23%', left:'71%'}, {top:'23%', left:'88%'},
  {top:'42%', left:'16%'}, {top:'42%', left:'38%'}, {top:'42%', left:'60%'}, {top:'42%', left:'82%'},
  {top:'61%', left:'27%'}, {top:'61%', left:'49%'}, {top:'61%', left:'71%'}, {top:'61%', left:'88%'},
  {top:'80%', left:'16%'}, {top:'80%', left:'38%'}, {top:'80%', left:'60%'}, {top:'80%', left:'82%'},
];
function caveSlotPos(i){ return CAVE_SLOT_POSITIONS[i % CAVE_SLOT_POSITIONS.length]; }

// A real fossil-skeleton image (background removed), half-faded into the back
// wall — purely decorative, sits behind the ore stones.
const CAVE_SKELETON_IMG = "data:image/png;base64,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";
function renderCaveSkeleton(){
  const el = document.getElementById('cave-skeleton');
  if (!el) return;
  if (!el.dataset.set){
    el.style.backgroundImage = `url("${CAVE_SKELETON_IMG}")`;
    el.dataset.set = '1';
  }
}

// Tracks the last left% we explicitly set the miner to, so we can tell which
// direction it's actually moving in (positions aren't laid out in a straight
// line — rows reset left-to-right — so direction can't be assumed constant).
let caveMinerLastLeftPct = null;
// Tracks which stone index the miner was last parked at during an active
// hunt, so re-renders triggered by Firebase syncs (e.g. app resume) don't
// yank/reset the miner mid-walk or mid-swing.
let caveMinerActiveForIndex = null;

function caveSetMinerPosition(miner, leftPct){
  if (caveMinerLastLeftPct !== null){
    miner.classList.toggle('facing-left', leftPct < caveMinerLastLeftPct - 0.5);
  }
  miner.style.left = leftPct + '%';
  caveMinerLastLeftPct = leftPct;
}

function renderCaveStones(){
  const wrap = document.getElementById('cave-stones');
  if (!wrap) return;
  const cfg = stoneHuntPlanConfig(state.plan);
  const stoneCount = cfg.dailyLimit;

  // IMPORTANT: dailyLimitCounts.stonehunt is incremented when a hunt slot
  // is claimed, before the current stone is actually mined. While a Stone
  // Hunt session is active, keep the current stone visible for the miner and
  // crack animations. It is marked mined only after completion.
  const actualMinedCount = dailyLimitCounts.stonehunt || 0;
  const s = stoneHuntSession();
  const hasActiveSession =
    s && (s.status === 'active' || s.status === 'paused_check');

  const runningStoneIndex = hasActiveSession
    ? s.stoneIndex
    : actualMinedCount;

  const minedCount = hasActiveSession
    ? Math.max(0, actualMinedCount - 1)
    : actualMinedCount;

  let html = '';
  for (let i = 0; i < stoneCount; i++){
    const pos = caveSlotPos(i);
    const mined = i < minedCount;
    const active = i === runningStoneIndex && !mined;
    const color = CAVE_STONE_COLORS[i % CAVE_STONE_COLORS.length];
    html += `<div class="cave-stone-slot" id="cave-stone-slot-${i}" style="top:${pos.top};left:${pos.left};">
      <div class="cave-stone ${mined ? 'mined' : ''} ${active ? 'active' : ''}" id="cave-stone-${i}">${caveStoneSVG(color)}</div>
    </div>`;
  }
  wrap.innerHTML = html;

  // The stone DOM above is rebuilt from scratch on every render (including
  // re-renders triggered by a Firebase sync when the app resumes from the
  // background). If a hunt is active, immediately re-stamp the correct crack
  // stage onto the fresh element — otherwise it sits at stage-1 (no cracks)
  // until the swing interval happens to tick again, which looks like the
  // cracks vanished.
  if (hasActiveSession){
    const activeStoneEl = document.getElementById(`cave-stone-${runningStoneIndex}`);
    caveUpdateCrackStage(activeStoneEl, s);
  }

  // Position the miner near the active/next stone. While a hunt is already
  // active and the miner has been parked at this same stone, leave it alone —
  // resetting position/facing on every re-render (e.g. on app resume) fights
  // with the in-progress walk/swing animation and looks like a direction glitch.
  const miner = document.getElementById('cave-miner');
  if (miner && !(hasActiveSession && caveMinerActiveForIndex === runningStoneIndex)){
    const targetIdx = Math.min(runningStoneIndex, Math.max(0, stoneCount - 1));
    const pos = caveSlotPos(targetIdx);
    const leftPct = Math.max(4, parseFloat(pos.left) - 9);
    caveSetMinerPosition(miner, leftPct);
    caveMinerActiveForIndex = hasActiveSession ? runningStoneIndex : null;
  }
  caveSpawnDust();
}

let caveDustSpawned = false;
function caveSpawnDust(){
  if (caveDustSpawned) return;
  const dustWrap = document.getElementById('cave-dust');
  if (!dustWrap) return;
  caveDustSpawned = true;
  let html = '';
  for (let i = 0; i < 14; i++){
    const left = Math.random() * 100;
    const dur = 6 + Math.random() * 6;
    const delay = Math.random() * 8;
    html += `<span style="left:${left}%; animation-duration:${dur}s; animation-delay:${delay}s;"></span>`;
  }
  dustWrap.innerHTML = html;
}

let caveSwingInterval = null;
// Kicks off the walk-to-stone + repeated pickaxe swing animation for the given stone index.
// Purely visual — actual completion/reward timing is driven by the Firebase session + stoneHuntTick.
// Crack stage (1/2/3) is derived from real stonehunt progress %, so visuals stay in sync with the timer.
function caveStartStoneHuntAnim(stoneIndex){
  const miner = document.getElementById('cave-miner');
  if (!miner) return;
  const pos = caveSlotPos(stoneIndex);
  const leftPct = Math.max(4, parseFloat(pos.left) - 9);
  miner.classList.add('walking');
  caveSetMinerPosition(miner, leftPct);
  caveMinerActiveForIndex = stoneIndex;
  setTimeout(() => {
    miner.classList.remove('walking');
    if (caveSwingInterval) clearInterval(caveSwingInterval);
    caveSwingInterval = setInterval(() => {
      const s = stoneHuntSession();
      if (!s || s.status !== 'active'){ return; } // pause swinging during activity-check pause
      miner.classList.remove('swing'); void miner.offsetWidth; miner.classList.add('swing');
      // Look up the stone element fresh each tick instead of using a
      // reference captured when the interval started — renderCaveStones()
      // rebuilds the stone DOM from scratch on every re-render (e.g. when
      // the app resumes from the background and Firebase re-syncs), which
      // would otherwise leave this interval updating a detached, invisible
      // element and make the crack progress appear to freeze/disappear.
      const stoneEl = document.getElementById(`cave-stone-${stoneIndex}`);
      if (stoneEl) { stoneEl.classList.remove('crack-hit'); void stoneEl.offsetWidth; stoneEl.classList.add('crack-hit'); }
      caveUpdateCrackStage(stoneEl, s);
      caveSpawnSparks(stoneIndex);
    }, 620);
  }, 900);
}

function caveUpdateCrackStage(stoneEl, session){
  if (!stoneEl || !session) return;
  const pct = stoneHuntProgressPct(session, stoneHuntNow()); // 0..100
  const stage = pct >= 66 ? 3 : (pct >= 33 ? 2 : 1);
  stoneEl.classList.remove('stage-1', 'stage-2', 'stage-3');
  stoneEl.classList.add('stage-' + stage);
  const cracks = stoneEl.querySelectorAll('.cave-crack-line');
  cracks.forEach(c => {
    c.classList.remove('stage-1', 'stage-2', 'stage-3');
    c.classList.add('stage-' + stage);
  });
}

function caveSpawnSparks(stoneIndex){
  const slot = document.getElementById(`cave-stone-slot-${stoneIndex}`);
  const stage = document.getElementById('stonehunt-circle');
  if (!slot || !stage) return;
  const rect = slot.getBoundingClientRect();
  const stageRect = stage.getBoundingClientRect();
  const cx = rect.left - stageRect.left + rect.width / 2;
  const cy = rect.top - stageRect.top + rect.height / 2;
  for (let i = 0; i < 4; i++){
    const spark = document.createElement('div');
    spark.className = 'cave-spark';
    const angle = Math.random() * Math.PI * 2;
    const dist = 14 + Math.random() * 18;
    spark.style.left = cx + 'px';
    spark.style.top = cy + 'px';
    spark.style.transition = 'transform .45s ease-out, opacity .45s ease-out';
    stage.appendChild(spark);
    requestAnimationFrame(() => {
      spark.style.transform = `translate(${Math.cos(angle)*dist}px, ${Math.sin(angle)*dist}px)`;
      spark.style.opacity = '0';
    });
    setTimeout(() => spark.remove(), 500);
  }
}

// Plays the "stone breaks" crumble + wall glow burst, then hides the stone (marks it mined visually).
function caveBreakStone(stoneIndex){
  if (caveSwingInterval){ clearInterval(caveSwingInterval); caveSwingInterval = null; }
  caveMinerActiveForIndex = null;
  const stage = document.getElementById('stonehunt-circle');
  const slot = document.getElementById(`cave-stone-slot-${stoneIndex}`);
  const stoneEl = document.getElementById(`cave-stone-${stoneIndex}`);
  const miner = document.getElementById('cave-miner');
  if (miner) miner.classList.remove('walking', 'swing');
  if (!stage || !slot || !stoneEl) return;
  const rect = slot.getBoundingClientRect();
  const stageRect = stage.getBoundingClientRect();
  const cx = rect.left - stageRect.left + rect.width / 2;
  const cy = rect.top - stageRect.top + rect.height / 2;

  const glow = document.createElement('div');
  glow.className = 'cave-wall-glow burst';
  glow.style.left = cx + 'px';
  glow.style.top = cy + 'px';
  stage.appendChild(glow);
  setTimeout(() => glow.remove(), 800);

  for (let i = 0; i < 10; i++){
    const bit = document.createElement('div');
    bit.className = 'cave-crumble';
    bit.style.left = cx + 'px';
    bit.style.top = cy + 'px';
    bit.style.transition = 'transform .55s cubic-bezier(.3,.6,.7,1), opacity .55s ease-in';
    stage.appendChild(bit);
    const dx = (Math.random() - 0.5) * 50;
    const dy = 30 + Math.random() * 40;
    requestAnimationFrame(() => {
      bit.style.transform = `translate(${dx}px, ${dy}px) rotate(${Math.random()*180}deg)`;
      bit.style.opacity = '0';
    });
    setTimeout(() => bit.remove(), 600);
  }
  stoneEl.classList.add('mined');
  haptic('success');
}

window.toggleStoneHuntBoostPanel = function(){
  stoneHuntBoostPanelOpen = !stoneHuntBoostPanelOpen;
  const card = document.getElementById('stonehunt-boost-card');
  const btn = document.getElementById('stonehunt-boost-toggle-btn');
  if (card) card.classList.toggle('hidden', !stoneHuntBoostPanelOpen);
  if (btn) btn.classList.toggle('active', stoneHuntBoostPanelOpen);
};

function renderStoneHuntBoostCard(){
  const s = stoneHuntSession();
  const card = document.getElementById('stonehunt-boost-card');
  if (!card) return;
  const cfg = stoneHuntPlanConfig(state.plan);
  if (cfg.maxSpeed <= 1){
    card.innerHTML = `<div class="stonehunt-boost-empty">No boost available on the Free plan. Upgrade to unlock speed boosts.</div>`;
    return;
  }
  if (!s || s.status === 'completed'){
    card.innerHTML = `<div class="stonehunt-boost-empty">Start stonehunt to unlock boost.</div>`;
    return;
  }
  const speed = s.currentSpeed || 1;
  const pct = ((speed - 1) / (cfg.maxSpeed - 1)) * 100;
  const maxed = stoneHuntBoostMaxedOut();
  card.innerHTML = `
    <div class="stonehunt-boost-header">
      <span>Boost Speed</span>
      <b>${speed.toFixed(2)}× / ${cfg.maxSpeed.toFixed(2)}×</b>
    </div>
    <div class="stonehunt-boost-bar-track"><div class="stonehunt-boost-bar-fill" style="width:${Math.max(0,Math.min(100,pct))}%"></div></div>
    ${maxed
      ? `<div class="stonehunt-boost-applied">Maximum boost reached: ${speed.toFixed(2)}×</div>`
      : `<button class="stonehunt-boost-btn secondary" id="stonehunt-boost-btn" onclick="stoneHuntWatchBoostAd()" title="Tap to watch an ad — once it finishes, your Stone Hunt speed gets boosted">${ICONS.megaphone} Watch Ad to Get Boost Power</button>`
    }
  `;
}

function renderStoneHuntHistoryList(){
  const wrap = document.getElementById('stonehunt-history-list');
  if (!wrap) return;
  if (!stoneHuntHistoryCache.length){
    wrap.innerHTML = `<div class="empty-state"><div class="empty-icon">${ICONS.hourglass}</div><div class="empty-title">No Stone Hunt history yet</div></div>`;
    return;
  }
  wrap.innerHTML = stoneHuntHistoryCache.map(h => {
    const plan = PLANS.find(p => p.id === h.planId) || PLANS[0];
    const d = new Date(h.completedAt || h.date || Date.now());
    const dateStr = d.toLocaleDateString(undefined, { month:'short', day:'numeric', year:'numeric' });
    const durMin = Math.round((h.durationMs||0)/60000);
    const durStr = durMin >= 60 ? `${Math.floor(durMin/60)}h ${durMin%60}m` : `${durMin}m`;
    return `
      <div class="stonehunt-history-card">
        <div class="stonehunt-history-top">
          <span class="stonehunt-history-date">${dateStr}</span>
          <span class="stonehunt-history-status ${h.status}">${h.status === 'completed' ? 'Completed' : esc(h.status)}</span>
        </div>
        <div class="stonehunt-history-plan">${esc(plan.name)} Plan</div>
        <div class="stonehunt-history-row"><span>Speed</span><b>${(h.finalSpeed||1).toFixed(2)}×</b></div>
        <div class="stonehunt-history-row"><span>Duration</span><b>${durStr}</b></div>
        <div class="stonehunt-history-row"><span>Reward</span><b>+${fmt(h.reward||0)}</b></div>
      </div>
    `;
  }).join('');
}


async function markCouponUsed(code, usedByUid){
  if (!code) return;
  try{
    await update(ref(db, 'coupons/' + code), {
      used: true,
      usedBy: usedByUid || null,
      usedAt: Date.now()
    });
  }catch(e){
    console.error('Failed to mark coupon as used', e);
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


function renderPlans(){
  if (!state) return;
  const wrap = document.getElementById('plans-container');
  wrap.innerHTML = PLANS.map(p=>{
    const isCurrent = p.id === state.plan;
    return `<div class="plan-option ${p.recommended?'recommended':''}">
      <div class="plan-option-header">
        <div class="plan-option-name"><span class="plan-option-icon badge-clickable" onclick="event.stopPropagation(); openBadgeLightbox('${p.id}')">${planBadgeIcon(p.id)}</span>${p.name}</div>
        <div class="plan-option-price">${p.price===0?'Free':fmt(p.price)}${p.price>0?'<span>/mo</span>':''}</div>
      </div>
      <div class="plan-option-features">
        ${p.features.map(f=>`<div class="plan-feature"><span class="check">${ICONS.check}</span> ${f}</div>`).join('')}
      </div>
      <button class="plan-option-btn ${isCurrent?'current':''}" id="plan-buy-btn-${esc(p.id)}" onclick="buyPlan('${p.id}')" ${isCurrent?'disabled':''}>
        ${isCurrent ? 'Current Plan' : (p.price===0?'Switch to Free':'Buy Plan')}
      </button>
    </div>`;
  }).join('');
  PLANS.forEach(p => { if (p.id !== state.plan) initAdLockButton('plan-buy-btn-' + p.id); });
}

// Applies (or re-applies) the locked-by-default look to a gated button right after it's placed
// in the DOM — used for buttons that get re-rendered (plan cards) as well as the static ones.
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
function buyPlan(planId){
  const p = PLANS.find(x=>x.id===planId);
  if (!p || p.id === state.plan) return;
  if (p.price > 0 && p.price > Number(state.depositBalance||0)){
    showToast('Insufficient deposit balance — please deposit first', ICONS.warning);
    return;
  }
  if (p.price === 0){
    openFreePlanSwitchDialog(p);
    return;
  }
  if (p.price > 0){
    const doConfirm = () => confirmBuyPlan(p);
    if (tg && tg.showConfirm){
      tg.showConfirm(`Buy the ${p.name} plan for ${fmt(p.price)}? This will be deducted from your deposit balance.`, (ok)=>{
        if (ok) doConfirm();
      });
    } else if (window.confirm(`Buy the ${p.name} plan for ${fmt(p.price)}? This will be deducted from your deposit balance.`)){
      doConfirm();
    }
    return;
  }

  confirmBuyPlan(p);
}

// ---- "Switch to Free" typed-confirmation dialog ----
// Downgrading from a paid plan (Pro/Starter/Elite/...) to Free is destructive (loses plan perks),
// so instead of a normal OK/Cancel confirm, the user must type an exact sentence naming their
// CURRENT plan before the switch is allowed. Prevents accidental taps.
function freePlanSwitchPhrase(){
  const cur = currentPlan(state);
  return `switch to free plan from ${cur.name}`;
}
function openFreePlanSwitchDialog(freePlan){
  let overlay = document.getElementById('free-switch-dialog');
  if (!overlay){
    overlay = document.createElement('div');
    overlay.id = 'free-switch-dialog';
    overlay.className = 'free-switch-dialog';
    document.body.appendChild(overlay);
  }
  const phrase = freePlanSwitchPhrase();
  overlay.innerHTML = `
    <div class="free-switch-card">
      <div class="free-switch-icon">${ICONS.warning}</div>
      <div class="free-switch-title">Switch to Free Plan?</div>
      <div class="free-switch-desc">You're about to leave the <strong>${esc(currentPlan(state).name)}</strong> plan and lose its perks. To confirm, type the sentence below exactly:</div>
      <div class="free-switch-phrase">${esc(phrase)}</div>
      <input id="free-switch-input" class="free-switch-input" type="text" autocomplete="off" placeholder="Type the sentence above...">
      <div class="free-switch-error" id="free-switch-error">Doesn't match — please type it exactly as shown.</div>
      <div class="free-switch-actions">
        <button class="free-switch-cancel" onclick="closeFreePlanSwitchDialog()">Cancel</button>
        <button class="free-switch-confirm" id="free-switch-confirm-btn" onclick="submitFreePlanSwitch('${esc(freePlan.id)}')" disabled>Switch</button>
      </div>
    </div>`;
  requestAnimationFrame(() => overlay.classList.add('show'));
  document.body.classList.add('free-switch-open');
  const input = document.getElementById('free-switch-input');
  const confirmBtn = document.getElementById('free-switch-confirm-btn');
  const errEl = document.getElementById('free-switch-error');
  input.addEventListener('input', () => {
    errEl.classList.remove('show');
    confirmBtn.disabled = input.value.trim().toLowerCase() !== phrase.toLowerCase();
  });
  setTimeout(() => input.focus(), 150);
}
function closeFreePlanSwitchDialog(){
  const overlay = document.getElementById('free-switch-dialog');
  if (!overlay) return;
  overlay.classList.remove('show');
  document.body.classList.remove('free-switch-open');
}
function submitFreePlanSwitch(planId){
  const input = document.getElementById('free-switch-input');
  const errEl = document.getElementById('free-switch-error');
  const phrase = freePlanSwitchPhrase();
  if (!input || input.value.trim().toLowerCase() !== phrase.toLowerCase()){
    if (errEl) errEl.classList.add('show');
    return;
  }
  const p = PLANS.find(x => x.id === planId);
  if (!p) return;
  closeFreePlanSwitchDialog();
  confirmBuyPlan(p);
}
window.openFreePlanSwitchDialog = openFreePlanSwitchDialog;
window.closeFreePlanSwitchDialog = closeFreePlanSwitchDialog;
window.submitFreePlanSwitch = submitFreePlanSwitch;

function confirmBuyPlan(p){
  requireAdBeforeAction('plan-buy-btn-' + p.id).then(adOk => {
    if (!adOk) return;
    showLoading(true);
    setTimeout(async ()=>{
      if (p.price > 0){
        state.depositBalance = Number(state.depositBalance||0) - p.price;
        recomputeTotalBalance();
        addTransaction('withdraw', p.name + ' Plan Purchase', -p.price);
      }
      state.plan = p.id;
      state.planExpiry = p.id==='free' ? INFINITE_EXPIRY : Date.now() + p.days*24*3600*1000;


      if (p.id !== 'free' && !state.activeReferralCredited && state.usedRefer && state.usedRefer.telegramUid && state.usedRefer.telegramUid !== state.uid){
        await creditActiveReferral(state.usedRefer.telegramUid, state, p);
        state.activeReferralCredited = true;
      }

      await saveState();
      showLoading(false);
      haptic('medium');
      showToast(`${p.name} plan activated!`, ICONS.diamond);
      renderPlans();
      renderHome();
    }, 1000);
  });
}


async function creditActiveReferral(referrerId, referredState, plan){
  if (isGuest) return;
  try{
    const snap = await get(ref(db, 'users/' + referrerId + '/activeReferrals'));
    const raw = snap.exists() ? snap.val() : [];
    const arr = Array.isArray(raw) ? raw.slice() : Object.values(raw || {});
    if (arr.some(r => r && r.uid === referredState.uid)) return;

    const name = [referredState.firstName, referredState.lastName].filter(Boolean).join(' ').trim() || ('@' + (referredState.username || 'user'));
    arr.unshift({
      uid: referredState.uid,
      name,
      username: referredState.username || '',
      activatedPlanId: plan.id,
      activatedPlanName: plan.name,
      activatedAt: Date.now()
    });
    await update(ref(db, 'users/' + referrerId), { activeReferrals: arr });
  }catch(e){
    console.error('creditActiveReferral failed', e);
  }
}


let referralsRenderToken = 0;

function renderReferrals(){
  if (!state) return;
  document.getElementById('refer-count').textContent = state.referCount || (state.referrals||[]).length;
  document.getElementById('refer-earnings').textContent = fmt(state.referralEarnings || 0);
  document.getElementById('refer-commission').textContent = Math.round(currentPlan(state).refBonusNormal*100) + '% / ' + Math.round(currentPlan(state).refBonusActive*100) + '%';
  const subtitleEl = document.getElementById('refer-subtitle');
  if (subtitleEl) subtitleEl.textContent = `Share your link — earn ${Math.round(currentPlan(state).refBonusNormal*100)}% normal / ${Math.round(currentPlan(state).refBonusActive*100)}% active commission!`;
  const activeCountEl = document.getElementById('refer-active-count');
  if (activeCountEl) activeCountEl.textContent = (state.activeReferrals||[]).length;
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


  const activeUidSet = new Set((state.activeReferrals||[]).map(a => a && a.uid));

  const rows = await Promise.all(list.map(async r => {
    if (!r.uid){

      return {
        legacy: true,
        name: r.name || 'Referral',
        sub: r.date || '',
        planBadge: '',
        photo: '',
        active: false
      };
    }
    try{
      const snap = await get(ref(db, 'users/' + r.uid));
      if (!snap.exists()){
        return { legacy:true, name:'Deleted user', sub:'', planBadge:'', photo:'', active: activeUidSet.has(r.uid) };
      }
      const u = snap.val();
      const name = [u.firstName, u.lastName].filter(Boolean).join(' ').trim() || ('@' + (u.username || 'user'));
      const username = u.username ? '@' + u.username : '';
      const plan = currentPlan(u);
      const joined = r.joinedAt ? new Date(r.joinedAt).toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric'}) : '';
      return {
        legacy: false,
        name,
        username,
        sub: [username, joined].filter(Boolean).join(' · '),
        planBadge: plan.badge,
        planId: plan.id,
        photo: u.profilePic || '',
        active: activeUidSet.has(r.uid)
      };
    }catch(e){
      console.error('live referral lookup failed', e);
      return { legacy:true, name:'Referral', sub:'', planBadge:'', photo:'', active: activeUidSet.has(r.uid) };
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
      <div class="ref-badges">
        ${row.active ? `<div class="ref-active-tag">Active</div>` : ''}
        ${row.planBadge ? `<div class="ref-plan-badge plan-${row.planId}">${escapeHtml(row.planBadge)}</div>` : ''}
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
  applyPlanBadge(document.getElementById('profile-username-badge'), state.plan, state.managementBadge);
  document.getElementById('profile-uid').textContent = state.uid;
  document.getElementById('profile-streak').textContent = state.streak;
  document.getElementById('profile-total-deposit').textContent = fmtNum(computeTotalDeposit());
  document.getElementById('profile-total-withdraw').textContent = fmtNum(computeTotalWithdraw());
  document.getElementById('profile-refs').textContent = state.referCount || (state.referrals||[]).length;
  document.getElementById('profile-balance').textContent = fmtNum(state.totalBalance);
  document.getElementById('profile-earnings').textContent = fmtNum((state.referBalance||0) + (state.EarningBalance||0));
  document.getElementById('profile-total-watchad').textContent = state.totalWatchAd || 0;
  document.getElementById('profile-active-refer').textContent = (state.activeReferrals||[]).length;
  document.getElementById('profile-total-ad-campaign').textContent = (state.adCampaigns||[]).length;

  applyProfileAvatar(state.profilePic);

  const p = currentPlan(state);
  document.getElementById('profile-plan-name').textContent = p.name;
  const profilePlanIconEl = document.getElementById('profile-plan-icon');
  profilePlanIconEl.innerHTML = planBadgeIcon(p.id, state.managementBadge);
  profilePlanIconEl.classList.add('badge-pulse', 'badge-clickable');
  profilePlanIconEl.dataset.badgePlan = resolveBadgeId(p.id, state.managementBadge);
  profilePlanIconEl.onclick = (e) => { e.stopPropagation(); openBadgeLightbox(profilePlanIconEl.dataset.badgePlan); };
  document.getElementById('profile-plan-expire').textContent = planExpireText(state);
  document.getElementById('profile-plan-features').innerHTML = p.features.map(f=>`<div class="plan-feature-mini"><span class="check">${ICONS.check}</span> ${f}</div>`).join('');

  const guestBannerProfile = document.getElementById('guest-banner-profile');
  if (guestBannerProfile) guestBannerProfile.style.display = isGuest ? 'block' : 'none';
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
  applyPlanBadge(document.getElementById('app-name-badge'), u.plan, u.managementBadge);
}


Object.assign(window, {
  navigateTo, openOverlay, closeOverlay,
  openPlans: openPlans, openDeposit: openDeposit, openWithdraw: openWithdraw,
  openStoneHunt: openStoneHunt, openAdCampaign: openAdCampaign,
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
  startTask: startTask, startTaskLinkOnly: startTaskLinkOnly, openProofModal: openProofModal, closeProofModal: closeProofModal,
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
  startStoneHunt: startStoneHunt, stoneHuntActivityCheckNow: stoneHuntActivityCheckNow,
  stoneHuntWatchBoostAd: stoneHuntWatchBoostAd,
  buyPlan: buyPlan,
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
    await autoSwitchToFreeIfExpired();
    await saveState();
    appInitialized = true;
    onValue(ref(db, userPath), snap => {
      if (!snap.exists()) return;
      state = normalizeLoadedState(snap.val(), profile, ip);


      if (!Array.isArray(state.transactions)) state.transactions = [];
      if (!state.completedTasks) state.completedTasks = {};
      if (!state.taskCompletionCount) state.taskCompletionCount = {};
      if (!Array.isArray(state.adCampaigns)) state.adCampaigns = [];
      if (!Array.isArray(state.referrals)) state.referrals = [];
      if (!Array.isArray(state.notifications)) state.notifications = [];
      if (!state.stonehunt) state.stonehunt = { session:null };
      if (!state.stoneHuntHistory) state.stoneHuntHistory = {};
      if (typeof state.depositBalance !== 'number') state.depositBalance = 0;
      reconcileDepositBalance();
      autoSwitchToFreeIfExpired().then(changed => { if (changed && currentScreen === 'home') renderHome(); if (changed && currentScreen === 'profile') renderProfile(); });

      if (currentScreen === 'home') renderHome();
      if (currentScreen === 'profile') renderProfile();
      if (currentScreen === 'refer') renderReferrals();
      if (currentScreen === 'stonehunt') renderStoneHunt();
      applyHeaderName(state);
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
    startStoneHuntServerClock();
    restoreStoneHuntOnLoad();
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
     return;
   }
  } else {

    isGuest = true;
    profile = buildGuestProfile();
    await loadState(profile, null);
    userPath = null;
    appInitialized = true;
    if (!state.stonehunt) state.stonehunt = { session: null };
    startStoneHuntServerClock();
    restoreStoneHuntOnLoad();
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
  listenPlanSettings();
  listenWatchAdSettings();
  ensureDailyLimitListener('watchad', renderWatchAdScreen);
  listenWatchAdCooldown();
  startInvestmentPlansListener();
  startDailyBonusSettingsListener();
  loadReadNotifIds();
  listenNotifications();

  applyHeaderAvatar(state.profilePic);
  applyHeaderName(state);
  renderHomeSafe();
  navigateTo('home');
  initAllAdLockButtons();
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
// the global window object (unlike a normal script). Without this block
// every onclick handler in the HTML (StoneHunt button included) fails
// silently with "X is not defined" and nothing happens when tapped.
// ---------------------------------------------------------------------

// ======================================================================
// ---- Watch Ad earning feature ----
// Fully self-contained: admin controls settings/watchAd -> { dailyLimit,
// breakSeconds, credits: { free, starter, pro, elite } }. Daily count is
// tracked with the existing shared daily_limits/{uid}/watchad/{dateKey}
// counter (same midnight reset as task/gmail/facebook/stonehunt). Break-time
// cooldown between individual watches is tracked separately in
// users/{uid}/watchAdCooldown/lastWatchAt so it works across tabs/devices.
// Reward is paid directly in AENVA into state.EarningBalance (no separate
// Credit currency / exchange step).
// ======================================================================

let WATCH_AD_SETTINGS = { dailyLimit: 20, breakSeconds: 60, credits: {} };

function watchAdAtrPerAd(planId){
  const override = WATCH_AD_SETTINGS.credits ? WATCH_AD_SETTINGS.credits[planId] : null;
  if (override != null && !isNaN(Number(override))) return Number(override);
  const plan = PLANS.find(p => p.id === planId) || PLANS[0];
  return plan.watchAdCredit != null ? Number(plan.watchAdCredit) : Number(PLANS[0].watchAdCredit || 0);
}

function listenWatchAdSettings(){
  onValue(ref(db, 'settings/watchAd'), snap => {
    const v = snap.exists() ? snap.val() : null;
    WATCH_AD_SETTINGS = {
      dailyLimit: (v && v.dailyLimit != null && !isNaN(Number(v.dailyLimit))) ? Number(v.dailyLimit) : 20,
      breakSeconds: (v && v.breakSeconds != null && !isNaN(Number(v.breakSeconds))) ? Number(v.breakSeconds) : 60,
      credits: (v && v.credits) ? v.credits : {}
    };
    if (document.getElementById('screen-watchad') && document.getElementById('screen-watchad').classList.contains('active')){
      renderWatchAdScreen();
    }
  });
}

let watchAdLastWatchAt = 0;
let watchAdCooldownTimer = null;

function listenWatchAdCooldown(){
  if (isGuest || !state.uid) return;
  onValue(ref(db, `users/${state.uid}/watchAdCooldown/lastWatchAt`), snap => {
    watchAdLastWatchAt = snap.exists() ? Number(snap.val() || 0) : 0;
    watchAdRenderCooldown();
  });
}

function watchAdCooldownRemainingMs(){
  const elapsed = Date.now() - watchAdLastWatchAt;
  const totalMs = WATCH_AD_SETTINGS.breakSeconds * 1000;
  return Math.max(0, totalMs - elapsed);
}

function watchAdRenderCooldown(){
  const btn = document.getElementById('watchad-watch-btn');
  const cooldownEl = document.getElementById('watchad-cooldown-text');
  if (!btn) return;
  const limitHit = isDailyLimitHit('watchad');
  const remainingMs = watchAdCooldownRemainingMs();
  if (limitHit){
    btn.disabled = true;
    btn.textContent = 'Daily Limit Reached';
    if (cooldownEl){ cooldownEl.style.display = 'block'; cooldownEl.textContent = 'Resets in ' + formatCountdown(msUntilNextDailyReset()); }
    return;
  }
  if (remainingMs > 0){
    btn.disabled = true;
    btn.textContent = 'Please Wait...';
    if (cooldownEl){ cooldownEl.style.display = 'block'; cooldownEl.textContent = 'Next ad available in ' + Math.ceil(remainingMs/1000) + 's'; }
    return;
  }
  btn.disabled = false;
  btn.textContent = 'Watch Ad';
  if (cooldownEl) cooldownEl.style.display = 'none';
}

function renderWatchAdScreen(){
  if (!state) return;
  renderDailyLimitCard('watchad');
  const availEl = document.getElementById('watchad-available-atr');
  if (availEl) availEl.textContent = fmt(state.EarningBalance || 0);
  const rewardEl = document.getElementById('watchad-reward-amount');
  if (rewardEl) rewardEl.textContent = `+${fmt(watchAdAtrPerAd(state.plan))} per ad`;
  watchAdRenderCooldown();
  renderWatchAdHistory();
}

function renderWatchAdHistory(){
  const wrap = document.getElementById('watchad-history-list');
  if (!wrap || !state) return;
  const list = (state.transactions || []).filter(t => t.type === 'watchad');
  if (list.length === 0){
    wrap.innerHTML = `<div class="empty-state"><div class="empty-icon">${ICONS.card}</div><div class="empty-title">No history yet</div><div class="empty-desc">Your watch ad rewards will show up here</div></div>`;
    return;
  }
  wrap.innerHTML = list.map(t=>{
    return `<div class="tx-row">
      <div class="tx-icon" style="background:#FFEAEA;">${ICONS.megaphone||ICONS.coin}</div>
      <div class="tx-info"><div class="tx-title">${t.title}</div><div class="tx-date">${t.date}</div></div>
      <div style="text-align:right;">
        <div class="tx-amount pos">+${fmt(t.amount)}</div>
        <div class="tx-status"><span class="status-pill status-${(t.status||'Completed').toLowerCase()}">${t.status||'Completed'}</span></div>
      </div>
    </div>`;
  }).join('');
}

function openWatchAd(){
  renderWatchAdScreen();
  openOverlay('watchad');
  if (!watchAdCooldownTimer){
    watchAdCooldownTimer = setInterval(() => {
      if (document.getElementById('screen-watchad') && document.getElementById('screen-watchad').classList.contains('active')){
        watchAdRenderCooldown();
      }
    }, 1000);
  }
}

let watchAdInFlight = false;
async function watchAdForCredit(){
  if (watchAdInFlight) return;
  if (isGuest){
    showToast('Sign in via Telegram to earn AENVA', ICONS.warning);
    return;
  }
  if (isDailyLimitHit('watchad')){
    showToast(`Daily limit reached (${dailyLimitCounts.watchad}/${dailyLimitForPlan(state.plan, 'watchad')}). Resets at 12:00 AM.`, ICONS.warning);
    return;
  }
  if (watchAdCooldownRemainingMs() > 0){
    showToast('Please wait before watching another ad', ICONS.warning);
    return;
  }
  watchAdInFlight = true;
  const btn = document.getElementById('watchad-watch-btn');
  if (btn){ btn.disabled = true; btn.textContent = 'Loading Ad...'; }
  try{
    await showRewardedAdGate();

    // Claim the daily-limit slot only after the ad actually completed.
    const gotSlot = await claimDailyLimitSlot('watchad');
    if (!gotSlot){
      showToast('Daily limit reached. Resets at 12:00 AM.', ICONS.warning);
      renderWatchAdScreen();
      return;
    }

    const reward = watchAdAtrPerAd(state.plan);
    state.EarningBalance = Number(state.EarningBalance || 0) + reward;
    state.totalWatchAd = Number(state.totalWatchAd || 0) + 1;
    addTransaction('watchad', 'Watch Ad Reward', reward, 'Completed');
    await patchState({ EarningBalance: state.EarningBalance, totalWatchAd: state.totalWatchAd, transactions: state.transactions });
    await set(ref(db, `users/${state.uid}/watchAdCooldown/lastWatchAt`), Date.now());

    track('ads', 1);

    haptic('success');
    showToast(`+${fmt(reward)} earned!`, ICONS.success);
    renderHome();
    renderWatchAdScreen();
  }catch(e){
    showToast('Watch the full ad to earn AENVA', ICONS.warning);
  }finally{
    watchAdInFlight = false;
    watchAdRenderCooldown();
  }
}

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
  filterWork, stoneHuntActivityCheckNow, navigateTo, openAdCampaign, openDeposit,
  openDeveloper, openEvents, openExchange, openFacebookCenter, openGift,
  openGmailCenter, openStoneHunt, openNotifications, openPlans, openSupport,
  openMining, openMiningModels, startMining, claimMining, buyUncle, selectUncle, miningSpeedUp,
  openTaskCenter, openTelegramChannel, openWithdraw,
  refreshGmailId, sendProofSubmission, setAmount, shareOnTelegram, startStoneHunt,
  submitAdCampaignRequest, submitDeposit, submitExchange, submitFacebookRequest,
  submitGmailId, submitWithdraw, switchFacebookTab,
  switchGmailTab, switchTransTab,
  openWatchAd, watchAdForCredit,
});