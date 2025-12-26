import React from 'react';

const DebugOverlay = () => {
  const [isOpen, setIsOpen] = React.useState(true);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '10px',
          left: '10px',
          zIndex: 9999,
          background: 'rgba(0,0,0,0.8)',
          color: '#0f0',
          border: '1px solid #0f0',
          padding: '5px 10px',
          borderRadius: '4px',
          fontSize: '12px',
          cursor: 'pointer',
          fontFamily: 'monospace'
        }}
      >
        Show Debug
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '400px',
      height: '300px',
      background: 'rgba(0,0,0,0.9)',
      color: '#0f0',
      zIndex: 9999,
      fontSize: '12px',
      display: 'flex',
      flexDirection: 'column',
      borderTopRightRadius: '8px',
      boxShadow: '0 -4px 20px rgba(0,0,0,0.5)',
      fontFamily: 'monospace'
    }}>
      <div style={{
        padding: '8px 12px',
        borderBottom: '1px solid #0f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(0,50,0,0.3)',
        borderTopRightRadius: '8px'
      }}>
        <span style={{ fontWeight: 'bold' }}>Debug Console</span>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => { 
              window.debugLogs = []; 
              const el = document.getElementById('debug-log-content');
              if(el) el.innerText = ''; 
            }}
            style={{ background: 'none', border: 'none', color: '#0f0', cursor: 'pointer', opacity: 0.8 }}
            title="Clear Logs"
          >
            Clear
          </button>
          <button
            onClick={() => setIsOpen(false)}
            style={{ background: 'none', border: 'none', color: '#0f0', cursor: 'pointer', fontSize: '14px' }}
            title="Minimize"
          >
            ▼
          </button>
        </div>
      </div>
      <div style={{
        overflow: 'auto',
        padding: '10px',
        flex: 1
      }}>
        <pre id="debug-log-content" style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
          {(window.debugLogs || []).join('\n')}
        </pre>
      </div>
    </div>
  );
};

export default DebugOverlay;
