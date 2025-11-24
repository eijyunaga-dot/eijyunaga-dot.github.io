document.addEventListener('DOMContentLoaded', () => {
    // --- Constants & Config ---
    const DEFAULT_PRESETS = [
        "上着", "ズボン", "肌着上", "肌着下", "靴下", "上靴", "下靴",
        "羽織り", "帽子類", "コート", "タオル", "杖", "シルバーカー", "車椅子"
    ];
    const MAX_STAMPS = 8;

    // --- Elements ---
    // Screens
    const screens = {
        home: document.getElementById('homeScreen'),
        settings: document.getElementById('settingsScreen'),
        editor: document.getElementById('editorScreen')
    };

    // Navigation
    const startBtn = document.getElementById('startBtn');
    const settingsBtn = document.getElementById('settingsBtn');
    const backBtns = document.querySelectorAll('.back-btn');

    // Settings
    const newPresetInput = document.getElementById('newPresetInput');
    const addPresetBtn = document.getElementById('addPresetBtn');
    const settingsPresetList = document.getElementById('settingsPresetList');
    const resetPresetsBtn = document.getElementById('resetPresetsBtn');
    const settingsStatus = document.getElementById('settingsStatus');

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
    const resetBtn = document.getElementById('resetBtn');

    // --- State ---
    let state = {
        currentImage: null,
        originalFileName: '',
        stamps: [], // Array of { id, text, x, y, fontSize, opacity, color }
        activeStampIndex: 0,
        isDragging: false,
        inputMode: 'preset', // 'preset' or 'custom'
        presets: JSON.parse(localStorage.getItem('photoStamperPresets')) || [...DEFAULT_PRESETS]
    };

    // --- Initialization ---
    function init() {
        initNavigation();
        initPresetSettings();
        initEditor();
        renderPresets(); // Render editor presets
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
            delBtn.textContent = '削除';
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
            showStatus('追加しました');
        }
    }

    function deletePreset(index) {
        if (confirm('この定型文を削除しますか？')) {
            state.presets.splice(index, 1);
            savePresets();
            renderSettingsPresets();
        }
    }

    function resetPresets() {
        if (confirm('定型文を初期状態に戻しますか？追加した内容は消去されます。')) {
            state.presets = [...DEFAULT_PRESETS];
            savePresets();
            renderSettingsPresets();
            showStatus('初期化しました');
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
        resetBtn.addEventListener('click', resetEditor);
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

    function handleFile(file) {
        state.originalFileName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                state.currentImage = img;
                uploadPlaceholder.style.display = 'none';
                canvas.style.display = 'block';
                saveLocalBtn.disabled = false;
                resetBtn.disabled = false;

                // Initialize first stamp
                state.stamps = [{
                    id: Date.now(),
                    text: state.presets.length > 0 ? state.presets[0] : "Sample",
                    x: 50,
                    y: 50,
                    fontSize: 50,
                    opacity: 0.8,
                    color: '#ffffff'
                }];
                state.activeStampIndex = 0;

                updateUIFromState();
                draw();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    function addNewStamp() {
        if (state.stamps.length >= MAX_STAMPS) return;

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
                    title: 'Photo Stamper',
                    text: 'スタンプ画像を保存'
                });
                resetEditor(); // Auto-reset after share
            } else {
                // Fallback for Desktop
                const link = document.createElement('a');
                link.download = fileName;
                link.href = URL.createObjectURL(blob);
                link.click();
                URL.revokeObjectURL(link.href);
                setTimeout(resetEditor, 1000); // Auto-reset after download (delay to ensure download starts)
            }
        } catch (error) {
            console.error('Save error:', error);
            if (error.name !== 'AbortError') {
                alert('保存中にエラーが発生しました。');
            }
        }
    }

    function resetEditor() {
        state.currentImage = null;
        imageInput.value = '';
        uploadPlaceholder.style.display = 'flex';
        canvas.style.display = 'none';
        saveLocalBtn.disabled = true;
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
