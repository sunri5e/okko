// ==UserScript==
// @name         Blum Autoclicker
// @version      1.2
// @namespace    Violentmonkey Scripts
// @author       mudachyo
// @match        https://telegram.blum.codes/*
// @grant        none
// @icon         https://cdn.prod.website-files.com/65b6a1a4a0e2af577bccce96/65ba99c1616e21b24009b86c_blum-256.png
// @downloadURL  https://github.com/mudachyo/Blum/raw/main/blum-autoclicker.user.js
// @updateURL    https://github.com/mudachyo/Blum/raw/main/blum-autoclicker.user.js
// @homepage     https://github.com/mudachyo/Blum
// ==/UserScript==

import React, { useState } from "react";
import "./App.css";

const cities = [
  { name: "Вся Україна", value: "" },
  { name: "Київ", value: "Київ" },
  { name: "Львів", value: "Львів" },
  { name: "Луцьк", value: "Луцьк" },
  { name: "Івано-Франківськ", value: "Івано-Франківськ" },
  { name: "Рівне", value: "Рівне" },
  { name: "Тернопіль", value: "Тернопіль" },
];

const gasTypeList = [
  { name: "Всі типи", value: "" },
  { name: "PULLS 95", value: "PULLS 95" },
  { name: "А-95", value: "А-95" },
  { name: "ДП", value: "ДП" },
  { name: "PULLS Diesel", value: "PULLS Diesel" },
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

  const [result, setResult] = useState("");
  const [city, setCity] = useState("");
  const [gasType, setGasType] = useState("");

  const getResp = async (city, gas) => {
    const response = await fetch(
      "https://www.okko.ua/api/uk/type/gas_stations?"
    );
    const data = await response.json();
    const regex = new RegExp(gas);

    const filter = data.collection
      .filter((e) => e.attributes.Naselenyy_punkt === city)
      .filter((e) => e.attributes.notification.match(regex));

    if (city) {
      setResult(filter);
    } else {
      setResult(data.collection);
    }
  };

  const cutter = (arr) => {
    const reg1 = /З ПАЛИВНОЮ КАРТКОЮ І ТАЛОНАМИ ДОСТУПНО:/i;
    const copy = JSON.parse(JSON.stringify(arr));
    const cutRes = arr.map((e) =>
      e.attributes.notification.slice(0, e.attributes.notification.search(reg1))
    );

    cutRes.forEach((e, i) => {
      copy[i].attributes.notification = e;
    });

    return copy;
  };

  const getAval = (res) => {
    const reg1 = /ЗА ГОТІВКУ І БАНКІВСЬКІ КАРТКИ ДОСТУПНО:\*:/i;
    const reg2 = new RegExp(gasType);
    const matchedSites = cutter(res)
      .filter((e) => e.attributes.notification.match(reg1))
      .filter((e) => e.attributes.notification.match(reg2));

    setResult(matchedSites);
  };

  const handleCityChange = (e) => {
    const c = e.target.value;
    setCity(c);
    getResp(c, gasType);
  };

  const handleGasTypeChange = (e) => {
    const gas = e.target.value;
    setGasType(gas);
    getResp(city, gas);
  };

  return (
    <div className="App container mx-auto px-8 pt-10 pb-20">
      <h1 className="text-2xl font-bold text-center mb-8">OKKO фільтр</h1>
      {/* <button type='button' onClick={() => getResp('')}>Get All AZS</button> */}
      {/* <button type='button' onClick={() => getAval(result)}>Get AVAL</button> */}
      <div className="w-full max-w-lg mx-auto">
        <p className="md:flex md:items-center mb-6">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 md:w-1/4"
            htmlFor="city"
          >
            Обери місто
          </label>
          <div className="relative md:w-3/4">
            <select
              name="city"
              id="city"
              value={city}
              onChange={handleCityChange}
              className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            >
              {cities.map((e, i) => (
                <option key={i} value={e.value}>
                  {e.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </p>
        <div className="mb-6">
          <p className="md:flex md:items-center">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 md:w-1/4"
              htmlFor="gasType"
            >
              Обери паливо
            </label>
            <div className="md:w-3/4">
              <div className="relative">
                <select
                  name="gasType"
                  id="gasType"
                  value={gasType}
                  onChange={handleGasTypeChange}
                  className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                >
                  {gasTypeList.map((e, i) => (
                    <option key={i} value={e.value}>
                      {e.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
          </p>
          <div className="md:text-right">
            <small>
              <i>буде показанно всі АЗС де є колонки з обраним типом палива</i>
            </small>
          </div>
        </div>
        <p className="text-right">
          <button
            className="px-4 py-2 font-semibold text-sm bg-cyan-500 text-white rounded-full shadow-sm"
            type="button"
            onClick={() => getAval([...result])}
          >
            Показати де обране паливо доступне з Fishka
          </button>
        </p>
      </div>
      {result && result.length ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-16">
          {result.map((e, i) => (
            <li
              key={i}
              className="bg-white border-2 border-green-500/100 p-4 rounded-lg shadow-xl text-center"
            >
              <p>
                {e.attributes.Naselenyy_punkt} - {e.attributes.Adresa}
              </p>
              <br />
              <div
                dangerouslySetInnerHTML={{ __html: e.attributes.notification }}
              />
            </li>
          ))}
        </ul>
      ) : (
        <div className="w-full max-w-lg mx-auto mt-16">
          {!city && !gasType ? (
            <div className="text-center">
              <p className="mb-6 text-gray-500">
                {`Для показу результатів введіть спершу свій запит`}
              </p>
              <img
                src="https://i.gifer.com/1xZ.gif"
                alt="John Travolta confused"
                className="object-cover w-full rounded-lg"
              />
            </div>
          ) : (
            <div className="text-center">
              <p className="mb-6 text-gray-500">
                {`На даний момент паливо марки ${gasType} відсутнє у вільному доступі у місті ${city} `}
              </p>
              <img
                src="https://i.gifer.com/5LSi.gif"
                alt="John Travolta confused"
                className="object-cover w-full rounded-lg"
              />
            </div>
          )}
        </div>
      )}

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
