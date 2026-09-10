import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { Spinner } from "../components/States";

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="w-full flex-1">
        <Suspense fallback={<Spinner className="py-32" />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
