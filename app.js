/* ==========================================================================
   巴西企业代办 & 本土店服务 - 交互逻辑 (JavaScript Application)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initCalculator();
});

/**
 * 1. 选项卡切换功能
 */
function initTabs() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const tabPages = document.querySelectorAll('.tab-page');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            // 移除所有 active 状态
            navButtons.forEach(b => b.classList.remove('active'));
            tabPages.forEach(p => p.classList.remove('active'));

            // 激活当前选项
            btn.classList.add('active');
            const page = document.getElementById(targetTab);
            if (page) {
                page.classList.add('active');
            }
        });
    });
}

/**
 * 2. 交互式报价计算器功能
 */
function initCalculator() {
    const basePkgInputs = document.querySelectorAll('input[name="base_pkg"]');
    const addonCheckboxes = document.querySelectorAll('.calc-cb');
    const selectedList = document.getElementById('selected-list');
    const totalUsdElem = document.getElementById('total-usd');
    const totalRmbElem = document.getElementById('total-rmb');
    const grandTotalRmbElem = document.getElementById('grand-total-rmb');
    const resetBtn = document.getElementById('reset-calc');

    const USD_TO_RMB_RATE = 7.2; // 参考计算汇率

    function calculate() {
        let usdSum = 0;
        let rmbSum = 0;
        const selectedItems = [];

        // 基础套餐计算
        basePkgInputs.forEach(input => {
            if (input.checked) {
                const val = parseFloat(input.value) || 0;
                const currency = input.getAttribute('data-currency');
                const name = input.getAttribute('data-name');

                if (currency === 'USD') {
                    usdSum += val;
                    selectedItems.push({ name, priceStr: `$${val.toLocaleString()} USD` });
                } else if (currency === 'RMB') {
                    rmbSum += val;
                    selectedItems.push({ name, priceStr: `￥${val.toLocaleString()} RMB` });
                }
            }
        });

        // 附加选项计算
        addonCheckboxes.forEach(cb => {
            if (cb.checked) {
                const val = parseFloat(cb.value) || 0;
                const currency = cb.getAttribute('data-currency');
                const name = cb.getAttribute('data-name');

                if (currency === 'USD') {
                    usdSum += val;
                    selectedItems.push({ name, priceStr: `$${val.toLocaleString()} USD` });
                } else if (currency === 'RMB') {
                    rmbSum += val;
                    selectedItems.push({ name, priceStr: `￥${val.toLocaleString()} RMB` });
                }
            }
        });

        // 渲染已选列表
        selectedList.innerHTML = '';
        if (selectedItems.length === 0) {
            selectedList.innerHTML = '<div style="color:#94a3b8; text-align:center; padding: 20px;">暂未选择服务</div>';
        } else {
            selectedItems.forEach(item => {
                const row = document.createElement('div');
                row.className = 'selected-row';
                row.innerHTML = `<span>${item.name}</span><strong>${item.priceStr}</strong>`;
                selectedList.appendChild(row);
            });
        }

        // 计算折合总额
        const grandTotalRmb = rmbSum + (usdSum * USD_TO_RMB_RATE);

        // 更新界面
        totalUsdElem.textContent = `$${usdSum.toLocaleString()}`;
        totalRmbElem.textContent = `￥${rmbSum.toLocaleString()}`;
        grandTotalRmbElem.textContent = `￥${Math.round(grandTotalRmb).toLocaleString()}`;
    }

    // 绑定事件监听
    basePkgInputs.forEach(radio => radio.addEventListener('change', calculate));
    addonCheckboxes.forEach(cb => cb.addEventListener('change', calculate));

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            // 重置为默认：第一个单选被选中，其他复选框取消
            if (basePkgInputs.length > 0) basePkgInputs[0].checked = true;
            addonCheckboxes.forEach(cb => cb.checked = false);
            calculate();
        });
    }

    // 初始化计算一次
    calculate();
}

/**
 * 3. 导出 A4 规格 PDF / 打印
 * mode: 'current' (仅导出当前选项卡) 或 'all' (导出手册+报价单全册)
 */
function exportPDF(mode) {
    if (mode === 'all') {
        document.body.classList.add('print-all');
    } else {
        document.body.classList.remove('print-all');
    }
    
    window.print();
    
    setTimeout(() => {
        document.body.classList.remove('print-all');
    }, 1200);
}
