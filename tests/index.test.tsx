import * as React from "react";
import { mount } from "enzyme";

const Modal = () => {
  return <></>;
};

test("main", () => {
  const wrapper = mount(<Modal />);
  console.log(wrapper);
});
