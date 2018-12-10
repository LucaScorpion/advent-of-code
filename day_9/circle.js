class Circle {
    constructor(initValue) {
        this.first = new LinkedListNode(initValue);
        this.first.next = this.first;
        this.first.prev = this.first;
    }

    destroy(node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    insertAfter(node, value) {
        // Create the new node.
        let newNode = new LinkedListNode(value);
        newNode.next = node.next;
        newNode.prev = node;

        // Insert and return it.
        newNode.next.prev = newNode;
        newNode.prev.next = newNode;
        return newNode;
    }
}

class LinkedListNode {
    constructor(value) {
        this.value = value;
        this.prev = null;
        this.next = null;
    }
}

module.exports = Circle;
