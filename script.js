document.addEventListener('DOMContentLoaded', () => {
    // --- Constants & Config ---
    const DEFAULT_PRESETS = [
        "上着", "ズボン", "肌着上", "肌着下", "靴下", "上靴", "下靴",
        "羽織り", "帽子類", "コート", "タオル", "杖", "SC", "車椅子",
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
            addStampHelp: "追加ボタンの後に文字を選択",
            selectStampHelp: "スタンプをタップして選択",
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
            errorSave: "保存中にエラーが発生しました。",
            correction: "画像補正",
            autoCorrection: "自動補正",
            cloudyCorrection: "固定補正(🌦️曇り▶🌤️晴れ)",
            backlightCorrection: "固定補正(逆光)☀️",
            sizeCorrection: "サイズ補正(1MB以下)",
            heicConversion: "HEIC/HEIF➔JPG変換",
            correctionApplied: "補正を適用しました",
            saveCorrected: "補正画像を保存"
        },
        en: {
            appTitle: "Photo Stamper",
            appSubtitle: "Add stamps to photos",
            start: "Start",
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
            modePreset: "Presets",
            modeCustom: "Custom",
            addStamp: "+ Add Stamp",
            delete: "Delete",
            addStampHelp: "Select text after adding",
            selectStampHelp: "Tap stamp to select",
            selectStamp: "Select Stamp",
            textInput: "Text Input",
            textInputPlaceholder: "Enter text...",
            fontSize: "Font Size",
            opacity: "Opacity",
            textColor: "Text Color",
            saveDevice: "Save to Device",
            savePC: "Save (PC)",
            previewOld: "Preview (Old iPad)",
            reset: "Reset",
            previewTitle: "Preview",
            previewInstruction: "Long press image to save",
            close: "Close",
            statusAdded: "Added",
            statusReset: "Reset complete",
            confirmDelete: "Delete this preset?",
            confirmReset: "Reset presets to default? Custom presets will be lost.",
            errorSave: "Error saving image.",
            correction: "Image Correction",
            autoCorrection: "Auto Correction",
            darkCorrection: "Fixed Correction (Dark)",
            sizeCorrection: "Size Correction (1MB)",
            correctionApplied: "Correction applied",
            saveCorrected: "Save Corrected Image"
        },
        hi: {
            appTitle: "फोटो स्टैम्प",
            appSubtitle: "फोटो पर स्टैम्प जोड़ें",
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
            saveDevice: "डिवाइस में सहेजें",
            savePC: "सहेजें (PC)",
            previewOld: "पूर्वावलोकन (पुराना iPad)",
            reset: "रीसेट",
            previewTitle: "पूर्वावलोकन",
            previewInstruction: "सहेजने के लिए छवि को देर तक दबाएं",
            close: "बंद करें",
            statusAdded: "जोड़ा गया",
            statusReset: "रीसेट पूरा हुआ",
            confirmDelete: "क्या आप इस प्रीसेट को हटाना चाहते हैं?",
            confirmReset: "क्या आप प्रीसेट को डिफ़ॉल्ट पर रीसेट करना चाहते हैं?",
            errorSave: "छवि सहेजने में त्रुटि।"
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
            errorSave: "Lỗi khi lưu ảnh."
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
            errorSave: "तस्बिर सुरक्षित गर्दा त्रुटि।"
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

        state.stamps.push({
            id: Date.now(),
            text: state.presets.length > 0 ? state.presets[0] : "Sample",
            x: 50 + (state.stamps.length * 5), // Offset slightly
            y: 50 + (state.stamps.length * 5),
            fontSize: 50,
            opacity: 0.8,
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
