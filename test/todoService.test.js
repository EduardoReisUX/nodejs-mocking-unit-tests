import { describe, it, beforeEach } from "node:test";
import assert from "node:assert";
import TodoService from "../src/todoService.js";

describe("TodoService", () => {
  describe("#list", () => {
    /** @type {TodoService} */
    let _todoService;

    const mockDatabase = [
      {
        text: "I must plan my trip to Europe",
        when: new Date("2021-03-22T00:00:00.000Z"),
        status: "late",
        id: "23859546-5702-4c22-b784-e10eb0ecbed6",
      },
    ];

    beforeEach((context) => {
      const dependencies = {
        todoRepository: {
          list: context.mock.fn(async () => mockDatabase),
        },
      };

      _todoService = new TodoService(dependencies);
    });
    it("should return a list of items with uppercase", async () => {
      const expected = mockDatabase.map(({ text, ...result }) => ({
        text: text.toUpperCase(),
        ...result,
      }));

      const result = await _todoService.list();

      assert.deepStrictEqual(result, expected);
    });
  });
});
