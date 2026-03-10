/* ── Types ── */

export type LatchType = "sr-nor" | "sr-nand" | "d-latch";

export interface TruthTableRow {
  inputs: Record<string, number>;
  outputs: { Q: string; Qbar: string };
  label: string;
  forbidden?: boolean;
}

export interface LatchDefinition {
  id: LatchType;
  name: string;
  subtitle: string;
  inputLabels: string[];
  outputLabels: string[];
  truthTable: TruthTableRow[];
  explain: string;
  walkthrough: string[];
}

/* ── Latch Definitions ── */

export const latches: LatchDefinition[] = [
  {
    id: "sr-nor",
    name: "SR 锁存器 (NOR)",
    subtitle: "NOR-based SR Latch",
    inputLabels: ["S", "R"],
    outputLabels: ["Q", "Q\u0305"],
    truthTable: [
      {
        inputs: { S: 0, R: 0 },
        outputs: { Q: "Q\u2080", Qbar: "Q\u0305\u2080" },
        label: "保持",
      },
      {
        inputs: { S: 1, R: 0 },
        outputs: { Q: "1", Qbar: "0" },
        label: "置位",
      },
      {
        inputs: { S: 0, R: 1 },
        outputs: { Q: "0", Qbar: "1" },
        label: "复位",
      },
      {
        inputs: { S: 1, R: 1 },
        outputs: { Q: "?", Qbar: "?" },
        label: "禁止",
        forbidden: true,
      },
    ],
    explain:
      "SR 锁存器由两个 NOR 门交叉耦合而成，是最基本的存储单元。S(Set) 置位使 Q=1，R(Reset) 复位使 Q=0。当 S=R=0 时，锁存器保持上一次的状态——这就是「记忆」功能。S=R=1 是禁止状态，因为此时两个 NOR 门的输出都为 0，Q 和 Q\u0305 不再互补。",
    walkthrough: [
      "置位 (S=1, R=0)：S=1 使上方 NOR 门至少一个输入为 1，输出 Q\u0305=0；Q\u0305=0 反馈到下方 NOR 门，两个输入均为 0，输出 Q=1。",
      "复位 (S=0, R=1)：R=1 使下方 NOR 门至少一个输入为 1，输出 Q=0；Q=0 反馈到上方 NOR 门，两个输入均为 0，输出 Q\u0305=1。",
      "保持 (S=0, R=0)：两个输入都为 0，各门输出取决于反馈信号，锁存器维持上一次的状态不变。",
      "禁止 (S=1, R=1)：两个 NOR 门都有一个输入为 1，输出均为 0。Q=Q\u0305=0 违反互补约束，释放后状态不确定。",
    ],
  },
  {
    id: "sr-nand",
    name: "SR 锁存器 (NAND)",
    subtitle: "NAND-based SR Latch",
    inputLabels: ["S\u0305", "R\u0305"],
    outputLabels: ["Q", "Q\u0305"],
    truthTable: [
      {
        inputs: { "S\u0305": 1, "R\u0305": 1 },
        outputs: { Q: "Q\u2080", Qbar: "Q\u0305\u2080" },
        label: "保持",
      },
      {
        inputs: { "S\u0305": 0, "R\u0305": 1 },
        outputs: { Q: "1", Qbar: "0" },
        label: "置位",
      },
      {
        inputs: { "S\u0305": 1, "R\u0305": 0 },
        outputs: { Q: "0", Qbar: "1" },
        label: "复位",
      },
      {
        inputs: { "S\u0305": 0, "R\u0305": 0 },
        outputs: { Q: "?", Qbar: "?" },
        label: "禁止",
        forbidden: true,
      },
    ],
    explain:
      "NAND 型 SR 锁存器的输入是低电平有效（S\u0305 和 R\u0305 上方有横线表示取反）。当 S\u0305=0 时置位，R\u0305=0 时复位。两者都为 1 时保持，都为 0 时是禁止状态。与 NOR 型逻辑相反但功能相同。",
    walkthrough: [
      "置位 (S\u0305=0, R\u0305=1)：S\u0305=0 使上方 NAND 门输出 Q=1（NAND 任一输入为 0 则输出 1）；Q=1 反馈到下方 NAND 门，与 R\u0305=1 做 NAND，输出 Q\u0305=0。",
      "复位 (S\u0305=1, R\u0305=0)：R\u0305=0 使下方 NAND 门输出 Q\u0305=1；Q\u0305=1 反馈到上方 NAND 门，与 S\u0305=1 做 NAND，输出 Q=0。",
      "保持 (S\u0305=1, R\u0305=1)：两个输入都为 1，各门输出取决于反馈信号，锁存器维持上一次的状态。",
      "禁止 (S\u0305=0, R\u0305=0)：两个 NAND 门都有一个输入为 0，输出均为 1。Q=Q\u0305=1 违反互补约束。",
    ],
  },
  {
    id: "d-latch",
    name: "D 锁存器",
    subtitle: "D Latch (Gated)",
    inputLabels: ["D", "E"],
    outputLabels: ["Q", "Q\u0305"],
    truthTable: [
      {
        inputs: { D: 0, E: 0 },
        outputs: { Q: "Q\u2080", Qbar: "Q\u0305\u2080" },
        label: "保持",
      },
      {
        inputs: { D: 1, E: 0 },
        outputs: { Q: "Q\u2080", Qbar: "Q\u0305\u2080" },
        label: "保持",
      },
      {
        inputs: { D: 0, E: 1 },
        outputs: { Q: "0", Qbar: "1" },
        label: "透明 0",
      },
      {
        inputs: { D: 1, E: 1 },
        outputs: { Q: "1", Qbar: "0" },
        label: "透明 1",
      },
    ],
    explain:
      "D 锁存器在 SR 锁存器前增加了使能控制。D(Data) 是数据输入，E(Enable) 是使能信号。当 E=1 时锁存器「透明」，Q 跟随 D 变化；当 E=0 时锁存器「锁定」，Q 保持 E 变为 0 瞬间的值。D 锁存器消除了 SR 锁存器的禁止状态问题。",
    walkthrough: [
      "透明模式 (E=1)：使能信号打开两个与门，D 经上方与门送入内部 SR 锁存器的 S 端，D 经 NOT 门取反后经下方与门送入 R 端。S 和 R 互补，不会出现禁止状态。",
      "锁定模式 (E=0)：使能信号关闭两个与门，S=R=0，内部 SR 锁存器进入保持状态，Q 不再跟随 D 变化。",
      "D=1, E=1 时：S=1·1=1, R=0·1=0，SR 锁存器置位，Q=1。",
      "D=0, E=1 时：S=0·1=0, R=1·1=1，SR 锁存器复位，Q=0。",
    ],
  },
];

/* ── Output Computation ── */

export interface LatchOutput {
  Q: number;
  Qbar: number;
  forbidden: boolean;
  stateLabel: string;
}

export function computeOutputs(
  type: LatchType,
  inputs: Record<string, number>,
  prevQ: number,
): LatchOutput {
  switch (type) {
    case "sr-nor": {
      const S = inputs["S"] ?? 0;
      const R = inputs["R"] ?? 0;
      if (S === 1 && R === 1)
        return { Q: 0, Qbar: 0, forbidden: true, stateLabel: "禁止" };
      if (S === 1 && R === 0)
        return { Q: 1, Qbar: 0, forbidden: false, stateLabel: "置位" };
      if (S === 0 && R === 1)
        return { Q: 0, Qbar: 1, forbidden: false, stateLabel: "复位" };
      return {
        Q: prevQ,
        Qbar: 1 - prevQ,
        forbidden: false,
        stateLabel: "保持",
      };
    }
    case "sr-nand": {
      const Sbar = inputs["S\u0305"] ?? 1;
      const Rbar = inputs["R\u0305"] ?? 1;
      if (Sbar === 0 && Rbar === 0)
        return { Q: 1, Qbar: 1, forbidden: true, stateLabel: "禁止" };
      if (Sbar === 0 && Rbar === 1)
        return { Q: 1, Qbar: 0, forbidden: false, stateLabel: "置位" };
      if (Sbar === 1 && Rbar === 0)
        return { Q: 0, Qbar: 1, forbidden: false, stateLabel: "复位" };
      return {
        Q: prevQ,
        Qbar: 1 - prevQ,
        forbidden: false,
        stateLabel: "保持",
      };
    }
    case "d-latch": {
      const D = inputs["D"] ?? 0;
      const E = inputs["E"] ?? 0;
      if (E === 0)
        return {
          Q: prevQ,
          Qbar: 1 - prevQ,
          forbidden: false,
          stateLabel: "保持",
        };
      return {
        Q: D,
        Qbar: 1 - D,
        forbidden: false,
        stateLabel: D === 1 ? "透明 1" : "透明 0",
      };
    }
  }
}
