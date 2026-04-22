import React, { useState, useMemo } from "react";
import { Search, X, Bookmark, BookmarkCheck, ChevronDown, ChevronRight, Zap, Filter, Tag, Copy, Check } from "lucide-react";
import { TCODES, type TCode } from "@/data/tcodesData";

const QUICK_FILTERS = [
  { label: "High Priority", value: "high", type: "priority", color: "bg-red-100 text-red-700 border-red-200" },
  { label: "Monitoring", value: "monitoring", type: "tag", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { label: "Security", value: "security", type: "tag", color: "bg-purple-100 text-purple-700 border-purple-200" },
  { label: "Jobs", value: "jobs", type: "tag", color: "bg-amber-100 text-amber-700 border-amber-200" },
  { label: "Transport", value: "transport", type: "tag", color: "bg-green-100 text-green-700 border-green-200" },
  { label: "Performance", value: "performance", type: "tag", color: "bg-teal-100 text-teal-700 border-teal-200" },
];

const PRIORITY_COLOR: Record<string, string> = {
  high: "bg-red-100 text-red-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-gray-100 text-gray-600",
};

const CATEGORY_COLOR_MAP: Record<string, string> = {
  "Work Processes": "bg-blue-100 text-blue-700",
  "Background Jobs": "bg-amber-100 text-amber-700",
  "Software Maintenance": "bg-purple-100 text-purple-700",
  "Client Administration": "bg-green-100 text-green-700",
  "System Administration": "bg-slate-100 text-slate-700",
  "Transport Management": "bg-emerald-100 text-emerald-700",
  "User & Security": "bg-rose-100 text-rose-700",
  "Spool & Output": "bg-orange-100 text-orange-700",
  "Database & Performance": "bg-indigo-100 text-indigo-700",
  "Monitoring & Alerts": "bg-cyan-100 text-cyan-700",
  "Fiori / Gateway": "bg-violet-100 text-violet-700",
  "ABAP Development": "bg-fuchsia-100 text-fuchsia-700",
  "IDocs & Interfaces": "bg-yellow-100 text-yellow-700",
  "Archive & ILM": "bg-stone-100 text-stone-700",
  "Solution Manager": "bg-lime-100 text-lime-700",
  "Cloud ALM": "bg-sky-100 text-sky-700",
  "Network & RFC": "bg-teal-100 text-teal-700",
  "Dumps & Logs": "bg-red-100 text-red-700",
};

function categoryColor(cat: string) {
  return CATEGORY_COLOR_MAP[cat] || "bg-gray-100 text-gray-600";
}

const CORE_BASIS_CATS = ["Work Processes", "Background Jobs", "Software Maintenance", "Client Administration", "System Administration", "Transport Management", "User & Security", "Spool & Output"];
const S4_PLATFORM_CATS = ["Cloud ALM", "Fiori / Gateway", "Archive & ILM", "Solution Manager", "License & Measurement"];

function sectionOf(cat: string): "CORE BASIS" | "S/4 & PLATFORM" | "OTHER" {
  if (CORE_BASIS_CATS.includes(cat)) return "CORE BASIS";
  if (S4_PLATFORM_CATS.includes(cat)) return "S/4 & PLATFORM";
  return "OTHER";
}

const BOOKMARK_KEY = "basispro_tc_bookmarks";
function loadBookmarks(): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem(BOOKMARK_KEY) || "[]")); } catch { return new Set(); }
}
function saveBookmarks(bm: Set<string>) {
  localStorage.setItem(BOOKMARK_KEY, JSON.stringify(Array.from(bm)));
}

// Count most-viewed from localStorage
const VIEWS_KEY = "basispro_tc_views";
function loadViews(): Record<string, number> {
  try { return JSON.parse(localStorage.getItem(VIEWS_KEY) || "{}"); } catch { return {}; }
}
function recordView(code: string) {
  const v = loadViews();
  v[code] = (v[code] || 0) + 1;
  localStorage.setItem(VIEWS_KEY, JSON.stringify(v));
}

interface ModalProps {
  tc: TCode;
  bookmarked: boolean;
  onBookmark: () => void;
  onClose: () => void;
}

function TCodeModal({ tc, bookmarked, onBookmark, onClose }: ModalProps) {
  const [copied, setCopied] = useState(false);

  function copyCode() {
    navigator.clipboard.writeText(tc.code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between p-5 pb-3 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <button
                onClick={copyCode}
                className="font-mono text-xl font-bold text-[#0070F2] hover:underline flex items-center gap-1.5"
              >
                {tc.code}
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 opacity-50" />}
              </button>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${PRIORITY_COLOR[tc.priority] || "bg-gray-100 text-gray-600"}`}>
                {tc.priority?.toUpperCase()}
              </span>
            </div>
            <div className="font-semibold text-base text-gray-800">{tc.name}</div>
            <div className="text-xs text-gray-400 mt-0.5">{tc.top_level_area}</div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Description */}
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Description</div>
            <p className="text-sm text-gray-700 leading-relaxed">{tc.description}</p>
          </div>

          {/* Use When */}
          {tc.when_to_use && (
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Use When</div>
              <p className="text-sm text-gray-600 leading-relaxed">{tc.when_to_use}</p>
            </div>
          )}

          {/* Steps */}
          {tc.steps && tc.steps.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Step-by-Step</div>
              <ol className="space-y-1.5">
                {tc.steps.map((step, i) => (
                  <li key={i} className="flex gap-2.5 text-sm text-gray-700">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#0070F2]/10 text-[#0070F2] flex items-center justify-center text-xs font-bold">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Category + tags */}
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Category</div>
            <div className="flex flex-wrap gap-1.5">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${categoryColor(tc.category)}`}>
                {tc.category}
              </span>
              {tc.tags.slice(0, 4).map((tag) => (
                <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 p-4 pt-0">
          <button
            onClick={onBookmark}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              bookmarked
                ? "bg-amber-50 text-amber-700 border border-amber-200"
                : "bg-[#0070F2] text-white hover:bg-[#0060D8]"
            }`}
          >
            {bookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            {bookmarked ? "Bookmarked" : "Bookmark"}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

interface CardProps {
  tc: TCode;
  bookmarked: boolean;
  onOpen: () => void;
  onToggleBookmark: (e: React.MouseEvent) => void;
}

function TCodeCard({ tc, bookmarked, onOpen, onToggleBookmark }: CardProps) {
  return (
    <div
      onClick={onOpen}
      className="bg-white border border-gray-200 rounded-xl p-4 cursor-pointer hover:shadow-md hover:border-[#0070F2]/30 transition-all group"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-mono text-sm font-bold text-[#0070F2]">{tc.code}</span>
          {tc.source_system === "Manual" && (
            <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">Manual</span>
          )}
        </div>
        <button
          onClick={onToggleBookmark}
          className={`p-1 rounded-lg transition-colors ${bookmarked ? "text-amber-500" : "text-gray-300 hover:text-amber-400"}`}
        >
          {bookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
        </button>
      </div>
      <div className="text-sm font-semibold text-gray-800 mb-1.5 line-clamp-1 group-hover:text-[#0070F2] transition-colors">
        {tc.name}
      </div>
      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3">{tc.description}</p>
      <div className="flex flex-wrap gap-1">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${categoryColor(tc.category)}`}>
          {tc.category}
        </span>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${PRIORITY_COLOR[tc.priority] || "bg-gray-100 text-gray-600"}`}>
          {tc.priority}
        </span>
        {tc.tags.slice(0, 2).map((tag) => (
          <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function TCodeLibrary() {
  const [search, setSearch] = useState("");
  const [activeQF, setActiveQF] = useState<string | null>(null);
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [modal, setModal] = useState<TCode | null>(null);
  const [bookmarks, setBookmarks] = useState<Set<string>>(loadBookmarks);
  const [views] = useState<Record<string, number>>(loadViews);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    "CORE BASIS": true, "S/4 & PLATFORM": true, "OTHER": true,
  });
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);

  // Category counts (all TCodes)
  const catCounts = useMemo(() => {
    const m: Record<string, number> = {};
    TCODES.forEach((t) => { m[t.category] = (m[t.category] || 0) + 1; });
    return m;
  }, []);

  // Most used
  const mostUsed = useMemo(() => {
    return Object.entries(views)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([code]) => TCODES.find((t) => t.code === code))
      .filter(Boolean) as TCode[];
  }, [views]);

  // Filtered TCodes
  const filtered = useMemo(() => {
    let result = TCODES;
    if (showBookmarkedOnly) result = result.filter((t) => bookmarks.has(t.code));
    if (selectedCat) result = result.filter((t) => t.category === selectedCat);
    if (activeQF) {
      const qf = QUICK_FILTERS.find((f) => f.label === activeQF);
      if (qf) {
        if (qf.type === "priority") result = result.filter((t) => t.priority === qf.value);
        else result = result.filter((t) => t.tags.includes(qf.value));
      }
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      // support wildcard pattern like sm*
      if (q.endsWith("*")) {
        const prefix = q.slice(0, -1);
        result = result.filter(
          (t) => t.code.toLowerCase().startsWith(prefix) || t.name.toLowerCase().startsWith(prefix)
        );
      } else {
        result = result.filter(
          (t) =>
            t.code.toLowerCase().includes(q) ||
            t.name.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q) ||
            t.when_to_use.toLowerCase().includes(q) ||
            t.category.toLowerCase().includes(q) ||
            t.tags.some((tag) => tag.includes(q))
        );
      }
    }
    return result;
  }, [search, activeQF, selectedCat, showBookmarkedOnly, bookmarks]);

  // Group filtered by section + category
  const grouped = useMemo(() => {
    const sections: Record<string, Record<string, TCode[]>> = {
      "CORE BASIS": {}, "S/4 & PLATFORM": {}, "OTHER": {},
    };
    filtered.forEach((t) => {
      const sec = sectionOf(t.category);
      if (!sections[sec][t.category]) sections[sec][t.category] = [];
      sections[sec][t.category].push(t);
    });
    return sections;
  }, [filtered]);

  function toggleBookmark(code: string, e?: React.MouseEvent) {
    e?.stopPropagation();
    const bm = new Set(bookmarks);
    if (bm.has(code)) bm.delete(code);
    else bm.add(code);
    setBookmarks(bm);
    saveBookmarks(bm);
  }

  function openModal(tc: TCode) {
    recordView(tc.code);
    setModal(tc);
  }

  // All categories for sidebar
  const allCats = useMemo(() => {
    const secs: Record<string, string[]> = { "CORE BASIS": [], "S/4 & PLATFORM": [], "OTHER": [] };
    Object.keys(catCounts).forEach((cat) => secs[sectionOf(cat)].push(cat));
    Object.values(secs).forEach((arr) =>
      arr.sort((a, b) => (catCounts[b] || 0) - (catCounts[a] || 0))
    );
    return secs;
  }, [catCounts]);

  return (
    <div className="flex h-full min-h-[calc(100vh-120px)] gap-0 -m-4 md:-m-6">
      {/* ── Left Sidebar ── */}
      <aside className="hidden lg:flex flex-col w-56 flex-shrink-0 bg-gray-50 border-r border-gray-200 overflow-y-auto">
        <div className="p-3 space-y-0.5">
          {/* ALL */}
          <button
            onClick={() => { setSelectedCat(null); setShowBookmarkedOnly(false); }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              !selectedCat && !showBookmarkedOnly ? "bg-[#0070F2] text-white" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <span>All TCodes</span>
            <span className={`text-xs rounded-full px-2 py-0.5 font-semibold ${!selectedCat && !showBookmarkedOnly ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"}`}>
              {TCODES.length}
            </span>
          </button>

          {/* Bookmarked */}
          <button
            onClick={() => { setSelectedCat(null); setShowBookmarkedOnly(true); }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              showBookmarkedOnly ? "bg-amber-100 text-amber-800" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5" /> Bookmarked
            </span>
            <span className="text-xs rounded-full px-2 py-0.5 font-semibold bg-amber-200 text-amber-800">{bookmarks.size}</span>
          </button>

          {/* Most Used */}
          {mostUsed.length > 0 && (
            <div className="pt-3">
              <div className="px-3 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider">Most Used</div>
              {mostUsed.map((tc, i) => (
                <button
                  key={tc.code}
                  onClick={() => openModal(tc)}
                  className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-gray-600 hover:bg-gray-100 transition-colors text-left"
                >
                  <span className="text-gray-400">{i + 1}.</span>
                  <span className="font-mono font-semibold text-[#0070F2]">{tc.code}</span>
                  <span className="truncate">{tc.name.substring(0, 18)}</span>
                </button>
              ))}
            </div>
          )}

          {/* Sections */}
          {(["CORE BASIS", "S/4 & PLATFORM", "OTHER"] as const).map((sec) => (
            <div key={sec} className="pt-3">
              <button
                onClick={() => setExpandedSections((p) => ({ ...p, [sec]: !p[sec] }))}
                className="w-full flex items-center justify-between px-3 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider hover:text-gray-600 transition-colors"
              >
                <span>{sec}</span>
                {expandedSections[sec] ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              </button>
              {expandedSections[sec] && allCats[sec].map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setSelectedCat(cat); setShowBookmarkedOnly(false); }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedCat === cat ? "bg-[#0070F2]/10 text-[#0070F2] font-semibold" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <span className="truncate text-left">{cat}</span>
                  <span className="text-xs text-gray-400 flex-shrink-0 ml-1">{catCounts[cat] || 0}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="p-4 md:p-5 border-b border-gray-200 bg-white space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h1 className="text-lg font-extrabold text-gray-900">TCode Library</h1>
              <p className="text-xs text-gray-400">{TCODES.length} SAP transaction codes — curated for SAP Basis consultants</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="font-medium">Total {TCODES.length}</span>
              <span className="text-gray-300">|</span>
              <span>Showing <span className="font-semibold text-gray-700">{filtered.length}</span></span>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search code, name, description, scenario… (sm* for pattern)"
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0070F2]/30 focus:border-[#0070F2] transition-all"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-gray-400 flex items-center gap-1"><Filter className="w-3 h-3" /> Quick Filter:</span>
            {QUICK_FILTERS.map((f) => (
              <button
                key={f.label}
                onClick={() => setActiveQF(activeQF === f.label ? null : f.label)}
                className={`text-xs font-medium px-3 py-1 rounded-full border transition-all ${
                  activeQF === f.label ? f.color + " border-current shadow-sm" : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                {f.label}
              </button>
            ))}
            {(search || activeQF || selectedCat || showBookmarkedOnly) && (
              <button
                onClick={() => { setSearch(""); setActiveQF(null); setSelectedCat(null); setShowBookmarkedOnly(false); }}
                className="text-xs font-medium px-3 py-1 rounded-full border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-colors ml-auto"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Cards area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-5">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Search className="w-10 h-10 text-gray-300 mb-3" />
              <div className="text-gray-500 font-medium">No TCodes match your filters</div>
              <div className="text-sm text-gray-400 mt-1">Try a different search term or clear filters</div>
            </div>
          ) : (
            <div className="space-y-6">
              {(["CORE BASIS", "S/4 & PLATFORM", "OTHER"] as const).map((sec) => {
                const secCats = grouped[sec];
                const cats = Object.entries(secCats).filter(([, arr]) => arr.length > 0);
                if (cats.length === 0) return null;
                return (
                  <div key={sec}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">{sec}</div>
                      <div className="flex-1 h-px bg-gray-100" />
                      <div className="text-xs text-gray-400">{cats.reduce((a, [, arr]) => a + arr.length, 0)}</div>
                    </div>
                    {cats.map(([cat, tcs]) => (
                      <div key={cat} className="mb-5">
                        <div className="flex items-center gap-2 mb-2.5">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColor(cat)}`}>
                            {cat}
                          </span>
                          <span className="text-xs text-gray-400">{tcs.length}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3">
                          {tcs.map((tc) => (
                            <TCodeCard
                              key={tc.code}
                              tc={tc}
                              bookmarked={bookmarks.has(tc.code)}
                              onOpen={() => openModal(tc)}
                              onToggleBookmark={(e) => toggleBookmark(tc.code, e)}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <TCodeModal
          tc={modal}
          bookmarked={bookmarks.has(modal.code)}
          onBookmark={() => toggleBookmark(modal.code)}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
