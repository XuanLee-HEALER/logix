import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/Card";
import { categories, categoryGroups } from "./data";
import type { BooleanRule } from "./data";
import { VennDiagram } from "./components/VennDiagram";
import { CircuitDiagram } from "./components/CircuitDiagram";
import { RuleCard } from "./components/RuleCard";
import { StepByStep } from "./components/StepByStep";

export default function BooleanAlgebra() {
  const [activeCatId, setActiveCatId] = useState(categories[0]!.id);
  const [activeRule, setActiveRule] = useState<BooleanRule>(
    categories[0]!.rules[0]!,
  );

  const activeCat = categories.find((c) => c.id === activeCatId)!;

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
          布尔运算
          <span className="text-marker-red">图解</span>
        </h1>
        <p className="mt-2 text-lg text-pencil/60 md:text-xl">
          点击规律卡片，韦恩图 + 电路图实时展示
        </p>
      </div>

      {/* Category tabs — grouped */}
      <div className="space-y-3">
        {categoryGroups.map((group) => (
          <div key={group} className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-sm font-bold text-pencil/40">
              {group}
            </span>
            {categories
              .filter((cat) => cat.group === group)
              .map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCatId(cat.id);
                    setActiveRule(cat.rules[0]!);
                  }}
                  className={`wobbly border-2 px-4 py-2 text-base transition-all duration-100 ${
                    cat.id === activeCatId
                      ? "border-pencil bg-pencil text-paper shadow-sketch-sm"
                      : "border-pencil/30 bg-white text-pencil/70 hover:border-pencil hover:shadow-sketch-sm"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
          </div>
        ))}
      </div>

      {/* Main content: Viz + Rules */}
      <div className="grid items-start gap-8 lg:grid-cols-[1fr_320px]">
        {/* Viz panel */}
        <div className="space-y-6">
          {/* Formula header */}
          <Card decoration="tape">
            <div className="text-center">
              <h2 className="font-mono text-2xl font-bold text-marker-red md:text-3xl">
                {activeRule.formula}
              </h2>
              <p className="mt-1 text-pencil/50">{activeRule.name}</p>
            </div>
          </Card>

          {/* Diagrams: Venn + Circuit side by side */}
          <div
            className={`grid gap-6 ${activeRule.circuit ? "md:grid-cols-2" : "md:grid-cols-1"}`}
          >
            <Card className="-rotate-1">
              <p className="mb-2 text-center text-xs font-bold tracking-widest text-pencil/40 uppercase">
                韦恩图 · 集合
              </p>
              <VennDiagram mode={activeRule.mode} venn={activeRule.venn} />
            </Card>

            {activeRule.circuit && (
              <Card className="rotate-1">
                <p className="mb-2 text-center text-xs font-bold tracking-widest text-pencil/40 uppercase">
                  电路图 · 开关
                </p>
                <CircuitDiagram config={activeRule.circuit} />
              </Card>
            )}
          </div>

          {/* Explanation */}
          <Card decoration="tack" postit>
            <p className="text-lg leading-relaxed">{activeRule.explain}</p>
          </Card>

          {/* Step-by-step (for simplification rules) */}
          {activeRule.steps && (
            <Card>
              <p className="mb-4 font-heading text-xl font-bold">
                推导过程
                <span className="ml-2 text-sm font-normal text-pencil/40">
                  step by step
                </span>
              </p>
              <StepByStep steps={activeRule.steps} />
            </Card>
          )}
        </div>

        {/* Rules list */}
        <div className="space-y-2 lg:max-h-[calc(100vh-200px)] lg:overflow-y-auto lg:pr-2">
          <p className="mb-3 border-b-2 border-dashed border-pencil/20 pb-2 text-center font-heading text-lg font-bold">
            {activeCat.label}
            <span className="ml-2 text-pencil/40">
              ({activeCat.rules.length})
            </span>
          </p>
          {activeCat.rules.map((rule, i) => (
            <RuleCard
              key={`${activeCat.id}-${i}`}
              rule={rule}
              active={rule === activeRule}
              onClick={() => setActiveRule(rule)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
