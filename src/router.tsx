import { Routes, Route } from "react-router";
import { Layout } from "@/components/Layout";
import Home from "@/pages/Home";
import BooleanAlgebra from "@/topics/boolean-algebra";
import Latches from "@/topics/latches";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="topic/boolean-algebra" element={<BooleanAlgebra />} />
        <Route path="topic/latches" element={<Latches />} />
      </Route>
    </Routes>
  );
}
