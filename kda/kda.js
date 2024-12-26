//Чтение содержимого файла
let fs = require('fs');
let arg = process.argv;
let inText;
let testString = '';

try {
	inText = fs.readFileSync(arg[2], 'utf-8');

	let m = inText.length; 
	let alph = new Array();
	//Определяем алфавит строки inText
	for(let i = 0; i < m; i++)
		alph[inText.charAt(i)] = 0 
	//В двумерном массиве del храним таблицу переходов

	let del = new Array(m + 1);
	for(let j = 0; j <= m; j++)
		del[j] = new Array();

	//Инициализируем таблицу переходов 
	for(i in alph)
		del[0][i]=0

	//Формируем таблицу переходов 
	for(let j = 0; j < m; j++){
		prev = del[j][inText.charAt(j)];
		del[j][inText.charAt(j)] = j + 1; 
		for(i in alph)
			del[j + 1][i] = del[prev][i]
	}

	//Выводим таблицу переходов 
	for(j = 0; j <= m; j++){ 
		out = ''
		for(i in alph)
			out += del[j][i] + ' '
		console.log(out);
	}
	let results = new Array();
	let state = 0;
	for(let i = 0; i < inText.length; i++){
		if(inText.charAt(i) in alph)
			state = del[state][inText.charAt(i)];
		else
			state = 0;
		if(state == m)
			results.push(i - m);
	}
	console.log(results);
} catch (err) {
	console.error(err);
}