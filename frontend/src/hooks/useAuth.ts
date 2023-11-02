import { API_URL, User } from "@/types";
import useFetch from "./useFetch";

interface CurrentAuthState {
  user: User | null;
  loading: boolean;
}

const useAuth = (): CurrentAuthState => {
  const { data: user, loading } = useFetch<User>(
    `${API_URL}/user/authenticated`,
    { includeCred: true }
  );

  return { user, loading };
};

export default useAuth;