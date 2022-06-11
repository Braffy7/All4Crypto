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
        if (coin.price < 1) {
            var Listprice = coin.price;
        } else {
            var Listprice = coin.price;
            coin.price = parseFloat(coin.price).toFixed(2);
        };
        cryptoCoin += "<tr>";
        cryptoCoin += `<td> ${coin.name} </td>`;
        cryptoCoin += `<td> ${coin.symbol} </td>`;
        cryptoCoin += `<td> $ ${(coin.marketCap)} </td>`;
        cryptoCoin += `<td> $ ${Listprice} </td>`;
        });
        document.getElementById("data").innerHTML = cryptoCoin;
        console.log(json);
    };