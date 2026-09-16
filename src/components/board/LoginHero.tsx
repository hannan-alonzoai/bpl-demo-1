export function LoginHero() {
  return (
    <div className="login-hero">
      <div className="login-hero-intro">
        <img
          src="/assets/bpl-cortex-ot-logo.png"
          alt=""
          className="login-hero-logo"
          aria-hidden
        />
        <h1>BPL Cortex OT</h1>
        <p className="tag">Operating theatre monitoring</p>
      </div>
      <div className="pulse-wrap">
        <svg viewBox="0 0 600 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polyline
            points="0,60 130,60 155,10 180,105 205,35 230,60 360,60 385,15 410,100 435,40 460,60 600,60"
            stroke="white" strokeWidth="3" fill="none" strokeLinejoin="round" strokeLinecap="round"
          />
        </svg>
      </div>
      <div className="foot">
        Live monitoring across connected OT rooms, with room-level vitals, ventilation, and alarm status in one view.
      </div>
    </div>
  );
}
