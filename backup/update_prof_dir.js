import fs from 'fs';

let content = fs.readFileSync('src/components/Competitor.tsx', 'utf8');

const regex = /\{\/\* Head \*\/\}([\s\S]*?)<\/div>\n    \);\n  \}\n\n  \/\/ RENDERING TOOLS/;

const matched = content.match(regex);
if (matched) {
    const wrapped = `<div className="absolute inset-0" style={{ transform: "scaleX(-1)" }}>\n        {/* Head */}` + matched[1] + `      </div>\n    </div>\n    );\n  }\n\n  // RENDERING TOOLS`;
    content = content.replace(regex, wrapped);
    fs.writeFileSync('src/components/Competitor.tsx', content);
    console.log("Updated!");
} else {
    console.log("No match");
}
