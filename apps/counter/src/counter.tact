import "@stdlib/deploy";

message Add {
  queryId: Int as uint64;
  amount: Int as uint32;
}

contract SimpleCounter with Deployable {
  id: Int as uint32;
  counter: Int as uint32;

  init(id: Int, count: Int) {
    self.id = id;
    self.counter = count;
  }

  receive(msg: Add) {
    self.counter += msg.amount;
  }

  receive() {
    self.counter += 1;
  }

  receive("increment") {
    self.counter += 1;
  }

  receive(str: String) {
    self.counter += 1;
  }

  get fun counter(): Int {
    return self.counter;
  }

  get fun id(): Int {
    return self.id;
  }

  get fun multiplier(factor: Int, subtract: Int): Int {
    return self.counter * factor - subtract;
  }
}
