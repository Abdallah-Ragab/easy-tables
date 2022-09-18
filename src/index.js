import './styles/main.css';
import { HtmlTable, JsonTable } from './modules/Table';

document.querySelectorAll(`[${HtmlTable.attributes.tableContainer}]`).forEach(table => {
    table.tableInstance = new HtmlTable(table)
});

export { HtmlTable, JsonTable }