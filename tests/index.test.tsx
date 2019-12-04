import "@babel/polyfill";
import * as React from "react";
import * as enzyme from "enzyme";
import ReactTestUtils from "react-dom/test-utils";
import ReactDOM from "react-dom";

import { useNodePromise } from "../src";

interface ModalProps {
  onClose?(e: React.MouseEvent<HTMLDivElement>): void;
  onError?(): void;
}

const Modal: React.FC<ModalProps> = (props) => {
  return (
    <div className="modal" onClick={props.onClose}>
      modal
    </div>
  );
};

const modalCreateProps = (resolve, reject) => ({
  onClose: (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    resolve();
  },
  onError: () => {
    reject();
  },
});

const App: React.FC = (props) => {
  const [modal, create] = useNodePromise(Modal, modalCreateProps);

  const onClick = React.useCallback(() => {
    create();
  }, [create]);

  return <div onClick={onClick}>{modal}</div>;
};

describe("html app", () => {
  test("without modal", () => {
    const app = enzyme.mount(<App />);

    expect(app.html()).toBe("<div></div>");
  });

  test("with modal", async () => {
    const app = enzyme.mount(<App />);

    app.simulate("click");

    expect(app.find(Modal)).toHaveLength(1);
  });

  test.skip("open modal and close", async () => {
    const app = enzyme.mount(<App />);

    ReactTestUtils.act(() => {
      app.simulate("click");
    });

    app.update();

    ReactTestUtils.act(() => {
      app.find(Modal).simulate("click");
    });

    app.update();

    expect(app.find(Modal)).toHaveLength(0);
  });
});
