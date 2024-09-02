import { render, screen, act } from "@testing-library/react";

import Page from "./page";

describe("Page", () => {
  describe("GIVEN a user opens the page", () => {
    describe("WHEN the application loads", () => {
      test("THEN a list of all music events should be displayed.", async () => {
        // arrangement
        window.fetch = () =>
          Promise.resolve({
            json: () => [{ name: "mock event name" }],
          });

        // act
        await act(async () => {
          render(<Page />);
        });

        // assert
        expect(screen.getAllByText("mock event name").length).toEqual(2);
      });
    });
  });
});
