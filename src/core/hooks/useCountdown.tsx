"use client";

import React, { useState, useEffect } from "react";

export const useCountdown = () => {
  const [countdown, setCountdown] = useState(0);
  const [isCountdown, setIsCountdown] = useState(false);

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

  return { countdown, setCountdown, isCountdown, setIsCountdown };
};
