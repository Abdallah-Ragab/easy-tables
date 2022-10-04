import { AbstractTable } from './AbstractTable';

export class HTMLTable extends AbstractTable{
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