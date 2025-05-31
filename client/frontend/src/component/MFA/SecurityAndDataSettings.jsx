


// import React, { useState, useRef } from "react";

// const API_BASE = "http://localhost:5000";

// export default function SecurityAndDataSettings() {
//   // 2FA State
//   const [show2FAModal, setShow2FAModal] = useState(false);
//   const [qrCode, setQrCode] = useState("");
//   const [secret, setSecret] = useState("");
//   const [token, setToken] = useState("");
//   const [twoFAStatus, setTwoFAStatus] = useState("");
//   const [twoFAError, setTwoFAError] = useState("");

//   // Import/Export State
//   const [importMsg, setImportMsg] = useState("");
//   const fileInputRef = useRef();

//   // 2FA Setup Handler
//   const handleEnable2FA = async () => {
//     setTwoFAStatus("");
//     setTwoFAError("");
//     setShow2FAModal(true);
//     setQrCode("");
//     setSecret("");
//     setToken("");
//     try {
//       const res = await fetch(`${API_BASE}/api/profile/2fa/setup`, { credentials: "include" });
//       if (!res.ok) throw new Error("Failed to start 2FA setup");
//       const data = await res.json();
//       setQrCode(data.qr);
//       setSecret(data.secret);
//     } catch (e) {
//       setTwoFAError("Could not initiate 2FA setup.");
//     }
//   };

//   // 2FA Verify Handler
//   const handleVerify2FA = async (e) => {
//     e.preventDefault();
//     setTwoFAStatus("");
//     setTwoFAError("");
//     try {
//       const res = await fetch(`${API_BASE}/api/profile/2fa/verify`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({ token }),
//       });
//       if (!res.ok) {
//         const data = await res.json().catch(() => ({}));
//         setTwoFAError(data.error || "Invalid code.");
//         return;
//       }
//       setTwoFAStatus("2FA enabled successfully!");
//       setShow2FAModal(false);
//     } catch {
//       setTwoFAError("Verification failed.");
//     }
//   };

//   // Export Handler
//   const handleExport = () => {
//     window.location.href = `${API_BASE}/api/profile/export`;
//   };

//   // Import Handler
//   const handleImport = async (e) => {
//     e.preventDefault();
//     setImportMsg("");
//     const file = fileInputRef.current.files[0];
//     if (!file) {
//       setImportMsg("Choose a CSV file first.");
//       return;
//     }
//     const formData = new FormData();
//     formData.append("file", file);
//     try {
//       const res = await fetch(`${API_BASE}/api/profile/import`, {
//         method: "POST",
//         credentials: "include",
//         body: formData,
//       });
//       if (!res.ok) {
//         const data = await res.json().catch(() => ({}));
//         setImportMsg(data.error || "Import failed.");
//         return;
//       }
//       setImportMsg("Import successful!");
//       fileInputRef.current.value = "";
//     } catch {
//       setImportMsg("Import failed.");
//     }
//   };

//   return (
//     <div style={{ maxWidth: 500, margin: "40px auto", background: "#fafbfc", borderRadius: 10, padding: 30, boxShadow: "0 2px 12px #0001" }}>
//       <h2>Security & Data</h2>
//       {/* 2FA Section */}
//       <section style={{ marginBottom: 32 }}>
//         <h3>Two-Factor Authentication (2FA)</h3>
//         <button onClick={handleEnable2FA} style={{ marginBottom: 10 }}>
//           Enable 2FA
//         </button>
//         {twoFAStatus && <div style={{ color: "green", marginTop: 8 }}>{twoFAStatus}</div>}
//         {twoFAError && <div style={{ color: "red", marginTop: 8 }}>{twoFAError}</div>}
//         {show2FAModal && (
//           <div style={{
//             position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
//             background: "#0007", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
//           }}>
//             <div style={{ background: "#fff", borderRadius: 8, padding: 24, minWidth: 320, boxShadow: "0 4px 16px #0002", textAlign: "center" }}>
//               <h4>Set up 2FA</h4>
//               {qrCode ? (
//                 <>
//                   <p>Scan this QR code with your Authenticator app (e.g. Google Authenticator):</p>
//                   <img src={qrCode} alt="2FA QR Code" style={{ margin: "16px 0", width: 180, height: 180 }} />
//                   <p style={{ fontSize: 12, color: "#666" }}>
//                     Or enter secret manually: <br />
//                     <b>{secret}</b>
//                   </p>
//                   <form onSubmit={handleVerify2FA}>
//                     <input
//                       type="text"
//                       placeholder="Enter 6-digit code"
//                       value={token}
//                       onChange={e => setToken(e.target.value)}
//                       style={{ padding: 8, width: 140, marginBottom: 12 }}
//                       autoFocus
//                     />
//                     <div>
//                       <button type="submit" style={{ marginRight: 10 }}>Verify</button>
//                       <button type="button" onClick={() => setShow2FAModal(false)}>Cancel</button>
//                     </div>
//                   </form>
//                   {twoFAError && <div style={{ color: "red", marginTop: 8 }}>{twoFAError}</div>}
//                 </>
//               ) : (
//                 <div>Loading QR code...</div>
//               )}
//             </div>
//           </div>
//         )}
//       </section>

     

//     </div>
//   );
// }

import React, { useState, useRef } from "react";

const API_BASE = "http://localhost:5000";

export default function SecurityAndDataSettings() {
  // 2FA State
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [token, setToken] = useState("");
  const [twoFAStatus, setTwoFAStatus] = useState("");
  const [twoFAError, setTwoFAError] = useState("");
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);

  // Import/Export State
  const [importMsg, setImportMsg] = useState("");
  const fileInputRef = useRef();

  // Check if 2FA is enabled (you may want to call this on mount)
  const fetch2FAStatus = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/user`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setTwoFAEnabled(!!data.twoFactorEnabled);
      }
    } catch {}
  };

  // Run on mount
  React.useEffect(() => {
    fetch2FAStatus();
  }, []);

  // 2FA Setup Handler
  const handleEnable2FA = async () => {
    setTwoFAStatus("");
    setTwoFAError("");
    setShow2FAModal(true);
    setQrCode("");
    setSecret("");
    setToken("");
    try {
      // This GET returns secret/qr (user has NOT enabled 2FA yet)
      const res = await fetch(`${API_BASE}/api/profile/2fa/setup`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to start 2FA setup");
      const data = await res.json();
      setQrCode(data.qr);
      setSecret(data.secret);
    } catch (e) {
      setTwoFAError("Could not initiate 2FA setup.");
    }
  };

  // 2FA Verify Handler
  const handleVerify2FA = async (e) => {
    e.preventDefault();
    setTwoFAStatus("");
    setTwoFAError("");
    try {
      const res = await fetch(`${API_BASE}/api/profile/2fa/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ token }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setTwoFAError(data.error || "Invalid code.");
        return;
      }
      setTwoFAStatus("2FA enabled successfully!");
      setShow2FAModal(false);
      setTwoFAEnabled(true);
    } catch {
      setTwoFAError("Verification failed.");
    }
  };

  // 2FA Disable Handler
  const handleDisable2FA = async () => {
    setTwoFAStatus("");
    setTwoFAError("");
    try {
      const res = await fetch(`${API_BASE}/api/profile/2fa/disable`, {
        method: "POST",
        credentials: "include"
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setTwoFAError(data.error || "Failed to disable 2FA.");
        return;
      }
      setTwoFAStatus("2FA disabled.");
      setTwoFAEnabled(false);
    } catch {
      setTwoFAError("Failed to disable 2FA.");
    }
  };

  // Export Handler
  const handleExport = () => {
    window.location.href = `${API_BASE}/api/profile/export`;
  };

  // Import Handler
  const handleImport = async (e) => {
    e.preventDefault();
    setImportMsg("");
    const file = fileInputRef.current.files[0];
    if (!file) {
      setImportMsg("Choose a CSV file first.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch(`${API_BASE}/api/profile/import`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setImportMsg(data.error || "Import failed.");
        return;
      }
      setImportMsg("Import successful!");
      fileInputRef.current.value = "";
    } catch {
      setImportMsg("Import failed.");
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", background: "#fafbfc", borderRadius: 10, padding: 30, boxShadow: "0 2px 12px #0001" }}>
      <h2>Security & Data</h2>
      {/* 2FA Section */}
      <section style={{ marginBottom: 32 }}>
        <h3>Two-Factor Authentication (2FA)</h3>
        {!twoFAEnabled ? (
          <button onClick={handleEnable2FA} style={{ marginBottom: 10 }}>
            Enable 2FA
          </button>
        ) : (
          <button onClick={handleDisable2FA} style={{ marginBottom: 10 }}>
            Disable 2FA
          </button>
        )}
        {twoFAStatus && <div style={{ color: "green", marginTop: 8 }}>{twoFAStatus}</div>}
        {twoFAError && <div style={{ color: "red", marginTop: 8 }}>{twoFAError}</div>}
        {show2FAModal && (
          <div style={{
            position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
            background: "#0007", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
          }}>
            <div style={{ background: "#fff", borderRadius: 8, padding: 24, minWidth: 320, boxShadow: "0 4px 16px #0002", textAlign: "center" }}>
              <h4>Set up 2FA</h4>
              {qrCode ? (
                <>
                  <p>Scan this QR code with your Authenticator app (e.g. Google Authenticator):</p>
                  <img src={qrCode} alt="2FA QR Code" style={{ margin: "16px 0", width: 180, height: 180 }} />
                  <p style={{ fontSize: 12, color: "#666" }}>
                    Or enter secret manually: <br />
                    <b>{secret}</b>
                  </p>
                  <form onSubmit={handleVerify2FA}>
                    <input
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={token}
                      onChange={e => setToken(e.target.value)}
                      style={{ padding: 8, width: 140, marginBottom: 12 }}
                      autoFocus
                    />
                    <div>
                      <button type="submit" style={{ marginRight: 10 }}>Verify</button>
                      <button type="button" onClick={() => setShow2FAModal(false)}>Cancel</button>
                    </div>
                  </form>
                  {twoFAError && <div style={{ color: "red", marginTop: 8 }}>{twoFAError}</div>}
                </>
              ) : (
                <div>Loading QR code...</div>
              )}
            </div>
          </div>
        )}
      </section>
     
    </div>
  );
}