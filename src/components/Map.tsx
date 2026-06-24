import React, { useEffect, useState } from "react";
import { type Neighborhood } from "@/lib/types";

// Dynamic import of the actual Leaflet Map implementation to avoid SSR execution
const LazyMap = React.lazy(() => import("./MapInner"));

interface MapProps {
  highlightedNeighborhood?: Neighborhood;
  className?: string;
}

export function Map({ highlightedNeighborhood, className }: MapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`flex w-full items-center justify-center rounded-2xl border border-border bg-secondary/30 text-sm text-muted-foreground animate-pulse ${className}`}
        style={{ minHeight: "350px" }}
      >
        Ładowanie mapy...
      </div>
    );
  }

  return (
    <React.Suspense
      fallback={
        <div
          className={`flex w-full items-center justify-center rounded-2xl border border-border bg-secondary/30 text-sm text-muted-foreground ${className}`}
          style={{ minHeight: "350px" }}
        >
          Wczytywanie interaktywnej mapy...
        </div>
      }
    >
      <LazyMap highlightedNeighborhood={highlightedNeighborhood} className={className} />
    </React.Suspense>
  );
}
