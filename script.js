// script.js - Main application logic with 6 charts and product detail

let currentData = null;
let currentRawData = null;
let compareRawData = null;
let currentType = 'month';
let isLoading = false;

// Store aggregated data for quarter/year views
let currentAggregatedData = null;
let compareAggregatedData = null;

// Chart instances
let categoryComparisonChart = null;
let categoryStructureChart = null;
let topProductsChart = null;
let bottomProductsChart = null;
let topGrowthProductsChart = null;
let bottomGrowthProductsChart = null;

if (typeof ChartDataLabels !== 'undefined') {
    Chart.register(ChartDataLabels);
    Chart.defaults.set('plugins.datalabels', {
        color: '#35495e',
        font: { weight: 'bold', size: 10 },
        anchor: 'end',
        align: 'top',
        formatter: value => {
            if (typeof value === 'number') {
                return formatNumberShort(value);
            }
            return value;
        },
        clamp: true,
        offset: 4,
    });
}

let currentRevenueTotal = 0;
let compareRevenueTotal = 0;

// NPP Mapping
const nppMapping = {
    'NPP Anh Minh HT': { kv: 'KV6', region: 'MB' },
    'NPP Đồng Lợi': { kv: 'KV5', region: 'MB' },
    'NPP Anh Đức (Nghỉ)': { kv: 'KV5', region: 'MB' },
    'NPP Bảo Cường': { kv: 'KV3', region: 'MB' },
    'NPP Bảo Lâm': { kv: 'KV1', region: 'MB' },
    'NPP Công Giang': { kv: 'KV1', region: 'MB' },
    'NPP Cường Thịnh': { kv: 'KV1', region: 'MB' },
    'NPP Duy Anh': { kv: 'KV2', region: 'MB' },
    'NPP Dũng Béo': { kv: 'KV4', region: 'MB' },
    'NPP Dũng Cúc': { kv: 'KV1', region: 'MB' },
    'NPP Dương Minh': { kv: 'KV4', region: 'MB' },
    'NPP Hikoji': { kv: 'KV3', region: 'MB' },
    'NPP Hiền Cường': { kv: 'KV5', region: 'MB' },
    'NPP Hoa Việt': { kv: 'KV2', region: 'MB' },
    'NPP Hoàng Minh': { kv: 'KV5', region: 'MB' },
    'NPP Hà Thanh': { kv: 'KV6', region: 'MB' },
    'NPP Hùng Huệ': { kv: 'KV2', region: 'MB' },
    'NPP Hưng Thịnh': { kv: 'KV4', region: 'MB' },
    'NPP Hải Hằng': { kv: 'KV5', region: 'MB' },
    'NPP Hồng Đức': { kv: 'KV6', region: 'MB' },
    'NPP Linh Trang': { kv: 'KV6', region: 'MB' },
    'NPP Long Châm': { kv: 'KV2', region: 'MB' },
    'NPP Long Hải': { kv: 'KV3', region: 'MB' },
    'NPP Long Liên': { kv: 'KV1', region: 'MB' },
    'NPP Lâm Hạ': { kv: 'KV1', region: 'MB' },
    'NPP Minh Châu': { kv: 'KV6', region: 'MB' },
    'NPP Minh Lộc': { kv: 'KV6', region: 'MB' },
    'NPP Mạnh Hà 1': { kv: 'KV6', region: 'MB' },
    'NPP Mạnh Hà 2': { kv: 'KV6', region: 'MB' },
    'NPP Nguyên Vũ': { kv: 'KV1', region: 'MB' },
    'NPP Nguyễn Đình Hân': { kv: 'KV4', region: 'MB' },
    'NPP Ngọc Kiên': { kv: 'KV2', region: 'MB' },
    'NPP Ngọc Phúc': { kv: 'KV4', region: 'MB' },
    'NPP Ngọc Thêu': { kv: 'KV2', region: 'MB' },
    'NPP Nhung Tùng': { kv: 'KV6', region: 'MB' },
    'NPP Oanh Định': { kv: 'KV5', region: 'MB' },
    'NPP Phong Hiền': { kv: 'KV2', region: 'MB' },
    'NPP Phúc Thịnh': { kv: 'KV2', region: 'MB' },
    'NPP Phương Hà': { kv: 'KV6', region: 'MB' },
    'NPP Phương Đông': { kv: 'KV2', region: 'MB' },
    'NPP Sơn Lâm': { kv: 'KV5', region: 'MB' },
    'NPP Thanh Bình': { kv: 'KV6', region: 'MB' },
    'NPP Thành Hân': { kv: 'KV3', region: 'MB' },
    'NPP Thành Lụa': { kv: 'KV2', region: 'MB' },
    'NPP Thành Thanh': { kv: 'KV6', region: 'MB' },
    'NPP Thái Hoà': { kv: 'KV5', region: 'MB' },
    'NPP Thông Thơm': { kv: 'KV6', region: 'MB' },
    'NPP Thăng Hương': { kv: 'KV4', region: 'MB' },
    'NPP Thảo Nam': { kv: 'KV1', region: 'MB' },
    'NPP Thảo Thắng': { kv: 'KV4', region: 'MB' },
    'NPP Thảo Xuân': { kv: 'KV5', region: 'MB' },
    'NPP Thắng Lợi': { kv: 'KV3', region: 'MB' },
    'NPP Tiên Lan': { kv: 'KV5', region: 'MB' },
    'NPP Tiến Thịnh': { kv: 'KV3', region: 'MB' },
    'NPP Trường Hằng': { kv: 'KV6', region: 'MB' },
    'NPP Tuấn Huyền': { kv: 'KV2', region: 'MB' },
    'NPP Tuấn Huê': { kv: 'KV1', region: 'MB' },
    'NPP Tuấn Vân': { kv: 'KV5', region: 'MB' },
    'NPP Tuấn Yến': { kv: 'KV1', region: 'MB' },
    'NPP Tân Bích An': { kv: 'KV6', region: 'MB' },
    'NPP Tân Hoa': { kv: 'KV3', region: 'MB' },
    'NPP Tân Thúy': { kv: 'KV4', region: 'MB' },
    'NPP Tây Đô': { kv: 'KV3', region: 'MB' },
    'NPP Tùng Phương': { kv: 'KV4', region: 'MB' },
    'NPP Vũ Tấm': { kv: 'KV1', region: 'MB' },
    'NPP Vũ Đức Nam': { kv: 'KV5', region: 'MB' },
    'NPP Ánh Thu': { kv: 'KV4', region: 'MB' },
    'NPP Đức Nam Tiến': { kv: 'KV1', region: 'MB' },
    'NPP Đức Oanh': { kv: 'KV4', region: 'MB' }
};

function getNPPInfo(nppName) {
    return nppMapping[nppName] || { kv: 'Khác', region: 'Khác' };
}

// ==================== HÀM FORMAT SỐ ====================

function formatNumber(num) {
    if (typeof num !== 'number') return num;
    
    const isNegative = num < 0;
    const absNum = Math.abs(num);
    
    if (absNum >= 1e9) {
        const value = absNum / 1e9;
        const integerPart = Math.floor(value);
        const decimalPart = Math.floor((value - integerPart) * 10);
        if (decimalPart === 0) {
            return (isNegative ? '-' : '') + integerPart + ' tỷ';
        }
        return (isNegative ? '-' : '') + integerPart + ',' + decimalPart + ' tỷ';
    }
    
    if (absNum >= 1e6) {
        const value = absNum / 1e6;
        const integerPart = Math.floor(value);
        const decimalPart = Math.floor((value - integerPart) * 10);
        if (decimalPart === 0) {
            return (isNegative ? '-' : '') + integerPart + ' tr';
        }
        return (isNegative ? '-' : '') + integerPart + ',' + decimalPart + ' tr';
    }
    
    return new Intl.NumberFormat('vi-VN').format(absNum);
}

function formatMoney(num) {
    if (typeof num !== 'number') return num;
    return new Intl.NumberFormat('vi-VN').format(num) + ' ₫';
}

function formatNumberShort(num) {
    if (typeof num !== 'number') return num;
    const absNum = Math.abs(num);
    
    if (absNum >= 1e9) {
        const value = absNum / 1e9;
        const integerPart = Math.floor(value);
        const decimalPart = Math.floor((value - integerPart) * 10);
        if (decimalPart === 0) return integerPart + ' tỷ';
        return integerPart + ',' + decimalPart + ' tỷ';
    }
    
    if (absNum >= 1e6) {
        const value = absNum / 1e6;
        const integerPart = Math.floor(value);
        const decimalPart = Math.floor((value - integerPart) * 10);
        if (decimalPart === 0) return integerPart + ' tr';
        return integerPart + ',' + decimalPart + ' tr';
    }
    
    return new Intl.NumberFormat('vi-VN').format(absNum);
}

function calculateTotalRevenue(data) {
    return data.reduce((sum, item) => sum + (item.revenue || 0), 0);
}

function getCurrentRawData() {
    if (currentType === 'month') {
        return currentData;
    } else {
        return currentAggregatedData;
    }
}

function getCompareRawData() {
    if (currentType === 'month') {
        return compareData;
    } else {
        return compareAggregatedData;
    }
}

function filterRawDataByRegion(data) {
    if (!data || !data.data) return data;
    
    const selectedRegion = document.getElementById('regionSelect')?.value;
    const selectedArea = document.getElementById('areaSelect')?.value;
    
    if (!selectedRegion && !selectedArea) return data;
    
    const filteredData = data.data.filter(item => {
        const nppInfo = getNPPInfo(item.npp);
        if (!nppInfo) return true;
        
        if (selectedRegion && selectedArea) {
            return nppInfo.region === selectedRegion && nppInfo.kv === selectedArea;
        } else if (selectedRegion) {
            return nppInfo.region === selectedRegion;
        } else if (selectedArea) {
            return nppInfo.kv === selectedArea;
        }
        return true;
    });
    
    return { ...data, data: filteredData };
}

async function getFilteredProductData(isCurrent = true) {
    const rawData = isCurrent ? getCurrentRawData() : getCompareRawData();
    if (!rawData || !rawData.data) return [];
    
    const filteredRaw = filterRawDataByRegion(rawData);
    
    const productMap = new Map();
    filteredRaw.data.forEach(item => {
        const productName = item.ten_sp;
        const revenue = item.revenue || 0;
        productMap.set(productName, (productMap.get(productName) || 0) + revenue);
    });
    
    return Array.from(productMap.entries())
        .map(([name, revenue]) => ({ name, revenue }))
        .sort((a, b) => b.revenue - a.revenue);
}

async function getFilteredCategoryData(isCurrent = true) {
    const rawData = isCurrent ? getCurrentRawData() : getCompareRawData();
    if (!rawData || !rawData.data) return [];
    
    const filteredRaw = filterRawDataByRegion(rawData);
    
    const categoryMap = new Map();
    filteredRaw.data.forEach(item => {
        const category = item.category || 'Khác';
        const revenue = item.revenue || 0;
        categoryMap.set(category, (categoryMap.get(category) || 0) + revenue);
    });
    
    return Array.from(categoryMap.entries())
        .map(([name, revenue]) => ({ name, revenue }))
        .sort((a, b) => b.revenue - a.revenue);
}

function showLoading() {
    isLoading = true;
    const reportContent = document.getElementById('reportContent');
    if (reportContent) {
        reportContent.style.opacity = '0.5';
        reportContent.style.pointerEvents = 'none';
    }
}

function hideLoading() {
    isLoading = false;
    const reportContent = document.getElementById('reportContent');
    if (reportContent) {
        reportContent.style.opacity = '1';
        reportContent.style.pointerEvents = 'auto';
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'warning' ? 'fa-exclamation-triangle' : type === 'error' ? 'fa-times-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        background: ${type === 'warning' ? '#ff9800' : type === 'error' ? '#f44336' : '#2196f3'};
        color: white;
        border-radius: 8px;
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ==================== 6 BIỂU ĐỒ CHÍNH ====================

// Biểu đồ 1: So sánh doanh thu ngành hàng
async function renderCategoryComparisonChart() {
    const ctx = document.getElementById('categoryComparisonChart').getContext('2d');
    if (categoryComparisonChart) categoryComparisonChart.destroy();
    
    const currentCategories = await getFilteredCategoryData(true);
    const compareCategories = await getFilteredCategoryData(false);
    const compareMap = new Map(compareCategories.map(c => [c.name, c.revenue]));
    
    const topCategories = currentCategories.slice(0, 8);
    const labels = topCategories.map(c => c.name);
    const currentDataValues = topCategories.map(c => c.revenue);
    const compareDataValues = topCategories.map(c => compareMap.get(c.name) || 0);
    
    categoryComparisonChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: `Kỳ hiện tại`,
                    data: currentDataValues,
                    backgroundColor: 'rgba(102, 126, 234, 0.8)',
                    borderColor: 'rgba(102, 126, 234, 1)',
                    borderWidth: 2,
                    borderRadius: 8
                },
                {
                    label: `Kỳ so sánh`,
                    data: compareDataValues,
                    backgroundColor: 'rgba(118, 75, 162, 0.6)',
                    borderColor: 'rgba(118, 75, 162, 1)',
                    borderWidth: 2,
                    borderRadius: 8
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top' },
                tooltip: { 
                    callbacks: { 
                        label: function(context) { 
                            return `${context.dataset.label}: ${formatMoney(context.raw)}`;
                        } 
                    } 
                }
            },
            scales: { 
                y: { 
                    ticks: { callback: value => formatNumber(value) },
                    title: { display: true, text: 'Doanh thu' } 
                },
                x: { title: { display: true, text: 'Ngành hàng' } }
            }
        }
    });
}

// Biểu đồ 2: Cơ cấu ngành hàng (Donut chart) - ĐÃ SỬA HOVER FORMAT
async function renderCategoryStructureChart() {
    const ctx = document.getElementById('categoryStructureChart').getContext('2d');
    if (categoryStructureChart) categoryStructureChart.destroy();
    
    const categories = await getFilteredCategoryData(true);
    const topCategories = categories.slice(0, 8);
    const otherRevenue = categories.slice(8).reduce((sum, c) => sum + c.revenue, 0);
    
    const labels = [...topCategories.map(c => c.name)];
    const revenues = [...topCategories.map(c => c.revenue)];
    
    if (otherRevenue > 0) {
        labels.push('Khác');
        revenues.push(otherRevenue);
    }
    
    const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
        '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7C59F', '#C7B9FF'
    ];
    
    categoryStructureChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: revenues,
                backgroundColor: colors.slice(0, labels.length),
                borderWidth: 0,
                borderRadius: 8,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'right', labels: { font: { size: 11 } } },
                tooltip: { 
                    callbacks: { 
                        label: function(context) {
                            const value = context.raw;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percent = (value / total * 100).toFixed(1);
                            // ĐÃ SỬA: dùng formatNumber thay vì formatMoney
                            return `${context.label}: ${formatNumber(value)} (${percent}%)`;
                        } 
                    } 
                },
                datalabels: {
                    color: '#ffffff',
                    font: { weight: 'bold', size: 10 },
                    anchor: 'center',
                    align: 'center',
                    formatter: function(value, ctx) {
                        const total = ctx.dataset.data.reduce((sum, v) => sum + v, 0);
                        const percent = total ? ((value / total) * 100).toFixed(1) : 0;
                        return `${percent}%`;
                    }
                }
            }
        }
    });
}

// Biểu đồ 3: 10 sản phẩm bán chạy nhất
async function renderTopProductsLineChart() {
    const ctx = document.getElementById('topProductsLineChart').getContext('2d');
    if (topProductsChart) topProductsChart.destroy();
    
    const currentProducts = await getFilteredProductData(true);
    const compareProducts = await getFilteredProductData(false);
    const compareMap = new Map(compareProducts.map(p => [p.name, p.revenue]));
    
    const topProductsList = currentProducts.slice(0, 10);
    const labels = topProductsList.map(p => p.name.length > 25 ? p.name.substring(0, 25) + '...' : p.name);
    const currentRevenues = topProductsList.map(p => p.revenue);
    const compareRevenues = topProductsList.map(p => compareMap.get(p.name) || 0);
    
    topProductsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: `Kỳ hiện tại`,
                    data: currentRevenues,
                    borderColor: 'rgba(102, 126, 234, 1)',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.3,
                    pointBackgroundColor: 'rgba(102, 126, 234, 1)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7
                },
                {
                    label: `Kỳ so sánh`,
                    data: compareRevenues,
                    borderColor: 'rgba(255, 159, 64, 1)',
                    backgroundColor: 'rgba(255, 159, 64, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.3,
                    pointBackgroundColor: 'rgba(255, 159, 64, 1)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    borderDash: [5, 5]
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top' },
                tooltip: { 
                    callbacks: { 
                        label: function(context) { 
                            return `${context.dataset.label}: ${formatMoney(context.raw)}`;
                        } 
                    } 
                },
                datalabels: {
                    color: '#333',
                    font: { weight: 'bold', size: 10 },
                    formatter: function(value) {
                        return formatNumberShort(value);
                    },
                    anchor: function(context) {
                        const currentValue = context.dataset.data[context.dataIndex];
                        const compareValue = context.chart.data.datasets[1 - context.datasetIndex].data[context.dataIndex];
                        return currentValue > compareValue ? 'end' : 'start';
                    },
                    align: function(context) {
                        const currentValue = context.dataset.data[context.dataIndex];
                        const compareValue = context.chart.data.datasets[1 - context.datasetIndex].data[context.dataIndex];
                        return currentValue > compareValue ? 'top' : 'bottom';
                    },
                    offset: 6,
                    clamp: true
                }
            },
            scales: { 
                y: { 
                    ticks: { callback: value => formatNumber(value) },
                    title: { display: true, text: 'Doanh thu' } 
                },
                x: { title: { display: true, text: 'Sản phẩm' } }
            }
        }
    });
}

// Biểu đồ 4: 10 sản phẩm bán kém nhất
async function renderBottomProductsLineChart() {
    const ctx = document.getElementById('bottomProductsLineChart').getContext('2d');
    if (bottomProductsChart) bottomProductsChart.destroy();
    
    const currentProducts = await getFilteredProductData(true);
    const compareProducts = await getFilteredProductData(false);
    const compareMap = new Map(compareProducts.map(p => [p.name, p.revenue]));
    
    const productsWithRevenue = currentProducts.filter(p => p.revenue > 0);
    const bottomProductsList = productsWithRevenue.slice(-10).reverse();
    
    const labels = bottomProductsList.map(p => p.name.length > 25 ? p.name.substring(0, 25) + '...' : p.name);
    const currentRevenues = bottomProductsList.map(p => p.revenue);
    const compareRevenues = bottomProductsList.map(p => compareMap.get(p.name) || 0);
    
    bottomProductsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: `Kỳ hiện tại`,
                    data: currentRevenues,
                    borderColor: 'rgba(244, 67, 54, 1)',
                    backgroundColor: 'rgba(244, 67, 54, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.3,
                    pointBackgroundColor: 'rgba(244, 67, 54, 1)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7
                },
                {
                    label: `Kỳ so sánh`,
                    data: compareRevenues,
                    borderColor: 'rgba(255, 159, 64, 1)',
                    backgroundColor: 'rgba(255, 159, 64, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.3,
                    pointBackgroundColor: 'rgba(255, 159, 64, 1)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    borderDash: [5, 5]
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top' },
                tooltip: { 
                    callbacks: { 
                        label: function(context) { 
                            return `${context.dataset.label}: ${formatMoney(context.raw)}`;
                        } 
                    } 
                },
                datalabels: {
                    color: '#333',
                    font: { weight: 'bold', size: 10 },
                    formatter: function(value) {
                        return formatNumberShort(value);
                    },
                    anchor: function(context) {
                        const currentValue = context.dataset.data[context.dataIndex];
                        const compareValue = context.chart.data.datasets[1 - context.datasetIndex].data[context.dataIndex];
                        return currentValue > compareValue ? 'end' : 'start';
                    },
                    align: function(context) {
                        const currentValue = context.dataset.data[context.dataIndex];
                        const compareValue = context.chart.data.datasets[1 - context.datasetIndex].data[context.dataIndex];
                        return currentValue > compareValue ? 'top' : 'bottom';
                    },
                    offset: 6,
                    clamp: true
                }
            },
            scales: { 
                y: { 
                    ticks: { callback: value => formatNumber(value) },
                    title: { display: true, text: 'Doanh thu' } 
                },
                x: { title: { display: true, text: 'Sản phẩm' } }
            }
        }
    });
}

// Biểu đồ 5: 10 sản phẩm tăng trưởng mạnh nhất (Màu xanh dương, đỏ âm)
async function renderTopGrowthProductsChart() {
    const ctx = document.getElementById('topGrowthProductsChart').getContext('2d');
    if (topGrowthProductsChart) topGrowthProductsChart.destroy();
    
    const currentProducts = await getFilteredProductData(true);
    const compareProducts = await getFilteredProductData(false);
    const compareMap = new Map(compareProducts.map(p => [p.name, p.revenue]));
    
    const growthData = currentProducts.map(p => {
        const compareRevenue = compareMap.get(p.name) || 0;
        const growth = compareRevenue > 0 ? ((p.revenue - compareRevenue) / compareRevenue * 100) : (p.revenue > 0 ? 100 : 0);
        return { 
            name: p.name, 
            currentRevenue: p.revenue, 
            compareRevenue: compareRevenue, 
            growth: growth 
        };
    });
    
    const topGrowth = growthData
        .filter(p => p.compareRevenue > 0)
        .sort((a, b) => b.growth - a.growth)
        .slice(0, 10);
    
    const labels = topGrowth.map(p => p.name.length > 30 ? p.name.substring(0, 30) + '...' : p.name);
    const growthRates = topGrowth.map(p => p.growth);
    
    topGrowthProductsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Tỷ lệ tăng trưởng (%)',
                data: growthRates,
                backgroundColor: growthRates.map(g => g >= 0 ? 'rgba(76, 175, 80, 0.8)' : 'rgba(244, 67, 54, 0.8)'),
                borderColor: growthRates.map(g => g >= 0 ? 'rgba(76, 175, 80, 1)' : 'rgba(244, 67, 54, 1)'),
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                legend: { position: 'top' },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const item = topGrowth[context.dataIndex];
                            return [
                                `Tăng trưởng: ${context.raw.toFixed(1)}%`,
                                `Doanh thu hiện tại: ${formatMoney(item.currentRevenue)}`,
                                `Doanh thu so sánh: ${formatMoney(item.compareRevenue)}`
                            ];
                        }
                    }
                },
                datalabels: {
                    color: '#333',
                    font: { weight: 'bold', size: 11 },
                    anchor: 'end',
                    align: 'right',
                    formatter: function(value) {
                        return `${value.toFixed(1)}%`;
                    }
                }
            },
            scales: {
                x: { 
                    ticks: { callback: value => value + '%' }, 
                    title: { display: true, text: 'Tỷ lệ tăng trưởng (%)' } 
                },
                y: { title: { display: true, text: 'Sản phẩm' } }
            }
        }
    });
}

// Biểu đồ 6: 10 sản phẩm tăng trưởng yếu nhất (Màu xanh dương, đỏ âm)
async function renderBottomGrowthProductsChart() {
    const ctx = document.getElementById('bottomGrowthProductsChart').getContext('2d');
    if (bottomGrowthProductsChart) bottomGrowthProductsChart.destroy();
    
    const currentProducts = await getFilteredProductData(true);
    const compareProducts = await getFilteredProductData(false);
    const compareMap = new Map(compareProducts.map(p => [p.name, p.revenue]));
    
    const growthData = currentProducts.map(p => {
        const compareRevenue = compareMap.get(p.name) || 0;
        const growth = compareRevenue > 0 ? ((p.revenue - compareRevenue) / compareRevenue * 100) : (p.revenue > 0 ? 100 : -100);
        return { 
            name: p.name, 
            currentRevenue: p.revenue, 
            compareRevenue: compareRevenue, 
            growth: growth 
        };
    });
    
    const bottomGrowth = growthData
        .filter(p => p.compareRevenue > 0)
        .sort((a, b) => a.growth - b.growth)
        .slice(0, 10);
    
    const labels = bottomGrowth.map(p => p.name.length > 30 ? p.name.substring(0, 30) + '...' : p.name);
    const growthRates = bottomGrowth.map(p => p.growth);
    
    bottomGrowthProductsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Tỷ lệ tăng trưởng (%)',
                data: growthRates,
                backgroundColor: growthRates.map(g => g >= 0 ? 'rgba(76, 175, 80, 0.8)' : 'rgba(244, 67, 54, 0.8)'),
                borderColor: growthRates.map(g => g >= 0 ? 'rgba(76, 175, 80, 1)' : 'rgba(244, 67, 54, 1)'),
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                legend: { position: 'top' },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const item = bottomGrowth[context.dataIndex];
                            return [
                                `Tăng trưởng: ${context.raw.toFixed(1)}%`,
                                `Doanh thu hiện tại: ${formatMoney(item.currentRevenue)}`,
                                `Doanh thu so sánh: ${formatMoney(item.compareRevenue)}`
                            ];
                        }
                    }
                },
                datalabels: {
                    color: '#333',
                    font: { weight: 'bold', size: 11 },
                    anchor: 'end',
                    align: 'right',
                    formatter: function(value) {
                        return `${value.toFixed(1)}%`;
                    }
                }
            },
            scales: {
                x: { 
                    ticks: { callback: value => value + '%' }, 
                    title: { display: true, text: 'Tỷ lệ tăng trưởng (%)' } 
                },
                y: { title: { display: true, text: 'Sản phẩm' } }
            }
        }
    });
}

// ==================== TAB CHI TIẾT SẢN PHẨM ====================

async function renderProductDetailTable() {
    const tbody = document.getElementById('detailTableBody');
    
    const currentProducts = await getFilteredProductData(true);
    const compareProducts = await getFilteredProductData(false);
    const compareMap = new Map(compareProducts.map(p => [p.name, p.revenue]));
    
    if (!currentProducts || currentProducts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Không có dữ liệu sản phẩm</td></tr>';
        return;
    }
    
    tbody.innerHTML = currentProducts.map(item => {
        const compareRevenue = compareMap.get(item.name) || 0;
        const diff = item.revenue - compareRevenue;
        const growthRate = compareRevenue > 0 ? (diff / compareRevenue * 100) : (item.revenue > 0 ? 100 : 0);
        return `
            <tr>
                <td><strong>${item.name}</strong></td>
                <td>${formatNumber(item.revenue)}</td>
                <td>${formatNumber(compareRevenue)}</td>
                <td class="${diff >= 0 ? 'positive-change' : 'negative-change'}">${diff >= 0 ? '+' : ''}${formatNumber(Math.abs(diff))}</td>
                <td class="${growthRate >= 0 ? 'positive-change' : 'negative-change'}">${growthRate >= 0 ? '+' : ''}${growthRate.toFixed(1)}%</td>
            </tr>
        `;
    }).join('');
}

function searchProduct() {
    const searchTerm = document.getElementById('searchProduct').value.toLowerCase().trim();
    const tbody = document.getElementById('detailTableBody');
    
    (async () => {
        const currentProducts = await getFilteredProductData(true);
        const compareProducts = await getFilteredProductData(false);
        const compareMap = new Map(compareProducts.map(p => [p.name, p.revenue]));
        
        const filteredProducts = currentProducts.filter(p => p.name.toLowerCase().includes(searchTerm));
        
        if (filteredProducts.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Không tìm thấy sản phẩm</td></tr>';
            return;
        }
        
        tbody.innerHTML = filteredProducts.map(item => {
            const compareRevenue = compareMap.get(item.name) || 0;
            const diff = item.revenue - compareRevenue;
            const growthRate = compareRevenue > 0 ? (diff / compareRevenue * 100) : (item.revenue > 0 ? 100 : 0);
            return `
                <tr>
                    <td><strong>${item.name}</strong></td>
                    <td>${formatNumber(item.revenue)}</td>
                    <td>${formatNumber(compareRevenue)}</td>
                    <td class="${diff >= 0 ? 'positive-change' : 'negative-change'}">${diff >= 0 ? '+' : ''}${formatNumber(Math.abs(diff))}</td>
                    <td class="${growthRate >= 0 ? 'positive-change' : 'negative-change'}">${growthRate >= 0 ? '+' : ''}${growthRate.toFixed(1)}%</td>
                </tr>
            `;
        }).join('');
    })();
}

// Stats Cards
async function renderStatsCards() {
    const currentCategories = await getFilteredCategoryData(true);
    const compareCategories = await getFilteredCategoryData(false);
    
    currentRevenueTotal = calculateTotalRevenue(currentCategories);
    compareRevenueTotal = calculateTotalRevenue(compareCategories);
    const revenueDiff = currentRevenueTotal - compareRevenueTotal;
    const revenueGrowth = compareRevenueTotal > 0 ? (revenueDiff / compareRevenueTotal * 100) : 0;
    
    let currentLabel = '';
    let compareLabel = '';
    
    if (currentType === 'month') {
        const currentYear = document.getElementById('currentYear')?.value || 2026;
        const currentMonth = document.getElementById('currentMonth')?.value || 3;
        const compareYear = document.getElementById('compareYear')?.value || 2025;
        const compareMonth = document.getElementById('compareMonth')?.value || 3;
        currentLabel = `${currentYear}/${currentMonth}`;
        compareLabel = `${compareYear}/${compareMonth}`;
    } else if (currentType === 'quarter') {
        const currentYear = document.getElementById('currentYear')?.value || 2026;
        const currentQuarter = document.getElementById('currentQuarter')?.value || 4;
        const compareYear = document.getElementById('compareYear')?.value || 2025;
        const compareQuarter = document.getElementById('compareQuarter')?.value || 4;
        currentLabel = `${currentYear} - Q${currentQuarter}`;
        compareLabel = `${compareYear} - Q${compareQuarter}`;
    } else {
        const currentYear = document.getElementById('currentYear')?.value || 2026;
        const compareYear = document.getElementById('compareYear')?.value || 2025;
        currentLabel = `Năm ${currentYear}`;
        compareLabel = `Năm ${compareYear}`;
    }
    
    const statsGrid = document.getElementById('statsGrid');
    statsGrid.innerHTML = `
        <div class="stat-card ${revenueGrowth >= 0 ? 'positive' : 'negative'}">
            <div class="stat-title"><i class="fas fa-dollar-sign"></i> Doanh thu kỳ hiện tại</div>
            <div class="stat-value">${formatNumber(currentRevenueTotal)}</div>
            <div class="stat-compare">${currentLabel}</div>
        </div>
        <div class="stat-card ${revenueGrowth >= 0 ? 'positive' : 'negative'}">
            <div class="stat-title"><i class="fas fa-chart-line"></i> Tăng trưởng doanh thu</div>
            <div class="stat-value ${revenueGrowth >= 0 ? 'trend-up' : 'trend-down'}">${revenueGrowth >= 0 ? '+' : ''}${revenueGrowth.toFixed(1)}%</div>
            <div class="stat-compare">So với ${compareLabel}</div>
        </div>
        <div class="stat-card">
            <div class="stat-title"><i class="fas fa-chart-simple"></i> Số lượng ngành hàng</div>
            <div class="stat-value">${currentCategories.length}</div>
            <div class="stat-compare">Kỳ so sánh: ${compareCategories.length}</div>
        </div>
    `;
}

async function renderAllCharts() {
    await renderCategoryComparisonChart();
    await renderCategoryStructureChart();
    await renderTopProductsLineChart();
    await renderBottomProductsLineChart();
    await renderTopGrowthProductsChart();
    await renderBottomGrowthProductsChart();
}

async function renderReport() {
    await renderStatsCards();
    await renderAllCharts();
    await renderProductDetailTable();
}

// ==================== UI CONTROLS ====================

function onRegionChange() {
    const regionSelect = document.getElementById('regionSelect');
    const areaSelect = document.getElementById('areaSelect');
    const selectedRegion = regionSelect.value;
    
    const areas = getAreasByRegion(selectedRegion);
    areaSelect.innerHTML = '<option value="">Tất cả khu vực</option>' + 
        areas.map(area => `<option value="${area}">${area}</option>`).join('');
    
    renderReport();
}

function onAreaChange() {
    renderReport();
}

function getAreasByRegion(region) {
    const areas = new Set();
    Object.entries(nppMapping).forEach(([npp, info]) => {
        if ((!region || info.region === region) && info.kv !== 'MB Chợ') {
            areas.add(info.kv);
        }
    });
    return Array.from(areas).sort();
}

function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.tab-btn[onclick="switchTab('${tabName}')"]`).classList.add('active');
    
    if (tabName === 'overview') {
        document.getElementById('tabOverview').classList.add('active');
        document.getElementById('tabDetail').classList.remove('active');
    } else {
        document.getElementById('tabOverview').classList.remove('active');
        document.getElementById('tabDetail').classList.add('active');
    }
}

function switchComparisonType(type) {
    currentType = type;
    document.querySelectorAll('.filter-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelector(`.filter-tab[data-type="${type}"]`).classList.add('active');
    
    const controlsDiv = document.getElementById('filterControls');
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    
    if (type === 'month') {
        controlsDiv.innerHTML = `
            <div class="filter-group"><label><i class="fas fa-calendar"></i> Năm hiện tại</label><input type="number" id="currentYear" value="${currentYear}" min="2020" max="2030"></div>
            <div class="filter-group"><label><i class="fas fa-calendar-alt"></i> Tháng hiện tại</label><select id="currentMonth">${Array.from({ length: 12 }, (_, i) => `<option value="${i + 1}" ${i + 1 === currentMonth ? 'selected' : ''}>Tháng ${i + 1}</option>`).join('')}</select></div>
            <div class="filter-group"><label><i class="fas fa-calendar"></i> Năm so sánh</label><input type="number" id="compareYear" value="${currentYear - 1}" min="2020" max="2030"></div>
            <div class="filter-group"><label><i class="fas fa-calendar-alt"></i> Tháng so sánh</label><select id="compareMonth">${Array.from({ length: 12 }, (_, i) => `<option value="${i + 1}" ${i + 1 === currentMonth ? 'selected' : ''}>Tháng ${i + 1}</option>`).join('')}</select></div>
            <button class="btn-compare" onclick="loadCompareData()"><i class="fas fa-chart-line"></i> So sánh ngay</button>
        `;
    } else if (type === 'quarter') {
        controlsDiv.innerHTML = `
            <div class="filter-group"><label><i class="fas fa-calendar"></i> Năm hiện tại</label><input type="number" id="currentYear" value="${currentYear}" min="2020" max="2030"></div>
            <div class="filter-group"><label><i class="fas fa-chart-simple"></i> Quý hiện tại</label><select id="currentQuarter"><option value="1">Quý 1</option><option value="2">Quý 2</option><option value="3">Quý 3</option><option value="4" selected>Quý 4</option></select></div>
            <div class="filter-group"><label><i class="fas fa-calendar"></i> Năm so sánh</label><input type="number" id="compareYear" value="${currentYear - 1}" min="2020" max="2030"></div>
            <div class="filter-group"><label><i class="fas fa-chart-simple"></i> Quý so sánh</label><select id="compareQuarter"><option value="1">Quý 1</option><option value="2">Quý 2</option><option value="3">Quý 3</option><option value="4" selected>Quý 4</option></select></div>
            <button class="btn-compare" onclick="loadCompareData()"><i class="fas fa-chart-line"></i> So sánh ngay</button>
        `;
    } else {
        controlsDiv.innerHTML = `
            <div class="filter-group"><label><i class="fas fa-calendar"></i> Năm hiện tại</label><input type="number" id="currentYear" value="${currentYear}" min="2020" max="2030"></div>
            <div class="filter-group"><label><i class="fas fa-calendar"></i> Năm so sánh</label><input type="number" id="compareYear" value="${currentYear - 1}" min="2020" max="2030"></div>
            <button class="btn-compare" onclick="loadCompareData()"><i class="fas fa-chart-line"></i> So sánh ngay</button>
        `;
    }
}

async function loadCompareData() {
    showLoading();
    
    const currentYear = parseInt(document.getElementById('currentYear').value);
    const compareYear = parseInt(document.getElementById('compareYear').value);
    
    try {
        if (currentType === 'month') {
            const currentMonth = parseInt(document.getElementById('currentMonth').value);
            const compareMonth = parseInt(document.getElementById('compareMonth').value);
            currentData = await loadRawData(currentYear, currentMonth);
            compareData = await loadRawData(compareYear, compareMonth);
            currentAggregatedData = null;
            compareAggregatedData = null;
        } else if (currentType === 'quarter') {
            const currentQuarter = parseInt(document.getElementById('currentQuarter').value);
            const compareQuarter = parseInt(document.getElementById('compareQuarter').value);
            currentAggregatedData = await loadRawDataForQuarter(currentYear, currentQuarter);
            compareAggregatedData = await loadRawDataForQuarter(compareYear, compareQuarter);
            currentData = null;
            compareData = null;
        } else {
            currentAggregatedData = await loadRawDataForYear(currentYear);
            compareAggregatedData = await loadRawDataForYear(compareYear);
            currentData = null;
            compareData = null;
        }
        
        await renderReport();
    } catch (error) {
        console.error('Error loading data:', error);
        showNotification('Lỗi khi tải dữ liệu. Vui lòng thử lại.', 'error');
    } finally {
        hideLoading();
    }
}

async function loadRawDataForQuarter(year, quarter) {
    const months = {
        1: [1, 2, 3],
        2: [4, 5, 6],
        3: [7, 8, 9],
        4: [10, 11, 12]
    };
    
    const allData = { data: [] };
    for (const month of months[quarter]) {
        const rawData = await loadRawData(year, month);
        if (rawData && rawData.data) {
            allData.data.push(...rawData.data);
        }
    }
    return allData;
}

async function loadRawDataForYear(year) {
    const allData = { data: [] };
    for (let month = 1; month <= 12; month++) {
        const rawData = await loadRawData(year, month);
        if (rawData && rawData.data) {
            allData.data.push(...rawData.data);
        }
    }
    return allData;
}

// Animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    switchComparisonType('month');
    
    const areaSelect = document.getElementById('areaSelect');
    areaSelect.innerHTML = '<option value="">Tất cả khu vực</option>' + 
        getAreasByRegion('MB').map(area => `<option value="${area}">${area}</option>`).join('');
    
    showLoading();
    try {
        currentData = await loadRawData(2026, 4);
        compareData = await loadRawData(2025, 4);
        currentAggregatedData = null;
        compareAggregatedData = null;
        await renderReport();
    } catch (error) {
        console.error('Error loading default data:', error);
        showNotification('Không thể tải dữ liệu mặc định', 'error');
    } finally {
        hideLoading();
    }
});