let library = [];
let IS_LIB_EMPTY = true;
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

function addElement(parrentElem, elementName, textContent, classLabel){
    const elem = document.createElement(elementName);
    elem.textContent = textContent;
    elem.setAttribute("class", classLabel);
    parrentElem.appendChild(elem);
    return elem;
}

function displayBook(bookObject, bookIndex){
    const tableRow = bookListTable.insertRow(bookIndex+1);
    const values = Object.values(bookObject);
    for (let i=0; i<3; i++){
        tableRow.insertCell(i).textContent = values[i] ;
    }
    const readCell = tableRow.insertCell(3);
    let text = "Not read yet";
    let readBttnClr = "#10b981";
    if ( values[3] ){
        text = "Read" ;
        readBttnClr = "#db2777";
    }
    readCell.textContent = text;
    const elem = addElement(readCell, "button", "Change status", "read-button");
    elem.style["background-color"] = readBttnClr;
    elem.setAttribute("data", bookIndex.toString());
    addElement(tableRow.insertCell(4), "button", "Delete", "delete-button").setAttribute("data", bookIndex.toString())
}

function displayLibrary(bookListTable){
    console.log(bookListTable);
    for ( let i = 0; i < library.length; i++){
        displayBook(library[i], i);
    }
}

function changeReadStatus(e){
    const bookIndex = Number(e.currentTarget.getAttribute("data"));
    library[bookIndex].read = (!library[bookIndex].read);
    bookListTable.deleteRow(bookIndex+1);
    displayBook(library[bookIndex], bookIndex);
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
        addToLibrary(new Book(data.get("title"), data.get("author"), data.get("pages"), data.has("read")));
        displayBook(library[bookIndex], bookIndex);
        this.reset();
        toggleDisplay(this, document.querySelector("#add-button"));

        if ( IS_LIB_EMPTY ){
            document.querySelectorAll(".read-button").forEach(elem=>{
                elem.addEventListener("click", changeReadStatus);
            });
            IS_LIB_EMPTY = false;
        }

    }
);
