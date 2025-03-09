document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const elements = {
        inputs: {
            fromValue: document.getElementById('fromValue'),
            toValue: document.getElementById('toValue'),
            fromUnit: document.getElementById('fromUnit'),
            toUnit: document.getElementById('toUnit')
        },
        containers: {
            commonConversions: document.getElementById('commonConversions'),
            formula: document.getElementById('formula'),
            history: document.getElementById('history')
        },
        buttons: {
            categories: document.querySelectorAll('.category-btn'),
            swap: document.getElementById('swapBtn'),
            clearHistory: document.getElementById('clearHistoryBtn')
        }
    };

    // Unit Definitions
    const units = {
        length: {
            meter: { factor: 1, name: 'Meters (m)' },
            kilometer: { factor: 1000, name: 'Kilometers (km)' },
            centimeter: { factor: 0.01, name: 'Centimeters (cm)' },
            millimeter: { factor: 0.001, name: 'Millimeters (mm)' },
            mile: { factor: 1609.344, name: 'Miles (mi)' },
            yard: { factor: 0.9144, name: 'Yards (yd)' },
            foot: { factor: 0.3048, name: 'Feet (ft)' },
            inch: { factor: 0.0254, name: 'Inches (in)' }
        },
        area: {
            squareMeter: { factor: 1, name: 'Square Meters (m²)' },
            squareKilometer: { factor: 1000000, name: 'Square Kilometers (km²)' },
            hectare: { factor: 10000, name: 'Hectares (ha)' },
            acre: { factor: 4046.856, name: 'Acres' },
            squareFoot: { factor: 0.092903, name: 'Square Feet (ft²)' }
        },
        volume: {
            cubicMeter: { factor: 1000, name: 'Cubic Meters (m³)' },
            liter: { factor: 1, name: 'Liters (L)' },
            milliliter: { factor: 0.001, name: 'Milliliters (mL)' },
            gallon: { factor: 3.78541, name: 'Gallons (gal)' },
            quart: { factor: 0.946353, name: 'Quarts (qt)' },
            pint: { factor: 0.473176, name: 'Pints (pt)' },
            cup: { factor: 0.236588, name: 'Cups' }
        },
        mass: {
            kilogram: { factor: 1, name: 'Kilograms (kg)' },
            gram: { factor: 0.001, name: 'Grams (g)' },
            milligram: { factor: 0.000001, name: 'Milligrams (mg)' },
            pound: { factor: 0.453592, name: 'Pounds (lb)' },
            ounce: { factor: 0.0283495, name: 'Ounces (oz)' }
        },
        temperature: {
            celsius: {
                name: 'Celsius (°C)',
                toBase: (value) => value,
                fromBase: (value) => value
            },
            fahrenheit: {
                name: 'Fahrenheit (°F)',
                toBase: (value) => (value - 32) * 5/9,
                fromBase: (value) => value * 9/5 + 32
            },
            kelvin: {
                name: 'Kelvin (K)',
                toBase: (value) => value - 273.15,
                fromBase: (value) => value + 273.15
            }
        },
        speed: {
            meterPerSecond: { factor: 1, name: 'Meters per Second (m/s)' },
            kilometerPerHour: { factor: 0.277778, name: 'Kilometers per Hour (km/h)' },
            milePerHour: { factor: 0.44704, name: 'Miles per Hour (mph)' },
            knot: { factor: 0.514444, name: 'Knots (kn)' }
        },
        time: {
            second: { factor: 1, name: 'Seconds (s)' },
            minute: { factor: 60, name: 'Minutes (min)' },
            hour: { factor: 3600, name: 'Hours (h)' },
            day: { factor: 86400, name: 'Days' },
            week: { factor: 604800, name: 'Weeks' },
            month: { factor: 2592000, name: 'Months' },
            year: { factor: 31536000, name: 'Years' }
        },
        digital: {
            byte: { factor: 1, name: 'Bytes (B)' },
            kilobyte: { factor: 1024, name: 'Kilobytes (KB)' },
            megabyte: { factor: 1048576, name: 'Megabytes (MB)' },
            gigabyte: { factor: 1073741824, name: 'Gigabytes (GB)' },
            terabyte: { factor: 1099511627776, name: 'Terabytes (TB)' }
        }
    };

    // Common Conversions
    const commonConversions = {
        length: [
            { from: 'meter', to: 'foot', value: 1 },
            { from: 'kilometer', to: 'mile', value: 1 },
            { from: 'centimeter', to: 'inch', value: 1 }
        ],
        area: [
            { from: 'squareMeter', to: 'squareFoot', value: 1 },
            { from: 'hectare', to: 'acre', value: 1 }
        ],
        volume: [
            { from: 'liter', to: 'gallon', value: 1 },
            { from: 'milliliter', to: 'cup', value: 250 }
        ],
        mass: [
            { from: 'kilogram', to: 'pound', value: 1 },
            { from: 'gram', to: 'ounce', value: 100 }
        ],
        temperature: [
            { from: 'celsius', to: 'fahrenheit', value: 0 },
            { from: 'celsius', to: 'kelvin', value: 20 }
        ],
        speed: [
            { from: 'kilometerPerHour', to: 'milePerHour', value: 100 },
            { from: 'meterPerSecond', to: 'kilometerPerHour', value: 1 }
        ],
        time: [
            { from: 'hour', to: 'minute', value: 1 },
            { from: 'day', to: 'hour', value: 1 }
        ],
        digital: [
            { from: 'megabyte', to: 'gigabyte', value: 1024 },
            { from: 'gigabyte', to: 'terabyte', value: 1024 }
        ]
    };

    // State
    let currentCategory = 'length';
    let conversionHistory = loadHistory();

    // Initialize
    initializeConverter();

    function initializeConverter() {
        // Add event listeners
        elements.inputs.fromValue.addEventListener('input', convert);
        elements.inputs.fromUnit.addEventListener('change', convert);
        elements.inputs.toUnit.addEventListener('change', convert);
        elements.buttons.swap.addEventListener('click', swapUnits);
        elements.buttons.clearHistory.addEventListener('click', clearHistory);

        // Initialize category buttons
        elements.buttons.categories.forEach(button => {
            button.addEventListener('click', () => {
                setCategory(button.dataset.category);
            });
        });

        // Set initial category
        setCategory('length');
    }

    function setCategory(category) {
        currentCategory = category;

        // Update active button
        elements.buttons.categories.forEach(button => {
            button.classList.toggle('active', button.dataset.category === category);
        });

        // Update unit selects
        populateUnitSelects();

        // Update common conversions
        updateCommonConversions();

        // Perform conversion
        convert();
    }

    function populateUnitSelects() {
        const categoryUnits = units[currentCategory];
        
        elements.inputs.fromUnit.innerHTML = '';
        elements.inputs.toUnit.innerHTML = '';

        Object.entries(categoryUnits).forEach(([key, unit]) => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = unit.name;
            elements.inputs.fromUnit.appendChild(option.cloneNode(true));
            elements.inputs.toUnit.appendChild(option);
        });

        // Set default selections
        elements.inputs.toUnit.selectedIndex = 1;
    }

    function convert() {
        const fromValue = parseFloat(elements.inputs.fromValue.value);
        const fromUnit = elements.inputs.fromUnit.value;
        const toUnit = elements.inputs.toUnit.value;

        if (isNaN(fromValue)) {
            elements.inputs.toValue.value = '';
            return;
        }

        const result = performConversion(fromValue, fromUnit, toUnit);
        elements.inputs.toValue.value = formatResult(result);

        // Update formula display
        updateFormula(fromValue, fromUnit, toUnit, result);

        // Add to history
        addToHistory(fromValue, fromUnit, toUnit, result);
    }

    function performConversion(value, fromUnit, toUnit) {
        const categoryUnits = units[currentCategory];

        if (currentCategory === 'temperature') {
            // Special handling for temperature
            const celsius = categoryUnits[fromUnit].toBase(value);
            return categoryUnits[toUnit].fromBase(celsius);
        } else {
            // Standard conversion using factors
            const baseValue = value * categoryUnits[fromUnit].factor;
            return baseValue / categoryUnits[toUnit].factor;
        }
    }

    function formatResult(value) {
        // Handle special cases and precision
        if (Math.abs(value) < 0.000001 && value !== 0) {
            return value.toExponential(6);
        }
        return Number(value.toFixed(6)).toString();
    }

    function updateFormula(fromValue, fromUnit, toUnit, result) {
        const categoryUnits = units[currentCategory];
        let formula;

        if (currentCategory === 'temperature') {
            // Special formulas for temperature
            if (fromUnit === 'celsius' && toUnit === 'fahrenheit') {
                formula = `${fromValue}°C × (9/5) + 32 = ${result}°F`;
            } else if (fromUnit === 'fahrenheit' && toUnit === 'celsius') {
                formula = `(${fromValue}°F - 32) × (5/9) = ${result}°C`;
            } else if (fromUnit === 'celsius' && toUnit === 'kelvin') {
                formula = `${fromValue}°C + 273.15 = ${result}K`;
            } else if (fromUnit === 'kelvin' && toUnit === 'celsius') {
                formula = `${fromValue}K - 273.15 = ${result}°C`;
            }
        } else {
            // Standard formula using factors
            const fromFactor = categoryUnits[fromUnit].factor;
            const toFactor = categoryUnits[toUnit].factor;
            formula = `${fromValue} × (${fromFactor}/${toFactor}) = ${result}`;
        }

        elements.containers.formula.textContent = formula;
    }

    function updateCommonConversions() {
        const conversions = commonConversions[currentCategory];
        
        elements.containers.commonConversions.innerHTML = conversions.map(conv => `
            <div class="col-md-6">
                <div class="common-conversion" data-from="${conv.from}" data-to="${conv.to}" 
                     data-value="${conv.value}">
                    <div class="common-value">${conv.value}</div>
                    <div class="common-units">
                        ${units[currentCategory][conv.from].name} to 
                        ${units[currentCategory][conv.to].name}
                    </div>
                </div>
            </div>
        `).join('');

        // Add click handlers
        document.querySelectorAll('.common-conversion').forEach(elem => {
            elem.addEventListener('click', () => {
                elements.inputs.fromValue.value = elem.dataset.value;
                elements.inputs.fromUnit.value = elem.dataset.from;
                elements.inputs.toUnit.value = elem.dataset.to;
                convert();
            });
        });
    }

    function swapUnits() {
        const tempValue = elements.inputs.fromUnit.value;
        elements.inputs.fromUnit.value = elements.inputs.toUnit.value;
        elements.inputs.toUnit.value = tempValue;
        convert();
    }

    function addToHistory(fromValue, fromUnit, toUnit, result) {
        const entry = {
            timestamp: new Date().toISOString(),
            category: currentCategory,
            fromValue,
            fromUnit,
            toUnit,
            result
        };

        conversionHistory.unshift(entry);
        if (conversionHistory.length > 10) {
            conversionHistory.pop();
        }

        updateHistoryDisplay();
        saveHistory();
    }

    function updateHistoryDisplay() {
        elements.containers.history.innerHTML = conversionHistory.map(entry => `
            <div class="history-item">
                <div class="history-text">
                    ${entry.fromValue} ${units[entry.category][entry.fromUnit].name} = 
                    ${formatResult(entry.result)} ${units[entry.category][entry.toUnit].name}
                </div>
                <div class="history-actions">
                    <button class="btn btn-sm btn-outline-primary" 
                            onclick="reloadConversion('${entry.category}', ${entry.fromValue}, 
                                     '${entry.fromUnit}', '${entry.toUnit}')">
                        <i class="fas fa-redo"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    function clearHistory() {
        conversionHistory = [];
        updateHistoryDisplay();
        saveHistory();
    }

    function loadHistory() {
        const saved = localStorage.getItem('conversionHistory');
        return saved ? JSON.parse(saved) : [];
    }

    function saveHistory() {
        localStorage.setItem('conversionHistory', JSON.stringify(conversionHistory));
    }

    // Make reloadConversion available globally
    window.reloadConversion = function(category, value, fromUnit, toUnit) {
        setCategory(category);
        elements.inputs.fromValue.value = value;
        elements.inputs.fromUnit.value = fromUnit;
        elements.inputs.toUnit.value = toUnit;
        convert();
    };
}); 