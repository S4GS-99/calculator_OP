////////
// INITIAL STATE
let firstNumber = '';
let operator = '';
let secondNumber = '';
let memoryValue = 0;
let memoryIsActive = false;
let shouldResetDisplay = false;
let shouldResetCalculator = false;

// Configurable precision for decimal results
const DECIMAL_PRECISION = 2;

////////
// DOM
// DISPLAY
const DISPLAY = document.querySelector('#display');
const CURRENT_MEMORY = document.querySelector('#memory');
const CURRENT_OPERATION = document.querySelector('#operation');
const RESULT = document.querySelector('#result');
// NUMBERS AND OPERATIONS
const NUMBERS = document.querySelectorAll('[data-number]');
const OPERATORS = document.querySelectorAll('[data-operator]');
const EQUALS = document.querySelector('[data-equals]');
// CLEAR
const RESET = document.querySelector('[data-clear="all"]');
const CLEAR = document.querySelector('[data-clear="entry"]');
// FUNCTIONS
const BACKSPACE = document.querySelector('[data-function="backspace"]');
const INVERT = document.querySelector('[data-function="invert"]');
const ROOT = document.querySelector('[data-function="root"]');
const SQUARE = document.querySelector('[data-function="sqr"]');
const PERCENT = document.querySelector('[data-function="percent"]');
const RECIPROCAL = document.querySelector('[data-function="reciprocal"]');
// MEMORY
const MEMORY_CLEAR = document.querySelector('[data-memory="clear"]');
const MEMORY_RECALL = document.querySelector('[data-memory="recall"]');
const MEMORY_ADD = document.querySelector('[data-memory="add"]');
const MEMORY_SUBTRACT = document.querySelector('[data-memory="subtract"]');

const DECIMAL_SEPARATOR = [...NUMBERS].find(
  element => element.textContent === '.'
);

// EVENT LISTENERS
// Add keyboard support
document.addEventListener('keydown', handleKeyboardInput);

NUMBERS.forEach(button =>
  button.addEventListener('click', () => handleNumber(button.textContent))
);
OPERATORS.forEach(button =>
  button.addEventListener('click', () => handleOperator(button.textContent))
);
EQUALS.addEventListener('click', () => evaluate());
RESET.addEventListener('click', () => resetCalculator());
CLEAR.addEventListener('click', () => resetLastEntry());
BACKSPACE.addEventListener('click', () => handleBackspace());
INVERT.addEventListener('click', () => invertNumber());
ROOT.addEventListener('click', () => rootNumber());
SQUARE.addEventListener('click', () => squareNumber());
PERCENT.addEventListener('click', () => makePercent());
RECIPROCAL.addEventListener('click', () => makeReciprocal());
MEMORY_CLEAR.addEventListener('click', () => handleMemory('clear'));
MEMORY_RECALL.addEventListener('click', () => handleMemory('recall'));
MEMORY_ADD.addEventListener('click', () => handleMemory('add'));
MEMORY_SUBTRACT.addEventListener('click', () => handleMemory('subtract'));

// FUNCTIONS
/**
 * Handles keyboard input events for calculator operations
 *
 * Processes keyboard inputs for:
 * - Numbers (0-9) and decimal '.' point
 * - Operators (+, -, *, /, x)
 * - Enter or '=' for evaluation
 * - Backspace for deletion
 * - Escape for resetting last entry
 * - 'c' key for full calculator reset
 * @param {KeyboardEvent} e - The keyboard event object
 */
function handleKeyboardInput(e) {
  const key = e.key;
  const ctrlKey = e.ctrlKey;

  if (ctrlKey) {
    e.preventDefault();
    switch (key.toLowerCase()) {
      // Memory functions
      case 'a':
        handleMemory('add');
        break;
      case 's':
        handleMemory('subtract');
        break;
      case 'r':
        handleMemory('recall');
        break;
      case 'q':
        handleMemory('clear');
        break;

      default:
        break;
    }
  }

  if (!isNaN(key) || key === '.') {
    // Reset the display if needed before handling the number
    if (shouldResetDisplay) {
      resetDisplay();
    }
    handleNumber(key);
  } else if (['+', '-', '*', '/'].includes(key) || key.toLowerCase() === 'x') {
    handleOperator(key);
  } else if (key === 'Enter' || key === '=') {
    evaluate();
  } else if (key === 'Backspace') {
    handleBackspace();
  } else if (key === 'Escape') {
    resetLastEntry();
  } else if (key.toLowerCase() === 'c') {
    resetCalculator();
  }
}

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
        handleDivisionByZero();
        return;
      }
      result = a / b;
      break;
    default:
      // Handle unexpected operators

      return;
  }
}

/**
 * Handles the scenario where a division by zero is attempted.
 * Resets the calculator, displays an error message, and sets a flag
 * to indicate that the calculator should be reset.
 */
function handleDivisionByZero() {
  resetCalculator();
  RESULT.classList.add('error');
  RESULT.textContent = 'Cannot divide by zero';
  shouldResetCalculator = true;
}

/**
 * Handles unexpected operator errors in the calculator.
 * Resets the calculator state, displays an error message,
 * and logs the unexpected operator to the console.
 */
function handleUnexpectedOperator() {
  resetCalculator();
  RESULT.textContent = 'ERROR';
  console.error(`Unexpected operator: ${operator}`);
}

/**
 * Updates the display with the result of the current operation and prepares for the next calculation.
 *
 * @param {number|string} result - The result of the current operation to be displayed and used for subsequent calculations.
 */
function updateResult(result) {
  const formattedOperation = formatIfFloat(Number(secondNumber));
  const formattedResult = formatIfFloat(Number(result));
  CURRENT_OPERATION.textContent += ` ${formattedOperation} =`;
  RESULT.textContent = formattedResult;

  firstNumber = formatIfFloat(result); // The result becomes 'firstNumber' to keep calculating over it
  operator = '';
  secondNumber = ''; // Set the flag to reset the display on the next number input
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
  if (shouldResetCalculator) {
    resetCalculator();
  }

  if (shouldResetDisplay) {
    resetDisplay();
  }

  if (operator === '') {
    // Prevent multiple decimal points in firstNumber
    if (number === '.' && firstNumber.includes('.')) return;

    // Stop input if firstNumber reaches 9 digits
    if (firstNumber.replace('.', '').length >= 9) return;

    firstNumber += number;
    RESULT.textContent = firstNumber;
  } else {
    // Prevent multiple decimal points in secondNumber
    if (number === '.' && secondNumber.includes('.')) return;

    // Stop input if secondNumber reaches 9 digits
    if (secondNumber.replace('.', '').length >= 9) return;

    secondNumber += number;
    RESULT.textContent = secondNumber;
  }
}

/**
 * Handles the selection of an operator for a calculator operation.
 * Updates the first number is not set, the function exits early.
 * If the second number is already set, it evaluates the current operation before assigning the new operator.
 *
 * @param {string} sign - The operator sign selected by the user.
 *                        Can be '+', '-', '*', '/', 'x', etc.
 *                        The 'x' or '*' signs are normalized to 'X'.
 *
 * Side effects:
 * - Updates CURRENT_OPERATION display
 * - Updates RESULT display
 * - May trigger evaluation of previous operation
 * - Modifies global variables: operator, shouldResetDisplay
 */
function handleOperator(sign) {
  if (firstNumber === '') return;

  const multiplicationSign = 'X';

  if (sign === '*' || sign === 'x') sign = multiplicationSign;
  if (secondNumber !== '') evaluate();

  CURRENT_OPERATION.textContent = `${firstNumber}  ${sign}`;
  RESULT.textContent = '';
  operator = sign;
  shouldResetDisplay = false;
}

/**
 * Handles memory-related actions for a calculator application.
 *
 * @param {string} action - The memory action to perform.
 *
 * Possible values are:
 * - add: Adds the current result to memory.
 * - subtract: Subtracts the current result from memory.
 * - recall: Recalls the value stored in memory and updates the display.
 * - clear: Clears the memory and resets the display.
 */
function handleMemory(action) {
  if (RESULT.textContent === '') return;

  if (action === 'add') {
    updateMemory('add', Number(RESULT.textContent));
  }
  if (action === 'subtract') {
    updateMemory('subtract', Number(RESULT.textContent));
  }
  if (action === 'recall') {
    operator === ''
      ? (firstNumber = memoryValue.toString())
      : (secondNumber = memoryValue.toString());

    RESULT.textContent = memoryValue;
    memoryIsActive = true;
    shouldResetDisplay = true;
  }
  if (action === 'clear') {
    memoryValue = 0;
    memoryIsActive = false;
    resetDisplay();
  }
}

/**
 * Updates the memory value based on the specified action and value.
 *
 * @param {string} action - The action to perform on the memory value. Accepts 'add' to increase or 'subtract' to decrease the memory value.
 * @param {number} value - The numeric value to add or subtract from the memory.
 */
function updateMemory(action, value) {
  action === 'add'
    ? (memoryValue += value)
    : action === 'subtract'
    ? (memoryValue -= value)
    : null;

  CURRENT_MEMORY.textContent = `M${memoryValue}`;
  memoryIsActive = true;
  shouldResetDisplay = true;
}

/**
 * Inverts the sign of the currently active number.
 * Uses the `updateActiveNumber` function to apply the inversion.
 */
function invertNumber() {
  updateActiveNumber(number => -1 * number);
}

/**
 * Calculates the square root of the current active number and updates it.
 * Utilizes the `updateActiveNumber` function to apply the square root operation.
 */
function rootNumber() {
  updateActiveNumber(number => Math.sqrt(number));
}

/**
 * Squares the current active number by raising it to the power of 2.
 * Utilizes the `updateActiveNumber` function to apply the transformation.
 */
function squareNumber() {
  updateActiveNumber(number => number ** 2);
}

/**
 * Converts the active number to its percentage equivalent by dividing it by 100.
 * Utilizes the `updateActiveNumber` function to apply the transformation.
 */
function makePercent() {
  updateActiveNumber(number => number / 100);
}

/**
 * Converts the active number to its reciprocal (1 divided by the number).
 * Utilizes the `updateActiveNumber` function to update the active number.
 *
 * @throws {Error} If the active number is zero, as division by zero is undefined.
 */
function makeReciprocal() {
  updateActiveNumber(number => 1 / number);
}

/**
 * Formats a number to have a maximum of 2 decimal places if it's a float number
 * @param {number} number - The number to format
 * @returns {(number|undefined)} The formatted number if input is valid, undefined otherwise
 */
function formatIfFloat(number) {
  if (typeof number !== 'number') return;

  // Formatting to 2 decimals if number is a Float
  return !Number.isInteger(number)
    ? Number(number.toFixed(DECIMAL_PRECISION))
    : number;
}

/**
 * Resets the calculator display by clearing the current numbers and display.
 * Also resets the flag indicating whether the display should be reset.
 */
function resetDisplay() {
  if (memoryIsActive) {
    firstNumber = '';
    RESULT.textContent = '';
    shouldResetDisplay = false;
  } else if (!memoryIsActive) {
    memoryValue = false;
    CURRENT_MEMORY.textContent = '';
    shouldResetDisplay = false;
  } else {
    firstNumber = '';
    CURRENT_MEMORY.textContent = '';
    CURRENT_OPERATION.textContent = '';
    RESULT.textContent = '';
    shouldResetDisplay = false;
  }
}

/**
 * Removes the last digit from the currently active number (firstNumber or secondNumber), and updates the display.
 */
function handleBackspace() {
  updateActiveNumber(number => number.toString().slice(0, -1) || '');
}

/**
 * Resets the last entered number by updating the active number to an empty string.
 * Utilizes the `updateActiveNumber` function to perform the update.
 */
function resetLastEntry() {
  updateActiveNumber(() => '');
}

/**
 * Resets the calculator to its initial state by clearing the display,
 * resetting the stored numbers and operator, and disabling the display reset flag.
 */
function resetCalculator() {
  RESULT.classList.remove('error');

  CURRENT_MEMORY.textContent = '';
  CURRENT_OPERATION.textContent = '';
  RESULT.textContent = '';
  memoryValue = 0;
  firstNumber = '';
  operator = '';
  secondNumber = '';
  shouldResetCalculator = false;
}

/**
 * Updates the currently active number (either `firstNumber` or `secondNumber`)
 * based on the provided callback function and updates the displayed result.
 *
 * @param {function(number): number} callback - A function that takes the current
 * number as input, performs some operation, and returns the updated number.
 */
function updateActiveNumber(callback) {
  if (operator === '') {
    firstNumber = callback(firstNumber);
    RESULT.textContent = firstNumber;
  } else {
    secondNumber = callback(secondNumber);
    RESULT.textContent = secondNumber;
  }
}
