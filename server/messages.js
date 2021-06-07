class Message {
  static fromJson(data) {
    const json = JSON.parse(data);
    const instance = new this(json.text, json.sender);

    if (json.ts) {
      instance.ts = ts;
    }

    return instance;
  }

  /**
   *
   * @param {string} text
   * @param {string} sender
   */
  constructor(text, sender) {
    this.text = text;
    this.sender = sender;
    this.ts = Date.now();
  }

  toJSON() {
    return { ...this };
  }

  toString() {
    return JSON.stringify(this.toJSON());
  }
}


/**
 * @type {Message[]}
 */
const messages = [];

module.exports = { Message, messages };
