import * as React from "react";

export interface ConfirmProps {
  title?: string;
  onSuccess?(): void;
  onCancel?(): void;
  onError?(): void;
}

export const Confirm: React.FC<ConfirmProps> = (props) => {
  const { title = "Title" } = props;

  return (
    <div className="confirm">
      <div className="confirm-title">{title}</div>

      <button className="confirm-success" onClick={props.onSuccess}>
        Success
      </button>

      <button className="confirm-close" onClick={props.onCancel}>
        Cancel
      </button>

      <button className="confirm-error" onClick={props.onError}>
        Error
      </button>
    </div>
  );
};
