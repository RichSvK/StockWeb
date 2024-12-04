document.getElementById('navbar-container').innerHTML = `
    <div class="container-fluid px-2">
        <a href="/" class="navbar-brand">StockWeb</a>
        
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#main-nav" aria-controls="main-nav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse justify-content-sm-end" id="main-nav">
            <ul class="navbar-nav text-center">
                <li class="nav-item">
                    <a class="nav-link" href="/">Home</a>
                </li>

                <li class="nav-item">
                    <a href="/HTML/link.html" class="nav-link">Link</a>
                </li>

                <li class="nav-item">
                    <a href="/HTML/ipo.html" class="nav-link">IPO</a>
                </li>

                <li class="nav-item">
                    <a href="/HTML/balance.html" class="nav-link">Balance</a>
                </li>
            </ul>
        </div>
    </div>
`;