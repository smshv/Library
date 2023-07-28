let library = [];

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

function displayBook(bookObject, bookIndex, bookListTable){
    const tableRow = document.createElement("tr");
    tableRow.setAttribute("id", bookIndex.toString());
    const td1 = document.createElement("td");
    td1.textContent = bookObject.title;
    tableRow.appendChild(td1);
    const td2 = document.createElement("td");
    td2.textContent = bookObject.author;
    tableRow.appendChild(td2);
    const td3 = document.createElement("td");
    td3.textContent = bookObject.pages;
    tableRow.appendChild(td3);
    const td4 = document.createElement("td");
    if (bookObject.read){
        td4.textContent = "Read";
    }else{
        td4.textContent = "Not read yet";
    }
    tableRow.appendChild(td4);
    bookListTable.appendChild(tableRow);
}

function displayLibrary(bookListTable){
    console.log(bookListTable);
    for ( let i = 0; i < library.length; i++){
        displayBook(library[i], i, bookListTable);
    }
}

function toggleDisplay(toHiddenElement, toVisibleElement){
    toHiddenElement.style["visibility"] = "hidden";
    toVisibleElement.style["visibility"] = "visible";
}
const bookListTable = document.querySelector("#book-lists");

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
        displayBook(library[bookIndex], bookIndex, bookListTable);
        this.reset();
        toggleDisplay(this, document.querySelector("#add-button"));
    }
);
