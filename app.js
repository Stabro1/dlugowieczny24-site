const pool = [
  { fact: 'Światło dzienne: 10 minut na zewnątrz w ciągu 1h od pobudki.', quiz: 'Poranne światło wspiera rytm dobowy.', answer: true },
  { fact: 'Nawodnienie: woda + elektrolity do pierwszego napoju.', quiz: 'Elektrolity wspierają nawodnienie.', answer: true },
  { fact: 'Ruch: 5–10 minut lekkiej aktywności.', quiz: 'Krótki ruch poprawia energię.', answer: true },
  { fact: 'Śniadanie białkowe.', quiz: 'Białko pomaga w sytości i energii.', answer: true },
  { fact: 'Bez kofeiny przez 60–90 min po przebudzeniu.', quiz: 'Opóźnienie kofeiny zmniejsza popołudniowy spadek.', answer: true },
  { fact: 'Krótki spacer po posiłku (5–10 minut).', quiz: 'Spacer po posiłku wspiera kontrolę glukozy.', answer: true },
  { fact: 'Przyciemnianie ekranów 60 min przed snem.', quiz: 'Mniej niebieskiego światła wspiera melatoninę.', answer: true },
  { fact: 'Stałe pory snu (ta sama godzina).', quiz: 'Regularność poprawia jakość snu.', answer: true },
  { fact: '5 minut oddychania przez nos / box breathing.', quiz: 'Kontrolowany oddech obniża stres.', answer: true },
  { fact: 'Krótka ekspozycja na zimno (twarz).', quiz: 'Zimno zwiększa czujność.', answer: true },
  { fact: 'Mikro‑trening: 1–2 serie pompek/przysiadów.', quiz: 'Krótki trening też działa.', answer: true },
  { fact: 'Ogranicz dodany cukier dziś.', quiz: 'Mniej cukru wspiera metabolizm.', answer: true },
  { fact: 'Białko + błonnik na lunch.', quiz: 'Białko i błonnik stabilizują energię.', answer: true },
  { fact: '7–10k kroków (rozłożone w ciągu dnia).', quiz: 'Ruch w ciągu dnia ma znaczenie.', answer: true },
  { fact: '10 minut światła popołudniu.', quiz: 'Popołudniowe światło wzmacnia sygnały dobowe.', answer: true },
  { fact: '2‑minutowy reset postawy (barki w dół).', quiz: 'Postawa wpływa na oddech i fokus.', answer: true },
  { fact: '5 minut mobilności.', quiz: 'Mobilność zmniejsza sztywność.', answer: true },
  { fact: 'Ostatni posiłek 2–3h przed snem.', quiz: 'Wcześniejsza kolacja poprawia sen.', answer: true },
  { fact: 'Produkty bogate w magnez (zielone, orzechy).', quiz: 'Magnez wspiera relaks.', answer: true },
  { fact: 'Ogranicz alkohol dziś.', quiz: 'Alkohol pogarsza jakość snu.', answer: true },
  { fact: 'Jeden 25‑minutowy blok głębokiej pracy.', quiz: 'Krótki deep work buduje momentum.', answer: true },
  { fact: '5 minut wdzięczności / journalingu.', quiz: 'Journaling obniża stres.', answer: true },
  { fact: 'Rozciąganie łydek/bioder przez 3 min.', quiz: 'Rozciąganie poprawia mobilność.', answer: true },
  { fact: 'Stań lub przejdź się podczas jednej rozmowy.', quiz: 'Stanie przerywa siedzenie.', answer: true },
  { fact: 'Nawodnienie: 2 litry do wieczora.', quiz: 'Nawodnienie wspiera energię.', answer: true },
  { fact: 'Bez telefonu przez 15 min po przebudzeniu.', quiz: 'Brak telefonu rano poprawia fokus.', answer: true },
  { fact: 'Kofeina max 8h przed snem.', quiz: 'Późna kofeina psuje sen.', answer: true },
  { fact: 'Dodaj omega‑3 dziś.', quiz: 'Omega‑3 wspiera mózg.', answer: true },
  { fact: '10 minut rozciągania przed snem.', quiz: 'Rozciąganie pomaga w relaksie.', answer: true },
  { fact: 'Krótki oddech po lunchu.', quiz: 'Oddech resetuje uwagę.', answer: true }
];

function hashDate(str){ let h = 0; for (let i=0;i<str.length;i++) h = (h*31 + str.charCodeAt(i)) >>> 0; return h; }
const todayKey = new Date().toISOString().slice(0,10);
const idx = hashDate(todayKey) % pool.length;
const today = pool[idx];

const tipEl = document.getElementById('daily-tip');
const quizEl = document.getElementById('daily-quiz');
const feedbackEl = document.getElementById('quiz-feedback');
if (tipEl) tipEl.textContent = today.fact;
if (quizEl) quizEl.textContent = today.quiz;

const btnTrue = document.getElementById('quiz-true');
const btnFalse = document.getElementById('quiz-false');
function answer(userAnswer){
  if (!feedbackEl) return;
  feedbackEl.textContent = userAnswer === today.answer ? '✅ Dobrze!' : '❌ Nie tym razem. Jutro nowe pytanie.';
}
if (btnTrue) btnTrue.addEventListener('click', ()=>answer(true));
if (btnFalse) btnFalse.addEventListener('click', ()=>answer(false));

document.querySelectorAll('[data-quiz-target]').forEach((btn)=>{
  btn.addEventListener('click',()=>{
    const target=btn.getAttribute('data-quiz-target');
    if(target) window.location.href = target + '#najlepszy-wybor';
  });
});

const state = JSON.parse(localStorage.getItem('dl24_state_pl') || '{"favorites":[]}');
const favBtn = document.getElementById('btn-favorite-tip');
if (favBtn){
  favBtn.addEventListener('click', ()=>{
    if (!state.favorites.includes(today.fact)) state.favorites.unshift(today.fact);
    state.favorites = state.favorites.slice(0, 50);
    localStorage.setItem('dl24_state_pl', JSON.stringify(state));
    favBtn.textContent = '✅ Zapisane';
  });
}

document.querySelectorAll('form.ml-block-form').forEach((f)=>{
  f.addEventListener('submit', ()=>{
    const ok = f.parentElement.querySelector('.ml-success');
    if (ok) ok.style.display = 'block';
  });
});

async function track(type){
  try{
    await fetch(`https://statystykilp.vercel.app/api/track?site=dl24&type=${type}`);
  }catch(e){}
}

track('view');

document.querySelectorAll('a[href^="http"]').forEach(a=>{
  a.addEventListener('click', ()=>track('click'));
});