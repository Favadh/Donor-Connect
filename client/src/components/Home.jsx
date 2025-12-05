import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import { cn } from './utils';

const initialForm = {
  fullName: '',
  bloodType: '',
  phoneNo: '',
  city: '',
  age: '',
  email: '',
  screening: {
    recentDonate: false,
    recentAntibiotics: false,
    recentVaccination: false,
    chronicCondition: false,
  },
};

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function Home() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);


  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleScreeningChange = e => {
    const { name, checked } = e.target;
    setForm(prev => ({
      ...prev,
      screening: {
        ...prev.screening,
        [name]: checked,
      },
    }));
  };

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.bloodType) e.bloodType = 'Select a blood type';
    if (!/^\+?\d{7,15}$/.test(form.phoneNo)) e.phone = 'Enter a valid phone number';
    if (!form.city.trim()) e.city = 'City is required';
    if (!/^\d{1,3}$/.test(String(form.age)) || Number(form.age) <= 0) e.age = 'Enter a valid age';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    return e;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg(null);
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (Object.values(form.screening).some(val => val === true)) {
      setMsg({
        type: 'error',
        text: "You are not eligible to register based on the screening criteria.",
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const payload = {
      fullName: form.fullName.trim(),
      bloodType: form.bloodType,
      phoneNo: form.phoneNo.trim(),
      city: form.city.trim(),
      age: Number(form.age),
      email: form.email.trim(),
    };

    setLoading(true);
    try {
      console.log("before api call");
      await api.post('/donorRegister', payload);
      console.log("after api call");
      setMsg({ type: 'success', text: 'Donor registered successfully.' });
      setForm(initialForm);
      setErrors({});

    } catch (err) {
      const serverMsg = err?.response?.data?.message || err.message || 'Submission failed';
      setMsg({ type: 'error', text: serverMsg });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm(initialForm);
    setErrors({});
    setMsg(null);
  };

  return (
    <>
      <header className="home-header">
        <div className="header-content">
          <div className="header-logo">Donor Connect</div>
          <button className="header-login-btn" onClick={() => navigate('/login')}>
            Hospital Login
          </button>
        </div>
      </header>
      <div className="home-container">
        <style>{`
/* Header styles */
.home-header {
  background: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}
.header-content {
  max-width: 980px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header-logo {
  color: var(--brand-red);
  font-weight: 700;
  font-size: 1.25rem;
}
.header-login-btn {
  background: transparent;
  border: 1px solid var(--brand-red-600);
  color: var(--brand-red-600);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}
.header-login-btn:hover {
  background: var(--brand-red-600);
  color: white;
}

:root{
  --brand-red: #e11d48;
  --brand-red-600: #dc163f;
  --brand-red-700: #b41433;
  --muted: #6b7280;
  --card-bg: #ffffff;
  --surface: linear-gradient(180deg, rgba(255,255,255,0.9), rgba(249,250,251,0.9));
}

.home-container {
  min-height: calc(100vh - 70px); /* Adjust for header height */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  padding-top: 70px;
  background: radial-gradient(1000px 400px at 10% 10%, rgba(225,29,72,0.06), transparent),
              radial-gradient(800px 300px at 90% 90%, rgba(220,20,60,0.04), transparent);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
}

/* Card */
.home-card {
  width: 100%;
  max-width: 980px;
  background: var(--card-bg);
  border-radius: 14px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 0;
  border-top: 6px solid var(--brand-red);
}

/* Left panel (form) */
.home-form {
  padding: 2.4rem;
}

/* Right visual / info */
.home-aside {
  background: linear-gradient(180deg, rgba(225,29,72,0.2), rgba(255,255,255,0.2));
  padding: 2.2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  justify-content: center;
}

/* Headings */
.home-title {
  color: var(--brand-red-600);
  font-weight: 700;
  letter-spacing: -0.02em;
  font-size: 1.45rem;
  margin-bottom: 0.25rem;
}

.home-sub {
  color: var(--muted);
  margin-bottom: 1rem;
  font-size: 0.95rem;
}

/* Inputs override for more polished look */
.field-row { display: flex; gap: 0.75rem; }
.field { flex: 1; display:flex; flex-direction:column; gap:0.45rem; margin-bottom:0.9rem; }
.label { font-size: 0.85rem; color: #374151; font-weight:600; }
.home-input,
.home-select,
.home-textarea {
  border: 1px solid #c9c9c9ff;
  background: #fff;
  padding: 0.65rem 0.9rem;
  border-radius: 10px;
  box-shadow: inset 0 -1px 0 rgba(15,23,42,0.02);
  transition: box-shadow .15s ease, border-color .15s ease, transform .05s ease;
  font-size: 0.95rem;
  color: #111827;
}

.home-input:focus,
.home-select:focus,
.home-textarea:focus {
  outline: none;
  border-color: var(--brand-red);
  box-shadow: 0 8px 24px rgba(225,29,72,0.06);
  transform: translateY(-1px);
}

/* Error states */
.error input,
.error select,
.error textarea,
.error .home-input,
.error .home-select {
  border-color: #fca5a5 !important;
  background: #fff7f7 !important;
}

/* Checkbox style */
.checkbox-wrap { display:flex; align-items:center; gap:0.6rem; margin-bottom:0.6rem; }
.checkbox { width: 18px; height: 18px; border-radius: 5px; border: 1px solid #e5e7eb; display:inline-grid; place-items:center; background:white; }
.checkbox:checked { background: var(--brand-red); border-color: var(--brand-red); color: white; }

/* Submit button */
.home-btn {
  background: linear-gradient(180deg, var(--brand-red) 0%, var(--brand-red-700) 100%);
  color: white;
  padding: 0.9rem 1.1rem;
  border-radius: 12px;
  font-weight: 600;
  box-shadow: 0 10px 28px rgba(225,29,72,0.12);
  transition: transform .08s ease, box-shadow .12s ease, opacity .12s ease;
  border: none;
  cursor: pointer;
}
.home-btn[disabled] { opacity: 0.6; cursor: not-allowed; transform:none; }

/* Message box */
.msg-success {
  background: #ecfdf5;
  color: #065f46;
  border-radius: 10px;
  padding: 0.75rem;
  margin-bottom: 1rem;
}
.msg-error {
  background: #fff1f2;
  color: #7f1d1d;
  border-radius: 10px;
  padding: 0.75rem;
  margin-bottom: 1rem;
}

/* Right aside visual */
.aside-card {
  background: transparent;
  padding: 1.2rem;
  border-radius: 10px;
  width: 100%;
  text-align:center;
}
.aside-big {
  font-size: 3.4rem;
  font-weight:700;
  color: var(--brand-red-700);
  line-height: 1;
  margin-bottom: 0.4rem;
}
.aside-note { color: var(--muted); font-size:0.95rem; }

/* Responsive */
@media (max-width: 920px){
  .home-card {
    grid-template-columns: 1fr;
  }
  .home-aside {
    order: -1;
  }
}
      `}</style>

        <div className="home-card" role="region" aria-label="Donor registration card">
          <form className="home-form" onSubmit={handleSubmit} noValidate>
            <h2 className="home-title">Blood Donor Registration</h2>
            <p className="home-sub">Register as a donor — we will contact you if you're matched.</p>

            {msg?.type === 'success' && <div className="msg-success" role="status">{msg.text}</div>}
            {msg?.type === 'error' && <div className="msg-error" role="alert">{msg.text}</div>}

            <div className={cn('field', errors.fullName && 'error')}>
              <label className="label" htmlFor="fullname">Full name</label>
              <input
                id="fullname"
                name="fullName"
                className="home-input"
                value={form.fullName}
                onChange={handleChange}
              />
              {errors.fullName && <small style={{ color: '#b91c1c' }}>{errors.fullName}</small>}
            </div>

            <div className="field-row">
              <div className={cn('field', errors.bloodType && 'error')}>
                <label className="label" htmlFor="bloodType">Blood type</label>
                <select
                  id="bloodType"
                  name="bloodType"
                  className="home-select"
                  value={form.bloodType}
                  onChange={handleChange}
                >
                  <option value="">Select type</option>
                  {bloodTypes.map(bt => <option key={bt} value={bt}>{bt}</option>)}
                </select>
                {errors.bloodType && <small style={{ color: '#b91c1c' }}>{errors.bloodType}</small>}
              </div>
            </div>

            <div className="field-row">
              <div className={cn('field', errors.phoneNo && 'error')}>
                <label className="label" htmlFor="phone">Phone</label>
                <input
                  id="phone"
                  name="phoneNo"
                  className="home-input"
                  value={form.phoneNo}
                  onChange={handleChange}
                />
                {errors.phoneNo && <small style={{ color: '#b91c1c' }}>{errors.phoneNo}</small>}
              </div>

              <div className={cn('field', errors.city && 'error')}>
                <label className="label" htmlFor="city">City</label>
                <input
                  id="city"
                  name="city"
                  className="home-input"
                  value={form.city}
                  onChange={handleChange}
                />
                {errors.city && <small style={{ color: '#b91c1c' }}>{errors.city}</small>}
              </div>
            </div>

            <div className="field-row">
              <div className={cn('field', errors.age && 'error')}>
                <label className="label" htmlFor="age">Age</label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  min="16"
                  className="home-input"
                  value={form.age}
                  onChange={handleChange}
                />
                {errors.age && <small style={{ color: '#b91c1c' }}>{errors.age}</small>}
              </div>

              <div className={cn('field', errors.email && 'error')}>
                <label className="label" htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="home-input"
                  value={form.email}
                  onChange={handleChange}
                />
                {errors.email && <small style={{ color: '#b91c1c' }}>{errors.email}</small>}
              </div>
            </div>

            <div style={{ marginTop: 6 }}>
              <div className="label" style={{ marginBottom: 6 }}>Immediate screening</div>
              <label className="checkbox-wrap">
                <input
                  type="checkbox"
                  name="recentDonate"
                  className="checkbox"
                  checked={form.screening.recentDonate}
                  onChange={handleScreeningChange}
                /> <span>Recent blood donation</span>
              </label>

              <label className="checkbox-wrap">
                <input
                  type="checkbox"
                  name="recentAntibiotics"
                  className="checkbox"
                  checked={form.screening.recentAntibiotics}
                  onChange={handleScreeningChange}
                /> <span>Recent antibiotics</span>
              </label>

              <label className="checkbox-wrap">
                <input
                  type="checkbox"
                  name="recentVaccination"
                  className="checkbox"
                  checked={form.screening.recentVaccination}
                  onChange={handleScreeningChange}
                /> <span>Recent vaccination</span>
              </label>

              <label className="checkbox-wrap">
                <input
                  type="checkbox"
                  name="chronicCondition"
                  className="checkbox"
                  checked={form.screening.chronicCondition}
                  onChange={handleScreeningChange}
                /> <span>Chronic medical condition</span>
              </label>
            </div>

            <div style={{ marginTop: 14, display: 'flex', gap: 10, alignItems: 'center' }}>
              <button className="home-btn" type="submit" disabled={loading}>
                {loading ? 'Submitting...' : 'Register as Donor'}
              </button>
              <button
                type="button"
                onClick={handleReset}
                style={{
                  background: 'transparent',
                  border: '1px solid #e6e6e6',
                  padding: '0.6rem 0.9rem',
                  borderRadius: 10,
                  cursor: 'pointer'
                }}
              >
                Reset
              </button>
            </div>
          </form>

          <aside className="home-aside" aria-hidden="false">
            <div className="aside-card">
              <div className="aside-big">Be a Hero</div>
              <div className="aside-note">Your donation can save up to 3 lives. Eligible donors are screened before donation.</div>
            </div>

            <div style={{ width: '100%', textAlign: 'center', marginTop: 12 }}>
              <small style={{ color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Need help?</small>
              <a href="mailto:support@donor.example" style={{ color: 'var(--brand-red-600)', fontWeight: 600, textDecoration: 'none' }}>Contact support</a>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
