const fs = require('fs');

// Получаем аргументы командной строки
const mode = process.argv[2];       // Режим работы: 'code' или 'decode'
const inputFile = process.argv[3];  // Входной файл
const outputFile = process.argv[4]; // Выходной файл

// Проверка на наличие всех аргументов
if (!mode || !inputFile || !outputFile) {
    console.log("Usage: node rle.js <mode> <inputFile> <outputFile>");
    console.log("Example: node rle.js code input.txt code.txt");
    process.exit(1); // Завершаем программу с кодом ошибки
}

// Считываем данные из файла 'input.txt' и убираем лишние пробелы
let s = fs.readFileSync('input.txt', 'utf8').trim();

function encodeString(s) {
    let code = '';
    let left = 0;
    let max_counter = 0;
    let symbol = '';

    // Проходим по строке и кодируем последовательности из одинаковых символов
    for (let i = 0; i < s.length; i++) {
        left = i;
        max_counter = 1;

        // Проверка на последовательность одинаковых символов
        while (s[i] === s[i + 1]) {
            max_counter++;
            i++;
        }

        // Если нашли 4 или более одинаковых символов подряд, кодируем их
        if (max_counter >= 4) {
            symbol = s[left];
            while (max_counter > 255) {
                // Кодируем группу по 255 символов
                code += `#255${symbol}`; //Конструкция для подстановки значения в строку. Наверное, аналог f-строк в python?
                max_counter -= 255;
            }
            // Оставшаяся часть, если есть, кодируется последним блоком
            if (max_counter > 0) {
                code += `#${max_counter}${symbol}`; //Конструкция, аналогичная 28 строке
            }
        } else {
            // Добавляем некодированные символы напрямую
            code += s.slice(left, i + 1); //Метод slice вырезает и возвращает указанную часть массива. Сам массив при этом не изменяется.
                                        //Первым параметром указывается номер элемента массива, с которого начинается вырезание
                                        //Вторым - по который вырезается (невключительно)
        }
    }

    return code;
}

function decodeString(code) {
    let decoded = '';
    let i = 0;

    // Проходим по закодированной строке и раскодируем её
    while (i < code.length) {
        if (code[i] === '#') { //Как пишут на хабре - === проверяет на идентичность, а == - на равенство.

            //Пример: abc  == undefined;	// true, если abc = undefined | null
            //abc === undefined;	// true - только если abc = undefined!
        

            // Извлекаем число символов и сам символ
            let endOfNumberIndex = i + 1;
            while (code[endOfNumberIndex] >= '0' && code[endOfNumberIndex] <= '9') {
                endOfNumberIndex++;
            }
            
            let count = parseInt(code.slice(i + 1, endOfNumberIndex));
            let symbol = code[endOfNumberIndex];
            
            // Проверяем, что symbol определен
            if (symbol) {
                decoded += symbol.repeat(count);
            }
            
            i = endOfNumberIndex + 1; //Обновляем i, чтобы перейти к следующему символу
        } else { //Обработка символов без '#'
            // Если нет '#', просто добавляем символ к декодированной строке
            decoded += code[i];
            i++;
        }
    }
    return decoded;
}

// Логика программы в зависимости от режима
if (mode === 'code') {
    // Считываем входную строку из файла
    let inputString = fs.readFileSync(inputFile, 'utf8').trim();
    let encodedString = encodeString(inputString); // Кодируем строку
    fs.writeFileSync(outputFile, encodedString, 'utf8'); // Сохраняем результат

    // Рассчитываем коэффициент сжатия
    let compressionRatio = inputString.length / encodedString.length;
    console.log("Закодированная строка:", encodedString);
    console.log(`Коэффициент сжатия: ${compressionRatio.toFixed(2)}`);
} else if (mode === 'decode') {
    // Считываем закодированную строку из файла
    let encodedString = fs.readFileSync(inputFile, 'utf8').trim();
    let decodedString = decodeString(encodedString); // Декодируем строку
    fs.writeFileSync(outputFile, decodedString, 'utf8'); // Сохраняем результат

    console.log("Decoded:", decodedString);
} else {
    // Обработка неправильного режима работы
    console.log("Invalid mode. Use 'code' or 'decode'.");
}