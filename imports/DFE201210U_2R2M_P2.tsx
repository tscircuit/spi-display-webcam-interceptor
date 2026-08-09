import type { InductorProps } from "@tscircuit/props";

export const DFE201210U_2R2M_P2 = (
  props: Omit<InductorProps, "inductance">,
) => (
  <inductor
    inductance="2.2uH"
    supplierPartNumbers={{ jlcpcb: ["C2049745"] }}
    manufacturerPartNumber="DFE201210U_2R2M_P2"
    footprint="res_p1.9324mm_pw1.1325mm_ph1.377mm"
    cadModel={{
      objUrl:
        "https://modelcdn.tscircuit.com/easyeda_models/assets/C2049745.obj?uuid=c7acac53bcbc44d68fbab8f60a747688",
      stepUrl:
        "https://modelcdn.tscircuit.com/easyeda_models/assets/C2049745.step?uuid=c7acac53bcbc44d68fbab8f60a747688",
      pcbRotationOffset: 0,
      modelOriginPosition: { x: 0, y: -0.000038099999983387534, z: 0 },
    }}
    {...props}
  />
);
