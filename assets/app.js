/* FreshDrop – demo shop (client-side only, no real orders) */
const LOGO = `<span class="lw"><span class="wm">Fresh<b>Dr</b><svg class="pdrop" viewBox="0 0 24 30" aria-hidden="true"><defs><linearGradient id="fdg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0FB5C9"/><stop offset="1" stop-color="#7C4DFF"/></linearGradient></defs><path fill="url(#fdg)" fill-rule="evenodd" d="M12 1C12 1 1.5 11.6 1.5 18.2a10.5 10.5 0 0 0 21 0C22.5 11.6 12 1 12 1ZM12 11.2C12 11.2 7.1 16.1 7.1 19.2a4.9 4.9 0 0 0 9.8 0C16.9 16.1 12 11.2 12 11.2Z"/><path d="M5.2 19.5a7 7 0 0 0 2.6 5.2" fill="none" stroke="#fff" stroke-opacity=".75" stroke-width="1.4" stroke-linecap="round"/></svg><b>p</b></span><small class="tagline">Everyday essentials</small></span>`;
const PH = t => `<span class="ph">[${t}]</span>`;
const eur = n => '€' + (Number.isFinite(n) ? n : 0).toFixed(2);

/* ---------- SVG illustrations (original, royalty-free) ---------- */
const A = '#7C4DFF', A2 = '#FFC83D', A3 = '#FF4D8D', AQ = '#0FB5C9', W = '#1B1B3A', G = '#CFE9F0';
const drawings = {
  trunk: `<path d="M80 165h240l-20 140H100z" fill="${G}" stroke="${W}" stroke-width="6" stroke-linejoin="round"/>
    <path d="M160 165l-6 140M240 165l6 140" stroke="${A}" stroke-width="6"/>
    <path d="M80 165l30-35h180l30 35" fill="none" stroke="${W}" stroke-width="6" stroke-linejoin="round"/>
    <rect x="175" y="200" width="50" height="14" rx="7" fill="${A}"/>
    <rect x="102" y="200" width="40" height="40" rx="6" fill="#D9CFFF"/><rect x="258" y="200" width="40" height="40" rx="6" fill="#D9CFFF"/>`,
  dog: `<path d="M110 90h180q20 0 20 20v120q0 20-20 20H110q-20 0-20-20V110q0-20 20-20z" fill="${G}" stroke="${W}" stroke-width="6"/>
    <path d="M80 250h240l-15 60H95z" fill="${G}" stroke="${W}" stroke-width="6" stroke-linejoin="round"/>
    <g fill="${A}"><ellipse cx="200" cy="185" rx="34" ry="28"/><circle cx="160" cy="140" r="14"/><circle cx="188" cy="125" r="14"/><circle cx="214" cy="125" r="14"/><circle cx="242" cy="140" r="14"/></g>`,
  backseat: `<path d="M120 70h160q20 0 22 20l14 230H84l14-230q2-20 22-20z" fill="${G}" stroke="${W}" stroke-width="6" stroke-linejoin="round"/>
    <rect x="130" y="110" width="140" height="70" rx="10" fill="#D9CFFF" stroke="${A}" stroke-width="5"/>
    <path d="M110 215h180v14H110z" fill="${A}"/><path d="M110 229l-30 40h240l-30-40" fill="none" stroke="${W}" stroke-width="5" stroke-dasharray="10 8"/>
    <rect x="115" y="250" width="70" height="50" rx="8" fill="#D9CFFF"/><rect x="215" y="250" width="70" height="50" rx="8" fill="#D9CFFF"/>`,
  umbrella: `<path d="M60 300l40-110h200l40 110z" fill="#0FB5C9" stroke="${W}" stroke-width="6" stroke-linejoin="round"/>
    <path d="M80 210q120-140 240 0" fill="${A}" stroke="${W}" stroke-width="5"/>
    <path d="M80 210q30-20 60 0q30-20 60 0q30-20 60 0q30-20 60 0" fill="${G}" stroke="${W}" stroke-width="5"/>
    <path d="M200 115v-20M200 210v80q0 16 16 16" stroke="${W}" stroke-width="6" fill="none" stroke-linecap="round"/>
    <circle cx="320" cy="90" r="26" fill="${A2}"/><g stroke="${A2}" stroke-width="5" stroke-linecap="round"><path d="M320 46v-12M364 90h12M351 59l9-9"/></g>`,
  phone: `<rect x="145" y="70" width="120" height="220" rx="22" fill="${G}" stroke="${W}" stroke-width="6"/>
    <rect x="160" y="95" width="90" height="160" rx="8" fill="#EAF9FC"/><circle cx="205" cy="272" r="6" fill="${W}"/>
    <circle cx="205" cy="175" r="42" fill="none" stroke="${A}" stroke-width="10"/>
    <path d="M205 290v40M170 330h70" stroke="${W}" stroke-width="8" stroke-linecap="round"/>
    <path d="M100 150l18 12-18 12M310 150l-18 12 18 12" fill="none" stroke="${A2}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`,
  oxford: `<path d="M95 130h210q15 0 15 15v140q0 15-15 15H95q-15 0-15-15V145q0-15 15-15z" fill="${G}" stroke="${W}" stroke-width="6"/>
    <rect x="96" y="145" width="208" height="140" rx="6" fill="none" stroke="${A}" stroke-width="3" stroke-dasharray="8 7"/>
    <path d="M150 130v-25q0-15 15-15h70q15 0 15 15v25" fill="none" stroke="${W}" stroke-width="6"/>
    <path d="M80 200h240" stroke="${W}" stroke-width="5"/><rect x="185" y="190" width="30" height="22" rx="4" fill="${A}"/>`,
  underseat: `<path d="M70 120h260v40H70z" fill="#D9CFFF" stroke="${W}" stroke-width="6" stroke-linejoin="round"/>
    <path d="M90 175h220l-10 120H100z" fill="${G}" stroke="${W}" stroke-width="6" stroke-linejoin="round"/>
    <path d="M90 175h220" stroke="${A}" stroke-width="10"/><rect x="175" y="210" width="50" height="12" rx="6" fill="${A}"/>
    <path d="M110 120l-10-30h200l-10 30" fill="none" stroke="${W}" stroke-width="5"/>`,
  snow: `<path d="M120 300l150-170" stroke="${W}" stroke-width="14" stroke-linecap="round"/>
    <path d="M245 100l70 60-30 34-70-60z" fill="${A}" stroke="${W}" stroke-width="5" stroke-linejoin="round"/>
    <g stroke="${W}" stroke-width="4"><path d="M262 150l-12 14M280 165l-12 14M298 180l-12 14"/></g>
    <path d="M100 300l40 20-20 30-40-20z" fill="${A2}" stroke="${W}" stroke-width="5" stroke-linejoin="round"/>
    <g stroke="#FFFFFF" stroke-width="5" stroke-linecap="round"><path d="M110 120v40M90 140h40M96 126l28 28M124 126l-28 28"/><path d="M320 270v24M308 282h24"/></g>`,
  clean: `<path d="M150 150h60v160q0 14-14 14h-32q-14 0-14-14z" fill="${G}" stroke="${W}" stroke-width="6"/>
    <path d="M160 150v-30h40v30M170 120v-25h50l15 15" fill="none" stroke="${W}" stroke-width="6" stroke-linejoin="round"/>
    <rect x="150" y="200" width="60" height="40" fill="${A}"/>
    <path d="M240 260q20-25 40 0t40 0v50q-20 25-40 0t-40 0z" fill="${A2}" stroke="${W}" stroke-width="5"/>
    <g fill="${W}"><path d="M270 120l6 16 16 6-16 6-6 16-6-16-16-6 16-6z"/><path d="M310 170l4 10 10 4-10 4-4 10-4-10-10-4 10-4z"/></g>`,
  gap: `<path d="M70 110q0-20 20-20h60q15 0 15 15v200H70z" fill="${G}" stroke="${W}" stroke-width="6"/>
    <path d="M330 110q0-20-20-20h-60q-15 0-15 15v200h95z" fill="${G}" stroke="${W}" stroke-width="6"/>
    <path d="M170 150h60l-8 130h-44z" fill="${A}" stroke="${W}" stroke-width="5" stroke-linejoin="round"/>
    <path d="M200 110v-30M188 94l12-14 12 14" stroke="${A2}" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
  hooks: `<g fill="none" stroke="${W}" stroke-width="8" stroke-linecap="round"><path d="M130 110v80q0 30 30 30t30-30"/><path d="M230 110v80q0 30 30 30t30-30"/></g><rect x="110" y="95" width="200" height="22" rx="11" fill="${A}"/>`,
  towel: `<path d="M110 110h180v180H110z" fill="${A2}" stroke="${W}" stroke-width="6"/><path d="M110 150h180M110 250h180" stroke="${W}" stroke-width="4" stroke-dasharray="6 6"/><g fill="${A}"><ellipse cx="200" cy="205" rx="22" ry="18"/><circle cx="175" cy="178" r="9"/><circle cx="193" cy="170" r="9"/><circle cx="211" cy="170" r="9"/><circle cx="229" cy="178" r="9"/></g>`,
  towels: `<g stroke="${W}" stroke-width="5" stroke-linejoin="round"><rect x="90" y="230" width="220" height="50" rx="12" fill="${A}"/><rect x="100" y="180" width="200" height="50" rx="12" fill="${A2}"/><rect x="110" y="130" width="180" height="50" rx="12" fill="${G}"/></g><text x="200" y="330" text-anchor="middle" font-family="system-ui" font-weight="900" font-size="40" fill="${W}">×10</text>`,
  drytowel: `<path d="M80 120h240v170H80z" fill="${G}" stroke="${W}" stroke-width="6"/><g stroke="${A}" stroke-width="6" stroke-linecap="round" fill="none"><path d="M100 150q10-14 20 0t20 0 20 0 20 0 20 0 20 0 20 0 20 0 20 0 20 0"/><path d="M100 190q10-14 20 0t20 0 20 0 20 0 20 0 20 0 20 0 20 0 20 0 20 0"/><path d="M100 230q10-14 20 0t20 0 20 0 20 0 20 0 20 0 20 0 20 0 20 0 20 0"/></g><g fill="#FFFFFF"><path d="M320 80q12 18 0 26-12-8 0-26z"/><path d="M80 300q10 15 0 22-10-7 0-22z"/></g>`,
  mitt: `<path d="M130 300V170q0-70 70-70t70 70v130z" fill="${A2}" stroke="${W}" stroke-width="6"/><path d="M130 180q-40-10-40 30t40 40" fill="${A2}" stroke="${W}" stroke-width="6"/><rect x="125" y="290" width="150" height="34" rx="8" fill="${A}" stroke="${W}" stroke-width="5"/><g fill="#fff8" ><circle cx="170" cy="160" r="8"/><circle cx="210" cy="140" r="8"/><circle cx="235" cy="180" r="8"/><circle cx="190" cy="200" r="8"/><circle cx="215" cy="230" r="8"/><circle cx="170" cy="245" r="8"/></g>`,
  brushes: `<g stroke="${W}" stroke-width="5" stroke-linejoin="round">${[0,1,2,3,4].map(i=>`<rect x="${92+i*46}" y="${200-i*8}" width="26" height="${120+i*8}" rx="8" fill="${i%2?A:G}"/><path d="M${88+i*46} ${200-i*8}h34l-6-${50+i*6}h-22z" fill="${A2}"/>`).join('')}</g>`,
  wheelbrush: `<circle cx="160" cy="220" r="95" fill="${G}" stroke="${W}" stroke-width="6"/><circle cx="160" cy="220" r="30" fill="#D9CFFF" stroke="${W}" stroke-width="5"/><g stroke="${W}" stroke-width="6"><path d="M160 125v65M160 250v65M65 220h65M190 220h65"/></g><path d="M215 165l120-100" stroke="${A}" stroke-width="16" stroke-linecap="round"/><ellipse cx="205" cy="178" rx="30" ry="18" transform="rotate(-40 205 178)" fill="${A2}" stroke="${W}" stroke-width="5"/>`,
  waffle: `<rect x="100" y="100" width="200" height="200" rx="10" fill="#0FB5C9" stroke="${W}" stroke-width="6"/><g stroke="#FFFFFF" stroke-width="3">${[1,2,3,4,5,6].map(i=>`<path d="M${100+i*28.5} 100v200M100 ${100+i*28.5}h200"/>`).join('')}</g><path d="M260 70l8 20 20 8-20 8-8 20-8-20-20-8 20-8z" fill="${W}"/>`,
  pads: `<g stroke="${W}" stroke-width="5">${[[140,150],[260,150],[200,250],[110,270],[290,270]].map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="52" fill="${i%2?A3:A}"/><path d="M${x-30} ${y}h60" stroke="#1B1B3A" stroke-width="6"/>`).join('')}</g>`,
  frost: `<path d="M60 290l40-120h200l40 120z" fill="#DDEFF3" stroke="${W}" stroke-width="6" stroke-linejoin="round"/><path d="M70 270l35-90h190l35 90z" fill="${G}"/><g fill="${A}"><circle cx="110" cy="180" r="10"/><circle cx="290" cy="180" r="10"/><circle cx="80" cy="275" r="10"/><circle cx="320" cy="275" r="10"/></g><g stroke="#FFFFFF" stroke-width="6" stroke-linecap="round"><path d="M200 90v50M178 115h44M184 99l32 32M216 99l-32 32"/></g>`,
  steering: `<circle cx="200" cy="200" r="120" fill="none" stroke="${A}" stroke-width="34"/><circle cx="200" cy="200" r="120" fill="none" stroke="${W}" stroke-width="3" stroke-dasharray="6 10"/><circle cx="200" cy="215" r="38" fill="${G}" stroke="${W}" stroke-width="6"/><path d="M90 200h72M238 200h72M200 253v65" stroke="${G}" stroke-width="22"/>`,
  neck: `<rect x="140" y="60" width="120" height="180" rx="30" fill="${G}" stroke="${W}" stroke-width="6"/><path d="M110 120q90 70 180 0v30q-90 70-180 0z" fill="${A2}" stroke="${W}" stroke-width="5"/><path d="M175 240v70M225 240v70" stroke="${W}" stroke-width="8"/><path d="M120 125q-15 15 0 28M280 125q15 15 0 28" stroke="${A}" stroke-width="6" fill="none"/>`,
  lumbar: `<rect x="140" y="50" width="120" height="110" rx="26" fill="${G}" stroke="${W}" stroke-width="6"/><path d="M120 90q80 50 160 0v24q-80 50-160 0z" fill="${A2}" stroke="${W}" stroke-width="5"/><path d="M110 175h180q20 0 20 20v100q0 20-20 20H110q-20 0-20-20V195q0-20 20-20z" fill="${G}" stroke="${W}" stroke-width="6"/><path d="M120 210q80 60 160 0v40q-80 60-160 0z" fill="${A}" stroke="${W}" stroke-width="5"/>`,
  logo: `<path d="M200 40l130 50v90q0 100-130 160Q70 280 70 180V90z" fill="${A}"/><path d="M130 160h140l-12 90H142z" fill="#1B1B3A"/><path d="M130 160l20-25h100l20 25" fill="none" stroke="#1B1B3A" stroke-width="14" stroke-linejoin="round"/>`,
  cdslot: `<rect x="60" y="80" width="280" height="60" rx="10" fill="#D9CFFF" stroke="${W}" stroke-width="6"/><rect x="100" y="104" width="200" height="12" rx="6" fill="#1B1B3A"/><path d="M200 140v70" stroke="${W}" stroke-width="10" stroke-linecap="round"/><rect x="150" y="205" width="100" height="150" rx="16" fill="${G}" stroke="${W}" stroke-width="6"/><circle cx="200" cy="260" r="26" fill="none" stroke="${A}" stroke-width="8"/>`,
  mirror: `<path d="M80 80h240q20 0 20 20v60q0 20-20 20H80q-20 0-20-20v-60q0-20 20-20z" fill="#D9CFFF" stroke="${W}" stroke-width="6"/><path d="M200 180v40" stroke="${W}" stroke-width="10" stroke-linecap="round"/><rect x="150" y="215" width="100" height="150" rx="16" fill="${G}" stroke="${W}" stroke-width="6"/><circle cx="200" cy="270" r="26" fill="none" stroke="${A}" stroke-width="8"/>`,
  suction: `<circle cx="200" cy="300" r="60" fill="${G}" stroke="${W}" stroke-width="6"/><circle cx="200" cy="300" r="30" fill="#D9CFFF" stroke="${A}" stroke-width="6"/><path d="M200 240v-60" stroke="${W}" stroke-width="12" stroke-linecap="round"/><rect x="150" y="50" width="100" height="140" rx="16" fill="${G}" stroke="${W}" stroke-width="6"/><circle cx="200" cy="120" r="24" fill="none" stroke="${A}" stroke-width="8"/>`,
  handlebar: `<path d="M40 280h320" stroke="${W}" stroke-width="18" stroke-linecap="round"/><path d="M40 280h60M300 280h60" stroke="${G}" stroke-width="30" stroke-linecap="round"/><rect x="170" y="262" width="60" height="36" rx="8" fill="${A}" stroke="${W}" stroke-width="5"/><path d="M200 262v-30" stroke="${W}" stroke-width="10" stroke-linecap="round"/><rect x="150" y="60" width="100" height="175" rx="16" fill="${G}" stroke="${W}" stroke-width="6"/><circle cx="200" cy="148" r="26" fill="none" stroke="${A2}" stroke-width="8"/>`,
  paw: `<g fill="${A}" stroke="${W}" stroke-width="5"><ellipse cx="200" cy="250" rx="62" ry="50"/><ellipse cx="115" cy="170" rx="24" ry="32"/><ellipse cx="165" cy="120" rx="24" ry="32"/><ellipse cx="235" cy="120" rx="24" ry="32"/><ellipse cx="285" cy="170" rx="24" ry="32"/></g><path d="M80 330h240" stroke="${A2}" stroke-width="10" stroke-linecap="round" stroke-dasharray="4 16"/>`,
  dogbrush: `<path d="M110 240h180q20 0 20 20v20q0 20-20 20H110q-20 0-20-20v-20q0-20 20-20z" fill="${G}" stroke="${W}" stroke-width="6"/><g stroke="${A2}" stroke-width="6" stroke-linecap="round">${[0,1,2,3,4,5,6,7].map(i=>`<path d="M${115+i*24} 240v-45"/>`).join('')}</g><path d="M300 270h50" stroke="${W}" stroke-width="16" stroke-linecap="round"/><g fill="${A}"><circle cx="150" cy="150" r="9"/><circle cx="200" cy="130" r="9"/><circle cx="250" cy="150" r="9"/></g>`,
  rubber: `<path d="M70 250h260v40q0 20-20 20H90q-20 0-20-20z" fill="${A}" stroke="${W}" stroke-width="6"/><g stroke="${W}" stroke-width="8" stroke-linecap="round">${[0,1,2,3,4,5,6].map(i=>`<path d="M${95+i*35} 250v-60"/>`).join('')}</g><path d="M100 150q100-40 200 0" fill="none" stroke="${A2}" stroke-width="6" stroke-dasharray="4 10"/>`,
  harness: `<path d="M150 80q50 40 100 0v60q-50 40-100 0z" fill="${A}" stroke="${W}" stroke-width="5" stroke-linejoin="round"/><path d="M150 140l-40 130h70l20-100zM250 140l40 130h-70l-20-100z" fill="${G}" stroke="${W}" stroke-width="6" stroke-linejoin="round"/><rect x="180" y="250" width="40" height="30" rx="6" fill="${A2}"/><path d="M200 280v70" stroke="${W}" stroke-width="10" stroke-linecap="round"/>`,
  bottle: `<rect x="150" y="90" width="100" height="230" rx="30" fill="#0FB5C9" stroke="${W}" stroke-width="6"/><rect x="170" y="60" width="60" height="34" rx="8" fill="${G}" stroke="${W}" stroke-width="5"/><path d="M150 200h100" stroke="#FFFFFF" stroke-width="4"/><g fill="${A}"><ellipse cx="200" cy="260" rx="20" ry="16"/><circle cx="178" cy="236" r="7"/><circle cx="194" cy="228" r="7"/><circle cx="210" cy="228" r="7"/><circle cx="226" cy="236" r="7"/></g>`,
  roller: `<rect x="90" y="110" width="200" height="90" rx="16" fill="${A2}" stroke="${W}" stroke-width="6"/><g stroke="${G}" stroke-width="4">${[0,1,2,3,4,5].map(i=>`<path d="M${120+i*28} 115v80"/>`).join('')}</g><path d="M290 155h40v120" fill="none" stroke="${W}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/><rect x="305" y="270" width="50" height="70" rx="12" fill="${G}" stroke="${W}" stroke-width="6"/>`,
  'generic': `<rect x="110" y="140" width="180" height="150" rx="14" fill="${G}" stroke="${W}" stroke-width="6"/><path d="M110 140l30-40h120l30 40" fill="none" stroke="${W}" stroke-width="6" stroke-linejoin="round"/><rect x="170" y="185" width="60" height="16" rx="8" fill="${A}"/>`,
  'g-home': `<path d="M70 190L200 80l130 110" fill="none" stroke="${W}" stroke-width="10" stroke-linejoin="round" stroke-linecap="round"/><path d="M100 180v120h200V180" fill="${G}" stroke="${W}" stroke-width="6" stroke-linejoin="round"/><rect x="175" y="225" width="50" height="75" rx="6" fill="${A}"/><rect x="120" y="205" width="36" height="36" rx="4" fill="#D9CFFF"/><rect x="244" y="205" width="36" height="36" rx="4" fill="#D9CFFF"/>`,
  'g-kitchen': `<path d="M120 170h160v70q0 60-80 60t-80-60z" fill="${G}" stroke="${W}" stroke-width="6" stroke-linejoin="round"/><path d="M110 170h180" stroke="${A}" stroke-width="10" stroke-linecap="round"/><path d="M300 110l-60 100M320 130l-60 100" stroke="${A2}" stroke-width="10" stroke-linecap="round"/><path d="M90 110v50M110 110v50M130 110v50" stroke="${W}" stroke-width="6" stroke-linecap="round"/>`,
  'g-office': `<rect x="110" y="90" width="180" height="230" rx="10" fill="${G}" stroke="${W}" stroke-width="6"/><path d="M110 90h30v230h-30z" fill="${A}"/><g stroke="${W}" stroke-width="5" stroke-linecap="round"><path d="M165 140h95M165 175h95M165 210h95M165 245h60"/></g><path d="M300 270l30-90 14 5-30 90z" fill="${A2}" stroke="${W}" stroke-width="4"/>`,
  'g-pets': `<g fill="${A}" stroke="${W}" stroke-width="5"><ellipse cx="200" cy="250" rx="62" ry="50"/><ellipse cx="115" cy="170" rx="24" ry="32"/><ellipse cx="165" cy="120" rx="24" ry="32"/><ellipse cx="235" cy="120" rx="24" ry="32"/><ellipse cx="285" cy="170" rx="24" ry="32"/></g><path d="M130 300q70 24 140 0" fill="none" stroke="${A2}" stroke-width="8" stroke-linecap="round"/>`,
  'g-clean': `<path d="M200 70v170" stroke="${W}" stroke-width="12" stroke-linecap="round"/><path d="M110 240h180l20 50q0 30-30 30H120q-30 0-30-30z" fill="${A2}" stroke="${W}" stroke-width="6" stroke-linejoin="round"/><g stroke="${A}" stroke-width="6" stroke-linecap="round"><path d="M130 270v36M165 270v40M200 270v42M235 270v40M270 270v36"/></g>`,
  'g-bath': `<path d="M70 200h260v30q0 70-70 70H140q-70 0-70-70z" fill="${G}" stroke="${W}" stroke-width="6" stroke-linejoin="round"/><path d="M110 200v-60q0-30 30-30h20" fill="none" stroke="${W}" stroke-width="8" stroke-linecap="round"/><g fill="#FFFFFF"><path d="M300 80q14 22 0 30-14-8 0-30z"/><path d="M330 120q10 16 0 22-10-6 0-22z"/></g><path d="M100 330l-10 20M300 330l10 20" stroke="${W}" stroke-width="8" stroke-linecap="round"/>`,
  'g-sg': `<rect x="150" y="120" width="100" height="190" rx="28" fill="${G}" stroke="${W}" stroke-width="6"/><rect x="168" y="78" width="64" height="44" rx="10" fill="${A}" stroke="${W}" stroke-width="5"/><path d="M150 190h100M150 235h100" stroke="${AQ}" stroke-width="8"/><path d="M232 78l30-26h26" fill="none" stroke="${A3}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`,
  'g-tools': `<path d="M110 300l120-120" stroke="${W}" stroke-width="22" stroke-linecap="round"/><path d="M110 300l120-120" stroke="${A}" stroke-width="12" stroke-linecap="round"/><path d="M230 180l60-60" stroke="${W}" stroke-width="8" stroke-linecap="round"/><path d="M290 120l-12-30 30-6 14 28z" fill="${A2}" stroke="${W}" stroke-width="4"/><circle cx="300" cy="290" r="40" fill="${G}" stroke="${W}" stroke-width="6"/><path d="M280 290h40M300 270v40" stroke="${A}" stroke-width="8"/>`,
  'g-travel': `<rect x="100" y="130" width="200" height="170" rx="20" fill="${G}" stroke="${W}" stroke-width="6"/><path d="M155 130v-25q0-15 15-15h60q15 0 15 15v25" fill="none" stroke="${W}" stroke-width="6"/><path d="M100 215h200" stroke="${A}" stroke-width="8"/><rect x="185" y="200" width="30" height="30" rx="6" fill="${A2}"/><circle cx="140" cy="318" r="10" fill="${W}"/><circle cx="260" cy="318" r="10" fill="${W}"/>`,
};
let artN = 0;
function art(kind, {bg = true, label, hidden = false} = {}) {
  const id = 'g' + (artN++);
  return `<svg viewBox="0 0 400 400" ${hidden ? 'aria-hidden="true" focusable="false"' : `role="img" aria-label="${label || 'Product illustration'}"`} xmlns="http://www.w3.org/2000/svg">
   ${bg ? `<defs><radialGradient id="${id}" cx="70%" cy="25%" r="80%"><stop offset="0" stop-color="#E9E0FF"/><stop offset=".55" stop-color="#F7F4FF"/><stop offset="1" stop-color="#FFFFFF"/></radialGradient></defs>
   <rect width="400" height="400" fill="url(#${id})"/><circle cx="200" cy="210" r="150" fill="none" stroke="#DDD3FF" stroke-width="2"/>` : ''}
   ${drawings[kind] || drawings.generic}</svg>`;
}

/* Photo with SVG fallback: the SVG sits underneath; if the photo fails it is removed */
function pic(p, cls = '', eager = false) {
  const img = p.noimg ? '' : `<img src="assets/img/${p.id}.webp" alt="${p.name}" width="800" height="800" ${eager ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"'} decoding="async" onerror="var s=this.previousElementSibling;if(s){s.removeAttribute('aria-hidden');s.setAttribute('role','img');s.setAttribute('aria-label',this.alt)}this.remove()">`;
  return `<div class="pic ${cls}">${art(p.art, {label: p.name, hidden: !p.noimg})}${img}</div>`;
}

/* ---------- Products ---------- */
const PRODUCTS = [
  {id:'trunk-organizer', name:'Trunk Organizer', price:28.99, cat:'Organisation', art:'trunk',
   short:'Foldable, multiple compartments, non-slip. No more chaos in the boot.',
   feat:['Multiple compartments with reinforced dividers','Folds flat when you need the space','Non-slip base / hook-and-loop strips','Tough, wipe-clean fabric']},
  {id:'dog-car-seat-cover', name:'Dog Car Seat Cover', price:28.99, cat:'Dog', art:'dog', badge:'Dog favourite',
   short:'Protects the back seat from hair, dirt and claws.',
   feat:['Water-repellent surface','Attaches to the headrests','Side flaps keep dirt off the doors','Easy to shake out and wipe clean']},
  {id:'backseat-organizer-tray', name:'Back Seat Organizer with Fold-Down Tray', price:38.99, cat:'Organisation', art:'backseat', badge:'New',
   short:'Fold-down tray, pockets and holders – your back seat becomes base camp.',
   feat:['Fold-down tray for snacks and colouring books','Multiple pockets for bottles and tablets (no electronics)','Attaches to the headrest','Protects the seat back from kick marks']},
  {id:'umbrella-windshield-sunshade', name:'Umbrella Windshield Sunshade', price:28.99, cat:'Comfort', art:'umbrella', badge:'Summer hit',
   short:'Opens like an umbrella – beat the heat in seconds.',
   feat:['Opens in a few seconds','Reflective outer side','Packs away small with a sleeve','Fits most windshields (check dimensions)']},
  {id:'magnetic-phone-mount', name:'Magnetic Phone Mount', price:18.99, cat:'Comfort', art:'phone', badge:'Bestseller',
   short:'Strong magnet, no cable, no battery. Phone on – done.',
   feat:['Purely magnetic – no power, no cable','Includes adhesive metal plates','Rotates for portrait and landscape','Mounts on dashboard / air vent']},
  {id:'oxford-organizer', name:'Oxford Organizer Bag', price:18.99, cat:'Organisation', art:'oxford',
   short:'Compact bag made of tough Oxford fabric for all the small stuff.',
   feat:['Hard-wearing Oxford fabric','Multiple inner compartments','Carry handle','Fits in the boot or footwell']},
  {id:'under-seat-box', name:'Under-Seat Storage Box', price:16.99, cat:'Organisation', art:'underseat',
   short:'Hidden storage under the seat – out of sight, within reach.',
   feat:['Low profile to fit under the seat','With lid','For hi-vis vest, gloves, documents','Easy to take out']},
  {id:'snow-brush-ice-scraper', name:'Snow Brush & Ice Scraper', price:18.99, cat:'Winter', art:'snow',
   short:'Brush and scraper in one – for icy mornings.',
   feat:['Soft bristles, gentle on paint','Strong ice-scraper edge','Grippy handle','Compact enough for the boot']},
  {id:'car-cleaning-kit', name:'Car Cleaning Kit', price:13.99, cat:'Car Care', art:'clean',
   short:'Microfibre cloths & accessories for a spotless cockpit.',
   feat:['Several microfibre cloths','For interior, windows and dashboard','Washable and reusable','No cleaning chemicals included']},
  {id:'seat-gap-filler', name:'Seat Gap Filler (2-pack)', price:13.99, cat:'Organisation', art:'gap',
   short:'Never lose your phone, keys or fries down the seat gap again.',
   feat:['2 pieces – driver and passenger side','Flexible material, simply tuck it in','Fits most vehicles','Wipe-clean']},
  // --- Car Care (textiles & brushes only – no chemicals) ---
  {id:'microfiber-towels-10', name:'Microfiber Towels 10-Pack', price:13.99, cat:'Car Care', art:'towels', badge:'Value pack',
   short:'Ten soft all-rounders for body, interior and glass. Wash, reuse, repeat.',
   feat:['10 microfibre cloths in one pack','Listed size approx. 30×30 cm each — GSM is not listed','For body, interior and glass — see the size and use guide','Machine washable, wash separately, no fabric softener']},
  {id:'drying-towel-1200', name:'XXL Drying Towel 1200 GSM', price:23.99, cat:'Car Care', art:'drytowel', badge:'Detailer pick',
   short:'Twisted-loop monster towel, approx. 60×90 cm – dries a whole car in one go.',
   feat:['Double-sided twisted-loop microfibre','Approx. 60×90 cm, 1200 GSM','Soaks up a huge amount of water','Reduces water spots without chemicals']},
  {id:'wash-mitt-2', name:'Chenille Wash Mitt (2-pack)', price:13.99, cat:'Car Care', art:'mitt',
   short:'Plush chenille fingers trap dirt away from your paint. One for top, one for bottom.',
   feat:['2 mitts — one for upper panels, one for lower panels','Listed size approx. 24×17 cm each','Soft chenille microfibre, elastic cuff','Machine washable — rinse before first use']},
  {id:'detailing-brush-set-5', name:'Detailing Brush Set (5 pcs)', price:15.99, cat:'Car Care', art:'brushes',
   short:'Five soft-bristle brushes, larger head to smaller head, for vents, badges, seams and tight gaps.',
   feat:['5 brushes, listed approx. 16–22 cm each — no separate length per brush','See the use guide for which head suits which surface','Soft bristles, no metal parts — test on a hidden spot before trim','Use dry or with water']},
  {id:'wheel-brush', name:'Long Wheel & Rim Brush', price:18.99, cat:'Car Care', art:'wheelbrush',
   short:'Reaches deep between spokes and behind the rim – your knuckles say thanks.',
   feat:['Long, flexible handle','Soft head, gentle on rims','Works with plain water / your own wash','Hang loop for storage']},
  {id:'glass-towels-3', name:'Waffle Glass Towels (3-pack)', price:15.99, cat:'Car Care', art:'waffle',
   short:'Waffle-weave microfibre for streak-free windows and mirrors.',
   feat:['3 waffle-weave cloths, approx. 40×40 cm','Low-lint finish for glass','Fast drying','Machine washable']},
  {id:'applicator-pads-5', name:'Applicator Pads (5-pack)', price:11.99, cat:'Car Care', art:'pads',
   short:'Soft foam/microfibre pads with finger pocket – for whatever product you already use.',
   feat:['5 pads in one pack','Finger pocket for control','Washable and reusable','Sold without any chemical product']},
  // --- More car gear ---
  {id:'windshield-frost-cover', name:'Magnetic Windshield Frost Cover', price:28.99, cat:'Winter', art:'frost', badge:'Winter hit',
   short:'Put it on at night, pull it off in the morning – no scraping.',
   feat:['Covers windshield and wipers','Magnets + door flaps hold it in wind','Water-resistant fabric','Folds into a small bag']},
  {id:'neck-pillow', name:'Memory Foam Neck Pillow', price:18.99, cat:'Comfort', art:'neck',
   short:'Clips to the headrest for comfy long drives.',
   feat:['Memory foam core','Adjustable headrest strap','Removable, washable cover','Universal fit']},
  {id:'neck-lumbar-set', name:'Neck & Lumbar Cushion Set', price:33.99, cat:'Comfort', art:'lumbar', badge:'Road trip',
   short:'Neck pillow plus back cushion – made for the long haul.',
   feat:['Neck pillow + lumbar cushion','Memory foam','Adjustable straps','Removable, washable covers']},
  // --- Phone mounts, brushes, towels, dog gear (with variants) ---
  {id:'magnetic-dashboard-mount', name:'Magnetic Dashboard Phone Mount', price:16.99, cat:'Comfort', art:'phone', mount:true, magnet:true,
   short:'Low-profile magnetic holder for the dashboard. No cable, no battery.',
   feat:['Purely magnetic - no power, no cable','Includes adhesive metal plates','Adhesive pad for the dashboard - check the surface first','Rotates for portrait and landscape'],
   variants:{label:'Colour',opts:[{id:'black',n:'Black',add:0},{id:'silver',n:'Silver',add:0},{id:'grey',n:'Grey',add:0}]}},
  {id:'magnetic-vent-mount', name:'Magnetic Air Vent Phone Mount', price:14.99, cat:'Comfort', art:'phone', mount:true, magnet:true,
   short:'Clips onto the air vent - magnet holds the phone, nothing else needed.',
   feat:['Purely magnetic - no power, no cable','Clip fits most air-vent slats (check yours)','Includes adhesive metal plates','Rotates for portrait and landscape'],
   variants:{label:'Option',opts:[{id:'standard-clip',n:'Standard clip',add:0},{id:'heavy-duty-clip',n:'Heavy-duty clip',add:2.00},{id:'2-pack',n:'2-pack',add:13.00}]}},
  {id:'magnetic-cd-slot-mount', name:'Magnetic CD Slot Phone Mount', price:15.99, cat:'Comfort', art:'cdslot', mount:true, magnet:true,
   short:'Slides into the CD slot for a sturdy, eye-level phone spot.',
   feat:['Purely magnetic - no power, no cable','Fits into a standard CD slot (check your car)','Includes adhesive metal plates','Rotates for portrait and landscape'],
   variants:{label:'Option',opts:[{id:'standard-arm-black',n:'Standard arm - Black',add:0},{id:'standard-arm-silver',n:'Standard arm - Silver',add:0},{id:'long-arm-black',n:'Long arm - Black',add:3.00}]}},
  {id:'magnetic-mirror-mount', name:'Magnetic Rear-View Mirror Phone Mount', price:20.99, cat:'Comfort', art:'mirror', mount:true, magnet:true,
   short:'Straps onto the rear-view mirror for a high, easy-to-see position.',
   feat:['Purely magnetic - no power, no cable','Adjustable strap for the mirror housing','Must not block your view of the road','Includes adhesive metal plates'],
   variants:{label:'Option',opts:[{id:'black',n:'Black',add:0},{id:'silver',n:'Silver',add:0},{id:'2-pack-black',n:'2-pack - Black',add:18.00}]}},
  {id:'suction-cup-windshield-phone-mount', name:'Suction Cup Windshield Phone Mount (Magnetic)', price:17.99, cat:'Comfort', art:'suction', mount:true, magnet:true,
   short:'Sticks to the windshield or dashboard with a suction cup, magnetic head.',
   feat:['Suction-cup base with magnetic head','Includes adhesive metal plates','Check local rules before mounting on the windshield','Rotates for portrait and landscape'],
   variants:{label:'Arm',opts:[{id:'short-arm',n:'Short arm',add:0},{id:'long-arm',n:'Long arm',add:2.00},{id:'flexible-gooseneck',n:'Flexible gooseneck',add:4.00}]}},
  {id:'motorcycle-handlebar-phone-mount', name:'Handlebar Phone Mount (Bike & Motorcycle)', price:21.99, cat:'Comfort', art:'handlebar', mount:true,
   short:'Clamps onto the handlebar for navigation on bikes, scooters and motorcycles.',
   feat:['Clamp fits handlebar tubes (check diameter)','Adjustable viewing angle','Secure the phone before every ride','Quick to remove'],
   variants:{label:'Fit',opts:[{id:'bicycle-scooter-handlebar',n:'Bicycle / scooter handlebar',add:0},{id:'motorcycle-handlebar',n:'Motorcycle handlebar',add:3.00},{id:'mirror-stem-mount',n:'Mirror-stem mount',add:2.00}]}},
  {id:'magnetic-mini-phone-holder', name:'Mini Magnetic Phone Holder (Adhesive)', price:7.99, cat:'Comfort', art:'phone', mount:true, magnet:true,
   short:'Compact adhesive magnetic plate holder for small spaces.',
   feat:['Purely magnetic - no power, no cable','Small footprint, sticks to flat surfaces','Includes adhesive metal plates','Portrait or landscape'],
   variants:{label:'Colour',opts:[{id:'black',n:'Black',add:0},{id:'white',n:'White',add:0},{id:'2-pack-black',n:'2-pack Black',add:7.00}]}},
  {id:'extra-long-wheel-brush', name:'Extra-Long Wheel Brush', price:21.99, cat:'Car Care', art:'wheelbrush',
   short:'Extra-long handle for deep wheel arches and wide rims.',
   feat:['Extra-long, flexible handle','Soft head, gentle on rims','Use with plain water or your own wash','Hang loop for storage'],
   variants:{label:'Colour',opts:[{id:'black-handle',n:'Black handle',add:0},{id:'orange-handle',n:'Orange handle',add:0}]}},
  {id:'interior-dusting-brush', name:'Soft Interior Dusting Brush', price:8.99, cat:'Car Care', art:'brushes',
   short:'Very soft bristles for dashboard, vents and screens areas.',
   feat:['Soft bristles, gentle on trim','Use dry','Slim head fits tight spaces','Washable'],
   variants:{label:'Colour',opts:[{id:'black',n:'Black',add:0},{id:'grey',n:'Grey',add:0},{id:'orange',n:'Orange',add:0}]}},
  {id:'scrub-brush-mats', name:'Bristle Scrub Brush (Mats & Carpets)', price:7.99, cat:'Car Care', art:'brushes',
   short:'Firmer bristles for floor mats, carpets and fabric seats.',
   feat:['Firm bristles for dirt in fabric','Comfortable grip','Use dry or with water','Test on a hidden spot first'],
   variants:{label:'Option',opts:[{id:'medium-bristle',n:'Medium bristle',add:0},{id:'stiff-bristle',n:'Stiff bristle',add:0},{id:'long-handle-medium-bristle',n:'Long handle, medium bristle',add:4.00}]}},
  {id:'crevice-vent-brush-set', name:'Crevice & Vent Brush Set', price:10.99, cat:'Car Care', art:'brushes',
   short:'Slim brushes for vents, seams, cup holders and gaps.',
   feat:['Slim heads for tight gaps','Soft bristles, gentle on trim','Use dry or with water','No metal parts'],
   variants:{label:'Pack',opts:[{id:'3-piece-set',n:'3-piece set',add:0},{id:'5-piece-set',n:'5-piece set',add:3.00},{id:'8-piece-set',n:'8-piece set',add:7.00}]}},
  {id:'microfiber-towels-40-6', name:'Microfiber Towels 40x40 cm (6-pack)', price:12.99, cat:'Car Care', art:'towels',
   short:'Six larger all-round cloths for body, interior and glass.',
   feat:['6 microfibre cloths in one pack','Approx. 40x40 cm - confirm size/GSM with supplier','Lint-free, scratch-free on paint','Machine washable, no fabric softener'],
   variants:{label:'Colour',opts:[{id:'yellow',n:'Yellow',add:0},{id:'blue',n:'Blue',add:0},{id:'grey',n:'Grey',add:0}]}},
  {id:'microfiber-towels-30-20', name:'Microfiber Towels 30x30 cm (20-pack)', price:18.99, cat:'Car Care', art:'towels',
   short:'Big value pack of small cloths - one for every job.',
   feat:['20 microfibre cloths in one pack','Approx. 30x30 cm - confirm size/GSM with supplier','Lint-free, scratch-free on paint','Machine washable, no fabric softener'],
   variants:{label:'Option',opts:[{id:'20-pack-grey',n:'20-pack Grey',add:0},{id:'20-pack-mixed-colours',n:'20-pack Mixed colours',add:0},{id:'40-pack-mixed-colours',n:'40-pack Mixed colours',add:12.00}]}},
  {id:'large-microfiber-towel-60x90', name:'Large Microfiber Towel 60x90 cm', price:17.99, cat:'Car Care', art:'drytowel',
   short:'Big soft towel for drying and buffing larger panels.',
   feat:['Approx. 60x90 cm','Soft, absorbent microfibre','Lint-free finish','Machine washable'],
   variants:{label:'Colour',opts:[{id:'blue',n:'Blue',add:0},{id:'grey',n:'Grey',add:0},{id:'black',n:'Black',add:0}]}},
  {id:'waffle-glass-polish-towel', name:'Waffle Glass-Polish Towel', price:7.99, cat:'Car Care', art:'waffle',
   short:'Waffle-weave towel for streak-free glass and mirrors.',
   feat:['Waffle-weave microfibre','Low-lint finish for glass','Fast drying','Machine washable'],
   variants:{label:'Option',opts:[{id:'blue',n:'Blue',add:0},{id:'grey',n:'Grey',add:0},{id:'2-pack-blue',n:'2-pack Blue',add:7.00}]}},
  {id:'dog-grooming-brush', name:'Pet Hair Grooming Brush', price:10.99, cat:'Dog', art:'dogbrush',
   short:'Gentle brush to keep fur off the seats before the ride.',
   feat:['Soft pins, gentle on the coat','Comfortable grip','Easy to clean','Use on your dog before the trip'],
   variants:{label:'Size',opts:[{id:'small',n:'Small',add:0},{id:'medium',n:'Medium',add:2.00},{id:'large',n:'Large',add:4.00}]}},
  {id:'dog-paw-cleaning-brush', name:'Paw Cleaning Brush (Silicone)', price:8.99, cat:'Dog', art:'paw',
   short:'Soft silicone brush for muddy paws before they hit the seats.',
   feat:['Soft silicone bristles','Easy to rinse clean','Compact, fits in the glovebox','Use with plain water'],
   variants:{label:'Colour',opts:[{id:'grey',n:'Grey',add:0},{id:'blue',n:'Blue',add:0},{id:'orange',n:'Orange',add:0}]}},
  {id:'pet-hair-rubber-brush', name:'Rubber Pet Hair Remover Brush (Seats & Carpets)', price:7.99, cat:'Dog', art:'rubber',
   short:'Rubber bristles lift pet hair from seats and carpets.',
   feat:['Rubber bristles pull hair into rows','For fabric seats and carpets','No batteries, no cable','Washable'],
   variants:{label:'Option',opts:[{id:'single',n:'Single',add:0},{id:'telescopic-handle',n:'Telescopic handle',add:5.00},{id:'2-pack',n:'2-pack',add:6.00}]}},
  {id:'dog-car-seat-belt-harness', name:'Dog Car Seat Belt Harness', price:15.99, cat:'Dog', art:'harness',
   short:'Adjustable harness that clips to the car seat belt.',
   feat:['Adjustable chest and neck straps','Attaches to the seat-belt buckle','Padded for comfort','Check size chart before ordering'],
   variants:{label:'Size',opts:[{id:'s',n:'S',add:0},{id:'m',n:'M',add:0},{id:'l',n:'L',add:2.00}]}},
  {id:'dog-car-water-bottle', name:'Portable Dog Water Bottle', price:11.99, cat:'Dog', art:'bottle',
   short:'Leak-resistant bottle with a built-in drinking tray for car trips.',
   feat:['Built-in fold-out drinking tray','Leak-resistant lid','Fits in the door pocket','Easy to clean'],
   variants:{label:'Capacity',opts:[{id:'350-ml',n:'350 ml',add:0},{id:'550-ml',n:'550 ml',add:2.00},{id:'750-ml',n:'750 ml',add:4.00}]}},
  {id:'pet-hair-roller', name:'Pet Hair Roller (Reusable)', price:8.99, cat:'Dog', art:'roller',
   short:'Reusable roller that picks up pet hair from seats and clothes.',
   feat:['Reusable, no sticky sheets needed','Collects hair in a bin','No batteries, no cable','Easy to empty'],
   variants:{label:'Option',opts:[{id:'standard',n:'Standard',add:0},{id:'large',n:'Large',add:3.00},{id:'2-pack',n:'2-pack',add:7.00}]}},
  // --- General merchandise (added Oct 2026) ---
  {id:'foldable-storage-boxes-3', name:'Foldable Storage Boxes (3-Set)', price:18.99, cat:'Home', art:'g-home',
   short:'Three fabric storage cubes that fold flat when you do not need them.',
   feat:['Set of 3 boxes with reinforced walls','Folds flat for easy storage','Carry handles on both sides','Wipe-clean fabric'],
   variants:{label:'Colour',opts:[{id:'grey',n:'Grey',add:0},{id:'beige',n:'Beige',add:0},{id:'navy',n:'Navy',add:0}]}},
  {id:'vacuum-storage-bags', name:'Vacuum Storage Bags for Clothes', price:14.99, cat:'Home', art:'g-home',
   short:'Squeeze out the air and fit twice as much into the wardrobe.',
   feat:['Reusable bags with double-zip seal','Works with a normal vacuum cleaner','Protects against dust and moisture','Great for duvets and winter clothes'],
   variants:{label:'Pack',opts:[{id:'6-bags',n:'6 bags',add:0},{id:'10-bags',n:'10 bags',add:6.00}]}},
  {id:'non-slip-clothes-hangers-20', name:'Non-Slip Clothes Hangers (20-Pack)', price:15.99, cat:'Home', art:'g-home',
   short:'Slim velvet-finish hangers that keep clothes from sliding off.',
   feat:['20 hangers in one pack','Slim profile saves wardrobe space','Non-slip flocked surface','Swivel hook'],
   variants:{label:'Colour',opts:[{id:'black',n:'Black',add:0},{id:'grey',n:'Grey',add:0},{id:'white',n:'White',add:0}]}},
  {id:'foldable-laundry-basket', name:'Foldable Laundry Basket', price:13.99, cat:'Home', art:'g-home',
   short:'Pop-up basket with handles - folds flat when empty.',
   feat:['Collapsible, stores flat','Sturdy carry handles','Breathable mesh sides','Approx. 50 L capacity - confirm with supplier'],
   variants:{label:'Colour',opts:[{id:'grey',n:'Grey',add:0},{id:'white',n:'White',add:0}]}},
  {id:'drawer-organizer-set', name:'Drawer Organizer Set', price:11.99, cat:'Home', art:'g-home',
   short:'Modular trays that bring order to any drawer.',
   feat:['Set of several sizes','Mix and match to fit your drawer','Non-slip feet','Easy to wipe clean'],
   variants:{label:'Pack',opts:[{id:'6-piece',n:'6-piece set',add:0},{id:'12-piece',n:'12-piece set',add:7.00}]}},
  {id:'led-motion-night-lights-2', name:'LED Motion-Sensor Night Lights (2-Pack)', price:12.99, cat:'Home', art:'g-home',
   short:'Soft light that switches on when you walk by - hallway, stairs, bathroom.',
   feat:['2 lights in one pack','Motion and dusk sensor','Warm or cool white light','Stick-on or magnetic mount'],
   variants:{label:'Light',opts:[{id:'warm-white',n:'Warm white',add:0},{id:'cool-white',n:'Cool white',add:0}]}},
  {id:'adhesive-wall-hooks-20', name:'Adhesive Wall Hooks (20-Pack)', price:6.99, cat:'Home', art:'g-home',
   short:'Hang it up without drilling - and remove it without marks.',
   feat:['20 hooks in one pack','Strong self-adhesive pad','No drilling required','Clean, flat surfaces only'],
   variants:{label:'Colour',opts:[{id:'transparent',n:'Transparent',add:0},{id:'white',n:'White',add:0},{id:'black',n:'Black',add:0}]}},
  {id:'shoe-rack', name:'Stackable Shoe Rack', price:23.99, cat:'Home', art:'g-home',
   short:'Tool-free stackable rack for the hallway or wardrobe.',
   feat:['Stack up to 3-4 levels','Holds multiple pairs','Sturdy metal/plastic frame','Easy assembly'],
   variants:{label:'Size',opts:[{id:'2-tier',n:'2 tiers',add:0},{id:'3-tier',n:'3 tiers',add:6.00},{id:'4-tier',n:'4 tiers',add:11.00}]}},
  {id:'silicone-utensil-set', name:'Silicone Kitchen Utensil Set', price:18.99, cat:'Kitchen', art:'g-kitchen',
   short:'Spatula, spoon, whisk and more - gentle on non-stick pans.',
   feat:['Heat-resistant silicone heads','Hang-up loops','Dishwasher safe','BPA-free'],
   variants:{label:'Pack',opts:[{id:'5-piece',n:'5-piece',add:0},{id:'10-piece',n:'10-piece',add:8.00}]}},
  {id:'bamboo-cutting-board', name:'Bamboo Cutting Board', price:16.99, cat:'Kitchen', art:'g-kitchen',
   short:'Solid bamboo board with a juice groove.',
   feat:['Natural bamboo','Juice groove around the edge','Gentle on knife edges','Hand wash only'],
   variants:{label:'Size',opts:[{id:'small',n:'Small',add:0},{id:'medium',n:'Medium',add:4.00},{id:'large',n:'Large',add:8.00}]}},
  {id:'glass-food-storage-set', name:'Glass Food-Storage Container Set (Empty)', price:28.99, cat:'Kitchen', art:'g-kitchen',
   short:'Glass containers with snap lids - sold empty.',
   feat:['Borosilicate glass','Airtight snap-lock lids','Oven, microwave and freezer safe (without lid)','Stackable'],
   variants:{label:'Pack',opts:[{id:'3-containers',n:'3 containers',add:0},{id:'5-containers',n:'5 containers',add:10.00}]}},
  {id:'silicone-baking-mat', name:'Silicone Baking Mat', price:8.99, cat:'Kitchen', art:'g-kitchen',
   short:'Reusable non-stick mat - no more baking paper.',
   feat:['Non-stick surface','Reusable for years','Fits a standard baking tray','Dishwasher safe'],
   variants:{label:'Pack',opts:[{id:'1-mat',n:'1 mat',add:0},{id:'2-mats',n:'2 mats',add:6.00}]}},
  {id:'cork-trivet', name:'Cork Trivet for Hot Pots & Dishes', price:7.99, cat:'Kitchen', art:'g-kitchen',
   short:'Natural cork mat that protects your table and worktop from hot pots, pans and dishes.',
   feat:['Natural cork, heat-resistant','Protects table and worktop','Non-slip underside','Easy to wipe clean'],
   variants:{label:'Option',opts:[{id:'round-20',n:'Round 20 cm',add:0},{id:'round-set-3',n:'Round set of 3 (different sizes)',add:5.00}]}},
  {id:'digital-kitchen-scale', name:'Digital Kitchen Scale', price:14.99, cat:'Kitchen', art:'g-kitchen',
   short:'Slim scale with clear display, accurate to the gram.',
   feat:['Up to approx. 5 kg capacity','Tare function','Switches between g and oz','Batteries not included - check supplier'],
   variants:{label:'Colour',opts:[{id:'black',n:'Black',add:0},{id:'white',n:'White',add:0}]}},
  {id:'a4-printer-paper-500', name:'A4 Printer Paper (500 Sheets)', price:5.99, cat:'Office', art:'g-office',
   short:'Bright white 80 g/m2 copy paper for every printer.',
   feat:['500 sheets A4','80 g/m2','Suitable for laser and inkjet','Jam-free feed'],
   variants:{label:'Pack',opts:[{id:'1-ream',n:'1 ream (500)',add:0},{id:'5-reams',n:'5 reams (2,500)',add:21.00}]}},
  {id:'desk-organizer', name:'Desk Organizer', price:15.99, cat:'Office', art:'g-office',
   short:'Pen cups, compartments and a phone slot for a tidy desk.',
   feat:['Multiple compartments','Stable, non-slip base','Fits pens, notes and cards','Easy to clean'],
   variants:{label:'Colour',opts:[{id:'black',n:'Black',add:0},{id:'white',n:'White',add:0},{id:'wood',n:'Wood look',add:2.00}]}},
  {id:'aluminium-laptop-stand', name:'Aluminium Laptop Stand', price:28.99, cat:'Office', art:'g-office',
   short:'Raises your laptop to eye level and improves airflow.',
   feat:['Sturdy aluminium','Adjustable angle','Folds flat for travel','Non-slip pads'],
   variants:{label:'Colour',opts:[{id:'silver',n:'Silver',add:0},{id:'space-grey',n:'Space grey',add:0}]}},
  {id:'a5-notebooks-3', name:'A5 Notebooks (3-Set)', price:10.99, cat:'Office', art:'g-office',
   short:'Three softcover notebooks for notes, lists and ideas.',
   feat:['3 notebooks in one set','A5 size','Approx. 80 pages each','Thick, bleed-resistant paper'],
   variants:{label:'Ruling',opts:[{id:'lined',n:'Lined',add:0},{id:'dotted',n:'Dotted',add:0},{id:'blank',n:'Blank',add:0}]}},
  {id:'xl-mouse-pad', name:'XL Mouse Pad', price:11.99, cat:'Office', art:'g-office',
   short:'Extra-large desk mat for mouse and keyboard.',
   feat:['Large surface, approx. 80x30 cm - confirm with supplier','Smooth, precise glide','Non-slip rubber base','Stitched edges'],
   variants:{label:'Colour',opts:[{id:'black',n:'Black',add:0},{id:'grey',n:'Grey',add:0}]}},
  {id:'cat-litter-box', name:'Cat Litter Box', price:13.99, cat:'Pets', art:'g-pets',
   short:'Open plastic litter tray with raised rim - easy to clean. Sold empty, litter not included.',
   feat:['Durable plastic','Raised rim keeps litter in','Smooth surface, easy to wipe clean','Sold empty'],
   variants:{label:'Size',opts:[{id:'m',n:'M',add:0},{id:'l',n:'L',add:4.00},{id:'xl',n:'XL (hooded)',add:10.00}]}},
  {id:'cat-scratching-post', name:'Cat Scratching Post', price:23.99, cat:'Pets', art:'g-pets',
   short:'Sisal-wrapped post on a stable base.',
   feat:['Natural sisal rope','Stable weighted base','Saves your sofa','Easy assembly'],
   variants:{label:'Height',opts:[{id:'50-cm',n:'50 cm',add:0},{id:'70-cm',n:'70 cm',add:6.00},{id:'90-cm',n:'90 cm',add:12.00}]}},
  {id:'retractable-dog-leash', name:'Retractable Dog Leash', price:15.99, cat:'Pets', art:'g-pets',
   short:'Extendable leash with one-hand lock and brake.',
   feat:['Up to approx. 5 m extension','One-button brake and lock','Comfortable non-slip handle','Check the weight rating for your dog'],
   variants:{label:'Size',opts:[{id:'s-up-to-15-kg',n:'S (up to 15 kg)',add:0},{id:'m-up-to-25-kg',n:'M (up to 25 kg)',add:3.00},{id:'l-up-to-50-kg',n:'L (up to 50 kg)',add:6.00}]}},
  {id:'washable-pet-bed', name:'Washable Pet Bed', price:26.99, cat:'Pets', art:'g-pets',
   short:'Soft, round bed with raised rim for cats and small dogs.',
   feat:['Plush, soft filling','Raised rim for support','Machine washable cover','Non-slip bottom'],
   variants:{label:'Size',opts:[{id:'s',n:'S',add:0},{id:'m',n:'M',add:6.00},{id:'l',n:'L',add:12.00}]}},
  {id:'toilet-paper-24', name:'Toilet Paper (24 Rolls)', price:10.99, cat:'Cleaning', art:'g-clean',
   short:'Soft 3-ply toilet paper, bulk pack.',
   feat:['24 rolls','3-ply, soft and strong','Septic-tank safe','Plastic-light packaging - confirm with supplier'],
   variants:{label:'Pack',opts:[{id:'24-rolls',n:'24 rolls',add:0},{id:'48-rolls',n:'48 rolls',add:10.00}]}},
  {id:'flat-microfibre-mop', name:'Flat Microfibre Mop', price:23.99, cat:'Cleaning', art:'g-clean',
   short:'Flat mop with washable pads - use with plain water.',
   feat:['Swivel head reaches under furniture','2 washable microfibre pads','Telescopic handle','Dry or damp use'],
   variants:{label:'Option',opts:[{id:'2-pads',n:'2 pads',add:0},{id:'4-pads',n:'4 pads',add:5.00}]}},
  {id:'sponge-set', name:'Cleaning Sponge Set', price:5.99, cat:'Cleaning', art:'g-clean',
   short:'Soft and scrubbing sponges for dishes and surfaces.',
   feat:['Dual-sided sponges','Soft side and scrubbing side','Pack of several pieces','Sold without any cleaning product'],
   variants:{label:'Pack',opts:[{id:'6-pack',n:'6-pack',add:0},{id:'12-pack',n:'12-pack',add:5.00}]}},
  {id:'telescopic-duster', name:'Telescopic Microfibre Duster', price:13.99, cat:'Cleaning', art:'g-clean',
   short:'Extendable duster for ceilings, shelves and blinds.',
   feat:['Extends to reach high places','Bendable head','Washable microfibre heads','Use dry'],
   variants:{label:'Option',opts:[{id:'standard',n:'Standard',add:0},{id:'extra-long',n:'Extra long',add:4.00}]}},
  {id:'reusable-lint-roller', name:'Reusable Lint Roller', price:7.99, cat:'Cleaning', art:'g-clean',
   short:'Washable roller that removes lint and hair - no sticky sheets to buy.',
   feat:['Washable, reusable sticky roller','Works on clothes and upholstery','Rinse with water to refresh','Comfortable handle'],
   variants:{label:'Option',opts:[{id:'single',n:'Single',add:0},{id:'2-pack',n:'2-pack',add:6.00}]}},
  {id:'cotton-bath-towel-set', name:'Cotton Bath Towel Set', price:23.99, cat:'Bathroom', art:'g-bath',
   short:'Soft, absorbent 100% cotton towels.',
   feat:['100% cotton','Highly absorbent','Quick drying','Machine washable'],
   variants:{label:'Set',opts:[{id:'2-bath-towels',n:'2 bath towels',add:0},{id:'4-pieces',n:'4 pieces (2 bath + 2 hand)',add:10.00},{id:'6-pieces',n:'6 pieces',add:20.00}]}},
  {id:'non-slip-bath-mat', name:'Non-Slip Bath Mat', price:13.99, cat:'Bathroom', art:'g-bath',
   short:'Soft mat with a grippy backing for wet floors.',
   feat:['Anti-slip rubber backing','Soft, quick-drying surface','Machine washable','Fits in front of tub or shower'],
   variants:{label:'Colour',opts:[{id:'grey',n:'Grey',add:0},{id:'white',n:'White',add:0},{id:'blue',n:'Blue',add:0}]}},
  {id:'wall-shower-caddy', name:'Wall Shower Caddy (Empty)', price:17.99, cat:'Bathroom', art:'g-bath',
   short:'Rustproof corner shelf - mounts without drilling.',
   feat:['Adhesive or drill-free mounting','Rustproof metal','2-3 tiers for bottles and accessories','Sold empty'],
   variants:{label:'Option',opts:[{id:'2-tier',n:'2 tiers',add:0},{id:'3-tier',n:'3 tiers',add:5.00}]}},
  {id:'screwdriver-bit-set', name:'Screwdriver & Bit Set', price:18.99, cat:'Tools', art:'g-tools',
   short:'Handle with interchangeable bits for everyday repairs.',
   feat:['Interchangeable bits','Magnetic tip','Ergonomic handle','Storage case'],
   variants:{label:'Pack',opts:[{id:'32-pieces',n:'32 pieces',add:0},{id:'60-pieces',n:'60 pieces',add:9.00}]}},
  {id:'rechargeable-led-flashlight', name:'Rechargeable LED Flashlight', price:20.99, cat:'Tools', art:'g-tools',
   short:'Bright, compact torch with USB charging.',
   feat:['Bright LED','USB rechargeable','Several light modes','Water-resistant body'],
   variants:{label:'Option',opts:[{id:'standard',n:'Standard',add:0},{id:'2-pack',n:'2-pack',add:17.00}]}},
  {id:'folding-camping-shovel', name:'Folding Camping Shovel', price:15.99, cat:'Tools', art:'g-tools',
   short:'Compact folding steel shovel with carry pouch - for camping, car boot and garden. No batteries.',
   feat:['Folds down to pocket size','Steel head with serrated edge','Locking handle','Carry pouch included'],
   variants:{label:'Option',opts:[{id:'standard',n:'Standard',add:0},{id:'heavy-duty',n:'Heavy-duty (thicker steel)',add:6.00}]}},
  {id:'garden-hand-trowel', name:'Garden Hand Trowel', price:6.99, cat:'Tools', art:'g-tools',
   short:'Small hand shovel for planting, potting and weeding.',
   feat:['Rust-resistant steel blade','Soft-grip handle','Hanging hole','Depth markings on blade'],
   variants:{label:'Option',opts:[{id:'trowel',n:'Trowel',add:0},{id:'3-piece-set',n:'3-piece set (trowel, fork, cultivator)',add:9.00}]}},
  {id:'snow-shovel', name:'Compact Snow Shovel', price:23.99, cat:'Tools', art:'g-tools',
   short:'Lightweight snow shovel for driveway and car boot - keeps you moving in winter.',
   feat:['Wide scoop','Light but sturdy','Ergonomic D-grip','Fits in most car boots'],
   variants:{label:'Option',opts:[{id:'standard',n:'Standard (fixed handle)',add:0},{id:'telescopic',n:'Telescopic handle',add:5.00}]}},
  {id:'led-flashlight-aaa', name:'LED Flashlight (AAA)', price:8.99, cat:'Tools', art:'g-tools',
   short:'Bright LED torch for 3 x AAA batteries (batteries not included) - no lithium-ion pack.',
   feat:['Uses standard AAA batteries (not included)','Bright LED','Zoom focus','Aluminium body'],
   variants:{label:'Pack',opts:[{id:'single',n:'Single',add:0},{id:'2-pack',n:'2-pack',add:8.00}]}},
  {id:'led-headlamp-aaa', name:'LED Headlamp (3 x AAA)', price:10.99, cat:'Tools', art:'g-tools',
   short:'Hands-free headlamp for 3 x AAA batteries (batteries not included) - no lithium-ion pack.',
   feat:['Uses standard AAA batteries (not included)','Adjustable tilt','Elastic head strap','Several light modes'],
   variants:{label:'Colour',opts:[{id:'black',n:'Black',add:0},{id:'orange',n:'Orange',add:0}]}},
  {id:'pocket-torch-aa', name:'Pocket Torch (AA)', price:6.99, cat:'Tools', art:'g-tools',
   short:'Slim pocket torch for 1 x AA battery (battery not included) - no lithium-ion pack.',
   feat:['Uses 1 standard AA battery (not included)','Pocket clip','Compact aluminium body','Simple push-button'],
   variants:{label:'Pack',opts:[{id:'single',n:'Single',add:0},{id:'3-pack',n:'3-pack',add:8.00}]}},
  {id:'measuring-tape-5m', name:'Measuring Tape 5 m', price:5.99, cat:'Tools', art:'g-tools',
   short:'Compact 5 m steel tape with lock and belt clip. No batteries.',
   feat:['Metric and inch scale','Auto-lock button','Belt clip','Shock-resistant case'],
   variants:{label:'Length',opts:[{id:'3m',n:'3 m',add:0},{id:'5m',n:'5 m',add:2.00},{id:'8m',n:'8 m',add:4.00}]}},
  {id:'adjustable-wrench', name:'Adjustable Wrench', price:11.99, cat:'Tools', art:'g-tools',
   short:'Everyday adjustable spanner for home, bike and car boot.',
   feat:['Chrome-vanadium steel','Smooth thumbwheel','Metric scale on jaw','Non-slip handle'],
   variants:{label:'Size',opts:[{id:'200mm',n:'200 mm',add:0},{id:'250mm',n:'250 mm',add:3.00}]}},
  {id:'plastic-sports-water-bottle', name:'Plastic Sports Water Bottle (Empty)', price:7.99, cat:'SG', art:'g-sg',
   short:'Empty BPA-free plastic sports bottle with leak-proof flip lid. Sold empty.',
   feat:['BPA-free plastic','Leak-proof lid','Wide mouth for easy cleaning','Sold empty'],
   variants:{label:'Capacity',opts:[{id:'500-ml',n:'500 ml',add:0},{id:'750-ml',n:'750 ml',add:2.00},{id:'1000-ml',n:'1 L',add:3.00}]}},
  {id:'shaker-bottle', name:'Shaker Bottle with Mixing Ball (Empty)', price:8.99, cat:'SG', art:'g-sg',
   short:'Empty protein shaker with stainless mixing ball and measuring marks. Sold empty.',
   feat:['BPA-free plastic','Stainless mixing ball','Screw lid with flip cap','Dishwasher-safe lid'],
   variants:{label:'Capacity',opts:[{id:'500-ml',n:'500 ml',add:0},{id:'700-ml',n:'700 ml',add:2.00}]}},
  {id:'gym-bottle-with-straw', name:'Gym Bottle with Straw (Empty)', price:10.99, cat:'SG', art:'g-sg',
   short:'Empty gym bottle with built-in straw and carry handle. Sold empty.',
   feat:['BPA-free plastic','Built-in straw','Carry handle','Leak-proof lid'],
   variants:{label:'Capacity',opts:[{id:'700-ml',n:'700 ml',add:0},{id:'1000-ml',n:'1 L',add:2.00}]}},
  {id:'collapsible-water-bottle', name:'Collapsible Silicone Water Bottle (Empty)', price:8.99, cat:'SG', art:'g-sg',
   short:'Empty fold-flat silicone bottle - packs small in your gym bag. Sold empty.',
   feat:['Food-grade silicone','Folds flat','Carabiner clip','Sold empty'],
   variants:{label:'Capacity',opts:[{id:'500-ml',n:'500 ml',add:0},{id:'750-ml',n:'750 ml',add:2.00}]}},
  {id:'resistance-bands-set', name:'Resistance Bands Set', price:13.99, cat:'SG', art:'g-sg',
   short:'Set of latex resistance loop bands in five strengths for home workouts. No batteries.',
   feat:['5 resistance levels','Natural latex loops','Carry bag','Door anchor-free'],
   variants:{label:'Option',opts:[{id:'5-bands',n:'5 bands',add:0},{id:'5-bands-handles',n:'5 bands + handles',add:6.00}]}},
  {id:'skipping-rope', name:'Adjustable Skipping Rope', price:6.99, cat:'SG', art:'g-sg',
   short:'Speed rope with ball bearings and adjustable length.',
   feat:['Adjustable cable','Ball-bearing handles','Non-slip grips','Lightweight'],
   variants:{label:'Colour',opts:[{id:'black',n:'Black',add:0},{id:'pink',n:'Pink',add:0},{id:'blue',n:'Blue',add:0}]}},
  {id:'yoga-mat', name:'Non-Slip Yoga Mat', price:18.99, cat:'SG', art:'g-sg',
   short:'Cushioned non-slip exercise mat with carry strap.',
   feat:['Non-slip surface','Cushioned TPE foam','Carry strap included','Easy to wipe clean'],
   variants:{label:'Thickness',opts:[{id:'6mm',n:'6 mm',add:0},{id:'10mm',n:'10 mm',add:4.00}]}},
  {id:'microfibre-gym-towel', name:'Microfibre Gym Towel', price:7.99, cat:'SG', art:'g-sg',
   short:'Quick-dry, compact towel for gym and travel.',
   feat:['Quick-drying microfibre','Compact and light','Zip pocket','Machine-washable'],
   variants:{label:'Size',opts:[{id:'40x80',n:'40 x 80 cm',add:0},{id:'50x100',n:'50 x 100 cm',add:3.00}]}},
  {id:'packing-cubes-set', name:'Packing Cubes Set', price:21.99, cat:'Travel', art:'g-travel',
   short:'Compression packing cubes - organise your suitcase.',
   feat:['Set of several sizes','Lightweight, breathable fabric','Zip compression','Easy to wipe clean'],
   variants:{label:'Pack',opts:[{id:'4-pieces',n:'4 pieces',add:0},{id:'6-pieces',n:'6 pieces',add:6.00}]}},
  {id:'waterproof-travel-pouch', name:'Waterproof Travel Pouch', price:8.99, cat:'Travel', art:'g-travel',
   short:'Keeps passports, cards and small items dry.',
   feat:['Waterproof seal','Clear window','Neck cord included','Light and compact'],
   variants:{label:'Colour',opts:[{id:'black',n:'Black',add:0},{id:'blue',n:'Blue',add:0},{id:'orange',n:'Orange',add:0}]}},
];
/* ---------- Dimensions (metric). Typical estimates - verify against the supplier spec before selling ---------- */
const DIMS = {
  'trunk-organizer': {d:'approx. 50 x 33 x 30 cm (L x W x H), folds to approx. 50 x 33 x 5 cm'},
  'dog-car-seat-cover': {d:'approx. 137 x 147 cm (W x L) - fits most rear bench seats'},
  'backseat-organizer-tray': {d:'approx. 60 x 40 cm (H x W), tray approx. 38 x 27 cm'},
  'umbrella-windshield-sunshade': {d:'approx. 130 x 70 cm open, 5 x 5 x 35 cm packed'},
  'magnetic-phone-mount': {d:'approx. 6 x 6 x 4 cm, weight approx. 40 g; fits phones up to approx. 8 cm wide'},
  'oxford-organizer': {d:'approx. 30 x 20 x 15 cm (L x W x H)'},
  'under-seat-box': {d:'approx. 40 x 30 x 12 cm (L x W x H)'},
  'snow-brush-ice-scraper': {d:'approx. 60 cm long, brush head approx. 20 cm wide, weight approx. 350 g'},
  'car-cleaning-kit': {d:'cloths approx. 30 x 30 cm, kit approx. 25 x 20 x 8 cm'},
  'seat-gap-filler': {d:'approx. 45 x 5 x 3 cm per piece (2 pcs)'},
  'microfiber-towels-10': {d:'approx. 30 x 30 cm per cloth (10 pcs)'},
  'drying-towel-1200': {d:'approx. 60 x 90 cm, 1200 GSM'},
  'wash-mitt-2': {d:'approx. 24 x 17 cm per mitt (2 pcs)'},
  'detailing-brush-set-5': {d:'approx. 16-22 cm per brush (5 pcs)'},
  'wheel-brush': {d:'approx. 45 cm long, head approx. 8 cm'},
  'glass-towels-3': {d:'approx. 40 x 40 cm per towel (3 pcs)'},
  'applicator-pads-5': {d:'approx. 10 cm diameter per pad (5 pcs)'},
  'windshield-frost-cover': {d:'approx. 147 x 100 cm (W x H) - check your windshield'},
  'neck-pillow': {d:'approx. 30 x 20 x 10 cm, weight approx. 250 g'},
  'neck-lumbar-set': {d:'neck pillow approx. 30 x 20 x 10 cm; lumbar cushion approx. 33 x 30 x 10 cm'},
  'magnetic-dashboard-mount': {d:'approx. 6.5 x 6.5 x 4 cm, weight approx. 45 g'},
  'magnetic-vent-mount': {d:'approx. 6 x 4 x 5 cm, weight approx. 40 g; clip fits slats up to approx. 5 mm', v:{'standard-clip':'approx. 6 x 4 x 5 cm, slat thickness up to 5 mm','heavy-duty-clip':'approx. 6 x 4 x 5 cm, slat thickness up to 8 mm','2-pack':'2 x approx. 6 x 4 x 5 cm'}},
  'magnetic-cd-slot-mount': {d:'approx. 6 x 4 x 9 cm, arm approx. 6 cm', v:{'long-arm-black':'approx. 6 x 4 x 12 cm, arm approx. 9 cm'}},
  'magnetic-mirror-mount': {d:'approx. 7 x 5 x 6 cm, strap fits mirror housings up to approx. 10 cm wide', v:{'2-pack-black':'2 x approx. 7 x 5 x 6 cm'}},
  'suction-cup-windshield-phone-mount': {d:'base diameter approx. 6.5 cm, arm approx. 10 cm', v:{'short-arm':'arm approx. 10 cm','long-arm':'arm approx. 20 cm','flexible-gooseneck':'gooseneck approx. 30 cm'}},
  'motorcycle-handlebar-phone-mount': {d:'clamp fits handlebars approx. 15-32 mm; fits phones 4.7-6.8 inch', v:{'bicycle-scooter-handlebar':'clamp fits tubes approx. 15-32 mm','motorcycle-handlebar':'clamp fits tubes approx. 22-32 mm','mirror-stem-mount':'fits mirror stems approx. 8-12 mm'}},
  'magnetic-mini-phone-holder': {d:'approx. 5 x 5 x 1 cm, weight approx. 20 g', v:{'2-pack-black':'2 x approx. 5 x 5 x 1 cm'}},
  'extra-long-wheel-brush': {d:'approx. 70 cm long, head approx. 10 cm'},
  'interior-dusting-brush': {d:'approx. 28 cm long, head approx. 6 cm wide'},
  'scrub-brush-mats': {d:'approx. 22 x 6 x 6 cm', v:{'long-handle-medium-bristle':'approx. 45 x 6 x 6 cm'}},
  'crevice-vent-brush-set': {d:'approx. 15-20 cm per brush', v:{'3-piece-set':'3 brushes, approx. 15-20 cm each','5-piece-set':'5 brushes, approx. 15-20 cm each','8-piece-set':'8 brushes, approx. 15-20 cm each'}},
  'microfiber-towels-40-6': {d:'approx. 40 x 40 cm per cloth (6 pcs)'},
  'microfiber-towels-30-20': {d:'approx. 30 x 30 cm per cloth', v:{'20-pack-grey':'20 pcs, approx. 30 x 30 cm','20-pack-mixed-colours':'20 pcs, approx. 30 x 30 cm','40-pack-mixed-colours':'40 pcs, approx. 30 x 30 cm'}},
  'large-microfiber-towel-60x90': {d:'approx. 60 x 90 cm'},
  'waffle-glass-polish-towel': {d:'approx. 40 x 60 cm', v:{'2-pack-blue':'2 pcs, approx. 40 x 60 cm'}},
  'dog-grooming-brush': {d:'approx. 15 x 9 cm head, 5 cm handle', v:{'small':'head approx. 11 x 6 cm','medium':'head approx. 15 x 9 cm','large':'head approx. 18 x 11 cm'}},
  'dog-paw-cleaning-brush': {d:'approx. 7 cm diameter, 9 cm tall', v:{'grey':'approx. 7 cm diameter, 9 cm tall','blue':'approx. 7 cm diameter, 9 cm tall','orange':'approx. 7 cm diameter, 9 cm tall'}},
  'pet-hair-rubber-brush': {d:'approx. 20 x 8 x 5 cm', v:{'telescopic-handle':'head approx. 20 x 8 cm, handle extends to approx. 80 cm','2-pack':'2 pcs, approx. 20 x 8 x 5 cm'}},
  'dog-car-seat-belt-harness': {d:'size chart (chest girth): S approx. 35-50 cm, M approx. 45-65 cm, L approx. 60-85 cm', v:{'s':'chest girth approx. 35-50 cm, up to approx. 8 kg','m':'chest girth approx. 45-65 cm, up to approx. 20 kg','l':'chest girth approx. 60-85 cm, up to approx. 35 kg'}},
  'dog-car-water-bottle': {d:'approx. 8 x 8 x 22 cm, 550 ml', v:{'350-ml':'350 ml, approx. 7 x 7 x 20 cm','550-ml':'550 ml, approx. 8 x 8 x 22 cm','750-ml':'750 ml, approx. 8.5 x 8.5 x 26 cm'}},
  'pet-hair-roller': {d:'approx. 18 x 9 x 8 cm', v:{'standard':'approx. 18 x 9 x 8 cm','large':'approx. 25 x 12 x 10 cm','2-pack':'2 pcs, approx. 18 x 9 x 8 cm'}},
  'foldable-storage-boxes-3': {d:'approx. 30 x 30 x 30 cm each (3 pcs), folds to approx. 30 x 30 x 3 cm'},
  'vacuum-storage-bags': {d:'approx. 60 x 80 cm per bag', v:{'6-bags':'6 bags, approx. 60 x 80 cm each','10-bags':'10 bags, mixed sizes approx. 50 x 70 to 80 x 100 cm'}},
  'non-slip-clothes-hangers-20': {d:'approx. 42 x 0.5 cm (W x thickness) per hanger'},
  'foldable-laundry-basket': {d:'approx. 40 x 30 x 50 cm (about 50 L), folds to approx. 40 x 30 x 4 cm'},
  'drawer-organizer-set': {d:'trays from approx. 7 x 7 cm to 30 x 15 cm, height approx. 6 cm', v:{'6-piece':'6 trays, approx. 6 x 6 to 30 x 15 cm, height 6 cm','12-piece':'12 trays, approx. 6 x 6 to 30 x 15 cm, height 6 cm'}},
  'led-motion-night-lights-2': {d:'approx. 10 x 3 x 2 cm per light (2 pcs)'},
  'adhesive-wall-hooks-20': {d:'approx. 4 x 4 cm per hook, holds up to approx. 3 kg each'},
  'shoe-rack': {d:'approx. 60 x 25 cm per tier, 18 cm tier height', v:{'2-tier':'approx. 60 x 25 x 36 cm (2 tiers)','3-tier':'approx. 60 x 25 x 54 cm (3 tiers)','4-tier':'approx. 60 x 25 x 72 cm (4 tiers)'}},
  'silicone-utensil-set': {d:'approx. 25-33 cm per piece', v:{'5-piece':'5 pcs, approx. 25-33 cm each','10-piece':'10 pcs, approx. 25-33 cm each'}},
  'bamboo-cutting-board': {d:'approx. 30 x 20 x 1.5 cm', v:{'small':'approx. 25 x 18 x 1.5 cm','medium':'approx. 35 x 25 x 1.8 cm','large':'approx. 45 x 30 x 2 cm'}},
  'glass-food-storage-set': {d:'approx. 15-25 cm, 370-1040 ml per container', v:{'3-containers':'3 containers: approx. 370 / 640 / 1040 ml','5-containers':'5 containers: approx. 370 / 520 / 640 / 840 / 1040 ml'}},
  'silicone-baking-mat': {d:'approx. 40 x 30 cm, thickness 0.7 mm', v:{'1-mat':'1 mat, approx. 40 x 30 cm','2-mats':'2 mats, approx. 40 x 30 cm'}},
  'cork-trivet': {d:'round, approx. 20 cm diameter, thickness 1 cm', v:{'round-20':'round, approx. 20 cm diameter, thickness 1 cm','round-set-3':'set of 3 round trivets: approx. 14, 17 and 20 cm diameter, thickness 1 cm'}},
  'digital-kitchen-scale': {d:'platform approx. 16 x 14 x 2 cm, capacity up to 5 kg (1 g steps)'},
  'a4-printer-paper-500': {d:'A4 = 21 x 29.7 cm, 80 g/m2, approx. 5 cm stack height, approx. 2.5 kg', v:{'1-ream':'500 sheets, approx. 5 cm stack, approx. 2.5 kg','5-reams':'2,500 sheets, 5 reams, approx. 12.5 kg'}},
  'desk-organizer': {d:'approx. 25 x 15 x 13 cm (L x W x H)'},
  'aluminium-laptop-stand': {d:'approx. 26 x 22 cm base, fits 10-17 inch laptops, up to approx. 10 kg; folded approx. 26 x 22 x 2 cm'},
  'a5-notebooks-3': {d:'A5 = 14.8 x 21 cm, approx. 80 pages each (3 pcs)'},
  'xl-mouse-pad': {d:'approx. 80 x 30 cm, 3 mm thick', v:{'black':'approx. 80 x 30 x 0.3 cm','grey':'approx. 80 x 30 x 0.3 cm'}},
  'cat-litter-box': {d:'approx. 40 x 30 x 12 cm (M)', v:{'m':'approx. 40 x 30 x 12 cm','l':'approx. 50 x 38 x 14 cm','xl':'approx. 56 x 40 x 40 cm (hooded)'}},
  'cat-scratching-post': {d:'base approx. 40 x 40 cm, post diameter approx. 10 cm', v:{'50-cm':'height 50 cm','70-cm':'height 70 cm','90-cm':'height 90 cm'}},
  'retractable-dog-leash': {d:'extends to approx. 5 m; size chart by dog weight', v:{'s-up-to-15-kg':'3 m tape, for dogs up to 15 kg, handle approx. 11 cm','m-up-to-25-kg':'5 m tape, for dogs up to 25 kg, handle approx. 13 cm','l-up-to-50-kg':'5 m tape, for dogs up to 50 kg, handle approx. 15 cm'}},
  'washable-pet-bed': {d:'round bed, diameter 50-80 cm', v:{'s':'diameter 50 cm, height 15 cm (cats, small dogs up to 5 kg)','m':'diameter 65 cm, height 18 cm (up to 12 kg)','l':'diameter 80 cm, height 20 cm (up to 25 kg)'}},
  'toilet-paper-24': {d:'approx. 10 x 10 cm per roll, 3-ply', v:{'24-rolls':'24 rolls, approx. 60 x 40 x 20 cm pack','48-rolls':'48 rolls, approx. 60 x 40 x 40 cm pack'}},
  'flat-microfibre-mop': {d:'head approx. 40 x 12 cm, handle extends to approx. 125 cm', v:{'2-pads':'2 pads, approx. 40 x 12 cm','4-pads':'4 pads, approx. 40 x 12 cm'}},
  'sponge-set': {d:'approx. 10 x 7 x 3 cm per sponge', v:{'6-pack':'6 sponges, approx. 10 x 7 x 3 cm','12-pack':'12 sponges, approx. 10 x 7 x 3 cm'}},
  'telescopic-duster': {d:'extends from approx. 30 cm to 100 cm', v:{'standard':'extends approx. 30-100 cm','extra-long':'extends approx. 50-200 cm'}},
  'reusable-lint-roller': {d:'roller width approx. 10 cm, length approx. 19 cm', v:{'single':'1 roller, approx. 10 x 19 cm','2-pack':'2 rollers, approx. 10 x 19 cm each'}},
  'cotton-bath-towel-set': {d:'bath towel approx. 70 x 140 cm, hand towel approx. 50 x 90 cm, approx. 500 GSM', v:{'2-bath-towels':'2 x 70 x 140 cm','4-pieces':'2 x 70 x 140 cm + 2 x 50 x 90 cm','6-pieces':'2 x 70 x 140 cm + 2 x 50 x 90 cm + 2 x 30 x 30 cm'}},
  'non-slip-bath-mat': {d:'approx. 40 x 60 cm, 1.5 cm thick', v:{'grey':'approx. 40 x 60 x 1.5 cm','white':'approx. 40 x 60 x 1.5 cm','blue':'approx. 40 x 60 x 1.5 cm'}},
  'wall-shower-caddy': {d:'approx. 30 x 12 x 15 cm per tier, holds up to approx. 4 kg', v:{'2-tier':'approx. 30 x 12 x 40 cm (2 tiers)','3-tier':'approx. 30 x 12 x 60 cm (3 tiers)'}},
  'screwdriver-bit-set': {d:'handle approx. 12 cm, bits approx. 2.5-3 cm; case approx. 20 x 12 x 4 cm', v:{'32-pieces':'32 pcs, case approx. 20 x 12 x 4 cm','60-pieces':'60 pcs, case approx. 24 x 14 x 5 cm'}},
  'rechargeable-led-flashlight': {d:'approx. 14 x 3.5 cm, weight approx. 120 g (with battery)'},
  'packing-cubes-set': {d:'S approx. 25 x 18 x 8 cm, M approx. 30 x 20 x 10 cm, L approx. 40 x 28 x 12 cm', v:{'4-pieces':'4 cubes: 1 S, 2 M, 1 L','6-pieces':'6 cubes: 2 S, 2 M, 2 L'}},
  'waterproof-travel-pouch': {d:'approx. 22 x 12 cm, neck cord approx. 70 cm; fits passport and phone up to 6.5 inch'},
  'folding-camping-shovel': {d:'folded approx. 23 x 11 x 5 cm, extended approx. 56 cm, weight approx. 600 g', v:{'standard':'folded approx. 23 x 11 x 5 cm, extended approx. 56 cm','heavy-duty':'folded approx. 24 x 12 x 6 cm, extended approx. 58 cm, approx. 850 g'}},
  'garden-hand-trowel': {d:'approx. 30 cm long, blade approx. 8 x 14 cm', v:{'trowel':'approx. 30 cm long, blade approx. 8 x 14 cm','3-piece-set':'3 pcs, approx. 30 cm each'}},
  'snow-shovel': {d:'approx. 85 x 30 cm (L x W), blade approx. 30 x 28 cm', v:{'standard':'approx. 85 x 30 cm','telescopic':'extends approx. 60-90 cm, blade approx. 30 x 28 cm'}},
  'led-flashlight-aaa': {d:'approx. 14 x 3.5 cm, weight approx. 100 g (without batteries); 3 x AAA'},
  'led-headlamp-aaa': {d:'lamp approx. 6 x 4 x 4 cm, strap fits head circumference approx. 48-62 cm; 3 x AAA'},
  'pocket-torch-aa': {d:'approx. 10 x 2 cm, weight approx. 50 g (without battery); 1 x AA', v:{'single':'1 torch, approx. 10 x 2 cm','3-pack':'3 torches, approx. 10 x 2 cm each'}},
  'measuring-tape-5m': {d:'case approx. 6.5 x 6.5 x 3 cm, tape width approx. 19 mm', v:{'3m':'tape 3 m x 16 mm','5m':'tape 5 m x 19 mm','8m':'tape 8 m x 25 mm'}},
  'adjustable-wrench': {d:'approx. 20 cm, jaw opening approx. 24 mm', v:{'200mm':'length approx. 20 cm, jaw opening approx. 24 mm','250mm':'length approx. 25 cm, jaw opening approx. 30 mm'}},
  'plastic-sports-water-bottle': {d:'approx. 7 x 7 x 24 cm (500 ml)', v:{'500-ml':'approx. 7 x 7 x 22 cm (500 ml)','750-ml':'approx. 7.5 x 7.5 x 25 cm (750 ml)','1000-ml':'approx. 8 x 8 x 29 cm (1 L)'}},
  'shaker-bottle': {d:'approx. 8 x 8 x 20 cm (500 ml)', v:{'500-ml':'approx. 8 x 8 x 19 cm (500 ml)','700-ml':'approx. 8 x 8 x 24 cm (700 ml)'}},
  'gym-bottle-with-straw': {d:'approx. 8 x 8 x 26 cm (700 ml)', v:{'700-ml':'approx. 8 x 8 x 26 cm (700 ml)','1000-ml':'approx. 9 x 9 x 29 cm (1 L)'}},
  'collapsible-water-bottle': {d:'approx. 7 x 7 x 19 cm open (500 ml), approx. 4 cm folded', v:{'500-ml':'approx. 7 x 7 x 19 cm open, 4 cm folded','750-ml':'approx. 7.5 x 7.5 x 23 cm open, 5 cm folded'}},
  'resistance-bands-set': {d:'loops approx. 60 x 5 cm (various widths/strengths)', v:{'5-bands':'5 loops, approx. 60 cm circumference','5-bands-handles':'5 tube bands approx. 120 cm + handles'}},
  'skipping-rope': {d:'cable approx. 3 m (adjustable), handles approx. 14 cm'},
  'yoga-mat': {d:'approx. 183 x 61 cm', v:{'6mm':'approx. 183 x 61 x 0.6 cm','10mm':'approx. 183 x 61 x 1 cm'}},
  'microfibre-gym-towel': {d:'approx. 40 x 80 cm', v:{'40x80':'approx. 40 x 80 cm','50x100':'approx. 50 x 100 cm'}},
};
PRODUCTS.forEach(p => { const d = DIMS[p.id]; if (d) { p.dims = d.d; p.vdims = d.v || {}; } });
const dimsOf = (p, vid) => (p.vdims && p.vdims[vid]) || p.dims || '';
const BUNDLES = [
  {id:'bundle-detailing-starter', name:'Detailing Starter Kit', price:38.99, cat:'Bundle', art:'towels', badge:'Bundle',
   items:['microfiber-towels-10','wash-mitt-2','detailing-brush-set-5','applicator-pads-5'], extra:[],
   short:'10 microfibre towels + 2 wash mitts + 5 detailing brushes + 5 applicator pads. No chemicals – use your own shampoo. Size and use guide on this page.'},
  {id:'bundle-tidy-car', name:'Tidy Car', price:33.99, cat:'Bundle', art:'trunk', badge:'Bundle',
   items:['trunk-organizer','seat-gap-filler'], extra:[{name:'Headrest hooks (4-pack) – bundle only', art:'hooks'}],
   short:'Trunk Organizer + Seat Gap Filler (2-pack) + headrest hooks.'},
  {id:'bundle-on-the-road-with-dog', name:'On the Road with Your Dog', price:36.99, cat:'Bundle', art:'dog', badge:'Bundle',
   items:['dog-car-seat-cover'], extra:[{name:'Super-absorbent dog towel – bundle only', art:'towel'}],
   short:'Dog Car Seat Cover + super-absorbent dog towel.'},
  {id:'bundle-winter', name:'Winter Bundle', price:28.99, cat:'Bundle', art:'snow', badge:'Bundle',
   items:['snow-brush-ice-scraper','car-cleaning-kit'], extra:[],
   short:'Snow Brush & Ice Scraper + Car Cleaning Kit.'},
];
BUNDLES.forEach(b => {
  b.single = b.items.reduce((s, id) => s + PRODUCTS.find(p => p.id === id).price, 0);
  b.feat = [...b.items.map(id => PRODUCTS.find(p => p.id === id).name), ...b.extra.map(e => e.name)];
});
const ALL = [...PRODUCTS, ...BUNDLES];
/* bundle savings: only where the bundle contains exactly the listed items (no bundle-only extras) and is cheaper */
const bSave = b => { if (!b || b.cat !== 'Bundle' || b.extra.length) return null; const amt = Math.round((b.single - b.price) * 100) / 100; return amt > 0 ? {amt, pct: Math.floor(amt / b.single * 100)} : null; };
const saveTxt = sv => `Save ${eur(sv.amt)} (${sv.pct}%)`;
const byId = id => ALL.find(p => p.id === id);
const isB = p => p.cat === 'Bundle';
const vOf = (p, vid) => (p.variants && p.variants.opts.find(o => o.id === vid)) || null;
const splitKey = k => { const [id, vid] = String(k).split('::'); const p = byId(id); return {p, v: p ? vOf(p, vid) : null}; };
const unitPrice = (p, v) => p.price + ((v && v.add) || 0);
const vHint = p => { if (!p.variants) return ''; const l = p.variants.label, w = {Colour:'colours', Size:'sizes', Style:'styles', Pack:'pack sizes'}[l] || 'options'; return p.variants.opts.length + ' ' + w; };

/* ---------- Cart (localStorage) ---------- */
const CART_KEY = 'fd_cart_v1', MAXQ = 99;
const SITE = 'https://amireven-crypto.github.io/freshdrop/';
const clampQ = n => { n = parseInt(n, 10); return Number.isFinite(n) ? Math.min(MAXQ, Math.max(1, n)) : 1; };
/* a cart key is "<product id>" or "<product id>::<variant id>" and must match a known product (and variant, if the product has variants) */
const validKey = k => { const parts = String(k).split('::'); if (parts.length > 2) return false; const p = byId(parts[0]); if (!p) return false; return p.variants ? parts.length === 2 && !!vOf(p, parts[1]) : parts.length === 1; };
const Cart = {
  clean(raw) {
    const out = {};
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return out;
    for (const k of Object.keys(raw)) { const q = raw[k]; if (typeof q === 'number' && Number.isInteger(q) && q >= 1 && validKey(k)) out[k] = Math.min(q, MAXQ); }
    return out;
  },
  get() {
    let txt = null, raw = null;
    try { txt = localStorage.getItem(CART_KEY); raw = JSON.parse(txt); } catch (e) {}
    const c = this.clean(raw);
    if (txt !== null && JSON.stringify(c) !== JSON.stringify(raw)) { try { localStorage.setItem(CART_KEY, JSON.stringify(c)); } catch (e) {} }
    return c;
  },
  set(c) { try { localStorage.setItem(CART_KEY, JSON.stringify(this.clean(c))); } catch (e) {} updateCount(); },
  add(id, q = 1) { if (!validKey(id)) return; const c = this.get(); c[id] = Math.min(MAXQ, (c[id] || 0) + clampQ(q)); this.set(c); toast('Added to cart ✓'); document.querySelectorAll('.cart-btn').forEach(b => { b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); }); },
  qty(id, q) { if (!validKey(id)) return; const c = this.get(); if (q <= 0) delete c[id]; else c[id] = clampQ(q); this.set(c); },
  count() { return Object.values(this.get()).reduce((a, b) => a + b, 0); },
};
function updateCount() { const n = Cart.count(); document.querySelectorAll('.count').forEach(e => e.textContent = n); document.querySelectorAll('.m-cart').forEach(e => e.classList.toggle('has', n > 0)); if (typeof updateMiniShip === 'function') updateMiniShip(); }
function toast(t) {
  let el = document.querySelector('.toast');
  if (!el) { el = document.createElement('div'); el.className = 'toast'; el.setAttribute('role', 'status'); el.setAttribute('aria-live', 'polite'); document.body.appendChild(el); }
  el.textContent = t; el.classList.add('show'); clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('show'), 1800);
}

/* ---------- Page metadata (title, description, canonical, Open Graph, Twitter) ---------- */
function setMeta({title, desc, path, image, noindex}) {
  const q = (sel) => document.querySelector(sel), put = (sel, attr, v) => { const el = q(sel); if (el && v != null) el.setAttribute(attr, v); };
  if (title) { document.title = title; put('meta[property="og:title"]', 'content', title); put('meta[name="twitter:title"]', 'content', title); }
  if (desc) { put('meta[name="description"]', 'content', desc); put('meta[property="og:description"]', 'content', desc); put('meta[name="twitter:description"]', 'content', desc); }
  if (path != null) { const u = SITE + path; put('link[rel="canonical"]', 'href', u); put('meta[property="og:url"]', 'content', u); }
  if (image) { const u = SITE + image; put('meta[property="og:image"]', 'content', u); put('meta[name="twitter:image"]', 'content', u); document.querySelectorAll('meta[property="og:image:width"],meta[property="og:image:height"]').forEach(e => e.remove()); }
  if (noindex) { let m = q('meta[name="robots"]'); if (!m) { m = document.createElement('meta'); m.name = 'robots'; document.head.appendChild(m); } m.content = 'noindex'; }
}

/* ---------- Layout ---------- */
function header(active) {
  const l = (h, t, k) => `<a href="${h}" class="${active === k ? 'active' : ''}">${t}</a>`;
  return `<a class="skip" href="#main">Skip to main content</a>
  <div class="demo-bar">DEMO STORE – no real orders, no payments. All [yellow] fields are placeholders.</div>
  <header class="site"><div class="wrap nav">
    <a class="logo" href="index.html">${LOGO}</a>
    <nav class="nav-links" id="navl" aria-label="Main">${l('products.html', 'All products', 'shop')}${l('products.html#Bundle', 'Bundles', 'sets')}${l('shipping.html', 'Shipping & Returns', 'shipping')}${l('about.html', 'About', 'about')}${l('legal-notice.html', 'Contact', 'contact')}</nav>
    <button type="button" class="burger" aria-label="Menu" aria-expanded="false" aria-controls="navl" data-act="burger">☰</button>
    <a class="cart-btn" href="cart.html"><svg class="cart-ic" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1.003 1.003 0 0 0 20 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg> <span class="sr">Cart, items:</span> <span class="count">0</span></a>
  </div></header>`;
}
function footer() {
  return `<footer class="site"><div class="wrap">
   <div class="foot">
     <div><a class="logo" href="index.html" style="font-size:20px">${LOGO}</a>
       <p>Everyday finds for home, kitchen, pets, office, tools, tech and car. Demo store – no orders are processed yet.</p>
       <div class="pay"><span>${PH('Payment methods')}</span></div></div>
     <div><h2 class="fh">Shop</h2><a href="products.html">All products</a><a href="products.html#Car%20Care">Car Care</a><a href="products.html#Bundle">Bundles</a><a href="cart.html">Cart</a></div>
     <div><h2 class="fh">Help</h2><a href="about.html">About FreshDrop</a><a href="shipping.html">Shipping & Returns</a><a href="withdrawal.html">Right of withdrawal</a><a href="withdrawal.html#withdrawal-function">Withdraw from contract</a><a href="legal-notice.html">Contact</a></div>
     <div><h2 class="fh">Legal</h2><a href="legal-notice.html">Legal Notice</a><a href="terms.html">Terms & Conditions</a><a href="privacy.html">Privacy Policy</a><a href="withdrawal.html">Right of Withdrawal</a><a href="accessibility.html">Accessibility</a></div>
   </div>
   <div class="copy"><span>© ${new Date().getFullYear()} FreshDrop · ${PH('Company name / owner')}</span><span>All prices incl. VAT, plus shipping (see Shipping).</span></div>
  </div></footer>`;
}

/* ---------- Components ---------- */
function card(p, h = 'h3') {
  return `<article class="card">
    <div class="thumb-wrap"><a class="thumb" href="product.html?id=${p.id}">${pic(p)}${p.badge ? `<span class="badge ${isB(p) ? 'alt' : ''}">${p.badge}</span>` : ''}${bSave(p) ? `<span class="save-pill on-card">${saveTxt(bSave(p))}</span>` : ''}</a>${p.variants ? `<a class="quick" href="product.html?id=${p.id}" tabindex="-1" aria-hidden="true">Choose options →</a>` : `<button type="button" class="quick" data-act="add" data-id="${p.id}" tabindex="-1" aria-hidden="true">+ Quick add · ${eur(p.price)}</button>`}</div>
    <div class="body"><${h} class="ct"><a href="product.html?id=${p.id}">${isB(p) ? 'Bundle: ' : ''}${p.name}</a></${h}>
      <p class="desc">${p.short}</p>${p.dims ? `<p class="dimline" title="${p.dims}">📏 ${p.dims}</p>` : ''}${p.variants ? `<p class="vhint">${vHint(p)} available</p>` : ''}
      <div class="price-row"><div class="price">${p.variants && p.variants.opts.some(o => o.add > 0) ? '<small style="display:inline;margin-right:4px">from</small>' : ''}${eur(p.price)}${isB(p) && p.extra.length === 0 ? `<span class="old">separately ${eur(p.single)}</span>` : ''}<small>incl. VAT, plus shipping</small></div>
      ${p.variants ? `<a class="btn btn-primary btn-sm" href="product.html?id=${p.id}" aria-label="Choose options: ${p.name}">Choose options</a>` : `<button type="button" class="btn btn-primary btn-sm" data-act="add" data-id="${p.id}" aria-label="Add to cart: ${p.name}">Add to cart</button>`}</div></div></article>`;
}
function bundleCard(b) {
  const icons = [...b.items.map(byId).map(x => pic(x, 'ic')), ...b.extra.map(e => art(e.art))].join('');
  const sv = bSave(b);
  return `<div class="bundle${sv ? ' has-save' : ''}"><span class="eyebrow">Bundle</span>${sv ? `<span class="save-pill big">${saveTxt(sv)}</span>` : ''}<h3>${b.name}</h3>
   <div class="icons">${icons}</div>
   <ul>${b.feat.map(f => `<li>${f}</li>`).join('')}</ul>
   <div class="price-row"><div class="price">${eur(b.price)} <small>incl. VAT · items bought separately: ${eur(b.single)}${b.extra.length ? ' + bundle extra' : ''}</small></div></div>
   <div class="buy-row"><button type="button" class="btn btn-primary" data-act="add" data-id="${b.id}" aria-label="Grab the bundle: ${b.name}">Grab the bundle</button><a class="btn btn-ghost" href="product.html?id=${b.id}" aria-label="Details: ${b.name}">Details</a></div></div>`;
}
const SHIP_TXT = `<b>Delivery time: approx. 7–15 business days</b> within the EU. Orders ship directly from our partner warehouse – it takes a little longer, but keeps prices fair. Tracking information is planned for when real orders start (demo store – no orders are processed yet).`;

/* ---------- Category groups (top row) ---------- */
const GROUPS = [
  {k:'Home', en:'Home', cats:['Home']},
  {k:'Kitchen', en:'Kitchen', cats:['Kitchen']},
  {k:'Office', en:'Office', cats:['Office']},
  {k:'Pets', en:'Pet Supplies', cats:['Pets','Dog']},
  {k:'Cleaning', en:'Cleaning', cats:['Cleaning']},
  {k:'Bathroom', en:'Bathroom', cats:['Bathroom']},
  {k:'Tools', en:'Tools', cats:['Tools']},
  {k:'Travel', en:'Travel', cats:['Travel']},
  {k:'SG', en:'GYM', cats:['SG']},
  {k:'Car', en:'Car', cats:['Organisation','Comfort','Car Care','Winter','Bundle']},
];
const CAR_SUBS = ['Organisation','Comfort','Car Care','Winter','Bundle'];
const groupOf = p => (GROUPS.find(g => g.cats.includes(p.cat)) || {}).k;
const matches = (p, c) => c === 'All' || groupOf(p) === c || p.cat === c;
function catRow(link) {
  const chip = (k, en) => link
    ? `<a class="chip" href="products.html#${encodeURIComponent(k)}">${en}</a>`
    : `<button type="button" class="chip" data-c="${k}" aria-pressed="false">${en}</button>`;
  return `<div class="catrow" role="group" aria-label="Categories">${link ? '' : chip('All', 'All')}${GROUPS.map(g => chip(g.k, g.en)).join('')}</div>`;
}

function dealStrip() {
  const best = BUNDLES.filter(bSave).sort((a, b) => bSave(b).amt - bSave(a).amt)[0];
  if (!best) return '';
  const from = Math.min(...BUNDLES.map(b => b.price));
  return `<div class="wrap"><a class="deal-strip" href="#bundles"><span class="ds-ic" aria-hidden="true">🎁</span><span class="ds-t"><b>Bundle deals</b> – from ${eur(from)}. ${best.name}: ${eur(best.price)} instead of ${eur(best.single)} for the items bought separately – <b class="ds-save">${saveTxt(bSave(best))}</b>.</span><span class="ds-cta">See bundles →</span></a></div>`;
}
function catTiles() {
  return `<div class="cat-tiles">${GROUPS.map(g => { const items = ALL.filter(p => matches(p, g.k)); const p = items.find(x => !x.noimg) || items[0]; return p ? `<a class="cat-tile" href="products.html#${encodeURIComponent(g.k)}">${pic(p)}<span class="cn">${g.en}</span><span class="cc">${items.length} items</span></a>` : ''; }).join('')}</div>`;
}
/* ---------- Pages ---------- */
function pageHome() {
  const best = ['magnetic-phone-mount', 'dog-car-seat-cover', 'backseat-organizer-tray', 'umbrella-windshield-sunshade'].map(byId);
  return `
  <section class="hero"><div class="wrap hero-grid">
    <div><span class="eyebrow">Home · Kitchen · Pets · Car &amp; more</span>
      <h1>Fresh finds for every day. <em>Welcome to FreshDrop.</em></h1>
      <p class="lead">Home, kitchen, pet, office, tech and car accessories that simply work – practical everyday finds at fair prices.</p>
      <div class="hero-ctas"><a class="btn btn-primary btn-xl" href="products.html">Gear up now →</a><a class="btn btn-ghost" href="#bundles">See bundles</a></div>
      <div class="hero-facts"><span>14-day right of withdrawal</span><span>Shipping across the EU</span><span>Demo store – no real orders yet</span></div>
    </div>
    <div class="hero-art">
      <div class="hero-main">${pic(byId('magnetic-phone-mount'), 'hero', true)}<span class="hero-tag"><small>Bestseller</small><b>${byId('magnetic-phone-mount').name}</b><span>${eur(byId('magnetic-phone-mount').price)}</span></span></div>
      ${['dog-car-seat-cover','backseat-organizer-tray','umbrella-windshield-sunshade'].map((id, i) => { const x = byId(id); return `<a class="hero-float f${i + 1}" href="product.html?id=${x.id}" aria-label="${x.name} – ${eur(x.price)}">${pic(x)}<span>${eur(x.price)}</span></a>`; }).join('')}
      <span class="blob b1" aria-hidden="true"></span><span class="blob b2" aria-hidden="true"></span>
    </div>
  </div></section>
  <div class="usp-bar"><div class="wrap"><span>↩️ 14-day right of withdrawal</span><span>📦 Shipping across the EU · approx. 7–15 business days</span><span>🚚 Free shipping over €39</span><span>💶 Prices incl. VAT</span><span>🎁 Bundles: cheaper together</span></div></div>
  ${dealStrip()}
  <div class="marquee" aria-hidden="true"><div>${Array(2).fill('<span>Home</span>★<span>Kitchen</span>★<span>Pets</span>★<span>Office</span>★<span>Tools</span>★<span>Car</span>★<span>FreshDrop</span>★').join('')}</div></div>
  <section class="block" style="padding-bottom:0"><div class="wrap">
    <div class="sec-head"><div><h2>Shop by <b>category</b></h2></div><a class="btn btn-ghost btn-sm" href="products.html">All products →</a></div>
    ${catTiles()}
  </div></section>
  <section class="block"><div class="wrap">
    <div class="sec-head"><div><h2>The <b>bestsellers</b></h2><p>What belongs in almost every car.</p></div><a class="btn btn-ghost btn-sm" href="products.html">All products →</a></div>
    <div class="grid">${best.map(p => card(p)).join('')}</div>
  </div></section>
 <section class="block" style="padding-top:0"><div class="wrap">
    <div class="sec-head"><div><h2>Car <b>care</b></h2><p>Microfibre, mitts and brushes – zero chemicals, all reusable.</p></div><a class="btn btn-ghost btn-sm" href="products.html#Car%20Care">All car care →</a></div>
    <div class="grid">${['microfiber-towels-10','drying-towel-1200','wash-mitt-2','detailing-brush-set-5'].map(byId).map(p => card(p)).join('')}</div>
  </div></section>
  <section class="block" id="bundles" style="background:var(--bg2)"><div class="wrap">
    <div class="sec-head"><div><h2>Bundles & <b>savings</b></h2><p>Cheaper together than separately.</p></div></div>
    <div class="bundles">${BUNDLES.map(bundleCard).join('')}</div>
  </div></section>
  <section class="block"><div class="wrap">
    <div class="sec-head"><div><h2>Why <b>FreshDrop</b></h2></div></div>
    <div class="trust">
      <div><div class="ic">↩️</div><h3>14-day withdrawal</h3><p>Statutory right of withdrawal for all consumers in the EU.</p></div>
      <div><div class="ic">📦</div><h3>Honest delivery times</h3><p>Approx. 7–15 business days. We tell you up front how long it takes.</p></div>
      <div><div class="ic">ℹ️</div><h3>Demo store</h3><p>No real orders or payments are processed yet. Checkout will be added before launch.</p></div>
      <div><div class="ic">🧰</div><h3>Everyday essentials</h3><p>Practical products for home, kitchen, pets, office, tools and car.</p></div>
    </div>
  </div></section>
  <section class="block" style="padding-top:0"><div class="wrap">
    <div class="sec-head"><div><h2>Reviews</h2></div></div>
    <div class="reviews-empty"><h3>No reviews yet</h3><p>We've just launched. Only real, verified reviews from customers will appear here.<br>${PH('Add review widget after launch – no fake reviews')}</p></div>
  </div></section>`;
}
function pageShop() {
  const valid = c => c === 'All' || GROUPS.some(g => g.k === c) || ALL.some(p => p.cat === c);
  setTimeout(() => {
    const render = c => {
      document.getElementById('pgrid').innerHTML = ALL.filter(p => matches(p, c)).map(p => card(p, 'h2')).join('');
      const g = GROUPS.find(x => x.k === c || x.cats.includes(c));
      document.querySelectorAll('#catmain .chip').forEach(b => { const on = b.dataset.c === (g ? g.k : 'All'); b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
      const sub = document.getElementById('subrow');
      sub.innerHTML = (g && g.k === 'Car') ? ['Car', ...CAR_SUBS].map(k => `<button type="button" class="chip" data-c="${k}" aria-pressed="false">${k === 'Car' ? 'All car' : k === 'Bundle' ? 'Bundles' : k}</button>`).join('') : '';
      sub.querySelectorAll('.chip').forEach(b => { const on = b.dataset.c === c; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); b.onclick = () => go(b.dataset.c); });
      document.getElementById('pcount').textContent = ALL.filter(p => matches(p, c)).length + ' items';
      const ttl = document.getElementById('ptitle'); const nm = c === 'All' ? '' : (c === 'Car' ? 'Car' : (c === 'Bundle' ? 'Bundles' : (g && g.k !== 'Car' ? (g.en || g.k) : c)));
      const ct = window.fdCatTitle ? window.fdCatTitle(c, c === 'SG' ? 'GYM' : nm) : null;
      ttl.classList.toggle('is-sg', c === 'SG' && !ct); ttl.classList.toggle('is-ct', !!ct);
      ttl.innerHTML = ct || (c === 'SG' ? '<img class="gym-logo" src="assets/gym-logo.png" alt="GYM" width="900" height="320">' : (nm ? '<b>' + nm + '</b>' : 'All <b>products</b>'));
      if (c === 'SG' && !ct) ttl.setAttribute('aria-label', 'GYM'); else ttl.removeAttribute('aria-label');
      if (ct && window.fdCatTitleFit) window.fdCatTitleFit(ttl);
      const n = ALL.filter(p => matches(p, c)).length, label = c === 'All' ? 'All products' : (c === 'SG' ? 'GYM' : nm || c);
      setMeta({title: label + ' – FreshDrop', desc: c === 'All' ? `Browse all ${n} demo products at FreshDrop: home, kitchen, office, pet, cleaning, bathroom, tools, travel and car accessories. Demo store – no real orders.` : `${n} ${label} products at FreshDrop. Demo store – no real orders are processed yet.`, path: 'products.html'});
    };
    const go = c => { history.replaceState(null, '', '#' + encodeURIComponent(c)); render(c); };
    document.querySelectorAll('#catmain .chip').forEach(b => b.onclick = () => go(b.dataset.c));
    const h = decodeURIComponent(location.hash.slice(1)); render(valid(h) ? h : 'All');
  });
  return `<div class="wrap"><section class="block" style="padding-top:40px">
    <div class="sec-head"><div><h1 id="ptitle">All <b>products</b></h1><p><span id="pcount" aria-live="polite">${ALL.length} items</span> · prices incl. VAT</p></div></div>
    ${catRow(false).replace('<div class="catrow"', '<div class="catrow" id="catmain"')}<div class="catrow subrow" id="subrow" role="group" aria-label="Subcategories"></div>
    <div class="grid" id="pgrid"></div></section></div>`;
}
/* Wash pieces buyers look at together. Prices always come from the listings — not a separate discount. */
const WASH_IDS = ['microfiber-towels-10', 'wash-mitt-2', 'detailing-brush-set-5'];
const PAIR_IDS = ['wash-mitt-2', 'detailing-brush-set-5'];
const GUIDE_IDS = [...WASH_IDS, 'bundle-detailing-starter'];
const washTotal = () => Math.round(WASH_IDS.reduce((s, id) => s + byId(id).price, 0) * 100) / 100;
const pairTotal = () => Math.round(PAIR_IDS.reduce((s, id) => s + byId(id).price, 0) * 100) / 100;
function termsStrip(p) {
  if (!GUIDE_IDS.includes(p.id)) return '';
  const three = washTotal(), kit = p.id === 'bundle-detailing-starter';
  const shipCell = kit
    ? `This kit is ${eur(p.price)}, under €${FREE_SHIP}, so free shipping does not apply to the kit on its own. Towels, mitts and brushes without the pads list at ${eur(three)} together, which is over €${FREE_SHIP}.`
    : `This item is ${eur(p.price)}, under €${FREE_SHIP} on its own. Towels + mitts + brushes are ${eur(three)} incl. VAT together, which is over €${FREE_SHIP}.`;
  return `<div class="terms-strip" role="region" aria-label="Price, delivery and returns">
    <div><b>Price incl. VAT</b>${eur(p.price)} includes VAT. Demo store — adding to the cart does not place an order or take payment.</div>
    <div><b>Delivery</b>Approx. 7–15 business days in the EU. Plan for the long end of that range (about 14–15 business days). This is not a faster-shipping promise.</div>
    <div><b>Free shipping</b>${shipCell}</div>
    <div><b>Returns</b>14-day right of withdrawal from receipt of the goods. <a href="withdrawal.html">Withdrawal</a> · <a href="shipping.html">Shipping &amp; returns</a>.</div>
  </div>`;
}
function togetherBlock(currentId) {
  const rows = WASH_IDS.map(id => {
    const x = byId(id);
    const here = id === currentId ? ' <span class="here">(this page)</span>' : '';
    return `<tr><td><a href="product.html?id=${x.id}">${x.name}</a>${here}</td><td>${eur(x.price)}</td></tr>`;
  }).join('');
  const three = washTotal();
  const kit = byId('bundle-detailing-starter');
  const onKit = currentId === kit.id;
  const addLabel = onKit ? `Add the three pieces without the pads · ${eur(three)}` : `Add the three pieces to cart · ${eur(three)}`;
  const addBtn = `<button type="button" class="btn btn-ghost" data-act="addset" data-ids="${WASH_IDS.join(',')}" aria-label="Add the towels, mitts and brush set to the cart for ${eur(three)}">${addLabel}</button>`;
  return `<div class="together">
    <h3>Using the three pieces together</h3>
    <p>The towels, mitts and brush set are separate listings. Buying them in one order does not change those prices. The convenience is having the wash, the gaps and several clean cloths sorted at once, instead of hunting for each piece.</p>
    <table><caption class="sr">Listed prices for the towels, mitts and brush set</caption><tbody>${rows}<tr class="sum"><td>Three pieces together, incl. VAT</td><td>${eur(three)}</td></tr></tbody></table>
    <p>That ${eur(three)} is the three listed prices added up, not a reduced price and not a former price. It is over €${FREE_SHIP}, so the order subtotal qualifies for free shipping. Delivery is still approx. 7–15 business days. You may find individual pieces for less in a local shop; these are the prices on this site.</p>
    <p>A wash with these pieces: mitts on the outside of the car, brushes only where a mitt will not reach, then the towels so you can switch to a clean cloth instead of wiping everything with one.</p>
    <p>If you already have cloths, skip the 10-pack. <a href="#already-have">Mitts and brushes alone are ${eur(pairTotal())} incl. VAT</a>. That pair is under €${FREE_SHIP}, so free shipping does not apply to it.</p>
    <p class="kit-note">${onKit
      ? `You are on the Detailing Starter Kit, which is a different listing. It adds 5 applicator pads and is ${eur(kit.price)} incl. VAT (${eur(kit.single)} if those four listings are bought separately). ${eur(kit.price)} is under €${FREE_SHIP}, so free shipping does not apply to the kit on its own. Shipping below €${FREE_SHIP} is not priced in this demo.`
      : `The <a href="product.html?id=${kit.id}">Detailing Starter Kit</a> (${eur(kit.price)}) is a different listing: the same three pieces plus 5 applicator pads. Bought as the four separate listings that is ${eur(kit.single)}. The kit price is under €${FREE_SHIP}, so free shipping does not apply to the kit on its own.`}</p>
    ${addBtn}
  </div>`;
}
function guideBlock(p) {
  if (!GUIDE_IDS.includes(p.id)) return '';
  const towels = byId('microfiber-towels-10'), mitt = byId('wash-mitt-2'), brushes = byId('detailing-brush-set-5'), pads = byId('applicator-pads-5');
  const caveat = 'Approximate listed size. The exact specification is still to be confirmed with the supplier. This page does not add measurements that are not already listed.';
  let body = '';
  if (p.id === 'microfiber-towels-10') {
    body = `<h3>Listed size</h3>
      <p>10 cloths, ${towels.dims}. ${caveat} GSM (how heavy the cloth is) is not listed, so these towels are not described as thick or long-lasting.</p>
      <h3>What they are for</h3>
      <p>Small all-round cloths for the body, the interior and glass. Ten in the pack means you can keep a clean cloth for drying leftover water and others for dirty areas, instead of using one cloth for the whole car. That helps after muddy dog walks, when door edges and the outside need more than a single towel.</p>
      <h3>Care</h3>
      <p>Wash before the first use. Wash separately from fabrics that shed lint, and do not use fabric softener. That is standard microfibre care, not a test of how long these cloths last.</p>`;
  } else if (p.id === 'wash-mitt-2') {
    body = `<h3>Listed size</h3>
      <p>2 mitts, ${mitt.dims}. ${caveat}</p>
      <h3>What they are for</h3>
      <p>Washing the outside of the car. Use one mitt on the upper panels and the other on the lower, dirtier panels (sills and the edges of the wheel arches) so grit from the bottom is not rubbed over the paint. No shampoo is included — use your own, or plain water.</p>
      <h3>Care</h3>
      <p>Rinse a new mitt in the wash water before it touches the car, so loose fibres from new chenille stay in the bucket. Then machine wash separately, with no fabric softener. These are standard care steps, not a promise about how long the pile lasts.</p>`;
  } else if (p.id === 'detailing-brush-set-5') {
    body = `<h3>Listed size</h3>
      <p>5 brushes, ${brushes.dims}. A length for each brush is not listed, so this page does not say which brush is 16 cm, which is 22 cm, or which length fits which gap. Choose by the head: the set runs from a larger head down to a smaller one. The photo is illustrative.</p>
      <p>${caveat}</p>
      <h3>Which head for which surface</h3>
      <p>Typical use, not a measured fit chart:</p>
      <ul>
        <li><b>Largest head</b> — wider spots you can see: door-shut edges, the area around a badge, cup-holder rims.</li>
        <li><b>Middle heads</b> — emblems, grille openings, seams with a bit of room.</li>
        <li><b>Smallest heads</b> — tight spots a mitt or cloth will not enter: grille slats, badge lettering, gaps around the wheels, dashboard edges, dusty seams, air-vent slats.</li>
      </ul>
      <p>Wash large panels with the mitt. Use the brushes where the mitt does not reach, dry or with water.</p>
      <h3>Trim</h3>
      <p>The bristles are described as soft, and no metal parts are listed. That is not proof they will not mark trim. If you are unsure, try the smallest brush with light pressure on a hidden spot first. Stop if you see a mark.</p>`;
  } else {
    body = `<h3>What you get</h3>
      <p>Four separate listings, packed as this kit. No cleaning chemicals — use your own shampoo or product.</p>
      <ul>
        <li><a href="product.html?id=${towels.id}">${towels.name}</a> — ${towels.dims}. GSM is not listed. ${eur(towels.price)} alone.</li>
        <li><a href="product.html?id=${mitt.id}">${mitt.name}</a> — ${mitt.dims}. ${eur(mitt.price)} alone.</li>
        <li><a href="product.html?id=${brushes.id}">${brushes.name}</a> — ${brushes.dims}. Individual brush lengths are not listed. ${eur(brushes.price)} alone.</li>
        <li><a href="product.html?id=${pads.id}">${pads.name}</a> — ${pads.dims}. Finger pocket, for a product you already own. Nothing to apply is included. ${eur(pads.price)} alone.</li>
      </ul>
      <p>${caveat}</p>
      <h3>Which brush head for which surface</h3>
      <p>Pick by head size, not by a centimetre that this set does not list separately:</p>
      <ul>
        <li><b>Largest head</b> — door-shut edges, the area around a badge, cup-holder rims.</li>
        <li><b>Middle heads</b> — emblems, grille openings, seams with some room.</li>
        <li><b>Smallest heads</b> — grille slats, badge lettering, wheel gaps, dashboard edges, dusty seams, air-vent slats.</li>
      </ul>
      <p>Mitts wash the outside of the car (one for upper panels, one for lower panels). Brushes are for the gaps. Towels are the small cloths you switch between so one dirty cloth is not used on the whole car. Pads are only for applying something you already have. Soft bristles are not a promise about trim — test the smallest brush on a hidden spot and stop if you see a mark.</p>
      <h3>Care</h3>
      <p>Wash the towels and mitts before first use, separately, with no fabric softener. Rinse a new mitt before it touches paint so loose fibres stay in the water. Standard care steps, not a durability test. GSM and pile life are not listed.</p>
      <h3>Price and shipping</h3>
      <p>The four listings add up to ${eur(p.single)}. This kit is ${eur(p.price)} incl. VAT — that is the bundle price, not a crossed-out former price. ${eur(p.price)} is under €${FREE_SHIP}, so free shipping does not apply to the kit on its own. The three pieces without the pads are ${eur(washTotal())}, which is over €${FREE_SHIP}. Shipping below €${FREE_SHIP} is not priced in this demo. Delivery of the kit is still approx. 7–15 business days.</p>`;
  }
  return `<section class="use-guide" id="use-guide" aria-labelledby="use-guide-title">
    <h2 id="use-guide-title">Size and use guide</h2>
    ${body}
    ${towelAltBlock()}
    ${togetherBlock(p.id)}
  </section>`;
}
function ownClothsBlock(currentId) {
  if (!GUIDE_IDS.includes(currentId)) return '';
  const pair = pairTotal();
  const rows = PAIR_IDS.map(id => {
    const x = byId(id);
    const here = id === currentId ? ' <span class="here">(this page)</span>' : '';
    return `<tr><td><a href="product.html?id=${x.id}">${x.name}</a>${here}</td><td>${eur(x.price)}</td></tr>`;
  }).join('');
  return `<section class="pair-path" id="already-have" aria-labelledby="already-have-title">
    <h2 id="already-have-title">Already have cloths?</h2>
    <p>Skip the 10-pack. The mitts and the brush set stay at their listed prices. ${eur(pair)} is those two prices added up, not a discount and not a former price.</p>
    <table><caption class="sr">Mitts and brushes without the towel pack</caption><tbody>${rows}<tr class="sum"><td>Mitts + brushes, incl. VAT</td><td>${eur(pair)}</td></tr></tbody></table>
    <p>${eur(pair)} is under €${FREE_SHIP}, so <b>free shipping does not apply</b> to this pair on its own. A shipping price below €${FREE_SHIP} is not set in this demo. Delivery is still approx. 7–15 business days, including about 14–15 business days. That is not a faster-shipping promise.</p>
    <p class="trust-line">No customer reviews yet. The 14-day right of withdrawal, counted from receipt, is the returns right listed on this page. It is not a rating, and it does not shorten delivery. This demo cart does not check out.</p>
    <button type="button" class="btn btn-ghost" data-act="addset" data-ids="${PAIR_IDS.join(',')}" aria-label="Add the wash mitts and brush set to the cart for ${eur(pair)}">Add mitts and brushes · ${eur(pair)}</button>
  </section>`;
}
function towelAltBlock() {
  const ten = byId('microfiber-towels-10');
  const large = byId('large-microfiber-towel-60x90');
  const xxl = byId('drying-towel-1200');
  return `<div class="towel-alts">
    <h3>Larger towels already listed</h3>
    <p>The <a href="product.html?id=${ten.id}">${ten.name}</a> is ${ten.dims} at ${eur(ten.price)} incl. VAT. GSM is not listed for that pack, so this page does not call it thick. The towels below are separate listings. Their size or GSM does not apply to the 10-pack.</p>
    <ul>
      <li><a href="product.html?id=${large.id}">${large.name}</a> — ${large.dims}. ${eur(large.price)} incl. VAT. No GSM is listed for this towel.</li>
      <li><a href="product.html?id=${xxl.id}">${xxl.name}</a> — ${xxl.dims}. ${eur(xxl.price)} incl. VAT. The 1200 GSM figure is for this towel only.</li>
    </ul>
  </div>`;
}
function factsHtml(p) {
  if (!GUIDE_IDS.includes(p.id)) {
    return `Material: ${PH('confirm with supplier')}<br>Dimensions / weight: ${PH('confirm with supplier')}<br>${p.variants ? p.variants.label + ' options: ' + p.variants.opts.map(o => o.n).join(', ') : 'Colour: ' + PH('e.g. black')}<br>In the box: ${isB(p) ? p.feat.join(', ') : PH('contents')}<br>Compatibility: universal – please check the dimensions against your vehicle.`;
  }
  if (p.id === 'bundle-detailing-starter') {
    return `In the kit: ${p.feat.join('; ')}. No cleaning chemicals.<br>Sizes: see the size and use guide on this page. Each figure is the approximate listed size for that piece. No outer-box measurement is listed.<br>Material: microfibre towels, chenille microfibre mitts, soft-bristle brushes with no metal parts listed, applicator pads. GSM is not listed for the towels.<br>Colour: not a listed option. The photo is illustrative.`;
  }
  const box = {
    'microfiber-towels-10': '10 microfibre cloths. GSM is not listed.',
    'wash-mitt-2': '2 chenille microfibre wash mitts with elastic cuffs.',
    'detailing-brush-set-5': '5 soft-bristle brushes. Bristle material is not specified beyond soft bristles and no metal parts. Lengths are not listed brush by brush.'
  }[p.id];
  return `Listed size: ${p.dims}. Approximate — exact specification still to be confirmed with the supplier.<br>In the box: ${box}<br>Colour: not a listed option. The photo is illustrative.<br>How to use it: see the size and use guide on this page.`;
}
function shipBoxHtml(p) {
  const extra = GUIDE_IDS.includes(p.id)
    ? `<p class="ship-plain">The 7–15 business day range already includes the long end (about 14–15 business days). Nothing on this page promises faster delivery. Prices include VAT. Free shipping applies only when the order subtotal is over €${FREE_SHIP}. Below that, a shipping price is not set in this demo.</p>`
    : '';
  return `📦 ${SHIP_TXT}<br>🚚 <b>Free shipping over €${FREE_SHIP}</b> (order subtotal)<br>↩️ <b>14-day right of withdrawal</b> – <a href="withdrawal.html">details</a>${extra}`;
}
function pageProduct() {
  const p = byId(new URLSearchParams(location.search).get('id'));
  if (!p) {
    setMeta({title: 'Product not found – FreshDrop', desc: 'This product could not be found. Browse all FreshDrop demo products.', path: 'products.html', noindex: true});
    return `<div class="wrap"><section class="empty block"><div style="font-size:60px" aria-hidden="true">🔍</div><h1 style="font-size:clamp(28px,4vw,40px);color:var(--text)">Product not found</h1><p>We could not find the product you were looking for. It may have been removed, or the link may be wrong.</p><a class="btn btn-primary" href="products.html">Browse all products</a></section></div>`;
  }
  window.curP = p;
  setMeta({title: p.name + ' – FreshDrop', desc: p.short + ' Demo store – no real orders are processed yet.', path: 'product.html?id=' + p.id, image: p.noimg ? null : 'assets/img/' + p.id + '.webp'});
  window.selV = p.variants ? p.variants.opts[0].id : null;
  const related = PRODUCTS.filter(x => x.id !== p.id && (x.cat === p.cat || isB(p))).slice(0, 4);
  const magnetWarn = (p.id === 'magnetic-phone-mount' || p.magnet) ? '<li>Contains magnets: keep away from pacemakers, implants and cards with magnetic strips. Not for children – small parts can be swallowed.</li><li>Do not operate your phone while driving; mount it so it does not block your view or airbags.</li>' : '';
  const mountWarn = (p.mount && !p.magnet) ? '<li>Do not operate your phone while driving or riding; fit the mount so it does not block your view. Check it is tight before every trip.</li>' : '';
  const careNote = p.cat === 'Car Care'
    ? '<li>Wash new microfibre before first use; wash separately, without fabric softener. Test brushes on a hidden spot first.</li>'
    : (p.id === 'bundle-detailing-starter' ? '<li>Wash the towels and mitts before first use, separately, without fabric softener. Rinse a new mitt before it touches paint. Test brushes on a hidden spot first. These are care steps, not a durability test.</li>' : '');
  const comfortNote = ['neck-pillow','neck-lumbar-set'].includes(p.id) ? '<li>Must not restrict head-restraint function or seat-belt routing. Comfort product – not a medical device.</li>' : '';
  const sunWarn = p.id === 'umbrella-windshield-sunshade' ? '<li>Use only when the vehicle is parked. Remove completely before driving.</li>' : '';
  return `<div class="wrap"><nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a> / <a href="products.html">Products</a> / <span aria-current="page">${p.name}</span></nav>
  <div class="pd">
    <div><div class="gallery">${pic(p, '', true)}</div><p class="photo-note">Illustrative AI-generated image – final product photos to follow.</p></div>
    <div>
      ${p.badge ? `<span class="eyebrow">${p.badge}</span>` : ''}
      <h1>${isB(p) ? 'Bundle: ' : ''}${p.name}</h1>
      <p style="color:var(--muted);font-size:17px;margin:0 0 16px">${p.short}</p>
      ${bSave(p) ? `<span class="save-pill big pd-save">${saveTxt(bSave(p))} vs. buying the items separately</span>` : ''}
      <div class="price" id="pprice">${eur(p.price)}${isB(p) ? ` <span class="old" style="text-decoration:none">items bought separately ${eur(p.single)}${p.extra.length ? ' + bundle extra' : ''}</span>` : ''}</div>
      <div class="meta">${GUIDE_IDS.includes(p.id) ? `incl. VAT · <a href="#use-guide">Size and use guide</a> · ` : 'incl. VAT, plus '}<a href="shipping.html">shipping</a></div>
      ${termsStrip(p)}
      ${ownClothsBlock(p.id)}
      ${p.dims ? `<div class="dims"><b>Dimensions:</b> <span id="dimtxt">${dimsOf(p, window.selV)}</span><small>Typical size - exact specification to be confirmed with the supplier.</small></div>` : ''}
      ${p.variants ? `<div class="vsel"><div class="vlab"><b>${p.variants.label}:</b> <span id="vname">${p.variants.opts[0].n}</span></div><div class="vopts">${p.variants.opts.map((o, i) => `<button type="button" class="chip vopt ${i === 0 ? 'on' : ''}" data-v="${o.id}" data-act="variant" aria-pressed="${i === 0}">${o.n}${o.add ? ` (+${eur(o.add)})` : ''}</button>`).join('')}</div></div>` : ''}
      <div class="buy-row">
        <div class="qty"><button type="button" data-act="pdq" data-d="-1" aria-label="Decrease quantity">−</button><input id="q" value="1" inputmode="numeric" pattern="[0-9]*" maxlength="2" aria-label="Quantity"><button type="button" data-act="pdq" data-d="1" aria-label="Increase quantity">+</button></div>
        <button type="button" class="btn btn-primary" style="flex:1" data-act="pdadd" data-id="${p.id}">Add to cart</button>
      </div>
      <div class="ship-box">${shipBoxHtml(p)}</div>
      ${guideBlock(p)}
      <ul class="feat">${p.feat.map(f => `<li>${f}</li>`).join('')}</ul>
      <details class="acc" open><summary>Product details</summary><div class="in">${factsHtml(p)}</div></details>
      <details class="acc"><summary>Safety information</summary><div class="in"><ul style="margin:0;padding-left:18px">${magnetWarn}${mountWarn}${sunWarn}${careNote}${comfortNote}<li>Secure loads and accessories so nothing flies around under hard braking.</li></ul></div></details>
      <details class="acc"><summary>Shipping & returns</summary><div class="in">${SHIP_TXT} Returns possible within 14 days of receipt – see <a href="shipping.html">Shipping & Returns</a>.</div></details>
    </div>
  </div>
  <section class="block" style="padding-top:20px"><div class="sec-head"><h2>Goes <b>well with</b></h2></div><div class="grid">${related.map(x => card(x)).join('')}</div></section></div>`;
}
function selectVariant(vid) {
  const p = window.curP, v = p && vOf(p, vid);
  if (!v) return;
  window.selV = vid;
  document.querySelectorAll('.vopt').forEach(b => { const on = b.dataset.v === vid; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
  document.getElementById('vname').textContent = v.n;
  const dt = document.getElementById('dimtxt'); if (dt) dt.textContent = dimsOf(p, vid);
  document.getElementById('pprice').textContent = eur(unitPrice(p, v));
}
/* ---------- Free shipping, promo code, newsletter (demo – no backend) ---------- */
const FREE_SHIP = 39, PROMO_KEY = 'fd_promo_v1', NEWS_KEY = 'fd_newsletter_v1', PROMO_CODE = 'WELCOME10';
function cartSubtotal(c) { c = c || Cart.get(); return Object.keys(c).reduce((s, id) => { const sk = splitKey(id); return s + unitPrice(sk.p, sk.v) * c[id]; }, 0); }
const Promo = {
  get() { try { return localStorage.getItem(PROMO_KEY) === PROMO_CODE ? PROMO_CODE : ''; } catch (e) { return ''; } },
  set(v) { try { if (v) localStorage.setItem(PROMO_KEY, v); else localStorage.removeItem(PROMO_KEY); } catch (e) {} },
  discount(sub) { return Math.round(sub * 10) / 100; },
};
function shipBar(sub) {
  const left = Math.max(0, FREE_SHIP - sub), pct = Math.min(100, Math.round(sub / FREE_SHIP * 100));
  return `<div class="ship-bar${left <= 0 ? ' done' : ''}" role="status"><p>${left > 0 ? `Add <b>${eur(left)}</b> more for <b>FREE shipping</b>` : `You've unlocked <b>FREE shipping</b> ✓`}</p><div class="sb-track" role="progressbar" aria-label="Progress to free shipping" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}"><span style="width:${pct}%"></span></div><small>Free shipping on orders over ${eur(FREE_SHIP)} (subtotal).</small></div>`;
}
function promoBox(code) {
  return code
    ? `<div class="promo on"><span>🎉 Code <b>${code}</b> applied – 10% off your subtotal.</span><button type="button" class="promo-rm" data-act="promorm">Remove</button></div>`
    : `<form class="promo" data-promo novalidate><label for="promo-in">Discount code</label><div class="promo-row"><input id="promo-in" name="code" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="e.g. WELCOME10"><button type="submit" class="btn btn-ghost btn-sm">Apply</button></div><p class="promo-msg" aria-live="polite"></p></form>`;
}
function newsletter() {
  let saved = null; try { saved = JSON.parse(localStorage.getItem(NEWS_KEY)); } catch (e) {}
  return `<section class="news" aria-labelledby="news-h"><div class="wrap"><div class="news-card">${saved && saved.email ? newsDone() : `
    <span class="eyebrow">Newsletter</span><h2 id="news-h">Get <b>10% off</b> your first order.</h2>
    <p class="news-lead">Sign up for new finds and bundle deals from FreshDrop.</p>
    <form class="news-form" data-news novalidate><label class="sr" for="news-email">Email address</label><input id="news-email" type="email" name="email" autocomplete="email" inputmode="email" placeholder="you@example.com" required><button type="submit" class="btn btn-primary">Get my 10%</button></form>
    <p class="news-msg" aria-live="polite"></p>
    <p class="news-note">Demo store: no emails are sent. Your address is only saved in this browser (localStorage) and never leaves your device.</p>`}</div></div></section>`;
}
function newsDone() {
  return `<span class="eyebrow">Newsletter</span><h2 id="news-h">You're in! <b>Here's your 10%.</b></h2>
    <p class="news-lead">Use this code in your cart for 10% off your subtotal:</p>
    <div class="news-code"><b>${PROMO_CODE}</b><a class="btn btn-primary btn-sm" href="cart.html">Use it in the cart →</a></div>
    <p class="news-note">Demo store: no email was sent and nothing was stored on a server – your address stays in this browser only.</p>`;
}
function updateMiniShip() {
  const sub = cartSubtotal(), left = Math.max(0, FREE_SHIP - sub), pct = Math.min(100, Math.round(sub / FREE_SHIP * 100));
  document.querySelectorAll('.m-cart').forEach(m => { const s = m.querySelector('.mc-ship'); if (s) s.innerHTML = left > 0 ? `${eur(left)} to FREE shipping` : `FREE shipping unlocked ✓`; m.style.setProperty('--ship', pct + '%'); });
}
function pageCart() {
  setMeta({title: 'Cart – FreshDrop', path: 'cart.html'});
  setTimeout(renderCart);
  return `<div class="wrap"><section style="padding-top:40px"><div class="sec-head"><h1>Your <b>cart</b></h1></div></section><div id="cartbox"></div></div>`;
}
function renderCart() {
  const c = Cart.get(), ids = Object.keys(c), box = document.getElementById('cartbox');
  if (!ids.length) { box.innerHTML = `<div class="empty"><div style="font-size:60px" aria-hidden="true">🛒</div><h2 style="color:var(--text);font-size:24px">Nothing here yet.</h2><p>Your cart is empty. Have a look around.</p><a class="btn btn-primary" href="products.html">Shop products</a></div>`; return; }
  const sub = cartSubtotal(c), code = Promo.get(), disc = code ? Promo.discount(sub) : 0, free = sub >= FREE_SHIP;
  box.innerHTML = `<div class="cart-layout" style="padding-top:0"><div>${ids.map(id => { const {p, v} = splitKey(id); const up = unitPrice(p, v); const nm = (isB(p) ? 'Bundle: ' : '') + p.name + (v ? ' (' + v.n + ')' : ''); return `
    <div class="line">${pic(p, 'sm')}<div><h2 class="lt">${isB(p) ? 'Bundle: ' : ''}${p.name}</h2>${v ? `<div class="vline">${p.variants.label}: ${v.n}</div>` : ''}<div style="color:var(--muted);font-size:14px">${eur(up)} each</div>
      <div class="qty" style="margin-top:8px"><button type="button" data-act="cartq" data-key="${id}" data-d="-1" aria-label="Decrease quantity of ${nm}">−</button><input value="${c[id]}" readonly aria-label="Quantity of ${nm}"><button type="button" data-act="cartq" data-key="${id}" data-d="1" aria-label="Increase quantity of ${nm}"${c[id] >= MAXQ ? ' disabled' : ''}>+</button></div>
      <br><button type="button" class="rm" data-act="cartrm" data-key="${id}" aria-label="Remove: ${nm}">Remove</button></div>
      <div class="price">${eur(up * c[id])}</div></div>`; }).join('')}</div>
    <aside class="summary" aria-label="Order summary"><h2 class="sh">Summary</h2>
      ${shipBar(sub)}
      <div class="r"><span>Subtotal</span><span>${eur(sub)}</span></div>
      ${disc ? `<div class="r disc"><span>Discount (${code}, −10%)</span><span>−${eur(disc)}</span></div>` : ''}
      <div class="r"><span>Shipping</span><span>${free ? '<b class="free-ship">FREE</b>' : PH('set shipping costs')}</span></div>
      <div class="r total"><span>Total</span><span>${eur(sub - disc)}</span></div>
      ${promoBox(code)}
      <div style="color:var(--muted);font-size:12px;margin-bottom:16px">incl. VAT (rate of the destination country) · delivery approx. 7–15 business days</div>
      <button type="button" class="btn btn-primary" style="width:100%" data-act="checkout">Order with obligation to pay</button>
      <p style="color:var(--muted);font-size:12px">By placing your order you accept our <a href="terms.html">Terms & Conditions</a> and acknowledge the <a href="withdrawal.html">withdrawal information</a> and <a href="privacy.html">Privacy Policy</a>.<br><b>Demo:</b> no order or payment takes place.</p>
      <ul class="sum-trust"><li>↩️ 14-day right of withdrawal</li><li>📦 Delivery approx. 7–15 business days</li><li>🚚 Free shipping over €39</li></ul>
    </aside></div>${cartXsell(ids)}`;
}
function cartXsell(ids) {
  const inCart = new Set(ids.map(k => String(k).split('::')[0]));
  const groups = new Set([...inCart].map(id => groupOf(byId(id))));
  const pool = ALL.filter(p => !inCart.has(p.id) && groups.has(groupOf(p)));
  const pick = [...pool.filter(p => p.badge), ...pool.filter(p => !p.badge)].slice(0, 4);
  return pick.length ? `<section class="block xsell"><div class="sec-head"><div><h2>Complete <b>your order</b></h2><p>More from the same categories.</p></div></div><div class="grid">${pick.map(p => card(p)).join('')}</div></section>` : '';
}

function addedFx(b) {
  if (!b || b.classList.contains('quick') || b._fx) return;
  const txt = b.innerHTML; b._fx = 1; b.classList.add('added'); b.innerHTML = 'Added ✓';
  setTimeout(() => { b.innerHTML = txt; b.classList.remove('added'); b._fx = 0; }, 1400);
  const el = document.querySelector('.toast');
  if (el && !document.getElementById('cartbox')) el.insertAdjacentHTML('beforeend', ' <a href="cart.html" class="toast-link">View cart →</a>');
}
/* ---------- Events (delegated, no inline handlers with ids) ---------- */
document.addEventListener('click', e => {
  const t = e.target.closest && e.target.closest('[data-act]'); if (!t) return;
  const a = t.dataset.act;
  if (a === 'add') { Cart.add(t.dataset.id); addedFx(t); if (document.getElementById('cartbox')) renderCart(); }
  else if (a === 'addset') {
    const ids = (t.dataset.ids || '').split(',').filter(validKey);
    if (!ids.length) return;
    const c = Cart.get();
    ids.forEach(id => { c[id] = Math.min(MAXQ, (c[id] || 0) + 1); });
    Cart.set(c);
    toast(ids.includes('microfiber-towels-10') ? 'Added the three pieces ✓' : 'Added mitts and brushes ✓');
    addedFx(t);
  }
  else if (a === 'pdadd') { const q = document.getElementById('q'); Cart.add(t.dataset.id + (window.selV ? '::' + window.selV : ''), clampQ(q && q.value)); addedFx(t); }
  else if (a === 'pdq') { const q = document.getElementById('q'); if (q) q.value = clampQ(clampQ(q.value) + (+t.dataset.d)); }
  else if (a === 'variant') selectVariant(t.dataset.v);
  else if (a === 'cartq') { const c = Cart.get(), k = t.dataset.key; if (Object.prototype.hasOwnProperty.call(c, k)) { Cart.qty(k, c[k] + (+t.dataset.d)); renderCart(); } }
  else if (a === 'cartrm') { Cart.qty(t.dataset.key, 0); renderCart(); }
  else if (a === 'checkout') toast('Demo: checkout not connected yet');
  else if (a === 'promorm') { Promo.set(''); renderCart(); }
  else if (a === 'burger') { const n = document.getElementById('navl'), o = n.classList.toggle('open'); t.setAttribute('aria-expanded', o); }
});
document.addEventListener('change', e => { if (e.target.id === 'q') e.target.value = clampQ(e.target.value); });
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  const n = document.getElementById('navl'), b = document.querySelector('.burger');
  if (n && n.classList.contains('open')) { n.classList.remove('open'); if (b) { b.setAttribute('aria-expanded', 'false'); b.focus(); } }
});
document.addEventListener('submit', e => { if (e.target.matches && e.target.matches('form[data-demo]')) { e.preventDefault(); toast('Demo: nothing sent'); } });
document.addEventListener('submit', e => {
  const f = e.target; if (!f.matches) return;
  if (f.matches('form[data-promo]')) {
    e.preventDefault();
    const v = (f.code.value || '').trim().toUpperCase(), msg = f.querySelector('.promo-msg');
    if (v === PROMO_CODE) { Promo.set(PROMO_CODE); renderCart(); toast('Code applied: 10% off ✓'); }
    else { msg.textContent = v ? 'Sorry, this code is not valid.' : 'Please enter a code.'; f.code.focus(); }
  } else if (f.matches('form[data-news]')) {
    e.preventDefault();
    const em = (f.email.value || '').trim(), msg = f.parentNode.querySelector('.news-msg');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em) || em.length > 254) { msg.textContent = 'Please enter a valid email address.'; f.email.setAttribute('aria-invalid', 'true'); f.email.focus(); return; }
    try { localStorage.setItem(NEWS_KEY, JSON.stringify({email: em, t: Date.now()})); } catch (err) {}
    const card = f.closest('.news-card'); card.innerHTML = newsDone(); card.classList.add('done');
    const h = card.querySelector('h2'); if (h) { h.setAttribute('tabindex', '-1'); h.focus({preventScroll: true}); }
  }
});

/* ---------- Scroll reveal (visual only) ---------- */
function initReveal() {
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), {rootMargin: '0px 0px -8% 0px'});
  const scan = () => document.querySelectorAll('.sec-head, .card, .cat-tile, .bundle, .trust > div, .reviews-empty, .deal-strip').forEach((el, i) => { if (el.dataset.rv) return; el.dataset.rv = 1; const r = el.getBoundingClientRect(); if (r.top < innerHeight) return; el.classList.add('reveal'); el.style.transitionDelay = (i % 4) * 70 + 'ms'; io.observe(el); });
  scan(); new MutationObserver(scan).observe(document.getElementById('main'), {childList: true, subtree: true});
}
/* ---------- Boot ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const pg = document.body.dataset.page, main = document.getElementById('main');
  const act = {shop: 'shop', product: 'shop', shipping: 'shipping', legal: 'contact', about: 'about'}[pg] || '';
  document.body.insertAdjacentHTML('afterbegin', header(act));
  const r = {home: pageHome, shop: pageShop, product: pageProduct, cart: pageCart}[pg];
  main.setAttribute('tabindex', '-1');
  if (r) main.innerHTML = r();
  else main.innerHTML = main.innerHTML.replace(/\{\{(.+?)\}\}/g, (_, t) => PH(t));
  document.body.insertAdjacentHTML('beforeend', newsletter() + footer());
  if (pg !== 'cart') document.body.insertAdjacentHTML('beforeend', `<a class="m-cart" href="cart.html"><span class="mc-t"><span>🛒 View cart</span><small class="mc-ship"></small></span><b aria-label="items in cart"><span class="count">0</span></b></a>`);
  updateCount();
  initReveal();
});
