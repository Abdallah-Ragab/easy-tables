// TODO: add support for cell type html : this.dataInput > {param1} && this.optionsInput.headers > 1.dynamic: template=`<h1>\${param1}</h1>` 2.static: value=`<h1>hello</h1>`

import { Table } from './Table';
export class APITable extends Table{
    constructor (
        wrapper ,
        rows,
        options,
        ) {
        super()
        this.tableWrapper = wrapper
        this.rowsInput = rows
        this.optionsInput = options
        // this.dataInputURL = data
        // this.optionsInputURL = options

        // this.initiateURL()
        this.initiate()
    }
    initiate(){
        this.findTableWrapper()
        this.setTableWrapperClasses()

        const rowsInput = this.rowsInput
        const optionsInput = this.optionsInput

        const rowsInputType = (typeof(rowsInput) === "object" && rowsInput.hasOwnProperty("url")) ? "url" : "obj" 
        const optionsInputType = (typeof(optionsInput) === "object" && optionsInput.hasOwnProperty("url")) ? "url" : "obj"

        if (rowsInputType === "url"){var rowsInputObject = undefined; var rowsInputURL = rowsInput}
        else if (rowsInputType === "obj"){var rowsInputObject = rowsInput; var rowsInputURL = undefined }

        if (optionsInputType === "url"){var optionsInputObject = undefined; var optionsInputURL = optionsInput}
        else if (optionsInputType === "obj"){var optionsInputObject = optionsInput; var optionsInputURL = undefined }

        this.constructTable(rowsInputObject, optionsInputObject, rowsInputURL, optionsInputURL)
    }
    initiateJSON(){
        this.findTableWrapper()
        this.setTableWrapperClasses()
        this.constructTableFromObjects(this.dataInputJSON, this.optionsInputJSON)
    }
    initiateURL(){
        this.findTableWrapper()
        this.setTableWrapperClasses()
        this.constructTable(this.dataInputURL, this.optionsInputURL)
    }

    update(rows, options){
        
        const rowsInput = rows
        const optionsInput = options

        const rowsInputType = (typeof(rowsInput) === "object" && rowsInput.hasOwnProperty("url")) ? "url" : "obj" 
        const optionsInputType = (typeof(optionsInput) === "object" && optionsInput.hasOwnProperty("url")) ? "url" : "obj"

        if (rowsInputType === "url"){var rowsInputObject = undefined; var rowsInputURL = rowsInput}
        else if (rowsInputType === "obj"){var rowsInputObject = rowsInput; var rowsInputURL = undefined }

        if (optionsInputType === "url"){var optionsInputObject = undefined; var optionsInputURL = optionsInput}
        else if (optionsInputType === "obj"){var optionsInputObject = optionsInput; var optionsInputURL = undefined }

        this.constructTable(rowsInputObject, optionsInputObject, rowsInputURL, optionsInputURL)
    }
    findTableWrapper(){
        if(typeof(this.tableWrapper) === "string"){
            this.tableWrapperElement = document.querySelector(this.tableWrapper)
        } else {
            this.tableWrapperElement = this.tableWrapper
        }
    }
    readInput(){
        const rowsInput = this.rowsInput || []
        const optionsInput = this.optionsInput || {}
        const headersOptionsInput = optionsInput.headers || {}

        this.emptyHead = (Object.keys(headersOptionsInput).length === 0)
        this.emptyBody = (rowsInput.length === 0)
        this.emptyTable = (this.emptyBody && this.emptyHead)

        if (!this.emptyBody){
            this.dataColumnsKeys = rowsInput.length > 0 ? Object.keys(rowsInput[0]) : []
        }
        if (!this.emptyHead){
            this.nonDataColumnsKeys = Object.keys(headersOptionsInput).filter(key => !(this.dataColumnsKeys.includes(key)))
        }
        this.allColumnsKeys = this.dataColumnsKeys.concat(this.nonDataColumnsKeys)

        this.enableSelect = optionsInput.select || true
        this.enableSort = optionsInput.sort || true
        this.uniqueIdentifierKey = optionsInput.uniqueID

    }
    initiateEvents(){
        super.initiateEvents()

        const options = this.optionsInput || {}
        const headersOptions = options.headers || {}
        const columnsKeys = this.allColumnsKeys || {}

        // Filtering button events
        this.tableElement.querySelectorAll('[data-type="filter"]').forEach(filter => {
            let column = filter.closest('th')
            const columnKey = column.getAttribute("key")
            const columnOptions = headersOptions[columnKey] || {}
            const columnFilter = columnOptions.filter || false
            if(Boolean(columnFilter)){
                filter.addEventListener('click', columnFilter)
            }            
        })

        // Button cells events
        let buttonColumns = columnsKeys.map(col_key => {
            const col = headersOptions[col_key] || {}
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
    readPrimaryHtmlElements(){
        super.readPrimaryHtmlElements()
        this.tbodyHeight = this.bodyElement ? this.bodyElement.clientHeight+"px" : null
        this.WrapperWidth = this.tableWrapperElement ? this.tableWrapperElement.clientWidth+"px" : "100%"
        // console.log(this.tbodyHeight, this.WrapperWidth)
    }
    // Building & Rendering a html table from json
    renderTable(bodyLoading, headLoading){
        this.tableWrapperElement.replaceChildren();
        
        if(this.emptyTable){ 
            var tableHtml = this.constructor.htmlTemplates.emptyTablePlaceholder  
            this.tableWrapperElement.insertAdjacentHTML('afterbegin', tableHtml)
            return
        }
        else {
            var tableHtml = this.buildTableHtml(bodyLoading, headLoading)
            this.tableWrapperElement.insertAdjacentHTML('afterbegin', tableHtml)  
    
            if(this.emptyBody){
                var emptyBodyPlaceholder = this.constructor.htmlTemplates.emptyBodyPlaceholder ;
                this.tableWrapperElement.insertAdjacentHTML('beforeend', emptyBodyPlaceholder)  
            }      
        }
        
    }
    buildTableHtml(bodyLoading, headLoading) {
        // reset wrapper inline styles
        this.tableWrapperElement.setAttribute('style', '')

        const theadHtml = this.buildHeadHtml(headLoading)
        
        if (this.emptyBody){
            var tbodyHtml = ""
        } else {
            var tbodyHtml = this.buildBodyHtml(bodyLoading, headLoading)
        }
            
        const tableTemplate = this.constructor.htmlTemplates['table']

        let extras = {}
        // making the height and width of the table consistent in all states 
        if (bodyLoading && this.tbodyHeight) {
            extras["bodyStyle"] = `height: ${this.tbodyHeight};`
        }
        if ((headLoading||bodyLoading) || this.emptyBody) {
            this.WrapperWidth = this.WrapperWidth || "100%" 
            this.tableWrapperElement.setAttribute('style', `width: ${this.WrapperWidth};`)
        }
        const tableHtml = this.evaluateTemplate(tableTemplate, {"thead": theadHtml, "tbody": tbodyHtml, ...extras})
        return tableHtml
    }
    buildHeadHtml(headLoading){
        const columnsKeys = this.allColumnsKeys || []
        const options = this.optionsInput || {}
        const headersOptions = options.headers || {}
        if (headLoading){
            const columnsCount = (columnsKeys && columnsKeys.length > 0) ? columnsKeys.length : 5
            const headColumnPropTemplate = this.constructor.htmlTemplates.headColumnProp
            const headColumnsHtml = [...Array(columnsCount)].map(()=> headColumnPropTemplate).join('')
            return this.evaluateTemplate(this.constructor.htmlTemplates.headRowProp, {"columns": headColumnsHtml})
        }
        else {
            const headColumnTemplate = this.constructor.htmlTemplates.headColumn
            const headColumns = columnsKeys
    
            const headColumnsHtmlArray = headColumns.map(col_key => {
                const col = headersOptions[col_key] || {}
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
        const rowsData = this.rowsInput || []
        const columnsKeys = this.allColumnsKeys || []
        const options = this.optionsInput || {}
        const headersOptions = options.headers || {}

        if (bodyLoading){
            const rowsCount = (rowsData && rowsData.length > 0) ? rowsData.length : 12
            const columnsCount = (columnsKeys && columnsKeys.length > 0) ? columnsKeys.length : 5

            // console.log(rowsCount, columnsCount)

            const tbodyArray = [...Array(rowsCount)].map(() => {
                const propRowTemplate = this.constructor.htmlTemplates.bodyRowProp
                const propCellTemplate = this.constructor.htmlTemplates.bodyCellProp
                const propCellsHtmlArray = [...Array(columnsCount)].map(()=>{
                    return propCellTemplate
                })
                if(this.enableSelect && !headLoading) { 
                    propCellsHtmlArray.unshift(this.evaluateTemplate(this.constructor.htmlTemplates['rowSelect'])) 
                    propCellsHtmlArray.pop()
                }
                const propCellsHtml = propCellsHtmlArray.join("")
                return this.evaluateTemplate(propRowTemplate, {"row": propCellsHtml})
            })
            var tBodyHtml = tbodyArray.join("")
        }
        else {
            const bodyRows = rowsData
            var tBodyHtml = bodyRows.map(row => {
                const rowCells = columnsKeys
                const rowCellsHtmlArray = rowCells.map(cell_key => {

                    const cell = headersOptions[cell_key] || {}
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

                    if(cell.type == 'button' && !(cellExtras['text'])){
                        cellExtras['text'] = cell.text || cell_key
                    }

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

    // updating the table content by requesting url
    constructTable(rowsObject = null, optionsObject = null, rowsURL = null, optionsURL = null){ 
       
        console.log(rowsObject, optionsObject, rowsURL, optionsURL)
        console.log(typeof rowsObject, typeof optionsObject, typeof rowsURL, typeof optionsURL)
        console.log(Boolean(rowsObject), Boolean(optionsObject), typeof rowsURL, typeof optionsURL)

        const hasRowsObject = Boolean(rowsObject)
        const hasOptionsObject = Boolean(optionsObject)
        
        const hasRowsURL = Boolean(rowsURL) && rowsURL.hasOwnProperty("url")
        const hasOptionsURL = Boolean(optionsURL) && optionsURL.hasOwnProperty("url")


        if (!hasRowsObject && !hasOptionsObject && hasRowsURL && hasOptionsURL) {
            this.loadingTable()
            this.makeRequests(rowsURL, optionsURL).then((result) => {
                this.constructTableFromObjects(result.rows, result.options)
            })
        } 
        else if (!hasRowsObject && hasRowsURL) {
            if(hasOptionsObject){
                this.loadingBody()
                this.makeRequests(rowsURL).then((result) => {
                    this.constructTableFromObjects(result.rows, optionsObject)
                })
            } else {                
                this.loadingBody()
                this.makeRequests(rowsURL).then((result) => {
                    this.constructTableFromObjects(result.rows, undefined)
                })
            }
        } 
        else if (!hasOptionsObject && hasOptionsURL) {
            if(hasRowsObject){
                this.loadingBody()
                this.makeRequests(undefined, optionsURL).then((result) => {
                    this.constructTableFromObjects(rowsObject, result.options)
                })
            } else {                
                this.loadingBody()
                this.makeRequests(undefined, optionsURL).then((result) => {
                    this.constructTableFromObjects(undefined, result.options)
                })
            }
        } 
        else if (hasRowsObject, hasOptionsObject) {
            this.constructTableFromObjects(rowsObject, optionsObject)
        }
        else if (hasRowsObject) {
            this.constructTableFromObjects(rowsObject, undefined)
        }
        else if (hasOptionsObject) {
            this.constructTableFromObjects(undefined, optionsObject)
        }
    }
    // constructTable(rowsObject = null, optionsObject = null, rowsURL = {}, optionsURL = {}){ 
       
    //     console.log(rowsObject, optionsObject, rowsURL, optionsURL)
    //     console.log(typeof rowsObject, typeof optionsObject, typeof rowsURL, typeof optionsURL)
    //     console.log(Boolean(rowsObject), Boolean(optionsObject), typeof rowsURL, typeof optionsURL)

    //     const hasRowsObject = Boolean(rowsObject)
    //     const hasOptionsObject = Boolean(optionsObject)
        
    //     const hasRowsURL = (rowsURL.hasOwnProperty("url"))
    //     const hasOptionsURL = (optionsURL.hasOwnProperty("url"))


    //     if (!hasRowsObject && !hasOptionsObject) {
    //         if(hasRowsURL && hasOptionsURL){
    //             this.loadingTable()
    //             this.makeRequests(rowsURL, optionsURL).then((result) => {
    //                 this.constructTableFromObjects(result.rows, result.options)
    //             })
    //         } else if (hasRowsObject){
    //             this.loadingBody()
    //             this.makeRequests(rowsURL).then((result) => {
    //                 this.constructTableFromObjects(result.rows, optionsObject)
    //             })
    //         }
    //         } else if (){
    //             this.loadingBody()
    //             this.makeRequests(rowsURL).then((result) => {
    //                 this.constructTableFromObjects(result.rows, optionsObject)
    //             })
    //         }
            
    //     else if (!hasRowsObject) {
    //         this.loadingBody()
    //         this.makeRequests(rowsURL).then((result) => {
    //             this.constructTableFromObjects(result.rows, optionsObject)
    //         })
    //     } 
    //     else if (!hasOptionsObject) {
    //         this.loadingBody()
    //         this.makeRequests(undefined, optionsURL).then((result) => {
    //             this.constructTableFromObjects(rowsObject, result.options)
    //         })
    //     } 
    //     else {
    //         this.constructTableFromObjects(rowsObject, optionsObject)
    //     }
    // }
    async makeRequests(rows = null, options = null){

        console.log("Making request to:")
        
        rows? console.log("rows", typeof rows) : console.log("not rows")
        options? console.log("options", typeof options): console.log("not options")

        if (rows){
            var rowsResult = await this.request(rows.url, rows.onsuccess, rows.onerror)
        }
        if (options){
           var optionsResult = await this.request(options.url, options.onsuccess, options.onerror)
        }
        return {rows: rowsResult, options: optionsResult}
    }
    async request(url, successCallback=null, failureCallback=null){
        console.log("Connecting to :", url)
        const response = await fetch(url)
        if (response.status !== 200) {
            if (failureCallback){
                const callbackResult = failureCallback(response)
                if (callbackResult.then){
                    return await callbackResult
                } else {
                    return callbackResult
                }
            } else {
                console.log("request failed : ", response.status, response.statusText)
                return
            }
        }
        if (successCallback){
            const callbackResult = successCallback(response)
            if (callbackResult.then){
                // console.log(await callbackResult)
                return await callbackResult
            } else {
                // console.log(callbackResult)
                return callbackResult
            }
        } else {
            return await response.json()
        }
    }
    constructTableFromObjects(rows = null, options = null){
        if (rows){this.rowsInput = rows}
        if (options){this.optionsInput = options}
        if (rows || options) {
            this.readInput()
            this.renderTable()
            if (!this.emptyTable && !this.emptyBody){
                this.readPrimaryHtmlElements()
                this.tableDataObject = this.extractDataFromHtml()
                if(this.enableSelect){
                    this.getUniqueIdentifiers()
                }
                this.initiateEvents()
            }
        }
    }

    // Loading
    loadingBody(){
        this.emptyHead = null
        this.emptyBody = null
        this.emptyTable = null
        this.renderTable(true)
    }
    loadingTable(){
        this.emptyHead = null
        this.emptyBody = null
        this.emptyTable = null
        this.renderTable(true, true)
    }
} 

