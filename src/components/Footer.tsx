"use client";
import React from "react";
import { MinimalFooter } from "@/components/ui/Footer-Component";
import Lenis from "@studio-freight/lenis";

export default function Footer() {
  React.useEffect(() => {
    const lenis = new Lenis();

    let rafId: number;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => cancelAnimationFrame(rafId);
  }, []);

  return <MinimalFooter />;
}
