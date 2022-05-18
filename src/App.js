import React, { useRef, useState } from "react";
import "./App.css";

function App() {
  const [riskInUSD, setRiskInUSD] = useState("");
  const [totals, setTotals] = useState({});
  const depo_Ref = useRef();
  const risk_Ref = useRef();
  const fibo0_Ref = useRef();
  const fibo100_Ref = useRef();
  const stop_loss_Ref = useRef();

  const COEF = 1.1;
  const COEF_STEP = 0.1;
  const COEF_MAX = 2;
  const START_ORDER = 11;
  const ORDER_STEP = 1;

  // const fiboLevels = [0.236, 0.382, 0.5, 0.618, 0.786]
  const fiboLevels = [0.382, 0.5, 0.618, 0.786];

  const handleRiskChange = () => {
    const depo_val = depo_Ref.current.value;
    const risk_val = risk_Ref.current.value;

    setRiskInUSD((depo_val * risk_val) / 100);
  };

  const getFiboValues = () => {
    const fibo0_val = fibo0_Ref.current.value;
    const fibo100_val = fibo100_Ref.current.value;
    const spread = fibo0_val - fibo100_val;

    return fiboLevels.map((e) => Number((fibo0_val - spread * e).toFixed(4)));
  };

  const getTotals = (levels) => {
    const stop_loss_val = stop_loss_Ref.current.value;
    const usdUsedLimit = depo_Ref.current.value / 10;
    let usdOnLevels;
    let totalInOrder;
    let quantity;
    let stopLoss = 0;

    for (let p = 0; ; p++) {
      let firstOrder = START_ORDER + ORDER_STEP * p;

      if (stopLoss > stop_loss_val || totalInOrder > usdUsedLimit) {
        break;
      } else {
        for (let c = 0; ; c++) {
          let stepCoef = Number((COEF + COEF_STEP * c).toFixed(1));

          if (stepCoef > COEF_MAX) break;

          usdOnLevels = [];
          for (let i = 0; i < levels.length; i++) {
            if (i === 0) {
              usdOnLevels.push(firstOrder);
            } else {
              usdOnLevels.push(
                Number((usdOnLevels[i - 1] * stepCoef).toFixed(2))
              );
            }
          }

          totalInOrder = Number(
            usdOnLevels
              .reduce((partial_sum, a) => partial_sum + a, 0)
              .toFixed(7)
          );
          quantity = Number(
            levels
              .map((e, i) => usdOnLevels[i] / e)
              .reduce((partial_sum, a) => partial_sum + a, 0)
              .toFixed(7)
          );
          stopLoss = Number(((totalInOrder - riskInUSD) / quantity).toFixed(4));
        }
      }
    }

    return {
      totalInOrder,
      quantity,
      stopLoss,
      usdOnLevels,
    };
  };

  const calculate = (e) => {
    e.preventDefault();

    const levels = getFiboValues();
    setTotals(getTotals(levels));

    console.log(totals.totalInOrder);
    console.log(totals.quantity);
    console.log(totals.stopLoss);
    console.log(totals.usdOnLevels);
  };

  return (
    <div className="App container mx-auto px-8 pt-10 pb-20">
      <header className="App-header">
        <form onSubmit={calculate}>
          <table>
            <tbody>
              <tr>
                <td>Deposit</td>
                <td>
                  <input ref={depo_Ref} type="text" id="deposit" />
                </td>
                <td></td>
              </tr>
              <tr>
                <td>Risk, %</td>
                <td>
                  <input
                    ref={risk_Ref}
                    type="text"
                    id="risk"
                    onChange={handleRiskChange}
                  />
                </td>
                <td>{riskInUSD && `${riskInUSD}$`}</td>
              </tr>
              <tr>
                <td>Fibo 0%</td>
                <td>
                  <input ref={fibo0_Ref} type="text" id="fibo0" />
                </td>
                <td></td>
              </tr>
              <tr>
                <td>Fibo 100%</td>
                <td>
                  <input ref={fibo100_Ref} type="text" id="fibo100" />
                </td>
                <td></td>
              </tr>
              <tr>
                <td>SL</td>
                <td>
                  <input ref={stop_loss_Ref} type="text" id="stop_loss" />
                </td>
                <td></td>
              </tr>
              <tr>
                <td colSpan={3}>
                  <button>Calculate</button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
        <h3>Result:</h3>
        <table>
          <tbody>
            {totals.usdOnLevels &&
              fiboLevels.map((e, i) => (
                <tr key={i}>
                  <td>L: {(e * 100).toFixed(1)}</td>
                  <td>&nbsp;&nbsp;{totals.usdOnLevels[i]}$</td>
                  <td>
                    &nbsp;&nbsp;
                    {(
                      (totals.usdOnLevels[i] * 100) /
                      totals.totalInOrder
                    ).toFixed(1)}
                    %
                  </td>
                </tr>
              ))}
            <tr>
              <td>Total, $</td>
              <td colSpan={2}>{totals.totalInOrder}</td>
            </tr>
          </tbody>
        </table>
      </header>
    </div>
  );
}

export default App;
