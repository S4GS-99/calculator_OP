////////
// INITIAL STATE
let firstNumber = '';
let operator = '';
let secondNumber = '';
let shouldResetDisplay = false;

// Configurable precision for decimal results
const DECIMAL_PRECISION = 2;
////////

// DOM
const DISPLAY = document.querySelector('#display');
const MEMORY_SYMBOL = document.querySelector('#memory');
const CURRENT_OPERATION = document.querySelector('#operation');
const RESULT = document.querySelector('#result');
const NUMBERS = document.querySelectorAll('[data-number]');
const OPERATORS = document.querySelectorAll('[data-operator]');
const EQUALS = document.querySelector('[data-equals]');
const CLEAR = document.querySelector('[data-clear]');

const DECIMAL_SEPARATOR = [...NUMBERS].find(
  element => element.textContent === '.'
);

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
 * * Non-integer results are formatted to a configurable decimal precision (default: 2).
 * * The result becomes the first number for subsequent calculations.
 * @returns {void}
 * @throws {string} Returns 'Error' string when attempting division by zero
 */
function evaluate() {
  if (firstNumber === '' || operator === '' || secondNumber === '') return;

  const a = parseFloat(firstNumber);
  const b = parseFloat(secondNumber);
  let result;

  switch (operator) {
    case '+':
      result = a + b;
      break;
    case '-':
      result = a - b;
      break;
    case '*':
    case 'X':
      result = a * b;
      break;
    case '/':
    case '÷':
      if (b === 0) {
        resetCalculator();
        RESULT.textContent = 'ERROR';
        return;
      }
      result = a / b;
      break;
    default:
      // Handle unexpected operators
      resetCalculator();
      RESULT.textContent = 'ERROR';
      console.error(`Unexpected operator: ${operator}`);
      return;
  }

  const formattedOperation = formatIfFloat(Number(secondNumber));
  const formattedResult = formatIfFloat(Number(result));
  CURRENT_OPERATION.textContent += ` ${formattedOperation} =`;
  RESULT.textContent = formattedResult;

  // The result becomes 'firstNumber' to keep calculating over it
  firstNumber = result;
  operator = '';
  secondNumber = '';
  // Set the flag to reset the display on the next number input
  shouldResetDisplay = true;
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
    resetDisplay();
  }

  if (operator === '') {
    // Prevent multiple decimal points in firstNumber
    if (number === '.' && firstNumber.includes('.')) return;

    firstNumber += number;
    RESULT.textContent = firstNumber;
  } else {
    // Prevent multiple decimal points in secondNumber
    if (number === '.' && secondNumber.includes('.')) return;

    secondNumber += number;
    RESULT.textContent = secondNumber;
  }
}

/**
 * Handles the operator input for the calculator operations.
 * * If the first number is not set, the function exits early.
 * * If the second number is already set, it evaluates the current operation before assigning the new operator.
 * @param {string} sign - The operator symbol (e.g., '+', '-', '*', '/').
 */
function handleOperator(sign) {
  if (firstNumber === '') return;
  if (firstNumber !== '') {
    CURRENT_OPERATION.textContent = `${firstNumber}  ${sign}`;
    RESULT.textContent = '';
  }
  if (secondNumber !== '') evaluate();

  operator = sign;
  shouldResetDisplay = false;
}

function formatIfFloat(number) {
  if (typeof number !== 'number') return;

  // Formatting to 2 decimals if number is a Float
  return !Number.isInteger(number)
    ? parseFloat(number.toFixed(DECIMAL_PRECISION))
    : number;
}

/**
 * Clears the display and resets relevant variables when the display reset flag is set.
 */
function resetDisplay() {
  firstNumber = '';
  MEMORY_SYMBOL.textContent = '';
  CURRENT_OPERATION.textContent = '';
  RESULT.textContent = '';
  shouldResetDisplay = false;
}

/**
 * Resets the calculator to its initial state by clearing the display,
 * resetting the stored numbers and operator, and disabling the display reset flag.
 */
function resetCalculator() {
  MEMORY_SYMBOL.textContent = '';
  CURRENT_OPERATION.textContent = '';
  RESULT.textContent = '';
  firstNumber = '';
  operator = '';
  secondNumber = '';
  shouldResetDisplay = false;
}
