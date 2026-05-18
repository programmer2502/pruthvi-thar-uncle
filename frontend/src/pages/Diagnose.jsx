import React, { useState } from 'react';
import { Activity, AlertTriangle, CheckCircle, Wrench, IndianRupee, RefreshCw, Cpu, SearchCode } from 'lucide-react';
import axios from 'axios';
import './Diagnose.css';

const Diagnose = () => {
  const [symptoms, setSymptoms] = useState('');
  const [obdData, setObdData] = useState({ rpm: '', temp: '', dtc: '' });
  const [showObd, setShowObd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handlePredict = async (e) => {
    e.preventDefault();
    if (!symptoms && !obdData.dtc) {
      setError('Please provide symptoms or a DTC code to diagnose.');
      return;
    }
    
    setLoading(true);
    setError('');
    setResult(null);

    const payload = {
      symptoms,
      obd_data: {
        rpm: obdData.rpm ? parseInt(obdData.rpm) : 0,
        temp: obdData.temp ? parseInt(obdData.temp) : 0,
        dtc: obdData.dtc || ""
      }
    };

    try {
      // Assuming FastAPI is running on port 8000
      const response = await axios.post('http://localhost:8000/predict', payload);
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'An error occurred while connecting to the AI server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="diagnose-page container animate-fade-in">
      <div className="diagnose-header">
        <h1 className="text-gradient">AI Vehicle Diagnostic Center</h1>
        <p>Describe your issue or connect OBD-II data for an instant AI analysis.</p>
      </div>

      <div className="diagnose-container">
        {/* Input Form */}
        <div className="diagnose-form-card glass-panel">
          <h3><Activity size={20} className="icon-blue" /> Input Details</h3>
          <form onSubmit={handlePredict}>
            <div className="form-group">
              <label className="input-label">Vehicle Symptoms</label>
              <textarea 
                placeholder="E.g., Engine making a clicking sound, car won't start, pulling to the right..."
                rows="4"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
              />
            </div>

            <div className="obd-toggle" onClick={() => setShowObd(!showObd)}>
              <Cpu size={18} />
              <span>{showObd ? 'Hide OBD-II Input' : 'Add OBD-II Data (Advanced)'}</span>
            </div>

            {showObd && (
              <div className="obd-grid animate-fade-in">
                <div className="form-group">
                  <label className="input-label">RPM</label>
                  <input 
                    type="number" 
                    placeholder="E.g., 1500" 
                    value={obdData.rpm}
                    onChange={(e) => setObdData({...obdData, rpm: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="input-label">Engine Temp (°C)</label>
                  <input 
                    type="number" 
                    placeholder="E.g., 90" 
                    value={obdData.temp}
                    onChange={(e) => setObdData({...obdData, temp: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="input-label">DTC Code</label>
                  <input 
                    type="text" 
                    placeholder="E.g., P0300" 
                    value={obdData.dtc}
                    onChange={(e) => setObdData({...obdData, dtc: e.target.value})}
                  />
                </div>
              </div>
            )}

            {error && <div className="error-message"><AlertTriangle size={18} /> {error}</div>}

            <button 
              type="submit" 
              className="btn-primary predict-btn" 
              disabled={loading}
            >
              {loading ? (
                <><RefreshCw className="spinner" size={20} /> Analyzing Data...</>
              ) : (
                <><SearchCode size={20} /> Diagnose Issue</>
              )}
            </button>
          </form>
        </div>

        {/* Results Panel */}
        <div className={`diagnose-result-card glass-panel ${result ? 'has-result' : ''}`}>
          {!result && !loading && (
            <div className="empty-state">
              <SearchCode size={64} className="icon-purple empty-icon" />
              <h3>Awaiting Input</h3>
              <p>Your diagnostic results will appear here after AI analysis.</p>
            </div>
          )}

          {loading && (
            <div className="loading-state">
              <div className="scanner"></div>
              <h3>AI is processing data...</h3>
              <p className="loading-text">Scanning thousands of fault patterns</p>
            </div>
          )}

          {result && (
            <div className="result-content animate-fade-in delay-100">
              <div className="result-header">
                <div>
                  <h4 className="result-title">Detected Fault</h4>
                  <h2 className={`fault-name ${result.severity.toLowerCase()}`}>{result.fault}</h2>
                </div>
                <div className="confidence-badge">
                  <span>Confidence</span>
                  <strong>{result.confidence}</strong>
                </div>
              </div>

              <div className="severity-bar-container">
                <div className="severity-label">
                  <span>Severity Level:</span>
                  <span className={`severity-text ${result.severity.toLowerCase()}`}>{result.severity}</span>
                </div>
                <div className="severity-bar">
                  <div className={`severity-fill ${result.severity.toLowerCase()}`}></div>
                </div>
              </div>

              <div className="fixes-grid">
                <div className="fix-card temp-fix">
                  <h4><AlertTriangle size={18} /> Temporary Fix</h4>
                  <p>{result.temporary_fix}</p>
                </div>
                <div className="fix-card perm-fix">
                  <h4><CheckCircle size={18} /> Permanent Solution</h4>
                  <p>{result.permanent_fix}</p>
                </div>
              </div>

              <div className="cost-estimate">
                <h4><IndianRupee size={20} /> Estimated Repair Cost</h4>
                <div className="cost-value">{result.estimated_cost}</div>
                <p className="cost-note">Prices may vary based on location and vehicle model.</p>
              </div>

              {result.enhanced_answer && (
                <div className="ai-explanation glass-panel">
                  <h4><Activity size={20} className="icon-blue" /> AI Analysis</h4>
                  <p>{result.enhanced_answer}</p>
                </div>
              )}

              <button className="btn-secondary restart-btn" onClick={() => setResult(null)}>
                <RefreshCw size={18} /> New Diagnosis
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Diagnose;
