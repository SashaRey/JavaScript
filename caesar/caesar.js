// Пример канонических частот для английских букв
const canonicalFrequencies = [
    0.082, 0.015, 0.028, 0.043, 0.127, 0.022, 0.020, 0.060, 0.069, 0.002,
    0.008, 0.040, 0.024, 0.067, 0.075, 0.019, 0.001, 0.060, 0.063, 0.091,
    0.028, 0.020, 0.002, 0.002, 0.024, 0.002
];

// Функция для вычисления частот букв в зашифрованном тексте
function calculateFrequencies(text) {
    const frequencies = new Array(26).fill(0);
    const totalChars = text.replace(/[^a-zA-Z]/g, '').length;

    text.toLowerCase().split('').forEach(char => {
        if (/[a-z]/.test(char)) {
            const index = char.charCodeAt(0) - 'a'.charCodeAt(0);
            frequencies[index]++;
        }
    });

    return frequencies.map(count => count / totalChars);
}

// Функция для взлома шифра и одновременной дешифровки
function decryptCaesarCipher(text, canonicalFrequencies) {
    const factFrequencies = calculateFrequencies(text);
    const n = 26;
    let minDeviation = Infinity;
    let bestShift = 0;

    // Находим наилучший сдвиг
    for (let k = 0; k < n; k++) {
        let deviation = 0;
        for (let i = 0; i < n; i++) {
            const shiftedIndex = (i + k) % n;
            deviation += Math.pow(factFrequencies[i] - canonicalFrequencies[shiftedIndex], 2);
        }
        if (deviation < minDeviation) {
            minDeviation = deviation;
            bestShift = k;
        }
    }
    console.log("Вероятный сдвиг = ", bestShift);

    // Применяем найденный сдвиг для расшифровки
    return text.split('').map(char => {
        if (/[a-zA-Z]/.test(char)) {
            const charCode = char.charCodeAt(0);
            const base = charCode >= 'a'.charCodeAt(0) ? 'a'.charCodeAt(0) : 'A'.charCodeAt(0);
            const newCharCode = ((charCode - base - bestShift + 26) % 26) + base;
            return String.fromCharCode(newCharCode);
        }
        return char;
    }).join('');
}

// Пример использования
const encryptedText = "GUVF VF N GRFG ZRFFNTR";
const decryptedText = decryptCaesarCipher(encryptedText, canonicalFrequencies);

console.log(`Расшифрованное сообщение: ${decryptedText}`);
