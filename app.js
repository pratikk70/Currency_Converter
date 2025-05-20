const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate currency dropdowns
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  if (img) img.src = newSrc;
};

const updateExchangeRate = async () => {
  const amountInput = document.querySelector(".amount input");
  let amtVal = amountInput.value;

  if (amtVal === "" || isNaN(amtVal) || amtVal <= 0) {
    amtVal = 1;
    amountInput.value = "1";
  }

  const fromCode = fromCurr.value;
  const toCode = toCurr.value;

  const URL = `https://api.exchangerate.host/convert?from=${fromCode}&to=${toCode}&amount=${amtVal}&access_key=afe18b554656f25b0a75cfbb49bf6915`;


  try {
    const response = await fetch(URL);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.result) {
      throw new Error("Invalid conversion result");
    }

    const finalAmount = Number(data.result).toFixed(2);
    msg.innerText = `${amtVal} ${fromCode} = ${finalAmount} ${toCode}`;
  } catch (error) {
    msg.innerText = "Failed to fetch exchange rate.";
    console.error("Error fetching exchange rate:", error);
  }
};

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});
