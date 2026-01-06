import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
} from "react";
import Cookies from "universal-cookie";
import { setToken } from "../../helper/api";

export type LoggedInUser = {
  id: number;
  username: string;
  role: string;
  accessToken: string;
};

export type LoggedInUserContextType = {
  loggedInUser: LoggedInUser | null;
  setLoggedInUser: Dispatch<React.SetStateAction<LoggedInUser | null>>;
};

const LoggedInUserContext = createContext<LoggedInUserContextType | null>(null);

interface Props {
  children: ReactNode;
}

export const LoggedInUserContextProvider = ({ children }: Props) => {
  let initialLoggedInUser: LoggedInUser | null = null;

  const cookies = new Cookies();
  const loggedInUserString = cookies.get("loggedInUser");
  if (loggedInUserString !== undefined) {
    initialLoggedInUser = JSON.parse(JSON.stringify(loggedInUserString));
    setToken(initialLoggedInUser!.accessToken);
  }

  const [loggedInUser, setLoggedInUser] = useState<LoggedInUser | null>(
    initialLoggedInUser
  );

  return (
    <LoggedInUserContext.Provider value={{ loggedInUser, setLoggedInUser }}>
      {children}
    </LoggedInUserContext.Provider>
  );
};

export default LoggedInUserContextProvider;

export function useLoggedInUsersContext() {
  const context = useContext(LoggedInUserContext);
  if (!context)
    throw Error(
      "useLoggedInUserContext must be within LoggedInUserContextProvider"
    );
  return context;
}
