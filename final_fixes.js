const fs = require('fs');
const path = require('path');

const targets = [
  {
    file: 'src/components/Sales/Sales Requisition/SRHeader.js',
    fixes: [
      { from: 'import ApproveButton from "../../approving/SRApproveButton";', to: '// import ApproveButton from "../../approving/SRApproveButton";' },
      { from: 'import { SOfromSRPartial } from "./SOFromSRPartial";', to: '// import { SOfromSRPartial } from "./SOFromSRPartial";' }
    ]
  },
  {
    file: 'src/components/Sales/Sales Requisition/SRHeaderAU.js',
    fixes: [
      { from: 'import ApproveButton from "../../approving/SRApproveButton";', to: '// import ApproveButton from "../../approving/SRApproveButton";' },
      { from: 'import { SOfromSRPartial } from "./SOFromSRPartial";', to: '// import { SOfromSRPartial } from "./SOFromSRPartial";' }
    ]
  },
  {
    file: 'src/components/Sales/Sales Requisition/SRList.js',
    fixes: [
      { from: "import Status from '../../DataFilters/Status';", to: "// import Status from '../../DataFilters/Status';" }
    ]
  }
];

targets.forEach(target => {
  const filePath = path.join(__dirname, target.file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    target.fixes.forEach(fix => {
      content = content.replace(fix.from, fix.to);
    });
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed ${target.file}`);
  }
});
