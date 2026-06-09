import { useState, useEffect } from "react";

/* ════════════════════════════════════════════════════════════════
   KRÓLESTWO KRASNOLUDKÓW — jeden plik, dwa tryby:
   • Wizualizacja — krok po kroku, jak działa każdy algorytm (M1–M4)
   • Gra — cały pajplajn na jednej mapie (jeden dzień w królestwie)
   Przełącznik na samej górze.
   ════════════════════════════════════════════════════════════════ */

// ─────────────────────────── TRYB 1: WIZUALIZACJA ───────────────────────────

// keyboard navigation: → / Space = next, ← = prev (only the mounted tab listens)
function useKeyNav(setStep, max){
  useEffect(()=>{
    const h=(e)=>{
      if(e.key==='ArrowRight'||e.key===' '){ e.preventDefault(); setStep(s=>Math.min(max-1,s+1)); }
      else if(e.key==='ArrowLeft'){ e.preventDefault(); setStep(s=>Math.max(0,s-1)); }
    };
    window.addEventListener('keydown',h);
    return ()=>window.removeEventListener('keydown',h);
  },[max,setStep]);
}

const FX = `
  @keyframes march { to { stroke-dashoffset: -20; } }
  .flow-edge { stroke-dasharray: 7 4; animation: march 0.7s linear infinite; }
  .svg-node { transition: fill .35s ease, stroke .35s ease, opacity .35s ease, r .3s ease; }
  .svg-edge { transition: stroke .35s ease, stroke-width .35s ease; }
  .svg-fill { transition: fill .35s ease, stroke .35s ease, opacity .35s ease; }
`;

const C = {
  bg:'#1A1A2E', card:'#0F3460', card2:'#0D1B3E',
  accent:'#00D9FF', gold:'#FFD700', red:'#FF6B6B',
  green:'#50C878', white:'#FFFFFF', gray:'#AAAAAA',
  muted:'#555566', panel:'#08081a',
};

const btn = {
  background:C.card, color:C.white, border:`1.5px solid ${C.accent}44`,
  borderRadius:8, padding:'6px 16px', cursor:'pointer', fontSize:13, fontFamily:'inherit',
};

function Ctrl({step,max,onChange}){
  return(
    <div style={{display:'flex',gap:8,alignItems:'center'}}>
      <button onClick={()=>onChange(0)} style={btn}>⏮</button>
      <button onClick={()=>onChange(Math.max(0,step-1))} style={btn}>◀ Wstecz</button>
      <span style={{color:C.gray,fontSize:13,minWidth:64,textAlign:'center'}}>{step+1} / {max}</span>
      <button onClick={()=>onChange(Math.min(max-1,step+1))} style={btn}>Dalej ▶</button>
      <button onClick={()=>onChange(max-1)} style={btn}>⏭</button>
    </div>
  );
}

function Box({text,color}){
  return(
    <div style={{
      background:C.card, borderRadius:8, padding:'10px 20px',
      maxWidth:580, textAlign:'center', color:color||C.white,
      fontSize:14, lineHeight:1.55, border:`1px solid ${(color||C.accent)+'33'}`,
    }}>{text}</div>
  );
}

// ═══════════════════════════════ M1 MCMF ═══════════════════════════════
function M1(){
  const N={
    S: {x:75, y:185,label:'Źródło', color:C.accent, tip:'Źródło przepływu'},
    K1:{x:228,y:72, label:'Gimli',  color:C.gold, tip:'Gimli → Złoto (d=3)'},
    K2:{x:228,y:185,label:'Thorin', color:C.gold, tip:'Thorin → Złoto (d=4)'},
    K3:{x:228,y:298,label:'Balin',  color:C.gold, tip:'Balin → Węgiel (d=2)'},
    W1:{x:415,y:108,label:'Złoto',  sub:'cap=2',color:C.red, tip:'Kopalnia Złota — pojemność 2'},
    W2:{x:415,y:262,label:'Węgiel', sub:'cap=1',color:C.red, tip:'Kopalnia Węgla — pojemność 1'},
    T: {x:562,y:185,label:'Ujście', color:C.accent, tip:'Ujście przepływu'},
  };
  const E=[
    {id:'SK1', f:'S', t:'K1',d:''},
    {id:'SK2', f:'S', t:'K2',d:''},
    {id:'SK3', f:'S', t:'K3',d:''},
    {id:'K1W1',f:'K1',t:'W1',d:'d=3'},
    {id:'K2W1',f:'K2',t:'W1',d:'d=4'},
    {id:'K3W2',f:'K3',t:'W2',d:'d=2'},
    {id:'W1T', f:'W1',t:'T', d:''},
    {id:'W2T', f:'W2',t:'T', d:''},
  ];
  const steps=[
    {title:'Sieć przepływów — stan początkowy',
     desc:'Sieć representuje problem: krasnale (żółte) połączone z kopalniami (czerwone) które umieją obsługiwać. Każda krawędź ma przepustowość 1, krawędzie do kopalni mają koszt = odległość. Szukamy: MAX zatrudnionych + MIN sumaryczna odległość.',
     hl:[],fl:[]},
    {title:'SPFA szuka najtańszej ścieżki #1',
     desc:'SPFA (Bellman-Ford z kolejką) przeczesuje sieć. Najtańsza wolna ścieżka: S → Balin → Węgiel → T. Koszt = 2.',
     hl:['SK3','K3W2','W2T'],fl:[]},
    {title:'Przepływ #1 — Balin przydzielony do Węgla',
     desc:'Pchamy 1 jednostkę przepływu przez znalezioną ścieżkę. Balin ma pracę! Kopalnia Węgla zajęta (1/1).',
     hl:[],fl:['SK3','K3W2','W2T']},
    {title:'SPFA szuka najtańszej ścieżki #2',
     desc:'Węgiel zamknięty. Kolejna najtańsza ścieżka: S → Gimli → Złoto → T. Koszt = 3.',
     hl:['SK1','K1W1','W1T'],fl:['SK3','K3W2','W2T']},
    {title:'Przepływ #2 — Gimli przydzielony do Złota',
     desc:'Gimli ma pracę! Kopalnia Złota zajęta (1/2). Zostało jeszcze 1 wolne miejsce.',
     hl:[],fl:['SK3','K3W2','W2T','SK1','K1W1','W1T']},
    {title:'SPFA szuka najtańszej ścieżki #3',
     desc:'Znaleziono: S → Thorin → Złoto → T. Koszt = 4. Złoto ma jeszcze miejsce, Thorin umie kopać złoto.',
     hl:['SK2','K2W1','W1T'],fl:['SK3','K3W2','W2T','SK1','K1W1','W1T']},
    {title:'✅ Wynik końcowy — wszyscy przydzieleni!',
     desc:'Balin→Węgiel (d=2), Gimli→Złoto (d=3), Thorin→Złoto (d=4). Suma = 9. Brak kolejnych wolnych ścieżek. Algorytm zakończony!',
     hl:[],fl:['SK3','K3W2','W2T','SK1','K1W1','W1T','SK2','K2W1']},
  ];
  const [si,setSi]=useState(0);
  useKeyNav(setSi,steps.length);
  const cs=steps[si];
  const ec=id=>cs.hl.includes(id)?C.gold:cs.fl.includes(id)?C.green:'#222244';
  const ew=id=>cs.hl.includes(id)?3.5:cs.fl.includes(id)?2.5:1.5;
  const em=id=>cs.hl.includes(id)?'aG':cs.fl.includes(id)?'aGr':'aD';
  return(
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:14}}>
      <h3 style={{color:C.accent,margin:0,fontSize:16}}>{cs.title}</h3>
      <svg width={645} height={390} style={{background:C.panel,borderRadius:12}}>
        <defs>
          {[['aD','#222244'],[`aG`,C.gold],['aGr',C.green]].map(([id,col])=>(
            <marker key={id} id={id} markerWidth={8} markerHeight={6} refX={7} refY={3} orient="auto">
              <polygon points="0 0,8 3,0 6" fill={col}/>
            </marker>
          ))}
        </defs>
        {E.map(e=>{
          const f=N[e.f],t=N[e.t];
          const dx=t.x-f.x,dy=t.y-f.y,L=Math.sqrt(dx*dx+dy*dy),r=32;
          const sx=f.x+dx/L*r,sy=f.y+dy/L*r,ex=t.x-dx/L*r,ey=t.y-dy/L*r;
          const isFl=cs.fl.includes(e.id);
          return(
            <g key={e.id}>
              <line x1={sx} y1={sy} x2={ex} y2={ey} stroke={ec(e.id)} strokeWidth={ew(e.id)}
                markerEnd={`url(#${em(e.id)})`} className={isFl?'flow-edge':'svg-edge'}/>
              {e.d&&<text x={(f.x+t.x)/2+6} y={(f.y+t.y)/2-8} fill={C.muted} fontSize={11} textAnchor="middle">{e.d}</text>}
            </g>
          );
        })}
        {Object.entries(N).map(([id,n])=>{
          const isHL=cs.hl.some(k=>k.includes(id));
          const isFl=cs.fl.some(k=>k.includes(id));
          const fill=isHL?n.color:isFl?n.color+'66':C.card;
          return(
            <g key={id}>
              <title>{n.tip}</title>
              <circle cx={n.x} cy={n.y} r={33} fill={fill} stroke={n.color} strokeWidth={isHL?3:1.5} className="svg-node" style={{cursor:'pointer'}}/>
              <text x={n.x} y={n.sub?n.y-5:n.y+5} fill={C.white} fontSize={13} textAnchor="middle" fontWeight="bold" style={{pointerEvents:'none'}}>{n.label}</text>
              {n.sub&&<text x={n.x} y={n.y+13} fill={C.gray} fontSize={10} textAnchor="middle" style={{pointerEvents:'none'}}>{n.sub}</text>}
            </g>
          );
        })}
      </svg>
      <Box text={cs.desc} color={si===steps.length-1?C.green:undefined}/>
      <Ctrl step={si} max={steps.length} onChange={setSi}/>
    </div>
  );
}

// ═══════════════════════════════ M2 OTOCZKA ═══════════════════════════════
function M2Steps(){
  const sc=62,ox=54,svgH=384,oy=52;
  const px=x=>ox+x*sc;
  const py=y=>svgH-oy-y*sc;
  const cross=(O,A,B)=>(A.x-O.x)*(B.y-O.y)-(A.y-O.y)*(B.x-O.x);
  const allPts=[{x:0,y:0},{x:5,y:0},{x:5,y:5},{x:0,y:5},{x:2,y:2},{x:3,y:3},{x:1,y:4}];
  const sorted=[...allPts].sort((a,b)=>a.x!==b.x?a.x-b.x:a.y-b.y);
  const lowerChain=[{x:0,y:0},{x:5,y:0},{x:5,y:5}];
  const fullHull=[{x:0,y:0},{x:5,y:0},{x:5,y:5},{x:0,y:5}];
  const steps=[
    {phase:'init',stack:[],cur:null,rem:null,lhull:[],hull:[],
      title:'Kopalnie na mapie — szukamy trasy patrolu',
      desc:'7 kopalni. Szukamy najkrótszej zamkniętej trasy, która obejmie je wszystkie z zewnątrz. Wyobraź sobie gumkę naciągniętą na punkty.'},
    {phase:'sort',stack:sorted,cur:null,rem:null,lhull:[],hull:[],
      title:'Krok 1: Sortowanie (od lewej do prawej)',
      desc:'Sortujemy punkty po współrzędnej X. Cyfry pokazują kolejność. To jedyny krok O(n log n) — cała reszta jest liniowa.'},
    {phase:'lower',stack:lowerChain,cur:null,rem:{x:3,y:3},lhull:lowerChain,hull:[],
      title:'Krok 2: Dolna krawędź trasy',
      desc:'Idziemy dołem od lewej do prawej i zostawiamy tylko skrajne punkty. Punkt, który tworzy „wgięcie" do środka (np. 3,3 — na czerwono), odrzucamy. Dół trasy: (0,0) → (5,0) → (5,5).'},
    {phase:'done',stack:[],cur:null,rem:null,lhull:[],hull:fullHull,
      title:'✅ Trasa Patrolu gotowa!',
      desc:'Tak samo wracamy górą: (5,5) → (0,5) → (0,0) — trasa się zamyka. Obwód = 20. Punkty (2,2), (3,3), (1,4) zostały w środku — gumka ich nie dotknęła, więc patrol tam nie zajeżdża.'},
  ];
  const [si,setSi]=useState(0);
  useKeyNav(setSi,steps.length);
  const cs=steps[si];
  return(
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:12}}>
      <h3 style={{color:C.gold,margin:0,fontSize:16}}>{cs.title}</h3>
      <svg width={430} height={svgH} style={{background:C.panel,borderRadius:12}}>
        {[0,1,2,3,4,5].map(i=>(
          <g key={i}>
            <line x1={px(0)} y1={py(i)} x2={px(5)} y2={py(i)} stroke="#13133a" strokeWidth={1}/>
            <line x1={px(i)} y1={py(0)} x2={px(i)} y2={py(5)} stroke="#13133a" strokeWidth={1}/>
            <text x={px(i)} y={svgH-13} fill={C.muted} fontSize={11} textAnchor="middle">{i}</text>
            {i>0&&<text x={18} y={py(i)+4} fill={C.muted} fontSize={11} textAnchor="middle">{i}</text>}
          </g>
        ))}
        {cs.hull.length>2&&(
          <polygon points={cs.hull.map(p=>`${px(p.x)},${py(p.y)}`).join(' ')}
            fill={C.accent+'1a'} stroke={C.accent} strokeWidth={2.5}/>
        )}
        {cs.lhull.length>1&&cs.phase!=='done'&&(
          <polyline points={cs.lhull.map(p=>`${px(p.x)},${py(p.y)}`).join(' ')}
            fill="none" stroke={C.gold} strokeWidth={2} strokeDasharray="6 3"/>
        )}
        {cs.phase==='sort'&&sorted.map((p,i)=>(
          <text key={i} x={px(p.x)+15} y={py(p.y)-14} fill={C.gold} fontSize={13} fontWeight="bold">{i+1}</text>
        ))}
        {allPts.map((p,i)=>{
          const inHull=cs.hull.some(h=>h.x===p.x&&h.y===p.y);
          const isCur=cs.cur&&cs.cur.x===p.x&&cs.cur.y===p.y;
          const isRem=cs.rem&&cs.rem.x===p.x&&cs.rem.y===p.y;
          const inL=cs.lhull.some(h=>h.x===p.x&&h.y===p.y);
          const inStk=!inL&&(cs.stack||[]).some(h=>h.x===p.x&&h.y===p.y);
          let col=C.gray;
          if(isRem) col=C.red;
          else if(isCur) col=C.gold;
          else if(inHull) col=C.accent;
          else if(cs.phase!=='sort'&&cs.phase!=='init'&&(inL||inStk)) col=C.green;
          const r=isCur||isRem?11:inHull?10:7;
          return(
            <g key={i}>
              <circle cx={px(p.x)} cy={py(p.y)} r={r} fill={col} opacity={isRem?0.5:1} className="svg-node"/>
              <text x={px(p.x)+14} y={py(p.y)+5} fill={col} fontSize={11} className="svg-fill">({p.x},{p.y})</text>
            </g>
          );
        })}
      </svg>
      <div style={{display:'flex',gap:14,flexWrap:'wrap',justifyContent:'center',fontSize:12}}>
        {[[C.accent,'Trasa patrolu'],[C.gold,'Bieżący / sortowanie'],[C.red,'Usunięty (wgięcie)'],[C.green,'W stosie'],[C.gray,'Wewnętrzny']].map(([col,lbl])=>(
          <span key={lbl} style={{display:'flex',alignItems:'center',gap:4}}>
            <span style={{width:10,height:10,borderRadius:'50%',background:col,display:'inline-block'}}/>
            <span style={{color:C.gray}}>{lbl}</span>
          </span>
        ))}
      </div>
      <Box text={cs.desc} color={si===steps.length-1?C.green:undefined}/>
      <Ctrl step={si} max={steps.length} onChange={setSi}/>
    </div>
  );
}

// ═══════════════════════════════ M3 RMQ ═══════════════════════════════
function M3(){
  const vals=[3,7,5,2,9,6];
  const T={
    1:{val:9,idx:4,s:0,e:5}, 2:{val:7,idx:1,s:0,e:2}, 3:{val:9,idx:4,s:3,e:5},
    4:{val:7,idx:1,s:0,e:1}, 5:{val:5,idx:2,s:2,e:2}, 6:{val:9,idx:4,s:3,e:4},
    7:{val:6,idx:5,s:5,e:5}, 8:{val:3,idx:0,s:0,e:0}, 9:{val:7,idx:1,s:1,e:1},
    12:{val:2,idx:3,s:3,e:3},13:{val:9,idx:4,s:4,e:4},
  };
  const CH={1:[2,3],2:[4,5],3:[6,7],4:[8,9],6:[12,13]};
  const pos={
    1:{x:330,y:42}, 2:{x:170,y:112}, 3:{x:490,y:112},
    4:{x:88,y:182}, 5:{x:252,y:182}, 6:{x:408,y:182}, 7:{x:572,y:182},
    8:{x:48,y:252}, 9:{x:128,y:252}, 12:{x:368,y:252}, 13:{x:448,y:252},
  };
  const steps=[
    {active:[],q:{},phase:'intro',
     title:'Tablica głośności dekametrowców',
     desc:`Głośności wzdłuż muru: [${vals.join(', ')}]. Cel: szybko odpowiadać „kto najgłośniejszy na odcinku [l, r]?" — w czasie O(log n), nie O(n).`},
    {active:[8,9,5,12,13,7],q:{},phase:'build',title:'Krok 1: Liście = wartości',
     desc:'Na dole drzewa kładziemy wszystkie wartości z tablicy — po jednej w każdym liściu.'},
    {active:[1,2,3,4,6],q:{},phase:'build',title:'Krok 2: Węzły = maksimum dzieci',
     desc:'Każdy węzeł wyżej trzyma maksimum swoich dzieci. Korzeń [0,5] trzyma max całości = 9. Drzewo gotowe.'},
    {active:[1],q:{},phase:'qStart',title:'⚔️ Atak na odcinek [2,4]!',
     desc:'Pytamy: kto najgłośniejszy na pozycjach 2, 3, 4? Uruchamiamy zapytanie na drzewie.'},
    {active:[1],q:{1:'partial'},phase:'query',title:'Korzeń [0,5] — częściowe pokrycie',
     desc:'Korzeń obejmuje za dużo (0–5), a my chcemy tylko 2–4. Więc schodzimy do dzieci.'},
    {active:[4,5],q:{1:'partial',2:'partial',4:'skip',5:'hit'},phase:'query',title:'Lewa strona',
     desc:'[0,1] jest poza naszym zakresem — pomijamy (oszczędzamy czas). [2,2] jest w środku — bierzemy jego wynik: 5.'},
    {active:[6,7],q:{1:'partial',2:'combine',3:'partial',4:'skip',5:'hit',6:'hit',7:'skip'},phase:'query',title:'Prawa strona',
     desc:'[3,4] jest w całości w zakresie — bierzemy jego wynik: 9. [5,5] poza zakresem — pomijamy.'},
    {active:[1,2,3,5,6],q:{1:'done',2:'combine',3:'combine',4:'skip',5:'hit',6:'hit',7:'skip'},phase:'done',
     title:'✅ Wynik: 9 (pozycja 4)',
     desc:'Łączymy znalezione kawałki: max(5, 9) = 9. Najgłośniejszy na [2,4] stoi na pozycji 4. Odwiedziliśmy tylko kilka węzłów zamiast całego odcinka.'},
  ];
  const [si,setSi]=useState(0);
  useKeyNav(setSi,steps.length);
  const cs=steps[si];
  const getFill=id=>{
    const st=cs.q[id];
    if(st==='hit') return C.green;
    if(st==='skip') return '#111133';
    if(st==='partial') return C.accent+'55';
    if(st==='combine') return C.gold+'55';
    if(st==='done') return C.green+'88';
    if(cs.active.includes(id)&&(cs.phase==='build'||cs.phase==='qStart')) return C.gold+'55';
    return C.card;
  };
  const getStroke=id=>{
    const st=cs.q[id];
    if(st==='hit'||st==='done') return C.green;
    if(st==='skip') return '#222244';
    if(st==='partial') return C.accent;
    if(st==='combine') return C.gold;
    if(cs.active.includes(id)&&cs.phase==='build') return C.gold;
    return '#222244';
  };
  return(
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:12}}>
      <h3 style={{color:C.red,margin:0,fontSize:16}}>{cs.title}</h3>
      <div style={{display:'flex',gap:5,alignItems:'center'}}>
        {vals.map((v,i)=>{
          const inQ=i>=2&&i<=4;
          const isAns=cs.phase==='done'&&i===4;
          return(
            <div key={i} style={{
              width:54,height:54,display:'flex',flexDirection:'column',
              alignItems:'center',justifyContent:'center',
              background:isAns?C.green+'33':inQ&&cs.phase!=='intro'&&cs.phase!=='build'?C.red+'18':C.card,
              border:`2px solid ${isAns?C.green:inQ&&(cs.phase==='query'||cs.phase==='done'||cs.phase==='qStart')?C.red:'#222244'}`,
              borderRadius:8,color:C.white,fontWeight:'bold',fontSize:18,
            }}>
              {v}
              <span style={{fontSize:11,color:C.gray}}>[{i}]</span>
            </div>
          );
        })}
        {(cs.phase==='query'||cs.phase==='done'||cs.phase==='qStart')&&(
          <span style={{color:C.accent,fontSize:12,marginLeft:8}}>← zapytanie [2,4]</span>
        )}
      </div>
      <svg width={660} height={302} style={{background:C.panel,borderRadius:12}}>
        {Object.entries(CH).flatMap(([p,kids])=>kids.map(kid=>{
          const pp=pos[p],kp=pos[kid];
          return <line key={`${p}-${kid}`} x1={pp.x} y1={pp.y+23} x2={kp.x} y2={kp.y-23} stroke="#1a1a3a" strokeWidth={1.5}/>;
        }))}
        {Object.entries(pos).map(([nid,p])=>{
          const id=parseInt(nid);
          const n=T[id];
          if(!n) return null;
          const isLeaf=n.s===n.e;
          const isSkip=cs.q[id]==='skip';
          return(
            <g key={nid}>
              <title>{`[L:${n.s}, R:${n.e}] → max=${n.val} (idx ${n.idx})`}</title>
              <ellipse cx={p.x} cy={p.y} rx={36} ry={24} fill={getFill(id)} stroke={getStroke(id)} strokeWidth={cs.q[id]?2:1} className="svg-node" style={{cursor:'pointer'}}/>
              <text x={p.x} y={p.y-4} fill={isSkip?C.muted:C.white} fontSize={isLeaf?14:11} textAnchor="middle" fontWeight="bold" style={{pointerEvents:'none'}}>
                {isLeaf?n.val:`max=${n.val}`}
              </text>
              <text x={p.x} y={p.y+13} fill={isSkip?C.muted:C.gray} fontSize={10} textAnchor="middle" style={{pointerEvents:'none'}}>
                [{n.s}{n.s!==n.e?`,${n.e}`:''}]
              </text>
            </g>
          );
        })}
      </svg>
      {(cs.phase==='query'||cs.phase==='done')&&(
        <div style={{display:'flex',gap:12,fontSize:12}}>
          {[[C.accent+'55','Częściowe'],[C.green,'Trafiony'],[C.gold+'55','Łączący'],['#111133','Pominięty']].map(([col,lbl])=>(
            <span key={lbl} style={{display:'flex',alignItems:'center',gap:4}}>
              <span style={{width:10,height:10,borderRadius:'50%',background:col,border:'1px solid #444',display:'inline-block'}}/>
              <span style={{color:C.gray}}>{lbl}</span>
            </span>
          ))}
        </div>
      )}
      <Box text={cs.desc} color={cs.phase==='done'?C.green:undefined}/>
      <Ctrl step={si} max={steps.length} onChange={setSi}/>
    </div>
  );
}

// ═══════════════════════════════ M4 HUFFMAN ═══════════════════════════════
function M4Steps(){
  const steps=[
    {title:'Zliczamy częstości liter',
     desc:'Tekst "aaabbc": a=3, b=2, c=1. Zasada: częstsza litera → krótszy kod. Rzadsza → dłuższy. Jak alfabet Morse\'a: E (najczęstsza) = jedna kropka.',
     nodes:[
       {id:1,x:150,y:270,lbl:'a',sub:'f=3',col:C.gold},
       {id:2,x:320,y:270,lbl:'b',sub:'f=2',col:C.gold},
       {id:3,x:490,y:270,lbl:'c',sub:'f=1',col:C.gold},
     ],edges:[],hl:[]},
    {title:'Kolejka priorytetowa — sortujemy od najrzadszego',
     desc:'Ustawiamy od najrzadszego: c(1) → b(2) → a(3). Zawsze BIERZEMY DWA NAJRZADSZE i łączymy w nowy węzeł.',
     nodes:[
       {id:3,x:150,y:270,lbl:'c',sub:'f=1',col:C.red},
       {id:2,x:320,y:270,lbl:'b',sub:'f=2',col:C.gold},
       {id:1,x:490,y:270,lbl:'a',sub:'f=3',col:C.gold},
     ],edges:[],hl:[3,2]},
    {title:'Łączymy c(1) + b(2) → węzeł(3)',
     desc:'Bierzemy c i b (dwa najrzadsze). Tworzymy węzeł wewnętrzny z f=1+2=3. Wstawiamy go z powrotem. Lewa gałąź=0, prawa=1.',
     nodes:[
       {id:4,x:248,y:148,lbl:'',sub:'f=3',col:C.accent},
       {id:3,x:138,y:270,lbl:'c',sub:'f=1',col:C.gold},
       {id:2,x:358,y:270,lbl:'b',sub:'f=2',col:C.gold},
       {id:1,x:510,y:148,lbl:'a',sub:'f=3',col:C.gold},
     ],edges:[{f:4,t:3,lbl:'0'},{f:4,t:2,lbl:'1'}],hl:[4,3,2]},
    {title:'Łączymy a(3) + węzeł(3) → korzeń(6)',
     desc:'Kolejka: a(3) i węzeł_cb(3). Łączymy w korzeń z f=6. Drzewo gotowe! Liście: a, c, b.',
     nodes:[
       {id:5,x:295,y:42, lbl:'',sub:'f=6',col:C.accent},
       {id:1,x:148,y:152,lbl:'a',sub:'f=3',col:C.gold},
       {id:4,x:442,y:152,lbl:'',sub:'f=3',col:C.accent},
       {id:3,x:330,y:272,lbl:'c',sub:'f=1',col:C.gold},
       {id:2,x:554,y:272,lbl:'b',sub:'f=2',col:C.gold},
     ],edges:[{f:5,t:1,lbl:'0'},{f:5,t:4,lbl:'1'},{f:4,t:3,lbl:'0'},{f:4,t:2,lbl:'1'}],hl:[5,1,4]},
    {title:'✅ Kody Huffmana — i dekodowanie',
     desc:"Ścieżka od korzenia: a→0 (1 bit, NAJKRÓTSZA bo najczęstsza), c→10 (2 bity), b→11 (2 bity). Tekst 'aaabbc' = 000·11·11·10 = 9 bitów zamiast 48 (ASCII). Oszczędność 81%!",
     nodes:[
       {id:5,x:295,y:42, lbl:'',sub:'f=6',col:C.accent},
       {id:1,x:148,y:152,lbl:'a',sub:"'a' → 0",col:C.green},
       {id:4,x:442,y:152,lbl:'',sub:'f=3',col:C.accent},
       {id:3,x:330,y:272,lbl:'c',sub:"'c' → 10",col:C.green},
       {id:2,x:554,y:272,lbl:'b',sub:"'b' → 11",col:C.green},
     ],edges:[{f:5,t:1,lbl:'0'},{f:5,t:4,lbl:'1'},{f:4,t:3,lbl:'0'},{f:4,t:2,lbl:'1'}],hl:[]},
  ];
  const [si,setSi]=useState(0);
  useKeyNav(setSi,steps.length);
  const cs=steps[si];
  const nm={};
  cs.nodes.forEach(n=>nm[n.id]=n);
  return(
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:14}}>
      <h3 style={{color:C.green,margin:0,fontSize:16}}>{cs.title}</h3>
      <svg width={660} height={345} style={{background:C.panel,borderRadius:12}}>
        <defs>
          <marker id="hA" markerWidth={8} markerHeight={6} refX={7} refY={3} orient="auto">
            <polygon points="0 0,8 3,0 6" fill="#444466"/>
          </marker>
        </defs>
        {cs.edges.map(e=>{
          const f=nm[e.f],t=nm[e.t];
          if(!f||!t) return null;
          const dx=t.x-f.x,dy=t.y-f.y,L=Math.sqrt(dx*dx+dy*dy),r=31;
          return(
            <g key={`${e.f}-${e.t}`}>
              <line x1={f.x+dx/L*r} y1={f.y+dy/L*r} x2={t.x-dx/L*r} y2={t.y-dy/L*r}
                stroke="#444466" strokeWidth={2} markerEnd="url(#hA)"/>
              <rect x={(f.x+t.x)/2-13} y={(f.y+t.y)/2-12} width={26} height={20} rx={5} fill={C.card2}/>
              <text x={(f.x+t.x)/2} y={(f.y+t.y)/2+5} fill={C.accent} fontSize={15} textAnchor="middle" fontWeight="bold">{e.lbl}</text>
            </g>
          );
        })}
        {cs.nodes.map(n=>{
          const isHL=cs.hl.includes(n.id);
          return(
            <g key={n.id}>
              <circle cx={n.x} cy={n.y} r={34} fill={isHL?n.col+'cc':n.col+'33'} stroke={n.col} strokeWidth={isHL?3:1.5} className="svg-node"/>
              <text x={n.x} y={n.y-4} fill={C.white} fontSize={18} textAnchor="middle" fontWeight="bold" style={{pointerEvents:'none'}}>{n.lbl}</text>
              <text x={n.x} y={n.y+16} fill={n.col} fontSize={11} textAnchor="middle" className="svg-fill" style={{pointerEvents:'none'}}>{n.sub}</text>
            </g>
          );
        })}
      </svg>
      {si===steps.length-1&&(
        <div style={{display:'flex',gap:12}}>
          {[["'a'","0","1 bit",C.green,true],["'b'","11","2 bity",C.gold,false],["'c'","10","2 bity",C.gold,false]].map(([ch,code,bits,col,best])=>(
            <div key={ch} style={{background:C.card,borderRadius:10,padding:'10px 18px',textAlign:'center',border:`2px solid ${col}`}}>
              <div style={{fontSize:26,fontWeight:'bold',color:col}}>{ch}</div>
              <div style={{fontSize:22,fontFamily:'monospace',color:C.white,letterSpacing:4}}>{code}</div>
              <div style={{fontSize:11,color:C.gray}}>{bits}</div>
              {best&&<div style={{fontSize:10,color:C.green,marginTop:2}}>najczęstsza→najkrótszy</div>}
            </div>
          ))}
        </div>
      )}
      <Box text={cs.desc} color={si===steps.length-1?C.green:undefined}/>
      <Ctrl step={si} max={steps.length} onChange={setSi}/>
    </div>
  );
}

// ═══════════════════════════════ MODE TOGGLE + SANDBOXES ═══════════════════════════════
function ModeToggle({mode,setMode,col}){
  const opts=[['steps','📖 Krok po kroku'],['sandbox','✏️ Piaskownica']];
  return(
    <div style={{display:'flex',gap:6}}>
      {opts.map(([id,lbl])=>(
        <button key={id} onClick={()=>setMode(id)} style={{
          background:mode===id?col+'26':C.card, color:mode===id?col:C.gray,
          border:`1.5px solid ${mode===id?col:'#22224a'}`, borderRadius:8,
          padding:'5px 14px', cursor:'pointer', fontFamily:'inherit', fontSize:12.5,
          fontWeight:mode===id?'bold':'normal',
        }}>{lbl}</button>
      ))}
    </div>
  );
}

// ── M2 sandbox: click to add mines, hull recomputes live ──
function M2Sandbox(){
  const sc=58, ox=42, svgH=388, oy=46, GMAX=6, SVGW=440;
  const px=x=>ox+x*sc, py=y=>svgH-oy-y*sc;
  const [pts,setPts]=useState([{x:1,y:1},{x:5,y:1},{x:5,y:5},{x:1,y:5},{x:3,y:3}]);

  const cross=(O,A,B)=>(A.x-O.x)*(B.y-O.y)-(A.y-O.y)*(B.x-O.x);
  function hull(P){
    if(P.length<3) return [];
    const p=[...P].sort((a,b)=>a.x!==b.x?a.x-b.x:a.y-b.y);
    const lo=[];
    for(const q of p){ while(lo.length>=2&&cross(lo[lo.length-2],lo[lo.length-1],q)<=0) lo.pop(); lo.push(q); }
    const up=[];
    for(let i=p.length-1;i>=0;i--){ const q=p[i]; while(up.length>=2&&cross(up[up.length-2],up[up.length-1],q)<=0) up.pop(); up.push(q); }
    return [...lo.slice(0,-1),...up.slice(0,-1)];
  }
  const h=hull(pts);
  const perim=h.reduce((s,p,i)=>{const q=h[(i+1)%h.length];return s+Math.hypot(p.x-q.x,p.y-q.y);},0);
  const onHull=p=>h.some(q=>q.x===p.x&&q.y===p.y);

  const addPt=(e)=>{
    const r=e.currentTarget.getBoundingClientRect();
    const sx=(e.clientX-r.left)*(SVGW/r.width);
    const sy=(e.clientY-r.top)*(svgH/r.height);
    const gx=Math.round((sx-ox)/sc), gy=Math.round((svgH-oy-sy)/sc);
    if(gx<0||gx>GMAX||gy<0||gy>GMAX) return;
    if(pts.some(p=>p.x===gx&&p.y===gy)) return;
    setPts([...pts,{x:gx,y:gy}]);
  };

  return(
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:12}}>
      <h3 style={{color:C.gold,margin:0,fontSize:16}}>Piaskownica — klikaj, by dodać kopalnię</h3>
      <svg width={SVGW} height={svgH} onClick={addPt} style={{background:C.panel,borderRadius:12,cursor:'crosshair'}}>
        {Array.from({length:GMAX+1},(_,i)=>(
          <g key={i}>
            <line x1={px(0)} y1={py(i)} x2={px(GMAX)} y2={py(i)} stroke="#13133a" strokeWidth={1}/>
            <line x1={px(i)} y1={py(0)} x2={px(i)} y2={py(GMAX)} stroke="#13133a" strokeWidth={1}/>
          </g>
        ))}
        {h.length>2&&(
          <polygon points={h.map(p=>`${px(p.x)},${py(p.y)}`).join(' ')}
            fill={C.accent+'1a'} stroke={C.accent} strokeWidth={2.5} className="svg-fill"/>
        )}
        {pts.map((p,i)=>{
          const hl=onHull(p);
          return(
            <circle key={i} cx={px(p.x)} cy={py(p.y)} r={hl?9:6}
              fill={hl?C.accent:C.gray} className="svg-node" style={{pointerEvents:'none'}}/>
          );
        })}
      </svg>
      <div style={{display:'flex',gap:18,fontSize:13,color:C.gray,alignItems:'center'}}>
        <span><b style={{color:C.white}}>{pts.length}</b> kopalni</span>
        <span>narożniki trasy: <b style={{color:C.accent}}>{h.length}</b></span>
        <span>obwód: <b style={{color:C.gold}}>{perim.toFixed(1)}</b></span>
        <button onClick={()=>setPts([])} style={{...btn,fontSize:12,padding:'4px 12px',border:`1px solid ${C.muted}`}}>Wyczyść</button>
      </div>
      <Box color={C.gold} text="Otoczka (algorytm Andrew) przelicza się natychmiast po każdym kliknięciu. Punkty wewnątrz są ignorowane — zostają szare. Działa dla dowolnego układu kopalni."/>
    </div>
  );
}

// ── M4 sandbox: type any text, Huffman codes + compression live ──
function M4Sandbox(){
  const [text,setText]=useState('krasnoludki');
  function huff(str){
    if(!str) return {codes:{},freq:{},bits:0};
    const freq={}; for(const c of str) freq[c]=(freq[c]||0)+1;
    const ent=Object.entries(freq);
    if(ent.length===1) return {codes:{[ent[0][0]]:'0'},freq,bits:str.length};
    let nodes=ent.map(([ch,f])=>({ch,f,l:null,r:null}));
    while(nodes.length>1){
      nodes.sort((a,b)=>a.f-b.f);
      const a=nodes.shift(),b=nodes.shift();
      nodes.push({ch:null,f:a.f+b.f,l:a,r:b});
    }
    const codes={};
    (function w(n,c){ if(n.ch!==null){codes[n.ch]=c||'0';return;} w(n.l,c+'0'); w(n.r,c+'1'); })(nodes[0],'');
    let bits=0; for(const c of str) bits+=codes[c].length;
    return {codes,freq,bits};
  }
  const {codes,freq,bits}=huff(text);
  const ascii=text.length*8;
  const saving=ascii>0?Math.round((1-bits/ascii)*100):0;
  const rows=Object.keys(freq).sort((a,b)=>freq[b]-freq[a]);
  const show=c=>c===' '?'␣':c==='\n'?'⏎':c;

  return(
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:14,width:'100%',maxWidth:620}}>
      <h3 style={{color:C.green,margin:0,fontSize:16}}>Piaskownica — wpisz dowolny tekst</h3>
      <input value={text} onChange={e=>setText(e.target.value)} maxLength={60}
        placeholder="wpisz tekst..." style={{
          width:'100%',maxWidth:480,background:C.panel,color:C.white,
          border:`1.5px solid ${C.green}66`,borderRadius:9,padding:'10px 14px',
          fontSize:15,fontFamily:'inherit',outline:'none',textAlign:'center'}}/>
      {text && <>
        <div style={{display:'flex',gap:10,alignItems:'stretch'}}>
          <div style={{background:C.card,borderRadius:10,padding:'10px 18px',textAlign:'center',border:`1px solid ${C.muted}44`}}>
            <div style={{fontSize:11,color:C.gray}}>ASCII (8 bitów/znak)</div>
            <div style={{fontSize:24,fontWeight:'bold',color:C.gray}}>{ascii} bit</div>
          </div>
          <div style={{display:'flex',alignItems:'center',color:C.muted,fontSize:20}}>→</div>
          <div style={{background:C.card,borderRadius:10,padding:'10px 18px',textAlign:'center',border:`1px solid ${C.green}`}}>
            <div style={{fontSize:11,color:C.gray}}>Huffman</div>
            <div style={{fontSize:24,fontWeight:'bold',color:C.green}}>{bits} bit</div>
          </div>
          <div style={{background:C.green+'1f',borderRadius:10,padding:'10px 18px',textAlign:'center',border:`1px solid ${C.green}`,display:'flex',flexDirection:'column',justifyContent:'center'}}>
            <div style={{fontSize:11,color:C.gray}}>oszczędność</div>
            <div style={{fontSize:24,fontWeight:'bold',color:C.green}}>{saving>=0?'−':'+'}{Math.abs(saving)}%</div>
          </div>
        </div>
        <div style={{display:'flex',flexWrap:'wrap',gap:7,justifyContent:'center',maxWidth:600}}>
          {rows.map(c=>(
            <div key={c} style={{background:C.card,borderRadius:8,padding:'6px 10px',textAlign:'center',border:`1px solid #22224a`,minWidth:54}}>
              <div style={{fontSize:16,fontWeight:'bold',color:C.white}}>{show(c)}</div>
              <div style={{fontSize:10,color:C.gray}}>×{freq[c]}</div>
              <div style={{fontSize:13,fontFamily:'monospace',color:C.green,letterSpacing:1}}>{codes[c]}</div>
            </div>
          ))}
        </div>
        <Box color={C.green} text={rows.length===1
          ? 'Jeden unikalny znak → kod "0" (przypadek brzegowy). Dodaj różne znaki, by zobaczyć drzewo.'
          : 'Drzewo Huffmana budowane na żywo z Twojego tekstu. Najczęstszy znak dostaje najkrótszy kod — stąd oszczędność.'}/>
      </>}
    </div>
  );
}

// ── wrappers with mode switch ──
function M2(){
  const [mode,setMode]=useState('steps');
  return(
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:14}}>
      <ModeToggle mode={mode} setMode={setMode} col={C.gold}/>
      {mode==='steps'?<M2Steps/>:<M2Sandbox/>}
    </div>
  );
}
function M4(){
  const [mode,setMode]=useState('steps');
  return(
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:14}}>
      <ModeToggle mode={mode} setMode={setMode} col={C.green}/>
      {mode==='steps'?<M4Steps/>:<M4Sandbox/>}
    </div>
  );
}

// ═══════════════════════════════ APP ═══════════════════════════════
function VizApp(){
  const [tab,setTab]=useState('m1');
  const tabs=[
    {id:'m1',lbl:'M1 · Dyspozytor (MCMF)',   col:C.accent},
    {id:'m2',lbl:'M2 · Gumka (Otoczka)',       col:C.gold},
    {id:'m3',lbl:'M3 · Turniej (RMQ)',         col:C.red},
    {id:'m4',lbl:'M4 · Morse (Huffman)',       col:C.green},
  ];
  return(
    <div style={{minHeight:'100vh',background:C.bg,color:C.white,fontFamily:"Georgia,serif"}}>
      <style>{FX}</style>
      <div style={{background:C.card,padding:'13px 20px',borderBottom:'2px solid #111133',textAlign:'center'}}>
        <div style={{fontSize:11,letterSpacing:4,color:C.muted,textTransform:'uppercase',marginBottom:4}}>Algorytmy i Struktury Danych II — 2026</div>
        <h2 style={{margin:0,fontSize:18,fontFamily:'Georgia,serif',letterSpacing:1}}>🏰 Królestwo Krasnoludków — Wizualizacja Algorytmów</h2>
        <div style={{fontSize:11,color:C.muted,marginTop:5}}>Sterowanie: <b style={{color:C.gray}}>→</b> / <b style={{color:C.gray}}>spacja</b> — dalej · <b style={{color:C.gray}}>←</b> — wstecz · najedź na węzeł, by zobaczyć szczegóły</div>
      </div>
      <div style={{display:'flex',justifyContent:'center',gap:5,padding:'12px',background:C.bg,borderBottom:'1px solid #111133',flexWrap:'wrap',position:'sticky',top:0,zIndex:10}}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{
            ...btn,
            background:tab===t.id?t.col+'28':C.card,
            border:`2px solid ${tab===t.id?t.col:'#1a1a3a'}`,
            color:tab===t.id?t.col:C.gray,
            fontWeight:tab===t.id?'bold':'normal',
            fontSize:13,padding:'8px 16px',
            fontFamily:'Georgia,serif',
          }}>{t.lbl}</button>
        ))}
      </div>
      <div style={{padding:'22px 16px',display:'flex',justifyContent:'center'}}>
        {tab==='m1'&&<M1/>}
        {tab==='m2'&&<M2/>}
        {tab==='m3'&&<M3/>}
        {tab==='m4'&&<M4/>}
      </div>
    </div>
  );
}


// ─────────────────────────── TRYB 2: GRA ───────────────────────────

const CG = {
  bg:'#15152b', card:'#1f2547', card2:'#161a35', panel:'#0c0c1e',
  accent:'#00D9FF', gold:'#FFD700', red:'#FF6B6B', green:'#50C878',
  white:'#FFFFFF', gray:'#A8AABF', muted:'#5a5c7a', amber:'#FFA94D',
};

const btnG = {
  background:CG.card, color:CG.white, border:`1.5px solid ${CG.accent}55`,
  borderRadius:9, padding:'9px 22px', cursor:'pointer', fontSize:14,
  fontFamily:'inherit', fontWeight:'bold',
};

// ── Fixed scenario (numbers flow through the pipeline) ──
const MINES = [
  {id:'zloto',  name:'Złoto',    x:1, y:5, color:CG.gold},
  {id:'wegiel', name:'Węgiel',   x:5, y:5, color:'#8B7355'},
  {id:'zelazo', name:'Żelazo',   x:5, y:1, color:'#B0B0C0'},
  {id:'diament',name:'Diament',  x:1, y:1, color:CG.accent},
  {id:'szmaragd',name:'Szmaragd',x:3, y:3, color:CG.green},
];
const DWARVES = [
  {name:'Gimli',  mine:'diament'},
  {name:'Thorin', mine:'zelazo'},
  {name:'Balin',  mine:'wegiel'},
  {name:'Dwalin', mine:'zloto'},
  {name:'Óin',    mine:'szmaragd'},
];
// hull of active mines = 4 corners; szmaragd (3,3) is interior
const HULL = [{x:1,y:1},{x:5,y:1},{x:5,y:5},{x:1,y:5}];
// guards along the wall perimeter, with volumes
const GUARDS = [
  {pos:0, x:1, y:1, vol:3},
  {pos:1, x:5, y:1, vol:7},
  {pos:2, x:5, y:3, vol:5},
  {pos:3, x:5, y:5, vol:2},
  {pos:4, x:3, y:5, vol:9},
  {pos:5, x:1, y:5, vol:6},
];

// ── shared map projection ──
const SC=58, OX=46, MAPH=360, OY=42;
const mx = x => OX + x*SC;
const my = y => MAPH - OY - y*SC;

// manual stepper: advance frame-by-frame (full control of pace during defence)
function useAuto(n, speed){
  const [step,setStep]=useState(-1);
  return {
    step, started:step>=0, done:step>=n-1,
    start:()=>setStep(0),
    next:()=>setStep(s=>Math.min(n-1,s+1)),
    prev:()=>setStep(s=>Math.max(0,s-1)),
    replay:()=>setStep(0),
    reset:()=>setStep(-1),
  };
}

// → / Space: pokaż następny krok; gdy ostatni — przejdź do kolejnego etapu. ← = krok wstecz.
function useStageKeys(a, onAdvance){
  useEffect(()=>{
    const h=(e)=>{
      if(e.key==='ArrowRight'||e.key===' '){
        e.preventDefault();
        if(!a.started) a.start();
        else if(!a.done) a.next();
        else if(onAdvance) onAdvance();
      } else if(e.key==='ArrowLeft'){
        e.preventDefault();
        if(a.started) a.prev();
      }
    };
    window.addEventListener('keydown',h);
    return ()=>window.removeEventListener('keydown',h);
  });
}

// step controls shown inside a running stage
function StepBar({a,total,col}){
  if(!a.started) return null;
  const b={background:CG.card,color:CG.white,border:`1px solid ${col}55`,borderRadius:7,
    padding:'4px 12px',cursor:'pointer',fontFamily:'inherit',fontSize:13};
  return(
    <div style={{display:'flex',gap:10,alignItems:'center'}}>
      <button onClick={a.prev} disabled={a.step<=0} style={{...b,opacity:a.step<=0?0.4:1}}>◀</button>
      <span style={{color:CG.gray,fontSize:13,minWidth:80,textAlign:'center'}}>krok {a.step+1} / {total}</span>
      <button onClick={a.next} disabled={a.done} style={{...b,opacity:a.done?0.4:1}}>▶</button>
    </div>
  );
}

const FXG = `
  @keyframes march { to { stroke-dashoffset: -18; } }
  .flow { stroke-dasharray: 6 4; animation: march 0.6s linear infinite; }
  .node { transition: fill .4s ease, stroke .4s ease, opacity .4s ease, r .35s ease; }
  .edge { transition: stroke .4s ease, opacity .4s ease; }
`;

function Grid(){
  return [0,1,2,3,4,5,6].map(i=>(
    <g key={i}>
      <line x1={mx(0)} y1={my(i)} x2={mx(6)} y2={my(i)} stroke="#1c1c40" strokeWidth={1}/>
      <line x1={mx(i)} y1={my(0)} x2={mx(i)} y2={my(6)} stroke="#1c1c40" strokeWidth={1}/>
    </g>
  ));
}

function BoxG({text,color}){
  return <div style={{background:CG.card,borderRadius:10,padding:'12px 22px',maxWidth:600,
    textAlign:'center',color:CG.white,fontSize:14.5,lineHeight:1.6,
    border:`1px solid ${(color||CG.accent)+'44'}`}}>{text}</div>;
}

function RunBtn({label,onClick,color}){
  return <button onClick={onClick} style={{...btnG,
    border:`2px solid ${color}`,background:color+'22',color}}>{label}</button>;
}

// ═══════════════ STAGE 1 — MCMF ═══════════════
function Stage1({onDone,onAdvance}){
  const a=useAuto(DWARVES.length+1, 850);
  useStageKeys(a,onAdvance);
  useEffect(()=>{ if(a.done) onDone(); },[a.done]);
  const assignedCount = a.started ? Math.min(a.step, DWARVES.length) : 0;
  const isActive = id => DWARVES.slice(0,assignedCount).some(d=>d.mine===id);

  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:16}}>
      <svg width={520} height={MAPH} style={{background:CG.panel,borderRadius:12}}>
        <Grid/>
        {/* dwarves waiting on the left */}
        {DWARVES.map((d,i)=>{
          const done = i < assignedCount;
          return (
            <g key={d.name} opacity={done?0.25:1} style={{transition:'opacity .4s ease'}}>
              <circle cx={mx(6)+78} cy={62+i*56} r={20} fill={CG.card} stroke={CG.gold} strokeWidth={1.5}/>
              <text x={mx(6)+78} y={62+i*56+4} fill={CG.white} fontSize={10} textAnchor="middle" fontWeight="bold">{d.name}</text>
            </g>
          );
        })}
        {/* assignment lines — marching-ants flow */}
        {DWARVES.slice(0,assignedCount).map(d=>{
          const m=MINES.find(x=>x.id===d.mine);
          const i=DWARVES.indexOf(d);
          return <line key={d.name} x1={mx(6)+58} y1={62+i*56} x2={mx(m.x)} y2={my(m.y)}
            stroke={CG.green} strokeWidth={2.5} opacity={0.85} className="flow"/>;
        })}
        {/* mines */}
        {MINES.map(m=>{
          const act=isActive(m.id);
          return (
            <g key={m.id}>
              <circle cx={mx(m.x)} cy={my(m.y)} r={26}
                fill={act?m.color:CG.card} stroke={m.color} strokeWidth={act?3:1.5}
                opacity={act?1:0.55} className="node"/>
              <text x={mx(m.x)} y={my(m.y)-1} fill={act?'#1a1a2e':CG.white} fontSize={10.5}
                textAnchor="middle" fontWeight="bold" style={{pointerEvents:'none'}}>{m.name}</text>
              <text x={mx(m.x)} y={my(m.y)+11} fill={act?'#1a1a2e':CG.gray} fontSize={8.5}
                textAnchor="middle" style={{pointerEvents:'none'}}>({m.x},{m.y})</text>
            </g>
          );
        })}
        <text x={mx(6)+78} y={28} fill={CG.gold} fontSize={11} textAnchor="middle">Górnicy</text>
      </svg>

      {!a.started
        ? <RunBtn label="⛏️ Uruchom Dyspozytora (MCMF)" onClick={a.start} color={CG.accent}/>
        : <BoxG color={a.done?CG.green:CG.accent} text={
            a.done
            ? `✅ Wszyscy przydzieleni! 5 kopalni AKTYWNYCH. Ich współrzędne (1,5),(5,5),(5,1),(1,1),(3,3) → idą do Etapu 2.`
            : `Dyspozytor pcha przepływ... przydzielono ${assignedCount}/5 krasnali. Każdy do kopalni minimalizującej koszt (odległość).`
          }/>}
      <StepBar a={a} total={DWARVES.length+1} col={CG.accent}/>
      {a.done && <button onClick={a.reset} style={{...btnG,fontSize:12,padding:'5px 14px',border:`1px solid ${CG.muted}`}}>↻ Od nowa</button>}
    </div>
  );
}

// ═══════════════ STAGE 2 — CONVEX HULL ═══════════════
function Stage2({onDone,onAdvance}){
  const frames=[
    {hull:[], note:'5 aktywnych kopalni z Etapu 1. Naciągamy gumkę wokół nich.'},
    {hull:[], sort:true, note:'Sortujemy punkty od lewej do prawej (cyfry = kolejność).'},
    {hull:[{x:1,y:1},{x:5,y:1},{x:5,y:5}], note:'Dolna + prawa krawędź. Szmaragd (3,3) ignorowany — tworzy wgięcie.'},
    {hull:HULL, note:'Górna + lewa krawędź. Gumka zamknięta.'},
    {hull:HULL, done:true, note:'✅ Trasa patrolu = 4 narożniki, obwód 16. Szmaragd (3,3) WEWNĄTRZ — chroniony, patrol tam nie zajeżdża!'},
  ];
  const a=useAuto(frames.length, 1100);
  useStageKeys(a,onAdvance);
  useEffect(()=>{ if(a.done) onDone(); },[a.done]);
  const f = frames[Math.max(0,a.step)];
  const sorted=[...MINES].sort((p,q)=>p.x!==q.x?p.x-q.x:p.y-q.y);

  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:16}}>
      <svg width={440} height={MAPH} style={{background:CG.panel,borderRadius:12}}>
        <Grid/>
        {f.hull.length>2&&(
          <polygon points={f.hull.map(p=>`${mx(p.x)},${my(p.y)}`).join(' ')}
            fill={CG.accent+'1f'} stroke={CG.accent} strokeWidth={2.5} className="edge"/>
        )}
        {f.hull.length===3&&(
          <polyline points={f.hull.map(p=>`${mx(p.x)},${my(p.y)}`).join(' ')}
            fill="none" stroke={CG.gold} strokeWidth={2.5} strokeDasharray="6 3"/>
        )}
        {MINES.map(m=>{
          const onHull=f.hull.some(h=>h.x===m.x&&h.y===m.y);
          const interior=f.done&&m.id==='szmaragd';
          const col=interior?CG.red:onHull?CG.accent:m.color;
          return (
            <g key={m.id}>
              <circle cx={mx(m.x)} cy={my(m.y)} r={interior?20:24} fill={col} stroke={col} strokeWidth={2} className="node"/>
              <text x={mx(m.x)} y={my(m.y)-1} fill="#1a1a2e" fontSize={10} textAnchor="middle" fontWeight="bold" style={{pointerEvents:'none'}}>{m.name}</text>
              <text x={mx(m.x)} y={my(m.y)+11} fill="#1a1a2e" fontSize={8.5} textAnchor="middle" style={{pointerEvents:'none'}}>({m.x},{m.y})</text>
              {f.sort&&<text x={mx(m.x)+26} y={my(m.y)-22} fill={CG.gold} fontSize={14} fontWeight="bold">{sorted.indexOf(m)+1}</text>}
              {interior&&<text x={mx(m.x)} y={my(m.y)+34} fill={CG.red} fontSize={9.5} textAnchor="middle">wewnątrz ✓</text>}
            </g>
          );
        })}
      </svg>

      {!a.started
        ? <RunBtn label="🪢 Naciągnij gumkę (Otoczka wypukła)" onClick={a.start} color={CG.gold}/>
        : <BoxG color={f.done?CG.green:CG.gold} text={f.note}/>}
      <StepBar a={a} total={frames.length} col={CG.gold}/>
      {a.done && <button onClick={a.reset} style={{...btnG,fontSize:12,padding:'5px 14px',border:`1px solid ${CG.muted}`}}>↻ Od nowa</button>}
    </div>
  );
}

// ═══════════════ STAGE 3 — RMQ ═══════════════
function Stage3({onDone,onAdvance}){
  // section [2,4] of guards → loudest is pos 4, vol 9
  const frames=[
    {hi:[], note:'Strażnicy (dekametrowce) stoją wzdłuż muru, każdy ma głośność.'},
    {atk:true, hi:[], note:'⚔️ Wróg atakuje odcinek muru [2,4]! Kto krzyknie najgłośniej i wezwie posiłki?'},
    {atk:true, hi:[2], note:'Drzewo RMQ sprawdza strażnika 2 (głośność 5)...'},
    {atk:true, hi:[2,3], note:'...strażnika 3 (głośność 2)...'},
    {atk:true, hi:[2,3,4], note:'...strażnika 4 (głośność 9). Najgłośniejszy!'},
    {atk:true, hi:[4], win:true, note:'✅ Dowódca = strażnik 4 (głośność 9, pozycja 4). Alarm! Posiłki nadciągają — atak odparty!'},
  ];
  const a=useAuto(frames.length, 1050);
  useStageKeys(a,onAdvance);
  useEffect(()=>{ if(a.done) onDone(); },[a.done]);
  const f=frames[Math.max(0,a.step)];

  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:16}}>
      <svg width={440} height={MAPH} style={{background:CG.panel,borderRadius:12}}>
        <Grid/>
        <polygon points={HULL.map(p=>`${mx(p.x)},${my(p.y)}`).join(' ')}
          fill={CG.accent+'12'} stroke={CG.accent+'88'} strokeWidth={2}/>
        {GUARDS.map(g=>{
          const inAtk=f.atk&&g.pos>=2&&g.pos<=4;
          const hl=f.hi.includes(g.pos);
          const isWin=f.win&&g.pos===4;
          const col=isWin?CG.green:hl?CG.gold:inAtk?CG.red:CG.card;
          return (
            <g key={g.pos}>
              <circle cx={mx(g.x)} cy={my(g.y)} r={20}
                fill={col} stroke={isWin?CG.green:inAtk?CG.red:CG.muted} strokeWidth={hl||isWin?3:1.5} className="node"/>
              <text x={mx(g.x)} y={my(g.y)-1} fill={col===CG.card?CG.white:'#1a1a2e'} fontSize={13} textAnchor="middle" fontWeight="bold" style={{pointerEvents:'none'}}>{g.vol}</text>
              <text x={mx(g.x)} y={my(g.y)+11} fill={col===CG.card?CG.gray:'#1a1a2e'} fontSize={8.5} textAnchor="middle" style={{pointerEvents:'none'}}>[{g.pos}]</text>
              {isWin&&<text x={mx(g.x)} y={my(g.y)-28} fill={CG.green} fontSize={11} textAnchor="middle" fontWeight="bold">📢 DOWÓDCA</text>}
            </g>
          );
        })}
      </svg>

      {!a.started
        ? <RunBtn label="📢 Znajdź dowódcę (Drzewo RMQ)" onClick={a.start} color={CG.red}/>
        : <BoxG color={f.win?CG.green:CG.red} text={f.note}/>}
      <StepBar a={a} total={frames.length} col={CG.red}/>
      {a.done && <button onClick={a.reset} style={{...btnG,fontSize:12,padding:'5px 14px',border:`1px solid ${CG.muted}`}}>↻ Od nowa</button>}
    </div>
  );
}

// ═══════════════ STAGE 4 — HUFFMAN ═══════════════
function Stage4({onDone,onAdvance}){
  const frames=[
    {note:'Kronikarz spisuje dzień. Trzeba zapisać kronikę oszczędnie w archiwum.'},
    {freq:true, note:'Liczymy częstości znaków. Częstszy znak → krótszy kod.'},
    {tree:true, note:'Budujemy drzewo: łączymy dwa najrzadsze, aż zostanie korzeń.'},
    {tree:true, codes:true, note:'Czytamy kody ze ścieżek: a→0, c→10, b→11.'},
    {tree:true, codes:true, done:true, note:'✅ Kronika "aaabbc": 9 bitów zamiast 48. Oszczędność 81% miejsca w archiwum!'},
  ];
  const a=useAuto(frames.length, 1100);
  useStageKeys(a,onAdvance);
  useEffect(()=>{ if(a.done) onDone(); },[a.done]);
  const f=frames[Math.max(0,a.step)];
  const N={
    5:{x:220,y:40,lbl:'',sub:'f=6'}, 1:{x:110,y:140,lbl:'a',sub:f.codes?'→0':'f=3'},
    4:{x:330,y:140,lbl:'',sub:'f=3'}, 3:{x:250,y:240,lbl:'c',sub:f.codes?'→10':'f=1'},
    2:{x:410,y:240,lbl:'b',sub:f.codes?'→11':'f=2'},
  };
  const E=[[5,1,'0'],[5,4,'1'],[4,3,'0'],[4,2,'1']];

  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:16}}>
      <svg width={500} height={300} style={{background:CG.panel,borderRadius:12}}>
        {f.freq&&!f.tree&&['a','b','c'].map((ch,i)=>(
          <g key={ch}>
            <rect x={120+i*100} y={120} width={66} height={66} rx={10} fill={CG.card} stroke={CG.gold} strokeWidth={1.5}/>
            <text x={153+i*100} y={150} fill={CG.white} fontSize={22} textAnchor="middle" fontWeight="bold">{ch}</text>
            <text x={153+i*100} y={172} fill={CG.gold} fontSize={12} textAnchor="middle">f={3-i}</text>
          </g>
        ))}
        {f.tree&&<>
          {E.map(([p,c,lbl])=>{
            const a2=N[p],b=N[c];
            const dx=b.x-a2.x,dy=b.y-a2.y,L=Math.hypot(dx,dy),r=30;
            return (
              <g key={`${p}-${c}`}>
                <line x1={a2.x+dx/L*r} y1={a2.y+dy/L*r} x2={b.x-dx/L*r} y2={b.y-dy/L*r} stroke="#444466" strokeWidth={2}/>
                <rect x={(a2.x+b.x)/2-12} y={(a2.y+b.y)/2-11} width={24} height={20} rx={5} fill={CG.card2}/>
                <text x={(a2.x+b.x)/2} y={(a2.y+b.y)/2+4} fill={CG.accent} fontSize={14} textAnchor="middle" fontWeight="bold">{lbl}</text>
              </g>
            );
          })}
          {Object.entries(N).map(([id,n])=>{
            const leaf=n.lbl!=='';
            const col=f.codes&&leaf?CG.green:leaf?CG.gold:CG.accent;
            return (
              <g key={id}>
                <circle cx={n.x} cy={n.y} r={30} fill={col+'33'} stroke={col} strokeWidth={2} className="node"/>
                <text x={n.x} y={n.y-3} fill={CG.white} fontSize={16} textAnchor="middle" fontWeight="bold" style={{pointerEvents:'none'}}>{n.lbl}</text>
                <text x={n.x} y={n.y+14} fill={col} fontSize={11} textAnchor="middle" style={{pointerEvents:'none'}}>{n.sub}</text>
              </g>
            );
          })}
        </>}
      </svg>

      {!a.started
        ? <RunBtn label="📜 Skompresuj kronikę (Huffman)" onClick={a.start} color={CG.green}/>
        : <BoxG color={f.done?CG.green:CG.gray} text={f.note}/>}
      <StepBar a={a} total={frames.length} col={CG.green}/>
      {a.done && <button onClick={a.reset} style={{...btnG,fontSize:12,padding:'5px 14px',border:`1px solid ${CG.muted}`}}>↻ Od nowa</button>}
    </div>
  );
}

// ═══════════════ DASHBOARD ═══════════════
function Dashboard({done}){
  const items=[
    {k:1,icon:'⛏️',lbl:'Górnicy',val:'5/5 przydzielonych',col:CG.accent},
    {k:2,icon:'🛡️',lbl:'Trasa patrolu',val:'obwód = 16',col:CG.gold},
    {k:3,icon:'📢',lbl:'Obrona',val:'dowódca głośność 9',col:CG.red},
    {k:4,icon:'📜',lbl:'Kronika',val:'−81% rozmiaru',col:CG.green},
  ];
  return (
    <div style={{display:'flex',gap:8,justifyContent:'center',flexWrap:'wrap',marginBottom:4}}>
      {items.map(it=>{
        const ok=done[it.k];
        return (
          <div key={it.k} style={{background:ok?it.col+'1a':CG.card2,borderRadius:9,
            padding:'7px 14px',border:`1px solid ${ok?it.col:'#22224a'}`,minWidth:120,
            opacity:ok?1:0.45,transition:'all .3s'}}>
            <div style={{fontSize:11,color:CG.gray}}>{it.icon} {it.lbl}</div>
            <div style={{fontSize:12.5,color:ok?it.col:CG.muted,fontWeight:'bold'}}>{ok?it.val:'— oczekuje —'}</div>
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════ INTRO + FINALE ═══════════════
function Intro({onStart}){
  const road=[
    {t:'☀️ Świt',d:'Przydział górników',a:'MCMF',c:CG.accent},
    {t:'🌤️ Południe',d:'Trasa patrolu',a:'Otoczka',c:CG.gold},
    {t:'⚔️ Popołudnie',d:'Obrona muru',a:'RMQ',c:CG.red},
    {t:'🌙 Wieczór',d:'Spis kroniki',a:'Huffman',c:CG.green},
  ];
  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:22,maxWidth:640,textAlign:'center'}}>
      <div style={{fontSize:15,color:CG.gray,lineHeight:1.7}}>
        Jeden dzień w Królestwie Krasnoludków. Cztery wyzwania, cztery algorytmy —
        a <b style={{color:CG.white}}>wynik każdego staje się wejściem następnego</b>. Zobacz cały pajplajn w akcji.
      </div>
      <div style={{display:'flex',gap:10,flexWrap:'wrap',justifyContent:'center'}}>
        {road.map((r,i)=>(
          <div key={i} style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{background:r.c+'18',border:`1.5px solid ${r.c}`,borderRadius:11,padding:'12px 16px',minWidth:120}}>
              <div style={{fontSize:14,fontWeight:'bold',color:CG.white}}>{r.t}</div>
              <div style={{fontSize:12,color:CG.gray,margin:'3px 0'}}>{r.d}</div>
              <div style={{fontSize:11,color:r.c,fontWeight:'bold'}}>{r.a}</div>
            </div>
            {i<3&&<span style={{color:CG.muted,fontSize:20}}>→</span>}
          </div>
        ))}
      </div>
      <RunBtn label="Rozpocznij dzień ☀️" onClick={onStart} color={CG.gold}/>
    </div>
  );
}

function Finale({onReplay}){
  const flow=[
    {c:CG.accent,a:'M1 · MCMF',out:'5 aktywnych kopalni + ich współrzędne'},
    {c:CG.gold,  a:'M2 · Otoczka',out:'trasa patrolu (4 narożniki, obwód 16)'},
    {c:CG.red,   a:'M3 · RMQ',out:'dowódca obrony (głośność 9, poz. 4)'},
    {c:CG.green, a:'M4 · Huffman',out:'kronika dnia skompresowana −81%'},
  ];
  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:18,maxWidth:640}}>
      <div style={{fontSize:24}}>🏰 Dzień zakończony!</div>
      <div style={{fontSize:14,color:CG.gray,textAlign:'center',lineHeight:1.6}}>
        Tak działa cały pajplajn — wyjście jednego modułu jest wejściem następnego:
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:8,width:'100%',maxWidth:520}}>
        {flow.map((f,i)=>(
          <div key={i}>
            <div style={{background:f.c+'14',border:`1px solid ${f.c}`,borderRadius:10,padding:'11px 16px',display:'flex',justifyContent:'space-between',alignItems:'center',gap:12}}>
              <span style={{color:f.c,fontWeight:'bold',fontSize:13.5,minWidth:110}}>{f.a}</span>
              <span style={{color:CG.white,fontSize:13,textAlign:'right'}}>{f.out}</span>
            </div>
            {i<3&&<div style={{textAlign:'center',color:CG.muted,fontSize:16,margin:'1px 0'}}>↓ podaje dane do</div>}
          </div>
        ))}
      </div>
      <button onClick={onReplay} style={{...btnG,border:`2px solid ${CG.gold}`,background:CG.gold+'22',color:CG.gold}}>↻ Zagraj jeszcze raz</button>
    </div>
  );
}

// ═══════════════ APP ═══════════════
function GameApp(){
  const [stage,setStage]=useState(0);
  const [done,setDone]=useState({1:false,2:false,3:false,4:false});
  const mark=k=>setDone(d=>({...d,[k]:true}));
  const advance=()=>setStage(s=>s<4?s+1:5);

  // App-level keys: tylko Intro/Finale. Na etapach 1–4 klawiszami steruje sam etap (krok w przód/tył).
  useEffect(()=>{
    const h=(e)=>{
      if(stage===0 && (e.key==='ArrowRight'||e.key===' ')){ e.preventDefault(); setStage(1); }
      else if(stage===5 && (e.key==='ArrowRight'||e.key===' ')){ e.preventDefault(); setStage(0); setDone({1:false,2:false,3:false,4:false}); }
    };
    window.addEventListener('keydown',h);
    return ()=>window.removeEventListener('keydown',h);
  },[stage]);

  const stages=[
    {n:1,time:'☀️ Świt',title:'Przydział górników do kopalni',col:CG.accent,
     intro:'Górnicy czekają przy bramie. Dyspozytor (Min-Cost Max-Flow) musi przydzielić każdego do kopalni tak, by zatrudnić jak najwięcej i zminimalizować sumaryczną odległość.',
     comp:<Stage1 onDone={()=>mark(1)} onAdvance={advance}/>},
    {n:2,time:'🌤️ Południe',title:'Wyznaczenie trasy patrolu',col:CG.gold,
     intro:'Kopalnie pracują. Książę musi obejść je murem obronnym po najkrótszej trasie. Otoczka wypukła „naciąga gumkę" na skrajne kopalnie.',
     comp:<Stage2 onDone={()=>mark(2)} onAdvance={advance}/>},
    {n:3,time:'⚔️ Popołudnie',title:'Obrona muru',col:CG.red,
     intro:'Wróg atakuje odcinek muru! Wzdłuż trasy stoją strażnicy o różnej głośności. Drzewo przedziałowe (RMQ) błyskawicznie znajduje najgłośniejszego — on wezwie posiłki.',
     comp:<Stage3 onDone={()=>mark(3)} onAdvance={advance}/>},
    {n:4,time:'🌙 Wieczór',title:'Spis kroniki',col:CG.green,
     intro:'Kronikarz spisuje wydarzenia dnia. Kodowanie Huffmana kompresuje tekst — częstsze znaki dostają krótsze kody.',
     comp:<Stage4 onDone={()=>mark(4)} onAdvance={advance}/>},
  ];
  const cur = stages.find(s=>s.n===stage);
  const canNext = stage>=1 && stage<=4 && done[stage];

  return (
    <div style={{minHeight:'100vh',background:CG.bg,color:CG.white,fontFamily:'Georgia,serif',paddingBottom:30}}>
      <style>{FXG}</style>
      <div style={{background:CG.card,padding:'13px 20px',borderBottom:'2px solid #0d0d22',textAlign:'center'}}>
        <div style={{fontSize:10.5,letterSpacing:3,color:CG.muted,textTransform:'uppercase'}}>Algorytmy i Struktury Danych II — gra edukacyjna</div>
        <h2 style={{margin:'4px 0 0',fontSize:19}}>🏰 Jeden dzień w Królestwie Krasnoludków</h2>
        <div style={{fontSize:11,color:CG.muted,marginTop:5}}>Sterowanie: <b style={{color:CG.gray}}>→</b> / <b style={{color:CG.gray}}>spacja</b> — następny krok (a na końcu etapu — dalej) · <b style={{color:CG.gray}}>←</b> — krok wstecz</div>
      </div>

      {/* progress */}
      {stage>=1 && stage<=4 && (
        <div style={{display:'flex',justifyContent:'center',gap:6,padding:'12px',flexWrap:'wrap'}}>
          {stages.map(s=>(
            <div key={s.n} style={{display:'flex',alignItems:'center',gap:6}}>
              <div style={{padding:'6px 13px',borderRadius:8,fontSize:12.5,fontWeight:'bold',
                background:stage===s.n?s.col+'2a':done[s.n]?s.col+'14':CG.card2,
                border:`1.5px solid ${stage===s.n?s.col:done[s.n]?s.col+'77':'#22224a'}`,
                color:stage===s.n?s.col:done[s.n]?s.col:CG.muted}}>
                {done[s.n]&&stage!==s.n?'✓ ':''}{s.time}
              </div>
              {s.n<4&&<span style={{color:CG.muted}}>→</span>}
            </div>
          ))}
        </div>
      )}

      <div style={{padding:'14px 16px',display:'flex',flexDirection:'column',alignItems:'center',gap:16}}>
        {stage>=1 && stage<=4 && <Dashboard done={done}/>}

        {stage===0 && <Intro onStart={()=>setStage(1)}/>}
        {stage>=1 && stage<=4 && <>
          <h3 style={{color:cur.col,margin:0,fontSize:17,textAlign:'center'}}>{cur.time} — {cur.title}</h3>
          <div style={{maxWidth:620,textAlign:'center',color:CG.gray,fontSize:13.5,lineHeight:1.6}}>{cur.intro}</div>
          {cur.comp}
          {canNext && (
            <button onClick={()=>setStage(stage+1<=4?stage+1:5)} style={{...btnG,
              border:`2px solid ${cur.col}`,background:cur.col+'22',color:cur.col,fontSize:15}}>
              {stage<4?`Dalej → ${stages[stage].time}`:'Zakończ dzień 🌙'}
            </button>
          )}
        </>}
        {stage===5 && <Finale onReplay={()=>{setStage(0);setDone({1:false,2:false,3:false,4:false});}}/>}
      </div>
    </div>
  );
}


// ═══════════════════════════════ ROOT (przełącznik) ═══════════════════════════════
export default function App(){
  const [view,setView]=useState('viz');
  const tabs=[
    {id:'viz', label:'🔬 Wizualizacja algorytmów'},
    {id:'gra', label:'🎮 Gra — cały pajplajn'},
  ];
  return (
    <div style={{minHeight:'100vh',background:'#101023'}}>
      <div style={{display:'flex',justifyContent:'center',gap:8,padding:'10px',
        background:'#0b0b1c',borderBottom:'1px solid #20203c'}}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setView(t.id)} style={{
            background: view===t.id ? '#1f2547' : 'transparent',
            color: view===t.id ? '#FFFFFF' : '#8a8caf',
            border:`1.5px solid ${view===t.id ? '#00D9FF' : '#28284a'}`,
            borderRadius:9, padding:'8px 20px', cursor:'pointer',
            fontFamily:'Georgia,serif', fontSize:14,
            fontWeight: view===t.id ? 'bold':'normal',
          }}>{t.label}</button>
        ))}
      </div>
      {view==='viz' ? <VizApp/> : <GameApp/>}
    </div>
  );
}
