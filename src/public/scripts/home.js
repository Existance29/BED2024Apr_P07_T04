//get the width of heading and set heading-desc to the same width
var headingPX = $("#heading").width()
var headingVW = (100 * headingPX) / window.innerWidth //convert px to vw
$("#heading-desc").css("max-width", headingVW+"vw");

