import * as React from "react";

export type ResolveReject<R = any> = (
  resolve: (value?: R | PromiseLike<R> | undefined) => void,
  reject: (reason?: any) => void,
) => any;

export type UseNodePromise<R = any, P = {}> = [
  React.ReactNode,
  (props: P, resolveReject?: ResolveReject<R>) => Promise<R>,
];

export const useNodePromise = <R = any, P = {}>(
  component: React.ComponentClass | React.FC,
  mainResolveReject: ResolveReject<R> = () => {},
): UseNodePromise<R, P> => {
  const [value, setValue] = React.useState<React.ReactNode>(
    React.createElement(React.Fragment),
  );

  const create = React.useCallback(
    (props: P, resolveReject: ResolveReject<R> = () => {}) => {
      const result = new Promise<R>((resolve, reject) => {
        const nextValue = React.createElement(component, {
          ...props,
          ...mainResolveReject(resolve, reject),
          ...resolveReject(resolve, reject),
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
