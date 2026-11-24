(() => {
  const ACTIVITY_ID = "FAN160_2026";
  const TOTAL_POOL = 100000;
  const BASE_ISSUED_COUNT = 53000;
  const STORAGE_RECORDS_KEY = "fan160_prd_records_v2";
  const STORAGE_USER_KEY = "fan160_prd_current_user_v2";
  const STORAGE_REMEMBER_KEY = "fan160_prd_remember_login_v1";

  // 从 URL 读取博主标识，默认演示博主 KOL_Tavares44（对应 PRD R01 / R06）
  const urlParams = new URLSearchParams(window.location.search);
  const CURRENT_KOL_ID = urlParams.get("kol") || urlParams.get("kol_id") || "KOL_Tavares44";

  // 8 条幸运中奖号码公示
  const PRIZE_TICKETS = [
    { number: "905036", prize: "¥500", won: false },
    { number: "776024", prize: "¥500", won: false },
    { number: "704235", prize: "¥500", won: false },
    { number: "668427", prize: "¥500", won: true, winnerName: "陈杰森" },
    { number: "657904", prize: "¥500", won: false },
    { number: "272391", prize: "¥500", won: false },
    { number: "205875", prize: "¥500", won: true, winnerName: "林凯峰" },
    { number: "048590", prize: "¥500", won: false }
  ];

  // 内置演示有效参与记录
  const DEMO_RECORDS = [
    {
      recordId: "REC-20261121-001",
      accountId: "UID_880123",
      phone: "13800138000",
      nickname: "李明宇",
      currency: "USD(美元)",
      number: "052818",
      mode: "手动选择号码",
      status: "有效",
      drawStatus: "待开奖",
      kolId: "KOL_Tavares44",
      isNewRegistration: false,
      createdAt: formatDaysAgoTimestamp(0, "13:45:12")
    }
  ];

  // 币种选项（默认 USD(美元)，与截图一致）
  const CURRENCIES = [
    {
      code: "USD",
      label: "USD(美元)",
      flagSvg: `<svg viewBox="0 0 24 24" width="22" height="22">
        <rect width="24" height="24" fill="#ffffff"/>
        <g fill="#d62828">
          <rect y="0" width="24" height="2"/>
          <rect y="4" width="24" height="2"/>
          <rect y="8" width="24" height="2"/>
          <rect y="12" width="24" height="2"/>
          <rect y="16" width="24" height="2"/>
          <rect y="20" width="24" height="2"/>
        </g>
        <rect width="12" height="12" fill="#1d3557"/>
        <g fill="#ffffff">
          <circle cx="3" cy="3" r="0.8"/><circle cx="6" cy="3" r="0.8"/><circle cx="9" cy="3" r="0.8"/>
          <circle cx="4.5" cy="6" r="0.8"/><circle cx="7.5" cy="6" r="0.8"/>
          <circle cx="3" cy="9" r="0.8"/><circle cx="6" cy="9" r="0.8"/><circle cx="9" cy="9" r="0.8"/>
        </g>
      </svg>`
    },
    {
      code: "BRL",
      label: "BRL(巴西雷亚尔)",
      flagSvg: `<svg viewBox="0 0 24 24" width="22" height="22">
        <rect width="24" height="24" fill="#009c3b"/>
        <polygon points="12,3 22,12 12,21 2,12" fill="#ffdf00"/>
        <circle cx="12" cy="12" r="4.2" fill="#002776"/>
        <path d="M8.4 11.4 Q12 10 15.6 12.6" stroke="#ffffff" stroke-width="1" fill="none"/>
      </svg>`
    },
    {
      code: "CNY",
      label: "CNY(人民币)",
      flagSvg: `<svg viewBox="0 0 24 24" width="22" height="22">
        <rect width="24" height="24" fill="#de2910"/>
        <polygon points="6.5,5 7.4,7.6 10.1,7.6 7.9,9.2 8.7,11.8 6.5,10.2 4.3,11.8 5.1,9.2 2.9,7.6 5.6,7.6" fill="#ffde00"/>
        <circle cx="12" cy="5.5" r="0.9" fill="#ffde00"/>
        <circle cx="13.5" cy="8" r="0.9" fill="#ffde00"/>
        <circle cx="13.2" cy="10.8" r="0.9" fill="#ffde00"/>
        <circle cx="11.4" cy="12.6" r="0.9" fill="#ffde00"/>
      </svg>`
    },
    {
      code: "USDT",
      label: "USDT(泰达币)",
      flagSvg: `<svg viewBox="0 0 24 24" width="22" height="22">
        <rect width="24" height="24" fill="#26a17b"/>
        <path d="M7 7.2h10v2.1h-3.9v1.8c2.6.2 4.5.8 4.5 1.6s-1.9 1.4-4.5 1.6v3.5h-2.2v-3.5c-2.6-.2-4.5-.8-4.5-1.6s1.9-1.4 4.5-1.6V9.3H7V7.2Z" fill="#ffffff"/>
      </svg>`
    }
  ];

  // 预置已占用的号码集合
  const TAKEN_NUMBERS = new Set(["052818", "052822", "052827", "064102", "064108", "081905", "081911"]);

  // 手动选号池批次
  const MANUAL_BATCHES = [
    ["052816", "052818", "052819", "052821", "052822", "052825", "052827", "052831", "052836"],
    ["064101", "064102", "064105", "064107", "064108", "064112", "064115", "064119", "064123"],
    ["081901", "081904", "081905", "081908", "081911", "081916", "081920", "081925", "081929"]
  ];

  // 付费抽奖默认档位（若后台修改并保存了付费档位，将优先读取后台配置）
  const DEFAULT_PAID_TIERS = [
    { qty: 1, price: 1, tag: "" },
    { qty: 2, price: 2, tag: "热门" },
    { qty: 5, price: 5, tag: "超值" },
    { qty: 10, price: 10, tag: "" }
  ];

  function loadPaidTiers() {
    try {
      const raw = localStorage.getItem("fan160_paid_tiers_v1");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return DEFAULT_PAID_TIERS.map((t) => ({ ...t }));
  }

  // 状态
  let lotteryMode = urlParams.get("mode") === "paid" ? "paid" : "free"; // "free" | "paid"
  let paidTiers = loadPaidTiers();
  let selectedTierIdx = paidTiers.length > 1 ? 1 : 0; // 付费模式默认选中第2档（$2 / 2个号码）
  let selectionMode = "manual"; // "manual" | "random"
  let currentBatchIdx = 0;
  let selectedManualNumbers = ["052819"];
  let randomPreviewNumbers = [];
  let randomRollTimer = null;
  let selectedCurrency = CURRENCIES[0]; // 默认 USD(美元)
  let pendingLockAfterAuth = false;
  let pendingPayIsNewReg = false;
  let pendingCustomPayOrder = null;
  let currentDetailRecord = null;
  let detailBuyQty = 2;
  let currentUser = loadCurrentUser();
  let ticketsStatusFilter = "all"; // "all" | "待开奖" | "未中奖" | "中奖"
  let ticketsTimeFilter = "all"; // "all" | "today" | "yesterday" | "7d" | "30d" | "2m" | "3m"
  let toastTimer = null;

  // DOM 引用
  const switchFreeModeBtn = document.getElementById("switchFreeModeBtn");
  const switchPaidModeBtn = document.getElementById("switchPaidModeBtn");
  const heroLiveBadge = document.getElementById("heroLiveBadge");
  const participationPill = document.getElementById("participationPill");
  const paidTiersArea = document.getElementById("paidTiersArea");
  const paidTiersGrid = document.getElementById("paidTiersGrid");
  const paidTierRuleTip = document.getElementById("paidTierRuleTip");
  const ctaTitle = document.getElementById("ctaTitle");
  const payConfirmSummary = document.getElementById("payConfirmSummary");
  const confirmPaySubmitBtn = document.getElementById("confirmPaySubmitBtn");

  const siteHeader = document.getElementById("siteHeader");
  const headerAccountWrap = document.getElementById("headerAccountWrap");
  const headerAccountBtn = document.getElementById("headerAccountBtn");
  const headerAccountText = document.getElementById("headerAccountText");
  const avatarPopover = document.getElementById("avatarPopover");
  const avatarPopoverName = document.getElementById("avatarPopoverName");
  const avatarPopoverUid = document.getElementById("avatarPopoverUid");
  const copyPopoverNameBtn = document.getElementById("copyPopoverNameBtn");
  const copyPopoverUidBtn = document.getElementById("copyPopoverUidBtn");
  const popoverTicketsBtn = document.getElementById("popoverTicketsBtn");
  const popoverLogoutBtn = document.getElementById("popoverLogoutBtn");
  const openSupportBtn = document.getElementById("openSupportBtn");
  const openTicketsBtn = document.getElementById("openTicketsBtn");
  const openRulesBtn = document.getElementById("openRulesBtn");
  const footerRulesBtn = document.getElementById("footerRulesBtn");
  const myTicketsBadge = document.getElementById("myTicketsBadge");

  const progressTrack = document.getElementById("progressTrack");
  const progressFill = document.getElementById("progressFill");
  const progressLabel = document.getElementById("progressLabel");
  const progressCountText = document.getElementById("progressCountText");
  const progressStageTag = document.getElementById("progressStageTag");

  const tabManual = document.getElementById("tabManual");
  const tabRandom = document.getElementById("tabRandom");
  const panelManual = document.getElementById("panelManual");
  const panelRandom = document.getElementById("panelRandom");
  const manualNumberGrid = document.getElementById("manualNumberGrid");
  const customNumberInput = document.getElementById("customNumberInput");
  const applyCustomNumBtn = document.getElementById("applyCustomNumBtn");
  const refreshPoolBtn = document.getElementById("refreshPoolBtn");
  const manualSelectedHint = document.getElementById("manualSelectedHint");

  const randomSlots = document.getElementById("randomSlots");
  const randomDesc = document.getElementById("randomDesc");
  const rollPreviewBtn = document.getElementById("rollPreviewBtn");

  const channelKolLabel = document.getElementById("channelKolLabel");
  const lockNumberBtn = document.getElementById("lockNumberBtn");
  const ctaSubtext = document.getElementById("ctaSubtext");
  const ctaRightLabel = document.getElementById("ctaRightLabel");
  const ctaRightValue = document.getElementById("ctaRightValue");

  const prizesList = document.getElementById("prizesList");
  const prizesCountBadge = document.getElementById("prizesCountBadge");

  // 平台全屏登录/注册页 DOM
  const closeAuthPageBtn = document.getElementById("closeAuthPageBtn");
  const authTabRegister = document.getElementById("authTabRegister");
  const authTabLogin = document.getElementById("authTabLogin");
  const authPanelRegister = document.getElementById("authPanelRegister");
  const authPanelLogin = document.getElementById("authPanelLogin");

  const regAccountInput = document.getElementById("regAccountInput");
  const regPasswordInput = document.getElementById("regPasswordInput");
  const regRealNameInput = document.getElementById("regRealNameInput");
  const regAgreeCheckbox = document.getElementById("regAgreeCheckbox");
  const pwdStrengthBars = document.getElementById("pwdStrengthBars");
  const openAgreementBtn = document.getElementById("openAgreementBtn");

  const currencyDropdown = document.getElementById("currencyDropdown");
  const currencyTrigger = document.getElementById("currencyTrigger");
  const selectedCurrencyFlag = document.getElementById("selectedCurrencyFlag");
  const selectedCurrencyLabel = document.getElementById("selectedCurrencyLabel");
  const currencyMenu = document.getElementById("currencyMenu");

  const loginAccountInput = document.getElementById("loginAccountInput");
  const loginPasswordInput = document.getElementById("loginPasswordInput");
  const rememberAccountCheckbox = document.getElementById("rememberAccountCheckbox");

  // 锁定成功 & 我的号码 DOM
  const lockedTicketNumber = document.getElementById("lockedTicketNumber");
  const lockedTicketMeta = document.getElementById("lockedTicketMeta");
  const lockAttributionSummary = document.getElementById("lockAttributionSummary");
  const openMyTicketsFromSuccessBtn = document.getElementById("openMyTicketsFromSuccessBtn");

  const lookupResultArea = document.getElementById("lookupResultArea");
  const ticketsModalStats = document.getElementById("ticketsModalStats");
  const ticketsFilterBar = document.getElementById("ticketsFilterBar");
  const ticketsStatusSelect = document.getElementById("ticketsStatusSelect");
  const ticketsTimeSelect = document.getElementById("ticketsTimeSelect");
  const ticketsSearchBtn = document.getElementById("ticketsSearchBtn");
  const ticketsResetBtn = document.getElementById("ticketsResetBtn");

  const openAttributionInfoBtn = document.getElementById("openAttributionInfoBtn");
  const openSelfExclusionBtn = document.getElementById("openSelfExclusionBtn");
  const safeBadgeBtn = document.getElementById("safeBadgeBtn");
  const infoModalIcon = document.getElementById("infoModalIcon");
  const infoModalTitle = document.getElementById("infoModalTitle");
  const infoModalSub = document.getElementById("infoModalSub");
  const infoModalBody = document.getElementById("infoModalBody");
  const toastEl = document.getElementById("toast");

  // ===========================
  // 存储与基础工具
  // ===========================
  function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.hidden = true;
    }, 2600);
  }

  async function copyTextToClipboard(text, triggerBtn, itemLabel = "号码") {
    const value = String(text || "").trim();
    if (!value) return;

    let ok = false;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(value);
        ok = true;
      } catch {
        ok = false;
      }
    }
    if (!ok) {
      const ta = document.createElement("textarea");
      ta.value = value;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        ok = document.execCommand("copy");
      } catch {
        ok = false;
      }
      document.body.removeChild(ta);
    }

    if (triggerBtn) {
      const labelEl = triggerBtn.querySelector("span");
      const prevText = labelEl ? labelEl.textContent : triggerBtn.textContent;
      triggerBtn.classList.add("is-copied");
      if (labelEl) labelEl.textContent = "已复制";
      setTimeout(() => {
        triggerBtn.classList.remove("is-copied");
        if (labelEl) labelEl.textContent = prevText;
      }, 1500);
    }

    showToast(ok ? `已复制${itemLabel} ${value}` : `请手动复制${itemLabel} ${value}`);
  }

  lockedTicketNumber.addEventListener("click", () => {
    copyTextToClipboard(lockedTicketNumber.textContent);
  });

  function loadRecords() {
    try {
      const raw = localStorage.getItem(STORAGE_RECORDS_KEY);
      if (!raw) return [...DEMO_RECORDS];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [...DEMO_RECORDS];
    } catch {
      return [...DEMO_RECORDS];
    }
  }

  function saveRecords(records) {
    try {
      localStorage.setItem(STORAGE_RECORDS_KEY, JSON.stringify(records));
    } catch {
      // ignore
    }
  }

  function loadCurrentUser() {
    try {
      const raw = localStorage.getItem(STORAGE_USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function saveCurrentUser(user) {
    currentUser = user;
    try {
      if (user) {
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_USER_KEY);
      }
    } catch {
      // ignore
    }
  }

  function getAllTakenNumbers() {
    const taken = new Set(TAKEN_NUMBERS);
    loadRecords().forEach((rec) => {
      if (rec.status === "有效") {
        taken.add(rec.number);
      }
    });
    return taken;
  }

  function formatNumber6(n) {
    return String(n).padStart(6, "0");
  }

  function formatTimestamp(date = new Date()) {
    const pad = (v) => String(v).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(
      date.getHours()
    )}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }

  function generateUniqueAvailableNumber() {
    const taken = getAllTakenNumbers();
    for (let i = 0; i < 200; i++) {
      const candidate = formatNumber6(Math.floor(1 + Math.random() * TOTAL_POOL));
      if (!taken.has(candidate)) return candidate;
    }
    return "099888";
  }

  function generateUniqueAvailableNumbers(count) {
    const target = Math.max(1, Number(count) || 1);
    const taken = getAllTakenNumbers();
    const list = [];
    let guard = 0;
    while (list.length < target && guard < target * 40 + 400) {
      guard += 1;
      const candidate = formatNumber6(Math.floor(1 + Math.random() * TOTAL_POOL));
      if (!taken.has(candidate)) {
        taken.add(candidate);
        list.push(candidate);
      }
    }
    return list;
  }

  function stopRandomRoll() {
    if (randomRollTimer) {
      clearInterval(randomRollTimer);
      randomRollTimer = null;
    }
    randomSlots.classList.remove("is-rolling");
  }

  function syncRandomPreviewToCount() {
    stopRandomRoll();
    const count = getMaxPickCount();
    if (randomPreviewNumbers.length === 0) return;

    const taken = getAllTakenNumbers();
    const valid = randomPreviewNumbers.filter((n) => !taken.has(n)).slice(0, count);
    const used = new Set([...taken, ...valid]);
    let guard = 0;
    while (valid.length < count && guard < count * 40 + 200) {
      guard += 1;
      const candidate = formatNumber6(Math.floor(1 + Math.random() * TOTAL_POOL));
      if (!used.has(candidate)) {
        used.add(candidate);
        valid.push(candidate);
      }
    }
    randomPreviewNumbers = valid;
  }

  function renderRandomPanel(rollingTempNumbers = null) {
    const count = getMaxPickCount();
    const isPaid = lotteryMode === "paid";
    const tier = getCurrentPaidTier();
    const displayList = Array.isArray(rollingTempNumbers)
      ? rollingTempNumbers
      : randomPreviewNumbers.length === count
      ? randomPreviewNumbers
      : [];

    if (count === 1) {
      randomSlots.classList.remove("random-slots--multi");
      const digits = displayList[0] ? displayList[0].split("") : ["?", "?", "?", "?", "?", "?"];
      randomSlots.innerHTML = digits.map((d) => `<span>${d}</span>`).join("");
    } else {
      randomSlots.classList.add("random-slots--multi");
      const items =
        displayList.length === count
          ? displayList.map((num, idx) => ({ num, idx: idx + 1, placeholder: false }))
          : Array.from({ length: count }, (_, idx) => ({ num: "??????", idx: idx + 1, placeholder: true }));
      randomSlots.innerHTML = items
        .map(
          (item) => `
            <div class="random-num-pill ${item.placeholder ? "is-placeholder" : ""}">
              <span class="random-num-pill-idx">#${item.idx}</span>
              <span class="random-num-pill-code">${item.num}</span>
            </div>
          `
        )
        .join("");
    }

    if (!rollingTempNumbers) {
      const hasRolled = randomPreviewNumbers.length === count;
      rollPreviewBtn.textContent = hasRolled
        ? `🎲 重新随机生成 ${count} 个幸运号`
        : `🎲 先试摇 ${count} 个幸运号看看`;

      if (hasRolled) {
        if (count === 1) {
          randomDesc.innerHTML = `已为您随机生成幸运号 <strong>${randomPreviewNumbers[0]}</strong>（最终归属以实时号池校验为准）。`;
        } else {
          randomDesc.innerHTML = `已按当前档位随机生成 <strong>${count} 个唯一 6 位幸运号码</strong>（最终归属以支付锁池时的实时号池校验为准）。`;
        }
      } else if (isPaid) {
        randomDesc.innerHTML = `支付 <strong>${formatUsd(tier.price)}</strong> 并完成后，系统将从当前剩余号池中为您自动分配 <strong>${count} 个唯一 6 位幸运号码</strong>，防重防并发冲突。`;
      } else {
        randomDesc.innerHTML = `点击下方「立即锁定号码」并完成注册/登录后，系统将从当前剩余号池中为您自动分配 <strong>1 个唯一 6 位幸运号码</strong>，防重防并发冲突。`;
      }
    }
  }

  // ===========================
  // 进度条渲染（PRD R03）
  // ===========================
  function renderProgress() {
    const records = loadRecords();
    const extraValid = Math.max(0, records.filter((r) => r.status === "有效").length - DEMO_RECORDS.length);
    const issued = Math.min(TOTAL_POOL, BASE_ISSUED_COUNT + extraValid);
    let pct = Math.floor((issued / TOTAL_POOL) * 100);
    if (issued < TOTAL_POOL && pct >= 100) pct = 99;

    progressFill.style.width = `${pct}%`;
    progressLabel.textContent = `${pct}%`;
    progressTrack.setAttribute("aria-valuenow", String(pct));
    progressCountText.innerHTML = `有效号码：<strong>${issued.toLocaleString("zh-CN")}</strong> / ${TOTAL_POOL.toLocaleString("zh-CN")}`;
    progressStageTag.textContent = issued >= TOTAL_POOL ? "已满额 · 待开奖" : "满 100% 进入待开奖";
  }

  function getCurrentPaidTier() {
    return paidTiers[selectedTierIdx] || paidTiers[0] || { qty: 1, price: 1, tag: "" };
  }

  function getMaxPickCount() {
    return lotteryMode === "paid" ? Math.max(1, Number(getCurrentPaidTier().qty) || 1) : 1;
  }

  function formatUsd(price) {
    const num = Number(price) || 0;
    return Number.isInteger(num) ? `$${num}` : `$${num.toFixed(2)}`;
  }

  function renderPaidTiers() {
    const tier = getCurrentPaidTier();
    paidTierRuleTip.textContent = `支付 ${formatUsd(tier.price)} 可选择 ${tier.qty} 个号码`;

    paidTiersGrid.innerHTML = paidTiers
      .map((t, idx) => {
        const active = idx === selectedTierIdx;
        return `
          <button type="button" class="paid-tier-card ${active ? "is-selected" : ""}" data-tier-idx="${idx}">
            ${t.tag ? `<span class="paid-tier-badge">${t.tag}</span>` : ""}
            <span class="paid-tier-price">${formatUsd(t.price)}</span>
            <span class="paid-tier-qty">${t.qty} 个号码</span>
          </button>
        `;
      })
      .join("");

    paidTiersGrid.querySelectorAll("[data-tier-idx]").forEach((btn) => {
      btn.addEventListener("click", () => {
        selectedTierIdx = Number(btn.dataset.tierIdx);
        const maxCount = getMaxPickCount();
        if (selectedManualNumbers.length > maxCount) {
          selectedManualNumbers = selectedManualNumbers.slice(0, maxCount);
        }
        syncRandomPreviewToCount();
        renderPaidTiers();
        renderManualGrid();
        renderAuthAndCtaState();
      });
    });
  }

  function setLotteryMode(nextMode) {
    lotteryMode = nextMode === "paid" ? "paid" : "free";
    paidTiers = loadPaidTiers();
    if (selectedTierIdx >= paidTiers.length) selectedTierIdx = 0;

    const isPaid = lotteryMode === "paid";
    switchFreeModeBtn.classList.toggle("is-active", !isPaid);
    switchPaidModeBtn.classList.toggle("is-active", isPaid);

    heroLiveBadge.textContent = isPaid ? "付费购号 · 进行中" : "免费领号 · 进行中";
    participationPill.textContent = isPaid ? "付费购号 · 选档支付" : "免费领号 · 无需购买";
    paidTiersArea.hidden = !isPaid;

    // 切换回免费模式时仅保留 1 个自选号码
    const maxCount = getMaxPickCount();
    if (selectedManualNumbers.length > maxCount) {
      selectedManualNumbers = selectedManualNumbers.slice(0, maxCount);
    }
    syncRandomPreviewToCount();

    if (isPaid) {
      renderPaidTiers();
    }
    renderManualGrid();
    renderAuthAndCtaState();
  }

  switchFreeModeBtn.addEventListener("click", () => {
    setLotteryMode("free");
    showToast("当前预览：免费抽奖样式");
  });

  switchPaidModeBtn.addEventListener("click", () => {
    setLotteryMode("paid");
    showToast("当前预览：付费抽奖样式");
  });

  // ===========================
  // 登录状态与 CTA 同步
  // ===========================
  function renderAuthAndCtaState() {
    channelKolLabel.textContent = `博主 ${CURRENT_KOL_ID}`;

    const records = loadRecords();
    const myRecords = currentUser
      ? records.filter((r) => r.accountId === currentUser.accountId || r.phone === currentUser.phone)
      : [];
    const isPaid = lotteryMode === "paid";
    const tier = getCurrentPaidTier();

    if (currentUser) {
      headerAccountBtn.classList.add("is-logged-in");
      headerAccountBtn.setAttribute("aria-label", `已登录账号：${currentUser.nickname || currentUser.accountId}`);
      avatarPopoverName.textContent = `账号：${currentUser.phone || currentUser.nickname}`;
      avatarPopoverUid.textContent = `ID：${currentUser.accountId}`;
    } else {
      headerAccountBtn.classList.remove("is-logged-in");
      headerAccountBtn.setAttribute("aria-label", "登录或注册");
      headerAccountText.textContent = "登录/注册";
      avatarPopover.hidden = true;
    }

    const displayTickets = currentUser ? getDisplayTicketsForUser(currentUser) : [];
    if (displayTickets.length > 0) {
      myTicketsBadge.textContent = String(displayTickets.length);
      myTicketsBadge.hidden = false;
    } else {
      myTicketsBadge.hidden = true;
    }

    if (isPaid) {
      ctaTitle.textContent = `立即购买号码 (${formatUsd(tier.price)})`;
      ctaSubtext.innerHTML = `
        <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden="true">
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm-1.2 14.2L7 12.4l1.4-1.4 2.4 2.4 5-5L17.2 9.8Z" />
        </svg>
        <span>支付 ${formatUsd(tier.price)} 可选 ${tier.qty} 个号码${currentUser ? " · 立即支付锁定" : " · 登录/注册后支付"}</span>
      `;
      ctaRightLabel.textContent = `可选 ${tier.qty} 个号码`;
      ctaRightValue.textContent = `$${Number(tier.price).toFixed(2)}`;
    } else {
      ctaTitle.textContent = "立即锁定号码";
      ctaSubtext.innerHTML = `
        <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden="true">
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm-1.2 14.2L7 12.4l1.4-1.4 2.4 2.4 5-5L17.2 9.8Z" />
        </svg>
        <span>${
          currentUser
            ? myRecords.length > 0
              ? "本期已锁定号码 · 点击查看"
              : "已登录平台账号 · 免费立即生效"
            : "免费参与 · 注册/登录后生效"
        }</span>
      `;
      if (selectionMode === "manual") {
        ctaRightLabel.textContent = "当前自选";
        ctaRightValue.textContent = selectedManualNumbers[0] || "请选择";
      } else {
        ctaRightLabel.textContent = "发号方式";
        ctaRightValue.textContent = randomPreviewNumbers[0] ? `随机 ${randomPreviewNumbers[0]}` : "系统随机";
      }
    }

    if (!randomRollTimer) {
      renderRandomPanel();
    }

    if (selectionMode === "manual") {
      if (isPaid) {
        const maxCount = getMaxPickCount();
        const preview = selectedManualNumbers.slice(0, 2).join("、") + (selectedManualNumbers.length > 2 ? "…" : "");
        manualSelectedHint.innerHTML = `已选 <strong>${selectedManualNumbers.length}/${maxCount}</strong>${
          preview ? `（${preview}）` : ""
        }`;
      } else {
        manualSelectedHint.innerHTML = selectedManualNumbers[0]
          ? `已选：<strong>${selectedManualNumbers[0]}</strong>`
          : `请点选一个可选号码`;
      }
    }
  }

  // ===========================
  // 手动选号网格 & 系统随机分配
  // ===========================
  function renderManualGrid() {
    const taken = getAllTakenNumbers();
    const batch = [...MANUAL_BATCHES[currentBatchIdx]];
    const maxCount = getMaxPickCount();

    // 剔除刚被占用的号码
    selectedManualNumbers = selectedManualNumbers.filter((n) => !taken.has(n));

    // 若用户自定义输入了不在当前批次的号码，插入到首格方便查看
    if (selectedManualNumbers[0] && !batch.includes(selectedManualNumbers[0])) {
      batch[0] = selectedManualNumbers[0];
    }

    if (selectedManualNumbers.length === 0) {
      const firstAvail = batch.find((num) => !taken.has(num));
      selectedManualNumbers = [firstAvail || generateUniqueAvailableNumber()];
    }

    manualNumberGrid.innerHTML = batch
      .map((num) => {
        const isTaken = taken.has(num);
        const isSelected = !isTaken && selectedManualNumbers.includes(num);
        return `
          <button
            type="button"
            class="num-card ${isSelected ? "is-selected" : ""}"
            data-num="${num}"
            role="${maxCount > 1 ? "checkbox" : "radio"}"
            aria-checked="${isSelected ? "true" : "false"}"
            ${isTaken ? "disabled" : ""}
          >
            ${isSelected ? '<span class="num-selected-pill">已选</span>' : ""}
            <span class="num-card-code">${num}</span>
            <span class="num-card-tag">${isTaken ? "已占用" : isSelected ? (lotteryMode === "paid" ? "待购买" : "待锁定") : "可选"}</span>
          </button>
        `;
      })
      .join("");

    manualNumberGrid.querySelectorAll(".num-card:not(:disabled)").forEach((btn) => {
      btn.addEventListener("click", () => {
        const num = btn.dataset.num;
        if (maxCount === 1) {
          selectedManualNumbers = [num];
        } else {
          if (selectedManualNumbers.includes(num)) {
            if (selectedManualNumbers.length > 1) {
              selectedManualNumbers = selectedManualNumbers.filter((x) => x !== num);
            }
          } else if (selectedManualNumbers.length < maxCount) {
            selectedManualNumbers.push(num);
          } else {
            showToast(`当前档位最多可选择 ${maxCount} 个号码，可取消已选或切换更高档位`);
            return;
          }
        }
        renderManualGrid();
        renderAuthAndCtaState();
      });
    });

    renderAuthAndCtaState();
  }

  function switchMode(mode) {
    selectionMode = mode;
    const isManual = mode === "manual";
    tabManual.classList.toggle("is-active", isManual);
    tabManual.setAttribute("aria-selected", String(isManual));
    tabRandom.classList.toggle("is-active", !isManual);
    tabRandom.setAttribute("aria-selected", String(!isManual));
    panelManual.hidden = !isManual;
    panelRandom.hidden = isManual;
    renderAuthAndCtaState();
  }

  tabManual.addEventListener("click", () => switchMode("manual"));
  tabRandom.addEventListener("click", () => switchMode("random"));

  refreshPoolBtn.addEventListener("click", () => {
    currentBatchIdx = (currentBatchIdx + 1) % MANUAL_BATCHES.length;
    if (lotteryMode === "free") {
      selectedManualNumbers = [];
    }
    renderManualGrid();
    showToast("已切换一批剩余可选号码");
  });

  function applyCustomNumber() {
    const raw = customNumberInput.value.replace(/[^\d]/g, "");
    if (!raw) {
      showToast("请输入 1 ~ 100000 之间的数字");
      return;
    }
    const numeric = parseInt(raw, 10);
    if (numeric < 1 || numeric > TOTAL_POOL) {
      showToast("号码需在 000001 - 100000 范围内");
      return;
    }
    const formatted = formatNumber6(numeric);
    if (getAllTakenNumbers().has(formatted)) {
      showToast(`号码 ${formatted} 已被占用，请更换其他号码`);
      return;
    }
    const maxCount = getMaxPickCount();
    if (maxCount === 1) {
      selectedManualNumbers = [formatted];
    } else if (!selectedManualNumbers.includes(formatted)) {
      if (selectedManualNumbers.length < maxCount) {
        selectedManualNumbers.push(formatted);
      } else {
        selectedManualNumbers[selectedManualNumbers.length - 1] = formatted;
      }
    }
    customNumberInput.value = formatted;
    renderManualGrid();
    showToast(`已选中自选号码 ${formatted}`);
  }

  applyCustomNumBtn.addEventListener("click", applyCustomNumber);
  customNumberInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      applyCustomNumber();
    }
  });

  rollPreviewBtn.addEventListener("click", () => {
    stopRandomRoll();
    const count = getMaxPickCount();
    randomSlots.classList.add("is-rolling");
    let ticks = 0;
    randomRollTimer = setInterval(() => {
      const tempList = Array.from({ length: count }, () =>
        formatNumber6(Math.floor(1 + Math.random() * TOTAL_POOL))
      );
      renderRandomPanel(tempList);
      ticks += 1;
      if (ticks >= 8) {
        stopRandomRoll();
        randomPreviewNumbers = generateUniqueAvailableNumbers(count);
        renderRandomPanel();
        renderAuthAndCtaState();
      }
    }, 55);
  });

  // ===========================
  // 平台全屏登录 / 注册页交互（1:1 按截图）
  // ===========================
  function syncPlaceholderState(inputEl) {
    const wrap = inputEl.closest("[data-input-wrap]");
    if (!wrap) return;
    wrap.classList.toggle("has-value", inputEl.value.length > 0);
  }

  document.querySelectorAll("[data-input-wrap] .auth-field-input").forEach((inputEl) => {
    inputEl.addEventListener("input", () => syncPlaceholderState(inputEl));
    inputEl.addEventListener("change", () => syncPlaceholderState(inputEl));
    syncPlaceholderState(inputEl);
  });

  // 密码显隐眼睛按钮
  document.querySelectorAll("[data-toggle-pwd]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = document.getElementById(btn.dataset.togglePwd);
      if (!target) return;
      const isShowing = target.type === "text";
      target.type = isShowing ? "password" : "text";
      btn.classList.toggle("is-visible", !isShowing);
    });
  });

  // 注册密码强度四段实时计算
  function updatePasswordStrength(val) {
    pwdStrengthBars.classList.remove("level-1", "level-2", "level-3", "level-4");
    if (!val) return;
    let score = 0;
    if (val.length >= 6) score += 1;
    if (/[a-z]/.test(val) && /[A-Z]/.test(val)) score += 1;
    if (/\d/.test(val)) score += 1;
    if (/[^A-Za-z0-9]/.test(val) || val.length >= 10) score += 1;
    score = Math.max(1, Math.min(4, score));
    pwdStrengthBars.classList.add(`level-${score}`);
  }

  regPasswordInput.addEventListener("input", () => updatePasswordStrength(regPasswordInput.value));

  // 币种下拉框渲染与交互
  function renderCurrencyDropdown() {
    selectedCurrencyFlag.innerHTML = selectedCurrency.flagSvg;
    selectedCurrencyLabel.textContent = selectedCurrency.label;

    currencyMenu.innerHTML = CURRENCIES.map(
      (item) => `
        <li>
          <button
            type="button"
            class="currency-option ${item.code === selectedCurrency.code ? "is-selected" : ""}"
            data-currency="${item.code}"
            role="option"
            aria-selected="${item.code === selectedCurrency.code ? "true" : "false"}"
          >
            <span class="currency-option-left">
              <span class="currency-flag">${item.flagSvg}</span>
              <span>${item.label}</span>
            </span>
            <span>${item.code === selectedCurrency.code ? "✓" : ""}</span>
          </button>
        </li>
      `
    ).join("");

    currencyMenu.querySelectorAll(".currency-option").forEach((btn) => {
      btn.addEventListener("click", () => {
        const found = CURRENCIES.find((c) => c.code === btn.dataset.currency);
        if (found) {
          selectedCurrency = found;
          renderCurrencyDropdown();
        }
        toggleCurrencyMenu(false);
      });
    });
  }

  function toggleCurrencyMenu(open) {
    const next = typeof open === "boolean" ? open : currencyMenu.hidden;
    currencyMenu.hidden = !next;
    currencyDropdown.classList.toggle("is-open", next);
    currencyTrigger.setAttribute("aria-expanded", String(next));
  }

  currencyTrigger.addEventListener("click", () => toggleCurrencyMenu());

  document.addEventListener("click", (e) => {
    if (!currencyDropdown.contains(e.target)) {
      toggleCurrencyMenu(false);
    }
  });

  // 切换注册 / 登录标签
  function switchAuthTab(tab) {
    const isReg = tab === "register";
    authTabRegister.classList.toggle("is-active", isReg);
    authTabRegister.setAttribute("aria-selected", String(isReg));
    authTabLogin.classList.toggle("is-active", !isReg);
    authTabLogin.setAttribute("aria-selected", String(!isReg));
    authPanelRegister.hidden = !isReg;
    authPanelLogin.hidden = isReg;
    toggleCurrencyMenu(false);
  }

  authTabRegister.addEventListener("click", () => switchAuthTab("register"));
  authTabLogin.addEventListener("click", () => switchAuthTab("login"));

  function openAuthPage(initialTab = "register", { lockAfter = false } = {}) {
    pendingLockAfterAuth = lockAfter;
    switchAuthTab(initialTab);

    // 若之前勾选过“记住账号密码”，自动回填登录框
    try {
      const remembered = JSON.parse(localStorage.getItem(STORAGE_REMEMBER_KEY) || "null");
      if (remembered && remembered.account && !loginAccountInput.value) {
        loginAccountInput.value = remembered.account;
        loginPasswordInput.value = remembered.password || "";
        syncPlaceholderState(loginAccountInput);
        syncPlaceholderState(loginPasswordInput);
      }
    } catch {
      // ignore
    }

    openModal("authPageModal");
  }

  closeAuthPageBtn.addEventListener("click", () => {
    pendingLockAfterAuth = false;
    closeModal("authPageModal");
  });

  // 底部链接：联系客服 / 免费试玩 / 忘记密码 / 用户协议
  document.querySelectorAll("[data-auth-action]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.dataset.authAction;
      if (action === "support") {
        openModal("supportModal");
      } else if (action === "trial") {
        showToast("已进入原型试玩提示：请注册或登录平台账号参与本期免费抽奖");
      } else if (action === "forgot") {
        openInfoModal({
          icon: "🔑",
          title: "找回登录密码",
          sub: "官方账号安全中心",
          paragraphs: [
            "如忘记平台登录密码，请通过在线客服核验注册手机号与真实姓名后重置密码。",
            "原型演示环境下，在登录页输入任意手机号/账号及密码即可完成模拟登录。"
          ]
        });
      }
    });
  });

  openAgreementBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    openInfoModal({
      icon: "📄",
      title: "《用户协议》",
      sub: "平台注册与活动参与服务条款",
      paragraphs: [
        "1. 注册用户须年满 18 周岁，并确保填写的真实姓名与提款银行账户一致，以保障后续兑奖及资金到账安全。",
        "2. 所选币种将应用于账户币种及支付方式，注册确认后不可自行修改。",
        "3. 通过博主推广链接完成的新账号注册将自动记录活动及渠道归属，用于官方活动参与及渠道核算。"
      ]
    });
  });

  // 提交注册表单 -> 创建平台账号（含真实姓名、币种、渠道归因）-> 回跳活动页锁定号码
  authPanelRegister.addEventListener("submit", (e) => {
    e.preventDefault();
    const account = regAccountInput.value.trim();
    const password = regPasswordInput.value;
    const realName = regRealNameInput.value.trim();

    if (!account) {
      showToast("请输入手机号码/账号");
      regAccountInput.focus();
      return;
    }
    if (!password || password.length < 6) {
      showToast("请输入至少 6 位密码");
      regPasswordInput.focus();
      return;
    }
    if (!realName) {
      showToast("请输入真实姓名");
      regRealNameInput.focus();
      return;
    }
    if (!regAgreeCheckbox.checked) {
      showToast("请先勾选同意《用户协议》并确认已年满18岁");
      return;
    }

    const newUser = {
      accountId: `UID_${Math.floor(100000 + Math.random() * 899999)}`,
      phone: account,
      nickname: realName,
      currency: selectedCurrency.label,
      kolId: CURRENT_KOL_ID,
      registeredAt: formatTimestamp()
    };

    saveCurrentUser(newUser);
    closeModal("authPageModal");
    renderAuthAndCtaState();

    // 清空敏感输入框以便下次演示
    regAccountInput.value = "";
    regPasswordInput.value = "";
    regRealNameInput.value = "";
    syncPlaceholderState(regAccountInput);
    syncPlaceholderState(regPasswordInput);
    syncPlaceholderState(regRealNameInput);
    updatePasswordStrength("");

    if (pendingLockAfterAuth) {
      pendingLockAfterAuth = false;
      executeLockTicketForUser(newUser, { isNewRegistration: true });
    } else {
      showToast(`注册成功（${newUser.accountId}），现在可点击「立即锁定号码」`);
    }
  });

  // 提交登录表单 -> 登录平台账号 -> 若来自锁号则立即锁定
  authPanelLogin.addEventListener("submit", (e) => {
    e.preventDefault();
    const account = loginAccountInput.value.trim();
    const password = loginPasswordInput.value;

    if (!account) {
      showToast("请输入手机号码/账号");
      loginAccountInput.focus();
      return;
    }
    if (!password) {
      showToast("请输入登录密码");
      loginPasswordInput.focus();
      return;
    }

    if (rememberAccountCheckbox.checked) {
      try {
        localStorage.setItem(STORAGE_REMEMBER_KEY, JSON.stringify({ account, password }));
      } catch {
        // ignore
      }
    } else {
      try {
        localStorage.removeItem(STORAGE_REMEMBER_KEY);
      } catch {
        // ignore
      }
    }

    const existingDemo = DEMO_RECORDS.find((r) => r.phone === account || r.accountId === account);
    const loggedUser = existingDemo
      ? {
          accountId: existingDemo.accountId,
          phone: existingDemo.phone,
          nickname: existingDemo.nickname,
          currency: existingDemo.currency
        }
      : {
          accountId: account.startsWith("UID_")
            ? account
            : `UID_${account.replace(/\D/g, "").slice(-6).padStart(6, "0")}`,
          phone: account,
          nickname: account,
          currency: "USD(美元)"
        };

    saveCurrentUser(loggedUser);
    closeModal("authPageModal");
    renderAuthAndCtaState();

    if (pendingLockAfterAuth) {
      pendingLockAfterAuth = false;
      executeLockTicketForUser(loggedUser, { isNewRegistration: false });
    } else {
      showToast(`登录成功，欢迎回来 ${loggedUser.nickname}`);
    }
  });

  // ===========================
  // 号码锁定 / 付费购买与结果展示（PRD R02 / R03 / R06）
  // ===========================
  function openPayConfirmModal(user, { isNewRegistration = false, customOrder = null } = {}) {
    pendingPayIsNewReg = isNewRegistration;
    pendingCustomPayOrder = customOrder;
    const tier = customOrder ? { qty: customOrder.qty, price: customOrder.price } : getCurrentPaidTier();
    const isDetailOrder = Boolean(customOrder);
    const picked = !isDetailOrder && selectionMode === "manual" ? selectedManualNumbers.slice(0, tier.qty) : [];
    const remainAuto = Math.max(0, tier.qty - picked.length);
    const rolledNums = !isDetailOrder && randomPreviewNumbers.length === tier.qty ? randomPreviewNumbers : [];
    const numDesc = isDetailOrder
      ? `系统随机分配 ${tier.qty} 个唯一号码`
      : selectionMode === "manual"
      ? remainAuto > 0
        ? `${picked.join("、")}（另 ${remainAuto} 个由系统自动补齐）`
        : picked.join("、")
      : rolledNums.length > 0
      ? rolledNums.length <= 4
        ? rolledNums.join("、")
        : `${rolledNums.slice(0, 3).join("、")} 等 ${rolledNums.length} 个随机号码`
      : `系统随机分配 ${tier.qty} 个唯一号码`;

    payConfirmSummary.innerHTML = `
      <div class="pending-lock-row"><span>购买档位</span><strong>${tier.qty} 个抽奖号码</strong></div>
      <div class="pending-lock-row"><span>选号方式</span><span>${isDetailOrder ? "详情页快捷购买（系统随机）" : selectionMode === "manual" ? "手动选择号码" : "系统随机分配"}</span></div>
      <div class="pending-lock-row"><span>待锁定号码</span><strong>${numDesc}</strong></div>
      <div class="pending-lock-row"><span>购买账号</span><span>${user.phone}（${user.accountId}）</span></div>
      <div class="pending-lock-row"><span>应付金额</span><strong style="color:#15803d;font-size:16px;">$${Number(tier.price).toFixed(2)}</strong></div>
    `;
    confirmPaySubmitBtn.textContent = `确认支付 $${Number(tier.price).toFixed(2)}`;
    openModal("payConfirmModal");
  }

  confirmPaySubmitBtn.addEventListener("click", () => {
    if (!currentUser) return;
    closeModal("payConfirmModal");
    issuePaidTicketsForUser(currentUser, { isNewRegistration: pendingPayIsNewReg });
  });

  function issuePaidTicketsForUser(user, { isNewRegistration = false } = {}) {
    const customOrder = pendingCustomPayOrder;
    pendingCustomPayOrder = null;
    const tier = customOrder ? { qty: customOrder.qty, price: customOrder.price } : getCurrentPaidTier();
    const count = Math.max(1, Number(tier.qty) || 1);
    const taken = getAllTakenNumbers();
    const issuedNums = [];

    if (!customOrder && selectionMode === "manual") {
      selectedManualNumbers.forEach((n) => {
        if (issuedNums.length < count && !taken.has(n) && !issuedNums.includes(n)) {
          issuedNums.push(n);
          taken.add(n);
        }
      });
    } else if (!customOrder && randomPreviewNumbers.length > 0) {
      randomPreviewNumbers.forEach((n) => {
        if (issuedNums.length < count && !taken.has(n) && !issuedNums.includes(n)) {
          issuedNums.push(n);
          taken.add(n);
        }
      });
    }

    while (issuedNums.length < count) {
      let candidate = formatNumber6(Math.floor(1 + Math.random() * TOTAL_POOL));
      if (!taken.has(candidate) && !issuedNums.includes(candidate)) {
        issuedNums.push(candidate);
        taken.add(candidate);
      }
    }

    const records = loadRecords();
    const nowTime = formatTimestamp();
    const payChannel = (document.querySelector('input[name="h5PayChannel"]:checked') || {}).value || "平台余额支付";
    const modeLabel = customOrder
      ? "系统随机分配"
      : selectionMode === "manual"
      ? "手动选择号码"
      : "系统随机分配";
    const targetRound = (customOrder && customOrder.round) || "第 202601 期";

    const createdList = issuedNums.map((num, idx) => ({
      recordId: `REC-${Date.now()}-${idx + 1}`,
      round: targetRound,
      accountId: user.accountId,
      phone: user.phone,
      nickname: user.nickname,
      registeredAt: user.registeredAt || nowTime,
      currency: user.currency || "USD(美元)",
      number: num,
      mode: modeLabel,
      payInfo: `付费购号 ${formatUsd(tier.price)} / ${tier.qty}个`,
      payMethod: payChannel,
      firstPrize: "2025款 本田 Fan 160 摩托车",
      status: "有效",
      drawStatus: "待开奖",
      kolId: CURRENT_KOL_ID,
      isNewRegistration: isNewRegistration && idx === 0,
      createdAt: nowTime
    }));

    records.unshift(...createdList);
    saveRecords(records);

    selectedManualNumbers = [];
    randomPreviewNumbers = [];
    renderProgress();
    renderManualGrid();
    renderAuthAndCtaState();
    if (!document.getElementById("ticketsModal").hidden) {
      renderMyTickets();
    }
    if (customOrder && customOrder.fromDetailPage && currentDetailRecord) {
      renderRoundDetailPage();
    }
    showLockSuccessMulti(createdList, tier);
  }

  function showLockSuccessMulti(recordsList, tier) {
    const first = recordsList[0];
    if (recordsList.length === 1) {
      lockedTicketNumber.innerHTML = first.number;
    } else {
      lockedTicketNumber.innerHTML = `<div class="locked-multi-chips">${recordsList
        .map((r) => `<span class="locked-multi-chip">${r.number}</span>`)
        .join("")}</div>`;
    }
    lockedTicketMeta.textContent = `支付 ${formatUsd(tier.price)} 已锁定 ${recordsList.length} 个有效号码 · 账号：${first.accountId}`;

    lockAttributionSummary.innerHTML = `
      <div class="pending-lock-row"><span>真实姓名 / 账号</span><strong>${first.nickname} (${first.phone})</strong></div>
      <div class="pending-lock-row"><span>平台账号 ID</span><code>${first.accountId}</code></div>
      <div class="pending-lock-row"><span>支付金额</span><strong style="color:#15803d;">$${Number(tier.price).toFixed(2)}（${recordsList.length} 个号码）</strong></div>
      <div class="pending-lock-row"><span>获取时间</span><span>${first.createdAt}</span></div>
    `;
    openModal("lockSuccessModal");
  }

  function executeLockTicketForUser(user, { isNewRegistration = false } = {}) {
    if (lotteryMode === "paid") {
      openPayConfirmModal(user, { isNewRegistration });
      return;
    }

    const records = loadRecords();
    const existing = records.find(
      (r) => (r.accountId === user.accountId || r.phone === user.phone) && r.status === "有效"
    );

    if (existing) {
      showLockSuccess(existing);
      return;
    }

    const taken = getAllTakenNumbers();
    let finalNumber = "";
    const modeLabel = selectionMode === "manual" ? "手动选择号码" : "系统随机分配";

    if (selectionMode === "manual") {
      const picked = selectedManualNumbers[0];
      if (picked && !taken.has(picked)) {
        finalNumber = picked;
      } else {
        finalNumber = generateUniqueAvailableNumber();
        showToast("原自选号刚被他人抢先锁定，系统已为您自动补发可用号码");
      }
    } else {
      finalNumber =
        randomPreviewNumbers[0] && !taken.has(randomPreviewNumbers[0])
          ? randomPreviewNumbers[0]
          : generateUniqueAvailableNumber();
    }

    const newRecord = {
      recordId: `REC-${Date.now()}`,
      round: "第 202601 期",
      accountId: user.accountId,
      phone: user.phone,
      nickname: user.nickname,
      registeredAt: user.registeredAt || formatTimestamp(),
      currency: user.currency || "USD(美元)",
      number: finalNumber,
      mode: modeLabel,
      payInfo: "免费领号",
      payMethod: "免费",
      firstPrize: "2025款 本田 Fan 160 摩托车",
      status: "有效",
      drawStatus: "待开奖",
      kolId: CURRENT_KOL_ID,
      isNewRegistration,
      createdAt: formatTimestamp()
    };

    records.unshift(newRecord);
    saveRecords(records);

    selectedManualNumbers = [];
    randomPreviewNumbers = [];
    renderProgress();
    renderManualGrid();
    renderAuthAndCtaState();
    showLockSuccess(newRecord);
  }

  function showLockSuccess(record) {
    lockedTicketNumber.textContent = record.number;
    lockedTicketMeta.textContent = `状态：${record.status} · 方式：${record.mode} · 账号：${record.accountId}`;

    lockAttributionSummary.innerHTML = `
      <div class="pending-lock-row"><span>真实姓名 / 账号</span><strong>${record.nickname} (${record.phone})</strong></div>
      <div class="pending-lock-row"><span>平台账号 ID</span><code>${record.accountId}</code></div>
      <div class="pending-lock-row"><span>获取时间</span><span>${record.createdAt}</span></div>
    `;

    openModal("lockSuccessModal");
  }

  lockNumberBtn.addEventListener("click", () => {
    if (selectionMode === "manual" && selectedManualNumbers.length === 0) {
      showToast("请先选择一个可用的 6 位号码");
      return;
    }
    if (!currentUser) {
      openAuthPage("register", { lockAfter: true });
    } else {
      executeLockTicketForUser(currentUser, { isNewRegistration: false });
    }
  });

  headerAccountBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (currentUser) {
      avatarPopover.hidden = !avatarPopover.hidden;
    } else {
      openAuthPage("login", { lockAfter: false });
    }
  });

  popoverTicketsBtn.addEventListener("click", () => {
    avatarPopover.hidden = true;
    openMyTicketsModal();
  });

  if (copyPopoverNameBtn) {
    copyPopoverNameBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!currentUser) return;
      copyTextToClipboard(currentUser.phone || currentUser.nickname, copyPopoverNameBtn, "账号");
    });
  }

  if (copyPopoverUidBtn) {
    copyPopoverUidBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!currentUser) return;
      copyTextToClipboard(currentUser.accountId, copyPopoverUidBtn, "ID");
    });
  }

  popoverLogoutBtn.addEventListener("click", () => {
    avatarPopover.hidden = true;
    saveCurrentUser(null);
    renderAuthAndCtaState();
    showToast("已退出平台账号");
  });

  document.addEventListener("click", (e) => {
    if (!headerAccountWrap.contains(e.target)) {
      avatarPopover.hidden = true;
    }
  });

  // ===========================
  // 我的抽奖号码弹窗（展示当前登录账号号码及开奖中奖状态）
  // ===========================
  function formatDaysAgoTimestamp(daysAgo, hms = "12:00:00") {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    const pad = (v) => String(v).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${hms}`;
  }

  function buildExtraShowcaseTickets(user) {
    return [
      {
        recordId: "SHOWCASE-WON-01",
        round: "第 202601 期",
        firstPrize: "2025款 本田 Fan 160 摩托车",
        accountId: user.accountId,
        phone: user.phone,
        nickname: user.nickname || user.phone,
        number: "668427",
        mode: "系统随机分配",
        payInfo: "免费领号",
        payMethod: "免费",
        status: "有效",
        drawStatus: "中奖",
        winningNumber: "668427",
        createdAt: formatDaysAgoTimestamp(1, "19:22:08")
      },
      {
        recordId: "SHOWCASE-LOST-02",
        round: "第 202512 期",
        firstPrize: "2025款 本田 Fan 160 摩托车",
        accountId: user.accountId,
        phone: user.phone,
        nickname: user.nickname || user.phone,
        number: "041826",
        mode: "手动选择号码",
        payInfo: "付费购号 $1 / 1个",
        payMethod: "PIX 快捷支付",
        status: "有效",
        drawStatus: "未中奖",
        winningNumber: "088219",
        createdAt: formatDaysAgoTimestamp(18, "16:06:20")
      },
      {
        recordId: "SHOWCASE-LOST-03",
        round: "第 202511 期",
        firstPrize: "2025款 本田 Fan 160 摩托车",
        accountId: user.accountId,
        phone: user.phone,
        nickname: user.nickname || user.phone,
        number: "039512",
        mode: "系统随机分配",
        payInfo: "免费领号",
        payMethod: "免费",
        status: "有效",
        drawStatus: "未中奖",
        winningNumber: "074105",
        createdAt: formatDaysAgoTimestamp(48, "20:15:40")
      }
    ];
  }

  function parseRecordDate(str) {
    if (!str) return null;
    const normalized = String(str).trim().replace(" ", "T");
    const d = new Date(normalized);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  function matchesTicketsTime(rec, range) {
    if (!range || range === "all") return true;
    const recDate = parseRecordDate(rec.createdAt);
    if (!recDate) return false;

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);

    if (range === "today") {
      return recDate >= todayStart;
    }
    if (range === "yesterday") {
      const yestStart = new Date(todayStart);
      yestStart.setDate(yestStart.getDate() - 1);
      return recDate >= yestStart && recDate < todayStart;
    }
    if (range === "7d") {
      const start = new Date(todayStart);
      start.setDate(start.getDate() - 6);
      return recDate >= start;
    }
    if (range === "30d") {
      const start = new Date(todayStart);
      start.setDate(start.getDate() - 29);
      return recDate >= start;
    }
    if (range === "2m") {
      const start = new Date(todayStart);
      start.setMonth(start.getMonth() - 2);
      return recDate >= start;
    }
    if (range === "3m") {
      const start = new Date(todayStart);
      start.setMonth(start.getMonth() - 3);
      return recDate >= start;
    }
    return true;
  }

  function matchesTicketsStatus(rec, statusFilter) {
    if (!statusFilter || statusFilter === "all") return true;
    const s = rec.drawStatus || "待开奖";
    if (statusFilter === "中奖") return s === "中奖" || s === "已中奖";
    if (statusFilter === "未中奖") return s === "未中奖";
    if (statusFilter === "待开奖") return s !== "中奖" && s !== "已中奖" && s !== "未中奖";
    return true;
  }

  function syncTicketsFilterButtons() {
    if (ticketsStatusSelect) {
      ticketsStatusSelect.value = ticketsStatusFilter;
    }
    if (ticketsTimeSelect) {
      ticketsTimeSelect.value = ticketsTimeFilter;
    }
  }

  if (ticketsSearchBtn) {
    ticketsSearchBtn.addEventListener("click", () => {
      ticketsStatusFilter = ticketsStatusSelect ? ticketsStatusSelect.value : "all";
      ticketsTimeFilter = ticketsTimeSelect ? ticketsTimeSelect.value : "all";
      renderMyTickets();
    });
  }

  if (ticketsResetBtn) {
    ticketsResetBtn.addEventListener("click", () => {
      ticketsStatusFilter = "all";
      ticketsTimeFilter = "all";
      syncTicketsFilterButtons();
      renderMyTickets();
    });
  }

  function getDisplayTicketsForUser(user) {
    if (!user) return [];
    const records = loadRecords().filter(
      (r) => r.accountId === user.accountId || r.phone === user.phone
    );
    const existingNums = new Set(records.map((r) => r.number));
    const extras = buildExtraShowcaseTickets(user).filter((ex) => !existingNums.has(ex.number));
    return [...records, ...extras];
  }

  function getDrawStatusBadge(rec) {
    const raw = rec.drawStatus || "待开奖";
    if (raw === "中奖" || raw === "已中奖") {
      return `
        <span class="order-status-pill order-status-pill--won">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="#fffbeb" aria-hidden="true">
            <path d="M19 4h-2V3a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v1H5a1 1 0 0 0-1 1v2a5 5 0 0 0 4.08 4.91A5.01 5.01 0 0 0 11 14.9V17H8a1 1 0 0 0-1 1v2h10v-2a1 1 0 0 0-1-1h-3v-2.1a5.01 5.01 0 0 0 2.92-2.99A5 5 0 0 0 20 7V5a1 1 0 0 0-1-1ZM6 7V6h1v3.83A3 3 0 0 1 6 7Zm12 0a3 3 0 0 1-1 2.83V6h1Z"/>
          </svg>
          <span>中奖</span>
        </span>
      `;
    }
    if (raw === "未中奖") {
      return `<span class="order-status-pill order-status-pill--lost">未中奖</span>`;
    }
    return `<span class="order-status-pill order-status-pill--pending">${raw}</span>`;
  }

  function renderTicketsStats(list) {
    if (!ticketsModalStats) return;
    const total = list.length;
    let won = 0;
    let lost = 0;
    let pending = 0;
    list.forEach((rec) => {
      const s = rec.drawStatus || "待开奖";
      if (s === "中奖" || s === "已中奖") {
        won += 1;
      } else if (s === "未中奖") {
        lost += 1;
      } else {
        pending += 1;
      }
    });
    ticketsModalStats.innerHTML = `
      <span>总数：<strong>${total}</strong></span>
      <span>待开奖：<strong>${pending}</strong></span>
      <span>未中奖：<strong>${lost}</strong></span>
      <span class="tickets-stat-won">中奖：<strong>${won}</strong></span>
    `;
  }

  function renderMyTickets() {
    if (!currentUser) {
      if (ticketsFilterBar) ticketsFilterBar.hidden = true;
      renderTicketsStats([]);
      lookupResultArea.innerHTML = `
        <div class="helper-card">
          <span class="helper-card-icon" aria-hidden="true">🔐</span>
          <div>
            <h4>请先登录查看您的号码</h4>
            <p>登录平台账号后，即可在此查看您已锁定的抽奖号码、获得时间及开奖中奖状态。</p>
          </div>
        </div>
        <button type="button" class="btn-green-full empty-tickets-action" id="ticketsGoLoginBtn">立即登录 / 注册</button>
      `;
      const goLoginBtn = document.getElementById("ticketsGoLoginBtn");
      if (goLoginBtn) {
        goLoginBtn.addEventListener("click", () => {
          closeModal("ticketsModal");
          openAuthPage("login", { lockAfter: false });
        });
      }
      return;
    }

    if (ticketsFilterBar) ticketsFilterBar.hidden = false;
    syncTicketsFilterButtons();

    const allTickets = getDisplayTicketsForUser(currentUser);
    const timeFiltered = allTickets.filter((rec) => matchesTicketsTime(rec, ticketsTimeFilter));
    renderTicketsStats(timeFiltered);

    if (allTickets.length === 0) {
      lookupResultArea.innerHTML = `
        <div class="helper-card">
          <span class="helper-card-icon" aria-hidden="true">🎟️</span>
          <div>
            <h4>您暂未领取本期号码</h4>
            <p>返回首页手动选号或使用系统随机分配，点击「立即锁定号码」即可免费领取您的专属号码。</p>
          </div>
        </div>
        <button type="button" class="btn-green-full empty-tickets-action" id="ticketsGoPickBtn">前往免费选号</button>
      `;
      const goPickBtn = document.getElementById("ticketsGoPickBtn");
      if (goPickBtn) {
        goPickBtn.addEventListener("click", () => {
          closeModal("ticketsModal");
          document.getElementById("selectionArea").scrollIntoView({ behavior: "smooth" });
        });
      }
      return;
    }

    const matched = timeFiltered.filter((rec) => matchesTicketsStatus(rec, ticketsStatusFilter));

    if (matched.length === 0) {
      lookupResultArea.innerHTML = `
        <div class="tickets-empty-filter">
          <p>当前筛选条件下暂无符合的抽奖号码</p>
          <button type="button" class="tickets-reset-btn" id="resetTicketsFilterBtn">重置筛选</button>
        </div>
      `;
      const resetBtn = document.getElementById("resetTicketsFilterBtn");
      if (resetBtn) {
        resetBtn.addEventListener("click", () => {
          ticketsStatusFilter = "all";
          ticketsTimeFilter = "all";
          syncTicketsFilterButtons();
          renderMyTickets();
        });
      }
      return;
    }

    function resolvePayMethod(rec) {
      if (rec.payMethod) return rec.payMethod;
      const info = String(rec.payInfo || "");
      if (info.includes("PIX")) return "PIX 快捷支付";
      if (info.includes("平台余额") || info.includes("付费")) return "平台余额支付";
      return "免费";
    }

    lookupResultArea.innerHTML = matched
      .map((rec) => {
        const isWon = rec.drawStatus === "中奖" || rec.drawStatus === "已中奖";
        const isLost = rec.drawStatus === "未中奖";
        const drawNum = rec.winningNumber || "088219";
        const cleanPayInfo = String(rec.payInfo || "免费领号").replace(/（[^）]*支付[^）]*）/g, "");
        const payMethodText = resolvePayMethod(rec);
        const roundName = rec.round || "第 202601 期";
        const soldList = getSoldNumbersForRound(roundName);
        const previewSold = soldList.slice(0, 8);
        const overflowCount = Math.max(0, soldList.length - previewSold.length);
        return `
          <div class="order-record-card ${isWon ? "order-record-card--won" : ""}">
            <div class="order-record-head">
              <div class="order-record-title-wrap">
                <span class="order-record-title">我的号码：${rec.number}</span>
                <button type="button" class="copy-inline-btn" data-copy-val="${rec.number}" data-copy-label="我的号码" aria-label="复制我的号码 ${rec.number}">
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <rect x="9" y="9" width="13" height="13" rx="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  <span>复制</span>
                </button>
              </div>
              ${getDrawStatusBadge(rec)}
            </div>
            <div class="order-record-meta">
              <div class="order-meta-line">
                <span>活动期次：本田 Fan 160 2025（${roundName}）</span>
              </div>
              <div class="order-meta-line">
                <span>活动奖品：<span class="order-meta-value">${rec.firstPrize || "2025款 本田 Fan 160 摩托车"}</span></span>
              </div>
              ${
                isLost
                  ? `<div class="order-meta-line"><span>开奖号码：</span><span class="draw-number-pill">${drawNum}</span></div>`
                  : ""
              }
              <div class="order-meta-line">
                <span>获取方式：${rec.mode} · ${cleanPayInfo}</span>
              </div>
              <div class="order-meta-line">
                <span>支付方式：<span class="order-meta-value">${payMethodText}</span></span>
              </div>
              <div class="order-meta-line">
                <span>获得时间：${rec.createdAt}</span>
              </div>
            </div>
            <div class="card-sold-box">
              <div class="card-sold-head">
                <span class="card-sold-label">已售号码（最近）</span>
                <button type="button" class="card-detail-btn" data-open-round-detail="${rec.recordId}">
                  <span>详情</span>
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <polyline points="9 6 15 12 9 18" />
                  </svg>
                </button>
              </div>
              <div class="card-sold-pills">
                ${previewSold
                  .map((num) => `<span class="sold-num-pill ${num === rec.number ? "is-mine" : ""}">${num}</span>`)
                  .join("")}
                ${overflowCount > 0 ? `<span class="sold-num-more">+${overflowCount}</span>` : ""}
              </div>
            </div>
          </div>
        `;
      })
      .join("");

    lookupResultArea.querySelectorAll("[data-copy-val]").forEach((btn) => {
      btn.addEventListener("click", () =>
        copyTextToClipboard(btn.dataset.copyVal, btn, btn.dataset.copyLabel || "内容")
      );
    });

    lookupResultArea.querySelectorAll("[data-open-round-detail]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = matched.find((r) => r.recordId === btn.dataset.openRoundDetail);
        if (target) openRoundDetailPage(target);
      });
    });
  }

  // ===========================
  // 本期已售号码生成 & 详情页（全屏 H5 页面）
  // ===========================
  const ROUND_BASE_SOLD = {
    "第 202601 期": ["016521", "036002", "036114", "040913", "060867", "062499", "086877", "100258"],
    "第 202512 期": ["014702", "028915", "041826", "053410", "067821", "074932", "088219", "095104"],
    "第 202511 期": ["009841", "021536", "039512", "048275", "061904", "074105", "083620", "091748"]
  };

  function getSoldNumbersForRound(roundName) {
    const round = roundName || "第 202601 期";
    const set = new Set();
    const list = [];

    // 1. 先放入本期真实记录号码（最新在前，便于卡片预览实时看到刚购买的号码）
    loadRecords().forEach((r) => {
      const rRound = r.round || "第 202601 期";
      if (rRound === round && r.status === "有效" && r.number && !set.has(r.number)) {
        set.add(r.number);
        list.push(r.number);
      }
    });

    // 2. 放入当前登录用户本期的演示号码
    if (currentUser) {
      buildExtraShowcaseTickets(currentUser).forEach((ex) => {
        if ((ex.round || "第 202601 期") === round && ex.number && !set.has(ex.number)) {
          set.add(ex.number);
          list.push(ex.number);
        }
      });
    }

    // 3. 放入参考风格基础最近已售号码
    const baseList = ROUND_BASE_SOLD[round] || ROUND_BASE_SOLD["第 202601 期"];
    baseList.forEach((n) => {
      if (!set.has(n)) {
        set.add(n);
        list.push(n);
      }
    });

    // 4. 确定性补齐至 100 个本期已售号码（每次打开顺序稳定）
    let seed = 0;
    for (let i = 0; i < round.length; i += 1) {
      seed = (seed * 31 + round.charCodeAt(i)) % 9973;
    }
    let cur = (seed * 137 + 14713) % 99991;
    while (list.length < 100) {
      cur = (cur * 1103 + 7919) % 99991;
      const fmt = formatNumber6((cur % TOTAL_POOL) + 1);
      if (!set.has(fmt)) {
        set.add(fmt);
        list.push(fmt);
      }
    }

    return list;
  }

  const closeRoundDetailBtn = document.getElementById("closeRoundDetailBtn");
  const detailSupportBtn = document.getElementById("detailSupportBtn");
  const detailHeroEmoji = document.getElementById("detailHeroEmoji");
  const detailHeroTitle = document.getElementById("detailHeroTitle");
  const detailHeroSub = document.getElementById("detailHeroSub");
  const detailHeroTime = document.getElementById("detailHeroTime");
  const detailHeroRef = document.getElementById("detailHeroRef");
  const detailSoldTotalBadge = document.getElementById("detailSoldTotalBadge");
  const detailBuyStatusTag = document.getElementById("detailBuyStatusTag");
  const detailBuyPrize = document.getElementById("detailBuyPrize");
  const detailQtyMinus = document.getElementById("detailQtyMinus");
  const detailQtyPlus = document.getElementById("detailQtyPlus");
  const detailQtyInput = document.getElementById("detailQtyInput");
  const detailBuyNowBtn = document.getElementById("detailBuyNowBtn");
  const detailBuyBtnText = document.getElementById("detailBuyBtnText");
  const detailDrawStatusCard = document.getElementById("detailDrawStatusCard");
  const detailInfoList = document.getElementById("detailInfoList");
  const detailSoldSearchInput = document.getElementById("detailSoldSearchInput");
  const detailAllCountBadge = document.getElementById("detailAllCountBadge");
  const detailAllSoldGrid = document.getElementById("detailAllSoldGrid");

  function getDetailUnitPrice(qty) {
    const tiers = loadPaidTiers();
    const exact = tiers.find((t) => Number(t.qty) === Number(qty));
    if (exact) return Number(exact.price);
    const base = tiers[0] && Number(tiers[0].qty) > 0 ? Number(tiers[0].price) / Number(tiers[0].qty) : 1;
    return Number((qty * base).toFixed(2));
  }

  function updateDetailBuyButton() {
    detailBuyQty = Math.max(1, Math.min(200, Number(detailBuyQty) || 1));
    if (detailQtyInput) detailQtyInput.value = String(detailBuyQty);
    const totalPrice = getDetailUnitPrice(detailBuyQty);
    if (detailBuyBtnText) {
      detailBuyBtnText.textContent = `立即购买（$${totalPrice.toFixed(2)}）`;
    }
  }

  function renderDetailSoldGrid() {
    if (!currentDetailRecord || !detailAllSoldGrid) return;
    const roundName = currentDetailRecord.round || "第 202601 期";
    const allSold = getSoldNumbersForRound(roundName);
    const kw = (detailSoldSearchInput ? detailSoldSearchInput.value : "").trim();
    const filtered = kw ? allSold.filter((n) => n.includes(kw)) : allSold;

    const myNums = new Set(
      currentUser
        ? getDisplayTicketsForUser(currentUser)
            .filter((r) => (r.round || "第 202601 期") === roundName)
            .map((r) => r.number)
        : [currentDetailRecord.number]
    );

    if (detailSoldTotalBadge) detailSoldTotalBadge.textContent = String(allSold.length);
    if (detailAllCountBadge) {
      detailAllCountBadge.textContent = kw ? `匹配 ${filtered.length} / ${allSold.length} 个` : `共 ${allSold.length} 个`;
    }

    if (filtered.length === 0) {
      detailAllSoldGrid.innerHTML = `<div class="detail-grid-empty">未在本期已售号码中找到「${kw}」</div>`;
      return;
    }

    detailAllSoldGrid.innerHTML = filtered
      .map(
        (num) =>
          `<span class="detail-grid-pill ${myNums.has(num) ? "is-mine" : ""}" title="${
            myNums.has(num) ? "我的号码" : "已售号码"
          }">${num}</span>`
      )
      .join("");
  }

  function renderRoundDetailPage() {
    if (!currentDetailRecord) return;
    const rec = currentDetailRecord;
    const roundName = rec.round || "第 202601 期";
    const prizeText = rec.firstPrize || "2025款 本田 Fan 160 摩托车";
    const isWon = rec.drawStatus === "中奖" || rec.drawStatus === "已中奖";
    const isLost = rec.drawStatus === "未中奖";
    const drawNum = rec.winningNumber || "088219";
    const payMethodText = rec.payMethod || (String(rec.payInfo || "").includes("PIX") ? "PIX 快捷支付" : String(rec.payInfo || "").includes("付费") ? "平台余额支付" : "免费");
    const allSold = getSoldNumbersForRound(roundName);

    if (detailHeroEmoji) detailHeroEmoji.textContent = isWon ? "🏆" : isLost ? "📋" : "🎉";
    if (detailHeroTitle) detailHeroTitle.textContent = `本田 Fan 160 2025（${roundName}）`;
    if (detailHeroSub) {
      detailHeroSub.textContent = isWon
        ? `恭喜中奖！我的号码 ${rec.number}`
        : isLost
        ? `本期已开奖 · 开奖号码 ${drawNum}`
        : `活动进行中 · 祝您好运！`;
    }
    if (detailHeroTime) detailHeroTime.textContent = rec.createdAt || "--";
    if (detailHeroRef) detailHeroRef.textContent = rec.recordId || "REC-202601";
    if (detailBuyStatusTag) detailBuyStatusTag.textContent = isLost || isWon ? "下期火热开启 · 立即抢购" : "本期火热销售中";
    if (detailBuyPrize) detailBuyPrize.textContent = `一等奖：${prizeText}`;

    if (detailDrawStatusCard) {
      if (isWon) {
        detailDrawStatusCard.className = "detail-draw-card detail-draw-card--won";
        detailDrawStatusCard.innerHTML = `
          <span class="detail-draw-icon" aria-hidden="true">🏆</span>
          <div class="detail-draw-content">
            <h4>恭喜中奖！号码 ${rec.number} 已中奖</h4>
            <p>您已中得本期活动奖项（第一名奖品：${prizeText}），官方客服将通过平台实名渠道联系您核验领奖。</p>
          </div>
        `;
      } else if (isLost) {
        detailDrawStatusCard.className = "detail-draw-card detail-draw-card--lost";
        detailDrawStatusCard.innerHTML = `
          <span class="detail-draw-icon" aria-hidden="true">😔</span>
          <div class="detail-draw-content">
            <h4>本期暂未中奖（开奖号码：${drawNum}）</h4>
            <p>您的号码 ${rec.number} 本期未中奖，您可以直接在上方购买更多号码参与最新期次，大幅提升中奖概率！</p>
          </div>
        `;
      } else {
        detailDrawStatusCard.className = "detail-draw-card";
        detailDrawStatusCard.innerHTML = `
          <span class="detail-draw-icon" aria-hidden="true">⏳</span>
          <div class="detail-draw-content">
            <h4>本期火热进行中 · 满额即锁池开奖</h4>
            <p>您的专属号码 <strong>${rec.number}</strong> 已生效锁定。可继续通过上方快捷购买更多号码，增加中奖机会。</p>
          </div>
        `;
      }
    }

    if (detailInfoList) {
      detailInfoList.innerHTML = `
        <div class="detail-info-row"><span>活动期次</span><strong>本田 Fan 160 2025（${roundName}）</strong></div>
        <div class="detail-info-row"><span>活动奖品（第一名）</span><strong>${prizeText}</strong></div>
        <div class="detail-info-row"><span>我的号码</span><strong style="color:#15803d;">${rec.number}</strong></div>
        <div class="detail-info-row"><span>支付方式</span><strong>${payMethodText}</strong></div>
        <div class="detail-info-row"><span>本期已售号码数</span><strong>${allSold.length} 个（深绿高亮为本人号码）</strong></div>
      `;
    }

    updateDetailBuyButton();
    renderDetailSoldGrid();
  }

  function openRoundDetailPage(rec) {
    currentDetailRecord = rec;
    detailBuyQty = 2;
    if (detailSoldSearchInput) detailSoldSearchInput.value = "";
    renderRoundDetailPage();
    openModal("roundDetailPageModal");
  }

  if (closeRoundDetailBtn) {
    closeRoundDetailBtn.addEventListener("click", () => closeModal("roundDetailPageModal"));
  }
  if (detailSupportBtn) {
    detailSupportBtn.addEventListener("click", () => openModal("supportModal"));
  }
  document.querySelectorAll("[data-detail-add]").forEach((btn) => {
    btn.addEventListener("click", () => {
      detailBuyQty = Math.min(200, (Number(detailBuyQty) || 0) + Number(btn.dataset.detailAdd));
      updateDetailBuyButton();
    });
  });
  if (detailQtyMinus) {
    detailQtyMinus.addEventListener("click", () => {
      detailBuyQty = Math.max(1, (Number(detailBuyQty) || 1) - 1);
      updateDetailBuyButton();
    });
  }
  if (detailQtyPlus) {
    detailQtyPlus.addEventListener("click", () => {
      detailBuyQty = Math.min(200, (Number(detailBuyQty) || 1) + 1);
      updateDetailBuyButton();
    });
  }
  if (detailQtyInput) {
    detailQtyInput.addEventListener("input", () => {
      const cleaned = detailQtyInput.value.replace(/[^\d]/g, "");
      detailBuyQty = Math.max(1, Math.min(200, parseInt(cleaned, 10) || 1));
      updateDetailBuyButton();
    });
  }
  if (detailSoldSearchInput) {
    detailSoldSearchInput.addEventListener("input", renderDetailSoldGrid);
  }
  if (detailBuyNowBtn) {
    detailBuyNowBtn.addEventListener("click", () => {
      if (!currentUser) {
        closeModal("roundDetailPageModal");
        closeModal("ticketsModal");
        openAuthPage("login", { lockAfter: false });
        return;
      }
      const qty = Math.max(1, Math.min(200, Number(detailBuyQty) || 1));
      const price = getDetailUnitPrice(qty);
      const round = (currentDetailRecord && currentDetailRecord.round) || "第 202601 期";
      openPayConfirmModal(currentUser, {
        isNewRegistration: false,
        customOrder: { qty, price, round, fromDetailPage: true }
      });
    });
  }

  function openMyTicketsModal() {
    renderMyTickets();
    openModal("ticketsModal");
  }

  openTicketsBtn.addEventListener("click", openMyTicketsModal);
  openMyTicketsFromSuccessBtn.addEventListener("click", () => {
    closeModal("lockSuccessModal");
    closeModal("roundDetailPageModal");
    openMyTicketsModal();
  });

  // ===========================
  // 幸运中奖号码公示渲染
  // ===========================
  function renderPrizeList() {
    const wonCount = PRIZE_TICKETS.filter((item) => item.won).length;
    prizesCountBadge.textContent = `${wonCount}/${PRIZE_TICKETS.length}`;

    prizesList.innerHTML = PRIZE_TICKETS.map((item) => {
      if (item.won) {
        return `
          <li class="prize-row prize-row--won">
            <div class="winner-left">
              <span class="winner-trophy-circle" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="#f5b82e">
                  <path d="M19 4h-2V3a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v1H5a1 1 0 0 0-1 1v2a5 5 0 0 0 4.08 4.91A5.01 5.01 0 0 0 11 14.9V17H8a1 1 0 0 0-1 1v2h10v-2a1 1 0 0 0-1-1h-3v-2.1a5.01 5.01 0 0 0 2.92-2.99A5 5 0 0 0 20 7V5a1 1 0 0 0-1-1ZM6 7V6h1v3.83A3 3 0 0 1 6 7Zm12 0a3 3 0 0 1-1 2.83V6h1Z"/>
                </svg>
              </span>
              <div class="winner-info">
                <span class="winner-name">${item.winnerName}</span>
                <span class="winner-prize">${item.prize}</span>
              </div>
            </div>
            <div class="winner-ticket" title="中奖号码 ${item.number}">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
                <path d="M22 10V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v4a2 2 0 0 1 0 4v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 1 0-4Z"/>
              </svg>
              <span>${item.number}</span>
            </div>
          </li>
        `;
      }
      return `
        <li class="prize-row">
          <div class="prize-row-left">
            <span class="prize-number">${item.number}</span>
            <span class="prize-status">暂未开出</span>
          </div>
          <span class="prize-value">${item.prize}</span>
        </li>
      `;
    }).join("");
  }

  // ===========================
  // 弹窗管理与其他按钮
  // ===========================
  function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.hidden = true;
    const anyOpen = Array.from(document.querySelectorAll(".modal-backdrop")).some((el) => !el.hidden);
    if (!anyOpen) {
      document.body.style.overflow = "";
    }
  }

  function openInfoModal({ icon = "ℹ️", title, sub, paragraphs }) {
    infoModalIcon.textContent = icon;
    infoModalTitle.textContent = title;
    infoModalSub.textContent = sub;
    infoModalBody.innerHTML = paragraphs.map((text) => `<p>${text}</p>`).join("");
    openModal("infoModal");
  }

  document.querySelectorAll("[data-close-modal]").forEach((btn) => {
    btn.addEventListener("click", () => closeModal(btn.dataset.closeModal));
  });

  document.querySelectorAll(".modal-backdrop").forEach((backdrop) => {
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop && backdrop.id !== "authPageModal" && backdrop.id !== "roundDetailPageModal") {
        closeModal(backdrop.id);
      }
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      // 优先关闭上层小弹窗，再关闭全屏详情页 / 登录注册页
      const topIds = ["lockSuccessModal", "payConfirmModal", "infoModal", "supportModal", "rulesModal", "roundDetailPageModal", "ticketsModal", "authPageModal"];
      for (const id of topIds) {
        const el = document.getElementById(id);
        if (el && !el.hidden) {
          closeModal(id);
          break;
        }
      }
    }
  });

  openSupportBtn.addEventListener("click", () => openModal("supportModal"));
  openRulesBtn.addEventListener("click", () => openModal("rulesModal"));
  footerRulesBtn.addEventListener("click", () => openModal("rulesModal"));

  openAttributionInfoBtn.addEventListener("click", () => {
    openInfoModal({
      icon: "🔗",
      title: "注册与博主渠道归因说明",
      sub: `当前活动：${ACTIVITY_ID} · 博主：${CURRENT_KOL_ID}`,
      paragraphs: [
        "1. 活动页不单独建号，点击「立即锁定号码」将直跳平台现有前台注册/登录页，账号直接落库至平台后台。",
        "2. 同一新账号仅归属归因窗口内最后一次有效博主来源且仅计一次有效注册；老账号登录或重复提交不计入新增转化。"
      ]
    });
  });

  openSelfExclusionBtn.addEventListener("click", () => {
    openInfoModal({
      icon: "🛡️",
      title: "自我排除机制",
      sub: "理性参与保护说明",
      paragraphs: [
        "本活动免费参与，无需支付任何购号费用。",
        "如您希望暂停参与平台推广活动，可随时联系官方在线客服申请账户参与限制。"
      ]
    });
  });

  function openSafeCheck() {
    openInfoModal({
      icon: "🔒",
      title: "Google 安全浏览核验",
      sub: "HTTPS 加密连接 · 官方合作平台",
      paragraphs: [
        "安全状态：已通过安全检测，无恶意重定向与钓鱼风险。",
        "注册与账号数据均由官方合作平台加密处理，请放心使用。"
      ]
    });
  }

  safeBadgeBtn.addEventListener("click", openSafeCheck);
  safeBadgeBtn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openSafeCheck();
    }
  });

  // 顶部导航栏滚动变黑
  function handleScroll() {
    if (window.scrollY > 36) {
      siteHeader.classList.add("is-scrolled");
    } else {
      siteHeader.classList.remove("is-scrolled");
    }
  }

  window.addEventListener("scroll", handleScroll, { passive: true });

  // 初始化渲染
  renderCurrencyDropdown();
  renderProgress();
  renderPrizeList();
  setLotteryMode(lotteryMode);
  handleScroll();
})();
