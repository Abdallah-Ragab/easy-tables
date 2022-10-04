# Easy Tables
### A UI Library For Creating Html Tables With Ease. And Making Your Existing Html Tables Responsive With Sorting And Selecting Functionality.


# Table of content :

- [**Getting Started**](#getting-started-)
- [**Usage: Existing Tables:**](#usage-existing-tables)
  - [1. **Using Attributes**:](#1-using-attributes)
    - [**The table container**](#the-table-container--create-a-div-element-with-the-attribute-table-container-)
    - [**The table element**](#the-table-element--create-the-table-inside-the-container-using-the-following-structure-)
    - [**The unique identifier**](#the-unique-identifier--the-unique-identifier-is-a-column-whose-value-is-unique-for-each-column-its-used-to-identify-the-selected-rows-by-returning-the-value-of-the-unique-identifiers-cell-of-the-selected-row-each-row-should-have-a-unique-identifier-set-by-either-adding-the-attribute-unique-identifier-to-a-head-column-like-the-following-)
    - [**Custom data selectors**](#custom-data-selectors--if-the-the-td-or-th-tags-are-not-a-direct-parent-of-the-cell-text-the-data-container-attribute-should-be-added-to-the-direct-parent-of-the-text-for-example-)
    - [**Columns without data**](#columns-without-data--if-any-columns-does-not-have-a-data-inside-them-and-should-not-have-a-sorting-functionality-like-columns-that-contains-buttons-or-any-other-html-elements-you-should-add-the-attribute-non-data-to-there-perspective-th-tags-for-example-)
    - [**Enable sorting by columns**](#enable-sorting-by-columns--to-enable-sorting-add-the-attribute-sort-to-the-container-)
    - [**Enable selecting rows**](#enable-selecting-rows--to-enable-selecting-add-the-attribute-select-to-the-container-)
  - [2. **Using JavaScript**:](#2-using-javascript)
    - [**The table container**](#the-table-container--create-a-div-element-with-the-attribute-table-container--1)
    - [**The table element**](#the-table-element--create-the-table-inside-the-container-using-the-following-structure--1)
    - [**Initiate the table**](#initiate-the-table--using-the-following-structure-)
    - [**"wrapper" parameter**](#wrapper-parameter--the-css-selector-for-the-created-container-for-example--my-container)
    - [**The unique identifier : "uniqueIdentifierIndex" parameter**](#the-unique-identifier--uniqueidentifierindex-parameter--the-index-of-the-column-thats-value-is-unique-and-can-be-used-to-identify-each-row-for-example-)
    - [**Columns without data: "ignoredColumns" parameter**](#columns-without-data-ignoredcolumns-parameter--an-array-of-the-indexes-of-the-the-column-that-does-not-have-a-data-inside-them-and-should-not-have-a-sorting-functionality-like-columns-that-contains-buttons-or-any-other-html-elements-for-example-)
    - [**Custom data selectors: "customHeadSelector" parameter**](#custom-data-selectors-customheadselector-parameter--an-object-of-head-columns-where-th-tags-are-not-a-direct-parent-of-the-head-text-therefore-the-css-selectors-of-the-direct-parent-of-the-text-should-be-specified-using-this-object-for-example-)
    - [**Custom data selectors: "customBodySelector" parameter**](#custom-data-selectors-custombodyselector-parameter--an-object-of-row-cells-where-td-tags-are-not-a-direct-parent-of-the-cell-value-therefore-the-css-selectors-of-the-direct-parent-of-the-value-should-be-specified-using-this-object-for-example-)
    - [**Enable sorting by columns: "enableSort" parameter**](#enable-sorting-by-columns-enablesort-parameter--a-boolean-that-specifies-whether-to-enable-the-sorting-functionality-or-not-default-value-is-true)
    - [**Enable selecting rows: "enableSelect" parameter**](#enable-selecting-rows-enableselect-parameter--a-boolean-that-specifies-whether-to-enable-the-selecting-functionality-or-not-default-value-is-true)
- [**Usage: Create New Tables:**](#usage-create-new-tables)
  - [**Initiate the table**:](#initiate-the-table)
    - [1. **The "wrapper" parameter**](#1-the-wrapper-parameter-)
    - [2. **The "rows" parameter**](#2-the-rows-parameter-)
    - [3.**The "options" parameter**](#3the-options-parameter--the-options-parameter-is-used-to-set-different-options-for-the-table-the-parameter-can-be-set-directly-or-by-calling-an-api-check-out-how-to-fetch-options-from-an-api)
  - [**Table headers types**:](#table-headers-types)
    - [1. **text**](#1-text--is-the-basic-header-type-for-data-displayed-as-normal-text-the-text-header-options-are-)
    - [2. **bold**](#2-bold--similer-to-text-but-displayed-in-bold-font-takes-the-same-header-options-as-text-)
    - [3. **image**](#3-image--displays-a-circular-image-uses-the-data-from-the-rows-parameter-as-a-source-for-the-image-data-option-is-false-by-default-takes-the-following-options)
    - [4. **label**](#4-label--displays-a-colored-label-image-the-color-can-be-set-dynamically-using-the-colorcode-option-which-sets-the-color-based-on-the-value-of-the-column-takes-the-following-options)
    - [5. **button**](#5-button--renders-a-button-that-calls-the-function-set-by-callback-option-when-clicked-data-option-is-false-by-default-takes-the-following-options)
    - [6. **html**](#6-html--renders-html-template-with-variables-data-option-is-false-by-default-takes-the-following-options)
  - [**Fetching data from an API**](#fetching-data-from-an-api)
  - [**Fetching data from an API**:](#fetching-data-from-an-api)
  - [**Retrieving the selected rows**](#retrieving-the-selected-rows)
  - [**Accessing the class instance of a table initiated by attributes**](#accessing-the-class-instance-of-a-table-initiated-by-attributes)

# **Getting Started** :
```
<script defer src="https://unpkg.com/easy-tables@0.2.0/dist/production.bundle.js"></script>

```
# **Usage: Existing Tables:**
## 1. **Using Attributes**:
  - ### **The table container** : Create a div element with the attribute **"table-container"** .
  - ### **The table element** : Create the table inside the container using the following structure :
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

  - ### **The unique identifier** : the unique identifier is a column whose value is unique for each column. its used to identify the selected rows by returning the value of the unique identifier's cell of the selected row. each row should have a unique identifier set by either adding the attribute **"unique-identifier"** to a head column like the following :
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
  - ### **Custom data selectors:** : if the the **"td"** or **"th"** tags are not a direct parent of the cell text, the **"data-container"** attribute should be added to the direct parent of the text. for example :
        ```
        <th>
            <div>...</div>
            <span data-container>First Name</span>
        </th>
        ```
  - ### **Columns without data:** : if any columns does not have a data inside them and should not have a sorting functionality like columns that contains buttons or any other html elements, you should add the attribute **"non-data"** to there perspective **"th"** tags, for example :
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
  - ### **Enable sorting by columns** : to enable sorting add the attribute **"sort"** to the container .
  - ### **Enable selecting rows** : to enable selecting add the attribute **"select"** to the container .

## 2. **Using JavaScript**:
  - ### **The table container** : Create a div element with the attribute **"table-container"** .
  - ### **The table element** : Create the table inside the container using the following structure :
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
  - ### **Initiate the table** : Using the following Structure :
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
  - ### **"wrapper" parameter** : the css selector for the created container. for example : `"#my-container"`
  - ### **The unique identifier : "uniqueIdentifierIndex" parameter** : the index of the column that's value is unique and can be used to identify each row. for example :
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
  - ### **Columns without data: "ignoredColumns" parameter** : An array of the indexes of the the column that does not have a data inside them and should not have a sorting functionality like columns that contains buttons or any other html elements. for example :
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
  - ### **Custom data selectors: "customHeadSelector" parameter** : An Object of head columns where **"th"** tags are not a direct parent of the head text. therefore the css selectors of the direct parent of the text should be specified using this object. for example :
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
  - ### **Custom data selectors: "customBodySelector" parameter** : An Object of row cells where **"td"** tags are not a direct parent of the cell value. therefore the css selectors of the direct parent of the value should be specified using this object. for example :
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
  - ### **Enable sorting by columns: "enableSort" parameter** : a boolean that specifies whether to enable the sorting functionality or not. default value is **true**. 
  - ### **Enable selecting rows: "enableSelect" parameter** : a boolean that specifies whether to enable the selecting functionality or not. default value is **true**. 

# **Usage: Create New Tables:**
## **Initiate the table**: 
Define a table instance like the following:
```
const myTable = new easytables.Table(
    wrapper :str,
    rows :array or :object,
    options :object,
)
```
### 1. **The "wrapper" parameter** : 
the css selector for the created container. for example : `"#my-container"`
### 2. **The "rows" parameter** : 
the rows parameter is used to represent the data of each row. it could be an array of objects in case you had the data locally. it can also be an object containing the endpoint and callbacks to fetch the rows array from an API. Check out how to [**Fetch "rows" data from an API**.](#fetching-data-from-an-api)

the "rows" parameter is an array of objects. each object represents a single table row, defined as following :
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
### 3.**The "options" parameter** : the options parameter is used to set different options for the table. the parameter can be set directly or by calling an API. Check out how to [**Fetch "options" from an API**.](#fetching-data-from-an-api)

### The "options" properties are listed below:
  - ### **uniqueID**: "uniqueID" property holds the key of the unique identifier. the unique identifier is a column whose value is unique for each column. its used to identify the selected rows by returning the value of the unique identifier's cell.
    for example: 
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
  - ### **headers**: the headers property is used to set options for each column. check out the [**Table headers types**](#table-headers-types) for the available options for each type.
## **Table headers types**: 
The value of the "headers" property of the "options" depends on the type of the header. The default type is "text".
The header types are :
### 1. **text** : is the basic header type for data displayed as normal text. the "text" header options are :
- **"type"** is an optional property that represents the type of the cell which can be one of the following. default value is "text".
- ***"text"** is an optional property. used to set the text of the column. if not set the column's key will be used.
- **"filter"** is an optional function. if set the a filter button will be added to the column head. when clicked the function will be called.
- **"data"** if false the column is considered static and the "sort" and "filter" options are disabled by default. default value is **true**.
- **"sort"** is an optional property which specify whether to enable sorting by this column or not. default value is **true**.
- **"render"** is an optional property which specify whether to render this column or not. default value is **true**.
**Example :**
```
headers: {
    "name": {
        type: "text",
        text: "Full Name",
        sort: false,
        filter: (console.log("filtering by name .."))
    }
}
```
### 2. **bold** : similer to "text" but displayed in bold font. takes the same header options as "text" :
- **"type"** is an optional property that represents the type of the cell which can be one of the following. default value is "text".
- ***"text"** is an optional property. used to set the text of the column. if not set the column's key will be used.
- **"filter"** is an optional function. if set the a filter button will be added to the column head. when clicked the function will be called.
- **"data"** if false the column is considered static and the "sort" and "filter" options are disabled by default. default value is **true**.
- **"sort"** is an optional property which specify whether to enable sorting by this column or not. default value is **true**.
- **"render"** is an optional property which specify whether to render this column or not. default value is **true**.
**Example :**
```
headers: {
    "company": {
        type: "bold",
        text: "Company Name",
        sort: true,
        filter: (console.log("filtering by company .."))
    }
}
```
### 3. **image** : displays a circular image. uses the data from the "rows" parameter as a source for the image. "data" option is false by default. takes the following options:
- **"type"** is an optional property that represents the type of the cell which can be one of the following. default value is "text".
- ***"text"** is an optional property. used to set the text of the column. if not set the column's key will be used.
- **"render"** is an optional property which specify whether to render this column or not. default value is **true**.
- **"data"** if false the column is considered static and the "sort" and "filter" options are disabled by default. default value is **true**.

**Example :**
```
headers: {
    "avatar": {
        type: "image",
        text: "Avatar"
    }
}
```
### 4. **label** : displays a colored label image. the color can be set dynamically using the "colorCode" option which sets the color based on the value of the column. takes the following options:
- **"type"** is an optional property that represents the type of the cell which can be one of the following. default value is "text".
- ***"text"** is an optional property. used to set the text of the column. if not set the column's key will be used.
- **"filter"** is an optional function. if set the a filter button will be added to the column head. when clicked the function will be called.
- **"sort"** is an optional property which specify whether to enable sorting by this column or not. default value is **true**.
- **"render"** is an optional property which specify whether to render this column or not. default value is **true**.
- **"data"** if false the column is considered static and the "sort" and "filter" options are disabled by default. default value is **true**.
- **"colorCode"** is an optional property specific for the columns with the type of "label". which is an array that can be used to set the color of the label dynamically using a pre-defined conditions.
- **"color"** is an optional property specific for the columns with colors like "label" and "button". it's used to set the color statically when the "colorCode" is not set.

**Example :**
```
headers: {
    "state": {
        type: "label",
        colorCode: [
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
        ],
        color: "blue"
    }
}
```
### 5. **button** : renders a button that calls the function set by "callback" option when clicked. "data" option is false by default. takes the following options:
- **"type"** is an optional property that represents the type of the cell which can be one of the following. default value is "text".
- ***"text"** is an optional property. used to set the text of the column. if not set the column's key will be used.
- **"filter"** is an optional function. if set the a filter button will be added to the column head. when clicked the function will be called.
- **"sort"** is an optional property which specify whether to enable sorting by this column or not. default value is **true**.
- **"render"** is an optional property which specify whether to render this column or not. default value is **true**.
- **"data"** if false the column is considered static and the "sort" and "filter" options are disabled by default. default value is **true**.
- **"color"** is an optional property specific for the columns with colors like "label" and "button". it's used to set the color statically when the "colorCode" is not set.
- **"value"** is an optional property specific for the columns with static value like "button" to set the label of the button element. when not set the column text or key is used.

**Example :**
```
headers: {
    "delete": {
        type: "button",
        color: "red",
        value: "click to delete",
        callback: ()=>{console.log("deleting ... ")}
    }
}
```
### 6. **html** : renders html template with variables. "data" option is false by default. takes the following options:
- **"type"** is an optional property that represents the type of the cell which can be one of the following. default value is "text".
- ***"text"** is an optional property. used to set the text of the column. if not set the column's key will be used.
- **"render"** is an optional property which specify whether to render this column or not. default value is **true**.
- **"data"** if false the column is considered static and the "sort" and "filter" options are disabled by default. default value is **true**.
- **"template"** is an optional property specific for the columns with the type of "html". it represents a html template that gets rendered at the cells with the type "html". the template may contain variables using the following format `\${data['variable_name']}`.

**Example :**
```
headers: {
    "card": {
        text: "Info card",
        type: "html",
        template: "<h1>Name: \${data['name']}</h1><h2>Age: \${data['age']}</h2>"
    }
}
```
and the variable's values can be set for each row by setting the the value of the column key to inside the "rows" parameter to an object. where each property of the object represents a variable. 

**For the previous example the rows parameter should be like this:**
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
## **Fetching data from an API**: 
you can fetch the "rows" or "options" parameters from an API where the response should be the value of the parameter with the required structure shown above. to fetch the data from an API, set the parameter's value to an object representing an endpoint of an API, defined as following :
```
rows = {
    url: string|required,
    onsuccess: function|optional,
    onerror: function|optional,
}
```
**onsuccess**: called once the request is successful. takes the response content as a singular parameter. the function is expected to return the "rows" array. should be used when you need to process the response to fit the required structure of the "rows" parameter. 

**onerror**: called once the request is not successful. takes the response object returned by the fetch request as a singular parameter.

for example:
```
rows = {
    url: "https://www.example.com/api/data"
    onsuccess: (data) => {console.log(data); return data}
    onerror: (response) => {console.error(`Fetching Data Failed. code: ${response.status}`)}
}
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

