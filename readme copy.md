# Easy Tables
### A UI Library For Creating Html Tables With Ease. And Making Your Existing Html Tables Responsive With Sorting And Selecting Functionality.

- [Getting Started](#getting-started-)
- [Usage](#usage-)
  - [**Existing Table** : using attributes](#existing-table--using-attributes-)
    - [- **Setup**](#--setup-)
    - [- **Options**](#--options-)
  - [**Existing Table** : using javascript](#existing-table--using-javascript-)
    - [- **Setup**](#--setup--1)
    - [- **Parameters**](#--parameters-)
  - [**New Table** : Creating a table from a json object or an API call](#new-table--creating-a-table-from-a-json-object-or-an-api-call-)
    - [- **Setup**](#--setup--2)
    - [- **Parameters** ](#--parameters--1)
  - [**Retrieving the selected rows**](#retrieving-the-selected-rows)
  - [**Accessing the class instance of a table initiated by attributes**](#accessing-the-class-instance-of-a-table-initiated-by-attributes)

# Getting Started :
```
<script defer src="https://unpkg.com/easy-tables@0.2.0/dist/production.bundle.js"></script>

```
# Usage :
## **Existing Table** : using attributes :
### - **Setup** :
1. ### Create a container with the attribute **"table-container"** .
2. ### Create the table inside the container using the following structure :
    ```
    <table>
        <thead>
            <tr>
                <th>...</th>
                ...
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>...</td>
                ...
            </tr>
            ...
        </tbody>
    </table>
    ```
3. ### each row should have a unique identifier set by either adding the attribute **"unique-identifier"** to a head column like the following :
    ```
    <thead>
        <tr>
            <th unique-identifier>id</th>
            <th>...</th>
        </tr>
    </thead>
    ```
    ### or by setting the attribute **"row-id"** of each body row manually like the following :
    ```
    <tbody>
        <tr row-id="0"></tr>
        <tr row-id="1"></tr>
        ...
    </tbody>
    ```
4. ### if the the **"td"** or **"th"** tags are not a direct parent of the cell text, the **"data-container"** attribute should be added to the direct parent of the text. for example :
    ```
        <th>
            <div>...</div>
            <span data-container>First Name</span>
        </th>
    ```
5. ### if any columns does not have a data inside them and should not have a sorting functionality like columns that contains buttons or any other html elements, you should add the attribute **"non-data"** to there perspective **"th"** tags, for example :
    ```
        // A cell with a button:
        <td>
            <button>Edit</button>
        </td>

        // The column head should be:
        <th non-data>
            Edit
        </th>
    ```
### - **Options** :
- ### to enable sorting add the attribute **"sort"** to the container .
- ### to enable selecting add the attribute **"select"** to the container .


## **Existing Table** : using javascript :
### - **Setup** :
1.  ### Create a container .
2.  ### Create the table inside the container using the same structure in **Method 1**.
3. ### Define a table object like the following:
    ```
    const myTable = new easytables.HTMLTable(
        wrapper :str,
        uniqueIdentifierIndex :int, 
        ignoredColumns :array,
        customHeadSelector :object, 
        customBodySelector :object,
        enableSort :bool,
        enableSelect :bool,
    )
    ```
### - **Parameters** :
- ### **wrapper** : the css selector for the created container. for example : `"#my-container"`
- ### **uniqueIdentifierIndex** : the index of the column that's value is unique and can be used to identify each row. for example :
    ```
    // giving the following head structure:

    <thead>
        <tr>
            <th>customer id</th>        // 0
            <th>name</th>       // 1
            <th>phone number</th> // 2
        </tr>
    </thead>

    // where the "customer id" column is chosen to be the unique identifier
    // the index of the "customer id" column among its siblings is 0
    // therefore the value of "uniqueIdentifierIndex" parameter should be 0
    ``` 
- ### **ignoredColumns** : An array of the indexes of the the column that does not have a data inside them and should not have a sorting functionality like columns that contains buttons or any other html elements. for example :
    ```
    // giving the following table structure:
    <table>
        <thead>
            <tr>
                <th>..</th>         // 0
                <th>...</th>        // 1
                <th>Edit</th>       // 2
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>...</td>        // 0
                <td>...</td>        // 1
                <td>                // 2
                    <button>click to edit this row</button>
                </td> 
            </tr>
        </tbody>
    </table>

    // where the the column with the index of 2 does not contain data and should not not be treated as data
    // therefore the value of "ignoredColumns" parameter should be [2]
    ``` 
- ### **customHeadSelector** : An Object of head columns where **"th"** tags are not a direct parent of the head text. therefore the css selectors of the direct parent of the text should be specified using this object. for example :
    ```
    // giving the following head structure:
    <thead>
        <tr>
            <th>First name</th>         // 0
            <th>Last name</th>          // 1
            <th>                        // 2
                <div>
                    <div>...</div>
                    <div><img src="..."></div>
                    <span>Username</span>
                </div>
            </th>
        </tr>
    </thead>

    // the "th" tag of the column with the index of 2 is not a direct parent to the text of the column which is "Username".
    // and the direct parent of the column text is the "span" tag
    // the css selector of the span tag starting from the "th" tag is > "div>span"
    // therefore the value of "ignoredColumns" parameter should be {"2": "div>span", ....}
    ``` 
- ### **customBodySelector** : An Object of row cells where **"td"** tags are not a direct parent of the cell value. therefore the css selectors of the direct parent of the value should be specified using this object. for example :
    ```
    // giving the following body structure:
    <tbody>
        <tr>
            <td>                        // 0
                <p>Sir: </p>
                <span>Bill</span>
            </td>           
            <td>Gates</td>              // 1
        </tr>
    </tbody>

    // the "td" tag of the column with the index of 0 is not a direct parent to the cell value which is "Bill".
    // and the direct parent of the cell value is the "span" tag
    // the css selector of the span tag starting from the "td" tag is > "span"
    // therefore the value of "ignoredColumns" parameter should be {"0": "span", ....}
    ``` 
- ### **enableSort** : a boolean that specifies whether to enable the sorting functionality or not. default value is **true**. 
- ### **enableSelect** : a boolean that specifies whether to enable the selecting functionality or not. default value is **true**. 

## **New Table** : Creating a table from a json object or an API call :
### - **Setup** :
1. ### Define a table object like the following:
    ```
    const myTable = new easytables.Table(
        wrapper :str,
        rows :array or :object,
        options :object,
    )
    ```
### - **Parameters** :
- ### **wrapper** : the css selector for the created container. for example : `"#my-container"`
- ### **rows** : the rows parameter is used to represent the data of each row. it could be an array of objects in case you had the data locally. it can also be an object containing the endpoint and callbacks to fetch the rows array from an API.
  - ### **using local data**: the "rows" parameter is an array of objects. each object represents a single table row, defined as following :
    ```
    rows = [
        {
            column key : cell value,
            ...
        },
        ...
    ]
    ```
    for example :

    ```
    rows = [
        {
            "first name" : "Bill",
            "last name" : "Gates",
            "username" : "billgates",
        },
        {
            "first name" : "Larry",
            "last name" : "Page",
            "username" : "larrypage",
        },
        ...
    ]
    ```
  - ### **fetching from an API**: you can fetch the data for the table rows from an API where the response should be a JSON array of objects with the required structure shown above. to fetch the data from an API, the "rows" parameter should be an object representing an endpoint of an API, defined as following :
    ```
    rows = {
        url: string|required,
        onsuccess: function|optional,
        onerror: function|optional,
    }
    ```
    **onsuccess**: takes the response content as a singular parameter. the function is expected to return the "rows" array. should be used when you need to process the response to fit the required structure of the "rows" parameter. 

    **onerror**: takes the response object returned by the fetch request as a singular parameter.

    for example:
    ```
    rows = {
        url: "https://www.example.com/api/data"
        onsuccess: (data) => {console.log(data); return data}
        onerror: (response) => {console.error(`Fetching Data Failed. code: ${response.status}`)}
    }
    ```
- ### **options** : the options parameter is used to set different options for the table. which are listed below:
  - ### **uniqueID**: uniqueID property holds the key of the unique identifier. the unique identifier is a column whose value is unique for each column. its used to identify the selected rows by returning the value of the unique identifier's cell.
    \- for example: 
    ```
    const myTable = new easytables.Table(
        rows:[
            {id: 1, ...},
            {id: 2, ...},
            {id: 3, ...},
            ...
        ]
        options = {
            uniqueID: "id"
        }
    )
    ```  
  - ### **headers**: the headers property is an array used to set options for each column. and to create a static columns that are not represented by a key in the "rows" parameter as it does not differ from row to row. like buttons or any other html elements.
    ### **the columns options are listed below:**

    - ### **"text"** is an optional property. used to set the text of the column. if not set the column's key will be used.
        ```
        rows=[
            {name: "..."}
        ]
        options={
            headers: {
                "name": {
                    text: "Full Name"    // if not set the key "name" will be used.
                }
            }
        }
        ```
    - ### **"type"** is an optional property that represents the type of the cell which can be one of the following `["text", "bold", "image", "label", "button", "html"]`. 
    - ### **"filter"** is an optional function. if set the a filter button will be added to the column head. when clicked the function will be called.
    - ### **"sort"** is an optional property which specify whether to enable sorting by this column or not. default value is **true**.
    - ### **"color"** is an optional property specific for the columns with the type of "button" or "label" when the "colorCode" property is not set. the value can be one of the following colors : `[slate, gray, zinc, neutral, stone, red, orange, amber, yellow, lime, green, emerald, teal, cyan, sky, blue, indigo, violet, purple, fuchsia, pink, rose]` .
    - ### **"callback"** is an optional property specific for the columns with the type of "button". it represents a callback function which will be called once the button was clicked.
    - ### **"template"** is an optional property specific for the columns with the type of "html". it represents a html template that gets render at the cells with the type "html". the template may contain variables using the following format `\${data['variable_name']}`. for example:
        ```
        headers: {
            "card": {
                text: "Info card",
                type: "html",
                template: "<h1>Name: \${data['name']}</h1><h2>Age: \${data['age']}</h2>"
            }
        ``` 
        and the variable's values can be set for each row by setting the the value of the column key to an object inside the "rows" parameter where each property of the object represents a variable. for example:
        ```
        rows = [
            {
                "card" : {
                    name: "Bill",
                    age: "19"
                }
            }
        ]
        ``` 
    - ### **"colorCode"** is an optional property specific for the columns with the type of "label". which is an array that can be used to set the color of the label dynamically using a pre-defined conditions. for example:
        ```
        "colorCode" : [

            // if the value of the label cell is "equal" to "online" the color of the label will be "green"
            {
                "condition" : "equal",
                "value" : "online",
                "color" : "green"
            },

            // if the value of the label cell is "equal" to "online" the color of the label will be "green"
            {
                "condition" : "equal",
                "value" : "offline",
                "color" : "red"
            },
        ]
        ```

## **Retrieving the selected rows**:
Selected rows can be retrieved by calling the **"getSelectedRows"** function which returns an array of the unique identifiers of the selected rows.

## **Accessing the class instance of a table initiated by attributes**:
In the case of an existing table initiated by attributes where you have no access to the initiated class instance you can access the class instance using the property **"tableInstance"** of the table container node object.
for example :
```
// if the html structure is like following
<html>
    <body>
        <div table-container>
            <table>....</table>
        </div>
    </body>
</html>

// the class instance will be :
const tableContainerNode = document.querySelector("[table-container]")
const myTableInstance = tableContainerNode.tableInstance 
const selectedRows = myTableInstance.getSelectedRows()
```  
