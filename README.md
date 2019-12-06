# 🛠 React hook 'useNodePromise'

This hook was created to solve the problem with confirm modal window. But one you can use to solve other tasks if you wrap sub component into promise and waiting answer of him.

## Install

```sh
# npm
npm install use-node-promise

# yarn
yarn add use-node-promise
```

## Documentation

### `useNodePromise`

```typescript
const useNodePromise: <R = any, P = {}>(
  component: React.ComponentClass<{}, any> | React.FC<{}>,
  getProps?: GetProps<R, P> | undefined,
) => Result<R, P>;
```

### `GetProps`

```typescript
type GetProps<R = any, P = {}> = (
  resolve: (value?: R | PromiseLike<R> | undefined) => void,
  reject: (reason?: any) => void,
) => P;
```

### `Result`

```typescript
type Result<R = any, P = {}> = [
  React.ReactElement,
  (resolveReject?: GetProps<R, P>) => Promise<R>,
];
```

## Example

Component modal window.

_src/modal.tsx_

```tsx
import * as React from "react";

export type ModalResolve = "success" | "cancel";

export interface ModalProps {
  onClose(res: Resolve): void;
  onError(): void;
  title?: string;
}

export const Modal: React.FC<ModalProps> = (props) => {
  const { title = "Modal", onClose = () => {} } = props;

  return (
    <div>
      <div className="title">{title}</div>
      <button onClick={() => onClose("success")}>Success</button>
      <button onClick={() => onClose("cancel")}>Cancel</button>
      <button onClick={props.onError}>Test error</button>
    </div>
  );
};
```

Component application

_src/app.tss_

```tsx
import * as React from "react";
import { useNodePromise, GetProps } from "use-node-promise";
import { Modal, ModalResolve, ModalProps } from "./modal"; // "./src/modal.tsx"

const getModalProps: GetProps<ModalResolve, ModalProps> = (
  resolve,
  reject,
) => ({
  onClose: (res) => {
    resolve(res);
  },
  onError: () => {
    reject();
  },
});

const procResult = (res: ModalResolve) => {
  if (result === "success") {
    // code 'success'
  } else {
    // code 'cancel'
  }
};

export const App: React.FC = () => {
  const [modal, openModal] = useNodePromise<ModalResolve, ModalProps>(
    Modal,
    getModalProps,
  );

  /**
   * Use default props modal from 'getModalProps'
   */
  const openBaseModal = React.useCallback(async () => {
    try {
      procResult(await openModal());
    } catch (e) {
      // code
    }
  }, [openModal]);

  /**
   * Use default props modal from 'getModalProps'
   * and specific props
   *
   * Props merged:
   * {
   *    ...getModalProps(resolve, reject),
   *    ...getSpecificProps(resolve, reject),
   * }
   */
  const openSpecificModal = React.useCallback(() => {
    try {
      procResult(
        await openModal((resolve) => ({
          title: "Create new item?",
          onClose: () => {
            resolve("success");
          },
        })),
      );
    } catch (e) {
      // code
    }
  }, [openModal]);

  return (
    <div>
      <button onClick={openBaseModal}>Open base modal</button>
      <button onClick={openSpecificModal}>Open specific modal</button>

      {modal}
    </div>
  );
};
```

## Tests

```sh
# npm
npm install
npm run test

# yarn
yarn install
yarn test
```

> Please note! Tests have skip test, exist problem in `React` or `test environment`.
> This case tested in `react` application.
