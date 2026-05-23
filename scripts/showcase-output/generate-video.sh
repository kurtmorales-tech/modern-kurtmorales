#!/bin/bash
set -e

SCREENSHOTS="screenshots"
OUTPUT="kurtmorales-showcase.mp4"
TEMP="temp-clips"
DUR=8
FPS=24

rm -rf "$TEMP" "$OUTPUT"
mkdir -p "$TEMP"

PAGES=(
  "index-viewport.png|Home — Hero & Services|1|DOM 122ms|Heap 6.4MB|Nodes 1150|Scripts 160ms"
  "products-viewport.png|Products — Marketplace Picks|2|DOM 94ms|Heap 5.3MB|Nodes 846|Scripts 120ms"
  "templates-viewport.png|Templates — Website Templates|3|DOM 95ms|Heap 5.5MB|Nodes 412|Scripts 110ms"
  "projects-viewport.png|Projects — Portfolio|4|DOM 91ms|Heap 5.5MB|Nodes 419|Scripts 110ms"
  "resources-viewport.png|Resources — Docs & SEO|5|DOM 94ms|Heap 5.3MB|Nodes 396|Scripts 110ms"
  "contact-viewport.png|Contact — Get in Touch|6|DOM 99ms|Heap 5.1MB|Nodes 421|Scripts 100ms"
  "about-viewport.png|About|7|DOM 101ms|Heap 5.3MB|Nodes 414|Scripts 110ms"
  "blog-viewport.png|Blog|8|DOM 94ms|Heap 5.7MB|Nodes 863|Scripts 150ms"
)

TOTAL=${#PAGES[@]}

for i in "${!PAGES[@]}"; do
  IFS='|' read -r img label num m1 m2 m3 m4 <<< "${PAGES[$i]}"
  echo "Rendering clip $((i+1))/$TOTAL: $label"

  ffmpeg -y -loop 1 -i "$SCREENSHOTS/$img" \
    -vf "scale=1440:900:force_original_aspect_ratio=decrease,pad=1440:900:(ow-iw)/2:(oh-ih)/2,fps=$FPS,format=yuv420p,
      drawtext=text='KurtMorales Website Showcase':
        fontsize=20:fontcolor=white:box=1:boxcolor=black@0.6:boxborderw=6:
        x=40:y=40:enable='between(t,0,1)',
      drawtext=text='$label':
        fontsize=26:fontcolor=white:box=1:boxcolor=black@0.55:boxborderw=8:
        x=40:y=h-65:enable='gte(t,1)',
      drawtext=text='Page $num / $TOTAL':
        fontsize=18:fontcolor=white:box=1:boxcolor=black@0.5:boxborderw=6:
        x=w-140:y=40:enable='gte(t,1)',
      drawtext=text='CDP Metrics (Chrome DevTools Protocol)':
        fontsize=14:fontcolor=a0a0a0:box=1:boxcolor=black@0.5:boxborderw=6:
        x=40:y=90:enable='gte(t,1)',
      drawtext=text='$m1 | $m2 | $m3 | $m4':
        fontsize=15:fontcolor=7fdbff:box=1:boxcolor=black@0.5:boxborderw=6:
        x=40:y=115:enable='gte(t,1)'" \
    -c:v libx264 -t $DUR -pix_fmt yuv420p -preset ultrafast -crf 28 \
    "$TEMP/clip_$(printf '%02d' $i).mp4" 2>/dev/null
done

echo "Concatenating clips with crossfade..."
ffmpeg -y \
  -i "$TEMP/clip_00.mp4" \
  -i "$TEMP/clip_01.mp4" \
  -i "$TEMP/clip_02.mp4" \
  -i "$TEMP/clip_03.mp4" \
  -i "$TEMP/clip_04.mp4" \
  -i "$TEMP/clip_05.mp4" \
  -i "$TEMP/clip_06.mp4" \
  -i "$TEMP/clip_07.mp4" \
  -filter_complex "\
    [0:v]setpts=PTS-STARTPTS[v0];\
    [1:v]setpts=PTS-STARTPTS[v1];\
    [2:v]setpts=PTS-STARTPTS[v2];\
    [3:v]setpts=PTS-STARTPTS[v3];\
    [4:v]setpts=PTS-STARTPTS[v4];\
    [5:v]setpts=PTS-STARTPTS[v5];\
    [6:v]setpts=PTS-STARTPTS[v6];\
    [7:v]setpts=PTS-STARTPTS[v7];\
    [v0][v1]xfade=transition=fade:duration=1:offset=$((DUR-1))[f01];\
    [f01][v2]xfade=transition=fade:duration=1:offset=$((DUR*2-2))[f02];\
    [f02][v3]xfade=transition=fade:duration=1:offset=$((DUR*3-3))[f03];\
    [f03][v4]xfade=transition=fade:duration=1:offset=$((DUR*4-4))[f04];\
    [f04][v5]xfade=transition=fade:duration=1:offset=$((DUR*5-5))[f05];\
    [f05][v6]xfade=transition=fade:duration=1:offset=$((DUR*6-6))[f06];\
    [f06][v7]xfade=transition=fade:duration=1:offset=$((DUR*7-7))[f07]\
  " -map "[f07]" -c:v libx264 -preset medium -crf 23 \
  "$OUTPUT" 2>&1 | tail -3

echo "Done! Output: $OUTPUT"
