import {
  Activity,
  ArrowRight,
  BrainCircuit,
  FileText,
  FlaskConical,
  Plus,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { getDashboardStats } from "../services/dashboard";
import { getStoredUser } from "../services/auth";

export default function Dashboard() {
  const user = getStoredUser();

  const [stats, setStats] = useState({
    patients: 0,
    medical_reports: 0,
    clinical_trials: 0,
    trial_matches: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const data = await getDashboardStats();

        if (mounted) {
          setStats({
            patients: Number(data?.patients ?? 0),
            medical_reports: Number(data?.medical_reports ?? 0),
            clinical_trials: Number(data?.clinical_trials ?? 0),
            trial_matches: Number(data?.trial_matches ?? 0),
          });
        }
      } catch (err) {
        if (mounted) {
          setError(
            err?.response?.data?.detail ||
              "Unable to load dashboard data from the backend."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="page-container">
      <div className="page-heading fade-up">
        <div>
          <span className="badge badge-green">
            <Activity size={11} />
            Live backend connected
          </span>

          <h1 style={{ marginTop: 12 }}>
            Welcome{user?.name ? `, ${user.name}` : ""}
          </h1>

          <p>
            Manage patients, medical reports and AI-assisted
            clinical trial matching from one workspace.
          </p>
        </div>
      </div>

      {error && (
        <div
          className="card"
          style={{
            marginBottom: 20,
            borderColor: "#fecaca",
            background: "#fff7f7",
          }}
        >
          <div className="card-body">
            <div
              style={{
                color: "#b91c1c",
                fontSize: 13,
                fontWeight: 750,
              }}
            >
              {error}
            </div>
          </div>
        </div>
      )}

      <section className="stats-grid fade-up-delay-1">
        <DashboardStat
          icon={Users}
          label="Patients"
          value={loading ? "—" : stats.patients}
          meta="Registered patient profiles"
        />

        <DashboardStat
          icon={FileText}
          label="Medical Reports"
          value={loading ? "—" : stats.medical_reports}
          meta="Uploaded medical reports"
        />

        <DashboardStat
          icon={FlaskConical}
          label="Clinical Trials"
          value={loading ? "—" : stats.clinical_trials}
          meta="Available trial records"
        />

        <DashboardStat
          icon={BrainCircuit}
          label="Trial Matches"
          value={loading ? "—" : stats.trial_matches}
          meta="Generated patient matches"
        />
      </section>

      <section
        className="card fade-up-delay-2"
        style={{ marginTop: 20 }}
      >
        <div className="card-header">
          <div>
            <div className="card-title">Quick Actions</div>
            <div className="card-subtitle">
              Start the next clinical workflow
            </div>
          </div>

          <div
            className="brand-mark"
            style={{
              width: 38,
              height: 38,
              borderRadius: 11,
            }}
          >
            <ShieldCheck size={18} />
          </div>
        </div>

        <div
          className="card-body"
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(190px, 1fr))",
            gap: 12,
          }}
        >
          <ActionCard
            to="/patients/add"
            icon={Plus}
            title="Add Patient"
            text="Create a new patient profile."
          />

          <ActionCard
            to="/reports/upload"
            icon={FileText}
            title="Upload Report"
            text="Add a medical report for analysis."
          />

          <ActionCard
            to="/trials"
            icon={FlaskConical}
            title="View Clinical Trials"
            text="Explore available trial records."
          />

          <ActionCard
            to="/patients"
            icon={Search}
            title="Find Trial Matches"
            text="Select a patient and run matching."
          />
        </div>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns:
            "minmax(0, 1.5fr) minmax(280px, 1fr)",
          gap: 20,
          marginTop: 20,
        }}
      >
        <div className="card fade-up-delay-3">
          <div className="card-header">
            <div>
              <div className="card-title">
                Clinical Workflow
              </div>
              <div className="card-subtitle">
                Connected application flow
              </div>
            </div>
          </div>

          <div className="card-body">
            {[
              {
                icon: Users,
                title: "Create patient profile",
                text: "Store demographic and clinical information.",
              },
              {
                icon: FileText,
                title: "Upload medical report",
                text: "Attach a medical report to the patient record.",
              },
              {
                icon: BrainCircuit,
                title: "AI analysis",
                text: "Extract useful medical information from the report.",
              },
              {
                icon: Search,
                title: "Trial matching",
                text: "Compare patient information with clinical trial criteria.",
              },
            ].map((item, index) => (
              <div
                key={item.title}
                style={{
                  display: "flex",
                  gap: 12,
                  padding: "13px 0",
                  borderBottom:
                    index === 3
                      ? "none"
                      : "1px solid #edf1f5",
                }}
              >
                <div
                  className="brand-mark"
                  style={{
                    width: 34,
                    height: 34,
                    minWidth: 34,
                    borderRadius: 10,
                  }}
                >
                  <item.icon size={16} />
                </div>

                <div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 800,
                      color: "#172033",
                    }}
                  >
                    {item.title}
                  </div>

                  <div
                    style={{
                      marginTop: 3,
                      fontSize: 11,
                      lineHeight: 1.6,
                      color: "#94a3b8",
                    }}
                  >
                    {item.text}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card fade-up-delay-3">
          <div className="card-header">
            <div>
              <div className="card-title">
                System Status
              </div>
              <div className="card-subtitle">
                Application services
              </div>
            </div>
          </div>

          <div className="card-body">
            <StatusRow
              label="Frontend"
              value="Online"
            />

            <StatusRow
              label="FastAPI"
              value="Connected"
            />

            <StatusRow
              label="Authentication"
              value="JWT Active"
            />

            <StatusRow
              label="Clinical Trials"
              value={`${stats.clinical_trials} records`}
            />

            <div style={{ marginTop: 18 }}>
              <Link
                to="/trials"
                className="btn btn-secondary"
                style={{ width: "100%" }}
              >
                Open Trial Directory
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function DashboardStat({
  icon: Icon,
  label,
  value,
  meta,
}) {
  return (
    <div className="stat-card">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div className="stat-label">{label}</div>

        <div
          className="brand-mark"
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
          }}
        >
          <Icon size={16} />
        </div>
      </div>

      <div
        className="stat-value"
        style={{
          marginTop: 8,
        }}
      >
        {value}
      </div>

      <div
        style={{
          marginTop: 4,
          color: "#94a3b8",
          fontSize: 10,
          lineHeight: 1.5,
        }}
      >
        {meta}
      </div>
    </div>
  );
}

function ActionCard({
  to,
  icon: Icon,
  title,
  text,
}) {
  return (
    <Link
      to={to}
      style={{
        textDecoration: "none",
        border: "1px solid #e7edf2",
        borderRadius: 14,
        padding: 16,
        background: "#ffffff",
        transition: "transform .18s ease, box-shadow .18s ease",
      }}
    >
      <div
        className="brand-mark"
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
        }}
      >
        <Icon size={17} />
      </div>

      <div
        style={{
          marginTop: 12,
          color: "#172033",
          fontWeight: 800,
          fontSize: 13,
        }}
      >
        {title}
      </div>

      <div
        style={{
          marginTop: 5,
          color: "#94a3b8",
          fontSize: 11,
          lineHeight: 1.6,
        }}
      >
        {text}
      </div>

      <div
        style={{
          marginTop: 11,
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          color: "#0f766e",
          fontSize: 11,
          fontWeight: 800,
        }}
      >
        Open
        <ArrowRight size={12} />
      </div>
    </Link>
  );
}

function StatusRow({ label, value }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
        padding: "11px 0",
        borderBottom: "1px solid #edf1f5",
      }}
    >
      <span
        style={{
          color: "#64748b",
          fontSize: 12,
          fontWeight: 700,
        }}
      >
        {label}
      </span>

      <span
        className="badge badge-green"
        style={{
          fontSize: 9,
        }}
      >
        {value}
      </span>
    </div>
  );
}
