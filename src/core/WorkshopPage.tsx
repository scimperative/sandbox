interface WorkshopPageProps {
  onGoHome: () => void;
  onShowSandbox: () => void;
}

interface WorkshopRun {
  id: string;
  title: string;
  date: string;
  question: string;
  prediction: string;
  measured: string;
  gap: string;
  href: string; // protocol + raw data
}

// Add runs here as they are published.
const RUNS: WorkshopRun[] = [];

const RUN_PARTS: [string, string][] = [
  ['Question and prediction', "what the Sandbox model said before the run, committed first so it can't be back-fitted."],
  ['Rig and protocol', 'hardware, firmware, ambient conditions and exact steps, so anyone with the same kit could repeat it.'],
  ['Raw data', 'logs and CSVs, published as they came off the rig.'],
  ['Result and gap', 'measured against predicted, and the binding constraint that explains the difference.'],
  ['Physical evidence', 'a photo, thermal image, scope trace or short clip.'],
];

export function WorkshopPage({ onGoHome, onShowSandbox }: WorkshopPageProps) {
  return (
    <div style={{ width: '100%', minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
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
            Workshop
          </h1>
          <p style={{ margin: 0, lineHeight: 1.6 }}>
            Our hardware testbed. Each run is one physical measurement of one question, set against the{' '}
            <a
              href={window.location.pathname}
              onClick={(event) => {
                event.preventDefault();
                onShowSandbox();
              }}
            >
              Sandbox
            </a>{' '}
            model's prediction, so the gap between model and reality is visible and checkable.
          </p>
        </header>

        <main className="about-page__content">
          <h2
            style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: 'var(--text-h)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            What a run contains
          </h2>
          <ul style={{ lineHeight: 1.6, paddingLeft: '1.25rem' }}>
            {RUN_PARTS.map(([label, text]) => (
              <li key={label}>
                <strong>{label}:</strong> {text}
              </li>
            ))}
          </ul>
          <p>
            Verification rigs: ASUS TUF A14, Jetson, Raspberry Pi. Runs arrive when a measurement is ready, not on a
            schedule.
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              margin: '2rem 0 1.25rem',
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: '1rem',
                fontWeight: 600,
                color: 'var(--text-h)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              Runs
            </h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--mono)' }}>
              {RUNS.length} published
            </span>
          </div>

          {RUNS.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No runs published yet.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
              {RUNS.map((run) => (
                <a
                  key={run.id}
                  href={run.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    border: '1px solid var(--card-border)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    backgroundColor: 'var(--card-bg)',
                    boxShadow: 'var(--shadow-sm)',
                    textDecoration: 'none',
                    color: 'var(--text)',
                  }}
                >
                  <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-h)' }}>
                    {run.title}
                  </h3>
                  <div
                    style={{
                      fontSize: '0.8rem',
                      fontFamily: 'var(--mono)',
                      color: 'var(--text-muted)',
                      marginBottom: '0.75rem',
                    }}
                  >
                    {run.date}
                  </div>
                  <p style={{ margin: '0 0 0.5rem', lineHeight: 1.55 }}>{run.question}</p>
                  <p style={{ margin: 0, fontFamily: 'var(--mono)', fontSize: '0.85rem' }}>
                    Predicted {run.prediction} · Measured {run.measured} · Gap {run.gap}
                  </p>
                </a>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
