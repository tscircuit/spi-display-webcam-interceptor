import type { InductorProps } from "@tscircuit/props"

const footprint = (
  <footprint>
    <smtpad
      portHints={["pin1"]}
      pcbX="-0.966216mm"
      pcbY="0mm"
      width="1.1325352mm"
      height="1.3770102mm"
      shape="rect"
    />
    <smtpad
      portHints={["pin2"]}
      pcbX="0.966216mm"
      pcbY="0mm"
      width="1.1325352mm"
      height="1.3770102mm"
      shape="rect"
    />
    <silkscreenpath
      route={[
        { x: -0.421259, y: 1.0159492 },
        { x: -1.564259, y: 1.0159492 },
        { x: -1.691259, y: 1.0159492 },
        { x: -1.945259, y: 0.7619492 },
        { x: -1.945259, y: -0.6350508 },
        { x: -1.945259, y: -0.7620508 },
        { x: -1.691259, y: -1.0160508 },
        { x: -0.421259, y: -1.0160508 },
      ]}
    />
    <silkscreenpath
      route={[
        { x: 0.340741, y: -1.0160508 },
        { x: 1.483741, y: -1.0160508 },
        { x: 1.610741, y: -1.0160508 },
        { x: 1.864741, y: -0.7620508 },
        { x: 1.864741, y: 0.6349492 },
        { x: 1.864741, y: 0.7619492 },
        { x: 1.610741, y: 1.0159492 },
        { x: 0.340741, y: 1.0159492 },
      ]}
    />
    <silkscreentext
      text="{NAME}"
      pcbX="-0.04191mm"
      pcbY="2.019302mm"
      anchorAlignment="center"
      fontSize="1mm"
    />
    <courtyardoutline
      outline={[
        { x: -2.19691, y: 1.269302 },
        { x: 2.11309, y: 1.269302 },
        { x: 2.11309, y: -1.262698 },
        { x: -2.19691, y: -1.262698 },
        { x: -2.19691, y: 1.269302 },
      ]}
    />
  </footprint>
)

export const DFE201210U_2R2M_P2 = (
  props: Omit<InductorProps, "inductance">,
) => (
  <inductor
    inductance="2.2uH"
    supplierPartNumbers={{ jlcpcb: ["C2049745"] }}
    manufacturerPartNumber="DFE201210U-2R2M=P2"
    footprint={footprint}
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
)
