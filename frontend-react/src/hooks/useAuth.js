import { useAuthContext } from "../context/AuthContext";

// Thin re-export so components can `import { useAuth } from "../hooks/useAuth"`
export function useAuth() {
  return useAuthContext();
}
