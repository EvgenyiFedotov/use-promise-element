# 🛠 React hook 'usePromiseElement'

[![npm](https://img.shields.io/npm/v/use-promise-element?style=flat-square)](https://www.npmjs.com/package/use-promise-element) [![npm bundle size](https://img.shields.io/bundlephobia/min/use-promise-element?color=success&label=minified&style=flat-square)](https://bundlephobia.com/result?p=use-promise-element) ![license](https://img.shields.io/npm/l/use-promise-element?style=flat-square) ![David](https://img.shields.io/david/EvgenyiFedotov/use-promise-element?style=flat-square)

This hook was created to solve the problem with confirm modal window. But one you can use to solve other tasks if you wrap sub component into promise and waiting answer of him.

## Install

```sh
# npm
npm install use-promise-element

# yarn
yarn add use-promise-element
```

## Documentation

### Methods

#### `usePromiseElement` (export)

[`[GetProps]`](#getprops-export) [`[UsePromiseElement]`](#UsePromiseElement)

```ts
/**
 * @param component React component witch will be create when run method 'open'
 * @param getProps Function to getting props 'component' when run method 'open'
 */
export declare const usePromiseElement: <
  Result = any,
  Props extends object = {}
>(
  component:
    | React.ComponentClass<object | Props, any>
    | React.FC<object | Props>,
  getProps?: GetProps<Result, Props> | undefined,
) => UsePromiseElement<Result, Props>;
```

### Types

#### `GetProps` (export)

```ts
/**
 * Type method getting props
 */
type GetProps<
  Result = any,
  Props extends object = {
    onSuccess(): void;
    onCancel(): void;
  }
> = (
  resolve: (value?: Result | PromiseLike<Result> | undefined) => void,
  reject: (reason?: any) => void,
) => Props;
```

#### `UsePromiseElement`

[`[Open]`](#Open) [`[Close]`](#Close)

```ts
/**
 * Type returns hook 'usePromiseElement'
 */
type UsePromiseElement<Result = any, Props extends object = {}> = [
  React.ReactElement | null,
  Open<Result, Props>,
  Close,
];
```

#### `Open`

[`[GetProps]`](#getprops-export)

```ts
/**
 * Type method opening component
 */
type Open<Result = any, Props extends object = {}> = (
  getProps?: GetProps<Result, Props>,
) => Promise<Result>;
```

#### `Close`

```ts
/**
 * Type method closing component
 */
type Close = () => void;
```

## Example

_./src/modal.tsx_

```tsx
import * as React from "react";

export interface ModalProps {
  title?: string;
  onSuccess?(): void;
  onCancel?(): void;
  onError?(): void;
}

export const Modal: React.FC<ModalProps> = (props) => {
  const { title = "Title" } = props;

  return (
    <div className="modal">
      <div className="modal-title">{title}</div>

      <button className="modal-success" onClick={props.onSuccess}>
        Success
      </button>

      <button className="modal-close" onClick={props.onCancel}>
        Cancel
      </button>

      <button className="modal-error" onClick={props.onError}>
        Error
      </button>
    </div>
  );
};
```

_./src/confirm.tsx_

```tsx
import * as React from "react";

export interface ConfirmProps {
  title?: string;
  onSuccess?(): void;
  onCancel?(): void;
  onError?(): void;
}

export const Confirm: React.FC<ConfirmProps> = (props) => {
  const { title = "Title" } = props;

  return (
    <div className="confirm">
      <div className="confirm-title">{title}</div>

      <button className="confirm-success" onClick={props.onSuccess}>
        Success
      </button>

      <button className="confirm-close" onClick={props.onCancel}>
        Cancel
      </button>

      <button className="confirm-error" onClick={props.onError}>
        Error
      </button>
    </div>
  );
};
```

_./src/app.tsx_

```tsx
import * as React from "react";
import { usePromiseElement, GetProps } from "use-promise-element";

import { Modal, ModalProps } from "./modal";
import { Confirm } from "./confirm";

// Result modal promise
type ResolveResult = "success" | "cancel";

// Function to getting props component
const modalCreateProps: GetProps<ResolveResult, ModalProps> = (
  resolve,
  reject,
) => ({
  onSuccess: () => resolve("success"),
  onCancel: () => resolve("cancel"),
  onError: () => reject(),
});

export const App: React.FC = () => {
  // State with modal component
  const [modal, open, close] = usePromiseElement(Modal, modalCreateProps);

  // State with confirm (same modal) component (here use default props from hook)
  const [confirm, openConfirm] = usePromiseElement(Confirm);

  // State with result hooks with components: 'modal', 'confirm'
  const [result, setResult] = React.useState<ResolveResult | "error" | null>(
    null,
  );

  // Open 'modal'
  const onOpen = React.useCallback(async () => {
    try {
      const openRes = await open();
      setResult(openRes);
    } catch (e) {
      setResult("error");
    }
  }, [open]);

  // Open 'modal' and setup 'title' prop
  const onOpenWithTitle = React.useCallback(async () => {
    await open(() => ({
      title: "Confirm title",
    }));
  }, [open]);

  // Open 'confirm'
  const onOpenConfrim = React.useCallback(async () => {
    await openConfirm();
    setResult("success");
  }, [openConfirm]);

  // Close 'modal'
  const onClose = React.useCallback(() => {
    close();
    setResult(null);
  }, [close]);

  return (
    <div>
      <button className="app-open" onClick={onOpen}>
        Open
      </button>

      <button className="app-open-with-props" onClick={onOpenWithTitle}>
        Open with props
      </button>

      <button className="app-open-confirm" onClick={onOpenConfrim}>
        Open confirm
      </button>

      <button className="app-close" onClick={onClose}>
        Close
      </button>

      {/* Here insert 'modal' */}
      {modal}

      {/* Here insert 'confirm' */}
      {confirm}

      <div className="app-result">{result}</div>
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
