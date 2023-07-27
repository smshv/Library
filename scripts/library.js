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

function toggleDisplay(toHiddenElement, toVisibleElement){
    toHiddenElement.style["visibility"] = "hidden";
    toVisibleElement.style["visibility"] = "visible";
}

document.querySelector("#add-button").
addEventListener("click", function(event) { toggleDisplay(event.currentTarget, 
    document.querySelector("#book-entry")) });

document.querySelector("#cancel-button").
addEventListener("click", toggleDisplay(document.querySelector("#book-entry"),
 document.querySelector("#add-button")));


addToLibrary(new Book("tom", "jerry", 0, false));
addToLibrary(new Book("tomtom", "jerryjerry", 10, true));

function displayLibrary(){
    library.forEach(bookObject=>{
        console.log(bookObject.info())
    });
}

displayLibrary();