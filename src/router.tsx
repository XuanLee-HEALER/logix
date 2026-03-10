import { Routes, Route } from "react-router";
import { Layout } from "@/components/Layout";
import Home from "@/pages/Home";
import BooleanAlgebra from "@/topics/boolean-algebra";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="topic/boolean-algebra" element={<BooleanAlgebra />} />
      </Route>
    </Routes>
  );
}
