document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const elements = {
        inputs: {
            operationType: document.getElementById('operationType'),
            scalarValue: document.getElementById('scalarValue'),
            rowsA: document.getElementById('rowsA'),
            colsA: document.getElementById('colsA'),
            rowsB: document.getElementById('rowsB'),
            colsB: document.getElementById('colsB')
        },
        containers: {
            matrixA: document.getElementById('matrixA'),
            matrixB: document.getElementById('matrixB'),
            result: document.getElementById('resultContainer'),
            steps: document.getElementById('stepsContainer'),
            scalar: document.getElementById('scalarValueContainer'),
            matrixBCard: document.getElementById('matrixBCard'),
            resultCard: document.getElementById('resultCard')
        },
        buttons: {
            calculate: document.getElementById('calculateBtn'),
            randomizeA: document.getElementById('randomizeA'),
            randomizeB: document.getElementById('randomizeB'),
            clearA: document.getElementById('clearA'),
            clearB: document.getElementById('clearB'),
            copyResult: document.getElementById('copyResult'),
            downloadResult: document.getElementById('downloadResult')
        }
    };

    // Initialize
    initializeCalculator();

    function initializeCalculator() {
        // Create initial matrices
        createMatrix('A');
        createMatrix('B');

        // Add event listeners
        addEventListeners();

        // Initial operation type check
        checkOperationType();
    }

    function addEventListeners() {
        // Matrix dimension changes
        elements.inputs.rowsA.addEventListener('change', () => updateMatrix('A'));
        elements.inputs.colsA.addEventListener('change', () => updateMatrix('A'));
        elements.inputs.rowsB.addEventListener('change', () => updateMatrix('B'));
        elements.inputs.colsB.addEventListener('change', () => updateMatrix('B'));

        // Operation type changes
        elements.inputs.operationType.addEventListener('change', checkOperationType);

        // Button clicks
        elements.buttons.calculate.addEventListener('click', calculate);
        elements.buttons.randomizeA.addEventListener('click', () => randomizeMatrix('A'));
        elements.buttons.randomizeB.addEventListener('click', () => randomizeMatrix('B'));
        elements.buttons.clearA.addEventListener('click', () => clearMatrix('A'));
        elements.buttons.clearB.addEventListener('click', () => clearMatrix('B'));
        elements.buttons.copyResult.addEventListener('click', copyResult);
        elements.buttons.downloadResult.addEventListener('click', downloadResult);
    }

    function createMatrix(id) {
        const container = elements.containers[`matrix${id}`];
        const rows = parseInt(elements.inputs[`rows${id}`].value);
        const cols = parseInt(elements.inputs[`cols${id}`].value);

        const table = document.createElement('table');
        table.className = 'matrix-table';
        
        for (let i = 0; i < rows; i++) {
            const row = document.createElement('tr');
            for (let j = 0; j < cols; j++) {
                const cell = document.createElement('td');
                const input = document.createElement('input');
                input.type = 'number';
                input.step = 'any';
                input.value = '0';
                input.dataset.row = i;
                input.dataset.col = j;
                cell.appendChild(input);
                row.appendChild(cell);
            }
            table.appendChild(row);
        }

        const wrapper = document.createElement('div');
        wrapper.className = 'matrix-bracket';
        wrapper.appendChild(table);

        container.innerHTML = '';
        container.appendChild(wrapper);
    }

    function updateMatrix(id) {
        createMatrix(id);
        checkOperationType();
    }

    function checkOperationType() {
        const operation = elements.inputs.operationType.value;
        const matrixBRequired = ['add', 'subtract', 'multiply'].includes(operation);
        const isSquareRequired = ['determinant', 'inverse'].includes(operation);
        const isScalarRequired = operation === 'scalar';

        // Show/hide Matrix B
        elements.containers.matrixBCard.style.display = matrixBRequired ? 'block' : 'none';
        elements.containers.scalar.style.display = isScalarRequired ? 'block' : 'none';

        // Enforce square matrix for determinant and inverse
        if (isSquareRequired) {
            const size = parseInt(elements.inputs.rowsA.value);
            elements.inputs.colsA.value = size;
            updateMatrix('A');
        }

        // Enforce matrix dimensions for multiplication
        if (operation === 'multiply') {
            elements.inputs.rowsB.value = elements.inputs.colsA.value;
            updateMatrix('B');
        }
    }

    function getMatrixValues(id) {
        const container = elements.containers[`matrix${id}`];
        const matrix = [];
        const inputs = container.querySelectorAll('input');
        const rows = parseInt(elements.inputs[`rows${id}`].value);
        const cols = parseInt(elements.inputs[`cols${id}`].value);

        for (let i = 0; i < rows; i++) {
            matrix[i] = [];
            for (let j = 0; j < cols; j++) {
                const input = container.querySelector(`input[data-row="${i}"][data-col="${j}"]`);
                matrix[i][j] = parseFloat(input.value) || 0;
            }
        }

        return matrix;
    }

    function calculate() {
        const operation = elements.inputs.operationType.value;
        const matrixA = getMatrixValues('A');
        let result;
        let steps = [];

        try {
            switch (operation) {
                case 'add':
                    const matrixB_add = getMatrixValues('B');
                    result = addMatrices(matrixA, matrixB_add, steps);
                    break;
                case 'subtract':
                    const matrixB_sub = getMatrixValues('B');
                    result = subtractMatrices(matrixA, matrixB_sub, steps);
                    break;
                case 'multiply':
                    const matrixB_mul = getMatrixValues('B');
                    result = multiplyMatrices(matrixA, matrixB_mul, steps);
                    break;
                case 'determinant':
                    result = calculateDeterminant(matrixA, steps);
                    break;
                case 'inverse':
                    result = calculateInverse(matrixA, steps);
                    break;
                case 'transpose':
                    result = calculateTranspose(matrixA, steps);
                    break;
                case 'power':
                    const power = parseInt(elements.inputs.scalarValue.value) || 2;
                    result = calculatePower(matrixA, power, steps);
                    break;
                case 'scalar':
                    const scalar = parseFloat(elements.inputs.scalarValue.value) || 1;
                    result = scalarMultiply(matrixA, scalar, steps);
                    break;
            }

            displayResult(result, steps);
        } catch (error) {
            showError(error.message);
        }
    }

    function addMatrices(A, B, steps) {
        if (A.length !== B.length || A[0].length !== B[0].length) {
            throw new Error('Matrices must have the same dimensions for addition');
        }

        steps.push({
            description: 'Adding corresponding elements of matrices A and B',
            matrix: null
        });

        const result = A.map((row, i) =>
            row.map((val, j) => val + B[i][j])
        );

        steps.push({
            description: 'Final result',
            matrix: result
        });

        return result;
    }

    function subtractMatrices(A, B, steps) {
        if (A.length !== B.length || A[0].length !== B[0].length) {
            throw new Error('Matrices must have the same dimensions for subtraction');
        }

        steps.push({
            description: 'Subtracting corresponding elements of matrix B from matrix A',
            matrix: null
        });

        const result = A.map((row, i) =>
            row.map((val, j) => val - B[i][j])
        );

        steps.push({
            description: 'Final result',
            matrix: result
        });

        return result;
    }

    function multiplyMatrices(A, B, steps) {
        if (A[0].length !== B.length) {
            throw new Error('Number of columns in first matrix must equal number of rows in second matrix');
        }

        const result = Array(A.length).fill().map(() => Array(B[0].length).fill(0));

        steps.push({
            description: 'Multiplying matrices using dot product of rows and columns',
            matrix: null
        });

        for (let i = 0; i < A.length; i++) {
            for (let j = 0; j < B[0].length; j++) {
                for (let k = 0; k < B.length; k++) {
                    result[i][j] += A[i][k] * B[k][j];
                }
            }
        }

        steps.push({
            description: 'Final result',
            matrix: result
        });

        return result;
    }

    function calculateDeterminant(matrix, steps) {
        if (matrix.length !== matrix[0].length) {
            throw new Error('Matrix must be square to calculate determinant');
        }

        steps.push({
            description: 'Calculating determinant using cofactor expansion',
            matrix: null
        });

        const det = determinant(matrix);

        steps.push({
            description: 'Final determinant value',
            value: det
        });

        return det;
    }

    function determinant(matrix) {
        if (matrix.length === 1) return matrix[0][0];
        if (matrix.length === 2) {
            return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
        }

        let det = 0;
        for (let i = 0; i < matrix.length; i++) {
            det += Math.pow(-1, i) * matrix[0][i] * determinant(getMinor(matrix, 0, i));
        }
        return det;
    }

    function getMinor(matrix, row, col) {
        return matrix
            .filter((_, index) => index !== row)
            .map(row => row.filter((_, index) => index !== col));
    }

    function calculateInverse(matrix, steps) {
        const det = determinant(matrix);
        if (det === 0) {
            throw new Error('Matrix is not invertible (determinant is 0)');
        }

        steps.push({
            description: 'Calculating adjugate matrix',
            matrix: null
        });

        const adj = adjugate(matrix);

        steps.push({
            description: 'Dividing adjugate matrix by determinant',
            value: `Determinant: ${det}`
        });

        const result = adj.map(row => row.map(val => val / det));

        steps.push({
            description: 'Final result',
            matrix: result
        });

        return result;
    }

    function adjugate(matrix) {
        const cofactors = matrix.map((row, i) =>
            row.map((_, j) => {
                const minor = getMinor(matrix, i, j);
                return Math.pow(-1, i + j) * determinant(minor);
            })
        );
        return calculateTranspose(cofactors);
    }

    function calculateTranspose(matrix, steps) {
        steps.push({
            description: 'Transposing matrix (swapping rows and columns)',
            matrix: null
        });

        const result = matrix[0].map((_, i) =>
            matrix.map(row => row[i])
        );

        steps.push({
            description: 'Final result',
            matrix: result
        });

        return result;
    }

    function calculatePower(matrix, power, steps) {
        if (matrix.length !== matrix[0].length) {
            throw new Error('Matrix must be square to calculate power');
        }

        steps.push({
            description: `Calculating matrix to the power of ${power}`,
            matrix: null
        });

        let result = matrix;
        for (let i = 1; i < power; i++) {
            result = multiplyMatrices(result, matrix, []);
        }

        steps.push({
            description: 'Final result',
            matrix: result
        });

        return result;
    }

    function scalarMultiply(matrix, scalar, steps) {
        steps.push({
            description: `Multiplying matrix by scalar value: ${scalar}`,
            matrix: null
        });

        const result = matrix.map(row =>
            row.map(val => val * scalar)
        );

        steps.push({
            description: 'Final result',
            matrix: result
        });

        return result;
    }

    function displayResult(result, steps) {
        // Display steps
        elements.containers.steps.innerHTML = steps.map((step, index) => `
            <div class="step-item">
                <div class="step-number">Step ${index + 1}</div>
                <div class="step-description">${step.description}</div>
                ${step.matrix ? formatMatrix(step.matrix) : ''}
                ${step.value ? `<div class="step-value">${step.value}</div>` : ''}
            </div>
        `).join('');

        // Display final result
        elements.containers.result.innerHTML = Array.isArray(result) ? 
            formatMatrix(result) : 
            `<div class="result-value">${result}</div>`;

        elements.containers.resultCard.style.display = 'block';
    }

    function formatMatrix(matrix) {
        if (!Array.isArray(matrix)) return '';

        return `
            <div class="matrix-bracket">
                <table class="matrix-table">
                    ${matrix.map(row => `
                        <tr>
                            ${row.map(val => `
                                <td>${typeof val === 'number' ? val.toFixed(4) : val}</td>
                            `).join('')}
                        </tr>
                    `).join('')}
                </table>
            </div>
        `;
    }

    function randomizeMatrix(id) {
        const container = elements.containers[`matrix${id}`];
        container.querySelectorAll('input').forEach(input => {
            input.value = (Math.random() * 10 - 5).toFixed(2);
        });
    }

    function clearMatrix(id) {
        const container = elements.containers[`matrix${id}`];
        container.querySelectorAll('input').forEach(input => {
            input.value = '0';
        });
    }

    function copyResult() {
        const result = elements.containers.result.textContent;
        navigator.clipboard.writeText(result).then(() => {
            showCopyFeedback(elements.buttons.copyResult);
        });
    }

    function downloadResult() {
        const content = elements.containers.result.textContent;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'matrix-result.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function showCopyFeedback(button) {
        const originalHTML = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Copied!';
        button.disabled = true;
        
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.disabled = false;
        }, 1500);
    }

    function showError(message) {
        elements.containers.result.innerHTML = `
            <div class="alert alert-danger mb-0">
                <i class="fas fa-exclamation-circle"></i> ${message}
            </div>
        `;
        elements.containers.resultCard.style.display = 'block';
        elements.containers.steps.innerHTML = '';
    }
}); 