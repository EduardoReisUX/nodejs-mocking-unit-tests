/** @typedef {import("./todo.js").default} Todo */
/** @typedef {{ list(): string, create(data: Todo): string }} ITodoRepository */

export default class TodoRepository {
  /**
   * @type {import("lokijs").Collection<Todo>}
   */
  #schedule;

  /**
   * @param {{ db: import("lokijs") }}
   */
  constructor({ db }) {
    this.#schedule = db.addCollection("schedule");
  }

  /**
   * @returns {Promise<Todo[]>}
   */
  async list() {
    return this.#schedule.find().map(({ meta, $loki, ...result }) => result);
  }

  /**
   * @param {Todo} data
   * @returns {Promise<Todo>}
   */
  async create(data) {
    return this.#schedule.insertOne(data);
  }
}
