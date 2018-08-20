export { getFullName }

function getFullName(object) {
  return (
    object.name +
    '(' +
    object.inputs
      .map(
        input =>
          input.type === 'uint' || input.type === 'int'
            ? input.type + '256'
            : input.type,
      )
      .join() +
    ')'
  )
}
