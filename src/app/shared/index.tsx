"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { format } from "date-fns";

type RawMetric = {
  results: {
    ts: number;
    id: number;
    user_id?: string;
  }[];
};

type ChartPoint = {
  date: string;
  value: number;
};

export function isSSR() {
  return typeof (globalThis as { window: unknown }).window === "undefined";
}

function transform(raw: RawMetric["results"]): ChartPoint[] {
  const map = new Map<string, number>();
  raw.forEach((r) => {
    const date = format(new Date(r.ts * 1000), "yyyy-MM-dd");
    map.set(date, (map.get(date) ?? 0) + 1);
  });
  return Array.from(map.entries())
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

async function fetchMetric(metric: string): Promise<RawMetric> {
  const { data } = await axios.get<RawMetric>(
    `https://cf-analytics-worker.romandreevichg.workers.dev/metrics/${metric}`
  );
  return data;
}

export function AnalyticsDashboard() {
  const [metric, setMetric] = useState<"users" | "paid_clicks" | "last_scenes">(
    "users"
  );
  const [raw, setRaw] = useState<RawMetric["results"]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isSSR()) {
      handleFetch(metric);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFetch = async (type: typeof metric) => {
    setLoading(true);
    try {
      const rows = await fetchMetric(type);
      setRaw((rows as RawMetric).results);
    } finally {
      setLoading(false);
    }
  };

  const points = transform(raw);

  return (
    <Card sx={{ maxWidth: 900, mx: "auto", p: 3 }}>
      <Typography variant="h4" mb={2}>
        Analytics Dashboard
      </Typography>
      <ToggleButtonGroup
        exclusive
        color="primary"
        value={metric}
        onChange={(_, val) => {
          if (val !== null) {
            setMetric(val);
            handleFetch(val);
          }
        }}
        sx={{ mb: 2 }}
      >
        <ToggleButton value="users">Новые пользователи</ToggleButton>
        <ToggleButton value="paid_clicks">Платные клики</ToggleButton>
        <ToggleButton value="last_scenes">Последняя сцена</ToggleButton>
      </ToggleButtonGroup>
      <CardContent sx={{ height: 320 }}>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <CircularProgress size={32} sx={{ mr: 1 }} />
            <Typography>Загрузка…</Typography>
          </Box>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={points}
              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="valueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="currentColor"
                    stopOpacity={0.8}
                  />
                  <stop offset="95%" stopColor="currentColor" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip formatter={(v: number) => v.toLocaleString()} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="currentColor"
                strokeWidth={2}
                fill="url(#valueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
