/* ============================================================
   COOKIE CONSENT

   Closes a live gap: /api/pv fired on every page load with no consent UI
   anywhere, while privacy-policy.html was published.

   WORTH UNDERSTANDING BEFORE CHANGING THIS. The existing analytics was
   deliberately built cookie-free — the visitor id is a daily-rotating hash of
   IP + UA + a server salt, so nothing is stored on the device and nothing
   survives midnight. schema.sql says as much. Under ePrivacy the consent
   trigger is storing or reading information on terminal equipment, and on that
   reading the old design was already compliant, and glx_consent is the first
   thing the site has ever stored.

   We build the banner anyway, because it is the safe posture and the
   engineering is cheap. But the genuinely non-compliant part today is the
   POLICY TEXT: a published privacy policy with no data-subject contact and no
   retention period. That is checklist 8.1b and 8.1c and it still needs
   answering — the banner does not fix it.

   DESIGN: the kernel no longer sends anything. It pushes onto window.glxQ and
   this module is the only code path to the network. So "default to not
   sending" is structural rather than conditional: if this script is absent for
   any reason — admin.html, a future minimal shell, a build mistake — nothing
   is sent. Fail-closed by construction.

   Deliberately NOT composed into admin.html. That shell never inlines
   kernel-js, so no beacon fires there and there is nothing to gate;
   glx_admin is strictly necessary, and a consent banner on a staff-only
   noindex dashboard is noise with no legal purpose.
   NAMING: every selector here is prefixed glx-cc. An earlier version used
   plain `.cc`, which contact.js already used for its contact-details grid —
   so the consent bar's position:fixed and z-index landed on that page's
   content and pinned it over the layout. Page CSS is inlined after this
   module's CSS on every page, so a bare class name here is capturable by any
   of twelve page modules. Keep the prefix.
   ============================================================ */

/* One place for the duration, interpolated into both the CSS and the JS below
   so a close timeout and its transition cannot drift apart. */
const MS = 420;

const css = `
/* ---------- consent ---------- */
.glx-cc{position:fixed;left:var(--frame);right:var(--frame);bottom:var(--frame);z-index:90;
  max-width:44rem;padding:clamp(1.1rem,2.2vw,1.5rem);
  background:rgba(var(--deep-rgb),.97);backdrop-filter:blur(20px);
  border:1px solid var(--line-2);
  clip-path:polygon(var(--notch-m) 0,100% 0,100% 100%,0 100%,0 var(--notch-m));
  opacity:0;transform:translateY(14px);
  transition:opacity ${MS}ms var(--ease),transform ${MS}ms var(--ease)}
.glx-cc[hidden]{display:none}
.glx-cc[data-open]{opacity:1;transform:none}
.glx-cc p{color:var(--haze);font-size:.97rem;max-width:60ch}
.glx-cc p a{color:var(--cyan);border-bottom:1px solid rgba(var(--cyan-rgb),.4)}
.glx-cc p a:hover{color:var(--frost);border-bottom-color:var(--frost)}
.glx-cc-h{display:flex;align-items:center;gap:.6rem;margin-bottom:.5rem}
.glx-cc-h .eb{font-size:.66rem}
/* Three controls at equal visual weight. Decline is not the lesser option —
   styling it as one is the pattern regulators penalise. */
.glx-cc-b{display:flex;flex-wrap:wrap;gap:.55rem;margin-top:1rem}
.glx-cc-b button{flex:1 1 auto;min-width:8.5rem;padding:.78em 1.1em;font-family:var(--f-mono);
  font-size:.73rem;font-weight:500;letter-spacing:.14em;text-transform:uppercase;
  border:1px solid var(--line-2);color:var(--frost);background:rgba(var(--panel-rgb),.5);
  cursor:pointer;transition:border-color .3s,color .3s,background .3s}
.glx-cc-b button:hover{border-color:var(--cyan);color:var(--cyan);background:rgba(var(--cyan-rgb),.07)}
.glx-cc-b button:focus-visible{outline:2px solid var(--cyan);outline-offset:2px}
.glx-cc-pref{margin-top:1rem;padding-top:1rem;border-top:1px solid var(--line);display:grid;gap:.9rem}
.glx-cc-pref[hidden]{display:none}
.glx-cc-row{display:grid;grid-template-columns:auto 1fr;gap:.9rem;align-items:start}
.glx-cc-row input{margin-top:.25rem;width:15px;height:15px;accent-color:var(--cyan)}
.glx-cc-row input:disabled{opacity:.5}
.glx-cc-row b{display:block;font-family:var(--f-disp);font-weight:700;font-size:1rem;
  font-variation-settings:'wdth' 106;color:var(--frost)}
.glx-cc-row small{display:block;color:var(--haze-d);font-size:.88rem;margin-top:.15rem}
@media (max-width:560px){.glx-cc{left:0;right:0;bottom:0;max-width:none;clip-path:none;
  border-left:0;border-right:0;border-bottom:0}}
@media (prefers-reduced-motion:reduce){.glx-cc{transform:none}}
`;

/* aria-live so the appearance is announced, but NOT a focus trap: this is a
   bar rather than a modal and the visitor must be able to keep reading. */
const html = `<div class="glx-cc" id="glx-cc" role="dialog" aria-label="Cookie preferences"
 aria-live="polite" hidden>
<div class="glx-cc-h"><span class="eb">Privacy</span></div>
<p>We would like to count page views and document requests so we know which
grades people look for. It is anonymised and never sold. Nothing is measured
unless you agree. <a href="privacy-policy.html">How we handle data</a>.</p>
<div class="glx-cc-b">
<button type="button" data-cc="accept">Accept</button>
<button type="button" data-cc="decline">Decline</button>
<button type="button" data-cc="prefs" aria-expanded="false" aria-controls="glx-cc-p">Preferences</button>
</div>
<div class="glx-cc-pref" id="glx-cc-p" hidden>
<div class="glx-cc-row">
<input type="checkbox" id="glx-cc-e" checked disabled />
<label for="glx-cc-e"><b>Essential</b><small>Always on. Remembers this choice, and
keeps a staff login signed in. No analytics, and nothing shared.</small></label>
</div>
<div class="glx-cc-row">
<input type="checkbox" id="glx-cc-a" />
<label for="glx-cc-a"><b>Analytics</b><small>Page views and document requests, with
a visitor identifier that is re-derived daily and cannot be traced back to you
or joined across days.</small></label>
</div>
<div class="glx-cc-b">
<button type="button" data-cc="save">Save preferences</button>
</div>
</div>
</div>`;

const js = `
/* ---------- consent ----------
   The only code path to the network. kernel-js pushes onto window.glxQ and
   never sends, so if this script is missing nothing is sent at all. */
(function(){
  var NAME = 'glx_consent';
  var YEAR = 31536000;

  function read(){
    var m = new RegExp('(?:^|; )' + NAME + '=(granted|denied)').exec(document.cookie);
    return m ? m[1] : null;
  }
  function write(v){
    /* Secure only over https: Chrome treats http://localhost as trustworthy
       but Safari does not, and an unconditional Secure silently breaks the
       whole flow under wrangler pages dev there. */
    document.cookie = NAME + '=' + v + ';Max-Age=' + YEAR + ';Path=/;SameSite=Lax'
      + (location.protocol === 'https:' ? ';Secure' : '');
  }

  function send(url, payload){
    try {
      var body = JSON.stringify(payload);
      if (navigator.sendBeacon){
        navigator.sendBeacon(url, new Blob([body], {type:'application/json'}));
      } else {
        fetch(url, {method:'POST', headers:{'Content-Type':'application/json'},
          body: body, keepalive:true}).catch(function(){});
      }
    } catch (e){}
  }

  function flush(){
    var q = window.glxQ || [];
    /* splice so anything queued later still goes, and nothing double-sends */
    var out = q.splice(0);
    out.forEach(function(a){ send(a[0], a[1]); });
    /* from here on, sending is immediate */
    window.glxSend = send;
    return out.length;
  }
  function drop(){ if (window.glxQ) window.glxQ.length = 0; window.glxSend = null; }

  /* Three states, not two. Granted flushes, DENIED drops, and no decision at
     all HOLDS — the queue is left alone so a page view that happened before
     the visitor chose is still delivered if they then accept. Dropping on
     undecided silently lost the first page view of every session. */
  var state = read();
  if (state === 'granted') flush();
  else if (state === 'denied') drop();

  var el = document.getElementById('glx-cc');
  if (!el) return;

  var prefs = document.getElementById('glx-cc-p');
  var analytics = document.getElementById('glx-cc-a');
  var lastFocus = null;
  var t = null;

  function open(){
    lastFocus = document.activeElement;
    el.hidden = false;
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){ el.setAttribute('data-open',''); });
    });
    /* Focus the panel itself, not a button — the visitor should hear what is
       being asked before landing on Accept. */
    el.setAttribute('tabindex','-1');
    el.focus();
  }
  function close(){
    el.removeAttribute('data-open');
    /* RM, because the global reduced-motion rule flattens the transition to
       .001ms — waiting the full duration there leaves an invisible bar over
       the content swallowing clicks. */
    clearTimeout(t);
    t = setTimeout(function(){ el.hidden = true; }, RM ? 0 : ${MS});
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function decide(v){
    write(v);
    if (v === 'granted'){
      var n = flush();
      /* Reversing an earlier refusal part-way through a session: the queue was
         legitimately emptied when the page loaded under a denied cookie, so
         there is nothing to flush. Count this page now rather than measuring
         nothing until the visitor happens to navigate. */
      if (!n && location.protocol.indexOf('http') === 0)
        send('/api/pv', {path: location.pathname, ref: document.referrer || ''});
    } else {
      drop();
    }
    close();
  }

  el.addEventListener('click', function(e){
    var b = e.target.closest('[data-cc]');
    if (!b) return;
    var a = b.getAttribute('data-cc');
    if (a === 'accept') decide('granted');
    else if (a === 'decline') decide('denied');
    else if (a === 'save') decide(analytics && analytics.checked ? 'granted' : 'denied');
    else if (a === 'prefs'){
      var showing = prefs.hidden;
      prefs.hidden = !showing;
      b.setAttribute('aria-expanded', showing ? 'true' : 'false');
    }
  });

  /* Escape is equivalent to Decline: dismissing a consent request is not
     consent. */
  el.addEventListener('keydown', function(e){
    if (e.key === 'Escape'){ e.preventDefault(); decide('denied'); }
  });

  /* Any footer or in-page control can reopen it, which is how a decision gets
     withdrawn. */
  document.addEventListener('click', function(e){
    if (e.target.closest('[data-cc-open]')){
      e.preventDefault();
      if (analytics) analytics.checked = read() === 'granted';
      open();
    }
  });

  /* Only ask if there is no decision on file. Once decided the bar never
     reappears for the cookie lifetime. */
  if (!state) setTimeout(open, 800);
})();
`;

module.exports = { css, html, js, MS };
