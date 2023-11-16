const READ_STATUS_TEXT = ["Not read yet", "Read"];
const READ_STATUS_COLOR = ["#38bdf8", "#db2777"];
const bookListTable = document.querySelector("#book-lists");

class Book{
    constructor(title, author, pages, read){
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;    
    }
    toggleReadStatus(){
        this.read = 1 - this.read;
    }
}
class Library{
    #booklist;
    constructor(){
        this.#booklist = [];
        this.numBooks = 0;
    }
    addBook(title, author, pages, read){
        this.#booklist.push(new Book(title, author, pages, read));
        this.numBooks += 1;
    }
    deleteBook(bookIndex){
        this.#booklist.splice(bookIndex, 1);
        this.numBooks -= 1;
    }
    getBook(bookIndex){
        return this.#booklist[bookIndex];
    }
}

const library = new Library();

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
    for ( let i = 0; i < library.numBooks; i++){
        displayBook(library.getBook(i), i);
    }
}

function changeReadStatus(e){
    const bookIndex = Number(e.currentTarget.parentElement.parentElement.getAttribute("data"));
    library.getBook(bookIndex).toggleReadStatus();
    e.currentTarget.previousSibling.textContent = READ_STATUS_TEXT[library.getBook(bookIndex).read];
    e.currentTarget.style["background-color"] = READ_STATUS_COLOR[library.getBook(bookIndex).read];
}

function deleteBook(e){
    let tableRow = e.currentTarget.parentElement.parentElement;
    let bookIndex = Number(tableRow.getAttribute("data"));
    library.deleteBook(bookIndex);
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
    hideError();
    toggleDisplay(form, document.querySelector("#add-button"))} );

document.querySelector("#book-entry").addEventListener(
    "submit", function (event) {
        event.preventDefault();
        if ( !event.currentTarget.checkValidity() ){
            event.currentTarget.reportValidity();
        }else{
            hideError();
            const data = new FormData(this);
            const bookIndex = library.numBooks;
            library.addBook(data.get("title"), data.get("author"), data.get("pages"), data.has("read") ? 0:1);
            displayBook(library.getBook(bookIndex), bookIndex);
            this.reset();
            toggleDisplay(this, document.querySelector("#add-button"));
        }
    }
);

function firstCharCapitalize(input){
    return `${input.charAt(0).toUpperCase()}${input.slice(1)}`;
}

document.querySelectorAll('input').forEach(formInput=>{
    formInput.addEventListener('input', (event)=>{
        if ( formInput.validity.typeMismatch ){
            const inputName = firstCharCapitalize(formInput.getAttribute('id'));
            const inputType = firstCharCapitalize(formInput.getAttribute('type'));
            showError(`Incorrect entry type provided. ${inputName} requires ${inputType} entry.`, formInput.nextElementSibling);
        }else{
            formInput.nextElementSibling.textContent = "";
            formInput.nextElementSibling.classList.remove('invalid');
        }
    });

    formInput.addEventListener('invalid', (event)=>{
        event.preventDefault();
        if ( formInput.validity.valueMissing ){
            const inputName = firstCharCapitalize(formInput.getAttribute('id'));
            showError(`${inputName} cannot be empty.`, formInput.nextElementSibling);
        }
    });
});

function showError(msg, msgBox){
    msgBox.textContent = msg;
    msgBox.classList.add('invalid');
}

function hideError(msgBox = null){
    if (msgBox){
        msgBox.textContent = "";
        msgBox.classList.remove('invalid');
    }else{
        document.querySelectorAll('.error-msg').forEach(p=>{
            hideError(p);
        });   
    }
}
