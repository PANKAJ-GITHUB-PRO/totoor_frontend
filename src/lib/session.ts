import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Role } from "./types";

interface SessionState {
  email: string | null;
  emailVerified: boolean;
  role: Role | null;
  onboarded: boolean;
  name: string | null;
  setEmail: (e: string) => void;
  verify: () => void;
  setRole: (r: Role) => void;
  completeOnboarding: (name: string) => void;
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
      setEmail: (email) => set({ email }),
      verify: () => set({ emailVerified: true }),
      setRole: (role) => set({ role }),
      completeOnboarding: (name) => set({ onboarded: true, name }),
      signOut: () => set({ email: null, emailVerified: false, role: null, onboarded: false, name: null }),
    }),
    { name: "tuddor-session" }
  )
);
