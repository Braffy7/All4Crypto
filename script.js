var baseUrl = "https://api.coinranking.com/v2/coins";
var proxyUrl = "https://cors-anywhere.herokuapp.com/";
var apiKey = "coinranking7f186a64cb9582061ee9f9cc76f5cd9cf26064a0cf336549";


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
        cryptoCoin += "<tr>";
        cryptoCoin += `<td> ${coin.name} </td>`;
        cryptoCoin += `<td> ${coin.symbol} </td>`;
        cryptoCoin += `<td> $ ${(coin.marketCap)} </td>`;
        
        if (coin.price < 0.95) {
            cryptoCoin += `<td> $ ${parseFloat(coin.price).toFixed(8)} </td>`;
        } else {
            cryptoCoin += `<td> $ ${parseFloat(coin.price).toFixed(2)} </td>`;
        };
        });
        document.getElementById("data").innerHTML = cryptoCoin;
        console.log(json);
    };

// API For NBP

var urlNBP = "http://api.nbp.pl/api/exchangerates/rates/{A}/{USD}/"

fetch(`${proxyUrl}${urlNBP}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': "*"
    }
}).then((response) => {
    if(response.ok) {
        response.json().then((json) => {console.log(json)}
        );
    }
}).catch((error) => {
    console.log(error)
})