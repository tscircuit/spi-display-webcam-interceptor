import { SmdUsbC } from "@tsci/seveibar.smd-usb-c";
import { AutoroutingPipelineSolver } from "@tscircuit/capacity-autorouter";
import { cloneElement, Fragment } from "react";

import { DFE201210U_2R2M_P2 } from "./imports/DFE201210U_2R2M_P2";
import { E3SB40E000030E } from "./imports/E3SB40E000030E";
import { ESP32_P4NRW32X } from "./imports/ESP32_P4NRW32X";
import { SKRPACE010 } from "./imports/SKRPACE010";
import { SN74LVC244APWR } from "./imports/SN74LVC244APWR";
import { TLV62569DRLR } from "./imports/TLV62569DRLR";
import { USBLC6_2SC6 } from "./imports/USBLC6_2SC6";
import { W25Q128JVSIQ } from "./imports/W25Q128JVSIQ";

type SmdUsbCProps = Parameters<typeof SmdUsbC>[0];

const usbCPinAttributes = {
  1: { requiresGround: true, mustBeConnected: true },
  2: { requiresGround: true, mustBeConnected: true },
  3: {
    providesPower: true,
    requiresPower: true,
    providesVoltage: "5V",
    requiresVoltage: "5V",
    mustBeConnected: true,
  },
  4: {
    providesPower: true,
    requiresPower: true,
    providesVoltage: "5V",
    requiresVoltage: "5V",
    mustBeConnected: true,
  },
  5: { doNotConnect: true },
  6: { mustBeConnected: true },
  7: { mustBeConnected: true },
  8: { mustBeConnected: true },
  9: { mustBeConnected: true },
  10: { mustBeConnected: true },
  11: { doNotConnect: true },
  12: { mustBeConnected: true },
  13: {
    providesPower: true,
    requiresPower: true,
    providesVoltage: "5V",
    requiresVoltage: "5V",
    mustBeConnected: true,
  },
  14: {
    providesPower: true,
    requiresPower: true,
    providesVoltage: "5V",
    requiresVoltage: "5V",
    mustBeConnected: true,
  },
  15: { requiresGround: true, mustBeConnected: true },
  16: { requiresGround: true, mustBeConnected: true },
} as NonNullable<SmdUsbCProps["pinAttributes"]>;

/** Keep the published USB-C footprint while arranging its built-in symbol. */
const SmdUsbCWithFixedSchematic = (props: SmdUsbCProps) =>
  cloneElement(SmdUsbC(props), {
    pinAttributes: props.pinAttributes ?? usbCPinAttributes,
    schPortArrangement: {
      leftSide: { pins: [], direction: "top-to-bottom" },
      rightSide: {
        pins: [
          "GND1",
          "GND2",
          "VBUS1",
          "VBUS2",
          "DP1",
          "DP2",
          "DM1",
          "DM2",
          "CC1",
          "CC2",
          "SBU1",
          "SBU2",
        ],
        direction: "top-to-bottom",
      },
    },
    schPinStyle: {},
  });

const displayPinLabels = {
  pin1: "VCC",
  pin2: "GND",
  pin3: "CS",
  pin4: "RESET",
  pin5: "DC_RS",
  pin6: "SDI_MOSI",
  pin7: "SCK",
  pin8: "LED",
  pin9: "SDO_MISO",
  pin10: "T_CLK",
  pin11: "T_CS",
  pin12: "T_DIN",
  pin13: "T_DO",
  pin14: "T_IRQ",
} as const;

const displayPcbLabels = {
  pin1: "VCC",
  pin2: "GND",
  pin3: "CS",
  pin4: "RST",
  pin5: "DC",
  pin6: "MOSI",
  pin7: "SCK",
  pin8: "LED",
  pin9: "MISO",
  pin10: "TCLK",
  pin11: "TCS",
  pin12: "TDIN",
  pin13: "TDO",
  pin14: "TIRQ",
} as const;

const DisplayHeaderFootprint = () => (
  <footprint>
    {Array.from({ length: 14 }, (_, index) => (
      <Fragment key={`display-header-pad-${index + 1}`}>
        <platedhole
          portHints={[`pin${index + 1}`]}
          pcbX={0}
          pcbY={(6.5 - index) * 2.54}
          outerDiameter="1.7mm"
          holeDiameter="1mm"
          shape="circle"
        />
      </Fragment>
    ))}
    <silkscreenrect
      pcbX={0}
      pcbY={0}
      width="2.54mm"
      height="35.56mm"
      strokeWidth="0.2mm"
    />
    <courtyardoutline
      outline={[
        { x: -1.77, y: -18.28 },
        { x: 1.77, y: -18.28 },
        { x: 1.77, y: 18.28 },
        { x: -1.77, y: 18.28 },
        { x: -1.77, y: -18.28 },
      ]}
    />
  </footprint>
);

const passThroughPins = Array.from({ length: 14 }, (_, index) => index + 1);

// GPIO1..GPIO8 form a compact capture bank. SPI clock/data/chip-select can use
// GP-SPI slave + GDMA; the other five signals are sampled as control inputs.
const captureChannels = [
  { headerPin: 3, bufferIn: 2, bufferOut: 18, mcuPin: 1 }, // GPIO1 LCD_CS
  { headerPin: 4, bufferIn: 4, bufferOut: 16, mcuPin: 2 }, // GPIO2 LCD_RESET
  { headerPin: 5, bufferIn: 6, bufferOut: 14, mcuPin: 3 }, // GPIO3 LCD_DC
  { headerPin: 6, bufferIn: 8, bufferOut: 12, mcuPin: 4 }, // GPIO4 LCD_MOSI
  { headerPin: 7, bufferIn: 11, bufferOut: 9, mcuPin: 5 }, // GPIO5 LCD_SCK
  { headerPin: 8, bufferIn: 13, bufferOut: 7, mcuPin: 6 }, // GPIO6 LCD_LED
  { headerPin: 9, bufferIn: 15, bufferOut: 5, mcuPin: 7 }, // GPIO7 LCD_MISO
  { headerPin: 14, bufferIn: 17, bufferOut: 3, mcuPin: 8 }, // GPIO8 TOUCH_IRQ
] as const;

const captureBreakoutY = [
  11.43, 8.89, 6.35, 3.81, 1.27, -1.27, -3.81, -16.51,
] as const;

const p4ThreeVThreePins = [9, 21, 62, 85, 96, 75, 77, 101, 102] as const;
const p4CorePins = [26, 54, 76, 91] as const;

const p4ThreeVThreeCaps = [
  { pin: 9, name: "C_LP", x: -5.5, y: 7.4 },
  { pin: 21, name: "C_IO0", x: -5.8, y: 0.4 },
  { pin: 62, name: "C_IO4", x: 9.2, y: 2 },
  { pin: 85, name: "C_IO5", x: 4.2, y: 10 },
  { pin: 96, name: "C_IO6", x: 4, y: 12 },
  { pin: 75, name: "C_LDO", x: 13, y: 6.2 },
  { pin: 77, name: "C_DCDCC", x: 12, y: 11.8 },
  { pin: 101, name: "C_ANA", x: -4.5, y: 14.5 },
  { pin: 102, name: "C_BAT_100N", x: -7.5, y: 14.5 },
] as const;

const p4CoreCaps = [
  { pin: 26, name: "C_HP0", x: -5.8, y: -1.5 },
  { pin: 54, name: "C_HP1", x: 9.2, y: -1 },
  { pin: 76, name: "C_HP2", x: 11.5, y: 7.5 },
  { pin: 91, name: "C_HP3", x: 2.2, y: 9.2 },
] as const;

// Local MCU coordinates for a 0.45 mm outward dogbone from each power pad.
const p4PowerDogboneOffsets: Record<number, { x: number; y: number }> = {
  9: { x: -6.2, y: 1.575054 },
  21: { x: -5.45, y: -2.62509 },
  26: { x: -5.45, y: -4.374896 },
  54: { x: 5.45, y: -4.024884 },
  62: { x: 5.45, y: -1.225042 },
  // Stagger the three adjacent right-side rails onto a 0.75 mm grid so
  // ordinary 0.60/0.30 mm through vias retain 0.10 mm copper clearance.
  75: { x: 6.2, y: 3.325114 },
  76: { x: 6.9, y: 3.325114 },
  77: { x: 6.9, y: 4.025114 },
  85: { x: 2.275078, y: 5.45 },
  91: { x: 0.175006, y: 5.45 },
  96: { x: -1.575054, y: 5.45 },
  // Fan these adjacent top-edge supply pins apart and keep the crystal
  // corridor clear.
  101: { x: -4.2, y: 5.45 },
  102: { x: -5.0, y: 5.45 },
};

type PlaneNet = "GND" | "V3V3" | "VBUS" | "V1V2";

type PlaneDropProps = {
  from: string;
  net: PlaneNet;
  layer: "inner1" | "inner2" | "bottom";
  padOffset: { x: number; y: number };
  width?: string;
};

const PlaneDrop = ({ from, net, layer, padOffset, width }: PlaneDropProps) => (
  <trace
    from={from}
    to={`net.${net}`}
    width={width}
    pcbPathRelativeTo={from}
    pcbPath={[{ ...padOffset, via: true, toLayer: "bottom" }]}
  />
);

const Drop0402 = ({
  from,
  pin,
  net,
  layer,
  width,
}: {
  from: string;
  pin: 1 | 2;
  net: PlaneNet;
  layer: PlaneDropProps["layer"];
  width?: string;
}) => (
  <PlaneDrop
    from={from}
    net={net}
    layer={layer}
    width={width}
    padOffset={{ x: pin === 1 ? -1.05 : 1.05, y: 0 }}
  />
);

const Drop0603 = ({
  from,
  pin,
  net,
  layer,
  width,
}: {
  from: string;
  pin: 1 | 2;
  net: PlaneNet;
  layer: PlaneDropProps["layer"];
  width?: string;
}) => (
  <PlaneDrop
    from={from}
    net={net}
    layer={layer}
    width={width}
    padOffset={{ x: pin === 1 ? -1.5 : 1.5, y: 0 }}
  />
);

const PourContact = ({
  from,
  net,
  width,
}: {
  from: string;
  net: "VBUS";
  width?: string;
}) => (
  <trace
    from={from}
    to={`net.${net}`}
    width={width}
    pcbPathRelativeTo={from}
    pcbPath={[]}
  />
);

const McuPlaneDecoupler = ({
  name,
  targetPin,
  x,
  y,
  powerNet,
  powerLayer,
  schX,
  schY,
}: {
  name: string;
  targetPin: number;
  x: number;
  y: number;
  powerNet: "V3V3" | "V1V2";
  powerLayer: "inner2" | "bottom";
  schX: number;
  schY: number;
}) => (
  <>
    <capacitor
      name={name}
      capacitance="100nF"
      maxDecouplingTraceLength={10}
      footprint="0402"
      pcbX={x}
      pcbY={y}
      schSheetName="POWER"
      schSectionName="MCU_POWER"
      schX={schX}
      schY={schY}
      schOrientation="vertical"
    />
    <PlaneDrop
      from={`.U_MCU > .pin${targetPin}`}
      net={powerNet}
      layer={powerLayer}
      width="0.25mm"
      padOffset={p4PowerDogboneOffsets[targetPin]}
    />
    <Drop0402
      from={`.${name} > .pin1`}
      pin={1}
      net={powerNet}
      layer={powerLayer}
    />
    <Drop0402 from={`.${name} > .pin2`} pin={2} net="GND" layer="inner1" />
  </>
);

// Plane-connected nets are completed by the explicit via drops above. The
// capacity router does not model copper pours, so do not add duplicate trees.
const completedPlaneAutorouter = {
  algorithmFn: async () => {
    const listeners: Record<string, Array<(event: any) => void>> = {};
    return {
      on(event: string, listener: (event: any) => void) {
        (listeners[event] ??= []).push(listener);
        return this;
      },
      start() {
        for (const listener of listeners.complete ?? [])
          listener({ traces: [] });
      },
      stop() {},
    };
  },
};

const flashEscapeTraceIds = new Set([
  "source_trace_101",
]);

const normalizeToPlatedThroughVias = (traces: any[]) =>
  traces.map((trace) => {
    const connectionName = trace.connection_name ?? trace.connectionName;
    const route = [...trace.route];

    // The ESP32-P4's 0.35 mm-pitch QSPI pads need a short perpendicular
    // neck before the route turns. Capacity's diagonal final segments can
    // otherwise graze the neighboring pad even with a 0.10 mm trace.
    if (flashEscapeTraceIds.has(connectionName) && route.length >= 2) {
      const end = route[route.length - 1];
      if (end?.route_type === "wire") {
        let dogboneStartIndex = route.length - 2;
        while (
          dogboneStartIndex > 0 &&
          route[dogboneStartIndex].y > end.y - 0.45
        ) {
          dogboneStartIndex -= 1;
        }
        const dogboneStart = route[dogboneStartIndex];
        route.splice(
          dogboneStartIndex + 1,
          route.length,
          {
            ...end,
            x: dogboneStart.x,
            y: end.y - 0.3,
            end_pcb_port_id: undefined,
          },
          {
            ...end,
            x: end.x,
            y: end.y - 0.3,
            end_pcb_port_id: undefined,
          },
          end,
        );
      }
    }
    const nearMcuShiftX =
      connectionName === "source_trace_33"
        ? -0.5
        : connectionName === "source_trace_34"
          ? -0.6
          : 0;
    const nearMcuVia = route.find(
      (point: any) =>
        nearMcuShiftX !== 0 &&
        point.route_type === "via" &&
        point.x > -3 &&
        point.y > 3,
    );

    return {
      ...trace,
      route: route.map((point: any) => {
        const isNearMcuViaPoint =
          nearMcuVia &&
          Math.abs(point.x - nearMcuVia.x) < 0.001 &&
          Math.abs(point.y - nearMcuVia.y) < 0.001;
        const adjustedPoint = isNearMcuViaPoint
          ? { ...point, x: point.x + nearMcuShiftX }
          : point;
        const neckedPoint =
          connectionName === "source_trace_111" &&
          adjustedPoint.route_type === "wire"
            ? { ...adjustedPoint, width: 0.1 }
            : adjustedPoint;

        return neckedPoint.route_type === "via"
          ? {
              ...neckedPoint,
              from_layer: "top",
              to_layer: "bottom",
              via_diameter: 0.6,
              via_hole_diameter: 0.3,
            }
          : neckedPoint;
      }),
    };
  });

const platedThroughAutorouter = {
  groupMode: "subcircuit" as const,
  allowViaInPad: false,
  algorithmFn: async (simpleRouteJson: any) => {
    const solver = new AutoroutingPipelineSolver(
      {
        ...simpleRouteJson,
        allowViaInPad: false,
        minViaHoleDiameter: 0.3,
        minViaPadDiameter: 0.6,
        min_via_hole_diameter: 0.3,
        min_via_pad_diameter: 0.6,
      },
      { effort: 10 },
    );
    const listeners: Record<string, Array<(event: any) => void>> = {};
    let stopped = false;

    return {
      on(event: string, listener: (event: any) => void) {
        (listeners[event] ??= []).push(listener);
        return this;
      },
      async start() {
        try {
          let steps = 0;
          while (!solver.solved && !solver.failed && !stopped) {
            solver.step();
            steps += 1;
            if (steps % 20_000 === 0) {
              for (const listener of listeners.progress ?? []) {
                listener({ steps, progress: 0 });
              }
              await new Promise<void>((resolve) => setTimeout(resolve, 0));
            }
          }
          if (stopped) return;
          if (solver.failed) throw solver.error ?? new Error("Autorouting failed");
          const traces = normalizeToPlatedThroughVias(
            solver.getOutputSimpleRouteJson().traces ?? [],
          );
          for (const listener of listeners.complete ?? []) listener({ traces });
        } catch (error) {
          for (const listener of listeners.error ?? []) listener({ error });
        }
      },
      stop() {
        stopped = true;
      },
    };
  },
};

export default () => (
  <board
    width="68mm"
    height="54mm"
    layers={4}
    autorouter={platedThroughAutorouter}
    isViaInPadAllowed
    pcbStyle={{ viaPadDiameter: "0.6mm", viaHoleDiameter: "0.3mm" }}
  >
    <net name="GND" isGroundNet routingPhaseIndex={4} />
    <net name="V3V3" isPowerNet routingPhaseIndex={5} />
    <net name="VBUS" isPowerNet routingPhaseIndex={6} />
    <net name="V1V2" isPowerNet routingPhaseIndex={7} />
    <autoroutingphase phaseIndex={4} autorouter={completedPlaneAutorouter} />
    <autoroutingphase phaseIndex={5} autorouter={completedPlaneAutorouter} />
    <autoroutingphase phaseIndex={6} autorouter={completedPlaneAutorouter} />
    <autoroutingphase phaseIndex={7} autorouter={completedPlaneAutorouter} />

    <schematicsheet
      name="SIGNALS"
      displayName="1. Display Capture, Memory & USB"
      sheetIndex={0}
    >
      <schematicsection
        name="CAPTURE_MEMORY"
        displayName="Display Capture, Flash & Clock"
        sectionTitleFontSize={0}
      />
      <schematicsection
        name="USB"
        displayName="USB-C, Boot & Reset"
        sectionTitleFontSize={0}
      />
      <schematictext
        text="DISPLAY CAPTURE, FLASH & CLOCK"
        schX={-13.2}
        schY={8.5}
        fontSize={0.26}
        anchor="left"
        color="#555555"
      />
      <schematictext
        text="USB-C, BOOT & RESET"
        schX={2.2}
        schY={8.5}
        fontSize={0.26}
        anchor="left"
        color="#555555"
      />
      <schematicline
        x1={1.2}
        y1={-8.4}
        x2={1.2}
        y2={8.4}
        strokeWidth={0.03}
        color="#999999"
        isDashed
      />
    </schematicsheet>
    <schematicsheet
      name="POWER"
      displayName="2. Power, Regulators & Decoupling"
      sheetIndex={1}
    >
      <schematicsection name="MCU_POWER" displayName="ESP32-P4 Power" />
      <schematicsection name="CORE_POWER" displayName="1.2 V Core Buck" />
      <schematicsection
        name="THREE_VOLT_POWER"
        displayName="USB 5 V to 3.3 V Buck"
      />
    </schematicsheet>

    <pinheader
      name="J_DISPLAY"
      pinCount={14}
      pitch="2.54mm"
      gender="female"
      footprint={<DisplayHeaderFootprint />}
      pcbX={-31}
      pcbY={0}
      schSheetName="SIGNALS"
      schSectionName="CAPTURE_MEMORY"
      schX={-13}
      schY={5}
      schWidth={0.96}
      schFacingDirection="right"
      pinLabels={displayPinLabels}
      pcbPinLabels={displayPcbLabels}
      showSilkscreenPinLabels
    />
    <pinheader
      name="J_HOST"
      pinCount={14}
      pitch="2.54mm"
      gender="male"
      footprint={<DisplayHeaderFootprint />}
      pcbX={-26}
      pcbY={0}
      schSheetName="SIGNALS"
      schSectionName="CAPTURE_MEMORY"
      schX={-10.5}
      schY={5}
      schWidth={0.96}
      schFacingDirection="left"
      pinLabels={displayPinLabels}
      pcbPinLabels={displayPcbLabels}
      showSilkscreenPinLabels
    />
    {passThroughPins.map((pin) => (
      <trace
        key={`pass-${pin}`}
        from={`.J_HOST > .pin${pin}`}
        to={`.J_DISPLAY > .pin${pin}`}
        width={pin <= 2 ? "0.6mm" : "0.25mm"}
        pcbStraightLine
      />
    ))}
    <PlaneDrop
      from=".J_HOST > .pin2"
      net="GND"
      layer="inner1"
      width="0.6mm"
      padOffset={{ x: 0, y: 13.97 }}
    />

    <breakout
      name="MCU_BREAKOUT"
      width="48mm"
      height="44mm"
      padding="3mm"
      autorouter={platedThroughAutorouter}
      autorouterEffortLevel="10x"
    >
      <ESP32_P4NRW32X name="U_MCU" pcbX={2} pcbY={3} schHeight={10.6} />

      <schematicbox
        name="U_MCU_IO"
        chipRef=".U_MCU"
        schSheetName="SIGNALS"
        schSectionName="CAPTURE_MEMORY"
        schX={-0.5}
        schY={4}
        width={1.575}
        height={1.8}
        title="U_MCU Capture"
        pinLabels={{
          pin1: "GPIO1",
          pin2: "GPIO2",
          pin3: "GPIO3",
          pin4: "GPIO4",
          pin5: "GPIO5",
          pin6: "GPIO6",
          pin7: "GPIO7",
          pin8: "GPIO8",
        }}
        schPinArrangement={{
          leftSide: [
            "pin1",
            "pin2",
            "pin3",
            "pin4",
            "pin5",
            "pin6",
            "pin7",
            "pin8",
          ],
          rightSide: [],
        }}
      />
      <schematicbox
        name="U_MCU_PWR"
        chipRef=".U_MCU"
        schSheetName="POWER"
        schSectionName="MCU_POWER"
        schX={-11}
        schY={0.5}
        width={3.195}
        height={2.2}
        title="U_MCU Power"
        pinLabels={{
          pin1: "VDD_LP",
          pin2: "VDD_IO_0",
          pin3: "VDD_IO_4",
          pin4: "VDD_IO_5",
          pin5: "VDD_IO_6",
          pin6: "VDD_LDO",
          pin7: "VDD_DCDCC",
          pin8: "VDD_ANA",
          pin9: "VDD_BAT",
          pin10: "VDD_HP_0",
          pin11: "VDD_HP_1",
          pin12: "VDD_HP_2",
          pin13: "VDD_HP_3",
          pin14: "VDD_PSRAM_0",
          pin15: "VDD_PSRAM_1",
          pin16: "VDDO_PSRAM",
          pin17: "VDDO_3",
          pin18: "VDDO_4",
          pin19: "VDD_USBPHY",
          pin20: "EN_DCDC",
          pin21: "FB_DCDC",
          pin22: "GND",
        }}
        schPinArrangement={{
          leftSide: [
            "pin1",
            "pin2",
            "pin3",
            "pin4",
            "pin5",
            "pin6",
            "pin7",
            "pin8",
            "pin9",
            "pin19",
          ],
          rightSide: [
            "pin10",
            "pin11",
            "pin12",
            "pin13",
            "pin14",
            "pin15",
            "pin16",
            "pin17",
            "pin18",
            "pin20",
            "pin21",
            "pin22",
          ],
        }}
      />
      <schematicbox
        name="U_MCU_MEM"
        chipRef=".U_MCU"
        schSheetName="SIGNALS"
        schSectionName="CAPTURE_MEMORY"
        schX={-10.5}
        schY={-2}
        width={2.145}
        height={1.8}
        title="U_MCU Memory/Clock"
        pinLabels={{
          pin1: "FLASH_CS",
          pin2: "FLASH_Q",
          pin3: "FLASH_WP",
          pin4: "VDD_FLASHIO",
          pin5: "FLASH_HOLD",
          pin6: "FLASH_CK",
          pin7: "FLASH_D",
          pin8: "VDDO_FLASH",
        }}
        schPinArrangement={{
          leftSide: [
            "pin1",
            "pin2",
            "pin3",
            "pin4",
            "pin5",
            "pin6",
            "pin7",
            "pin8",
          ],
          rightSide: [],
        }}
      />
      <schematicbox
        name="U_MCU_XTAL"
        chipRef=".U_MCU"
        schSheetName="SIGNALS"
        schSectionName="CAPTURE_MEMORY"
        schX={-10.5}
        schY={-7}
        width={1.5}
        height={0.4}
        title="U_MCU XTAL"
        pinLabels={{ pin1: "XTAL_N", pin2: "XTAL_P" }}
        schPinArrangement={{ leftSide: ["pin1"], rightSide: ["pin2"] }}
      />
      <schematicbox
        name="U_MCU_USB_BOOT"
        chipRef=".U_MCU"
        schSheetName="SIGNALS"
        schSectionName="USB"
        schX={10.1}
        schY={-3}
        width={2.4}
        height={0.6}
        title="U_MCU USB/Boot"
        pinLabels={{
          pin1: "USB_DM",
          pin2: "USB_DP",
          pin3: "CHIP_PU",
          pin4: "GPIO35",
        }}
        schPinArrangement={{
          leftSide: ["pin1", "pin2"],
          rightSide: ["pin3", "pin4"],
        }}
      />

      <SN74LVC244APWR
        name="U_BUF"
        pcbX={-15.5}
        pcbY={-14}
        pcbRotation={90}
        schSheetName="SIGNALS"
        schSectionName="CAPTURE_MEMORY"
        schX={-7}
        schY={4}
      />
      <PlaneDrop
        from=".U_BUF > .pin1"
        net="GND"
        layer="inner1"
        padOffset={{ x: -2.925064, y: -2.870962 }}
      />
      <PlaneDrop
        from=".U_BUF > .pin10"
        net="GND"
        layer="inner1"
        padOffset={{ x: 2.925064, y: -2.870962 }}
      />
      <PlaneDrop
        from=".U_BUF > .pin19"
        net="GND"
        layer="inner1"
        padOffset={{ x: -2.275078, y: 2.870962 }}
      />
      <PlaneDrop
        from=".U_BUF > .pin20"
        net="V3V3"
        layer="inner2"
        padOffset={{ x: -2.925064, y: 2.870962 }}
      />
      <capacitor
        name="C_BUF"
        capacitance="100nF"
        maxDecouplingTraceLength={8}
        footprint="0402"
        pcbX={-20.5}
        pcbY={-16.8}
        schSheetName="SIGNALS"
        schSectionName="CAPTURE_MEMORY"
        schX={-3.8}
        schY={4}
        schOrientation="vertical"
      />
      <trace from=".C_BUF > .pin1" to=".U_BUF > .pin20" />
      <Drop0402 from=".C_BUF > .pin2" pin={2} net="GND" layer="inner1" />

      {captureChannels.map((channel) => (
        <trace
          key={`tap-in-${channel.headerPin}`}
          from={`.J_HOST > .pin${channel.headerPin}`}
          to={`.U_BUF > .pin${channel.bufferIn}`}
          width="0.18mm"
          maxViaCount={0}
        />
      ))}
      {captureChannels.map((channel) => (
        <trace
          key={`tap-out-${channel.headerPin}`}
          from={`.U_BUF > .pin${channel.bufferOut}`}
          to={`.U_MCU > .pin${channel.mcuPin}`}
          width="0.1mm"
        />
      ))}
      {captureChannels.map((channel, index) => (
        <Fragment key={`capture-breakout-${channel.headerPin}`}>
          <breakoutpoint
            connection={`.U_BUF > .pin${channel.bufferIn}`}
            pcbX={-24.2}
            pcbY={captureBreakoutY[index]}
          />
        </Fragment>
      ))}

      {p4ThreeVThreeCaps.map((cap, index) => (
        <McuPlaneDecoupler
          key={cap.name}
          name={cap.name}
          targetPin={cap.pin}
          x={cap.x}
          y={cap.y}
          powerNet="V3V3"
          powerLayer="inner2"
          schX={-12 + index * 2.3}
          schY={8}
        />
      ))}
      {p4CoreCaps.map((cap, index) => (
        <McuPlaneDecoupler
          key={cap.name}
          name={cap.name}
          targetPin={cap.pin}
          x={cap.x}
          y={cap.y}
          powerNet="V1V2"
          powerLayer="bottom"
          schX={-12 + index * 2.8}
          schY={5.5}
        />
      ))}
      <PlaneDrop
        from=".U_MCU > .pin105"
        net="GND"
        layer="inner1"
        padOffset={{ x: 0, y: 0 }}
        width="0.8mm"
      />

      <capacitor
        name="C_LDO_BULK"
        capacitance="10uF"
        maxDecouplingTraceLength={10}
        footprint="0603"
        pcbX={14}
        pcbY={10.5}
        schSheetName="POWER"
        schSectionName="MCU_POWER"
        schX={9}
        schY={8}
        schOrientation="vertical"
      />
      <Drop0603
        from=".C_LDO_BULK > .pin1"
        pin={1}
        net="V3V3"
        layer="inner2"
        width="0.4mm"
      />
      <Drop0603 from=".C_LDO_BULK > .pin2" pin={2} net="GND" layer="inner1" />
      <capacitor
        name="C_BAT_BULK"
        capacitance="10uF"
        maxDecouplingTraceLength={10}
        footprint="0603"
        pcbX={-5.8}
        pcbY={11.8}
        schSheetName="POWER"
        schSectionName="MCU_POWER"
        schX={11.5}
        schY={8}
        schOrientation="vertical"
      />
      <Drop0603 from=".C_BAT_BULK > .pin1" pin={1} net="V3V3" layer="inner2" />
      <Drop0603 from=".C_BAT_BULK > .pin2" pin={2} net="GND" layer="inner1" />

      <TLV62569DRLR
        name="U_CORE_BUCK"
        pcbX={17}
        pcbY={8}
        schSheetName="POWER"
        schSectionName="CORE_POWER"
        schX={-11}
        schY={-4.5}
      />
      <DFE201210U_2R2M_P2
        name="L_CORE"
        pcbX={21}
        pcbY={8}
        schSheetName="POWER"
        schSectionName="CORE_POWER"
        schX={-7}
        schY={-4.5}
      />
      <capacitor
        name="C_CORE_IN"
        capacitance="4.7uF"
        maxDecouplingTraceLength={10}
        footprint="0603"
        pcbX={17.5}
        pcbY={4.5}
        pcbRotation={-90}
        schSheetName="POWER"
        schSectionName="CORE_POWER"
        schX={-11}
        schY={-7.5}
        schOrientation="vertical"
      />
      <capacitor
        name="C_CORE_OUT"
        capacitance="22uF"
        maxDecouplingTraceLength={10}
        footprint="0805"
        pcbX={25}
        pcbY={8}
        schSheetName="POWER"
        schSectionName="CORE_POWER"
        schX={-3}
        schY={-4.5}
        schOrientation="vertical"
      />
      <resistor
        name="R_CORE_TOP"
        resistance="499kohm"
        footprint="0402"
        pcbX={21}
        pcbY={11}
        schSheetName="POWER"
        schSectionName="CORE_POWER"
        schX={-7}
        schY={-7.5}
      />
      <resistor
        name="R_CORE_BOT"
        resistance="499kohm"
        footprint="0402"
        pcbX={23}
        pcbY={11}
        schSheetName="POWER"
        schSectionName="CORE_POWER"
        schX={-3}
        schY={-7.5}
      />
      <capacitor
        name="C_CORE_FB"
        capacitance="22pF"
        maxDecouplingTraceLength={10}
        footprint="0402"
        pcbX={21}
        pcbY={12.5}
        schSheetName="POWER"
        schSectionName="CORE_POWER"
        schX={-5}
        schY={-8.8}
        schOrientation="vertical"
      />
      <trace
        from=".U_CORE_BUCK > .pin3"
        to=".C_CORE_IN > .pin1"
        width="0.18mm"
        pcbPathRelativeTo=".U_CORE_BUCK > .pin3"
        pcbPath={[{ x: 0.5, y: -1.2 }]}
      />
      <PlaneDrop
        from=".C_CORE_IN > .pin1"
        net="V3V3"
        layer="inner2"
        padOffset={{ x: -0.825, y: -1.2 }}
        width="0.4mm"
      />
      <PlaneDrop
        from=".U_CORE_BUCK > .pin2"
        net="GND"
        layer="inner1"
        padOffset={{ x: 0, y: -1.5 }}
        width="0.15mm"
      />
      <PlaneDrop
        from=".U_CORE_BUCK > .pin6"
        net="GND"
        layer="inner1"
        padOffset={{ x: -0.5, y: 1.5 }}
        width="0.15mm"
      />
      <PlaneDrop
        from=".C_CORE_IN > .pin2"
        net="GND"
        layer="inner1"
        padOffset={{ x: 0.825, y: -1.2 }}
      />
      <trace
        from=".U_MCU > .pin79"
        to=".U_CORE_BUCK > .pin5"
        width="0.15mm"
      />
      <trace
        from=".U_MCU > .pin78"
        to=".U_CORE_BUCK > .pin1"
        width="0.15mm"
      />
      <trace
        from=".U_CORE_BUCK > .pin4"
        to=".L_CORE > .pin1"
        width="0.18mm"
      />
      <trace from=".L_CORE > .pin2" to=".C_CORE_OUT > .pin1" width="0.5mm" />
      <trace from=".L_CORE > .pin2" to=".R_CORE_TOP > .pin1" />
      <trace from=".R_CORE_TOP > .pin2" to=".R_CORE_BOT > .pin1" />
      <trace from=".R_CORE_TOP > .pin2" to=".U_MCU > .pin78" />
      <trace from=".C_CORE_FB > .pin1" to=".R_CORE_TOP > .pin1" />
      <trace from=".C_CORE_FB > .pin2" to=".R_CORE_TOP > .pin2" />
      <Drop0402 from=".R_CORE_BOT > .pin2" pin={2} net="GND" layer="inner1" />
      <PlaneDrop
        from=".C_CORE_OUT > .pin1"
        net="V1V2"
        layer="bottom"
        padOffset={{ x: -1.8, y: 0 }}
        width="0.5mm"
      />
      <PlaneDrop
        from=".C_CORE_OUT > .pin2"
        net="GND"
        layer="inner1"
        padOffset={{ x: 1.8, y: 0 }}
        width="0.5mm"
      />

      <W25Q128JVSIQ
        name="U_FLASH"
        pcbX={-8}
        pcbY={-7}
        schSheetName="SIGNALS"
        schSectionName="CAPTURE_MEMORY"
        schX={-5.5}
        schY={-2}
      />
      <trace from=".U_FLASH > .pin1" to=".U_MCU > .pin27" width="0.1mm" />
      <trace from=".U_FLASH > .pin2" to=".U_MCU > .pin28" width="0.1mm" />
      <trace from=".U_FLASH > .pin3" to=".U_MCU > .pin29" width="0.1mm" />
      <trace from=".U_FLASH > .pin5" to=".U_MCU > .pin33" width="0.1mm" />
      <trace
        from=".U_FLASH > .pin6"
        to=".U_MCU > .pin32"
        width="0.1mm"
      />
      <trace from=".U_FLASH > .pin7" to=".U_MCU > .pin31" width="0.1mm" />
      <trace from=".U_MCU > .pin71" to=".U_MCU > .pin30" width="0.3mm" />
      <trace from=".U_MCU > .pin30" to=".U_FLASH > .pin8" width="0.3mm" />
      <resistor
        name="R_FLASH_CS"
        resistance="10kohm"
        footprint="0402"
        pcbX={-8}
        pcbY={-13.5}
        schSheetName="SIGNALS"
        schSectionName="CAPTURE_MEMORY"
        schX={-5.5}
        schY={0.5}
      />
      <trace from=".R_FLASH_CS > .pin1" to=".U_FLASH > .pin8" />
      <trace from=".R_FLASH_CS > .pin2" to=".U_FLASH > .pin1" />
      <capacitor
        name="C_FLASH"
        capacitance="100nF"
        maxDecouplingTraceLength={10}
        footprint="0402"
        pcbX={-12}
        pcbY={-3.5}
        schSheetName="SIGNALS"
        schSectionName="CAPTURE_MEMORY"
        schX={-1.7}
        schY={-4}
        schOrientation="vertical"
      />
      <trace from=".C_FLASH > .pin1" to=".U_FLASH > .pin8" />
      <PlaneDrop
        from=".U_FLASH > .pin4"
        net="GND"
        layer="inner1"
        padOffset={{ x: 2.405, y: -3.5301 }}
      />
      <Drop0402 from=".C_FLASH > .pin2" pin={2} net="GND" layer="inner1" />
      <capacitor
        name="C_FLASHIO_1U"
        capacitance="1uF"
        maxDecouplingTraceLength={10}
        footprint="0402"
        pcbX={-1.5}
        pcbY={-4.2}
        schSheetName="SIGNALS"
        schSectionName="CAPTURE_MEMORY"
        schX={0.3}
        schY={-4}
        schOrientation="vertical"
      />
      <trace
        from=".C_FLASHIO_1U > .pin1"
        to=".U_MCU > .pin30"
        width="0.1mm"
      />
      <Drop0402 from=".C_FLASHIO_1U > .pin2" pin={2} net="GND" layer="inner1" />

      <E3SB40E000030E
        name="Y1"
        pcbX={-2}
        pcbY={12.3}
        schSheetName="SIGNALS"
        schSectionName="CAPTURE_MEMORY"
        schX={-6.5}
        schY={-6.5}
      />
      <capacitor
        name="C_XTAL_P"
        capacitance="12pF"
        maxDecouplingTraceLength={10}
        footprint="0402"
        pcbX={-5.2}
        pcbY={16}
        schSheetName="SIGNALS"
        schSectionName="CAPTURE_MEMORY"
        schX={-3.5}
        schY={-8.2}
        schOrientation="vertical"
      />
      <capacitor
        name="C_XTAL_N"
        capacitance="12pF"
        maxDecouplingTraceLength={10}
        footprint="0402"
        pcbX={1.2}
        pcbY={16}
        schSheetName="SIGNALS"
        schSectionName="CAPTURE_MEMORY"
        schX={-0.5}
        schY={-8.2}
        schOrientation="vertical"
      />
      <trace
        from=".U_MCU > .pin100"
        to=".Y1 > .pin1"
        pcbPathRelativeTo=".U_MCU > .pin100"
        pcbPath={[
          { x: -2.98, y: 6.1 },
          { x: -2.98, y: 7.5 },
          { x: -5.1, y: 7.5 },
          { x: -5.1, y: 8.45 },
        ]}
      />
      <trace
        from=".U_MCU > .pin99"
        to=".Y1 > .pin3"
        pcbPathRelativeTo=".U_MCU > .pin99"
        pcbPath={[
          { x: -2.63, y: 6.1 },
          { x: -1.7, y: 7.5 },
          { x: -1.7, y: 10.15 },
        ]}
      />
      <trace from=".C_XTAL_P > .pin1" to=".Y1 > .pin1" />
      <trace from=".C_XTAL_N > .pin1" to=".Y1 > .pin3" />
      <PlaneDrop
        from=".Y1 > .pin2"
        net="GND"
        layer="inner1"
        padOffset={{ x: 2.5, y: -1.8 }}
      />
      <PlaneDrop
        from=".Y1 > .pin4"
        net="GND"
        layer="inner1"
        padOffset={{ x: -2.2, y: 1.7 }}
      />
      <Drop0402 from=".C_XTAL_P > .pin2" pin={2} net="GND" layer="inner1" />
      <Drop0402 from=".C_XTAL_N > .pin2" pin={2} net="GND" layer="inner1" />

      <trace from=".U_MCU > .pin72" to=".U_MCU > .pin59" />
      <trace from=".U_MCU > .pin72" to=".U_MCU > .pin67" />
      {[
        { name: "C_PSRAM0", x: 11, y: 0.5, value: "100nF", target: 59 },
        { name: "C_PSRAM1", x: 11, y: 3.8, value: "100nF", target: 67 },
        { name: "C_PSRAM_BULK", x: 11, y: 5.5, value: "1uF", target: 72 },
      ].map((cap, index) => (
        <Fragment key={cap.name}>
          <capacitor
            name={cap.name}
            capacitance={cap.value}
            maxDecouplingTraceLength={10}
            footprint="0402"
            pcbX={cap.x}
            pcbY={cap.y}
            schSheetName="POWER"
            schSectionName="MCU_POWER"
            schX={index * 2.8}
            schY={5.5}
            schOrientation="vertical"
          />
          <trace
            from={`.${cap.name} > .pin1`}
            to={`.U_MCU > .pin${cap.target}`}
          />
          <Drop0402
            from={`.${cap.name} > .pin2`}
            pin={2}
            net="GND"
            layer="inner1"
          />
        </Fragment>
      ))}
      <capacitor
        name="C_VOUT3"
        capacitance="1uF"
        maxDecouplingTraceLength={10}
        footprint="0402"
        pcbX={9}
        pcbY={4.5}
        schSheetName="POWER"
        schSectionName="MCU_POWER"
        schX={8.4}
        schY={5.5}
        schOrientation="vertical"
      />
      <capacitor
        name="C_VOUT4"
        capacitance="1uF"
        maxDecouplingTraceLength={10}
        footprint="0402"
        pcbX={8.8}
        pcbY={5.5}
        schSheetName="POWER"
        schSectionName="MCU_POWER"
        schX={11.2}
        schY={5.5}
        schOrientation="vertical"
      />
      <trace from=".C_VOUT3 > .pin1" to=".U_MCU > .pin73" />
      <trace from=".C_VOUT4 > .pin1" to=".U_MCU > .pin74" />
      <Drop0402 from=".C_VOUT3 > .pin2" pin={2} net="GND" layer="inner1" />
      <Drop0402 from=".C_VOUT4 > .pin2" pin={2} net="GND" layer="inner1" />

      <resistor
        name="R_USBPHY"
        resistance="0ohm"
        footprint="0402"
        pcbX={8}
        pcbY={-4}
        schSheetName="POWER"
        schSectionName="MCU_POWER"
        schX={3.51}
        schY={2.5}
      />
      <Drop0402 from=".R_USBPHY > .pin1" pin={1} net="V3V3" layer="inner2" />
      <trace from=".R_USBPHY > .pin2" to=".U_MCU > .pin51" />
      {[
        { name: "C_USBPHY_10N", value: "10nF", x: 10, y: -5.5 },
        { name: "C_USBPHY_100N", value: "100nF", x: 12, y: -5.5 },
        { name: "C_USBPHY_4U7", value: "4.7uF", x: 14.5, y: -5.5 },
      ].map((cap, index) => (
        <Fragment key={cap.name}>
          <capacitor
            name={cap.name}
            capacitance={cap.value}
            maxDecouplingTraceLength={10}
            footprint={index === 2 ? "0603" : "0402"}
            pcbX={cap.x}
            pcbY={cap.y}
            schSheetName="POWER"
            schSectionName="MCU_POWER"
            schX={index === 0 ? 6.5 : 6.4 + index * 2.8}
            schY={2.5}
            schOrientation="vertical"
          />
          <trace from={`.${cap.name} > .pin1`} to=".U_MCU > .pin51" />
          {index === 2 ? (
            <Drop0603
              from={`.${cap.name} > .pin2`}
              pin={2}
              net="GND"
              layer="inner1"
            />
          ) : index === 0 ? (
            <PlaneDrop
              from={`.${cap.name} > .pin2`}
              net="GND"
              layer="inner1"
              padOffset={{ x: 1.05, y: -0.8 }}
            />
          ) : (
            <Drop0402
              from={`.${cap.name} > .pin2`}
              pin={2}
              net="GND"
              layer="inner1"
            />
          )}
        </Fragment>
      ))}

      <USBLC6_2SC6
        name="U_ESD"
        pcbX={2}
        pcbY={-17.5}
        schSheetName="SIGNALS"
        schSectionName="USB"
        schX={5.6}
        schY={-3}
      />
      <trace from=".J_USB > .pin8" to=".U_ESD > .pin1" width="0.25mm" />
      <trace from=".J_USB > .pin10" to=".U_ESD > .pin1" width="0.25mm" />
      <trace from=".J_USB > .pin7" to=".U_ESD > .pin3" width="0.25mm" />
      <trace from=".J_USB > .pin9" to=".U_ESD > .pin3" width="0.25mm" />
      <resistor
        name="R_USB_DP"
        resistance="27ohm"
        footprint="0402"
        pcbX={6}
        pcbY={-5}
        schSheetName="SIGNALS"
        schSectionName="USB"
        schX={8.1}
        schY={-2}
      />
      <resistor
        name="R_USB_DM"
        resistance="27ohm"
        footprint="0402"
        pcbX={4}
        pcbY={-5}
        schSheetName="SIGNALS"
        schSectionName="USB"
        schX={8.1}
        schY={-4}
      />
      <trace
        name="USB_HS_DP"
        from=".U_ESD > .pin6"
        to=".R_USB_DP > .pin1"
        width="0.2mm"
      />
      <trace from=".R_USB_DP > .pin2" to=".U_MCU > .pin50" width="0.2mm" />
      <trace
        name="USB_HS_DM"
        from=".U_ESD > .pin4"
        to=".R_USB_DM > .pin1"
        width="0.2mm"
      />
      <trace from=".R_USB_DM > .pin2" to=".U_MCU > .pin49" width="0.2mm" />
      <SKRPACE010
        name="SW_BOOT"
        pcbX={26}
        pcbY={21}
        schSheetName="SIGNALS"
        schSectionName="USB"
        schX={12}
        schY={8}
      />
      <resistor
        name="R_BOOT_PU"
        resistance="10kohm"
        footprint="0402"
        pcbX={20.5}
        pcbY={20}
        schSheetName="SIGNALS"
        schSectionName="USB"
        schX={8}
        schY={8}
      />
      <Drop0402 from=".R_BOOT_PU > .pin1" pin={1} net="V3V3" layer="inner2" />
      <trace from=".R_BOOT_PU > .pin2" to=".U_MCU > .pin66" />
      <trace from=".U_MCU > .pin66" to=".SW_BOOT > .pin1" />
      <PlaneDrop
        from=".SW_BOOT > .pin2"
        net="GND"
        layer="inner1"
        padOffset={{ x: -2.100072, y: 1.85 }}
      />

      <SKRPACE010
        name="SW_RESET"
        pcbX={-14}
        pcbY={24}
        schSheetName="SIGNALS"
        schSectionName="USB"
        schX={12}
        schY={1}
      />
      <resistor
        name="R_RESET_PU"
        resistance="10kohm"
        footprint="0402"
        pcbX={-6}
        pcbY={9.5}
        schSheetName="SIGNALS"
        schSectionName="USB"
        schX={8}
        schY={1}
      />
      <capacitor
        name="C_RESET"
        capacitance="1uF"
        maxDecouplingTraceLength={20}
        footprint="0402"
        pcbX={-6}
        pcbY={10.5}
        schSheetName="SIGNALS"
        schSectionName="USB"
        schX={5}
        schY={1}
        schOrientation="vertical"
      />
      <Drop0402 from=".R_RESET_PU > .pin1" pin={1} net="V3V3" layer="inner2" />
      <trace
        from=".C_RESET > .pin1"
        to=".U_MCU > .pin103"
        maxLength="20mm"
      />
      <trace from=".R_RESET_PU > .pin2" to=".C_RESET > .pin1" />
      <trace from=".R_RESET_PU > .pin2" to=".SW_RESET > .pin1" />
      <Drop0402 from=".C_RESET > .pin2" pin={2} net="GND" layer="inner1" />
      <PlaneDrop
        from=".SW_RESET > .pin2"
        net="GND"
        layer="inner1"
        padOffset={{ x: -2.100072, y: 1.85 }}
      />

      <SmdUsbCWithFixedSchematic
        name="J_USB"
        pcbX={2}
        pcbY={-23.2}
        schSheetName="SIGNALS"
        schSectionName="USB"
        schX={1.8}
        schY={-3}
        schWidth={1.575}
        schHeight={2.6}
      />
      <trace
        from=".J_USB > .pin2"
        to=".J_USB > .pin1"
        width="0.5mm"
        pcbPathRelativeTo=".J_USB > .pin2"
        pcbPath={[{ x: -3.350006, y: 2.44908705 }]}
      />
      <trace
        from=".J_USB > .pin16"
        to=".J_USB > .pin15"
        width="0.5mm"
        pcbPathRelativeTo=".J_USB > .pin16"
        pcbPath={[{ x: 3.350006, y: 2.44908705 }]}
      />
      <PlaneDrop
        from=".J_USB > .pin1"
        net="GND"
        layer="inner1"
        width="0.5mm"
        padOffset={{ x: -4.2, y: 3.2 }}
      />
      <PlaneDrop
        from=".J_USB > .pin15"
        net="GND"
        layer="inner1"
        width="0.5mm"
        padOffset={{ x: 4.2, y: 3.2 }}
      />
      {[3, 4, 13, 14].map((pin) => (
        <PourContact
          key={`usb-vbus-${pin}`}
          from={`.J_USB > .pin${pin}`}
          net="VBUS"
          width="0.6mm"
        />
      ))}
      <resistor
        name="R_CC1"
        resistance="5.1kohm"
        footprint="0402"
        pcbX={-4.5}
        pcbY={-22}
        schSheetName="SIGNALS"
        schSectionName="USB"
        schX={2.2}
        schY={-6.3}
      />
      <resistor
        name="R_CC2"
        resistance="5.1kohm"
        footprint="0402"
        pcbX={8.5}
        pcbY={-22}
        schSheetName="SIGNALS"
        schSectionName="USB"
        schX={4.8}
        schY={-6.3}
      />
      <trace from=".J_USB > .pin6" to=".R_CC1 > .pin1" />
      <Drop0402 from=".R_CC1 > .pin2" pin={2} net="GND" layer="inner1" />
      <trace from=".J_USB > .pin12" to=".R_CC2 > .pin1" />
      <Drop0402 from=".R_CC2 > .pin2" pin={2} net="GND" layer="inner1" />
      <PlaneDrop
        from=".U_ESD > .pin2"
        net="GND"
        layer="inner1"
        padOffset={{ x: 0, y: -2.2 }}
      />
      <PourContact from=".U_ESD > .pin5" net="VBUS" />

      <TLV62569DRLR
        name="U_3V3_BUCK"
        pcbX={18}
        pcbY={-18}
        schSheetName="POWER"
        schSectionName="THREE_VOLT_POWER"
        schX={2}
        schY={-4.5}
      />
      <DFE201210U_2R2M_P2
        name="L_3V3"
        pcbX={22}
        pcbY={-18}
        schSheetName="POWER"
        schSectionName="THREE_VOLT_POWER"
        schX={6}
        schY={-4.5}
      />
      <capacitor
        name="C_3V3_IN"
        capacitance="4.7uF"
        maxDecouplingTraceLength={10}
        footprint="0603"
        pcbX={18.5}
        pcbY={-21.3}
        pcbRotation={-90}
        schSheetName="POWER"
        schSectionName="THREE_VOLT_POWER"
        schX={2}
        schY={-7.5}
        schOrientation="vertical"
      />
      <capacitor
        name="C_3V3_OUT"
        capacitance="22uF"
        maxDecouplingTraceLength={10}
        footprint="0805"
        pcbX={26}
        pcbY={-18}
        schSheetName="POWER"
        schSectionName="THREE_VOLT_POWER"
        schX={11}
        schY={-4.5}
        schOrientation="vertical"
      />
      <resistor
        name="R_3V3_TOP"
        resistance="453kohm"
        footprint="0402"
        pcbX={22}
        pcbY={-15.7}
        schSheetName="POWER"
        schSectionName="THREE_VOLT_POWER"
        schX={6}
        schY={-7.5}
      />
      <resistor
        name="R_3V3_BOT"
        resistance="100kohm"
        footprint="0402"
        pcbX={24}
        pcbY={-15.7}
        schSheetName="POWER"
        schSectionName="THREE_VOLT_POWER"
        schX={11}
        schY={-7.5}
      />
      <capacitor
        name="C_3V3_FB"
        capacitance="22pF"
        maxDecouplingTraceLength={10}
        footprint="0402"
        pcbX={22}
        pcbY={-14.2}
        schSheetName="POWER"
        schSectionName="THREE_VOLT_POWER"
        schX={8.5}
        schY={-8.8}
        schOrientation="vertical"
      />
      <trace
        from=".U_3V3_BUCK > .pin3"
        to=".C_3V3_IN > .pin1"
        width="0.18mm"
        pcbPathRelativeTo=".U_3V3_BUCK > .pin3"
        pcbPath={[{ x: 0.5, y: -1.5 }]}
      />
      <PourContact from=".U_3V3_BUCK > .pin5" net="VBUS" width="0.15mm" />
      <PourContact from=".C_3V3_IN > .pin1" net="VBUS" width="0.6mm" />
      <PlaneDrop
        from=".U_3V3_BUCK > .pin2"
        net="GND"
        layer="inner1"
        padOffset={{ x: 0, y: -1.5 }}
        width="0.15mm"
      />
      <PlaneDrop
        from=".U_3V3_BUCK > .pin6"
        net="GND"
        layer="inner1"
        padOffset={{ x: -0.5, y: 1.5 }}
        width="0.15mm"
      />
      <PlaneDrop
        from=".C_3V3_IN > .pin2"
        net="GND"
        layer="inner1"
        padOffset={{ x: 0.825, y: -1.2 }}
      />
      <trace
        from=".U_3V3_BUCK > .pin4"
        to=".L_3V3 > .pin1"
        width="0.18mm"
        pcbPathRelativeTo=".U_3V3_BUCK > .pin4"
        pcbPath={[
          { x: 1.5, y: 0.7225 },
          { x: 3.0338, y: 0.7225 },
          { x: 3.0338, y: 0 },
        ]}
      />
      <trace from=".L_3V3 > .pin2" to=".C_3V3_OUT > .pin1" width="0.6mm" />
      <trace from=".L_3V3 > .pin2" to=".R_3V3_TOP > .pin1" />
      <trace from=".R_3V3_TOP > .pin2" to=".R_3V3_BOT > .pin1" />
      <trace
        from=".R_3V3_TOP > .pin2"
        to=".U_3V3_BUCK > .pin1"
        width="0.15mm"
        pcbPathRelativeTo=".U_3V3_BUCK > .pin1"
        pcbPath={[
          { x: -0.5, y: -1.5 },
          { x: -1.5, y: -1.5 },
          { x: -1.5, y: -1.5, via: true, toLayer: "bottom" },
          { x: -1.5, y: -1.5 },
        ]}
      />
      <trace from=".C_3V3_FB > .pin1" to=".R_3V3_TOP > .pin1" />
      <trace from=".C_3V3_FB > .pin2" to=".R_3V3_TOP > .pin2" />
      <Drop0402 from=".R_3V3_BOT > .pin2" pin={2} net="GND" layer="inner1" />
      <PlaneDrop
        from=".C_3V3_OUT > .pin1"
        net="V3V3"
        layer="inner2"
        padOffset={{ x: -1.8, y: 0 }}
        width="0.6mm"
      />
      <PlaneDrop
        from=".C_3V3_OUT > .pin2"
        net="GND"
        layer="inner1"
        padOffset={{ x: 1.8, y: 0 }}
        width="0.6mm"
      />
    </breakout>

    <hole name="H1" diameter="3.2mm" pcbX={-31.5} pcbY={24.5} />
    <hole name="H2" diameter="3.2mm" pcbX={31.5} pcbY={24.5} />
    <hole name="H3" diameter="3.2mm" pcbX={-31.5} pcbY={-24.5} />
    <hole name="H4" diameter="3.2mm" pcbX={31.5} pcbY={-24.5} />

    <silkscreentext
      text="ESP32-P4 SPI DISPLAY UVC CAPTURE"
      pcbX={3}
      pcbY={25.5}
      fontSize="1.1mm"
      anchorAlignment="center"
    />
    <silkscreentext
      text="DISPLAY"
      pcbX={-33}
      pcbY={0}
      pcbRotation={90}
      fontSize="1mm"
      anchorAlignment="center"
    />
    <silkscreentext
      text="HOST"
      pcbX={-23.5}
      pcbY={0}
      pcbRotation={90}
      fontSize="1mm"
      anchorAlignment="center"
    />
    <silkscreentext
      text="BOOT"
      pcbX={26}
      pcbY={24}
      fontSize="0.9mm"
      anchorAlignment="center"
    />
    <silkscreentext
      text="RESET"
      pcbX={-14}
      pcbY={26}
      fontSize="0.9mm"
      anchorAlignment="center"
    />

    <copperpour
      name="VBUS_LOCAL_POUR"
      layer="top"
      connectsTo="net.VBUS"
      clearance="0.2mm"
      outline={[
        { x: -1.5, y: -26 },
        { x: 5.5, y: -26 },
        { x: 5.5, y: -20.5 },
        { x: 14.2, y: -20.5 },
        { x: 14.2, y: -16.5 },
        { x: 17, y: -16.5 },
        { x: 17, y: -19.8 },
        { x: 4, y: -19.8 },
        { x: 4, y: -17 },
        { x: 0, y: -17 },
        { x: 0, y: -20 },
        { x: -1.5, y: -20 },
      ]}
    />
    <copperpour
      name="V1V2_LOCAL_POUR"
      layer="bottom"
      connectsTo="net.V1V2"
      clearance="0.2mm"
      outline={[
        { x: -6, y: -3.5 },
        { x: 22, y: -3.5 },
        { x: 22, y: 12.5 },
        { x: -6, y: 12.5 },
      ]}
    />
    <copperpour
      name="GND_PLANE"
      layer="inner1"
      connectsTo="net.GND"
      clearance="0.2mm"
      boardEdgeMargin="0.3mm"
    />
    <copperpour
      name="V3V3_PLANE"
      layer="inner2"
      connectsTo="net.V3V3"
      clearance="0.2mm"
      boardEdgeMargin="0.3mm"
    />
  </board>
);
