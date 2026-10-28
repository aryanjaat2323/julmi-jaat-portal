/**
 * Photo Vault & Gallery Manager for Julmi Jaat
 * Powered by IndexedDB for unlimited high-resolution photo storage & persistence
 * Showcases all photos of Julmi Jaat
 */

class RoyalGalleryManager {
  constructor() {
    this.dbName = 'JulmiJaatVaultDB';
    this.dbVersion = 1;
    this.db = null;
    this.currentFilter = 'all';
    this.currentLightboxIndex = 0;
    this.activeList = [];

    // Official Curated Showcase Photos with User Photos
    this.defaultPhotos = [
      {
        id: 'user-photo-1',
        title: 'जुल्मी जाट - रॉयल स्वैग',
        category: 'squad',
        categoryLabel: 'Julmi Jaat',
        date: 'Royal Swag',
        url: 'assets/images/julmi_jaat_1.jpeg',
        isDefault: false
      },
      {
        id: 'user-photo-2',
        title: 'यारों की महफ़िल',
        category: 'squad',
        categoryLabel: 'Julmi Jaat',
        date: 'Royal Swag',
        url: 'assets/images/julmi_jaat_2.jpeg',
        isDefault: false
      },
      {
        id: 'user-photo-3',
        title: 'जुल्मी तेवर & रुतबा',
        category: 'squad',
        categoryLabel: 'Julmi Jaat',
        date: 'Royal Swag',
        url: 'assets/images/julmi_jaat_3.jpeg',
        isDefault: false
      },
      {
        id: 'user-photo-4',
        title: 'शाही काफ़िला',
        category: 'squad',
        categoryLabel: 'Julmi Jaat',
        date: 'Royal Swag',
        url: 'assets/images/julmi_jaat_4.jpeg',
        isDefault: false
      },
      {
        id: 'user-photo-5',
        title: 'रॉयल जाट ठाठ',
        category: 'squad',
        categoryLabel: 'Julmi Jaat',
        date: 'Royal Swag',
        url: 'assets/images/julmi_jaat_5.jpeg',
        isDefault: false
      },
      {
        id: 'user-photo-6',
        title: 'बेखौफ अंदाज',
        category: 'squad',
        categoryLabel: 'Julmi Jaat',
        date: 'Royal Swag',
        url: 'assets/images/julmi_jaat_6.jpeg',
        isDefault: false
      },
      {
        id: 'user-photo-7',
        title: 'जुल्मी जाट & स्क्वाड',
        category: 'squad',
        categoryLabel: 'Julmi Jaat',
        date: 'Royal Swag',
        url: 'assets/images/julmi_jaat_7.jpeg',
        isDefault: false
      },
      {
        id: 'default-logo',
        title: 'शाही राजमुद्रा (Imperial Lion Crest)',
        category: 'swag',
        categoryLabel: 'Royal Crest',
        date: 'Royal Signature',
        url: 'assets/images/julmi_jaat_logo.jpg',
        isDefault: true
      },
      {
        id: 'default-thar',
        title: 'काली थार 4x4 (Black Monster)',
        category: 'rides',
        categoryLabel: 'Royal Ride',
        date: 'Haveli Courtyard',
        url: 'assets/images/mahindra_thar.jpg',
        isDefault: true
      },
      {
        id: 'default-bullet',
        title: 'रॉयल एनफील्ड बुलेट 350 (Dug-Dug Swag)',
        category: 'rides',
        categoryLabel: 'Royal Ride',
        date: 'Highway Roar',
        url: 'assets/images/royal_bullet.jpg',
        isDefault: true
      }
    ];
  }

  async init() {
    await this.initDB();
    this.bindEvents();
    await this.renderGallery();
  }

  initDB() {
    return new Promise((resolve) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('photos')) {
          db.createObjectStore('photos', { keyPath: 'id' });
        }
      };

      request.onsuccess = (e) => {
        this.db = e.target.result;
        resolve(this.db);
      };

      request.onerror = (e) => {
        console.error("IndexedDB Error:", e);
        resolve(null);
      };
    });
  }

  bindEvents() {
    const dropzone = document.getElementById('photo-dropzone');
    const fileInput = document.getElementById('photo-file-input');

    if (dropzone && fileInput) {
      dropzone.addEventListener('click', () => fileInput.click());

      dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
      });

      dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('dragover');
      });

      dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          this.handleFiles(e.dataTransfer.files);
        }
      });

      fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length > 0) {
          this.handleFiles(e.target.files);
        }
      });
    }

    // Filter buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentFilter = btn.dataset.filter || 'all';
        this.renderGallery();
      });
    });

    // Lightbox modal close
    const lightbox = document.getElementById('lightbox-modal');
    const closeBtn = document.getElementById('lightbox-close');
    if (closeBtn && lightbox) {
      closeBtn.addEventListener('click', () => {
        lightbox.classList.remove('active');
      });
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) lightbox.classList.remove('active');
      });
    }
  }

  async handleFiles(files) {
    const fileArray = Array.from(files);
    let addedCount = 0;

    for (const file of fileArray) {
      if (!file.type.startsWith('image/')) continue;

      const dataUrl = await this.readFileAsDataURL(file);
      const newPhoto = {
        id: 'user-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
        title: file.name.replace(/\.[^/.]+$/, "") || 'जुल्मी जाट की फोटो',
        category: 'user',
        categoryLabel: 'Uploaded by You',
        date: new Date().toLocaleDateString('hi-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
        url: dataUrl,
        isDefault: false
      };

      await this.savePhotoToDB(newPhoto);
      addedCount++;
    }

    if (addedCount > 0) {
      if (window.royalAudio) window.royalAudio.playEntranceBoom();
      await this.renderGallery();
      alert(`⚡ जुल्मी जाट जी, आपकी ${addedCount} नई फोटो गैलरी में सफलतापूर्वक जुड़ गई हैं!`);
    }
  }

  readFileAsDataURL(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(file);
    });
  }

  savePhotoToDB(photo) {
    return new Promise((resolve) => {
      if (!this.db) return resolve(false);
      const transaction = this.db.transaction(['photos'], 'readwrite');
      const store = transaction.objectStore('photos');
      const request = store.put(photo);
      request.onsuccess = () => resolve(true);
      request.onerror = () => resolve(false);
    });
  }

  getUserPhotosFromDB() {
    return new Promise((resolve) => {
      if (!this.db) return resolve([]);
      const transaction = this.db.transaction(['photos'], 'readonly');
      const store = transaction.objectStore('photos');
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => resolve([]);
    });
  }

  deletePhoto(id) {
    if (!confirm("क्या आप इस फोटो को गैलरी से हटाना चाहते हैं?")) return;
    if (!this.db) return;
    const transaction = this.db.transaction(['photos'], 'readwrite');
    const store = transaction.objectStore('photos');
    store.delete(id);
    transaction.oncomplete = () => {
      this.renderGallery();
    };
  }

  async renderGallery() {
    const grid = document.getElementById('gallery-grid');
    if (!grid) return;

    const userUploaded = await this.getUserPhotosFromDB();
    const allPhotos = [...userUploaded, ...this.defaultPhotos];

    let filtered = allPhotos;
    if (this.currentFilter !== 'all') {
      filtered = allPhotos.filter(p => p.category === this.currentFilter);
    }

    this.activeList = filtered;

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: #94a3b8;">
          <div style="font-size: 50px; margin-bottom: 12px;">📸</div>
          <h3 style="font-size: 1.5rem; color: #fff; margin-bottom: 8px;">कोई फोटो नहीं मिली</h3>
          <p>ऊपर दिए गए बॉक्स में अपनी फोटो ड्रैग करके या क्लिक करके जोड़ें!</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map((photo, index) => `
      <div class="gallery-card" onclick="window.galleryManager.openLightbox(${index})">
        <img src="${photo.url}" alt="${photo.title}" loading="lazy" onerror="this.src='assets/images/julmi_jaat_logo.jpg'">
        <div class="card-overlay">
          <span class="card-tag">${photo.categoryLabel}</span>
          <h4 class="card-title">${photo.title}</h4>
          <span class="card-date">${photo.date}</span>
        </div>
        <div class="card-actions" onclick="event.stopPropagation()">
          ${photo.category === 'user' ? `
            <button class="card-action-btn" title="Delete Photo" onclick="window.galleryManager.deletePhoto('${photo.id}')">
              🗑️
            </button>
          ` : ''}
          <button class="card-action-btn" title="Fullscreen View" onclick="window.galleryManager.openLightbox(${index})">
            🔍
          </button>
        </div>
      </div>
    `).join('');

    // Update photo counter
    const photoCounterEl = document.getElementById('stat-photos-count');
    if (photoCounterEl) {
      photoCounterEl.textContent = allPhotos.length;
    }
  }

  openLightbox(index) {
    if (!this.activeList || !this.activeList[index]) return;
    this.currentLightboxIndex = index;
    const photo = this.activeList[index];

    const lightbox = document.getElementById('lightbox-modal');
    const img = document.getElementById('lightbox-img');
    const caption = document.getElementById('lightbox-caption');

    if (lightbox && img && caption) {
      img.src = photo.url;
      caption.innerHTML = `<strong>${photo.title}</strong> • ${photo.categoryLabel}`;
      lightbox.classList.add('active');
    }
  }
}

window.galleryManager = new RoyalGalleryManager();
