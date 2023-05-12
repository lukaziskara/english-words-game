document.addEventListener("DOMContentLoaded", () => {
  //card options
  const game = async () => {
    let numbersAmount = 12;
    const randomNumbers = [];
    for (let i = 0; i < numbersAmount; i++) {
      randomNumbers.push(Math.floor(Math.random() * 500));
    }
    console.log("randomNumbers = " + randomNumbers);
    const wordsArrayAll = await fetch("500-english-words.json").then((resp) =>
      resp.json()
    );

    console.log(wordsArrayAll.length);
    // const wordsArrayB = []
    const wordsArray = [];

    for (let i = 0; i < numbersAmount; i++) {
      // wordsArrayB.push(wordsArrayAll[randomNumbers[i]]);
      wordsArray.push(wordsArrayAll[randomNumbers[i]]);
    }

    const wordsArrayLenght = wordsArray.length;
    for (let i = 0; i < wordsArrayLenght; i++) {
      const word = { backText: wordsArray[i].backText };
      wordsArray.push(word);
    }
    console.log(wordsArray);

    wordsArray.sort(() => 0.5 - Math.random()); //იმავე მასივში არსებული მონაცემები შემთხვევითად ირევა

    const shuffled = document.querySelector(".shuffled");
    const sorted = document.querySelector(".sorted");
    const pointsDisplay = document.querySelector("#points");
    let cardsChosen = []; //ინახება შერჩეული 2 ბარათი
    let cardsChosenId = []; //ინახება შერჩეული 2 ბარათის ID
    let cardsWon = []; //გამოცნობილი სიტყვები
    let iSorted = 0; //გამოცნობილი სიტყვების მთვლელი
    let attempt = 0; //მცდელობების რაოდენობა

    createBoard();

    //create your board
    function createBoard() {
      //მასივში არეული მონაცემებს იღებს, ქმნის ბარათებს და აწყობს ეკრანზე
      console.log(wordsArray);
      for (let i = 0; i < wordsArray.length; i++) {
        const cardOnBoard = document.createElement("card"); //ცვლადი თითოეული ახალი ბარათისთვის
        if (wordsArray[i].frontText) {
          //თუ მასივის წევრს ქართული მნიშვნელობა აქვს, ბარათს საწყის ტექსტს აწერს
          cardOnBoard.textContent = wordsArray[i].frontText;
          // console.log(cardOnBoard.textContent)
        } else {
          // console.log(wordsArray[i].backText, i)
        }
        cardOnBoard.setAttribute("data-id", i);
        cardOnBoard.classList.add("card");
        shuffled.appendChild(cardOnBoard);
        cardOnBoard.addEventListener("click", flipCard);
      }
      // const cards = document.getElementsByClassName('card')
      // console.log("cards - " + cards)
      // cards.addEventListener('click', flipCard)
    }

    //flip your card
    function flipCard() {
      let cardId = this.getAttribute("data-id");
      // console.log(cardId)

      cardsChosen.push(wordsArray[cardId]);
      cardsChosenId.push(cardId);

      this.textContent = wordsArray[cardId].backText;
      this.classList.add("clicked");
      // console.log(wordsArray[cardId].backText + " " + wordsArray[cardId].frontText + " flipcard")
      console.log(cardsChosen);
      console.log(cardsChosen.length);
      if (cardsChosen.length == 2) {
        // console.log(cardsChosen.backText)
        setTimeout(checkForMatch, 5);
      }
    }

    //check for matches
    function checkForMatch() {
      const cards = document.querySelectorAll("card");
      console.log(cards);
      const optionOneId = cardsChosenId[0];
      const optionTwoId = cardsChosenId[1];
      console.log("შემოწმებაზე", optionOneId, optionTwoId);
      if (optionOneId === optionTwoId) {
        alert("You have clicked the same image!");
        console.log("იგივე ბარათია");
        cards[optionOneId].textContent = wordsArray[cardsChosenId[0]].frontText;
        cards[optionTwoId].textContent = wordsArray[cardsChosenId[1]].frontText; //alert('Sorry, try again')
      } else if (cardsChosen[0].backText == cardsChosen[1].backText) {
        console.log("სიტყვები დაემთხვა", typeof cards, cards[optionOneId]);
        cards[optionTwoId].classList.remove("clicked");
        cards[optionOneId].classList.remove("clicked");
        cards[optionTwoId].classList.add("guessed");
        cards[optionOneId].classList.add("guessed");
        // cards[optionOneId].className = "wonWord"
        // cards[optionTwoId].className = "wonWord"

        // cards.slice(optionOneId,1)
        // cards.splice(optionTwoId,1)
        // delete cards[optionOneId]
        // delete cards[optionTwoId]

        const translated = document.createElement("translatedWord"); //ცვლადი თითოეული ახალი ბარათისთვის
        translated.textContent =
          wordsArray[optionTwoId].frontText +
          " - " +
          wordsArray[optionOneId].backText;
        translated.setAttribute("data-id", iSorted);
        translated.classList.add("translatedWord");
        sorted.appendChild(translated);
        cardsWon.push(cardsChosen);
        iSorted++;
      } else {
        cards[optionOneId].textContent = wordsArray[cardsChosenId[0]].frontText;
        cards[optionTwoId].textContent = wordsArray[cardsChosenId[1]].frontText; //alert('Sorry, try again')
        cards[optionTwoId].classList.remove("clicked");
        cards[optionOneId].classList.remove("clicked");
      }
      cardsChosen = [];
      cardsChosenId = [];
      console.log(cardsChosen, cardsChosenId);
      attempt++;
      pointsByPercent = `${Math.round((iSorted / attempt) * 100)}%`;
      reversePointsByPercent = `${Math.round(
        100 - (iSorted / attempt) * 100
      )}%`;
      console.log(pointsByPercent);
      pointsDisplay.textContent = `${iSorted}/${attempt} = ${Math.round(
        (iSorted / attempt) * 100
      )}%`;
      document.getElementById("dict-score").style.backgroundColor =
        "hsl(120,0%," + pointsByPercent + ")";
      document.getElementById("dict-score").style.color =
        "hsl(120," +
        reversePointsByPercent +
        "," +
        reversePointsByPercent +
        ")";
      console.log(cardsWon.length);
      console.log(wordsArray.length);
      // console.log(wordsArray);

      if (cardsWon.length == wordsArray.length / 2) {
        shuffled.textContent = "YOU WON";
        document.getElementById("gameBoard").style.height = "100px";
      }
    }
  };
  game();
});
