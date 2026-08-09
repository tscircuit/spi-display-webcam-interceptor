import { spawnSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";

type CircuitElement = Record<string, any>;

const circuitPath = "dist/index/circuit.json";
const fabricationDirectory =
  "outputs/fabrication/spi-display-webcam-interceptor-v1.0.0";
const drillDirectory = `${fabricationDirectory}/blind-via-drills`;
const gerberArchive = `${fabricationDirectory}/gerbers.zip`;

const layerNumber: Record<string, number> = {
  top: 1,
  inner1: 2,
  inner2: 3,
  bottom: 4,
};

const circuit = JSON.parse(await readFile(circuitPath, "utf8")) as CircuitElement[];
const blindVias = new Map<string, CircuitElement[]>();

for (const via of circuit.filter((element) => element.type === "pcb_via")) {
  const from = layerNumber[via.from_layer ?? via.layers?.[0]];
  const to = layerNumber[via.to_layer ?? via.layers?.at(-1)];
  if (!from || !to) throw new Error(`Unknown via layer span: ${JSON.stringify(via)}`);

  const start = Math.min(from, to);
  const end = Math.max(from, to);
  if (start === 1 && end === 4) continue;

  const span = `L${start}-L${end}`;
  const vias = blindVias.get(span) ?? [];
  vias.push(via);
  blindVias.set(span, vias);
}

await mkdir(drillDirectory, { recursive: true });

const generatedFiles: string[] = [];
for (const [span, vias] of [...blindVias].sort(([a], [b]) => a.localeCompare(b))) {
  const [start, end] = span.match(/\d+/g)!.map(Number);
  const diameters = [...new Set(vias.map((via) => Number(via.hole_diameter ?? 0.2)))].sort(
    (a, b) => a - b,
  );
  const toolForDiameter = new Map(diameters.map((diameter, index) => [diameter, index + 10]));
  const lines = [
    "M48",
    `; DRILL file {tscircuit post-process} ${span}`,
    "; FORMAT={-:-/ absolute / metric / decimal}",
    `; #@! TF.FileFunction,Plated,${start},${end},Blind`,
    "FMAT,2",
    "METRIC",
    ...diameters.map(
      (diameter) =>
        `T${toolForDiameter.get(diameter)}C${diameter.toFixed(6)}`,
    ),
    "%",
    "G90",
    "G05",
  ];

  for (const diameter of diameters) {
    lines.push(`T${toolForDiameter.get(diameter)}`);
    for (const via of vias.filter(
      (candidate) => Number(candidate.hole_diameter ?? 0.2) === diameter,
    )) {
      lines.push(`X${Number(via.x).toFixed(4)}Y${Number(via.y).toFixed(4)}`);
    }
  }
  lines.push("M30", "");

  const file = `${drillDirectory}/drill_${span}.drl`;
  await writeFile(file, lines.join("\n"));
  generatedFiles.push(file);
}

const zip = spawnSync("zip", ["-j", "-u", gerberArchive, ...generatedFiles], {
  stdio: "inherit",
});
if (zip.status !== 0) throw new Error(`zip exited with code ${zip.status}`);

const total = [...blindVias.values()].reduce((sum, vias) => sum + vias.length, 0);
console.log(
  `Added ${total} blind-via drills in ${generatedFiles.length} span files to ${gerberArchive}`,
);
