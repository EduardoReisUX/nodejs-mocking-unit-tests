import { describe, it, beforeEach, afterEach, before, after } from "node:test";
import assert from "node:assert";
import crypto from "node:crypto";
import Todo from "../src/todo.js";
import TodoService from "../src/todoService.js";
import sinon from "sinon";

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
    /** @type {sinon.SinonSandbox} */
    let _sandbox;

    const mockCreateResult = [
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
      _sandbox = sinon.createSandbox();
    });

    afterEach(() => _sandbox.restore());

    after(async () => {
      crypto.randomUUID = (await import("node:crypto")).randomUUID;
    });

    beforeEach((context) => {
      _dependencies = {
        todoRepository: {
          create: context.mock.fn(async () => mockCreateResult),
        },
      };

      _todoService = new TodoService(_dependencies);
    });

    it("should not create a todo item with invalid data", async () => {
      const expectedDatabase = mockCreateResult;
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
      assert.deepStrictEqual(mockCreateResult, expectedDatabase);
      assert.deepStrictEqual(
        JSON.stringify(result),
        JSON.stringify(expectedTodo)
      );
    });

    it("should create todo with late status when property is further than today", async () => {
      const properties = {
        text: "I must plan my trip to Europe",
        when: new Date("2020-12-01 12:00:00 GMT-0"),
      };

      const input = new Todo(properties);
      const expected = {
        ...properties,
        status: "late",
        id: "0001",
      };

      const today = new Date("2020-12-02");
      _sandbox.useFakeTimers(today.getTime());

      await _todoService.create(input);

      const fnMock = _dependencies.todoRepository.create.mock;
      assert.strictEqual(fnMock.callCount(), 1);

      assert.deepStrictEqual(fnMock.calls[0].arguments[0], expected);
    });

    it("should create todo with pending status when property is in the past", async () => {
      const properties = {
        text: "I must plan my trip to Europe",
        when: new Date("2020-12-02 12:00:00 GMT-0"),
      };

      const input = new Todo(properties);
      const expected = {
        ...properties,
        status: "pending",
        id: "0001",
      };

      const today = new Date("2020-12-01");
      _sandbox.useFakeTimers(today.getTime());

      await _todoService.create(input);

      const fnMock = _dependencies.todoRepository.create.mock;
      assert.strictEqual(fnMock.callCount(), 1);

      assert.deepStrictEqual(fnMock.calls[0].arguments[0], expected);
    });
  });
});
