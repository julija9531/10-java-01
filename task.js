const hasTooltip = Array.from(document.querySelectorAll(".has-tooltip"));//Массив элементов, которые нуждаются в подсказке
let tooltip; //Подсказка
let leftTip;
let topTip;
let activeElem; //Текущий элемент
let statElem = []; //Номер предыдущего активного элемента

//Расчет координат подсказки:
function tipCoord() {
    if (activeElem) {
        //Получение свойств:
        let pos = activeElem.getAttribute("data-position");
        let coords = activeElem.getBoundingClientRect();

        //Поумолчанию принимаем положение Снизу Слева:
        leftTip = coords.left;
        
        topTip = coords.top + activeElem.offsetHeight;
        
        //Если свойство есть:
        if (pos) {
            console.log(pos);
            //1. Горизонталь
            //1.1 по центру элемента
            if (pos.includes("center")) {leftTip += (activeElem.offsetWidth - tooltip.offsetWidth) / 2;};
            //1.2 Справа:
            if (pos.includes("right")) {leftTip += (activeElem.offsetWidth - tooltip.offsetWidth)};
            //2. Вертикаль:
            if (pos.includes("top")) {topTip = coords.top - tooltip.offsetHeight;};
        };

        // не заезжать за левый край окна
        if (leftTip < 0) {leftTip = 0;}
        // не заезжать за правый край окна
        if((leftTip + tooltip.offsetWidth) > document.querySelector("body").scrollWidth) {
            leftTip = document.querySelector("body").scrollWidth - tooltip.offsetWidth;
        }

        return {left: leftTip, top: topTip};
    }
}

//Задать координаты подсказке:
function coordChange () {
    let coords = tipCoord();

    tooltip.style.left = coords.left + 'px';
    tooltip.style.top = coords.top + 'px';
}

//Включение элемента
function elemOnn(i) {
    tooltip = document.createElement('div');
    tooltip.className = "tooltip tooltip_active"
    tooltip.innerHTML = hasTooltip[i].getAttribute("title");
    document.body.append(tooltip);
    statElem[i] = true;
}

//Отключение элемента
function elemOff(i) {
    tooltip.remove();
    statElem[i] = false;
}


for (let i = 0; i < hasTooltip.length; i++) {
    statElem.push(false);
}

//Клик по элементу
for (let i = 0; i < hasTooltip.length; i++) {
    hasTooltip[i].onclick = function(event) {

        activeElem = event.target;
        let num = statElem.findIndex(item => item == true);//находим номер текущего активного элемента:

        //если нет включенных 
        if (num == -1) {
            elemOnn(i);
        } else if (num == i) { //если включен текущий элемент:
            elemOff(i);
        } else {//если включен другой элемент:
            elemOff(num);
            elemOnn(i);
        }

        //Координаты:
        coordChange();
        return false;
    }
}

//Скролл
window.addEventListener('scroll', function() {
   if (activeElem) { coordChange();}
})