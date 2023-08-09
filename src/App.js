// `https://api.frankfurter.app/latest?amount=100&from=EUR&to=USD`
import { useState, useEffect } from "react";
import './App.css'

export default function App() {
  const [inputValue, setInputValue] = useState(1);
  const [currFrom, setCurrFrom] = useState("USD");
  const [currTo, setCurrTo] = useState("INR");
  const [convertedCurr, setConvertedCurr] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchCurrency() {
        if (inputValue <= 0) return;
        setIsLoading(true);
        try {
          const res = await fetch(
            `https://api.frankfurter.app/latest?amount=${inputValue}&from=${currFrom}&to=${currTo}`,
            { signal: controller.signal }
          );
          const data = await res.json();
          setConvertedCurr(data.rates[currTo]);
          setIsLoading(false);
        } catch (err) {
          console.log(err.message);
        }
      }
      if (currFrom === currTo) return setConvertedCurr(inputValue);
      fetchCurrency();
      return function () {
        controller.abort();
      };
    },
    [inputValue, currFrom, currTo]
  );
  return (
    <main>
      {isLoading ? (
        <p className="loading">⏰ Loading...</p>
      ) : (
        <div className="input-container">
          <h2>Currency Converter</h2>
          <div className="input-col">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(Number(e.target.value))}
              disabled={isLoading}
            />
            <select
              value={currFrom}
              onChange={(e) => setCurrFrom(e.target.value)}
              disabled={isLoading}
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="CAD">CAD</option>
              <option value="INR">INR</option>
            </select>
            <select
              value={currTo}
              onChange={(e) => setCurrTo(e.target.value)}
              disabled={isLoading}
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="CAD">CAD</option>
              <option value="INR">INR</option>
            </select>
          </div>
          <p>
            {inputValue} {currFrom} = {convertedCurr} {currTo}
          </p>
        </div>
      )}
    </main>
  );
}
