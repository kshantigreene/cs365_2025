import { useQuery } from "@tanstack/react-query";
import type { Meal } from "../types/meal";
import { buildMeals, fetchMenuRecords } from "./menu";

async function fetchMeals(): Promise<Meal[]> {
  const records = await fetchMenuRecords();
  return buildMeals(records);
}

export function useMeals() {
  return useQuery({
    queryKey: ["meals"],
    queryFn: fetchMeals,
    staleTime: 1000 * 60 * 5
  });
}



