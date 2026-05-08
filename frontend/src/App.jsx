import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Auth from "./pages/Auth";

import Dashboard from "./pages/Dashboard";

import Resume from "./pages/Resume";

import VoiceInterview from "./pages/VoiceInterview";

import InterviewReport from "./pages/InterviewReport";

export default function App(){

  const token =
    localStorage.getItem("token");

  return(

    <BrowserRouter>

      <Routes>

        <Route

          path="/"

          element={
            token
            ? <Dashboard/>
            : <Auth/>
          }

        />

        <Route

          path="/resume"

          element={
            token
            ? <Resume/>
            : <Navigate to="/" />
          }

        />

        <Route

          path="/voice"

          element={
            token
            ? <VoiceInterview/>
            : <Navigate to="/" />
          }

        />

        <Route

          path="/report"

          element={
            token
            ? <InterviewReport/>
            : <Navigate to="/" />
          }

        />

      </Routes>

    </BrowserRouter>

  );

}