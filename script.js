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
        response.json().then((json) => displayBTC(json));
    }
}).catch((error) => {
    console.log(error)
})


function displayBTC(json) {
    console.log(json)
        console.log(json.data.coins[0].marketCap);
        let mc = json.data.coins[0].marketCap;
        let
        document.querySelector("#btc-mc").innerText = mc;
        console.log(mc);
}; 