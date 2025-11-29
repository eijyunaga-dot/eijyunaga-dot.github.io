// HEIC to PNG conversion feature
// Add to existing correction.js

document.addEventListener('DOMContentLoaded', () => {
    const heicToPngBtn = document.getElementById('heicToPngBtn');

    // State for HEIC conversion
    window.heicConversionState = {
        originalFile: null,
        originalFileExtension: ''
    };

    // Add event listener for HEIC conversion button
    if (heicToPngBtn) {
        heicToPngBtn.addEventListener('click', convertHeicToPng);
    }

    // Intercept file upload to save file and detect HEIC
    const originalHandleCorrectionFile = window.handleCorrectionFile;
    window.handleCorrectionFile = function (file) {
        // Save file for HEIC conversion
        window.heicConversionState.originalFile = file;

        // Get file extension
        const match = file.name.match(/\.([^.]+)$/);
        window.heicConversionState.originalFileExtension = match ? match[1].toLowerCase() : '';

        // Check if HEIC/HEIF (ボタンの有効/無効は切り替えない、常時有効)

        // Call original function
        if (originalHandleCorrectionFile) {
            originalHandleCorrectionFile(file);
        }
    };

    /**
     * HEICからPNGへ変換（プラットフォーム自動判定版）
     */
    async function convertHeicToPng() {
        const file = window.heicConversionState.originalFile;
        const ext = window.heicConversionState.originalFileExtension;

        if (!file) {
            alert('変換する画像がありません。');
            return;
        }

        if (ext !== 'heic' && ext !== 'heif') {
            alert(`このファイルは${ext.toUpperCase()}形式です。\nHEIC/HEIF形式のみ変換できます。`);
            return;
        }

        // Platform detection
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

        console.log('Platform:', { isIOS, isSafari });

        // Try iOS native first
        if (isIOS && isSafari) {
            try {
                await convertHeicToPng_iOS(file);
                return;
            } catch (error) {
                console.log('iOS native failed, using heic2any:', error.message);
            }
        }

        // Use heic2any library
        if (typeof heic2any !== 'undefined') {
            await convertHeicToPng_heic2any(file);
        } else {
            alert('HEIC変換ライブラリが読み込まれていません。\nページをリロードしてください。');
        }
    }

    /**
     * iOS Safari native conversion
     */
    async function convertHeicToPng_iOS(file) {
        const heicToPngBtn = document.getElementById('heicToPngBtn');
        const correctionCanvas = document.getElementById('correctionCanvas');
        const correctionCtx = correctionCanvas ? correctionCanvas.getContext('2d') : null;

        if (heicToPngBtn) {
            heicToPngBtn.disabled = true;
            heicToPngBtn.innerHTML = '⌛ iOS変換中...';
        }

        updateInfo('🍎 iOSネイティブHEIC読み込み中...');

        try {
            const dataUrl = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });

            const img = new Image();
            await new Promise((resolve, reject) => {
                const timeout = setTimeout(() => reject(new Error('Timeout')), 10000);
                img.onload = () => {
                    clearTimeout(timeout);
                    resolve();
                };
                img.onerror = () => {
                    clearTimeout(timeout);
                    reject(new Error('Failed'));
                };
                img.src = dataUrl;
            });

            correctionCanvas.width = img.width;
            correctionCanvas.height = img.height;
            correctionCtx.drawImage(img, 0, 0);

            enableSaveButtons();
            updateInfo(`✅ iOS: HEIC→PNG変換完了 (${img.width}x${img.height}px)`);

        } catch (error) {
            throw error;
        } finally {
            if (heicToPngBtn) {
                heicToPngBtn.disabled = false;
                heicToPngBtn.innerHTML = '🔄 <span>HEIF(HEIC)➔PNG変換</span>';
            }
        }
    }

    /**
     * heic2any library conversion
     */
    async function convertHeicToPng_heic2any(file) {
        const heicToPngBtn = document.getElementById('heicToPngBtn');
        const correctionCanvas = document.getElementById('correctionCanvas');
        const correctionCtx = correctionCanvas ? correctionCanvas.getContext('2d') : null;
        const originalSize = (file.size / 1024 / 1024).toFixed(2);

        const confirmed = confirm(
            `HEIC→PNG変換を実行します。\n\n` +
            `元のファイル: ${file.name}\n` +
            `サイズ: ${originalSize}MB\n\n` +
            `続行しますか？`
        );

        if (!confirmed) return;

        if (heicToPngBtn) {
            heicToPngBtn.disabled = true;
            heicToPngBtn.innerHTML = '⌛ 変換中...';
        }

        updateInfo('🔄 HEIC→PNG変換中...');

        const startTime = Date.now();

        try {
            const convertedBlob = await heic2any({
                blob: file,
                toType: 'image/png',
                quality: 1.0
            });

            const pngBlob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
            const convertedSize = (pngBlob.size / 1024 / 1024).toFixed(2);

            updateInfo('🎨 変換後の画像を読み込み中...');

            const img = new Image();
            await new Promise((resolve, reject) => {
                const timeout = setTimeout(() => reject(new Error('Timeout')), 30000);
                img.onload = () => {
                    clearTimeout(timeout);
                    resolve();
                };
                img.onerror = () => {
                    clearTimeout(timeout);
                    reject(new Error('Failed to load'));
                };
                img.src = URL.createObjectURL(pngBlob);
            });

            correctionCanvas.width = img.width;
            correctionCanvas.height = img.height;
            correctionCtx.drawImage(img, 0, 0);

            URL.revokeObjectURL(img.src);

            enableSaveButtons();

            const duration = ((Date.now() - startTime) / 1000).toFixed(1);
            updateInfo(
                `✅ HEIC→PNG変換完了！ (${duration}秒) | ` +
                `元: ${originalSize}MB → 変換後: ${convertedSize}MB | ` +
                `解像度: ${img.width}x${img.height}px`
            );

            alert(
                `✅ HEIC→PNG変換が完了しました！\n\n` +
                `処理時間: ${duration}秒\n` +
                `元のサイズ: ${originalSize}MB\n` +
                `変換後: ${convertedSize}MB\n` +
                `解像度: ${img.width}x${img.height}px\n\n` +
                `「保存」ボタンで保存できます。`
            );

        } catch (error) {
            console.error('HEIC変換エラー:', error);

            let errorType = '不明なエラー';
            let suggestion = '';

            if (error.message.includes('heic2any')) {
                errorType = 'ライブラリエラー';
                suggestion = 'ページをリロードしてください。';
            } else if (error.message.includes('Timeout')) {
                errorType = 'タイムアウト';
                suggestion = '画像サイズが大きすぎます。';
            } else {
                errorType = error.name || 'エラー';
                suggestion = 'ファイルが破損している可能性があります。';
            }

            updateInfo(`❌ ${errorType}: ${error.message}`);
            alert(
                `❌ HEIC→PNG変換に失敗しました\n\n` +
                `エラー種類: ${errorType}\n` +
                `詳細: ${error.message}\n\n` +
                `対処方法: ${suggestion}`
            );

        } finally {
            if (heicToPngBtn) {
                heicToPngBtn.disabled = false;
                heicToPngBtn.innerHTML = '🔄 <span>HEIF(HEIC)➔PNG変換</span>';
            }
        }
    }

    function updateInfo(message) {
        const correctionInfo = document.getElementById('correctionInfo');
        if (correctionInfo) {
            correctionInfo.innerHTML = `<p class="help-text">${message}</p>`;
        }
    }

    function enableSaveButtons() {
        const buttons = [
            'saveCorrectedLocalBtn',
            'saveCorrectedPCBtn',
            'saveCorrectedPreviewBtn'
        ];
        buttons.forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.disabled = false;
        });
    }
});
