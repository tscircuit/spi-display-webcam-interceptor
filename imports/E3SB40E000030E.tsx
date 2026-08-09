import type { CrystalProps } from "@tscircuit/props";

export const E3SB40E000030E = (
  props: Omit<CrystalProps, "frequency" | "loadCapacitance" | "pinVariant">,
) => (
  <crystal
    frequency="40MHz"
    loadCapacitance="8pF"
    pinVariant="four_pin"
    supplierPartNumbers={{ jlcpcb: ["C2757530"] }}
    manufacturerPartNumber="E3SB40E000030E"
    footprint="crystal"
    cadModel={{
      objUrl:
        "https://modelcdn.tscircuit.com/easyeda_models/assets/C2757530.obj?uuid=02485e56ba8d4732a26526d2983fc729",
      stepUrl:
        "https://modelcdn.tscircuit.com/easyeda_models/assets/C2757530.step?uuid=02485e56ba8d4732a26526d2983fc729",
      pcbRotationOffset: 0,
      modelOriginPosition: { x: 0, y: -0.000012700000070253736, z: 0 },
    }}
    {...props}
  />
);
