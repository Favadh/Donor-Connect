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
      <header className="formdata-header">
        <style>{`
          .formdata-header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 64px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #ffffff;
            border-bottom: 1px solid rgba(0,0,0,0.06);
            box-shadow: 0 6px 18px rgba(0,0,0,0.06);
            z-index: 1000;
            backdrop-filter: saturate(120%) blur(6px);
          }
          .formdata-header-inner {
            max-width: 720px;
            width: 100%;
            padding: 0 24px;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            box-sizing: border-box;
          }
          .formdata-brand {
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .formdata-brand-text {
            font-family: Arial, sans-serif;      
            font-size: 30px;
            font-weight: 700;
            color: #f44336;
            letter-spacing: 0.3px;
            text-transform: none;
            margin-left: 2px;
            text-shadow: none;
            font-style: normal;
          }
          .formdata-container {
            max-width: 720px;
            width: calc(100% - 32px);
            margin: 96px auto 32px;
            padding: 24px;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            background: #f9f9f9;
            font-family: Segoe UI, Tahoma, Geneva, Verdana, sans-serif;
            color: #333;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            box-sizing: border-box;
          }
          .formdata-title {
            margin-bottom: 12px;
            font-size: 24px;
            color: #f44336;
            font-weight: 700;
          }
          .formdata-form-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .formdata-form-group {
            display: flex;
            flex-direction: column;
            margin-bottom: 12px;
          }
          .formdata-label {
            margin-bottom: 6px;
            font-size: 14px;
            font-weight: 600;
            color: #555;
          }
          .formdata-input {
            padding: 10px 12px;
            border: 1px solid #ccc;
            border-radius: 8px;
            font-size: 14px;
            background-color: #fff;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            box-sizing: border-box;
            width: 100%;
          }
          .address-row {
            display: flex;
            gap: 8px;
          }
          .address-city {
            flex: 1;
          }
          .address-state {
            width: 180px;
            appearance: none;
            background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23555' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
            background-repeat: no-repeat;
            background-position: right 12px center;
            background-size: 14px;
            padding-right: 32px;
          }
          .address-zip {
            width: 120px;
          }
          .formdata-btn-row {
            display: flex;
            gap: 12px;
            margin-top: 16px;
            justify-content: flex-end;
          }
          .formdata-button {
            padding: 10px 16px;
            background: #f44336;
            color: #fff;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: background 0.3s;
          }
          .formdata-button:hover {
            background: #d32f2f;
          }
          .formdata-cancel {
            padding: 10px 16px;
            background: #fff;
            color: #f44336;
            border: 1px solid #f44336;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: background 0.3s;
          }
          .formdata-cancel:hover {
            background: #ffeeee;
          }
          .formdata-status {
            margin-top: 10px;
            font-size: 14px;
          }
          .formdata-error {
            color: #b00020;
          }
          .formdata-success {
            color: #006600;
          }

          /* Responsiveness breakpoint */
          @media (max-width: 600px) {
            .formdata-container {
              margin: 80px 16px 24px;
              padding: 16px;
            }
            .formdata-brand-text {
              font-size: 24px;
            }
            .formdata-title {
              font-size: 20px;
            }
            .address-row {
              flex-direction: column;
              gap: 8px;
            }
            .address-state, .address-zip {
              width: 100%;
            }
            .formdata-btn-row {
              flex-direction: column-reverse;
              gap: 10px;
            }
            .formdata-button, .formdata-cancel {
              width: 100%;
              padding: 12px;
            }
          }
        `}</style>
        <div className="formdata-header-inner">
          <div className="formdata-brand">
            <div className="formdata-brand-text">DonorConnect</div>
          </div>
        </div>
      </header>

      <div className="formdata-container">
        <div className="formdata-title">Register a Hospital</div>
        <form onSubmit={handleSubmit}>
          <div className="formdata-form-grid">
            <div className="formdata-form-group">
              <label className="formdata-label">Hospital Name *</label>
              <input
                name="hospitalName"
                value={form.hospitalName}
                onChange={handleChange}
                className="formdata-input"
                type="text"
                aria-label="Hospital Name"
              />
            </div>

            <div className="formdata-form-group">
              <label className="formdata-label">Google Maps Link *</label>
              <input
                name="gMapLink"
                value={form.gMapLink}
                onChange={handleChange}
                className="formdata-input"
                placeholder="https://maps.google.com/..."
                type="url"
                aria-label="Google Maps Link"
              />
            </div>

            <div className="formdata-form-group">
              <label className="formdata-label">Address *</label>

              <input
                name="street"
                value={form.address.street}
                onChange={(e) =>
                  setForm((s) => ({ ...s, address: { ...s.address, street: e.target.value } }))
                }
                className="formdata-input"
                style={{ marginBottom: 8 }}
                placeholder="Street"
                type="text"
                aria-label="Street"
              />

              <div className="address-row">
                <input
                  name="city"
                  value={form.address.city}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, address: { ...s.address, city: e.target.value } }))
                  }
                  className="formdata-input address-city"
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
                  className="formdata-input address-state"
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
                  className="formdata-input address-zip"
                  placeholder="ZIP Code"
                  type="text"
                  aria-label="ZIP Code"
                />
              </div>
            </div>

            <div className="formdata-form-group">
              <label className="formdata-label">Phone *</label>
              <input
                name="phoneNo"
                value={form.phoneNo}
                onChange={handleChange}
                className="formdata-input"
                placeholder="+91"
                type="tel"
                aria-label="Phone"
              />
            </div>
          </div>

          <div className="formdata-btn-row">
            <button type="button" onClick={handleClear} className="formdata-cancel" disabled={loading}>
              Reset
            </button>
            <button type="submit" className="formdata-button" disabled={loading}>
              {loading ? 'Submitting...' : 'Register Hospital'}
            </button>
          </div>

          <div className="formdata-status">
            {error && <div className="formdata-error">{error}</div>}
            {success && <div className="formdata-success">{success}</div>}
          </div>
        </form>
      </div>
    </>
  )
}

export default Formdata
