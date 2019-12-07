import * as React from "react";

import { useNodePromise, GetProps } from "../../src";
import { Modal, ModalProps } from "./modal";

type ResolveResult = "success" | "cancel";

const modalCreateProps: GetProps<ResolveResult, ModalProps> = (
  resolve,
  reject,
) => ({
  onSuccess: () => resolve("success"),
  onCancel: () => resolve("cancel"),
  onError: () => reject(),
});

export const Confirm = Modal;

export const App: React.FC = () => {
  const [modal, open, close] = useNodePromise(Modal, modalCreateProps);
  const [confirm, openConfirm] = useNodePromise(Confirm);
  const [result, setResult] = React.useState<ResolveResult | "error" | null>(
    null,
  );

  const onOpen = React.useCallback(async () => {
    try {
      const openRes = await open();
      setResult(openRes);
    } catch (e) {
      setResult("error");
    }
  }, [open]);

  const onOpenWithTitle = React.useCallback(async () => {
    await open(() => ({
      title: "Confirm title",
    }));
  }, [open]);

  const onOpenConfrim = React.useCallback(async () => {
    await openConfirm();
    setResult("success");
  }, [openConfirm]);

  const onClose = React.useCallback(() => {
    close();
    setResult(null);
  }, [close]);

  return (
    <div>
      <button className="app-open" onClick={onOpen}>
        Open
      </button>
      <button className="app-open-with-props" onClick={onOpenWithTitle}>
        Open with props
      </button>
      <button className="app-open-confirm" onClick={onOpenConfrim}>
        Open confirm
      </button>
      <button className="app-close" onClick={onClose}>
        Close
      </button>

      {modal}
      {confirm}

      <div className="app-result">{result}</div>
    </div>
  );
};
