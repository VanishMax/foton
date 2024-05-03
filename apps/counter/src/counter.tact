import "@stdlib/deploy";
import "@stdlib/ownable";

message Add {
  queryId: Int as uint64;
  amount: Int as uint32;
}

struct User {
  address: Address;
  name: String = "Satoshi";
  age: Int?;
}

contract SimpleCounter with Deployable, Ownable {
  owner: Address;
  id: Int as uint32;
  counter: Int as uint32;

  init(id: Int, count: Int) {
    self.owner = sender();
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

  get fun params(address: Address, name: String, age: Int?): User {
    return User{address: address, name: name, age: age};
  }

  get fun isOdd(amount: Int): Bool {
    if (amount % 2 == 0) {
      return false;
    }
    return true;
  }
}
