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

var IPO_data;
function displayData(data) {
	const tbody = document.querySelector("#data-table tbody");
	tbody.innerHTML = "";
	IPO_data = data;

	data.forEach(function (item) {
		var row = document.createElement("tr");
		row.innerHTML = `
			<td class="stock-code">${item["stock_code"]}</td>
			<td>${item["price"].toLocaleString('id-ID')}</td>
			<td>${item["ipo_shares"].toLocaleString('id-ID')}</td>
			<td>${item["amount"].toLocaleString('id-ID')}</td>
			<td>${item["listed_shares"].toLocaleString('id-ID')}</td>
			<td>${(item["listed_shares"] * item["price"]).toLocaleString('id-ID')}</td>
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
			`
		tbody.appendChild(row)
	})
}

async function DisplayAll() {
	const responseData = await FetchData("http://localhost:8080/ipo")
	if(responseData == null) return
	displayData(responseData)
}


document.addEventListener("DOMContentLoaded", DisplayAll)

const headers = document.querySelectorAll('th');

// Add click event listener to each <th> element
headers.forEach(function(header) {
    header.addEventListener('click', function() {
		var column = this.dataset.column;
		var order = this.dataset.order;

		if(order == 'desc') {
			this.dataset.order = "asc";
			IPO_data = IPO_data.sort((a, b) => a[column] > b[column] ? 1 : -1);
		} else {
			this.dataset.order = "desc";
			IPO_data = IPO_data.sort((a, b) => a[column] < b[column] ? 1 : -1);
		}
		displayData(IPO_data);
    });
});

// User can't right click to avoid showing context menu
document.addEventListener('contextmenu', function(e) {
	e.preventDefault(); 
});

// Prevent from clicking F12, Ctrl + C, Ctrl + X, Ctrl + U, Ctrl + A, and Ctrl + Shift + I
document.addEventListener('keydown', function(e) {
	if ((e.ctrlKey && (e.key === 'c' || e.key === 'x' || e.key === 'u' || e.key === 'a')) || ((e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')))) {
		e.preventDefault();
	}
});

var categories = [
	['Select Category', ""],
	['Stock Code', "s.stock_code"],
	['Price', "price"],
	['IPO Shares', "ipo_shares"],
	['Listed Shares', "listed_shares"],
	['Equity', "equity"],
	['Nominal', "nominal"],
	['MCB', "mcb"],
	['Is Affiliated', "is_affiliated"],
	['Is Acceleration', "is_acceleration"],
	['Is New', "is_new"],
	['Lock Up', "lock_up"],
	['Subscribed Stock', "subscribed_stock"],
	['Underwriter', "uw_code"],
	['Amount', "(price * ipo_shares)"],
	['Warrant', "warrant"]
];

// Add rule dynamically
document.getElementById('add-rule-btn').addEventListener('click', function () {
	var ruleContainer = document.getElementById('rule-container');

	var newRuleRow = document.createElement('div');
	newRuleRow.classList.add('row', 'mb-3');

	// Create the category select element
	var categoryCol = document.createElement('div');
	categoryCol.classList.add('col-md-5');

	var categorySelect = document.createElement('select');
	categorySelect.classList.add('form-select');
	categories.forEach(function (category) {
		var option = document.createElement('option');
		option.textContent = category[0];
		option.value = category[1];
		categorySelect.appendChild(option);
	});
	categoryCol.appendChild(categorySelect);

	// Create the operator select element
	var operatorCol = document.createElement('div');
	operatorCol.classList.add('col-md-1');
	var operatorSelect = document.createElement('select');
	operatorSelect.classList.add('form-select');
	['>', '<', '>=', '<=', '='].forEach(function (op) {
		var option = document.createElement('option');
		option.value = op;
		option.textContent = op;
		operatorSelect.appendChild(option);
	});
	operatorCol.appendChild(operatorSelect);

	// Create the input element
	var valueCol = document.createElement('div');
	valueCol.classList.add('col-md-4');
	var input = document.createElement('input');
	input.classList.add('form-control');
	input.placeholder = 'Enter value';
	valueCol.appendChild(input);

	// Create the remove button
	var removeCol = document.createElement('div');
	removeCol.classList.add('col-md-2');
	var removeBtn = document.createElement('button');
	removeBtn.classList.add('btn', 'btn-danger', 'remove-rule');
	removeBtn.textContent = 'X';
	removeBtn.addEventListener('click', function () {
		ruleContainer.removeChild(newRuleRow);
	});
	removeCol.appendChild(removeBtn);

	// Append all columns to the new row
	newRuleRow.appendChild(categoryCol);
	newRuleRow.appendChild(operatorCol);
	newRuleRow.appendChild(valueCol);
	newRuleRow.appendChild(removeCol);

	// Append the new row to the rule container
	ruleContainer.appendChild(newRuleRow);
});

// Remove rule dynamically
document.querySelectorAll('.remove-rule').forEach(function (button) {
	button.addEventListener('click', function () {
		this.closest('.row').remove();
	});
});

async function displayByCondition(){
	var ruleContainer = document.getElementById('rule-container');
	var rules = [];

	// Loop through each row in the rule container and get the values
	var rows = ruleContainer.querySelectorAll('.row');
	rows.forEach(function (row) {
		var category = row.querySelector('.col-md-5 select').value;
		var operator = row.querySelector('.col-md-1 select').value;
		var value = row.querySelector('.col-md-4 input').value;
		var type = "number";

		// Push each rule to the rules array
		if (category != "Select Categrory" && operator && value) {
			if (category == "s.stock_code" || category == "uw_code") type = "string";
			
			rules.push({
				filter_name: category,
				symbol: operator,
				filter_value: value,
				filter_type: type
			});
		}
	});

	// Create the JSON object to be sent
	var jsonData = JSON.stringify(rules);
	console.log(jsonData);
	try {
		url = "http://localhost:8080/ipo/condition"
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: jsonData,
		})
		let responses = await response.json()
		if(response.ok){
			displayData(responses.data)
			return
		}
        throw new Error(responses.message)
	} catch (error) {
		alert(error)
		return null
	}
}