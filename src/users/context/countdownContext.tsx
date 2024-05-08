import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface CountdownContextType {
  countdown: number;
  setCountdown: React.Dispatch<React.SetStateAction<number>>;
  isCountdown: boolean;
  setIsCountdown: React.Dispatch<React.SetStateAction<boolean>>;
}

const CountdownContext = createContext<CountdownContextType | undefined>(
  undefined
);

export const useCountdown = () => {
  const context = useContext(CountdownContext);
  if (!context) {
    throw new Error("useCountdown must be used within a CountdownProvider");
  }
  return context;
};

export const CountdownProvider = ({ children }: any) => {
  const [countdown, setCountdown] = useState(0);
  const [isCountdown, setIsCountdown] = useState(true);

  useEffect(() => {
    if (isCountdown) {
      if (countdown > 0) {
        const countdownInterval = setInterval(() => {
          setCountdown((prevCountdown) => prevCountdown - 1);
        }, 1000);

        return () => clearInterval(countdownInterval);
      } else if (countdown === 0) {
        setIsCountdown(false);
      }
    }
  }, [countdown, isCountdown]);

  const value: CountdownContextType = {
    countdown,
    setCountdown,
    isCountdown,
    setIsCountdown,
  };

  return (
    <CountdownContext.Provider value={value}>
      {children}
    </CountdownContext.Provider>
  );
};
