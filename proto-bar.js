(() => {
  const scriptEl = document.currentScript;
  const currentClient = (scriptEl && scriptEl.dataset.client) || "h5"; // "h5" | "admin"
  const params = new URLSearchParams(window.location.search);
  let currentMode = params.get("view") === "prd" ? "prd" : "proto";

  document.body.classList.add("has-proto-bar");

  // 1. 渲染顶部导航栏
  const bar = document.createElement("div");
  bar.className = "proto-top-bar";
  bar.setAttribute("role", "navigation");
  bar.setAttribute("aria-label", "原型切换导航");

  bar.innerHTML = `
    <div class="proto-bar-left">
      <a href="index.html" class="proto-back-btn" aria-label="返回包网需求清单">
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        <span>返回</span>
      </a>
    </div>

    <div class="proto-bar-center">
      <div class="proto-bar-group" aria-label="端切换">
        <a href="h5.html" class="proto-nav-pill ${currentClient === "h5" ? "is-active" : ""}" data-client-link="h5">H5</a>
        <a href="admin.html" class="proto-nav-pill ${currentClient === "admin" ? "is-active" : ""}" data-client-link="admin">站点后台</a>
      </div>

      <span class="proto-bar-sep" aria-hidden="true"></span>

      <div class="proto-bar-group" aria-label="原型与PRD切换">
        <button type="button" class="proto-nav-pill" id="protoModeBtn">查看原型</button>
        <button type="button" class="proto-nav-pill" id="prdModeBtn">查看PRD</button>
      </div>
    </div>
  `;

  document.body.insertBefore(bar, document.body.firstChild);

  // 2. 渲染内置 PRD 文档阅读面板（与需求评审稿一致）
  const prdOverlay = document.createElement("div");
  prdOverlay.className = "prd-viewer-overlay";
  prdOverlay.id = "prdViewerOverlay";
  prdOverlay.hidden = true;
  prdOverlay.innerHTML = `
    <article class="prd-doc-card">
      <header class="prd-doc-header">
        <h1>编号抽奖活动与博主推广结算（PRD）</h1>
        <div class="prd-meta-tags">
          <span class="prd-meta-tag">版本 v0.2 · 需求评审稿</span>
          <span class="prd-meta-tag">日期：2026-11-18</span>
          <span class="prd-meta-tag">关联端：H5 端 / 站点后台</span>
        </div>
      </header>

      <h2>1. 背景与范围</h2>
      <p>
        客户希望通过博主推广活动页，用户参与后获得抽奖号码，能查看活动进度与中奖号码。平台需要识别博主带来的有效注册，供运营和财务对账结算。现有落地页创建的账号无法同步至平台后台，因此已明确要求：用户在活动页点击锁定号码走注册流程时，直接打开现有前台注册页，由平台完成账号创建与渠道归因。
      </p>

      <h2>2. 核心业务流程</h2>
      <h3>2.1 用户参加抽奖（H5 端）</h3>
      <div class="prd-flow-box">
        <div class="prd-flow-steps">
          <span class="prd-flow-node">通过博主专属链接进入活动页</span>
          <span class="prd-flow-arrow">→</span>
          <span class="prd-flow-node">免费手动选号 / 系统随机分配</span>
          <span class="prd-flow-arrow">→</span>
          <span class="prd-flow-node prd-flow-node--highlight">点击「立即锁定号码」走注册 / 登录</span>
          <span class="prd-flow-arrow">→</span>
          <span class="prd-flow-node">回跳并确认发放唯一号码</span>
          <span class="prd-flow-arrow">→</span>
          <span class="prd-flow-node">实时更新进度（有效数 ÷ 总量）</span>
          <span class="prd-flow-arrow">→</span>
          <span class="prd-flow-node">满 100% 锁池进入待开奖 → 开奖公示</span>
        </div>
      </div>

      <h3>2.2 博主归因与推广结算（站点后台）</h3>
      <div class="prd-flow-box">
        <div class="prd-flow-steps">
          <span class="prd-flow-node">博主专属链接携带 activity_id &amp; kol_id</span>
          <span class="prd-flow-arrow">→</span>
          <span class="prd-flow-node prd-flow-node--highlight">平台前台成功创建新账号</span>
          <span class="prd-flow-arrow">→</span>
          <span class="prd-flow-node">窗口内末次有效来源归因（同账号仅计一次）</span>
          <span class="prd-flow-arrow">→</span>
          <span class="prd-flow-node">有效注册条件与风控排除校验</span>
          <span class="prd-flow-arrow">→</span>
          <span class="prd-flow-node">汇总生成待核对结算单</span>
          <span class="prd-flow-arrow">→</span>
          <span class="prd-flow-node">财务审核锁定 → 付款登记凭证</span>
        </div>
      </div>

      <h2>3. 业务规则与验收标准（R01 – R07）</h2>

      <h3>R01 注册跳转</h3>
      <ul>
        <li><span class="prd-badge-ok">已确认</span>活动页注册入口直跳现有平台前台注册页，由现有注册流程完成账号创建；平台账号 ID 关联活动参与记录与渠道转化记录。</li>
        <li><span class="prd-badge-suggest">建议</span>跳转携带活动和博主渠道标识并持久化；渠道无效时允许注册但记为无有效来源。</li>
        <li><span class="prd-badge-accept">验收</span>正常完成注册后台可查账号；取消或失败时不产生有效注册。</li>
      </ul>

      <h3>R02 号码发放与查询</h3>
      <ul>
        <li><span class="prd-badge-ok">当前方案</span>无需购买，支持用户手动选择 6 位号码或系统随机分配；每个有效号码仅归属一笔参与记录，重复提交幂等返回原结果。</li>
        <li><span class="prd-badge-suggest">建议</span>用户端「我的抽奖号码」展示本人号码、账号、账号 ID（均支持复制）、获得时间与开奖中奖状态（待开奖 / 已中奖 / 未中奖）；后台支持按期次、账号 ID、号码及状态（待确认/有效/作废）查询与作废留痕。</li>
        <li><span class="prd-badge-accept">验收</span>用户端与后台记录一致；并发请求不会分配重复号码；池满及失败时进度一致。</li>
      </ul>

      <h3>R03 活动进度与满额</h3>
      <ul>
        <li><span class="prd-badge-suggest">建议</span>进度 = 本期有效号码数 ÷ 可发放总数 × 100%，前台同步展示「已发放 / 总量」；取整不得使未满额显示为 100%。</li>
        <li><span class="prd-badge-suggest">建议</span>实际有效号码数达总量即关闭新参与并锁定有效号码清单，进入「待开奖」；满额前作废的号码从进度扣除。</li>
      </ul>

      <h3>R04 开奖与公示</h3>
      <ul>
        <li><span class="prd-badge-suggest">建议</span>活动状态依次为：草稿 → 进行中 → 待开奖 → 已开奖（取消为独立终止状态）。未达开奖条件不可开奖，重复触发沿用既有结果。</li>
        <li><span class="prd-badge-accept">验收</span>后台留存规则版本、开奖方式、结果依据与操作记录，结果入库后前台按期次公示。</li>
      </ul>

      <h3>R05 后台配置与权限</h3>
      <table class="prd-table">
        <thead>
          <tr>
            <th style="width:140px;">配置模块</th>
            <th>字段与核心操作</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>活动基础</td><td>活动名称、期次、主办方、活动说明、规则、开始及截止时间、奖品、领奖说明、发布状态</td></tr>
          <tr><td>号码与开奖</td><td>号码范围及位数、参与资格、发放数量及上限、进度展示、开奖条件与方式、结果查看与公示</td></tr>
          <tr><td>博主渠道</td><td>博主标识、专属活动链接、渠道状态、生效时间、归因与注册转化明细</td></tr>
          <tr><td>推广结算</td><td>结算周期、币种、计费口径、费率生效区间、结算明细、审核确认、调账及付款凭证记录</td></tr>
        </tbody>
      </table>
      <ul>
        <li><span class="prd-badge-suggest">建议</span>运营配置活动和渠道，授权人员操作开奖，财务审核结算并登记付款；越权账号拦截并全量记录审计日志。</li>
      </ul>

      <h3>R06 博主归因</h3>
      <ul>
        <li><span class="prd-badge-suggest">建议</span>点击量、注册成功量和有效注册量分别展示；同一账号同一次新注册只归属窗口内最后一次有效博主来源，老账号登录不计新增注册。</li>
      </ul>

      <h3>R07 博主结算</h3>
      <ul>
        <li><span class="prd-badge-suggest">建议</span>应付金额 = 周期内有效注册计费明细之和 + 经审核调账金额，保留费率版本；状态流转：待核对 → 已确认（锁定）→ 已付款（登记凭证号），支持导出 CSV 对账。</li>
      </ul>

      <h2>4. 评审与上线依赖</h2>
      <ol>
        <li><strong>活动形式披露</strong>：页面明确展示主办方与合作平台关系、免费领号规则及注册去向。</li>
        <li><strong>注册参数对接</strong>：验证现有前台注册页接收并落库 <code>activity_id</code> 与 <code>kol_id</code> 参数。</li>
        <li><strong>开奖与结算口径确认</strong>：由运营与财务确认满额/到期未满策略、有效注册风控口径、费率与结算周期。</li>
      </ol>
    </article>
  `;
  document.body.appendChild(prdOverlay);

  const protoModeBtn = document.getElementById("protoModeBtn");
  const prdModeBtn = document.getElementById("prdModeBtn");

  function syncModeUI() {
    const isPrd = currentMode === "prd";
    protoModeBtn.classList.toggle("is-active", !isPrd);
    prdModeBtn.classList.toggle("is-active", isPrd);
    prdOverlay.hidden = !isPrd;
    document.body.style.overflow = isPrd ? "hidden" : "";
  }

  protoModeBtn.addEventListener("click", () => {
    currentMode = "proto";
    syncModeUI();
  });

  prdModeBtn.addEventListener("click", () => {
    currentMode = "prd";
    syncModeUI();
  });

  syncModeUI();
})();
