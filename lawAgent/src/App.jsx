import "./App.css";
import ListOfUsersComponent from "./components/ListOfUsersComponent";
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from "react-router-dom";
import React from "react";
import RegisterUser from "./routes/RegisterUser";
import Layout from "./routes/Layout/Layout";
import NotFound from "./routes/NotFound";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter, Routes } from "react-router-dom";
import PrivateRoute from "./routes/PrivateRoute";
import Login from "./routes/Login";
import DocumentComparisonPage from "./routes/DocumentComparisonPage";
import DocumentSearchPage from "./routes/DocumentSearchPage";
import VersionPage from "./routes/DocumentVersionPage";
import ProfilePage from "./routes/ProfilePage";
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterUser />} />

          <Route element={<Layout />}>
            {/* <Route
              path="/users"
              element={
                <PrivateRoute>
                  <ListOfUsersComponent />
                </PrivateRoute>
              }
            /> */}
            <Route
              path="/compare/:documentId"
              element={
                <PrivateRoute>
                  <DocumentComparisonPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/search"
              element={
                <PrivateRoute>
                  <DocumentSearchPage/>
                </PrivateRoute>
              }
            />
            <Route
              path={`/documents/{id}`}
              element={
                <PrivateRoute>
                  <DocumentSearchPage/>
                </PrivateRoute>
              }
            />
            <Route
             path="/documents/versions/:versionId" 
              element={
                <PrivateRoute>
                  <VersionPage /> 
                </PrivateRoute>
              }
            />
            <Route
             path="/profile" 
              element={
                <PrivateRoute>
                  <ProfilePage /> 
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <ListOfUsersComponent />
                </PrivateRoute>
              }
            />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;