/** Greeting Text to Speech */
    const nameInput = document.getElementById('name');
    const greet = document.getElementById('greeting');
    const btnSpeak = document.getElementById('greet');
    const ttsStatus = document.getElementById('ttsStatus');
    function currentGreeting() {
        const name = (nameInput.value || '').trim();
        return name ? `Nice to see you, ${name}!` : 'Nice to see you';
    }
    function updateGreeting() {
        greet.textContent = currentGreeting();
    }
    nameInput.addEventListener('input', updateGreeting);
    updateGreeting();
    btnSpeak.addEventListener('click', () => {
    const utter = new SpeechSynthesisUtterance(currentGreeting());
    utter.rate = 1.0;
    ttsStatus.textContent = 'Speaking...';
    utter.onend = () => ttsStatus.textContent = 'Done.';
    speechSynthesis.speak(utter);
    });

/** Copy and Paste*/
    const btnCopy = document.getElementById('btnCopy');
    const btnPaste = document.getElementById('btnPaste');
    const clipStatus = document.getElementById('clipStatus');
    const scratch = document.getElementById('scratch');
    async function copyGreeting() {
      try {
        if (!navigator.clipboard?.writeText) throw new Error('Clipboard API not available');
        await navigator.clipboard.writeText(currentGreeting());
        clipStatus.textContent = 'Copied greeting to clipboard';
        clipStatus.className = 'muted ok';
      } catch (err) {
        clipStatus.textContent = 'Copy failed. Try using Ctrl/Cmd+C.';
        clipStatus.className = 'muted warn';
      }
    }
    async function pasteIntoName() {
      try {
        if (!navigator.clipboard?.readText) throw new Error('Clipboard read not available');
        const text = await navigator.clipboard.readText();
        nameInput.value = text;
        updateGreeting();
        clipStatus.textContent = 'Pasted into name field';
        clipStatus.className = 'muted ok';
      } catch (err) {
        clipStatus.textContent = 'Paste failed. Try Ctrl/Cmd+V.';
        clipStatus.className = 'muted warn';
      }
    }
    btnCopy.addEventListener('click', copyGreeting);
    btnPaste.addEventListener('click', pasteIntoName);

    scratch.addEventListener('paste', () => {
        clipStatus.textContent = 'Pasted into scratchpad';
        clipStatus.className = 'muted ok';
    });

    /**Battery percentage */
    const batPct = document.getElementById('batPct');
    const batCharge = document.getElementById('batCharge');
    const batStatus = document.getElementById('batStatus');

    function fmtPct(level) {
      return Math.round(level * 100);
    }

    async function initBattery() {
      if (!('getBattery' in navigator)) {
        batStatus.textContent = 'Battery API not supported here.';
        batStatus.className = 'muted warn';
        batPct.textContent = '—%';
        batCharge.textContent = '—';
        return;
      }
      try {
        const battery = await navigator.getBattery();
        function render() {
          batPct.textContent = fmtPct(battery.level) + '%';
          batCharge.textContent = battery.charging ? 'Yes' : 'No';
        }
        render();
        battery.addEventListener('levelchange', render);
        battery.addEventListener('chargingchange', render);
        batStatus.textContent = 'Live battery info active.';
        batStatus.className = 'muted ok';
      } catch (e) {
        batStatus.textContent = 'Cannot read battery (permissions or policy).';
        batStatus.className = 'muted warn';
      }
    }
    initBattery();