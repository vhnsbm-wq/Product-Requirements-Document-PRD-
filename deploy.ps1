# 部署脚本 - PowerShell 版本
# 用于快速部署到 Vercel

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  智能待办事项应用 - 部署脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查 Node.js
Write-Host "检查 Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js 版本: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ 未找到 Node.js，请先安装 Node.js" -ForegroundColor Red
    exit 1
}

# 检查 npm
Write-Host "检查 npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✓ npm 版本: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ 未找到 npm" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  步骤 1: 安装依赖" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

if (Test-Path "node_modules") {
    Write-Host "node_modules 已存在，跳过安装" -ForegroundColor Yellow
} else {
    Write-Host "正在安装依赖..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ 依赖安装失败" -ForegroundColor Red
        exit 1
    }
    Write-Host "✓ 依赖安装成功" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  步骤 2: 代码检查" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "运行 ESLint..." -ForegroundColor Yellow
npm run lint
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠ ESLint 检查发现问题，但继续构建" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  步骤 3: 构建项目" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "正在构建..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ 构建失败" -ForegroundColor Red
    exit 1
}
Write-Host "✓ 构建成功" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  步骤 4: 部署到 Vercel" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 检查 Vercel CLI
Write-Host "检查 Vercel CLI..." -ForegroundColor Yellow
try {
    $vercelVersion = vercel --version
    Write-Host "✓ Vercel CLI 版本: $vercelVersion" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "开始部署..." -ForegroundColor Yellow
    vercel --prod
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "  🎉 部署成功！" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
    } else {
        Write-Host "✗ 部署失败" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "✗ 未找到 Vercel CLI" -ForegroundColor Red
    Write-Host ""
    Write-Host "请先安装 Vercel CLI:" -ForegroundColor Yellow
    Write-Host "  npm install -g vercel" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "或者通过 GitHub 部署:" -ForegroundColor Yellow
    Write-Host "  1. 推送代码到 GitHub" -ForegroundColor Cyan
    Write-Host "  2. 在 Vercel 网站导入项目" -ForegroundColor Cyan
    exit 1
}

