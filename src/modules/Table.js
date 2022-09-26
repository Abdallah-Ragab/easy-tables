import { tableTemplates } from "./htmlTemplates"
class Table {
    static attributes = {
        tableContainer : "table-container",
        enableSelect : "select",
        enableSort : "sort",
        customDataContainer: "data-container",
        notData: "non-data",
        rowID: "row-id",
        uniqueIDIndex: "unique-identifier-index",
        columnUniqueID: "unique-identifier",
    }
    static htmlTemplates = tableTemplates
    initiateEvents(){
        // Sorting buttons events
        if (this.enableSort){
            this.tableElement.querySelectorAll('[data-sort-direction]').forEach((el => {
                var direction = el.dataset.sortDirection
                el.addEventListener('click', e => {
                    this.tableElement.querySelectorAll('[data-sort-direction][active]').forEach(element => {element.removeAttribute('active')})
                    el.setAttribute('active', '')
                    var element = e.target.closest('th')
                    var elementIdx = Array.from(element.parentNode.children).indexOf(element)
                    this.sortTable(elementIdx, direction)
                })
            }))
        }
        // Selecting checkboxes events
        if (this.enableSelect){
            this.bodyCheckboxes = this.tableDataObject.body.rows.map(row => 
                row.element.querySelector('th:first-child input[type="checkbox"], td:first-child input[type="checkbox"]')
            )
            this.bodyCheckboxes.forEach(checkbox => {
                checkbox.addEventListener('change', e => {
                    let target = e.target
                    this.selectRows(target, false)
                })
            })
            this.headCheckbox = this.tableDataObject.head.element.querySelector('th:first-child input[type="checkbox"], td:first-child input[type="checkbox"]')
            this.headCheckbox.addEventListener('change', e => {
                let target = e.target
                this.selectRows(target, true)
            })
        }
    }
    readPrimaryHtmlElements(){
        this.tableWrapperElement.tableInstance = this
        this.tableElement = this.tableWrapperElement.querySelector('table')
        this.headElement = this.tableElement.tHead.rows[0]
        this.headColumnsElements = Array.from(this.tableElement.tHead.rows[0].children)
        this.bodyElement = this.tableElement.tBodies[0]
        this.bodyRowsElements = Array.from(this.tableElement.tBodies[0].rows)
    }

    extractDataFromHtml(){
        const headElement = this.headElement
        const headColumnsElements = this.headColumnsElements
        const headColumnsObjects = headColumnsElements.map((columnElement, columnID) => this.constructHeadColumnObject(columnElement, columnID))
        const headDataObject = {
            element: headElement,
            columns: headColumnsObjects
        }
        this.headDataObject = headDataObject

        const bodyRowsElements = this.bodyRowsElements
        const bodyRowsObjects = bodyRowsElements.map((rowElement, rowID) => this.constructBodyRowObject(rowElement, rowID))
        const bodyDataObject = {
            rows: bodyRowsObjects
        }
        this.bodyDataObject = bodyDataObject

        const tableDataObject = {
            head: headDataObject,
            body: bodyDataObject
        }
        return tableDataObject
    }
    constructHeadColumnObject(columnElement, columnID){

        var isNotDataCol = columnElement.hasAttribute(this.constructor.attributes.notData) || (columnID in this.ignoredColumns)
        return {
            ID: columnID,
            element: columnElement,
            hasData: isNotDataCol ? false : true,
            Value: isNotDataCol ? null : this.extractColumnData(columnElement, columnID)
        }
    }
    extractColumnData(columnElement, columnID){
        if (this.htmlInitialized) {
            let customDataContainer = columnElement.querySelector(`[${this.constructor.attributes.customDataContainer}]`)
            var dataContainerElement = (customDataContainer == null) ? columnElement : customDataContainer

        } else if (this.customHeadSelector && this.customHeadSelector.hasOwnProperty(columnID)){
            var dataContainerElement = columnElement.querySelector(this.customHeadSelector[columnID]) 
        } else {
            var dataContainerElement = columnElement
        }
        return dataContainerElement.textContent
    }
    constructBodyRowObject(rowElement, rowID){
        const rowCellsElements = Array.from(rowElement.children).filter(el => {
            const tagName = el.tagName
            return (tagName === "TH" || tagName === "TD")
        })
        const RowCellsObjects = rowCellsElements.map((cell, idx) => {
            const columnHead = this.headDataObject.columns.find(col => col.ID === idx)
            const isDataCell = columnHead.hasData

            return {
                ID: idx,
                element: cell,
                hasData: isDataCell,
                Value: isDataCell ? this.extractCellData(cell, idx) : null
            }
        })

        return {
            ID: rowID,
            selected: false,
            element: rowElement,
            cells: RowCellsObjects
        }
    }
    extractCellData(cellElement, cellID){
        if (this.htmlInitialized) {
            let customDataContainer = cellElement.querySelector(`[${this.constructor.attributes.customDataContainer}]`)
            var dataContainerElement = (customDataContainer == null) ? cellElement : dataContainerElement
        } else if (this.customBodySelector && this.customBodySelector.hasOwnProperty(cellID)){
            var dataContainerElement = cellElement.querySelector(this.customHeadSelector[cellID]) 
        } else {
            var dataContainerElement = cellElement
        }
        return dataContainerElement.textContent
    }

    // Sorting functionality
    sortTable(sortByID, sortDirection){
        this.sortData(sortByID, sortDirection)
        this.reorderRows()
    }
    sortData(sortByID, sortDirection){
        let sortedRows = Array.from(this.tableDataObject.body.rows).sort((a, b) => {
            var aValue = a.cells.find(cell => cell.ID === sortByID).Value 
            var bValue = b.cells.find(cell => cell.ID === sortByID).Value

            aValue = isNaN(aValue) ? aValue.toLowerCase() : parseFloat(aValue)
            bValue = isNaN(bValue) ? bValue.toLowerCase() : parseFloat(bValue)
            
            if(sortDirection == 'asc'){
                if ( aValue < bValue){
                    return -1;
                    }
                else if ( aValue > bValue){
                    return 1;
                    }
                else return 0;
            }
            else{
                if ( aValue > bValue){
                    return -1;
                    }
                else if ( aValue < bValue){
                    return 1;
                    }
                else return 0;
            }
        })
        sortedRows = sortedRows.map((row, idx) => {row.ID = idx; return row})
        this.tableDataObject.body.rows = sortedRows
    }
    reorderRows(){
        const rows = this.tableDataObject.body.rows.map(row => row.element) 
        this.bodyElement.replaceChildren(...rows)
    }
        
    // Selecting functionality
    selectRows(target, inHead){
        const checked = target.checked
        const parentRow = target.closest('tr')
        const rowID = this.tableDataObject.body.rows.map(row => row.element).indexOf(parentRow)


        if (!inHead){
            if(checked){
                this.updateSelectedRows('add', rowID)
            }
            else{
                this.updateSelectedRows('remove', rowID)
            }
        } else {
            if(checked){
                this.updateSelectedRows('all')
            } else {
                this.updateSelectedRows('none')
            }
        }
    }
    updateSelectedRows(operation, rowID=null){
        switch(operation){
            case "all":
                this.tableDataObject.body.rows.forEach(row => {row.selected = true})
                this.bodyCheckboxes.forEach(checkbox => checkbox.checked = true)
                break
            case "none":
                this.tableDataObject.body.rows.forEach(row => {row.selected = false})
                this.bodyCheckboxes.forEach(checkbox => checkbox.checked = false)
                break
            case "add":
                this.tableDataObject.body.rows.find(row => row.ID === rowID).selected = true
                break
            case "remove":
                this.tableDataObject.body.rows.find(row => row.ID === rowID).selected = false
                break
        }
        this.headCheckbox.checked = this.tableDataObject.body.rows.every(row => row.selected) 
    }
    getUniqueIdentifiers(){
        const uniqueIDIndexAttribute = this.constructor.attributes.uniqueIDIndex
        const uniqueIDColumnAttribute = this.constructor.attributes.columnUniqueID
        const rowIDAttribute = this.constructor.attributes.rowID
        
        if (this.htmlInitialized){
            // If the table is initialized using inline html attributes
            var hasUniqueIDByIndex = this.tableWrapperElement.hasAttribute(uniqueIDIndexAttribute)
            var _uniqueIDIndex = hasUniqueIDByIndex ? this.tableWrapperElement.getAttribute(uniqueIDIndexAttribute) : null
            
            var UniqueIDColumn = this.headElement.querySelector(`[${uniqueIDColumnAttribute}]`)
            var hasUniqueIDColumn = (UniqueIDColumn !== null)
            var uniqueIDIndex = (this.enableSelect) ? parseInt(_uniqueIDIndex) + 1 : parseInt(_uniqueIDIndex)
            
        }
        else if (this.dataInput) {
            // If the table is initialized using json data object
            var hasUniqueIDByIndex = (this.uniqueIdentifierIndex !== null) 
            var UniqueIDByJson = (this.dataInput.columns.find)
            var hasUniqueIDByJson = (this.dataInput.columns.find)

        } else {
            var hasUniqueIDByIndex = (this.uniqueIdentifierIndex !== null) 
            var _uniqueIDIndex = this.uniqueIdentifierIndex
            if(!hasUniqueIDByIndex){
                console.error(`Missing parameter 'uniqueIdentifierIndex' at '${this.constructor.name}' initialization: the parameter is essential to differentiate the rows by a unique value.`)
            }
            var uniqueIDIndex = (this.enableSelect) ? parseInt(_uniqueIDIndex) + 1 : parseInt(_uniqueIDIndex)
        }

        

        if (hasUniqueIDByIndex) {
            if (Number.isInteger(uniqueIDIndex)) {
                this.tableDataObject.body.rows = Array.from(this.tableDataObject.body.rows).map(row => {
                    const uniqueIDExists = !(row.cells.find(cell => cell.ID === uniqueIDIndex) === undefined)
                    if (uniqueIDExists){
                        row.uniqueID = row.cells.find(cell => cell.ID === uniqueIDIndex).Value
                    } else {
                        console.error(`Invalid Index '${uniqueIDIndexAttribute}': No column found with the index of '${_uniqueIDIndex}'.`)
                    }

                    return row
                })
                return
            } else {
                console.error(`invalid attribute value: the value of '${uniqueIDIndexAttribute}' must be a number. at the table container.`)
            }
        }
        if (this.htmlInitialized) {
            if (hasUniqueIDColumn) {
                const uniqueIDColumnIndex = Array.from(this.headElement.children).indexOf(UniqueIDColumn)
    
                this.tableDataObject.body.rows = Array.from(this.tableDataObject.body.rows).map(row => {
                    row.uniqueID = row.cells.find(cell => cell.ID === uniqueIDColumnIndex).Value
                    return row
                })
            } else {
                this.tableDataObject.body.rows = Array.from(this.tableDataObject.body.rows).map(row => {
                    if (row.element.hasAttribute(rowIDAttribute)) {
                        row.uniqueID = row.element.getAttribute(rowIDAttribute)
                    } else {
                        console.error(`Missing attribute '${rowIDAttribute}': body row with index ${row.ID} is missing a unique id`)
                        row.uniqueID = null
                    }
                    return row
                })
            }
        }
    }
    getSelectedRows(){
        return this.tableDataObject.body.rows.filter(row => row.selected).map(row => row.uniqueID)
    }
}
export class HtmlTable extends Table{
    constructor (
        wrapper = null,
        uniqueIdentifierIndex = null,
        ignoredColumns = [],
        customHeadSelector = null,
        customBodySelector = null,
        enableSort = true,
        enableSelect = true
        ) {
        super()
        this.tableWrapper = wrapper
        this.uniqueIdentifierIndex = uniqueIdentifierIndex
        this.ignoredColumns = ignoredColumns
        this.customHeadSelector = customHeadSelector
        this.customBodySelector = customBodySelector
        this.enableSort = enableSort
        this.enableSelect = enableSelect

        this.initiate()
    }
    initiate(){
        if(typeof(this.tableWrapper) === "string"){
            this.htmlInitialized = false
        } else {
            this.htmlInitialized = true
        }
        this.readPrimaryHtmlElements()
        this.readInlineProperties()
        if(this.enableSelect){
            this.renderSelect()
            this.readPrimaryHtmlElements()
            this.ignoredColumns.push(0)
        }
        this.tableDataObject = this.extractDataFromHtml()
        if(this.enableSort){
            this.renderSort()
        }
        if(this.enableSelect){
            this.getUniqueIdentifiers()
        }
        this.initiateEvents()
    }
    readInlineProperties(){
        if(this.htmlInitialized){
            this.enableSort = this.tableWrapperElement.hasAttribute(this.constructor.attributes.enableSort)
            this.enableSelect = this.tableWrapperElement.hasAttribute(this.constructor.attributes.enableSelect)
        }
    }
    readPrimaryHtmlElements(){
        if(this.htmlInitialized){
            this.tableWrapperElement = this.tableWrapper
        } else {
            this.tableWrapperElement = document.querySelector(this.tableWrapper)
        }
        super.readPrimaryHtmlElements()
    }
    renderSelect(){
        const headRow = this.headElement
        const bodyRows = this.bodyRowsElements
        const allRows = [...bodyRows, headRow]
        allRows.forEach(row => {
            row.insertAdjacentHTML("afterbegin", this.constructor.htmlTemplates.transparentSelect)
        })
    }
    renderSort(){
        this.headDataObject.columns.forEach((column, index) => {
            if (column.hasData){
                const columnInnerHtml = column.element.innerHTML
                const columnContent = `<div class="flex justify-between items-center space-x-2"><div head-column-content>${columnInnerHtml}</div>${this.constructor.htmlTemplates.headSort}</div>`
                column.element.replaceChildren();
                column.element.insertAdjacentHTML("beforeend", columnContent)
                
            }
        })
    }
}

export class JsonTable extends Table{
    constructor (
        wrapper = null,
        data = null,
        uniqueIdentifierIndex = null,
        ignoredColumns = [],
        enableSort = true,
        enableSelect = true,
        ) {
        super()
        this.tableWrapper = wrapper
        this.dataInput = data
        this.uniqueIdentifierIndex = uniqueIdentifierIndex
        this.ignoredColumns = ignoredColumns
        this.enableSort = enableSort
        this.enableSelect = enableSelect

        this.initiate()
    }
    initiate(){
        if(typeof(this.tableWrapper) === "string"){
            this.tableWrapperElement = document.querySelector(this.tableWrapper)
        } else {
            this.tableWrapperElement = this.tableWrapper
        }

        this.emptyHead = (this.dataInput.columns.length === 0) || (this.dataInput.columns === undefined)
        this.emptyBody = (this.dataInput.rows.length === 0) || (this.dataInput.rows === undefined)
        this.emptyTable = (this.emptyBody && this.emptyHead)

        this.setTableWrapperClasses()
        this.renderTable()
        if (!this.emptyTable){
            this.readPrimaryHtmlElements()
            this.tableDataObject = this.extractDataFromHtml()
            if(this.enableSelect){
                this.getUniqueIdentifiers()
            }
            this.initiateEvents()
        }
    }
    initiateEvents(){
        super.initiateEvents()

        // Filtering button events
        this.tableElement.querySelectorAll('#filter').forEach(filter => {
            let column = filter.closest('th')
            let columnID = Array.from(column.parentNode.children).indexOf(column)
            columnID = this.enableSelect ? columnID-1 : columnID
            let columnFilter = this.dataInput.columns[columnID].hasOwnProperty('filter') ? this.dataInput.columns[columnID].filter : false
            if(Boolean(columnFilter)){
                filter.addEventListener('click', columnFilter)
            }            
        })

        // Button cells events
        if (!this.dataInput) return
        let buttonColumns = this.dataInput.columns.map((col, idx) => {
            if (col.type == "button") return {[idx]: col["callback"]}
        }).filter(callback => callback != undefined)
        this.tableDataObject.body.rows.forEach(row => {
            buttonColumns.forEach(col => {
                let colIndex = this.enableSelect ? parseInt(Object.keys(col)[0])+1 : parseInt(Object.keys(col)[0])
                row.element.children[colIndex].querySelector('[table-button]').addEventListener('click', Object.values(col)[0])
                row.cells[colIndex].element.querySelector('[table-button]').addEventListener('click', Object.values(col)[0])
            })
        })

    }
    setTableWrapperClasses(){
        this.tableWrapperElement.classList.add('overflow-auto', 'border', 'border-gray-150')
        this.tableWrapperElement.classList.add('max-w-full')
    }

    // Creating data object from json created html table 
    extractDataFromJson(){
        let tableData = {
            "keys" : {},
            "rows" : []
        }
        let data = this.dataInput
        let columns = data.columns
        columns.forEach((col, idx) => tableData.keys[idx] = col.text)

        let rowsElements = Array.from(this.tableElement.tBodies[0].rows)
        let rowsData = this.dataInput.rows.map((row, idx) => {
            let rowObj = {"element": rowsElements[idx], "data": {}}
            Object.entries(tableData.keys).forEach((key) => {
                rowObj.data[key[0]] = row[key[1]]
            })
            return rowObj
        })

        tableData.rows = rowsData
        return tableData        
    }
    
    // Building & Rendering a html table from json
    renderTable(bodyLoading, headLoading){
        var tableHtml = this.buildTableHtml(bodyLoading, headLoading)
        this.tableWrapperElement.replaceChildren();
        if(this.emptyTable) {
            const emptyTemplate = this.constructor.htmlTemplates.emptyTablePlaceholder
            this.tableWrapperElement.insertAdjacentHTML('afterbegin', emptyTemplate)
            return
        }      
        this.tableWrapperElement.insertAdjacentHTML('afterbegin', tableHtml)  
        if(this.emptyBody) {
            const emptyTemplate = this.constructor.htmlTemplates.emptyBodyPlaceholder
            this.tableWrapperElement.insertAdjacentHTML('beforeend', emptyTemplate)  
        }      
    }
    buildTableHtml(bodyLoading, headLoading) {
        var theadHtml = this.buildHeadHtml(headLoading)
        var tbodyHtml = this.buildBodyHtml(bodyLoading, headLoading)
        var tableTemplate = this.constructor.htmlTemplates['table']
        var tableHtml = this.evaluateTemplate(tableTemplate, {"thead": theadHtml, "tbody": tbodyHtml})
        return tableHtml
    }
    buildHeadHtml(headLoading){
        if (headLoading){
            return this.constructor.htmlTemplates.headRowProp
        }
        else {
            const headColumnTemplate = this.constructor.htmlTemplates.headColumn
            const headColumns = this.dataInput.columns
    
            const headColumnsHtml = headColumns.map(col => {
                let extras = {}
                if(col.type == 'button'){
                    return this.evaluateTemplate(headColumnTemplate)
                }
                if(col.type == 'image'){
                    col['sort'] = false
                }
                if ((this.enableSort && !col.hasOwnProperty('sort')) || (this.enableSort && col['sort'])) {
                    extras["sort"] = this.evaluateTemplate(this.constructor.htmlTemplates.headSort) 
                }
                if (this.filter && col['filter']) {
                    extras["filter"] = this.evaluateTemplate(this.constructor.htmlTemplates.headFilter) 
                }
                return this.evaluateTemplate(headColumnTemplate, {"text": col.text, ...extras})
            })
    
            if(this.enableSelect) {
                let headSelectTemplate = this.constructor.htmlTemplates.headSelect
                headColumnsHtml.unshift(this.evaluateTemplate(headSelectTemplate))
            }
    
            const headRowHtml = headColumnsHtml.join('')
            const theadTemplate = this.constructor.htmlTemplates.headRow
            const theadHtml = this.evaluateTemplate(theadTemplate, {"row": headRowHtml})
    
            return theadHtml
        }
    }
    buildBodyHtml(bodyLoading, headLoading){
        if (bodyLoading){
            if (headLoading){
                var columnsCount = 3
                var rowsCount = 5
            } else {
                var rowsCount = this.dataInput.rows.length
                var columnsCount = this.dataInput.columns.length
            }
            const tbodyArray = [...Array(rowsCount)].map(() => {
                const propRowTemplate = this.constructor.htmlTemplates.bodyRowProp
                const propCellTemplate = this.constructor.htmlTemplates.bodyCellProp
                const propCellsHtmlArray = [...Array(columnsCount)].map(()=>{
                    return propCellTemplate
                })
                if(this.enableSelect && !headLoading) { propCellsHtmlArray.unshift(this.evaluateTemplate(this.constructor.htmlTemplates['rowSelect'])) }
                const propCellsHtml = propCellsHtmlArray.join("")
                return this.evaluateTemplate(propRowTemplate, {"row": propCellsHtml})
            })
            var tBodyHtml = tbodyArray.join("")
        }
        else {
            const bodyRows = this.dataInput.rows
            var tBodyHtml = bodyRows.map(row => {
                const rowCells = this.dataInput.columns 
                const rowCellsHtmlArray = rowCells.map(cell => {
                    let cellValue = row[cell.text]
                    const cellType = cell.hasOwnProperty('type') ? cell.type : 'text'
                    const cellExtras = {}
                    const cellTemplate = this.constructor.htmlTemplates.bodyCell[cellType]
                    if (cell.colorCode) {
                        cellValue = cellValue.toLowerCase()
                        const conditionsDictionary = {'equal': '==='}
                        cell.colorCode.some((cond) => {
                            if(eval("'" + cellValue + "'" + conditionsDictionary[cond.condition] + "'" + cond.value.toLowerCase() + "'")){
                                cellExtras['color'] = cond.color
                                return true
                            }
                        }) 
                    }
                    if(cell.type == 'button'){
                        cellExtras['color'] = cell.color
                        cellExtras['text'] = cell.text
                    }
                    const cellHtml = this.evaluateTemplate(cellTemplate, {"text": cellValue, ...cellExtras})
                    return cellHtml
                })
                if(this.enableSelect) {
                    rowCellsHtmlArray.unshift(this.evaluateTemplate(this.constructor.htmlTemplates['rowSelect']))
                }
                const rowCellsHtml = rowCellsHtmlArray.join('')
                const rowTemplate = this.constructor.htmlTemplates.bodyRow
                const rowHtml = this.evaluateTemplate(rowTemplate, {"row": rowCellsHtml})
                return rowHtml
            }).join('')
        }
        return tBodyHtml
    }
    evaluateTemplate(template, args = {}){
        var variables = template.match(/(?<=\$\{data\[['"])[\w]*(?=['"]\]\})/gi)
        if(!variables) return template
        var data = {}
        variables.forEach(variable => {
            if (args.hasOwnProperty(variable)) {data[variable] = args[variable]} else {data[variable] = ''}
        })
        var evaluated = eval("`" + template + "`")
        return evaluated
    }

    // Loading
    loadingBody(){
        this.renderTable(true)
    }
    loadingTable(){
        this.renderTable(true, true)
    }
} 