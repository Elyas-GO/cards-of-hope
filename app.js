document.addEventListener("DOMContentLoaded", function() {
    const {
        deckByRank: e,
        jokerCards: t,
        allPropheciesData: n
    } = window.deckData || {};

    // Normal Playing Card Function (unchanged - already good)
    function i(cardData) {
        const cardEl = document.createElement("div");
        cardEl.className = "card";
        
        const isRed = cardData.suit === "♥" || cardData.suit === "♦";

        cardEl.innerHTML = `
            <div class="card-inner">
                <!-- FRONT -->
                <div class="card-face card-front">
                    <div style="display:flex;justify-content:space-between;">
                        <span class="gold rank-suit">${cardData.val}</span>
                        <span class="${isRed ? 'suit-red' : 'suit-black'} rank-suit">${cardData.suit}</span>
                    </div>
                    
                    <div style="flex:1;display:flex;flex-direction:column;justify-content:center;text-align:center; padding: 10px 0;">
                        <div class="gold text-xs uppercase tracking-widest mb-3">${cardData.category}</div>
                        <div style="font-weight:bold; font-size:0.96rem; line-height:1.2;">${cardData.main}</div>
                        <div class="text-xs text-gray-600 mt-4">${cardData.ref}</div>
                        <div style="margin-top:12px; font-size:0.74rem; line-height:1.3;">${cardData.text}</div>
                    </div>
                    
                    <div style="display:flex;justify-content:space-between;transform:rotate(180deg);">
                        <span class="gold rank-suit">${cardData.val}</span>
                        <span class="${isRed ? 'suit-red' : 'suit-black'} rank-suit">${cardData.suit}</span>
                    </div>
                </div>
                
                <!-- BACK -->
                <div class="card-face card-back"></div>
            </div>
        `;

        cardEl.addEventListener("click", () => {
            cardEl.classList.toggle("flipped");
        });

        return cardEl;
    }

    const l = document.getElementById("cards-display");

    function s(rank) {
        const n = e[rank];
        if (!n) return;

        l.innerHTML = `<div class="suit-family-grid grid grid-cols-2 md:grid-cols-4 gap-6">
            ${["♦","♣","♠","♥"].map((suit, idx) => `<div id="card-${rank}-${idx}"></div>`).join("")}
        </div>`;

        ["♦", "♣", "♠", "♥"].forEach((suit, idx) => {
            const cardData = n.find(c => c.suit === suit);
            if (cardData) {
                document.getElementById(`card-${rank}-${idx}`).appendChild(i(cardData));
            }
        });
    }

    // ==================== JOKER CARDS - FIXED ====================
    // ==================== JOKER CARDS - SPECIAL RULE ====================
    const jokerContainer = document.getElementById("joker-cards-container");
    if (jokerContainer && t.length >= 2) {
        jokerContainer.innerHTML = ''; 

        const jokerElements = [];

        t.forEach((joker, index) => {
            const jokerDiv = document.createElement("div");
            jokerDiv.className = "joker-card";

            const isScrewtape = index === 0;   // Joker One = Screwtape

            jokerDiv.innerHTML = `
                <div class="joker-card-inner">
                    <!-- FRONT -->
                    <div class="joker-card-face joker-front">
                        <div class="joker-symbol">🃏</div>
                        <h3>${joker.main || 'JOKER'}</h3>
                        <p>${joker.text || ''}</p>
                        ${isScrewtape ? 
                            `<a href="https://docs.google.com/document/d/1Nl5G5ad8rPc_ijSGA0KnPZG81bt38XzK/edit?usp=sharing&ouid=117867511891762056685&rtpof=true&sd=true" 
                                target="_blank" class="text-amber-300 underline text-sm mt-6 block veteran">Read Full Letter →</a>` 
                            : 
                            `<span class="text-red-400 text-sm font-mono mt-4 block">TOP SECRET // DECLASSIFIED</span>`
                        }
                    </div>
                    
                    <!-- BACK -->
                    <div class="joker-card-face joker-back"></div>
                </div>
            `;

            jokerElements.push(jokerDiv);
            jokerContainer.appendChild(jokerDiv);
        });

        // SPECIAL RULE: Click one flips the OTHER
        jokerElements.forEach((currentJoker, index) => {
            const otherJoker = jokerElements[index === 0 ? 1 : 0];   // If 0 → flip 1, if 1 → flip 0

            currentJoker.addEventListener("click", () => {
                otherJoker.classList.toggle("flipped");
            });
        });
    }
    // ==================================================================
    // ============================================================

    // Rank Tabs
    document.querySelectorAll(".rank-tab").forEach(tab => {
        tab.addEventListener("click", () => {
            document.querySelectorAll(".rank-tab").forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            s(tab.dataset.rank);
        });
    });

    // Initialize first rank
    s("2");

    // Populate Rank Tabs with random suits
    document.querySelectorAll(".rank-tab").forEach(tab => {
        const rank = tab.getAttribute("data-rank");
        const suits = ["♦","♣","♠","♥"];
        const suit = suits[Math.floor(Math.random() * suits.length)];
        const isRed = suit === "♦" || suit === "♥";
        
        tab.innerHTML = `
            <div class="tab-rank-number">${rank}</div>
            <div class="tab-suit-symbol ${isRed ? 'red-suit' : 'black-suit'}">${suit}</div>
        `;
        
        if (rank === "K") {
            tab.style.borderColor = "#9f1239";
        }
    });

    // Make the first tab (2) active
    const firstTab = document.querySelector('.rank-tab[data-rank="2"]');
    if (firstTab) firstTab.classList.add("active");

    // All Prophecies Section
    const o = document.getElementById("all-prophecies-list");

    function r(search = "") {
        const filtered = n.filter(item => 
            (item.prophecy || "").toLowerCase().includes(search) || 
            (item.description || "").toLowerCase().includes(search) || 
            (item.otText || "").toLowerCase().includes(search) || 
            (item.fulfillment1 || "").toLowerCase().includes(search) || 
            (item.fulfillment1Text || "").toLowerCase().includes(search) ||
            (item.fulfillment2Text || "").toLowerCase().includes(search)
        );

        o.innerHTML = filtered.map(item => {
            let extra = "";
            if (item.fulfillment2 && item.fulfillment2.trim() !== "") {
                extra = `<div class="text-xs text-amber-400/60 mt-1">+ Fulfillment 2: ${item.fulfillment2} – ${(item.fulfillment2Text||"").substring(0,120)}</div>`;
            }
            return `<div class="prophecy-list-item veteran">
                <div class="font-bold text-amber-300">${item.prophecy}</div>
                <div class="text-sm text-gray-300 mt-1">${item.description}</div>
                <div class="text-xs text-gray-400 mt-2 italic">📖 OT: ${(item.otText||"").substring(0,150)}</div>
                <div class="text-xs text-amber-400/80 mt-2">✓ Fulfillment 1: ${item.fulfillment1} – ${(item.fulfillment1Text||"").substring(0,120)}</div>
                ${extra}
            </div>`;
        }).join("");

        if (filtered.length === 0) {
            o.innerHTML = '<p class="text-gray-400 text-center py-8">No matches found.</p>';
        }
    }

    // Initialize prophecies
    r();

    // Search functionality
    const searchInput = document.getElementById("prophecy-search");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            r(e.target.value.toLowerCase());
        });
    }

    // ========== PDF EXPORT (NICK THE LOT) ==========
    window.exportPropheciesToPDF = async function() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ unit: 'pt', format: 'a4' });
        let y = 40;
        doc.setFont("courier");
        doc.setFontSize(18);
        doc.text("54 CARDS OF HOPE · ALL PROPHECIES (350+)", 40, y);
        y += 24;
        doc.setFontSize(10);
        for (let i = 0; i < allPropheciesData.length; i++) {
            const p = allPropheciesData[i];
            const line = `${p.prophecy}: ${p.description.substring(0,60)} — ${p.fulfillment1Text.substring(0,80)}`;
            const lines = doc.splitTextToSize(line, 500);
            if (y + (lines.length * 12) > 780) { doc.addPage(); y = 40; }
            doc.text(lines, 40, y);
            y += (lines.length * 12) + 6;
        }
        doc.save("54_cards_of_hope_all_prophecies.pdf");
    };

    // ----- All prophecies list (350+) with search -----
    

    // ========== 351 SHORTS (compact summary) ==========
    window.nickTheLotShorts = function() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ unit: 'pt', format: 'a4' });
        let y = 40;
        doc.setFont("courier");
        doc.setFontSize(20);
        doc.text("⚡ 351 SHORTS ⚡", 40, y);
        y += 28;
        doc.setFontSize(11);
        const shorts = allPropheciesData.slice(0, 45).map(p => `✦ ${p.prophecy.substring(0,40)} — ${p.fulfillment1.substring(0,45)}`).join("\n");
        const lines = doc.splitTextToSize(shorts, 510);
        doc.text(lines, 40, y);
        doc.setFontSize(9);
        doc.text("Complete 350+ prophecies available at cardsofhope.live", 40, 750);
        doc.save("351_shorts_prophecies.pdf");
    };

    // Attach button events (ensure buttons exist)
    const shortsBtn = document.getElementById("shortsBtn");
    const pdfBtn = document.getElementById("pdfBtn");
    if (shortsBtn) shortsBtn.addEventListener("click", (e) => { e.preventDefault(); window.nickTheLotShorts(); });
    if (pdfBtn) pdfBtn.addEventListener("click", (e) => { e.preventDefault(); window.exportPropheciesToPDF(); });
// });

    // Export functions (unchanged)
    // window.exportPropheciesToPDF = async function() { /* ... your existing PDF code ... */ };
    // window.nickTheLotShorts = function() { /* ... your existing function ... */ };
});