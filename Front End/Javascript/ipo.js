async function FetchData(url) {
	try {
		const response = await fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		})
		let responses = await response.json()
		if(response.ok) return responses.data
		
        throw new Error(responses.message)
	} catch (error) {
		alert(error)
		return null
	}
}

function displayData(data) {
	const tbody = document.querySelector("#data-table tbody");
	tbody.innerHTML = "";

	data.forEach(function (item) {
		var row = document.createElement("tr");
		row.innerHTML = `
			<td class="stock-code">${item["stock_code"]}</td>
			<td>${item["price"].toLocaleString('id-ID')}</td>
			<td>${item["ipo_shares"].toLocaleString('id-ID')}</td>
			<td>${item["listed_shares"].toLocaleString('id-ID')}</td>
			<td>${item["equity"].toLocaleString('id-ID')}</td>
			<td>${item["warrant"]}</td>
			<td>${item["nominal"].toLocaleString('id-ID')}</td>
			<td>${item["mcb"].toLocaleString('id-ID')}</td>
			<td>${item["is_affiliated"]}</td>
			<td>${item["is_acceleration"]}</td>
			<td>${item["is_new"]}</td>
			<td>${item["lock_up"]}</td>
			<td>${item["subscribed_stock"].toLocaleString('id-ID')}</td>
			<td>${item["all_underwriter"]}</td>
			<td>${item["amount"].toLocaleString('id-ID')}</td>`
		tbody.appendChild(row)
	})
}

async function DisplayAll() {
	const responseData = await FetchData("http://localhost:8080/ipo")
	if(responseData == null) return
	displayData(responseData)
}

async function DisplayByValue(value, underwriter) {
	const url = `http://localhost:8080/ipo/value?value=${value}&underwriter=${underwriter}`;
	const responseData = await FetchData(url)
	if(responseData == null) return
	displayData(responseData)
}

async function DisplayByUnderwriter(underwriter) {
	const url = `http://localhost:8080/ipo/underwriter/${underwriter}`
	const responseData = await FetchData(url)
	if(responseData == null) return
	displayData(responseData)
}


function ApplyFilters() {
	let Underwriter = document.getElementById("filterUnderwriter").value;
	let Value = document.getElementById("filterValue").value;
	if (Underwriter == "ALL" && Value == "ALL") DisplayAll()
	else if (Value == "ALL") DisplayByUnderwriter(Underwriter)
	else DisplayByValue(Value, Underwriter)
}

let selectUnderwriter = document.getElementById("filterUnderwriter")
function AddBroker(brokers){
	brokers.forEach(function (broker) {
		let option = document.createElement("option")
		option.value = broker.broker_code
		option.text = broker.name
		selectUnderwriter.appendChild(option)
	})
}

async function GetUnderwriter(){
	const brokers = await FetchData(`http://localhost:8080/brokers`)
	if(brokers == null) return
	AddBroker(brokers)
}

document.addEventListener("DOMContentLoaded", DisplayAll)
document.addEventListener("DOMContentLoaded", GetUnderwriter)