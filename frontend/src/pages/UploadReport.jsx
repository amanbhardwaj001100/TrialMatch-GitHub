import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  LoaderCircle,
  UploadCloud,
  XCircle,
} from "lucide-react";

import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  getPatients,
} from "../services/patients";

import {
  uploadReport,
} from "../services/reports";


export default function UploadReport() {

  const navigate = useNavigate();

  const [searchParams] =
    useSearchParams();

  const inputRef = useRef(null);

  const [patients, setPatients] =
    useState([]);

  const [patientId, setPatientId] =
    useState(
      searchParams.get("patient_id") || ""
    );

  const [reportType, setReportType] =
    useState("Medical Report");

  const [file, setFile] =
    useState(null);

  const [uploading, setUploading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState(null);


  useEffect(() => {

    async function loadPatients() {

      try {

        const data =
          await getPatients();

        setPatients(
          Array.isArray(data)
            ? data
            : []
        );

      } catch (err) {

        setError(
          err?.response?.data?.detail ||
            "Unable to load patients."
        );

      }

    }

    loadPatients();

  }, []);


  function chooseFile(selected) {

    if (!selected) return;

    setError("");
    setSuccess(null);

    const extension =
      selected.name
        .split(".")
        .pop()
        ?.toLowerCase();

    if (
      !["pdf", "txt"].includes(extension)
    ) {
      setFile(null);
      setError(
        "Only PDF and TXT medical reports are supported."
      );
      return;
    }

    if (
      selected.size >
      10 * 1024 * 1024
    ) {
      setFile(null);
      setError(
        "File size must be 10 MB or less."
      );
      return;
    }

    setFile(selected);
  }


  async function submit(event) {

    event.preventDefault();

    setError("");
    setSuccess(null);

    if (!patientId) {
      setError("Please select a patient.");
      return;
    }

    if (!file) {
      setError(
        "Please select a PDF or TXT report."
      );
      return;
    }

    try {

      setUploading(true);

      const result =
        await uploadReport({
          patientId,
          reportType,
          file,
        });

      setSuccess(result);

    } catch (err) {

      setError(
        err?.response?.data?.detail ||
          "Report upload failed."
      );

    } finally {
      setUploading(false);
    }
  }


  return (
    <main className="page-container">

      <div className="page-heading fade-up">

        <div>

          <Link
            to="/reports"
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
            Back to Reports
          </Link>

          <h1>
            Upload Medical Report
          </h1>

          <p>
            Upload a patient report for processing
            and AI-assisted analysis.
          </p>

        </div>

      </div>


      <section
        className="card fade-up-delay-1"
      >

        <div className="card-header">
          <div>
            <div className="card-title">
              Report Upload
            </div>

            <div className="card-subtitle">
              Backend processing supports PDF and TXT files up to 10 MB.
            </div>
          </div>

          <UploadCloud size={19} />
        </div>


        <div className="card-body">

          {error && (
            <div
              style={{
                marginBottom: 16,
                padding: 12,
                borderRadius: 10,
                background: "#fff7f7",
                border:
                  "1px solid #fecaca",
                color: "#b91c1c",
                fontSize: 12,
                display: "flex",
                gap: 7,
                alignItems: "center",
              }}
            >
              <XCircle size={15} />
              {error}
            </div>
          )}


          {success ? (

            <div
              style={{
                padding: 22,
                borderRadius: 13,
                background: "#f0fdf4",
                border:
                  "1px solid #bbf7d0",
              }}
            >

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  color: "#166534",
                  fontSize: 13,
                  fontWeight: 850,
                }}
              >
                <CheckCircle2 size={17} />
                Report uploaded successfully
              </div>

              <div
                style={{
                  marginTop: 8,
                  fontSize: 11,
                  color: "#64748b",
                }}
              >
                Report ID: {success.id}
                {" • "}
                Status: {success.status}
              </div>

              <div
                style={{
                  marginTop: 18,
                  display: "flex",
                  gap: 9,
                  flexWrap: "wrap",
                }}
              >

                <Link
                  to={`/analysis?report_id=${success.id}`}
                  className="btn btn-primary"
                >
                  <FileText size={14} />
                  Analyze Report
                </Link>

                <Link
                  to={`/patients/${patientId}`}
                  className="btn btn-secondary"
                >
                  View Patient
                </Link>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() =>
                    setSuccess(null)
                  }
                >
                  Upload Another
                </button>

              </div>

            </div>

          ) : (

            <form onSubmit={submit}>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 16,
                }}
              >

                <div>

                  <label className="field-label">
                    Patient
                  </label>

                  <select
                    className="input"
                    value={patientId}
                    onChange={(e) =>
                      setPatientId(
                        e.target.value
                      )
                    }
                    required
                  >
                    <option value="">
                      Select patient
                    </option>

                    {patients.map(
                      (patient) => (
                        <option
                          key={patient.id}
                          value={patient.id}
                        >
                          {patient.name}
                          {" — "}
                          {patient.disease}
                        </option>
                      )
                    )}

                  </select>

                </div>


                <div>

                  <label className="field-label">
                    Report Type
                  </label>

                  <select
                    className="input"
                    value={reportType}
                    onChange={(e) =>
                      setReportType(
                        e.target.value
                      )
                    }
                  >
                    <option>
                      Medical Report
                    </option>
                    <option>
                      Lab Report
                    </option>
                    <option>
                      Diagnostic Report
                    </option>
                    <option>
                      Clinical Summary
                    </option>
                  </select>

                </div>

              </div>


              <div
                style={{
                  marginTop: 18,
                }}
              >

                <input
                  ref={inputRef}
                  type="file"
                  accept=".pdf,.txt,application/pdf,text/plain"
                  style={{
                    display: "none",
                  }}
                  onChange={(e) =>
                    chooseFile(
                      e.target.files?.[0]
                    )
                  }
                />


                <button
                  type="button"
                  onClick={() =>
                    inputRef.current?.click()
                  }
                  style={{
                    width: "100%",
                    minHeight: 190,
                    border:
                      "1.5px dashed #cbd5e1",
                    borderRadius: 15,
                    background: "#f8fafc",
                    cursor: "pointer",
                    padding: 25,
                  }}
                >

                  <div
                    style={{
                      width: 52,
                      height: 52,
                      margin: "0 auto",
                      borderRadius: 15,
                      display: "grid",
                      placeItems: "center",
                      background: "#ecfdf5",
                      color: "#0f766e",
                    }}
                  >
                    <UploadCloud size={25} />
                  </div>

                  <div
                    style={{
                      marginTop: 12,
                      fontSize: 13,
                      fontWeight: 850,
                      color: "#172033",
                    }}
                  >
                    {file
                      ? file.name
                      : "Choose medical report"}
                  </div>

                  <div
                    style={{
                      marginTop: 5,
                      fontSize: 10,
                      color: "#94a3b8",
                    }}
                  >
                    PDF or TXT • Maximum 10 MB
                  </div>

                </button>

              </div>


              <div
                style={{
                  marginTop: 20,
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={
                    uploading ||
                    !patientId ||
                    !file
                  }
                >
                  {uploading ? (
                    <>
                      <LoaderCircle
                        size={15}
                        className="spin"
                      />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <UploadCloud size={15} />
                      Upload Report
                    </>
                  )}
                </button>

              </div>

            </form>

          )}

        </div>
      </section>

    </main>
  );
}
