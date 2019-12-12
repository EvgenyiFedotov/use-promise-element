import * as React from "react";

interface Props {
  value: boolean;
}

export const Branch: React.FC<Props> = ({ value, children }) => {
  const [thenBranch, elseBranch] = React.Children.toArray(children);
  const result = value ? thenBranch : elseBranch;
  return <>{result}</> || <></>;
};
