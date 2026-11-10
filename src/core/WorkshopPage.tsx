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
    <div
      style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '3.5rem 1.5rem 4rem',
        fontFamily: 'var(--sans)',
        color: 'var(--text)',
      }}
    >
      <header style={{ marginBottom: '2rem' }}>
        <button
          onClick={onGoHome}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: 'none',
            border: 'none',
            color: 'var(--link)',
            cursor: 'pointer',
            font: '600 0.9rem var(--sans)',
            padding: '0 0 1rem',
          }}
        >
          ← Home
        </button>
        <h1 style={{ marginBottom: '0.5rem' }}>Workshop</h1>
        <p style={{ color: 'var(--text)', lineHeight: 1.6 }}>
          Our hardware testbed. Each run is one physical measurement of one question, set against the{' '}
          <a
            href="?view=sandbox"
            onClick={(event) => {
              event.preventDefault();
              onShowSandbox();
            }}
            style={{ color: 'var(--link)' }}
          >
            Sandbox
          </a>{' '}
          model's prediction, so the gap between model and reality is visible and checkable.
        </p>
      </header>

      <section style={{ marginBottom: '2.5rem' }}>
        <h2
          style={{
            fontSize: '1rem',
            fontWeight: 600,
            color: 'var(--text-h)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            marginBottom: '1.25rem',
          }}
        >
          What a run contains
        </h2>
        <ul style={{ lineHeight: 1.6, paddingLeft: '1.25rem', margin: '0 0 1rem' }}>
          {RUN_PARTS.map(([label, text]) => (
            <li key={label}>
              <strong>{label}:</strong> {text}
            </li>
          ))}
        </ul>
        <p style={{ lineHeight: 1.6, margin: 0 }}>
          Verification rigs: ASUS TUF A14, Jetson, Raspberry Pi. Runs arrive when a measurement is ready, not on a
          schedule.
        </p>
      </section>

      <section>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem',
          }}
        >
          <h2
            style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: 'var(--text-h)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            Runs
          </h2>
          <span
            style={{
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              fontFamily: 'var(--mono)',
            }}
          >
            {RUNS.length} published
          </span>
        </div>

        {RUNS.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>No runs published yet.</p>
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
                <h3
                  style={{
                    margin: '0 0 0.25rem',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    color: 'var(--text-h)',
                    lineHeight: 1.3,
                  }}
                >
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
                <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', lineHeight: 1.55 }}>{run.question}</p>
                <p style={{ margin: 0, fontFamily: 'var(--mono)', fontSize: '0.85rem' }}>
                  Predicted {run.prediction} · Measured {run.measured} · Gap {run.gap}
                </p>
              </a>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
