
# Инструмент Run-Length Encoding (RLE)

Этот скрипт на Node.js реализует алгоритм Run-Length Encoding (RLE) с использованием пользовательской системы кодирования, которая заменяет числа на непечатные ASCII-символы. Он поддерживает операции кодирования и декодирования для текстовых файлов.

## Возможности
- **Кодирование**: Сжимает повторяющиеся символы в более короткий формат с использованием RLE.
- **Декодирование**: Восстанавливает исходную строку из сжатого формата.
- **Кодирование чисел**: Числа в закодированной строке заменяются непечатными символами для уменьшения размера файла.
- **Рассчёт коэффициента сжатия**: Отображает эффективность процесса кодирования.

## Использование
Скрипт работает в двух режимах:
1. `code` - Кодирует текстовый файл.
2. `decode` - Декодирует ранее закодированный файл.

### Синтаксис команды
```bash
node rle.js <режим> <входной_файл> <выходной_файл>
```
- `<режим>`: Либо `code` (кодирование), либо `decode` (декодирование).
- `<входной_файл>`: Путь к входному файлу.
- `<выходной_файл>`: Путь к выходному файлу.

### Примеры команд
1. **Кодирование файла**
   ```bash
   node rle.js code input.txt encoded.txt
   ```
   Эта команда считывает содержимое файла `input.txt`, сжимает его и записывает закодированные данные в файл `encoded.txt`. Также в консоль выводится коэффициент сжатия.

2. **Декодирование файла**
   ```bash
   node rle.js decode encoded.txt output.txt
   ```
   Эта команда считывает содержимое файла `encoded.txt`, декодирует его и записывает результат в файл `output.txt`.

## Объяснение кода

### Основные функции


#### `const numberToInvisible`
Карта для замены цифр на непечатные символы для отсутствия непредвиденных ситуаций

```javascript
'0': '\x01', '1': '\x02', '2': '\x03', '3': '\x04', '4': '\x05',
    '5': '\x06', '6': '\x07', '7': '\x08', '8': '\x09', '9': '\x0A'
```


Обратная карта для восстановления цифр
```javascript
const invisibleToNumber = Object.fromEntries(
    Object.entries(numberToInvisible).map(([key, value]) => [value, key])
);
```


#### `replaceNumbers(input)`
Заменяет цифры в строке на непечатные ASCII-символы.
```javascript
function replaceNumbers(input) {
    return input.replace(/[0-9]/g, match => numberToInvisible[match]);
}
```

#### `restoreNumbers(input)`
Преобразует непечатные ASCII-символы обратно в цифры.
```javascript
function restoreNumbers(input) {
    return input.replace(/[-
]/g, match => invisibleToNumber[match]);
}
```

#### `encodeString(s)`
Сжимает повторяющиеся символы во входной строке, используя RLE.
- Символы, повторяющиеся 4 или более раз, заменяются на формат: `#<количество><символ>`.
- `<количество>` кодируется как непечатные символы.
```javascript
function encodeString(s) {
    let code = '';
    let i = 0;

    while (i < s.length) {
        let currentSymbol = s[i];
        let count = 1;

        while (currentSymbol === s[i + count]) {
            count++;
        }

        if (count >= 4) {
            code += `#${replaceNumbers(count.toString())}${currentSymbol}`;
        } else {
            code += s.slice(i, i + count);
        }

        i += count;
    }

    return code;
}
```

#### `decodeString(code)`
Восстанавливает исходную строку из сжатого формата RLE.
```javascript
function decodeString(code) {
    let decoded = '';
    let i = 0;

    while (i < code.length) {
        if (code[i] === '#') {
            let endOfNumberIndex = i + 1;
            while (/[-
]/.test(code[endOfNumberIndex])) {
                endOfNumberIndex++;
            }

            let count = restoreNumbers(code.slice(i + 1, endOfNumberIndex));
            let symbol = code[endOfNumberIndex];

            decoded += symbol.repeat(parseInt(count));
            i = endOfNumberIndex + 1;
        } else {
            decoded += code[i];
            i++;
        }
    }

    return decoded;
}
```

### Логика работы
1. Парсинг аргументов командной строки для определения режима (`code` или `decode`), входного и выходного файла.
2. В зависимости от режима выполняется операция кодирования или декодирования.
3. Содержимое входного файла считывается, обрабатывается и записывается в выходной файл.
4. В режиме `code` вычисляется и отображается коэффициент сжатия.

### Пример входных и выходных данных
#### Входной файл (`input.txt`):
```
aaaabbbbcccccdddddddd
```

#### Команда:
```bash
node rle.js code input.txt encoded.txt
```

#### Закодированный файл (`encoded.txt`):
```
#4a#4b#5c#8d
```

#### Декодированный файл (`output.txt`):
```
aaaabbbbcccccdddddddd
```

## Обработка ошибок
- Отсутствие аргументов: Отображаются инструкции по использованию, выполнение прекращается.
- Неверный режим: Выводится сообщение об ошибке, выполнение прекращается.
- Ошибки чтения/записи файлов: Обрабатываются стандартными методами Node.js.

## Зависимости
- Среда выполнения Node.js.
- Встроенный модуль `fs` для операций с файлами.

