import { describe, it, beforeEach, before, after } from "node:test";
import assert from "node:assert";
import crypto from "node:crypto";
import Todo from "../src/todo.js";
import TodoService from "../src/todoService.js";

describe("TodoService", () => {
  describe("#list", () => {
    /** @type {TodoService} */
    let _todoService;
    let _dependencies;

    const mockDatabase = [
      {
        text: "I must plan my trip to Europe",
        when: new Date("2021-03-22T00:00:00.000Z"),
        status: "late",
        id: "23859546-5702-4c22-b784-e10eb0ecbed6",
      },
    ];

    beforeEach((context) => {
      _dependencies = {
        todoRepository: {
          list: context.mock.fn(async () => mockDatabase),
        },
      };

      _todoService = new TodoService(_dependencies);
    });

    it("should return a list of items with uppercase", async () => {
      const expected = mockDatabase.map(({ text, ...result }) => ({
        text: text.toUpperCase(),
        ...result,
      }));

      const result = await _todoService.list();
      assert.deepStrictEqual(result, expected);

      const fnMock = _dependencies.todoRepository.list.mock;
      assert.strictEqual(fnMock.callCount(), 1);
    });
  });

  describe("#create", () => {
    /** @type {TodoService} */
    let _todoService;
    let _dependencies;

    const mockDatabase = [
      {
        text: "I must plan my trip to Europe",
        when: new Date("2021-03-22T00:00:00.000Z"),
        status: "late",
        id: "23859546-5702-4c22-b784-e10eb0ecbed6",
      },
    ];

    before(() => {
      const DEFAULT_ID = "0001";
      crypto.randomUUID = () => DEFAULT_ID;
    });

    after(async () => {
      crypto.randomUUID = (await import("node:crypto")).randomUUID;
    });

    beforeEach((context) => {
      _dependencies = {
        todoRepository: {
          create: context.mock.fn(async () => mockDatabase),
        },
      };

      _todoService = new TodoService(_dependencies);
    });

    it("should not create a todo item with invalid data", async () => {
      const expectedDatabase = mockDatabase;
      const newTodo = new Todo({ text: "new todo", when: "today" });
      const expectedTodo = {
        error: {
          message: "invalid data",
          data: {
            text: "new todo",
            when: "today",
            status: "",
            id: "0001",
          },
        },
      };

      const result = _todoService.create(newTodo);

      assert.ok("error" in result);
      assert.deepStrictEqual(mockDatabase, expectedDatabase);
      assert.deepStrictEqual(
        JSON.stringify(result),
        JSON.stringify(expectedTodo)
      );
    });

    it.todo("should be able to create a todo", () => {
      // assert.strictEqual(1, 2);
    });
  });
});
