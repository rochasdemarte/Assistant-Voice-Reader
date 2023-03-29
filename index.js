const $ = x => document.querySelector(x);
const pdf = pdfjsLib;
const fileInput = $("#mypdf");
let file = '';
let pageNumber = 1;

async function getContent(source) {
    const doc = await pdfjsLib.getDocument(source).promise;
    console.log(doc.numPages);
    const page = await doc.getPage(pageNumber);
    return await page.getTextContent();
}

async function getItems(source) {
    const content = await getContent(source);
    const items = content.items.map((item) => {
        document.querySelector(".txt").value += item.str;
    });
    return items;
}

fileInput.onchange= (e) => {
    file = window.URL.createObjectURL(fileInput.files[0]);
    getItems(file);
}