        // Venue route logic
        const places=[
            {id:"air",icon:"✈️",veh:"🚌",name:"Coimbatore Airport",sub:"Coimbatore International Airport",km:"106.5",
             stops:["Coimbatore Airport","Perundurai","Erode Bus Stand","Pallipalayam","KSRCT"],
             steps:["Board a bus to Erode from Coimbatore International Airport.","The bus reaches Erode Bus Stand via Perundurai (route: Perundurai - Erode - KSRCT).","At Erode Bus Stand, board an \"Erode to Tiruchengode\" bus that travels via Pallipalayam.","Get a ticket for the \"KSR\" bus stop and get off there."],
             opts:[["🚕 Taxi","Uber and OLA are available at the airport. Local taxi services are also an option."],["🚆 Train","No train runs from the airport. Reach Coimbatore Railway Station, then take a train to Erode Junction."]]},
            {id:"rail",icon:"🚆",veh:"🚌",name:"Erode Junction",sub:"Erode Junction Railway Station",km:"16.1",
             stops:["Erode Junction","Erode Bus Stand","Pallipalayam","KSRCT"],
             steps:["From Erode Junction Railway Station, board a bus to Erode Bus Stand.","At Erode Bus Stand, board an \"Erode to Tiruchengode\" bus via Pallipalayam.","Get a ticket for the \"KSR\" bus stop and get off there."],
             opts:[["🚕 Taxi","Uber is available at the station. OLA is not available in Erode. Local taxis are an option: see the numbers below."]]},
            {id:"bus",icon:"🚌",veh:"🚌",name:"Erode Bus Stand",sub:"Erode Bus Stand",km:"16.5",
             stops:["Erode Bus Stand","Pallipalayam","SPB Colony","KSRCT"],
             steps:["Board the Erode to Tiruchengode bus.","The route runs Pallipalayam, SPB Colony, KSRCT, then Tiruchengode.","Get a ticket for the \"KSR\" bus stop and get off there."],
             opts:[]},
            {id:"slm",icon:"🚌",veh:"🚌",name:"Salem Bus Stand",sub:"Salem Bus Stand",km:"72",
             stops:["Salem Bus Stand","Tiruchengode","KSRCT"],
             steps:["Board a bus from Salem Bus Stand to Tiruchengode.","At Tiruchengode Bus Stand, board a Tiruchengode to Erode bus, which passes KSRCT.","Get a ticket for the \"KSR\" bus stop and get off there."],
             opts:[]},
            {id:"tcg",icon:"🏛️",veh:"🚌",name:"Tiruchengode Bus Stand",sub:"Tiruchengode Bus Stand",km:"11.4",
             stops:["Tiruchengode","KSRCT"],
             steps:["Board the Tiruchengode to Erode bus.","The route runs Tiruchengode, KSRCT, Erode.","Get off at the \"KSR\" bus stop."],
             opts:[]}
        ];

        const NS="http://www.w3.org/2000/svg";
        const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
        const tabs=document.getElementById('tabs');
        const panel=document.getElementById('panel');
        let cur=0, raf=0;

        // Build tabs
        places.forEach((p,i)=>{
            const b=document.createElement('button');
            b.className='tab';
            b.role='tab';
            b.id='t'+i;
            b.innerHTML='<span>'+p.icon+'</span><b>'+p.name+'</b><small>'+p.km+' km to KSRCT</small>';
            b.onclick=()=>select(i);
            tabs.appendChild(b);
        });

        function select(i){
            cur=i;
            cancelAnimationFrame(raf);
            [...tabs.children].forEach((b,j)=>b.setAttribute('aria-selected',j===i));

            const p=places[i];
            const n=p.stops.length;
            const W=700;
            const H=n>3?210:190;
            const pts=p.stops.map((s,k)=>({
                x:50+k*(W-100)/(n-1),
                y:k%2?H*0.42:H*0.62,
                s
            }));

            let d='M'+pts[0].x+' '+pts[0].y;
            for(let k=1;k<n;k++){
                const a=pts[k-1], b=pts[k];
                const m=(a.x+b.x)/2;
                d+=' C'+m+' '+a.y+' '+m+' '+b.y+' '+b.x+' '+b.y;
            }

            panel.setAttribute('aria-labelledby','t'+i);
            panel.innerHTML=
                '<div class="head">'+
                    '<div>'+
                        '<h3>'+p.sub+'</h3>'+
                        '<div class="from-line">to K.S.Rangasamy College of Technology</div>'+
                    '</div>'+
                    '<div style="text-align:right">'+
                        '<div class="km">'+p.km+'<small>km by road</small></div>'+
                        '<button class="replay" id="rp">↻ Replay route</button>'+
                    '</div>'+
                '</div>'+
                '<svg class="map" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Route from '+p.sub+' to KSRCT via '+p.stops.slice(1,-1).join(', ')+'">'+
                    '<path class="base" d="'+d+'"/>'+
                    '<path class="run" id="run" d="'+d+'"/>'+
                    '<g id="stops"></g>'+
                    '<text class="veh" id="veh">'+p.veh+'</text>'+
                '</svg>'+
                '<ol class="steps" id="steps">'+p.steps.map(s=>'<li>'+s+'</li>').join('')+'</ol>'+
                (p.opts.length?'<div class="opts">'+p.opts.map(o=>'<div class="opt"><h3>'+o[0]+'</h3><p>'+o[1]+'</p></div>').join('')+'</div>':'');

            const g=document.getElementById('stops');
            pts.forEach((q,k)=>{
                const el=document.createElementNS(NS,'g');
                el.setAttribute('class','stop'+(k==n-1?' last':''));
                const up=k%2===1;
                el.innerHTML='<circle cx="'+q.x+'" cy="'+q.y+'" r="9"/>'+
                             '<text x="'+q.x+'" y="'+(up?q.y-18:q.y+30)+'">'+q.s+'</text>';
                g.appendChild(el);
            });

            const run=document.getElementById('run');
            const veh=document.getElementById('veh');
            const L=run.getTotalLength();
            const stopEls=[...g.children];
            const stepEls=[...document.getElementById('steps').children];
            const fr=pts.map((q,k)=>k/(n-1));

            function draw(t){
                run.style.strokeDasharray=L;
                run.style.strokeDashoffset=L*(1-t);
                const pt=run.getPointAtLength(L*t);
                veh.setAttribute('x',pt.x);
                veh.setAttribute('y',pt.y-14);
                stopEls.forEach((e,k)=>e.classList.toggle('on',t>=fr[k]-0.001));
                const si=Math.min(stepEls.length-1,Math.floor(t*stepEls.length*0.9999));
                stepEls.forEach((e,k)=>e.classList.toggle('on',t>0&&k<=si));
            }

            function play(){
                cancelAnimationFrame(raf);
                if(reduce){draw(1);return;}
                const dur=700*(n-1)+1200;
                const t0=performance.now();
                (function f(now){
                    const t=Math.min(1,(now-t0)/dur);
                    const e=t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
                    draw(e);
                    if(t<1) raf=requestAnimationFrame(f);
                })(t0);
            }

            document.getElementById('rp').onclick=play;
            play();
        }

        // Initial render
        select(0);
    