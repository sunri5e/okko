import { useRef, useState } from 'react'
import './App.css';

const cities = [
  {name: "Вся Україна", value: ""},
  {name: "Київ", value: "Київ"},
  {name: "Львів", value: "Львів"},
  {name: "Луцьк", value: "Луцьк"},
];

const gasTypeList = [
  {name: "Всі типи", value: ""},
  {name: "PULLS 95", value: "PULLS 95"},
  {name: "А-95", value: "А-95"},
  {name: "ДП", value: "ДП"},
  {name: "PULLS Diesel", value: "PULLS Diesel"},
];



function App() {
  // const [riskInUSD, setRiskInUSD] = useState('');
  // const [totals, setTotals] = useState({});
  // const depo_Ref = useRef()
  // const risk_Ref = useRef()
  // const fibo0_Ref = useRef()
  // const fibo100_Ref = useRef()
  // const stop_loss_Ref = useRef()

  // const COEF = 1.1;
  // const COEF_STEP = 0.1;
  // const COEF_MAX = 2;
  // const START_ORDER = 11;
  // const ORDER_STEP = 1;

  // // const fiboLevels = [0.236, 0.382, 0.5, 0.618, 0.786]
  // const fiboLevels = [0.382, 0.5, 0.618, 0.786]

  // const handleRiskChange = e => {
  //   const depo_val = depo_Ref.current.value;
  //   const risk_val = risk_Ref.current.value;

  //   setRiskInUSD(depo_val * risk_val / 100);
  // }

  // const getFiboValues = () => {
  //   const fibo0_val = fibo0_Ref.current.value
  //   const fibo100_val = fibo100_Ref.current.value
  //   const spread = fibo0_val - fibo100_val;

  //   return fiboLevels.map((e) => Number((fibo0_val - spread * e).toFixed(4)));
  // };

  // const getTotals = (levels) => {
  //   const stop_loss_val = stop_loss_Ref.current.value;
  //   const usdUsedLimit = depo_Ref.current.value / 10;
  //   let usdOnLevels;
  //   let totalInOrder;
  //   let quantity;
  //   let stopLoss = 0;

  //   for (let p = 0; ; p++) {
  //     let firstOrder = START_ORDER + ORDER_STEP * p;

  //     if (stopLoss > stop_loss_val || totalInOrder > usdUsedLimit) {
  //       break
  //     } else {
  //       for (let c = 0; ; c++) {
  //         let stepCoef = Number((COEF + COEF_STEP * c).toFixed(1));

  //         if (stepCoef > COEF_MAX) break;

  //         usdOnLevels = [];
  //         for (let i = 0; i < levels.length; i++) {
  //           if (i === 0) {
  //             usdOnLevels.push(firstOrder);
  //           } else {
  //             usdOnLevels.push(Number((usdOnLevels[i-1] * stepCoef).toFixed(2)));
  //           }
  //         }
          
  //         totalInOrder = Number((usdOnLevels.reduce((partial_sum, a) => partial_sum + a,0)).toFixed(7));
  //         quantity = Number((levels.map((e, i) => usdOnLevels[i] / e).reduce((partial_sum, a) => partial_sum + a,0)).toFixed(7));
  //         stopLoss = Number(((totalInOrder - riskInUSD) / quantity).toFixed(4));
  //       }
  //     }
  //   }

  //   return {
  //     totalInOrder,
  //     quantity,
  //     stopLoss,
  //     usdOnLevels,
  //   }

  // }

  // const calculate = (e) => {
  //   e.preventDefault();

  //   const levels = getFiboValues();
  //   setTotals(getTotals(levels));

  //   console.log(totals.totalInOrder);
  //   console.log(totals.quantity);
  //   console.log(totals.stopLoss);
  //   console.log(totals.usdOnLevels);
  // }


  const [result, setResult] = useState('');
  const [city, setCity] = useState('');
  const [gasType, setGasType] = useState('');


  const getResp = async (city, gas) => {
    const response = await fetch('https://www.okko.ua/api/uk/type/gas_stations?');
    const data = await response.json();
    const regex = new RegExp(gas);

    const filter = data.collection.filter(e => e.attributes.Naselenyy_punkt === city).filter((e) => e.attributes.notification.match(regex));

    if (city) {
      setResult(filter)
      console.log(filter);
    } else {
      setResult(data.collection)
      console.log(data.collection);
    }
  }

  const cutter = (arr) => {
    const reg1 = /З ПАЛИВНОЮ КАРТКОЮ І ТАЛОНАМИ ДОСТУПНО:/i;
    const copy = JSON.parse(JSON.stringify(arr));
    const cutRes = arr.map(e => e.attributes.notification.slice(0, e.attributes.notification.search(reg1)))

    cutRes.forEach((e,i) => {
      copy[i].attributes.notification = e;
    });

    return copy;
  }
  
  const getAval = (res) => {
    console.log('cutter: ', cutter(res));

    const reg1 = /ЗА ГОТІВКУ І БАНКІВСЬКІ КАРТКИ ДОСТУПНО:\*:/i;
    const reg2 = new RegExp(gasType);
    const matchedSites = cutter(res).filter((e) => e.attributes.notification.match(reg1)).filter((e) => e.attributes.notification.match(reg2));
    console.log(matchedSites);

    setResult(matchedSites);
  }

  const handleCityChange = (e) => {
    const c = e.target.value;
    setCity(c);
    getResp(c, gasType);
  }

  const handleGasTypeChange = (e) => {
    const gas = e.target.value;
    setGasType(gas);
    getResp(city, gas);
  }


  return (
    <div className="App">
      <button type='button' onClick={() => getResp('')}>Get All AZS</button>
      {/* <button type='button' onClick={() => getAval(result)}>Get AVAL</button> */}
      <br /><br /><br /><br />
      <select name="city" id="city" value={city} onChange={handleCityChange}>
        {cities.map(e => <option value={e.value} >{e.name}</option>)}
      </select>
      <select name="gasType" id="gasType" value={gasType} onChange={handleGasTypeChange}>
        {gasTypeList.map(e => <option value={e.value} >{e.name}</option>)}
      </select>
      <button type='button' onClick={() => getAval([...result])}>Доступно за карту</button>
      <br /><br /><br /><br />
      <ul>
        {result && result.map(e => <><li>
          <p>{e.attributes.Naselenyy_punkt} - {e.attributes.Adresa}</p>
          <br />
          <div dangerouslySetInnerHTML={{ __html: e.attributes.notification }} />
        </li><hr /></>)}
      </ul>
      {/* <header className="App-header">
        <form onSubmit={calculate}>
          <table>
            <tbody>
              <tr>
                <td>Deposit</td>
                <td><input ref={depo_Ref} type="text" id="deposit" /></td>
                <td></td>
              </tr>
              <tr>
                <td>Risk, %</td>
                <td><input ref={risk_Ref} type="text" id="risk" onChange={handleRiskChange} /></td>
                <td>{riskInUSD && `${riskInUSD}$`}</td>
              </tr>
              <tr>
                <td>Fibo 0%</td>
                <td><input ref={fibo0_Ref} type="text" id="fibo0" /></td>
                <td></td>
              </tr>
              <tr>
                <td>Fibo 100%</td>
                <td><input ref={fibo100_Ref} type="text" id="fibo100" /></td>
                <td></td>
              </tr>
              <tr>
                <td>SL</td>
                <td><input ref={stop_loss_Ref} type="text" id="stop_loss" /></td>
                <td></td>
              </tr>
              <tr>
                <td colSpan={3}><button>Calculate</button></td>
              </tr>
            </tbody>
          </table>
        </form>
        <h3>Result:</h3>
        <table>
          <tbody>
            {totals.usdOnLevels && fiboLevels.map((e, i) => (
              <tr>
                <td>L: {(e * 100).toFixed(1)}</td>
                <td>&nbsp;&nbsp;{totals.usdOnLevels[i]}$</td>
                <td>&nbsp;&nbsp;{(totals.usdOnLevels[i] * 100 / totals.totalInOrder).toFixed(1)}%</td>
              </tr>
            ))}
            <tr>
              <td>Total, $</td>
              <td colSpan={2}>{totals.totalInOrder}</td>
            </tr>
          </tbody>
        </table>
      </header> */}



    </div>
  );
}

export default App;
