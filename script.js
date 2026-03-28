// script.js - Main application logic (FIXED - Bar colors based on positive/negative values)

// NPP Mapping with KV and Region
const nppMapping = {
    'NPP Anh Minh HT': { kv: 'KV6', region: 'MB' },
    'NPP Anh Đức': { kv: 'KV5', region: 'MB' },
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

// Global variables
let currentData = null;
let compareData = null;
let currentType = 'month';

let revenueChart = null;
let growthChart = null;
let topAreasChart = null;
let bottomAreasChart = null;

let originalAreaData = [];
let originalCompareAreaData = [];

// Helper functions
function getNPPInfo(nppName) {
    return nppMapping[nppName] || { kv: 'Khác', region: 'Khác' };
}

function formatNumber(num) {
    if (typeof num !== 'number') return num;
    return new Intl.NumberFormat('vi-VN').format(num);
}

function calculateTotalRevenue(data) {
    return data.reduce((sum, item) => sum + (item.revenue || 0), 0);
}

function filterDataByRegion(data) {
    if (!data) return [];
    const selectedRegion = document.getElementById('regionSelect')?.value;
    const selectedArea = document.getElementById('areaSelect')?.value;
    
    if (!selectedRegion && !selectedArea) return data;
    
    return data.filter(item => {
        const nppInfo = getNPPInfo(item.name);
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
}

// Get NPP growth data based on current filters (for Top/Bottom charts)
function getNPPGrowthData() {
    const selectedRegion = document.getElementById('regionSelect')?.value;
    const selectedArea = document.getElementById('areaSelect')?.value;
    
    // Filter current and compare data based on selection
    let currentList = currentData;
    let compareList = compareData;
    
    if (selectedRegion || selectedArea) {
        currentList = filterDataByRegion(currentData);
        compareList = filterDataByRegion(compareData);
    }
    
    // Calculate growth for each NPP
    const compareMap = new Map();
    compareList.forEach(item => compareMap.set(item.name, item.revenue));
    
    return currentList.map(item => {
        const compareRevenue = compareMap.get(item.name) || 0;
        const growth = compareRevenue > 0 ? ((item.revenue - compareRevenue) / compareRevenue * 100) : (item.revenue > 0 ? 100 : 0);
        return {
            name: item.name,
            currentRevenue: item.revenue,
            compareRevenue: compareRevenue,
            growth: growth
        };
    }).sort((a, b) => b.growth - a.growth);
}

// Calculate growth by region (Miền) - for main growth chart
function calculateGrowthByRegion(currentList, compareList) {
    const currentMap = new Map();
    const compareMap = new Map();
    
    currentList.forEach(item => {
        const region = getNPPInfo(item.name).region;
        if (region !== 'Khác') {
            currentMap.set(region, (currentMap.get(region) || 0) + (item.revenue || 0));
        }
    });
    
    compareList.forEach(item => {
        const region = getNPPInfo(item.name).region;
        if (region !== 'Khác') {
            compareMap.set(region, (compareMap.get(region) || 0) + (item.revenue || 0));
        }
    });
    
    const regions = new Set([...currentMap.keys(), ...compareMap.keys()]);
    return Array.from(regions).map(region => {
        const currentRevenue = currentMap.get(region) || 0;
        const compareRevenue = compareMap.get(region) || 0;
        const growth = compareRevenue > 0 ? ((currentRevenue - compareRevenue) / compareRevenue * 100) : (currentRevenue > 0 ? 100 : 0);
        return {
            name: region,
            currentRevenue: currentRevenue,
            compareRevenue: compareRevenue,
            growth: growth
        };
    }).sort((a, b) => b.growth - a.growth);
}

// Calculate growth by KV (Khu vực) within a region
function calculateGrowthByKV(currentList, compareList, region) {
    const currentMap = new Map();
    const compareMap = new Map();
    
    currentList.forEach(item => {
        const info = getNPPInfo(item.name);
        if (info.region === region && info.kv !== 'Khác') {
            currentMap.set(info.kv, (currentMap.get(info.kv) || 0) + (item.revenue || 0));
        }
    });
    
    compareList.forEach(item => {
        const info = getNPPInfo(item.name);
        if (info.region === region && info.kv !== 'Khác') {
            compareMap.set(info.kv, (compareMap.get(info.kv) || 0) + (item.revenue || 0));
        }
    });
    
    const kvs = new Set([...currentMap.keys(), ...compareMap.keys()]);
    return Array.from(kvs).map(kv => {
        const currentRevenue = currentMap.get(kv) || 0;
        const compareRevenue = compareMap.get(kv) || 0;
        const growth = compareRevenue > 0 ? ((currentRevenue - compareRevenue) / compareRevenue * 100) : (currentRevenue > 0 ? 100 : 0);
        return {
            name: kv,
            currentRevenue: currentRevenue,
            compareRevenue: compareRevenue,
            growth: growth
        };
    }).sort((a, b) => b.growth - a.growth);
}

// Calculate growth by NPP within a KV
function calculateGrowthByNPP(currentList, compareList, kv) {
    const currentMap = new Map();
    const compareMap = new Map();
    
    currentList.forEach(item => {
        const info = getNPPInfo(item.name);
        if (info.kv === kv) {
            currentMap.set(item.name, (currentMap.get(item.name) || 0) + (item.revenue || 0));
        }
    });
    
    compareList.forEach(item => {
        const info = getNPPInfo(item.name);
        if (info.kv === kv) {
            compareMap.set(item.name, (compareMap.get(item.name) || 0) + (item.revenue || 0));
        }
    });
    
    const npps = new Set([...currentMap.keys(), ...compareMap.keys()]);
    return Array.from(npps).map(npp => {
        const currentRevenue = currentMap.get(npp) || 0;
        const compareRevenue = compareMap.get(npp) || 0;
        const growth = compareRevenue > 0 ? ((currentRevenue - compareRevenue) / compareRevenue * 100) : (currentRevenue > 0 ? 100 : 0);
        return {
            name: npp,
            currentRevenue: currentRevenue,
            compareRevenue: compareRevenue,
            growth: growth
        };
    }).sort((a, b) => b.growth - a.growth);
}

// Main function to get growth data based on current filters (for main growth chart)
function getGrowthDataByLevel() {
    const selectedRegion = document.getElementById('regionSelect')?.value;
    const selectedArea = document.getElementById('areaSelect')?.value;
    
    // Level 1: No filter -> Show by Region (Miền)
    if (!selectedRegion && !selectedArea) {
        return calculateGrowthByRegion(currentData, compareData);
    }
    // Level 2: Only region selected -> Show by KV in that region
    else if (selectedRegion && !selectedArea) {
        return calculateGrowthByKV(currentData, compareData, selectedRegion);
    }
    // Level 3: Both region and KV selected -> Show by NPP in that KV
    else if (selectedRegion && selectedArea) {
        return calculateGrowthByNPP(currentData, compareData, selectedArea);
    }
    
    return [];
}

// Get Y-axis title based on filter level
function getYAxisTitle() {
    const selectedRegion = document.getElementById('regionSelect')?.value;
    const selectedArea = document.getElementById('areaSelect')?.value;
    
    if (!selectedRegion && !selectedArea) return 'Miền';
    if (selectedRegion && !selectedArea) return 'Khu vực (KV)';
    return 'Nhà phân phối (NPP)';
}

function renderReport() {
    if (!currentData || !compareData) return;
    
    const filteredCurrent = filterDataByRegion(currentData);
    const filteredCompare = filterDataByRegion(compareData);
    
    const currentRevenue = calculateTotalRevenue(filteredCurrent);
    const compareRevenue = calculateTotalRevenue(filteredCompare);
    const revenueDiff = currentRevenue - compareRevenue;
    const revenueGrowth = compareRevenue > 0 ? (revenueDiff / compareRevenue * 100) : 0;
    
    const statsGrid = document.getElementById('statsGrid');
    statsGrid.innerHTML = `
        <div class="stat-card ${revenueGrowth >= 0 ? 'positive' : 'negative'}">
            <div class="stat-title"><i class="fas fa-dollar-sign"></i> Doanh số kỳ hiện tại</div>
            <div class="stat-value">${formatNumber(currentRevenue)}</div>
            <div class="stat-compare">Kỳ so sánh: ${formatNumber(compareRevenue)}</div>
        </div>
        <div class="stat-card ${revenueGrowth >= 0 ? 'positive' : 'negative'}">
            <div class="stat-title"><i class="fas fa-chart-line"></i> Tăng trưởng doanh số</div>
            <div class="stat-value ${revenueGrowth >= 0 ? 'trend-up' : 'trend-down'}">${revenueGrowth >= 0 ? '+' : ''}${revenueGrowth.toFixed(1)}%</div>
            <div class="stat-compare">Chênh lệch: ${formatNumber(Math.abs(revenueDiff))}</div>
        </div>
        <div class="stat-card">
            <div class="stat-title"><i class="fas fa-chart-simple"></i> Số lượng NPP</div>
            <div class="stat-value">${filteredCurrent.length}</div>
            <div class="stat-compare">Kỳ so sánh: ${filteredCompare.length}</div>
        </div>
    `;
    
    renderRevenueChart(currentRevenue, compareRevenue);
    renderGrowthChart();
    renderTopAreas();
    renderBottomAreas();
    renderDetailTable();
}

function renderRevenueChart(currentRevenue, compareRevenue) {
    const ctx = document.getElementById('revenueChart').getContext('2d');
    if (revenueChart) revenueChart.destroy();
    
    revenueChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Kỳ hiện tại', 'Kỳ so sánh'],
            datasets: [{
                label: 'Doanh số (VNĐ)',
                data: [currentRevenue, compareRevenue],
                backgroundColor: ['rgba(102, 126, 234, 0.8)', 'rgba(118, 75, 162, 0.6)'],
                borderColor: ['rgba(102, 126, 234, 1)', 'rgba(118, 75, 162, 1)'],
                borderWidth: 2,
                borderRadius: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top' },
                tooltip: { 
                    callbacks: { 
                        label: function(context) { 
                            return `${context.dataset.label}: ${formatNumber(context.raw)} VNĐ`; 
                        } 
                    } 
                }
            },
            scales: { 
                y: { 
                    ticks: { callback: value => formatNumber(value) }, 
                    title: { display: true, text: 'Doanh số (VNĐ)' } 
                } 
            }
        }
    });
}

function renderGrowthChart() {
    const ctx = document.getElementById('growthChart').getContext('2d');
    if (growthChart) growthChart.destroy();
    
    const growthData = getGrowthDataByLevel();
    const yAxisTitle = getYAxisTitle();
    const topGrowth = growthData.slice(0, 20);
    
    if (topGrowth.length === 0) {
        growthChart = new Chart(ctx, {
            type: 'bar',
            data: { labels: ['Không có dữ liệu'], datasets: [{ label: 'Tỷ lệ tăng trưởng (%)', data: [0] }] },
            options: { responsive: true, maintainAspectRatio: false }
        });
        return;
    }
    
    growthChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: topGrowth.map(a => a.name.length > 20 ? a.name.substring(0, 20) + '...' : a.name),
            datasets: [{
                label: 'Tỷ lệ tăng trưởng (%)',
                data: topGrowth.map(a => a.growth),
                backgroundColor: topGrowth.map(a => a.growth >= 0 ? 'rgba(76, 175, 80, 0.7)' : 'rgba(244, 67, 54, 0.7)'),
                borderColor: topGrowth.map(a => a.growth >= 0 ? 'rgba(76, 175, 80, 1)' : 'rgba(244, 67, 54, 1)'),
                borderWidth: 1,
                borderRadius: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                tooltip: { 
                    callbacks: { 
                        label: function(context) { 
                            const item = topGrowth[context.dataIndex];
                            return [
                                `Tăng trưởng: ${context.raw.toFixed(1)}%`,
                                `Doanh số hiện tại: ${formatNumber(item.currentRevenue)} VNĐ`,
                                `Doanh số so sánh: ${formatNumber(item.compareRevenue)} VNĐ`
                            ];
                        } 
                    } 
                },
                legend: { position: 'top' }
            },
            scales: {
                x: { 
                    ticks: { callback: value => value + '%' }, 
                    title: { display: true, text: 'Tỷ lệ tăng trưởng (%)' } 
                },
                y: { 
                    title: { display: true, text: yAxisTitle } 
                }
            }
        }
    });
}

function renderTopAreas() {
    const ctx = document.getElementById('topAreasChart').getContext('2d');
    if (topAreasChart) topAreasChart.destroy();
    
    const growthData = getNPPGrowthData();
    const topGrowth = growthData.filter(a => a.compareRevenue > 0).slice(0, 10);
    
    if (topGrowth.length === 0) {
        document.getElementById('topAreasChart').style.display = 'none';
        return;
    }
    document.getElementById('topAreasChart').style.display = 'block';
    
    topAreasChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: topGrowth.map(a => a.name.length > 25 ? a.name.substring(0, 25) + '...' : a.name),
            datasets: [{
                label: 'Tỷ lệ tăng trưởng (%)',
                data: topGrowth.map(a => a.growth),
                // SỬA: thay đổi màu theo giá trị
                backgroundColor: topGrowth.map(a => a.growth >= 0 ? 'rgba(76, 175, 80, 0.7)' : 'rgba(244, 67, 54, 0.7)'),
                borderColor: topGrowth.map(a => a.growth >= 0 ? 'rgba(76, 175, 80, 1)' : 'rgba(244, 67, 54, 1)'),
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const item = topGrowth[context.dataIndex];
                            return [
                                `Tăng trưởng: ${context.raw.toFixed(1)}%`,
                                `Doanh số hiện tại: ${formatNumber(item.currentRevenue)}`,
                                `Doanh số so sánh: ${formatNumber(item.compareRevenue)}`
                            ];
                        }
                    }
                }
            },
            scales: {
                x: { ticks: { callback: value => value + '%' }, title: { display: true, text: 'Tỷ lệ tăng trưởng (%)' } },
                y: { title: { display: true, text: 'Nhà phân phối (NPP)' } }
            }
        }
    });
}

function renderBottomAreas() {
    const ctx = document.getElementById('bottomAreasChart').getContext('2d');
    if (bottomAreasChart) bottomAreasChart.destroy();
    
    const growthData = getNPPGrowthData();
    const bottomGrowth = growthData.filter(a => a.compareRevenue > 0).sort((a, b) => a.growth - b.growth).slice(0, 10);
    
    if (bottomGrowth.length === 0) {
        document.getElementById('bottomAreasChart').style.display = 'none';
        return;
    }
    document.getElementById('bottomAreasChart').style.display = 'block';
    
    bottomAreasChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: bottomGrowth.map(a => a.name.length > 25 ? a.name.substring(0, 25) + '...' : a.name),
            datasets: [{
                label: 'Tỷ lệ tăng trưởng (%)',
                data: bottomGrowth.map(a => a.growth),
                // SỬA: thay đổi màu theo giá trị
                backgroundColor: bottomGrowth.map(a => a.growth >= 0 ? 'rgba(76, 175, 80, 0.7)' : 'rgba(244, 67, 54, 0.7)'),
                borderColor: bottomGrowth.map(a => a.growth >= 0 ? 'rgba(76, 175, 80, 1)' : 'rgba(244, 67, 54, 1)'),
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const item = bottomGrowth[context.dataIndex];
                            return [
                                `Tăng trưởng: ${context.raw.toFixed(1)}%`,
                                `Doanh số hiện tại: ${formatNumber(item.currentRevenue)}`,
                                `Doanh số so sánh: ${formatNumber(item.compareRevenue)}`
                            ];
                        }
                    }
                }
            },
            scales: {
                x: { ticks: { callback: value => value + '%' }, title: { display: true, text: 'Tỷ lệ tăng trưởng (%)' } },
                y: { title: { display: true, text: 'Nhà phân phối (NPP)' } }
            }
        }
    });
}

function renderDetailTable() {
    originalAreaData = [...currentData];
    originalCompareAreaData = [...compareData];
    renderDetailTableWithData(originalAreaData, originalCompareAreaData);
}

function renderDetailTableWithData(currentList, compareList) {
    const tbody = document.getElementById('detailTableBody');
    const compareMap = new Map();
    compareList.forEach(item => compareMap.set(item.name, item.revenue));
    
    if (currentList.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Không tìm thấy NPP</td></tr>';
        return;
    }
    
    tbody.innerHTML = currentList.map(item => {
        const compareRevenue = compareMap.get(item.name) || 0;
        const diff = item.revenue - compareRevenue;
        const growthRate = compareRevenue > 0 ? (diff / compareRevenue * 100) : (item.revenue > 0 ? 100 : 0);
        return `
            <tr>
                <td><strong>${item.name}</strong></td>
                <td>${formatNumber(item.revenue)}</td>
                <td>${formatNumber(compareRevenue)}</td>
                <td class="${diff >= 0 ? 'positive-change' : 'negative-change'}">${diff >= 0 ? '+' : ''}${formatNumber(diff)}</td>
                <td class="${growthRate >= 0 ? 'positive-change' : 'negative-change'}">${growthRate >= 0 ? '+' : ''}${growthRate.toFixed(1)}%</td>
            </tr>
        `;
    }).join('');
}

function searchNPP() {
    const searchTerm = document.getElementById('searchNPP').value.toLowerCase().trim();
    if (!searchTerm) {
        renderDetailTableWithData(originalAreaData, originalCompareAreaData);
        return;
    }
    
    const filteredCurrent = originalAreaData.filter(item => item.name.toLowerCase().includes(searchTerm));
    const filteredCompare = originalCompareAreaData.filter(item => item.name.toLowerCase().includes(searchTerm));
    renderDetailTableWithData(filteredCurrent, filteredCompare);
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

function onRegionChange() {
    const regionSelect = document.getElementById('regionSelect');
    const areaSelect = document.getElementById('areaSelect');
    const selectedRegion = regionSelect.value;
    
    const areas = getAreasByRegion(selectedRegion);
    areaSelect.innerHTML = '<option value="">Tất cả khu vực</option>' + 
        areas.map(area => `<option value="${area}">${area}</option>`).join('');
    
    if (currentData && compareData) renderReport();
}

function onAreaChange() {
    if (currentData && compareData) renderReport();
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

function loadCompareData() {
    const currentYear = parseInt(document.getElementById('currentYear').value);
    const compareYear = parseInt(document.getElementById('compareYear').value);
    
    if (currentType === 'month') {
        const currentMonth = parseInt(document.getElementById('currentMonth').value);
        const compareMonth = parseInt(document.getElementById('compareMonth').value);
        currentData = getDataByMonth(currentYear, currentMonth);
        compareData = getDataByMonth(compareYear, compareMonth);
    } else if (currentType === 'quarter') {
        const currentQuarter = parseInt(document.getElementById('currentQuarter').value);
        const compareQuarter = parseInt(document.getElementById('compareQuarter').value);
        currentData = getDataByQuarter(currentYear, currentQuarter);
        compareData = getDataByQuarter(compareYear, compareQuarter);
    } else {
        currentData = getDataByYear(currentYear);
        compareData = getDataByYear(compareYear);
    }
    
    renderReport();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    switchComparisonType('month');
    const areaSelect = document.getElementById('areaSelect');
    areaSelect.innerHTML = '<option value="">Tất cả khu vực</option>' + 
        getAreasByRegion('MB').map(area => `<option value="${area}">${area}</option>`).join('');
    
    // Load default data (latest month)
    currentData = getDataByMonth(2026, 2);
    compareData = getDataByMonth(2025, 2);
    renderReport();
});