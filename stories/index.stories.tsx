import React from "react";

import { Modal, ModalWrapper } from "./ui/modal";

export default {
  title: "usePromoiseElement",
};

export const withText = () => <button>Hello button</button>;

export const withEmoji = () => (
  <button>
    <span role="img" aria-label="so cool">
      😀 😎 👍 💯
    </span>
  </button>
);

export const modal = () => {
  return (
    <ModalWrapper>
      <Modal />
    </ModalWrapper>
  );
};

export const modalWithTitle = () => {
  return (
    <ModalWrapper>
      <Modal title="Set other title" />
    </ModalWrapper>
  );
};
