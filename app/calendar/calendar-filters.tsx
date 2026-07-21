"use client";

import { useRouter, useSearchParams } from "next/navigation";

type Category = {
  id: string;
  slug: string;
  name: string;
};

export function CalendarFilters({
  categories,
  month,
  prevMonth,
  nextMonth,
}: {
  categories: Category[];
  month: string;
  prevMonth: string;
  nextMonth: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function goToMonth(nextValue: string) {
    const params = new URLSearchParams(searchParams);
    params.set("month", nextValue);
    router.push(`/calendar?${params.toString()}`);
  }

  function handleCategoryChange(slug: string) {
    const params = new URLSearchParams(searchParams);
    if (slug === "all") {
      params.delete("category");
    } else {
      params.set("category", slug);
    }
    router.push(`/calendar?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <button
          onClick={() => goToMonth(prevMonth)}
          className="rounded-md border border-neutral-700 px-2 py-1 text-sm text-neutral-300"
        >
          ← Mes anterior
        </button>
        <span className="text-sm font-medium text-neutral-50">{month}</span>
        <button
          onClick={() => goToMonth(nextMonth)}
          className="rounded-md border border-neutral-700 px-2 py-1 text-sm text-neutral-300"
        >
          Mes siguiente →
        </button>
      </div>

      <select
        defaultValue={searchParams.get("category") ?? "all"}
        onChange={(event) => handleCategoryChange(event.target.value)}
        className="rounded-md border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-sm text-neutral-50"
      >
        <option value="all">Todas las categorías</option>
        {categories.map((category) => (
          <option key={category.id} value={category.slug}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
}
