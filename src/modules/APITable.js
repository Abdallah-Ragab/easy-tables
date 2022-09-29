// TODO: add cell type html
// TODO: add support for non data headers 1.can be added to this.optionsInput.headers 2.gets added to this.dataColumnsKeys 3. limited to non data cel types 4. at render getting value is skipped

import { Table } from './Table';
export class APITable extends Table{
    constructor (
        wrapper ,
        data,
        options
        ) {
        super()
        this.tableWrapper = wrapper
        this.dataInput = data
        this.optionsInput = options

        this.initiate()
    }
    initiate(){
        if(typeof(this.tableWrapper) === "string"){
            this.tableWrapperElement = document.querySelector(this.tableWrapper)
        } else {
            this.tableWrapperElement = this.tableWrapper
        }

        this.dataColumnsKeys = this.dataInput.length > 0 ? Object.keys(this.dataInput[0]) : []
        this.nonDataColumnsKeys = Object.keys(this.optionsInput.headers).filter(key => !(this.dataColumnsKeys.includes(key)))
        this.allColumnsKeys = this.dataColumnsKeys.concat(this.nonDataColumnsKeys)

        this.enableSelect = this.optionsInput.select || true
        this.enableSort = this.optionsInput.sort || true
        this.uniqueIdentifierKey = this.optionsInput.uniqueID

        this.emptyHead = (this.optionsInput.headers.length === 0) || (this.optionsInput.headers === undefined)
        this.emptyBody = (this.dataInput.length === 0) || (this.dataInput === undefined)
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
        this.tableElement.querySelectorAll('[data-type="filter"]').forEach(filter => {
            let column = filter.closest('th')
            const columnKey = column.getAttribute("key")
            const columnOptions = this.optionsInput.headers[columnKey] || {}
            const columnFilter = columnOptions.filter || false
            if(Boolean(columnFilter)){
                filter.addEventListener('click', columnFilter)
            }            
        })

        // Button cells events
        let buttonColumns = this.allColumnsKeys.map(col_key => {
            const col = this.optionsInput.headers[col_key] || {}
            if (col.type == "button") return {[col_key]: col["callback"]}
        }).filter(callback => callback != undefined)

        this.tableDataObject.body.rows.forEach(row => {
            buttonColumns.forEach(col => {
                const buttonCellElements = row.cells.filter(cell => cell.element.getAttribute("key") === Object.keys(col)[0])
                buttonCellElements.forEach(button => { button.element.querySelector('[table-button]').addEventListener('click', Object.values(col)[0]) })

            })
        })
    }
    setTableWrapperClasses(){
        this.tableWrapperElement.classList.add('overflow-auto', 'border', 'border-gray-150')
        this.tableWrapperElement.classList.add('max-w-full')
    }
        
    // Building & Rendering a html table from json
    renderTable(bodyLoading, headLoading){
        // DO: re-write the empty table / empty head logic

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
            const headColumns = this.allColumnsKeys
    
            const headColumnsHtmlArray = headColumns.map(col_key => {
                const col = this.optionsInput.headers[col_key] || {}
                const colText = col.text || col_key
                let extras = {}

                if(!col.hasOwnProperty("data") && (col.type == 'button' || col.type == 'image')){
                    col.data = false
                }
                if(col.hasOwnProperty("data") && !col.data){
                    extras['attributes'] = this.constructor.attributes.notData
                    if (!col.hasOwnProperty("sort")) {
                        col.sort = false
                    }
                }

                if(col.hasOwnProperty("render") && !(col.render)){return}         

                if (((this.enableSort && !col.hasOwnProperty('sort')) || (this.enableSort && col['sort']))) {
                    extras["sort"] = this.evaluateTemplate(this.constructor.htmlTemplates.headSort) 
                }
                if (col['filter']) {
                    extras["filter"] = this.evaluateTemplate(this.constructor.htmlTemplates.headFilter) 
                }

                return this.evaluateTemplate(headColumnTemplate, {"key": col_key, "text": colText , ...extras})
            })
    
            if(this.enableSelect) {
                let headSelectTemplate = this.constructor.htmlTemplates.headSelect
                headColumnsHtmlArray.unshift(this.evaluateTemplate(headSelectTemplate))
            }
    
            const headRowHtml = headColumnsHtmlArray.join('')
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
                var rowsCount = this.dataInput.length
                var columnsCount = this.allColumnsKeys.length
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
            const bodyRows = this.dataInput
            var tBodyHtml = bodyRows.map(row => {
                const rowCells = this.allColumnsKeys
                const rowCellsHtmlArray = rowCells.map(cell_key => {

                    const cell = this.optionsInput.headers[cell_key] || {}
                    const cellValue = row[cell_key] || cell.value || ""
                    const cellType = cell.type || 'text'
                    const cellExtras = {}
                    const cellTemplate = this.constructor.htmlTemplates.bodyCell[cellType]

                    if(cell.hasOwnProperty("render") && !(cell.render)){return}     

                    if (cell.colorCode) {
                        const conditionsDictionary = {'equal': '==='}
                        cell.colorCode.some((cond) => {
                            if(eval("'" + cellValue.toLowerCase() + "'" + conditionsDictionary[cond.condition] + "'" + cond.value.toLowerCase() + "'")){
                                cellExtras['color'] = cond.color
                                return true
                            }
                        }) 
                    } else if (cell.color) {
                        cellExtras['color'] = cell.color
                    }

                    // if(!cell.hasOwnProperty("data") && (cell.type == 'button' || cell.type == 'image')){
                    //     cell.data = false
                    // }

                    if(cell.type == 'button' && !(cellExtras['text'])){
                        cellExtras['text'] = cell.text || cell_key
                    }

                    // if(cell.hasOwnProperty("data") && !cell.data){
                    //     cellExtras['attributes'] = this.constructor.attributes.notData
                    // }

                    const cellHtml = this.evaluateTemplate(cellTemplate, {"key": cell_key, "text": cellValue, ...cellExtras})
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

