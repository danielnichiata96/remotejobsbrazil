"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

function useUrlParams() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const setParam = (key: string, value?: string) => {
    const params = new URLSearchParams(sp?.toString());
    if (value && value.length > 0) params.set(key, value);
    else params.delete(key);
    // reset page when filters change
    params.delete("page");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  return { sp, setParam };
}

export default function SidebarFilters() {
  const { sp, setParam } = useUrlParams();

  // Type (single select via checkboxes behaviour)
  const currentType = sp?.get("type") || "";
  const toggleType = (val: string) => {
    setParam("type", currentType === val ? undefined : val);
  };

  // Tags (multi via CSV)
  const currentTagsStr = sp?.get("tags") || "";
  const currentTags = currentTagsStr
    ? currentTagsStr.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean)
    : [];
  const hasTag = (t: string) => currentTags.includes(t);
  const toggleTag = (t: string) => {
    const next = hasTag(t)
      ? currentTags.filter((x) => x !== t)
      : [...currentTags, t];
    setParam("tags", next.length ? next.join(",") : undefined);
  };

  // Location (single select)
  const currentLocation = sp?.get("location") || "";
  const changeLocation = (val?: string) => setParam("location", val);

  // Salary (single select: "0-3000", "3000-6000", "6000-10000", "10000+")
  const currentSalary = sp?.get("salary") || "";
  const changeSalary = (val?: string) => setParam("salary", val);

  const clearAll = () => {
    setParam("type", undefined);
    setParam("tags", undefined);
    setParam("location", undefined);
    setParam("salary", undefined);
  };

  return (
    <div>
      <h3 className="text-sm font-semibold text-[var(--color-foreground)]">Filters</h3>
      <div className="mt-4 space-y-3 text-sm text-[var(--color-foreground)]/70">
        {/* Type */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="size-4"
            checked={currentType === "full-time"}
            onChange={() => toggleType("full-time")}
          />
          Full-time
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="size-4"
            checked={currentType === "part-time"}
            onChange={() => toggleType("part-time")}
          />
          Part-time
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="size-4"
            checked={currentType === "internship"}
            onChange={() => toggleType("internship")}
          />
          Internship
        </label>

        <div className="pt-3 border-t border-[var(--color-border)]" />

        {/* Tags -> mapped to `tags` CSV */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="size-4"
            checked={hasTag("design")}
            onChange={() => toggleTag("design")}
          />
          Design
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="size-4"
            checked={hasTag("front-end")}
            onChange={() => toggleTag("front-end")}
          />
          Front-end
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="size-4"
            checked={hasTag("back-end")}
            onChange={() => toggleTag("back-end")}
          />
          Back-end
        </label>

        <div className="pt-3 border-t border-[var(--color-border)]" />

        {/* Location */}
        <div className="space-y-2">
          <div className="text-[var(--color-foreground)] font-medium">Location</div>
          <select
            value={currentLocation}
            onChange={(e) => changeLocation(e.target.value || undefined)}
            className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md bg-transparent"
          >
            <option value="">All locations</option>
            <option value="remote">Remote</option>
            <option value="híbrido">Híbrido</option>
            <option value="são paulo">São Paulo</option>
            <option value="rio de janeiro">Rio de Janeiro</option>
            <option value="brasília">Brasília</option>
          </select>
        </div>

        {/* Salary */}
        <div className="space-y-2">
          <div className="text-[var(--color-foreground)] font-medium">Salary</div>
          <select
            value={currentSalary}
            onChange={(e) => changeSalary(e.target.value || undefined)}
            className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md bg-transparent"
          >
            <option value="">All salaries</option>
            <option value="0-3000">Até R$ 3.000</option>
            <option value="3000-6000">R$ 3.000 - R$ 6.000</option>
            <option value="6000-10000">R$ 6.000 - R$ 10.000</option>
            <option value="10000+">R$ 10.000+</option>
          </select>
        </div>

        <button
          type="button"
          onClick={clearAll}
          className="mt-3 text-xs underline text-[var(--color-foreground)]/70 hover:text-[var(--color-foreground)]"
        >
          Clear filters
        </button>
      </div>
    </div>
  );
}
