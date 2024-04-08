import "@stdlib/deploy";

message Add {
    queryId: Int as uint64;
    amount: Int as uint32;
}

contract Counter with Deployable {
    counter: Int as uint32;

    init() {
        self.counter = 0;
    }

    receive(msg: Add) {
        self.counter += msg.amount;
    }

    get fun counter(): Int {
        return self.counter;
    }
}
