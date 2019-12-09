import React from "react";

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
