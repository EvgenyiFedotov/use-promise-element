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
 * Function callback for run getting result promise
 */
type CloseCallback<Result = any> = (
  resolve: (value?: Result | PromiseLike<Result> | undefined) => void,
  reject: (reason?: any) => void,
) => void;

/**
 * Type method closing component
 */
type Close<Result = any> = (callback?: CloseCallback<Result>) => void;

/**
 * Type returns hook 'usePromiseElement'
 */
type UsePromiseElement<Result = any, Props extends object = {}> = [
  React.ReactElement | null,
  Open<Result, Props>,
  Close<Result>,
];

/**
 * Interface for set to cache result after run method 'open'
 */
interface OpenResult<Result = any> {
  promise: Promise<Result> | null;
  resolve: (value?: Result | PromiseLike<Result> | undefined) => void;
  reject: (reason?: any) => void;
}

const defaultOpenResult = {
  promise: null,
  resolve: () => {},
  reject: () => {},
};

/**
 * @param component React component witch will be create when run method 'open'
 * @param getProps Function to getting props 'component' when run method 'open'
 */
export const usePromiseElement = <Result = any, Props extends object = {}>(
  component: React.ComponentClass<Props | object> | React.FC<Props | object>,
  getProps?: GetProps<Result, Props>,
): UsePromiseElement<Result, Props> => {
  // State with component
  const [element, setElement] = React.useState<React.ReactElement<
    Props | object
  > | null>(null);

  // State with return method 'open'
  const [openResult, setOpenResult] = React.useState<OpenResult<Result>>(
    defaultOpenResult,
  );

  // Method to opening (create) component
  const open = React.useCallback(
    (getPropsAction?: GetProps<Result, Props>) => {
      let resolve = () => {};
      let reject = () => {};

      const promise = new Promise<Result>((res, rej) => {
        resolve = res;
        reject = rej;
      });

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

      setOpenResult({ promise, resolve, reject });
      setElement(React.createElement<Props | object>(component, props));

      return promise;
    },
    [component, getProps],
  );

  // Method to closing component
  const close = React.useCallback(
    (callback: CloseCallback<Result> = () => {}) => {
      setElement(null);
      setOpenResult((prev) => {
        callback(prev.resolve, prev.reject);
        return defaultOpenResult;
      });
    },
    [],
  );

  /**
   * Process promise in effect because component maybe unmount
   * If component doesn't unmount hide him
   */
  React.useEffect(() => {
    let mount = true;

    if (openResult.promise) {
      openResult.promise
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
