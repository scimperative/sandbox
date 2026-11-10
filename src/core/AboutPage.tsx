interface AboutPageProps {
  onGoHome: () => void;
  onShowSandbox: () => void;
  onShowWorkshop: () => void;
}

const ABOUT_PAGE_CONTENT = (
  <>
    <p>
      Silicon (<em>Si</em>), the foundation of every digital machine, and carbon (<em>C</em>), the foundation of every biological being, abstractly represent the divide between digital intelligence and biological intelligence.
    </p>
    <p>
      Their compound, silicon carbide, fraught with difficulty in its creation, exists to handle the most adverse of physical environments that are defined by extreme temperatures, pressures, and voltages where either constituent alone can fail.
    </p>
    <p>
      I believe the most imperative challenges of the coming decades will emerge at similarly demanding interfaces: where digital intelligence meets biological intelligence, where software encounters real-world friction, and where machines meet humans, reshaping ordinary lives, organisations, and nations.
    </p>
    <p>
      <em>Silicon Carbide Imperative</em> (SC Imperative) is an educational initiative that explores these interfaces from first principles, building intuition by identifying binding constraints: what currently limits a system and what changes once it is addressed.
    </p>
    <p>
      It has three parts: the <strong>Library</strong>, the <strong>Sandbox</strong>, and the <strong>Workshop</strong>. The Library is our written research, with the maths shown so it can be verified, contested, or extended. The Sandbox is a set of open-source browser tools that make system limits visible and interactive. The Workshop is a hardware testbed that publishes physical measurements, each set against the model's prediction, with the raw data and the gap between them.
    </p>
    <p>
      The work is driven by my curiosity across fields such as artificial intelligence (AI), space, defence, semiconductors, macroeconomics, supply chains, geopolitics, and critical infrastructure.
    </p>
    <p>
      My perspective is shaped by a career across the aeronautical, space, and defence industries as an AI engineer, published researcher in explainable AI, and builder of autonomous systems across spacecraft, aircraft, missile defence, and radar platforms in Australia and Europe (see my experience{' '}<a href="https://patrickxcapaldo.github.io/" target="_blank" rel="noopener noreferrer"> here </a>{' '} and{' '}<a href="https://www.linkedin.com/in/patrickxcapaldo/?isSelfProfile=true" target="_blank" rel="noopener noreferrer"> here</a>).
    </p>
    <p>
      The motivation is to reason upwards from the underlying constraints to where we stand today, and where we may be going as a civilisation tomorrow.
    </p>
    <p>If you are curious whether a technology claim holds up, read a piece, move the sliders, compare the model with the measurements, and check my numbers. Subscribe if you would like to follow along.</p>
    <p className="about-page__disclaimer">
      <em>
        This is a personal, independent effort written in a purely private capacity, using only publicly available information, for the sole purpose of education. All views and works are exclusively those of the author and do not derive from, nor represent the views or works of, any past, present, or future employers, clients, or affiliated organisations.
      </em>
    </p>
  </>
);

export function AboutPage({ onGoHome, onShowSandbox, onShowWorkshop }: AboutPageProps) {
  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        background: 'var(--bg)',
        color: 'var(--text)',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '1.75rem 1.5rem 3rem',
          fontFamily: 'var(--sans)',
          color: 'var(--text)',
        }}
      >
        <a
          href={window.location.pathname}
          className="about-page__back"
          onClick={(event) => {
            event.preventDefault();
            onGoHome();
          }}
        >
          ← Home
        </a>
        <header
          style={{
            marginBottom: '2rem',
            paddingBottom: '1.25rem',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <h1
            style={{
              fontSize: '1.75rem',
              fontWeight: 700,
              color: 'var(--text-h)',
              letterSpacing: '-0.025em',
              margin: '0 0 0.4rem',
              lineHeight: 1.2,
            }}
          >
            About
          </h1>
        </header>
        <main className="about-page__content">
          {ABOUT_PAGE_CONTENT}
          <div className="about-page__actions">
            <a
              href="https://scimperative.substack.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="home-cta home-cta--outlined"
            >
              Library
            </a>
            <button className="home-cta home-cta--outlined" onClick={onShowSandbox}>
              Sandbox
            </button>
            <button className="home-cta home-cta--outlined" onClick={onShowWorkshop}>
              Workshop
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}