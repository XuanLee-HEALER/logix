import { Link } from "react-router";
import { Card } from "@/components/Card";
import { ColumnSelector } from "@/components/ColumnSelector";
import { usePreferences } from "@/hooks/usePreferences";
import { CircleDot, ToggleRight, ArrowRight, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { LucideIcon } from "lucide-react";

/* ── Static topic definitions ── */

interface TopicDef {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  rotation: string;
  decoration: "tape" | "tack";
}

const topicMap: Record<string, TopicDef> = {
  "boolean-algebra": {
    id: "boolean-algebra",
    title: "布尔运算图解",
    description: "韦恩图 + 集合视角理解布尔代数定律",
    icon: CircleDot,
    rotation: "-rotate-1",
    decoration: "tape",
  },
  latches: {
    id: "latches",
    title: "锁存器电路图解",
    description: "交互式探索 SR 锁存器与 D 锁存器",
    icon: ToggleRight,
    rotation: "rotate-1",
    decoration: "tack",
  },
};

const defaultOrder = Object.keys(topicMap);

/* ── Column class mapping ── */

const colClass: Record<number, string> = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
};

/* ── Sortable topic card ── */

function SortableTopicCard({ topic }: { topic: TopicDef }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: topic.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.85 : undefined,
  };

  const Icon = topic.icon;

  return (
    <div ref={setNodeRef} style={style} className="relative">
      {/* Drag handle — desktop only */}
      <button
        {...attributes}
        {...listeners}
        className="absolute -left-2 top-1/2 z-10 hidden -translate-y-1/2 cursor-grab touch-none text-pencil/20 transition-colors hover:text-pencil/50 active:cursor-grabbing md:block"
        aria-label="拖拽排序"
      >
        <GripVertical size={18} strokeWidth={2.5} />
      </button>

      <Link to={`/topic/${topic.id}`} className="group block">
        <Card
          decoration={topic.decoration}
          className={`${topic.rotation} transition-all duration-100 group-hover:shadow-sketch group-hover:rotate-0 ${isDragging ? "rotate-2 shadow-sketch-lg" : ""}`}
        >
          <div className="flex items-start gap-4">
            <div className="wobbly-sm flex h-14 w-14 shrink-0 items-center justify-center border-2 border-pencil bg-postit">
              <Icon size={28} strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <h3 className="font-heading text-2xl font-bold">{topic.title}</h3>
              <p className="mt-1 text-lg text-pencil/60">{topic.description}</p>
            </div>
            <ArrowRight
              size={24}
              strokeWidth={2.5}
              className="mt-1 shrink-0 text-pencil/30 transition-all group-hover:translate-x-1 group-hover:text-marker-red"
            />
          </div>
        </Card>
      </Link>
    </div>
  );
}

/* ── Home page ── */

export default function Home() {
  const { topicOrder, columns, setTopicOrder, setColumns } =
    usePreferences(defaultOrder);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 5 },
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIdx = topicOrder.indexOf(String(active.id));
      const newIdx = topicOrder.indexOf(String(over.id));
      setTopicOrder(arrayMove(topicOrder, oldIdx, newIdx));
    }
  }

  const orderedTopics = topicOrder
    .map((id) => topicMap[id])
    .filter((t): t is TopicDef => !!t);

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
        <div className="mb-8 flex items-center justify-center gap-4">
          <h2 className="text-center text-3xl font-bold md:text-4xl">
            Pick a Topic
            <span className="ml-2 inline-block border-b-[3px] border-dashed border-marker-red" />
          </h2>
          <ColumnSelector value={columns} onChange={setColumns} />
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={orderedTopics.map((t) => t.id)}
            strategy={rectSortingStrategy}
          >
            <div
              className={`grid gap-8 ${colClass[columns] ?? "md:grid-cols-2"}`}
            >
              {orderedTopics.map((topic) => (
                <SortableTopicCard key={topic.id} topic={topic} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </section>
    </div>
  );
}
