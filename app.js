// Daten laden oder leeres Array
let flips = JSON.parse(localStorage.getItem("flips")) || [];

// Daten speichern
function save(){
    localStorage.setItem("flips", JSON.stringify(flips));
}

// Geld formatieren
function formatMoney(num){
    num = Number(num) || 0;
    if(num >= 1000000) return (num/1000000).toFixed(2)+" Mio";
    if(num >= 1000) return (num/1000).toFixed(1)+"k";
    return num.toFixed(0);
}

// Neuer Kauf
function addBuy(){
    const item = document.getElementById("item").value.trim();
    const amount = parseFloat(document.getElementById("amount").value);
    const buy = parseFloat(document.getElementById("buy").value);

    if(!item || isNaN(amount) || isNaN(buy)) return;

    flips.push({
        item,
        amount,
        buy,
        totalBuy: amount * buy,
        sold:false
    });

    save();
    render();
}

// Verkauf eintragen
function sell(index){
    const price = prompt("Verkaufpreis pro Stück:");
    if(!price) return;

    const sellPrice = parseFloat(price);
    if(isNaN(sellPrice)) return;

    const f = flips[index];
    f.sell = sellPrice;
    f.totalSell = f.sell * f.amount;
    f.profit = f.totalSell - f.totalBuy;
    f.percent = ((f.profit / f.totalBuy) * 100).toFixed(2);
    f.sold = true;

    save();
    render();
}

// Deal bearbeiten
function edit(index){
    const newBuy = prompt("Neuer Kaufpreis pro Stück:", flips[index].buy);
    if(!newBuy) return;

    const buyPrice = parseFloat(newBuy);
    if(isNaN(buyPrice)) return;

    flips[index].buy = buyPrice;
    flips[index].totalBuy = buyPrice * flips[index].amount;

    save();
    render();
}

// Deal löschen
function deleteDeal(index){
    if(confirm("Deal wirklich löschen?")){
        flips.splice(index,1);
        save();
        render();
    }
}

// Alles rendern
function render(){

    const openTable = document.getElementById("openTable");
    const soldTable = document.getElementById("soldTable");

    if(!openTable || !soldTable) return;

    openTable.innerHTML="";
    soldTable.innerHTML="";

    let invested=0;
    let profit=0;
    let loss=0;

    flips.forEach((f,i)=>{
        invested += Number(f.totalBuy) || 0;

        if(!f.sold){
            openTable.innerHTML += `
            <tr>
                <td>${f.item}</td>
                <td>${f.amount}</td>
                <td>${formatMoney(f.totalBuy)}</td>
                <td>
                    <button onclick="sell(${i})">Verkaufen</button>
                    <button class="edit" onclick="edit(${i})">Edit</button>
                    <button class="delete" onclick="deleteDeal(${i})">X</button>
                </td>
            </tr>`;
        } else {
            const dealProfit = Number(f.profit) || 0;
            if(dealProfit > 0) profit += dealProfit;
            if(dealProfit < 0) loss += dealProfit;

            soldTable.innerHTML += `
            <tr>
                <td>${f.item}</td>
                <td>${f.amount}</td>
                <td>${formatMoney(f.totalBuy)}</td>
                <td>${formatMoney(f.totalSell)}</td>
                <td class="${dealProfit>=0?'green':'red'}">
                    ${formatMoney(dealProfit)}
                </td>
                <td class="${dealProfit>=0?'green':'red'}">
                    ${f.percent || 0}%
                </td>
                <td>
                    <button class="delete" onclick="deleteDeal(${i})">X</button>
                </td>
            </tr>`;
        }
    });

    document.getElementById("invested").innerText = formatMoney(invested);
    document.getElementById("profit").innerText = formatMoney(profit);
    document.getElementById("loss").innerText = formatMoney(loss);
    document.getElementById("net").innerText = formatMoney(profit+loss);
}

// Beim Laden rendern
render();