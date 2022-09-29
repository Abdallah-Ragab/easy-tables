export const tableTemplates =  {
    "table" : `
        <table class='min-w-full rounded border-gray-700 bg-gray-50'>
            <thead style="\${data['headStyle']}">\${data['thead']}</thead>
            <tbody style="\${data['bodyStyle']}">\${data['tbody']}</tbody>
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
        <th key="\${data['key']}" \${data['attributes']} class="text-start px-4 py-2">
            <div class="flex justify-between items-center space-x-2">
                <div header-value>\${data['text']}</div>
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
            <td key="\${data['key']}" \${data['attributes']} class="px-4 py-2">\${data['text']}</td>
            `,
        "bold" : `
            <td key="\${data['key']}" \${data['attributes']} class="px-4 py-2 text-gray-700 font-bold">\${data['text']}</td>
            `,
        "image" : `
            <td key="\${data['key']}" \${data['attributes']} class="px-4 py-2 text-gray-700 font-bold"><img table-image class="w-12 h-12 border rounded-full" src="\${data['text']}"></td>
            `,
        "label" : `
            <td key="\${data['key']}" \${data['attributes']} class="px-4 py-2"><div table-label class="bg-\${data['color']}-100 text-\${data['color']}-700 rounded shadow w-fit text-center font-semibold px-3 py-1">\${data['text']}</div></td>
            `,
        "button" : `
            <td key="\${data['key']}" \${data['attributes']} class="px-4 py-2"><span table-button class="text-\${data['color']}-800 font-bold hover:text-\${data['color']}-700 cursor-pointer capitalize">\${data['text']}</span></td>
            `,
    },
    "rowSelect" : `
        <td non-data class="sticky -left-px bg-white px-4 py-2 w-0"><input type="checkbox"></td>
    `,
    "emptyBodyPlaceholder" : `
        <div class="flex justify-center items-center w-100 sticky left-0 h-16 text-lg text-gray-600 font-bold capitalize">No data found</div>  
    `,
    "emptyTablePlaceholder" : `
        <div class="w-full h-10 bg-gray-200"></div>
        <div class="w-full flex flex-col justify-center items-center p-6">
            <svg class="fill-gray-700" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" width="150.817px" height="150.817px" viewBox="0 0 150.817 150.817" style="enable-background:new 0 0 150.817 150.817;" xml:space="preserve">
                <path d="M58.263,64.946c3.58-8.537,9.834-16.039,18.456-21.02c6.644-3.842,14.225-5.876,21.902-5.876   c6.376,0,12.568,1.461,18.207,4.031V21.677C116.829,9.706,92.563,0,62.641,0C32.71,0,8.448,9.706,8.448,21.677v21.681   C8.436,54.75,30.372,64.061,58.263,64.946z M62.629,5.416c29.77,0,48.768,9.633,48.768,16.255c0,6.634-18.998,16.258-48.768,16.258   c-29.776,0-48.774-9.624-48.774-16.258C13.855,15.049,32.853,5.416,62.629,5.416z M8.429,75.883V54.202   c0,10.973,20.396,20.015,46.841,21.449c-1.053,7.21-0.311,14.699,2.375,21.799C30.055,96.445,8.436,87.184,8.429,75.883z    M95.425,125.631c-9.109,2.771-20.457,4.445-32.796,4.445c-29.931,0-54.193-9.706-54.193-21.684V86.709   c0,11.983,24.256,21.684,54.193,21.684c0.341,0,0.673-0.018,1.014-0.018C71.214,118.373,82.827,124.656,95.425,125.631z    M131.296,63.11c-10.388-17.987-33.466-24.174-51.46-13.785c-17.987,10.388-24.173,33.463-13.792,51.45   c10.388,17.993,33.478,24.174,51.465,13.798C135.51,104.191,141.684,81.102,131.296,63.11z M71.449,97.657   C62.778,82.66,67.945,63.394,82.955,54.72c15.01-8.662,34.275-3.504,42.946,11.509c8.672,15.013,3.502,34.279-11.508,42.943   C99.377,117.85,80.117,112.686,71.449,97.657z M139.456,133.852l-16.203,9.353l-12.477-21.598l16.209-9.359L139.456,133.852z    M137.708,149.562c-4.488,2.582-10.199,1.06-12.794-3.429l16.216-9.353C143.718,141.268,142.184,146.979,137.708,149.562z"/>
            </svg>
            <span class="text-gray-600 font-semibold text-4xl uppercase mt-3">No Data Found</span>
        </div>  
    `,
    "headRowProp" : `
        <tr class="bg-gray-200 whitespace-nowrap text-gray-700 font-semibold capitalize sticky -top-1 z-10 animate-pulse">\${data['columns']}</tr>
    `,
    "headColumnProp" : `
        <th class="h-10"></th>
    `,
    "bodyRowProp" : `
        <tr class="border-b border-gray-150 whitespace-nowrap text-gray-500 text-sm animate-pulse">\${data['row']}</tr>
    `,
    "bodyCellProp" : `
        <td class="px-4"><div class="my-2.5 mx-1 bg-gray-200 h-5 rounded">&nbsp;</div></td>
    `,
}