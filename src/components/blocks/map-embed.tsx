"use client";

import { MapPin } from "lucide-react";
import { useState } from "react";
import { site } from "@/content/site";

/** Click-to-load map: no third-party requests until the visitor opts in. */
export function MapEmbed() {
  const [load, setLoad] = useState(false);
  const q = encodeURIComponent(`Ecobank Towers, Muindi Mbingu Street, Nairobi`);
  return (
    <div className="duotone relative aspect-[4/3] overflow-hidden rounded-lg">
      {load ? (
        <iframe
          title={`Map showing ${site.name} at ${site.address.street}`}
          src={`https://www.google.com/maps?q=${q}&output=embed`}
          className="absolute inset-0 h-full w-full border-0 [filter:none]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <>
          <div aria-hidden className="topo absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 [filter:invert(1)]" />
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 p-6 text-center text-sand-50">
            <MapPin aria-hidden strokeWidth={1.5} className="size-10 text-accent-400" />
            <p className="font-display text-xl font-bold">{site.address.street}</p>
            <button type="button" onClick={() => setLoad(true)} className="min-h-11 rounded-pill bg-sand-50 px-5 font-semibold text-ink-950 hover:bg-white">
              Load interactive map
            </button>
            <p className="text-xs text-mint-200">Loads Google Maps, which may set cookies.</p>
          </div>
        </>
      )}
    </div>
  );
}
