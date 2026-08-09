import type { ChipProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["FB"],
  pin2: ["GND"],
  pin3: ["VIN"],
  pin4: ["SW"],
  pin5: ["EN"],
  pin6: ["pin6"]
} as const

const pinAttributes = {
  pin1: { mustBeConnected: true },
  pin2: { requiresGround: true, mustBeConnected: true },
  pin3: { requiresPower: true, mustBeConnected: true },
  pin4: { mustBeConnected: true },
  pin5: { mustBeConnected: true },
  pin6: { requiresGround: true, mustBeConnected: true },
} as NonNullable<ChipProps<typeof pinLabels>["pinAttributes"]>

export const TLV62569DRLR = (props: ChipProps<typeof pinLabels>) => {
  return (
    <chip
      pinLabels={pinLabels}
      pinAttributes={pinAttributes}
      supplierPartNumbers={{
  "jlcpcb": [
    "C163217"
  ]
}}
      manufacturerPartNumber="TLV62569DRLR"
      footprint={<footprint>
        <smtpad portHints={["pin1"]} pcbX="-0.499999mm" pcbY="-0.722503mm" width="0.2800096mm" height="0.5450078mm" shape="rect" />
<smtpad portHints={["pin2"]} pcbX="-0.000127mm" pcbY="-0.722503mm" width="0.2800096mm" height="0.5450078mm" shape="rect" />
<smtpad portHints={["pin3"]} pcbX="0.499999mm" pcbY="-0.722503mm" width="0.2800096mm" height="0.5450078mm" shape="rect" />
<smtpad portHints={["pin4"]} pcbX="0.499999mm" pcbY="0.722503mm" width="0.2800096mm" height="0.5450078mm" shape="rect" />
<smtpad portHints={["pin5"]} pcbX="-0.000127mm" pcbY="0.722503mm" width="0.2800096mm" height="0.5450078mm" shape="rect" />
<smtpad portHints={["pin6"]} pcbX="-0.499999mm" pcbY="0.722503mm" width="0.2800096mm" height="0.5450078mm" shape="rect" />
<silkscreenpath route={[{"x":0.8760714000000007,"y":-0.6760718000000452},{"x":0.8760714000000007,"y":0.6763257999999723}]} />
<silkscreenpath route={[{"x":-0.8763254000000416,"y":-0.6760718000000452},{"x":-0.8763254000000416,"y":0.6763257999999723}]} />
<silkscreenpath route={[{"x":-0.7887970000001587,"y":-1.0161270000002105},{"x":-0.7922070070084146,"y":-1.0420285747578646},{"x":-0.8022046416909916,"y":-1.066165000000069},{"x":-0.8181085817660687,"y":-1.0868914182341314},{"x":-0.8388349999999036,"y":-1.1027953583092085},{"x":-0.8629714252424492,"y":-1.1127929929917855},{"x":-0.8888730000001033,"y":-1.116203000000155},{"x":-0.9147745747577574,"y":-1.1127929929917855},{"x":-0.9389109999999619,"y":-1.1027953583092085},{"x":-0.9596374182340242,"y":-1.0868914182341314},{"x":-0.9755413583091013,"y":-1.066165000000069},{"x":-0.9855389929916782,"y":-1.0420285747578646},{"x":-0.9889490000000478,"y":-1.0161270000002105},{"x":-0.9855389929916782,"y":-0.9902254252425564},{"x":-0.9755413583091013,"y":-0.9660890000000109},{"x":-0.9596374182340242,"y":-0.9453625817661759},{"x":-0.9389109999999619,"y":-0.9294586416910988},{"x":-0.9147745747577574,"y":-0.9194610070085218},{"x":-0.8888730000001033,"y":-0.916051000000266},{"x":-0.8629714252424492,"y":-0.9194610070085218},{"x":-0.8388349999999036,"y":-0.9294586416910988},{"x":-0.8181085817660687,"y":-0.9453625817661759},{"x":-0.8022046416909916,"y":-0.9660890000000109},{"x":-0.7922070070084146,"y":-0.9902254252425564},{"x":-0.7887970000001587,"y":-1.0161270000002105}]} />
<silkscreentext text="{NAME}" pcbX="-0.063627mm" pcbY="1.990727mm" anchorAlignment="center" fontSize="1mm" />
<courtyardoutline outline={[{"x":-1.2407269999999926,"y":1.2407269999999926},{"x":1.1134729999998854,"y":1.2407269999999926},{"x":1.1134729999998854,"y":-1.3674730000000181},{"x":-1.2407269999999926,"y":-1.3674730000000181},{"x":-1.2407269999999926,"y":1.2407269999999926}]} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C163217.obj?uuid=ec2270bac0544bf5afe06b24e8356512",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C163217.step?uuid=ec2270bac0544bf5afe06b24e8356512",
        pcbRotationOffset: 90,
        modelOriginPosition: { x: -0.0001269999999067295, y: -0.00012700000002041634, z: 0 },
      }}
      {...props}
    />
  )
}
