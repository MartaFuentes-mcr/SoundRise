// Mock data
const tracks = [
  {
    id: 't1',
    title: 'Aurora Rise',
    artist: 'Nova Lynx',
    genre: 'Synthwave',
    cover: '#7c5cff,#ff8a00',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    votes: 523,
    plays: 0,
    comments: []
  },
  {
    id: 't2',
    title: 'Neon Dunes',
    artist: 'Luna Solis',
    genre: 'Indie Pop',
    cover: '#00e0b8,#7c5cff',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    votes: 487,
    plays: 0,
    comments: []
  },
  {
    id: 't3',
    title: 'Skyline Echoes',
    artist: 'Artemis Kai',
    genre: 'Alt R&B',
    cover: '#ff8a00,#ff5ea3',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    votes: 459,
    plays: 0,
    comments: []
  },
  {
    id: 't4',
    title: 'Horizon Bloom',
    artist: 'Wave Garden',
    genre: 'Lo-fi',
    cover: '#7c5cff,#00e0b8',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    votes: 331,
    plays: 0,
    comments: []
  },
  {
    id: 't5',
    title: 'Dawn Runner',
    artist: 'Kiro & Mei',
    genre: 'EDM',
    cover: '#ff5ea3,#7c5cff',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    votes: 298,
    plays: 0,
    comments: []
  },
  {
    id: 't6',
    title: 'Solar Kites',
    artist: 'June Vega',
    genre: 'Electropop',
    cover: '#ff8a00,#00e0b8',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    votes: 274,
    plays: 0,
    comments: []
  }
];

const events = [
  { id:'e1', name:'Lanzamiento: Neon Dunes', when:'Hoy 20:00', type:'Lanzamiento', cta:'Escuchar', trackId:'t2' },
  { id:'e2', name:'Live Q&A con Nova Lynx', when:'Mañana 19:00', type:'Live', cta:'Unirse', trackId:'t1' },
  { id:'e3', name:'Concierto interactivo', when:'Viernes 21:30', type:'Concierto', cta:'Entradas', trackId:null }
];

// New mock data
const genres = ['Pop', 'Indie', 'EDM', 'Lo-fi', 'Hip-Hop', 'R&B', 'Synthwave', 'Rock', 'Jazz', 'Latino'];
const creators = [
  { id:'c1', name:'Nova Lynx', role:'Artista', fans: 12400 },
  { id:'c2', name:'Luna Solis', role:'Artista', fans: 9800 },
  { id:'c3', name:'DJ Prism', role:'Productor', fans: 8700 },
];
const plans = [
  { id:'p1', title:'Nova Lynx — Sunrise Club', price:'$4.99/mes', perks:['Temas inéditos','Q&A mensual','Badge exclusivo'] },
  { id:'p2', title:'Luna Solis — Dunes Family', price:'$3.99/mes', perks:['Pre-escuchas','Sorteos','Canal privado'] },
  { id:'p3', title:'DJ Prism — Prismatics', price:'$2.99/mes', perks:['Samples','Lives','Shoutouts'] },
];
const news = [
  { id:'n1', date:'Hoy', title:'Se abre el programa de fundadores', desc:'Doble de puntos y acceso temprano a funciones pro.' },
  { id:'n2', date:'Ayer', title:'Nuevo ranking local', desc:'Explora el top de tu ciudad con filtros de género.' },
];

// State
let currentIndex = 0;
let points = Number(localStorage.getItem('sr_points')||0);
let wallet = localStorage.getItem('sr_wallet')||null;

// Elements
const audioEl = document.getElementById('audio');
const titleEl = document.getElementById('playerTitle');
const artistEl = document.getElementById('playerArtist');
const coverEl = document.getElementById('playerCover');
const heroCover = document.getElementById('heroCover');

const gridEl = document.getElementById('discoverGrid');
const rankEl = document.getElementById('rankList');
const kpiEl = document.getElementById('kpis');
const eventsEl = document.getElementById('events');
const bannerEl = document.getElementById('promoBanner');
const bannerCTA = document.getElementById('bannerCTA');
const bannerClose = document.getElementById('bannerClose');
const genreChips = document.getElementById('genreChips');
const creatorGrid = document.getElementById('creatorGrid');
const subsGrid = document.getElementById('subsGrid');
const newsList = document.getElementById('newsList');

// SoundCloud + playlist elements
const scUrl = document.getElementById('scUrl');
const scAdd = document.getElementById('scAdd');
const scPreviewBtn = document.getElementById('scPreview');
const scPreviewBox = document.getElementById('scPreviewBox');
const playlistEl = document.getElementById('playlist');
const scEmbed = document.getElementById('scEmbed');
const plClear = document.getElementById('plClear');
const plExport = document.getElementById('plExport');

// Mixer elements
const bpm = document.getElementById('bpm');
const bpmVal = document.getElementById('bpmVal');
const rootSel = document.getElementById('rootSel');
const scaleSel = document.getElementById('scaleSel');
const mxPlay = document.getElementById('mxPlay');
const mxClear = document.getElementById('mxClear');
const seqGrid = document.getElementById('seqGrid');
const mxMic = document.getElementById('mxMic');
const autotuneToggle = document.getElementById('autotuneToggle');
const tuneStrength = document.getElementById('tuneStrength');
const tuneVal = document.getElementById('tuneVal');
const transpose = document.getElementById('transpose');
const transposeVal = document.getElementById('transposeVal');

// Mixer state
let audioCtx;
let seqPattern = Array.from({length:16},()=>({kick:false,snare:false,hats:false,bass:false}));
let isPlaying = false;
let stepIndex = 0;
let seqTimer;
let micStream, micNode;
let destNode, mediaRecorder, recChunks=[];

const btnPlay = document.getElementById('btnPlay');
const btnPrev = document.getElementById('btnPrev');
const btnNext = document.getElementById('btnNext');
const btnDonate = document.getElementById('btnDonate');
const btnComment = document.getElementById('btnComment');

const walletAddr = document.getElementById('walletAddr');
const btnConnect = document.getElementById('btnConnect');
const pointsEl = document.getElementById('points');

// Modals
const payModal = document.getElementById('payModal');
const closePay = document.getElementById('closePay');
const payType = document.getElementById('payType');
const currencySel = document.getElementById('currency');
const amountInp = document.getElementById('amount');
const confirmPay = document.getElementById('confirmPay');
const mockBigTip = document.getElementById('mockBigTip');
const walletStatus = document.getElementById('walletStatus');

const commentModal = document.getElementById('commentModal');
const closeComment = document.getElementById('closeComment');
const commentList = document.getElementById('commentList');
const commentInput = document.getElementById('commentInput');
const sendComment = document.getElementById('sendComment');

// Helpers
function trackByIndex(i){ return tracks[i]; }
function coverStyle(gradient){
  const [a,b] = gradient.split(',');
  return `background:linear-gradient(135deg, ${a}, ${b}); border:1px solid var(--border);`;
}
function setCover(el, gradient){ el.setAttribute('style', (el.getAttribute('style')||'') + coverStyle(gradient)); }

function save(){
  localStorage.setItem('sr_points', String(points));
  if(wallet) localStorage.setItem('sr_wallet', wallet); else localStorage.removeItem('sr_wallet');
}
function addPoints(n, reason){ points += n; pointsEl.textContent = points; save(); toast(`+${n} pts — ${reason}`); }

function toast(msg){
  const root = document.getElementById('toast-root') || document.body;
  const t = document.createElement('div');
  t.className = 'toast';
  t.setAttribute('role','status');
  t.setAttribute('aria-live','polite');
  t.textContent = msg;
  root.appendChild(t);
  requestAnimationFrame(()=> t.classList.add('show'));
  setTimeout(()=>{ t.classList.remove('show'); }, 1800);
  setTimeout(()=> t.remove(), 2100);
}

// Player
function load(index){
  currentIndex = (index + tracks.length) % tracks.length;
  const t = trackByIndex(currentIndex);
  audioEl.src = t.audio;
  titleEl.textContent = t.title;
  artistEl.textContent = t.artist;
  document.title = `${t.title} — ${t.artist} · SoundRise`;
  coverEl.style = coverStyle(t.cover);
  heroCover.style = coverStyle(t.cover);
  persistRecent(t.id);
}
function play(){
  audioEl.play().then(()=>{
    btnPlay.textContent = '⏸';
    btnPlay.setAttribute('aria-pressed','true');
  }).catch(()=>{
    // Autoplay blocked
    toast('Pulsa ▶ para reproducir');
  });
}
function pause(){ audioEl.pause(); btnPlay.textContent = '▶'; btnPlay.setAttribute('aria-pressed','false'); }

btnPlay.addEventListener('click', ()=>{
  if(audioEl.paused) { play(); tracks[currentIndex].plays++; addPoints(1,'Reproducir'); renderKPIs(); }
  else pause();
});
btnPrev.addEventListener('click', ()=>{ load(currentIndex-1); play(); });
btnNext.addEventListener('click', ()=>{ load(currentIndex+1); play(); });

audioEl.addEventListener('ended', ()=>{ load(currentIndex+1); play(); });

// Discover grid
function renderDiscover(){
  gridEl.innerHTML = '';
  tracks.forEach(t=>{
    const card = document.createElement('div');
    card.className='card';
    const cov = document.createElement('div'); cov.className='cover'; cov.style = coverStyle(t.cover);
    const block = document.createElement('div');
    const h3 = document.createElement('h3'); h3.textContent = t.title;
    const meta = document.createElement('div'); meta.className='meta'; meta.textContent = `${t.artist} • ${t.genre}`;
    const btns = document.createElement('div'); btns.style.marginLeft='auto'; btns.style.display='flex'; btns.style.gap='8px';
    const b1 = document.createElement('button'); b1.className='btn secondary'; b1.textContent='▶'; b1.title='Reproducir';
    const b2 = document.createElement('button'); b2.className='btn'; b2.textContent='Votar';
    const b3 = document.createElement('button'); b3.className='btn ghost'; b3.textContent='💬'; b3.title='Comentarios';
    b1.onclick = ()=>{ const idx = tracks.findIndex(x=>x.id===t.id); load(idx); play(); };
    b2.onclick = ()=> voteTrack(t.id);
    b3.onclick = ()=> openComments(t.id);
    block.append(h3, meta);
    btns.append(b1,b2,b3);
    card.append(cov, block, btns);
    gridEl.append(card);
  })
}

// Rankings
function renderRank(){
  const ranked = [...tracks].sort((a,b)=> b.votes - a.votes);
  rankEl.innerHTML='';
  ranked.forEach((t,i)=>{
    const row = document.createElement('div'); row.className='rank-item';
    const pos = document.createElement('div'); pos.className='rank-pos'; pos.textContent = i+1;
    const cov = document.createElement('div'); cov.className='cover'; cov.style = coverStyle(t.cover); cov.style.width='40px'; cov.style.height='40px';
    const title = document.createElement('div'); title.innerHTML = `<div style="font-weight:700">${t.title}</div><div class="muted" style="font-size:12px">${t.artist}</div>`;
    const vote = document.createElement('div'); vote.className='vote';
    const score = document.createElement('div'); score.className='chip'; score.innerHTML = `Votos <b>${t.votes}</b>`;
    const b = document.createElement('button'); b.className='btn'; b.textContent = 'Votar'; b.onclick = ()=> voteTrack(t.id);
    vote.append(score,b);
    row.append(pos,cov,title,vote);
    rankEl.append(row);
  })
}

function voteTrack(id){
  const key = 'sr_voted_'+id;
  if(localStorage.getItem(key)) { toast('Ya votaste este track'); return; }
  const t = tracks.find(x=>x.id===id); if(!t) return;
  t.votes++;
  localStorage.setItem(key, '1');
  addPoints(2,'Votar en rankings');
  renderRank();
  renderKPIs();
}

// Comments
function storageCommentsKey(id){ return 'sr_comments_'+id; }
function loadComments(id){
  try { return JSON.parse(localStorage.getItem(storageCommentsKey(id))||'[]'); } catch { return []; }
}
function saveComments(id, list){ localStorage.setItem(storageCommentsKey(id), JSON.stringify(list.slice(-300))); }

function openComments(id){
  commentModal.style.display='grid';
  commentModal.dataset.trackId = id;
  renderComments();
}
function closeComments(){ commentModal.style.display='none'; }

function renderComments(){
  const id = commentModal.dataset.trackId; if(!id) return;
  const list = loadComments(id);
  commentList.innerHTML='';
  list.forEach(c=>{
    const row = document.createElement('div'); row.className='rank-item'; row.style.alignItems='flex-start';
    const avatar = document.createElement('div'); avatar.className='cover'; avatar.style.width='34px'; avatar.style.height='34px'; avatar.style.borderRadius='50%'; avatar.style.background='linear-gradient(135deg, #2a2f47, #15192a)';
    const body = document.createElement('div');
    const head = document.createElement('div'); head.style.display='flex'; head.style.gap='8px';
    const name = 'Fan '+(c.user||'#'+String(Math.floor(Math.random()*999)));
    head.innerHTML = `<b>${name}</b> <span class="muted" style="font-size:12px">${new Date(c.ts).toLocaleString()}</span>`;
    const text = document.createElement('div'); text.textContent = c.text;
    body.append(head, text);
    row.append(avatar, body);
    commentList.append(row);
  })
}

sendComment.addEventListener('click', ()=>{
  const id = commentModal.dataset.trackId; if(!id) return;
  const value = commentInput.value.trim(); if(!value) return;
  const list = loadComments(id);
  list.push({ text:value, ts: Date.now(), user: (wallet? wallet.slice(0,6)+'…'+wallet.slice(-4): null) });
  saveComments(id, list);
  commentInput.value='';
  renderComments();
  addPoints(2,'Comentar');
});

// Donations / Subscriptions
function openPay(){
  payModal.style.display='grid';
  payModal.setAttribute('role','dialog');
  payModal.setAttribute('aria-modal','true');
  walletStatus.textContent = wallet? (wallet.slice(0,6)+'…'+wallet.slice(-4)) : 'No conectado';
  // Focus trap basic: focus first interactive
  setTimeout(()=> document.getElementById('amount')?.focus(), 0);
}
function closePayModal(){ payModal.style.display='none'; }

confirmPay.addEventListener('click', ()=>{
  const type = payType.value; const cur = currencySel.value; const amt = Number(amountInp.value||0);
  if(!amt || amt <= 0){ toast('Ingresa una cantidad válida'); return; }
  if((cur==='ETH' || cur==='USDC') && !wallet){ toast('Conecta tu wallet para pagos en crypto'); return; }
  toast(type==='donation' ? `Donación confirmada (${amt} ${cur})` : `Suscripción activada (${amt} ${cur}/mes)`);
  addPoints(type==='donation'? 5 : 10, type==='donation'? 'Donar a artistas' : 'Suscripción a artista');
  closePayModal();
  amountInp.value='';
});
mockBigTip.addEventListener('click', ()=>{ amountInp.value = 5; payType.value='donation'; currencySel.value='USD'; confirmPay.click(); });

// Wallet connect (mock)
function connectWallet(){
  // Simulación de conexión: genera una dirección aleatoria 0x...
  const hex = [...crypto.getRandomValues(new Uint8Array(20))].map(b=>b.toString(16).padStart(2,'0')).join('');
  wallet = '0x'+hex;
  walletAddr.textContent = wallet.slice(0,6)+'…'+wallet.slice(-4);
  walletStatus.textContent = wallet.slice(0,6)+'…'+wallet.slice(-4);
  btnConnect.textContent = 'Desconectar';
  save();
  toast('Wallet conectada');
  addPoints(3,'Conectar wallet');
}
function disconnectWallet(){ wallet=null; walletAddr.textContent='No conectado'; walletStatus.textContent='No conectado'; btnConnect.textContent='Conectar'; save(); toast('Wallet desconectada'); }

btnConnect.addEventListener('click', ()=>{ wallet? disconnectWallet() : connectWallet(); });

// Modals bind
btnDonate.addEventListener('click', openPay);
closePay.addEventListener('click', closePayModal);
document.getElementById('btnBoost').addEventListener('click', ()=>{ addPoints(1,'Explorar herramientas pro'); toast('Boost demo activado (mock)'); });

btnComment.addEventListener('click', ()=>{ openComments(tracks[currentIndex].id); });
closeComment.addEventListener('click', closeComments);

// Close modals with Escape
window.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape'){
    if(payModal.style.display==='grid') closePayModal();
    if(commentModal.style.display==='grid') closeComments();
  }
});

// Events
function renderEvents(){
  eventsEl.innerHTML='';
  events.forEach(e=>{
    const el = document.createElement('div'); el.className='event';
    el.innerHTML = `<div class="badge" style="display:inline-block;margin-bottom:6px">${e.type}</div>
                    <h4>${e.name}</h4>
                    <div class="muted" style="margin-bottom:8px">${e.when}</div>`;
    const btn = document.createElement('button'); btn.className='btn'; btn.textContent=e.cta;
    btn.onclick = ()=>{
      if(e.trackId){ const idx = tracks.findIndex(t=>t.id===e.trackId); if(idx>=0){ load(idx); play(); addPoints(1,'Asistir a evento'); } }
      else toast('Info de entradas enviada a tu correo (demo)');
    };
    el.append(btn);
    eventsEl.append(el);
  })
}

// Genres
function renderGenres(){
  if(!genreChips) return;
  genreChips.innerHTML='';
  genres.forEach((g,idx)=>{
    const chip = document.createElement('button');
    chip.className = 'gchip'+(idx===0?' active':'');
    chip.textContent = g;
    chip.onclick = ()=>{
      document.querySelectorAll('.gchip').forEach(c=>c.classList.remove('active'));
      chip.classList.add('active');
      toast('Género: '+g);
    };
    genreChips.append(chip);
  });
}

// Creators
function renderCreators(){
  if(!creatorGrid) return;
  creatorGrid.innerHTML='';
  creators.forEach(c=>{
    const card = document.createElement('div'); card.className = 'card';
    const inner = document.createElement('div'); inner.className='creator-card';
    const av = document.createElement('div'); av.className='creator-avatar';
    const meta = document.createElement('div'); meta.className='creator-meta';
    const name = document.createElement('div'); name.className='creator-name'; name.textContent=c.name;
    const role = document.createElement('div'); role.className='creator-role'; role.textContent=c.role+' • '+c.fans.toLocaleString()+' fans';
    const btn = document.createElement('button'); btn.className='btn'; btn.textContent='Seguir'; btn.onclick = ()=>{ addPoints(1,'Seguir creador'); toast('Siguiendo a '+c.name); };
    meta.append(name,role);
    inner.append(av, meta);
    card.append(inner, btn);
    creatorGrid.append(card);
  })
}

// Subscriptions
function renderPlans(){
  if(!subsGrid) return;
  subsGrid.innerHTML='';
  plans.forEach(p=>{
    const card = document.createElement('div'); card.className='card';
    const head = document.createElement('div'); head.className='plan-header';
    const title = document.createElement('div'); title.className='plan-title'; title.textContent = p.title;
    const price = document.createElement('div'); price.className='plan-price'; price.textContent = p.price;
    head.append(title, price);
    const feats = document.createElement('div'); feats.className='plan-feat'; feats.innerHTML = p.perks.map(x=>`<div>✓ ${x}</div>`).join('');
    const btn = document.createElement('button'); btn.className='btn'; btn.textContent='Suscribirme'; btn.onclick=()=>{ openPay(); payType.value='subscription'; };
    card.append(head, feats, btn);
    subsGrid.append(card);
  })
}

// Playlist persistence
function loadPlaylist(){ try{return JSON.parse(localStorage.getItem('sr_playlist')||'[]')}catch{return []} }
function savePlaylist(list){ localStorage.setItem('sr_playlist', JSON.stringify(list)); }
function addToPlaylist(item){ const list = loadPlaylist(); list.unshift(item); savePlaylist(list); renderPlaylist(); addPoints(1,'Añadir a playlist'); }

function renderPlaylist(){
  if(!playlistEl) return;
  const list = loadPlaylist();
  playlistEl.innerHTML='';
  list.forEach((it, idx)=>{
    const row = document.createElement('div'); row.className='pl-item';
    const meta = document.createElement('div'); meta.className='pl-meta';
    const title = document.createElement('div'); title.className='pl-title'; title.textContent = it.title || it.url || 'Elemento';
    const subtitle = document.createElement('div'); subtitle.className='muted'; subtitle.textContent = it.type.toUpperCase();
    meta.append(title, subtitle);

    const actions = document.createElement('div'); actions.className='pl-actions';
    const playBtn = document.createElement('button'); playBtn.className='btn'; playBtn.textContent='Reproducir';
    playBtn.onclick = ()=> playPlaylistItem(it);

    const delBtn = document.createElement('button'); delBtn.className='btn ghost'; delBtn.textContent='Eliminar';
    delBtn.onclick = ()=>{ const list = loadPlaylist(); list.splice(idx,1); savePlaylist(list); renderPlaylist(); };

    actions.append(playBtn, delBtn);
    row.append(meta, actions);
    playlistEl.append(row);
  });
}

function playPlaylistItem(it){
  // For SoundCloud, use official embed
  scEmbed.innerHTML='';
  if(it.type === 'soundcloud'){
    const src = `https://w.soundcloud.com/player/?url=${encodeURIComponent(it.url)}&color=%237c5cff&auto_play=true`;
    const iframe = document.createElement('iframe');
    iframe.width='100%'; iframe.height='166'; iframe.allow='autoplay'; iframe.scrolling='no'; iframe.frameBorder='no'; iframe.src = src;
    scEmbed.append(iframe);
    toast('Reproduciendo desde SoundCloud');
  } else if(it.type === 'track'){
    // local track type could integrate with main audio player in futuras iteraciones
    toast('Reproducción local no implementada aún');
  }
}

// SoundCloud oEmbed preview
async function previewSoundCloud(url){
  scPreviewBox.innerHTML = '';
  try{
    const oEmbedUrl = `https://soundcloud.com/oembed?format=json&url=${encodeURIComponent(url)}`;
    const res = await fetch(oEmbedUrl);
    if(!res.ok) throw new Error('oEmbed fallo');
    const data = await res.json();
    scPreviewBox.innerHTML = data.html;
  }catch(e){ scPreviewBox.innerHTML = '<div class="muted">No se pudo previsualizar. Verifica la URL.</div>'; }
}

function addSoundCloudUrl(){
  const url = (scUrl?.value||'').trim(); if(!url) { toast('Pega una URL'); return; }
  addToPlaylist({ type:'soundcloud', url, title:url });
  scUrl.value='';
}

scPreviewBtn?.addEventListener('click', ()=>{ const url = (scUrl?.value||'').trim(); if(url) previewSoundCloud(url); });
scAdd?.addEventListener('click', addSoundCloudUrl);
plClear?.addEventListener('click', ()=>{ savePlaylist([]); renderPlaylist(); scEmbed.innerHTML=''; });
plExport?.addEventListener('click', ()=>{
  const list = loadPlaylist();
  const blob = new Blob([JSON.stringify(list,null,2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href=url; a.download='playlist.json'; a.click();
  URL.revokeObjectURL(url);
});

// News
function renderNews(){
  if(!newsList) return;
  newsList.innerHTML='';
  news.forEach(n=>{
    const item = document.createElement('div'); item.className='news-item';
    item.innerHTML = `<div class="news-date">${n.date}</div><div class="news-title">${n.title}</div>`;
    const more = document.createElement('div'); more.className='muted'; more.textContent=n.desc;
    item.append(more);
    newsList.append(item);
  })
}

// KPIs / Premium
function renderKPIs(){
  const totalPlays = tracks.reduce((a,b)=>a+b.plays,0);
  const totalVotes = tracks.reduce((a,b)=>a+b.votes,0);
  const totalComments = tracks.reduce((acc,t)=> acc + loadComments(t.id).length, 0);
  kpiEl.innerHTML='';
  const cells = [
    {name:'Reproducciones', val: totalPlays},
    {name:'Votos', val: totalVotes},
    {name:'Comentarios', val: totalComments},
    {name:'Donaciones (mock)', val: Math.floor(points/15)}
  ];
  cells.forEach(c=>{
    const div = document.createElement('div'); div.className='cell';
    div.innerHTML = `<div class="muted" style="font-size:12px">${c.name}</div><div style="font-size:22px; font-weight:800">${c.val.toLocaleString()}</div>`;
    kpiEl.append(div);
  })
}

// Persistence helpers
function persistRecent(id){
  try{
    const k='sr_recent'; const arr = JSON.parse(localStorage.getItem(k)||'[]').filter(x=>x!==id);
    arr.unshift(id); localStorage.setItem(k, JSON.stringify(arr.slice(0,12)));
  }catch{}
}

// Tabs demo
document.getElementById('tabs').addEventListener('click', (e)=>{
  const pill = e.target.closest('.pill'); if(!pill) return;
  [...document.querySelectorAll('.pill')].forEach(p=>p.classList.remove('active'));
  pill.classList.add('active');
  toast('Sección: '+pill.dataset.tab);
});

// Ranking live pulse (simulated)
setInterval(()=>{
  // random drift to simulate real-time movement
  const i = Math.floor(Math.random()*tracks.length);
  if(Math.random()<.5){ tracks[i].votes += 1; renderRank(); }
}, 5000);

// Keyboard shortcuts
window.addEventListener('keydown', (e)=>{
  const tag = document.activeElement?.tagName?.toLowerCase();
  if(tag === 'input' || tag === 'textarea') return;
  if(e.code === 'Space'){ e.preventDefault(); btnPlay.click(); }
  if(e.key === 'ArrowRight'){ btnNext.click(); }
  if(e.key === 'ArrowLeft'){ btnPrev.click(); }
});

// Sequencer setup
function initSeqGrid(){
  if(!seqGrid) return;
  seqGrid.innerHTML='';
  const rows = [
    {key:'kick', label:'Kick'},
    {key:'snare', label:'Snare'},
    {key:'hats', label:'Hats'},
    {key:'bass', label:'Bass'},
  ];
  rows.forEach((row, rIdx)=>{
    for(let i=0;i<16;i++){
      const idx = i;
      const cell = document.createElement('div');
      cell.className='step';
      cell.title = row.label+ ' — paso ' + (i+1);
      const dot = document.createElement('div'); dot.className='dot';
      cell.append(dot);
      cell.onclick = ()=>{
        seqPattern[idx][row.key] = !seqPattern[idx][row.key];
        cell.classList.toggle('active', seqPattern[idx][row.key]);
      };
      // Visual grouping in rows (optional: add labels)
      seqGrid.append(cell);
    }
  });
}

function scheduleNext(){
  const bpmValNum = Number(bpm?.value||110);
  const stepDur = (60 / bpmValNum) / 4; // 16th notes
  seqTimer = setTimeout(()=>{
    triggerStep(stepIndex);
    stepIndex = (stepIndex+1) % 16;
    scheduleNext();
  }, stepDur*1000);
}

function triggerStep(i){
  const stepCells = seqGrid?.children;
  if(stepCells){
    for(let n=0;n<stepCells.length;n++) stepCells[n].classList.remove('playing');
    // mark current column
    for(let r=0;r<4;r++){ // 4 rows
      const idx = i + (r*16);
      stepCells[idx]?.classList.add('playing');
    }
  }
  const pat = seqPattern[i];
  if(!audioCtx) return;
  const t = audioCtx.currentTime;
  if(pat.kick) playKick(t);
  if(pat.snare) playSnare(t);
  if(pat.hats) playHat(t);
  if(pat.bass) playBass(t, rootSel?.value||'C', scaleSel?.value||'minor');
}

function ensureCtx(){
  if(!audioCtx){
    audioCtx = new (window.AudioContext||window.webkitAudioContext)();
    // Create a destination node to capture all mixer output
    destNode = audioCtx.createMediaStreamDestination();
  }
}

function playKick(t){
  ensureCtx();
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.type='sine';
  o.frequency.setValueAtTime(130, t);
  o.frequency.exponentialRampToValueAtTime(50, t+0.12);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.8, t+0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t+0.16);
  o.connect(g);
  g.connect(audioCtx.destination);
  g.connect(destNode);
  o.start(t); o.stop(t+0.17);
}

function playSnare(t){
  ensureCtx();
  // noise
  const bufferSize = audioCtx.sampleRate * 0.2;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const noise = audioCtx.createBufferSource(); noise.buffer = buffer;
  const noiseFilter = audioCtx.createBiquadFilter(); noiseFilter.type='highpass'; noiseFilter.frequency.value=1000;
  const noiseGain = audioCtx.createGain(); noiseGain.gain.value=0.25;
  noise.connect(noiseFilter).connect(noiseGain);

  // tone
  const o = audioCtx.createOscillator(); o.type='triangle'; o.frequency.value=180;
  const oGain = audioCtx.createGain(); oGain.gain.value=0.15;

  const env = audioCtx.createGain(); env.gain.setValueAtTime(0.0001, t); env.gain.exponentialRampToValueAtTime(1, t+0.005); env.gain.exponentialRampToValueAtTime(0.0001, t+0.15);

  noiseGain.connect(env);
  o.connect(oGain).connect(env);
  env.connect(audioCtx.destination);
  env.connect(destNode);

  noise.start(t); noise.stop(t+0.2);
  o.start(t); o.stop(t+0.2);
}

function playHat(t){
  ensureCtx();
  const bufferSize = audioCtx.sampleRate * 0.05;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = (Math.random()*2-1) * 0.6;
  const src = audioCtx.createBufferSource(); src.buffer = buffer;
  const hp = audioCtx.createBiquadFilter(); hp.type='highpass'; hp.frequency.value=7000;
  const g = audioCtx.createGain(); g.gain.value=0.2;
  src.connect(hp).connect(g);
  g.connect(audioCtx.destination);
  g.connect(destNode);
  src.start(t); src.stop(t+0.05);
}

function noteToFreq(note){
  const map = {C:0,'C#':1,D:2,'D#':3,E:4,F:5,'F#':6,G:7,'G#':8,A:9,'A#':10,B:11};
  const semis = map[note];
  const midi = 48 + semis; // C3 base
  return 440 * Math.pow(2,(midi-69)/12);
}

function playBass(t, root='C', scale='minor'){
  ensureCtx();
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain(); g.gain.value=0.0001;
  o.type='sawtooth';
  const freq = noteToFreq(root);
  o.frequency.setValueAtTime(freq, t);
  g.gain.exponentialRampToValueAtTime(0.25, t+0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t+0.25);
  const lp = audioCtx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=500;
  o.connect(lp).connect(g);
  g.connect(audioCtx.destination);
  g.connect(destNode);
  o.start(t); o.stop(t+0.3);
}

function toggleSeq(){
  if(!isPlaying){
    ensureCtx();
    stepIndex = 0;
    scheduleNext();
    isPlaying = true; mxPlay.textContent='⏸ Detener';
  }else{
    clearTimeout(seqTimer); isPlaying=false; mxPlay.textContent='▶ Reproducir';
    const stepCells = seqGrid?.children; if(stepCells){ for(let n=0;n<stepCells.length;n++) stepCells[n].classList.remove('playing'); }
  }
}

function clearSeq(){ seqPattern = Array.from({length:16},()=>({kick:false,snare:false,hats:false,bass:false})); initSeqGrid(); }

// Recording controls
const mxRec = document.getElementById('mxRec');
const recName = document.getElementById('recName');
const recordingsList = document.getElementById('recordingsList');
const recClear = document.getElementById('recClear');

function loadRecordings(){
  try{ return JSON.parse(localStorage.getItem('sr_recordings')||'[]'); }catch{return []}
}
function saveRecordings(list){ localStorage.setItem('sr_recordings', JSON.stringify(list)); }
function renderRecordings(){
  if(!recordingsList) return;
  const list = loadRecordings();
  recordingsList.innerHTML='';
  list.forEach((r, idx)=>{
    const card = document.createElement('div'); card.className='rec-card';
    const audio = document.createElement('audio'); audio.controls = true; audio.src = r.url; audio.style.flex='1';
    const meta = document.createElement('div'); meta.className='rec-meta';
    const name = document.createElement('div'); name.className='rec-name'; name.textContent = r.name || 'Grabación '+(idx+1);
    const date = document.createElement('div'); date.className='rec-date'; date.textContent = new Date(r.ts).toLocaleString();
    meta.append(name,date);
    const dl = document.createElement('a'); dl.className='btn secondary'; dl.textContent='Descargar'; dl.href=r.url; dl.download=(r.name||'grabacion')+'.webm';
    const del = document.createElement('button'); del.className='btn ghost'; del.textContent='Eliminar'; del.onclick=()=>{
      const arr = loadRecordings(); arr.splice(idx,1); saveRecordings(arr); renderRecordings(); toast('Grabación eliminada'); };
    card.append(audio, meta, dl, del);
    recordingsList.append(card);
  });
}

function toggleRecording(){
  ensureCtx();
  if(!mediaRecorder){
    if(!destNode){ destNode = audioCtx.createMediaStreamDestination(); }
    try{
      mediaRecorder = new MediaRecorder(destNode.stream);
    }catch(err){ toast('Grabación no soportada'); return; }
    recChunks = [];
    mediaRecorder.ondataavailable = (e)=>{ if(e.data.size>0) recChunks.push(e.data); };
    mediaRecorder.onstop = ()=>{
      const blob = new Blob(recChunks, {type:'audio/webm'});
      const url = URL.createObjectURL(blob);
      const list = loadRecordings();
      list.unshift({ name: recName?.value?.trim() || 'Beat '+new Date().toLocaleTimeString(), url, ts: Date.now() });
      saveRecordings(list);
      renderRecordings();
      recChunks=[]; mediaRecorder=null; mxRec.textContent='⏺ Grabar';
      addPoints(3,'Grabar beat');
    };
    mediaRecorder.start();
    mxRec.textContent='⏹ Detener';
    toast('Grabando mezcla');
  }else{
    mediaRecorder.stop();
    toast('Grabación detenida');
  }
}

mxRec?.addEventListener('click', toggleRecording);
recClear?.addEventListener('click', ()=>{ saveRecordings([]); renderRecordings(); toast('Grabaciones vaciadas'); });

// Microphone + Autotune (simplified pitch shift mock)
let mediaStreamSource, tunerGain, pitchShifter;
async function toggleMic(){
  ensureCtx();
  if(!micStream){
    try{
      micStream = await navigator.mediaDevices.getUserMedia({audio:true});
      mediaStreamSource = audioCtx.createMediaStreamSource(micStream);
      // Simple chain: mic -> (optional) pitch shift -> output
      tunerGain = audioCtx.createGain(); tunerGain.gain.value = (tuneStrength?.value||70)/100;
      pitchShifter = audioCtx.createBiquadFilter(); pitchShifter.type = 'allpass'; // placeholder
      mediaStreamSource.connect(pitchShifter).connect(tunerGain).connect(audioCtx.destination);
      mxMic.textContent = '⏹ Detener micro';
      toast('Micrófono activo');
    }catch(err){ toast('Permiso de micrófono denegado'); }
  }else{
    micStream.getTracks().forEach(t=>t.stop());
    micStream = null; mediaStreamSource=null; tunerGain=null; pitchShifter=null; mxMic.textContent='🎤 Activar micro';
  }
}

// UI bindings for mixer
bpm?.addEventListener('input', ()=>{ bpmVal.textContent = bpm.value; });
mxPlay?.addEventListener('click', toggleSeq);
mxClear?.addEventListener('click', clearSeq);
mxMic?.addEventListener('click', toggleMic);
autotuneToggle?.addEventListener('change', ()=>{ toast(autotuneToggle.checked ? 'Autotune activado' : 'Autotune desactivado'); });
tuneStrength?.addEventListener('input', ()=>{ tuneVal.textContent = tuneStrength.value+'%'; if(tunerGain) tunerGain.gain.value = tuneStrength.value/100; });
transpose?.addEventListener('input', ()=>{ transposeVal.textContent = transpose.value; });

// Boot
function boot(){
  pointsEl.textContent = points;
  if(wallet){ walletAddr.textContent = wallet.slice(0,6)+'…'+wallet.slice(-4); btnConnect.textContent='Desconectar'; }
  load(0);
  renderDiscover();
  renderRank();
  renderEvents();
  renderKPIs();
// Banner logic
  if(bannerEl){
    const dismissed = localStorage.getItem('sr_banner_dismissed');
    if(dismissed==='1') bannerEl.style.display='none';
    bannerClose?.addEventListener('click', ()=>{ bannerEl.style.display='none'; localStorage.setItem('sr_banner_dismissed','1'); });
    bannerCTA?.addEventListener('click', ()=>{ addPoints(2,'Ver programa de fundadores'); toast('Te enviaremos más info (demo)'); });
  }
  renderGenres();
  renderCreators();
  renderPlans();
  renderNews();
  initSeqGrid();
  renderRecordings();
  renderPlaylist();
}
boot();
