import * as React from "react";

export type GetProps<
  Result = any,
  Props extends object = {
    onSuccess(): void;
    onCancel(): void;
  }
> = (
  resolve: (value?: Result | PromiseLike<Result> | undefined) => void,
  reject: (reason?: any) => void,
) => Props;

type Open<Result = any, Props extends object = {}> = (
  getProps?: GetProps<Result, Props>,
) => Promise<Result>;

type Close = () => void;

export type UseNodePromise<Result = any, Props extends object = {}> = [
  React.ReactElement | null,
  Open<Result, Props>,
  Close,
];

export const useNodePromise = <Result = any, Props extends object = {}>(
  component: React.ComponentClass<Props | object> | React.FC<Props | object>,
  getProps?: GetProps<Result, Props>,
): UseNodePromise<Result, Props> => {
  const [element, setElement] = React.useState<React.ReactElement<
    Props | object
  > | null>(null);

  const [openResult, setOpenResult] = React.useState<Promise<Result> | null>(
    null,
  );

  const open = React.useCallback(
    (getPropsAction?: GetProps<Result, Props>) => {
      const result = new Promise<Result>((resolve, reject) => {
        let props: Props | object = {
          ...(getProps && getProps(resolve, reject)),
          ...(getPropsAction && getPropsAction(resolve, reject)),
        };

        if (!Object.keys(props).length) {
          props = {
            onSuccess: resolve,
            onCancel: reject,
          };
        }

        const nextValue = React.createElement<Props | object>(component, props);

        setElement(nextValue);
      });

      setOpenResult(result);

      return result;
    },
    [component, getProps],
  );

  const close = React.useCallback(() => {
    setElement(null);
  }, []);

  React.useEffect(() => {
    let mount = true;

    if (openResult) {
      openResult
        .catch((er) => er)
        .finally(() => {
          if (mount) {
            close();
          }
        });
    }

    return () => {
      mount = false;
    };
  }, [openResult]);

  return [element, open, close];
};
