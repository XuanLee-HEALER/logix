import { useState, useEffect } from "react";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/Card";
import { latches, computeOutputs } from "./data";
import type { LatchType } from "./data";
import { LatchCircuit } from "./components/LatchCircuit";
import { TruthTable } from "./components/TruthTable";
import { InputToggle } from "./components/InputToggle";

function getDefaultInputs(type: LatchType): Record<string, number> {
  switch (type) {
    case "sr-nor":
      return { S: 0, R: 0 };
    case "sr-nand":
      return { "S\u0305": 1, "R\u0305": 1 };
    case "d-latch":
      return { D: 0, E: 0 };
  }
}

export default function Latches() {
  const [activeType, setActiveType] = useState<LatchType>("sr-nor");
  const [inputs, setInputs] = useState<Record<string, number>>(
    getDefaultInputs("sr-nor"),
  );
  const [prevQ, setPrevQ] = useState(0);

  const latch = latches.find((l) => l.id === activeType)!;
  const output = computeOutputs(activeType, inputs, prevQ);

  // Track the last valid Q so it can feed back as Q₀ (previous state).
  // Skip updates during "保持" (hold) — Q₀ should stay unchanged.
  // Skip updates during forbidden states — outputs are unstable/undefined.
  useEffect(() => {
    if (output.stateLabel !== "保持" && !output.forbidden) {
      setPrevQ(output.Q);
    }
  }, [output.Q, output.stateLabel, output.forbidden]);

  function handleTypeChange(type: LatchType) {
    setActiveType(type);
    setInputs(getDefaultInputs(type));
    setPrevQ(0);
  }

  function toggleInput(key: string) {
    setInputs((prev) => ({ ...prev, [key]: prev[key] === 1 ? 0 : 1 }));
  }

  return (
    <div className="space-y-8">
      {/* Back link */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-lg text-pencil/60 transition-colors hover:text-marker-red"
      >
        <ArrowLeft size={20} strokeWidth={2.5} />
        Back to topics
      </Link>

      {/* Title */}
      <div>
        <h1 className="text-4xl font-bold md:text-5xl">
          锁存器
          <span className="text-marker-red">电路图解</span>
        </h1>
        <p className="mt-2 text-lg text-pencil/60 md:text-xl">
          点击输入按钮，观察信号在电路中的实时传播
        </p>
      </div>

      {/* Type tabs */}
      <div className="flex flex-wrap gap-2">
        {latches.map((l) => (
          <button
            key={l.id}
            onClick={() => handleTypeChange(l.id)}
            className={`wobbly border-2 px-4 py-2 text-base transition-all duration-100 ${
              l.id === activeType
                ? "border-pencil bg-pencil text-paper shadow-sketch-sm"
                : "border-pencil/30 bg-white text-pencil/70 hover:border-pencil hover:shadow-sketch-sm"
            }`}
          >
            {l.name}
          </button>
        ))}
      </div>

      {/* Main content */}
      <div className="grid items-start gap-8 lg:grid-cols-[1fr_280px]">
        {/* Circuit panel */}
        <div className="space-y-6">
          {/* Circuit name */}
          <Card decoration="tape">
            <div className="text-center">
              <h2 className="font-heading text-2xl font-bold text-marker-red md:text-3xl">
                {latch.name}
              </h2>
              <p className="mt-1 text-pencil/50">{latch.subtitle}</p>
            </div>
          </Card>

          {/* Interactive circuit */}
          <Card className="-rotate-0.5">
            <p className="mb-2 text-center text-xs font-bold tracking-widest text-pencil/40 uppercase">
              交互式电路图
            </p>
            <LatchCircuit
              type={activeType}
              inputs={inputs}
              Q={output.Q}
              Qbar={output.Qbar}
              forbidden={output.forbidden}
            />
          </Card>

          {/* Input controls + state */}
          <div className="flex flex-wrap items-center gap-4">
            {latch.inputLabels.map((label) => (
              <InputToggle
                key={`${activeType}-${label}`}
                label={label}
                value={inputs[label] ?? 0}
                onToggle={() => toggleInput(label)}
              />
            ))}
            <div
              className={`wobbly-sm border-2 px-4 py-2 font-heading text-lg font-bold ${
                output.forbidden
                  ? "border-marker-red bg-marker-red/10 text-marker-red"
                  : "border-pen-blue bg-pen-blue/10 text-pen-blue"
              }`}
            >
              {output.stateLabel}
              {output.forbidden && " ⚠"}
            </div>
          </div>

          {/* Explanation */}
          <Card decoration="tack" postit>
            <p className="text-lg leading-relaxed">{latch.explain}</p>
          </Card>

          {/* Walkthrough */}
          <Card>
            <p className="mb-4 font-heading text-xl font-bold">
              工作原理
              <span className="ml-2 text-sm font-normal text-pencil/40">
                step by step
              </span>
            </p>
            <div className="space-y-3">
              {latch.walkthrough.map((step, i) => (
                <div key={i} className="flex gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border-2 border-pencil/30 font-heading text-sm font-bold text-pencil/50 wobbly-sm">
                    {i + 1}
                  </span>
                  <p className="text-base leading-relaxed text-pencil/80">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Truth table sidebar */}
        <div className="space-y-4 lg:sticky lg:top-4">
          <p className="border-b-2 border-dashed border-pencil/20 pb-2 text-center font-heading text-lg font-bold">
            真值表
          </p>
          <TruthTable
            inputLabels={latch.inputLabels}
            rows={latch.truthTable}
            currentInputs={inputs}
          />
          <div className="text-center">
            <p className="text-sm text-pencil/40">Q₀ = 上一状态的 Q 值</p>
          </div>
        </div>
      </div>
    </div>
  );
}
