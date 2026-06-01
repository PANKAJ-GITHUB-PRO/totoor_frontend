import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Role } from "./types";
import { api } from "./api";

type AuthMode = "login" | "register";

interface SessionState {
  email: string | null;
  emailVerified: boolean;
  role: Role | null;
  onboarded: boolean;
  name: string | null;
  token: string | null;
  postAuthRedirect: string | null;
  authMode: AuthMode | null;
  otpDeliverySent: boolean | null;
  startAuth: (email: string, mode: AuthMode) => Promise<{ sent: boolean; devBypassEnabled: boolean; cooldownSeconds?: number }>;
  verifyOtp: (otp: string) => Promise<Role | null>;
  setRole: (r: Role) => Promise<void>;
  completeOnboarding: (profile: Record<string, unknown>) => Promise<void>;
  signOut: () => void;
}

export const useSession = create<SessionState>()(
  persist(
    (set) => ({
      email: null,
      emailVerified: false,
      role: null,
      onboarded: false,
      name: null,
      token: null,
      postAuthRedirect: null,
      authMode: null,
      otpDeliverySent: null,
      startAuth: async (email, authMode) => {
        const result = await api.startAuth(email, authMode);
        set({ email, authMode, emailVerified: false, otpDeliverySent: result.sent });
        return { sent: result.sent, devBypassEnabled: result.devBypassEnabled, cooldownSeconds: result.cooldownSeconds };
      },
      verifyOtp: async (otp) => {
        const state = useSession.getState();
        if (!state.email || !state.authMode) throw new Error("Start login first");
        const { token, user } = await api.verifyOtp(state.email, otp, state.authMode);
        set({ token, emailVerified: true, role: user.role, onboarded: user.onboarded, name: user.name, authMode: null, otpDeliverySent: null });
        return user.role ?? null;
      },
      setRole: async (role) => {
        await api.selectRole(role);
        set({ role });
      },
      completeOnboarding: async (profile) => {
        const user = await api.updateMe(profile);
        set({ onboarded: true, name: user.name, role: user.role, authMode: null });
      },
      signOut: () => set({ email: null, emailVerified: false, role: null, onboarded: false, name: null, token: null, postAuthRedirect: null, authMode: null, otpDeliverySent: null }),
    }),
    { name: "tutor-session" }
  )
);
