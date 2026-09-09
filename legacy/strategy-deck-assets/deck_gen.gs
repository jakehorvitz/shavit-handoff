/** Shavit Rootman — Marketing & Growth Strategy deck generator. */
var NAVY='#0A2A4A', NAVY2='#13386B', CREAM='#F6F1E7', GOLD='#C9A24A',
    CHAR='#2B2B2B', WHITE='#FFFFFF', LT='#CFD8E3', PHD='#1C2F49', PHL='#E2D8C4';
var HEAD='Lora', BODY='Roboto';
var W=720, H=405, MX=54;

function buildDeck(){
  var p=SlidesApp.create('Shavit Rootman — Marketing & Growth Strategy');
  var slides=p.getSlides();
  // remove default slide content; reuse first, add rest
  var s=[]; s.push(slides[0]);
  for(var i=1;i<16;i++){ s.push(p.appendSlide(SlidesApp.PredefinedLayout.BLANK)); }
  for(var j=0;j<s.length;j++){ clear(s[j]); }

  // 1 TITLE (navy)
  bg(s[0],NAVY);
  eyebrow(s[0],'MARKETING & GROWTH STRATEGY',MX,60);
  line(s[0],MX,92,90);
  txt(s[0],'Shavit Rootman',MX,104,440,70,42,WHITE,HEAD,true);
  txt(s[0],'Building long-term housing in overlooked Midwest communities.',MX,176,400,60,18,LT,BODY,false);
  txt(s[0],'50 DOORS   ·   $12M+   ·   3 STATES   ·   200 BY 2030',MX,300,520,24,13,GOLD,BODY,true);
  txt(s[0],'Prepared by Jake Horvitz   ·   2026',MX,330,400,20,11,LT,BODY,false);
  ph(s[0],510,60,156,285,'PORTRAIT',PHD,GOLD);

  // 2 THE OPERATOR (cream)
  bg(s[1],CREAM);
  eyebrow(s[1],'WHO WE’RE MARKETING',MX,54);
  line(s[1],MX,84,90);
  txt(s[1],'An operator, not a marketer.',MX,96,460,52,32,NAVY,HEAD,true);
  txt(s[1],'Israel → IDF special operations → Hillsdale College → real estate. Former VP at AM Equipment, where he built the weekly execution systems he now runs at Charger Property Management.',MX,160,430,110,15,CHAR,BODY,false);
  txt(s[1],'“Discipline, resilience, and the ability to execute long-term missions under uncertainty.”',MX,300,430,70,15,NAVY,HEAD,false);
  ph(s[1],520,54,146,297,'PORTRAIT',PHL,NAVY);

  // 3 THE OPPORTUNITY (navy)
  bg(s[2],NAVY);
  eyebrow(s[2],'THE OPPORTUNITY',MX,54);
  line(s[2],MX,84,90);
  txt(s[2],'A real story that isn’t being told yet.',MX,96,560,52,32,WHITE,HEAD,true);
  txt(s[2],'50 doors. A $12M+ portfolio. Three states. And a genuine mission — turning overlooked houses into long-term homes for families.',MX,166,600,60,17,LT,BODY,false);
  txt(s[2],'The proof already exists. The digital presence doesn’t match it yet. That gap is the opportunity — and the plan.',MX,236,600,60,17,GOLD,BODY,false);
  stat(s[2],MX,310,'50','DOORS'); stat(s[2],MX+150,310,'$12M+','PORTFOLIO');
  stat(s[2],MX+330,310,'3','STATES'); stat(s[2],MX+450,310,'2030','→ 200 DOORS');

  // 4 THREE AUDIENCES (cream)
  bg(s[3],CREAM);
  eyebrow(s[3],'WHO WE SPEAK TO',MX,54);
  line(s[3],MX,84,90);
  txt(s[3],'Three audiences, one message.',MX,96,560,52,32,NAVY,HEAD,true);
  col(s[3],MX,170,'01','Investors','Capital partners who want operator-led returns without managing the work.');
  col(s[3],MX+210,170,'02','Aspiring operators','Newer investors who want the BRRRR playbook from someone executing it.');
  col(s[3],MX+420,170,'03','Communities','Tenants, families, and local markets — the people the mission serves.');

  // 5 POSITIONING & VOICE (navy)
  bg(s[4],NAVY);
  eyebrow(s[4],'POSITIONING & VOICE',MX,54);
  line(s[4],MX,84,90);
  txt(s[4],'“Not all real estate is sexy.”',MX,100,600,60,36,WHITE,HEAD,true);
  txt(s[4],'Mission first, numbers as proof. Execution is the moat, not flash. First-person, plainspoken, blue-collar tough but polished — he sounds like an operator, because he is one.',MX,190,600,70,17,LT,BODY,false);
  txt(s[4],'It is not flashy, but it is one of the biggest reasons we stay on track.',MX,290,600,40,15,GOLD,HEAD,false);

  // 6 VISUAL IDENTITY (cream)
  bg(s[5],CREAM);
  eyebrow(s[5],'BRAND SYSTEM',MX,54);
  line(s[5],MX,84,90);
  txt(s[5],'Operator-grade. Midwest brick, Israeli grit.',MX,96,470,80,30,NAVY,HEAD,true);
  txt(s[5],'Less luxury gloss, more “we showed up and did the work.”',MX,168,420,30,14,CHAR,BODY,false);
  sw(s[5],MX,210,NAVY,'NAVY'); sw(s[5],MX+110,210,GOLD,'GOLD');
  sw(s[5],MX+220,210,CREAM,'CREAM'); sw(s[5],MX+330,210,CHAR,'CHARCOAL');
  txt(s[5],'Headlines: confident serif.   Body: clean sans.',MX,310,420,24,13,NAVY,BODY,true);
  ph(s[5],520,90,146,225,'CHARGER LOGO',PHL,NAVY);

  // 7 CHANNELS (navy)
  bg(s[6],NAVY);
  eyebrow(s[6],'CHANNELS',MX,54);
  line(s[6],MX,84,90);
  txt(s[6],'Where the story lives.',MX,96,560,52,32,WHITE,HEAD,true);
  row(s[6],160,'Website','Home base. Mission, portfolio, the 2030 vision — and the inquiry form.');
  row(s[6],212,'LinkedIn','~2,630 followers today. Authority, deal flow, and investor relationships.');
  row(s[6],264,'Substack','Long-form trust — operator essays that compound over time.');
  row(s[6],316,'Instagram','From the field. Before/after, crews working, the human side.');

  // 8 LINKEDIN (cream)
  bg(s[7],CREAM);
  eyebrow(s[7],'LINKEDIN',MX,54);
  line(s[7],MX,84,90);
  txt(s[7],'Turn 2,630 followers into deal flow.',MX,96,560,52,30,NAVY,HEAD,true);
  txt(s[7],'Four content pillars, ~3× per week:',MX,160,560,24,15,CHAR,BODY,true);
  bullet(s[7],196,'Execution playbook — the weekly system, how the work gets done.');
  bullet(s[7],230,'Before & after — real transformations across MI / OH / IN.');
  bullet(s[7],264,'Mission & community — homes, families, jobs created.');
  bullet(s[7],298,'Lessons — plainspoken takes on what overlooked markets teach.');

  // 9 SUBSTACK (navy)
  bg(s[8],NAVY);
  eyebrow(s[8],'SUBSTACK',MX,54);
  line(s[8],MX,84,90);
  txt(s[8],'The long-form moat.',MX,96,560,52,32,WHITE,HEAD,true);
  txt(s[8],'Monthly operator essays: BRRRR breakdowns, market notes, and the Hillsdale 100 vision — the thinking behind the doors.',MX,166,600,70,17,LT,BODY,false);
  txt(s[8],'Every essay repurposes into a week of LinkedIn and Instagram. Write once, distribute everywhere.',MX,256,600,50,17,GOLD,BODY,false);

  // 10 CONTENT ENGINE (cream)
  bg(s[9],CREAM);
  eyebrow(s[9],'CONTENT ENGINE',MX,54);
  line(s[9],MX,84,90);
  txt(s[9],'One project. Ten posts.',MX,96,460,52,32,NAVY,HEAD,true);
  txt(s[9],'Buy  →  Rehab  →  Rent  →  Refinance  →  Repeat',MX,162,460,26,16,GOLD,HEAD,true);
  txt(s[9],'Flagship: 17 Lo Presto Ave, Hillsdale, MI — a full BRRRR transformation, documented start to finish as the anchor case study.',MX,200,430,80,15,CHAR,BODY,false);
  ph(s[9],500,150,166,165,'FLAGSHIP HOUSE',PHL,NAVY);

  // 11 WEBSITE (navy)
  bg(s[10],NAVY);
  eyebrow(s[10],'WEBSITE',MX,54);
  line(s[10],MX,84,90);
  txt(s[10],'The home base that converts.',MX,96,560,52,32,WHITE,HEAD,true);
  txt(s[10],'Seven pages, mission-first: a portrait-led hero, portfolio before/afters, the Charger story, the 2030 vision, and clear paths for investor and property inquiries.',MX,166,600,70,17,LT,BODY,false);
  txt(s[10],'Mobile-first — he posts from the field, investors and tenants browse on phones.',MX,266,600,40,15,GOLD,BODY,false);

  // 12 FUNNEL (cream)
  bg(s[11],CREAM);
  eyebrow(s[11],'THE FUNNEL',MX,54);
  line(s[11],MX,84,90);
  txt(s[11],'Attention → trust → inquiry.',MX,96,560,52,32,NAVY,HEAD,true);
  funnel(s[11],175);
  txt(s[11],'Every channel has one job: move the right person one step closer to a conversation.',MX,300,600,30,14,CHAR,BODY,false);

  // 13 ROLLOUT (navy)
  bg(s[12],NAVY);
  eyebrow(s[12],'ROLLOUT',MX,54);
  line(s[12],MX,84,90);
  txt(s[12],'First 90 days.',MX,96,560,52,32,WHITE,HEAD,true);
  phase(s[12],MX,160,'PHASE 1 · 0–30','Foundation','Website live, brand kit, content library shot from existing projects.');
  phase(s[12],MX+210,160,'PHASE 2 · 30–60','Ramp','Consistent cadence on LinkedIn + Instagram. First Substack essays.');
  phase(s[12],MX+420,160,'PHASE 3 · 60–90','Optimize','Double down on what converts. Build the inquiry pipeline.');

  // 14 KPIs (cream)
  bg(s[13],CREAM);
  eyebrow(s[13],'WHAT WE MEASURE',MX,54);
  line(s[13],MX,84,90);
  txt(s[13],'Proof, not vanity.',MX,96,560,52,32,NAVY,HEAD,true);
  bullet2(s[13],160,'LinkedIn followers','2,630 → [FILL IN target]');
  bullet2(s[13],196,'Post reach & engagement','baseline [FILL IN] → growth');
  bullet2(s[13],232,'Website inquiries','investor + property forms');
  bullet2(s[13],268,'Qualified investor conversations','the metric that matters');
  bullet2(s[13],304,'Doors in pipeline','marketing → deal flow');

  // 15 THE ASK (navy)
  bg(s[14],NAVY);
  eyebrow(s[14],'ENGAGEMENT',MX,54);
  line(s[14],MX,84,90);
  txt(s[14],'What I’ll own.',MX,96,560,52,32,WHITE,HEAD,true);
  bulletL(s[14],160,'All social channels — LinkedIn, Instagram, Substack.');
  bulletL(s[14],196,'Website build, copy, and ongoing updates.');
  bulletL(s[14],232,'The content engine — shoot, write, distribute, repurpose.');
  bulletL(s[14],268,'Monthly reporting against the metrics above.');
  txt(s[14],'Investment: [FILL IN]      Next step: [FILL IN]',MX,316,600,24,14,GOLD,BODY,true);

  // 16 CLOSE (cream)
  bg(s[15],CREAM);
  line(s[15],MX,90,90);
  txt(s[15],'Just getting started.',MX,104,560,60,40,NAVY,HEAD,true);
  txt(s[15],'Improving homes, building communities, and creating opportunities where others may only see challenges.',MX,182,520,60,17,CHAR,BODY,false);
  txt(s[15],'linkedin.com/in/shavitrootman      ·      shavitrootman.substack.com',MX,300,560,24,13,NAVY,BODY,true);
  ph(s[15],540,90,126,180,'CHARGER LOGO',PHL,NAVY);

  Logger.log(p.getUrl());
  return p.getUrl();
}

// ---- helpers ----
function clear(sl){ var e=sl.getPageElements(); for(var i=0;i<e.length;i++){ e[i].remove(); } }
function bg(sl,c){ sl.getBackground().setSolidFill(c); }
function txt(sl,t,x,y,w,h,sz,c,f,b){
  var box=sl.insertTextBox(t,x,y,w,h); var ts=box.getText().getTextStyle();
  ts.setFontSize(sz).setForegroundColor(c).setFontFamily(f).setBold(b);
  return box;
}
function eyebrow(sl,t,x,y){ var b=txt(sl,t,x,y,500,20,12,GOLD,BODY,true); return b; }
function line(sl,x,y,w){ var r=sl.insertShape(SlidesApp.ShapeType.RECTANGLE,x,y,w,3);
  r.getFill().setSolidFill(GOLD); r.getBorder().setTransparent(); return r; }
function ph(sl,x,y,w,h,label,fill,lab){
  var r=sl.insertShape(SlidesApp.ShapeType.RECTANGLE,x,y,w,h);
  r.getFill().setSolidFill(fill); r.getBorder().getLineFill().setSolidFill(GOLD); r.getBorder().setWeight(1);
  var t=txt(sl,'[ '+label+' ]',x,y+h/2-10,w,20,10,lab,BODY,true);
  t.setContentAlignment(SlidesApp.ContentAlignment.MIDDLE);
}
function stat(sl,x,y,v,l){ txt(sl,v,x,y,140,34,26,GOLD,HEAD,true); txt(sl,l,x,y+34,140,16,10,LT,BODY,true); }
function col(sl,x,y,n,h,b){ txt(sl,n,x,y,180,26,22,GOLD,HEAD,true);
  txt(sl,h,x,y+30,180,24,17,NAVY,HEAD,true); txt(sl,b,x,y+58,185,90,13,CHAR,BODY,false); }
function sw(sl,x,y,c,l){ var r=sl.insertShape(SlidesApp.ShapeType.RECTANGLE,x,y,70,46);
  r.getFill().setSolidFill(c); r.getBorder().getLineFill().setSolidFill(CHAR); r.getBorder().setWeight(0.5);
  txt(sl,l,x,y+50,90,16,10,CHAR,BODY,true); }
function row(sl,y,h,b){ line(sl,MX,y+6,30); txt(sl,h,MX+44,y-4,150,24,17,GOLD,HEAD,true);
  txt(sl,b,MX+200,y-4,440,30,14,LT,BODY,false); }
function bullet(sl,y,t){ var d=sl.insertShape(SlidesApp.ShapeType.RECTANGLE,MX,y+5,7,7);
  d.getFill().setSolidFill(GOLD); d.getBorder().setTransparent(); txt(sl,t,MX+18,y-4,580,24,15,CHAR,BODY,false); }
function bulletL(sl,y,t){ var d=sl.insertShape(SlidesApp.ShapeType.RECTANGLE,MX,y+5,7,7);
  d.getFill().setSolidFill(GOLD); d.getBorder().setTransparent(); txt(sl,t,MX+18,y-4,580,24,15,LT,BODY,false); }
function bullet2(sl,y,h,b){ var d=sl.insertShape(SlidesApp.ShapeType.RECTANGLE,MX,y+6,7,7);
  d.getFill().setSolidFill(GOLD); d.getBorder().setTransparent();
  txt(sl,h,MX+18,y-4,300,24,15,NAVY,HEAD,true); txt(sl,b,MX+320,y-4,320,24,14,CHAR,BODY,false); }
function phase(sl,x,y,tag,h,b){ txt(sl,tag,x,y,180,18,11,GOLD,BODY,true);
  txt(sl,h,x,y+24,180,26,19,WHITE,HEAD,true); txt(sl,b,x,y+54,185,100,13,LT,BODY,false); }
function funnel(sl,y){ var st=['Social reach','Profile / Substack','Website','Inquiry','Call'];
  var x=MX; for(var i=0;i<st.length;i++){ txt(sl,st[i],x,y,110,40,14,NAVY,HEAD,true);
    if(i<st.length-1){ txt(sl,'→',x+96,y,30,40,18,GOLD,HEAD,true);} x+=128; } }
