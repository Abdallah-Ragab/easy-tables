// Example #1 : existing html table
// const htmlTable = new easytables.Table(
//     tableWrapperSelector = '#table-container',
//     undefined,
//     ignoreCols = [0, 7, 8],
//     customHeadSelector = {
//         1: "div>div",
//         2: "div>div",
//         3: "div>div",
//         4: "div>div",
//         5: "div>div",
//         6: "div>div",
//         7: "div>div",
//     },
//     customBodySelector = {
//         2: "img",
//         6: "div",
//     }
// )
const htmlTable = new easytables.Table(
    '#table-container',
    undefined,
    [0, 7, 8],
    {
        1: "div>div",
        2: "div>div",
        3: "div>div",
        4: "div>div",
        5: "div>div",
        6: "div>div",
        7: "div>div",
    },
    {
        2: "img",
        6: "div",
    }
)
// Example #2 : creating html table from json input

// const jsonTable = new easytables.Table(
//     tableWrapperSelector = '#table-container-json',
//     data = {
//         "columns" : [
//             {
//                 "text" : "username",
//                 "type" : "bold",
//                 "filter" : ()=>{console.log("filtering by username ..")},
//             },
//             {
//                 "text" : "phone number",
//                 "filter" : ()=>{console.log("filtering by phone number ..")},
//             },
//             {
//                 "text" : "email",
//                 "filter" : ()=>{console.log("filtering by email ..")},
//             },
//             {
//                 "text" : "status",
//                 "type" : "label",
//                 "sort" : false,
//                 "colorCode" : [
//                     {
//                         "condition" : "equal",
//                         "value" : "pending",
//                         "color" : "yellow"
//                     },
//                     {
//                         "condition" : "equal",
//                         "value" : "online",
//                         "color" : "green"
//                     },
//                     {
//                         "condition" : "equal",
//                         "value" : "offline",
//                         "color" : "red"
//                     },
//                 ]
//             },
//             {
//                 "text" : "view",
//                 "type" : "button",
//                 "color" : "green",
//                 "callback" : ()=>{console.log("hello")}
//             },
//             {
//                 "text" : "delete",
//                 "type" : "button",
//                 "color" : "red",
//                 "callback" : ()=>{alert('Deleted Successfully')}
//             }
//         ],
//         "rows": [
//             {
//                 "username" : 'kyle232',
//                 "phone number" : "464564631",
//                 "email" : "nomadkyle12@mail.com",
//                 "status" : "online",
//             },
//             {
//                 "username" : 'ahmed565',
//                 "phone number" : "56465465",
//                 "email" : "ahmedemad21@mail.com",
//                 "status" : "online",
//             },
//             {
//                 "username" : 'salah11',
//                 "phone number" : "52415651",
//                 "email" : "mosalah@mail.com",
//                 "status" : "Pending",
//             },
//             {
//                 "username" : 'samehthesecond',
//                 "phone number" : "46546464",
//                 "email" : "sameh2th@mail.com",
//                 "status" : "offline",
//             },
//         ]
//     }
// )
const jsonTable = new easytables.Table(
    '#table-container-json',
    {
        "columns" : [
            {
                "text" : "username",
                "type" : "bold",
                "filter" : ()=>{console.log("filtering by username ..")},
            },
            {
                "text" : "phone number",
                "filter" : ()=>{console.log("filtering by phone number ..")},
            },
            {
                "text" : "email",
                "filter" : ()=>{console.log("filtering by email ..")},
            },
            {
                "text" : "status",
                "type" : "label",
                "sort" : false,
                "colorCode" : [
                    {
                        "condition" : "equal",
                        "value" : "pending",
                        "color" : "yellow"
                    },
                    {
                        "condition" : "equal",
                        "value" : "online",
                        "color" : "green"
                    },
                    {
                        "condition" : "equal",
                        "value" : "offline",
                        "color" : "red"
                    },
                ]
            },
            {
                "text" : "view",
                "type" : "button",
                "color" : "green",
                "callback" : ()=>{console.log("hello")}
            },
            {
                "text" : "delete",
                "type" : "button",
                "color" : "red",
                "callback" : ()=>{alert('Deleted Successfully')}
            }
        ],
        "rows": [
            {
                "username" : 'kyle232',
                "phone number" : "464564631",
                "email" : "nomadkyle12@mail.com",
                "status" : "online",
            },
            {
                "username" : 'ahmed565',
                "phone number" : "56465465",
                "email" : "ahmedemad21@mail.com",
                "status" : "online",
            },
            {
                "username" : 'salah11',
                "phone number" : "52415651",
                "email" : "mosalah@mail.com",
                "status" : "Pending",
            },
            {
                "username" : 'samehthesecond',
                "phone number" : "46546464",
                "email" : "sameh2th@mail.com",
                "status" : "offline",
            },
        ]
    }
)

// const randomData = async function (limit = 10) {
//     const allData = await fetch('data/data.json').then(r => r.json())
//     const randomStart = Math.floor(Math.random()*((allData.length-limit)-0+1)+0)
//     const randomSelectedData = allData.slice(randomStart, randomStart+limit)
//     const dataInput = makeInputFromMockData(randomSelectedData)
//     return dataInput
// }
// const makeInputFromMockData = (data) => {
//     let columns = Object.keys(data[0]).map((key, idx) => {
//         let obj = {"text" : key}
//         if (idx === 0){ obj['type'] = 'bold'}
//         if (key == "image"){ obj['type'] = 'image'}
//         return obj
//     })
//     let rows = data
//     return {"columns": columns, "rows": rows}
// }

// const createRandomTable = (limit = undefined) => {
//     randomData(limit).then(data => {    
//         window['mockTable'] = new easytables.Table(
//             tableWrapperSelector = '#table-container-mock',
//             data = data
//         )
//     })
// }
// createRandomTable(50)

