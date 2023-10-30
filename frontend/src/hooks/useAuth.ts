import { authAtom } from "@/atoms/auth";
import { API_URL, User } from "@/types";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
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
  const setAuthState = useSetRecoilState(authAtom);

  useEffect(() => {
    setAuthState((old) => ({ ...old, user }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return { user, loading };
};

export default useAuth;