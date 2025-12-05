import React, { useState } from 'react'
import api from '../../utils/axios.js';
import { useNavigate } from 'react-router-dom';

const Formdata = () => {
  const [form, setForm] = useState({
    hospitalName: '',
    phoneNo: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
    },
    gMapLink: '',
  });

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate();

  const styles = {
    header: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: 64,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#ffffff',
      borderBottom: '1px solid rgba(0,0,0,0.06)',
      boxShadow: '0 6px 18px rgba(0,0,0,0.06)',
      zIndex: 1000,
      backdropFilter: 'saturate(120%) blur(6px)',
    },
    headerInner: {
      maxWidth: 720,
      width: '100%',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    brand: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
    },

    brandText: {
      fontFamily: 'Arial, sans-serif',      
      fontSize: 30,
      fontWeight: 700,
      color: '#f44336', // professional navy
      letterSpacing: '0.3px',
      textTransform: 'none',
      marginLeft: 2,
      textShadow: 'none',
      fontStyle: 'normal',
    },

    nav: {
      display: 'flex',
      gap: 18,
      alignItems: 'center',
    },
    navLink: {
      fontSize: 14,
      color: '#555',
      textDecoration: 'none',
      cursor: 'pointer',
      padding: '8px 12px',
      borderRadius: 8,
      transition: 'background 0.18s, color 0.18s',
    },

    container: {
      maxWidth: 720,
      margin: '96px auto',
      padding: 24,
      border: '1px solid #e0e0e0',
      borderRadius: 8,
      background: '#f9f9f9',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
      color: '#333',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    title: { marginBottom: 12, fontSize: 24, color: '#f44336', fontWeight: 700 },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: 16,
    },
    fullWidth: { gridColumn: '1 / -1' },
    formGroup: { display: 'flex', flexDirection: 'column', marginBottom: 12 },
    label: { marginBottom: 6, fontSize: 14, fontWeight: 600, color: '#555' },
    input: {
      padding: '10px 12px',
      border: '1px solid #ccc',
      borderRadius: 8,
      fontSize: 14,
      backgroundColor: '#fff',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    },
    btnRow: {
      display: 'flex',
      gap: 12,
      marginTop: 16,
      justifyContent: 'flex-end',
    },
    button: {
      padding: '10px 16px',
      background: '#f44336',
      color: '#fff',
      border: 'none',
      borderRadius: 8,
      cursor: 'pointer',
      fontWeight: 600,
      transition: 'background 0.3s',
    },
    cancel: {
      padding: '10px 16px',
      background: '#fff',
      color: '#f44336',
      border: '1px solid #f44336',
      borderRadius: 8,
      cursor: 'pointer',
      fontWeight: 600,
      transition: 'background 0.3s',
    },
    status: { marginTop: 10, fontSize: 14 },
    error: { color: '#b00020' },
    success: { color: '#006600' },
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }))
    setError('')
    setSuccess('')
  }

  const validate = () => {
    const gMapLink = form.gMapLink;
    const phoneNo = form.phoneNo;

    if (!form.hospitalName || form.hospitalName.toString().trim() === '') {
      return 'Field "hospitalName" is required.'
    }

    if (!gMapLink || gMapLink.toString().trim() === '') {
      return 'Field "Google map link" is required.'
    }

    const addr = form.address
    if (!addr || typeof addr !== 'object') {
      return 'Address is required.'
    }

    const requiredAddress = ['street', 'city', 'state', 'zipCode']
    for (const key of requiredAddress) {
      if (!addr[key] || addr[key].toString().trim() === '') {
      return `Address field "${key}" is required.`
      }
    }

    if (!phoneNo || phoneNo.toString().trim() === '') {
      return 'Field "phoneNo" is required.'
    }

    if (!/^https?:\/\/.+/.test(gMapLink)) return 'Google Maps link must be a valid URL (http/https).'
    if (!/^\+?\d{7,15}$/.test(phoneNo))
      return 'Phone number must contain only digits and optional leading + (7-15 digits).'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    const v = validate()
    if (v) {
      setError(v)
      return
    }

    setLoading(true)
    try {
      const res = await api.post('/createHospital', form);
      setSuccess(res.data.msg);
      setForm({
        hospitalName: '',
        gMapLink: '',
        address: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
        },
        phoneNo: '',
      });
      
      navigate('/dashboard');

    } catch (err) {
      const errMessage =
        err?.response?.data?.message ||
        err?.response?.data ||
        err?.message ||
        'Registration failed'
      setError(errMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setForm({
      hospitalName: '',
      gMapLink: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
      },
      phoneNo: '',
    })
    setError('')
    setSuccess('')
  }

  return (
    <>
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.brand}>
            <div style={styles.brandText}>DonorConnect</div>
          </div>
        </div>
      </header>

      <div style={styles.container}>
        <div style={styles.title}>Register a Hospital</div>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGrid}>
            <div style={{ ...styles.formGroup, ...styles.fullWidth }}>
              <label style={styles.label}>Hospital Name *</label>
              <input
                name="hospitalName"
                value={form.hospitalName}
                onChange={handleChange}
                style={styles.input}
                type="text"
                aria-label="Hospital Name"
              />
            </div>

            <div style={{ ...styles.formGroup, ...styles.fullWidth }}>
              <label style={styles.label}>Google Maps Link *</label>
              <input
                name="gMapLink"
                value={form.gMapLink}
                onChange={handleChange}
                style={styles.input}
                placeholder="https://maps.google.com/..."
                type="url"
                aria-label="Google Maps Link"
              />
            </div>

            <div style={{ ...styles.formGroup, ...styles.fullWidth }}>
              <label style={styles.label}>Address *</label>

              <input
                name="street"
                value={form.address.street}
                onChange={(e) =>
                  setForm((s) => ({ ...s, address: { ...s.address, street: e.target.value } }))
                }
                style={{ ...styles.input, marginBottom: 8 }}
                placeholder="Street"
                type="text"
                aria-label="Street"
              />

              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  name="city"
                  value={form.address.city}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, address: { ...s.address, city: e.target.value } }))
                  }
                  style={{ ...styles.input, flex: 1 }}
                  placeholder="City"
                  type="text"
                  aria-label="City"
                />

                <select
                  name="state"
                  value={form.address.state}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, address: { ...s.address, state: e.target.value } }))
                  }
                  style={{ ...styles.input, width: 180, appearance: 'none' }}
                  aria-label="State"
                >
                  <option value="">Select State</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Goa">Goa</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Telangana">Telangana</option>
                  <option value="West Bengal">West Bengal</option>
                  <option value="Delhi">Delhi</option>
                </select>

                <input
                  name="zipCode"
                  value={form.address.zipCode}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, address: { ...s.address, zipCode: e.target.value } }))
                  }
                  style={{ ...styles.input, width: 120 }}
                  placeholder="ZIP Code"
                  type="text"
                  aria-label="ZIP Code"
                />
              </div>
            </div>

            <div style={{ ...styles.formGroup, ...styles.fullWidth }}>
              <label style={styles.label}>Phone *</label>
              <input
                name="phoneNo"
                value={form.phoneNo}
                onChange={handleChange}
                style={styles.input}
                placeholder="+91"
                type="tel"
                aria-label="Phone"
              />
            </div>
          </div>

          <div style={styles.btnRow}>
            <button type="button" onClick={handleClear} style={styles.cancel} disabled={loading}>
              Reset
            </button>
            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? 'Submitting...' : 'Register Hospital'}
            </button>
          </div>

          <div style={styles.status}>
            {error && <div style={styles.error}>{error}</div>}
            {success && <div style={styles.success}>{success}</div>}
          </div>
        </form>
      </div>
    </>
  )
}

export default Formdata
