let fs = require('fs');                  // Подключение модуля fs для работы с файлами
let inputText = fs.readFileSync('warandpeace.txt', 'utf8'); // Записываем текст файла в переменную inText

// Функция для посимвольного сравнения фрагмента строки с подстрокой
function compareChars(string, idx, pattern, stats) {
    // Проходим по всем символам подстроки
    for (let i = 0; i < pattern.length; i++) {
        stats.characterComparisons++;  
        // Сравниваем текущий символ строки с символом подстроки
        if (string[idx + i] !== pattern[i]) {
            return false;  
        }
    }
    return true; 
}

// Основная функция для поиска подстроки с использованием хэширования
function HashSum(string, pattern) {
    // Статистика: время выполнения, совпадения, коллизии, количество сравнений
    const result = {
        executionTime: 0,       // Время выполнения поиска
        matches: [],            // Массив индексов начала всех совпадений
        exactMatches: 0,        // Количество точных совпадений
        collisions: 0,          // Количество коллизий хэшей
        characterComparisons: 0 // Количество сравнений символов
    };

    const patternLength = pattern.length; // Длина подстроки
    const stringLength = string.length;   // Длина строки
    let patternHash = 0;  // Хэш подстроки
    let currentHash = 0;  // Хэш текущего окна в строке

    // Вычисляем хэш подстроки и хэш первого окна в строке
    for (let i = 0; i < patternLength; i++) {
        patternHash += pattern.charCodeAt(i);   // Суммируем ASCII-коды символов подстроки
        currentHash += string.charCodeAt(i);    // Суммируем ASCII-коды символов первого окна строки
    }

    const startTime = performance.now();  // Запоминаем время начала выполнения поиска

    // Основной цикл: сдвигаем окно по строке и сравниваем хэши
    for (let left = 0, right = patternLength; right <= stringLength; left++, right++) {
        // Проверяем, совпадают ли хэши текущей подстроки и шаблона
        if (currentHash === patternHash) {
            // Если хэши совпали, проверяем совпадение подстроки и фрагмента строки
            if (compareChars(string, left, pattern, result)) {
                result.matches.push(left);  // Записываем индекс начала совпадения
                result.exactMatches++;      // Увеличиваем счетчик точных совпадений
            } else {
                result.collisions++;  // Если строки не совпали, увеличиваем счетчик коллизий
            }
        }

        // Обновляем хэш текущей подстроки:
        // убираем старый символ (на позиции left) и добавляем новый (на позиции right)
        if (right < stringLength) {
            currentHash = currentHash - string.charCodeAt(left) + string.charCodeAt(right);
        }
    }

    result.executionTime = performance.now() - startTime;  // Вычисляем время выполнения поиска

    return result;  // Возвращаем объект с результатами поиска
}


console.log(HashSum(inputText, "князь Андрей"));