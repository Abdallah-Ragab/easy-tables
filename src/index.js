import './styles/main.css';
import { APITable } from './modules/APITable';
import { HTMLTable } from './modules/HTMLTable';
import { JSONTable } from './modules/JSONTable';

document.querySelectorAll(`[${HTMLTable.attributes.tableContainer}]`).forEach(wrapper => {
    wrapper.tableInstance = new HTMLTable(wrapper)
});

export { HTMLTable, JSONTable, APITable }