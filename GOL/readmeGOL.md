# README: Игра «Жизнь» на HTML5 Canvas

## Описание
Этот проект реализует игру «Жизнь» Джона Конвея на HTML5 Canvas. Игрок задаёт начальное состояние поля, где клетки могут быть живыми или мёртвыми. В каждой итерации поле обновляется по правилам, основанным на количестве соседей клетки.

---

## Правила игры
1. **Живая клетка**:
   - Остаётся живой, если у неё 2 или 3 живых соседа.
   - Умирает, если соседей меньше 2 (одиночество) или больше 3 (перенаселение).
2. **Мёртвая клетка**:
   - Оживает, если у неё ровно 3 живых соседа.

---

## Компоненты программы

### HTML-страница
```html
<canvas id="myCanvas" width="400px" height="400px" style="border:1px solid #000000;">
    Sorry, your browser does not support canvas.
</canvas>
<button id="startButton" style="background-color: #191970; color: white;">
    Start
</button>
<button id="pauseButton" style="background-color: #8B0000; color: white;">
    Pause
</button>
```
- Элемент `<canvas>` используется для отображения игрового поля.
- Кнопки **Start** и **Pause** управляют симуляцией.

### Основные функции

#### 1. `neighbourCount(row, column)`
Считает количество живых соседей для клетки по координатам `(row, column)`(поле замкнуто по краям, поэтому добавляем %fieldsize):

```javascript
function neighbourCount(row, column) {
    let sum = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            sum += currentField[(row + i + fieldSize) % fieldSize][(column + j + fieldSize) % fieldSize];
        }
    }
    sum -= currentField[row][column];
    return sum;
}
```
- Циклы `for` проверяют всех соседей вокруг клетки.
- Используется оператор `%` для реализации замкнутых границ.

#### 2. `makeStep()`
Вычисляет следующее состояние поля, основываясь на текущем. Реализует правила игры:

```javascript
function makeStep() {
    for (let i = 0; i < fieldSize; i++) {
        for (let j = 0; j < fieldSize; j++) {
            let nbs = neighbourCount(i, j);
            if (((currentField[i][j] === 0) && (nbs === 3)) || ((currentField[i][j] === 1) && ((nbs === 2) || (nbs === 3)))) {
                nextField[i][j] = 1;
            } else {
                nextField[i][j] = 0;
            }
        }
    }
    for (let i = 0; i < fieldSize; i++) {
        for (let j = 0; j < fieldSize; j++) {
            currentField[i][j] = nextField[i][j];
        }
    }
}
```
- Соседи клетки считаются с помощью `neighbourCount`.
- Логика правил игры реализована через условия `if`.
- Массив `nextField` обновляется для следующего шага, а затем копируется обратно в `currentField`.

#### 3. `draw()`
Отображает текущее состояние поля на Canvas:

```javascript
function draw() {
    for (let i = 0; i < fieldSize; i++) {
        for (let j = 0; j < fieldSize; j++) {
            ctx.fillStyle = currentField[i][j] === 0 ? "white" : "red";
            ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
            ctx.strokeStyle = "Black";
            ctx.strokeRect(i * cellSize, j * cellSize, cellSize, cellSize);
        }
    }
}
```
- Каждая клетка отрисовывается с помощью `fillRect`.
- Красный цвет обозначает живые клетки, белый — мёртвые.
- Границы клеток рисуются через `strokeRect`.

#### 4. `mClick(click)`
Обрабатывает щелчки мыши, позволяя пользователю сделать клетку живой:

```javascript
function mClick(click) {
    let x = Math.floor((click.clientX - canvasRect.left) / cellSize);
    let y = Math.floor((click.clientY - canvasRect.top) / cellSize);
    currentField[x][y] = 1;
    draw();
}
```
- Вычисляются координаты клетки, по которой кликнули.
- Клетка становится живой (`1`), и обновляется поле с помощью `draw()`.

#### 5. `play()` и `pause()`
Управляют процессом игры:

```javascript
function play() {
    if (!isPlaying) {
        gameInterval = setInterval(go, 1500);
        isPlaying = true;
    }
}

function pause() {
    if (isPlaying) {
        clearInterval(gameInterval);
        isPlaying = false;
    }
}
```
- `play()` запускает обновление поля каждые 1500 мс с помощью `setInterval`.
- `pause()` останавливает игру, очищая интервал.

---

## Как использовать

1. Откройте HTML-страницу в браузере.
2. На Canvas щёлкните мышью по клеткам, чтобы задать начальное состояние (сделать клетки живыми).
3. Нажмите кнопку **Start**, чтобы запустить игру.
4. Нажмите **Pause**, чтобы остановить игру.

---

## Пример использования

1. **Начальное состояние**:
   - Щёлкните мышью по нескольким клеткам на Canvas, чтобы задать стартовые живые клетки.
2. **Запуск**:
   - Нажмите кнопку **Start**, чтобы начать симуляцию.
3. **Наблюдение**:
   - Поле будет автоматически обновляться каждые 1,5 секунды.
4. **Пауза**:
   - Нажмите **Pause**, чтобы остановить симуляцию.

---