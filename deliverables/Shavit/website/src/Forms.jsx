/* global React, Btn, Eyebrow, GoldRule */

const { useState: useFormState, useEffect: useFormEffect, useRef: useFormRef } = React;

/* ============================================================
   FORM CONFIG — entry IDs map our field names to your Google
   Form's hidden field IDs.

   HOW TO GET YOUR ENTRY IDs (one-time, ~3 minutes):
   1. Open your Google Form in edit mode
   2. Click the kebab (⋮) menu top-right → "Get pre-filled link"
   3. Fill in dummy values for every question, click "Get link"
   4. Copy the link — it contains entry IDs like `entry.123456789=value`
   5. Replace each `entry.PLACEHOLDER_*` below with the matching ID
   ============================================================ */
const FORM_CONFIG = {
  work: {
    formId: '1FAIpQLSdr6YaVQqR0QnvWQkbaTFhbN2HY3kYqCeGSIIg2LuWKyKz9yw',
    eyebrow: 'Work With Me',
    headline: 'Start the conversation.',
    subhead: 'I review every inquiry personally. Tell me a bit about you and what you\u2019re after. I\u2019ll be in touch within 48 hours.',
    submitText: 'Send Inquiry',
    sections: [
      {
        label: 'Who you are',
        fields: [
          { name: 'firstName', label: 'First Name', type: 'text',  required: true, entryId: 'entry.PLACEHOLDER_WORK_FIRSTNAME', autoComplete: 'given-name', half: true },
          { name: 'lastName',  label: 'Last Name',  type: 'text',  required: true, entryId: 'entry.PLACEHOLDER_WORK_LASTNAME',  autoComplete: 'family-name', half: true },
          { name: 'email',     label: 'Email',      type: 'email', required: true, entryId: 'entry.PLACEHOLDER_WORK_EMAIL',     autoComplete: 'email' },
          { name: 'phone',     label: 'Phone Number', type: 'tel', required: true, entryId: 'entry.PLACEHOLDER_WORK_PHONE',     autoComplete: 'tel' },
        ],
      },
      {
        label: 'Your experience',
        fields: [
          { name: 'experience', label: 'What is your experience with investing in real estate?', type: 'radio', required: true, entryId: 'entry.PLACEHOLDER_WORK_EXPERIENCE',
            options: ['No properties', '1\u20135 units', '5+ units'] },
        ],
      },
      {
        label: 'What you\u2019re curious about',
        fields: [
          { name: 'topics', label: 'What would you like to talk about?', type: 'checkbox', required: true, entryId: 'entry.PLACEHOLDER_WORK_TOPICS',
            options: ['Investing out-of-state', 'Buying a home', 'Selling a property', 'Learning the playbook', 'Something else'] },
        ],
      },
      {
        label: 'A few more details',
        fields: [
          { name: 'notes', label: 'Anything else I should know?', type: 'textarea', entryId: 'entry.PLACEHOLDER_WORK_NOTES' },
        ],
      },
    ],
  },
  invest: {
    formId: '1FAIpQLSdbfNjiZegvReucCHrXQLLc21KBEbKYsKHXwjb9WcpSbVq5rQ',
    eyebrow: 'Invest With Me',
    headline: 'Let\u2019s get introduced.',
    subhead: 'This isn\u2019t an offer or a pitch \u2014 it\u2019s an introduction. Tell me a bit about yourself and I\u2019ll personally reach out. The real conversation happens one-on-one.',
    submitText: 'Introduce Yourself',
    sections: [
      {
        label: 'Who you are',
        fields: [
          { name: 'fullName', label: 'Full Name', type: 'text',  required: true, entryId: 'entry.PLACEHOLDER_INVEST_NAME',  autoComplete: 'name' },
          { name: 'email',    label: 'Email',     type: 'email', required: true, entryId: 'entry.PLACEHOLDER_INVEST_EMAIL', autoComplete: 'email', half: true },
          { name: 'phone',    label: 'Phone Number', type: 'tel', required: true, entryId: 'entry.PLACEHOLDER_INVEST_PHONE', autoComplete: 'tel', half: true },
        ],
      },
      {
        label: 'Your experience',
        fields: [
          { name: 'experience', label: 'Real estate investing experience', type: 'radio', required: true, entryId: 'entry.PLACEHOLDER_INVEST_EXPERIENCE',
            options: ['No Experience (No Deals)', 'Beginner (1\u20132 Deals)', 'Intermediate (3\u20139 Deals)', 'Expert (10+ Deals)'] },
        ],
      },
      {
        label: 'What you\u2019re curious about',
        fields: [
          { name: 'curious', label: 'What would you like to learn more about?', type: 'radio', required: true, entryId: 'entry.PLACEHOLDER_INVEST_CURIOUS',
            options: ['How operator-led partnerships work', 'The BRRRR playbook and the portfolio', 'Just following the journey for now'] },
        ],
      },
      {
        label: 'A few more details',
        fields: [
          { name: 'notes', label: 'What else do you want to share?', type: 'textarea', entryId: 'entry.PLACEHOLDER_INVEST_NOTES' },
        ],
      },
    ],
  },
};

/* ============================================================
   Submit via hidden iframe — sidesteps CORS for Google Forms
   ============================================================ */
function submitToGoogleForm(formId, entries) {
  return new Promise((resolve) => {
    const sinkName = 'gform-sink-' + Date.now();
    const iframe = document.createElement('iframe');
    iframe.name = sinkName;
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const form = document.createElement('form');
    form.action = `https://docs.google.com/forms/d/e/${formId}/formResponse`;
    form.method = 'POST';
    form.target = sinkName;
    form.acceptCharset = 'UTF-8';

    for (const [name, value] of Object.entries(entries)) {
      const values = Array.isArray(value) ? value : [value];
      for (const v of values) {
        if (v === undefined || v === null || v === '') continue;
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = String(v);
        form.appendChild(input);
      }
    }

    document.body.appendChild(form);
    form.submit();

    // Google's response will be opaque (403/CORS) — that's expected. Wait ~1s, clean up, resolve.
    setTimeout(() => {
      form.remove();
      iframe.remove();
      resolve();
    }, 1100);
  });
}

/* ============================================================
   Field components
   ============================================================ */
function Field({ field, value, onChange, error }) {
  const id = `f-${field.name}`;
  const common = {
    id,
    name: field.name,
    required: field.required,
    autoComplete: field.autoComplete,
    'aria-invalid': error ? 'true' : 'false',
    'aria-describedby': field.help ? `${id}-help` : undefined,
  };

  if (field.type === 'textarea') {
    return (
      <label className={`fld ${error ? 'fld--err' : ''}`}>
        <span className="fld__label">{field.label}{field.required && <span className="fld__req">*</span>}</span>
        {field.help && <span className="fld__help" id={`${id}-help`}>{field.help}</span>}
        <textarea {...common}
          rows="4"
          placeholder={field.placeholder || ''}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
    );
  }

  if (field.type === 'radio') {
    return (
      <fieldset className={`fld fld--radio ${error ? 'fld--err' : ''}`}>
        <legend className="fld__label">{field.label}{field.required && <span className="fld__req">*</span>}</legend>
        {field.help && <span className="fld__help">{field.help}</span>}
        <div className="opts">
          {field.options.map(opt => (
            <label key={opt} className={`opt ${value === opt ? 'opt--on' : ''}`}>
              <input
                type="radio"
                name={field.name}
                value={opt}
                checked={value === opt}
                onChange={() => onChange(opt)}
                required={field.required}
              />
              <span className="opt__mark" aria-hidden="true" />
              <span className="opt__text">{opt}</span>
            </label>
          ))}
        </div>
      </fieldset>
    );
  }

  if (field.type === 'checkbox') {
    const arr = Array.isArray(value) ? value : [];
    return (
      <fieldset className={`fld fld--radio ${error ? 'fld--err' : ''}`}>
        <legend className="fld__label">{field.label}{field.required && <span className="fld__req">*</span>}</legend>
        {field.help && <span className="fld__help">{field.help}</span>}
        <div className="opts">
          {field.options.map(opt => {
            const on = arr.includes(opt);
            return (
              <label key={opt} className={`opt opt--cbx ${on ? 'opt--on' : ''}`}>
                <input
                  type="checkbox"
                  name={field.name}
                  value={opt}
                  checked={on}
                  onChange={(e) => {
                    if (e.target.checked) onChange([...arr, opt]);
                    else onChange(arr.filter(v => v !== opt));
                  }}
                />
                <span className="opt__mark opt__mark--cbx" aria-hidden="true" />
                <span className="opt__text">{opt}</span>
              </label>
            );
          })}
        </div>
      </fieldset>
    );
  }

  return (
    <label className={`fld ${error ? 'fld--err' : ''} ${field.half ? 'fld--half' : ''}`}>
      <span className="fld__label">{field.label}{field.required && <span className="fld__req">*</span>}</span>
      {field.help && <span className="fld__help" id={`${id}-help`}>{field.help}</span>}
      <input
        {...common}
        type={field.type || 'text'}
        placeholder={field.placeholder || ''}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

/* ============================================================
   The form
   ============================================================ */
function FormBody({ kind, onClose }) {
  const cfg = FORM_CONFIG[kind];
  const [values, setValues] = useFormState({});
  const [errors, setErrors] = useFormState({});
  const [phase, setPhase] = useFormState('idle'); // 'idle' | 'submitting' | 'done' | 'error'
  const firstFieldRef = useFormRef(null);

  // Validate & submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    cfg.sections.forEach(s => s.fields.forEach(f => {
      if (!f.required) return;
      const v = values[f.name];
      if (f.type === 'checkbox') {
        if (!Array.isArray(v) || v.length === 0) errs[f.name] = true;
      } else {
        if (!v || (typeof v === 'string' && !v.trim())) errs[f.name] = true;
      }
    }));
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      // Scroll to first error
      const firstName = Object.keys(errs)[0];
      const el = document.getElementById(`f-${firstName}`);
      if (el && el.focus) el.focus();
      return;
    }
    setPhase('submitting');

    // Build entries map: { entry.XXXXX: 'value', ... }
    const entries = {};
    cfg.sections.forEach(s => s.fields.forEach(f => {
      const v = values[f.name];
      if (v !== undefined && v !== '' && f.entryId) entries[f.entryId] = v;
    }));

    try {
      await submitToGoogleForm(cfg.formId, entries);
      setPhase('done');
    } catch (err) {
      setPhase('error');
    }
  };

  // Done state
  if (phase === 'done') {
    return (
      <div className="fmod__done">
        <Eyebrow gold>Received</Eyebrow>
        <h2 className="h-xl" style={{ marginTop: 16 }}>Inquiry sent.</h2>
        <GoldRule wide style={{ marginTop: 24, marginBottom: 24 }} />
        <p className="body-lg" style={{ maxWidth: 480, margin: '0 auto' }}>
          I review every inquiry personally and will follow up within 48 hours.
        </p>
        <div style={{ marginTop: 40 }}>
          <Btn variant="ghost" onClick={onClose}>Close</Btn>
        </div>
      </div>
    );
  }

  return (
    <form className="fmod__form" onSubmit={handleSubmit} noValidate>
      <header className="fmod__head">
        <Eyebrow gold>{cfg.eyebrow}</Eyebrow>
        <h2 className="h-xl" style={{ marginTop: 16 }}>{cfg.headline}</h2>
        <GoldRule wide style={{ marginTop: 24, marginBottom: 24 }} />
        <p className="body-lg" style={{ maxWidth: 540 }}>{cfg.subhead}</p>
      </header>

      {cfg.sections.map((sec, si) => (
        <section key={si} className="fmod__section">
          <div className="fmod__section-label">{sec.label}</div>
          <div className="fmod__grid">
            {sec.fields.map(f => (
              <Field
                key={f.name}
                field={f}
                value={values[f.name]}
                error={errors[f.name]}
                onChange={(v) => setValues({ ...values, [f.name]: v })}
              />
            ))}
          </div>
        </section>
      ))}

      <div className="fmod__actions">
        <Btn variant="gold" onClick={null /* form onSubmit handles it */}>
          {phase === 'submitting' ? 'Sending…' : cfg.submitText}
        </Btn>
        <a
          className="tlink fmod__alt"
          href={`https://docs.google.com/forms/d/e/${cfg.formId}/viewform`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>Open in Google Forms</span>
          <span aria-hidden="true">→</span>
        </a>
      </div>

      {phase === 'error' && (
        <p className="fmod__error">Something went wrong sending your inquiry. Try the link above to submit directly.</p>
      )}
    </form>
  );
}

/* ============================================================
   Modal shell
   ============================================================ */
function FormModal() {
  const [kind, setKind] = useFormState(null); // 'work' | 'invest' | null
  const dialogRef = useFormRef(null);
  const triggerRef = useFormRef(null);

  useFormEffect(() => {
    const onOpen = (e) => {
      triggerRef.current = document.activeElement;
      setKind(e.detail && e.detail.type ? e.detail.type : null);
    };
    const onKey = (e) => { if (e.key === 'Escape') setKind(null); };
    window.addEventListener('open-form-modal', onOpen);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('open-form-modal', onOpen);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  useFormEffect(() => {
    document.body.style.overflow = kind ? 'hidden' : '';
  }, [kind]);

  // Focus trap: cycle Tab within the dialog
  useFormEffect(() => {
    if (!kind || !dialogRef.current) return;
    const root = dialogRef.current;
    // Focus first focusable element
    const firstFocusable = root.querySelector('input, textarea, button, [href], select, [tabindex]:not([tabindex="-1"])');
    if (firstFocusable) firstFocusable.focus();
    const onKey = (e) => {
      if (e.key !== 'Tab') return;
      const focusables = root.querySelectorAll('input, textarea, button, [href]:not([disabled]), select, [tabindex]:not([tabindex="-1"])');
      const list = Array.from(focusables).filter(el => !el.disabled && el.offsetParent !== null);
      if (!list.length) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    };
    root.addEventListener('keydown', onKey);
    return () => {
      root.removeEventListener('keydown', onKey);
      // Restore focus to the element that opened the modal
      if (triggerRef.current && typeof triggerRef.current.focus === 'function') {
        triggerRef.current.focus();
      }
    };
  }, [kind]);

  if (!kind) return null;

  return (
    <div className="fmod" role="dialog" aria-modal="true" aria-labelledby="fmod-title" ref={dialogRef}>
      <button className="fmod__close" onClick={() => setKind(null)} aria-label="Close form">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <line x1="4" y1="4" x2="20" y2="20" />
          <line x1="20" y1="4" x2="4" y2="20" />
        </svg>
      </button>
      <div className="fmod__scroll">
        <div className="fmod__inner">
          <FormBody kind={kind} onClose={() => setKind(null)} />
        </div>
      </div>
    </div>
  );
}

window.FormModal = FormModal;
window.openFormModal = (type) => window.dispatchEvent(new CustomEvent('open-form-modal', { detail: { type } }));
