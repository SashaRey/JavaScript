# README: Взлом и расшифровка шифра Цезаря

Этот проект реализует метод взлома и расшифровки шифра Цезаря на основе частотного анализа. Используя частоты букв в английском языке, программа автоматически определяет вероятный сдвиг и дешифрует текст.

---

## Описание шифра Цезаря
Шифр Цезаря — это метод шифрования, в котором каждая буква текста заменяется на другую букву, сдвинутую на фиксированное число позиций в алфавите.

**Пример:**
- Исходный текст: `HELLO`
- Сдвиг: `3`
- Зашифрованный текст: `KHOOR`

---

## Алгоритм работы программы

### 1. Канонические частоты
В программе используются **канонические частоты** английских букв — это вероятности появления каждой буквы в текстах на английском языке:

```javascript
const canonicalFrequencies = [
    0.082, 0.015, 0.028, 0.043, 0.127, 0.022, 0.020, 0.060, 0.069, 0.002,
    0.008, 0.040, 0.024, 0.067, 0.075, 0.019, 0.001, 0.060, 0.063, 0.091,
    0.028, 0.020, 0.002, 0.002, 0.024, 0.002
];
```

### 2. Вычисление частот в тексте
Функция `calculateFrequencies` подсчитывает частоты букв в зашифрованном тексте:

```javascript
function calculateFrequencies(text) {
    const frequencies = new Array(26).fill(0);
    let totalChars = 0;

    for (const char of text.toLowerCase()) {
        const index = char.charCodeAt(0) - 'a'.charCodeAt(0);
        if (index >= 0 && index < 26) { // Проверяем, является ли символ буквой
            frequencies[index]++;
            totalChars++;
        }
    }

    return frequencies.map(count => count / totalChars);
}
```

#### Объяснение:

- Подсчитывает количество каждой буквы и делит его на общее число букв, чтобы получить частоты.

---

### 3. Поиск наилучшего сдвига
Функция `decryptCaesarCipher` выполняет взлом шифра с помощью частотного анализа:

```javascript
function decryptCaesarCipher(text, canonicalFrequencies) {
    const factFrequencies = calculateFrequencies(text);
    const n = 26; // Количество букв в алфавите
    let minDeviation = Infinity;
    let bestShift = 0;

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
```

#### Этапы:
1. **Подсчёт отклонения частот**:
   - Для каждого возможного сдвига (от `0` до `25`) вычисляется квадрат отклонения между частотами текста и каноническими частотами.
   - Сдвиг с минимальным отклонением считается наилучшим.
   
2. **Применение сдвига**:
   - Используется найденный сдвиг для расшифровки текста.
   - Для каждой буквы определяется новый код символа, сдвинутый на найденное значение.

---

## Пример работы

### Входные данные:
```plaintext
GUVF VF N GRFG ZRFFNTR
```

### Ход выполнения:
1. **Подсчёт частот**:
   - Частоты букв текста сравниваются с каноническими.
   
2. **Определение сдвига**:
   - Наименьшее отклонение достигается при сдвиге `13`.

3. **Расшифровка**:
   - Каждая буква сдвигается на `-13` позиций:
     - `G -> T`
     - `U -> H`
     - `V -> I`
     - `F -> S`
   - Результат: `THIS IS A TEST MESSAGE`.

### Результат:
```plaintext
Расшифрованное сообщение: THIS IS A TEST MESSAGE
```


