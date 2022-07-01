var baseUrl = "https://api.coinranking.com/v2/coins";
var proxyUrl = "https://corsproxy.io/?";
var apiKey = "coinranking7f186a64cb9582061ee9f9cc76f5cd9cf26064a0cf336549";
var urlNBP = "http://api.nbp.pl/api/exchangerates/rates/A/USD/";

var usdToPln = "" // value to use in cryptoAmount()

// API for cryptocurrencies & function creating Name / Symbol / Market Cap / Value $

Promise.all([
    fetch(`${proxyUrl}${baseUrl}`, { 
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        'X-My-Custom-Header': `${apiKey}`,
        'Access-Control-Allow-Origin': "*"
        }}),
    fetch(`${proxyUrl}${urlNBP}`, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': "*"
        }})
    ]).then((responses) => {
        return Promise.all(responses.map(function (response) {
            return response.json();
        }));
    }).then((data) => {
        Promise.all([
            displayList(data), cryptoAmount()]);
    }).catch((error) => {
        console.log(error)
    });


function displayList(data) {
    let coinsData = data[0].data.coins;
    if (coinsData.length > 0) {
        var cryptoCoin = "";
    }

    let valueUSD = data[1].rates[0].mid;
    usdToPln = valueUSD;

    coinsData.forEach((coin) => {
    cryptoCoin += `<tr>`;
    cryptoCoin += `<td class='name'> ${coin.name} </td>`;
    cryptoCoin += `<td class='symbol'> ${coin.symbol} </td>`;
    cryptoCoin += `<td class='marketCap'> $ ${(coin.marketCap)} </td>`;
    cryptoCoin += `<td class='price'> $ ${parseFloat(coin.price)} </td>`;
    if (coin.price < 0.95) {
        cryptoCoin += `<td class='pricePLN'> PLN ${(parseFloat(coin.price)*parseFloat(valueUSD)).toFixed(8)} </td>`;
    } else {
        cryptoCoin += `<td class='pricePLN'> PLN ${(parseFloat(coin.price)*parseFloat(valueUSD)).toFixed(2)} </td>`;
    };
        cryptoCoin += `<td><form><input name="inputAmount" type="number" step="0.0000000001" required><button type="submit">Add</button></form></td>`
    });

    document.getElementById("data").innerHTML = cryptoCoin;  
};

// Adding Cryptocurrencies to wallet

function cryptoAmount() {
    const table = document.querySelector('.list__table');

    table.addEventListener('submit', (event) => {
        event.preventDefault();

        const walletCryptos = document.querySelector('#usersCrypto');
        const walletAmount = event.target.inputAmount;
        const coinRow = walletAmount.parentElement.parentElement.parentElement;
        const walletName = coinRow.querySelector('.name').textContent;
        const walletPrice = coinRow.querySelector('.price').textContent.match(/\d+(\.\d+)?/)[0];
        const walletValue = walletAmount.value*coinRow.querySelector('.price').textContent.match(/\d+(\.\d+)?/)[0];
        
        const newTr = document.createElement("tr");
        const nameTh = document.createElement("th");
        const priceTh = document.createElement("th");
        const amountTh = document.createElement("th");
        const valueTh = document.createElement("th");

        nameTh.innerText = walletName;
        if (walletPrice < 0.95) {
            priceTh.innerText = parseFloat(walletPrice).toFixed(8);
        } else {
            priceTh.innerText = parseFloat(walletPrice).toFixed(2);  
        };
        amountTh.innerText = walletAmount.value;
        if (walletValue < 0.95) {
            valueTh.innerText = parseFloat(walletValue).toFixed(8);
        } else {
            valueTh.innerText = parseFloat(walletValue).toFixed(2);  
        };

        walletCryptos.appendChild(newTr);
        walletCryptos.appendChild(nameTh);
        walletCryptos.appendChild(priceTh);
        walletCryptos.appendChild(amountTh);
        walletCryptos.appendChild(valueTh);

        walletAmount.value = "";
});
};
