function getData(file, elementId, sectionId) {
    fetch(file)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.text();
        })
        .then(data => {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = data;
            const content = tempDiv.querySelector(`#${sectionId}`);
            if (content) {
                document.getElementById(elementId).innerHTML = content.innerHTML;
            }
        })
        .catch(error => console.error('Error fetching data:', error));
}

document.addEventListener("DOMContentLoaded", function () {
    getData("header-footer.html", "header-platzhalter", "header-content");
    getData("header-footer.html", "footer-platzhalter", "footer-content");
});
