const fs = require('fs');

// Карта для замены цифр на непечатные символы
const numberToInvisible = {
    '0': '\x01', '1': '\x02', '2': '\x03', '3': '\x04', '4': '\x05',
    '5': '\x06', '6': '\x07', '7': '\x08', '8': '\x09', '9': '\x0A'
};

// Обратная карта для восстановления цифр
const invisibleToNumber = Object.fromEntries(
    Object.entries(numberToInvisible).map(([key, value]) => [value, key])
);

// Функция замены цифр на непечатные символы
function replaceNumbers(input) {
    return input.replace(/[0-9]/g, match => numberToInvisible[match]);
}

// Функция восстановления цифр из непечатных символов
function restoreNumbers(input) {
    return input.replace(/[\x01-\x0A]/g, match => invisibleToNumber[match]);
}

// Функция кодирования строки

function encodeString(s) {
    let code = '';
    let i = 0;

    while (i < s.length) {
        let currentSymbol = s[i];
        let count = 1;

        while (currentSymbol === s[i + count]) {
            count++;
        }

        if (currentSymbol === '#') {
            code += '##';
            i++;
            continue;
        }

        if (count >= 4) {
            while (count > 255) {
                code += `#255${currentSymbol}`;
                count -= 255;
            }
            code += `#${replaceNumbers(count.toString())}${currentSymbol}`;
        } else {
            code += s.slice(i, i + count);
        }

        i += count;
    }

    return code;
}

// Функция декодирования строки
function decodeString(code) {
    let decoded = '';
    let i = 0;

    while (i < code.length) {
        if (code[i] === '#') {
            if (code[i + 1] === '#') {
                decoded += '#'; // Один '#' добавляется в результат
                i += 2; // Пропускаем оба '#'
                continue;
            }
            // Обработка RLE-кода
            let endOfNumberIndex = i + 1;
            while (/[\x01-\x0A]/.test(code[endOfNumberIndex])) {
                endOfNumberIndex++;
            }

            let count = restoreNumbers(code.slice(i + 1, endOfNumberIndex));
            let symbol = code[endOfNumberIndex];

            decoded += symbol.repeat(parseInt(count));
            i = endOfNumberIndex + 1;
            continue;
        } else {
            decoded += code[i];
            i++;
        }
    }

    return decoded;
}


// Логика программы
const mode = process.argv[2];
const inputFile = process.argv[3];
const outputFile = process.argv[4];

if (!mode || !inputFile || !outputFile) {
    console.log("Usage: node rle.js <mode> <inputFile> <outputFile>");
    process.exit(1);
}

if (mode === 'code') {
    let inputString = fs.readFileSync(inputFile, 'utf8').trim();
    let encodedString = encodeString(inputString);
    fs.writeFileSync(outputFile, encodedString, 'utf8');

    let compressionRatio = inputString.length / encodedString.length;
    console.log("Encoded:", encodedString);
    console.log(`Compression ratio: ${compressionRatio.toFixed(2)}`);
} else if (mode === 'decode') {
    let encodedString = fs.readFileSync(inputFile, 'utf8').trim();
    let decodedString = decodeString(encodedString);
    fs.writeFileSync(outputFile, decodedString, 'utf8');

    console.log("Decoded:", decodedString);
} else {
    console.log("Invalid mode. Use 'code' or 'decode'.");
}
