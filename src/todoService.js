/** @typedef {import("./todo.js").default} Todo */
/** @typedef {import("./todoRepository.js").default} TodoRepository */

export default class TodoService {
  /**
   * @type {TodoRepository}
   */
  #todoRepository;

  /**
   * @param {{ todoRepository: TodoRepository }}
   */
  constructor({ todoRepository }) {
    this.#todoRepository = todoRepository;
  }

  /**
   * @param {Todo} todoItem
   */
  create(todoItem) {
    if (!todoItem.isValid()) {
      return {
        error: {
          message: "invalid data",
          data: todoItem,
        },
      };
    }

    const { when } = todoItem;
    const today = new Date();
    const todo = {
      ...todoItem,
      status: when > today ? "pending" : "late",
    };

    return this.#todoRepository.create(todo);
  }

  /**
   * @return {Promise<Todo[]>}
   */
  async list() {
    return (await this.#todoRepository.list()).map(({ text, ...result }) => ({
      text: text.toUpperCase(),
      ...result,
    }));
  }
}
