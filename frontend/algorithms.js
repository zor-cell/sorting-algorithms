const MAX_HEIGHT = 1000;
const MAX_CANVAS_WIDTH = 600;
const COLOR = {
    DEFAULT: 'rgb(200, 200, 200)',
    SORTED: 'rgb(100, 100, 100)',
    CURRENT: 'rgb(255, 0, 0)',
    BLUE: 'rgb(0, 0, 255)',
    GREEN: 'rgb(0, 255, 0)',
}


//stop code for given milliseconds
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//mpas number from in range to number in out range
function map(number, inMin, inMax, outMin, outMax) {
    return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

function getPillarWidth(canvas, array) {
    return Math.floor(canvas.width / array.length);
}

function drawPillar(canvas, data, i, color) {
    let ctx = canvas.getContext('2d');

    const width = getPillarWidth(canvas, data);
    const height = map(data[i], 0, MAX_HEIGHT, 0, canvas.height); 

    ctx.fillStyle = color;
    ctx.clearRect(width * i, 0, width, canvas.height);
    ctx.fillRect(width * i, canvas.height - height, width, canvas.height);
}

function drawPillarWithValue(canvas, value, width, i, color) {
    let ctx = canvas.getContext('2d');

    const height = map(value, 0, MAX_HEIGHT, 0, canvas.height); 

    ctx.fillStyle = color;
    ctx.clearRect(width * i, 0, width, canvas.height);
    ctx.fillRect(width * i, canvas.height - height, width, canvas.height);
}

function swap(array, i, j) {
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
}

async function bubbleSort(array, draw) {
    for(let i = 0;i < array.length;i++) {
        let j = 0;
        for(;j < array.length - i - 1;j++) {
            draw.setCount(prevCnt => prevCnt + 1);

            drawPillar(draw.canvas, array, j, COLOR.CURRENT);
            await sleep(draw.delay);

            if(array[j] > array[j + 1]) {
                swap(array, j, j + 1);
            }

            drawPillar(draw.canvas, array, j, COLOR.DEFAULT);
        }
        drawPillar(draw.canvas, array, j, COLOR.SORTED);
    }
}

async function insertionSort(array, draw) {
    for(let i = 1;i < array.length;i++) {
        let j = i;
        for(j = i;j > 0;j--) {
            draw.setCount(prevCnt => prevCnt + 1);

            drawPillar(draw.canvas, array, j, COLOR.CURRENT);
            await sleep(draw.delay);

            if(array[j] < array[j - 1]) {
                swap(array, j, j - 1);

                drawPillar(draw.canvas, array, j, COLOR.SORTED);
                drawPillar(draw.canvas, array, j - 1, COLOR.CURRENT);
            } else break;
        }
        
        drawPillar(draw.canvas, array, j, COLOR.SORTED);
        drawPillar(draw.canvas, array, j - 1, COLOR.SORTED);
    }
}

async function selectionSort(array, draw) {
    for(let i = 0;i < array.length;i++) {
        let minIndex = i;

        for(let j = i + 1;j < array.length;j++) {
            draw.setCount(prevCnt => prevCnt + 1);

            drawPillar(draw.canvas, array, minIndex, COLOR.BLUE);
            drawPillar(draw.canvas, array, j, COLOR.CURRENT);
            await sleep(draw.delay);

            if(array[j] < array[minIndex]) {
                drawPillar(draw.canvas, array, minIndex, COLOR.DEFAULT);
                minIndex = j;
            } else {
                drawPillar(draw.canvas, array, j, COLOR.DEFAULT);
            }
        }

        swap(array, i, minIndex);
        drawPillar(draw.canvas, array, minIndex, COLOR.DEFAULT);
        drawPillar(draw.canvas, array, i, COLOR.SORTED);
    }
}

async function mergeSort(array, draw) {
    const width = getPillarWidth(draw.canvas, array);

    await mergeSortRec(array, draw, width, 0)
    .then(resultArray => {
            for(let i = 0;i < array.length;i++) {
                array[i] = resultArray[i];
            }
        }
    );
}

async function mergeSortRec(array, draw, width, index) {    
    if(array.length <= 1) {
        return array;
    }

    let mid = Math.floor(array.length / 2);
    //draw pivot
   /*  drawPillarWithValue(draw.canvas, array[mid], width, index + mid, COLOR.CURRENT);
    await sleep(draw.delay);
    drawPillarWithValue(draw.canvas, array[mid], width, index + mid, COLOR.DEFAULT); */

    let left = await mergeSortRec(array.slice(0, mid), draw, width, index);
    let right = await mergeSortRec(array.slice(mid), draw, width, index + mid);

    return await merge(left, right, draw, width, index);
}

//merge 2 sorted list to one merged list which is sorted
async function merge(left, right, draw, width, index) {
    let array = new Array(left.length + right.length);

    let i = 0;
    let leftIndex = 0, rightIndex = 0;
    while(i < array.length) {
        draw.setCount(prevCnt => prevCnt + 1);

        let l = leftIndex < left.length ? left[leftIndex] : null;
        let r = rightIndex < right.length ? right[rightIndex] : null;

        if(l == null) { //no more elements in left array
            array[i] = r;
            rightIndex++;
        } else if(r == null) { //no more elements in right array
            array[i] = l;
            leftIndex++;
        } else if(l <= r) {
            array[i] = l;
            leftIndex++;
        } else {
            array[i] = r;
            rightIndex++;
        }

        drawPillarWithValue(draw.canvas, array[i], width, index + i, COLOR.CURRENT);
        await sleep(draw.delay);
        drawPillarWithValue(draw.canvas, array[i], width, index + i, COLOR.SORTED);
        
        i++;
    }

    return array;
}

async function quickSort(array, draw) {
    await quickSortRec(array, draw, 0, array.length - 1);
}

async function quickSortRec(array, draw, left, right) {
    if(left >= right) {
        drawPillar(draw.canvas, array, left, COLOR.SORTED);
        drawPillar(draw.canvas, array, right, COLOR.SORTED);
        return;
    }

    drawPillar(draw.canvas, array, right, COLOR.CURRENT);

    let pivot = await partition(array, draw, left, right);

    await quickSortRec(array, draw, left, pivot - 1);
    await quickSortRec(array, draw, pivot + 1, right);
}

async function partition(array, draw, left, right) {
    let pivot = array[right];

    let i, j;
    for(i = left, j = right - 1;i < j;) {
        draw.setCount(prevCnt => prevCnt + 1);

        //Draw new ones
        drawPillar(draw.canvas, array, i, COLOR.GREEN);
        drawPillar(draw.canvas, array, j, COLOR.BLUE);

        await sleep(draw.delay);

        //reset pillars
        drawPillar(draw.canvas, array, i, COLOR.DEFAULT);
        drawPillar(draw.canvas, array, j, COLOR.DEFAULT);

        if(array[i] < pivot) {
            i++;
            continue;
        }
        if(array[j] > pivot) {
            j--;
            continue;
        }

        swap(array, i, j);
    }

    if(i == j && array[i] < pivot) {
        i++;
    }
    swap(array, right, i);

    drawPillar(draw.canvas, array, i, COLOR.SORTED);
    drawPillar(draw.canvas, array, right, COLOR.DEFAULT);

    return i;
}

async function heapSort(array, draw) {    
    
}