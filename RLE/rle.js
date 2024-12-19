const fs = require('fs');

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
            while (count > 255) {
                code += `#\xFF#`;
                count -= 255;
            }
            code += `#${String.fromCharCode(count)}#`;
        } else if (count >= 4) {
            while (count > 255) {
                code += `#\xFF${currentSymbol}`;
                count -= 255;
            }
            code += `#${String.fromCharCode(count)}${currentSymbol}`;
        } else {
            code += s.slice(i, i + count);
        }

        i += count;
    }

    return code;
}

// Функция декодирования строки
function decodeString(s) {
    let decoded = '';
    let i = 0;

    while (i < s.length) {
        if (s[i] === '#' && i + 1 < s.length) {
            let count = s.charCodeAt(i + 1);
            let char = s[i + 2];

            if (char === '#') {
                decoded += '#'.repeat(count);
                i += 3;
            } else {
                decoded += char.repeat(count);
                i += 3;
            }
        } else {
            decoded += s[i];
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

if (mode === 'encode') {
    let inputString = fs.readFileSync(inputFile, 'utf8').trim();
    let encodedString = encodeString(inputString);
    fs.writeFileSync(outputFile, encodedString, 'utf8');

    let compressionRatio = inputString.length / encodedString.length;
    console.log(`Compression ratio: ${compressionRatio.toFixed(2)}`);
} else if (mode === 'decode') {
    let encodedString = fs.readFileSync(inputFile, 'utf8').trim();
    let decodedString = decodeString(encodedString);
    fs.writeFileSync(outputFile, decodedString, 'utf8');

    console.log("Decoded successfully.");
} else {
    console.log("Invalid mode. Use 'encode' or 'decode'.");
}
