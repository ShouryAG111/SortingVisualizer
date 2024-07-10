document.getElementById('generateArray').addEventListener('click', generateArray);
document.getElementById('startSort').addEventListener('click', startSort);

let array = [];
let arraySize = document.getElementById('arraySize').value;
let speed = 100 - document.getElementById('speed').value;

document.getElementById('speed').addEventListener('input', function() {
    speed = 100 - this.value;
});

function generateArray() {
    arraySize = document.getElementById('arraySize').value;
    array = [];
    for (let i = 0; i < arraySize; i++) {
        array.push(Math.floor(Math.random() * 100) + 1);
    }
    displayArray();
}

function displayArray() {
    const arrayContainer = document.getElementById('arrayContainer');
    arrayContainer.innerHTML = '';
    arrayContainer.style.setProperty('--array-size', array.length);
    for (let i = 0; i < array.length; i++) {
        const bar = document.createElement('div');
        bar.style.height = `${array[i]}%`;
        bar.classList.add('bar');
        arrayContainer.appendChild(bar);
    }
}

async function startSort() {
    const algorithm = document.getElementById('algorithm').value;
    switch (algorithm) {
        case 'bubble':
            await bubbleSort(array);
            break;
        case 'quick':
            await quickSort(array, 0, array.length - 1);
            break;
        case 'merge':
            await mergeSort(array, 0, array.length - 1);
            break;
    }
    markSortedArray();
}

async function bubbleSort(arr) {
    const len = arr.length;
    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len - i - 1; j++) {
            highlightBars(j, j + 1);
            if (arr[j] > arr[j + 1]) {
                await swap(arr, j, j + 1);
                displayArray();
                await sleep(speed);
            }
            unhighlightBars(j, j + 1);
        }
    }
}

async function quickSort(arr, left, right) {
    if (left < right) {
        let pivotIndex = await partition(arr, left, right);
        await quickSort(arr, left, pivotIndex - 1);
        await quickSort(arr, pivotIndex + 1, right);
    }
}

async function partition(arr, left, right) {
    let pivot = arr[right];
    let i = left - 1;
    for (let j = left; j < right; j++) {
        highlightBars(j, right);
        if (arr[j] < pivot) {
            i++;
            await swap(arr, i, j);
            displayArray();
            await sleep(speed);
        }
        unhighlightBars(j, right);
    }
    await swap(arr, i + 1, right);
    displayArray();
    await sleep(speed);
    return i + 1;
}

async function mergeSort(arr, left, right) {
    if (left < right) {
        let mid = Math.floor((left + right) / 2);
        await mergeSort(arr, left, mid);
        await mergeSort(arr, mid + 1, right);
        await merge(arr, left, mid, right);
    }
}

async function merge(arr, left, mid, right) {
    let n1 = mid - left + 1;
    let n2 = right - mid;
    let L = new Array(n1);
    let R = new Array(n2);
    
    for (let i = 0; i < n1; i++) L[i] = arr[left + i];
    for (let i = 0; i < n2; i++) R[i] = arr[mid + 1 + i];

    let i = 0, j = 0, k = left;
    while (i < n1 && j < n2) {
        highlightBars(left + i, mid + 1 + j);
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        k++;
        displayArray();
        await sleep(speed);
        unhighlightBars(left + i - 1, mid + 1 + j - 1);
    }

    while (i < n1) {
        arr[k] = L[i];
        i++;
        k++;
        displayArray();
        await sleep(speed);
    }

    while (j < n2) {
        arr[k] = R[j];
        j++;
        k++;
        displayArray();
        await sleep(speed);
    }
}

async function swap(arr, i, j) {
    [arr[i], arr[j]] = [arr[j], arr[i]];
    displayArray();
    await sleep(speed);
}

function highlightBars(i, j) {
    const bars = document.getElementsByClassName('bar');
    if (bars[i]) bars[i].classList.add('active');
    if (bars[j]) bars[j].classList.add('active');
}

function unhighlightBars(i, j) {
    const bars = document.getElementsByClassName('bar');
    if (bars[i]) bars[i].classList.remove('active');
    if (bars[j]) bars[j].classList.remove('active');
}

function markSortedArray() {
    const bars = document.getElementsByClassName('bar');
    for (let i = 0; i < bars.length; i++) {
        bars[i].classList.add('sorted');
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Generate initial array on page load
generateArray();
