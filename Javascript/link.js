let cardContainer = document.getElementById("cardContainer")

function createCard(data) {
    const card = document.createElement("div")
    const imageContainer = document.createElement("div")
    const infoContainer = document.createElement("div")
    const cardInfo = document.createElement("div")
    const buttonContainer = document.createElement("div")

    card.classList.add("card")
    imageContainer.classList.add("imageContainer")
    infoContainer.classList.add("infoContainer")
    cardInfo.classList.add("cardInfo")
    buttonContainer.classList.add("buttonContainer")

    const image = document.createElement("img")
    image.src = "../assets/" + data.web_image
    image.alt = data.web_name
    imageContainer.appendChild(image)

    const title = document.createElement("h5")
    title.textContent = data.web_name

    const description = document.createElement("p")
    description.textContent = data.web_description
    
    const linkButton = document.createElement("a")
    linkButton.classList.add("btn")
    linkButton.textContent = "Go"
    linkButton.target = "_blank"
    linkButton.href = "https://" + data.web_url_link

    imageContainer.appendChild(image)
    cardInfo.appendChild(title)
    cardInfo.appendChild(description)
    buttonContainer.appendChild(linkButton)
    infoContainer.appendChild(cardInfo)
    infoContainer.appendChild(buttonContainer)

    card.appendChild(imageContainer)
    card.appendChild(infoContainer)
    return card
}

async function FetchData(url){
    try {
        const response = await fetch(url)
		let responses = await response.json()
		if(response.ok) return responses.data

        throw new Error(responses.message)
    } catch(e) {
        alert(e)
        return null
    }
}

function addCards(data){
    cardContainer.innerHTML = ""
    data.forEach(item => {
        const card = createCard(item)
        cardContainer.appendChild(card)
    })
}

// Initial Index
var index = -1

async function showCard(){
    let category = document.getElementById("category").value
    if(category == index) return

    index = category
    let url = `http://localhost:8080/links`

    if(category != 0) {
        url = `http://localhost:8080/links?category=${category}`
    }

    const data = await FetchData(url)
    if (data == null) return
    addCards(data)
}

showCard()