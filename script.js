document.addEventListener('DOMContentLoaded', () => {
    // --- Constants & Config ---
    const DEFAULT_PRESETS = [
        "上着", "ズボン", "肌着上", "肌着下", "靴下", "上靴", "下靴",
        "羽織り", "帽子類", "コート", "タオル", "布パンツ", "ひげ剃り", "化粧品類", "携帯電話", "杖", "SC", "車椅子",
        "口腔セット", "x2", "x3", "x4", "x5",
        "🥺", "🫣", "✨"
    ];
    const MAX_STAMPS = 8;

    const TRANSLATIONS = {
        ja: {
            appTitle: "荷物スタンプ",
            appSubtitle: "写真にスタンプしたり補正したり",
            start: "スタンプ",
            settings: "設定",
            back: "戻る",
            language: "言語 / Language",
            managePresets: "スタンプ定型文の管理",
            newPresetPlaceholder: "新しい定型文...",
            add: "追加",
            resetPresets: "初期設定に戻す",
            home: "ホームへ",
            edit: "編集",
            uploadPrompt: "画像をタップまたはドラッグしてアップロード",
            modePreset: "定型文",
            modeCustom: "自由入力",
            addStamp: "+ スタンプ追加",
            delete: "削除",
            addStampHelp: "追加は追加ボタンの後に文字を選択する",
            selectStampHelp: "スタンプを長押しタップして選択/移動",
            selectStamp: "スタンプを選択",
            textInput: "テキスト入力",
            textInputPlaceholder: "ここに入力...",
            fontSize: "フォントサイズ",
            opacity: "透明度",
            textColor: "文字色",
            saveDevice: "本体に保存(スマホ等)",
            savePC: "画像を保存(PC)",
            previewOld: "プレビュー(旧iPad用)",
            reset: "リセット",
            previewTitle: "プレビュー",
            previewInstruction: "画像を長押しして「写真に保存」を選択してください",
            close: "閉じる",
            statusAdded: "追加しました",
            statusReset: "初期化しました",
            confirmDelete: "この定型文を削除しますか？",
            confirmReset: "定型文を初期状態に戻しますか？追加した内容は消去されます。",
            correction: "画像補正",
            autoCorrection: "自動補正",
            cloudyCorrection: "曇り空補正",
            backlightCorrection: "逆光補正",
            sizeCorrection: "サイズ補正(1MB以下)",
            blurBackground: "背景ぼかし",
            heicConversion: "HEIC/HEIF➔JPG変換"
        },
        en: {
            appTitle: "Photo Stamper",
            appSubtitle: "Add stamps & correct photos",
            start: "Stamp",
            settings: "Settings",
            back: "Back",
            language: "Language",
            managePresets: "Manage Presets",
            newPresetPlaceholder: "New preset...",
            add: "Add",
            resetPresets: "Reset Presets",
            home: "Home",
            edit: "Edit",
            uploadPrompt: "Tap or drag to upload image",
            modePreset: "Preset",
            modeCustom: "Custom",
            addStamp: "+ Add Stamp",
            delete: "Delete",
            addStampHelp: "Select text after adding",
            selectStampHelp: "Tap stamp to select/move",
            selectStamp: "Select Stamp",
            textInput: "Text Input",
            textInputPlaceholder: "Enter text...",
            fontSize: "Font Size",
            opacity: "Opacity",
            textColor: "Text Color",
            saveDevice: "Save to Device (Phone)",
            savePC: "Save Image (PC)",
            previewOld: "Preview (Old iPad)",
            reset: "Reset",
            previewTitle: "Preview",
            previewInstruction: "Long press image to save",
            close: "Close",
            statusAdded: "Added",
            statusReset: "Reset",
            confirmDelete: "Delete this preset?",
            confirmReset: "Reset presets? Custom presets will be lost.",
            correction: "Image Correction",
            autoCorrection: "Auto Correction",
            cloudyCorrection: "Cloudy Correction",
            backlightCorrection: "Backlight Correction",
            sizeCorrection: "Size Correction (1MB)",
            blurBackground: "Blur Background",
            heicConversion: "HEIC/HEIF➔JPG Conversion"
        },
        hi: {
            appTitle: "फोटो स्टैम्प",
            appSubtitle: "फोटो पर स्टैम्प जोड़ें और संशोधित करें",
            start: "शुरू करें",
            settings: "सेटिंग्स",
            back: "वापस",
            language: "भाषा / Language",
            managePresets: "प्रीसेट प्रबंधित करें",
            newPresetPlaceholder: "नया प्रीसेट...",
            add: "जोड़ें",
            resetPresets: "प्रीसेट रीसेट करें",
            home: "होम",
            edit: "संपादित करें",
            uploadPrompt: "छवि अपलोड करने के लिए टैप या ड्रैग करें",
            modePreset: "प्रीसेट",
            modeCustom: "कस्टम",
            addStamp: "+ स्टैम्प जोड़ें",
            delete: "हटाएं",
            addStampHelp: "जोड़ने के बाद टेक्स्ट चुनें",
            selectStampHelp: "चुनने के लिए स्टैम्प पर टैप करें",
            selectStamp: "स्टैम्प चुनें",
            textInput: "टेक्स्ट इनपुट",
            textInputPlaceholder: "यहाँ लिखें...",
            fontSize: "फ़ॉन्ट आकार",
            opacity: "अपारदर्शिता",
            textColor: "टेक्स्ट का रंग",
            saveDevice: "डिवाइस में सहेजें (फ़ोन)",
            savePC: "छवि सहेजें (PC)",
            previewOld: "पूर्वावलोकन (पुराना iPad)",
            reset: "रीसेट",
            previewTitle: "पूर्वावलोकन",
            previewInstruction: "सहेजने के लिए छवि को देर तक दबाएं",
            close: "बंद करें",
            statusAdded: "जोड़ा गया",
            statusReset: "रीसेट पूरा हुआ",
            confirmDelete: "क्या आप इस प्रीसेट को हटाना चाहते हैं?",
            confirmReset: "क्या आप प्रीसेट को डिफ़ॉल्ट पर रीसेट करना चाहते हैं?",
            correction: "चित्र सुधार",
            autoCorrection: "स्वचालित सुधार",
            cloudyCorrection: "बादल वाला सुधार",
            backlightCorrection: "बैकलाइट सुधार",
            sizeCorrection: "आकार सुधार (1MB)",
            blurBackground: "पृष्ठभूमि धुंधला करें",
            heicConversion: "HEIC/HEIF➔JPG रूपांतरण"
        },
        vi: {
            appTitle: "Đóng Dấu Ảnh",
            appSubtitle: "Thêm dấu vào ảnh",
            start: "Bắt đầu",
            settings: "Cài đặt",
            back: "Quay lại",
            language: "Ngôn ngữ / Language",
            managePresets: "Quản lý mẫu",
            newPresetPlaceholder: "Mẫu mới...",
            add: "Thêm",
            resetPresets: "Đặt lại mẫu",
            home: "Trang chủ",
            edit: "Chỉnh sửa",
            uploadPrompt: "Chạm hoặc kéo để tải ảnh lên",
            modePreset: "Mẫu có sẵn",
            modeCustom: "Tự nhập",
            addStamp: "+ Thêm dấu",
            delete: "Xóa",
            addStampHelp: "Chọn văn bản sau khi thêm",
            selectStampHelp: "Chạm vào dấu để chọn",
            selectStamp: "Chọn dấu",
            textInput: "Nhập văn bản",
            textInputPlaceholder: "Nhập vào đây...",
            fontSize: "Cỡ chữ",
            opacity: "Độ mờ",
            textColor: "Màu chữ",
            saveDevice: "Lưu vào máy",
            savePC: "Lưu (PC)",
            previewOld: "Xem trước (iPad cũ)",
            reset: "Đặt lại",
            previewTitle: "Xem trước",
            previewInstruction: "Nhấn giữ ảnh để lưu",
            close: "Đóng",
            statusAdded: "Đã thêm",
            statusReset: "Đã đặt lại",
            confirmDelete: "Xóa mẫu này?",
            confirmReset: "Đặt lại mẫu về mặc định? Các mẫu tùy chỉnh sẽ bị mất.",
            correction: "Hiệu chỉnh ảnh",
            autoCorrection: "Tự động hiệu chỉnh",
            cloudyCorrection: "Hiệu chỉnh trời nhiều mây",
            backlightCorrection: "Hiệu chỉnh ngược sáng",
            sizeCorrection: "Hiệu chỉnh kích thước (1MB)",
            blurBackground: "Làm mờ nền",
            heicConversion: "Chuyển đổi HEIC/HEIF➔JPG"
        },
        ne: {
            appTitle: "फोटो स्ट्याम्प",
            appSubtitle: "फोटोमा स्ट्याम्प थप्नुहोस्",
            start: "सुरु गर्नुहोस्",
            settings: "सेटिङहरू",
            back: "फर्कनुहोस्",
            language: "भाषा / Language",
            managePresets: "प्रिसेटहरू व्यवस्थापन गर्नुहोस्",
            newPresetPlaceholder: "नयाँ प्रिसेट...",
            add: "थप्नुहोस्",
            resetPresets: "प्रिसेट रिसेट गर्नुहोस्",
            home: "गृहपृष्ठ",
            edit: "सम्पादन",
            uploadPrompt: "तस्बिर अपलोड गर्न ट्याप वा ड्र्याग गर्नुहोस्",
            modePreset: "प्रिसेट",
            modeCustom: "कस्टम",
            addStamp: "+ स्ट्याम्प थप्नुहोस्",
            delete: "हटाउनुहोस्",
            addStampHelp: "थपेपछि पाठ छान्नुहोस्",
            selectStampHelp: "छान्न स्ट्याम्पमा ट्याप गर्नुहोस्",
            selectStamp: "स्ट्याम्प छान्नुहोस्",
            textInput: "पाठ इनपुट",
            textInputPlaceholder: "यहाँ लेख्नुहोस्...",
            fontSize: "फन्ट साइज",
            opacity: "पारदर्शिता",
            textColor: "पाठको रङ",
            saveDevice: "यन्त्रमा सुरक्षित गर्नुहोस्",
            savePC: "सुरक्षित गर्नुहोस् (PC)",
            previewOld: "पूर्वावलोकन (पुरानो iPad)",
            reset: "रिसेट",
            previewTitle: "पूर्वावलोकन",
            previewInstruction: "सुरक्षित गर्न तस्बिरलाई लामो समय थिच्नुहोस्",
            close: "बन्द गर्नुहोस्",
            statusAdded: "थपियो",
            statusReset: "रिसेट पूरा भयो",
            confirmDelete: "यो प्रिसेट हटाउने हो?",
            confirmReset: "प्रिसेटहरू डिफल्टमा रिसेट गर्ने हो?",
            correction: "चित्र सुधार",
            autoCorrection: "स्वत: सुधार",
            cloudyCorrection: "बादल सुधार",
            backlightCorrection: "ब्याकलाइट सुधार",
            sizeCorrection: "आकार सुधार (1MB)",
            blurBackground: "पृष्ठभूमि धमिलो गर्नुहोस्",
            heicConversion: "HEIC/HEIF➔JPG रूपान्तरण"
        }
    };

    // --- Elements ---
    // Screens
    const screens = {
        home: document.getElementById('homeScreen'),
        settings: document.getElementById('settingsScreen'),
        editor: document.getElementById('editorScreen'),
        correction: document.getElementById('correctionScreen')
    };

    // Navigation
    const startBtn = document.getElementById('startBtn');
    const settingsBtn = document.getElementById('settingsBtn');
    const correctionBtn = document.getElementById('correctionBtn');
    const backBtns = document.querySelectorAll('.back-btn');

    // Settings
    const newPresetInput = document.getElementById('newPresetInput');
    const addPresetBtn = document.getElementById('addPresetBtn');
    const settingsPresetList = document.getElementById('settingsPresetList');
    const resetPresetsBtn = document.getElementById('resetPresetsBtn');
    const settingsStatus = document.getElementById('settingsStatus');
    const languageSelect = document.getElementById('languageSelect');

    // Editor - Canvas & Upload
    const uploadPlaceholder = document.getElementById('uploadPlaceholder');
    const imageInput = document.getElementById('imageInput');
    const canvas = document.getElementById('editorCanvas');
    const ctx = canvas.getContext('2d');

    // Editor - Controls
    const modeBtns = document.querySelectorAll('.mode-btn');
    const addStampBtn = document.getElementById('addStampBtn');
    const deleteStampBtn = document.getElementById('deleteStampBtn');
    const presetControls = document.getElementById('presetControls');
    const customControls = document.getElementById('customControls');
    const presetGrid = document.getElementById('presetGrid');
    const textInput = document.getElementById('textInput');
    const fontSizeInput = document.getElementById('fontSizeInput');
    const opacityInput = document.getElementById('opacityInput');
    const colorInput = document.getElementById('colorInput');
    const colorValue = document.getElementById('colorValue');

    // Editor - Actions
    const saveLocalBtn = document.getElementById('saveLocalBtn');
    const savePCBtn = document.getElementById('savePCBtn');
    const previewBtn = document.getElementById('previewBtn');
    const resetBtn = document.getElementById('resetBtn');

    // Modal
    const previewModal = document.getElementById('previewModal');
    const previewImage = document.getElementById('previewImage');
    const closeModalBtns = document.querySelectorAll('.close-modal-btn');

    // --- State ---
    let state = {
        currentImage: null,
        originalFileName: '',
        originalFileHandle: null, // File handle for File System Access API
        stamps: [], // Array of { id, text, x, y, fontSize, opacity, color }
        activeStampIndex: 0,
        isDragging: false,
        inputMode: 'preset', // 'preset' or 'custom'
        presets: JSON.parse(localStorage.getItem('photoStamperPresets')) || [...DEFAULT_PRESETS],
        language: localStorage.getItem('photoStamperLanguage') || 'ja'
    };

    // --- Initialization ---
    function init() {
        initNavigation();
        initPresetSettings();
        initEditor();
        initLanguage();
        renderPresets(); // Render editor presets
    }

    // --- Language Logic ---
    function initLanguage() {
        languageSelect.value = state.language;
        updateLanguage(state.language);

        languageSelect.addEventListener('change', (e) => {
            const lang = e.target.value;
            state.language = lang;
            localStorage.setItem('photoStamperLanguage', lang);
            updateLanguage(lang);
        });
    }

    function updateLanguage(lang) {
        const t = TRANSLATIONS[lang];
        if (!t) return;

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (t[key]) {
                el.textContent = t[key];
            }
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (t[key]) {
                el.placeholder = t[key];
            }
        });
    }

    function getTranslation(key) {
        return TRANSLATIONS[state.language][key] || key;
    }

    // --- Navigation Logic ---
    function navigateTo(screenId) {
        Object.values(screens).forEach(el => el.classList.remove('active'));
        screens[screenId].classList.add('active');

        // Refresh canvas on nav to editor to handle layout changes
        if (screenId === 'editor' && state.currentImage) {
            setTimeout(draw, 100);
        }

        // Refresh presets when entering editor (in case changed in settings)
        if (screenId === 'editor') {
            renderPresets();
        }
    }

    function initNavigation() {
        startBtn.addEventListener('click', () => navigateTo('editor'));
        settingsBtn.addEventListener('click', () => {
            renderSettingsPresets();
            navigateTo('settings');
        });
        correctionBtn.addEventListener('click', () => navigateTo('correction'));

        backBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.dataset.target;

                // Reset editor if navigating from editor screen
                if (btn.closest('#editorScreen')) {
                    resetEditor();
                }

                if (target === 'homeScreen') navigateTo('home');
            });
        });
    }

    // --- Settings Logic ---
    function initPresetSettings() {
        addPresetBtn.addEventListener('click', addPreset);
        resetPresetsBtn.addEventListener('click', resetPresets);
    }

    function renderSettingsPresets() {
        settingsPresetList.innerHTML = '';
        state.presets.forEach((preset, index) => {
            const li = document.createElement('li');
            li.className = 'preset-item';

            const span = document.createElement('span');
            span.textContent = preset;

            const delBtn = document.createElement('button');
            delBtn.textContent = getTranslation('delete');
            delBtn.className = 'btn small danger';
            delBtn.addEventListener('click', () => deletePreset(index));

            li.appendChild(span);
            li.appendChild(delBtn);
            settingsPresetList.appendChild(li);
        });
    }

    function addPreset() {
        const val = newPresetInput.value.trim();
        if (val) {
            state.presets.push(val);
            savePresets();
            newPresetInput.value = '';
            renderSettingsPresets();
            showStatus(getTranslation('statusAdded'));
        }
    }

    function deletePreset(index) {
        if (confirm(getTranslation('confirmDelete'))) {
            state.presets.splice(index, 1);
            savePresets();
            renderSettingsPresets();
        }
    }

    function resetPresets() {
        if (confirm(getTranslation('confirmReset'))) {
            state.presets = [...DEFAULT_PRESETS];
            savePresets();
            renderSettingsPresets();
            showStatus(getTranslation('statusReset'));
        }
    }

    function savePresets() {
        localStorage.setItem('photoStamperPresets', JSON.stringify(state.presets));
    }

    function showStatus(msg) {
        settingsStatus.textContent = msg;
        settingsStatus.className = "status-msg success";
        setTimeout(() => {
            settingsStatus.textContent = "";
        }, 3000);
    }

    // --- Editor Logic ---
    function initEditor() {
        // Upload
        uploadPlaceholder.addEventListener('click', () => imageInput.click());
        imageInput.addEventListener('change', handleImageUpload);

        // Drag & Drop
        uploadPlaceholder.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadPlaceholder.style.backgroundColor = 'rgba(255,255,255,0.1)';
        });
        uploadPlaceholder.addEventListener('dragleave', () => {
            uploadPlaceholder.style.backgroundColor = '';
        });
        uploadPlaceholder.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadPlaceholder.style.backgroundColor = '';
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFile(e.dataTransfer.files[0]);
            }
        });

        // Mode Switching
        modeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                modeBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                state.inputMode = btn.dataset.mode;
                updateControlsVisibility();
                updateUIFromState();
            });
        });

        // Stamp Management
        addStampBtn.addEventListener('click', addNewStamp);
        deleteStampBtn.addEventListener('click', deleteActiveStamp);

        // Controls
        textInput.addEventListener('input', (e) => {
            updateActiveStamp({ text: e.target.value });
        });

        fontSizeInput.addEventListener('input', (e) => {
            updateActiveStamp({ fontSize: parseInt(e.target.value) });
        });
        opacityInput.addEventListener('input', (e) => {
            updateActiveStamp({ opacity: parseFloat(e.target.value) });
        });
        colorInput.addEventListener('input', (e) => {
            colorValue.textContent = e.target.value.toUpperCase();
            updateActiveStamp({ color: e.target.value });
        });

        // Canvas Interaction
        canvas.addEventListener('mousedown', startDrag);
        canvas.addEventListener('mousemove', drag);
        canvas.addEventListener('mouseup', endDrag);
        canvas.addEventListener('mouseleave', endDrag);
        canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
        canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
        canvas.addEventListener('touchend', endDrag);

        // Actions
        saveLocalBtn.addEventListener('click', saveLocal);
        savePCBtn.addEventListener('click', savePC);
        previewBtn.addEventListener('click', savePreview);
        resetBtn.addEventListener('click', resetEditor);

        // Modal
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                previewModal.style.display = 'none';
            });
        });
        window.addEventListener('click', (e) => {
            if (e.target === previewModal) {
                previewModal.style.display = 'none';
            }
        });
    }

    function updateControlsVisibility() {
        if (state.inputMode === 'preset') {
            presetControls.style.display = 'block';
            customControls.style.display = 'none';
        } else {
            presetControls.style.display = 'none';
            customControls.style.display = 'block';
        }
    }

    function renderPresets() {
        presetGrid.innerHTML = '';
        state.presets.forEach((preset) => {
            const chip = document.createElement('div');
            chip.className = 'preset-chip';

            // Highlight if current stamp matches preset
            const currentStamp = state.stamps[state.activeStampIndex];
            if (currentStamp && currentStamp.text === preset && state.inputMode === 'preset') {
                chip.classList.add('selected');
            }

            chip.textContent = preset;

            chip.addEventListener('click', () => {
                updateActiveStamp({ text: preset });
                updateUIFromState();
            });

            presetGrid.appendChild(chip);
        });
    }

    function handleImageUpload(e) {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    }

    // Dynamic library loading utilities
    let compressorLoaded = false;
    let libheifLoaded = false;

    async function loadCompressor() {
        if (compressorLoaded || typeof Compressor !== 'undefined') {
            compressorLoaded = true;
            return true;
        }

        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/compressorjs@1.2.1/dist/compressor.min.js';
            script.onload = () => {
                compressorLoaded = true;
                console.log('Compressor.js loaded on-demand');
                resolve(true);
            };
            script.onerror = () => {
                console.warn('Failed to load Compressor.js');
                resolve(false);
            };
            document.head.appendChild(script);
        });
    }

    async function loadLibHeif() {
        if (libheifLoaded || typeof libheif !== 'undefined') {
            libheifLoaded = true;
            return true;
        }

        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/libheif-js@1.19.8/libheif-wasm/libheif-bundle.js';
            script.onload = () => {
                libheifLoaded = true;
                console.log('libheif-js loaded on-demand (2.5MB saved from initial load)');
                resolve(true);
            };
            script.onerror = () => {
                console.warn('Failed to load libheif-js');
                resolve(false);
            };
            document.head.appendChild(script);
        });
    }

    // Check if browser natively supports HEIC/HEIF
    async function checkNativeHEICSupport() {
        return new Promise((resolve) => {
            const img = new Image();
            const timeout = setTimeout(() => {
                resolve(false);
            }, 100);

            img.onload = () => {
                clearTimeout(timeout);
                resolve(true);
            };
            img.onerror = () => {
                clearTimeout(timeout);
                resolve(false);
            };

            // Minimal HEIC data URI (invalid but enough to test support)
            img.src = 'data:image/heic;base64,AAAA';
        });
    }

    // Helper to compress image
    async function compressImage(fileOrBlob) {
        // Load Compressor.js on-demand
        await loadCompressor();

        return new Promise((resolve, reject) => {
            if (typeof Compressor === 'undefined') {
                console.warn('Compressor.js not loaded, skipping compression');
                resolve(fileOrBlob);
                return;
            }

            try {
                new Compressor(fileOrBlob, {
                    quality: 0.8,
                    maxWidth: 2048,
                    maxHeight: 2048,
                    mimeType: 'image/jpeg',
                    success(result) {
                        resolve(result);
                    },
                    error(err) {
                        console.error('Compression error:', err);
                        // Fallback to original if compression fails
                        resolve(fileOrBlob);
                    },
                });
            } catch (e) {
                console.error('Compressor initialization error:', e);
                resolve(fileOrBlob);
            }
        });
    }

    async function handleFile(file, fileHandle = null) {
        state.originalFileName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
        state.originalFileHandle = fileHandle; // Store file handle if available

        // Check if file is HEIC/HEIF format
        const fileExtension = file.name.split('.').pop().toLowerCase();
        const isHEIC = fileExtension === 'heic' || fileExtension === 'heif';

        if (isHEIC) {
            const originalText = uploadPlaceholder.innerHTML;
            uploadPlaceholder.innerHTML = '<p>HEIC変換中...</p>';

            // Check if browser natively supports HEIC
            const nativeSupport = await checkNativeHEICSupport();

            if (nativeSupport) {
                // Browser supports HEIC natively, no conversion needed!
                console.log('Browser natively supports HEIC - skipping conversion');
                uploadPlaceholder.innerHTML = '<p>画像を読み込み中...</p>';

                try {
                    const compressedFile = await compressImage(file);
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const img = new Image();
                        img.onload = () => {
                            state.currentImage = img;
                            uploadPlaceholder.style.display = 'none';
                            uploadPlaceholder.innerHTML = originalText;
                            canvas.style.display = 'block';
                            saveLocalBtn.disabled = false;
                            savePCBtn.disabled = false;
                            previewBtn.disabled = false;
                            resetBtn.disabled = false;

                            // Initialize first stamp
                            state.stamps = [{
                                id: Date.now(),
                                text: state.presets.length > 0 ? state.presets[0] : "Sample",
                                x: 50,
                                y: 50,
                                fontSize: 100,
                                opacity: 1.0,
                                color: '#ffffff'
                            }];
                            state.activeStampIndex = 0;

                            updateUIFromState();
                            draw();
                        };
                        img.src = e.target.result;
                    };
                    reader.readAsDataURL(compressedFile);
                } catch (error) {
                    console.error('Native HEIC load error:', error);
                    uploadPlaceholder.innerHTML = originalText;
                }
                return;
            }

            // Browser doesn't support HEIC, load libheif-js on-demand
            const libheifLoadSuccess = await loadLibHeif();
            if (!libheifLoadSuccess) {
                alert('HEIC変換ライブラリの読み込みに失敗しました');
                uploadPlaceholder.innerHTML = originalText;
                return;
            }

            // Helper to get libheif instance
            const getLibHeif = async () => {
                if (typeof libheif === 'undefined') {
                    throw new Error('libheif library not loaded');
                }

                // If HeifDecoder is already available on libheif object
                if (libheif.HeifDecoder) {
                    return libheif;
                }

                // If libheif is a function (Emscripten module factory), call it
                if (typeof libheif === 'function') {
                    console.log('Initializing libheif WASM module...');
                    const instance = await libheif();
                    if (instance.HeifDecoder) {
                        return instance;
                    }
                }

                throw new Error('Could not find HeifDecoder in libheif');
            };

            try {
                const heifModule = await getLibHeif();
                const reader = new FileReader();

                reader.onload = async (e) => {
                    try {
                        const arrayBuffer = e.target.result;
                        const decoder = new heifModule.HeifDecoder();
                        const data = decoder.decode(arrayBuffer);

                        if (!data || data.length === 0) {
                            throw new Error('No image data found in HEIC file');
                        }

                        const image = data[0];
                        const width = image.get_width();
                        const height = image.get_height();

                        // Create a temporary canvas to render the image
                        const tempCanvas = document.createElement('canvas');
                        tempCanvas.width = width;
                        tempCanvas.height = height;
                        const ctx = tempCanvas.getContext('2d');
                        const imageData = ctx.createImageData(width, height);

                        await new Promise((resolve, reject) => {
                            image.display(imageData, (displayData) => {
                                if (!displayData) {
                                    reject(new Error('Failed to decode image data'));
                                } else {
                                    resolve(displayData);
                                }
                            });
                        });

                        ctx.putImageData(imageData, 0, 0);

                        // Convert canvas to blob for compression
                        tempCanvas.toBlob(async (blob) => {
                            if (!blob) {
                                throw new Error('Failed to create blob from canvas');
                            }

                            // Compress the converted HEIC image
                            const compressedBlob = await compressImage(blob);

                            // Load compressed image
                            const img = new Image();
                            const objectUrl = URL.createObjectURL(compressedBlob);
                            img.onload = () => {
                                state.currentImage = img;
                                uploadPlaceholder.style.display = 'none';
                                uploadPlaceholder.innerHTML = originalText; // Restore text
                                canvas.style.display = 'block';
                                saveLocalBtn.disabled = false;
                                savePCBtn.disabled = false;
                                previewBtn.disabled = false;
                                resetBtn.disabled = false;

                                // Initialize first stamp
                                state.stamps = [{
                                    id: Date.now(),
                                    text: state.presets.length > 0 ? state.presets[0] : "Sample",
                                    x: 50,
                                    y: 50,
                                    fontSize: 100,
                                    opacity: 1.0,
                                    color: '#ffffff'
                                }];
                                state.activeStampIndex = 0;

                                updateUIFromState();
                                draw();

                                // Memory cleanup: revoke object URL
                                URL.revokeObjectURL(objectUrl);
                            };
                            img.src = objectUrl;
                        }, 'image/jpeg');

                    } catch (error) {
                        console.error('HEIC conversion error:', error);
                        alert('HEICファイルの変換に失敗しました: ' + (error.message || error));
                        uploadPlaceholder.innerHTML = originalText;
                    }
                };
                reader.readAsArrayBuffer(file);

            } catch (error) {
                console.error('libheif initialization error:', error);
                alert('HEIC変換ライブラリの初期化に失敗しました: ' + (error.message || error));
                uploadPlaceholder.innerHTML = originalText;
            }

        } else {
            // Normal image processing with compression
            const originalText = uploadPlaceholder.innerHTML;
            uploadPlaceholder.innerHTML = '<p>画像を読み込み中...</p>';

            try {
                const compressedFile = await compressImage(file);
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = new Image();
                    img.onload = () => {
                        state.currentImage = img;
                        uploadPlaceholder.style.display = 'none';
                        uploadPlaceholder.innerHTML = originalText;
                        canvas.style.display = 'block';
                        saveLocalBtn.disabled = false;
                        savePCBtn.disabled = false;
                        previewBtn.disabled = false;
                        resetBtn.disabled = false;

                        // Initialize first stamp
                        state.stamps = [{
                            id: Date.now(),
                            text: state.presets.length > 0 ? state.presets[0] : "Sample",
                            x: 50,
                            y: 50,
                            fontSize: 100,
                            opacity: 1.0,
                            color: '#ffffff'
                        }];
                        state.activeStampIndex = 0;

                        updateUIFromState();
                        draw();

                        // Note: FileReader data URLs don't need revokeObjectURL
                    };
                    img.src = e.target.result;
                };
                reader.readAsDataURL(compressedFile);
            } catch (error) {
                console.error('Image load error:', error);
                alert('画像の読み込みに失敗しました');
                uploadPlaceholder.innerHTML = originalText;
            }
        }
    }

    function addNewStamp() {
        if (state.stamps.length >= MAX_STAMPS) return;

        state.stamps.push({
            id: Date.now(),
            text: state.presets.length > 0 ? state.presets[0] : "Sample",
            x: 50 + (state.stamps.length * 5), // Offset slightly
            y: 50 + (state.stamps.length * 5),
            fontSize: 100,
            opacity: 1.0,
            color: '#ffffff'
        });
        state.activeStampIndex = state.stamps.length - 1;
        updateUIFromState();
        draw();
    }

    function deleteActiveStamp() {
        if (state.stamps.length <= 1) return;

        state.stamps.splice(state.activeStampIndex, 1);
        state.activeStampIndex = Math.max(0, state.activeStampIndex - 1);
        updateUIFromState();
        draw();
    }

    function updateActiveStamp(props) {
        if (state.stamps.length === 0) return;
        const stamp = state.stamps[state.activeStampIndex];
        Object.assign(stamp, props);
        draw();
    }

    function updateUIFromState() {
        if (state.stamps.length === 0) return;
        const stamp = state.stamps[state.activeStampIndex];

        // Update controls values
        textInput.value = stamp.text;
        fontSizeInput.value = stamp.fontSize;
        opacityInput.value = stamp.opacity;
        colorInput.value = stamp.color;
        colorValue.textContent = stamp.color.toUpperCase();

        // Update buttons state
        addStampBtn.disabled = state.stamps.length >= MAX_STAMPS;
        deleteStampBtn.style.display = state.stamps.length > 1 ? 'inline-block' : 'none';

        // Update preset selection
        renderPresets();
    }

    function draw() {
        if (!state.currentImage) return;

        canvas.width = state.currentImage.width;
        canvas.height = state.currentImage.height;

        ctx.drawImage(state.currentImage, 0, 0);

        state.stamps.forEach((stamp, index) => {
            ctx.save();
            ctx.globalAlpha = stamp.opacity;
            ctx.fillStyle = stamp.color;
            ctx.font = `bold ${stamp.fontSize * (canvas.width / 1000)}px 'Inter', sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // Shadow for better visibility
            ctx.shadowColor = "rgba(0,0,0,0.5)";
            ctx.shadowBlur = 4;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;

            const x = (canvas.width * stamp.x) / 100;
            const y = (canvas.height * stamp.y) / 100;

            // Shadow for better visibility
            ctx.shadowColor = "rgba(0,0,0,0.5)";
            ctx.shadowBlur = 4;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;

            // Outline for better visibility
            ctx.lineWidth = stamp.fontSize * (canvas.width / 1000) * 0.05; // Relative stroke width
            ctx.strokeStyle = '#000000'; // Black outline
            ctx.strokeText(stamp.text, x, y);

            ctx.fillText(stamp.text, x, y);

            // Draw selection indicator for active stamp
            if (index === state.activeStampIndex) {
                const metrics = ctx.measureText(stamp.text);
                const height = stamp.fontSize * (canvas.width / 1000); // approx height
                const width = metrics.width;

                ctx.strokeStyle = '#4A90E2';
                ctx.lineWidth = 2;
                ctx.setLineDash([5, 5]);
                ctx.shadowColor = 'transparent'; // Remove shadow for box
                ctx.strokeRect(x - width / 2 - 10, y - height / 2 - 10, width + 20, height + 20);
            }

            ctx.restore();
        });
    }

    // --- Drag Logic ---
    function getCanvasCoordinates(e) {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        return {
            x: (clientX - rect.left) / rect.width * 100,
            y: (clientY - rect.top) / rect.height * 100
        };
    }

    function getStampAtPosition(pos) {
        // Simple hit testing based on distance to center
        // A better approach would use text metrics, but this is sufficient for now
        // Iterate in reverse to select top-most stamp
        for (let i = state.stamps.length - 1; i >= 0; i--) {
            const stamp = state.stamps[i];
            // Calculate approx bounds (very rough)
            const dx = Math.abs(stamp.x - pos.x);
            const dy = Math.abs(stamp.y - pos.y);

            // Threshold depends on font size roughly
            const threshold = (stamp.fontSize / 10) + 5;

            if (dx < threshold * 2 && dy < threshold) { // Text is wider than tall usually
                return i;
            }
        }
        return -1;
    }

    function startDrag(e) {
        if (!state.currentImage) return;

        const pos = getCanvasCoordinates(e);
        const hitIndex = getStampAtPosition(pos);

        if (hitIndex !== -1) {
            state.activeStampIndex = hitIndex;
            state.isDragging = true;
            updateUIFromState();
            draw();
        } else {
            // If clicked outside, maybe just deselect or do nothing?
            // For now, let's allow dragging the currently active stamp if clicked anywhere close?
            // Or just allow moving active stamp regardless of click pos if only 1 stamp?
            // Let's stick to strict hit testing or fallback to active if close enough
            state.isDragging = true;
            // Update position immediately to jump to finger? No, better to drag relative.
            // For this simple app, absolute jump is fine.
            state.stamps[state.activeStampIndex].x = pos.x;
            state.stamps[state.activeStampIndex].y = pos.y;
            draw();
        }
    }

    function drag(e) {
        if (!state.isDragging || !state.currentImage) return;
        e.preventDefault();
        const pos = getCanvasCoordinates(e);
        state.stamps[state.activeStampIndex].x = pos.x;
        state.stamps[state.activeStampIndex].y = pos.y;
        draw();
    }

    function handleTouchStart(e) {
        if (!state.currentImage) return;
        e.preventDefault();
        startDrag(e);
    }

    function handleTouchMove(e) {
        if (!state.currentImage) return;
        e.preventDefault();
        drag(e);
    }

    function endDrag() {
        state.isDragging = false;
    }

    // --- Save Logic ---
    function getStampedImageBlob() {
        // Redraw without selection box
        const tempActive = state.activeStampIndex;
        state.activeStampIndex = -1; // Deselect to hide box
        draw();

        return new Promise(resolve => {
            canvas.toBlob(blob => {
                state.activeStampIndex = tempActive; // Restore selection
                draw();
                resolve(blob);
            }, 'image/png');
        });
    }

    async function saveLocal() {
        if (!state.currentImage) return;

        try {
            const blob = await getStampedImageBlob();
            const fileName = `${state.originalFileName}_stamped.png`;
            const file = new File([blob], fileName, { type: 'image/png' });

            // Use Web Share API if supported (iOS/Android)
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: getTranslation('appTitle'),
                    text: getTranslation('appTitle')
                });
                resetEditor(); // Auto-reset after share
            } else {
                // Fallback to PC save if share not supported
                savePC();
            }
        } catch (error) {
            console.error('Save error:', error);
            if (error.name !== 'AbortError') {
                alert(getTranslation('errorSave'));
            }
        }
    }

    async function savePC() {
        if (!state.currentImage) return;

        try {
            const blob = await getStampedImageBlob();
            const fileName = `${state.originalFileName}_stamped.png`;

            // Check if File System Access API is supported
            if ('showSaveFilePicker' in window) {
                try {
                    // Show save file picker dialog
                    const fileHandle = await window.showSaveFilePicker({
                        suggestedName: fileName,
                        types: [{
                            description: 'PNG Image',
                            accept: { 'image/png': ['.png'] }
                        }]
                    });

                    // Write to the selected file
                    const writable = await fileHandle.createWritable();
                    await writable.write(blob);
                    await writable.close();

                    setTimeout(resetEditor, 1000);
                } catch (err) {
                    // User cancelled the save dialog
                    if (err.name !== 'AbortError') {
                        throw err;
                    }
                }
            } else {
                // Fallback to traditional download for unsupported browsers
                const link = document.createElement('a');
                link.download = fileName;
                link.href = URL.createObjectURL(blob);
                link.click();
                URL.revokeObjectURL(link.href);
                setTimeout(resetEditor, 1000);
            }
        } catch (error) {
            console.error('Save PC error:', error);
            alert(getTranslation('errorSave'));
        }
    }

    async function savePreview() {
        if (!state.currentImage) return;
        try {
            const blob = await getStampedImageBlob();
            const url = URL.createObjectURL(blob);
            previewImage.src = url;
            previewModal.style.display = 'flex';
        } catch (error) {
            console.error('Preview error:', error);
            alert(getTranslation('errorSave'));
        }
    }

    function resetEditor() {
        state.currentImage = null;
        state.originalFileHandle = null;
        imageInput.value = '';
        uploadPlaceholder.style.display = 'flex';
        canvas.style.display = 'none';
        saveLocalBtn.disabled = true;
        savePCBtn.disabled = true;
        previewBtn.disabled = true;
        resetBtn.disabled = true;
        state.stamps = [];
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Memory cleanup: reset canvas dimensions
        canvas.width = 0;
        canvas.height = 0;
    }

    init();
});

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('Service Worker registered'))
            .catch(err => console.log('Service Worker registration failed: ', err));
    });
}
