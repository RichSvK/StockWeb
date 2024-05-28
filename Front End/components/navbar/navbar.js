document.getElementById('navbar-container').innerHTML = `
    <div id="name-website">StockWeb</div>
    <a class="burger-menu">
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
    </a>
    <div class="navbar-link">
        <ul>
            <li><a href="${root}/index.html">Home</a></li>
            <li><a href="${root}/HTML/link.html">Link</a></li>
            <li><a href="${root}/HTML/ipo.html">IPO</a></li>
            <li><a href="${root}/HTML/balance.html">Balance</a></li>
        </ul>            
    </div>`

const burgerMenu = document.getElementsByClassName("burger-menu")[0]
const navbarLink = document.getElementsByClassName("navbar-link")[0]
burgerMenu.addEventListener("click", () => {
    navbarLink.classList.toggle("active")
})