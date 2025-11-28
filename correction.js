// --- Image Correction Feature ---

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    const correctionBtn = document.getElementById('correctionBtn');
    const correctionScreen = document.getElementById('correctionScreen');
    const correctionUploadPlaceholder = document.getElementById('correctionUploadPlaceholder');
    const correctionImageInput = document.getElementById('correctionImageInput');
    const correctionCanvas = document.getElementById('correctionCanvas');
    const correctionCtx = correctionCanvas ? correctionCanvas.getContext('2d') : null;
    const correctionInfo = document.getElementById('correctionInfo');
    const autoCorrectionBtn = document.getElementById('autoCorrectionBtn');
    const darkCorrectionBtn = document.getElementById('darkCorrectionBtn');
    const sizeCorrectionBtn = document.getElementById('sizeCorrectionBtn');
    const saveCorrectedLocalBtn = document.getElementById('saveCorrectedLocalBtn');
    const saveCorrectedPCBtn = document.getElementById('saveCorrectedPCBtn');
    const saveCorrectedPreviewBtn = document.getElementById('saveCorrectedPreviewBtn');
    const resetCorrectionBtn = document.getElementById('resetCorrectionBtn');

    let correctionState = {
        originalImage: null,
        correctedImage: null,
        originalFileName: ''
    };

    function initCorrection() {
        if (!correctionBtn) return;

        correctionBtn.addEventListener('click', () => {
            // Direct DOM manipulation for screen navigation
            document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
            if (correctionScreen) {
                correctionScreen.classList.add('active');
            }
        });

        if (correctionUploadPlaceholder) {
            correctionUploadPlaceholder.addEventListener('click', () => correctionImageInput.click());
        }
        if (correctionImageInput) {
            correctionImageInput.addEventListener('change', handleCorrectionImageUpload);
        }

        if (correctionUploadPlaceholder) {
            correctionUploadPlaceholder.addEventListener('dragover', (e) => {
                e.preventDefault();
                correctionUploadPlaceholder.style.backgroundColor = 'rgba(255,255,255,0.1)';
            });
            correctionUploadPlaceholder.addEventListener('dragleave', () => {
                correctionUploadPlaceholder.style.backgroundColor = '';
            });
            correctionUploadPlaceholder.addEventListener('drop', (e) => {
                e.preventDefault();
                correctionUploadPlaceholder.style.backgroundColor = '';
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleCorrectionFile(e.dataTransfer.files[0]);
                }
            });
        }

        if (autoCorrectionBtn) autoCorrectionBtn.addEventListener('click', applyAutoCorrection);
        if (darkCorrectionBtn) darkCorrectionBtn.addEventListener('click', applyDarkCorrection);
        if (sizeCorrectionBtn) sizeCorrectionBtn.addEventListener('click', applySizeCorrection);
        if (saveCorrectedLocalBtn) saveCorrectedLocalBtn.addEventListener('click', saveCorrectedLocal);
        if (saveCorrectedPCBtn) saveCorrectedPCBtn.addEventListener('click', saveCorrectedPC);
        if (saveCorrectedPreviewBtn) saveCorrectedPreviewBtn.addEventListener('click', saveCorrectedPreview);
        if (resetCorrectionBtn) resetCorrectionBtn.addEventListener('click', resetCorrectionScreen);
    }

    function handleCorrectionImageUpload(e) {
        if (e.target.files && e.target.files[0]) {
            handleCorrectionFile(e.target.files[0]);
        }
    }

    function handleCorrectionFile(file) {
        correctionState.originalFileName = file.name.replace(/\.[^/.]+$/, "");
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                correctionState.originalImage = img;
                correctionState.correctedImage = img;
                drawCorrectionImage(img);
                correctionUploadPlaceholder.style.display = 'none';
                correctionCanvas.style.display = 'block';
                autoCorrectionBtn.disabled = false;
                darkCorrectionBtn.disabled = false;
                sizeCorrectionBtn.disabled = false;
                resetCorrectionBtn.disabled = false;
                updateCorrectionInfo('Original image loaded');
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    function drawCorrectionImage(img) {
        if (!correctionCtx) return;
        correctionCanvas.width = img.width;
        correctionCanvas.height = img.height;
        correctionCtx.drawImage(img, 0, 0);
    }

    function updateCorrectionInfo(message) {
        if (correctionInfo) {
            correctionInfo.innerHTML = `<p class="help-text">${message}</p>`;
        }
    }

    async function applyAutoCorrection() {
        if (!correctionState.originalImage || !correctionCtx) return;
        updateCorrectionInfo('Applying auto correction...');

        drawCorrectionImage(correctionState.originalImage);
        const imageData = correctionCtx.getImageData(0, 0, correctionCanvas.width, correctionCanvas.height);
        const data = imageData.data;

        let rMin = 255, rMax = 0, gMin = 255, gMax = 0, bMin = 255, bMax = 0;

        for (let i = 0; i < data.length; i += 4) {
            rMin = Math.min(rMin, data[i]);
            rMax = Math.max(rMax, data[i]);
            gMin = Math.min(gMin, data[i + 1]);
            gMax = Math.max(gMax, data[i + 1]);
            bMin = Math.min(bMin, data[i + 2]);
            bMax = Math.max(bMax, data[i + 2]);
        }

        for (let i = 0; i < data.length; i += 4) {
            if (rMax > rMin) data[i] = ((data[i] - rMin) / (rMax - rMin)) * 255;
            if (gMax > gMin) data[i + 1] = ((data[i + 1] - gMin) / (gMax - gMin)) * 255;
            if (bMax > bMin) data[i + 2] = ((data[i + 2] - bMin) / (bMax - bMin)) * 255;
        }

        correctionCtx.putImageData(imageData, 0, 0);
        saveCorrectedLocalBtn.disabled = false;
        saveCorrectedPCBtn.disabled = false;
        saveCorrectedPreviewBtn.disabled = false;
        updateCorrectionInfo('補正を適用しました');
    }

    async function applyDarkCorrection() {
        if (!correctionState.originalImage || !correctionCtx) return;
        updateCorrectionInfo('Applying fixed correction...');

        drawCorrectionImage(correctionState.originalImage);
        const imageData = correctionCtx.getImageData(0, 0, correctionCanvas.width, correctionCanvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            let r = data[i], g = data[i + 1], b = data[i + 2];

            const brightnessFactor = 1.53;
            r *= brightnessFactor;
            g *= brightnessFactor;
            b *= brightnessFactor;

            const shadowThreshold = 80;
            if (r < shadowThreshold) r = r + (shadowThreshold - r) * 0.7;
            if (g < shadowThreshold) g = g + (shadowThreshold - g) * 0.7;
            if (b < shadowThreshold) b = b + (shadowThreshold - b) * 0.7;

            const highlightThreshold = 175;
            if (r > highlightThreshold) r = r - (r - highlightThreshold) * 0.15;
            if (g > highlightThreshold) g = g - (g - highlightThreshold) * 0.15;
            if (b > highlightThreshold) b = b - (b - highlightThreshold) * 0.15;

            r = Math.max(18, r);
            g = Math.max(18, g);
            b = Math.max(18, b);

            const contrastFactor = 0.8, mid = 128;
            r = mid + (r - mid) * contrastFactor;
            g = mid + (g - mid) * contrastFactor;
            b = mid + (b - mid) * contrastFactor;

            const gray = (r + g + b) / 3, saturationFactor = 1.54;
            r = gray + (r - gray) * saturationFactor;
            g = gray + (g - gray) * saturationFactor;
            b = gray + (b - gray) * saturationFactor;

            r *= 0.92;
            b *= 1.08;

            data[i] = Math.min(255, Math.max(0, r));
            data[i + 1] = Math.min(255, Math.max(0, g));
            data[i + 2] = Math.min(255, Math.max(0, b));
        }

        correctionCtx.putImageData(imageData, 0, 0);
        saveCorrectedLocalBtn.disabled = false;
        saveCorrectedPCBtn.disabled = false;
        saveCorrectedPreviewBtn.disabled = false;
        updateCorrectionInfo('補正を適用しました');
    }

    async function applySizeCorrection() {
        if (!correctionState.originalImage) return;
        updateCorrectionInfo('Resizing to 1MB...');

        let quality = 0.9, blob = await canvasToBlob(correctionCanvas, quality);

        while (blob.size > 1024 * 1024 && quality > 0.1) {
            quality -= 0.05;
            blob = await canvasToBlob(correctionCanvas, quality);
        }

        if (blob.size > 1024 * 1024) {
            const scaleFactor = Math.sqrt((1024 * 1024) / blob.size);
            const newWidth = Math.floor(correctionCanvas.width * scaleFactor);
            const newHeight = Math.floor(correctionCanvas.height * scaleFactor);

            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = newWidth;
            tempCanvas.height = newHeight;
            tempCanvas.getContext('2d').drawImage(correctionCanvas, 0, 0, newWidth, newHeight);

            correctionCanvas.width = newWidth;
            correctionCanvas.height = newHeight;
            correctionCtx.drawImage(tempCanvas, 0, 0);

            blob = await canvasToBlob(correctionCanvas, 0.9);
        }

        const sizeMB = (blob.size / (1024 * 1024)).toFixed(2);
        saveCorrectedLocalBtn.disabled = false;
        saveCorrectedPCBtn.disabled = false;
        saveCorrectedPreviewBtn.disabled = false;
        updateCorrectionInfo(`Resized to ${sizeMB}MB`);
    }

    function canvasToBlob(canvas, quality) {
        return new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', quality));
    }

    async function saveCorrectedLocal() {
        if (!correctionCanvas) return;

        try {
            const blob = await canvasToBlob(correctionCanvas, 0.95);
            const fileName = `${correctionState.originalFileName}_corrected.jpg`;
            const file = new File([blob], fileName, { type: 'image/jpeg' });

            // Use Web Share API if supported (iOS/Android)
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: '画像補正',
                    text: '補正済み画像'
                });
                setTimeout(resetCorrectionScreen, 1000);
            } else {
                // Fallback to PC save if share not supported
                saveCorrectedPC();
            }
        } catch (error) {
            console.error('Save error:', error);
            if (error.name !== 'AbortError') {
                alert('保存中にエラーが発生しました');
            }
        }
    }

    async function saveCorrectedPC() {
        if (!correctionCanvas) return;

        try {
            const blob = await canvasToBlob(correctionCanvas, 0.95);
            const fileName = `${correctionState.originalFileName}_corrected.jpg`;

            if ('showSaveFilePicker' in window) {
                try {
                    const fileHandle = await window.showSaveFilePicker({
                        suggestedName: fileName,
                        types: [{ description: 'JPEG Image', accept: { 'image/jpeg': ['.jpg', '.jpeg'] } }]
                    });

                    const writable = await fileHandle.createWritable();
                    await writable.write(blob);
                    await writable.close();
                    updateCorrectionInfo('Saved!');
                    setTimeout(resetCorrectionScreen, 1000);
                } catch (err) {
                    if (err.name !== 'AbortError') throw err;
                }
            } else {
                const link = document.createElement('a');
                link.download = fileName;
                link.href = URL.createObjectURL(blob);
                link.click();
                URL.revokeObjectURL(link.href);
                updateCorrectionInfo('Saved!');
                setTimeout(resetCorrectionScreen, 1000);
            }
        } catch (error) {
            console.error('Save PC error:', error);
            alert('保存中にエラーが発生しました');
        }
    }

    async function saveCorrectedPreview() {
        if (!correctionCanvas) return;
        try {
            const blob = await canvasToBlob(correctionCanvas, 0.95);
            const url = URL.createObjectURL(blob);
            const previewImage = document.getElementById('previewImage');
            const previewModal = document.getElementById('previewModal');
            previewImage.src = url;
            previewModal.style.display = 'flex';
        } catch (error) {
            console.error('Preview error:', error);
            alert('プレビュー表示中にエラーが発生しました');
        }
    }

    function resetCorrectionScreen() {
        correctionState.originalImage = null;
        correctionState.correctedImage = null;
        correctionImageInput.value = '';
        correctionUploadPlaceholder.style.display = 'flex';
        correctionCanvas.style.display = 'none';
        autoCorrectionBtn.disabled = true;
        darkCorrectionBtn.disabled = true;
        sizeCorrectionBtn.disabled = true;
        saveCorrectedLocalBtn.disabled = true;
        saveCorrectedPCBtn.disabled = true;
        saveCorrectedPreviewBtn.disabled = true;
        resetCorrectionBtn.disabled = true;
        if (correctionCtx) {
            correctionCtx.clearRect(0, 0, correctionCanvas.width, correctionCanvas.height);
        }
        updateCorrectionInfo('画像を選択してください');
    }

    initCorrection();
});
