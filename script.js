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
            displayList(data), addingCoin(), ]);
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

function addingCoin() {
    const table = document.querySelector('.list__table');

    table.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const walletCryptos = document.querySelector('#usersCrypto');
        const coinAmount = event.target.inputAmount;
        const coinRow = coinAmount.parentElement.parentElement.parentElement;
        const coinName = coinRow.querySelector('.name').textContent;
        const coinSymbol = coinRow.querySelector('.symbol').textContent;
        const coinPrice = coinRow.querySelector('.price').textContent.match(/\d+(\.\d+)?/)[0];
        const coinValue = coinAmount.value*coinPrice;
        const amountClass = '.' + coinSymbol + '-amount';
        const existingCoin = document.querySelectorAll(amountClass.replace(/ /g,''));

        if (existingCoin.length > 0) {
            existingCoin[0].innerText = parseFloat(coinAmount.value) + parseFloat(existingCoin[0].textContent);

            const valueClass = '.' + coinSymbol;
            const addedValue = coinPrice*parseFloat(existingCoin[0].textContent);
            
            
            if (addedValue < 0.95) {
                document.querySelector(valueClass.replace(/ /g,'')).innerText = addedValue.toFixed(8);
            } else {
                document.querySelector(valueClass.replace(/ /g,'')).innerText = addedValue.toFixed(2);  
            };

            coinAmount.value = "";

        } else {
        const newTr = document.createElement("tr");
        const nameTh = document.createElement("th");
        const priceTh = document.createElement("th");
        const amountTh = document.createElement("th");
        const valueTh = document.createElement("th");
        
        nameTh.innerText = coinName;

        if (coinPrice < 0.95) {
            priceTh.innerText = parseFloat(coinPrice).toFixed(8);
        } else {
            priceTh.innerText = parseFloat(coinPrice).toFixed(2);  
        };

        amountTh.innerText = coinAmount.value;
        amountTh.className += (coinSymbol + '-amount').replace(/ /g,'');

        valueTh.className += (coinSymbol + '-value');
        if (coinValue < 0.95) {
            valueTh.innerText = parseFloat(coinValue).toFixed(8);
        } else {
            valueTh.innerText = parseFloat(coinValue).toFixed(2); 
        };

        walletCryptos.appendChild(newTr);
        walletCryptos.appendChild(nameTh);
        walletCryptos.appendChild(priceTh);
        walletCryptos.appendChild(amountTh);
        walletCryptos.appendChild(valueTh);

        coinAmount.value = "";

        sumUpWallet();
        };

        function sumUpWallet() {
                const values = document.querySelectorAll('.-value');
                console.log(values)
                
                console.log(values.length)
                let sumVal = 0;
                for (var i = 0; i < values.length; i++) {
                    sumVal += parseFloat(values[i].innerHTML);
                
            };
            console.log(sumVal);
            document.getElementById("sumDol").innerHTML = sumVal.toFixed(2);
        }


        /*
        function sumUpWallet() {
            var walletTable = document.getElementById("wallet__crypto");
            console.log(walletTable);
            console.log(walletTable.rows.length);
            let sumVal = 0;
            console.log(sumVal);
            
            for (var i = 1; i < (walletTable.rows.length - 2); i++) {
                const tableData = walletTable.rows[i].cells[3];
                if (tableData && tableData.textContent) {
                    const value = parseFloat(tableData.textContent);
                    if (!isNaN(value)) {
                    sumVal = sumVal + value;
                    }
                }
        }
            
            console.log(sumVal);
            document.getElementById("sumDol").innerHTML = sumVal.toFixed(2);
        };
        */
        /*
        function sumUpWallet() {
            var walletTable = document.getElementById("usersCrypto");
            let subTotal = Array.from(walletTable.rows).slice(1).reduce((total, row) => {
            return total + parseFloat(row.cells[3].textContent);
            }, 0);
            document.getElementById("sumDol").innerHTML = subTotal.toFixed(2);
    }
    */
    });
};
