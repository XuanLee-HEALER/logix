/* ── Types ── */

export type VennHighlight =
  | "none"
  | "A"
  | "B"
  | "notA"
  | "AB"
  | "AuB"
  | "xor"
  | "xnor"
  | "not_AB"
  | "not_AuB"
  | "universe"
  | "ABC"
  | "AuBuC"
  | "A_and_BuC"
  | "A_or_BC";

export type VennMode = "const" | "venn1" | "venn2" | "venn3";

/** Circuit topology type */
export type CircuitType =
  | "series"
  | "parallel"
  | "not"
  | "double-not"
  | "a-and-boc"
  | "a-or-ab"
  | "a-and-aob"
  | "nand"
  | "nor"
  | "xor"
  | "xnor";

export interface CircuitConfig {
  type: CircuitType;
  /** [label, isOn] pairs */
  switches: [string, boolean][];
  result: boolean;
}

export interface SimplificationStep {
  expr: string;
  law: string;
}

export interface BooleanRule {
  formula: string;
  name: string;
  mode: VennMode;
  venn: VennHighlight;
  explain: string;
  circuit?: CircuitConfig;
  steps?: SimplificationStep[];
}

export interface Category {
  id: string;
  group: string;
  label: string;
  rules: BooleanRule[];
}

export const categoryGroups = [
  "基础运算",
  "代数定律",
  "扩展门电路",
  "化简",
] as const;

/* ── Data ── */

export const categories: Category[] = [
  /* ───── 常量运算 ───── */
  {
    id: "constant",
    group: "基础运算",
    label: "常量运算",
    rules: [
      {
        formula: "0 · 0 = 0",
        name: "零与零",
        mode: "const",
        venn: "none",
        explain:
          "AND 运算：两个都是 0，结果是 0。串联电路中两个开关都断开，电流无法通过，灯灭。",
        circuit: {
          type: "series",
          switches: [
            ["0", false],
            ["0", false],
          ],
          result: false,
        },
      },
      {
        formula: "0 · 1 = 0",
        name: "零与一",
        mode: "const",
        venn: "none",
        explain:
          "AND 需要两个都为 1 才输出 1。串联电路中一个断开，电流就过不去，灯灭。",
        circuit: {
          type: "series",
          switches: [
            ["0", false],
            ["1", true],
          ],
          result: false,
        },
      },
      {
        formula: "1 · 1 = 1",
        name: "一与一",
        mode: "const",
        venn: "AB",
        explain:
          "两个都是 1，AND 输出 1。串联电路两个开关都闭合，电流通过，灯亮！",
        circuit: {
          type: "series",
          switches: [
            ["1", true],
            ["1", true],
          ],
          result: true,
        },
      },
      {
        formula: "0 + 0 = 0",
        name: "零或零",
        mode: "const",
        venn: "none",
        explain:
          "OR 运算：两个都是 0，结果为 0。并联电路两个开关都断开，灯灭。",
        circuit: {
          type: "parallel",
          switches: [
            ["0", false],
            ["0", false],
          ],
          result: false,
        },
      },
      {
        formula: "1 + 0 = 1",
        name: "一或零",
        mode: "const",
        venn: "universe",
        explain:
          "OR 只需一个为 1 就输出 1。并联电路中一条通路闭合，电流就能通过，灯亮。",
        circuit: {
          type: "parallel",
          switches: [
            ["1", true],
            ["0", false],
          ],
          result: true,
        },
      },
      {
        formula: "1 + 1 = 1",
        name: "一或一",
        mode: "const",
        venn: "universe",
        explain:
          "布尔 OR 不是算术加法（1+1≠2）。只要有真，结果就是真。两条并联通路都通，灯亮（还是1）。",
        circuit: {
          type: "parallel",
          switches: [
            ["1", true],
            ["1", true],
          ],
          result: true,
        },
      },
    ],
  },

  /* ───── 补运算 ───── */
  {
    id: "complement",
    group: "基础运算",
    label: "补运算",
    rules: [
      {
        formula: "A · A' = 0",
        name: "互补与",
        mode: "venn1",
        venn: "none",
        explain:
          "A 和 NOT A 的交集为空。一个开关闭合时另一个必然断开（互锁），串联永远不通。",
        circuit: {
          type: "series",
          switches: [
            ["A", true],
            ["A'", false],
          ],
          result: false,
        },
      },
      {
        formula: "A + A' = 1",
        name: "互补或",
        mode: "venn1",
        venn: "universe",
        explain:
          "A 或 NOT A 覆盖全集。不管 A 开还是关，总有一条路是通的，灯永远亮。",
        circuit: {
          type: "parallel",
          switches: [
            ["A", true],
            ["A'", false],
          ],
          result: true,
        },
      },
      {
        formula: "0' = 1，1' = 0",
        name: "常量取反",
        mode: "const",
        venn: "universe",
        explain:
          "0 取反得 1，1 取反得 0。NOT 门把信号翻转：断开→闭合，闭合→断开。",
        circuit: {
          type: "not",
          switches: [["0→1", false]],
          result: true,
        },
      },
      {
        formula: "(A')' = A",
        name: "双重否定",
        mode: "venn1",
        venn: "A",
        explain:
          "对 A 取两次反，回到 A 本身。信号经过两个 NOT 门（两次翻转），恢复原值。",
        circuit: {
          type: "double-not",
          switches: [["A", true]],
          result: true,
        },
      },
    ],
  },

  /* ───── 单位元 ───── */
  {
    id: "identity",
    group: "基础运算",
    label: "单位元",
    rules: [
      {
        formula: "A · 0 = 0",
        name: "与零（零化律）",
        mode: "venn1",
        venn: "none",
        explain:
          "和 0 做 AND 永远得 0。串联电路中一个开关永远断开，不管另一个怎样，灯灭。",
        circuit: {
          type: "series",
          switches: [
            ["A", true],
            ["0", false],
          ],
          result: false,
        },
      },
      {
        formula: "A · 1 = A",
        name: "与一（恒等律）",
        mode: "venn1",
        venn: "A",
        explain:
          "1 是 AND 的单位元。串联电路中一个开关永远闭合（用导线替代），通不通完全取决于 A。",
        circuit: {
          type: "series",
          switches: [
            ["A", true],
            ["1", true],
          ],
          result: true,
        },
      },
      {
        formula: "A + 0 = A",
        name: "或零（恒等律）",
        mode: "venn1",
        venn: "A",
        explain:
          "0 是 OR 的单位元。并联电路中一条路永远断开，结果只取决于另一条路（A）。",
        circuit: {
          type: "parallel",
          switches: [
            ["A", true],
            ["0", false],
          ],
          result: true,
        },
      },
      {
        formula: "A + 1 = 1",
        name: "或一（零化律）",
        mode: "venn1",
        venn: "universe",
        explain:
          "和 1 做 OR 永远得 1。并联电路中一条路永远导通（用导线替代），灯永远亮。",
        circuit: {
          type: "parallel",
          switches: [
            ["A", false],
            ["1", true],
          ],
          result: true,
        },
      },
    ],
  },

  /* ───── 幂等律 ───── */
  {
    id: "idempotent",
    group: "基础运算",
    label: "幂等律",
    rules: [
      {
        formula: "A · A = A",
        name: "自身与",
        mode: "venn1",
        venn: "A",
        explain:
          "A AND A = A。两个联动开关串联（同开同关），和一个开关效果一样。",
        circuit: {
          type: "series",
          switches: [
            ["A", true],
            ["A", true],
          ],
          result: true,
        },
      },
      {
        formula: "A + A = A",
        name: "自身或",
        mode: "venn1",
        venn: "A",
        explain:
          "A OR A = A。两个联动开关并联（同开同关），多一条相同的路不增加功能。",
        circuit: {
          type: "parallel",
          switches: [
            ["A", true],
            ["A", true],
          ],
          result: true,
        },
      },
    ],
  },

  /* ───── 交换 / 结合 ───── */
  {
    id: "commut-assoc",
    group: "代数定律",
    label: "交换 / 结合",
    rules: [
      {
        formula: "A · B = B · A",
        name: "与交换律",
        mode: "venn2",
        venn: "AB",
        explain: "AND 顺序无关。串联电路中交换两个开关的位置，不影响电路通断。",
        circuit: {
          type: "series",
          switches: [
            ["A", true],
            ["B", true],
          ],
          result: true,
        },
      },
      {
        formula: "A + B = B + A",
        name: "或交换律",
        mode: "venn2",
        venn: "AuB",
        explain: "OR 顺序无关。并联电路中交换两条支路的位置，不影响结果。",
        circuit: {
          type: "parallel",
          switches: [
            ["A", true],
            ["B", true],
          ],
          result: true,
        },
      },
      {
        formula: "(A·B)·C = A·(B·C)",
        name: "与结合律",
        mode: "venn3",
        venn: "ABC",
        explain: "三个开关串联，不管怎么分组，都必须全部闭合灯才亮。",
        circuit: {
          type: "series",
          switches: [
            ["A", true],
            ["B", true],
            ["C", true],
          ],
          result: true,
        },
      },
      {
        formula: "(A+B)+C = A+(B+C)",
        name: "或结合律",
        mode: "venn3",
        venn: "AuBuC",
        explain: "三个开关并联，不管怎么分组，只要有一个闭合灯就亮。",
        circuit: {
          type: "parallel",
          switches: [
            ["A", true],
            ["B", false],
            ["C", false],
          ],
          result: true,
        },
      },
    ],
  },

  /* ───── 分配律 ───── */
  {
    id: "distributive",
    group: "代数定律",
    label: "分配律",
    rules: [
      {
        formula: "A·(B+C) = A·B + A·C",
        name: "与对或分配",
        mode: "venn3",
        venn: "A_and_BuC",
        explain:
          "A 串联一个 (B 并联 C) 的组合，等价于 (A串B) 并联 (A串C)。两种接法效果完全一样！",
        circuit: {
          type: "a-and-boc",
          switches: [
            ["A", true],
            ["B", true],
            ["C", false],
          ],
          result: true,
        },
      },
      {
        formula: "(A+B)·(A+C) = A + B·C",
        name: "或对与分配",
        mode: "venn3",
        venn: "A_or_BC",
        explain:
          "布尔代数独有！(A并B) 串联 (A并C) 等价于 A 并联 (B串C)。普通代数没有这个规律。",
        circuit: {
          type: "a-or-ab",
          switches: [
            ["A", true],
            ["B", true],
            ["C", false],
          ],
          result: true,
        },
      },
    ],
  },

  /* ───── 吸收律 ───── */
  {
    id: "absorption",
    group: "代数定律",
    label: "吸收律",
    rules: [
      {
        formula: "A + A·B = A",
        name: "吸收律 1",
        mode: "venn2",
        venn: "A",
        explain:
          "A 并联 (A串B)。如果 A 通了，不管 B 那条路怎样，电流都能过。A串B 那条路是冗余的。",
        circuit: {
          type: "a-or-ab",
          switches: [
            ["A", true],
            ["A", true],
            ["B", true],
          ],
          result: true,
        },
      },
      {
        formula: "A·(A+B) = A",
        name: "吸收律 2",
        mode: "venn2",
        venn: "A",
        explain:
          "A 串联 (A并B)。A 断开则全断；A 闭合则 (A并B) 必通。所以结果只取决于 A。",
        circuit: {
          type: "a-and-aob",
          switches: [
            ["A", true],
            ["A", true],
            ["B", false],
          ],
          result: true,
        },
      },
      {
        formula: "A + A'·B = A + B",
        name: "冗余项消除",
        mode: "venn2",
        venn: "AuB",
        explain:
          "A 并联 (NOT A 串 B) 等于 A 并联 B。当 A=0 时 NOT A=1，那条路就等于 B；当 A=1 时这条路本来就通了。NOT A 的限制是多余的。",
        circuit: {
          type: "a-or-ab",
          switches: [
            ["A", true],
            ["A'", false],
            ["B", true],
          ],
          result: true,
        },
      },
    ],
  },

  /* ───── 德摩根 ───── */
  {
    id: "demorgan",
    group: "代数定律",
    label: "德摩根",
    rules: [
      {
        formula: "(A·B)' = A' + B'",
        name: "德摩根 1",
        mode: "venn2",
        venn: "not_AB",
        explain:
          "NOT(A AND B) = (NOT A) OR (NOT B)。串联取反 = 各自取反后并联。NAND 门：只有全1输出0。",
        circuit: {
          type: "nand",
          switches: [
            ["A", true],
            ["B", true],
          ],
          result: false,
        },
      },
      {
        formula: "(A+B)' = A'·B'",
        name: "德摩根 2",
        mode: "venn2",
        venn: "not_AuB",
        explain:
          "NOT(A OR B) = (NOT A) AND (NOT B)。并联取反 = 各自取反后串联。NOR 门：只有全0输出1。",
        circuit: {
          type: "nor",
          switches: [
            ["A", false],
            ["B", false],
          ],
          result: true,
        },
      },
    ],
  },

  /* ───── 共识定理 ───── */
  {
    id: "consensus",
    group: "代数定律",
    label: "共识定理",
    rules: [
      {
        formula: "AB + A'C + BC = AB + A'C",
        name: "共识定理（与式）",
        mode: "venn3",
        venn: "A_or_BC",
        explain:
          "BC 是冗余项（共识项）。因为 BC 要么被 AB 覆盖（当 A=1），要么被 A'C 覆盖（当 A=0）。化简电路时可以直接去掉 BC。",
      },
      {
        formula: "(A+B)(A'+C)(B+C) = (A+B)(A'+C)",
        name: "共识定理（或式）",
        mode: "venn3",
        venn: "A_or_BC",
        explain: "对偶形式。(B+C) 是冗余因子，被其余两项覆盖，可以直接去掉。",
      },
    ],
  },

  /* ───── XOR / XNOR ───── */
  {
    id: "xor-xnor",
    group: "扩展门电路",
    label: "XOR / XNOR",
    rules: [
      {
        formula: "A ⊕ B = A'B + AB'",
        name: "XOR 异或",
        mode: "venn2",
        venn: "xor",
        explain:
          "XOR（异或）：两个输入不同时输出 1，相同时输出 0。电路上用两条交叉路径实现。常用于加法器和校验。",
        circuit: {
          type: "xor",
          switches: [
            ["A", true],
            ["B", false],
          ],
          result: true,
        },
      },
      {
        formula: "A ⊕ 0 = A",
        name: "XOR 单位元",
        mode: "venn1",
        venn: "A",
        explain:
          "展开为 AB' + A'B = A·1 + A'·0 = A。电路中 B=0 时：上支路 A·0'=A（0'永远闭合），下支路 A'·0=0（0 永远断开）。结果只取决于 A 的状态。0 是 XOR 的单位元。",
        circuit: {
          type: "xor",
          switches: [
            ["A", true],
            ["0", false],
          ],
          result: true,
        },
      },
      {
        formula: "A ⊕ 1 = A'",
        name: "XOR 取反",
        mode: "venn1",
        venn: "notA",
        explain:
          "展开为 A·1' + A'·1 = A·0 + A' = A'。电路中 B=1 时：上支路 A·1'=0（1'永远断开），下支路 A'·1=A'（1 永远闭合）。结果只取决于 A' 的状态——A 的翻转。硬件中 XOR 门可做可控反相器。",
        circuit: {
          type: "xor",
          switches: [
            ["A", false],
            ["1", true],
          ],
          result: true,
        },
      },
      {
        formula: "A ⊕ A = 0",
        name: "XOR 自消",
        mode: "venn1",
        venn: "none",
        explain:
          "展开为 AA' + A'A = 0 + 0 = 0。电路中两组开关联动：上支路 A·A' 互锁必断，下支路 A'·A 互锁必断。两条路永远不通，灯灭。汇编中 xor eax, eax 就是利用这个性质清零寄存器。",
        circuit: {
          type: "xor",
          switches: [
            ["A", true],
            ["A", true],
          ],
          result: false,
        },
      },
      {
        formula: "A ⊕ A' = 1",
        name: "XOR 互补",
        mode: "venn1",
        venn: "universe",
        explain:
          "展开为 A·(A')' + A'·A' = A·A + A'·A' = A + A' = 1。电路中：上支路 A 和 A 联动同开同关，下支路 A' 和 A' 也联动。不管 A 开还是关，总有一条路是通的，灯永远亮。",
        circuit: {
          type: "xor",
          switches: [
            ["A", true],
            ["A'", false],
          ],
          result: true,
        },
      },
      {
        formula: "A XNOR B = AB + A'B'",
        name: "XNOR 同或",
        mode: "venn2",
        venn: "xnor",
        explain:
          "展开为 AB + A'B'。电路中两条并联支路：上支路 A·B（同开同关），下支路 A'·B'（也同开同关，与上支路互补）。两个输入相同时必有一条路通，不同时两条都断。是 XOR 的取反，常用于比较器电路。",
        circuit: {
          type: "xnor",
          switches: [
            ["A", true],
            ["B", true],
          ],
          result: true,
        },
      },
    ],
  },

  /* ───── 对偶原理 ───── */
  {
    id: "duality",
    group: "扩展门电路",
    label: "对偶原理",
    rules: [
      {
        formula: "AND ↔ OR，0 ↔ 1",
        name: "对偶原理",
        mode: "const",
        venn: "universe",
        explain:
          "把一个布尔等式中的 AND 换成 OR、OR 换成 AND、0 换成 1、1 换成 0，得到的新等式仍然成立。例如 A·1=A 的对偶是 A+0=A。",
      },
      {
        formula: "A+1=1  ↔  A·0=0",
        name: "对偶示例 1",
        mode: "const",
        venn: "none",
        explain: "零化律的对偶：OR 一变为与零。+ 换 ·，1 换 0，等式依然成立。",
      },
      {
        formula: "(A·B)'=A'+B' ↔ (A+B)'=A'·B'",
        name: "对偶示例 2",
        mode: "venn2",
        venn: "not_AuB",
        explain: "德摩根两条定律互为对偶。AND 换 OR、OR 换 AND，形式完美对称。",
      },
    ],
  },

  /* ───── 化简技巧 ───── */
  {
    id: "simplify",
    group: "化简",
    label: "化简技巧",
    rules: [
      {
        formula: "AB + AB' = A",
        name: "邻项合并",
        mode: "venn2",
        venn: "A",
        explain:
          "两项只有一个变量互补时，提取公因子即可消去该变量。这是卡诺图上相邻格合并的代数本质。",
        steps: [
          { expr: "AB + AB'", law: "原式" },
          { expr: "A(B + B')", law: "提取公因子 A（分配律逆用）" },
          { expr: "A · 1", law: "互补律: B + B' = 1" },
          { expr: "A", law: "与一律: A · 1 = A" },
        ],
      },
      {
        formula: "A + AB = A",
        name: "冗余消除",
        mode: "venn2",
        venn: "A",
        explain:
          "吸收律的直接应用。AB 被 A 完全包含，是冗余项。化简时直接删除。",
        steps: [
          { expr: "A + AB", law: "原式" },
          { expr: "A · 1 + AB", law: "与一律: A = A·1" },
          { expr: "A(1 + B)", law: "提取公因子 A" },
          { expr: "A · 1", law: "或一律: 1+B = 1" },
          { expr: "A", law: "与一律" },
        ],
      },
      {
        formula: "A(A' + B) = AB",
        name: "展开化简",
        mode: "venn2",
        venn: "AB",
        explain: "分配律展开后利用互补律归零。AA' 不存在，只剩 AB。",
        steps: [
          { expr: "A(A' + B)", law: "原式" },
          { expr: "AA' + AB", law: "分配律展开" },
          { expr: "0 + AB", law: "互补律: AA' = 0" },
          { expr: "AB", law: "或零律: 0+X = X" },
        ],
      },
      {
        formula: "(A+B)(A+B') = A",
        name: "对偶邻项合并",
        mode: "venn1",
        venn: "A",
        explain:
          "邻项合并的对偶形式。两个因子只有一个变量互补时，可以合并消去。",
        steps: [
          { expr: "(A+B)(A+B')", law: "原式" },
          { expr: "A + BB'", law: "或对与分配律" },
          { expr: "A + 0", law: "互补律: BB' = 0" },
          { expr: "A", law: "或零律" },
        ],
      },
    ],
  },

  /* ───── 化简实战 ───── */
  {
    id: "practice",
    group: "化简",
    label: "化简实战",
    rules: [
      {
        formula: "A'B + AB' + AB = A + B",
        name: "三项化二项",
        mode: "venn2",
        venn: "AuB",
        explain:
          "经典三项化简。利用 AB 分别与另两项做邻项合并，最终化为最简形式 A+B。",
        steps: [
          { expr: "A'B + AB' + AB", law: "原式" },
          { expr: "A'B + AB' + AB + AB", law: "幂等律: +AB 不改变值" },
          { expr: "(A'B + AB) + (AB' + AB)", law: "重新分组" },
          { expr: "B(A' + A) + A(B' + B)", law: "提取公因子" },
          { expr: "B · 1 + A · 1", law: "互补律" },
          { expr: "A + B", law: "与一律" },
        ],
      },
      {
        formula: "AB + A'C + BC = AB + A'C",
        name: "共识定理应用",
        mode: "venn3",
        venn: "A_or_BC",
        explain: "BC 是共识项（冗余），可以直接去掉。下面是证明过程。",
        steps: [
          { expr: "AB + A'C + BC", law: "原式" },
          { expr: "AB + A'C + BC(A + A')", law: "插入 1: A+A'=1" },
          { expr: "AB + A'C + ABC + A'BC", law: "分配律展开 BC" },
          { expr: "(AB + ABC) + (A'C + A'BC)", law: "重新分组" },
          { expr: "AB(1+C) + A'C(1+B)", law: "提取公因子" },
          { expr: "AB + A'C", law: "或一律: 1+X=1，与一律" },
        ],
      },
      {
        formula: "A'B'C' + A'B'C + A'BC + ABC = A'B' + BC",
        name: "四项化二项",
        mode: "venn3",
        venn: "A_or_BC",
        explain: "最小项表达式的化简。分组做邻项合并，消去互补变量。",
        steps: [
          { expr: "A'B'C' + A'B'C + A'BC + ABC", law: "原式" },
          { expr: "(A'B'C' + A'B'C) + (A'BC + ABC)", law: "分组" },
          { expr: "A'B'(C'+C) + BC(A'+A)", law: "提取公因子" },
          { expr: "A'B' · 1 + BC · 1", law: "互补律" },
          { expr: "A'B' + BC", law: "与一律" },
        ],
      },
      {
        formula: "(A+B)(A'+B)(A+B') = AB + A'B'... → B",
        name: "连乘化简",
        mode: "venn2",
        venn: "B",
        explain: "用对偶邻项合并技巧，每次消去一对互补变量。",
        steps: [
          { expr: "(A+B)(A'+B)(A+B')", law: "原式" },
          { expr: "[(A+B)(A'+B)] · (A+B')", law: "先处理前两项" },
          { expr: "B · (A+B')", law: "对偶邻项合并: (A+B)(A'+B)=B" },
          { expr: "AB + BB'", law: "分配律展开" },
          { expr: "AB + 0", law: "互补律: BB'=0" },
          { expr: "AB", law: "或零律" },
        ],
      },
    ],
  },
];
