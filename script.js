////////
// INITIAL STATE
let firstNumber = '';
let operator = '';
let secondNumber = '';
let memoryValue = 0;
let memoryIsActive = false;
let shouldResetDisplay = false;

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
const SQUARE_ROOT = document.querySelector('[data-function="sqr"]');
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
MEMORY_CLEAR.addEventListener('click', () => handleMemory('clear'));
MEMORY_RECALL.addEventListener('click', () => handleMemory('recall'));
MEMORY_ADD.addEventListener('click', () => handleMemory('add'));
MEMORY_SUBTRACT.addEventListener('click', () => handleMemory('subtract'));
INVERT.addEventListener('click', () => handleInvert());

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
        resetCalculator();
        RESULT.classList.add('error');
        RESULT.textContent = 'Cannot divide by zero';
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
  firstNumber = formatIfFloat(result);
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
 * Handles memory operations for a calculator, including adding to memory,
 * subtracting from memory, recalling memory, and clearing memory.
 *
 * @param {string} action - The memory action to perform.
 *                          Valid values are 'add', 'subtract', 'recall', and 'clear'.
 *
 * - 'add': Adds the current result to the memory value.
 * - 'subtract': Subtracts the current result from the memory value.
 * - 'recall': Recalls the memory value and updates the display.
 * - 'clear': Clears the memory value and resets the display.
 *
 * Preconditions:
 * - `RESULT.textContent` should contain a valid number for 'add' and 'subtract' actions.
 * - The `operator` variable determines whether the memory value is assigned to `firstNumber` or `secondNumber` during recall.
 *
 * Side Effects:
 * - Updates the `memoryValue`, `CURRENT_MEMORY.textContent`, and `RESULT.textContent`.
 * - Modifies the `memoryIsActive` and `shouldResetDisplay` flags.
 * - Resets the display when the 'clear' action is performed.
 */
function handleMemory(action) {
  if (RESULT.textContent === '') return;

  if (action === 'add') {
    memoryValue += Number(RESULT.textContent);
    CURRENT_MEMORY.textContent = `M${memoryValue}`;
    memoryIsActive = true;
    shouldResetDisplay = true;
  }
  if (action === 'subtract') {
    memoryValue -= Number(RESULT.textContent);
    CURRENT_MEMORY.textContent = `M${memoryValue}`;
    memoryIsActive = true;
    shouldResetDisplay = true;
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
 * Toggles the sign of the current number being input (either `firstNumber` or `secondNumber`).
 * If no operator is selected, it inverts the `firstNumber`.
 * Otherwise, it inverts the `secondNumber`.
 * Updates the displayed result accordingly.
 */
function handleInvert() {
  if (operator === '') {
    firstNumber = -1 * firstNumber;
    RESULT.textContent = firstNumber;
  } else {
    secondNumber = -1 * secondNumber;
    RESULT.textContent = secondNumber;
  }
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
 * Resets the display and memory values based on the current state.
 *
 * This function handles three scenarios:
 * 1. If `memoryIsActive` is true, it clears the `firstNumber` and the result display.
 * 2. If `memoryIsActive` is false, it clears the memory value and the memory display.
 * 3. If neither condition is met, it clears all relevant variables and display elements.
 *
 * In all cases, it resets the `shouldResetDisplay` flag to false.
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
  if (operator === '') {
    firstNumber = firstNumber.slice(0, -1);
    RESULT.textContent = firstNumber;
  } else {
    secondNumber = secondNumber.slice(0, -1);
    RESULT.textContent = secondNumber;
  }
}

/**
 * Resets the last number entry based on operator state
 * If no operator is present, resets firstNumber
 * If operator exists, resets secondNumber
 *
 * Clears the calculator display in both cases
 */
function resetLastEntry() {
  if (operator === '') {
    firstNumber = '';
    RESULT.textContent = '';
  } else {
    secondNumber = '';
    RESULT.textContent = '';
  }
}

/**
 * Resets the calculator to its initial state by clearing the display,
 * resetting the stored numbers and operator, and disabling the display reset flag.
 */
function resetCalculator() {
  CURRENT_MEMORY.textContent = '';
  CURRENT_OPERATION.textContent = '';
  RESULT.textContent = '';
  memoryValue = 0;
  firstNumber = '';
  operator = '';
  secondNumber = '';
  shouldResetDisplay = false;
}
