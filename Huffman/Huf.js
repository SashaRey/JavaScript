input = 'abrakadabra';
alph = new Object(); // Используем объект для подсчёта частот
tree = new Array();
inLength = input.length;
let alphPower = 0;
let codes = {};
let symbolCodes = {}; // Словарь для хранения кодов символов

function Node(name, freq, used, link, code) {
    this.name = name;
    this.freq = freq;
    this.used = used;
    this.link = link;
    this.code = code;
    this.left = null; // Левый потомок
    this.right = null; // Правый потомок
}

// Инициализация: подсчитываем количество каждого символа
for (let i = 0; i < inLength; i++) {
    let char = input.charAt(i);
    if (alph[char]) {
        alph[char]++;
    } else {
        alph[char] = 1;
    }
}

for (let i in alph) {
    alphPower++;
    let n = new Node(i, alph[i], false, undefined, '');
    tree.push(n);
}

// Выбор двух минимальных узлов
while (tree.filter(node => !node.used).length > 1) {
    let min1 = null;
    let min2 = null;

    // Первый проход: находим узел с минимальной частотой
    for (let node of tree) {
        if (!node.used && (min1 === null || node.freq < min1.freq)) {
            min1 = node;
        }
    }
    min1.used = true; // Помечаем как использованный

    // Второй проход: находим следующий узел с минимальной частотой
    for (let node of tree) {
        if (!node.used && (min2 === null || node.freq < min2.freq)) {
            min2 = node;
        }
    }
    min2.used = true; // Помечаем как использованный

    // Создаём новый объединённый узел
    let newNode = new Node(min1.name + min2.name, min1.freq + min2.freq, false, undefined, '');
    newNode.left = min1;
    newNode.right = min2;
    tree.push(newNode);
}



let root = tree[tree.length - 1];

// Функция для рекурсивного обхода дерева и назначения кодов
function assignCodes(node, currentCode = '') {
    if (node === null) return;

    if (!node.left && !node.right) {
        codes[node.name] = currentCode;
        symbolCodes[currentCode] = node.name; // Сохраняем код символа в словаре
    } else {
        assignCodes(node.left, currentCode + '0');
        assignCodes(node.right, currentCode + '1');
    }
}

function decodeString(encodedString) {
    let decodedString = '';
    let currentCode = ''; // Переменная для хранения текущего кода

    for (let char of encodedString) {
        currentCode += char;
        if (currentCode in symbolCodes) {
            decodedString += symbolCodes[currentCode];
            currentCode = ''; // Сбрасываем текущий код
        }
    }

    return decodedString;
}

assignCodes(root);

// Кодирование
let encodedString = '';
for (let i = 0; i < input.length; ++i) {
    encodedString += codes[input[i]];
}
console.log("Закодированная строка:", encodedString);

// Выводим словарь символов и их кодов
console.log("Словарь символов и их кодов:", codes);

// Декодируем строку
console.log("Декодированная строка:", decodeString(encodedString));
