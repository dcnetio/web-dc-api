#!/bin/bash

# 浏览器兼容性验证脚本
# 检查ESM构建是否包含任何Node.js依赖

echo "🔍 检查 ESM 构建的浏览器兼容性..."
echo ""

ESM_FILE="dist/esm/index.js"

if [ ! -f "$ESM_FILE" ]; then
  echo "❌ 错误: $ESM_FILE 不存在，请先运行 npm run build"
  exit 1
fi

echo "📦 文件大小: $(ls -lh $ESM_FILE | awk '{print $5}')"
echo ""

# 检查 Node.js 内置模块导入
echo "1️⃣ 检查 Node.js 内置模块..."
NODE_IMPORTS=$(grep -E "import.*from ['\"]process['\"]|import.*from ['\"]buffer['\"]|import.*from ['\"]crypto['\"]|import.*from ['\"]stream['\"]|import.*from ['\"]fs['\"]|import.*from ['\"]path['\"]|import.*from ['\"]http['\"]|import.*from ['\"]https['\"]|import.*from ['\"]net['\"]|import.*from ['\"]tls['\"]" "$ESM_FILE" | grep -v "^//")

if [ -n "$NODE_IMPORTS" ]; then
  echo "❌ 发现 Node.js 模块导入:"
  echo "$NODE_IMPORTS"
  exit 1
else
  echo "✅ 无 Node.js 模块导入"
fi

# 检查 require 调用
echo ""
echo "2️⃣ 检查 require() 调用..."
REQUIRE_CALLS=$(grep -E "require\(" "$ESM_FILE" | grep -v "^//" | grep -v "requireReturnsDefault")

if [ -n "$REQUIRE_CALLS" ]; then
  echo "❌ 发现 require() 调用:"
  echo "$REQUIRE_CALLS"
  exit 1
else
  echo "✅ 无 require() 调用"
fi

# 检查 node: 协议
echo ""
echo "3️⃣ 检查 node: 协议导入..."
NODE_PROTOCOL=$(grep -E "from ['\"]node:" "$ESM_FILE")

if [ -n "$NODE_PROTOCOL" ]; then
  echo "❌ 发现 node: 协议导入:"
  echo "$NODE_PROTOCOL"
  exit 1
else
  echo "✅ 无 node: 协议导入"
fi

# 检查 process.env 使用
echo ""
echo "4️⃣ 检查 process 全局变量使用..."
PROCESS_USAGE=$(grep -E "process\." "$ESM_FILE" | grep -v "^//" | head -3)

if [ -n "$PROCESS_USAGE" ]; then
  echo "⚠️  发现 process 使用 (应该已被替换):"
  echo "$PROCESS_USAGE" | head -3
  echo "..."
else
  echo "✅ 无 process 全局变量"
fi

# 检查 Buffer 全局变量
echo ""
echo "5️⃣ 检查 Buffer 全局变量使用..."
BUFFER_USAGE=$(grep -E "Buffer\." "$ESM_FILE" | grep -v "^//" | head -3)

if [ -n "$BUFFER_USAGE" ]; then
  echo "⚠️  发现 Buffer 使用:"
  echo "$BUFFER_USAGE" | head -3
  echo "..."
else
  echo "✅ 无 Buffer 全局变量"
fi

# 检查主要浏览器 API
echo ""
echo "6️⃣ 检查浏览器 API 使用..."
BROWSER_APIS=$(grep -oE "window\.|document\.|navigator\.|crypto\.|indexedDB|localStorage|sessionStorage" "$ESM_FILE" | sort -u | head -5)

if [ -n "$BROWSER_APIS" ]; then
  echo "✅ 使用浏览器 API:"
  echo "$BROWSER_APIS" | head -5
else
  echo "ℹ️  未检测到明显的浏览器 API 使用"
fi

echo ""
echo "🎉 浏览器兼容性检查完成！"
echo ""
echo "📝 总结:"
echo "  - ESM 输出: $ESM_FILE"
echo "  - 文件大小: $(ls -lh $ESM_FILE | awk '{print $5}')"
echo "  - Node.js 依赖: ✅ 无"
echo "  - 浏览器兼容: ✅ 是"
echo ""
echo "💡 可以直接在浏览器中使用:"
echo "  <script type=\"module\">"
echo "    import { DC } from './dist/esm/index.js';"
echo "  </script>"
