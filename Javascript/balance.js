let stockCodeInput = document.getElementById("stockCodeInput")
let title = document.getElementById("header-stock")
let stock_info = document.getElementById("stock-info")
let stock_table = document.getElementById("table-container")
let chart_title = document.getElementById("chart-title")
let chart_stock = document.getElementById("myChart")
let chartFailed = document.getElementById("chart-failed")
let ctx = chart_stock.getContext("2d")
let stockBalanceChart;

// List of month
let monthNames = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
]

// List of categories with their colors
let categories = [
	{label: "local_is", backgroundColor: "rgba(255, 99, 132, 0.5)"},
	{label: "local_cp", backgroundColor: "rgba(54, 162, 235, 0.5)"},
	{label: "local_pf", backgroundColor: "rgba(75, 192, 192, 0.5)"},
	{label: "local_ib", backgroundColor: "rgba(255, 206, 86, 0.5)"},
	{label: "local_id", backgroundColor: "rgba(153, 102, 255, 0.5)"},
	{label: "local_mf", backgroundColor: "rgba(255, 159, 64, 0.5)"},
	{label: "local_sc", backgroundColor: "rgba(60, 179, 113, 0.5)"},
	{label: "local_fd", backgroundColor: "rgba(220, 20, 60, 0.5)"},
	{label: "local_ot", backgroundColor: "rgba(0, 128, 128, 0.5)"},
	{label: "foreign_is", backgroundColor: "rgba(255, 0, 255, 0.5)"},
	{label: "foreign_cp", backgroundColor: "rgba(0, 255, 255, 0.5)"},
	{label: "foreign_pf", backgroundColor: "rgba(255, 255, 0, 0.5)"},
	{label: "foreign_ib", backgroundColor: "rgba(128, 0, 0, 0.5)"},
	{label: "foreign_id", backgroundColor: "rgba(0, 128, 0, 0.5)"},
	{label: "foreign_mf", backgroundColor: "rgba(255, 140, 0, 0.5)"},
	{label: "foreign_sc", backgroundColor: "rgba(255, 20, 147, 0.5)"},
	{label: "foreign_fd", backgroundColor: "rgba(30, 144, 255, 0.5)"},
	{label: "foreign_ot", backgroundColor: "rgba(128, 0, 128, 0.5)"},
]

document.addEventListener("DOMContentLoaded", function(){
	stockCodeInput.value = "BBCA"
	showData()
})

// Format label
function formatLabel(label) {
	let formattedLabel = label.split("_")
	formattedLabel[0] = formattedLabel[0].charAt(0).toUpperCase() + formattedLabel[0].slice(1)
	formattedLabel[1] = formattedLabel[1].toUpperCase()
	let result = formattedLabel.join(" ")
	return result
}

// Format date
function formatDate(item){
	let date = new Date(item);
	return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
}

// Sort data ascending by date
function sortDataByDate(data) {
    data.sort((a, b) => new Date(a.date) - new Date(b.date));
    return data;
}

async function FetchData(url) {
	try {
		const response = await fetch(url)

		let responses = await response.json()
		if(response.ok) return responses.data
		
        throw new Error(responses.message)
	} catch (error) {
		alert(error)
		return null
	}
}

function showTableData(data, stockCode){
	title.innerHTML = `${stockCode} Balance Position`
	displayDataBalance(data)
	let scriptless = ScriptlessSum(data[data.length - 1])
	stock_info.innerHTML = `${stockCode} Scriptless Shares: ${scriptless} Shares`
}

// Show chart
async function showData() {
	let stockCode = stockCodeInput.value.trim();
	let valid = checkCode(stockCode);
	if (!valid) return;
	
	const responseData = await FetchData(`http://localhost:8080/balance/${stockCode}`)
	
	document.getElementById("chart-failed-text").innerHTML = `Failed to make ${stockCode} chart`
	if(responseData == null) {
		title.innerHTML = "Stock Chart"
		stock_info.innerHTML = `Failed to get ${stockCode} data`
		stock_table.style.display = "none"
		chart_title.style.display = "none"
		chartFailed.style.display = "block"
		chart_stock.style.display = "none"
		return
	}
	stock_table.style.display = "block"

	const sortedData = sortDataByDate(responseData);
	showTableData(sortedData, stockCode)

	// Balance Position Chart
	let labels = sortedData.map(item => formatDate(item.date));
	let datasets = categories.map(function (category) {
		return {
			label: formatLabel(category.label),
			backgroundColor: category.backgroundColor,
			data: sortedData.map(function (item) {
				return item[category.label];
			}),
		};
	});

	// Chart configuration
	let config = {
		type: "bar",
		data: {
			labels: labels,
			datasets: datasets,
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: {
					display: true,
					position: 'bottom',
					labels: {
						font: {
							size: 7,
							family:'vazir',
							weight:'bold'
						}
					}
				}
			},
			scales: {
				x: {
					stacked: true,
					ticks: {
						font: {
							size: 6,
							family:'vazir',
							weight:'bold'
						}
					}
				},
				y: {
					stacked: true,
					beginAtZero: true,
					ticks: {
						font: {
							size: 6,
							family:'vazir',
							weight:'bold'
						}
					}
				},
			},
		},
	}
	
	chart_title.innerHTML = `${stockCode} Balance Position Chart`

	// Delete chart if there is an existing chart
	if (stockBalanceChart) stockBalanceChart.destroy()
	stockBalanceChart = new Chart(ctx, config)

	if (!stockBalanceChart) {
		chartFailed.style.display = 'block'
	}
	else {
		chartFailed.style.display = 'none'
		chart_stock.style.display = 'block'
	}
}

function checkCode(stockCode){
	if (stockCode.length != 4) {
		alert("Stock Code must be 4 character")
		return false
	} else {
		for (let i = 0; i < stockCode.length; i++) {
			if (stockCode[i] < "A" || stockCode[i] > "Z") {
				alert("Name must not contain numerical or special character")
				return false
			}
		}
	}
	return true
}

async function exportData() {
	const stockCode = stockCodeInput.value;
	let valid = checkCode(stockCode);
	if (!valid) return;

	let url = `http://localhost:8080/export?code=${stockCode}`;
	try {
		const response = await fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (response.ok) {
			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `${stockCode}.csv`;
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url);
		}
		else {
			let errorMessage = await response.json()
			throw new Error(errorMessage.message);
		}
	} catch (e) {
		alert(e);
	}
}

function displayDataBalance(data) {
	let tbody = document.getElementById("table-body-data");
	tbody.innerHTML = "";

	data.forEach(function (item) {
		var row = document.createElement("tr");
		row.innerHTML = `
			<td>${formatDate(item["date"])}</td>
			<td>${item["local_is"].toLocaleString('id-ID')}</td>
			<td>${item["local_cp"].toLocaleString('id-ID')}</td>
			<td>${item["local_pf"].toLocaleString('id-ID')}</td>
			<td>${item["local_ib"].toLocaleString('id-ID')}</td>
			<td>${item["local_id"].toLocaleString('id-ID')}</td>
			<td>${item["local_mf"].toLocaleString('id-ID')}</td>
			<td>${item["local_sc"].toLocaleString('id-ID')}</td>
			<td>${item["local_fd"].toLocaleString('id-ID')}</td>
			<td>${item["local_ot"].toLocaleString('id-ID')}</td>
			
			<td>${item["foreign_is"].toLocaleString('id-ID')}</td>
			<td>${item["foreign_cp"].toLocaleString('id-ID')}</td>
			<td>${item["foreign_pf"].toLocaleString('id-ID')}</td>
			<td>${item["foreign_ib"].toLocaleString('id-ID')}</td>
			<td>${item["foreign_id"].toLocaleString('id-ID')}</td>
			<td>${item["foreign_mf"].toLocaleString('id-ID')}</td>
			<td>${item["foreign_sc"].toLocaleString('id-ID')}</td>
			<td>${item["foreign_fd"].toLocaleString('id-ID')}</td>
			<td>${item["foreign_ot"].toLocaleString('id-ID')}</td>
		`;
		tbody.appendChild(row);
	});

	if (data.length == 1) return;
	const table = document.getElementById('data-table');
	const lastRow = table.querySelector('tbody tr:last-child');
	const secondLastRow = lastRow.previousElementSibling;

	const changeRow = document.createElement('tr');
	changeRow.innerHTML = '<td>Change 1 Month</td>';
	changeRow.style.background = 'rgb(0, 0, 0)';

	for (let i = 1; i < lastRow.cells.length; i++) {
		const firstData = lastRow.cells[i].textContent.replace(/\./g, '');
		const secondData = secondLastRow.cells[i].textContent.replace(/\./g, '');
		const change = parseInt(firstData) - parseInt(secondData);
		const changeCell = document.createElement('td');
		if (change > 0) changeCell.style.backgroundColor = 'rgb(34, 197, 94)';
		else if (change < 0) changeCell.style.backgroundColor = 'rgb(255, 0, 0)';
		else changeCell.style.backgroundColor = 'rgb(255, 255, 0)';
		changeCell.style.color = 'rgb(0, 0, 0)';
		changeCell.textContent = change.toLocaleString('id-ID');
		changeRow.appendChild(changeCell);
	}
	tbody.appendChild(changeRow);
}

function ScriptlessSum(data){
	let sum = 0;
	for (let key in data) {
		if (key.startsWith('local') || key.startsWith('foreign')) {
			sum += data[key];
		}
	}
	return sum.toLocaleString('id-ID');
}

async function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if(!file) return

	const formData = new FormData();
	formData.append('file', file);
	const responses = await fetch("http://localhost:8080/balance/upload", {
		method: 'POST',
		body: formData
	})
	
	let response = await responses.json()

	alert(response.message)
	location.reload()
}