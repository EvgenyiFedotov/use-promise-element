import * as React from "react";

export interface ModalProps {
  title?: string;
  onSuccess?(): void;
  onCancel?(): void;
  onError?(): void;
}

export const Modal: React.FC<ModalProps> = (props) => {
  const { title = "Title" } = props;

  return (
    <div className="modal">
      <div className="modal-title">{title}</div>

      <button className="modal-success" onClick={props.onSuccess}>
        Success
      </button>

      <button className="modal-close" onClick={props.onCancel}>
        Cancel
      </button>

      <button className="modal-error" onClick={props.onError}>
        Error
      </button>
    </div>
  );
};
