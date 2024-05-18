//load the navbar html into the class
$(".nav-placeholder").load("./commonHTML/navbar.html", () => {

})

//load the footer html into the class
$(".footer-placeholder").load("./commonHTML/footer.html")

//returns a string with title-casing
function title(str) {
    return str.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }