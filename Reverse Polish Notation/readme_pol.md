# README: Преобразование из инфиксной записи в постфиксную и вычисление выражения

## Описание задачи
Данный код реализует преобразование математического выражения из инфиксной записи (стандартной алгебраической формы) в постфиксную запись (обратная польская нотация, ОПН) с последующим вычислением значения выражения. Программа работает с числами, основными арифметическими операторами и скобками.

---

## Основные этапы работы программы

### 1. Ввод инфиксного выражения
Пользователь вводит строку с инфиксным выражением. Пример:
```
3 + 5 * ( 2 - 8 )
```

---

### 2. Валидация выражения
Функция `validateExpression` выполняет проверку корректности входного выражения.

#### Основные шаги:
1. **Проверка символов:**
   - Выражение должно содержать только числа, операторы (`+`, `-`, `*`, `/`, `^`), скобки и пробелы.
   ```javascript
   const validCharacters = /^[\d+\-*/^().\s]+$/;
   if (!validCharacters.test(expression)) {
       throw new Error('Выражение содержит недопустимые символы.');
   }
   ```

2. **Проверка сбалансированности скобок:**
   - Подсчитывается баланс открывающих и закрывающих скобок.
   - Если баланс становится отрицательным или не равен нулю в конце, выбрасывается ошибка.
   ```javascript
   let balance = 0;
   for (const token of tokens) {
       if (token === '(') balance++;
       if (token === ')') balance--;
       if (balance < 0) throw new Error('Несбалансированные скобки.');
   }
   if (balance !== 0) throw new Error('Несбалансированные скобки.');
   ```

---

### 3. Преобразование в постфиксную запись
Функция `infixToPostfix` преобразует инфиксное выражение в постфиксное с использованием стека.

#### Алгоритм преобразования:
1. **Приоритеты операторов:**
   ```javascript
   const precedence = {
       '+': 1, '-': 1,
       '*': 2, '/': 2,
       '^': 3
   };
   ```
   - Более высокий приоритет у операторов `*`, `/` и `^`.

2. **Ассоциативность операторов:**
   ```javascript
   const isRightAssociative = { '^': true };
   ```
   - Оператор `^` имеет правую ассоциативность, остальные — левую.

3. **Проход по токенам выражения:**
   - Токены делятся на числа, операторы и скобки.
   - В зависимости от типа токена выполняются действия:

   #### Пример кода обработки токенов:
   - **Число:**
     Добавляется в результат:
     ```javascript
     if (!isNaN(token)) {
         postfix.push(token);
     }
     ```

   - **Открывающая скобка:**
     Помещается в стек:
     ```javascript
     else if (token === '(') {
         stack.push(token);
     }
     ```

   - **Закрывающая скобка:**
     Все операторы из стека до открывающей скобки переносятся в результат:
     ```javascript
     else if (token === ')') {
         while (stack.length && stack[stack.length - 1] !== '(') {
             postfix.push(stack.pop());
         }
         stack.pop(); // Удаляем '('
     }
     ```

   - **Оператор:**
     Сравнивается приоритет текущего оператора с верхним оператором в стеке:
     ```javascript
     while (
         stack.length &&
         precedence[stack[stack.length - 1]] !== undefined &&
         (
             (isRightAssociative[token] && precedence[token] < precedence[stack[stack.length - 1]]) ||
             (!isRightAssociative[token] && precedence[token] <= precedence[stack[stack.length - 1]])
         )
     ) {
         postfix.push(stack.pop());
     }
     stack.push(token);
     ```

4. **Завершающий шаг:**
   - Все оставшиеся операторы из стека переносятся в результат.

#### Результат:
Постфиксная запись возвращается как строка.

---

### 4. Вычисление результата
Функция `evaluatePostfix` вычисляет значение выражения в постфиксной записи.

#### Алгоритм вычисления:
1. **Проход по токенам постфиксного выражения:**
   - Числа помещаются в стек.
   - Операторы применяются к двум верхним элементам стека, результат добавляется обратно в стек.
   ```javascript
   for (const token of tokens) {
       if (!isNaN(token)) {
           stack.push(Number(token));
       } else {
           const b = stack.pop();
           const a = stack.pop();
           switch (token) {
               case '+': stack.push(a + b); break;
               case '-': stack.push(a - b); break;
               case '*': stack.push(a * b); break;
               case '/': stack.push(a / b); break;
               case '^': stack.push(Math.pow(a, b)); break;
           }
       }
   }
   ```

2. **Результат:**
   - Единственный элемент, оставшийся в стеке, — это результат вычисления.

---

## Пример работы

### Входное выражение:
```
3 + 5 * ( 2 - 8 )
```

### Шаги выполнения:
1. **Валидация:**
   - Выражение корректно, все скобки сбалансированы.

2. **Преобразование в постфиксную запись:**
   ```
3 5 2 8 - * +
   ```

3. **Вычисление результата:**
   - Постфиксное выражение обрабатывается следующим образом:
     ```
     Стек: [] (начало)
     Токен: 3 → Стек: [3]
     Токен: 5 → Стек: [3, 5]
     Токен: 2 → Стек: [3, 5, 2]
     Токен: 8 → Стек: [3, 5, 2, 8]
     Токен: - → Стек: [3, 5, -6]
     Токен: * → Стек: [3, -30]
     Токен: + → Стек: [-27]
     ```

   - Результат: `-27`.

---

## Использование

1. Скопируйте код в файл, например, `infix_to_postfix.js`.
2. Запустите программу:
   ```bash
   node infix_to_postfix.js
   ```
3. Введите инфиксное выражение, следуя подсказке.
