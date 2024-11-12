import { createContext, useContext, useState } from "react";
import { User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  isPremium: boolean;
  premiumUntil: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Mock user data for testing
  const [user] = useState<User | null>({
    id: "test-user-id",
    email: "test@example.com",
    created_at: new Date().toISOString(),
    aud: "authenticated",
    role: "authenticated",
  } as User);

  const [isPremium] = useState(true);
  const [premiumUntil] = useState(
    new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isPremium,
        premiumUntil,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
