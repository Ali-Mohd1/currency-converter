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
      <div className="input-container">
        <h2 className="text-5xl font-bold text-white">Currency Converter</h2>
        <div className="mt-4 w-full flex border border-white border-opacity-30 rounded-md bg-white backdrop-blur-3xl bg-opacity-20">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(Number(e.target.value))}
            disabled={isLoading}
            className="focus:outline-none flex flex-1 py-3 px-4  text-white h-14 bg-transparent text-lg"
          />
          <select
            value={currFrom}
            onChange={(e) => setCurrFrom(e.target.value)}
            disabled={isLoading}
            className="focus:outline-none flex p-3 h-14 text-white bg-transparent text-lg"
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
            className="focus:outline-none flex p-3 h-14 text-lg bg-transparent text-white"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="CAD">CAD</option>
            <option value="INR">INR</option>
          </select>
        </div>
        <div className="bg-white backdrop-blur-3xl bg-opacity-20 rounded-md mt-5">
          <p className="text-3xl font-semibold text-white border border-white border-opacity-30 rounded-md  py-10 px-10 text-center">
            {inputValue} <span>{currFrom}</span> = {convertedCurr} <span>{currTo}</span>
          </p>
        </div>
      </div>

    </main>
  );
}
