// Скрипт для расчёта энтропии входной строки
const input = 'abrakadabra';
// Объект для хранения частот символов
const symbolFrequencies = {};
const inputLength = input.length;

// Подсчёт частот каждого символа
for (let i = 0; i < inputLength; i++) {
    let char = input.charAt(i);
    if (symbolFrequencies[char]) {
        symbolFrequencies[char]++;
    } else {
        symbolFrequencies[char] = 1;
    }
}
// Вычисление энтропии
let entropy = 0;
const alphabetLength = Object.keys(symbolFrequencies).length;

for (const char in symbolFrequencies) {
    const probability = symbolFrequencies[char] / inputLength;
    entropy -= probability * Math.log2(probability);
}

// Нормализация энтропии
if (alphabetLength > 1) {
    entropy = entropy / Math.log2(alphabetLength);
}

// Вывод результатов
console.log('Частоты символов:', symbolFrequencies);
console.log('Энтропия =', entropy.toFixed(4));