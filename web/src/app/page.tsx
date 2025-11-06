'use client';

import { useMemo, useState } from "react";

type TestStatus = "pass" | "fail" | "blocked" | "in-progress";

type TestCase = {
  id: string;
  name: string;
  description: string;
  environment: string;
  status: TestStatus;
  lastUpdated: string;
};

const STATUS_OPTIONS: { value: TestStatus; label: string }[] = [
  { value: "in-progress", label: "In Progress" },
  { value: "pass", label: "Pass" },
  { value: "fail", label: "Fail" },
  { value: "blocked", label: "Blocked" },
];

const INITIAL_TESTS: TestCase[] = [
  {
    id: "seed-1",
    name: "User can log in",
    description:
      "Verify login flow succeeds with valid credentials and redirects to dashboard.",
    environment: "Web",
    status: "in-progress",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "seed-2",
    name: "Pricing table renders",
    description:
      "Ensure pricing rows render correctly on mobile and desktop layouts.",
    environment: "Regression",
    status: "pass",
    lastUpdated: new Date().toISOString(),
  },
];

export default function Home() {
  const [tests, setTests] = useState<TestCase[]>(INITIAL_TESTS);
  const [filter, setFilter] = useState<TestStatus | "all">("all");
  const [form, setForm] = useState({
    name: "",
    description: "",
    environment: "",
    status: "in-progress" as TestStatus,
  });

  const filtered = useMemo(
    () =>
      filter === "all"
        ? tests
        : tests.filter((test) => test.status === filter),
    [filter, tests],
  );

  const stats = useMemo(() => {
    const totals: Record<TestStatus, number> = {
      pass: 0,
      fail: 0,
      blocked: 0,
      "in-progress": 0,
    };

    tests.forEach((test) => {
      totals[test.status] += 1;
    });

    return totals;
  }, [tests]);

  const addTest = () => {
    if (!form.name.trim() || !form.description.trim()) {
      return;
    }

    const newTest: TestCase = {
      id: crypto.randomUUID(),
      name: form.name.trim(),
      description: form.description.trim(),
      environment: form.environment.trim() || "General",
      status: form.status,
      lastUpdated: new Date().toISOString(),
    };

    setTests((prev) => [newTest, ...prev]);
    setForm({
      name: "",
      description: "",
      environment: "",
      status: "in-progress",
    });
  };

  const updateStatus = (id: string, status: TestStatus) => {
    setTests((prev) =>
      prev.map((test) =>
        test.id === id
          ? { ...test, status, lastUpdated: new Date().toISOString() }
          : test,
      ),
    );
  };

  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat("en", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-950 to-black text-white">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 pb-16 pt-20 lg:px-10">
        <header>
          <p className="text-sm uppercase tracking-[0.3em] text-purple-400">
            Rapid Test Ops
          </p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight md:text-5xl">
            Build and track lightweight quality checks in minutes.
          </h1>
          <p className="mt-4 max-w-2xl text-base text-zinc-300 md:text-lg">
            Organize exploratory sessions, smoke tests, and regression sweeps in
            a single streamlined dashboard. Capture context, track status, and
            highlight blockers without leaving the browser.
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-purple-500/10 backdrop-blur">
            <h2 className="text-xl font-semibold">Add a quick test</h2>
            <p className="mt-2 text-sm text-zinc-300">
              Capture a new scenario and drop it into the flow. Fields marked *
              are required.
            </p>
            <div className="mt-6 grid gap-4">
              <label className="grid gap-2 text-sm">
                <span className="font-medium text-zinc-100">Name *</span>
                <input
                  value={form.name}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, name: event.target.value }))
                  }
                  placeholder="Payment flow sanity"
                  className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-base text-white outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-500/50"
                />
              </label>
              <label className="grid gap-2 text-sm">
                <span className="font-medium text-zinc-100">Description *</span>
                <textarea
                  value={form.description}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      description: event.target.value,
                    }))
                  }
                  placeholder="Walk through payment with valid card and ensure confirmation screen renders with accurate totals."
                  rows={3}
                  className="min-h-24 rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-base text-white outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-500/50"
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm">
                  <span className="font-medium text-zinc-100">
                    Environment / Track
                  </span>
                  <input
                    value={form.environment}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        environment: event.target.value,
                      }))
                    }
                    placeholder="Checkout"
                    className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-base text-white outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-500/50"
                  />
                </label>
                <label className="grid gap-2 text-sm">
                  <span className="font-medium text-zinc-100">Status</span>
                  <select
                    value={form.status}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        status: event.target.value as TestStatus,
                      }))
                    }
                    className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-base text-white outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-500/50"
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                        className="bg-zinc-900 text-white"
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
            <button
              onClick={addTest}
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 via-fuchsia-500 to-indigo-500 px-6 py-3 text-sm font-semibold shadow-lg shadow-purple-600/30 transition hover:scale-[1.01] hover:shadow-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-400/70 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Add Test Case
            </button>
          </div>

          <aside className="flex flex-col gap-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-purple-500/10 backdrop-blur">
              <h2 className="text-xl font-semibold">Status snapshot</h2>
              <p className="mt-2 text-sm text-zinc-300">
                Track throughput across your current suite.
              </p>
              <dl className="mt-6 grid gap-4 text-sm text-zinc-200">
                <div className="flex items-center justify-between rounded-2xl bg-black/40 px-4 py-3">
                  <dt className="font-medium text-green-300">Passing</dt>
                  <dd className="text-lg font-semibold text-white">
                    {stats.pass}
                  </dd>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-black/40 px-4 py-3">
                  <dt className="font-medium text-amber-300">In progress</dt>
                  <dd className="text-lg font-semibold text-white">
                    {stats["in-progress"]}
                  </dd>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-black/40 px-4 py-3">
                  <dt className="font-medium text-rose-300">Failing</dt>
                  <dd className="text-lg font-semibold text-white">
                    {stats.fail}
                  </dd>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-black/40 px-4 py-3">
                  <dt className="font-medium text-blue-300">Blocked</dt>
                  <dd className="text-lg font-semibold text-white">
                    {stats.blocked}
                  </dd>
                </div>
              </dl>
              <label className="mt-6 grid gap-2 text-sm">
                <span className="font-medium text-zinc-100">Filter</span>
                <select
                  value={filter}
                  onChange={(event) =>
                    setFilter(event.target.value as TestStatus | "all")
                  }
                  className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-base text-white outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-500/50"
                >
                  <option value="all" className="bg-zinc-900 text-white">
                    All statuses
                  </option>
                  {STATUS_OPTIONS.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      className="bg-zinc-900 text-white"
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-purple-500/20 via-fuchsia-500/10 to-indigo-500/20 p-[1px]">
              <div className="h-full rounded-[calc(1.5rem-2px)] bg-zinc-950 p-6">
                <h3 className="text-base font-semibold text-purple-200">
                  Pro tip
                </h3>
                <p className="mt-2 text-sm text-zinc-300">
                  Use a consistent naming convention like{" "}
                  <span className="font-semibold text-purple-200">
                    Feature - Scenario - Expectation
                  </span>{" "}
                  to keep large suites tame and searchable.
                </p>
              </div>
            </div>
          </aside>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-purple-500/10 backdrop-blur">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Active test cases</h2>
              <p className="text-sm text-zinc-300">
                Click a status pill to adjust progress on the fly.
              </p>
            </div>
            <p className="text-sm text-zinc-300">
              Showing{" "}
              <span className="font-semibold text-white">
                {filtered.length}
              </span>{" "}
              out of {tests.length} tests
            </p>
          </div>

          <div className="mt-6 grid gap-4">
            {filtered.length === 0 && (
              <div className="rounded-2xl border border-dashed border-white/20 bg-black/40 px-4 py-8 text-center text-sm text-zinc-400">
                Nothing to see here yet. Add a test case or switch filters.
              </div>
            )}

            {filtered.map((test) => (
              <article
                key={test.id}
                className="group rounded-2xl border border-white/10 bg-black/40 p-5 transition hover:border-purple-400/60 hover:bg-purple-500/10"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold text-white">
                        {test.name}
                      </h3>
                      <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs uppercase tracking-wide text-purple-200">
                        {test.environment || "General"}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-zinc-300">
                      {test.description}
                    </p>
                  </div>
                  <div className="flex flex-col items-start gap-3 sm:items-end">
                    <div className="flex flex-wrap gap-2">
                      {STATUS_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => updateStatus(test.id, option.value)}
                          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide transition ${
                            test.status === option.value
                              ? "bg-purple-500 text-white shadow-lg shadow-purple-500/40"
                              : "bg-white/10 text-zinc-200 hover:bg-white/20"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-zinc-400">
                      Updated {formatDate(test.lastUpdated)}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
