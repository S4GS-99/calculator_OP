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
    case operator === '+':
      add(a, b);
      break;
    case operator === '-':
      subtract(a, b);
      break;
    case operator === '*':
    case operator === 'x':
      multiply(a, b);
      break;
    case operator === '/':
      divide(a, b);
      break;

    default:
      break;
  }
}
