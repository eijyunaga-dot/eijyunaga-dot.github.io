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
    const cloudyCorrectionBtn = document.getElementById('cloudyCorrectionBtn');
    const backlightCorrectionBtn = document.getElementById('backlightCorrectionBtn');
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
        if (cloudyCorrectionBtn) cloudyCorrectionBtn.addEventListener('click', applyCloudyCorrection);
        if (backlightCorrectionBtn) backlightCorrectionBtn.addEventListener('click', applyBacklightCorrection);
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

    // Helper to compress image
    function compressImage(fileOrBlob) {
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

    function handleCorrectionFile(file) {
        correctionState.originalFileName = file.name.replace(/\.[^/.]+$/, "");

        // Check if file is HEIC/HEIF format
        const fileExtension = file.name.split('.').pop().toLowerCase();
        const isHEIC = fileExtension === 'heic' || fileExtension === 'heif';

        if (isHEIC) {
            updateCorrectionInfo('Initializing HEIC converter...');

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

            getLibHeif().then(heifModule => {
                updateCorrectionInfo('Converting HEIC/HEIF to JPEG...');
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
                            updateCorrectionInfo('Compressing image...');
                            const compressedBlob = await compressImage(blob);

                            // Load compressed image
                            const img = new Image();
                            img.onload = () => {
                                correctionState.originalImage = img;
                                correctionState.correctedImage = img;
                                drawCorrectionImage(img);
                                correctionUploadPlaceholder.style.display = 'none';
                                correctionCanvas.style.display = 'block';
                                autoCorrectionBtn.disabled = false;
                                cloudyCorrectionBtn.disabled = false;
                                backlightCorrectionBtn.disabled = false;
                                sizeCorrectionBtn.disabled = false;
                                resetCorrectionBtn.disabled = false;
                                updateCorrectionInfo('HEIC/HEIF image converted and loaded');
                            };
                            img.src = URL.createObjectURL(compressedBlob);
                        }, 'image/jpeg');

                    } catch (error) {
                        console.error('HEIC conversion error:', error);
                        updateCorrectionInfo('Error converting HEIC/HEIF file: ' + (error.message || error));
                    }
                };
                reader.readAsArrayBuffer(file);
            }).catch(error => {
                console.error('libheif initialization error:', error);
                updateCorrectionInfo('Error initializing converter: ' + (error.message || error));
            });

        } else {
            // Normal image processing with compression
            updateCorrectionInfo('Loading and compressing image...');
            compressImage(file).then(compressedFile => {
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
                        cloudyCorrectionBtn.disabled = false;
                        backlightCorrectionBtn.disabled = false;
                        sizeCorrectionBtn.disabled = false;
                        resetCorrectionBtn.disabled = false;
                        updateCorrectionInfo('Original image loaded');
                    };
                    img.onerror = () => {
                        updateCorrectionInfo('Error loading image. Please try a different file.');
                    };
                    img.src = e.target.result;
                };
                reader.readAsDataURL(compressedFile);
            }).catch(error => {
                console.error('Compression error:', error);
                updateCorrectionInfo('Error loading image: ' + error.message);
            });
        }
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

    async function applyCloudyCorrection() {
        if (!correctionState.originalImage || !correctionCtx) return;
        updateCorrectionInfo('曇り→晴天補正を適用中...');

        drawCorrectionImage(correctionState.originalImage);
        const imageData = correctionCtx.getImageData(0, 0, correctionCanvas.width, correctionCanvas.height);
        const data = imageData.data;

        // 曇り空を晴天に見せる補正：明るさ向上、彩度強化、コントラスト強化
        for (let i = 0; i < data.length; i += 4) {
            let r = data[i], g = data[i + 1], b = data[i + 2];

            // 明るさ向上（+25%）
            const brightnessFactor = 1.25;
            r *= brightnessFactor;
            g *= brightnessFactor;
            b *= brightnessFactor;

            // コントラスト強化（中間値128を基準に±20%）
            const contrastFactor = 1.2, mid = 128;
            r = mid + (r - mid) * contrastFactor;
            g = mid + (g - mid) * contrastFactor;
            b = mid + (b - mid) * contrastFactor;

            // 彩度強化（+40%）
            const gray = (r + g + b) / 3;
            const saturationFactor = 1.4;
            r = gray + (r - gray) * saturationFactor;
            g = gray + (g - gray) * saturationFactor;
            b = gray + (b - gray) * saturationFactor;

            // 青みを少し減らし、温かみを追加（晴天感演出）
            r *= 1.05;
            b *= 0.95;

            data[i] = Math.min(255, Math.max(0, r));
            data[i + 1] = Math.min(255, Math.max(0, g));
            data[i + 2] = Math.min(255, Math.max(0, b));
        }

        correctionCtx.putImageData(imageData, 0, 0);
        saveCorrectedLocalBtn.disabled = false;
        saveCorrectedPCBtn.disabled = false;
        saveCorrectedPreviewBtn.disabled = false;
        updateCorrectionInfo('曇り→晴天補正を適用しました');
    }

    async function applyBacklightCorrection() {
        if (!correctionState.originalImage || !correctionCtx) return;
        updateCorrectionInfo('逆光補正を適用中...');

        drawCorrectionImage(correctionState.originalImage);
        const imageData = correctionCtx.getImageData(0, 0, correctionCanvas.width, correctionCanvas.height);
        const data = imageData.data;

        // 逆光補正：露出+8、ハイライト-15、シャドウ+50、コントラスト-20、明るさ+30、彩度+5、鮮やかさ+50、ブラックポイント+10
        for (let i = 0; i < data.length; i += 4) {
            let r = data[i], g = data[i + 1], b = data[i + 2];

            // 露出+8 (約+3%の明るさ)
            const exposureFactor = 1.03;
            r *= exposureFactor;
            g *= exposureFactor;
            b *= exposureFactor;

            // 明るさ+30 (約+12%)
            const brightnessFactor = 1.12;
            r *= brightnessFactor;
            g *= brightnessFactor;
            b *= brightnessFactor;

            // シャドウ+50 (暗い部分を持ち上げる)
            const shadowThreshold = 100;
            if (r < shadowThreshold) r = r + (shadowThreshold - r) * 0.5;
            if (g < shadowThreshold) g = g + (shadowThreshold - g) * 0.5;
            if (b < shadowThreshold) b = b + (shadowThreshold - b) * 0.5;

            // ハイライト-15 (明るい部分を抑える、白飛び防止)
            const highlightThreshold = 200;
            if (r > highlightThreshold) r = r - (r - highlightThreshold) * 0.15;
            if (g > highlightThreshold) g = g - (g - highlightThreshold) * 0.15;
            if (b > highlightThreshold) b = b - (b - highlightThreshold) * 0.15;

            // ブラックポイント+10 (最暗部を持ち上げる)
            r = Math.max(10, r);
            g = Math.max(10, g);
            b = Math.max(10, b);

            // コントラスト-20 (約80%に減少)
            const contrastFactor = 0.8, mid = 128;
            r = mid + (r - mid) * contrastFactor;
            g = mid + (g - mid) * contrastFactor;
            b = mid + (b - mid) * contrastFactor;

            // 彩度+5、鮮やかさ+50 (合計約+55%の彩度向上)
            const gray = (r + g + b) / 3;
            const saturationFactor = 1.55;
            r = gray + (r - gray) * saturationFactor;
            g = gray + (g - gray) * saturationFactor;
            b = gray + (b - gray) * saturationFactor;

            // 白飛び防止の最終チェック（255に近づけすぎない）
            data[i] = Math.min(250, Math.max(0, r));
            data[i + 1] = Math.min(250, Math.max(0, g));
            data[i + 2] = Math.min(250, Math.max(0, b));
        }

        correctionCtx.putImageData(imageData, 0, 0);
        saveCorrectedLocalBtn.disabled = false;
        saveCorrectedPCBtn.disabled = false;
        saveCorrectedPreviewBtn.disabled = false;
        updateCorrectionInfo('逆光補正を適用しました（白飛び防止済み）');
    }

    async function applySizeCorrection() {
        if (!correctionState.originalImage) return;
        updateCorrectionInfo('1MB以下にリサイズ中...');

        const targetSize = 1024 * 1024; // 1MB = 1024KB = 1048576 bytes
        let quality = 0.95;
        let blob = await canvasToBlob(correctionCanvas, quality);
        let iterationCount = 0;
        const maxIterations = 50;

        // 品質を下げて1MB以下を目指す
        while (blob.size > targetSize && quality > 0.05 && iterationCount < maxIterations) {
            quality -= 0.05;
            blob = await canvasToBlob(correctionCanvas, quality);
            iterationCount++;
        }

        // まだ1MBを超えている場合は画像サイズを縮小
        if (blob.size > targetSize) {
            let scaleFactor = Math.sqrt(targetSize / blob.size) * 0.95; // 安全マージンで95%
            let attempts = 0;
            const maxAttempts = 10;

            while (blob.size > targetSize && attempts < maxAttempts) {
                const newWidth = Math.floor(correctionCanvas.width * scaleFactor);
                const newHeight = Math.floor(correctionCanvas.height * scaleFactor);

                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = newWidth;
                tempCanvas.height = newHeight;
                tempCanvas.getContext('2d').drawImage(correctionCanvas, 0, 0, newWidth, newHeight);

                correctionCanvas.width = newWidth;
                correctionCanvas.height = newHeight;
                correctionCtx.drawImage(tempCanvas, 0, 0);

                // リサイズ後に再度圧縮
                quality = 0.9;
                blob = await canvasToBlob(correctionCanvas, quality);

                while (blob.size > targetSize && quality > 0.05) {
                    quality -= 0.05;
                    blob = await canvasToBlob(correctionCanvas, quality);
                }

                scaleFactor *= 0.95; // さらに縮小率を上げる
                attempts++;
            }
        }

        const sizeKB = (blob.size / 1024).toFixed(2);
        const guarantee = blob.size <= targetSize ? '✅' : '⚠️';
        saveCorrectedLocalBtn.disabled = false;
        saveCorrectedPCBtn.disabled = false;
        saveCorrectedPreviewBtn.disabled = false;
        updateCorrectionInfo(`${guarantee} リサイズ完了: ${sizeKB}KB (${correctionCanvas.width}x${correctionCanvas.height}px)`);

        if (blob.size > targetSize) {
            alert('警告: 1MB以下にできませんでした。画像が複雑すぎる可能性があります。');
        }
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
        cloudyCorrectionBtn.disabled = true;
        backlightCorrectionBtn.disabled = true;
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
