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
  getPropsHook?: GetProps<R, P>,
): Result<R, P> => {
  const [value, setValue] = React.useState<React.ReactNode>(
    React.createElement(React.Fragment),
  );

  const create = React.useCallback(
    (getProps?: GetProps<R, P>) => {
      const result = new Promise<R>((resolve, reject) => {
        const nextValue = React.createElement(component, {
          ...(getPropsHook && getPropsHook(resolve, reject)),
          ...(getProps && getProps(resolve, reject)),
        });

        setValue(nextValue);
      });

      result.finally(() => setValue(React.createElement(React.Fragment)));

      return result;
    },
    [component],
  );

  return [value, create];
};
