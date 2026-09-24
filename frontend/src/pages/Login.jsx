import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from "lucide-react";

import api from "../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const formData = new URLSearchParams();

      formData.append("username", email.trim());
      formData.append("password", password);

      const loginResponse = await api.post("/auth/login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const token = loginResponse.data?.access_token;

      if (!token) {
        throw new Error("Login token was not returned.");
      }

      localStorage.setItem("trialmatch_token", token);

      const meResponse = await api.get("/auth/me");

      localStorage.setItem(
        "trialmatch_user",
        JSON.stringify(meResponse.data)
      );

      navigate("/dashboard", { replace: true });
    } catch (err) {
      const detail = err.response?.data?.detail;

      if (Array.isArray(detail)) {
        setError(detail.map((item) => item.msg).join(", "));
      } else {
        setError(
          detail ||
            "Unable to sign in. Please check your email and password."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        html,
        body,
        #root {
          margin: 0;
          min-height: 100%;
        }

        body {
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        .tm-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at 15% 15%, rgba(111, 76, 255, 0.22), transparent 27%),
            radial-gradient(circle at 88% 78%, rgba(0, 214, 201, 0.16), transparent 25%),
            linear-gradient(135deg, #070b18 0%, #0d1022 50%, #080d19 100%);
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 26px;
        }

        .tm-bg-circle {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(2px);
        }

        .tm-bg-circle.one {
          width: 430px;
          height: 430px;
          left: -180px;
          top: -180px;
          border: 1px solid rgba(128, 105, 255, 0.15);
          box-shadow:
            0 0 0 50px rgba(128, 105, 255, 0.025),
            0 0 0 110px rgba(128, 105, 255, 0.015);
        }

        .tm-bg-circle.two {
          width: 500px;
          height: 500px;
          right: -240px;
          bottom: -240px;
          border: 1px solid rgba(45, 216, 205, 0.11);
          box-shadow:
            0 0 0 60px rgba(45, 216, 205, 0.02),
            0 0 0 120px rgba(45, 216, 205, 0.012);
        }

        .tm-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 38px 38px;
          mask-image: linear-gradient(to bottom, black, transparent 88%);
          pointer-events: none;
        }

        .tm-container {
          width: min(1180px, 100%);
          min-height: 720px;
          display: grid;
          grid-template-columns: 1fr 0.92fr;
          border-radius: 30px;
          overflow: hidden;
          position: relative;
          z-index: 2;
          border: 1px solid rgba(255,255,255,0.10);
          background: rgba(255,255,255,0.045);
          box-shadow:
            0 45px 100px rgba(0,0,0,0.48),
            inset 0 1px 0 rgba(255,255,255,0.05);
          backdrop-filter: blur(22px);
        }

        .tm-left {
          padding: 50px;
          position: relative;
          background:
            radial-gradient(circle at 25% 20%, rgba(100,75,255,0.22), transparent 30%),
            linear-gradient(150deg, #11162b 0%, #0b1120 55%, #07121b 100%);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow: hidden;
        }

        .tm-left::before {
          content: "";
          position: absolute;
          width: 340px;
          height: 340px;
          right: -170px;
          top: 210px;
          border-radius: 50%;
          border: 1px solid rgba(126,110,255,0.12);
          box-shadow:
            0 0 0 45px rgba(126,110,255,0.025),
            0 0 0 90px rgba(126,110,255,0.015);
        }

        .tm-brand {
          display: flex;
          align-items: center;
          gap: 13px;
          position: relative;
          z-index: 2;
        }

        .tm-brand-icon {
          width: 48px;
          height: 48px;
          border-radius: 15px;
          display: grid;
          place-items: center;
          color: #fff;
          background: linear-gradient(145deg, #7d67ff, #39a8ff);
          box-shadow: 0 16px 35px rgba(83,87,255,0.28);
        }

        .tm-brand-text {
          font-weight: 800;
          font-size: 20px;
          letter-spacing: -0.03em;
          color: #fff;
        }

        .tm-brand-small {
          font-size: 10px;
          margin-top: 3px;
          color: #8992af;
        }

        .tm-left-content {
          max-width: 520px;
          position: relative;
          z-index: 2;
        }

        .tm-pill {
          width: fit-content;
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 8px 12px;
          border: 1px solid rgba(141,124,255,0.18);
          background: rgba(125,103,255,0.10);
          border-radius: 999px;
          color: #cfc9ff;
          font-size: 11px;
          font-weight: 700;
          margin-bottom: 24px;
        }

        .tm-left-title {
          margin: 0;
          font-size: clamp(42px, 5vw, 67px);
          line-height: 0.98;
          letter-spacing: -0.065em;
          color: #fff;
          max-width: 500px;
        }

        .tm-gradient-text {
          display: block;
          background: linear-gradient(90deg, #a89eff, #63d8ff);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .tm-left-desc {
          margin: 25px 0 34px;
          color: #9099b3;
          font-size: 15px;
          line-height: 1.8;
          max-width: 470px;
        }

        .tm-feature-list {
          display: grid;
          gap: 12px;
        }

        .tm-feature {
          display: flex;
          align-items: center;
          gap: 13px;
          width: min(450px, 100%);
          padding: 13px 14px;
          border: 1px solid rgba(255,255,255,0.065);
          border-radius: 17px;
          background: rgba(255,255,255,0.035);
        }

        .tm-feature-icon {
          width: 38px;
          height: 38px;
          flex: 0 0 38px;
          border-radius: 12px;
          background: rgba(255,255,255,0.06);
          color: #aaa0ff;
          display: grid;
          place-items: center;
        }

        .tm-feature-title {
          color: #e8ebf7;
          font-weight: 750;
          font-size: 12px;
          margin-bottom: 3px;
        }

        .tm-feature-sub {
          color: #7d869f;
          font-size: 11px;
        }

        .tm-left-footer {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 9px;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.13em;
          color: #606a86;
        }

        .tm-right {
          background:
            radial-gradient(circle at 85% 10%, rgba(105,102,255,0.10), transparent 27%),
            #f5f7fc;
          padding: 46px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .tm-form-card {
          width: min(430px, 100%);
        }

        .tm-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 34px;
        }

        .tm-card-mini {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #151c32;
          font-weight: 800;
          font-size: 14px;
        }

        .tm-card-mini-icon {
          width: 34px;
          height: 34px;
          border-radius: 11px;
          background: #161d38;
          color: #fff;
          display: grid;
          place-items: center;
        }

        .tm-secure-tag {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 10px;
          color: #5d9c7f;
          font-weight: 750;
          padding: 7px 10px;
          background: #edf9f3;
          border-radius: 999px;
        }

        .tm-heading-label {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #6558d8;
          background: #ece9ff;
          padding: 7px 10px;
          border-radius: 999px;
          font-size: 9px;
          font-weight: 850;
          letter-spacing: 0.13em;
          margin-bottom: 15px;
        }

        .tm-heading h2 {
          margin: 0;
          font-size: 36px;
          line-height: 1.08;
          letter-spacing: -0.05em;
          color: #10172c;
        }

        .tm-heading p {
          margin: 12px 0 30px;
          color: #81899e;
          font-size: 13px;
          line-height: 1.6;
        }

        .tm-form {
          display: grid;
          gap: 19px;
        }

        .tm-field {
          display: grid;
          gap: 8px;
        }

        .tm-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .tm-label {
          font-size: 11px;
          color: #2e374d;
          font-weight: 800;
        }

        .tm-label-note {
          color: #a0a7b8;
          font-size: 10px;
        }

        .tm-input {
          height: 56px;
          border: 1px solid #dce1eb;
          border-radius: 15px;
          background: #fff;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 15px;
          color: #98a0b2;
          box-shadow: 0 7px 22px rgba(25, 34, 58, 0.035);
          transition: 0.18s ease;
        }

        .tm-input:focus-within {
          border-color: #7669ea;
          box-shadow:
            0 0 0 4px rgba(118,105,234,0.10),
            0 12px 30px rgba(25,34,58,0.06);
        }

        .tm-input input {
          width: 100%;
          min-width: 0;
          border: 0;
          outline: 0;
          background: transparent;
          color: #172039;
          font-size: 14px;
        }

        .tm-input input::placeholder {
          color: #afb6c4;
        }

        .tm-eye {
          border: 0;
          background: transparent;
          color: #9da5b6;
          padding: 4px;
          display: grid;
          place-items: center;
          cursor: pointer;
        }

        .tm-error {
          padding: 11px 13px;
          border-radius: 13px;
          background: #fff0f0;
          border: 1px solid #ffd4d4;
          color: #b32929;
          font-size: 11px;
          line-height: 1.5;
        }

        .tm-submit {
          height: 57px;
          border: 0;
          border-radius: 16px;
          background: linear-gradient(100deg, #6557e8, #4b95ff);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 16px 32px rgba(88,88,232,0.25);
          transition: 0.18s ease;
        }

        .tm-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 21px 40px rgba(88,88,232,0.31);
        }

        .tm-submit:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .tm-note {
          margin-top: 19px;
          padding: 12px 14px;
          border-radius: 14px;
          border: 1px solid #e4e8ef;
          background: rgba(255,255,255,0.78);
          display: flex;
          align-items: flex-start;
          gap: 8px;
          color: #8c94a5;
          font-size: 10px;
          line-height: 1.55;
        }

        .tm-note svg {
          flex: 0 0 auto;
          color: #55a77b;
          margin-top: 1px;
        }

        .tm-register {
          border-top: 1px solid #e4e8ef;
          margin-top: 23px;
          padding-top: 22px;
          text-align: center;
          color: #9097a8;
          font-size: 11px;
        }

        .tm-register a {
          margin-left: 5px;
          text-decoration: none;
          color: #5d52d7;
          font-weight: 800;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .tm-register a:hover {
          text-decoration: underline;
        }

        @media (max-width: 900px) {
          .tm-page {
            padding: 14px;
          }

          .tm-container {
            grid-template-columns: 1fr;
            min-height: auto;
            max-width: 560px;
          }

          .tm-left {
            display: none;
          }

          .tm-right {
            min-height: calc(100vh - 28px);
            padding: 28px 20px;
          }
        }

        @media (max-width: 520px) {
          .tm-right {
            padding: 24px 16px;
          }

          .tm-card-top {
            margin-bottom: 26px;
          }

          .tm-secure-tag {
            display: none;
          }

          .tm-heading h2 {
            font-size: 30px;
          }

          .tm-input,
          .tm-submit {
            height: 54px;
          }

          .tm-register {
            line-height: 1.8;
          }
        }
      `}</style>

      <main className="tm-page">
        <div className="tm-grid" />
        <div className="tm-bg-circle one" />
        <div className="tm-bg-circle two" />

        <section className="tm-container">
          <div className="tm-left">
            <div className="tm-brand">
              <div className="tm-brand-icon">
                <Brain size={25} />
              </div>

              <div>
                <div className="tm-brand-text">TrialMatch</div>
                <div className="tm-brand-small">
                  Clinical Research Intelligence
                </div>
              </div>
            </div>

            <div className="tm-left-content">
              <div className="tm-pill">
                <Sparkles size={13} />
                AI-ASSISTED RESEARCH PLATFORM
              </div>

              <h1 className="tm-left-title">
                Turn patient data into
                <span className="tm-gradient-text">
                  better trial discovery.
                </span>
              </h1>

              <p className="tm-left-desc">
                Manage patients, process medical reports and discover
                relevant clinical trials through one intelligent
                research workspace.
              </p>

              <div className="tm-feature-list">
                <div className="tm-feature">
                  <div className="tm-feature-icon">
                    <Brain size={18} />
                  </div>

                  <div>
                    <div className="tm-feature-title">
                      AI-assisted analysis
                    </div>

                    <div className="tm-feature-sub">
                      Extract structured insights from medical reports
                    </div>
                  </div>
                </div>

                <div className="tm-feature">
                  <div className="tm-feature-icon">
                    <Stethoscope size={18} />
                  </div>

                  <div>
                    <div className="tm-feature-title">
                      Clinical trial matching
                    </div>

                    <div className="tm-feature-sub">
                      Compare patient profiles with trial eligibility
                    </div>
                  </div>
                </div>

                <div className="tm-feature">
                  <div className="tm-feature-icon">
                    <CheckCircle2 size={18} />
                  </div>

                  <div>
                    <div className="tm-feature-title">
                      Research workflow
                    </div>

                    <div className="tm-feature-sub">
                      Keep patients, reports and matches connected
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="tm-left-footer">
              <span>TRIALMATCH</span>
              <span>•</span>
              <span>AI + CLINICAL RESEARCH</span>
            </div>
          </div>

          <div className="tm-right">
            <div className="tm-form-card">
              <div className="tm-card-top">
                <div className="tm-card-mini">
                  <div className="tm-card-mini-icon">
                    <Brain size={17} />
                  </div>

                  TrialMatch
                </div>

                <div className="tm-secure-tag">
                  <ShieldCheck size={13} />
                  Secure access
                </div>
              </div>

              <div className="tm-heading">
                <div className="tm-heading-label">
                  <Sparkles size={11} />
                  WELCOME BACK
                </div>

                <h2>Sign in to continue.</h2>

                <p>
                  Access your patients, reports and clinical
                  trial workspace.
                </p>
              </div>

              <form className="tm-form" onSubmit={handleSubmit}>
                <div className="tm-field">
                  <div className="tm-label-row">
                    <label className="tm-label" htmlFor="email">
                      Email address
                    </label>

                    <span className="tm-label-note">
                      Account email
                    </span>
                  </div>

                  <div className="tm-input">
                    <Mail size={18} />

                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) =>
                        setEmail(event.target.value)
                      }
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                <div className="tm-field">
                  <div className="tm-label-row">
                    <label className="tm-label" htmlFor="password">
                      Password
                    </label>

                    <span className="tm-label-note">
                      Protected
                    </span>
                  </div>

                  <div className="tm-input">
                    <Lock size={18} />

                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) =>
                        setPassword(event.target.value)
                      }
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                    />

                    <button
                      type="button"
                      className="tm-eye"
                      onClick={() =>
                        setShowPassword((value) => !value)
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {error && <div className="tm-error">{error}</div>}

                <button
                  type="submit"
                  className="tm-submit"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign in to TrialMatch"}

                  {!loading && <ArrowRight size={18} />}
                </button>
              </form>

              <div className="tm-note">
                <ShieldCheck size={15} />

                <span>
                  Your session is protected with authenticated
                  access and your workspace credentials stay
                  private.
                </span>
              </div>

              <div className="tm-register">
                New to TrialMatch?
                <Link to="/register">
                  Create your account
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}