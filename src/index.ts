import * as React from "react";

export const useNodePromise = <R = any, P = {}>(
  component: React.ComponentClass | React.FC,
  getProps?: GetProps<R, P>,
): Result<R, P> => {
  const [value, setValue] = React.useState<React.ReactElement>(
    React.createElement(React.Fragment),
  );

  const [actionResult, setActionResult] = React.useState<Promise<R> | null>(
    null,
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

      setActionResult(result);

      return result;
    },
    [component, getProps],
  );

  React.useEffect(() => {
    let mount = true;

    if (actionResult) {
      actionResult.finally(() => {
        if (mount) {
          setValue(React.createElement(React.Fragment));
        }
      });
    }

    return () => {
      mount = false;
    };
  }, [actionResult]);

  return [value, action];
};

export type GetProps<R = any, P = {}> = (
  resolve: (value?: R | PromiseLike<R> | undefined) => void,
  reject: (reason?: any) => void,
) => P;

export type Result<R = any, P = {}> = [
  React.ReactElement,
  (resolveReject?: GetProps<R, P>) => Promise<R>,
];
