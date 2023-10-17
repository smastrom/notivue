#!/bin/bash

tar_file=$(find ./ -name "*.tgz" | head -n 1)
temp_dir="./temp_tar_check"

if [ ! -f "$tar_file" ]; then
    echo "Tarball not found!"
    exit 1
fi

# Create temp directory
mkdir -p $temp_dir

declare -a files=(
    "README.md" "package.json" "LICENSE"
    "dist/index.js" "dist/index.d.ts"
    "dist/core/animations.css" "dist/Notifications/notifications.css"
    "nuxt/module.mjs" "nuxt/module.cjs" "nuxt/module.d.ts" "nuxt/module.json"
)

for file in "${files[@]}"; do
    if ! tar tzf "$tar_file" | grep -qE "package/$file$"; then
        echo "File $file not found in tarball."
        exit 1
    fi
done

# Extract index.js for checking
tar xzf "$tar_file" -C $temp_dir package/dist/index.js

# Check if console.log exists in the extracted index.js
if grep "console.log" $temp_dir/package/dist/index.js; then
    echo "Error: console.log found in index.js"
    rm -rf $temp_dir
    exit 1
fi

echo "All tarball checks passed."
rm -rf $temp_dir
