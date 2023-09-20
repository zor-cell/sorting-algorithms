//import { comparisonHook } from "../hooks";

function getRandomArray(length) {
  let temp = new Array(length);
  for(let i = 0;i < temp.length;i++) {
    temp[i] = Math.random() * MAX_NUMBER;
  }

  return temp;
}

function Canvas(props) {
  const [comparisons, setComparisons] = React.useState(0);

  React.useEffect(() => {
    console.log(props.algoMap.get(props.algoIndex))

    let canvas = document.getElementById(`canvas-${props.algoIndex}`);

      for(let i = 0;i < props.array.length;i++) {
        drawPillar(canvas, props.array, i, COLOR.NORMAL);
      }

      props.algoMap.get(props.algoIndex).func(props.array, canvas, setComparisons, 1);
  }, []);

  return (
    <div className="flex-container" key={props.algoIndex}>
      <h3>{props.algoMap.get(props.algoIndex).name}</h3>
      <p id={`canvas-info-${props.algoIndex}`}>{comparisons} Comparisons</p>
      <canvas id={`canvas-${props.algoIndex}`}></canvas>
    </div>
  )
}

function App() {
    const [dataAmount, setDataAmount] = React.useState(10); //input amount of items
    const [delay, setDelay] = React.useState(1000);
    const [data, setData] = React.useState(getRandomArray(dataAmount));
    const [options, setOptions] = React.useState([]); //input algorithms

    const algoMap = new Map([
      [0, {name: 'Bubble Sort', func: bubbleSort}],
      [1, {name: 'Insertion Sort', func: insertionSort}],
      [2, {name: 'Selection Sort', func: selectionSort}]
    ]);

    function onDataAmountChange(event) {
      const num = Number(event.target.value);

      setDataAmount(num);
      setData(getRandomArray(num));
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

    function showSorting(array, algoIndex) {
      /* let canvas = document.getElementById(`canvas-${algoIndex}`);

      for(let i = 0;i < array.length;i++) {
        drawPillar(canvas, array, i, COLOR.NORMAL);
      }

      algoMap.get(algoIndex).func(array, canvas, setComparisons, delay); */
    }
 
    function handleSubmit(event) {
      event.preventDefault();

      for(let algoIndex of options) {
        showSorting(data.slice(), algoIndex);
      }
    }

    return (
      <main>
        <h1>Sorting Algorithms</h1>
        <section className="main-container">
          <h2>Settings</h2>

          <form onSubmit={handleSubmit}>
            <div className="flex-container">
              <h3># of items</h3>
              <input name="runs" type="number" value={dataAmount} onChange={onDataAmountChange}/>

              <h3>Delay in ms</h3>
              <input type="number" value={delay} onChange={onDelayChange}></input>
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
        

        <section className="main-container" id="canvas-container">
          {
            options.map((algoIndex, key) => {
              return <Canvas algoIndex={algoIndex} algoMap={algoMap} array={data.slice()} key={key}></Canvas>
            })
          }
          {/* {
            options.map((algoIndex, key) => {
              const canvas = document.getElementById(`canvas-${algoIndex}`);

              console.log(canvas)
              for(let i = 0;i < data.length;i++) {
                drawPillar(canvas, data, i, COLOR.NORMAL);
              }
            })
          } */}
        </section>

        {/* <section className="main-container">
          <div id="result">No results...</div>

          <table id="results-table">
            <caption>Results of {items} runs</caption>
            <thead>
              <tr>
                <th onClick={() => onSortChange("N")}>Name</th>
                <th onClick={() => onSortChange("A")}>A</th>
                <th onClick={() => onSortChange("B")}>B</th>
                <th onClick={() => onSortChange("T")}>Total</th>
              </tr>
          </thead>
          <tbody>
            {
              scores.map((val, key) => {
              return (
                <tr key={key}>
                  <td>{val.name}</td>
                  <td>{val.score.a.toFixed(6)}</td>
                  <td>{val.score.b.toFixed(6)}</td>
                  <td>{val.score.total.toFixed(6)}</td>
                </tr>
              )
              })
            }
          </tbody>
        </table>
      </section> */}
      </main>
    );
}

ReactDOM.render(
    <App/>,
    document.getElementById('container')
);