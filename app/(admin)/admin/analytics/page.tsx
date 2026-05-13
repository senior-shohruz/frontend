"use client";

import { useQuery } from "@tanstack/react-query";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { adminApi } from "@/lib/endpoints";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/feedback";

const COLORS = ["#d97a2c", "#34322d", "#9c988e", "#d2cfc8", "#e29547"];

export default function AdminAnalyticsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: adminApi.dashboard,
  });

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-8 space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid lg:grid-cols-2 gap-6">
          <Skeleton className="h-72" />
          <Skeleton className="h-72" />
        </div>
      </div>
    );
  }

  const popularData = data?.popular_courses?.map((c) => ({
    name: c.title.length > 20 ? c.title.slice(0, 20) + "…" : c.title,
    enrolled: c.enrolled_users,
    completion: Math.round(c.completion_rate),
  })) ?? [];

  const distributionData = [
    { name: "Active (7d)", value: data?.active_users_last_7d ?? 0 },
    { name: "Inactive", value: Math.max(0, (data?.total_users ?? 0) - (data?.active_users_last_7d ?? 0)) },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-10 py-8 lg:py-12 space-y-10">
      <header>
        <p className="text-2xs font-mono uppercase tracking-[0.18em] text-ink-500 mb-2">
          Admin · Analytics
        </p>
        <h1 className="font-display text-4xl text-ink-900 leading-tight">
          The <span className="italic text-accent-600">numbers</span>.
        </h1>
        <p className="text-ink-500 mt-1">
          Detailed metrics across users, courses, and engagement.
        </p>
      </header>

      {/* Headline metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricBlock label="Total users" value={data?.total_users ?? 0} />
        <MetricBlock label="Active 7d" value={data?.active_users_last_7d ?? 0} />
        <MetricBlock label="New 30d" value={data?.new_users_last_30d ?? 0} />
        <MetricBlock label="Quiz attempts" value={data?.total_quiz_attempts ?? 0} />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Course enrollment</CardTitle>
          </CardHeader>
          <CardBody>
            {popularData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={popularData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="2 2" stroke="#e6e4e0" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="#6b675e"
                    tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }}
                  />
                  <YAxis
                    stroke="#6b675e"
                    tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "white",
                      border: "1px solid #e6e4e0",
                      borderRadius: "8px",
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="enrolled" fill="#d97a2c" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-sm text-ink-400">
                No enrollment data yet
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User activity (7-day)</CardTitle>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {distributionData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "white",
                    border: "1px solid #e6e4e0",
                    borderRadius: "8px",
                    fontSize: 12,
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: 12, fontFamily: "JetBrains Mono" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Course completion rates</CardTitle>
          </CardHeader>
          <CardBody>
            {popularData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={popularData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="2 2" stroke="#e6e4e0" vertical={false} />
                  <XAxis dataKey="name" stroke="#6b675e" tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }} />
                  <YAxis stroke="#6b675e" tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }} unit="%" />
                  <Tooltip
                    contentStyle={{
                      background: "white",
                      border: "1px solid #e6e4e0",
                      borderRadius: "8px",
                      fontSize: 12,
                    }}
                    formatter={(value: number) => `${value}%`}
                  />
                  <Bar dataKey="completion" fill="#34322d" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-sm text-ink-400">
                No completion data yet
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

function MetricBlock({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white border border-ink-200/70 rounded-lg p-5">
      <p className="text-2xs font-mono uppercase tracking-wider text-ink-500 mb-2">{label}</p>
      <p className="font-display text-3xl text-ink-900">{value.toLocaleString()}</p>
    </div>
  );
}
