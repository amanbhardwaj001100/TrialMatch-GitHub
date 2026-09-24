import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import AddPatient from "./pages/AddPatient";
import PatientDetails from "./pages/PatientDetails";
import Reports from "./pages/Reports";
import UploadReport from "./pages/UploadReport";
import Analysis from "./pages/Analysis";
import Trials from "./pages/Trials";
import TrialDetails from "./pages/TrialDetails";
import TrialMatching from "./pages/TrialMatching";
import NotFound from "./pages/NotFound";


export default function App() {
  return (
    <Routes>

      <Route
        path="/"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />


      <Route element={<ProtectedRoute />}>

        <Route element={<DashboardLayout />}>

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/patients"
            element={<Patients />}
          />

          <Route
            path="/patients/add"
            element={<AddPatient />}
          />

          <Route
            path="/patients/:id"
            element={<PatientDetails />}
          />

          <Route
            path="/reports"
            element={<Reports />}
          />

          <Route
            path="/reports/upload"
            element={<UploadReport />}
          />

          <Route
            path="/analysis"
            element={<Analysis />}
          />

          <Route
            path="/trials"
            element={<Trials />}
          />

          <Route
            path="/trials/:id"
            element={<TrialDetails />}
          />

          <Route
            path="/matches/:patientId"
            element={<TrialMatching />}
          />

        </Route>

      </Route>


      <Route
        path="*"
        element={<NotFound />}
      />

    </Routes>
  );
}
