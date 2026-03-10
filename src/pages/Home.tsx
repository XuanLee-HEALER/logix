import { Link } from "react-router";
import { Card } from "@/components/Card";
import { CircleDot, ToggleRight, ArrowRight } from "lucide-react";

const topics = [
  {
    id: "boolean-algebra",
    title: "布尔运算图解",
    description: "韦恩图 + 集合视角理解布尔代数定律",
    icon: CircleDot,
    rotation: "-rotate-1",
    decoration: "tape" as const,
  },
  {
    id: "latches",
    title: "锁存器电路图解",
    description: "交互式探索 SR 锁存器与 D 锁存器",
    icon: ToggleRight,
    rotation: "rotate-1",
    decoration: "tack" as const,
  },
];

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="py-10 text-center">
        <h1 className="text-5xl font-bold md:text-6xl">
          Welcome to{" "}
          <span className="text-marker-red">
            Logix
            <span className="ml-1 inline-block animate-gentle-bounce text-pen-blue">
              !
            </span>
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-xl text-pencil/70 md:text-2xl">
          A sketchy little notebook for learning topics, one doodle at a time.
        </p>

        {/* Hand-drawn arrow pointing down */}
        <svg
          className="mx-auto mt-8 hidden text-pencil/40 md:block"
          width="40"
          height="60"
          viewBox="0 0 40 60"
        >
          <path
            d="M20 0 Q18 20 22 35 Q24 45 20 55"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeDasharray="4 3"
          />
          <path
            d="M12 48 L20 58 L28 48"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          />
        </svg>
      </section>

      {/* Topic Grid */}
      <section>
        <h2 className="mb-8 text-center text-3xl font-bold md:text-4xl">
          Pick a Topic
          <span className="ml-2 inline-block border-b-[3px] border-dashed border-marker-red" />
        </h2>

        <div className="grid gap-8 md:grid-cols-2">
          {topics.map((topic) => {
            const Icon = topic.icon;
            return (
              <Link key={topic.id} to={`/topic/${topic.id}`} className="group">
                <Card
                  decoration={topic.decoration}
                  className={`${topic.rotation} transition-all duration-100 group-hover:shadow-sketch group-hover:rotate-0`}
                >
                  <div className="flex items-start gap-4">
                    <div className="wobbly-sm flex h-14 w-14 shrink-0 items-center justify-center border-2 border-pencil bg-postit">
                      <Icon size={28} strokeWidth={2.5} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading text-2xl font-bold">
                        {topic.title}
                      </h3>
                      <p className="mt-1 text-lg text-pencil/60">
                        {topic.description}
                      </p>
                    </div>
                    <ArrowRight
                      size={24}
                      strokeWidth={2.5}
                      className="mt-1 shrink-0 text-pencil/30 transition-all group-hover:translate-x-1 group-hover:text-marker-red"
                    />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
