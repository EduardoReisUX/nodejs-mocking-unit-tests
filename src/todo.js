import crypto from "node:crypto";

export default class Todo {
  /**
   * @param {{ text: string, when: Date }}
   */
  constructor({ text, when }) {
    /**
     * @type {string}
     */
    this.text = text;
    /**
     * @type {Date}
     */
    this.when = when;

    /**
     * @type {string}
     */
    this.status = "";

    /**
     * @type {string}
     */
    this.id = crypto.randomUUID();
  }

  isValid() {
    return !!this.text && !isNaN(this.when.valueOf());
  }
}
