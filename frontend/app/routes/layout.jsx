import React from "react";
import { Outlet, Link } from "react-router-dom";
import Header from "../component/normal/header";
import { useAppContext } from "../root_context";
export default function Layout() {

  return (
    <div>
      <Header />

      <main style={{ padding: "1rem" }}>
        <Outlet />
      </main>

      <footer style={{ padding: "1rem", borderTop: "1px solid #333" }}>
        <p>© 2025 Wheres My Fluffy</p>
      </footer>
    </div>
  );
}
