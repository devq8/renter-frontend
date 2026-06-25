import { useQuery } from "@tanstack/react-query";
import React, { useMemo } from "react";
import { useNavigate } from "react-router";
import { getLastCollections } from "../../utils/api/dashboard";
import { getInvoicesPage } from "../../utils/api/invoices";
import { changeAmountFormat } from "../../utils/format";
import {
  BuildingOffice2Icon,
  BoltIcon,
  CreditCardIcon,
  FlagIcon,
  PlusIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/solid";

function Sparkline({ data, positive = true, width = 80, height = 36 }) {
  if (!data || data.length < 2) return <div style={{ width, height }} />;
  const values = [...data].reverse().slice(-6).map((d) => Number(d.collections) || 0);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const pad = 2;
  const points = values
    .map((v, i) => {
      const x = pad + (i / (values.length - 1)) * (width - pad * 2);
      const y = pad + (1 - (v - min) / range) * (height - pad * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="flex-shrink-0"
    >
      <polyline
        points={points}
        fill="none"
        stroke={positive ? "#BD9A5F" : "#EF4444"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function OccupancyBar({ rate }) {
  const color =
    rate >= 90 ? "#22C55E" : rate >= 75 ? "#BD9A5F" : "#EF4444";
  return (
    <div className="w-full bg-[#F7F6F2] rounded-full h-1.5">
      <div
        className="h-1.5 rounded-full"
        style={{
          width: `${Math.min(Math.max(rate, 0), 100)}%`,
          backgroundColor: color,
        }}
      />
    </div>
  );
}

function PropertyCard({ property }) {
  const collections = property.last_year_collections || [];
  const cur = collections[0] || { collections: 0, total_rents: 0 };
  const prev = collections[1] || { collections: 0, total_rents: 0 };

  const collectedMTD = Number(cur.collections) || 0;
  const prevCollected = Number(prev.collections) || 0;
  const changePercent =
    prevCollected > 0
      ? ((collectedMTD - prevCollected) / prevCollected) * 100
      : null;
  const isPositive = changePercent === null || changePercent >= 0;

  const totalUnits = property.number_of_units || 0;
  const vacancies = property.vacancies || 0;
  const occupied = totalUnits - vacancies;
  const occupancyRate = totalUnits > 0 ? (occupied / totalUnits) * 100 : 0;

  const billedMTD = Number(cur.total_rents) || 0;
  const outstandingMTD = Math.max(0, billedMTD - collectedMTD);
  const collectionRate =
    billedMTD > 0 ? Math.round((collectedMTD / billedMTD) * 100) : 0;

  return (
    <div className="bg-white rounded-xl p-5 border border-[#E6E2DA] hover:shadow-md transition-shadow duration-200">
      {/* Card header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 bg-[#1C1F2A] rounded-lg flex items-center justify-center flex-shrink-0">
          <BuildingOffice2Icon className="w-5 h-5 text-white" />
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-[#1C1F2A] text-sm leading-snug">
            {property.name}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5 truncate">
            {property.address || "—"}
          </p>
        </div>
      </div>

      {/* Collected MTD */}
      <p className="text-[10px] font-medium uppercase tracking-widest text-gray-400 mb-1">
        Collected · MTD
      </p>
      <div className="flex items-end justify-between mb-1">
        <div>
          <span className="text-xl font-bold text-[#1C1F2A]">
            {changeAmountFormat(collectedMTD)}
          </span>
          <span className="text-xs text-gray-400 ml-1">KD</span>
        </div>
        <Sparkline data={collections} positive={isPositive} width={80} height={36} />
      </div>
      {changePercent !== null && (
        <p
          className={`text-xs mb-3 ${
            isPositive ? "text-green-500" : "text-red-500"
          }`}
        >
          {isPositive ? "↑" : "↓"} {Math.abs(changePercent).toFixed(1)}% vs
          last month
        </p>
      )}

      {/* Occupancy bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] font-medium uppercase tracking-widest text-gray-400">
            Occupancy
          </span>
          <span className="text-xs font-semibold text-[#1C1F2A]">
            {occupied}/{totalUnits} units · {Math.round(occupancyRate)}%
          </span>
        </div>
        <OccupancyBar rate={occupancyRate} />
      </div>

      {/* Bottom stats */}
      <div className="flex gap-4 pt-3 border-t border-[#F7F6F2]">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-gray-400">
            Outstanding
          </p>
          <p className="text-sm font-bold text-[#1C1F2A]">
            {changeAmountFormat(outstandingMTD)}
          </p>
          <p className="text-[10px] text-gray-400">KD</p>
        </div>
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-gray-400">
            Billed MTD
          </p>
          <p className="text-sm font-bold text-[#1C1F2A]">
            {changeAmountFormat(billedMTD)}
          </p>
          <p className="text-[10px] text-gray-400">KD</p>
        </div>
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-gray-400">
            Collection
          </p>
          <p className="text-sm font-bold text-[#1C1F2A]">{collectionRate}%</p>
          <p className="text-[10px] text-gray-400">of billed</p>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();

  const { data: dashboardData = [], isLoading } = useQuery(
    ["dashboard"],
    () => getLastCollections()
  );

  const { data: overdueData } = useQuery(["overdueInvoices"], () =>
    getInvoicesPage({ status: "overdue", pageSize: 1 })
  );

  const stats = useMemo(() => {
    let collectedMTD = 0,
      outstanding = 0,
      totalUnits = 0,
      occupied = 0;
    for (const p of dashboardData) {
      const cur = p.last_year_collections?.[0] || {
        collections: 0,
        total_rents: 0,
      };
      const collected = Number(cur.collections) || 0;
      const billed = Number(cur.total_rents) || 0;
      collectedMTD += collected;
      outstanding += Math.max(0, billed - collected);
      totalUnits += p.number_of_units || 0;
      occupied += (p.number_of_units || 0) - (p.vacancies || 0);
    }
    return { collectedMTD, outstanding, totalUnits, occupied };
  }, [dashboardData]);

  const occupancyRate =
    stats.totalUnits > 0
      ? Math.round((stats.occupied / stats.totalUnits) * 100)
      : 0;
  const overdueCount = overdueData?.count ?? "—";

  const now = new Date();
  const monthLabel = now
    .toLocaleString("en-US", { month: "long" })
    .toUpperCase();
  const yearLabel = now.getFullYear();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-1">
            Portfolio · {monthLabel} {yearLabel}
          </p>
          <h1 className="text-3xl font-bold text-[#1C1F2A]">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            {isLoading
              ? "Loading..."
              : `${dashboardData.length} ${
                  dashboardData.length === 1 ? "property" : "properties"
                } · ${stats.totalUnits} units across Kuwait`}
          </p>
        </div>
        <div className="flex gap-3 mt-4 sm:mt-0">
          <button className="flex items-center gap-2 px-4 py-2 border border-[#BD9A5F] text-[#BD9A5F] rounded-lg text-sm font-medium hover:bg-[#BD9A5F]/10 transition-colors">
            <ArrowDownTrayIcon className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => navigate("/properties/new_property")}
            className="flex items-center gap-2 px-4 py-2 bg-[#BD9A5F] text-white rounded-lg text-sm font-medium hover:bg-[#A8895A] transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            Add property
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {/* Collected MTD */}
        <div className="bg-white rounded-xl p-5 border border-[#E6E2DA]">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-medium uppercase tracking-widest text-gray-400">
              Collected (MTD)
            </span>
            <span className="w-7 h-7 bg-[#F7F6F2] rounded-lg flex items-center justify-center">
              <CreditCardIcon className="w-4 h-4 text-[#BD9A5F]" />
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-[#1C1F2A]">
              {changeAmountFormat(stats.collectedMTD)}
            </span>
            <span className="text-sm text-gray-400">KD</span>
          </div>
        </div>

        {/* Outstanding */}
        <div className="bg-white rounded-xl p-5 border border-[#E6E2DA]">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-medium uppercase tracking-widest text-gray-400">
              Outstanding
            </span>
            <span className="w-7 h-7 bg-[#F7F6F2] rounded-lg flex items-center justify-center">
              <FlagIcon className="w-4 h-4 text-[#BD9A5F]" />
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-[#1C1F2A]">
              {changeAmountFormat(stats.outstanding)}
            </span>
            <span className="text-sm text-gray-400">KD</span>
          </div>
        </div>

        {/* Overdue */}
        <div className="bg-white rounded-xl p-5 border border-[#E6E2DA]">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-medium uppercase tracking-widest text-gray-400">
              Overdue
            </span>
            <span className="w-7 h-7 bg-[#F7F6F2] rounded-lg flex items-center justify-center">
              <BoltIcon className="w-4 h-4 text-[#BD9A5F]" />
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-[#1C1F2A]">
              {overdueCount}
            </span>
            <span className="text-sm text-gray-400">invoices</span>
          </div>
        </div>

        {/* Occupancy — dark card */}
        <div className="bg-[#1C1F2A] rounded-xl p-5">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-medium uppercase tracking-widest text-gray-400">
              Occupancy
            </span>
            <span className="w-7 h-7 bg-white/10 rounded-lg flex items-center justify-center">
              <BuildingOffice2Icon className="w-4 h-4 text-[#BD9A5F]" />
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-white">
              {occupancyRate}
            </span>
            <span className="text-sm text-gray-400">%</span>
          </div>
        </div>
      </div>

      {/* By property */}
      <div>
        <h2 className="text-lg font-semibold text-[#1C1F2A] mb-4">
          By property
        </h2>
        {isLoading ? (
          <div className="flex justify-center py-16 text-gray-400 text-sm">
            Loading properties...
          </div>
        ) : dashboardData.length === 0 ? (
          <div className="flex justify-center py-16 text-gray-400 text-sm">
            No properties found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dashboardData.map((property, i) => (
              <PropertyCard key={property.name ?? i} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
