import './styles/main.css';
import { Table } from './modules/Table';
import { HTMLTable } from './modules/HTMLTable';

document.querySelectorAll(`[${HTMLTable.attributes.tableContainer}]`).forEach(wrapper => {
    wrapper.tableInstance = new HTMLTable(wrapper)
});

export { HTMLTable, Table }