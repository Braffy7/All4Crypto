var baseUrl = "https://api.coinranking.com/v2/coins";
var proxyUrl = "https://cors-anywhere.herokuapp.com/";
var apiKey = "coinranking7f186a64cb9582061ee9f9cc76f5cd9cf26064a0cf336549";
var urlNBP = "http://api.nbp.pl/api/exchangerates/rates/A/USD/"


// API for cryptocurrencies & function creating Name / Symbol / Market Cap / Value $

function cryptoAPI() {
    fetch(`${proxyUrl}${baseUrl}`, { 
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        'X-My-Custom-Header': `${apiKey}`,
        'Access-Control-Allow-Origin': "*"
        }
    }).then((response) => {
        if(response.ok) {
            response.json().then((json) => displayList(json) 
            );
        }
    }).catch((error) => {
        console.log(error)
    })


    function displayList(json) {
        let coinsData = json.data.coins;

        if (coinsData.length > 0) {
            var cryptoCoin = "";
        }

        coinsData.forEach((coin) => {
        cryptoCoin += `<tr class = 'row'>`;
        cryptoCoin += `<td> ${coin.name} </td>`;
        cryptoCoin += `<td> ${coin.symbol} </td>`;
        cryptoCoin += `<td> $ ${(coin.marketCap)} </td>`;
        
        if (coin.price < 0.95) {
            cryptoCoin += `<td class = 'price'> $ ${parseFloat(coin.price).toFixed(8)} </td>`;
        } else {
            cryptoCoin += `<td class = 'price'> $ ${parseFloat(coin.price).toFixed(2)} </td>`;
        }});
        document.getElementById("data").innerHTML = cryptoCoin;
        console.log(json);
    }};

// API For NBP & function creating Value PLN / Amount

function nbpAPI() {
    fetch(`${proxyUrl}${urlNBP}`, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': "*"
        }
    }).then((response) => {
        if(response.ok) {
            response.json().then((json) => calcPLN(json)
            );
        }
    }).catch((error) => {
        console.log(error)
    });

    function calcPLN(json) {
        console.log(json);
        let valuePLN = parseFloat(json.rates[0].mid);
        console.log(valuePLN)

        const listRow = document.querySelectorAll(".row");
        const arrayRow = Array.from(listRow)
        console.log(arrayRow);
        

        let listPrice = document.querySelectorAll(".price");
        let arrayPrice = Array.from(listPrice);
        console.log(arrayPrice);
        console.log(listPrice);

        for(let i=0; i<arrayPrice.length; i++) {
            console.log(i);
            let calculatedPLN = 'PLN ' + (parseFloat(arrayPrice[i]) * valuePLN);
            let th = document.createElement('th');
            arrayRow[i].appendChild(th).innerHTML = calculatedPLN;
            console.log(calculatedPLN);
        };
    }};

// Sequence of functions

new Promise((resolve) => {
    setTimeout(() => {
        resolve(cryptoAPI())
    }, 0 );
}).then(nbpAPI())
