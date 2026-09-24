import {
  CheckCircle2,
  FileText,
  LoaderCircle,
  Search,
  UploadCloud,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getReports,
} from "../services/reports";


export default function Reports() {

  const [reports, setReports] =
    useState([]);

  const [query, setQuery] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  async function load() {

    try {
      setLoading(true);
      setError("");

      const data =
        await getReports();

      setReports(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (err) {

      setError(
        err?.response?.data?.detail ||
          "Unable to load medical reports."
      );

    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    load();
  }, []);


  const filtered = useMemo(() => {

    const value =
      query.trim().toLowerCase();

    if (!value) return reports;

    return reports.filter((report) =>
      [
        report.filename,
        report.name,
        report.report_type,
        report.status,
        report.patient_id,
      ]
        .filter(Boolean)
        .some((item) =>
          String(item)
            .toLowerCase()
            .includes(value)
        )
    );

  }, [reports, query]);


  return (
    <main className="page-container">

      <div className="page-heading fade-up">

        <div>
          <h1>Medical Reports</h1>

          <p>
            Real patient-linked reports from the backend.
          </p>
        </div>

        <Link
          to="/reports/upload"
          className="btn btn-primary"
        >
          <UploadCloud size={14} />
          Upload Report
        </Link>

      </div>


      <section className="card fade-up-delay-1">

        <div
          className="card-header"
          style={{
            gap: 15,
            flexWrap: "wrap",
          }}
        >

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
            }}
          >
            <div
              className="search-box"
              style={{
                minWidth: 260,
              }}
            >
              <Search size={15} />

              <input
                value={query}
                onChange={(e) =>
                  setQuery(e.target.value)
                }
                placeholder="Search reports..."
              />
            </div>
          </div>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={load}
          >
            Refresh
          </button>

        </div>


        <div className="card-body">

          {loading ? (

            <div
              style={{
                minHeight: 250,
                display: "grid",
                placeItems: "center",
                color: "#94a3b8",
                fontSize: 12,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <LoaderCircle
                  size={16}
                  className="spin"
                />
                Loading reports...
              </div>
            </div>

          ) : error ? (

            <div
              style={{
                padding: 18,
                borderRadius: 11,
                background: "#fff7f7",
                border:
                  "1px solid #fecaca",
                color: "#b91c1c",
                fontSize: 12,
              }}
            >
              {error}
            </div>

          ) : filtered.length === 0 ? (

            <div
              style={{
                padding: 40,
                textAlign: "center",
                color: "#94a3b8",
                fontSize: 12,
              }}
            >
              No medical reports found.
            </div>

          ) : (

            <div
              style={{
                display: "grid",
                gap: 10,
              }}
            >
              {filtered.map((report) => (

                <div
                  key={report.id}
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems: "center",
                    gap: 14,
                    padding: 14,
                    border:
                      "1px solid #edf1f5",
                    borderRadius: 12,
                  }}
                >

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 11,
                      minWidth: 0,
                    }}
                  >
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 10,
                        display: "grid",
                        placeItems: "center",
                        background: "#eff6ff",
                        color: "#2563eb",
                        flexShrink: 0,
                      }}
                    >
                      <FileText size={17} />
                    </div>

                    <div style={{ minWidth: 0 }}>

                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 850,
                          color: "#172033",
                          overflow: "hidden",
                          textOverflow:
                            "ellipsis",
                          whiteSpace:
                            "nowrap",
                        }}
                      >
                        {report.filename ||
                          report.name ||
                          "Medical Report"}
                      </div>

                      <div
                        style={{
                          marginTop: 4,
                          fontSize: 9,
                          color: "#94a3b8",
                        }}
                      >
                        Patient #{report.patient_id}
                        {" • "}
                        {report.report_type ||
                          "Medical Report"}
                      </div>

                    </div>
                  </div>


                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      flexShrink: 0,
                    }}
                  >

                    <span
                      className={`badge ${
                        report.status ===
                        "Analyzed"
                          ? "badge-green"
                          : "badge-yellow"
                      }`}
                    >
                      {report.status ===
                        "Analyzed" && (
                        <CheckCircle2
                          size={10}
                        />
                      )}
                      {report.status ||
                        "Processed"}
                    </span>

                    <Link
                      to={`/analysis?report_id=${report.id}`}
                      className="btn btn-secondary btn-sm"
                    >
                      Analyze
                    </Link>

                  </div>

                </div>

              ))}
            </div>

          )}

        </div>
      </section>

    </main>
  );
}
