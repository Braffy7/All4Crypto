var baseUrl = "https://api.coinranking.com/v2/coins";
var proxyUrl = "https://corsproxy.io/?";
var apiKey = "coinranking7f186a64cb9582061ee9f9cc76f5cd9cf26064a0cf336549";
var urlNBP = "http://api.nbp.pl/api/exchangerates/rates/A/USD/"


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

    coinsData.forEach((coin) => {
    cryptoCoin += `<tr>`;
    cryptoCoin += `<td> ${coin.name} </td>`;
    cryptoCoin += `<td> ${coin.symbol} </td>`;
    cryptoCoin += `<td> $ ${(coin.marketCap)} </td>`;
    if (coin.price < 0.95) {
        cryptoCoin += `<td> $ ${parseFloat(coin.price).toFixed(8)} </td>`;
        cryptoCoin += `<td> PLN ${(parseFloat(coin.price)*parseFloat(valueUSD)).toFixed(8)} </td>`;
    } else {
        cryptoCoin += `<td> $ ${parseFloat(coin.price).toFixed(2)} </td>`;
        cryptoCoin += `<td> PLN ${(parseFloat(coin.price)*parseFloat(valueUSD)).toFixed(2)} </td>`;
    };
        cryptoCoin += `<td><form><input name="inputAmount" type="number" step="0.0000000001"><button type="submit">Add</button></form></td>`
    });

    document.getElementById("data").innerHTML = cryptoCoin;
    
};

function cryptoAmount() {
    const table = document.querySelector('.list__table');
    console.log(table);

    table.addEventListener('submit', (event) => {
        event.preventDefault();
        item = event.target.inputAmount;
        console.log(item.value);
        
});
};
