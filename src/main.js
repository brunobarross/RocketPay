import "./css/index.css"
import IMask from "imask"

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

setCardType("mastercard")

// inserir a função no escopo global (window)
globalThis.setCardType = setCardType

const securityCode = document.querySelector("#security-code")
const expirationDate = document.querySelector("#expiration-date")
const cardNumber = document.querySelector("#card-number")
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
    console.log(foundMask)
    return foundMask
  },
}

const securityCodeMasked = IMask(securityCode, securityCodePattern)
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)
const cardNumberMasked = IMask(cardNumber, cardNumberPattern)
//regra de encontro cartões

//visa:

//mastercard:
