import { useState, useEffect, useCallback } from "react";
import { getPreferences, putPreferences } from "@/lib/api";

const DEFAULT_COLUMNS = 2;

export function usePreferences(defaultTopicOrder: string[]) {
  const [topicOrder, setTopicOrderState] = useState(defaultTopicOrder);
  const [columns, setColumnsState] = useState(DEFAULT_COLUMNS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getPreferences().then((prefs) => {
      if (prefs) {
        // Merge: keep saved order but include any new topics not yet in the list
        const known = new Set(prefs.topicOrder);
        const merged = [
          ...prefs.topicOrder.filter((id) => defaultTopicOrder.includes(id)),
          ...defaultTopicOrder.filter((id) => !known.has(id)),
        ];
        setTopicOrderState(merged);
        setColumnsState(prefs.columns);
      }
      setLoaded(true);
    });
  }, []);

  const save = useCallback((order: string[], cols: number) => {
    putPreferences({ topicOrder: order, columns: cols });
  }, []);

  const setTopicOrder = useCallback(
    (order: string[]) => {
      setTopicOrderState(order);
      save(order, columns);
    },
    [columns, save],
  );

  const setColumns = useCallback(
    (cols: number) => {
      setColumnsState(cols);
      save(topicOrder, cols);
    },
    [topicOrder, save],
  );

  return { topicOrder, columns, setTopicOrder, setColumns, loaded };
}
