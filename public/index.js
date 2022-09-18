const jsonTable = new easytables.JsonTable(
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
                "text" : "avatar",
                "type" : "image",
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
                "avatar" : "https://picsum.photos/300/300",
                "status" : "online",
            },
            {
                "username" : 'ahmed565',
                "phone number" : "56465465",
                "email" : "ahmedemad21@mail.com",
                "avatar" : "https://picsum.photos/300/300",
                "status" : "online",
            },
            {
                "username" : 'salah11',
                "phone number" : "52415651",
                "email" : "mosalah@mail.com",
                "avatar" : "https://picsum.photos/300/300",
                "status" : "Pending",
            },
            {
                "username" : 'samehthesecond',
                "phone number" : "46546464",
                "email" : "sameh2th@mail.com",
                "avatar" : "https://picsum.photos/300/300",
                "status" : "offline",
            },
        ]
    },
    '2'
)
