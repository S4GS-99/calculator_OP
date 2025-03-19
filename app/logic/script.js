// # OPERATIONS
const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;

let numberA = 3;
let operator = '+';
let numberB = 5;

function handleOperation(a, operator, b) {
  switch (operator) {
    case '+':
      return add(a, b);
    case '-':
      return subtract(a, b);
    case '*':
    case 'x':
      return multiply(a, b);
    case '/':
      return divide(a, b);

    default:
      return undefined;
  }
}

console.log(handleOperation(numberA, operator, numberB));
