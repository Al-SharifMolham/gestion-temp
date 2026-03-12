import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { ROLES } from "../../utils/constants";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const isDark = theme === "dark";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const userData = await login(email, password);
      const role = userData?.role?.trim().toLowerCase();
      const from = location.state?.from?.pathname;

      const adminRole = ROLES.ADMIN.toLowerCase();
      const instructorRole = ROLES.INSTRUCTOR.toLowerCase();
      const studentRole = ROLES.STUDENT.toLowerCase();

      // Keep "from", but only if it matches the logged-in user's role section
      if (from) {
        if (role === adminRole && from.startsWith("/admin")) {
          navigate(from, { replace: true });
          return;
        }

        if (role === instructorRole && from.startsWith("/instructor")) {
          navigate(from, { replace: true });
          return;
        }

        if (role === studentRole && from.startsWith("/student")) {
          navigate(from, { replace: true });
          return;
        }
      }

      // Default redirect by role
      if (role === adminRole) {
        navigate("/admin", { replace: true });
      } else if (role === instructorRole) {
        navigate("/instructor/timetable", { replace: true });
      } else if (role === studentRole) {
        navigate("/student/timetable", { replace: true });
      } else {
        navigate("/unauthorized", { replace: true });
      }
    } catch {
      setError("Email ou mot de passe invalide");
    } finally {
      setIsLoading(false);
    }
  };

  const labelSt = {
    display: "block",
    fontSize: 10,
    fontWeight: 700,
    color: "var(--text-3)",
    marginBottom: 7,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    fontFamily: "'JetBrains Mono', monospace",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background: "var(--bg-root)",
        fontFamily: "'Sora', sans-serif",
        transition: "background 0.25s",
      }}
    >
      {/* Left panel */}
      <div
        style={{
          width: 420,
          flexShrink: 0,
          background: isDark
            ? "linear-gradient(160deg, #004d26 0%, #001a0d 60%, #1a0005 100%)"
            : "linear-gradient(160deg, #006837 0%, #004d26 60%, #8b000f 100%)",
          display: "flex",
          flexDirection: "column",
          padding: "48px 44px",
          position: "relative",
          overflow: "hidden",
        }}
        className="login-panel"
      >
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 260,
            height: 260,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.04)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -60,
            left: -60,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.03)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 5,
            height: "100%",
            background: "var(--red)",
            opacity: 0.8,
          }}
        />

        <div style={{ position: "relative", marginBottom: "auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 48,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(8px)",
              }}
            >
              <svg
                width={20}
                height={20}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.2}
                stroke="white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                />
              </svg>
            </div>
            <div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: "#fff",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                OFPPT
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "rgba(255,255,255,0.6)",
                  letterSpacing: "0.08em",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                TIMETABLE SYSTEM
              </div>
            </div>
          </div>

          <h2
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "-0.025em",
              lineHeight: 1.2,
              margin: "0 0 14px",
            }}
          >
            Gérez vos emplois
            <br />
            du temps facilement
          </h2>

          <p
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.55)",
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            Système de gestion des emplois du temps pour administrateurs,
            formateurs et stagiaires.
          </p>
        </div>

        <div style={{ position: "relative", marginTop: 48 }}>
          <p
            style={{
              margin: 0,
              fontSize: 10,
              color: "rgba(255,255,255,0.3)",
              letterSpacing: "0.08em",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            OFFICE DE LA FORMATION PROFESSIONNELLE
            <br />
            ET DE LA PROMOTION DU TRAVAIL
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 32,
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", top: 20, right: 20 }}>
          <button
            onClick={toggleTheme}
            type="button"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "6px 12px",
              borderRadius: 99,
              background: "var(--bg-card)",
              border: "1px solid var(--border-mid)",
              cursor: "pointer",
              fontSize: 11,
              fontWeight: 600,
              color: "var(--text-3)",
              fontFamily: "'Sora', sans-serif",
            }}
          >
            {isDark ? "☀️ Mode clair" : "🌙 Mode sombre"}
          </button>
        </div>

        <div
          className="animate-scale-in"
          style={{ width: "100%", maxWidth: 360 }}
        >
          <div style={{ marginBottom: 28 }}>
            <h1
              style={{
                margin: "0 0 5px",
                fontSize: 24,
                fontWeight: 800,
                color: "var(--text-1)",
                letterSpacing: "-0.025em",
              }}
            >
              Connexion
            </h1>
            <p style={{ margin: 0, fontSize: 13, color: "var(--text-3)" }}>
              Accédez à votre espace OFPPT
            </p>
          </div>

          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-mid)",
              borderRadius: 18,
              padding: 28,
              boxShadow: "var(--shadow-modal)",
            }}
          >
            {error && (
              <div
                style={{
                  marginBottom: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "9px 13px",
                  borderRadius: 10,
                  background: "var(--red-dim)",
                  border: "1px solid rgba(200,16,46,0.22)",
                  fontSize: 13,
                  color: "var(--red-text)",
                }}
              >
                <svg
                  width={13}
                  height={13}
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  style={{ flexShrink: 0 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: 15 }}
            >
              <div>
                <label style={labelSt}>Adresse e-mail</label>
                <input
                  type="email"
                  required
                  className="input-field"
                  placeholder="vous@ofppt.ma"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label style={labelSt}>Mot de passe</label>
                <input
                  type="password"
                  required
                  className="input-field"
                  placeholder="Entrez votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary"
                style={{ width: "100%", padding: "11px 16px", marginTop: 4 }}
              >
                {isLoading ? (
                  <div
                    style={{
                      width: 15,
                      height: 15,
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTopColor: "#fff",
                      borderRadius: "50%",
                      animation: "_oSpin 0.65s linear infinite",
                    }}
                  />
                ) : (
                  "Se connecter"
                )}
              </button>
            </form>
          </div>

          <p
            style={{
              textAlign: "center",
              fontSize: 10,
              color: "var(--text-4)",
              marginTop: 20,
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.1em",
            }}
          >
            OFPPT — MAROC © {new Date().getFullYear()}
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .login-panel { display: none !important; }
        }
      `}</style>
    </div>
  );
}
