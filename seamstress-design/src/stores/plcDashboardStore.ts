import { create } from 'zustand';
import {
  generatePLCKPIs,
  generateMonthlyPermitData,
  generateStatusDistribution,
  generateRecentApplications,
  generateUpcomingInspections,
} from '../data/plcDataGenerators';
import type {
  PLCKPIs,
  PLCMonthlyData,
  PLCStatusDistribution,
  PLCApplication,
  PLCInspection,
} from '../data/plcDataGenerators';

type DashboardViewState = 'loading' | 'error' | 'empty' | 'success';

interface PLCDashboardState {
  viewState: DashboardViewState;
  errorMessage: string | null;
  kpis: PLCKPIs | null;
  monthlyData: PLCMonthlyData[];
  statusDistribution: PLCStatusDistribution[];
  recentApplications: PLCApplication[];
  upcomingInspections: PLCInspection[];
  fetchDashboard: () => Promise<void>;
  retry: () => Promise<void>;
}

export const usePLCDashboardStore = create<PLCDashboardState>((set, get) => ({
  viewState: 'loading',
  errorMessage: null,
  kpis: null,
  monthlyData: [],
  statusDistribution: [],
  recentApplications: [],
  upcomingInspections: [],

  fetchDashboard: async () => {
    set({ viewState: 'loading', errorMessage: null });
    try {
      await new Promise((r) => setTimeout(r, 600));
      set({
        viewState: 'success',
        kpis: generatePLCKPIs(),
        monthlyData: generateMonthlyPermitData(),
        statusDistribution: generateStatusDistribution(),
        recentApplications: generateRecentApplications(5),
        upcomingInspections: generateUpcomingInspections(5),
      });
    } catch (err) {
      set({
        viewState: 'error',
        errorMessage: err instanceof Error ? err.message : 'Failed to load dashboard data',
      });
    }
  },

  retry: async () => {
    await get().fetchDashboard();
  },
}));
