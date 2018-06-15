export function namehash(name: string) {
  let node: string =
    '0x0000000000000000000000000000000000000000000000000000000000000000';
  if (name !== '') {
    const labels = name.split('.');
    for (let i = labels.length - 1; i >= 0; i--) {
      node = keccak256(node + keccak256(labels[i]).slice(2));
    }
  }
  return node;
}

export function subnodeHash(node: Types.Data, ...labels: string[]) {
  let parentNode = serialize.data(node);
  labels.forEach(label => {
    parentNode = keccak256(parentNode + label.replace('0x', ''));
  });
  return parentNode;
}
