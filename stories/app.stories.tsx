import React from "react";

import { usePromiseElement } from "../src";
import { Modal } from "./ui/modal";
import { App, AppResult, modalCreateProps } from "./ui/app";

const useSec = (
  maxSec: number = 3,
): [number, (callback?: () => void) => void] => {
  // Seconds
  const [sec, setSec] = React.useState<number>(0);

  const run = React.useCallback((callback: () => void = () => {}) => {
    setSec(0);

    const intervalId = setInterval(() => {
      setSec((prev) => {
        if (prev === maxSec) {
          clearInterval(intervalId);
          callback();
          return prev;
        }

        return prev + 1;
      });
    }, 1000);
  }, []);

  return [sec, run];
};

export default {
  title: "usePromoiseElement/App",
};

export const DefaultProps = () => {
  // State with modal component
  const [modal, open] = usePromiseElement(Modal);

  // State with result hooks with components: 'modal', 'confirm'
  const [result, setResult] = React.useState<AppResult>(null);

  // Open 'modal'
  const onOpen = React.useCallback(async () => {
    try {
      // Wait result modal window
      await open();
      setResult("success");
    } catch (e) {
      setResult("error");
    }
  }, [open]);

  return <App modal={modal} result={result} onOpen={onOpen} />;
};

export const CustomProps = () => {
  // State with modal component
  const [modal, open] = usePromiseElement(Modal, modalCreateProps);

  // State with result hooks with components: 'modal', 'confirm'
  const [result, setResult] = React.useState<AppResult>(null);

  // Open 'modal'
  const onOpen = React.useCallback(async () => {
    try {
      const openRes = await open();

      setResult(openRes);
    } catch (e) {
      setResult("error");
    }
  }, [open]);

  return <App modal={modal} result={result} onOpen={onOpen} />;
};

export const CustomPropsOnOpen = () => {
  // State with modal component
  const [modal, open] = usePromiseElement(Modal);

  // State with result hooks with components: 'modal', 'confirm'
  const [result, setResult] = React.useState<AppResult>(null);

  // Open 'modal'
  const onOpen = React.useCallback(async () => {
    try {
      const openRes = await open((resolve, reject) => ({
        title: "CustomProps",
        onSuccess: () => resolve("yes"),
        onCancel: () => resolve("no"),
        onError: reject,
      }));

      setResult(openRes);
    } catch (e) {
      setResult("error");
    }
  }, [open]);

  return <App modal={modal} result={result} onOpen={onOpen} />;
};

export const useMethodClose = () => {
  const MAX_SEC = 3;

  // State with modal component
  const [modal, open, close] = usePromiseElement(Modal);

  // State with result hooks with components: 'modal', 'confirm'
  const [result, setResult] = React.useState<AppResult>(null);

  // Seconds
  const [sec, runSec] = useSec(MAX_SEC);

  // Open 'modal'
  const onOpen = React.useCallback(async () => {
    runSec(() => close());

    await open(() => ({
      onSuccess: () => {},
      onCancel: () => {},
    }));

    setResult("success");
  }, [open, close]);

  return (
    <App modal={modal} result={result} onOpen={onOpen}>
      <div>{MAX_SEC - sec}</div>
    </App>
  );
};

export const useMethodCloseWithResult = () => {
  const MAX_SEC = 3;

  // State with modal component
  const [modal, open, close] = usePromiseElement<AppResult>(Modal);

  // State with result hooks with components: 'modal', 'confirm'
  const [result, setResult] = React.useState<AppResult>(null);

  // Seconds
  const [sec, runSec] = useSec(MAX_SEC);

  // Open 'modal'
  const onOpen = React.useCallback(async () => {
    runSec(() => close((resolve) => resolve("yes")));

    const openResult = await open(() => ({
      onSuccess: () => {},
      onCancel: () => {},
    }));

    setResult(openResult);
  }, [open, close]);

  return (
    <App modal={modal} result={result} onOpen={onOpen}>
      <div>{MAX_SEC - sec}</div>
    </App>
  );
};
