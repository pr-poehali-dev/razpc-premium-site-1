import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div style={{ background: "var(--razpc-black)", minHeight: "100vh" }}>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}