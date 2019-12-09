import * as React from "react";

import { useNodePromise, GetProps } from "../../src";
import { Modal, ModalProps } from "./modal";
import { Confirm } from "./confirm";

// Result modal promise
type ResolveResult = "success" | "cancel";

// Function to getting props component
const modalCreateProps: GetProps<ResolveResult, ModalProps> = (
  resolve,
  reject,
) => ({
  onSuccess: () => resolve("success"),
  onCancel: () => resolve("cancel"),
  onError: () => reject(),
});

export const App: React.FC = () => {
  // State with modal component
  const [modal, open, close] = useNodePromise(Modal, modalCreateProps);

  // State with confirm (same modal) component (here use default props from hook)
  const [confirm, openConfirm] = useNodePromise(Confirm);

  // State with result hooks with components: 'modal', 'confirm'
  const [result, setResult] = React.useState<ResolveResult | "error" | null>(
    null,
  );

  // Open 'modal'
  const onOpen = React.useCallback(async () => {
    try {
      const openRes = await open();
      setResult(openRes);
    } catch (e) {
      setResult("error");
    }
  }, [open]);

  // Open 'modal' and setup 'title' prop
  const onOpenWithTitle = React.useCallback(async () => {
    await open(() => ({
      title: "Confirm title",
    }));
  }, [open]);

  // Open 'confirm'
  const onOpenConfrim = React.useCallback(async () => {
    await openConfirm();
    setResult("success");
  }, [openConfirm]);

  // Close 'modal'
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

      {/* Here insert 'modal' */}
      {modal}

      {/* Here insert 'confirm' */}
      {confirm}

      <div className="app-result">{result}</div>
    </div>
  );
};
