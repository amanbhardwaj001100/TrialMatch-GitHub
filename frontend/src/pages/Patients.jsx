import {
  Eye,
  Plus,
  RefreshCw,
  Search,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import { getPatients } from "../services/patients";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadPatients() {
    try {
      setLoading(true);
      setError("");

      const data = await getPatients();

      const normalized = Array.isArray(data)
        ? data
        : Array.isArray(data?.items)
          ? data.items
          : [];

      setPatients(normalized);
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          "Unable to load patients from the backend."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPatients();
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return patients;
    }

    return patients.filter((patient) =>
      [
        patient?.name,
        patient?.disease,
        patient?.city,
        patient?.gender,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value)
            .toLowerCase()
            .includes(query)
        )
    );
  }, [patients, search]);

  return (
    <main className="page-container">
      <div className="page-heading fade-up">
        <div>
          <span className="badge badge-green">
            <Users size={11} />
            Live patient records
          </span>

          <h1 style={{ marginTop: 12 }}>
            Patients
          </h1>

          <p>
            Manage patient profiles and prepare them
            for clinical trial matching.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: 9,
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            className="btn btn-secondary"
            onClick={loadPatients}
            disabled={loading}
          >
            <RefreshCw size={14} />
            Refresh
          </button>

          <Link
            to="/patients/add"
            className="btn btn-primary"
          >
            <Plus size={16} />
            Add Patient
          </Link>
        </div>
      </div>

      <div
        className="filter-bar fade-up-delay-1"
        style={{ marginBottom: 20 }}
      >
        <div className="search-box">
          <Search size={16} />

          <input
            className="form-input"
            placeholder="Search by name, disease, city or gender..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>
      </div>

      {error && (
        <div
          className="card fade-up-delay-2"
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

      <section className="card fade-up-delay-2">
        <div className="card-header">
          <div>
            <div className="card-title">
              Patient Directory
            </div>

            <div className="card-subtitle">
              {loading
                ? "Loading records..."
                : `${filtered.length} patient${filtered.length === 1 ? "" : "s"} shown`}
            </div>
          </div>

          <span className="badge badge-blue">
            Backend records
          </span>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Disease</th>
                <th>City</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {!loading &&
                filtered.map((patient) => (
                  <tr key={patient.id}>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <div className="avatar">
                          {String(patient.name || "P")
                            .split(" ")
                            .map((part) => part[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>

                        <div>
                          <div
                            style={{
                              fontWeight: 800,
                              color: "#172033",
                            }}
                          >
                            {patient.name}
                          </div>

                          <div
                            style={{
                              color: "#94a3b8",
                              fontSize: 10,
                              marginTop: 2,
                            }}
                          >
                            PT-
                            {String(patient.id).padStart(
                              4,
                              "0"
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>{patient.age}</td>

                    <td>{patient.gender}</td>

                    <td>
                      {patient.disease || "—"}
                    </td>

                    <td>
                      {patient.city || "—"}
                    </td>

                    <td>
                      <span className="badge badge-green">
                        Active
                      </span>
                    </td>

                    <td>
                      <Link
                        to={`/patients/${patient.id}`}
                        className="btn btn-secondary btn-sm"
                      >
                        <Eye size={13} />
                        View
                      </Link>
                    </td>
                  </tr>
                ))}

              {!loading && filtered.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    style={{
                      textAlign: "center",
                      padding: 45,
                      color: "#94a3b8",
                    }}
                  >
                    {search
                      ? "No patients match your search."
                      : "No patient records yet. Add the first patient."}
                  </td>
                </tr>
              )}

              {loading && (
                <tr>
                  <td
                    colSpan="7"
                    style={{
                      textAlign: "center",
                      padding: 45,
                      color: "#94a3b8",
                    }}
                  >
                    Loading patient records...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
