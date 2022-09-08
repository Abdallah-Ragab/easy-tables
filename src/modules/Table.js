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
    static htmlTemplates = {
        "table" : `
            <table class='min-w-full rounded border-gray-700 bg-gray-50'>
                <thead>\${data['thead']}</thead>
                <tbody class='odd:bg-white even:bg-slate'>\${data['tbody']}</tbody>
            </table>
            `,
        "headRow" : `
        <tr class="bg-gray-200 whitespace-nowrap text-gray-700 font-semibold capitalize sticky -top-1 z-10">\${data['row']}</tr>
        `,
        "headSelect" : `<th non-data class=" sticky -left-px shadow bg-gray-200 shadow-xl text-start px-4 py-1 z-10"><input type="checkbox"></th>`,
        "transparentSelect" : `<th non-data><input type="checkbox"></th>`,
        "headSort" : `
        <div class="flex flex-col space-y-0.5">
            <svg data-sort-direction="asc"  xmlns="http://www.w3.org/2000/svg" viewBox="-143.066 -107.05 286.1 167.1">
                <path d="M 119 60 H -119 c -21.4 0 -32.1 -25.9 -17 -41 L -17 -100 c 9.4 -9.4 24.6 -9.4 33.9 0 l 119 119 c 15.2 15.1 4.5 41 -16.9 41 z" fill="#000000"/>
            </svg>
            <svg data-sort-direction="desc" xmlns="http://www.w3.org/2000/svg" viewBox="-143.066 -107.05 286.1 167.1" style="transform: rotate(180deg);">
                <path d="M 119 60 H -119 c -21.4 0 -32.1 -25.9 -17 -41 L -17 -100 c 9.4 -9.4 24.6 -9.4 33.9 0 l 119 119 c 15.2 15.1 4.5 41 -16.9 41 z" fill="#000000"/>
            </svg>
        </div>`,
        "headFilter" : `
        <div data-type="filter">
            <svg xmlns="http://www.w3.org/2000/svg" x="0" y="0" viewBox="0 0 459 459" style="enable-background:new 0 0 512 512" xml:space="preserve">
                <path d="M178.5,382.5h102v-51h-102V382.5z M0,76.5v51h459v-51H0z M76.5,255h306v-51h-306V255z" fill="#000000" data-original="#000000"></path>
            </svg>
         </div>`,
        "headColumn" : `
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
            "bodyRow" : `<tr class="border-b border-gray-150 whitespace-nowrap text-gray-500 text-sm">\${data['row']}</tr>`,
            "bodyCell" : {
                "text" : `
                    <td class="px-4 py-2">\${data['text']}</td>`,
                "bold" : `
                    <td class="px-4 py-2 text-gray-700 font-bold">\${data['text']}</td>`,
                "image" : `
                    <td non-data class="px-4 py-2 text-gray-700 font-bold"><img table-image class="w-12 h-12 border rounded-full" src="\${data['text']}"></td>`,
                "label" : `
                    <td non-data class="px-4 py-2"><div table-label class="bg-\${data['color']}-100 text-\${data['color']}-700 rounded shadow w-fit text-center font-semibold px-3 py-1">\${data['text']}</div></td>`,
                "button" : `
                <td non-data class="px-4 py-2"><span table-button class="text-\${data['color']}-800 font-bold hover:text-\${data['color']}-700 cursor-pointer capitalize">\${data['text']}</span></td>`
            },
            "rowSelect" : `<td non-data class="sticky -left-px bg-white px-4 py-2"><input type="checkbox"></td>`,
    }
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

        console.log(this.getSelectedRows())
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
            var hasUniqueIDByIndex = this.tableWrapperElement.hasAttribute(uniqueIDIndexAttribute)
            var uniqueIDIndex = hasUniqueIDByIndex ? this.tableWrapperElement.getAttribute(uniqueIDIndexAttribute) : null
            
            var UniqueIDColumn = this.headElement.querySelector(`[${uniqueIDColumnAttribute}]`)
            var hasUniqueIDColumn = (UniqueIDColumn !== null)
        } else {
            var hasUniqueIDByIndex = (this.uniqueIdentifierIndex !== null)
            var uniqueIDIndex = this.uniqueIdentifierIndex
            console.log(this.uniqueIdentifierIndex)
            console.log(hasUniqueIDByIndex)
            console.log(uniqueIDIndex)
            if(!hasUniqueIDByIndex){
                console.error(`Missing parameter 'uniqueIdentifierIndex' at '${this.constructor.name}' initialization: the parameter is essential to differentiate the rows by a unique value.`)
            }
        }

        uniqueIDIndex = (this.enableSelect) ? parseInt(uniqueIDIndex) + 1 : parseInt(uniqueIDIndex)
        

        if (hasUniqueIDByIndex) {
            if (Number.isInteger(uniqueIDIndex)) {
                this.tableDataObject.body.rows = Array.from(this.tableDataObject.body.rows).map(row => {
                    row.uniqueID = row.cells.find(cell => cell.ID === uniqueIDIndex).Value
                    return row
                })
                return
            } else {
                console.error(`invalid attribute value: the value of '${uniqueIDIndexAttribute}' must be a number. at the table container.`)
            }
        }
        if (!this.htmlInitialized) {return}
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
        this.initiateEvents()
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
        console.log(this.tableDataObject)
        if(this.enableSort){
            this.renderSort()
        }
        if(this.enableSelect){
            this.getUniqueIdentifiers()
        }
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
        enableSelect = true
        ) {
        super()
        this.tableWrapper = wrapper
        this.dataInput = data
        this.uniqueIdentifierIndex = uniqueIdentifierIndex
        console.log(uniqueIdentifierIndex)
        console.log(this.uniqueIdentifierIndex)
        this.ignoredColumns = ignoredColumns
        this.enableSort = enableSort
        this.enableSelect = enableSelect

        this.initiate()
        this.initiateEvents()
    }
    initiate(){
        if(typeof(this.tableWrapper) === "string"){
            this.tableWrapperElement = document.querySelector(this.tableWrapper)
        } else {
            this.tableWrapperElement = this.tableWrapper
        }
        this.renderTable()
        this.readPrimaryHtmlElements()
        this.setTableWrapperClasses()
        this.tableDataObject = this.extractDataFromHtml
        ()
        console.log(this.tableDataObject)
        // if(this.enableSelect){
        //     this.renderSelect()
        //     this.readPrimaryHtmlElements()
        //     this.ignoredColumns.push(0)
        // }
        // this.tableDataObject = this.extractDataFromHtml()
        // if(this.enableSort){
        //     this.renderSort()
        // }
        if(this.enableSelect){
            this.getUniqueIdentifiers()
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
    renderTable(){
        var tableHtml = this.buildTableHtml()
        this.tableWrapperElement.insertAdjacentHTML('afterbegin', tableHtml)        
    }
    buildTableHtml() {
        var theadHtml = this.buildHeadHtml()
        var tbodyHtml = this.buildBodyHtml()
        var tableTemplate = Table.htmlTemplates['table']
        var tableHtml = this.evaluateTemplate(tableTemplate, {"thead": theadHtml, "tbody": tbodyHtml})
        return tableHtml
    }
    buildHeadHtml(){
        let headColumnTemplate = Table.htmlTemplates['headColumn']
        let headColumns = this.dataInput.columns

        let headColumnsHtml = headColumns.map(col => {
            let extras = {}
            if(col.type == 'button'){
                return this.evaluateTemplate(headColumnTemplate)
            }
            if ((this.enableSort && !col.hasOwnProperty('sort')) || (this.enableSort && col['sort'])) {
                extras["sort"] = this.evaluateTemplate(Table.htmlTemplates['headSort']) 
            }
            if (this.filter && col['filter']) {
                extras["filter"] = this.evaluateTemplate(Table.htmlTemplates['headFilter']) 
            }
            return this.evaluateTemplate(headColumnTemplate, {"text": col.text, ...extras})
        })

        if(this.enableSelect) {
            let headSelectTemplate = Table.htmlTemplates['headSelect']
            headColumnsHtml.unshift(this.evaluateTemplate(headSelectTemplate))
        }

        let headRowHtml = headColumnsHtml.join(' ')
        let theadTemplate = Table.htmlTemplates['headRow']
        let theadHtml = this.evaluateTemplate(theadTemplate, {"row": headRowHtml})

        return theadHtml
    }
    buildBodyHtml(){
        const bodyRows = this.dataInput.rows
        const tbodyHtml = bodyRows.map(row => {
            const rowCells = this.dataInput.columns 
            const cellsHtml = rowCells.map(cell => {
                let cellValue = row[cell.text]
                const cellType = cell.hasOwnProperty('type') ? cell.type : 'text'
                const cellExtras = {}
                const cellTemplate = Table.htmlTemplates.bodyCell[cellType]
                if (cell.colorCode) {
                    cellValue = cellValue.toLowerCase()
                    const conditionsDictionary = {'equal': '==='}
                    cell.colorCode.some((cond) => {
                        if(eval("'" + cellValue + "'" + conditionsDictionary[cond.condition] + "'" + cond.value.toLowerCase() + "'")){
                            cellExtras['color'] = cond.color
                            return true
                        }
                        console.log(cellValue)
                        eval("'" + cellValue + "'" + conditionsDictionary[cond.condition] + "'" + cond.value.toLowerCase() + "'") ? console.log(" = ") : console.log("!=")
                        console.log(cond.value.toLowerCase())
                        console.log("==============================")
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
                let bodySelectTemplate = Table.htmlTemplates['rowSelect']
                cellsHtml.unshift(this.evaluateTemplate(bodySelectTemplate))
            }
            var rowCellsHtml = cellsHtml.join('')
            var rowTemplate = Table.htmlTemplates.bodyRow
            var rowHtml = this.evaluateTemplate(rowTemplate, {"row": rowCellsHtml})
            return rowHtml
        }).join('')
        return tbodyHtml
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
} 