document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const elements = {
        display: {
            expression: document.getElementById('expression'),
            result: document.getElementById('result'),
            memory: document.getElementById('memoryDisplay'),
            history: document.getElementById('history')
        }
    };

    // Calculator State
    const state = {
        currentExpression: '',
        currentResult: '0',
        memory: 0,
        isNewCalculation: true,
        angleMode: 'deg', // 'deg' or 'rad'
        secondFunction: false,
        history: []
    };

    // Initialize
    initializeCalculator();

    function initializeCalculator() {
        // Add event listeners for all buttons
        document.querySelectorAll('.calculator-buttons button').forEach(button => {
            button.addEventListener('click', () => handleButtonClick(button));
        });

        // Add keyboard support
        document.addEventListener('keydown', handleKeyPress);
    }

    function handleButtonClick(button) {
        const digit = button.dataset.digit;
        const operator = button.dataset.operator;
        const action = button.dataset.action;

        if (digit) handleDigit(digit);
        if (operator) handleOperator(operator);
        if (action) handleAction(action);

        updateDisplay();
    }

    function handleKeyPress(event) {
        const key = event.key;
        
        // Prevent default actions for calculator keys
        if (/[\d\+\-\*\/\.\=\Enter\Backspace\Escape]/.test(key)) {
            event.preventDefault();
        }

        // Map keyboard keys to calculator functions
        switch (key) {
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
            case '.':
                handleDigit(key);
                break;
            case '+':
            case '-':
            case '*':
            case '/':
                handleOperator(key);
                break;
            case '=':
            case 'Enter':
                handleAction('equals');
                break;
            case 'Backspace':
                handleAction('backspace');
                break;
            case 'Escape':
                handleAction('clear');
                break;
        }

        updateDisplay();
    }

    function handleDigit(digit) {
        if (state.isNewCalculation) {
            state.currentExpression = '';
            state.isNewCalculation = false;
        }

        // Handle decimal point
        if (digit === '.') {
            const lastNumber = getLastNumber(state.currentExpression);
            if (lastNumber.includes('.')) return;
        }

        state.currentExpression += digit;
        calculateResult();
    }

    function handleOperator(operator) {
        if (state.currentExpression === '' && operator !== '-') {
            return;
        }

        // Handle consecutive operators
        if (isOperator(state.currentExpression.slice(-1))) {
            state.currentExpression = state.currentExpression.slice(0, -1);
        }

        state.currentExpression += operator;
        state.isNewCalculation = false;
    }

    function handleAction(action) {
        switch (action) {
            case 'clear':
                clearCalculator();
                break;
            case 'backspace':
                handleBackspace();
                break;
            case 'equals':
                calculateResult(true);
                break;
            case 'memory-clear':
                clearMemory();
                break;
            case 'memory-recall':
                recallMemory();
                break;
            case 'memory-add':
                addToMemory();
                break;
            case 'memory-subtract':
                subtractFromMemory();
                break;
            case 'memory-store':
                storeInMemory();
                break;
            case 'function':
                toggleSecondFunction();
                break;
            case 'rad':
            case 'deg':
                setAngleMode(action);
                break;
            default:
                handleMathFunction(action);
                break;
        }
    }

    function handleMathFunction(func) {
        let result;
        const currentValue = parseFloat(state.currentResult);

        switch (func) {
            case 'square':
                result = Math.pow(currentValue, 2);
                break;
            case 'cube':
                result = Math.pow(currentValue, 3);
                break;
            case 'sqrt':
                result = Math.sqrt(currentValue);
                break;
            case 'cbrt':
                result = Math.cbrt(currentValue);
                break;
            case 'log':
                result = Math.log10(currentValue);
                break;
            case 'ln':
                result = Math.log(currentValue);
                break;
            case 'sin':
                result = state.angleMode === 'deg' ? 
                    Math.sin(currentValue * Math.PI / 180) : 
                    Math.sin(currentValue);
                break;
            case 'cos':
                result = state.angleMode === 'deg' ? 
                    Math.cos(currentValue * Math.PI / 180) : 
                    Math.cos(currentValue);
                break;
            case 'tan':
                result = state.angleMode === 'deg' ? 
                    Math.tan(currentValue * Math.PI / 180) : 
                    Math.tan(currentValue);
                break;
            case 'asin':
                result = state.angleMode === 'deg' ? 
                    Math.asin(currentValue) * 180 / Math.PI : 
                    Math.asin(currentValue);
                break;
            case 'acos':
                result = state.angleMode === 'deg' ? 
                    Math.acos(currentValue) * 180 / Math.PI : 
                    Math.acos(currentValue);
                break;
            case 'atan':
                result = state.angleMode === 'deg' ? 
                    Math.atan(currentValue) * 180 / Math.PI : 
                    Math.atan(currentValue);
                break;
            case 'factorial':
                result = factorial(currentValue);
                break;
            case 'inverse':
                result = 1 / currentValue;
                break;
            case 'pi':
                result = Math.PI;
                break;
            case 'e':
                result = Math.E;
                break;
        }

        if (typeof result === 'number' && !isNaN(result)) {
            state.currentExpression = result.toString();
            state.currentResult = result.toString();
            state.isNewCalculation = true;
        }
    }

    function calculateResult(addToHistory = false) {
        try {
            // Replace mathematical constants
            let expression = state.currentExpression
                .replace(/π/g, Math.PI.toString())
                .replace(/e/g, Math.E.toString());

            // Evaluate the expression
            const result = Function('"use strict";return (' + expression + ')')();
            
            state.currentResult = formatResult(result);

            if (addToHistory) {
                addCalculationToHistory(state.currentExpression, state.currentResult);
                state.isNewCalculation = true;
            }
        } catch (error) {
            state.currentResult = 'Error';
        }
    }

    function formatResult(number) {
        if (typeof number !== 'number') return 'Error';
        if (!isFinite(number)) return 'Error';

        const precision = 10;
        const result = parseFloat(number.toPrecision(precision));
        
        return result.toString();
    }

    function addCalculationToHistory(expression, result) {
        state.history.unshift({ expression, result });
        if (state.history.length > 10) state.history.pop();
        updateHistoryDisplay();
    }

    function updateHistoryDisplay() {
        elements.display.history.innerHTML = state.history.map(item => `
            <div class="history-item">
                <div class="history-expression">${item.expression}</div>
                <div class="history-result">${item.result}</div>
            </div>
        `).join('');
    }

    function clearCalculator() {
        state.currentExpression = '';
        state.currentResult = '0';
        state.isNewCalculation = true;
        updateDisplay();
    }

    function handleBackspace() {
        if (state.isNewCalculation) return;
        state.currentExpression = state.currentExpression.slice(0, -1);
        if (state.currentExpression === '') {
            state.currentResult = '0';
        } else {
            calculateResult();
        }
    }

    function updateDisplay() {
        elements.display.expression.textContent = state.currentExpression;
        elements.display.result.textContent = state.currentResult;
        elements.display.memory.textContent = state.memory ? 'M' : '';
    }

    // Memory Functions
    function clearMemory() {
        state.memory = 0;
        updateDisplay();
    }

    function recallMemory() {
        state.currentExpression = state.memory.toString();
        state.currentResult = state.memory.toString();
        state.isNewCalculation = true;
        updateDisplay();
    }

    function addToMemory() {
        state.memory += parseFloat(state.currentResult);
        updateDisplay();
    }

    function subtractFromMemory() {
        state.memory -= parseFloat(state.currentResult);
        updateDisplay();
    }

    function storeInMemory() {
        state.memory = parseFloat(state.currentResult);
        updateDisplay();
    }

    // Helper Functions
    function isOperator(char) {
        return /[\+\-\*\/]/.test(char);
    }

    function getLastNumber(expression) {
        const match = expression.match(/[\d.]+$/);
        return match ? match[0] : '';
    }

    function factorial(n) {
        if (n < 0) return NaN;
        if (n === 0) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) result *= i;
        return result;
    }

    function setAngleMode(mode) {
        state.angleMode = mode;
        document.querySelectorAll('[data-action="rad"], [data-action="deg"]')
            .forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-action="${mode}"]`).classList.add('active');
    }

    function toggleSecondFunction() {
        state.secondFunction = !state.secondFunction;
        const btn = document.querySelector('[data-action="function"]');
        btn.classList.toggle('active', state.secondFunction);
        updateSecondFunctions();
    }

    function updateSecondFunctions() {
        // Implementation for toggling between normal and inverse trig functions
        const trigFunctions = {
            sin: 'asin',
            cos: 'acos',
            tan: 'atan'
        };

        for (const [normal, inverse] of Object.entries(trigFunctions)) {
            const btn = document.querySelector(`[data-action="${state.secondFunction ? inverse : normal}"]`);
            if (btn) {
                btn.textContent = state.secondFunction ? 
                    `${normal}⁻¹` : 
                    normal;
            }
        }
    }
}); 