import * as React from "react";

import { GetProps } from "../../src";
import { Column, Row } from "./layer";
import { ModalProps } from "./modal";
import { Branch } from "./branch";

// Result modal promise
type ResolveResult = "success" | "cancel" | "yes" | "no";

// Function to getting props component
export const modalCreateProps: GetProps<ResolveResult, ModalProps> = (
  resolve,
  reject,
) => ({
  onSuccess: () => resolve("success"),
  onCancel: () => resolve("cancel"),
  onError: () => reject(),
});

export type AppResult = ResolveResult | "error" | null;

interface Props {
  modal: React.ReactElement;
  result?: AppResult;
  onOpen?(): void;
  onClose?(): void;
}

export const App: React.FC<Props> = (props) => {
  const { onOpen = () => {}, onClose = () => {} } = props;

  return (
    <Column>
      <Row>
        <button className="app-open" onClick={onOpen}>
          Open
        </button>

        <Branch value={!!props.onClose}>
          <button className="app-close" onClick={onClose}>
            Close
          </button>
        </Branch>
      </Row>

      {props.modal}

      {props.children}

      <div className="app-result">{props.result}</div>
    </Column>
  );
};
