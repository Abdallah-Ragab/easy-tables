export default class Table {
    constructor (
        tableWrapperSelector,
        data = null,
        ignoreCols = null,
        customHeadSelector = null,
        customBodySelector = null,
        ) {
        
        this.tableWrapper = document.querySelector(tableWrapperSelector)
        this.dataInput = data
        this.ignoreCols = ignoreCols
        this.customHeadSelector = customHeadSelector
        this.customBodySelector = customBodySelector
        this.sort = true
        this.select = true
        this.filter = true
        
        this.initiate()
        this.initiateEvents()
    }
    initiate(){
        if (this.dataInput) {
            this.renderTable()
            this.tableWrapper.classList.add('overflow-auto', 'border', 'border-gray-150')
            this.tableWrapper.classList.add('max-w-full')
            this.tableElement = this.tableWrapper.querySelector('table')
            this.tableData = this.extractDataFromJson()
        }
        else {
            this.tableElement = this.tableWrapper.querySelector('table')
            this.tableData = this.extractDataFromHtml()
            this.selectedRows = []
        }

        // if (this.dataInput) {
        //     this.renderTable()
        //     this.tableWrapper.classList.add('overflow-auto', 'border', 'border-gray-150')
        //     this.tableWrapper.classList.add('max-w-full')
        // }
        // this.tableElement = this.tableWrapper.querySelector('table')
        // if(this.dataInput) {
        //     this.tableData = this.extractDataFromJson()
        // } else {
        //     this.tableData = this.extractDataFromHtml()
        // }
        // this.selectedRows = []
    }
    initiateEvents(){
        // Sorting buttons events
        this.tableElement.querySelectorAll('[data-direction]').forEach((el => {
            var direction = el.dataset.direction
            el.addEventListener('click', e => {
                this.tableElement.querySelectorAll('[data-direction][active]').forEach(element => {element.removeAttribute('active')})
                el.setAttribute('active', '')
                var element = e.target.closest('th')
                var elementIdx = Array.from(element.parentNode.children).indexOf(element)
                this.sortTable(elementIdx, direction)
            })
        }))

        // Selecting checkboxes events
        this.bodyCheckboxes = this.tableElement.querySelectorAll('tbody tr :first-child input[type="checkbox"]')
        this.headCheckboxes = this.tableElement.querySelectorAll('thead tr :first-child input[type="checkbox"]')

        Array.from(this.bodyCheckboxes).concat(Array.from(this.headCheckboxes)).forEach(checkbox => {
            checkbox.addEventListener('change', e => {
                let target = e.target
                this.selectRows(target)
            })
        })

        // Filtering button events
        this.tableElement.querySelectorAll('#filter').forEach(filter => {
            let column = filter.closest('th')
            let columnID = Array.from(column.parentNode.children).indexOf(column)
            columnID = this.select ? columnID-1 : columnID
            let columnFilter = this.dataInput.columns[columnID].hasOwnProperty('filter') ? this.dataInput.columns[columnID].filter : false
            if(Boolean(columnFilter)){
                filter.addEventListener('click', columnFilter)
            }            
        })

        // Button cells events
        if (!this.dataInput) return
        let buttonColumns = this.dataInput.columns.map((col, idx) => {
            if (col.type == "button") return {[idx]: col["callback"]}
        }).filter(col => col != undefined)
        this.tableData.rows.forEach(row => {
            buttonColumns.forEach(col => {
                let colIndex = this.select ? parseInt(Object.keys(col)[0])+1 : parseInt(Object.keys(col)[0])
                row.element.children[colIndex].querySelector('span').addEventListener('click', Object.values(col)[0])
            })
        })
    }

    // Creating data object from existing html table 
    extractDataFromHtml(){
        this.headElements = Array.from(this.tableElement.tHead.rows[0].children)
        this.headData = this.extractHeadFromHtml()
        this.headKeys = this.getKeysFromHead()

        this.bodyElements = Array.from(this.tableElement.tBodies[0].rows)
        this.bodyData = this.extractBodyFromHtml()
        this.rowsDataObject = this.getRowsDataFromBody()

        var dataObject = {
            keys : this.headKeys,
            rows : this.bodyData.map((row, idx) => {
                return {
                    "element" : this.bodyElements[idx],
                    "data" : this.rowsDataObject[idx]
                }
            })
        }
        return dataObject
    }
    extractHeadFromHtml() {
        var headCells = this.headElements.map((el, idx) => {
            if (this.ignoreCols && this.ignoreCols.includes(idx)){return null}
            else {return el}
        })
        const headData = headCells.map((el, idx) => {
            if (el == null) {return null}
            var dataElement = el
            if(this.customHeadSelector && this.customHeadSelector.hasOwnProperty(idx)){
                dataElement = el.querySelector(this.customHeadSelector[idx]) 
            }
            return dataElement.textContent
        })
        return headData
    }
    getKeysFromHead(){
        var keys = {}
        this.headData.forEach((key, idx) => {
            if (key == null) return
            keys[idx] = key
        })
        return keys
    }
    extractBodyFromHtml() {
        var bodyRows = this.bodyElements.map((row) => { 
            return Array.from(row.children).map((el, idx) => {
                if (this.ignoreCols && this.ignoreCols.includes(idx)){return null}
                else {return el}
            })
        })
        var bodyData = bodyRows.map((row) => {
            return row.map((el, idx) => {
                if (el == null) {return null}
                var dataElement = el
                if(this.customBodySelector && this.customBodySelector.hasOwnProperty(idx)){
                    dataElement = el.querySelector(this.customBodySelector[idx]) 
                }
                if (dataElement.tagName == "IMG") return dataElement.src
                return dataElement.textContent
            })
        })
        return bodyData
    }
    getRowsDataFromBody(){
        var data = this.bodyData.map((row) => {
            var rowObj = {}
            this.headData.forEach((key, idx) => {
                if (key == null) return
                rowObj[idx] = row[idx]
            })
            return rowObj
        })
        return data
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
        this.tableWrapper.insertAdjacentHTML('afterbegin', tableHtml)        
    }
    buildTableHtml() {
        var theadHtml = this.buildHeadHtml()
        var tbodyHtml = this.buildBodyHtml()
        var tableTemplate = this.htmlTemplates['table']
        var tableHtml = this.evaluateTemplate(tableTemplate, {"thead": theadHtml, "tbody": tbodyHtml})
        return tableHtml
    }
    buildHeadHtml(){
        let headColumnTemplate = this.htmlTemplates['headColumn']
        let headColumns = this.dataInput.columns

        let headColumnsHtml = headColumns.map(col => {
            let extras = {}
            if(col.type == 'button'){
                return this.evaluateTemplate(headColumnTemplate)
            }
            if ((this.sort && !col.hasOwnProperty('sort')) || (this.sort && col['sort'])) {
                extras["sort"] = this.evaluateTemplate(this.htmlTemplates['headSort']) 
            }
            if (this.filter && col['filter']) {
                extras["filter"] = this.evaluateTemplate(this.htmlTemplates['headFilter']) 
            }
            return this.evaluateTemplate(headColumnTemplate, {"text": col.text, ...extras})
        })

        if(this.select) {
            let headSelectTemplate = this.htmlTemplates['headSelect']
            headColumnsHtml.unshift(this.evaluateTemplate(headSelectTemplate))
        }

        let headRowHtml = headColumnsHtml.join(' ')
        let theadTemplate = this.htmlTemplates['headRow']
        let theadHtml = this.evaluateTemplate(theadTemplate, {"row": headRowHtml})

        return theadHtml
    }
    buildBodyHtml(){
        var bodyRows = this.dataInput.rows
        var tbodyHtml = bodyRows.map(row => {
            var rowCells = this.dataInput.columns 
            var cellsHtml = rowCells.map(cell => {
                var cellValue = row[cell.text]
                var cellType = cell.hasOwnProperty('type') ? cell.type : 'text'
                var cellExtras = {}
                var cellTemplate = this.htmlTemplates.bodyCell[cellType]
                if (cell.colorCode) {
                    var conditionsDictionary = {'equal': '==='}
                    cell.colorCode.some((cond) => {
                        if(eval("'" + cellValue.toLowerCase() + "'" + conditionsDictionary[cond.condition] + "'" + cond.value.toLowerCase()+ "'")){
                            cellExtras['color'] = cond.color
                            return true
                        }
                    }) 
                }
                if(cell.type == 'button'){
                    cellExtras['color'] = cell.color
                    cellExtras['text'] = cell.text
                }
                var cellHtml = this.evaluateTemplate(cellTemplate, {"text": cellValue, ...cellExtras})
                return cellHtml
            })
            if(this.select) {
                let bodySelectTemplate = this.htmlTemplates['rowSelect']
                cellsHtml.unshift(this.evaluateTemplate(bodySelectTemplate))
            }
            var rowCellsHtml = cellsHtml.join('')
            var rowTemplate = this.htmlTemplates.bodyRow
            var rowHtml = this.evaluateTemplate(rowTemplate, {"row": rowCellsHtml})
            return rowHtml
        }).join('')
        return tbodyHtml
    }

    // Template system for building Html elements dynamically 
    htmlTemplates = {
        "table" : `
            <table class='min-w-full rounded border-gray-700 bg-gray-50'>
                <thead>\${data['thead']}</thead>
                <tbody class='odd:bg-white even:bg-slate'>\${data['tbody']}</tbody>
            </table>
            `,
        "headRow" : `
        <tr class="bg-gray-200 whitespace-nowrap text-gray-700 font-semibold capitalize sticky -top-1 z-10">\${data['row']}</tr>
        `,
        "headSelect" : `<th data-key="select" class=" sticky -left-px shadow bg-gray-200 shadow-xl text-start px-4 py-1 z-10"><input type="checkbox"></th>`,
        "headSort" : `
        <div class="flex flex-col space-y-0.5">
            <svg data-direction="asc"  xmlns="http://www.w3.org/2000/svg" viewBox="-143.066 -107.05 286.1 167.1">
                <path d="M 119 60 H -119 c -21.4 0 -32.1 -25.9 -17 -41 L -17 -100 c 9.4 -9.4 24.6 -9.4 33.9 0 l 119 119 c 15.2 15.1 4.5 41 -16.9 41 z" fill="#000000"/>
            </svg>
            <svg data-direction="desc" xmlns="http://www.w3.org/2000/svg" viewBox="-143.066 -107.05 286.1 167.1" style="transform: rotate(180deg);">
                <path d="M 119 60 H -119 c -21.4 0 -32.1 -25.9 -17 -41 L -17 -100 c 9.4 -9.4 24.6 -9.4 33.9 0 l 119 119 c 15.2 15.1 4.5 41 -16.9 41 z" fill="#000000"/>
            </svg>
        </div>`,
        "headFilter" : `
        <div data-type="filter">
            <svg xmlns="http://www.w3.org/2000/svg" x="0" y="0" viewBox="0 0 459 459" style="enable-background:new 0 0 512 512" xml:space="preserve" class="">
                <path d="M178.5,382.5h102v-51h-102V382.5z M0,76.5v51h459v-51H0z M76.5,255h306v-51h-306V255z" fill="#000000" data-original="#000000"></path>
            </svg>
         </div>`,
        "headColumn" : `
        <th data-key="title" class="text-start px-4 py-2">
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
                    <td class="px-4 py-2 text-gray-700 font-bold"><img class="w-12 h-12 border rounded-full" src="\${data['text']}"></td>`,
                "label" : `
                    <td class="px-4 py-2"><div class="bg-\${data['color']}-100 text-\${data['color']}-700 rounded shadow w-fit text-center font-semibold px-3 py-1">\${data['text']}</div></td>`,
                "button" : `
                <td class="px-4 py-2"><span class="text-\${data['color']}-800 font-bold hover:text-\${data['color']}-700 cursor-pointer capitalize">\${data['text']}</span></td>`
            },
            "rowSelect" : `<td class="sticky -left-px bg-white px-4 py-2"><input type="checkbox"></td>`,
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

    // Sorting functionality
    sortTable(sortByID, sortDirection){
        this.sortData(sortByID, sortDirection)
        this.reorderRows()
    }
    sortData(sortByID, sortDirection){
        const sorted = Array.from(this.tableData.rows).sort((a, b) => {
            var aVal = a.data[sortByID] 
            var bVal = b.data[sortByID]
            if(sortDirection == 'asc'){
                if ( aVal.toLowerCase() < bVal.toLowerCase()){
                    return -1;
                  }
                else if ( aVal.toLowerCase() > bVal.toLowerCase()){
                    return 1;
                  }
                else return 0;
            }
            else{
                if ( aVal.toLowerCase() > bVal.toLowerCase()){
                    return -1;
                  }
                else if ( aVal.toLowerCase() < bVal.toLowerCase()){
                    return 1;
                  }
                else return 0;
            }
        })
        this.tableData.rows = sorted
    }
    reorderRows(){
        const body = this.tableElement.tBodies[0]
        const rows = this.tableData.rows.map(row => row.element) 
        body.replaceChildren(...rows)
    }
    
    // Selecting functionality
    selectRows(target){
        let checked = target.checked
        let inHead = this.tableElement.tHead.contains(target)
        let parentRow = target.closest('tr')

        if (!inHead){
            if(checked){
                this.updateSelectedRows('add', parentRow)
            }
            else{
                this.updateSelectedRows('remove', parentRow)
            }
        } else {
            if(checked){
                this.updateSelectedRows('all')
            } else {
                this.updateSelectedRows('none')
            }
        }
    }
    updateSelectedRows(operation, row=null){
        switch(operation){
            case "all":
                this.selectedRows = Array.from(this.tableData.rows.map(row => row.element))
                this.bodyCheckboxes.forEach(checkbox => checkbox.checked = true)
                break
            case "none":
                this.selectedRows = []
                this.bodyCheckboxes.forEach(checkbox => checkbox.checked = false)
                break
            case "add":
                this.selectedRows.push(row);
                break
            case "remove":
                this.selectedRows.splice(this.selectedRows.indexOf(row), 1);
                break
        }        
        let allRowsSelected  =(this.tableData.rows.map(row => row.element).length == this.selectedRows.length) && (this.tableData.rows.map(row => row.element).every(row => this.selectedRows.includes(row)))
        this.headCheckboxes[0].checked = allRowsSelected ? true : false 
    }

}