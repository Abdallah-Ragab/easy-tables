(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["easytables"] = factory();
	else
		root["easytables"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/modules/Table.js":
/*!******************************!*\
  !*** ./src/modules/Table.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlTable": () => (/* binding */ HtmlTable),
/* harmony export */   "JsonTable": () => (/* binding */ JsonTable)
/* harmony export */ });
/* harmony import */ var _htmlTemplates__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./htmlTemplates */ "./src/modules/htmlTemplates.js");


class Table {
  static attributes = {
    tableContainer: "table-container",
    enableSelect: "select",
    enableSort: "sort",
    customDataContainer: "data-container",
    notData: "non-data",
    rowID: "row-id",
    uniqueIDIndex: "unique-identifier-index",
    columnUniqueID: "unique-identifier"
  };
  static htmlTemplates = _htmlTemplates__WEBPACK_IMPORTED_MODULE_0__.tableTemplates;

  initiateEvents() {
    // Sorting buttons events
    if (this.enableSort) {
      this.tableElement.querySelectorAll('[data-sort-direction]').forEach(el => {
        var direction = el.dataset.sortDirection;
        el.addEventListener('click', e => {
          this.tableElement.querySelectorAll('[data-sort-direction][active]').forEach(element => {
            element.removeAttribute('active');
          });
          el.setAttribute('active', '');
          var element = e.target.closest('th');
          var elementIdx = Array.from(element.parentNode.children).indexOf(element);
          this.sortTable(elementIdx, direction);
        });
      });
    } // Selecting checkboxes events


    if (this.enableSelect) {
      this.bodyCheckboxes = this.tableDataObject.body.rows.map(row => row.element.querySelector('th:first-child input[type="checkbox"], td:first-child input[type="checkbox"]'));
      this.bodyCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', e => {
          let target = e.target;
          this.selectRows(target, false);
        });
      });
      this.headCheckbox = this.tableDataObject.head.element.querySelector('th:first-child input[type="checkbox"], td:first-child input[type="checkbox"]');
      this.headCheckbox.addEventListener('change', e => {
        let target = e.target;
        this.selectRows(target, true);
      });
    }
  }

  readPrimaryHtmlElements() {
    this.tableWrapperElement.tableInstance = this;
    this.tableElement = this.tableWrapperElement.querySelector('table');
    this.headElement = this.tableElement.tHead.rows[0];
    this.headColumnsElements = Array.from(this.tableElement.tHead.rows[0].children);
    this.bodyElement = this.tableElement.tBodies[0];
    this.bodyRowsElements = Array.from(this.tableElement.tBodies[0].rows);
  }

  extractDataFromHtml() {
    const headElement = this.headElement;
    const headColumnsElements = this.headColumnsElements;
    const headColumnsObjects = headColumnsElements.map((columnElement, columnID) => this.constructHeadColumnObject(columnElement, columnID));
    const headDataObject = {
      element: headElement,
      columns: headColumnsObjects
    };
    this.headDataObject = headDataObject;
    const bodyRowsElements = this.bodyRowsElements;
    const bodyRowsObjects = bodyRowsElements.map((rowElement, rowID) => this.constructBodyRowObject(rowElement, rowID));
    const bodyDataObject = {
      rows: bodyRowsObjects
    };
    this.bodyDataObject = bodyDataObject;
    const tableDataObject = {
      head: headDataObject,
      body: bodyDataObject
    };
    return tableDataObject;
  }

  constructHeadColumnObject(columnElement, columnID) {
    var isNotDataCol = columnElement.hasAttribute(this.constructor.attributes.notData) || columnID in this.ignoredColumns;
    return {
      ID: columnID,
      element: columnElement,
      hasData: isNotDataCol ? false : true,
      Value: isNotDataCol ? null : this.extractColumnData(columnElement, columnID)
    };
  }

  extractColumnData(columnElement, columnID) {
    if (this.htmlInitialized) {
      let customDataContainer = columnElement.querySelector(`[${this.constructor.attributes.customDataContainer}]`);
      var dataContainerElement = customDataContainer == null ? columnElement : customDataContainer;
    } else if (this.customHeadSelector && this.customHeadSelector.hasOwnProperty(columnID)) {
      var dataContainerElement = columnElement.querySelector(this.customHeadSelector[columnID]);
    } else {
      var dataContainerElement = columnElement;
    }

    return dataContainerElement.textContent;
  }

  constructBodyRowObject(rowElement, rowID) {
    const rowCellsElements = Array.from(rowElement.children).filter(el => {
      const tagName = el.tagName;
      return tagName === "TH" || tagName === "TD";
    });
    const RowCellsObjects = rowCellsElements.map((cell, idx) => {
      const columnHead = this.headDataObject.columns.find(col => col.ID === idx);
      const isDataCell = columnHead.hasData;
      return {
        ID: idx,
        element: cell,
        hasData: isDataCell,
        Value: isDataCell ? this.extractCellData(cell, idx) : null
      };
    });
    return {
      ID: rowID,
      selected: false,
      element: rowElement,
      cells: RowCellsObjects
    };
  }

  extractCellData(cellElement, cellID) {
    if (this.htmlInitialized) {
      let customDataContainer = cellElement.querySelector(`[${this.constructor.attributes.customDataContainer}]`);
      var dataContainerElement = customDataContainer == null ? cellElement : dataContainerElement;
    } else if (this.customBodySelector && this.customBodySelector.hasOwnProperty(cellID)) {
      var dataContainerElement = cellElement.querySelector(this.customHeadSelector[cellID]);
    } else {
      var dataContainerElement = cellElement;
    }

    return dataContainerElement.textContent;
  } // Sorting functionality


  sortTable(sortByID, sortDirection) {
    this.sortData(sortByID, sortDirection);
    this.reorderRows();
  }

  sortData(sortByID, sortDirection) {
    let sortedRows = Array.from(this.tableDataObject.body.rows).sort((a, b) => {
      var aValue = a.cells.find(cell => cell.ID === sortByID).Value;
      var bValue = b.cells.find(cell => cell.ID === sortByID).Value;
      aValue = isNaN(aValue) ? aValue.toLowerCase() : parseFloat(aValue);
      bValue = isNaN(bValue) ? bValue.toLowerCase() : parseFloat(bValue);

      if (sortDirection == 'asc') {
        if (aValue < bValue) {
          return -1;
        } else if (aValue > bValue) {
          return 1;
        } else return 0;
      } else {
        if (aValue > bValue) {
          return -1;
        } else if (aValue < bValue) {
          return 1;
        } else return 0;
      }
    });
    sortedRows = sortedRows.map((row, idx) => {
      row.ID = idx;
      return row;
    });
    this.tableDataObject.body.rows = sortedRows;
  }

  reorderRows() {
    const rows = this.tableDataObject.body.rows.map(row => row.element);
    this.bodyElement.replaceChildren(...rows);
  } // Selecting functionality


  selectRows(target, inHead) {
    const checked = target.checked;
    const parentRow = target.closest('tr');
    const rowID = this.tableDataObject.body.rows.map(row => row.element).indexOf(parentRow);

    if (!inHead) {
      if (checked) {
        this.updateSelectedRows('add', rowID);
      } else {
        this.updateSelectedRows('remove', rowID);
      }
    } else {
      if (checked) {
        this.updateSelectedRows('all');
      } else {
        this.updateSelectedRows('none');
      }
    }
  }

  updateSelectedRows(operation, rowID = null) {
    switch (operation) {
      case "all":
        this.tableDataObject.body.rows.forEach(row => {
          row.selected = true;
        });
        this.bodyCheckboxes.forEach(checkbox => checkbox.checked = true);
        break;

      case "none":
        this.tableDataObject.body.rows.forEach(row => {
          row.selected = false;
        });
        this.bodyCheckboxes.forEach(checkbox => checkbox.checked = false);
        break;

      case "add":
        this.tableDataObject.body.rows.find(row => row.ID === rowID).selected = true;
        break;

      case "remove":
        this.tableDataObject.body.rows.find(row => row.ID === rowID).selected = false;
        break;
    }

    this.headCheckbox.checked = this.tableDataObject.body.rows.every(row => row.selected);
  }

  getUniqueIdentifiers() {
    const uniqueIDIndexAttribute = this.constructor.attributes.uniqueIDIndex;
    const uniqueIDColumnAttribute = this.constructor.attributes.columnUniqueID;
    const rowIDAttribute = this.constructor.attributes.rowID;

    if (this.htmlInitialized) {
      var hasUniqueIDByIndex = this.tableWrapperElement.hasAttribute(uniqueIDIndexAttribute);
      var uniqueIDIndex = hasUniqueIDByIndex ? this.tableWrapperElement.getAttribute(uniqueIDIndexAttribute) : null;
      var UniqueIDColumn = this.headElement.querySelector(`[${uniqueIDColumnAttribute}]`);
      var hasUniqueIDColumn = UniqueIDColumn !== null;
    } else {
      var hasUniqueIDByIndex = this.uniqueIdentifierIndex !== null;
      var _uniqueIDIndex = this.uniqueIdentifierIndex;

      if (!hasUniqueIDByIndex) {
        console.error(`Missing parameter 'uniqueIdentifierIndex' at '${this.constructor.name}' initialization: the parameter is essential to differentiate the rows by a unique value.`);
      }
    }

    uniqueIDIndex = this.enableSelect ? parseInt(_uniqueIDIndex) + 1 : parseInt(_uniqueIDIndex);

    if (hasUniqueIDByIndex) {
      if (Number.isInteger(uniqueIDIndex)) {
        this.tableDataObject.body.rows = Array.from(this.tableDataObject.body.rows).map(row => {
          const uniqueIDExists = !(row.cells.find(cell => cell.ID === uniqueIDIndex) === undefined);

          if (uniqueIDExists) {
            row.uniqueID = row.cells.find(cell => cell.ID === uniqueIDIndex).Value;
          } else {
            console.error(`Invalid Index '${uniqueIDIndexAttribute}': No column found with the index of '${_uniqueIDIndex}'.`);
          }

          return row;
        });
        return;
      } else {
        console.error(`invalid attribute value: the value of '${uniqueIDIndexAttribute}' must be a number. at the table container.`);
      }
    }

    if (!this.htmlInitialized) {
      return;
    }

    if (hasUniqueIDColumn) {
      const uniqueIDColumnIndex = Array.from(this.headElement.children).indexOf(UniqueIDColumn);
      this.tableDataObject.body.rows = Array.from(this.tableDataObject.body.rows).map(row => {
        row.uniqueID = row.cells.find(cell => cell.ID === uniqueIDColumnIndex).Value;
        return row;
      });
    } else {
      this.tableDataObject.body.rows = Array.from(this.tableDataObject.body.rows).map(row => {
        if (row.element.hasAttribute(rowIDAttribute)) {
          row.uniqueID = row.element.getAttribute(rowIDAttribute);
        } else {
          console.error(`Missing attribute '${rowIDAttribute}': body row with index ${row.ID} is missing a unique id`);
          row.uniqueID = null;
        }

        return row;
      });
    }
  }

  getSelectedRows() {
    return this.tableDataObject.body.rows.filter(row => row.selected).map(row => row.uniqueID);
  }

}

class HtmlTable extends Table {
  constructor(wrapper = null, uniqueIdentifierIndex = null, ignoredColumns = [], customHeadSelector = null, customBodySelector = null, enableSort = true, enableSelect = true) {
    super();
    this.tableWrapper = wrapper;
    this.uniqueIdentifierIndex = uniqueIdentifierIndex;
    this.ignoredColumns = ignoredColumns;
    this.customHeadSelector = customHeadSelector;
    this.customBodySelector = customBodySelector;
    this.enableSort = enableSort;
    this.enableSelect = enableSelect;
    this.initiate();
  }

  initiate() {
    if (typeof this.tableWrapper === "string") {
      this.htmlInitialized = false;
    } else {
      this.htmlInitialized = true;
    }

    this.readPrimaryHtmlElements();
    this.readInlineProperties();

    if (this.enableSelect) {
      this.renderSelect();
      this.readPrimaryHtmlElements();
      this.ignoredColumns.push(0);
    }

    this.tableDataObject = this.extractDataFromHtml();

    if (this.enableSort) {
      this.renderSort();
    }

    if (this.enableSelect) {
      this.getUniqueIdentifiers();
    }

    this.initiateEvents();
  }

  readInlineProperties() {
    if (this.htmlInitialized) {
      this.enableSort = this.tableWrapperElement.hasAttribute(this.constructor.attributes.enableSort);
      this.enableSelect = this.tableWrapperElement.hasAttribute(this.constructor.attributes.enableSelect);
    }
  }

  readPrimaryHtmlElements() {
    if (this.htmlInitialized) {
      this.tableWrapperElement = this.tableWrapper;
    } else {
      this.tableWrapperElement = document.querySelector(this.tableWrapper);
    }

    super.readPrimaryHtmlElements();
  }

  renderSelect() {
    const headRow = this.headElement;
    const bodyRows = this.bodyRowsElements;
    const allRows = [...bodyRows, headRow];
    allRows.forEach(row => {
      row.insertAdjacentHTML("afterbegin", this.constructor.htmlTemplates.transparentSelect);
    });
  }

  renderSort() {
    this.headDataObject.columns.forEach((column, index) => {
      if (column.hasData) {
        const columnInnerHtml = column.element.innerHTML;
        const columnContent = `<div class="flex justify-between items-center space-x-2"><div head-column-content>${columnInnerHtml}</div>${this.constructor.htmlTemplates.headSort}</div>`;
        column.element.replaceChildren();
        column.element.insertAdjacentHTML("beforeend", columnContent);
      }
    });
  }

}
class JsonTable extends Table {
  constructor(wrapper = null, data = null, uniqueIdentifierIndex = null, ignoredColumns = [], enableSort = true, enableSelect = true) {
    super();
    this.tableWrapper = wrapper;
    this.dataInput = data;
    this.uniqueIdentifierIndex = uniqueIdentifierIndex;
    this.ignoredColumns = ignoredColumns;
    this.enableSort = enableSort;
    this.enableSelect = enableSelect;
    this.initiate();
  }

  initiate() {
    if (typeof this.tableWrapper === "string") {
      this.tableWrapperElement = document.querySelector(this.tableWrapper);
    } else {
      this.tableWrapperElement = this.tableWrapper;
    }

    this.emptyHead = this.dataInput.columns.length === 0 || this.dataInput.columns === undefined;
    this.emptyBody = this.dataInput.rows.length === 0 || this.dataInput.rows === undefined;
    this.emptyTable = this.emptyBody && this.emptyHead;
    this.setTableWrapperClasses();
    this.renderTable();

    if (!this.emptyTable) {
      this.readPrimaryHtmlElements();
      this.tableDataObject = this.extractDataFromHtml();

      if (this.enableSelect) {
        this.getUniqueIdentifiers();
      }

      this.initiateEvents();
    }
  }

  initiateEvents() {
    super.initiateEvents(); // Filtering button events

    this.tableElement.querySelectorAll('#filter').forEach(filter => {
      let column = filter.closest('th');
      let columnID = Array.from(column.parentNode.children).indexOf(column);
      columnID = this.enableSelect ? columnID - 1 : columnID;
      let columnFilter = this.dataInput.columns[columnID].hasOwnProperty('filter') ? this.dataInput.columns[columnID].filter : false;

      if (Boolean(columnFilter)) {
        filter.addEventListener('click', columnFilter);
      }
    }); // Button cells events

    if (!this.dataInput) return;
    let buttonColumns = this.dataInput.columns.map((col, idx) => {
      if (col.type == "button") return {
        [idx]: col["callback"]
      };
    }).filter(callback => callback != undefined);
    this.tableDataObject.body.rows.forEach(row => {
      buttonColumns.forEach(col => {
        let colIndex = this.enableSelect ? parseInt(Object.keys(col)[0]) + 1 : parseInt(Object.keys(col)[0]);
        row.element.children[colIndex].querySelector('[table-button]').addEventListener('click', Object.values(col)[0]);
        row.cells[colIndex].element.querySelector('[table-button]').addEventListener('click', Object.values(col)[0]);
      });
    });
  }

  setTableWrapperClasses() {
    this.tableWrapperElement.classList.add('overflow-auto', 'border', 'border-gray-150');
    this.tableWrapperElement.classList.add('max-w-full');
  } // Creating data object from json created html table 


  extractDataFromJson() {
    let tableData = {
      "keys": {},
      "rows": []
    };
    let data = this.dataInput;
    let columns = data.columns;
    columns.forEach((col, idx) => tableData.keys[idx] = col.text);
    let rowsElements = Array.from(this.tableElement.tBodies[0].rows);
    let rowsData = this.dataInput.rows.map((row, idx) => {
      let rowObj = {
        "element": rowsElements[idx],
        "data": {}
      };
      Object.entries(tableData.keys).forEach(key => {
        rowObj.data[key[0]] = row[key[1]];
      });
      return rowObj;
    });
    tableData.rows = rowsData;
    return tableData;
  } // Building & Rendering a html table from json


  renderTable(bodyLoading, headLoading) {
    var tableHtml = this.buildTableHtml(bodyLoading, headLoading);
    this.tableWrapperElement.replaceChildren();

    if (this.emptyTable) {
      const emptyTemplate = this.constructor.htmlTemplates.emptyTablePlaceholder;
      this.tableWrapperElement.insertAdjacentHTML('afterbegin', emptyTemplate);
      return;
    }

    this.tableWrapperElement.insertAdjacentHTML('afterbegin', tableHtml);

    if (this.emptyBody) {
      const emptyTemplate = this.constructor.htmlTemplates.emptyBodyPlaceholder;
      this.tableWrapperElement.insertAdjacentHTML('beforeend', emptyTemplate);
    }
  }

  buildTableHtml(bodyLoading, headLoading) {
    var theadHtml = this.buildHeadHtml(headLoading);
    var tbodyHtml = this.buildBodyHtml(bodyLoading, headLoading);
    var tableTemplate = this.constructor.htmlTemplates['table'];
    var tableHtml = this.evaluateTemplate(tableTemplate, {
      "thead": theadHtml,
      "tbody": tbodyHtml
    });
    return tableHtml;
  }

  buildHeadHtml(headLoading) {
    if (headLoading) {
      return this.constructor.htmlTemplates.headRowProp;
    } else {
      const headColumnTemplate = this.constructor.htmlTemplates.headColumn;
      const headColumns = this.dataInput.columns;
      const headColumnsHtml = headColumns.map(col => {
        let extras = {};

        if (col.type == 'button') {
          return this.evaluateTemplate(headColumnTemplate);
        }

        if (col.type == 'image') {
          col['sort'] = false;
        }

        if (this.enableSort && !col.hasOwnProperty('sort') || this.enableSort && col['sort']) {
          extras["sort"] = this.evaluateTemplate(this.constructor.htmlTemplates.headSort);
        }

        if (this.filter && col['filter']) {
          extras["filter"] = this.evaluateTemplate(this.constructor.htmlTemplates.headFilter);
        }

        return this.evaluateTemplate(headColumnTemplate, {
          "text": col.text,
          ...extras
        });
      });

      if (this.enableSelect) {
        let headSelectTemplate = this.constructor.htmlTemplates.headSelect;
        headColumnsHtml.unshift(this.evaluateTemplate(headSelectTemplate));
      }

      const headRowHtml = headColumnsHtml.join('');
      const theadTemplate = this.constructor.htmlTemplates.headRow;
      const theadHtml = this.evaluateTemplate(theadTemplate, {
        "row": headRowHtml
      });
      return theadHtml;
    }
  }

  buildBodyHtml(bodyLoading, headLoading) {
    if (bodyLoading) {
      if (headLoading) {
        var columnsCount = 3;
        var rowsCount = 5;
      } else {
        var rowsCount = this.dataInput.rows.length;
        var columnsCount = this.dataInput.columns.length;
      }

      const tbodyArray = [...Array(rowsCount)].map(() => {
        const propRowTemplate = this.constructor.htmlTemplates.bodyRowProp;
        const propCellTemplate = this.constructor.htmlTemplates.bodyCellProp;
        const propCellsHtmlArray = [...Array(columnsCount)].map(() => {
          return propCellTemplate;
        });

        if (this.enableSelect && !headLoading) {
          propCellsHtmlArray.unshift(this.evaluateTemplate(this.constructor.htmlTemplates['rowSelect']));
        }

        const propCellsHtml = propCellsHtmlArray.join("");
        return this.evaluateTemplate(propRowTemplate, {
          "row": propCellsHtml
        });
      });
      var tBodyHtml = tbodyArray.join("");
    } else {
      const bodyRows = this.dataInput.rows;
      var tBodyHtml = bodyRows.map(row => {
        const rowCells = this.dataInput.columns;
        const rowCellsHtmlArray = rowCells.map(cell => {
          let cellValue = row[cell.text];
          const cellType = cell.hasOwnProperty('type') ? cell.type : 'text';
          const cellExtras = {};
          const cellTemplate = this.constructor.htmlTemplates.bodyCell[cellType];

          if (cell.colorCode) {
            cellValue = cellValue.toLowerCase();
            const conditionsDictionary = {
              'equal': '==='
            };
            cell.colorCode.some(cond => {
              if (eval("'" + cellValue + "'" + conditionsDictionary[cond.condition] + "'" + cond.value.toLowerCase() + "'")) {
                cellExtras['color'] = cond.color;
                return true;
              }
            });
          }

          if (cell.type == 'button') {
            cellExtras['color'] = cell.color;
            cellExtras['text'] = cell.text;
          }

          const cellHtml = this.evaluateTemplate(cellTemplate, {
            "text": cellValue,
            ...cellExtras
          });
          return cellHtml;
        });

        if (this.enableSelect) {
          rowCellsHtmlArray.unshift(this.evaluateTemplate(this.constructor.htmlTemplates['rowSelect']));
        }

        const rowCellsHtml = rowCellsHtmlArray.join('');
        const rowTemplate = this.constructor.htmlTemplates.bodyRow;
        const rowHtml = this.evaluateTemplate(rowTemplate, {
          "row": rowCellsHtml
        });
        return rowHtml;
      }).join('');
    }

    return tBodyHtml;
  }

  evaluateTemplate(template, args = {}) {
    var variables = template.match(/(?<=\$\{data\[['"])[\w]*(?=['"]\]\})/gi);
    if (!variables) return template;
    var data = {};
    variables.forEach(variable => {
      if (args.hasOwnProperty(variable)) {
        data[variable] = args[variable];
      } else {
        data[variable] = '';
      }
    });
    var evaluated = eval("`" + template + "`");
    return evaluated;
  } // Loading


  loadingBody() {
    this.renderTable(true);
  }

  loadingTable() {
    this.renderTable(true, true);
  }

}

/***/ }),

/***/ "./src/modules/htmlTemplates.js":
/*!**************************************!*\
  !*** ./src/modules/htmlTemplates.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "tableTemplates": () => (/* binding */ tableTemplates)
/* harmony export */ });
const tableTemplates = {
  "table": `
        <table class='min-w-full rounded border-gray-700 bg-gray-50'>
            <thead>\${data['thead']}</thead>
            <tbody>\${data['tbody']}</tbody>
        </table>
        `,
  "headRow": `
        <tr class="bg-gray-200 whitespace-nowrap text-gray-700 font-semibold capitalize sticky -top-1 z-10">\${data['row']}</tr>
        `,
  "headSelect": `
        <th non-data class=" sticky -left-px shadow bg-gray-200 shadow-xl text-start px-4 py-1 z-10 w-0"><input type="checkbox"></th>
        `,
  "transparentSelect": `
        <th non-data><input type="checkbox"></th>
        `,
  "headSort": `
        <div class="flex flex-col space-y-0.5">
            <svg data-sort-direction="asc"  xmlns="http://www.w3.org/2000/svg" viewBox="-143.066 -107.05 286.1 167.1">
                <path d="M 119 60 H -119 c -21.4 0 -32.1 -25.9 -17 -41 L -17 -100 c 9.4 -9.4 24.6 -9.4 33.9 0 l 119 119 c 15.2 15.1 4.5 41 -16.9 41 z" fill="#000000"/>
            </svg>
            <svg data-sort-direction="desc" xmlns="http://www.w3.org/2000/svg" viewBox="-143.066 -107.05 286.1 167.1" style="transform: rotate(180deg);">
                <path d="M 119 60 H -119 c -21.4 0 -32.1 -25.9 -17 -41 L -17 -100 c 9.4 -9.4 24.6 -9.4 33.9 0 l 119 119 c 15.2 15.1 4.5 41 -16.9 41 z" fill="#000000"/>
            </svg>
        </div>
        `,
  "headFilter": `
        <div data-type="filter">
            <svg xmlns="http://www.w3.org/2000/svg" x="0" y="0" viewBox="0 0 459 459" style="enable-background:new 0 0 512 512" xml:space="preserve">
                <path d="M178.5,382.5h102v-51h-102V382.5z M0,76.5v51h459v-51H0z M76.5,255h306v-51h-306V255z" fill="#000000" data-original="#000000"></path>
            </svg>
        </div>
        `,
  "headColumn": `
        <th class="\${data['isNotData']} text-start px-4 py-2">
            <div class="flex justify-between items-center space-x-2">
                <div>\${data['text']}</div>
                <div class="flex items-center space-x-1">
                    \${data['filter']}
                    \${data['sort']}
                </div>
            </div>    
        </th>
        `,
  "bodyRow": `
            <tr class="border-b border-gray-150 whitespace-nowrap text-gray-500 text-sm">\${data['row']}</tr>
            `,
  "bodyCell": {
    "text": `
                <td class="px-4 py-2">\${data['text']}</td>
                `,
    "bold": `
                <td class="px-4 py-2 text-gray-700 font-bold">\${data['text']}</td>
                `,
    "image": `
                <td non-data class="px-4 py-2 text-gray-700 font-bold"><img table-image class="w-12 h-12 border rounded-full" src="\${data['text']}"></td>
                `,
    "label": `
                <td non-data class="px-4 py-2"><div table-label class="bg-\${data['color']}-100 text-\${data['color']}-700 rounded shadow w-fit text-center font-semibold px-3 py-1">\${data['text']}</div></td>
                `,
    "button": `
                <td non-data class="px-4 py-2"><span table-button class="text-\${data['color']}-800 font-bold hover:text-\${data['color']}-700 cursor-pointer capitalize">\${data['text']}</span></td>
                `
  },
  "rowSelect": `
            <td non-data class="sticky -left-px bg-white px-4 py-2 w-0"><input type="checkbox"></td>
        `,
  "emptyBodyPlaceholder": `
            <div class="flex justify-center items-center w-100 sticky left-0 h-16 text-lg text-gray-600 font-bold capitalize">No data found</div>  
        `,
  "emptyTablePlaceholder": `
            <div class="w-full h-10 bg-gray-200"></div>
            <div class="w-full h-full flex flex-col justify-center items-center p-6">
                <svg class="fill-gray-700" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" width="150.817px" height="150.817px" viewBox="0 0 150.817 150.817" style="enable-background:new 0 0 150.817 150.817;" xml:space="preserve">
                    <path d="M58.263,64.946c3.58-8.537,9.834-16.039,18.456-21.02c6.644-3.842,14.225-5.876,21.902-5.876   c6.376,0,12.568,1.461,18.207,4.031V21.677C116.829,9.706,92.563,0,62.641,0C32.71,0,8.448,9.706,8.448,21.677v21.681   C8.436,54.75,30.372,64.061,58.263,64.946z M62.629,5.416c29.77,0,48.768,9.633,48.768,16.255c0,6.634-18.998,16.258-48.768,16.258   c-29.776,0-48.774-9.624-48.774-16.258C13.855,15.049,32.853,5.416,62.629,5.416z M8.429,75.883V54.202   c0,10.973,20.396,20.015,46.841,21.449c-1.053,7.21-0.311,14.699,2.375,21.799C30.055,96.445,8.436,87.184,8.429,75.883z    M95.425,125.631c-9.109,2.771-20.457,4.445-32.796,4.445c-29.931,0-54.193-9.706-54.193-21.684V86.709   c0,11.983,24.256,21.684,54.193,21.684c0.341,0,0.673-0.018,1.014-0.018C71.214,118.373,82.827,124.656,95.425,125.631z    M131.296,63.11c-10.388-17.987-33.466-24.174-51.46-13.785c-17.987,10.388-24.173,33.463-13.792,51.45   c10.388,17.993,33.478,24.174,51.465,13.798C135.51,104.191,141.684,81.102,131.296,63.11z M71.449,97.657   C62.778,82.66,67.945,63.394,82.955,54.72c15.01-8.662,34.275-3.504,42.946,11.509c8.672,15.013,3.502,34.279-11.508,42.943   C99.377,117.85,80.117,112.686,71.449,97.657z M139.456,133.852l-16.203,9.353l-12.477-21.598l16.209-9.359L139.456,133.852z    M137.708,149.562c-4.488,2.582-10.199,1.06-12.794-3.429l16.216-9.353C143.718,141.268,142.184,146.979,137.708,149.562z"/>
                </svg>
                <span class="text-gray-600 font-semibold text-4xl uppercase mt-3">No Data Found</span>
            </div>  
        `,
  "headRowProp": `
            <tr class="bg-gray-200 whitespace-nowrap text-gray-700 font-semibold capitalize sticky -top-1 z-10 animate-pulse">
                <th class="h-10 w-4/12"></th>
                <th class="h-10 w-2/12"></th>
                <th class="h-10 w-6/12"></th>
            </tr>
        `,
  "bodyRowProp": `
            <tr class="border-b border-gray-150 whitespace-nowrap text-gray-500 text-sm animate-pulse">\${data['row']}</tr>
        `,
  "bodyCellProp": `
            <td class="px-4"><div class="my-2.5 mx-1 bg-gray-200 h-5 rounded">&nbsp;</div></td>
        `
};

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/dist/cjs.js!./src/styles/main.css":
/*!*************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/dist/cjs.js!./src/styles/main.css ***!
  \*************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, "/*\n! tailwindcss v3.1.8 | MIT License | https://tailwindcss.com\n*//*\n1. Prevent padding and border from affecting element width. (https://github.com/mozdevs/cssremedy/issues/4)\n2. Allow adding a border to an element by just adding a border-width. (https://github.com/tailwindcss/tailwindcss/pull/116)\n*/\n\n*,\n::before,\n::after {\n  box-sizing: border-box; /* 1 */\n  border-width: 0; /* 2 */\n  border-style: solid; /* 2 */\n  border-color: #e5e7eb; /* 2 */\n}\n\n::before,\n::after {\n  --tw-content: '';\n}\n\n/*\n1. Use a consistent sensible line-height in all browsers.\n2. Prevent adjustments of font size after orientation changes in iOS.\n3. Use a more readable tab size.\n4. Use the user's configured `sans` font-family by default.\n*/\n\nhtml {\n  line-height: 1.5; /* 1 */\n  -webkit-text-size-adjust: 100%; /* 2 */\n  -moz-tab-size: 4; /* 3 */\n  -o-tab-size: 4;\n     tab-size: 4; /* 3 */\n  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\"; /* 4 */\n}\n\n/*\n1. Remove the margin in all browsers.\n2. Inherit line-height from `html` so users can set them as a class directly on the `html` element.\n*/\n\nbody {\n  margin: 0; /* 1 */\n  line-height: inherit; /* 2 */\n}\n\n/*\n1. Add the correct height in Firefox.\n2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)\n3. Ensure horizontal rules are visible by default.\n*/\n\nhr {\n  height: 0; /* 1 */\n  color: inherit; /* 2 */\n  border-top-width: 1px; /* 3 */\n}\n\n/*\nAdd the correct text decoration in Chrome, Edge, and Safari.\n*/\n\nabbr:where([title]) {\n  -webkit-text-decoration: underline dotted;\n          text-decoration: underline dotted;\n}\n\n/*\nRemove the default font size and weight for headings.\n*/\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-size: inherit;\n  font-weight: inherit;\n}\n\n/*\nReset links to optimize for opt-in styling instead of opt-out.\n*/\n\na {\n  color: inherit;\n  text-decoration: inherit;\n}\n\n/*\nAdd the correct font weight in Edge and Safari.\n*/\n\nb,\nstrong {\n  font-weight: bolder;\n}\n\n/*\n1. Use the user's configured `mono` font family by default.\n2. Correct the odd `em` font sizing in all browsers.\n*/\n\ncode,\nkbd,\nsamp,\npre {\n  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace; /* 1 */\n  font-size: 1em; /* 2 */\n}\n\n/*\nAdd the correct font size in all browsers.\n*/\n\nsmall {\n  font-size: 80%;\n}\n\n/*\nPrevent `sub` and `sup` elements from affecting the line height in all browsers.\n*/\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\nsub {\n  bottom: -0.25em;\n}\n\nsup {\n  top: -0.5em;\n}\n\n/*\n1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)\n2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)\n3. Remove gaps between table borders by default.\n*/\n\ntable {\n  text-indent: 0; /* 1 */\n  border-color: inherit; /* 2 */\n  border-collapse: collapse; /* 3 */\n}\n\n/*\n1. Change the font styles in all browsers.\n2. Remove the margin in Firefox and Safari.\n3. Remove default padding in all browsers.\n*/\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  font-family: inherit; /* 1 */\n  font-size: 100%; /* 1 */\n  font-weight: inherit; /* 1 */\n  line-height: inherit; /* 1 */\n  color: inherit; /* 1 */\n  margin: 0; /* 2 */\n  padding: 0; /* 3 */\n}\n\n/*\nRemove the inheritance of text transform in Edge and Firefox.\n*/\n\nbutton,\nselect {\n  text-transform: none;\n}\n\n/*\n1. Correct the inability to style clickable types in iOS and Safari.\n2. Remove default button styles.\n*/\n\nbutton,\n[type='button'],\n[type='reset'],\n[type='submit'] {\n  -webkit-appearance: button; /* 1 */\n  background-color: transparent; /* 2 */\n  background-image: none; /* 2 */\n}\n\n/*\nUse the modern Firefox focus style for all focusable elements.\n*/\n\n:-moz-focusring {\n  outline: auto;\n}\n\n/*\nRemove the additional `:invalid` styles in Firefox. (https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737)\n*/\n\n:-moz-ui-invalid {\n  box-shadow: none;\n}\n\n/*\nAdd the correct vertical alignment in Chrome and Firefox.\n*/\n\nprogress {\n  vertical-align: baseline;\n}\n\n/*\nCorrect the cursor style of increment and decrement buttons in Safari.\n*/\n\n::-webkit-inner-spin-button,\n::-webkit-outer-spin-button {\n  height: auto;\n}\n\n/*\n1. Correct the odd appearance in Chrome and Safari.\n2. Correct the outline style in Safari.\n*/\n\n[type='search'] {\n  -webkit-appearance: textfield; /* 1 */\n  outline-offset: -2px; /* 2 */\n}\n\n/*\nRemove the inner padding in Chrome and Safari on macOS.\n*/\n\n::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\n/*\n1. Correct the inability to style clickable types in iOS and Safari.\n2. Change font properties to `inherit` in Safari.\n*/\n\n::-webkit-file-upload-button {\n  -webkit-appearance: button; /* 1 */\n  font: inherit; /* 2 */\n}\n\n/*\nAdd the correct display in Chrome and Safari.\n*/\n\nsummary {\n  display: list-item;\n}\n\n/*\nRemoves the default spacing and border for appropriate elements.\n*/\n\nblockquote,\ndl,\ndd,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\nhr,\nfigure,\np,\npre {\n  margin: 0;\n}\n\nfieldset {\n  margin: 0;\n  padding: 0;\n}\n\nlegend {\n  padding: 0;\n}\n\nol,\nul,\nmenu {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n\n/*\nPrevent resizing textareas horizontally by default.\n*/\n\ntextarea {\n  resize: vertical;\n}\n\n/*\n1. Reset the default placeholder opacity in Firefox. (https://github.com/tailwindlabs/tailwindcss/issues/3300)\n2. Set the default placeholder color to the user's configured gray 400 color.\n*/\n\ninput::-moz-placeholder, textarea::-moz-placeholder {\n  opacity: 1; /* 1 */\n  color: #9ca3af; /* 2 */\n}\n\ninput::placeholder,\ntextarea::placeholder {\n  opacity: 1; /* 1 */\n  color: #9ca3af; /* 2 */\n}\n\n/*\nSet the default cursor for buttons.\n*/\n\nbutton,\n[role=\"button\"] {\n  cursor: pointer;\n}\n\n/*\nMake sure disabled buttons don't get the pointer cursor.\n*/\n:disabled {\n  cursor: default;\n}\n\n/*\n1. Make replaced elements `display: block` by default. (https://github.com/mozdevs/cssremedy/issues/14)\n2. Add `vertical-align: middle` to align replaced elements more sensibly by default. (https://github.com/jensimmons/cssremedy/issues/14#issuecomment-634934210)\n   This can trigger a poorly considered lint error in some tools but is included by design.\n*/\n\nimg,\nsvg,\nvideo,\ncanvas,\naudio,\niframe,\nembed,\nobject {\n  display: block; /* 1 */\n  vertical-align: middle; /* 2 */\n}\n\n/*\nConstrain images and videos to the parent width and preserve their intrinsic aspect ratio. (https://github.com/mozdevs/cssremedy/issues/14)\n*/\n\nimg,\nvideo {\n  max-width: 100%;\n  height: auto;\n}\n\n*, ::before, ::after {\n  --tw-border-spacing-x: 0;\n  --tw-border-spacing-y: 0;\n  --tw-translate-x: 0;\n  --tw-translate-y: 0;\n  --tw-rotate: 0;\n  --tw-skew-x: 0;\n  --tw-skew-y: 0;\n  --tw-scale-x: 1;\n  --tw-scale-y: 1;\n  --tw-pan-x:  ;\n  --tw-pan-y:  ;\n  --tw-pinch-zoom:  ;\n  --tw-scroll-snap-strictness: proximity;\n  --tw-ordinal:  ;\n  --tw-slashed-zero:  ;\n  --tw-numeric-figure:  ;\n  --tw-numeric-spacing:  ;\n  --tw-numeric-fraction:  ;\n  --tw-ring-inset:  ;\n  --tw-ring-offset-width: 0px;\n  --tw-ring-offset-color: #fff;\n  --tw-ring-color: rgb(59 130 246 / 0.5);\n  --tw-ring-offset-shadow: 0 0 #0000;\n  --tw-ring-shadow: 0 0 #0000;\n  --tw-shadow: 0 0 #0000;\n  --tw-shadow-colored: 0 0 #0000;\n  --tw-blur:  ;\n  --tw-brightness:  ;\n  --tw-contrast:  ;\n  --tw-grayscale:  ;\n  --tw-hue-rotate:  ;\n  --tw-invert:  ;\n  --tw-saturate:  ;\n  --tw-sepia:  ;\n  --tw-drop-shadow:  ;\n  --tw-backdrop-blur:  ;\n  --tw-backdrop-brightness:  ;\n  --tw-backdrop-contrast:  ;\n  --tw-backdrop-grayscale:  ;\n  --tw-backdrop-hue-rotate:  ;\n  --tw-backdrop-invert:  ;\n  --tw-backdrop-opacity:  ;\n  --tw-backdrop-saturate:  ;\n  --tw-backdrop-sepia:  ;\n}\n\n::-webkit-backdrop {\n  --tw-border-spacing-x: 0;\n  --tw-border-spacing-y: 0;\n  --tw-translate-x: 0;\n  --tw-translate-y: 0;\n  --tw-rotate: 0;\n  --tw-skew-x: 0;\n  --tw-skew-y: 0;\n  --tw-scale-x: 1;\n  --tw-scale-y: 1;\n  --tw-pan-x:  ;\n  --tw-pan-y:  ;\n  --tw-pinch-zoom:  ;\n  --tw-scroll-snap-strictness: proximity;\n  --tw-ordinal:  ;\n  --tw-slashed-zero:  ;\n  --tw-numeric-figure:  ;\n  --tw-numeric-spacing:  ;\n  --tw-numeric-fraction:  ;\n  --tw-ring-inset:  ;\n  --tw-ring-offset-width: 0px;\n  --tw-ring-offset-color: #fff;\n  --tw-ring-color: rgb(59 130 246 / 0.5);\n  --tw-ring-offset-shadow: 0 0 #0000;\n  --tw-ring-shadow: 0 0 #0000;\n  --tw-shadow: 0 0 #0000;\n  --tw-shadow-colored: 0 0 #0000;\n  --tw-blur:  ;\n  --tw-brightness:  ;\n  --tw-contrast:  ;\n  --tw-grayscale:  ;\n  --tw-hue-rotate:  ;\n  --tw-invert:  ;\n  --tw-saturate:  ;\n  --tw-sepia:  ;\n  --tw-drop-shadow:  ;\n  --tw-backdrop-blur:  ;\n  --tw-backdrop-brightness:  ;\n  --tw-backdrop-contrast:  ;\n  --tw-backdrop-grayscale:  ;\n  --tw-backdrop-hue-rotate:  ;\n  --tw-backdrop-invert:  ;\n  --tw-backdrop-opacity:  ;\n  --tw-backdrop-saturate:  ;\n  --tw-backdrop-sepia:  ;\n}\n\n::backdrop {\n  --tw-border-spacing-x: 0;\n  --tw-border-spacing-y: 0;\n  --tw-translate-x: 0;\n  --tw-translate-y: 0;\n  --tw-rotate: 0;\n  --tw-skew-x: 0;\n  --tw-skew-y: 0;\n  --tw-scale-x: 1;\n  --tw-scale-y: 1;\n  --tw-pan-x:  ;\n  --tw-pan-y:  ;\n  --tw-pinch-zoom:  ;\n  --tw-scroll-snap-strictness: proximity;\n  --tw-ordinal:  ;\n  --tw-slashed-zero:  ;\n  --tw-numeric-figure:  ;\n  --tw-numeric-spacing:  ;\n  --tw-numeric-fraction:  ;\n  --tw-ring-inset:  ;\n  --tw-ring-offset-width: 0px;\n  --tw-ring-offset-color: #fff;\n  --tw-ring-color: rgb(59 130 246 / 0.5);\n  --tw-ring-offset-shadow: 0 0 #0000;\n  --tw-ring-shadow: 0 0 #0000;\n  --tw-shadow: 0 0 #0000;\n  --tw-shadow-colored: 0 0 #0000;\n  --tw-blur:  ;\n  --tw-brightness:  ;\n  --tw-contrast:  ;\n  --tw-grayscale:  ;\n  --tw-hue-rotate:  ;\n  --tw-invert:  ;\n  --tw-saturate:  ;\n  --tw-sepia:  ;\n  --tw-drop-shadow:  ;\n  --tw-backdrop-blur:  ;\n  --tw-backdrop-brightness:  ;\n  --tw-backdrop-contrast:  ;\n  --tw-backdrop-grayscale:  ;\n  --tw-backdrop-hue-rotate:  ;\n  --tw-backdrop-invert:  ;\n  --tw-backdrop-opacity:  ;\n  --tw-backdrop-saturate:  ;\n  --tw-backdrop-sepia:  ;\n}\r\n.container {\n  width: 100%;\n}\r\n@media (min-width: 640px) {\n\n  .container {\n    max-width: 640px;\n  }\n}\r\n@media (min-width: 768px) {\n\n  .container {\n    max-width: 768px;\n  }\n}\r\n@media (min-width: 1024px) {\n\n  .container {\n    max-width: 1024px;\n  }\n}\r\n@media (min-width: 1280px) {\n\n  .container {\n    max-width: 1280px;\n  }\n}\r\n@media (min-width: 1536px) {\n\n  .container {\n    max-width: 1536px;\n  }\n}\r\n.static {\n  position: static;\n}\r\n.sticky {\n  position: -webkit-sticky;\n  position: sticky;\n}\r\n.-top-1 {\n  top: -0.25rem;\n}\r\n.-left-px {\n  left: -1px;\n}\r\n.left-0 {\n  left: 0px;\n}\r\n.z-10 {\n  z-index: 10;\n}\r\n.m-1 {\n  margin: 0.25rem;\n}\r\n.my-2 {\n  margin-top: 0.5rem;\n  margin-bottom: 0.5rem;\n}\r\n.mx-1 {\n  margin-left: 0.25rem;\n  margin-right: 0.25rem;\n}\r\n.my-4 {\n  margin-top: 1rem;\n  margin-bottom: 1rem;\n}\r\n.my-3 {\n  margin-top: 0.75rem;\n  margin-bottom: 0.75rem;\n}\r\n.my-2\\.5 {\n  margin-top: 0.625rem;\n  margin-bottom: 0.625rem;\n}\r\n.mt-3 {\n  margin-top: 0.75rem;\n}\r\n.flex {\n  display: flex;\n}\r\n.table {\n  display: table;\n}\r\n.h-12 {\n  height: 3rem;\n}\r\n.h-4 {\n  height: 1rem;\n}\r\n.h-5 {\n  height: 1.25rem;\n}\r\n.h-full {\n  height: 100%;\n}\r\n.h-24 {\n  height: 6rem;\n}\r\n.h-16 {\n  height: 4rem;\n}\r\n.h-10 {\n  height: 2.5rem;\n}\r\n.w-12 {\n  width: 3rem;\n}\r\n.w-fit {\n  width: -webkit-fit-content;\n  width: -moz-fit-content;\n  width: fit-content;\n}\r\n.w-0 {\n  width: 0px;\n}\r\n.w-full {\n  width: 100%;\n}\r\n.w-4\\/12 {\n  width: 33.333333%;\n}\r\n.w-2\\/12 {\n  width: 16.666667%;\n}\r\n.w-6\\/12 {\n  width: 50%;\n}\r\n.min-w-full {\n  min-width: 100%;\n}\r\n.max-w-full {\n  max-width: 100%;\n}\r\n.transform {\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\r\n@-webkit-keyframes pulse {\n\n  50% {\n    opacity: .5;\n  }\n}\r\n@keyframes pulse {\n\n  50% {\n    opacity: .5;\n  }\n}\r\n.animate-pulse {\n  -webkit-animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;\n          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;\n}\r\n.cursor-pointer {\n  cursor: pointer;\n}\r\n.flex-col {\n  flex-direction: column;\n}\r\n.items-center {\n  align-items: center;\n}\r\n.justify-center {\n  justify-content: center;\n}\r\n.justify-between {\n  justify-content: space-between;\n}\r\n.space-y-0\\.5 > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-y-reverse: 0;\n  margin-top: calc(0.125rem * calc(1 - var(--tw-space-y-reverse)));\n  margin-bottom: calc(0.125rem * var(--tw-space-y-reverse));\n}\r\n.space-y-0 > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-y-reverse: 0;\n  margin-top: calc(0px * calc(1 - var(--tw-space-y-reverse)));\n  margin-bottom: calc(0px * var(--tw-space-y-reverse));\n}\r\n.space-x-2 > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-x-reverse: 0;\n  margin-right: calc(0.5rem * var(--tw-space-x-reverse));\n  margin-left: calc(0.5rem * calc(1 - var(--tw-space-x-reverse)));\n}\r\n.space-x-1 > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-x-reverse: 0;\n  margin-right: calc(0.25rem * var(--tw-space-x-reverse));\n  margin-left: calc(0.25rem * calc(1 - var(--tw-space-x-reverse)));\n}\r\n.overflow-auto {\n  overflow: auto;\n}\r\n.whitespace-nowrap {\n  white-space: nowrap;\n}\r\n.rounded {\n  border-radius: 0.25rem;\n}\r\n.rounded-full {\n  border-radius: 9999px;\n}\r\n.border {\n  border-width: 1px;\n}\r\n.border-b {\n  border-bottom-width: 1px;\n}\r\n.border-gray-700 {\n  --tw-border-opacity: 1;\n  border-color: rgb(55 65 81 / var(--tw-border-opacity));\n}\r\n.bg-slate-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(241 245 249 / var(--tw-bg-opacity));\n}\r\n.bg-gray-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(243 244 246 / var(--tw-bg-opacity));\n}\r\n.bg-zinc-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(244 244 245 / var(--tw-bg-opacity));\n}\r\n.bg-neutral-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(245 245 245 / var(--tw-bg-opacity));\n}\r\n.bg-stone-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(245 245 244 / var(--tw-bg-opacity));\n}\r\n.bg-red-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(254 226 226 / var(--tw-bg-opacity));\n}\r\n.bg-orange-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(255 237 213 / var(--tw-bg-opacity));\n}\r\n.bg-amber-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(254 243 199 / var(--tw-bg-opacity));\n}\r\n.bg-yellow-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(254 249 195 / var(--tw-bg-opacity));\n}\r\n.bg-lime-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(236 252 203 / var(--tw-bg-opacity));\n}\r\n.bg-green-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(220 252 231 / var(--tw-bg-opacity));\n}\r\n.bg-emerald-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(209 250 229 / var(--tw-bg-opacity));\n}\r\n.bg-teal-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(204 251 241 / var(--tw-bg-opacity));\n}\r\n.bg-cyan-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(207 250 254 / var(--tw-bg-opacity));\n}\r\n.bg-sky-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(224 242 254 / var(--tw-bg-opacity));\n}\r\n.bg-blue-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(219 234 254 / var(--tw-bg-opacity));\n}\r\n.bg-indigo-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(224 231 255 / var(--tw-bg-opacity));\n}\r\n.bg-violet-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(237 233 254 / var(--tw-bg-opacity));\n}\r\n.bg-purple-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(243 232 255 / var(--tw-bg-opacity));\n}\r\n.bg-fuchsia-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(250 232 255 / var(--tw-bg-opacity));\n}\r\n.bg-pink-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(252 231 243 / var(--tw-bg-opacity));\n}\r\n.bg-rose-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(255 228 230 / var(--tw-bg-opacity));\n}\r\n.bg-gray-50 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(249 250 251 / var(--tw-bg-opacity));\n}\r\n.bg-gray-200 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(229 231 235 / var(--tw-bg-opacity));\n}\r\n.bg-white {\n  --tw-bg-opacity: 1;\n  background-color: rgb(255 255 255 / var(--tw-bg-opacity));\n}\r\n.bg-gray-300 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(209 213 219 / var(--tw-bg-opacity));\n}\r\n.fill-gray-700 {\n  fill: #374151;\n}\r\n.p-6 {\n  padding: 1.5rem;\n}\r\n.px-4 {\n  padding-left: 1rem;\n  padding-right: 1rem;\n}\r\n.py-1 {\n  padding-top: 0.25rem;\n  padding-bottom: 0.25rem;\n}\r\n.py-2 {\n  padding-top: 0.5rem;\n  padding-bottom: 0.5rem;\n}\r\n.px-3 {\n  padding-left: 0.75rem;\n  padding-right: 0.75rem;\n}\r\n.text-center {\n  text-align: center;\n}\r\n.text-start {\n  text-align: start;\n}\r\n.text-sm {\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n}\r\n.text-lg {\n  font-size: 1.125rem;\n  line-height: 1.75rem;\n}\r\n.text-4xl {\n  font-size: 2.25rem;\n  line-height: 2.5rem;\n}\r\n.font-semibold {\n  font-weight: 600;\n}\r\n.font-bold {\n  font-weight: 700;\n}\r\n.uppercase {\n  text-transform: uppercase;\n}\r\n.capitalize {\n  text-transform: capitalize;\n}\r\n.text-slate-800 {\n  --tw-text-opacity: 1;\n  color: rgb(30 41 59 / var(--tw-text-opacity));\n}\r\n.text-slate-700 {\n  --tw-text-opacity: 1;\n  color: rgb(51 65 85 / var(--tw-text-opacity));\n}\r\n.text-gray-800 {\n  --tw-text-opacity: 1;\n  color: rgb(31 41 55 / var(--tw-text-opacity));\n}\r\n.text-gray-700 {\n  --tw-text-opacity: 1;\n  color: rgb(55 65 81 / var(--tw-text-opacity));\n}\r\n.text-zinc-800 {\n  --tw-text-opacity: 1;\n  color: rgb(39 39 42 / var(--tw-text-opacity));\n}\r\n.text-zinc-700 {\n  --tw-text-opacity: 1;\n  color: rgb(63 63 70 / var(--tw-text-opacity));\n}\r\n.text-neutral-800 {\n  --tw-text-opacity: 1;\n  color: rgb(38 38 38 / var(--tw-text-opacity));\n}\r\n.text-neutral-700 {\n  --tw-text-opacity: 1;\n  color: rgb(64 64 64 / var(--tw-text-opacity));\n}\r\n.text-stone-800 {\n  --tw-text-opacity: 1;\n  color: rgb(41 37 36 / var(--tw-text-opacity));\n}\r\n.text-stone-700 {\n  --tw-text-opacity: 1;\n  color: rgb(68 64 60 / var(--tw-text-opacity));\n}\r\n.text-red-800 {\n  --tw-text-opacity: 1;\n  color: rgb(153 27 27 / var(--tw-text-opacity));\n}\r\n.text-red-700 {\n  --tw-text-opacity: 1;\n  color: rgb(185 28 28 / var(--tw-text-opacity));\n}\r\n.text-orange-800 {\n  --tw-text-opacity: 1;\n  color: rgb(154 52 18 / var(--tw-text-opacity));\n}\r\n.text-orange-700 {\n  --tw-text-opacity: 1;\n  color: rgb(194 65 12 / var(--tw-text-opacity));\n}\r\n.text-amber-800 {\n  --tw-text-opacity: 1;\n  color: rgb(146 64 14 / var(--tw-text-opacity));\n}\r\n.text-amber-700 {\n  --tw-text-opacity: 1;\n  color: rgb(180 83 9 / var(--tw-text-opacity));\n}\r\n.text-yellow-800 {\n  --tw-text-opacity: 1;\n  color: rgb(133 77 14 / var(--tw-text-opacity));\n}\r\n.text-yellow-700 {\n  --tw-text-opacity: 1;\n  color: rgb(161 98 7 / var(--tw-text-opacity));\n}\r\n.text-lime-800 {\n  --tw-text-opacity: 1;\n  color: rgb(63 98 18 / var(--tw-text-opacity));\n}\r\n.text-lime-700 {\n  --tw-text-opacity: 1;\n  color: rgb(77 124 15 / var(--tw-text-opacity));\n}\r\n.text-green-800 {\n  --tw-text-opacity: 1;\n  color: rgb(22 101 52 / var(--tw-text-opacity));\n}\r\n.text-green-700 {\n  --tw-text-opacity: 1;\n  color: rgb(21 128 61 / var(--tw-text-opacity));\n}\r\n.text-emerald-800 {\n  --tw-text-opacity: 1;\n  color: rgb(6 95 70 / var(--tw-text-opacity));\n}\r\n.text-emerald-700 {\n  --tw-text-opacity: 1;\n  color: rgb(4 120 87 / var(--tw-text-opacity));\n}\r\n.text-teal-800 {\n  --tw-text-opacity: 1;\n  color: rgb(17 94 89 / var(--tw-text-opacity));\n}\r\n.text-teal-700 {\n  --tw-text-opacity: 1;\n  color: rgb(15 118 110 / var(--tw-text-opacity));\n}\r\n.text-cyan-800 {\n  --tw-text-opacity: 1;\n  color: rgb(21 94 117 / var(--tw-text-opacity));\n}\r\n.text-cyan-700 {\n  --tw-text-opacity: 1;\n  color: rgb(14 116 144 / var(--tw-text-opacity));\n}\r\n.text-sky-800 {\n  --tw-text-opacity: 1;\n  color: rgb(7 89 133 / var(--tw-text-opacity));\n}\r\n.text-sky-700 {\n  --tw-text-opacity: 1;\n  color: rgb(3 105 161 / var(--tw-text-opacity));\n}\r\n.text-blue-800 {\n  --tw-text-opacity: 1;\n  color: rgb(30 64 175 / var(--tw-text-opacity));\n}\r\n.text-blue-700 {\n  --tw-text-opacity: 1;\n  color: rgb(29 78 216 / var(--tw-text-opacity));\n}\r\n.text-indigo-800 {\n  --tw-text-opacity: 1;\n  color: rgb(55 48 163 / var(--tw-text-opacity));\n}\r\n.text-indigo-700 {\n  --tw-text-opacity: 1;\n  color: rgb(67 56 202 / var(--tw-text-opacity));\n}\r\n.text-violet-800 {\n  --tw-text-opacity: 1;\n  color: rgb(91 33 182 / var(--tw-text-opacity));\n}\r\n.text-violet-700 {\n  --tw-text-opacity: 1;\n  color: rgb(109 40 217 / var(--tw-text-opacity));\n}\r\n.text-purple-800 {\n  --tw-text-opacity: 1;\n  color: rgb(107 33 168 / var(--tw-text-opacity));\n}\r\n.text-purple-700 {\n  --tw-text-opacity: 1;\n  color: rgb(126 34 206 / var(--tw-text-opacity));\n}\r\n.text-fuchsia-800 {\n  --tw-text-opacity: 1;\n  color: rgb(134 25 143 / var(--tw-text-opacity));\n}\r\n.text-fuchsia-700 {\n  --tw-text-opacity: 1;\n  color: rgb(162 28 175 / var(--tw-text-opacity));\n}\r\n.text-pink-800 {\n  --tw-text-opacity: 1;\n  color: rgb(157 23 77 / var(--tw-text-opacity));\n}\r\n.text-pink-700 {\n  --tw-text-opacity: 1;\n  color: rgb(190 24 93 / var(--tw-text-opacity));\n}\r\n.text-rose-800 {\n  --tw-text-opacity: 1;\n  color: rgb(159 18 57 / var(--tw-text-opacity));\n}\r\n.text-rose-700 {\n  --tw-text-opacity: 1;\n  color: rgb(190 18 60 / var(--tw-text-opacity));\n}\r\n.text-gray-500 {\n  --tw-text-opacity: 1;\n  color: rgb(107 114 128 / var(--tw-text-opacity));\n}\r\n.text-gray-600 {\n  --tw-text-opacity: 1;\n  color: rgb(75 85 99 / var(--tw-text-opacity));\n}\r\n.shadow {\n  --tw-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);\n  --tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}\r\n.shadow-xl {\n  --tw-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);\n  --tw-shadow-colored: 0 20px 25px -5px var(--tw-shadow-color), 0 8px 10px -6px var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}\r\n.filter {\n  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);\n}\r\n\r\n\r\n[data-sort-direction]{\r\n    width: 9px;\r\n    cursor: pointer;\r\n}\r\n[data-sort-direction] path {\r\n    fill:darkgray\r\n}\r\n[data-sort-direction][active] path {\r\n    fill:rgb(90, 90, 90)\r\n}\r\n[data-sort-direction=\"desc\"] {\r\n    transform: rotate(180deg);\r\n}\r\n[data-type=\"filter\"] {\r\n  width: 18px;\r\n  cursor: pointer;\r\n}\r\n[data-type=\"filter\"] path {\r\n  fill:rgb(90, 90, 90)\r\n}\r\n\r\n* {\r\n    box-sizing: border-box;\r\n}\r\n\r\n::-webkit-scrollbar {\r\n  width: 4px ;\r\n  height: 4px;\r\n}\r\n\r\n::-webkit-scrollbar-track {\r\n  background: #ececec;\r\n  border-radius: 20px;\r\n}\r\n\r\n::-webkit-scrollbar-thumb {\r\n  background:darkgray;\r\n  border-radius: 20px;\r\n}\r\n\r\n::-webkit-scrollbar-thumb:hover {\r\n  background: gray;\r\n}\r\n\r\n.odd\\:bg-white:nth-child(odd) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(255 255 255 / var(--tw-bg-opacity));\n}", "",{"version":3,"sources":["webpack://./src/styles/main.css","<no source>"],"names":[],"mappings":"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AAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,mBAAmB;EAAnB;AAAmB;AAAnB;EAAA,qBAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,mBAAmB;EAAnB;AAAmB;AAAnB;EAAA,mBAAmB;EAAnB;AAAmB;AAAnB;EAAA,kBAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,oBAAmB;EAAnB;AAAmB;AAAnB;EAAA,0EAAmB;EAAnB,8FAAmB;EAAnB;AAAmB;AAAnB;EAAA,gFAAmB;EAAnB,oGAAmB;EAAnB;AAAmB;AAAnB;EAAA;AAAmB;;;AAGnB;IACI,UAAU;IACV,eAAe;AACnB;AACA;IACI;AACJ;AACA;IACI;AACJ;AACA;IACI,yBAAyB;AAC7B;AACA;EACE,WAAW;EACX,eAAe;AACjB;AACA;EACE;AACF;;AAEA;IACI,sBAAsB;AAC1B;;AAEA;EACE,WAAW;EACX,WAAW;AACb;;AAEA;EACE,mBAAmB;EACnB,mBAAmB;AACrB;;AAEA;EACE,mBAAmB;EACnB,mBAAmB;AACrB;;AAEA;EACE,gBAAgB;AAClB;;AA/CA;EAAA,mBCAA;EDAA;CCAA","sourcesContent":["@tailwind base;\r\n@tailwind components;\r\n@tailwind utilities;\r\n\r\n\r\n[data-sort-direction]{\r\n    width: 9px;\r\n    cursor: pointer;\r\n}\r\n[data-sort-direction] path {\r\n    fill:darkgray\r\n}\r\n[data-sort-direction][active] path {\r\n    fill:rgb(90, 90, 90)\r\n}\r\n[data-sort-direction=\"desc\"] {\r\n    transform: rotate(180deg);\r\n}\r\n[data-type=\"filter\"] {\r\n  width: 18px;\r\n  cursor: pointer;\r\n}\r\n[data-type=\"filter\"] path {\r\n  fill:rgb(90, 90, 90)\r\n}\r\n\r\n* {\r\n    box-sizing: border-box;\r\n}\r\n\r\n::-webkit-scrollbar {\r\n  width: 4px ;\r\n  height: 4px;\r\n}\r\n\r\n::-webkit-scrollbar-track {\r\n  background: #ececec;\r\n  border-radius: 20px;\r\n}\r\n\r\n::-webkit-scrollbar-thumb {\r\n  background:darkgray;\r\n  border-radius: 20px;\r\n}\r\n\r\n::-webkit-scrollbar-thumb:hover {\r\n  background: gray;\r\n}",null],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";

      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }

      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }

      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }

      content += cssWithMappingToString(item);

      if (needLayer) {
        content += "}";
      }

      if (item[2]) {
        content += "}";
      }

      if (item[4]) {
        content += "}";
      }

      return content;
    }).join("");
  }; // import a list of modules into the list


  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }

      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }

      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }

      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {



module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];

  if (!cssMapping) {
    return content;
  }

  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || "").concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join("\n");
  }

  return [content].join("\n");
};

/***/ }),

/***/ "./src/styles/main.css":
/*!*****************************!*\
  !*** ./src/styles/main.css ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_postcss_loader_dist_cjs_js_main_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/postcss-loader/dist/cjs.js!./main.css */ "./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/dist/cjs.js!./src/styles/main.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_postcss_loader_dist_cjs_js_main_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_postcss_loader_dist_cjs_js_main_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_postcss_loader_dist_cjs_js_main_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_postcss_loader_dist_cjs_js_main_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {



var stylesInDOM = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };

    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);

  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }

      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };

  return updater;
}

module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();

        stylesInDOM.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {



var memo = {};
/* istanbul ignore next  */

function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }

    memo[target] = styleTarget;
  }

  return memo[target];
}
/* istanbul ignore next  */


function insertBySelector(insert, style) {
  var target = getTarget(insert);

  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }

  target.appendChild(style);
}

module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}

module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;

  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}

module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";

  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }

  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }

  var needLayer = typeof obj.layer !== "undefined";

  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }

  css += obj.css;

  if (needLayer) {
    css += "}";
  }

  if (obj.media) {
    css += "}";
  }

  if (obj.supports) {
    css += "}";
  }

  var sourceMap = obj.sourceMap;

  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  options.styleTagTransform(css, styleElement, options.options);
}

function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }

  styleElement.parentNode.removeChild(styleElement);
}
/* istanbul ignore next  */


function domAPI(options) {
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}

module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }

    styleElement.appendChild(document.createTextNode(css));
  }
}

module.exports = styleTagTransform;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlTable": () => (/* reexport safe */ _modules_Table__WEBPACK_IMPORTED_MODULE_1__.HtmlTable),
/* harmony export */   "JsonTable": () => (/* reexport safe */ _modules_Table__WEBPACK_IMPORTED_MODULE_1__.JsonTable)
/* harmony export */ });
/* harmony import */ var _styles_main_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./styles/main.css */ "./src/styles/main.css");
/* harmony import */ var _modules_Table__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/Table */ "./src/modules/Table.js");


document.querySelectorAll(`[${_modules_Table__WEBPACK_IMPORTED_MODULE_1__.HtmlTable.attributes.tableContainer}]`).forEach(table => {
  table.tableInstance = new _modules_Table__WEBPACK_IMPORTED_MODULE_1__.HtmlTable(table);
});

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=development.bundle.js.map