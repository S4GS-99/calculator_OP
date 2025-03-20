////////
let firstNumber = '';
let operator = '';
let secondNumber = '';
let shouldResetDisplay = false;
////////

// DOM
const DISPLAY = document.querySelector('#display');
const NUMBERS = document.querySelectorAll('[data-number]');
const OPERATORS = document.querySelectorAll('[data-operator]');
const EQUALS = document.querySelector('[data-equals]');
const CLEAR = document.querySelector('[data-clear]');

// EVENT LISTENERS
NUMBERS.forEach(button =>
  button.addEventListener('click', () => handleNumber(button.textContent))
);
OPERATORS.forEach(button =>
  button.addEventListener('click', () => handleOperator(button.textContent))
);
EQUALS.addEventListener('click', () => evaluate());
CLEAR.addEventListener('click', () => resetCalculator());

// DISPLAY
const para = document.createElement('p');
para.textContent = '';
DISPLAY.appendChild(para);

// FUNCTIONS
function evaluate() {
  if (firstNumber === '' || operator === '' || secondNumber === '') return;

  const a = parseInt(firstNumber);
  const b = parseInt(secondNumber);
  let result;

  switch (operator) {
    case '+':
      result = a + b;
      break;
    case '-':
      result = a - b;
      break;
    case '*':
    case 'x':
      result = a * b;
      break;
    case '/':
      result = b !== 0 ? a / b : 'Error';
      break;
  }

  resetCalculator();
  DISPLAY.textContent = result;

  // The result becomes 'firstNumber' to keep calculating over it
  firstNumber = result;
}

function handleNumber(number) {
  if (shouldResetDisplay) {
    DISPLAY.textContent = '';
    shouldResetDisplay = false;
  }

  if (operator === '') {
    firstNumber += parseInt(number);
    DISPLAY.textContent = firstNumber;
  } else {
    secondNumber += parseInt(number);
    DISPLAY.textContent = secondNumber;
  }
}

function handleOperator(sign) {
  if (firstNumber === '') return;
  if (secondNumber !== '') evaluate();

  operator = sign;
}

function resetCalculator() {
  DISPLAY.textContent = '';
  firstNumber = '';
  operator = '';
  secondNumber = '';
  shouldResetDisplay = false;
}
