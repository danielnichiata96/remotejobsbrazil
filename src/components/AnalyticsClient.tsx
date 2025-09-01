"use client";
import React, { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";

export function AnalyticsClient() {
  const [SpeedInsightsComp, setSpeedInsightsComp] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    let mounted = true;
    // Dynamically import SpeedInsights only in the browser to avoid build-time network calls
    import("@vercel/speed-insights/next")
      .then((mod) => {
        if (mounted && mod?.SpeedInsights) setSpeedInsightsComp(() => mod.SpeedInsights as React.ComponentType);
      })
      .catch(() => {
        // Ignore failures (e.g., not configured in dev)
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <Analytics />
      {SpeedInsightsComp ? <SpeedInsightsComp /> : null}
    </>
  );
}
