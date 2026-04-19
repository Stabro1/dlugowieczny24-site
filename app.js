const pool = [
  { fact: 'Światło dzienne: 10 minut na zewnątrz w ciągu 1h od pobudki.', quiz: 'Poranne światło wspiera rytm dobowy.', answer: true },
  { fact: 'Nawodnienie: woda + elektrolity do pierwszego napoju.', quiz: 'Elektrolity wspierają nawodnienie.', answer: true },
  { fact: 'Ruch: 5–10 minut lekkiej aktywności.', quiz: 'Krótki ruch poprawia energię.', answer: true },
  { fact: 'Śniadanie białkowe.', quiz: 'Białko pomaga w sytości i energii.', answer: true },
  { fact: 'Bez kofeiny przez 60–90 min po przebudzeniu.', quiz: 'Opóźnienie kofeiny zmniejsza popołudniowy spadek.', answer: true },
  { fact: 'Krótki spacer po posiłku (5–10 minut).', quiz: 'Spacer po posiłku wspiera kontrolę glukozy.', answer: true },
  { fact: 'Przyciemnianie ekranów 60 min przed snem.', quiz: 'Mniej niebieskiego światła wspiera melatoninę.', answer: true },
  { fact: 'Stałe pory snu (ta sama godzina).', quiz: 'Regularność poprawia jakość snu.', answer: true }
];

function hashDate(str){ let h = 0; for (let i=0;i<str.length;i++) h = (h*31 + str.charCodeAt(i)) >>> 0; return h; }
const todayKey = new Date().toISOString().slice(0,10);
const idx = hashDate(todayKey) % pool.length;
const today = pool[idx];

const tipEl = document.getElementById('daily-tip');
if (tipEl) tipEl.textContent = today.fact;
const favBtn = document.getElementById('btn-favorite-tip');
if (favBtn){
  const state = JSON.parse(localStorage.getItem('dl24_state_pl') || '{"favorites":[]}');
  favBtn.addEventListener('click', ()=>{
    if (!state.favorites.includes(today.fact)) state.favorites.unshift(today.fact);
    state.favorites = state.favorites.slice(0, 50);
    localStorage.setItem('dl24_state_pl', JSON.stringify(state));
    favBtn.textContent = '✅ Zapisane';
  });
}

// MailerLite visual success
document.querySelectorAll('form.ml-block-form').forEach((f)=>{
  f.addEventListener('submit', ()=>{
    const ok = f.parentElement.querySelector('.ml-success');
    if (ok) ok.style.display = 'block';
  });
});

// Tracking
const vidKey = 'dl24_vid';
let vid = localStorage.getItem(vidKey);
if (!vid) { vid = Math.random().toString(36).slice(2,10); localStorage.setItem(vidKey, vid); }

async function track(type, target=''){
  try{
    const url = new URL('https://statystykilp.vercel.app/api/track');
    url.searchParams.set('site','dl24');
    url.searchParams.set('type',type);
    url.searchParams.set('path', location.pathname);
    url.searchParams.set('ref', document.referrer || 'direct');
    if (target) url.searchParams.set('target', target);
    url.searchParams.set('vid', vid);
    await fetch(url.toString());
  }catch(e){}
}
track('view');
document.querySelectorAll('a[href^="http"]').forEach(a=>a.addEventListener('click', ()=>track('click', a.href)));

// Quiz kierunkowy (5 pytań + email gate)
const qfQuestions = [
  {
    q: 'Z czym masz teraz największy problem?',
    a: [
      {t:'Ze snem i regeneracją', p:{sen:3}},
      {t:'Z energią i spadkami w ciągu dnia', p:{energia:3}},
      {t:'Ze stresem i napięciem', p:{stres:3}},
      {t:'Nie wiem, chcę po prostu sensownie zacząć', p:{fundamenty:3}},
    ]
  },
  {
    q: 'Jak najczęściej czujesz się rano?',
    a: [
      {t:'Niewyspany i bez regeneracji', p:{sen:2}},
      {t:'Jest w miarę okej, ale szybko łapię zjazd', p:{energia:2}},
      {t:'Budzę się spięty albo od razu w biegu', p:{stres:2}},
      {t:'Różnie, trudno powiedzieć', p:{fundamenty:1}},
    ]
  },
  {
    q: 'Co najbardziej przeszkadza Ci w ciągu dnia?',
    a: [
      {t:'Słaba regeneracja i brak wyciszenia', p:{sen:2}},
      {t:'Brak stabilnej energii i fokusu', p:{energia:2}},
      {t:'Napięcie, chaos i przeciążenie', p:{stres:2}},
      {t:'Brak prostego planu, od czego zacząć', p:{fundamenty:2}},
    ]
  },
  {
    q: 'Które zdanie najbardziej do Ciebie pasuje?',
    a: [
      {t:'Wieczorem trudno mi zwolnić', p:{sen:2}},
      {t:'Ratuję się kawą albo szybkimi bodźcami', p:{energia:2}},
      {t:'Nawet jak odpoczywam, głowa dalej pracuje', p:{stres:2}},
      {t:'Chcę prostych podstaw bez kombinowania', p:{fundamenty:2}},
    ]
  },
  {
    q: 'Na czym zależy Ci najbardziej teraz?',
    a: [
      {t:'Lepszy sen i spokojniejszy poranek', p:{sen:3}},
      {t:'Stabilniejsza energia bez zjazdów', p:{energia:3}},
      {t:'Więcej spokoju i mniejsze napięcie', p:{stres:3}},
      {t:'Rozsądny punkt startowy i proste podstawy', p:{fundamenty:3}},
    ]
  }
];

const qfResultMap = {
  sen: {
    title: 'Największy problem jest teraz po stronie snu i regeneracji',
    desc: 'Twój wynik wskazuje, że właśnie ten obszar najbardziej wymaga poprawy. Zanim dołożysz kolejne rzeczy, warto najpierw poprawić wyciszenie, zasypianie i jakość regeneracji.',
    rec: 'Najlepiej zacząć od: Dobry Sen',
    cta: '/sen#najlepszy-wybor',
    note: 'Jeśli sen siada, reszta zwykle też zaczyna się rozjeżdżać.'
  },
  energia: {
    title: 'Największy problem jest teraz po stronie energii i stabilności w ciągu dnia',
    desc: 'Twój wynik wskazuje, że najbardziej brakuje Ci stabilnej energii i lepszego paliwa na dzień. Najpierw warto poprawić ten obszar, zamiast opierać wszystko na kolejnej kawie.',
    rec: 'Najlepiej zacząć od: Spokojna Energia',
    cta: '/energia#najlepszy-wybor',
    note: 'Celem nie jest mocniejszy strzał, tylko bardziej stabilny dzień.'
  },
  stres: {
    title: 'Największy problem jest teraz po stronie stresu i napięcia',
    desc: 'Twój wynik wskazuje, że najbardziej obciąża Cię napięcie i przeciążenie. Zanim skupisz się na kolejnych bodźcach, warto najpierw uspokoić ten obszar.',
    rec: 'Najlepiej zacząć od sekcji: Stres',
    cta: '#stres',
    note: 'Czasem problemem nie jest brak energii, tylko zbyt duże obciążenie.'
  },
  fundamenty: {
    title: 'Największy problem jest teraz po stronie podstaw',
    desc: 'Twój wynik wskazuje, że najlepszy efekt da Ci uporządkowanie prostych fundamentów, zamiast dokładania wielu rzeczy naraz.',
    rec: 'Najlepiej zacząć od: Codzienna Podstawa',
    cta: '/fundamenty#najlepszy-wybor',
    note: 'Najpierw baza. Dopiero potem reszta.'
  }
};

const qf = {
  start: document.getElementById('qf-start'),
  questions: document.getElementById('qf-questions'),
  email: document.getElementById('qf-email'),
  result: document.getElementById('qf-result'),
  startBtn: document.getElementById('qf-start-btn'),
  progress: document.getElementById('qf-progress'),
  question: document.getElementById('qf-question'),
  options: document.getElementById('qf-options'),
  emailInput: document.getElementById('qf-email-input'),
  emailError: document.getElementById('qf-email-error'),
  showResultBtn: document.getElementById('qf-show-result'),
  rTitle: document.getElementById('qf-result-title'),
  rDesc: document.getElementById('qf-result-desc'),
  rRec: document.getElementById('qf-result-rec'),
  rCta: document.getElementById('qf-result-cta'),
  rNote: document.getElementById('qf-result-note')
};

let qfIndex = 0;
let qfScores = { sen:0, energia:0, stres:0, fundamenty:0 };

function qfShow(step){
  if (!qf.start) return;
  qf.start.style.display = step==='start' ? '' : 'none';
  qf.questions.style.display = step==='questions' ? '' : 'none';
  qf.email.style.display = step==='email' ? '' : 'none';
  qf.result.style.display = step==='result' ? '' : 'none';
}

function qfRenderQuestion(){
  const q = qfQuestions[qfIndex];
  if (!q) return;
  qf.progress.textContent = `${qfIndex+1}/5`;
  qf.question.textContent = q.q;
  qf.options.innerHTML = '';
  q.a.forEach((opt)=>{
    const btn = document.createElement('button');
    btn.textContent = opt.t;
    btn.type = 'button';
    btn.addEventListener('click', ()=>{
      Object.entries(opt.p).forEach(([k,v])=> qfScores[k] += v);
      qfIndex += 1;
      if (qfIndex >= qfQuestions.length) qfShow('email');
      else qfRenderQuestion();
    });
    qf.options.appendChild(btn);
  });
}

function qfWinner(){
  const order = ['sen','energia','stres','fundamenty'];
  return order.reduce((best, key)=> qfScores[key] > qfScores[best] ? key : best, order[0]);
}

async function qfSaveLead(email, winner){
  const item = { email, winner, ts: new Date().toISOString() };
  const arr = JSON.parse(localStorage.getItem('dl24_quiz_leads') || '[]');
  arr.unshift(item);
  localStorage.setItem('dl24_quiz_leads', JSON.stringify(arr.slice(0,200)));

  // MailerLite (ten sam endpoint co główny formularz)
  try {
    const iframeName = 'ml-iframe-quiz';
    let iframe = document.querySelector(`iframe[name="${iframeName}"]`);
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.name = iframeName;
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
    }

    const form = document.createElement('form');
    form.method = 'post';
    form.action = 'https://assets.mailerlite.com/jsonp/2202928/forms/182307396030301687/subscribe';
    form.target = iframeName;
    form.style.display = 'none';

    const fEmail = document.createElement('input');
    fEmail.name = 'fields[email]';
    fEmail.value = email;
    form.appendChild(fEmail);

    const fSubmit = document.createElement('input');
    fSubmit.name = 'ml-submit';
    fSubmit.value = '1';
    form.appendChild(fSubmit);

    const fCsrf = document.createElement('input');
    fCsrf.name = 'anticsrf';
    fCsrf.value = 'true';
    form.appendChild(fCsrf);

    document.body.appendChild(form);
    form.submit();
    setTimeout(()=>form.remove(), 1500);
  } catch(e) {}

  // Opcjonalny dodatkowy webhook
  // Set window.DL24_QUIZ_LEAD_ENDPOINT = 'https://your-endpoint'
  const endpoint = window.DL24_QUIZ_LEAD_ENDPOINT || '';
  if (endpoint) {
    try {
      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify(item)
      });
    } catch (e) {}
  }
}

if (qf.startBtn){
  qf.startBtn.addEventListener('click', ()=>{
    qfIndex = 0;
    qfScores = { sen:0, energia:0, stres:0, fundamenty:0 };
    qfShow('questions');
    qfRenderQuestion();
  });
}

if (qf.showResultBtn){
  qf.showResultBtn.addEventListener('click', async ()=>{
    const email = (qf.emailInput.value || '').trim();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      qf.emailError.style.display = '';
      return;
    }
    qf.emailError.style.display = 'none';
    const win = qfWinner();
    await qfSaveLead(email, win);
    const data = qfResultMap[win];
    qf.rTitle.textContent = data.title;
    qf.rDesc.textContent = data.desc;
    qf.rRec.textContent = data.rec;
    qf.rCta.href = data.cta;
    qf.rNote.textContent = data.note;
    qfShow('result');
  });
}
