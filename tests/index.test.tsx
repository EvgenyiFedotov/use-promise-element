import "@babel/polyfill";
import * as React from "react";
import * as enzyme from "enzyme";
import ReactTestUtils from "react-dom/test-utils";

import { Modal } from "./components/modal";
import { Confirm } from "./components/confirm";
import { App } from "./components/app";

let app: enzyme.ReactWrapper;

const simulate = async (wrapper: enzyme.ReactWrapper, nameEvent: string) => {
  await ReactTestUtils.act(async () => {
    wrapper.simulate(nameEvent);
  });

  app.update();
};

beforeEach(() => {
  app = enzyme.mount(<App />);
});

describe("modal didn't open", () => {
  test("result app", () => {
    expect(app.find(".app-result").text()).toBe("");
  });

  test("result modal", () => {
    expect(app.find(Modal)).toHaveLength(0);
  });
});

describe("open modal", () => {
  beforeEach(async () => {
    await simulate(app.find(".app-open"), "click");
  });

  test("exist modal", async () => {
    expect(app.find(Modal)).toHaveLength(1);
  });

  describe("close after resolve", () => {
    const close = async (selectorButton: string) => {
      await simulate(app.find(Modal).find(selectorButton), "click");
    };

    describe("success", () => {
      beforeEach(async () => {
        await close(".modal-success");
      });

      test("exist modal", () => {
        expect(app.find(Modal)).toHaveLength(0);
      });

      test("result app", () => {
        expect(app.find(".app-result").text()).toBe("success");
      });
    });

    describe("cancel", () => {
      beforeEach(async () => {
        await close(".modal-close");
      });

      test("exist modal", () => {
        expect(app.find(Modal)).toHaveLength(0);
      });

      test("result app", () => {
        expect(app.find(".app-result").text()).toBe("cancel");
      });
    });
  });

  describe("close after run method 'close'", () => {
    describe("without close result", () => {
      beforeEach(async () => {
        await simulate(app.find(".app-close"), "click");
      });

      test("exist modal", () => {
        expect(app.find(Modal)).toHaveLength(0);
      });

      test("result app", () => {
        expect(app.find(".app-result").text()).toBe("");
      });
    });

    describe("with close result", () => {
      describe("resolve", () => {
        beforeEach(async () => {
          await simulate(app.find(".app-close-result-resolve"), "click");
        });

        test("exist modal", () => {
          expect(app.find(Modal)).toHaveLength(0);
        });

        test("result app", () => {
          expect(app.find(".app-result").text()).toBe("success");
        });
      });

      describe("reject", () => {
        beforeEach(async () => {
          await simulate(app.find(".app-close-result-reject"), "click");
        });

        test("exist modal", () => {
          expect(app.find(Modal)).toHaveLength(0);
        });

        test("result app", () => {
          expect(app.find(".app-result").text()).toBe("error");
        });
      });
    });
  });

  describe("close after error", () => {
    beforeEach(async () => {
      await simulate(app.find(Modal).find(".modal-error"), "click");
    });

    test("exist modal", () => {
      expect(app.find(Modal)).toHaveLength(0);
    });

    test("result app", () => {
      expect(app.find(".app-result").text()).toBe("error");
    });
  });
});

describe("open modal with props", () => {
  beforeEach(async () => {
    await simulate(app.find(".app-open-with-props"), "click");
  });

  test("exist modal", () => {
    expect(app.find(Modal)).toHaveLength(1);
  });

  test("equal title", () => {
    expect(
      app
        .find(Modal)
        .find(".modal-title")
        .text(),
    ).toBe("Confirm title");
  });
});

describe("open modal confirm without props", () => {
  beforeEach(async () => {
    await simulate(app.find(".app-open-confirm"), "click");
  });

  test("exist modal", () => {
    expect(app.find(Confirm)).toHaveLength(1);
  });

  describe("close", () => {
    beforeEach(async () => {
      await simulate(app.find(Confirm).find(".confirm-success"), "click");
    });

    test("exist modal", () => {
      expect(app.find(Confirm)).toHaveLength(0);
    });

    test("result app", () => {
      expect(app.find(".app-result").text()).toBe("success");
    });
  });
});
