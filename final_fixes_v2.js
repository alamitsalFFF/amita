const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, 'src');

const fixes = [
  {
    file: 'src/components/transaction/AddDetail.js',
    replaces: [ { from: 'import "./TPR.css";', to: 'import "../purchase/TPR.css";' } ]
  },
  {
    file: 'src/components/transaction/EditDetail.js',
    replaces: [ { from: 'import "./TPR.css";', to: 'import "../purchase/TPR.css";' } ]
  },
  {
    file: 'src/components/Sales/Sales Requisition/SRList.js',
    replaces: [ 
        { from: 'import DocStatusColor from "../../DataFilters/Status";', to: '// import DocStatusColor from "../../DataFilters/Status";' },
        { from: 'import DocStatusColor from "../../purchase/Status";', to: '// import DocStatusColor from "../../purchase/Status";' }
    ]
  },
  {
    file: 'src/components/purchase/Purchase Requisition/PRHeaderAU.js',
    replaces: [ 
        { from: 'import { POfromPRPartial } from "./POFromPRPartial";', to: '// import { POfromPRPartial } from "./POFromPRPartial";' }
    ]
  },
  {
    file: 'src/components/Sales/Sales Requisition/SRHeader.js',
    replaces: [
        { from: '    await SOfromSRPartial(AccDocNo, navigate);', to: '    // await SOfromSRPartial(AccDocNo, navigate);' }
    ]
  }
];

fixes.forEach(fix => {
    const filePath = path.join(__dirname, fix.file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        let changed = false;
        fix.replaces.forEach(r => {
            if (content.includes(r.from)) {
                content = content.replace(r.from, r.to);
                changed = true;
            }
        });
        if (changed) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated ${fix.file}`);
        } else {
            console.log(`No changes needed for ${fix.file}`);
        }
    } else {
        console.log(`File not found: ${fix.file}`);
    }
});

// Also search for any other usage of POfromPRPartial in PRHeaderAU.js and comment it out
const prHeaderPath = path.join(__dirname, 'src/components/purchase/Purchase Requisition/PRHeaderAU.js');
if (fs.existsSync(prHeaderPath)) {
    let content = fs.readFileSync(prHeaderPath, 'utf8');
    const regex = /^\s*await POfromPRPartial\(.*\);/gm;
    if (regex.test(content)) {
        content = content.replace(regex, (match) => `// ${match.trim()}`);
        fs.writeFileSync(prHeaderPath, content, 'utf8');
        console.log('Commented out POfromPRPartial usages in PRHeaderAU.js');
    }
}
