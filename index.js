const $ = x => document.querySelector(x);
const pdf = pdfjsLib;
const pdfPages = $(".pdf-pages");
const fileInput = $("#mypdf");
const autoScrollBtn = $('.auto-scroll');
let file = '';
let docContent = [];
let autoScroll = false;
let activePage = 0;

async function getContent(source) {
    const doc = await pdfjsLib.getDocument(source).promise;
    handlePages(doc.numPages);
    for(var i = 1; i <= doc.numPages; i++){
        const page = await doc.getPage(i);
        docContent.push(await page.getTextContent());
    }
}

async function getItems(page) {
    const content = docContent[page - 1];
    $(".txt").value = '';
    const items = content.items.map((item) => {
        $(".txt").value += item.str;
    });
    return items;
}

function handlePages(pages) {
    for (let i = 1; i <= pages; i++) {
        const div = document.createElement('div');
        div.classList.add('page-number');
        div.setAttribute('data-number', i);
        div.onclick = x => {
            if (activePage != i) {
                getItems(i);
                document.querySelectorAll('.page-number').forEach(e => {
                    e.classList.remove('active-page');
                });
                div.classList.add('active-page');
                activePage = i;
            }
        }
        div.innerText = i;
        pdfPages.append(div);
    }
}

fileInput.onchange= (e) => {
    file = window.URL.createObjectURL(fileInput.files[0]);
    getContent(file);
}

function openVoiceConfig() {
    $(".voice-config").style.width = "100%";
    $(".voice-config").style.padding = "30px";
  }

function closeVoiceConfig() {
    $(".voice-config").style.width = "0%";
    $(".voice-config").style.padding = "0";
  }

autoScrollBtn.onmouseover = x => {
    x.target.innerText = 'autoscroll keyboard_double_arrow_down'
}

autoScrollBtn.onmouseout = x => {
    x.target.innerText = 'keyboard_double_arrow_down'
}

autoScrollBtn.onclick = x => {
    autoScrollBtn.classList.toggle('autoScrollOn');
    autoScroll = !autoScroll;
}