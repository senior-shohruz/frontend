"use client";

import { create } from "zustand";
import { api, tokenStorage, getErrorMessage } from "./api";
import type { User, LoginPayload, RegisterPayload, AuthTokens } from "@/types";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isHydrated: boolean;
  error: string | null;

  hydrate: () => Promise<void>;
  login: (data: LoginPayload) => Promise<void>;
  register: (data: RegisterPayload) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  isHydrated: false,
  error: null,

  hydrate: async () => {
    const token = tokenStorage.getAccess();
    if (!token) {
      set({ isHydrated: true });
      return;
    }
    try {
      const res = await api.get<User>("/auth/me");
      set({ user: res.data, isHydrated: true });
    } catch {
      tokenStorage.clear();
      set({ user: null, isHydrated: true });
    }
  },

  login: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post<AuthTokens>("/auth/login", data);
      tokenStorage.set(res.data.access_token, res.data.refresh_token);
      const me = await api.get<User>("/auth/me");
      set({ user: me.data, isLoading: false });
    } catch (e) {
      set({ error: getErrorMessage(e), isLoading: false });
      throw e;
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post<AuthTokens>("/auth/register", data);
      tokenStorage.set(res.data.access_token, res.data.refresh_token);
      const me = await api.get<User>("/auth/me");
      set({ user: me.data, isLoading: false });
    } catch (e) {
      set({ error: getErrorMessage(e), isLoading: false });
      throw e;
    }
  },

  logout: () => {
    tokenStorage.clear();
    set({ user: null });
    if (typeof window !== "undefined") window.location.href = "/login";
  },

  refreshUser: async () => {
    try {
      const res = await api.get<User>("/auth/me");
      set({ user: res.data });
    } catch {
      // ignore
    }
  },
}));
