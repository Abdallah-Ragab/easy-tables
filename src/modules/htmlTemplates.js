export const tableTemplates =  {
    "table" : `
        <table class='min-w-full rounded border-gray-700 bg-gray-50'>
            <thead>\${data['thead']}</thead>
            <tbody>\${data['tbody']}</tbody>
        </table>
        `,
    "headRow" : `
        <tr class="bg-gray-200 whitespace-nowrap text-gray-700 font-semibold capitalize sticky -top-1 z-10">\${data['row']}</tr>
        `,
    "headSelect" : `
        <th non-data class=" sticky -left-px shadow bg-gray-200 shadow-xl text-start px-4 py-1 z-10 w-0"><input type="checkbox"></th>
        `,
    "transparentSelect" : `
        <th non-data><input type="checkbox"></th>
        `,
    "headSort" : `
        <div class="flex flex-col space-y-0.5">
            <svg data-sort-direction="asc"  xmlns="http://www.w3.org/2000/svg" viewBox="-143.066 -107.05 286.1 167.1">
                <path d="M 119 60 H -119 c -21.4 0 -32.1 -25.9 -17 -41 L -17 -100 c 9.4 -9.4 24.6 -9.4 33.9 0 l 119 119 c 15.2 15.1 4.5 41 -16.9 41 z" fill="#000000"/>
            </svg>
            <svg data-sort-direction="desc" xmlns="http://www.w3.org/2000/svg" viewBox="-143.066 -107.05 286.1 167.1" style="transform: rotate(180deg);">
                <path d="M 119 60 H -119 c -21.4 0 -32.1 -25.9 -17 -41 L -17 -100 c 9.4 -9.4 24.6 -9.4 33.9 0 l 119 119 c 15.2 15.1 4.5 41 -16.9 41 z" fill="#000000"/>
            </svg>
        </div>
        `,
    "headFilter" : `
        <div data-type="filter">
            <svg xmlns="http://www.w3.org/2000/svg" x="0" y="0" viewBox="0 0 459 459" style="enable-background:new 0 0 512 512" xml:space="preserve">
                <path d="M178.5,382.5h102v-51h-102V382.5z M0,76.5v51h459v-51H0z M76.5,255h306v-51h-306V255z" fill="#000000" data-original="#000000"></path>
            </svg>
        </div>
        `,
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
        "bodyRow" : `
            <tr class="border-b border-gray-150 whitespace-nowrap text-gray-500 text-sm">\${data['row']}</tr>
            `,
        "bodyCell" : {
            "text" : `
                <td class="px-4 py-2">\${data['text']}</td>
                `,
            "bold" : `
                <td class="px-4 py-2 text-gray-700 font-bold">\${data['text']}</td>
                `,
            "image" : `
                <td non-data class="px-4 py-2 text-gray-700 font-bold"><img table-image class="w-12 h-12 border rounded-full" src="\${data['text']}"></td>
                `,
            "label" : `
                <td non-data class="px-4 py-2"><div table-label class="bg-\${data['color']}-100 text-\${data['color']}-700 rounded shadow w-fit text-center font-semibold px-3 py-1">\${data['text']}</div></td>
                `,
            "button" : `
                <td non-data class="px-4 py-2"><span table-button class="text-\${data['color']}-800 font-bold hover:text-\${data['color']}-700 cursor-pointer capitalize">\${data['text']}</span></td>
                `,
        },
        "rowSelect" : `
            <td non-data class="sticky -left-px bg-white px-4 py-2 w-0"><input type="checkbox"></td>
            `,
        "emptyBodyAlert" : `
            <div class="flex justify-center items-center w-100 sticky left-0 h-12 text-lg text-gray-600 font-bold">No data found.</div>  
        `,
        "bodyRowProp" : `
            <tr class="border-b border-gray-150 whitespace-nowrap text-gray-500 text-sm animate-pulse">\${data['row']}</tr>
        `,
        "bodyCellProp" : `
            <td class="px-4"><div class="m-1 bg-gray-300 h-4 rounded">&nbsp;</div></td>
        `,
}