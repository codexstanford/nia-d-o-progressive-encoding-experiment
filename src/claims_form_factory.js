// No return value
function addRowsToTableWithID(tableElemID, rowList) {
     let table = document.getElementById(tableElemID);

     for (let i = 0; i < rowList.length; i++) {
         table.appendChild(rowList[i]);
     }
}

// Can be used for headings, subheadings, and subsubheadings (and beyond)
function newHeadingRow(titleText, rowID, classList) {
    let headingContent = _newTableCell(2, "<strong>" + titleText + "</strong>");
    
    let headingRow = _newTableRow(rowID, classList);
    headingRow.appendChild(headingContent);

    return headingRow;
}

function newClaimsFormInputRow(cellList, addtlClassList = []) {
    let inputRow = _newTableRow("", ["info-row", "claim-info-row", ...addtlClassList]);

    for (let cell of cellList) {
        inputRow.appendChild(cell);
    }

    return inputRow;
}

function newClaimsFormInputCell(colSpan, inputType, defaultInput, cellText, inputID, disabled = false) {
    let inputElem = _newInputElem(inputType, defaultInput, inputID);

    inputElem.disabled = disabled;
    
    return _newTableCell(colSpan, cellText + inputElem.outerHTML);
}

function newClaimsFormSelectCell(colSpan, defaultInput, cellText, inputID, selectOptions) {
    let inputElem = _newInputElem("select", defaultInput, inputID, selectOptions);
    
    return _newTableCell(colSpan, cellText + inputElem.outerHTML);
}

/********* START helper functions for the creation of table rows, cells, and input elements *********/

function _newTableRow(rowID, classList) {
    let row = document.createElement("tr");

    if (rowID !== "") {
        row.id = rowID;
    }

    row.classList.add(...classList);
    
    return row;
}

function _newTableCell(colspan, innerHTML) {
    let cell = document.createElement("td");

    cell.colSpan = colspan;

    cell.innerHTML = innerHTML;
    
    return cell;
}

// selectOptions: should be null, unless inputType === "select". Should be a list of [value, text] pairs
function _newInputElem(inputType, defaultInput, inputID, selectOptions = null) {
    let inputElement = null;
    
    if (inputType === "select") {
        inputElement = document.createElement("select");
    } else {
        inputElement = document.createElement("input");
        inputElement.type = inputType;
    }

    inputElement.id = inputID;

    if (inputType === "checkbox") {
        if (defaultInput === true) {
            inputElement.setAttribute("checked", "true");
        }

        return inputElement;
    }
    
    if (inputType === "text" || 
        inputType === "number" || 
        inputType === "date" ||
        inputType === "time") {
        
        inputElement.setAttribute("value", defaultInput);
        return inputElement;
    }
    
    if (inputType === "select") {
        inputElement.classList.add("option-dropdown");

        if (selectOptions !== null) {
    
            for (let i = 0; i < selectOptions.length; i++) {
                let option = document.createElement("option");
                option.value = selectOptions[i][0];
                option.text = selectOptions[i][1];
                inputElement.appendChild(option);
            }
        }

        return inputElement;
    }

    // Invalid element type
    let errorElement = document.createElement("template");
    errorElement.innerHTML = `<div><strong>Invalid input element type</strong></div>`;
    return errorElement.content.children[0];
}

/********* END Private helper functions for the creation of table rows, cells, and input elements *********/


// A collapsible table that allows the user to create and enter information about multiple objects of the same type (e.g. periods of work, vaccinations)
// Returns a row containing a single cell, which contains the table
function newClaimsFormSubElementTable(subElementTableID, subElementTableTitle, subElementEnglishName, subElementIDPrefix, subElementEpilogType, subElementAttributeRelationPredicate, subElementBelongingObjectTemplate, allowEditingSubElementID, subElementSpecificRowSpecs, update_coverage_indicator_callback) {

    let subElementTable = document.createElement("table");

    subElementTable.id = subElementTableID;
    subElementTable.classList.add("subelement-table");

    // Class for rows of the table that contain information about subelements (i.e. not the heading row)
    const SUB_ELEM_ID_AND_CLASS_PREFIX = subElementTableTitle.toLowerCase().replace(/\s/g, '-');
    const SUB_ELEM_ROW_CLASS = SUB_ELEM_ID_AND_CLASS_PREFIX + "-subelem-input-row";

    // Create the collapse, expand, "add another subelement" and "remove this subelement" buttons
        // Creates and adds the event listeners for each button
        // "removeThisSubElemButtonPrototype" is only used in the event listener for the "add another subelement" button, but currently returned anyway
    let [collapseSubElemTableButton, expandSubElemTableButton, addAnotherSubElemButton, removeThisSubElemButtonPrototype] = _createSubElemTableButtons(subElementTable, subElementTableID, SUB_ELEM_ID_AND_CLASS_PREFIX, SUB_ELEM_ROW_CLASS, subElementEnglishName, subElementIDPrefix, subElementEpilogType, subElementAttributeRelationPredicate, subElementBelongingObjectTemplate, allowEditingSubElementID, subElementSpecificRowSpecs, update_coverage_indicator_callback);
    

    // -- Build the heading row, with an "add another subelement" button
    let headingRowCell = _newTableCell(2, "");
        // Collapse/expand buttons
    headingRowCell.appendChild(collapseSubElemTableButton);
    headingRowCell.appendChild(expandSubElemTableButton);

        // Title
    let headingRowTitle = document.createElement("strong");
    headingRowTitle.innerHTML = " " + subElementTableTitle + " ";
    headingRowCell.appendChild(headingRowTitle);
        // "Add another subelement" button
    headingRowCell.appendChild(addAnotherSubElemButton);

    let headingRow = _newTableRow(subElementTableID, ["subelement-table-heading-row", "claims-processing-section-subheading"]);
    headingRow.appendChild(headingRowCell);

    // -- Add the heading to the subelement table
    subElementTable.appendChild(headingRow);

    // -- Wrap the subelement table in a row and cell for the outermost table
    let containerCell = _newTableCell(2, "");
    containerCell.appendChild(subElementTable);
    containerCell.classList.add("subelement-table-container-cell");

    let containerRow = _newTableRow(subElementTableID + "-container-row", ["info-row", "claim-info-row", "subelement-table-container"]);
    containerRow.appendChild(containerCell);
    return containerRow;
}

/********* Private helper functions for the creation of subelement tables *********/

// Creates the collapse, expand, "add another subelement", and "remove this subelement" buttons
function _createSubElemTableButtons(subElementTable, subElementTableID, SUB_ELEM_ID_AND_CLASS_PREFIX, SUB_ELEM_ROW_CLASS, subElementEnglishName, subElementIDPrefix, subElementEpilogType, subElementAttributeRelationPredicate, subElementBelongingObjectTemplate, allowEditingSubElementID, subElementSpecificRowSpecs, update_coverage_indicator_callback) {
    // -- Collapse Button
    let collapseSubElemTableButton = document.createElement("button");
    collapseSubElemTableButton.innerHTML = "v";
    collapseSubElemTableButton.classList.add("collapse-subelement-table-button");
    const COLLAPSE_SUB_ELEM_TABLE_BUTTON_ID = subElementTableID + "-collapse-subelement-table-button";
    collapseSubElemTableButton.id = COLLAPSE_SUB_ELEM_TABLE_BUTTON_ID;

        // Collapse Callback
    collapseSubElemTableButton.addEventListener("click", function() {
        let subElemTableRows = document.getElementsByClassName(SUB_ELEM_ROW_CLASS);

        for (let i = 0; i < subElemTableRows.length; i++) {
            subElemTableRows[i].style.display = "none";
        }

        collapseSubElemTableButton.style.display = "none";
        expandSubElemTableButton.style.display = "inline-flex";
    });

    // -- Expand Button

    let expandSubElemTableButton = document.createElement("button");
    expandSubElemTableButton.innerHTML = ">";
    expandSubElemTableButton.classList.add("expand-subelement-table-button");
    const EXPAND_SUB_ELEM_TABLE_BUTTON_ID = subElementTableID + "-expand-subelement-table-button";
    expandSubElemTableButton.id = EXPAND_SUB_ELEM_TABLE_BUTTON_ID;
    expandSubElemTableButton.style.display = "none";

        // Expand Callback
    function expandSubElemTableCallback() {
        let subElemTableRows = document.getElementsByClassName(SUB_ELEM_ROW_CLASS);

        for (let i = 0; i < subElemTableRows.length; i++) {
            subElemTableRows[i].style.display = "table-row";
        }

        expandSubElemTableButton.style.display = "none";
        collapseSubElemTableButton.style.display = "inline-flex";
    }

    expandSubElemTableButton.addEventListener("click", expandSubElemTableCallback);

    // -- "Remove This Subelement" Button
    let removeThisSubElemButtonPrototype = document.createElement("button");
    removeThisSubElemButtonPrototype.innerHTML = "-";
    let removeThisSubElemButtonClass = subElementTableID + "-remove-this-subelement-button";
    removeThisSubElemButtonPrototype.classList.add(removeThisSubElemButtonClass, "remove-this-subelement-button");

        // "Remove This Subelement" callback is constructed in _addEventListenerForAddAnotherButton

    // -- "Add Another Subelement" Button
    let addAnotherSubElemButton = document.createElement("button");
    addAnotherSubElemButton.innerHTML = "+";
    let addAnotherSubElemButtonClass = subElementTableID + "-add-another-subelement-button";
    addAnotherSubElemButton.classList.add(addAnotherSubElemButtonClass, "add-another-subelement-button");
    
    _addEventListenerForAddAnotherButton(subElementTable, addAnotherSubElemButton, removeThisSubElemButtonPrototype, SUB_ELEM_ID_AND_CLASS_PREFIX, SUB_ELEM_ROW_CLASS, expandSubElemTableCallback, subElementEnglishName, subElementIDPrefix, subElementEpilogType, subElementAttributeRelationPredicate, subElementBelongingObjectTemplate, allowEditingSubElementID, subElementSpecificRowSpecs, update_coverage_indicator_callback);
    
    return [collapseSubElemTableButton, expandSubElemTableButton, addAnotherSubElemButton, removeThisSubElemButtonPrototype];
}

function _addEventListenerForAddAnotherButton(subElementTable, addAnotherSubElemButton, removeThisSubElemButtonPrototype, SUB_ELEM_ID_AND_CLASS_PREFIX, SUB_ELEM_ROW_CLASS, expandSubElemTableCallback, subElementEnglishName, subElementIDPrefix, subElementEpilogType, subElementAttributeRelationPredicate, subElementBelongingObjectTemplate, allowEditingSubElementID, subElementSpecificRowSpecs, update_coverage_indicator_callback) {
    // For a given subelement table, this class is given to all cells that contain an input element for the object constant of a subelement.
        // For now, used to get all the object constants for subelements of a given type.
    const SUB_ELEM_OBJ_CONST_INPUT_CELL_CLASS = SUB_ELEM_ID_AND_CLASS_PREFIX + "-subelem-id-input-cell";

    // Function to add rows for a new subelement
    // For me: Take a look and conceptually clean this up, if necessary
    addAnotherSubElemButton.addEventListener("click", function() {
        // --- Ensure the subelement table isn't collapsed before adding another subelement. 
        expandSubElemTableCallback();
        
        // Compute the suffix of the element id by incrementing the index of the last subelement by one.
        let subElemIndex = 0;
        let currentSubElemIDInputCells = document.getElementsByClassName(SUB_ELEM_OBJ_CONST_INPUT_CELL_CLASS);
        if (currentSubElemIDInputCells.length > 0) {
            // Get the number off the end of the id of the last subelem id row
            subElemIndex = parseInt(currentSubElemIDInputCells.item(currentSubElemIDInputCells.length - 1).id.substring(SUB_ELEM_OBJ_CONST_INPUT_CELL_CLASS.length+1));
            subElemIndex += 1;
        }

        // Compute a class that will be shared by all rows for this subelement
        const THIS_SUB_ELEM_ROW_CLASS = SUB_ELEM_ID_AND_CLASS_PREFIX + "-subelem-input-row-" + subElemIndex;
        
        // --- Construct the rows for a new subelement

        // -- Create the row that displays the object constant of the subelement
        const SUB_ELEM_OBJ_CONST = subElementIDPrefix + "_obj_" + subElemIndex;
        let subElemObjConstInputFieldID = SUB_ELEM_ID_AND_CLASS_PREFIX + "-subelem-id-input-field-" + subElemIndex;
        let newSubElemObjConstCell = newClaimsFormInputCell(2, "text", SUB_ELEM_OBJ_CONST, " "+ subElementEnglishName + " ID: ", subElemObjConstInputFieldID, !allowEditingSubElementID);
        newSubElemObjConstCell.id = SUB_ELEM_OBJ_CONST_INPUT_CELL_CLASS + "-" + subElemIndex;
        newSubElemObjConstCell.classList.add(SUB_ELEM_OBJ_CONST_INPUT_CELL_CLASS, "subelem-obj-const-input-cell");
        // Set the data needed for linking the subelement to the claim
        let subElemIDInputElem = newSubElemObjConstCell.getElementsByTagName("input")[0];
        const newSubElemObjConstInputID = subElemIDInputElem.id;
        newSubElemObjConstCell.dataset.subElemObjConstInputID = newSubElemObjConstInputID;
        newSubElemObjConstCell.dataset.factTemplate = subElementAttributeRelationPredicate + "(" + subElementBelongingObjectTemplate + ", $SUB_ELEM_ID$)\n type($SUB_ELEM_ID$, " + subElementEpilogType + ")";

        console.log(newSubElemObjConstCell.dataset.factTemplate);

        // Add the update coverage indicator callback, if relevant
        if (allowEditingSubElementID) {
            subElemIDInputElem.addEventListener("change", () => update_coverage_indicator_callback());
        }

        // Create the button for removing the rows for this subelement
        let newRemoveThisSubElemButton = document.createElement("button");
        newRemoveThisSubElemButton.innerHTML = removeThisSubElemButtonPrototype.innerHTML;
        newRemoveThisSubElemButton.classList.add(...removeThisSubElemButtonPrototype.classList)

            // Add the "remove this subelement" callback to the button
        newRemoveThisSubElemButton.addEventListener("click", function() {
            // thisSubElemRows is a live HTMLCollection, so removing elements from the DOM will remove elements from thisSubElemRows
            let thisSubElemRows = document.getElementsByClassName(THIS_SUB_ELEM_ROW_CLASS);
            while (thisSubElemRows.length > 0) {
                thisSubElemRows[0].parentNode.removeChild(thisSubElemRows[0]);
            }
            update_coverage_indicator_callback();
        });

        // Prepend in order to put the button to the left of the object constant text and input field
        newSubElemObjConstCell.prepend(newRemoveThisSubElemButton);
        // Package the cell into a row
        let newSubElemObjConstRow = newClaimsFormInputRow([newSubElemObjConstCell], [SUB_ELEM_ROW_CLASS, THIS_SUB_ELEM_ROW_CLASS]);
        

        // -- Build the rows specific to this type of subelement
        let subElementSpecificRows = [];

        for (let rowSpec of subElementSpecificRowSpecs) {
            let cellList = [];

            for (let cellSpec of rowSpec) {
                let inputID = SUB_ELEM_ID_AND_CLASS_PREFIX + "-" + cellSpec.fieldSpecificIDSubstring + "-" +subElemIndex;
                cellList.push(_newSubElemInputCell(cellSpec.colSpan, cellSpec.inputType, cellSpec.defaultInput, cellSpec.cellText, inputID, cellSpec.factTemplate, newSubElemObjConstInputID, update_coverage_indicator_callback));
            }

            subElementSpecificRows.push(newClaimsFormInputRow(cellList, [SUB_ELEM_ROW_CLASS, THIS_SUB_ELEM_ROW_CLASS]));
        }

        // --- Add the rows to the table        
        // -- A row to visually separate the rows for one subelement from rows for another. 
        let separatorCell = _newTableCell(2, "");
        let separatorRow = newClaimsFormInputRow([separatorCell], [SUB_ELEM_ROW_CLASS, THIS_SUB_ELEM_ROW_CLASS, "subelem-table-separator-row"]);
        subElementTable.appendChild(separatorRow);

        // Add the object constant display row
        subElementTable.appendChild(newSubElemObjConstRow);

        // After the the separator and object constant display rows, add the rows specific to this type of subelement
        for (let subElementSpecificRow of subElementSpecificRows) {
            subElementTable.appendChild(subElementSpecificRow);
        }

        // Update coverage indicator to reflect the new subelement data
        update_coverage_indicator_callback();
    });
}

// Distinct from newClaimsFormInputCell, since additional data is required to build input cells in subelement tables
function _newSubElemInputCell(colSpan, inputType, defaultInput, cellText, inputID, factTemplate, newSubElemObjConstInputID, update_coverage_indicator_callback) {
    let inputElem = _newInputElem(inputType, defaultInput, inputID);
    
    // Class for all subelement input cells, regardless of their specific table
    inputElem.classList.add("subelem-non-obj-const-input-field");
    
    // Set the data needed for filling the fact template, which likely requires knowing the object constant of the subelement
    inputElem.dataset.subElemObjConstInputID = newSubElemObjConstInputID;
    inputElem.dataset.factTemplate = factTemplate;

    inputElem.addEventListener("change", () => update_coverage_indicator_callback());

    let inputCell = _newTableCell(colSpan, cellText);
    inputCell.appendChild(inputElem);

    return inputCell;
}