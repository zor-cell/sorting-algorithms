const MAX_NUMBER = 1000;
const COLOR = {
    NORMAL: 'rgb(200, 200, 200)',
    SORTED: 'rgb(100, 100, 100)',
    START: 'rgb(0, 255, 0)',
    CURRENT: 'rgb(255, 0, 0)',
    BLUE: 'rgb(0, 0, 255)'
}

//stop code for given milliseconds
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//mpas number from in range to number in out range
function map(number, inMin, inMax, outMin, outMax) {
    return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

function drawPillar(canvas, data, i, color) {
    let ctx = canvas.getContext('2d');

    const width = Math.ceil(canvas.width / data.length);
    const height = map(data[i], 0, MAX_NUMBER, 0, canvas.height); 

    ctx.fillStyle = color;
    ctx.clearRect(width * i, 0, width, canvas.height);
    ctx.fillRect(width * i, canvas.height - height, width, canvas.height);
}

function swap(array, i, j) {
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
}

async function bubbleSort(array, canvas, setCount, waitMs) {
    let count = 0;

    for(let i = 0;i < array.length;i++) {
        let j = 0;
        for(;j < array.length - i - 1;j++) {
            setCount(++count);

            drawPillar(canvas, array, j, COLOR.CURRENT);
            await sleep(waitMs);

            if(array[j] > array[j + 1]) {
                swap(array, j, j + 1);
            }

            drawPillar(canvas, array, j, COLOR.NORMAL);
        }
        drawPillar(canvas, array, j, COLOR.SORTED);
    }

    console.log(count)
}

async function insertionSort(array, canvas, setCount, waitMs) {
    let count = 0;

    for(let i = 1;i < array.length;i++) {
        drawPillar(canvas, array, i, COLOR.START);

        let j = i;
        for(j = i;j > 0;j--) {
            setCount(++count);

            drawPillar(canvas, array, j - 1, 'red');
            await sleep(waitMs);

            if(array[j] < array[j - 1]) {
                swap(array, j, j - 1);

                drawPillar(canvas, array, j, COLOR.SORTED);
                drawPillar(canvas, array, j - 1, COLOR.START);
            } else break;
        }
        
        drawPillar(canvas, array, j, COLOR.SORTED);
        drawPillar(canvas, array, j - 1, COLOR.SORTED);
    }
}

async function selectionSort(array, canvas, setCount, waitMs) {
    let count = 0;

    for(let i = 0;i < array.length;i++) {
        let minIndex = i;

        for(let j = i + 1;j < array.length;j++) {
            setCount(++count);
            drawPillar(canvas, array, j, COLOR.CURRENT);
            await sleep(waitMs);

            if(array[j] < array[minIndex]) {
                if(minIndex != i) drawPillar(canvas, array, minIndex, COLOR.NORMAL);
                minIndex = j;
                drawPillar(canvas, array, j, COLOR.BLUE);
            } else {
                drawPillar(canvas, array, j, COLOR.NORMAL);
            }
        }

        swap(array, i, minIndex);
        drawPillar(canvas, array, minIndex, COLOR.NORMAL);
        drawPillar(canvas, array, i, COLOR.SORTED);
    }

    console.log(array)
}