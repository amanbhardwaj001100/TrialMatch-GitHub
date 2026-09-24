import {
  AlertTriangle,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  FileText,
  LoaderCircle,
  Sparkles,
  Target,
} from "lucide-react";

import {
  Link,
  useSearchParams,
} from "react-router-dom";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getReports,
} from "../services/reports";

import {
  analyzeReport,
} from "../services/analysis";


export default function Analysis() {

  const [searchParams] =
    useSearchParams();

  const reportQuery =
    searchParams.get("report_id");

  const patientQuery =
    searchParams.get("patient_id");


  const [reports, setReports] =
    useState([]);

  const [selectedId, setSelectedId] =
    useState(reportQuery || "");

  const [result, setResult] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [running, setRunning] =
    useState(false);

  const [error, setError] =
    useState("");


  async function loadReports() {

    try {

      setLoading(true);
      setError("");

      const data =
        await getReports(
          patientQuery || null
        );

      const list =
        Array.isArray(data)
          ? data
          : [];

      setReports(list);

      const requested =
        reportQuery &&
        list.some(
          (item) =>
            String(item.id) ===
            String(reportQuery)
        );

      if (requested) {
        setSelectedId(reportQuery);
      } else if (
        !selectedId &&
        list.length > 0
      ) {
        setSelectedId(
          String(list[0].id)
        );
      }

    } catch (err) {

      setError(
        err?.response?.data?.detail ||
          "Unable to load reports."
      );

    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    loadReports();
  }, [reportQuery, patientQuery]);


  const selectedReport =
    useMemo(
      () =>
        reports.find(
          (item) =>
            String(item.id) ===
            String(selectedId)
        ),
      [reports, selectedId]
    );


  async function runAnalysis() {

    if (!selectedId) {
      setError(
        "Please select a report first."
      );
      return;
    }

    try {

      setRunning(true);
      setError("");

      const data =
        await analyzeReport(
          selectedId
        );

      setResult(data);

      await loadReports();

    } catch (err) {

      setError(
        err?.response?.data?.detail ||
          "AI analysis failed."
      );

    } finally {
      setRunning(false);
    }
  }


  return (
    <main className="page-container">

      <div className="page-heading fade-up">

        <div>
          <h1>
            Medical Report Analysis
          </h1>

          <p>
            AI-assisted analysis powered by the backend report engine.
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
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: "#b91c1c",
                fontSize: 12,
              }}
            >
              <AlertTriangle size={15} />
              {error}
            </div>
          </div>
        </div>
      )}


      <section className="card fade-up-delay-1">

        <div className="card-header">

          <div>
            <div className="card-title">
              Select Medical Report
            </div>

            <div className="card-subtitle">
              Choose a processed report and run analysis.
            </div>
          </div>

          <BrainCircuit size={19} />

        </div>


        <div className="card-body">

          {loading ? (

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: "#94a3b8",
                fontSize: 12,
              }}
            >
              <LoaderCircle
                size={16}
                className="spin"
              />
              Loading reports...
            </div>

          ) : reports.length === 0 ? (

            <div
              style={{
                padding: 28,
                textAlign: "center",
                color: "#94a3b8",
                fontSize: 12,
              }}
            >
              No medical reports available.
              <div style={{ marginTop: 12 }}>
                <Link
                  to="/reports/upload"
                  className="btn btn-primary"
                >
                  <FileText size={14} />
                  Upload Report
                </Link>
              </div>
            </div>

          ) : (

            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
              }}
            >

              <select
                className="input"
                style={{
                  flex: 1,
                  minWidth: 260,
                }}
                value={selectedId}
                onChange={(e) => {
                  setSelectedId(
                    e.target.value
                  );
                  setResult(null);
                }}
              >

                <option value="">
                  Select report
                </option>

                {reports.map(
                  (report) => (
                    <option
                      key={report.id}
                      value={report.id}
                    >
                      #{report.id} —{" "}
                      {report.filename ||
                        report.name ||
                        "Medical Report"}
                    </option>
                  )
                )}

              </select>


              <button
                type="button"
                className="btn btn-primary"
                onClick={runAnalysis}
                disabled={
                  running ||
                  !selectedId
                }
              >
                {running ? (
                  <>
                    <LoaderCircle
                      size={14}
                      className="spin"
                    />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    Run AI Analysis
                  </>
                )}
              </button>

            </div>

          )}

        </div>

      </section>


      {selectedReport && (
        <section
          className="card"
          style={{ marginTop: 20 }}
        >
          <div className="card-body">

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                gap: 14,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >

              <div>

                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 850,
                    color: "#172033",
                  }}
                >
                  {selectedReport.filename ||
                    selectedReport.name}
                </div>

                <div
                  style={{
                    marginTop: 5,
                    fontSize: 10,
                    color: "#94a3b8",
                  }}
                >
                  Report #{selectedReport.id}
                  {" • "}
                  Patient #{selectedReport.patient_id}
                  {" • "}
                  {selectedReport.status}
                </div>

              </div>

              <span className="badge badge-blue">
                Backend Report
              </span>

            </div>

          </div>
        </section>
      )}


      {result && (
        <>
          <section
            className="card"
            style={{ marginTop: 20 }}
          >

            <div
              className="card-body"
              style={{
                background:
                  "linear-gradient(135deg, #102a43, #0f766e)",
                color: "#ffffff",
                borderRadius: 13,
              }}
            >

              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent:
                    "space-between",
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
                    }}
                  >
                    <CheckCircle2 size={12} />
                    Analysis Complete
                  </div>

                  <div
                    style={{
                      marginTop: 12,
                      fontSize: 24,
                      fontWeight: 900,
                    }}
                  >
                    {result.condition ||
                      "Condition not detected"}
                  </div>

                  <div
                    style={{
                      marginTop: 5,
                      color: "#d7eef0",
                      fontSize: 11,
                    }}
                  >
                    Report #{result.report_id}
                    {" • "}
                    {result.patient_name}
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
                      fontSize: 9,
                      fontWeight: 800,
                      textTransform:
                        "uppercase",
                    }}
                  >
                    Confidence
                  </div>

                  <div
                    style={{
                      marginTop: 3,
                      fontSize: 23,
                      fontWeight: 900,
                    }}
                  >
                    {Math.round(
                      Number(
                        result.confidence || 0
                      ) * 100
                    )}%
                  </div>

                </div>

              </div>

            </div>

          </section>


          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 20,
              marginTop: 20,
            }}
          >

            <ResultList
              title="Symptoms"
              items={
                result.symptoms || []
              }
            />

            <ResultList
              title="Medications"
              items={
                result.medications || []
              }
            />

            <ResultList
              title="Important Findings"
              items={
                result.important_findings || []
              }
            />

          </div>


          <section
            className="card"
            style={{ marginTop: 20 }}
          >

            <div className="card-body">

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                  gap: 15,
                  flexWrap: "wrap",
                }}
              >

                <div>

                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 850,
                      color: "#172033",
                    }}
                  >
                    Continue to Clinical Trial Matching
                  </div>

                  <div
                    style={{
                      marginTop: 4,
                      fontSize: 10,
                      color: "#94a3b8",
                    }}
                  >
                    Use the analyzed patient record to evaluate available trials.
                  </div>

                </div>

                <Link
                  to={`/matches/${result.patient_id}`}
                  className="btn btn-primary"
                >
                  <Target size={14} />
                  Find Matching Trials
                  <ArrowRight size={13} />
                </Link>

              </div>

            </div>

          </section>


          <section
            className="card"
            style={{
              marginTop: 20,
              borderColor: "#dbeafe",
              background: "#f8fbff",
            }}
          >

            <div className="card-body">

              <div
                style={{
                  fontSize: 10,
                  fontWeight: 850,
                  color: "#1e3a8a",
                  textTransform:
                    "uppercase",
                }}
              >
                Analysis Engine
              </div>

              <div
                style={{
                  marginTop: 5,
                  color: "#526174",
                  fontSize: 11,
                }}
              >
                {result.analysis_type ||
                  "AI-assisted analysis"}

              </div>

              <div
                style={{
                  marginTop: 9,
                  color: "#64748b",
                  fontSize: 10,
                  lineHeight: 1.7,
                }}
              >
                {result.disclaimer ||
                  "This analysis is for research/demo purposes only and does not constitute a medical diagnosis."}
              </div>

            </div>

          </section>
        </>
      )}

    </main>
  );
}


function ResultList({
  title,
  items,
}) {

  const list =
    Array.isArray(items)
      ? items
      : [];

  return (
    <section className="card">

      <div className="card-header">
        <div className="card-title">
          {title}
        </div>
      </div>

      <div className="card-body">

        {list.length === 0 ? (

          <div
            style={{
              color: "#94a3b8",
              fontSize: 11,
            }}
          >
            No data detected.
          </div>

        ) : (

          <div
            style={{
              display: "grid",
              gap: 8,
            }}
          >
            {list.map(
              (item, index) => (
                <div
                  key={`${title}-${index}`}
                  style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "flex-start",
                    padding: 10,
                    borderRadius: 9,
                    background: "#f8fafc",
                  }}
                >
                  <CheckCircle2
                    size={13}
                    color="#059669"
                    style={{
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  />

                  <span
                    style={{
                      color: "#526174",
                      fontSize: 11,
                      lineHeight: 1.5,
                    }}
                  >
                    {item}
                  </span>

                </div>
              )
            )}
          </div>

        )}

      </div>
    </section>
  );
}
