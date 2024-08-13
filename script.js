let balance = parseInt(localStorage.getItem('balance')) || 0;
let energy = parseInt(localStorage.getItem('energy')) || 10000;
let clicks = 0;
let clickMultiplier = 1;
let clickStartTime = null;

document.addEventListener('DOMContentLoaded', initApp);

function initApp() {
    updateUI();
    energyRecovery();

    const savedName = localStorage.getItem('userName');
    if (savedName) {
        setUserName(savedName);
    }
}

function updateUI() {
    document.getElementById('balanceAmount').innerText = formatBalance(balance);
    document.getElementById('energyBar').style.width = (energy / 100) + "%";
    document.getElementById('energy-info').innerText = `${Math.round(energy)}/10000`;
    localStorage.setItem('balance', balance);
    localStorage.setItem('energy', energy);
}

function formatBalance(balance) {
    return balance.toLocaleString(); 
}

function handleClick() {
    const now = new Date().getTime();
    clicks++;
    clickMultiplier = determineMultiplier(now);

    balance += clickMultiplier;
    energy = Math.max(0, energy - 1);

    updateUI();
}

function determineMultiplier(now) {
    if (!clickStartTime) {
        clickStartTime = now;
    }
    if (now - clickStartTime >= 5 * 60 * 1000) {
        return 5;
    } else if (now - clickStartTime >= 2 * 60 * 1000) {
        return 2;
    }
    return 1;
}

function energyRecovery() {
    const startTime = Date.now();
    const duration = 3 * 60 * 60 * 1000; // 3 ساعات بالمللي ثانية
    const interval = 1000; // تحديث كل ثانية

    const updateEnergy = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        energy = Math.min(10000, (elapsedTime / duration) * 10000);
        updateUI();

        if (elapsedTime >= duration) {
            clearInterval(updateEnergy);
        }
    }, interval);
}

function generateInviteLink() {
    const fixedInviteLink = `${window.location.origin}/invite?code=STATIC_CODE`;
    document.getElementById('inviteLink').value = fixedInviteLink;
    document.getElementById('inviteLinkContainer').style.display = 'block';
}

function copyInviteLink() {
    const inviteLink = document.getElementById('inviteLink');
    inviteLink.select();
    document.execCommand("copy");

    showCopyNotification(); 
}

function showCopyNotification() {
    const notification = document.getElementById('copyNotification');
    notification.style.opacity = 1;
    setTimeout(() => {
        notification.style.opacity = 0;
    }, 2000);
}

function saveSettings() {
    const newUserName = document.getElementById('userName').value;
    if (newUserName) {
        setUserName(newUserName);
    }
    document.getElementById('saveMessage').innerText = 'Settings saved!';
}

function setUserName(newUserName) {
    document.querySelectorAll('.user-id').forEach((element) => {
        element.innerText = newUserName;
    });
    localStorage.setItem('userName', newUserName);
}

function showPage(pageId) {
    document.querySelectorAll('.screen-content').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

function showUserInfo() {
    showPage('userInfoPage');
}

function showWalletPage() {
    showPage('walletPage');
}

function applyJellyEffect(elementId) {
    const element = document.getElementById(elementId);
    element.classList.add('jelly-effect');
    setTimeout(() => element.classList.remove('jelly-effect'), 500);
}

function toggleSettings() {
    const existingForm = document.querySelector('.settings-form');
    if (existingForm) {
        existingForm.remove();
    } else {
        const settingsHtml = `
            <div class="settings-form">
                <input type="text" id="userName" placeholder="Enter new name">
                <button onclick="saveSettings()">Save Changes</button>
                <div class="save-message" id="saveMessage"></div>
            </div>
        `;
        document.querySelector('.top-bar').insertAdjacentHTML('afterend', settingsHtml);
    }
}
