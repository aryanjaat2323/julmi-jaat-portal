/**
 * Attitude Quotes & Shayari Vault for Julmi Jaat
 * Includes Story Image Generator and WhatsApp share
 */

const ROYAL_QUOTES = [
  {
    hindi: "रूतबा ऐसा बनाओ कि लोग सलाम करें, किसी के सामने झुकना जुल्मी जाट की फितरत नहीं!",
    english: "Build an aura that commands respect. Bowing down is not in the blood of Julmi Jaat!",
    tag: "रूतबा & ठाठ"
  },
  {
    hindi: "बात जब उसूलों की हो तो बगावत लाज़मी है, शांत समंदर में भी तूफान उठाना हमारी आदत है।",
    english: "When it comes to principles, rebellion is inevitable. We know how to raise storms in calm waters.",
    tag: "उसूल & गुरूर"
  },
  {
    hindi: "शेर की चाल और जाट का हाल, दोनों ही शहर में तहलका मचाने के लिए काफी हैं!",
    english: "The stride of a lion and the presence of a Jaat are enough to set the city on fire!",
    tag: "रॉयल स्वैग"
  },
  {
    hindi: "कागजों पर नहीं, दिलों और मैदानों पर राज करते हैं। नाम ही काफी है — जुल्मी जाट!",
    english: "We rule hearts and battlegrounds, not pieces of paper. The name is enough — Julmi Jaat!",
    tag: "हवेली का हुक्म"
  },
  {
    hindi: "दुश्मन भी हमारे खौफ से कांपते हैं, और यार हमारे नाम पर जान भी वारते हैं।",
    english: "Even enemies tremble at our name, while brothers are ready to lay down their lives.",
    tag: "यारी & रुतबा"
  },
  {
    hindi: "थार की रफ्तार और जाट की दहाड़, जहां से भी गुजरे रास्ता अपने आप बन जाता है।",
    english: "The roar of the Thar and the swagger of a Jaat clear the path wherever we roll.",
    tag: "थार & भौकाल"
  }
];

class QuotesManager {
  constructor() {
    this.currentIndex = 0;
    this.quotes = ROYAL_QUOTES;
  }

  init() {
    this.quoteTextEl = document.getElementById('shayari-text');
    this.quoteTagEl = document.getElementById('shayari-tag');
    this.quoteAuthorEl = document.getElementById('shayari-author');
    this.renderQuote();
  }

  nextQuote() {
    this.currentIndex = (this.currentIndex + 1) % this.quotes.length;
    this.animateQuoteChange();
    if (window.royalAudio) window.royalAudio.playClick();
  }

  animateQuoteChange() {
    if (!this.quoteTextEl) return;
    this.quoteTextEl.style.opacity = '0';
    this.quoteTextEl.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
      this.renderQuote();
      this.quoteTextEl.style.transition = 'all 0.4s ease';
      this.quoteTextEl.style.opacity = '1';
      this.quoteTextEl.style.transform = 'translateY(0)';
    }, 250);
  }

  renderQuote() {
    const q = this.quotes[this.currentIndex];
    if (this.quoteTextEl) {
      this.quoteTextEl.innerHTML = `"${q.hindi}"<br><span style="font-size: 1rem; color: #94a3b8; font-weight: 400; display: block; margin-top: 10px;">${q.english}</span>`;
    }
    if (this.quoteTagEl) {
      this.quoteTagEl.textContent = q.tag;
    }
  }

  copyQuote() {
    const q = this.quotes[this.currentIndex];
    const textToCopy = `👑 *JULMI JAAT ATTITUDE* 👑\n\n"${q.hindi}"\n\n- Julmi Jaat Portal | Royal Swag`;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
      alert("✅ शायरी कॉपी हो गई! आप इसे WhatsApp या Instagram पर शेयर कर सकते हैं।");
    }).catch(() => {
      alert("Quote copied to clipboard!");
    });
  }

  downloadStoryCard() {
    const q = this.quotes[this.currentIndex];
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');

    // Dark luxury background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 1920);
    bgGrad.addColorStop(0, '#0a0a0f');
    bgGrad.addColorStop(0.5, '#161622');
    bgGrad.addColorStop(1, '#050508');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1080, 1920);

    // Decorative Gold Border
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 14;
    ctx.strokeRect(50, 50, 980, 1820);

    ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
    ctx.lineWidth = 4;
    ctx.strokeRect(70, 70, 940, 1780);

    // Golden Header Emblem
    ctx.textAlign = 'center';
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 90px serif';
    ctx.fillText('👑', 540, 360);

    ctx.font = 'bold 70px "Cinzel", serif';
    ctx.fillText('JULMI JAAT', 540, 480);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 30px "Outfit", sans-serif';
    ctx.fillText('ROYAL ATTITUDE STATUS', 540, 540);

    // Divider line
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(390, 590);
    ctx.lineTo(690, 590);
    ctx.stroke();

    // Hindi Quote Wrap
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 54px "Cinzel", serif';
    this.wrapText(ctx, `"${q.hindi}"`, 540, 850, 840, 85);

    // English Quote Wrap
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'italic 38px "Outfit", sans-serif';
    this.wrapText(ctx, q.english, 540, 1260, 800, 60);

    // Footer
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 36px "Outfit", sans-serif';
    ctx.fillText('⚡ HUKUM • SWAG • ROYAL HERITAGE ⚡', 540, 1680);

    // Download trigger
    const link = document.createElement('a');
    link.download = `Julmi_Jaat_Status_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currentY);
  }
}

window.quotesManager = new QuotesManager();
