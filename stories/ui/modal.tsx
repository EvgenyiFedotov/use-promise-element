import * as React from "react";
import styled from "styled-components";

import { Row, Column } from "./layer";
import { Branch } from "./branch";

export interface ModalProps {
  title?: string;
  onSuccess?(): void;
  onCancel?(): void;
  onError?(): void;
}

export const Modal: React.FC<ModalProps> = (props) => {
  const { title = "Title" } = props;

  return (
    <ModalWrapper>
      <Content>
        <Column>
          <div className="modal-title">{title}</div>

          <Row>
            <button className="modal-success" onClick={props.onSuccess}>
              Success
            </button>

            <button className="modal-close" onClick={props.onCancel}>
              Cancel
            </button>

            <Branch value={!!props.onError}>
              <button className="modal-error" onClick={props.onError}>
                Error
              </button>
            </Branch>
          </Row>
        </Column>
      </Content>
    </ModalWrapper>
  );
};

const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Content = styled.div`
  padding: 16px;
  box-shadow: 0px 2px 6px 0 hsla(0, 0%, 0%, 0.2);
  border-top: 4px solid #ff4785;
  border-radius: 4px;
`;
