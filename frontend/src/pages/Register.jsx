import {
  AlertCircle,
  ArrowRight,
  BrainCircuit,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  loginUser,
  registerUser,
} from "../services/auth";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function submit(event) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      await registerUser({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      await loginUser({
        email: email.trim(),
        password,
      });

      navigate("/dashboard", {
        replace: true,
      });

    } catch (err) {
      const detail =
        err.response?.data?.detail;

      const message =
        typeof detail === "string"
          ? detail
          : Array.isArray(detail)
            ? detail
                .map(
                  (item) => item.msg
                )
                .join(", ")
            : "Unable to create account.";

      setError(message);

    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-shell">

      <section className="auth-visual">

        <div className="brand-mark">
          <BrainCircuit size={24} />
        </div>

        <div
          className="auth-visual-title"
          style={{ marginTop: 15 }}
        >
          TrialMatch
        </div>

        <div className="auth-visual-subtitle">
          AI-assisted Clinical Trial Matching Platform
        </div>

        <p
          style={{
            marginTop: 24,
            maxWidth: 520,
            lineHeight: 1.8,
            color: "#62748a",
          }}
        >
          Create a secure healthcare workspace
          for patient management, report
          intelligence and clinical trial discovery.
        </p>

        <div
          style={{
            display: "flex",
            gap: 22,
            marginTop: 28,
            flexWrap: "wrap",
          }}
        >
          <Feature
            icon={ShieldCheck}
            text="Secure workspace"
          />

          <Feature
            icon={BrainCircuit}
            text="AI-assisted analysis"
          />
        </div>

      </section>


      <section className="auth-content">

        <div className="auth-box">

          <div className="badge badge-blue">
            New workspace
          </div>

          <h1 style={{ marginTop: 14 }}>
            Create your account
          </h1>

          <p>
            Start managing patients and
            discovering relevant clinical trials.
          </p>

          {error && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginTop: 18,
                padding: "11px 13px",
                borderRadius: 10,
                background: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#b91c1c",
                fontSize: 12,
              }}
            >
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          <form
            className="auth-form"
            onSubmit={submit}
          >

            <div className="form-group">
              <label className="form-label">
                Full name
              </label>

              <div style={{ position: "relative" }}>

                <UserRound
                  size={15}
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform:
                      "translateY(-50%)",
                    color: "#94a3b8",
                  }}
                />

                <input
                  required
                  type="text"
                  className="form-input"
                  style={{
                    paddingLeft: 38,
                  }}
                  placeholder="Your full name"
                  value={name}
                  onChange={(event) =>
                    setName(
                      event.target.value
                    )
                  }
                />

              </div>
            </div>


            <div className="form-group">
              <label className="form-label">
                Email address
              </label>

              <div style={{ position: "relative" }}>

                <Mail
                  size={15}
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform:
                      "translateY(-50%)",
                    color: "#94a3b8",
                  }}
                />

                <input
                  required
                  type="email"
                  className="form-input"
                  style={{
                    paddingLeft: 38,
                  }}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                />

              </div>
            </div>


            <div className="form-group">
              <label className="form-label">
                Password
              </label>

              <div style={{ position: "relative" }}>

                <LockKeyhole
                  size={15}
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform:
                      "translateY(-50%)",
                    color: "#94a3b8",
                  }}
                />

                <input
                  required
                  minLength={6}
                  type="password"
                  className="form-input"
                  style={{
                    paddingLeft: 38,
                  }}
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                />

              </div>
            </div>


            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading
                ? "Creating account..."
                : "Create account"}

              <ArrowRight size={15} />
            </button>

          </form>


          <div className="auth-divider">
            OR
          </div>

          <div
            style={{
              textAlign: "center",
              color: "#7b899c",
              fontSize: 12,
            }}
          >
            Already have an account?{" "}

            <Link
              to="/login"
              style={{
                color: "#0f766e",
                fontWeight: 800,
              }}
            >
              Sign in
            </Link>
          </div>

        </div>

      </section>

    </div>
  );
}


function Feature({
  icon: Icon,
  text,
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        color: "#52677d",
        fontSize: 11,
      }}
    >
      <Icon size={15} />
      {text}
    </div>
  );
}
