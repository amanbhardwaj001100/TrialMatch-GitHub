import {
  ArrowLeft,
  CheckCircle2,
  FlaskConical,
  MapPin,
  ShieldCheck,
  Users,
} from "lucide-react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import { getTrial } from "../services/trials";

export default function TrialDetails() {
  const { id } = useParams();

  const [trial, setTrial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadTrial() {
      try {
        setLoading(true);
        setError("");

        const data = await getTrial(id);

        if (mounted) {
          setTrial(data);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err?.response?.data?.detail ||
              "Unable to load clinical trial."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadTrial();

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="page-container">
        <div
          className="card"
          style={{
            minHeight: 300,
            display: "grid",
            placeItems: "center",
          }}
        >
          <div
            style={{
              color: "#94a3b8",
              fontSize: 13,
            }}
          >
            Loading clinical trial...
          </div>
        </div>
      </main>
    );
  }

  if (error || !trial) {
    return (
      <main className="page-container">
        <div className="page-heading">
          <div>
            <Link
              to="/trials"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                color: "#0f766e",
                fontWeight: 750,
                fontSize: 12,
                marginBottom: 12,
              }}
            >
              <ArrowLeft size={14} />
              Back to Clinical Trials
            </Link>

            <h1>Trial Not Found</h1>

            <p>
              {error ||
                "The requested clinical trial does not exist."}
            </p>
          </div>
        </div>

        <div
          className="card"
          style={{
            borderColor: "#fecaca",
            background: "#fff7f7",
          }}
        >
          <div className="card-body">
            <div
              style={{
                color: "#b91c1c",
                fontSize: 12,
              }}
            >
              {error ||
                "Clinical trial could not be loaded."}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="page-container">
      <div className="page-heading fade-up">
        <div>
          <Link
            to="/trials"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              color: "#0f766e",
              fontWeight: 750,
              fontSize: 12,
              marginBottom: 12,
            }}
          >
            <ArrowLeft size={14} />
            Back to Clinical Trials
          </Link>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              className="avatar"
              style={{
                width: 46,
                height: 46,
              }}
            >
              <FlaskConical size={20} />
            </div>

            <div>
              <h1>{trial.name}</h1>

              <p>
                {trial.nct_id} • Live backend record
              </p>
            </div>
          </div>
        </div>

        <span className="badge badge-green">
          <CheckCircle2 size={11} />
          {trial.status}
        </span>
      </div>

      {/* HERO */}

      <section
        className="card fade-up-delay-1"
        style={{
          background:
            "linear-gradient(135deg, #102a43, #0f766e)",
          color: "#ffffff",
          overflow: "hidden",
        }}
      >
        <div className="card-body">
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              gap: 20,
              alignItems: "flex-start",
              flexWrap: "wrap",
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  padding:
                    "6px 10px",
                  borderRadius: 999,
                  background:
                    "rgba(255,255,255,.12)",
                  fontSize: 10,
                  fontWeight: 800,
                }}
              >
                <FlaskConical size={12} />
                {trial.condition}
              </div>

              <div
                style={{
                  fontSize: 24,
                  fontWeight: 900,
                  marginTop: 12,
                }}
              >
                {trial.phase ||
                  "Phase not specified"}
              </div>

              <div
                style={{
                  marginTop: 6,
                  color: "#d7eef0",
                  fontSize: 12,
                }}
              >
                {trial.location ||
                  "Location not specified"}
              </div>
            </div>

            <div
              style={{
                textAlign: "right",
              }}
            >
              <div
                style={{
                  color: "#bfe9e8",
                  fontSize: 10,
                  fontWeight: 800,
                  textTransform:
                    "uppercase",
                }}
              >
                Eligibility Age
              </div>

              <div
                style={{
                  marginTop: 4,
                  fontSize: 18,
                  fontWeight: 850,
                }}
              >
                {trial.min_age ?? "—"} -{" "}
                {trial.max_age ?? "—"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DETAILS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "minmax(0, 1fr) minmax(0, 1fr)",
          gap: 20,
          marginTop: 20,
        }}
      >
        <section className="card fade-up-delay-2">
          <div className="card-header">
            <div className="card-title">
              Trial Information
            </div>
          </div>

          <div className="card-body">
            <Info
              label="NCT ID"
              value={trial.nct_id}
            />

            <Info
              label="Condition"
              value={trial.condition}
            />

            <Info
              label="Phase"
              value={trial.phase}
            />

            <Info
              label="Status"
              value={trial.status}
            />

            <Info
              label="Location"
              value={trial.location}
              icon={MapPin}
            />

            <Info
              label="Eligible Gender"
              value={trial.eligible_gender}
            />

            <Info
              label="Age Range"
              value={`${trial.min_age ?? "—"} - ${trial.max_age ?? "—"}`}
            />
          </div>
        </section>

        <section className="card fade-up-delay-2">
          <div className="card-header">
            <div className="card-title">
              Eligibility Criteria
            </div>

            <Users size={18} />
          </div>

          <div className="card-body">
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 9,
                marginBottom: 15,
              }}
            >
              <CheckCircle2
                size={15}
                style={{
                  color: "#059669",
                  marginTop: 1,
                  flexShrink: 0,
                }}
              />

              <span
                style={{
                  fontSize: 12,
                  color: "#526174",
                  lineHeight: 1.6,
                }}
              >
                {trial.eligibility_text ||
                  "Eligibility criteria not specified."}
              </span>
            </div>

            <div
              style={{
                padding: 14,
                borderRadius: 12,
                background: "#f8fafc",
                border: "1px solid #edf1f5",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: "#94a3b8",
                  fontWeight: 850,
                  textTransform:
                    "uppercase",
                }}
              >
                Gender Requirement
              </div>

              <div
                style={{
                  marginTop: 6,
                  fontSize: 13,
                  color: "#172033",
                  fontWeight: 800,
                }}
              >
                {trial.eligible_gender ||
                  "Not specified"}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* DESCRIPTION */}

      <section
        className="card"
        style={{ marginTop: 20 }}
      >
        <div className="card-header">
          <div className="card-title">
            About This Trial
          </div>

          <ShieldCheck size={18} />
        </div>

        <div className="card-body">
          <p
            style={{
              color: "#64748b",
              fontSize: 13,
              lineHeight: 1.8,
            }}
          >
            {trial.description ||
              "No description available."}
          </p>
        </div>
      </section>

      {/* ACTION */}

      <section
        className="card"
        style={{ marginTop: 20 }}
      >
        <div
          className="card-body"
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            gap: 14,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 850,
                color: "#172033",
              }}
            >
              TrialMatch Eligibility
            </div>

            <div
              style={{
                marginTop: 5,
                color: "#94a3b8",
                fontSize: 11,
              }}
            >
              Use this trial in the patient matching
              workflow.
            </div>
          </div>

          <Link
            to="/patients"
            className="btn btn-primary"
          >
            Check Patient Matches
          </Link>
        </div>
      </section>
    </main>
  );
}

function Info({
  label,
  value,
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent:
          "space-between",
        gap: 15,
        padding: "11px 0",
        borderBottom:
          "1px solid #edf1f5",
      }}
    >
      <span
        style={{
          color: "#94a3b8",
          fontSize: 11,
          fontWeight: 750,
        }}
      >
        {label}
      </span>

      <span
        style={{
          color: "#172033",
          fontSize: 12,
          fontWeight: 800,
          textAlign: "right",
        }}
      >
        {value || "—"}
      </span>
    </div>
  );
}
