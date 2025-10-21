#!/bin/bash

# Function to fix a markdown file
fix_markdown_file() {
    local file="$1"
    local temp_file="${file}.tmp"
    
    # Read the file and apply fixes
    awk '
    BEGIN {
        prev_blank = 1
        in_code_block = 0
    }
    {
        line = $0
        
        # Track code blocks
        if (line ~ /^```/) {
            if (!in_code_block) {
                # Starting code block - ensure blank line before
                if (!prev_blank && NR > 1) {
                    print ""
                }
                # Add language to code blocks without one
                if (line == "```") {
                    print "```typescript"
                } else {
                    print line
                }
                in_code_block = 1
            } else {
                # Ending code block
                print line
                in_code_block = 0
                # Add blank line after
                print ""
                prev_blank = 1
                next
            }
        } else if (line ~ /^#{1,6} /) {
            # Heading - ensure blank lines around it
            if (!prev_blank && NR > 1) {
                print ""
            }
            # Remove trailing colons from headings
            gsub(/:$/, "", line)
            print line
            print ""
            prev_blank = 1
            next
        } else if (line ~ /^- / || line ~ /^[0-9]+\. / || line ~ /^\* /) {
            # List item - ensure blank line before first item
            if (!prev_blank && NR > 1 && prev_line !~ /^- / && prev_line !~ /^[0-9]+\. / && prev_line !~ /^\* /) {
                print ""
            }
            print line
        } else if (line == "") {
            # Blank line - avoid multiple consecutive blanks
            if (!prev_blank) {
                print line
                prev_blank = 1
            }
            next
        } else {
            # Regular line
            # Add blank line after list ends
            if (prev_line ~ /^- / || prev_line ~ /^[0-9]+\. / || prev_line ~ /^\* /) {
                if (line !~ /^- / && line !~ /^[0-9]+\. / && line !~ /^\* / && line !~ /^  /) {
                    print ""
                }
            }
            print line
        }
        
        prev_blank = (line == "")
        prev_line = line
    }
    ' "$file" > "$temp_file"
    
    # Replace original file
    mv "$temp_file" "$file"
    echo "Fixed: $file"
}

# Fix all markdown files
fix_markdown_file "PROFILE_REFACTOR_COMPLETE.md"
fix_markdown_file "SETTINGS_REFACTOR_COMPLETE.md"
fix_markdown_file "REPORTS_REFACTOR_COMPLETE.md"
fix_markdown_file "PIPELINE_REFACTOR_COMPLETE.md"
fix_markdown_file "NOTIFICATIONS_REFACTOR_COMPLETE.md"
fix_markdown_file "ACTIVITIES_REFACTOR_COMPLETE.md"

echo "All markdown files fixed!"
