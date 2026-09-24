import {
  ArrowLeft,
  LoaderCircle,
  Save,
  UserPlus,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useState,
} from "react";

import {
  createPatient,
} from "../services/patients";


export default function AddPatient() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "Male",
    disease: "",
    disease_stage: "",
    city: "",
    contact: "",
    symptoms: "",
    medications: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function update(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function submit(event) {
    event.preventDefault();

    setError("");

    if (!form.name.trim()) {
      setError("Patient name is required.");
      return;
    }

    if (!form.age) {
      setError("Patient age is required.");
      return;
    }

    if (!form.disease.trim()) {
      setError("Disease is required.");
      return;
    }

    try {
      setSaving(true);

      const patient = await createPatient({
        name: form.name.trim(),
        age: Number(form.age),
        gender: form.gender,
        disease: form.disease.trim(),
        disease_stage:
          form.disease_stage.trim() || null,
        city:
          form.city.trim() || null,
        contact:
          form.contact.trim() || null,
        symptoms:
          form.symptoms.trim() || null,
        medications:
          form.medications.trim() || null,
      });

      navigate(`/patients/${patient.id}`);
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          "Unable to create patient."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="page-container">

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

          <h1>Add Patient</h1>

          <p>
            Create a patient profile for report
            analysis and clinical trial matching.
          </p>
        </div>
      </div>


      <section className="card fade-up-delay-1">

        <div className="card-header">
          <div>
            <div className="card-title">
              Patient Information
            </div>

            <div className="card-subtitle">
              All fields are stored through the FastAPI backend.
            </div>
          </div>

          <UserPlus size={19} />
        </div>


        <div className="card-body">

          {error && (
            <div
              style={{
                marginBottom: 18,
                padding: 12,
                borderRadius: 10,
                background: "#fff7f7",
                border: "1px solid #fecaca",
                color: "#b91c1c",
                fontSize: 12,
              }}
            >
              {error}
            </div>
          )}


          <form onSubmit={submit}>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 16,
              }}
            >

              <Field
                label="Full Name"
                value={form.name}
                onChange={(e) =>
                  update("name", e.target.value)
                }
                placeholder="e.g. Rahul Sharma"
                required
              />

              <Field
                label="Age"
                type="number"
                min="1"
                max="120"
                value={form.age}
                onChange={(e) =>
                  update("age", e.target.value)
                }
                placeholder="45"
                required
              />

              <div>
                <label className="field-label">
                  Gender
                </label>

                <select
                  className="input"
                  value={form.gender}
                  onChange={(e) =>
                    update(
                      "gender",
                      e.target.value
                    )
                  }
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>

              <Field
                label="Disease"
                value={form.disease}
                onChange={(e) =>
                  update(
                    "disease",
                    e.target.value
                  )
                }
                placeholder="Type 2 Diabetes"
                required
              />

              <Field
                label="Disease Stage"
                value={form.disease_stage}
                onChange={(e) =>
                  update(
                    "disease_stage",
                    e.target.value
                  )
                }
                placeholder="Stage 2"
              />

              <Field
                label="City"
                value={form.city}
                onChange={(e) =>
                  update(
                    "city",
                    e.target.value
                  )
                }
                placeholder="Delhi"
              />

              <Field
                label="Contact"
                value={form.contact}
                onChange={(e) =>
                  update(
                    "contact",
                    e.target.value
                  )
                }
                placeholder="Phone / Email"
              />

              <Field
                label="Medications"
                value={form.medications}
                onChange={(e) =>
                  update(
                    "medications",
                    e.target.value
                  )
                }
                placeholder="Metformin"
              />

            </div>


            <div style={{ marginTop: 16 }}>
              <label className="field-label">
                Symptoms
              </label>

              <textarea
                className="input"
                rows="4"
                value={form.symptoms}
                onChange={(e) =>
                  update(
                    "symptoms",
                    e.target.value
                  )
                }
                placeholder="Fatigue, thirst, frequent urination"
                style={{
                  resize: "vertical",
                }}
              />
            </div>


            <div
              style={{
                marginTop: 24,
                paddingTop: 18,
                borderTop:
                  "1px solid #edf1f5",
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
              }}
            >
              <Link
                to="/patients"
                className="btn btn-secondary"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <LoaderCircle
                      size={15}
                      className="spin"
                    />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={15} />
                    Save Patient
                  </>
                )}
              </button>
            </div>

          </form>

        </div>
      </section>

    </main>
  );
}


function Field({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  min,
  max,
}) {
  return (
    <div>
      <label className="field-label">
        {label}
      </label>

      <input
        className="input"
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
      />
    </div>
  );
}
