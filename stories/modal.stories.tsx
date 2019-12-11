import React from "react";

import { Modal } from "./ui/modal";

export default {
  title: "usePromoiseElement/Modal",
};

export const DefaultProps = () => <Modal />;

export const CustomProps = () => <Modal title="Custom title" />;

export const WithOnError = () => <Modal onError={() => {}} />;
