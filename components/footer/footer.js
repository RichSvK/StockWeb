let root = window.location.origin

document.getElementById('footer-container').innerHTML = `
    <div id="footers">
    <div class="footer-part" class="company-link">
        <div class="footer-part-title">
            Info
        </div>
        <div class="footer-link">
            <ul>
                <li><a href="${root}/index.html">About Me</a></li>
                <li><a href="${root}/index.html#webService">Service</a></li>
            </ul>
        </div>
    </div>

    <div class="footer-part" class="company-link">
        <div class="footer-part-title">
            Help
        </div>
        <div class="footer-link">
            <ul>
                <li><a href="${root}/HTML/link.html">Study</a></li>
                <li><a href="${root}/HTML/ipo.html">IPO Info</a></li>
                <li><a href="${root}/HTML/balance.html">Balance Position</a></li>
            </ul>
        </div>
    </div>

    <div class="footer-part">
        <div class="footer-part-title">
            Social Media
        </div>
        <div id="container-icon">
            <a href="https://www.instagram.com/rich_svk/" target="blank"> <img src="${root}/assets/instagram.png" alt="instagram"> </a>
            <a href="https://github.com/RichSvK" target="blank"> <img src="${root}/assets/github.png" alt="Github"> </a>
            <a href="https://www.linkedin.com/in/richard-sugiharto" target="blank"> <img src="${root}/assets/linkedin.png" alt="LinkedIn"> </a>
        </div>
    </div>
    </div>
    <div id="copyright">&copy 2024 Stock</div>`