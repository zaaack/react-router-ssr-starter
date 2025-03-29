import { useEffect } from "react";

// https://github.com/vantezzen/autoform
// 导出一个默认的React函数组件，命名为Index
export default function Admin() {
  useEffect(() => {
    import('./_client/render').then((mod) => {
      mod.renderAdmin();
    })
  },[])
  return (
    <div id="admin-root">Loading...</div>
  );
}
