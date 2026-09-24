import {
  ArrowRight,
  FlaskConical,
  MapPin,
  RefreshCw,
  Search,
} from "lucide-react";

import { Link } from "react-router-dom";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { getTrials } from "../services/trials";

export default function Trials() {
  const [trials, setTrials] = useState([]);

  const [search, setSearch] = useState("");
  const [condition, setCondition] = useState("");
  const [phase, setPhase] = useState("");
  const [status, setStatus] = useState("");
  const [location, setLocation] = useState("");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadTrials = useCallback(
    async (showRefresh = false) => {
      try {
        if (showRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const data = await getTrials({
          search: search.trim(),
          condition,
          phase,
          status,
          location: location.trim(),
        });

        setTrials(
          Array.isArray(data)
            ? data
            : Array.isArray(data?.items)
              ? data.items
              : []
        );
      } catch (err) {
        setError(
          err?.response?.data?.detail ||
            "Unable to load clinical trials."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [
      search,
      condition,
      phase,
      status,
      location,
    ]
  );

  useEffect(() => {
    loadTrials();
  }, [loadTrials]);

  const resetFilters = () => {
    setSearch("");
    setCondition("");
    setPhase("");
    setStatus("");
    setLocation("");
  };

  return (
    <main className="page-container">
      <div className="page-heading fade-up">
        <div>
          <h1>Clinical Trials</h1>

          <p>
            Browse clinical trial records from the live
            TrialMatch backend.
          </p>
        </div>

        <span className="badge badge-green">
          <FlaskConical size={12} />
          Live Backend
        </span>
      </div>

      {/* FILTERS */}

      <section className="card fade-up-delay-1">
        <div className="card-header">
          <div>
            <div className="card-title">
              Trial Search
            </div>

            <div className="card-subtitle">
              Filter trials by condition, phase, status
              or location.
            </div>
          </div>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={resetFilters}
          >
            Reset
          </button>
        </div>

        <div className="card-body">
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 12,
            }}
          >
            <div>
              <label>Search</label>

              <div
                style={{
                  position: "relative",
                }}
              >
                <Search
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
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search trial name or NCT ID"
                  style={{
                    width: "100%",
                    paddingLeft: 37,
                  }}
                />
              </div>
            </div>

            <div>
              <label>Condition</label>

              <input
                value={condition}
                onChange={(e) =>
                  setCondition(e.target.value)
                }
                placeholder="e.g. Type 2 Diabetes"
              />
            </div>

            <div>
              <label>Phase</label>

              <select
                value={phase}
                onChange={(e) =>
                  setPhase(e.target.value)
                }
              >
                <option value="">All Phases</option>
                <option value="Phase 1">
                  Phase 1
                </option>
                <option value="Phase 2">
                  Phase 2
                </option>
                <option value="Phase 3">
                  Phase 3
                </option>
                <option value="Phase 4">
                  Phase 4
                </option>
              </select>
            </div>

            <div>
              <label>Status</label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
              >
                <option value="">
                  All Statuses
                </option>
                <option value="Recruiting">
                  Recruiting
                </option>
                <option value="Not Yet Recruiting">
                  Not Yet Recruiting
                </option>
                <option value="Active, Not Recruiting">
                  Active, Not Recruiting
                </option>
                <option value="Completed">
                  Completed
                </option>
              </select>
            </div>

            <div>
              <label>Location</label>

              <input
                value={location}
                onChange={(e) =>
                  setLocation(e.target.value)
                }
                placeholder="e.g. Delhi"
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 14,
            }}
          >
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => loadTrials(true)}
              disabled={refreshing}
            >
              <RefreshCw
                size={14}
                style={{
                  animation: refreshing
                    ? "spin 1s linear infinite"
                    : "none",
                }}
              />

              {refreshing
                ? "Searching..."
                : "Apply Filters"}
            </button>
          </div>
        </div>
      </section>

      {/* RESULTS */}

      <section
        className="card fade-up-delay-2"
        style={{ marginTop: 20 }}
      >
        <div className="card-header">
          <div>
            <div className="card-title">
              Available Clinical Trials
            </div>

            <div className="card-subtitle">
              {trials.length} trial
              {trials.length === 1 ? "" : "s"} returned
              from FastAPI
            </div>
          </div>
        </div>

        <div className="card-body">
          {loading && (
            <div
              style={{
                padding: 45,
                textAlign: "center",
                color: "#94a3b8",
                fontSize: 13,
              }}
            >
              Loading clinical trials...
            </div>
          )}

          {!loading && error && (
            <div
              style={{
                padding: 16,
                borderRadius: 12,
                background: "#fff7f7",
                border: "1px solid #fecaca",
                color: "#b91c1c",
                fontSize: 12,
              }}
            >
              {error}
            </div>
          )}

          {!loading &&
            !error &&
            trials.length === 0 && (
              <div
                style={{
                  padding: 45,
                  textAlign: "center",
                  color: "#94a3b8",
                }}
              >
                No clinical trials matched your filters.
              </div>
            )}

          {!loading &&
            !error &&
            trials.length > 0 && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: 16,
                }}
              >
                {trials.map((trial) => (
                  <article
                    key={trial.id}
                    style={{
                      border:
                        "1px solid #e7edf2",
                      borderRadius: 15,
                      padding: 17,
                      background: "#ffffff",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        gap: 10,
                        alignItems: "flex-start",
                      }}
                    >
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 12,
                          display: "grid",
                          placeItems: "center",
                          background:
                            "#ecfdf5",
                          color: "#0f766e",
                        }}
                      >
                        <FlaskConical
                          size={20}
                        />
                      </div>

                      <span
                        className="badge badge-green"
                      >
                        {trial.status}
                      </span>
                    </div>

                    <div
                      style={{
                        marginTop: 14,
                        fontSize: 14,
                        fontWeight: 850,
                        color: "#172033",
                        lineHeight: 1.45,
                      }}
                    >
                      {trial.name}
                    </div>

                    <div
                      style={{
                        marginTop: 6,
                        fontSize: 10,
                        color: "#94a3b8",
                        fontWeight: 750,
                      }}
                    >
                      {trial.nct_id}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: 7,
                        flexWrap: "wrap",
                        marginTop: 13,
                      }}
                    >
                      <span className="badge badge-purple">
                        {trial.condition}
                      </span>

                      <span className="badge badge-blue">
                        {trial.phase || "Phase N/A"}
                      </span>

                      <span className="badge badge-yellow">
                        <MapPin size={10} />
                        {trial.location ||
                          "Location N/A"}
                      </span>
                    </div>

                    <p
                      style={{
                        color: "#7b899c",
                        fontSize: 11,
                        lineHeight: 1.7,
                        marginTop: 13,
                        minHeight: 56,
                      }}
                    >
                      {trial.description ||
                        "No trial description available."}
                    </p>

                    <div
                      style={{
                        marginTop: 15,
                        paddingTop: 13,
                        borderTop:
                          "1px solid #edf1f5",
                        display: "flex",
                        justifyContent:
                          "space-between",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 10,
                          color: "#64748b",
                        }}
                      >
                        Age:{" "}
                        {trial.min_age ?? "—"} -{" "}
                        {trial.max_age ?? "—"}
                      </span>

                      <Link
                        to={`/trials/${trial.id}`}
                        className="btn btn-secondary btn-sm"
                      >
                        View Trial
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
        </div>
      </section>
    </main>
  );
}
