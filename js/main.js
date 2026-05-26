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


        image.alt = "Photo collage memory";
        image.loading = "lazy";

        // Detect image orientation when it loads and mark the card.
        // Attach listeners before setting `src` so cached images don't miss the event.
        const applyOrientation = () => {
            try {
                if (image.naturalWidth && image.naturalHeight) {
                    const isPortrait = image.naturalHeight > image.naturalWidth;
                    card.classList.add(isPortrait ? 'portrait' : 'landscape');
                    image.classList.add(isPortrait ? 'portrait-img' : 'landscape-img');
                    // Fit card to the image aspect ratio so photos keep their resolution
                    // and we only show a small white border around them.
                    try {
                        const stackRect = collageStack.getBoundingClientRect();
                        const maxW = stackRect.width - 12; // allow for border
                        const maxH = stackRect.height - 12;
                        const imgW = image.naturalWidth;
                        const imgH = image.naturalHeight;
                        const imgRatio = imgW / imgH;

                        let targetW = maxW;
                        let targetH = Math.round(targetW / imgRatio);
                        if (targetH > maxH) {
                            targetH = maxH;
                            targetW = Math.round(targetH * imgRatio);
                        }

                        // center the card inside the stack
                        const left = Math.round((stackRect.width - targetW) / 2);
                        const top = Math.round((stackRect.height - targetH) / 2);

                        card.style.width = `${targetW}px`;
                        card.style.height = `${targetH}px`;
                        card.style.left = `${left}px`;
                        card.style.top = `${top}px`;
                    } catch (err) {
                        // if something fails, ignore sizing and leave card full-size
                        console.warn('collage sizing failed', err);
                    }
                }
            } catch (err) {
                console.warn('Collage image orientation detect failed', err);
            }
        };

        image.addEventListener('load', applyOrientation);
        image.addEventListener('error', () => {
            // if image fails, mark as landscape to avoid weird sizing
            card.classList.add('landscape');
        });

        // Now set the source (after listeners are attached)
        image.src = `assets/images/photo collage/${fileName}`;

        // If image is already cached and complete, run orientation immediately
        if (image.complete) applyOrientation();

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
            // Hide completely above — not visible yet
            card.style.visibility = "hidden";
            card.style.transform = `translateY(-220px) scale(0.9) rotate(${rotation * 0.4}deg) translateZ(0)`;
            return;
        }

        if (localProgress < 1) {
            // Card is falling
            // Ease-out with a small bounce past 0 then back
            card.style.visibility = "visible";
            const t = localProgress;
            const bounce = t < 0.75
                ? 1 - Math.pow(1 - t / 0.75, 3)          // ease-out cubic drop
                : 1 + Math.sin((t - 0.75) / 0.25 * Math.PI) * 0.06; // tiny overshoot

            const y = (1 - bounce) * 220 + index * 1.6;
            const scale = 0.9 + bounce * 0.1;
            const currentRotation = rotation * (0.4 + (1 - bounce) * 0.6);

            card.style.visibility = "visible";
            card.style.transform = `translateY(${index * 1.6}px) scale(1) rotate(${rotation}deg) translateZ(0)`;
            return;
        }

        // Card has landed
        card.style.opacity = "1";
        card.style.transform = `translateY(${index * 1.6}px) scale(1) rotate(${rotation}deg) translateZ(0)`;
    });
}
    // With this:
    let collageRafPending = false;
    window.addEventListener("scroll", () => {
        if (!collageRafPending) {
            collageRafPending = true;
            requestAnimationFrame(() => {
                updateCollageStack();
                collageRafPending = false;
            });
        }
    }, { passive: true });
    window.addEventListener("resize", updateCollageStack);
    updateCollageStack();
}
