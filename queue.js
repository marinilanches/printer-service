class Queue {
  constructor() {
    this.items = [];
    this.processing = false;
  }

  add(item) {
    this.items.push(item);
    this.process();
  }

  async process() {
    if (this.processing) return;

    this.processing = true;

    while (this.items.length > 0) {
      const job = this.items.shift();

      try {
        await job();
      } catch (e) {
        console.error("Erro na impressão:", e);
      }
    }

    this.processing = false;
  }
}

module.exports = new Queue();