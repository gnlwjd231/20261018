#!/bin/bash
set -e

SRC_DIR="src/assets/images"

for dir in light dark; do
  mkdir -p "$SRC_DIR/$dir/opt" "$SRC_DIR/$dir/thumb"
done

total=$(find "$SRC_DIR" -maxdepth 2 -name '*.jpg' | wc -l | tr -d ' ')
count=0

for img in "$SRC_DIR"/light/*.jpg "$SRC_DIR"/dark/*.jpg; do
  [ -f "$img" ] || continue
  base=$(basename "$img" .jpg)
  dir=$(dirname "$img")
  name=$(basename "$dir")

  opt="$dir/opt/$base.webp"
  thumb="$dir/thumb/$base.webp"

  count=$((count + 1))
  orig_size=$(stat -f%z "$img")
  orig_kb=$((orig_size / 1024))

  echo "[$count/$total] $name/$base.jpg (${orig_kb}KB)"

  cwebp -resize 1200 0 -q 80 "$img" -o "$opt" 2>/dev/null
  opt_size=$(stat -f%z "$opt")
  opt_kb=$((opt_size / 1024))

  cwebp -resize 160 0 -q 70 "$img" -o "$thumb" 2>/dev/null
  thumb_size=$(stat -f%z "$thumb")
  thumb_kb=$((thumb_size / 1024))

  echo "  → opt: ${opt_kb}KB, thumb: ${thumb_kb}KB (was ${orig_kb}KB)"
done

echo ""
echo "=== Done ==="

total_orig=0
total_opt=0
total_thumb=0
for dir in light dark; do
  for f in "$SRC_DIR/$dir"/*.jpg; do
    [ -f "$f" ] && total_orig=$((total_orig + $(stat -f%z "$f")))
  done
  for f in "$SRC_DIR/$dir/opt"/*.webp; do
    [ -f "$f" ] && total_opt=$((total_opt + $(stat -f%z "$f")))
  done
  for f in "$SRC_DIR/$dir/thumb"/*.webp; do
    [ -f "$f" ] && total_thumb=$((total_thumb + $(stat -f%z "$f")))
  done
done

echo "Original: $((total_orig / 1024))KB"
echo "Optimized: $((total_opt / 1024))KB ($((100 - total_opt * 100 / total_orig))% reduction)"
echo "Thumbnails: $((total_thumb / 1024))KB"
echo "Combined opt: $(((total_opt + total_thumb) / 1024))KB"
