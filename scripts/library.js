let library = [];
const READ_STATUS_TEXT = ["Not read yet", "Read"];
const READ_STATUS_COLOR = ["#38bdf8", "#db2777"];
const bookListTable = document.querySelector("#book-lists");


function Book(title, author, pages, read){
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;

    this.info = function (){
        return `${this.title} by ${this.author}, ${this.pages} pages, ${this.read? "read" : "not read yet"}`;
    }
}

function addToLibrary(bookObject){
    library.push(bookObject);
}

function addElement(parrentElem, elementName, textContent, classLabel = null){
    const elem = document.createElement(elementName);
    elem.textContent = textContent;
    if (classLabel != null){
        elem.setAttribute("class", classLabel);
    }
    parrentElem.appendChild(elem);
    return elem;
}

function displayBook(bookObject, bookIndex){
    const tableRow = bookListTable.insertRow(bookIndex+1);
    tableRow.setAttribute("data", bookIndex.toString())
    const values = Object.values(bookObject);
    for (let i=0; i<3; i++){
        tableRow.insertCell(i).textContent = values[i] ;
    }
    const readCell = tableRow.insertCell(3);
    addElement(readCell, "span", READ_STATUS_TEXT[bookObject.read]);
    const elem = addElement(readCell, "button", "Change status", "read-button");
    elem.style["background-color"] = READ_STATUS_COLOR[bookObject.read];
    elem.addEventListener("click", changeReadStatus);
    addElement(tableRow.insertCell(4), "button", "Delete", "delete-button").addEventListener(
        "click", deleteBook
    );
}

function displayLibrary(){
    for ( let i = 0; i < library.length; i++){
        displayBook(library[i], i);
    }
}

function changeReadStatus(e){
    const bookIndex = Number(e.currentTarget.parentElement.parentElement.getAttribute("data"));
    library[bookIndex].read = (1 - library[bookIndex].read);
    e.currentTarget.previousSibling.textContent = READ_STATUS_TEXT[library[bookIndex].read];
    e.currentTarget.style["background-color"] = READ_STATUS_COLOR[library[bookIndex].read];
}

function deleteBook(e){
    let tableRow = e.currentTarget.parentElement.parentElement;
    let bookIndex = Number(tableRow.getAttribute("data"));
    library.splice(bookIndex, 1);
    let siblingRow = tableRow.nextElementSibling;
    while (siblingRow != null ){
        tableRow.nextElementSibling.setAttribute("data", (bookIndex).toString());
        bookIndex += 1;
        siblingRow = siblingRow.nextElementSibling;
    }
    tableRow.querySelector("td:nth-child(4)").removeEventListener("click", changeReadStatus);
    tableRow.querySelector("td:nth-child(5)").removeEventListener("click", deleteBook);
    bookListTable.deleteRow(bookIndex+1);
}
function toggleDisplay(toHiddenElement, toVisibleElement){
    toHiddenElement.style["visibility"] = "hidden";
    toVisibleElement.style["visibility"] = "visible";
}

document.querySelector("#add-button").
addEventListener("click", function(event) { toggleDisplay(event.currentTarget, 
    document.querySelector("#book-entry")) });

document.querySelector("#cancel-button").
addEventListener("click", ()=>{ 
    const form = document.querySelector("#book-entry");
    form.reset();
    toggleDisplay(form, document.querySelector("#add-button"))} );

document.querySelector("#book-entry").addEventListener(
    "submit", function (event) {
        event.preventDefault();
        const data = new FormData(this);
        const bookIndex = library.length;
        addToLibrary(new Book(data.get("title"), data.get("author"), data.get("pages"), data.has("read") ? 0:1 ));
        displayBook(library[bookIndex], bookIndex);
        this.reset();
        toggleDisplay(this, document.querySelector("#add-button"));
    }
);
    