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
    const collageSticky   = collageScrollArea.querySelector(".collage-sticky");
    const rotationPattern = [-8, 6, -5, 7, -4, 5, -7, 4, -6, 8, -3, 3];

    // ── Helper: fit a card to its image's aspect ratio inside the stack ──────
    function sizeCard(card, img) {
        if (!img.naturalWidth || !img.naturalHeight) return;
        try {
            const rect = collageStack.getBoundingClientRect();
            if (!rect.width || !rect.height) return;
            const ratio = img.naturalWidth / img.naturalHeight;
            const maxW  = rect.width  - 12;
            const maxH  = rect.height - 12;
            let w = maxW;
            let h = Math.round(w / ratio);
            if (h > maxH) { h = maxH; w = Math.round(h * ratio); }
            card.style.width  = `${w}px`;
            card.style.height = `${h}px`;
            card.style.left   = `${Math.round((rect.width  - w) / 2)}px`;
            card.style.top    = `${Math.round((rect.height - h) / 2)}px`;
        } catch (e) { console.warn("collage sizing failed", e); }
    }

    // ── Build card elements ──────────────────────────────────────────────────
    const collageCards = collageFiles.map((fileName, index) => {
        const card  = document.createElement("div");
        const image = document.createElement("img");

        card.className        = "collage-card";
        card.style.zIndex     = String(index + 1);
        card.dataset.rotation = String(rotationPattern[index % rotationPattern.length]);

        image.alt     = "Photo collage memory";
        image.loading = "lazy";

        const applyOrientation = () => {
            if (!image.naturalWidth || !image.naturalHeight) return;
            try {
                const isPortrait = image.naturalHeight > image.naturalWidth;
                card.classList.add(isPortrait ? "portrait" : "landscape");
                image.classList.add(isPortrait ? "portrait-img" : "landscape-img");
                sizeCard(card, image);
            } catch (e) { console.warn("collage orientation failed", e); }
        };

        image.addEventListener("load",  applyOrientation);
        image.addEventListener("error", () => card.classList.add("landscape"));
        image.src = `assets/images/photo collage/${fileName}`;
        if (image.complete) applyOrientation();

        card.appendChild(image);
        collageStack.appendChild(card);
        return card;
    });

    // ── Layout: all heights in real pixels, never vh ─────────────────────────
    // window.innerHeight = actual visible area on every device.
    // CSS vh on iOS Safari = large viewport (address bar hidden), which is
    // bigger than what the user actually sees, making everything feel too tall.
    function refreshLayout() {
        const vh     = window.innerHeight;
        const vw     = window.innerWidth;
        const mobile = vw <= 768;

        if (collageSticky) {
            // top threshold and height both in real px so sticky fires at the
            // correct visual position on iOS Safari
            collageSticky.style.top    = `${Math.round(vh * 0.12)}px`;
            collageSticky.style.height = `${Math.round(vh * 0.76)}px`;
        }

        // Stack fills most of the sticky panel, capped for readability
        const stackW = Math.min(Math.round(vw * (mobile ? 0.88 : 0.78)), 560);
        const stackH = Math.min(Math.round(vh * 0.70), mobile ? 520 : 720);
        collageStack.style.width  = `${stackW}px`;
        collageStack.style.height = `${stackH}px`;

        // Mobile: 20% of screen per card → ~5 phone screens total for 27 photos
        // Desktop: 34% of screen per card → same feel as before
        const scrollPerCard = Math.round(vh * (mobile ? 0.20 : 0.34));
        collageScrollArea.style.height = `${collageCards.length * scrollPerCard + vh}px`;

        // Re-fit already-loaded images to the (possibly new) stack dimensions
        collageCards.forEach(card => {
            const img = card.querySelector("img");
            if (img && img.complete && img.naturalWidth) sizeCard(card, img);
        });
    }

    // ── Scroll-driven animation ──────────────────────────────────────────────
    function updateCollageStack() {
        const totalScrollable = Math.max(1, collageScrollArea.offsetHeight - window.innerHeight);
        const scrolled        = Math.min(Math.max(-collageScrollArea.getBoundingClientRect().top, 0), totalScrollable);
        const progress        = scrolled / totalScrollable;
        const step            = progress * (collageCards.length + 0.8);

        collageCards.forEach((card, index) => {
            const rotation = Number(card.dataset.rotation || 0);
            const localP   = step - index;

            if (localP <= 0) {
                card.style.visibility = "hidden";
                card.style.transform  = `translateY(-220px) scale(0.9) rotate(${rotation * 0.4}deg) translateZ(0)`;
                return;
            }

            card.style.visibility = "visible";
            card.style.opacity    = "1";

            if (localP < 1) {
                const t      = localP;
                const bounce = t < 0.75
                    ? 1 - Math.pow(1 - t / 0.75, 3)
                    : 1 + Math.sin((t - 0.75) / 0.25 * Math.PI) * 0.06;
                const y   = (1 - bounce) * 220;
                const sc  = 0.9 + bounce * 0.1;
                const rot = rotation * (0.4 + (1 - bounce) * 0.6);
                card.style.transform = `translateY(${y + index * 1.6}px) scale(${sc}) rotate(${rot}deg) translateZ(0)`;
                return;
            }

            card.style.transform = `translateY(${index * 1.6}px) scale(1) rotate(${rotation}deg) translateZ(0)`;
        });
    }

    // ── Event wiring ─────────────────────────────────────────────────────────
    let rafPending = false;
    window.addEventListener("scroll", () => {
        if (!rafPending) {
            rafPending = true;
            requestAnimationFrame(() => { updateCollageStack(); rafPending = false; });
        }
    }, { passive: true });

    window.addEventListener("resize", () => { refreshLayout(); updateCollageStack(); });

    refreshLayout();
    updateCollageStack();
}
