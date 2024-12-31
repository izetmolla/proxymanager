import{R as S,j as e,D as N,a as F,B as d,b as D,c as m,d as k,e as R,A as U,z as u,u as I,t as M,S as P,f as T,g as L,h as A,i as V,F as B,k as E,l as O,m as q,n as z,I as y,o as H,p as K,q as J,r as Q,s as h,v as X,M as Y,w as _,x as G}from"./index-B8FHcfP5.js";import{I as W,a as Z,D as $,b as ee,C as f,c as w,d as se,e as te,f as ae,u as ne,g as re,s as le,h as oe,i as ie,j as ce,k as ue}from"./use-dialog-state-DHFUo1nY.js";const b=[{value:"active",label:"Active",icon:W},{value:"disabled",label:"Disabled",icon:Z}],v=S.createContext(null);function de({children:s,value:t}){return e.jsx(v.Provider,{value:t,children:s})}const me=()=>{const s=S.useContext(v);if(!s)throw new Error("useUsersContext has to be used within <UsersListContextProvider.Provider>");return s};function xe({row:s}){const{setOpen:t,setCurrentRow:a}=me();return e.jsxs(N,{modal:!1,children:[e.jsx(F,{asChild:!0,children:e.jsxs(d,{variant:"ghost",className:"flex h-8 w-8 p-0 data-[state=open]:bg-muted",children:[e.jsx($,{className:"h-4 w-4"}),e.jsx("span",{className:"sr-only",children:"Open menu"})]})}),e.jsxs(D,{align:"end",className:"w-[160px]",children:[e.jsx(m,{onClick:()=>{a(s.original),t("update")},children:"Edit"}),e.jsx(m,{disabled:!0,children:"Make a copy"}),e.jsx(m,{disabled:!0,children:"Favorite"}),e.jsx(k,{}),e.jsxs(m,{onClick:()=>{a(s.original),t("delete")},children:["Delete",e.jsx(R,{children:e.jsx(ee,{size:16})})]})]})]})}const he=[{id:"select",header:({table:s})=>e.jsx(f,{checked:s.getIsAllPageRowsSelected()||s.getIsSomePageRowsSelected()&&"indeterminate",onCheckedChange:t=>s.toggleAllPageRowsSelected(!!t),"aria-label":"Select all",className:"translate-y-[2px]"}),cell:({row:s})=>e.jsx(f,{checked:s.getIsSelected(),onCheckedChange:t=>s.toggleSelected(!!t),"aria-label":"Select row",className:"translate-y-[2px]"}),enableSorting:!1,enableHiding:!1},{accessorKey:"name",header:({column:s})=>e.jsx(w,{column:s,title:"Name"}),cell:({row:s})=>e.jsx("div",{className:"flex space-x-2",children:e.jsx("span",{className:"max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]",children:s.getValue("name")})})},{accessorKey:"status",header:({column:s})=>e.jsx(w,{column:s,title:"Status"}),cell:({row:s})=>{const t=b.find(a=>a.value===s.getValue("status"));return t?e.jsxs("div",{className:"flex w-[100px] items-center",children:[t.icon&&e.jsx(t.icon,{className:"mr-2 h-4 w-4 text-muted-foreground"}),e.jsx("span",{children:t.label})]}):null},filterFn:(s,t,a)=>a.includes(s.getValue(t))},{id:"actions",cell:({row:s})=>e.jsx(xe,{row:s})}];async function ge(s){return U.fetchData({url:"/users/getdata",method:"get",params:s})}const pe=u.object({name:u.string().min(1,"Name is required."),status:u.string().min(1,"Please select a status."),label:u.string().min(1,"Please select a label."),priority:u.string().min(1,"Please choose a priority.")});function je({open:s,onOpenChange:t,currentRow:a}){const o=!!a,n=I({resolver:M(pe),defaultValues:a??{name:""}}),c=i=>{t(!1),n.reset(),Q({title:"You submitted the following values:",description:e.jsx("pre",{className:"mt-2 w-[340px] rounded-md bg-slate-950 p-4",children:e.jsx("code",{className:"text-white",children:JSON.stringify(i,null,2)})})})};return e.jsx(P,{open:s,onOpenChange:i=>{t(i),n.reset()},children:e.jsxs(T,{className:"flex flex-col",children:[e.jsxs(L,{className:"text-left",children:[e.jsxs(A,{children:[o?"Update":"Create"," User"]}),e.jsxs(V,{children:[o?"Update the user by providing necessary info.":"Add a new user by providing necessary info.","Click save when you're done."]})]}),e.jsx(B,{...n,children:e.jsx("form",{id:"users-form",onSubmit:n.handleSubmit(c),className:"space-y-5 flex-1",children:e.jsx(E,{control:n.control,name:"name",render:({field:i})=>e.jsxs(O,{className:"space-y-1",children:[e.jsx(q,{children:"Name"}),e.jsx(z,{children:e.jsx(y,{...i,placeholder:"Enter a Name"})}),e.jsx(H,{})]})})})}),e.jsxs(K,{className:"gap-2",children:[e.jsx(J,{asChild:!0,children:e.jsx(d,{variant:"outline",children:"Close"})}),e.jsx(d,{form:"users-form",type:"submit",children:"Save changes"})]})]})})}function Ce({table:s}){var a;const t=s.getState().columnFilters.length>0;return e.jsxs("div",{className:"flex items-center justify-between py-2",children:[e.jsxs("div",{className:"flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2",children:[e.jsx(y,{placeholder:"Filter users...",value:((a=s.getColumn("name"))==null?void 0:a.getFilterValue())??"",onChange:o=>{var n;return(n=s.getColumn("name"))==null?void 0:n.setFilterValue(o.target.value)},className:"h-8 w-[150px] lg:w-[250px]"}),e.jsx("div",{className:"flex gap-x-2",children:s.getColumn("status")&&e.jsx(se,{column:s.getColumn("status"),title:"Status",options:b})}),t&&e.jsxs(d,{variant:"ghost",onClick:()=>s.resetColumnFilters(),className:"h-8 px-2 lg:px-3",children:["Reset",e.jsx(te,{className:"ml-2 h-4 w-4"})]})]}),e.jsx(ae,{table:s})]})}const fe=({id:s})=>{const[t,a]=h.useState(null),[o,n]=ne(null),[c,i]=h.useState([]),{filters:x,pagination:g,setFilters:p}=re(s),j=le(x.sortBy),{data:r}=X({queryKey:["usersList",x],queryFn:()=>ge(x).then(l=>l.data),placeholderData:_}),C=oe({columns:he,state:{pagination:g,sorting:j,columnFilters:c},data:(r==null?void 0:r.data)??[],manualFiltering:!0,manualSorting:!0,manualPagination:!0,onColumnFiltersChange:i,getCoreRowModel:ie(),onPaginationChange:l=>{p(typeof l=="function"?l(g):l)},onSortingChange:l=>{p({sortBy:ce(typeof l=="function"?l(j):l)})},pageCount:(r==null?void 0:r.pageCount)??-1,rowCount:r==null?void 0:r.rowCount});return h.useEffect(()=>{console.log(c)},[c]),e.jsxs(de,{value:{open:o,setOpen:n,currentRow:t,setCurrentRow:a},children:[e.jsxs(Y,{title:"Users List",description:"Manage your users here",rightComponent:e.jsx("div",{className:"flex gap-2",children:e.jsx(d,{onClick:()=>n("create"),className:"btn btn-primary",children:"Create User"})}),children:[e.jsx(Ce,{table:C}),e.jsx(ue,{table:C})]}),e.jsx(je,{open:o==="create",onOpenChange:()=>n("create")},"user-create")]})},ye=G("/_authenticated/users/")({component:fe});export{ye as Route};