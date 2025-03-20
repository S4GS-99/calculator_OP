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

/**
 * Evaluates the arithmetic operation based on the stored numbers and operator.
 * * If any required operand or operator is missing, the function returns without performing calculation.
 * * After calculation, it resets the calculator state and displays the result.
 * * The result becomes the first number for subsequent calculations.
 * @returns {void}
 * @throws {string} Returns 'Error' string when attempting division by zero
 */
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
  para.textContent = result;

  // The result becomes 'firstNumber' to keep calculating over it
  firstNumber = result;
}

/**
 * Handles numeric input for the calculator display.
 * * If shouldResetDisplay is true, clears the display before adding the new number.
 * * If no operator is set, appends to firstNumber, otherwise appends to secondNumber.
 * * Updates the display with the current number being entered.
 * @param {string} number - The numeric character to be added to the display
 */
function handleNumber(number) {
  if (shouldResetDisplay) {
    para.textContent = '';
    shouldResetDisplay = false;
  }

  if (operator === '') {
    firstNumber += number;
    para.textContent = firstNumber;
  } else {
    secondNumber += number;
    para.textContent = secondNumber;
  }
}

/**
 * Handles the operator input for the calculator operations.
 * * If the first number is not set, the function exits early.
 * * If the second number is already set, it evaluates the current operation
 * before assigning the new operator.
 * @param {string} sign - The operator symbol (e.g., '+', '-', '*', '/').
 */
function handleOperator(sign) {
  if (firstNumber === '') return;
  if (secondNumber !== '') evaluate();

  operator = sign;
}

/**
 * Resets the calculator to its initial state by clearing the display,
 * resetting the stored numbers and operator, and disabling the display reset flag.
 */
function resetCalculator() {
  para.textContent = '';
  firstNumber = '';
  operator = '';
  secondNumber = '';
  shouldResetDisplay = false;
}
