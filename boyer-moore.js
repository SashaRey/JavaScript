function boyerMooreSearch(text, pattern) {
    const textLength = text.length;
    const patternLength = pattern.length;

    // Функция для создания таблицы плохих символов
    function buildBadCharTable(pattern) {
        const table = {};
        for (let i = 0; i < pattern.length; i++) {
            table[pattern[i]] = i;
        }
        return table;
    }

    // Функция для вычисления сдвига по хорошему суффиксу
    function goodSuffix(pattern, l) {
        function rpr(l, pattern) {
            const m = pattern.length;
            const extendedPattern = '*'.repeat(m) + pattern;

            for (let k = m - l; k >= -m + 1; k--) {
                const segment = extendedPattern.slice(k + m, k + m + l);
                const suffix = pattern.slice(m - l);

                if (
                    segment === suffix &&
                    (k <= 0 || pattern[k - 1] !== pattern[m - l - 1])
                ) {
                    return k;
                }
            }

            return -m + 1;
        }

        const m = pattern.length;
        const k = rpr(l, pattern);
        return m - k - l + 1;
    }

    const badCharTable = buildBadCharTable(pattern);
    const result = [];

    let shift = 0; // Смещение шаблона относительно текста
    while (shift <= (textLength - patternLength)) {
        let j = patternLength - 1;

        // Сравниваем символы справа налево
        while (j >= 0 && pattern[j] === text[shift + j]) {
            j--;
        }

        if (j < 0) { // Найдено совпадение
            result.push(shift);
            // Смещение шаблона на следующую возможную позицию
            shift += patternLength;
        } else {
            // Вычисляем длину совпавшего суффикса
            let l = 0;
            while (l < patternLength && text[shift + patternLength - 1 - l] === pattern[patternLength - 1 - l]) {
                l++;
            }

            // Используем таблицу плохих символов для смещения
            const badCharShift = j - (badCharTable[text[shift + j]] || -1);
            const goodSuffixShift = l > 0 ? goodSuffix(pattern, l) : 1;

            // Итоговый сдвиг
            shift += Math.max(goodSuffixShift, badCharShift);
        }
    }

    return result;
}

// Пример использования
const text = "abccabcbbccabcdabcdabc";
const pattern = "abc";
const result = boyerMooreSearch(text, pattern);
console.log("Позиции совпадений:", result);
