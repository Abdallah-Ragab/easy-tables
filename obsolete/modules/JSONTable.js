import { AbstractTable } from './AbstractTable';

export class JSONTable extends AbstractTable{
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