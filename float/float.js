// Функция для преобразования десятичного числа в формат IEEE 754 с одинарной точностью
function createFloat(number) {
    // Проверяем, является ли входное значение числом и не является ли оно NaN
    if (typeof number !== "number" || isNaN(number)) {
        return "0 11111111 0...1...0 (NaN)"; 
    }

    // Определяем знак числа: 1 для отрицательного, 0 для положительного
    const sign = number < 0 ? 1 : 0;
    number = Math.abs(number); // Преобразуем число в положительное

    // Обрабатываем бесконечность
    if (!isFinite(number)) {
        const infBits = Array(32).fill(0); // Создаем массив из 32 нулей
        infBits[0] = sign; // Устанавливаем знак
        infBits.fill(1, 1, 9); // Устанавливаем все единицы в экспоненту
        return infBits;
    }

    // Инициализируем экспоненту и мантиссу
    let exponent = 0;
    let mantissa = number;

    // Нормализация мантиссы (уменьшаем до диапазона [1, 2))
    while (mantissa >= 2) {
        mantissa /= 2;
        //console.log(mantissa)
        exponent++;
    }
    while (mantissa < 1 && exponent > -127) { //Для чисел, меньших 1
        mantissa *= 2;
        exponent--;
    }
    //console.log(mantissa)
    // Приводим экспоненту к смещенному формату (добавляем 127)
    exponent += 127;
    mantissa -= 1; // Убираем ведущую единицу (нормализация)

    // Создаем результирующий массив из 32 бит
    const result = Array(32).fill(0);
    result[0] = sign; // Устанавливаем бит знака

    // Записываем 8-битную экспоненту
    for (let i = 1; i <= 8; i++) {
        result[i] = (exponent >> (8 - i)) & 1;
    }

    // Записываем 23-битную мантиссу
    for (let i = 9; i < 32; i++) {
        mantissa *= 2;
        result[i] = Math.floor(mantissa); // Берем целую часть мантиссы
        mantissa -= result[i]; // Убираем записанную часть
    }

    return result; // Возвращаем результат
}

// Функция для сложения двух чисел в формате IEEE 754
function sumFloats(float1, float2) {
    // Извлекаем знак, экспоненту и мантиссу из первого числа
    const sign1 = float1[0];
    const sign2 = float2[0];
    const exponent1 = parseInt(float1.slice(1, 9).join(""), 2); // Парсим экспоненту как число
    const exponent2 = parseInt(float2.slice(1, 9).join(""), 2);
    const mantissa1 = parseInt("1" + float1.slice(9).join(""), 2); // Добавляем ведущую единицу
    const mantissa2 = parseInt("1" + float2.slice(9).join(""), 2);

    // Выравниваем мантиссы по экспоненте
    let alignedMantissa1 = mantissa1;
    let alignedMantissa2 = mantissa2;
    let alignedExponent = exponent1;
    let alignedSign = sign1;
    //console.log("deb: ", alignedMantissa1);
    
    // Выводим отладочную информацию для выровненных мантисс
    console.log("deb1: ", alignedMantissa1);
    console.log("deb2: ", alignedMantissa2); 
    console.log("deb s: ", alignedSign); 

    // Сравниваем экспоненты двух чисел
    if (exponent1 > exponent2) {
    // Если первая экспонента больше, выравниваем мантиссу второго числа
        alignedMantissa2 >>= exponent1 - exponent2; // Сдвигаем мантиссу меньшей экспоненты
        alignedExponent = exponent1; // Устанавливаем выровненную экспоненту
        alignedSign = sign1; // Устанавливаем знак результата как знак первого числа
    } else if (exponent2 > exponent1) {
    // Если вторая экспонента больше, выравниваем мантиссу первого числа
        alignedMantissa1 >>= exponent2 - exponent1; // Сдвигаем мантиссу меньшей экспоненты
        alignedExponent = exponent2; // Устанавливаем выровненную экспоненту
        alignedSign = sign2; // Устанавливаем знак результата как знак второго числа
    } else {
    // Если экспоненты равны, определяем знак результата по мантиссам
        if (alignedMantissa1 >= alignedMantissa2) {
            alignedSign = sign1; // Если мантисса первого числа больше или равна, устанавливаем его знак
        } else {
            alignedSign = sign2; // В противном случае устанавливаем знак второго числа
        }
}
    
    // console.log("deb1: ", alignedMantissa1);
    // console.log("deb2: ", alignedMantissa2);
    // console.log("deb s: ", alignedSign);
    // Складываем мантиссы с учетом знаков
    let resultMantissa = (sign1===sign2 ? 1:-1) * alignedMantissa1 + alignedMantissa2

    let resultSign = alignedSign; // Определяем знак результата
    console.log("deb: ", resultMantissa);
    resultMantissa = Math.abs(resultMantissa); // Берем модуль мантиссы


    // Нормализация результата
    while (resultMantissa >= (1 << 24)) { // 1 << 24 (пока мантисса >= 2^24 (делим на 2, так как побитовый сдвиг вправо))
        resultMantissa >>= 1; // Сдвигаем мантиссу вправо
        alignedExponent++;
    }
    //Про переполнение
    while (resultMantissa < (1 << 23) && alignedExponent > 0) {
        resultMantissa <<= 1; // Сдвигаем мантиссу влево (умножаем на 2 и забираем степень из экспоненты)
        alignedExponent--;
    }


    // Обрабатываем случай переполнения (подпороговые числа становятся нулем)
    if (alignedExponent <= 0) {
        return Array(32).fill(0); // Возвращаем ноль
    }

    // Создаем массив результата
    const result = Array(32).fill(0);
    result[0] = resultSign; // Устанавливаем бит знака

    // Записываем экспоненту
    for (let i = 1; i <= 8; i++) {
        result[i] = (alignedExponent >> (8 - i)) & 1;
    }

    // Записываем мантиссу
    for (let i = 9; i < 32; i++) {
        result[i] = (resultMantissa >> (31 - i)) & 1;
    }

    return result; // Возвращаем результат
}


const float1 = createFloat(-10);
const float2 = createFloat(11);
console.log(sumFloats(float1, float2));
