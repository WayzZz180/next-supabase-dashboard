import React from "react";
import Hero from "./components/Hero";
import Features from "./components/Features";
import CTA from "./components/CTA";
import Footer from "./components/Footer";

export default async function Home() {
  return (
    <div>
      <Hero />
      <Features />
      <CTA />
      <Footer />
    </div>
  );
}
