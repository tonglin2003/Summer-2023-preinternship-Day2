class Node {
  constructor(value, next=null) {
    this.value = value;
    this.next = next;
  }
}

function hasCycle(head) {
  let fast = head;
  let slow = head;

  while (fast !== null && fast.next !== null)
  {
    fast = fast.next.next;
    slow = slow.next;
    if (fast === slow)
    {
      return true;
    }
  }
  return false;
}

module.exports = {
  hasCycle,
  Node
};
