var baseUrl = "https://api.coinranking.com/v2/coins";
var proxyUrl = "https://corsproxy.io/?";
var apiKey = "coinranking7f186a64cb9582061ee9f9cc76f5cd9cf26064a0cf336549";
var urlNBP = "http://api.nbp.pl/api/exchangerates/rates/A/USD/";

var usdToPln = "" // value to use in sumUpWallet()

// API for cryptocurrencies 
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
            displayList(data) ]); // Promise to delete at the end of work
    }).catch((error) => {
        console.log(error);
    });

// function creating Name / Symbol / Market Cap / Price $ / Price PLN
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
        cryptoCoin += `<td class='pricePLN'> PLN ${(parseFloat(coin.price)*parseFloat(valueUSD)).toFixed(2)} </td>`;
        cryptoCoin += `<td><form><input name="inputAmount" type="number" step="0.00000001" placeholder="Amount.." required><button type="submit"></button></form></td>`;
    });

    document.getElementById("data").innerHTML = cryptoCoin;  
};

 // Confirm Window Const
const Confirm = {
    open(options) {
        options = Object.assign({}, {
            title: '',
            message: '',
            confirmText: 'Confirm',
            cancelText: 'Cancel',
            onok: function () {},
            oncancel: function () {}
        }, options);
        
        const html = `
        <div class="list__popup">
            <div class="list__popup__window">
                <div class="list__popup__title">${options.title}</div>
                <div class="list__popup__text">${options.message}</div>
                <div class="list__popup__buttons">
                    <button class="list__popup__cancel">${options.cancelText}</button>
                    <button class="list__popup__confirm">${options.confirmText}</button>
                </div>
            <div>        
        </div>
        `;

        const template = document.createElement('template');
        template.innerHTML = html;

        const popUp = template.content.querySelector('.list__popup');
        const btnCancel = template.content.querySelector('.list__popup__cancel');
        const btnOk = template.content.querySelector('.list__popup__confirm');

        popUp.addEventListener('click', e => {
            if (e.target === popUp) {
                e.preventDefault();
            };
        });

        btnOk.addEventListener('click', () => {
            options.onok();
            this._close(popUp);
        });

        btnCancel.addEventListener('click', () => {
            options.oncancel();
            this._close(popUp);
        });

        document.body.appendChild(template.content);
    },

    _close (popUp) {
        popUp.addEventListener('click', () => {
            document.body.removeChild(popUp);
        });
}};

// Adding Cryptocurrencies to wallet with confirm window
const table = document.querySelector('.list__table');
const walletCryptos = document.querySelector('#usersCrypto');  

table.addEventListener('submit', (event) => {
    event.preventDefault();
    
    const coinAmount = event.target.inputAmount;
    const coinRow = coinAmount.parentElement.parentElement.parentElement;
    const coinName = coinRow.querySelector('.name').textContent;
    const coinSymbol = coinRow.querySelector('.symbol').textContent;
    const coinPrice = coinRow.querySelector('.price').textContent.match(/\d+(\.\d+)?/)[0];
    const coinValue = coinAmount.value*coinPrice;
    const amountClass = '.' + coinSymbol + '-amount';
    const existingCoin = document.querySelectorAll(amountClass.replace(/ /g,''));

    // Confirm Window 
        Confirm.open({
        title: 'Amount Confirmation',
        message: ('Are you sure you want to add ' + coinAmount.value + coinName + 'to your wallet?'),
        onok: () => {
            addingCoin();
        }
    });

    // Function adding coin to wallet
    function addingCoin () {

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
        sumUpWallet();

    } else {
    const newTr = document.createElement("tr");
    const nameTh = document.createElement("th");
    const priceTh = document.createElement("th");
    const amountTh = document.createElement("th");
    const valueTh = document.createElement("th");
    const deleteDiv = document.createElement("div");
    const deleteTh = document.createElement("th");
    
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

    deleteDiv.classList.add('deleteBtn');

    // Deleting coin in wallet
    deleteDiv.addEventListener('click', ()=> {
        const walletRow = deleteTh.parentElement;
        
        Confirm.open({
            title: 'Delete Confirmation',
            message: ('Are you sure you want to remove ' + walletRow.cells[2].textContent + walletRow.cells[0].textContent + 'from your wallet?'),
            onok: () => {
                walletRow.remove();
                sumUpWallet();
        }});
    });

    walletCryptos.appendChild(newTr);
    newTr.appendChild(nameTh);
    newTr.appendChild(priceTh);
    newTr.appendChild(amountTh);
    newTr.appendChild(valueTh);
    deleteTh.appendChild(deleteDiv);
    newTr.appendChild(deleteTh);

    coinAmount.value = "";
    sumUpWallet();
    }};  
});

// Function summing up values in the wallet
function sumUpWallet() {
    const values = document.querySelectorAll('.-value');
    let sumVal = 0;
    for (var i = 0; i < values.length; i++) {
        sumVal += parseFloat(values[i].innerHTML);
};
document.getElementById('sumDol').innerHTML = sumVal.toFixed(2);
document.getElementById('sumPln').innerHTML = (sumVal*usdToPln).toFixed(2);
}

// Searching funcionality
const searchInput = document.getElementById('inputSearch');

searchInput.addEventListener('input', filterList);

function filterList() {
    const filter = searchInput.value.toLowerCase();
    const listCoins = document.querySelectorAll('.name');

    listCoins.forEach((coin) => {
        let row = coin.parentElement;
        let text = coin.textContent + row.cells[1].textContent;
        if(text.toLowerCase().includes(filter.toLowerCase())){
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
};