import {
  ArrowLeft,
  BrainCircuit,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FlaskConical,
  LoaderCircle,
  MapPin,
  RefreshCw,
  ShieldCheck,
  Target,
  XCircle,
} from "lucide-react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getMatches,
  runMatching,
} from "../services/matching";


export default function TrialMatching() {
  const { patientId } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(null);

  async function loadMatches() {
    try {
      setLoading(true);
      setError("");

      const result = await getMatches(patientId);

      setData(result);

      if (
        Array.isArray(result?.matches) &&
        result.matches.length > 0
      ) {
        setExpanded(result.matches[0].trial_id);
      }
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          "Unable to load trial matches."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleRunMatching() {
    try {
      setRunning(true);
      setError("");

      const result = await runMatching(patientId);

      setData(result);

      if (
        Array.isArray(result?.matches) &&
        result.matches.length > 0
      ) {
        setExpanded(result.matches[0].trial_id);
      }
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          "Unable to run trial matching."
      );
    } finally {
      setRunning(false);
    }
  }

  useEffect(() => {
    loadMatches();
  }, [patientId]);

  const matches = useMemo(
    () =>
      Array.isArray(data?.matches)
        ? data.matches
        : [],
    [data]
  );

  const eligibleCount = matches.filter(
    (item) => item.eligible
  ).length;

  const averageScore =
    matches.length > 0
      ? Math.round(
          matches.reduce(
            (sum, item) =>
              sum + Number(item.score || 0),
            0
          ) / matches.length
        )
      : 0;

  if (loading) {
    return (
      <main className="page-container">
        <div
          className="card"
          style={{
            minHeight: 340,
            display: "grid",
            placeItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              color: "#94a3b8",
              fontSize: 13,
            }}
          >
            <LoaderCircle
              size={17}
              className="spin"
            />
            Loading trial matches...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="page-container">

      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <div className="page-heading fade-up">
        <div>
          <Link
            to="/patients"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              color: "#0f766e",
              fontWeight: 800,
              fontSize: 12,
              marginBottom: 12,
            }}
          >
            <ArrowLeft size={14} />
            Back to Patients
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
              <Target size={20} />
            </div>

            <div>
              <h1>Trial Matching</h1>

              <p>
                Patient {data?.patient_name || `#${patientId}`}{" "}
                • Live backend matching
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={handleRunMatching}
          disabled={running}
        >
          {running ? (
            <>
              <LoaderCircle
                size={14}
                className="spin"
              />
              Running...
            </>
          ) : (
            <>
              <BrainCircuit size={14} />
              Run Matching
            </>
          )}
        </button>
      </div>


      {/* ================================================== */}
      {/* ERROR */}
      {/* ================================================== */}

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
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: "#b91c1c",
                fontSize: 12,
              }}
            >
              <XCircle size={15} />
              {error}
            </div>
          </div>
        </div>
      )}


      {/* ================================================== */}
      {/* HERO */}
      {/* ================================================== */}

      <section
        className="card fade-up-delay-1"
        style={{
          overflow: "hidden",
          background:
            "linear-gradient(135deg, #102a43 0%, #0f766e 100%)",
          color: "#ffffff",
        }}
      >
        <div
          className="card-body"
          style={{
            padding: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 20,
              flexWrap: "wrap",
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "6px 10px",
                  borderRadius: 999,
                  background:
                    "rgba(255,255,255,.12)",
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: ".04em",
                  textTransform: "uppercase",
                }}
              >
                <BrainCircuit size={12} />
                Rule-based matching engine
              </div>

              <div
                style={{
                  fontSize: 25,
                  fontWeight: 900,
                  marginTop: 14,
                  letterSpacing: "-.02em",
                }}
              >
                Clinical Trial Compatibility
              </div>

              <div
                style={{
                  marginTop: 7,
                  maxWidth: 650,
                  color: "#d7eef0",
                  fontSize: 12,
                  lineHeight: 1.7,
                }}
              >
                Matching is calculated using patient and
                trial eligibility criteria including age,
                disease, gender, location, and trial status.
              </div>
            </div>

            <div
              style={{
                minWidth: 165,
                padding: 15,
                borderRadius: 14,
                background:
                  "rgba(255,255,255,.10)",
                border:
                  "1px solid rgba(255,255,255,.14)",
              }}
            >
              <div
                style={{
                  color: "#bfe9e8",
                  fontSize: 10,
                  fontWeight: 800,
                  textTransform: "uppercase",
                }}
              >
                Patient
              </div>

              <div
                style={{
                  marginTop: 5,
                  fontSize: 14,
                  fontWeight: 850,
                }}
              >
                {data?.patient_name || "Unknown Patient"}
              </div>

              <div
                style={{
                  marginTop: 4,
                  color: "#d7eef0",
                  fontSize: 10,
                }}
              >
                ID: {data?.patient_id ?? patientId}
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ================================================== */}
      {/* SUMMARY CARDS */}
      {/* ================================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(190px, 1fr))",
          gap: 15,
          marginTop: 20,
        }}
      >
        <SummaryCard
          icon={FlaskConical}
          label="Trials Evaluated"
          value={matches.length}
          note="Live backend results"
        />

        <SummaryCard
          icon={CheckCircle2}
          label="Eligible Matches"
          value={eligibleCount}
          note="All criteria satisfied"
          positive
        />

        <SummaryCard
          icon={Target}
          label="Average Score"
          value={`${averageScore}%`}
          note="Across evaluated trials"
        />

        <SummaryCard
          icon={RefreshCw}
          label="Matching Engine"
          value="Live"
          note="Backend connected"
          positive
        />
      </div>


      {/* ================================================== */}
      {/* MATCH LIST */}
      {/* ================================================== */}

      <section
        className="card"
        style={{ marginTop: 20 }}
      >
        <div className="card-header">
          <div>
            <div className="card-title">
              Clinical Trial Matches
            </div>

            <div
              style={{
                marginTop: 4,
                color: "#94a3b8",
                fontSize: 10,
              }}
            >
              {matches.length} trial
              {matches.length === 1 ? "" : "s"} evaluated
              by the backend matching engine
            </div>
          </div>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={loadMatches}
            disabled={loading}
          >
            <RefreshCw size={13} />
            Refresh
          </button>
        </div>

        <div className="card-body">

          {matches.length === 0 ? (
            <div
              style={{
                padding: 45,
                textAlign: "center",
                color: "#94a3b8",
                fontSize: 12,
              }}
            >
              No matching results available.
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gap: 13,
              }}
            >
              {matches.map((match, index) => {
                const isOpen =
                  expanded === match.trial_id;

                return (
                  <article
                    key={`${match.trial_id}-${index}`}
                    style={{
                      border:
                        "1px solid #e7edf2",
                      borderRadius: 15,
                      overflow: "hidden",
                      background: "#ffffff",
                    }}
                  >

                    {/* MATCH TOP */}
                    <button
                      type="button"
                      onClick={() =>
                        setExpanded(
                          isOpen
                            ? null
                            : match.trial_id
                        )
                      }
                      style={{
                        width: "100%",
                        border: 0,
                        background: "#ffffff",
                        textAlign: "left",
                        cursor: "pointer",
                        padding: 17,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent:
                            "space-between",
                          gap: 15,
                          alignItems:
                            "flex-start",
                        }}
                      >

                        <div
                          style={{
                            display: "flex",
                            gap: 12,
                            minWidth: 0,
                          }}
                        >
                          <div
                            style={{
                              width: 42,
                              height: 42,
                              flexShrink: 0,
                              borderRadius: 12,
                              display: "grid",
                              placeItems: "center",
                              background:
                                match.eligible
                                  ? "#ecfdf5"
                                  : "#f1f5f9",
                              color:
                                match.eligible
                                  ? "#047857"
                                  : "#475569",
                            }}
                          >
                            <FlaskConical size={19} />
                          </div>

                          <div
                            style={{
                              minWidth: 0,
                            }}
                          >
                            <div
                              style={{
                                fontSize: 13,
                                fontWeight: 850,
                                color:
                                  "#172033",
                                lineHeight: 1.45,
                              }}
                            >
                              {match.trial_name}
                            </div>

                            <div
                              style={{
                                marginTop: 4,
                                fontSize: 10,
                                color:
                                  "#94a3b8",
                                fontWeight: 750,
                              }}
                            >
                              {match.nct_id}
                            </div>

                            <div
                              style={{
                                display:
                                  "flex",
                                flexWrap:
                                  "wrap",
                                gap: 6,
                                marginTop: 9,
                              }}
                            >
                              <span className="badge badge-purple">
                                {match.condition}
                              </span>

                              <span className="badge badge-blue">
                                {match.phase ||
                                  "Phase N/A"}
                              </span>

                              <span className="badge badge-yellow">
                                <MapPin size={10} />
                                {match.location ||
                                  "Location N/A"}
                              </span>
                            </div>
                          </div>
                        </div>


                        <div
                          style={{
                            display: "flex",
                            alignItems:
                              "center",
                            gap: 10,
                            flexShrink: 0,
                          }}
                        >
                          <div
                            style={{
                              minWidth: 72,
                              textAlign: "right",
                            }}
                          >
                            <div
                              style={{
                                fontSize: 20,
                                fontWeight: 900,
                                color:
                                  "#172033",
                              }}
                            >
                              {Number(
                                match.score || 0
                              ).toFixed(0)}
                              %
                            </div>

                            <div
                              style={{
                                marginTop: 2,
                                fontSize: 9,
                                color:
                                  "#94a3b8",
                                textTransform:
                                  "uppercase",
                                fontWeight: 800,
                              }}
                            >
                              Score
                            </div>
                          </div>

                          {isOpen ? (
                            <ChevronUp
                              size={17}
                              color="#94a3b8"
                            />
                          ) : (
                            <ChevronDown
                              size={17}
                              color="#94a3b8"
                            />
                          )}
                        </div>
                      </div>


                      {/* SCORE BAR */}
                      <div
                        style={{
                          marginTop: 14,
                          height: 7,
                          borderRadius: 999,
                          background:
                            "#edf2f5",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${Math.max(
                              0,
                              Math.min(
                                100,
                                Number(
                                  match.score || 0
                                )
                              )
                            )}%`,
                            height: "100%",
                            borderRadius: 999,
                            background:
                              match.eligible
                                ? "#059669"
                                : "#94a3b8",
                          }}
                        />
                      </div>

                      <div
                        style={{
                          display: "flex",
                          justifyContent:
                            "space-between",
                          alignItems: "center",
                          marginTop: 10,
                          gap: 10,
                        }}
                      >
                        <span
                          className={
                            match.eligible
                              ? "badge badge-green"
                              : "badge badge-yellow"
                          }
                        >
                          {match.eligible ? (
                            <CheckCircle2 size={10} />
                          ) : (
                            <XCircle size={10} />
                          )}

                          {match.eligible
                            ? "Eligible"
                            : "Not Eligible"}
                        </span>

                        <span
                          style={{
                            color: "#526174",
                            fontSize: 10,
                            fontWeight: 800,
                          }}
                        >
                          {match.recommendation}
                        </span>
                      </div>
                    </button>


                    {/* DETAILS */}
                    {isOpen && (
                      <div
                        style={{
                          borderTop:
                            "1px solid #edf1f5",
                          background:
                            "#fbfcfd",
                          padding: 17,
                        }}
                      >

                        {/* Trial metadata */}
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns:
                              "repeat(auto-fit, minmax(150px, 1fr))",
                            gap: 10,
                            marginBottom: 16,
                          }}
                        >
                          <Meta
                            label="Trial Status"
                            value={match.status}
                          />

                          <Meta
                            label="Phase"
                            value={match.phase}
                          />

                          <Meta
                            label="Location"
                            value={match.location}
                          />

                          <Meta
                            label="NCT ID"
                            value={match.nct_id}
                          />
                        </div>


                        {/* Criteria */}
                        <div
                          style={{
                            display: "flex",
                            alignItems:
                              "center",
                            gap: 7,
                            marginBottom: 10,
                          }}
                        >
                          <ShieldCheck
                            size={16}
                            color="#0f766e"
                          />

                          <div
                            style={{
                              fontSize: 12,
                              fontWeight: 850,
                              color:
                                "#172033",
                            }}
                          >
                            Eligibility Criteria
                          </div>
                        </div>


                        <div
                          style={{
                            display: "grid",
                            gap: 8,
                          }}
                        >
                          {Object.entries(
                            match.criteria || {}
                          ).map(
                            ([key, criterion]) => (
                              <Criterion
                                key={key}
                                name={formatLabel(key)}
                                criterion={
                                  criterion
                                }
                              />
                            )
                          )}
                        </div>


                        {/* Trial link */}
                        <div
                          style={{
                            marginTop: 15,
                            paddingTop: 13,
                            borderTop:
                              "1px solid #edf1f5",
                            display: "flex",
                            justifyContent:
                              "space-between",
                            alignItems:
                              "center",
                            gap: 12,
                            flexWrap: "wrap",
                          }}
                        >
                          <div
                            style={{
                              fontSize: 10,
                              color:
                                "#94a3b8",
                            }}
                          >
                            Match generated by
                            the live backend
                            scoring engine.
                          </div>

                          <Link
                            to={`/trials/${match.trial_id}`}
                            className="btn btn-secondary btn-sm"
                            onClick={(event) =>
                              event.stopPropagation()
                            }
                          >
                            View Trial
                          </Link>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>


      {/* ================================================== */}
      {/* DISCLAIMER */}
      {/* ================================================== */}

      <section
        className="card"
        style={{
          marginTop: 20,
          borderColor: "#dbeafe",
          background: "#f8fbff",
        }}
      >
        <div
          className="card-body"
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
          }}
        >
          <ShieldCheck
            size={17}
            color="#2563eb"
            style={{
              flexShrink: 0,
              marginTop: 1,
            }}
          />

          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 850,
                color: "#1e3a8a",
              }}
            >
              Research / Demo Disclaimer
            </div>

            <div
              style={{
                marginTop: 5,
                fontSize: 11,
                lineHeight: 1.7,
                color: "#526174",
              }}
            >
              {data?.disclaimer ||
                "This matching system is for research/demo purposes. Final clinical trial eligibility must be confirmed by the study team."}
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}


/* ======================================================== */
/* SUMMARY CARD */
/* ======================================================== */

function SummaryCard({
  icon: Icon,
  label,
  value,
  note,
  positive = false,
}) {
  return (
    <section className="card">
      <div
        className="card-body"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            flexShrink: 0,
            borderRadius: 12,
            display: "grid",
            placeItems: "center",
            background: positive
              ? "#ecfdf5"
              : "#eef2ff",
            color: positive
              ? "#047857"
              : "#4338ca",
          }}
        >
          <Icon size={18} />
        </div>

        <div>
          <div
            style={{
              fontSize: 10,
              color: "#94a3b8",
              fontWeight: 800,
              textTransform:
                "uppercase",
              letterSpacing: ".04em",
            }}
          >
            {label}
          </div>

          <div
            style={{
              marginTop: 3,
              fontSize: 20,
              color: "#172033",
              fontWeight: 900,
            }}
          >
            {value}
          </div>

          <div
            style={{
              marginTop: 2,
              fontSize: 9,
              color: "#94a3b8",
            }}
          >
            {note}
          </div>
        </div>
      </div>
    </section>
  );
}


/* ======================================================== */
/* META */
/* ======================================================== */

function Meta({
  label,
  value,
}) {
  return (
    <div
      style={{
        padding: 11,
        borderRadius: 10,
        background: "#ffffff",
        border:
          "1px solid #edf1f5",
      }}
    >
      <div
        style={{
          fontSize: 9,
          color: "#94a3b8",
          fontWeight: 800,
          textTransform:
            "uppercase",
        }}
      >
        {label}
      </div>

      <div
        style={{
          marginTop: 4,
          fontSize: 11,
          color: "#172033",
          fontWeight: 800,
        }}
      >
        {value || "—"}
      </div>
    </div>
  );
}


/* ======================================================== */
/* CRITERION */
/* ======================================================== */

function Criterion({
  name,
  criterion,
}) {
  const eligible = Boolean(
    criterion?.eligible
  );

  const patientValue =
    criterion?.patient_value;

  const trialValue =
    criterion?.trial_value;

  const required =
    criterion?.required;

  return (
    <div
      style={{
        display: "flex",
        justifyContent:
          "space-between",
        alignItems: "flex-start",
        gap: 12,
        padding: 12,
        borderRadius: 11,
        border:
          "1px solid #edf1f5",
        background: "#ffffff",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 9,
          minWidth: 0,
        }}
      >
        {eligible ? (
          <CheckCircle2
            size={15}
            color="#059669"
            style={{
              flexShrink: 0,
              marginTop: 1,
            }}
          />
        ) : (
          <XCircle
            size={15}
            color="#dc2626"
            style={{
              flexShrink: 0,
              marginTop: 1,
            }}
          />
        )}

        <div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 850,
              color: "#172033",
              textTransform:
                "capitalize",
            }}
          >
            {name}
          </div>

          <div
            style={{
              marginTop: 4,
              display: "flex",
              gap: 7,
              flexWrap: "wrap",
              fontSize: 10,
              color: "#64748b",
            }}
          >
            {patientValue !==
              undefined && (
              <span>
                Patient:{" "}
                <strong>
                  {String(
                    patientValue
                  )}
                </strong>
              </span>
            )}

            {trialValue !==
              undefined && (
              <span>
                Trial:{" "}
                <strong>
                  {String(
                    trialValue
                  )}
                </strong>
              </span>
            )}

            {required !==
              undefined && (
              <span>
                Required:{" "}
                <strong>
                  {String(
                    required
                  )}
                </strong>
              </span>
            )}
          </div>
        </div>
      </div>

      <span
        className={
          eligible
            ? "badge badge-green"
            : "badge badge-yellow"
        }
        style={{
          flexShrink: 0,
        }}
      >
        {eligible
          ? "Pass"
          : "Fail"}
      </span>
    </div>
  );
}


/* ======================================================== */
/* LABEL FORMATTER */
/* ======================================================== */

function formatLabel(value) {
  return String(value)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
}
