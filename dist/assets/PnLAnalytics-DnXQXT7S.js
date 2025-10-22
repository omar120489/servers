import{importShared as K}from"./__federation_fn_import-CJIdJiQv.js";import{j as e}from"./useForkRef-BC7kqYKT.js";import{A as xe}from"./AppPage-CfPA9hni.js";import{a as ue}from"./axios-CKLPSsiI.js";import{I as me,a as pe}from"./IconFileTypePdf-PbC_fMS_.js";import{c as m}from"./createReactComponent-RpECKCBP.js";/**
 * @license @tabler/icons-react v3.35.0 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */const ge=[["path",{d:"M7 15h-3a1 1 0 0 1 -1 -1v-8a1 1 0 0 1 1 -1h12a1 1 0 0 1 1 1v3",key:"svg-0"}],["path",{d:"M7 9m0 1a1 1 0 0 1 1 -1h12a1 1 0 0 1 1 1v8a1 1 0 0 1 -1 1h-12a1 1 0 0 1 -1 -1z",key:"svg-1"}],["path",{d:"M12 14a2 2 0 1 0 4 0a2 2 0 0 0 -4 0",key:"svg-2"}]],je=m("outline","cash","Cash",ge);/**
 * @license @tabler/icons-react v3.35.0 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */const ve=[["path",{d:"M14 3v4a1 1 0 0 0 1 1h4",key:"svg-0"}],["path",{d:"M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4",key:"svg-1"}],["path",{d:"M7 16.5a1.5 1.5 0 0 0 -3 0v3a1.5 1.5 0 0 0 3 0",key:"svg-2"}],["path",{d:"M10 20.25c0 .414 .336 .75 .75 .75h1.25a1 1 0 0 0 1 -1v-1a1 1 0 0 0 -1 -1h-1a1 1 0 0 1 -1 -1v-1a1 1 0 0 1 1 -1h1.25a.75 .75 0 0 1 .75 .75",key:"svg-3"}],["path",{d:"M16 15l2 6l2 -6",key:"svg-4"}]],ye=m("outline","file-type-csv","FileTypeCsv",ve);/**
 * @license @tabler/icons-react v3.35.0 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */const fe=[["path",{d:"M14 3v4a1 1 0 0 0 1 1h4",key:"svg-0"}],["path",{d:"M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4",key:"svg-1"}],["path",{d:"M4 15l4 6",key:"svg-2"}],["path",{d:"M4 21l4 -6",key:"svg-3"}],["path",{d:"M17 20.25c0 .414 .336 .75 .75 .75h1.25a1 1 0 0 0 1 -1v-1a1 1 0 0 0 -1 -1h-1a1 1 0 0 1 -1 -1v-1a1 1 0 0 1 1 -1h1.25a.75 .75 0 0 1 .75 .75",key:"svg-4"}],["path",{d:"M11 15v6h3",key:"svg-5"}]],be=m("outline","file-type-xls","FileTypeXls",fe);/**
 * @license @tabler/icons-react v3.35.0 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */const _e=[["path",{d:"M5 21v-16a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v16l-3 -2l-2 2l-2 -2l-2 2l-2 -2l-3 2m4 -14h6m-6 4h6m-2 4h2",key:"svg-0"}]],Ce=m("outline","receipt","Receipt",_e);/**
 * @license @tabler/icons-react v3.35.0 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ae=[["path",{d:"M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4",key:"svg-0"}],["path",{d:"M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4",key:"svg-1"}]],Me=m("outline","refresh","Refresh",Ae);/**
 * @license @tabler/icons-react v3.35.0 - MIT
 *
 * This source code is licensed under the MIT license.
 * See the LICENSE file in the root directory of this source tree.
 */const ke=[["path",{d:"M3 17l6 -6l4 4l8 -8",key:"svg-0"}],["path",{d:"M14 7l7 0l0 7",key:"svg-1"}]],Te=m("outline","trending-up","TrendingUp",ke),$e="/api/v1/pnl";async function Ie(s){return ue($e,{params:s})}const{useCallback:Re,useEffect:Se,useState:c}=await K("react"),{Box:x,Button:j,Card:$,CardContent:I,FormControl:R,Grid:o,InputLabel:S,MenuItem:u,Paper:q,Select:F,Stack:v,Table:Fe,TableBody:De,TableCell:r,TableContainer:Le,TableHead:Pe,TableRow:Y,TextField:J,Typography:d,Menu:Ee,MenuItem:D,ListItemIcon:L,ListItemText:P}=await K("@mui/material");function h(s){return new Intl.NumberFormat(void 0,{style:"currency",currency:"USD",maximumFractionDigits:0}).format(s)}function E(s,y=2){return s.toFixed(y)}function Ge(){const[s,y]=c(null),[f,U]=c(!0),[Q,z]=c(null),[b,w]=c({}),[_,N]=c(""),[C,O]=c(""),[A,B]=c(""),[M,G]=c(""),[k,W]=c(""),[X,H]=c(null),Z=!!X,T=Re(async t=>{U(!0),z(null);try{const l=await Ie(t);y(l)}catch(l){z(l),console.error("[PnLAnalytics] Failed to load P&L data:",l)}finally{U(!1)}},[]);Se(()=>{T(b)},[T,b]);const ee=()=>{const t={};_&&(t.utm_source=_),C&&(t.utm_campaign=C),A&&(t.ad_id=A),M&&(t.date_from=M),k&&(t.date_to=k),w(t)},te=()=>{N(""),O(""),B(""),G(""),W(""),w({})},V=()=>{T(b)},se=t=>{H(t.currentTarget)},p=()=>{H(null)},ne=()=>{if(!s||s.rows.length===0)return;const t=["UTM Source","UTM Campaign","Ad ID","Leads","Deals","Gross Revenue","Direct Cost","Net Profit","ROAS","CPA"],l=s.rows.map(i=>[i.utm_source||"",i.utm_campaign||"",i.ad_id||"",i.leads_count,i.deals_count,i.gross_revenue,i.direct_cost,i.net_profit,i.roas.toFixed(2),i.cpa.toFixed(2)]),n=[t.join(","),...l.map(i=>i.join(","))].join(`
`),g=new Blob([n],{type:"text/csv;charset=utf-8;"}),a=document.createElement("a"),he=URL.createObjectURL(g);a.setAttribute("href",he),a.setAttribute("download",`pnl-analytics-${new Date().toISOString().split("T")[0]}.csv`),a.style.visibility="hidden",document.body.appendChild(a),a.click(),a.remove(),p()},re=()=>{if(!s||s.rows.length===0)return;const t=`
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <style>
          table { border-collapse: collapse; width: 100%; }
          th { background-color: #4472C4; color: white; font-weight: bold; padding: 10px; border: 1px solid #ddd; }
          td { padding: 8px; border: 1px solid #ddd; }
          .number { mso-number-format: "\\#\\,\\#\\#0\\.00"; text-align: right; }
          .currency { mso-number-format: "\\$\\#\\,\\#\\#0\\.00"; text-align: right; }
        </style>
      </head>
      <body>
        <h2>P&L Analytics Report</h2>
        <p>Generated: ${new Date().toLocaleString()}</p>
        <table>
          <thead><tr><th>UTM Source</th><th>UTM Campaign</th><th>Ad ID</th><th>Leads</th><th>Deals</th><th>Gross Revenue</th><th>Direct Cost</th><th>Net Profit</th><th>ROAS</th><th>CPA</th></tr></thead>
          <tbody>
            ${s.rows.map(a=>`
              <tr>
                <td>${a.utm_source||"—"}</td><td>${a.utm_campaign||"—"}</td><td>${a.ad_id||"—"}</td>
                <td class="number">${a.leads_count}</td><td class="number">${a.deals_count}</td>
                <td class="currency">${a.gross_revenue}</td><td class="currency">${a.direct_cost}</td>
                <td class="currency">${a.net_profit}</td>
                <td class="number">${a.roas.toFixed(2)}</td><td class="currency">${a.cpa.toFixed(2)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </body>
      </html>
    `,l=new Blob(["\uFEFF",t],{type:"application/vnd.ms-excel;charset=utf-8"}),n=document.createElement("a"),g=URL.createObjectURL(l);n.setAttribute("href",g),n.setAttribute("download",`pnl-analytics-${new Date().toISOString().split("T")[0]}.xls`),n.style.visibility="hidden",document.body.appendChild(n),n.click(),n.remove(),URL.revokeObjectURL(g),p()},ae=()=>{if(!s||s.rows.length===0)return;const t=window.open("","_blank");if(!t)return;const l=`
      <!DOCTYPE html>
      <html>
        <head>
          <title>P&L Analytics Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: #f5f5f5; font-weight: bold; }
            .positive { color: green; }
            .negative { color: red; }
          </style>
        </head>
        <body>
          <h1>P&L Analytics Report</h1>
          <p>Generated: ${new Date().toLocaleString()}</p>
          <table>
            <thead><tr><th>UTM Source</th><th>UTM Campaign</th><th>Ad ID</th><th>Leads</th><th>Deals</th><th>Gross Revenue</th><th>Direct Cost</th><th>Net Profit</th><th>ROAS</th><th>CPA</th></tr></thead>
            <tbody>
              ${s.rows.map(n=>`
                <tr>
                  <td>${n.utm_source||"—"}</td><td>${n.utm_campaign||"—"}</td><td>${n.ad_id||"—"}</td>
                  <td>${n.leads_count}</td><td>${n.deals_count}</td>
                  <td>${h(n.gross_revenue)}</td><td>${h(n.direct_cost)}</td>
                  <td class="${n.net_profit>=0?"positive":"negative"}"><strong>${h(n.net_profit)}</strong></td>
                  <td>${E(n.roas,2)}x</td><td>${h(n.cpa)}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </body>
      </html>
    `;t.document.write(l),t.document.close(),t.onload=()=>{t.print(),t.close()},p()},le=s?.rows?Array.from(new Set(s.rows.map(t=>t.utm_source).filter(Boolean))):[],ie=s?.rows?Array.from(new Set(s.rows.map(t=>t.utm_campaign).filter(Boolean))):[],oe=s?.rows?Array.from(new Set(s.rows.map(t=>t.ad_id).filter(Boolean))):[],ce=e.jsxs(e.Fragment,{children:[e.jsx(j,{variant:"outlined",startIcon:e.jsx(me,{}),onClick:se,disabled:f||!s||s.rows.length===0,size:"small",children:"Export"}),e.jsxs(Ee,{anchorEl:X,open:Z,onClose:p,children:[e.jsxs(D,{onClick:ne,children:[e.jsx(L,{children:e.jsx(ye,{size:20})}),e.jsx(P,{children:"Export as CSV"})]}),e.jsxs(D,{onClick:re,children:[e.jsx(L,{children:e.jsx(be,{size:20})}),e.jsx(P,{children:"Export as Excel"})]}),e.jsxs(D,{onClick:ae,children:[e.jsx(L,{children:e.jsx(pe,{size:20})}),e.jsx(P,{children:"Export as PDF"})]})]}),e.jsx(j,{variant:"outlined",startIcon:e.jsx(Me,{}),onClick:V,disabled:f,size:"small",children:"Refresh"})]}),de=e.jsxs(q,{sx:{p:2},children:[e.jsx(d,{variant:"h6",sx:{mb:2},children:"Filters"}),e.jsxs(o,{container:!0,spacing:2,children:[e.jsx(o,{item:!0,xs:12,md:2.4,children:e.jsx(J,{fullWidth:!0,size:"small",label:"Date From",type:"date",value:M,onChange:t=>G(t.target.value),InputLabelProps:{shrink:!0}})}),e.jsx(o,{item:!0,xs:12,md:2.4,children:e.jsx(J,{fullWidth:!0,size:"small",label:"Date To",type:"date",value:k,onChange:t=>W(t.target.value),InputLabelProps:{shrink:!0}})}),e.jsx(o,{item:!0,xs:12,md:2.4,children:e.jsxs(R,{fullWidth:!0,size:"small",children:[e.jsx(S,{children:"UTM Source"}),e.jsxs(F,{value:_,onChange:t=>N(t.target.value),label:"UTM Source",children:[e.jsx(u,{value:"",children:"All Sources"}),le.map(t=>e.jsx(u,{value:t,children:t},t))]})]})}),e.jsx(o,{item:!0,xs:12,md:2.4,children:e.jsxs(R,{fullWidth:!0,size:"small",children:[e.jsx(S,{children:"UTM Campaign"}),e.jsxs(F,{value:C,onChange:t=>O(t.target.value),label:"UTM Campaign",children:[e.jsx(u,{value:"",children:"All Campaigns"}),ie.map(t=>e.jsx(u,{value:t,children:t},t))]})]})}),e.jsx(o,{item:!0,xs:12,md:2.4,children:e.jsxs(R,{fullWidth:!0,size:"small",children:[e.jsx(S,{children:"Ad ID"}),e.jsxs(F,{value:A,onChange:t=>B(t.target.value),label:"Ad ID",children:[e.jsx(u,{value:"",children:"All Ads"}),oe.map(t=>e.jsx(u,{value:t,children:t},t))]})]})}),e.jsx(o,{item:!0,xs:12,children:e.jsxs(v,{direction:"row",spacing:1,justifyContent:"flex-end",children:[e.jsx(j,{variant:"contained",onClick:ee,size:"small",children:"Apply Filters"}),e.jsx(j,{variant:"outlined",onClick:te,size:"small",children:"Clear All"})]})})]})]});return e.jsx(xe,{title:"P&L Analytics",subtitle:"Profit & Loss analysis by traffic source",actions:ce,toolbar:de,loading:f,error:Q,empty:!s||s.rows.length===0,onRetry:V,children:s&&e.jsxs(e.Fragment,{children:[e.jsxs(o,{container:!0,spacing:3,sx:{mb:3},children:[e.jsx(o,{item:!0,xs:12,md:4,children:e.jsx($,{children:e.jsx(I,{children:e.jsxs(v,{direction:"row",alignItems:"center",spacing:2,children:[e.jsx(x,{sx:{p:1.5,borderRadius:2,bgcolor:"success.light",display:"flex"},children:e.jsx(je,{size:32,color:"green"})}),e.jsxs(x,{sx:{flex:1},children:[e.jsx(d,{variant:"subtitle2",color:"text.secondary",children:"Total Net Profit"}),e.jsx(d,{variant:"h4",sx:{color:"success.main"},children:h(s.summary.total_net_profit)}),e.jsxs(d,{variant:"caption",color:"text.secondary",children:[s.summary.total_deals," deals closed"]})]})]})})})}),e.jsx(o,{item:!0,xs:12,md:4,children:e.jsx($,{children:e.jsx(I,{children:e.jsxs(v,{direction:"row",alignItems:"center",spacing:2,children:[e.jsx(x,{sx:{p:1.5,borderRadius:2,bgcolor:"primary.light",display:"flex"},children:e.jsx(Te,{size:32,color:"blue"})}),e.jsxs(x,{sx:{flex:1},children:[e.jsx(d,{variant:"subtitle2",color:"text.secondary",children:"Average ROAS"}),e.jsxs(d,{variant:"h4",sx:{color:"primary.main"},children:[E(s.summary.average_roas,2),"x"]}),e.jsx(d,{variant:"caption",color:"text.secondary",children:"Return on Ad Spend"})]})]})})})}),e.jsx(o,{item:!0,xs:12,md:4,children:e.jsx($,{children:e.jsx(I,{children:e.jsxs(v,{direction:"row",alignItems:"center",spacing:2,children:[e.jsx(x,{sx:{p:1.5,borderRadius:2,bgcolor:"warning.light",display:"flex"},children:e.jsx(Ce,{size:32,color:"orange"})}),e.jsxs(x,{sx:{flex:1},children:[e.jsx(d,{variant:"subtitle2",color:"text.secondary",children:"Average CPA"}),e.jsx(d,{variant:"h4",sx:{color:"warning.main"},children:h(s.summary.average_cpa)}),e.jsx(d,{variant:"caption",color:"text.secondary",children:"Cost Per Acquisition"})]})]})})})})]}),e.jsx(Le,{component:q,sx:{overflowX:"auto"},children:e.jsxs(Fe,{children:[e.jsx(Pe,{children:e.jsxs(Y,{children:[e.jsx(r,{children:"UTM Source"}),e.jsx(r,{children:"UTM Campaign"}),e.jsx(r,{children:"Ad ID"}),e.jsx(r,{align:"right",children:"Leads"}),e.jsx(r,{align:"right",children:"Deals"}),e.jsx(r,{align:"right",children:"Gross Revenue"}),e.jsx(r,{align:"right",children:"Direct Cost"}),e.jsx(r,{align:"right",children:"Net Profit"}),e.jsx(r,{align:"right",children:"ROAS"}),e.jsx(r,{align:"right",children:"CPA"})]})}),e.jsx(De,{children:s.rows.map((t,l)=>e.jsxs(Y,{hover:!0,children:[e.jsx(r,{children:t.utm_source||"—"}),e.jsx(r,{children:t.utm_campaign||"—"}),e.jsx(r,{children:t.ad_id||"—"}),e.jsx(r,{align:"right",children:t.leads_count}),e.jsx(r,{align:"right",children:t.deals_count}),e.jsx(r,{align:"right",children:h(t.gross_revenue)}),e.jsx(r,{align:"right",children:h(t.direct_cost)}),e.jsx(r,{align:"right",sx:{color:t.net_profit>=0?"success.main":"error.main"},children:e.jsx("strong",{children:h(t.net_profit)})}),e.jsxs(r,{align:"right",children:[E(t.roas,2),"x"]}),e.jsx(r,{align:"right",children:h(t.cpa)})]},`${t.utm_source}-${t.utm_campaign}-${t.ad_id}-${l}`))})]})})]})})}export{Ge as default};
//# sourceMappingURL=PnLAnalytics-DnXQXT7S.js.map
