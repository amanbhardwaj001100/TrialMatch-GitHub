import {
  ArrowLeft,
  BrainCircuit,
  FileText,
  LoaderCircle,
  MapPin,
  Microscope,
  Phone,
  Search,
  Target,
  UploadCloud,
} from "lucide-react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import {
  getPatient,
} from "../services/patients";

import {
  getReports,
} from "../services/reports";


export default function PatientDetails() {

  const { id } = useParams();

  const [patient, setPatient] =
    useState(null);

  const [reports, setReports] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  async function load() {

    try {
      setLoading(true);
      setError("");

      const [
        patientData,
        reportData,
      ] = await Promise.all([
        getPatient(id),
        getReports(id),
      ]);

      setPatient(patientData);
      setReports(
        Array.isArray(reportData)
          ? reportData
          : []
      );

    } catch (err) {

      setError(
        err?.response?.data?.detail ||
          "Unable to load patient."
      );

    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
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
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "#94a3b8",
              fontSize: 13,
            }}
          >
            <LoaderCircle
              size={17}
              className="spin"
            />
            Loading patient...
          </div>
        </div>
      </main>
    );
  }


  if (error || !patient) {
    return (
      <main className="page-container">

        <div className="page-heading">
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
              }}
            >
              <ArrowLeft size={14} />
              Back to Patients
            </Link>

            <h1 style={{ marginTop: 14 }}>
              Patient Not Found
            </h1>

            <p>{error}</p>
          </div>
        </div>

      </main>
    );
  }


  return (
    <main className="page-container">

      {/* HEADER */}
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
            <div className="avatar">
              <Search size={19} />
            </div>

            <div>
              <h1>{patient.name}</h1>

              <p>
                PT-
                {String(patient.id).padStart(4, "0")}
                {" "}• Live patient record
              </p>
            </div>
          </div>

        </div>


        <Link
          to={`/matches/${patient.id}`}
          className="btn btn-primary"
        >
          <Target size={14} />
          Find Trial Matches
        </Link>

      </div>


      {/* PROFILE */}
      <section
        className="card fade-up-delay-1"
      >

        <div className="card-header">
          <div className="card-title">
            Patient Information
          </div>

          <span className="badge badge-green">
            Live Backend
          </span>
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

            <Info
              label="Age"
              value={`${patient.age} years`}
            />

            <Info
              label="Gender"
              value={patient.gender}
            />

            <Info
              label="Disease"
              value={patient.disease}
            />

            <Info
              label="Disease Stage"
              value={patient.disease_stage}
            />

            <Info
              label="City"
              value={patient.city}
              icon={MapPin}
            />

            <Info
              label="Contact"
              value={patient.contact}
              icon={Phone}
            />

          </div>

        </div>
      </section>


      {/* CLINICAL DATA */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 20,
          marginTop: 20,
        }}
      >

        <section className="card">

          <div className="card-header">
            <div className="card-title">
              Symptoms
            </div>

            <BrainCircuit size={18} />
          </div>

          <div className="card-body">

            <p
              style={{
                color: "#64748b",
                fontSize: 12,
                lineHeight: 1.8,
              }}
            >
              {patient.symptoms ||
                "No symptoms recorded."}
            </p>

          </div>

        </section>


        <section className="card">

          <div className="card-header">
            <div className="card-title">
              Medications
            </div>

            <Microscope size={18} />
          </div>

          <div className="card-body">

            <p
              style={{
                color: "#64748b",
                fontSize: 12,
                lineHeight: 1.8,
              }}
            >
              {patient.medications ||
                "No medications recorded."}
            </p>

          </div>

        </section>

      </div>


      {/* WORKFLOW */}
      <section
        className="card"
        style={{ marginTop: 20 }}
      >

        <div className="card-header">
          <div>
            <div className="card-title">
              Clinical Workflow
            </div>

            <div className="card-subtitle">
              Continue from patient data to analysis and trial matching.
            </div>
          </div>
        </div>


        <div className="card-body">

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(210px, 1fr))",
              gap: 12,
            }}
          >

            <ActionCard
              icon={UploadCloud}
              title="Upload Report"
              text="Add a medical PDF or TXT report."
              to={`/reports/upload?patient_id=${patient.id}`}
            />

            <ActionCard
              icon={BrainCircuit}
              title="AI Analysis"
              text="Analyze an existing medical report."
              to={`/analysis?patient_id=${patient.id}`}
            />

            <ActionCard
              icon={Target}
              title="Trial Matching"
              text="Evaluate this patient against trials."
              to={`/matches/${patient.id}`}
            />

          </div>

        </div>
      </section>


      {/* REPORTS */}
      <section
        className="card"
        style={{ marginTop: 20 }}
      >

        <div className="card-header">

          <div>
            <div className="card-title">
              Medical Reports
            </div>

            <div className="card-subtitle">
              {reports.length} report
              {reports.length === 1 ? "" : "s"} linked to this patient.
            </div>
          </div>

          <Link
            to={`/reports/upload?patient_id=${patient.id}`}
            className="btn btn-secondary btn-sm"
          >
            <UploadCloud size={13} />
            Upload
          </Link>

        </div>


        <div className="card-body">

          {reports.length === 0 ? (

            <div
              style={{
                padding: 30,
                textAlign: "center",
                color: "#94a3b8",
                fontSize: 12,
              }}
            >
              No medical reports uploaded yet.
            </div>

          ) : (

            <div
              style={{
                display: "grid",
                gap: 9,
              }}
            >
              {reports.map((report) => (

                <div
                  key={report.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 12,
                    padding: 13,
                    border:
                      "1px solid #edf1f5",
                    borderRadius: 11,
                  }}
                >

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      minWidth: 0,
                    }}
                  >
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 10,
                        display: "grid",
                        placeItems: "center",
                        background: "#eff6ff",
                        color: "#2563eb",
                        flexShrink: 0,
                      }}
                    >
                      <FileText size={16} />
                    </div>

                    <div
                      style={{
                        minWidth: 0,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 800,
                          color: "#172033",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {report.filename ||
                          report.file_name ||
                          report.name}
                      </div>

                      <div
                        style={{
                          marginTop: 3,
                          fontSize: 9,
                          color: "#94a3b8",
                        }}
                      >
                        {report.report_type ||
                          "Medical Report"}
                        {" • "}
                        {report.status}
                      </div>
                    </div>
                  </div>


                  <Link
                    to={`/analysis?report_id=${report.id}`}
                    className="btn btn-secondary btn-sm"
                  >
                    Analyze
                  </Link>

                </div>

              ))}
            </div>

          )}

        </div>
      </section>

    </main>
  );
}


function Info({
  label,
  value,
  icon: Icon,
}) {
  return (
    <div
      style={{
        padding: 13,
        borderRadius: 11,
        background: "#f8fafc",
        border:
          "1px solid #edf1f5",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 5,
          color: "#94a3b8",
          fontSize: 9,
          fontWeight: 800,
          textTransform: "uppercase",
        }}
      >
        {Icon && <Icon size={11} />}
        {label}
      </div>

      <div
        style={{
          marginTop: 5,
          color: "#172033",
          fontSize: 12,
          fontWeight: 800,
        }}
      >
        {value || "—"}
      </div>
    </div>
  );
}


function ActionCard({
  icon: Icon,
  title,
  text,
  to,
}) {
  return (
    <Link
      to={to}
      style={{
        display: "block",
        padding: 15,
        borderRadius: 12,
        border:
          "1px solid #e7edf2",
        textDecoration: "none",
        background: "#ffffff",
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          display: "grid",
          placeItems: "center",
          background: "#ecfdf5",
          color: "#0f766e",
        }}
      >
        <Icon size={17} />
      </div>

      <div
        style={{
          marginTop: 10,
          fontSize: 12,
          fontWeight: 850,
          color: "#172033",
        }}
      >
        {title}
      </div>

      <div
        style={{
          marginTop: 4,
          fontSize: 10,
          color: "#94a3b8",
          lineHeight: 1.6,
        }}
      >
        {text}
      </div>
    </Link>
  );
}
