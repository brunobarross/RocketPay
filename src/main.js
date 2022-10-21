import "./css/index.css"
import IMask from "imask"

const securityCode = document.querySelector("#security-code")
const expirationDate = document.querySelector("#expiration-date")
const cardNumber = document.querySelector("#card-number")
const form = document.querySelector("form")
const addButton = document.querySelector("#add-card")
const cardHolder = document.querySelector("#card-holder")

/* váriaveis de cores do svg e logo do cartão */
const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const cclogo = document.querySelector(".cc-logo span:nth-child(2) img")

function setCardType(type) {
  const colors = {
    visa: ["#436d99", "#2d57f2"],
    mastercard: ["#DF6F29", "#C69347"],
    default: ["black", "grey"],
  }

  ccBgColor01.setAttribute("fill", colors[type][0])
  ccBgColor02.setAttribute("fill", colors[type][1])
  //é a mesma coisa que colors.visa[posicao];
  cclogo.setAttribute("src", `cc-${type}.svg`)
}

setCardType("default") // inserir a função no escopo global (window)
globalThis.setCardType = setCardType

/* options do iMask */

const securityCodePattern = {
  mask: "0000",
}

const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    YY: {
      mask: IMask.MaskedRange,
      //Só aceita o ano atual até 10 anos depois
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
  },
}

const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      //inicia com 4 e recebe de 0 a 15 digitos
      regex: /^4\d{0,15}/,
      cardType: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^(5[1-5]\d{0,2}|22[2-9]\d{0,1}|2[3-7]\d{0,2})\d{0,12}/,
      cardType: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      cardType: "default",
    },
  ],
  //dispatch (appended) toda vez que clicar numa tecla vai executar a função
  //dynamic masked = mascara dinamica criada
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")
    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      // o item é o objeto dentro do array mask
      //pego apenas o regex dentro do item por desestruturação
      // se passar em todos os itens e o boleano for falso, não vai fazer nada, se verdadeiro retorna true, e vai retornar o array
      return number.match(item.regex)
    })

    return foundMask
  },
}

/* variáveis de inicialização do iMask */
const securityCodeMasked = IMask(securityCode, securityCodePattern)
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)
const cardNumberMasked = IMask(cardNumber, cardNumberPattern)
//regra de encontro cartões

//visa:

//mastercard:

/* Funções de atualização do conteudo HTML */

function updateSecurityCode(code) {
  const ccSecurity = document.querySelector(".cc-security .value")
  ccSecurity.innerText = code.length === 0 ? "123" : code
}

function updateCardNumber(number) {
  const cardType = cardNumberMasked.masked.currentMask.cardType
  const ccNumber = document.querySelector(".cc-number")
  setCardType(cardType)
  ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number
}

function updateExpirationNumber(date) {
  const ccExpiration = document.querySelector(".cc-expiration .value")
  ccExpiration.innerText = date.length === 0 ? "02/32" : date
}

/* Fim Funções de atualização do conteudo HTML~*/

/* eventos*/
securityCodeMasked.on("accept", (e) => {
  updateSecurityCode(e.target.value)
})

cardNumberMasked.on("accept", (e) => {
  updateCardNumber(e.target.value)
})

expirationDateMasked.on("accept", (e) => {
  updateExpirationNumber(e.target.value)
})

cardHolder.addEventListener("input", (e) => {
  const ccHolder = document.querySelector(".cc-holder .value")
  ccHolder.innerText =
    e.target.value.length === 0 ? "FULANO DA SILVA" : e.target.value
})
form.addEventListener("submit", (e) => e.preventDefault())

addButton.addEventListener("click", (e) => {
  alert("Cartão adicionado!")
})

/* fim dos eventos */
