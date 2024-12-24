const fs = require('fs');

// Читаем текст из файла
const inputText = fs.readFileSync('warandpeace.txt', 'utf8');

// Алгоритм Рабина-Карпа
function rabinKarpSearch(text, pattern) {
    const stats = {
        executionTime: 0,      // Время выполнения поиска
        matches: [],           // Индексы всех совпадений
        exactMatches: 0,       // Количество точных совпадений
        collisions: 0,         // Количество коллизий
        characterComparisons: 0 // Количество сравнений символов
    };

    const patternLength = pattern.length;
    const textLength = text.length;
    const maxPowerOfTwo = Math.pow(2, patternLength - 1);

    let patternHash = 0; // Хэш шаблона
    let currentHash = 0; // Хэш текущего окна текста

    // Вычисляем хэши шаблона и первого окна текста
    for (let i = 0; i < patternLength; i++) {
        patternHash += pattern.charCodeAt(i) * Math.pow(2, patternLength - i - 1);
        currentHash += text.charCodeAt(i) * Math.pow(2, patternLength - i - 1);
    }

    const startTime = performance.now();

    // Основной цикл
    for (let left = 0, right = patternLength; right <= textLength; left++, right++) {
        // Сравниваем хэши
        if (currentHash === patternHash) {
            // Посимвольная проверка
            let match = true;
            for (let i = 0; i < patternLength; i++) {
                stats.characterComparisons++;
                if (text[left + i] !== pattern[i]) {
                    match = false;
                    stats.collisions++;
                    break;
                }
            }
            if (match) {
                stats.matches.push(left);
                stats.exactMatches++;
            }
        }

        // Обновляем хэш
        if (right < textLength) {
            currentHash = 2 * (currentHash - text.charCodeAt(left) * maxPowerOfTwo) + text.charCodeAt(right);
        }
    }

    stats.executionTime = performance.now() - startTime;
    return stats;
}

console.log(rabinKarpSearch(inputText, "князь Андрей"));
