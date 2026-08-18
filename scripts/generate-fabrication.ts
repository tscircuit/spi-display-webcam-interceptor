import { readFile, writeFile } from "node:fs/promises";

type CircuitElement = Record<string, any>;

const circuitPath = "dist/index/circuit.json";
const packageMetadata = JSON.parse(await readFile("package.json", "utf8")) as {
  version?: string;
};
const outputDirectory = `outputs/fabrication/spi-display-webcam-interceptor-v${
  packageMetadata.version ?? "unknown"
}`;

const circuit = JSON.parse(await readFile(circuitPath, "utf8")) as CircuitElement[];
const sources = circuit.filter((element) => element.type === "source_component");
const pcbComponents = new Map(
  circuit
    .filter((element) => element.type === "pcb_component")
    .map((element) => [element.source_component_id, element]),
);

const footprintByPrimaryLcsc: Record<string, string> = {
  C1525: "0402",
  C15195: "0402",
  C1547: "0402",
  C1555: "0402",
  C17168: "0402",
  C25100: "0402",
  C25741: "0402",
  C25744: "0402",
  C25905: "0402",
  C27009: "0402",
  C2998054: "0402",
  C52923: "0402",
  C19666: "0603",
  C19702: "0603",
  C45783: "0805",
  C2897377: "PinHeader_1x14_P2.54mm_Female_THT",
  C2894937: "PinHeader_1x14_P2.54mm_Male_THT",
  C54540373: "QFN-104_10x10mm_P0.35mm_EP7.5mm",
  C7668: "TSSOP-20",
  C2049745: "DFE2012",
  C139797: "SMD_Pushbutton_SKRPACE010",
  C163217: "SOT-563",
  C7519: "SOT-23-6",
  C97521: "SOIC-8_208mil",
  C2757530: "Crystal_3225_4P",
  C165948: "USB-C_16P_TYPE-C-31-M-12",
};

const csv = (value: unknown) => {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

const naturalCompare = (a: string, b: string) =>
  a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });

const componentValue = (source: CircuitElement) => {
  if (source.display_capacitance) return source.display_capacitance;
  if (source.display_resistance) return source.display_resistance;
  if (source.frequency) return `${source.frequency / 1_000_000}MHz`;
  if (source.manufacturer_part_number) return source.manufacturer_part_number;
  if (source.ftype === "simple_pin_header")
    return `1x${source.pin_count} ${source.gender} header`;
  return source.name;
};

type BomRow = {
  designators: string[];
  value: string;
  footprint: string;
  mpn: string;
  primaryLcsc: string;
  alternateLcsc: string[];
};

const grouped = new Map<string, BomRow>();
for (const source of sources) {
  const pcb = pcbComponents.get(source.source_component_id);
  if (!pcb || pcb.do_not_place) continue;
  const supplierNumbers = source.supplier_part_numbers?.jlcpcb ?? [];
  const primaryLcsc = supplierNumbers[0] ?? "";
  const footprint =
    footprintByPrimaryLcsc[primaryLcsc] ??
    `${Number(pcb.width).toFixed(2)}x${Number(pcb.height).toFixed(2)}mm`;
  const row: BomRow = {
    designators: [source.name],
    value: componentValue(source),
    footprint,
    mpn: source.manufacturer_part_number ?? "",
    primaryLcsc,
    alternateLcsc: supplierNumbers.slice(1),
  };
  const key = JSON.stringify([
    row.value,
    row.footprint,
    row.mpn,
    row.primaryLcsc,
    row.alternateLcsc,
  ]);
  const existing = grouped.get(key);
  if (existing) existing.designators.push(source.name);
  else grouped.set(key, row);
}

const bomRows = [...grouped.values()].sort((a, b) =>
  naturalCompare(a.designators[0], b.designators[0]),
);
for (const row of bomRows) row.designators.sort(naturalCompare);

const engineeringBom = [
  [
    "Designators",
    "Quantity",
    "Value",
    "Footprint",
    "Manufacturer Part Number",
    "Primary LCSC Part Number",
    "Alternate LCSC Part Numbers",
  ],
  ...bomRows.map((row) => [
    row.designators.join(" "),
    row.designators.length,
    row.value,
    row.footprint,
    row.mpn,
    row.primaryLcsc,
    row.alternateLcsc.join(" "),
  ]),
]
  .map((row) => row.map(csv).join(","))
  .join("\n");

const jlcBom = [
  ["Comment", "Designator", "Footprint", "LCSC Part #"],
  ...bomRows.map((row) => [
    row.value,
    row.designators.join(","),
    row.footprint,
    row.primaryLcsc,
  ]),
]
  .map((row) => row.map(csv).join(","))
  .join("\n");

const placements = sources
  .map((source) => ({ source, pcb: pcbComponents.get(source.source_component_id) }))
  .filter(
    (placement): placement is { source: CircuitElement; pcb: CircuitElement } =>
      Boolean(placement.pcb && !placement.pcb.do_not_place),
  )
  .sort((a, b) => naturalCompare(a.source.name, b.source.name));

const placementCsv = [
  ["Designator", "Mid X", "Mid Y", "Layer", "Rotation"],
  ...placements.map(({ source, pcb }) => [
    source.name,
    Number(pcb.center.x).toFixed(3),
    Number(pcb.center.y).toFixed(3),
    pcb.layer,
    Number(pcb.rotation ?? 0).toFixed(1),
  ]),
]
  .map((row) => row.map(csv).join(","))
  .join("\n");

await Promise.all([
  writeFile(`${outputDirectory}/bom.csv`, `${engineeringBom}\n`),
  writeFile(`${outputDirectory}/jlcpcb-bom.csv`, `${jlcBom}\n`),
  writeFile(`${outputDirectory}/pick-and-place.csv`, `${placementCsv}\n`),
  writeFile(`${outputDirectory}/jlcpcb-cpl.csv`, `${placementCsv}\n`),
]);

console.log(
  `Wrote ${bomRows.length} grouped BOM rows and ${placements.length} placements`,
);
