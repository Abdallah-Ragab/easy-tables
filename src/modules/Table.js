// TODO: change non-data attribute to not-data

import { tableTemplates } from "../templates/Table"
export class Table {
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

        var isNotDataCol = columnElement.hasAttribute(this.constructor.attributes.notData) || (this.ignoredColumns) && (columnID in this.ignoredColumns)
        return {
            ID: columnID,
            element: columnElement,
            hasData: isNotDataCol ? false : true,
            value: isNotDataCol ? null : this.extractColumnData(columnElement, columnID)
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
                value: isDataCell ? this.extractCellData(cell, idx) : null
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
            var aValue = a.cells.find(cell => cell.ID === sortByID).value 
            var bValue = b.cells.find(cell => cell.ID === sortByID).value

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
        // console.log(this.getSelectedRows())
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
        const bodyRows = this.tableDataObject.body.rows
        const headColumns = this.tableDataObject.head.columns

        const uniqueIDKeySet = this.hasOwnProperty("optionsInput") && this.optionsInput.hasOwnProperty("uniqueID")
        const uniqueIDColumnIndexSetByAttribute = headColumns.findIndex(column => column.element.hasAttribute(this.constructor.attributes.columnUniqueID)) !== -1
        const uniqueIDColumnIndexSetByInitialization = this.hasOwnProperty("uniqueIdentifierIndex")


        const getUniqueIDByIndex = (row, index) => {
            return row.cells.find(cell => cell.ID === index).value   
        }
        const getUniqueIDByKey = (row, idx, key) => {
            const cellOfUniqueIDFromTable = row.cells.find(cell => cell.element.getAttribute('key') === key)
            const uniqueIDFromTable = cellOfUniqueIDFromTable ? cellOfUniqueIDFromTable.value : false
            const uniqueIDFromDataInput = this.rowsInput[idx][key]
            const uniqueID = uniqueIDFromTable || uniqueIDFromDataInput
            return uniqueID

        }
        const getUniqueIDByAttribute = (row) => {
            return row.element.getAttribute(this.constructor.attributes.rowID)
        }
        const setUniqueID = (idx, uniqueID) => {
            this.tableDataObject.body.rows[idx].uniqueID = uniqueID
        }

        if (uniqueIDKeySet) {
            const uniqueIDKey = this.optionsInput.uniqueID
            bodyRows.forEach((row, idx) => {
                const uniqueID = getUniqueIDByKey(row, idx, uniqueIDKey)
                setUniqueID(idx, uniqueID)
            })
        } else if (uniqueIDColumnIndexSetByAttribute) {
            const uniqueIDColumnIndex = headColumns.findIndex(column => column.element.hasAttribute(this.constructor.attributes.columnUniqueID))
            bodyRows.forEach((row, idx) => {
                const uniqueID = getUniqueIDByIndex(row, uniqueIDColumnIndex)
                setUniqueID(idx, uniqueID)
            })
        } else if (uniqueIDColumnIndexSetByInitialization) {
            const uniqueIDColumnIndex = (this.enableSelect) ? parseInt(this.uniqueIdentifierIndex) + 1 : parseInt(this.uniqueIdentifierIndex)
            bodyRows.forEach((row, idx) => {
                const uniqueID = getUniqueIDByIndex(row, uniqueIDColumnIndex)
                setUniqueID(idx, uniqueID)
            })
        } else {
            bodyRows.forEach((row, idx) => {
                const uniqueID = getUniqueIDByAttribute(row)
                setUniqueID(idx, uniqueID)
            })
        }
    }
    getSelectedRows(){
        return this.tableDataObject.body.rows.filter(row => row.selected).map(row => row.uniqueID)
    }
}