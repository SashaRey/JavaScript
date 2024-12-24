let fs = require('fs');                  // Подключение модуля fs для работы с файлами
let inText = fs.readFileSync('warandpeace.txt', 'utf8'); // Записываем текст файла в переменную inText


function bruteforceSearch(text, pattern) {
    const indices = [];
    const start = performance.now();

    const textLength = text.length;
    const patternLength = pattern.length;

    for (let i = 0; i <= textLength - patternLength; i++) {
        let found = true;
        for (let j = 0; j < patternLength; j++) {
            if (text[i + j] !== pattern[j]) {
                found = false;
                break;
            }
        }
        if (found) {
            indices.push(i);
        }
    }

    const end = performance.now();
    const elapsed = end - start;

    return {
        indices,
        timeInMilliseconds: elapsed
    };
}

// Пример использования:
const text = inText;
const pattern = "князь Андрей";

const result = bruteforceSearch(text, pattern);

console.log("Индексы вхождений шаблона:", result.indices);
console.log("Время выполнения (мс):", result.timeInMilliseconds.toFixed(3));
