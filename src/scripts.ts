import { Flashcard } from "./algorithm/flashcards.js";

const flashcards: Array<Flashcard> = [new Flashcard("front", "back")];

function loadFlashCards(): void {
    const container: Element | null = document.querySelector(".flashcard-container");

    if (container) {
        flashcards.forEach((card: Flashcard) => {
            const flashcard = document.createElement("div");
            flashcard.classList.add("flashcard");
            
            flashcard.innerHTML = `
                <div class="flashcard-inner">
                    <div class="flashcard-front">
                        <p>${card.front}</p>
                    </div>
                    <div class="flashcard-back">
                        <p>${card.back}</p>
                    </div>
                </div>
            `;
            container.appendChild(flashcard);
        });

        document.querySelectorAll(".flashcard").forEach(card => {
            card.addEventListener('click', function (this: HTMLElement) {
                this.classList.toggle('flipped');
            });
        });
    }
    else {
        console.error("Flashcard not found");
    }
}

const form = document.getElementById("new-flashcard-form") as HTMLFormElement;
form.addEventListener("submit", async (event) =>{
    event.preventDefault();

    const front = (document.getElementById("flashcard-front") as HTMLInputElement).value;
    const back = (document.getElementById("flashcard-back") as HTMLInputElement).value;

    const newCard = { front, back };

    const response = await fetch("/add_flashcard", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newCard),
    });

    if(response.ok) {
        flashcards.push(new Flashcard (front, back));
        loadFlashCards();
    } else {
        console.error("Failed to add flashcard");
    }
});

loadFlashCards();