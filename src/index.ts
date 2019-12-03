import * as React from "react";

export type GetProps<R = any, P = {}> = (
  resolve: (value?: R | PromiseLike<R> | undefined) => void,
  reject: (reason?: any) => void,
) => P;

export type Result<R = any, P = {}> = [
  React.ReactNode,
  (resolveReject?: GetProps<R, P>) => Promise<R>,
];

export const useNodePromise = <R = any, P = {}>(
  component: React.ComponentClass | React.FC,
  getProps?: GetProps<R, P>,
): Result<R, P> => {
  const [value, setValue] = React.useState<React.ReactNode>(
    React.createElement(React.Fragment),
  );

  const action = React.useCallback(
    (getPropsAction?: GetProps<R, P>) => {
      const result = new Promise<R>((resolve, reject) => {
        const nextValue = React.createElement(component, {
          ...(getProps && getProps(resolve, reject)),
          ...(getPropsAction && getPropsAction(resolve, reject)),
        });

        setValue(nextValue);
      });

      result.finally(() => {
        setValue(React.createElement(React.Fragment));
      });

      return result;
    },
    [component, getProps],
  );

  return [value, action];
};
