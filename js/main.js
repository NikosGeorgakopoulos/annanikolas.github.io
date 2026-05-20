const form = document.getElementById("rsvpForm");
const message = document.getElementById("formMessage");

const attendance = document.getElementById("attendance");
const attendingFields = document.getElementById("attendingFields");

const plusOne = document.getElementById("plusOne");
const plusOneNameGroup = document.getElementById("plusOneNameGroup");

const kids = document.getElementById("kids");
const kidsNumberGroup = document.getElementById("kidsNumberGroup");

const plusOneName = document.getElementById("plusOneName");
const kidsNumber = document.getElementById("kidsNumber");

attendance.addEventListener("change", () => {
    if (attendance.value === "yes") {
        attendingFields.style.display = "block";
    } else {
        attendingFields.style.display = "none";
        plusOneNameGroup.style.display = "none";
        kidsNumberGroup.style.display = "none";
    }
});

plusOne.addEventListener("change", () => {
    if (plusOne.value === "yes") {
        plusOneNameGroup.style.display = "block";
    } else {
        plusOneNameGroup.style.display = "none";
    }
});

kids.addEventListener("change", () => {
    if (kids.value === "yes") {
        kidsNumberGroup.style.display = "block";
    } else {
        kidsNumberGroup.style.display = "none";
    }
});

const scriptURL = "https://script.google.com/macros/s/AKfycbwghWy6ebh6z8ZRHWrSsA60j9_mRtS3abshklyjuZek7WXVi_znr5Ng1HOcHzAU21wb/exec";

function validateForm() {
    // Reset message
    message.textContent = "";
    message.classList.remove("show");

    // Name always required
    if (!form.name.value.trim()) {
        return "Παρακαλουμε εισαγάγετε το όνομά σας."; 
    }

    if (!attendance.value) {
        return "Παρακαλουμε επιλέξτε αν θα παραστείτε.";
    }

    if (attendance.value === "yes") {
        // Plus One validation
        if (!plusOne.value) {
            return "Παρακαλουμε επιλέξτε αν θα φέρετε plus one.";
        }

        if (plusOne.value === "yes" && !plusOneName.value.trim()) {
            return "Παρακαλουμε εισαγετε το ονομα του plus one σας.";
        }

        // Kids validation
        if (!kids.value) {
            return "Παρακαλουμε επιλέξτε αν θα φέρετε παιδιά.";
        }

        if (kids.value === "yes") {
            const numKids = parseInt(kidsNumber.value, 10);

            if (!kidsNumber.value || isNaN(numKids) || numKids <= 0) {
                return "Παρακαλουμε εισαγάγετε τον αριθμό παιδιών.";
            }
        }
    }

    return null; // valid
}

form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const error = validateForm();

    if (error) {
        message.textContent = error;
        message.style.color = "red";
        message.classList.add("show");
        return;
    }

    const data = {
        name: form.name.value,
        attendance: attendance.value,
        plusOne: plusOne.value,
        plusOneName: plusOneName?.value || "",
        kids: kids.value,
        kidsNumber: kidsNumber?.value || ""
    };

    // Disable button and show loading
    const submitButton = form.querySelector(".rsvp-button");
    submitButton.disabled = true;
    submitButton.textContent = "Αποστολή...";

    try {
        await fetch(scriptURL, {
            method: "POST",
            body: JSON.stringify(data)
        });

        message.textContent = "Ευχαριστουμε η απαντηση σας εχει σταλει! 💍";
        message.style.color = "green";

        form.reset();
        attendingFields.style.display = "none";
    } catch (error) {
        message.textContent = "Κάτι πήγε στραβά. Παρακαλούμε προσπαθήστε ξανά.";
        message.style.color = "red";
        console.error(error);
    } finally {
        // Re-enable button
        submitButton.disabled = false;
        submitButton.textContent = "Αποστολή RSVP";
    }
    message.classList.add("show");
    setTimeout(() => message.classList.remove("show"), 5000); // hides after 5 sec
});


const rsvpBtn = document.getElementById("rsvpBtn");

rsvpBtn.addEventListener("click", () => {
    document.getElementById("rsvp").scrollIntoView({
        behavior: "smooth"
    });
});


// Target the countdown element
const countdownEl = document.getElementById("countdown");

// Set the target date
const weddingDate = new Date("2026-09-26T00:00:00"); // 26th Sep 2026

function updateCountdown() {
    const now = new Date();
    const diffTime = weddingDate - now; // milliseconds remaining
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // convert to days

    if (diffDays >= 0) {
        countdownEl.textContent = `${diffDays} DAYS TO GO`;
    } else {
        countdownEl.textContent = "The Wedding Day is here! 💍";
    }
}

// Update immediately
updateCountdown();

const collageFiles = Array.isArray(window.COLLAGE_FILES) ? window.COLLAGE_FILES : [];

const collageStack = document.getElementById("collageStack");
const collageScrollArea = document.getElementById("collageScrollArea");

if (collageStack && collageScrollArea && collageFiles.length > 0) {
    const rotationPattern = [-8, 6, -5, 7, -4, 5, -7, 4, -6, 8, -3, 3];
    const collageCards = collageFiles.map((fileName, index) => {
        const card = document.createElement("div");
        const image = document.createElement("img");

        card.className = "collage-card";
        card.style.zIndex = String(index + 1);
        card.dataset.rotation = String(rotationPattern[index % rotationPattern.length]);

        image.src = `assets/images/photo collage/${fileName}`;
        image.alt = "Photo collage memory";
        image.loading = "lazy";

        card.appendChild(image);
        collageStack.appendChild(card);

        return card;
    });

    const perCardScrollVh = 34;
    collageScrollArea.style.height = `${Math.max(100, collageCards.length * perCardScrollVh + 120)}vh`;

    function updateCollageStack() {
        const totalScrollable = Math.max(1, collageScrollArea.offsetHeight - window.innerHeight);
        const passed = Math.min(Math.max(-collageScrollArea.getBoundingClientRect().top, 0), totalScrollable);
        const progress = passed / totalScrollable;
        const step = progress * (collageCards.length + 0.8);

        collageCards.forEach((card, index) => {
            const rotation = Number(card.dataset.rotation || "0");
            const localProgress = step - index;

            if (localProgress <= 0) {
                card.style.opacity = "0";
                card.style.transform = `translateY(-130px) scale(0.92) rotate(${rotation * 0.2}deg)`;
                return;
            }

            if (localProgress < 1) {
                const drop = 1 - localProgress;
                const y = drop * 130 + index * 1.6;
                const scale = 0.92 + localProgress * 0.08;
                const currentRotation = rotation * (0.35 + drop * 0.65);

                card.style.opacity = String(Math.min(1, localProgress * 1.4));
                card.style.transform = `translateY(${y}px) scale(${scale}) rotate(${currentRotation}deg)`;
                return;
            }

            card.style.opacity = "1";
            card.style.transform = `translateY(${index * 1.6}px) scale(1) rotate(${rotation}deg)`;
        });
    }

    window.addEventListener("scroll", updateCollageStack, { passive: true });
    window.addEventListener("resize", updateCollageStack);
    updateCollageStack();
}
