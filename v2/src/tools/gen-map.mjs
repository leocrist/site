// Generates a dot-matrix SVG of Southeast Asia + Australia with the two PTN offices.
// Data: Natural Earth 1:50m land via world-atlas (public domain). Output: v2/src/map.json
import { readFileSync, writeFileSync } from 'node:fs';
import { feature } from 'topojson-client';
import { geoContains } from 'd3-geo';

const topo = JSON.parse(readFileSync(new URL('./node_modules/world-atlas/land-50m.json', import.meta.url)));
const land = feature(topo, topo.objects.land);

// Equirectangular window
const W = 1000, H = 640;
const LON0 = 92, LON1 = 158, LAT0 = 24, LAT1 = -44; // north to south
const sx = lon => (lon - LON0) / (LON1 - LON0) * W;
const sy = lat => (LAT0 - lat) / (LAT0 - LAT1) * H;

const STEP = 0.85; // degrees between dots
let d = '';
let n = 0;
for (let lat = LAT0 - STEP / 2; lat > LAT1; lat -= STEP) {
  for (let lon = LON0 + STEP / 2; lon < LON1; lon += STEP) {
    if (geoContains(land, [lon, lat])) { d += `M${sx(lon).toFixed(1)} ${sy(lat).toFixed(1)}h0`; n++; }
  }
}

const MEL = { lon: 144.9631, lat: -37.8136 }, CT = { lon: 105.7469, lat: 10.0452 };
const R = 6371, rad = x => x * Math.PI / 180;
const hav = (a, b) => {
  const dLat = rad(b.lat - a.lat), dLon = rad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};
const out = {
  W, H, dots: d, count: n,
  mel: [+sx(MEL.lon).toFixed(1), +sy(MEL.lat).toFixed(1)],
  ct: [+sx(CT.lon).toFixed(1), +sy(CT.lat).toFixed(1)],
  km: Math.round(hav(MEL, CT) / 10) * 10,
};
writeFileSync(process.argv[2], JSON.stringify(out));
console.log('dots', n, 'km', out.km, 'mel', out.mel, 'ct', out.ct, 'bytes', d.length);
