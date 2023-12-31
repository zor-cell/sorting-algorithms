const MAX_HEIGHT = 1000;
const MAX_CANVAS_WIDTH = getMaxWidth();
const COLOR = {
    DEFAULT: 'rgb(200, 200, 200)',
    SORTED: 'rgb(100, 100, 100)',
    CURRENT: 'rgb(255, 0, 0)',
    BLUE: 'rgb(0, 0, 255)',
    GREEN: 'rgb(0, 255, 0)',
}

function getMaxWidth() {
    const width = window.innerWidth;
    const padding = 75;

    return Math.min(Math.floor(width / 2) - padding, 600);
}

function getRandomArray(length, sortedPercent) {
  let temp = new Array(length);
  for(let i = 0;i < temp.length;i++) {
    temp[i] = Math.random() * MAX_HEIGHT;
  }
  /* temp.sort((a, b) => {
    return a - b;
  }); */

  //random shuffles
/*   let shuffleCount = Math.floor((1 - sortedPercent / 100) * temp.length);
  for(let i = 0;i < shuffleCount;i++) {
    let index1 = Math.floor(Math.random() * temp.length);
    let index2 = Math.floor(Math.random() * temp.length);

    swap(temp, index1, index2);
  } */

  return temp;
}

function Canvas(props) {
  const [count, setCount] = React.useState(0);

  const start = props.start;
  const dataAmount = props.dataAmount;
  const sortedPercent = props.sortedPercent;
  const delay = props.delay;
  const canvasId = props.canvasId;
  const array = props.array;
  const algorithm = props.algoMap.get(props.canvasId);

  async function sortArray() {
    const canvas = document.getElementById(`canvas-${canvasId}`);

    //object for drawing purposes
    const draw = {
      canvas: canvas,
      delay: delay,
      setCount: setCount
    };

    await algorithm.func(array, draw);
    await afterSort(canvas);
  }

  async function afterSort(canvas) {
    for(let i = 0;i < array.length;i++) {
      if(i > 0) drawPillar(canvas, array, i - 1, COLOR.SORTED);
      drawPillar(canvas, array, i, COLOR.GREEN);

      await sleep(Math.floor(1));
    }
    
    drawPillar(canvas, array, array.length - 1, COLOR.SORTED);
  }

  function showArray() {
    const canvas = document.getElementById(`canvas-${canvasId}`);

    for(let i = 0;i < array.length;i++) {
      drawPillar(canvas, array, i, COLOR.DEFAULT);
    }
  }

  function setCanvasWidth() {
    const canvas = document.getElementById(`canvas-${canvasId}`);
    const pillarWidth = Math.floor(MAX_CANVAS_WIDTH / array.length);
    const canvasWidth = pillarWidth * array.length;

    //show new width in html
    canvas.style.width = `${canvasWidth}px`;
    //show new width in 
    canvas.width = canvasWidth;
  }

  //draw array on first render
  React.useEffect(() => {
    setCanvasWidth();
    showArray();
  }, [dataAmount, sortedPercent]);

  //start algorithm if start is true
  React.useEffect(() => {
    if(start != true) return;

    showArray();
    sortArray();
  }, [start]);

  return (
    <div>
      <h3>{algorithm.name}</h3>
      <p id={`canvas-info-${canvasId}`}>{count} Comparisons</p>
      <canvas id={`canvas-${canvasId}`}></canvas>
    </div>
  )
}

function App() {
    const [start, setStart] = React.useState(false); //true when sorting should start
    const [sortedPercent, setSortedPercent] = React.useState(0); //percentage of already sorted items in array
    const [dataAmount, setDataAmount] = React.useState(10); //data amount for data array
    const [delay, setDelay] = React.useState(1000); //delay between visualization steps
    const [options, setOptions] = React.useState([]); //algorithms in select
    const [data, setData] = React.useState(getRandomArray(dataAmount, sortedPercent)); //random data array to be sorted

    const algoMap = new Map([
      [0, {name: 'Bubble Sort', func: bubbleSort}],
      [1, {name: 'Selection Sort', func: selectionSort}],
      [2, {name: 'Insertion Sort', func: insertionSort}],
      [3, {name: 'Merge Sort', func: mergeSort}],
      [4, {name: 'Quick Sort', func: quickSort}],
      [5, {name: 'Heap Sort', func: heapSort}],
    ]);

    function onSortedPercentChange(event) {
      const num = Number(event.target.value);

      setSortedPercent(num);
      setData(getRandomArray(data.length, num));
    }

    function onDataAmountChange(event) {
      const num = Number(event.target.value);

      setDataAmount(num);
      setData(getRandomArray(num, sortedPercent));
    }

    function onDelayChange(event) {
      const num = Number(event.target.value);
      setDelay(num);
    }

    //set selected algorithms
    function onOptionsChange(event) {
      let selected = [];
      for(let option of event.target.options) {
        if(option.selected) selected.push(parseInt(option.value));
      }

      setOptions(selected);
    }
    
    //select every option of algorithms
    function onSelectAll(event) {
      let s = document.getElementsByName("algorithms")[0];

      let selected = [];
      for(let option of s.options) {
        option.selected = true;
        selected.push(parseInt(option.value));
      }

      setOptions(selected);
    }
 
    function handleSubmit(event) {
      event.preventDefault();

      setStart(true);
    }

    return (
      <main>
        <h1>Sorting Algorithms</h1>
        <section className="main-container">
          <h2>Settings</h2>

          <form onSubmit={handleSubmit}>
            <div className="flex-container">
              <h3>% of sorted items</h3>
              <p>{sortedPercent}</p>
              <input type="range" value={sortedPercent} min="0" max="100" onChange={onSortedPercentChange}/>
            </div>

            <div className="flex-container">
              <h3># of items</h3>
              <p>{dataAmount}</p>
              <input type="range" value={dataAmount} min="1" max={MAX_CANVAS_WIDTH} onChange={onDataAmountChange}/>
            </div>

            <div className="flex-container">
              <h3>Delay in ms</h3>
              <p>{delay}</p>
              <input type="range" value={delay} min="0" max="2000" onChange={onDelayChange}></input>
            </div>
            
            <div className="flex-container">
              <h3>Algorithms</h3>
              <select name="algorithms" multiple onChange={onOptionsChange}>
                  {
                    [...algoMap].map(algoPair => {
                      const algoIndex = algoPair[0];
                      const algorithm = algoPair[1];

                      return (
                        <option value={algoIndex} key={algoIndex}>{algorithm.name}</option>
                      )
                    })
                  }
              </select>
              <input className="button" type="button" onClick={onSelectAll} value="Select All"></input>
            </div>
                  
            <input className="button" type="submit" value="Start"></input>
          </form>
        </section>

        <section className="main-container">
          <h2>Visualization</h2>
          <div id="canvas-container">
          {
            //show options if possible, otherwise display text
            (options.length > 0) ? options.map((canvasId, key) => {
              return <Canvas start={start} delay={delay} dataAmount={dataAmount} sortedPercent={sortedPercent}
                      canvasId={canvasId} array={data.slice()} algoMap={algoMap}key={key}></Canvas>
            }) : <p id="canvas-container-info">No algorithm selected</p>
          }
          </div>
        </section>

        <section className="main-container">
          <h2>Speed comparison</h2>
          <div>
          <table>
            <caption>Table caption</caption>
            <thead>
              <tr>
                <th>A</th>
                <th>B</th>
                <th>C</th>
                <th>Total</th>
              </tr>
          </thead>
          <tbody>
            <tr>
              <td>value1</td>
              <td>value2</td>
              <td>value3</td>
              <td>value4</td>
            </tr>
            <tr>
              <td>value1</td>
              <td>value2</td>
              <td>value3</td>
              <td>value4</td>
            </tr>
            <tr>
              <td>value1</td>
              <td>value2</td>
              <td>value3</td>
              <td>value4</td>
            </tr>
            <tr>
              <td>value1</td>
              <td>value2</td>
              <td>value3</td>
              <td>value4</td>
            </tr>
          </tbody>
        </table>
          </div>
        </section>
      </main>
    );
}

ReactDOM.render(
    <App/>,
    document.getElementById('container')
);