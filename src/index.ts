import * as React from "react";

/**
 * Type method getting props
 */
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

/**
 * Type method opening component
 */
type Open<Result = any, Props extends object = {}> = (
  getProps?: GetProps<Result, Props>,
) => Promise<Result>;

/**
 * Type method closing component
 */
type Close = () => void;

/**
 * Type returns hook 'useNodePromise'
 */
type UseNodePromise<Result = any, Props extends object = {}> = [
  React.ReactElement | null,
  Open<Result, Props>,
  Close,
];

/**
 * @param component React component witch will be create when run method 'open'
 * @param getProps Function to getting props 'component' when run method 'open'
 */
export const useNodePromise = <Result = any, Props extends object = {}>(
  component: React.ComponentClass<Props | object> | React.FC<Props | object>,
  getProps?: GetProps<Result, Props>,
): UseNodePromise<Result, Props> => {
  // State with component
  const [element, setElement] = React.useState<React.ReactElement<
    Props | object
  > | null>(null);

  // State with return method 'open'
  const [openResult, setOpenResult] = React.useState<Promise<Result> | null>(
    null,
  );

  // Method to opening (create) component
  const open = React.useCallback(
    (getPropsAction?: GetProps<Result, Props>) => {
      const result = new Promise<Result>((resolve, reject) => {
        let props: Props | object = {
          ...(getProps && getProps(resolve, reject)),
          ...(getPropsAction && getPropsAction(resolve, reject)),
        };

        // Set default props
        if (!Object.keys(props).length) {
          props = {
            onSuccess: resolve,
            onCancel: reject,
          };
        }

        setElement(React.createElement<Props | object>(component, props));
      });

      setOpenResult(result);

      return result;
    },
    [component, getProps],
  );

  // Method to closing component
  const close = React.useCallback(() => {
    setElement(null);
  }, []);

  /**
   * Process promise in effect because component maybe unmount
   * If component doesn't unmount hide him
   */
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
