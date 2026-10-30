
console.log("Welcome to Radzi Welding!");

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", function() {
    console.log("Navigating to " + this.getAttribute("href"));
  });
});
