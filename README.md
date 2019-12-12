# 🛠 React hook 'usePromiseElement'

[![npm](https://img.shields.io/npm/v/use-promise-element?style=flat)](https://www.npmjs.com/package/use-promise-element) [![npm bundle size](https://img.shields.io/bundlephobia/min/use-promise-element?color=success&label=minified&style=flat)](https://bundlephobia.com/result?p=use-promise-element) ![license](https://img.shields.io/npm/l/use-promise-element?style=flat) ![David](https://img.shields.io/david/EvgenyiFedotov/use-promise-element?style=flat) [![Storybook](https://cdn.jsdelivr.net/gh/storybookjs/brand@master/badge/badge-storybook.svg)](https://evgenyifedotov.github.io/use-promise-element)

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
  Close<Result>,
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

[`[CloseCallback]`](#CloseCallback)

```ts
/**
 * Type method closing component
 */
type Close<Result = any> = (callback?: CloseCallback<Result>) => void;
```

#### `CloseCallback`

```ts
/**
 * Function callback for run getting result promise
 */
type CloseCallback<Result = any> = (
  resolve: (value?: Result | PromiseLike<Result> | undefined) => void,
  reject: (reason?: any) => void,
) => void;
```

## Examples

It is simple example, for get more examples see [**storybook**](https://evgenyifedotov.github.io/use-promise-element).

_./src/modal.tsx_

```tsx
import * as React from "react";

export interface ModalProps {
  onSuccess?(): void;
  onCancel?(): void;
}

export const Modal: React.FC<ModalProps> = (props) => {
  return (
    <div className="modal">
      <div className="modal-title">Modal window</div>

      <button className="modal-success" onClick={props.onSuccess}>
        Success
      </button>

      <button className="modal-close" onClick={props.onCancel}>
        Cancel
      </button>
    </div>
  );
};
```

_./src/app.tsx_

```tsx
import * as React from "react";
import { usePromiseElement } from "use-promise-element";
import { Modal } from "./modal";

export const App: React.FC = () => {
  /**
   * Use hook with set default props for component
   * (resolve, reject) => ({ onSuccess: resolve, onCancel: reject })
   */
  const [modal, open] = usePromiseElement(Modal);

  const clickOpne = React.useCallback(async () => {
    try {
      // Open Modal (create Modal)
      await open();

      // Code after click on button 'Success' in Modal
    } catch (e) {
      // Code after click on button 'Cancel' in Modal
    }
  }, [open]);

  return (
    <div>
      <button>Open</button>

      {/* insert modal */}
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
