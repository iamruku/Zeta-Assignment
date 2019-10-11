var initScript = function() {
	var zetaTable = new zetaDataTable(
		'id-content',
		getDataList().map(value => ({
			name: value.name,
			code: value.alpha2Code,
			capital: value.capital,
			region: value.region,
			demonym: value.demonym
		})),
		{
			name: 'Name',
			code: 'Code',
			capital: 'Capital',
			region: 'Region',
			demonym: 'Demonym'
		},
		['name', 'capital', 'region'],
		['name', 'capital', 'region'],
		true
	);
};

var zetaDataTable = function(
	targetParentElem,
	initialDataSet,
	columnMappings,
	sortColumns,
	filterColumns,
	isHeaderFixed,
	isPaginated
) {
	parentElement = document.getElementById(targetParentElem);

	headerContainer = headerContainer = addChild(
		parentElement,
		'DIV',
		'cls-header-container'
	);
	rowsContainer = addChild(
		parentElement,
		'DIV',
		'cls-rows-container' + (isHeaderFixed ? ' cls-overflowed' : '')
	);

	tableSorted = {};

	tableFiltered = {};

	function addChild(target, child, classes) {
		var elem = document.createElement(child);
		elem.className = classes;
		target.appendChild(elem);
		return elem;
	}

	function sortTableData(item) {
		tableSorted[item] =
			tableSorted[item] === null || tableSorted[item] === undefined
				? false
				: !tableSorted[item]; // true ascending down, false descending up

		// re-paint headers and rows
		renderHeader(columnMappings, sortColumns);

		renderRows(initialDataSet, columnMappings);
	}

	function filterTableData(item, value) {
		tableFiltered[item] = value;

		for (let item in tableFiltered) {
			if (!tableFiltered[item] || tableFiltered[item] === '') {
				delete tableFiltered[item];
			}
		}

		// re-paint rows
		renderRows(initialDataSet, columnMappings);
	}

	function renderHeader(columnMappings, sortColumns) {
		//clear up parent element
		while (headerContainer.firstChild) {
			headerContainer.removeChild(headerContainer.firstChild);
		}
		for (let item in columnMappings) {
			header = addChild(headerContainer, 'DIV', 'cls-header');
			hraderTextRow = addChild(header, 'DIV', 'cls-header-text-row');
			if (sortColumns.indexOf(item) !== -1) {
				headerText = addChild(hraderTextRow, 'SPAN', 'cls-header-text');
				headerText.innerHTML = columnMappings[item];
				headerButton = addChild(hraderTextRow, 'BUTTON', 'cls-header-button');
				headerIcon = addChild(
					headerButton,
					'I',
					tableSorted[item] === null || tableSorted[item] === undefined
						? 'fa fa-arrow-down'
						: tableSorted[item]
						? 'fa fa-arrow-down'
						: 'fa fa-arrow-up'
				);
				headerButton.addEventListener('click', function() {
					sortTableData(item);
				});
			} else {
				hraderTextRow.innerHTML = columnMappings[item];
			}
			if (filterColumns.indexOf(item) !== -1) {
				hraderFilterRow = addChild(header, 'DIV', 'cls-header-filter-row');
				filter = addChild(hraderFilterRow, 'INPUT', 'cls-header-filter-input');
				filter.type = 'text';
				filter.value = tableFiltered[item] ? tableFiltered[item] : '';
				filter.addEventListener('input', function(event) {
					filterTableData(item, event.target.value);
				});
			}
		}
	}

	function renderRows(initialDataSet, columnMappings) {
		//clear up parent element
		while (rowsContainer.firstChild) {
			rowsContainer.removeChild(rowsContainer.firstChild);
		}

		// sort the data and re-paint
		key = [];
		order = [];
		for (let item in tableSorted) {
			key.push(item);
			order.push(tableSorted[item] ? 'asc' : 'desc');
		}
		dataSet = _.orderBy(initialDataSet, key, order);

		// filter the data and re-paint
		dataSet = _.filter(dataSet, function(elem) {
			filtered = true;
			for (let item in tableFiltered) {
				filtered =
					filtered & elem[item].toLowerCase().includes(tableFiltered[item]);
			}
			return filtered;
		});

		dataSet.forEach(function(elem) {
			row = addChild(rowsContainer, 'DIV', 'cls-row');
			for (var item in columnMappings) {
				column = addChild(row, 'DIV', 'cls-column');
				column.innerHTML = elem[item];
			}
		});
	}

	renderHeader(columnMappings, sortColumns);
	renderRows(initialDataSet, columnMappings);
};

document.addEventListener(
	'DOMContentLoaded',
	function() {
		initScript();
	},
	false
);
